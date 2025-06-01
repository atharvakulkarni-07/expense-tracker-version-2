import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Fetch user info from localStorage or backend
  useEffect(() => {
    // Option 1: If you store user info in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Option 2: Or fetch from backend if needed
  }, []);

  // Fetch transactions for the logged-in user
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch transactions."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Calculate summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);


 // Handle LogOut Functionality
    const navigate = useNavigate();

    const handleLogout = () => {
        // remove the stored things in the local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Navigate to Login Page back again.
        navigate("/login");
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="container mx-auto max-w-3xl p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-indigo-700">
            Welcome{user ? `, ${user.username}` : ""}!
        </h1>
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
            Logout
        </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-lg text-green-700 font-semibold">Total Income</div>
            <div className="text-2xl font-bold text-green-800">₹ {totalIncome}</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-lg text-red-700 font-semibold">Total Expense</div>
            <div className="text-2xl font-bold text-red-800">₹ {totalExpense}</div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-indigo-600 mb-2">Recent Transactions</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-500">No transactions found.</div>
        ) : (
          <ul className="divide-y">
            {transactions.slice(0, 5).map((t) => (
              <li key={t._id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-gray-500 text-sm">{t.description}</div>
                  <div className="text-gray-400 text-xs">{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div
                  className={`text-lg font-bold ${
                    t.type === "income" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
