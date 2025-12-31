import { Router } from "express";
import OpenAI from "openai";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    // Create a File object from the buffer
    const uint8Array = new Uint8Array(req.file.buffer);
    const file = new File([uint8Array], "audio.webm", {
      type: req.file.mimetype,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    res.json({ text: transcription.text });
  } catch (error: any) {
    console.error("STT Error:", error);
    res.status(500).json({ error: error.message || "Failed to transcribe audio" });
  }
});

export default router;
