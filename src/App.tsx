import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Builder from './pages/Builder';
import WebContainerPreview from './pages/WebContainerPreview'; // Créez ce composant
import SignUp from './pages/SignUp';
import Payment from './pages/Payment';
import OnboardPage from './pages/OnboardPage';

function App() {
  return (
    <Router>
      
        
        <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/onboard" element={<OnboardPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/webcontainer" element={<WebContainerPreview />} /> {/* Nouvelle route */}
          <Route path="/webcontainer/connect/:id" element={<WebContainerPreview />} /> {/* Nouvelle route */}
        </Routes>

    </Router>
  );
}

export default App;