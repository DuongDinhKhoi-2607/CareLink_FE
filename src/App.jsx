import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import ForFamily from "./features/family/pages/ForFamily";
import PageTransition from "./components/PageTransition";

export default function App() {
  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/family" element={<ForFamily />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}
