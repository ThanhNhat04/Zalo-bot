import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { BOT_TOKEN, WEBHOOK_URL, SECRET_TOKEN } = process.env;

const setWebhook = async () => {
  try {
    const response = await axios.post(`https://bot-api.zapps.me/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL,
      secret_token: SECRET_TOKEN
    });
    console.log("setWebhook response:", response.data);
  } catch (err) {
    console.error("Error setting webhook:", err.response?.data || err.message);
  }
};

const getWebhookInfo = async () => {
  try {
    const response = await axios.post(`https://bot-api.zapps.me/bot${BOT_TOKEN}/getWebhookInfo`, {});
    console.log("getWebhookInfo response:", response.data);
  } catch (err) {
    console.error("Error getting webhook info:", err.response?.data || err.message);
  }
};

// Chạy cả 2
(async () => {
  await setWebhook();
  await getWebhookInfo();
})();
