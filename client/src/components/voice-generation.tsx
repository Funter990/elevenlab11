import { useState } from "react";
import { Play, Loader2, Download, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { VoiceSettings } from "./voice-generator";

interface VoiceGenerationProps {
  script: string;
  apiKey: string;
  voiceId: string;
  model: string;
  voiceSettings: VoiceSettings;
  autoSave: boolean;
  onAutoSaveChange: (value: boolean) => void;
  onGenerationComplete: (audioBlob: Blob) => void;
  voiceCounter: number;
}

type GenerationState = 'idle' | 'generating' | 'success' | 'error';

export default function VoiceGeneration({
  script,
  apiKey,
  voiceId,
  model,
  voiceSettings,
  autoSave,
  onAutoSaveChange,
  onGenerationComplete,
  voiceCounter,
}: VoiceGenerationProps) {
  const { toast } = useToast();
  const [state, setState] = useState<GenerationState>('idle');
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validateInputs = () => {
    if (!script.trim()) {
      toast({
        title: "Script Required",
        description: "Please enter a script",
        variant: "destructive",
      });
      return false;
    }
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      });
      return false;
    }
    if (!voiceId.trim()) {
      toast({
        title: "Voice ID Required",
        description: "Please enter a voice ID",
        variant: "destructive",
      });
      return false;
    }
    if (script.length > 10000) {
      toast({
        title: "Script Too Long",
        description: "Script exceeds 10,000 character limit",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const generateVoice = async () => {
    if (!validateInputs()) return;

    setState('generating');
    setErrorMessage('');

    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          apiKey,
          voiceId,
          model,
          settings: voiceSettings,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      setCurrentAudioBlob(audioBlob);
      onGenerationComplete(audioBlob);
      setState('success');

      toast({
        title: "Voice Generated Successfully",
        description: `Voice ${voiceCounter} is ready for download`,
      });

      if (autoSave) {
        downloadVoice(audioBlob);
      }
    } catch (error) {
      console.error('Generation error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(message);
      setState('error');
      toast({
        title: "Generation Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const downloadVoice = (blob = currentAudioBlob) => {
    if (!blob) {
      toast({
        title: "No Voice to Download",
        description: "Please generate a voice first",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_${voiceCounter}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Voice file is being downloaded",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 text-primary mr-2" />
            Voice Generation
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoSave"
              checked={autoSave}
              onCheckedChange={onAutoSaveChange}
              data-testid="checkbox-auto-save"
            />
            <label htmlFor="autoSave" className="text-sm cursor-pointer">
              Auto-save all voices
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Generation Button */}
        <Button
          onClick={generateVoice}
          disabled={state === 'generating'}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 shadow-sm hover:shadow-md transition-all duration-200"
          data-testid="button-generate-voice"
        >
          {state === 'generating' ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Voice...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 16V18L15 16.5V15M11 9.5V7.5L5 8V9.5H11ZM5 15V13.5L11 14.5V16H5ZM12 8.5C13.25 8.5 14.25 9.5 14.25 10.75V13.25C14.25 14.5 13.25 15.5 12 15.5S9.75 14.5 9.75 13.25V10.75C9.75 9.5 10.75 8.5 12 8.5Z"/>
              </svg>
              Generate Voice
            </>
          )}
        </Button>

        {/* Progress Indicator */}
        {state === 'generating' && (
          <div className="mt-4" data-testid="progress-container">
            <div className="flex items-center space-x-3 mb-2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Generating voice... please wait</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4" data-testid="success-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Voice generated successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300" data-testid="text-success-message">
                    Voice {voiceCounter} ready for download
                  </p>
                </div>
              </div>
              <Button
                onClick={() => downloadVoice()}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-download-voice"
              >
                <Download className="w-4 h-4 mr-2" />
                Download MP3
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" data-testid="error-container">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Generation failed</p>
                <p className="text-sm text-red-700 dark:text-red-300" data-testid="text-error-message">
                  {errorMessage || 'Please check your settings and try again.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
