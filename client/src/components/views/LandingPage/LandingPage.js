import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // null = unknown, false = not auth, object = user

  useEffect(() => {
    axios.get('/api/users/auth')
      .then(response => {
        if (response.data && response.data.isAuth) {
          setUser(response.data);
        } else {
          setUser(false);
        }
      })
      .catch(() => setUser(false));
  }, []);

  const onLogout = () => {
    axios.get('/api/users/logout')
      .then(response => {
        if (response.data.success) {
          setUser(false);
          navigate('/login');
        } else {
          alert('로그아웃 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('로그아웃 중 오류가 발생했습니다.');
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>게시판 예제</h2>

      {user === null && <div>로딩중...</div>}

      {user === false && (
        <>
          <p>로그인 또는 회원가입하여 게시판을 이용하세요.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login"><button type="button">로그인</button></Link>
            <Link to="/register"><button type="button">회원가입</button></Link>
          </div>
        </>
      )}

      {user && (
        <>
          <p>{user.name ? `${user.name}님 환영합니다.` : '로그인 상태입니다.'}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => navigate('/')}>홈으로</button>
            <button type="button" onClick={onLogout}>로그아웃</button>
          </div>
        </>
      )}
    </div>
  );
}

export default LandingPage;