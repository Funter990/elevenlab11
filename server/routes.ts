import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateVoiceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate voice using ElevenLabs API
  app.post("/api/generate-voice", async (req, res) => {
    try {
      const validatedData = generateVoiceSchema.parse(req.body);
      
      // Make request to ElevenLabs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${validatedData.voiceId}/stream`, {
        method: 'POST',
        headers: {
          'xi-api-key': validatedData.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: validatedData.script,
          model_id: validatedData.model,
          voice_settings: {
            stability: validatedData.settings.stability / 100,
            similarity_boost: validatedData.settings.similarity / 100,
            style: 0.0,
            style_exaggeration: validatedData.settings.styleExaggeration / 100,
            speed: validatedData.settings.speed
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          message: `ElevenLabs API Error: ${response.status} - ${errorText}` 
        });
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Store generation record
      await storage.createVoiceGeneration({
        userId: null, // No user system for now
        script: validatedData.script,
        voiceId: validatedData.voiceId,
        model: validatedData.model,
        settings: validatedData.settings,
        audioUrl: null
      });

      // Return audio data
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="voice_${Date.now()}.mp3"`);
      res.send(Buffer.from(audioBuffer));

    } catch (error) {
      console.error('Voice generation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid request data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  // Get voice generations history
  app.get("/api/voice-history", async (req, res) => {
    try {
      const generations = await storage.getVoiceGenerationsByUser(""); // Get all for now
      res.json(generations.slice(0, 10)); // Limit to 10 most recent
    } catch (error) {
      console.error('History fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch history' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
