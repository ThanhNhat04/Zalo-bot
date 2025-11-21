"use client";

import { useEffect, useState } from "react";
// Đảm bảo đường dẫn import đúng với nơi bạn lưu file DataForm
import DataForm from "@/components/DataForm";

export default function Dashboard() {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  async function fetchData(pageNumber) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/google/getProduct?page=${pageNumber}`);
      const data = await res.json();
      if (data.ok) {
        setHeaders(data.headers || []);
        setRows(data.rows || []);
        setPagination(data.pagination || {});
        setTotalRevenue(data.totalRevenue || 0);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleFormSubmit = (formData) => {
    setIsLoading(true);

    fetch("/api/google/postProductSheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        quantity: formData.quantity,
        price: formData.price,
        date: formData.date,
        customer_name: formData.customer_name || "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setShowModal(false);
          setPage(1);
          fetchData(1);
        } else {
          alert("Có lỗi khi lưu: " + data.error);
        }
      })
      .catch((err) => alert("Lỗi kết nối"))
      .finally(() => setIsLoading(false));
  };

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(amount);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900 relative">
      {/* --- MODAL POPUP --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">
                Thêm Đơn Hàng Mới
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* Gọi Form Component */}
              <DataForm
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Theo dõi đơn hàng
            </h1>
            {/* <p className="text-sm text-gray-500 mt-1">
              Tổng cộng:{" "}
              <span className="font-semibold text-blue-600">
                {pagination.totalItems}
              </span>{" "}
              đơn hàng
            </p> */}
            <p className="text-sm text-gray-500 mt-1">
              Tổng doanh thu:{" "}
              <span className="font-semibold text-blue-600">
                {formatCurrency(totalRevenue)}
              </span>{" "}
              VNĐ
            </p>
          </div>

          {/* Nút mở Modal */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 shadow-sm transition-all duration-200 flex items-center gap-2 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm đơn hàng
          </button>
        </div>

        {/* Table Section (Giữ nguyên logic hiển thị bảng) */}
        <div className="bg-white border border-gray-300 overflow-hidden rounded-t-lg shadow-sm">
          <div className="overflow-x-auto w-full">
            {isLoading && rows.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`bg-white divide-y divide-gray-200 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  {rows.length > 0 ? (
                    rows.map((row, rIndex) => (
                      <tr
                        key={rIndex}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        {row.map((cell, cIndex) => (
                          <td
                            key={cIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={headers.length || 1}
                        className="text-center py-8 text-gray-500"
                      >
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer (Giữ nguyên) */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Trang{" "}
              <span className="font-semibold">{pagination.currentPage}</span> /{" "}
              <span className="font-semibold">{pagination.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
                className="px-3 py-1 border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= pagination.totalPages || isLoading}
                className="px-3 py-1 border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
