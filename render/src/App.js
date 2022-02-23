import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routers from './router'
function App() {
  return (
    <div className="App">
      <Router>
        {routers.map((r, index) => {
          console.log('r',r.component)
          return (
            <Routes key={index}>
              <Route path={r.link} component={r.component}>
              </Route>
            </Routes>
          )
        })}
      </Router>
      App页面
    </div>
  );
}

export default App;
