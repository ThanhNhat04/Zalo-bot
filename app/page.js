"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/google/get");
      const data = await res.json();
      if (data.ok) setRows(data.rows);
    }
    fetchData();
  }, []);


  function postData() {
    fetch("/api/google/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        result: {
          message: {
            text: "Sản phẩm A;10;50000"
          }
        }
      })
    }).then(res => res.json()).then(data => {
      if (data.ok) {
        // Refresh data
        fetch("/api/google/get")
          .then(res => res.json())
          .then(data => {
            if (data.ok) setRows(data.rows);
          });
      }
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Theo dõi đơn hàng</h1>
      <button onClick={postData}>Thêm đơn hàng mẫu</button>

      <table border="1" cellPadding="6" style={{ marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {rows[0]?.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.slice(1).map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <td key={cIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
