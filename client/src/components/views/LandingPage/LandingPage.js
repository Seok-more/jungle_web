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
    <div>
      LandingPage suck
    </div>
  );
}

export default LandingPage;
