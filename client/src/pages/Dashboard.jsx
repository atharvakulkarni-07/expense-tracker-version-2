import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";
import AddTransactionModal from "../components/AddTransactionModal.jsx";
import Analytics from "../components/Analytics.jsx";


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
        
        // Navigate to HomePage back again.
        navigate("/");
    }

    // Handling Transaction Modal;
    const [showModal, setShowModal] = useState(false);

    // Function to handle the addition of transactions:
    const handleAddTransaction = async (form) => {

      console.log("🚀 Sending form data:", form);
        try {
          const token = localStorage.getItem("token");
          const res = await API.post(
            "/transactions",
            {
              ...form,
              amount: Number(form.amount),
              date: form.date, // Backend expects ISO string or date string
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTransactions([res.data, ...transactions]);
        } catch (err) {
          console.error("❌ Frontend error:", err.response?.data); // Debug line
          alert(err.response?.data?.error || "Failed to add transaction.");
        }
      };

    //   Handling Deletion of the transactions
    const handleDeleteTransaction = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
          const token = localStorage.getItem("token");
          await API.delete(`/transactions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Remove the deleted transaction from state
          // The useState Hook came into action;   
          setTransactions(transactions.filter((t) => t._id !== id));

        } catch (err) {
          alert(
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to delete transaction."
          );
        }
      };


    //   Handling editing of the transactions
    const [editTransaction, setEditTransaction] = useState(null);

    const handleEditClick = (transaction) => {
        setEditTransaction(transaction);
        setShowModal(true);
      };

    // The function handling the edits:
    const handleUpdateTransaction = async (form) => {
        try {
          const token = localStorage.getItem("token");
          const res = await API.put(
            `/transactions/${editTransaction._id}`,
            {
              ...form,
              amount: Number(form.amount),
              date: form.date,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setTransactions(
            transactions.map((t) =>
              t._id === editTransaction._id ? res.data : t
            )
          );
          setEditTransaction(null);
        } catch (err) {
          alert(
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to update transaction."
          );
        }
      };

// Function to create the file in CSV

function transactionsToCSV(transactions) {
  if (!transactions.length) return "";

  // Define the columns you want to export
  const headers = [
    "Date",
    "Product",
    "Type",
    "Category",
    "Amount",
    "Description",
    "Payment Method",
    "Status"
  ];

  // Create CSV rows
  const rows = transactions.map(t =>
    [
      new Date(t.date).toLocaleDateString(),
      t.product,
      t.type,
      t.category,
      t.amount,
      t.description,
      t.paymentMethod,
      t.status
    ].map(field => `"${(field ?? "").toString().replace(/"/g, '""')}"`).join(",")
  );

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\r\n");
}

// Function to Download the CSV File:

function downloadCSV() {
  const csv = transactionsToCSV(transactions);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
  <div className="container mx-auto max-w-4xl p-6 bg-white rounded-xl shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-4xl font-bold text-indigo-700">
        Welcome{user ? `, ${user.username}` : ""}!
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white-300 px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

    {/* Add Transaction Button */}
    <div className="flex justify-end mb-6 gap-4">
      <button
        onClick={() => {
            setEditTransaction(null);   // <-- This line ensures the form is empty!
            setShowModal(true);
        }}
        className="bg-indigo-600 text-white px-5 py-2 rounded font-semibold hover:bg-indigo-700 transition"
        >
        + Add Transaction
      </button>

      <button
        onClick={downloadCSV}
        className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition"
      >
        Export to CSV
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

    {/* Side-by-side layout for transactions and analytics */}
    <div className="flex flex-col md:flex-row gap-8">
      {/* Transaction List */}
      <div className="md:w-2/3">
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
                <div className="font-medium">{t.product}</div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-gray-500 text-sm">{t.description}</div>
                  <div className="text-gray-400 text-xs">{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-lg font-bold ${
                      t.type === "income" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </span>
                  <button
                    onClick={() => handleDeleteTransaction(t._id)}
                    className="text-red-500 hover:underline text-sm ml-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(t)}
                    className="text-indigo-600 hover:underline text-sm ml-3"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* If transactions are less than 5, show an empty state below */}
        {transactions.length < 5 && (
          <div className="mt-12 flex flex-col items-center text-gray-400">
            <img
              src="hehehehe.png"
              alt="More space"
              className="w-32 h-32 mb-4 opacity-80"
            />
            <div className="text-lg font-medium">
              Room for more transactions!
            </div>
            <div className="text-sm mt-1">
              Track all your expenses and see even more insights here.
            </div>
            <button
              onClick={() => {
                setEditTransaction(null);
                setShowModal(true);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              + Add Transaction
            </button>
          </div>
        )}
        
      </div>

      {/* Analytics Chart */}
      <div className="md:w-1/3">
        <Analytics transactions={transactions} />
      </div>
    </div>
  </div>

  {/* Modal */}
  <AddTransactionModal
    open={showModal}
    onClose={() => setShowModal(false)}
    onAdd={handleAddTransaction}
    onUpdate={handleUpdateTransaction}
    initialData={editTransaction}
    editMode={!!editTransaction}
  />
</div>

  );
}
