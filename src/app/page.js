// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./dashboard/page";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./settings/page";
import SignUpPage from "./signup/page";
import LoginPage from "./login/page";
import { DarkModeProvider } from "./DarkModeContext";

/**
 * App Component
 *
 * This component sets up the application's main layout and routing.
 * It wraps the application with a DarkModeProvider to manage the dark mode state globally,
 * and uses React Router to define client-side routes for different pages (Dashboard, Settings, Login, SignUp, etc.).
 *
 * The layout is structured with a persistent Sidebar and a main content area that changes based on the current route.
 *
 * @component
 * @example
 * return <App />;
 *
 * @returns {JSX.Element} The rendered application with routing and dark mode context.
 */
const App = () => {
  return (
    // Provides dark mode state to the entire application.
    <DarkModeProvider>
      {/* Sets up client-side routing */}
      <Router>
        <div className="flex">
          {/* Sidebar is rendered on every page */}
          <Sidebar />
          {/* Main content area: renders pages based on current route */}
          <main className="dark:bg-zinc-900 flex-1 p-4">
            <Routes>
              {/* Route for the Dashboard page */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Route for the Settings page */}
              <Route path="/settings" element={<SettingsPage />} />
              {/* Route for the Login page */}
              <Route path="/login" element={<LoginPage />} />
              {/* Route for the Sign Up page */}
              <Route path="/signup" element={<SignUpPage />} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
