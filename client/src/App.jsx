import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./assets/pages/Home";
import SignIn from "./assets/pages/SignIn";
import About from "./assets/pages/About";
import Projects from "./assets/pages/Projects";
import Dashboard from "./assets/pages/Dashboard";
import SignUp from "./assets/pages/SignUp";

const App = () => {
  return (
    <BrowserRouter className="text-3xl text-blue-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
