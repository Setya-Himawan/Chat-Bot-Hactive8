import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express ();
const upload = multer();
const ai = new GoogleGenAI ({
  apiKey: process.env.GOOGLE_API_KEY,
});
const geminiModel = 'gemini-2.5-flash';

app.use (express.json ());
const port = 3000;
app.listen (port, () => {
  console.log (`Server is running on port ${port}`);
});

app.post ('/generate-text', upload.none (), async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent ({
      model: geminiModel,
      contents: prompt,
    });
    res.status (200).json ({ text: response.text });
  } catch (e) {
    console.error (e);
    res.status (500).json ({ message: e.message });
  }
});

app.post ('/generate-from-image', upload.single ('image'), upload.none (), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString ('base64');

  try {
    const response = await ai.models.generateContent ({
      model: geminiModel,
      contents: [
        { type: 'text', text: prompt },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype} },
      ]
    });
    res.status (200).json ({ text: response.text });
  } catch (e) {
    console.error (e);
    res.status (500).json ({ message: e.message });
  }
});

app.post ('/generate-from-document', upload.single ('document'), upload.none (), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString ('base64');

  try {
    const response = await ai.models.generateContent ({
      model: geminiModel,
      contents: [
        { type: 'text', text: prompt ?? 'Tolong buatkan ringkasan dari dokumen tersebut' },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype} },
      ]
    });
    res.status (200).json ({ text: response.text });
  } catch (e) {
    console.error (e);
    res.status (500).json ({ message: e.message });
  }
});