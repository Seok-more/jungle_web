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
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (Password !== ConfirmPassword) {
      return setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    const body = {
      name: Name,
      email: Email,
      password: Password,
    };

    dispatch(registerUser(body))
      .then(response => {
        // 성공 응답(2xx)인 경우 response.payload에 서버 응답 데이터가 들어옵니다
        if (response.payload && response.payload.success) {
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        } else {
          // 서버가 2xx로 주었지만 success:false인 경우(드물게)
          setErrorMessage(response.payload?.message || '회원가입 실패');
        }
      })
      .catch(err => {
        // 네트워크 오류 혹은 서버가 4xx/5xx을 반환하여 axios가 reject한 경우
        console.error('회원가입 에러:', err);

        // 서버가 보낸 메시지가 있다면 보여주기
        const serverMsg = err?.response?.data?.message || err?.response?.data || err.message;
        setErrorMessage(String(serverMsg) || '회원가입 중 오류가 발생했습니다.');
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

        {errorMessage && (
          <div style={{ marginTop: 12, color: 'red' }}>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default RegisterPage;