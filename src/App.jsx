
import './App.css'
// import PlanInfo from './components/PlanInfo'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlanesComponent from './components/PlanesComponent'
import ResumeChoosenPlanScreen from './components/ResumeChoosenPlanScreen';
import PaymentScreen from './components/PaymentScreen';
import WelcomeScreen from './components/WelcomeScreen';

function App() {


  return (
    // <>
    //   <PlanesComponent />
    // </>
    <Router>
      <Routes>
        <Route path="/" element={<PlanesComponent />} />
        <Route path="/resumen-plan" element={<ResumeChoosenPlanScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
      </Routes>
    </Router>
  )
}

export default App
