import React, { useState, useEffect } from "react";

export default function AddTransactionModal({
  open,
  onClose,
  onAdd,
  onUpdate,
  initialData,
  editMode,
}) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: "",
    description: "",
    paymentMethod: "",
    status: "cleared",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        date: initialData.date ? initialData.date.slice(0, 10) : "",
      });
    } else {
      setForm({
        amount: "",
        category: "",
        type: "expense",
        date: "",
        description: "",
        paymentMethod: "",
        status: "cleared",
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.type || !form.date) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    if (editMode) {
      onUpdate(form);
    } else {
      onAdd(form);
    }
    setForm({
      amount: "",
      category: "",
      type: "expense",
      date: "",
      description: "",
      paymentMethod: "",
      status: "cleared",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-indigo-700">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Category *</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Type *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Payment Method</label>
            <input
              type="text"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              maxLength={30}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
