
import './App.css'
// import PlanInfo from './components/PlanInfo'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlanesComponent from './components/PlanesComponent'
import ResumeChoosenPlanScreen from './components/ResumeChoosenPlanScreen';
import PaymentScreen from './components/PaymentScreen';

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
      </Routes>
    </Router>
  )
}

export default App
