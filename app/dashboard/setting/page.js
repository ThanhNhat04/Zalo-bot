'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faCalendarWeek, 
  faCalendarAlt, 
  faCheck,
  faSave,
  faSpinner,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';

export default function AccountListPage() {
  // 1. Giả lập dữ liệu ban đầu
  const initialAccounts = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', isActive: true, frequency: 'weekly' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@company.com', isActive: false, frequency: 'monthly' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@startup.io', isActive: true, frequency: 'monthly' },
    { id: 4, name: 'Phạm Thu D', email: 'thud@design.vn', isActive: true, frequency: 'weekly' },
  ];

  // 2. State quản lý danh sách
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // 3. Xử lý Bật/Tắt từng tài khoản
  const toggleAccount = (id) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    ));
  };

  // 4. Xử lý đổi tần suất (Tuần/Tháng)
  const changeFrequency = (id, newFreq) => {
    setAccounts(prev => prev.map(acc => {
      // Chỉ cho phép đổi nếu tài khoản đang active
      if (acc.id === id && acc.isActive) {
        return { ...acc, frequency: newFreq };
      }
      return acc;
    }));
  };

  // 5. Lưu tất cả thay đổi
  const handleSaveAll = () => {
    setIsSaving(true);
    setToast(null);

    // Log dữ liệu ra console để bạn kiểm tra
    console.log("Dữ liệu gửi đi:", accounts);

    setTimeout(() => {
      setIsSaving(false);
      setToast({ show: true, text: `Đã cập nhật trạng thái cho ${accounts.length} tài khoản.` });
      
      // Tắt toast sau 3s
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  return (
    <div className="container">
      <div className="card">
        
        {/* --- HEADER --- */}
        <div className="header">
          <div className="headerLeft">
            <div className="iconWrapper">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <div>
              <h1>Danh sách tài khoản</h1>
              <p>Quản lý trạng thái và lịch báo cáo cho từng nhân viên.</p>
            </div>
          </div>
          
          {/* Nút Save nằm trên Header cho tiện */}
          <button 
            className="saveButton" 
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
            {isSaving ? ' Đang lưu...' : ' Lưu thay đổi'}
          </button>
        </div>

        {/* --- BODY: LIST --- */}
        <div className="listContainer">
          {/* Tiêu đề cột (ẩn trên mobile) */}
          <div className="listHeader">
            <div className="colUser">Thông tin tài khoản</div>
            <div className="colStatus">Trạng thái</div>
            <div className="colFreq">Tần suất báo cáo</div>
          </div>

          {/* Render từng dòng */}
          {accounts.map((acc) => (
            <div key={acc.id} className={`row ${!acc.isActive ? 'rowInactive' : ''}`}>
              
              {/* Cột 1: User Info */}
              <div className="userInfo">
                <div className="avatar">
                  {acc.name.charAt(0)}
                </div>
                <div className="userDetails">
                  <div className="userName">{acc.name}</div>
                  <div className="userEmail">{acc.email}</div>
                </div>
              </div>

              {/* Cột 2: Toggle Switch */}
              <div className="actionToggle">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={acc.isActive} 
                    onChange={() => toggleAccount(acc.id)} 
                  />
                  <span className="slider"></span>
                </label>
                <span className="statusLabel">
                  {acc.isActive ? 'Đang bật' : 'Đã tắt'}
                </span>
              </div>

              {/* Cột 3: Frequency Selectors */}
              <div className={`actionFrequency ${!acc.isActive ? 'disabled' : ''}`}>
                {/* Nút Tuần */}
                <button 
                  className={`freqBtn ${acc.frequency === 'weekly' ? 'active' : ''}`}
                  onClick={() => changeFrequency(acc.id, 'weekly')}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <span>Tuần</span>
                </button>

                {/* Nút Tháng */}
                <button 
                  className={`freqBtn ${acc.frequency === 'monthly' ? 'active' : ''}`}
                  onClick={() => changeFrequency(acc.id, 'monthly')}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Tháng</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Toast Message Fix ở góc dưới */}
        {toast && (
          <div className="toast">
            <FontAwesomeIcon icon={faCheck} /> {toast.text}
          </div>
        )}

      </div>

      {/* --- CSS STYLES --- */}
      <style jsx>{`
        .container {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .card {
          background: white;
          width: 100%;
          max-width: 900px; /* Rộng hơn để chứa list */
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Header */
        .header {
          padding: 24px 30px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          flex-wrap: wrap;
          gap: 15px;
        }
        .headerLeft { display: flex; gap: 15px; align-items: center; }
        .header h1 { margin: 0; font-size: 20px; color: #0f172a; font-weight: 700; }
        .header p { margin: 4px 0 0 0; font-size: 14px; color: #64748b; }
        .iconWrapper {
          width: 40px; height: 40px; background: #eff6ff; color: #3b82f6;
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }

        .saveButton {
          background: #2563eb; color: white; border: none;
          padding: 10px 20px; border-radius: 6px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: 0.2s; font-size: 14px;
        }
        .saveButton:hover { background: #1d4ed8; }
        .saveButton:disabled { opacity: 0.7; cursor: not-allowed; }

        /* List Styles */
        .listContainer { background: #fff; }
        
        .listHeader {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr; /* Chia cột */
          padding: 15px 30px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b;
          letter-spacing: 0.5px;
        }

        .row {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr; /* Khớp với header */
          padding: 20px 30px;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
          transition: background 0.2s;
        }
        .row:last-child { border-bottom: none; }
        .row:hover { background-color: #f8fafc; }
        
        /* Khi inactive thì làm mờ dòng */
        .rowInactive .userInfo { opacity: 0.6; }

        /* Column 1: User Info */
        .userInfo { display: flex; align-items: center; gap: 15px; }
        .avatar {
          width: 40px; height: 40px; background: #cbd5e1; color: #475569;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px;
        }
        .userDetails { display: flex; flex-direction: column; }
        .userName { font-size: 15px; font-weight: 600; color: #334155; }
        .userEmail { font-size: 13px; color: #94a3b8; }

        /* Column 2: Toggle */
        .actionToggle { display: flex; align-items: center; gap: 10px; }
        .statusLabel { font-size: 13px; color: #64748b; min-width: 60px; }
        
        /* Switch CSS cũ */
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #3b82f6; }
        input:checked + .slider:before { transform: translateX(20px); }

        /* Column 3: Frequency Buttons */
        .actionFrequency { display: flex; gap: 8px; }
        .actionFrequency.disabled { opacity: 0.3; pointer-events: none; }

        .freqBtn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .freqBtn:hover { background: #f1f5f9; }
        
        /* Active State của nút frequency */
        .freqBtn.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #2563eb;
          font-weight: 600;
        }

        /* Toast */
        .toast {
          position: absolute;
          bottom: 20px; left: 50%; transform: translateX(-50%);
          background: #064e3b; color: #ecfdf5;
          padding: 10px 20px; border-radius: 30px;
          font-size: 14px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease-out;
          display: flex; align-items: center; gap: 8px;
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .listHeader { display: none; } /* Ẩn header bảng trên mobile */
          .row { 
            grid-template-columns: 1fr; 
            gap: 15px; 
            padding: 15px 20px;
          }
          .actionToggle, .actionFrequency { justify-content: space-between; width: 100%; }
          .userInfo { margin-bottom: 5px; }
        }
      `}</style>
    </div>
  );
}