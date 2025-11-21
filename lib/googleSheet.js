import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function getSheetValues(sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!A1:Z100`,
  });
  return res.data.values || [];
}

export async function appendToSheet(spreadsheetId, range, values) {
  return await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: values, 
    },
  });
}

export async function updateSheet(spreadsheetId, range, values) {
  return await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED", 
    resource: { values },
  });
}

export async function updateSheetRows(spreadsheetId, startRow, values) {
  const range = `Accounts!A${startRow}:F${startRow + values.length - 1}`; 
  return sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}

export async function addOrderFromText(text) {
  if (!text) {
    throw new Error("Nội dung đơn hàng không được để trống");
  }

  const input = text.split(";");
  const [tenSP, soLuongStr, giaBanStr , customer_name] = input;
  
  const soLuong = parseFloat(soLuongStr) || 0;
  const giaBan = parseFloat(giaBanStr) || 0;

  // Tạo row dữ liệu
  const row = [
    "",
    new Date().toLocaleDateString("vi-VN"), 
    "",
    customer_name || "",
    "",
    tenSP || "",
    soLuong,
    giaBan,
    "",
    "",
    "",
    ""
  ];
  await appendToSheet(process.env.SPREADSHEET_ID, "Theo dõi đơn hàng", [row]);

  return { success: true, message: "Đã thêm đơn hàng vào Sheet" };
}