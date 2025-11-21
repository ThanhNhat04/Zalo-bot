"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarWeek,
  faCalendarAlt,
  faCheck,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export default function AccountListPage() {
  const [accounts, setAccounts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/google/getaccounts");
      const data = await res.json();
      console.log("Fetched accounts data:", data);

      if (data.ok && data.rows) {
        // Bỏ hàng header
        const rows = data.rows.slice(1);

        const mapped = rows.map((row, idx) => ({
          id: idx + 1,
          zalo_id: row[0],
          name: row[1],
          isActive: row[2] === "TRUE",
          frequency: row[3] === "month" ? "monthly" : "weekly",
          time: row[4] ,
          day_of_week: row[5] === "0" ? "Sunday" : row[5],
        }));

        console.log("Mapped accounts data:", mapped);
        setAccounts(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  }
  fetchData();
}, []);


  const toggleAccount = (id) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
      )
    );
  };

  const changeFrequency = (id, newFreq) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id && acc.isActive) {
          return { ...acc, frequency: newFreq };
        }
        return acc;
      })
    );
  };

  // const handleSaveAll = () => {
  //   setIsSaving(true);
  //   setToast(null);

  //   console.log("Dữ liệu gửi đi:", accounts);

  //   setTimeout(() => {
  //     setIsSaving(false);
  //     setToast({
  //       show: true,
  //       text: `Đã cập nhật trạng thái cho ${accounts.length} tài khoản.`,
  //     });
  //     setTimeout(() => setToast(null), 3000);
  //   }, 1500);
  // };


const handleSaveAll = async () => {
  setIsSaving(true);
  setToast(null);

  try {
    const res = await fetch("/api/google/updateAccount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accounts }),
    });

    const data = await res.json();

    if (data.success) {
      setToast({ show: true, text: `Đã cập nhật ${accounts.length} tài khoản.` });
    } else {
      setToast({ show: true, text: `Lỗi: ${data.error}` });
    }

  } catch (err) {
    setToast({ show: true, text: `Lỗi: ${err.message}` });
  } finally {
    setIsSaving(false);
    setTimeout(() => setToast(null), 3000);
  }
};






  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center py-10 px-5 relative">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="p-6 sm:px-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center text-lg shrink-0">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div>
              <h1 className="m-0 text-xl font-bold text-slate-900">
                Danh sách tài khoản
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý trạng thái và lịch báo cáo cho từng nhân viên.
              </p>
            </div>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold transition-colors text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {isSaving ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faSave} className="w-5 h-5"/>
            )}
            {isSaving ? " Đang lưu..." : " Lưu thay đổi"}
          </button>
        </div>

        {/* LIST */}
        <div className="bg-white">
          {/* Header Bảng */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1.5fr] px-8 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wide">
            <div>Tên tài khoản</div>
            <div>Trạng thái</div>
            <div>Báo</div>
          </div>

          {/* Rows */}
          {accounts.map((acc) => (
            <div
              key={acc.id}
              // THAY ĐỔI 1: grid-cols-[1fr_auto] để Tên và Toggle nằm cùng 1 hàng
              // gap-y-3 để tách phần nút bấm xuống dòng dưới thoáng hơn
              className={`grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1.5fr] px-5 sm:px-8 py-5 border-b border-slate-100 last:border-b-0 items-center gap-x-4 gap-y-3 sm:gap-0 transition-colors hover:bg-slate-50`}
            >
              {/* Tên tài khoản */}
              <div className={`flex items-center gap-4`}>
                <div className="flex flex-col">
                  <div className="text-[15px] font-semibold text-slate-700">
                    {acc.name}
                  </div>
                </div>
              </div>

              {/* Trạng thái */}
              <div className="flex items-center justify-end sm:justify-start gap-3 w-auto sm:w-full">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={acc.isActive}
                    onChange={() => toggleAccount(acc.id)}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {/* Báo (tần suất) */}
              <div
                className={`col-span-2 sm:col-span-1 flex gap-2 w-full sm:w-auto justify-between sm:justify-start ${
                  !acc.isActive ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <button
                  onClick={() => changeFrequency(acc.id, "weekly")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-all duration-200 ${
                    acc.frequency === "weekly"
                      ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <span>Tuần</span>
                </button>

                <button
                  onClick={() => changeFrequency(acc.id, "monthly")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 border rounded-md text-[13px] font-medium transition-all duration-200 ${
                    acc.frequency === "monthly"
                      ? "bg-blue-50 border-blue-500 text-blue-600 font-semibold"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Tháng</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-emerald-800 text-emerald-50 px-5 py-2.5 rounded-full text-sm shadow-lg flex items-center gap-2 animate-bounce">
            <FontAwesomeIcon icon={faCheck} /> {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
