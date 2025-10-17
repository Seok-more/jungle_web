// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { User } = require('./models/User'); // ← 기존 User 모델 사용

const app = express();
const port = process.env.PORT || 5000;

// ✅ Express 내장 body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB 연결 (Mongoose 6+ 콜백 제거)
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://jsm:jsm@cluster0.tbctucr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
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

// ✅ 회원가입 (async/await 버전)
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save(); // ⬅ 콜백 X, 프로미스 방식

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
