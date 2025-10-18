// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt'); // ✅ 수정: 비밀번호 비교용

const {auth} = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Express 내장 body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ MongoDB 연결 (Mongoose 6+ 콜백 제거)
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://jsm:jsm@cluster0.tbctucr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

(async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

// ✅ 헬스체크
app.get('/', (_req, res) => {
  res.send('Hello World~!');
});



// ✅ 회원가입 (async/await 버전)
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save(); // ✅ 수정: 콜백 X, 프로미스 기반
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);

    // 이메일 unique 충돌(중복) 처리
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    return res.status(500).json({
      success: false,
      err: err.message || err,
    });
  }
});

// ✅ 로그인 (async/await으로 전환)
app.post('/login', async (req, res) => {
  try {
    // 1️⃣ 이메일 존재 여부 확인
    const user = await User.findOne({ email: req.body.email }); // ✅ 수정
    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 2️⃣ 비밀번호 일치 확인 (bcrypt 사용)
    const isMatch = await bcrypt.compare(req.body.password, user.password); // ✅ 수정
    if (!isMatch) {
      return res.status(401).json({
        loginSuccess: false,
        message: '비밀번호가 틀렸습니다.',
      });
    }

    // 3️⃣ JWT 토큰 생성 (예시: 모델 메서드 대신 직접 구현)
    const jwt = require('jsonwebtoken'); // ✅ 수정: jwt 추가
    const token = jwt.sign({ userId: user._id }, 'secretToken', { expiresIn: '1h' }); // ✅ 수정
    user.token = token;
    await user.save(); // ✅ DB에 토큰 저장

    // 4️⃣ 쿠키에 토큰 저장 후 응답
    res
      .cookie('x_auth', token)
      .status(200)
      .json({ loginSuccess: true, userId: user._id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      loginSuccess: false,
      error: err.message,
    });
  }
});

app.get('/api/users/auth', auth ,(req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authen이 True임
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email:req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
