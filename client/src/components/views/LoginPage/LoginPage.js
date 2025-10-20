import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    const body = {
      name: Name,
      email: Email,
      password: Password,
    };

    dispatch(registerUser(body))
      .then(response => {
        if (response.payload && response.payload.success) {
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        } else {
          alert(response.payload?.message || '회원가입 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('회원가입 중 오류가 발생했습니다.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', width: 360 }} onSubmit={onSubmitHandler}>
        <label>Name</label>
        <input type="text" value={Name} onChange={(e) => setName(e.currentTarget.value)} required />
        <label>Email</label>
        <input type="email" value={Email} onChange={(e) => setEmail(e.currentTarget.value)} required />
        <label>Password</label>
        <input type="password" value={Password} onChange={(e) => setPassword(e.currentTarget.value)} required />
        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={(e) => setConfirmPassword(e.currentTarget.value)} required />
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;