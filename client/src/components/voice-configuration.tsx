import { useState } from "react";
import { Settings, History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VoiceSettings } from "./voice-generator";

interface VoiceConfigurationProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  voiceId: string;
  onVoiceIdChange: (value: string) => void;
  model: string;
  onModelChange: (value: string) => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  recentVoiceIds: string[];
  onSelectVoiceId: (voiceId: string) => void;
  onResetSettings: () => void;
}

export default function VoiceConfiguration({
  apiKey,
  onApiKeyChange,
  voiceId,
  onVoiceIdChange,
  model,
  onModelChange,
  voiceSettings,
  onVoiceSettingsChange,
  recentVoiceIds,
  onSelectVoiceId,
  onResetSettings,
}: VoiceConfigurationProps) {
  const [showRecentVoices, setShowRecentVoices] = useState(false);

  const updateSetting = (key: keyof VoiceSettings, value: number) => {
    onVoiceSettingsChange({
      ...voiceSettings,
      [key]: value,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 text-primary mr-2" />
          Voice Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              API Settings
            </h3>
            
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="sk_your_elevenlabs_api_key_here"
                className="mt-1"
                data-testid="input-api-key"
              />
            </div>
            
            <div>
              <Label htmlFor="voiceId">Voice ID</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="voiceId"
                  value={voiceId}
                  onChange={(e) => onVoiceIdChange(e.target.value)}
                  placeholder="Voice ID (e.g., 80lPKtzJMPh1vjYMUgwe)"
                  className="flex-1"
                  data-testid="input-voice-id"
                />
                <Dialog open={showRecentVoices} onOpenChange={setShowRecentVoices}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" data-testid="button-show-recent-voices">
                      <History className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Recent Voice IDs</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {recentVoiceIds.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent voice IDs
                        </p>
                      ) : (
                        recentVoiceIds.map((id) => (
                          <Button
                            key={id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              onSelectVoiceId(id);
                              setShowRecentVoices(false);
                            }}
                            data-testid={`button-select-voice-${id}`}
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 16V18L15 16.5V15M11 9.5V7.5L5 8V9.5H11ZM5 15V13.5L11 14.5V16H5ZM12 8.5C13.25 8.5 14.25 9.5 14.25 10.75V13.25C14.25 14.5 13.25 15.5 12 15.5S9.75 14.5 9.75 13.25V10.75C9.75 9.5 10.75 8.5 12 8.5Z"/>
                            </svg>
                            {id}
                          </Button>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div>
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={onModelChange}>
                <SelectTrigger className="mt-1" data-testid="select-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleven_flash_v2_5">Eleven Flash V2.5 (Fast)</SelectItem>
                  <SelectItem value="eleven_multilingual_v2">Eleven Multilingual V2</SelectItem>
                  <SelectItem value="eleven_v3">Eleven V3 (Premium)</SelectItem>
                  <SelectItem value="eleven_turbo_v2_5">Eleven Turbo V2.5 (Fastest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Voice Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Voice Settings
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetSettings}
                data-testid="button-reset-settings"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
            
            {/* Stability */}
            <div>
              <Label className="flex justify-between">
                Stability:
                <span className="text-primary font-mono" data-testid="text-stability-value">
                  {voiceSettings.stability}%
                </span>
              </Label>
              <Slider
                value={[voiceSettings.stability]}
                onValueChange={(value) => updateSetting('stability', value[0])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
                data-testid="slider-stability"
              />
            </div>
            
            {/* Similarity Boost */}
            <div>
              <Label className="flex justify-between">
                Similarity Boost:
                <span className="text-primary font-mono" data-testid="text-similarity-value">
                  {voiceSettings.similarity}%
                </span>
              </Label>
              <Slider
                value={[voiceSettings.similarity]}
                onValueChange={(value) => updateSetting('similarity', value[0])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
                data-testid="slider-similarity"
              />
            </div>
            
            {/* Style Exaggeration */}
            <div>
              <Label className="flex justify-between">
                Style Exaggeration:
                <span className="text-primary font-mono" data-testid="text-style-value">
                  {voiceSettings.styleExaggeration}%
                </span>
              </Label>
              <Slider
                value={[voiceSettings.styleExaggeration]}
                onValueChange={(value) => updateSetting('styleExaggeration', value[0])}
                min={0}
                max={100}
                step={1}
                className="mt-2"
                data-testid="slider-style-exaggeration"
              />
            </div>
            
            {/* Speed */}
            <div>
              <Label className="flex justify-between">
                Speed:
                <span className="text-primary font-mono" data-testid="text-speed-value">
                  {voiceSettings.speed}x
                </span>
              </Label>
              <Slider
                value={[voiceSettings.speed]}
                onValueChange={(value) => updateSetting('speed', value[0])}
                min={0.25}
                max={2.0}
                step={0.05}
                className="mt-2"
                data-testid="slider-speed"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
