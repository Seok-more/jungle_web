import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 로그아웃 후 페이지 이동용

function LandingPage() {
  const navigate = useNavigate();

  // 페이지 로드 시 서버에 요청 보내기
  useEffect(() => {
    axios.get('/api/hello')
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  }, []);

  // ✅ 로그아웃 버튼 클릭 시 실행할 함수
  const onClickHandler = () => {
    axios.get('/api/users/logout')
      .then(response => {
        if (response.data.success) {
          navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
        } else {
          alert('로그아웃 실패');
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>
        로그아웃
      </button>
    </div>
  );
}

export default LandingPage;
