// middleware/auth.js
const jwt = require('jsonwebtoken');

// ⬇️ 구조에 맞게 하나만 사용하세요.
// const { User } = require('../User');          // (models/middleware/auth.js 인 경우)
const { User } = require('../models/User');      // (루트/middleware/auth.js 인 경우)

const JWT_SECRET = process.env.JWT_SECRET || 'secretToken';

const auth = async (req, res, next) => {
  try {
    // 1) 쿠키에서 토큰 추출
    const token = req.cookies?.x_auth;
    if (!token) {
      return res.status(401).json({ isAuth: false, message: '토큰이 없습니다.' });
    }

    // 2) 토큰 검증 및 디코드
    const decoded = jwt.verify(token, JWT_SECRET); // { userId: ... }

    // 3) 토큰과 유저 매칭
    const user = await User.findOne({ _id: decoded.userId, token });
    if (!user) {
      return res.status(401).json({ isAuth: false, message: '유저를 찾을 수 없습니다.' });
    }

    // 4) 요청 객체에 주입 후 다음
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ isAuth: false, message: '인증 실패' });
  }
};

module.exports = { auth };
