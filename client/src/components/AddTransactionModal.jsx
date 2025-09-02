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
    product: "",
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
        product: "",
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
    if (!form.product || !form.amount || !form.category || !form.type || !form.date) {
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
      product: "",
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

  const handleOverlayClick = (e) => {
    // Close modal when clicking on the overlay (not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-700">
            {editMode ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product / Service *</label>
              <input
                type="text"
                name="product"
                value={form.product}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Coffee, Salary, Groceries"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Amount *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Food, Transport, Utilities"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="3"
                maxLength={100}
                placeholder="Optional details about this transaction"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
              <input
                type="text"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                maxLength={30}
                placeholder="e.g., Credit Card, Cash, Bank Transfer"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer with Submit Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            {editMode ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
