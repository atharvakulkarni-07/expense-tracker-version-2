import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md flex justify-between items-center px-6 sm:px-12 py-4 sticky top-0 z-10">
            {/* Logo + Brand Name */}
            <div className="flex items-center space-x-3">
                <img src="/expensly_logo.png" alt="Expensely Logo" className="h-13 w-15" />
                <span className="text-3xl font-bold text-indigo-700">Expensely</span>
            </div>

            {/* Navigation Links */}
            <div className="space-x-4">
                <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline transition"
                >
                Login
                </Link>
                <Link
                to="/register"
                className="bg-white text-indigo-700 border border-indigo-600 px-5 py-2 rounded-lg font-medium hover:bg-indigo-50 transition"
                >
                Register
                </Link>
            </div>
            </nav>
  )
}

export default NavBar