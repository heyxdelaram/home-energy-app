// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./dashboard/page";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./settings/page";
import SignUpPage from "./signup/page";
import LoginPage from "./login/page";
import { DarkModeProvider } from "./DarkModeContext";

const App = () => {
  return (
    <DarkModeProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <main className="dark:bg-zinc-900 flex-1 p-4">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
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
