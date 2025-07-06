import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRouter from './Routes/AppRouter';

function App() {
  return (
    <Router>
      <Navbar />
      <AppRouter />
    </Router>
  );
}

export default App;
