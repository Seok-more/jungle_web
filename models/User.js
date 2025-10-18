// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
// 실제 서비스에선 하드코딩 말고 환경변수 사용 권장: process.env.JWT_SECRET
const JWT_SECRET = 'secretToken';

// ✅ 스키마 정의 (오타/옵션 수정)
const userSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: true },     // ✅ unique: true
  password: { type: String, minlength: 5 },
  lastname: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  image: { type: String },                                // ✅ 올바른 정의
  token: { type: String },
  tokenExp: { type: Number },
});

// ✅ 비밀번호 해시 (콜백 → async/await)
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ 비밀번호 비교 (콜백 → Promise/await, 오타 수정: palinPassword → plainPassword)
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// ✅ 토큰 생성/저장 (콜백 → async/await, 버그 수정: useReducer._id → user._id)
userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ userId: this._id }, JWT_SECRET, { expiresIn: '1h' });
  this.token = token;
  await this.save();
  return token;
};

// ✅ 토큰으로 유저 찾기 (콜백 → async/await)
userSchema.statics.findByToken = async function (token) {
  const decoded = jwt.verify(token, JWT_SECRET); // throw 되면 상위에서 catch
  return this.findOne({ _id: decoded.userId, token });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
