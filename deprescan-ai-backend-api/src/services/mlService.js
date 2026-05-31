import axios from 'axios';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8001';

const mlClient = axios.create({
  baseURL: ML_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// prediksi dengan opsi untuk menyertakan AI insight
const predict = async (inputData, includeAiInsight = false) => {
  const payload = { ...inputData, include_ai_insight: includeAiInsight };

  const response = await mlClient.post('/predict', payload);
  return response.data;
};

// health check ke AI backend
const healthCheck = async () => {
  const response = await mlClient.get('/health');
  return response.data;
};

export default { predict, healthCheck };
