import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserStateProvider from './context/UserStateProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import CreateAccount from './pages/CreateAccount';
import AdminDashboard from './pages/AdminDashboard';
import AccountSummary from './pages/AccountSummary';
import AccountStateProvider from './context/AccountStateProvider';
import ProtectedRoute from './protectedRoutes/ProtectedRoute';
import { getJwtTokenService } from './services/JwtTokenService';
import TokenValidatorChecker from './services/TokenValidatorChecker';

function App() {
  const tokenGenerated = getJwtTokenService();
  return (
    <React.Fragment>
      <div className="App">
        <UserStateProvider>
          <AccountStateProvider>
            <Navbar />
            <TokenValidatorChecker>
              <Routes>
                {
                  tokenGenerated == null && (
                    <React.Fragment>
                      <Route path="/" element={ <Home />} />
                      <Route path='/signup' element={<Signup />} />
                    </React.Fragment>
                  )
                }
                <Route element={<ProtectedRoute />}>
                  <Route path='/createaccount' element={<CreateAccount />} />
                  <Route path='/admin-dashboard' element={<AdminDashboard />} />
                  <Route path='/account' element={<AccountSummary />} />
                  <Route path='*' element={<Home />} />
                </Route>
              </Routes>
              </TokenValidatorChecker>
            <Footer />
          </AccountStateProvider>
        </UserStateProvider>
      </div>
    </React.Fragment>
  );
}

export default App;
