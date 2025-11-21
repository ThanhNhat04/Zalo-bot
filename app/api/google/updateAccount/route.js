import { updateSheetRows } from "@/lib/googleSheet";

export async function POST(req) {
  try {
    const data = await req.json();
    const { accounts } = data;

    if (!accounts || !Array.isArray(accounts)) {
      return new Response(JSON.stringify({ error: "Invalid accounts data" }), { status: 400 });
    }

    const values = accounts.map(acc => [
      acc.zalo_id,
      acc.name,
      acc.isActive ? "TRUE" : "FALSE",
      acc.frequency === "monthly" ? "month" : "week",
      acc.time || "",
      acc.day_of_week || "",
    ]);

    const res = await updateSheetRows(process.env.SPREADSHEET_ID, 2, values);

    return new Response(JSON.stringify({ success: true, updatedRows: res.data.updatedRows }), { status: 200 });
  } catch (err) {
    console.error("Update accounts error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
