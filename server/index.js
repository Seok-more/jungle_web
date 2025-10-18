// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('./models/User');
const config = require('../config/key');

// ⬇️ auth 경로는 실제 파일 위치에 맞추세요.
//   - 루트/middleware/auth.js  → './middleware/auth'
//   - models/middleware/auth.js → './models/middleware/auth'
const { auth } = require('./middleware/auth'); // ✅ 경로 맞는지 확인

const app = express();
const port = process.env.PORT || 5000;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ .env에 있으면 사용, 아니면 기본값
const JWT_SECRET = process.env.JWT_SECRET || 'secretToken';

// ✅ (정리) 선언만 하고 안 쓰던 상수 제거 (MONGO_URI)
// const MONGO_URI = process.env.MONGO_URI || '...';

(async () => {
  try {
    await mongoose.connect(config.mongoURI); // ✅ Mongoose 6+/7+ OK
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

// 헬스체크
app.get('/', (_req, res) => {
  res.send('Hello World~!');
});

// 회원가입
app.post('/api/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save(); // ✅ 콜백 X
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    return res.status(500).json({ success: false, err: err.message || err });
  }
});

// 로그인
app.post('/api/users/login', async (req, res) => {
  try {
    // 1) 이메일로 유저 찾기
    const user = await User.findOne({ email: req.body.email }); // ✅ 콜백 X
    if (!user) {
      return res.status(400).json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 2) 비밀번호 비교
    const isMatch = await bcrypt.compare(req.body.password, user.password); // ✅ 콜백 X
    if (!isMatch) {
      return res.status(401).json({
        loginSuccess: false,
        message: '비밀번호가 틀렸습니다.',
      });
    }

    // 3) JWT 토큰 발급 & 저장 (환경변수 우선)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' }); // ✅ 비밀키 통일
    user.token = token;
    await user.save(); // ✅ 콜백 X

    // 4) 쿠키에 토큰 저장 후 응답
    return res
      .cookie('x_auth', token /* , { httpOnly: true, sameSite: 'lax' } */) // ✅ 옵션은 필요 시 활성화
      .status(200)
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ loginSuccess: false, error: err.message });
  }
});

// 인증 확인
app.get('/api/users/auth', auth, (req, res) => {
  // ✅ 미들웨어 통과 = 인증 성공
  return res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// 로그아웃
app.get('/api/users/logout', auth, async (req, res) => {
  try {
    // ✅ 콜백 → async/await
    await User.findByIdAndUpdate(req.user._id, { token: '' });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, err: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
