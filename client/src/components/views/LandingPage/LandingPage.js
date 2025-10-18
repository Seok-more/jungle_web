import React, { useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
  // 페이지 로드 시 서버에 요청 보내기
  useEffect(() => {
    axios.get('/api/hello')
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>

        </div>
  );
}

export default LandingPage;
