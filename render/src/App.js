import './App.css';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routers from './router'
import { ConfigProvider } from 'antd';
function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        {/* <StockManage></StockManage> */}
        <Router>
          {routers.map((r, index) => {
            return (
              <Route path={r.link} component={r.component}>
              </Route>
            )
          })}
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
