import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { BOT_TOKEN, WEBHOOK_URL, SECRET_TOKEN } = process.env;

// 1. Set Webhook
const setWebhook = async () => {
  try {
    const res = await axios.post(`https://bot-api.zapps.me/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL,
      secret_token: SECRET_TOKEN
    });
    console.log("setWebhook:", res.data);
  } catch (err) {
    console.error("Error setting webhook:", err.response?.data || err.message);
  }
};

// 2. Get Webhook info
const getWebhookInfo = async () => {
  try {
    const res = await axios.post(`https://bot-api.zapps.me/bot${BOT_TOKEN}/getWebhookInfo`, {});
    console.log("getWebhookInfo:", res.data);
  } catch (err) {
    console.error("Error getting webhook info:", err.response?.data || err.message);
  }
};

// 3. Kiểm tra Bot token
const getMe = async () => {
  try {
    const res = await axios.post(`https://bot-api.zapps.me/bot${BOT_TOKEN}/getMe`, {});
    console.log("getMe:", res.data);
  } catch (err) {
    console.error("Error getMe:", err.response?.data || err.message);
  }
};

// Chạy tất cả
(async () => {
  await getMe();
  await setWebhook();
  await getWebhookInfo();
})();
