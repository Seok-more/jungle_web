import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (event) => setEmail(event.currentTarget.value);
  const onPasswordHandler = (event) => setPassword(event.currentTarget.value);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const body = { email: Email, password: Password };

    dispatch(loginUser(body))
      .then((response) => {
        if (response.payload && response.payload.loginSuccess) {
          navigate('/');
        } else {
          alert(response.payload?.message || '로그인 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('로그인 중 오류가 발생했습니다.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', width: 320 }} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} required />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;