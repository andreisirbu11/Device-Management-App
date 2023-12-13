import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import User from './components/User';
import LogIn from './components/LogIn';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LogIn/>} />
        <Route path='/user/:username/:userId' element={<User/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </Router>
  )
}

export default App;
