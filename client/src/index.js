import React from 'react';
import 'antd/dist/reset.css';
import App from './App';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import promise from 'redux-promise';
import { thunk } from 'redux-thunk';               // ✅ 수정: default → named imp
import rootReducer from './_reducers';           // 예: ./_reducers/index.js

import 'antd/dist/antd.css'

// Redux DevTools 연동 (없으면 compose 사용)
const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(promise, thunk))  // ✅ 미들웨어 적용
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>                          {/* ✅ react-redux (오타 주의) */}
    <App />
  </Provider>
);
