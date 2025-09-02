export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { script, apiKey, voiceId, model, settings } = req.body;

    // Basic validation
    if (!script || !apiKey || !voiceId || !model || !settings) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (script.length > 10000) {
      return res.status(400).json({ message: 'Script exceeds 10,000 character limit' });
    }

    // Make request to ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: script,
        model_id: model,
        voice_settings: {
          stability: settings.stability / 100,
          similarity_boost: settings.similarity / 100,
          style: 0.0,
          style_exaggeration: settings.styleExaggeration / 100,
          speed: settings.speed
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
    
    // Return audio data
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="voice_${Date.now()}.mp3"`);
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}