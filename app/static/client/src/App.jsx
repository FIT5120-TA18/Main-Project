import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './components/landing/LandingPage';
import QuickProfileStep1 from './components/profile/QuickProfileStep1';
import QuickProfileStep2 from './components/profile/QuickProfileStep2';
import PathwayBuilder from './components/pathway/PathwayBuilder';
import ResultsScreen from './components/results/ResultsScreen';
import HousingStressGuide from './components/education/HousingStressGuide';
import PayslipGuide from './components/education/PayslipGuide';
import MovingCostsGuide from './components/education/MovingCostsGuide';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quick-profile-step-1" element={<QuickProfileStep1 />} />
          <Route path="/quick-profile-step-2" element={<QuickProfileStep2 />} />
          <Route path="/pathway-builder" element={<PathwayBuilder />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/education/housing-stress" element={<HousingStressGuide />} />
          <Route path="/education/payslip" element={<PayslipGuide />} />
          <Route path="/education/moving-costs" element={<MovingCostsGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

    </Router>
  );
}

export default App;
