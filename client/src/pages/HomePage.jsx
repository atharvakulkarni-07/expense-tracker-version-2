import { Link } from "react-router-dom";
import NavBar from "../ui/NavBar.jsx";
import MainContent from "../ui/MainContent.jsx";
import Footer from "../ui/Footer.jsx";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-blue-50">
        {/* Navbar */}
        <NavBar/>

        {/* Main Content */}
        <MainContent/>

        {/* Footer */}
        <Footer/>
    </div>
  );
}
