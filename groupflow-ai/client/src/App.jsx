import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreateProjectPage from './pages/CreateProjectPage.jsx';
import TeamMembersPage from './pages/TeamMembersPage.jsx';
import PlanReviewPage from './pages/PlanReviewPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>GroupFlow AI</h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/projects/new">Create Project</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id/team" element={<TeamMembersPage />} />
          <Route path="/projects/:id/plan" element={<PlanReviewPage />} />
          <Route path="/projects/:id/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
