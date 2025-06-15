import React from 'react'
import { Link } from 'react-router-dom'


const MainContent = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <section className="max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-6 leading-tight">
            Take Control of Your <span className="text-indigo-600">Finances</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Expensely empowers you to track income, monitor spending, and visualize your financial health with elegant analytics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link
            to="/register"
            className="bg-indigo-700 hover:bg-indigo-900 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-md transition-colors duration-200"
            style={{ color: "white" }} // force override in case Tailwind is ignored
            >
            Get Started
            </Link>



            <Link
              to="/login"
              className="border border-indigo-600 text-indigo-100 hover:bg-indigo-50 px-8 py-3 rounded-xl font-semibold text-lg transition-transform hover:scale-105"
            >
              Demo Login
            </Link>
          </div>

          {/* <div className="flex justify-center">
            <img
              src="https://undraw.io/assets/svg/undraw_finance_re_gnv2.svg"
              alt="Finance Dashboard"
              className="w-full max-w-2xl rounded-xl shadow-xl border border-indigo-100"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x400?text=Dashboard+Preview";
              }}
              loading="lazy"
            />
          </div> */}
        </section>
      </main>
  )
}

export default MainContent