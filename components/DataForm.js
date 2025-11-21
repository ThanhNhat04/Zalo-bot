// components/DataForm.js
"use client";

import React, { useState } from "react";

export default function DataForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    price: "",
    customer_name: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Vui lòng nhập tên sản phẩm");
    onSubmit(formData);
  };

  // const inputClass =
  //   "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm bg-white";
  const inputClass =
    "mt-1 block w-full rounded-md border px-3 py-2 sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 " +
    "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 " + // Style Sáng
    "dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"; // Style Tối
    
  const labelClass = "block text-sm font-medium ";

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <div>
        <label className={labelClass}>Tên sản phẩm</label>
        <input
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Ví dụ: Áo thun"
        />
      </div>
      <div>
        <label className={labelClass}>Khách hàng</label>
        <input
          name="customer_name"
          type="text"
          value={formData.customer_name}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Số lượng</label>
          <input
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Giá bán</label>
          <input
            name="price"
            type="string"
            required
            value={formData.price}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Ngày bán</label>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium  bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lưu đơn hàng
        </button>
      </div>
    </form>
  );
}
