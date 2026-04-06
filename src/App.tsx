import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Workflow from '@/pages/workflow';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/" element={<Workflow />} />
      </Routes>
    </Router>
  );
};

export default App;
