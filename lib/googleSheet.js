import axios, { Axios } from "axios";

export async function sendToSheet(cmd,value) {
  const url = process.env.SHEET;
  if (!url) throw new Error("SHEET url is not defined");

  const res= await axios.post(url, { cmd, value  });
  return res.data;
  
} 
