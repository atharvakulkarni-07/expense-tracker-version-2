import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 text-center py-4 shadow-inner mt-auto">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-indigo-700">Expensely</span>. Built
        with <span role="img" aria-label="love">❤️</span> for modern budgeting.
    </footer>
  )
}

export default Footer