import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CandidateForm from "./components/CandidateForm";
import CandidateList from "./components/CandidateList";
import Analytics from "./components/Analytics";

import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/Header";
import BG from "./assests/BG.jpg";
import UserProfile from "./components/UserProfile";

function App() {
  const addCandidate = (candidate) => {
    console.log("Candidate added:", candidate);
  };

  const handleSave = () => {
    console.log("The Data is ***********");
  };

  return (
    <Router>
      <div className="App">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main
            className="flex-grow p-4"
            style={{ backgroundImage: `url(${BG})` }}
          >
            <Routes>
              <Route
                path="/add"
                element={
                  <CandidateForm
                    addCandidate={addCandidate}
                    onSave={handleSave}
                  />
                }
              />{" "}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<CandidateList />} />{" "}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
