import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScriptInput from "./script-input";
import VoiceConfiguration from "./voice-configuration";
import VoiceGeneration from "./voice-generation";
import VoiceHistory from "./voice-history";

export type VoiceSettings = {
  stability: number;
  similarity: number;
  styleExaggeration: number;
  speed: number;
};

export type GenerationResult = {
  audioBlob: Blob;
  id: number;
  preview: string;
  timestamp: string;
  settings: {
    voiceId: string;
    model: string;
  };
};

export default function VoiceGenerator() {
  const { theme, toggleTheme } = useTheme();
  const [script, setScript] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [model, setModel] = useState("eleven_flash_v2_5");
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 50,
    similarity: 65,
    styleExaggeration: 0,
    speed: 0.85,
  });
  const [autoSave, setAutoSave] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<GenerationResult[]>([]);
  const [recentVoiceIds, setRecentVoiceIds] = useState<string[]>([]);
  const [voiceCounter, setVoiceCounter] = useState(1);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("voiceGeneratorSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setApiKey(settings.apiKey || "");
      setVoiceId(settings.voiceId || "");
      setModel(settings.model || "eleven_flash_v2_5");
      setVoiceSettings({
        stability: settings.stability || 50,
        similarity: settings.similarity || 65,
        styleExaggeration: settings.styleExaggeration || 0,
        speed: settings.speed || 0.85,
      });
      setAutoSave(settings.autoSave || false);
    }

    const savedRecentVoiceIds = localStorage.getItem("recentVoiceIds");
    if (savedRecentVoiceIds) {
      setRecentVoiceIds(JSON.parse(savedRecentVoiceIds));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      apiKey,
      voiceId,
      model,
      ...voiceSettings,
      autoSave,
    };
    localStorage.setItem("voiceGeneratorSettings", JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [apiKey, voiceId, model, voiceSettings, autoSave]);

  const addToRecentVoiceIds = (newVoiceId: string) => {
    if (!recentVoiceIds.includes(newVoiceId)) {
      const updated = [newVoiceId, ...recentVoiceIds].slice(0, 5);
      setRecentVoiceIds(updated);
      localStorage.setItem("recentVoiceIds", JSON.stringify(updated));
    }
  };

  const addToVoiceHistory = (result: GenerationResult) => {
    const updated = [result, ...voiceHistory].slice(0, 10);
    setVoiceHistory(updated);
  };

  const resetSettings = () => {
    setVoiceSettings({
      stability: 50,
      similarity: 65,
      styleExaggeration: 0,
      speed: 0.85,
    });
  };

  const clearHistory = () => {
    setVoiceHistory([]);
  };

  const exportHistory = () => {
    const data = {
      history: voiceHistory.map(item => ({
        id: item.id,
        preview: item.preview,
        timestamp: item.timestamp,
        settings: item.settings
      })),
      recentVoiceIds,
      settings: { apiKey, voiceId, model, ...voiceSettings, autoSave }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_generator_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 16V18L15 16.5V15M11 9.5V7.5L5 8V9.5H11ZM5 15V13.5L11 14.5V16H5ZM12 8.5C13.25 8.5 14.25 9.5 14.25 10.75V13.25C14.25 14.5 13.25 15.5 12 15.5S9.75 14.5 9.75 13.25V10.75C9.75 9.5 10.75 8.5 12 8.5Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Ali Voice Generator</h1>
                <p className="text-xs text-muted-foreground">Tool Version 1.1</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-toggle-theme"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                asChild
                className="bg-green-500 hover:bg-green-600 text-white"
                data-testid="button-contact-developer"
              >
                <a href="https://wa.me/03107835694" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="hidden sm:block">Contact Developer</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ScriptInput
            script={script}
            onScriptChange={setScript}
          />
          
          <VoiceConfiguration
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            voiceId={voiceId}
            onVoiceIdChange={setVoiceId}
            model={model}
            onModelChange={setModel}
            voiceSettings={voiceSettings}
            onVoiceSettingsChange={setVoiceSettings}
            recentVoiceIds={recentVoiceIds}
            onSelectVoiceId={setVoiceId}
            onResetSettings={resetSettings}
          />
          
          <VoiceGeneration
            script={script}
            apiKey={apiKey}
            voiceId={voiceId}
            model={model}
            voiceSettings={voiceSettings}
            autoSave={autoSave}
            onAutoSaveChange={setAutoSave}
            onGenerationComplete={(audioBlob) => {
              addToRecentVoiceIds(voiceId);
              const result: GenerationResult = {
                audioBlob,
                id: voiceCounter,
                preview: script.substring(0, 50) + "...",
                timestamp: new Date().toISOString(),
                settings: { voiceId, model }
              };
              addToVoiceHistory(result);
              setVoiceCounter(prev => prev + 1);
            }}
            voiceCounter={voiceCounter}
          />
        </div>

        <div className="lg:col-span-1">
          <VoiceHistory
            voiceHistory={voiceHistory}
            recentVoiceIds={recentVoiceIds}
            onSelectVoiceId={setVoiceId}
            onClearHistory={clearHistory}
            onSaveSettings={saveSettings}
            onExportHistory={exportHistory}
          />
        </div>
      </div>
    </div>
  );
}
