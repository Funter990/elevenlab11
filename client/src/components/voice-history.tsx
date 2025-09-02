import { History, Star, Zap, Save, FolderOpen, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenerationResult } from "./voice-generator";

interface VoiceHistoryProps {
  voiceHistory: GenerationResult[];
  recentVoiceIds: string[];
  onSelectVoiceId: (voiceId: string) => void;
  onClearHistory: () => void;
  onSaveSettings: () => void;
  onExportHistory: () => void;
}

export default function VoiceHistory({
  voiceHistory,
  recentVoiceIds,
  onSelectVoiceId,
  onClearHistory,
  onSaveSettings,
  onExportHistory,
}: VoiceHistoryProps) {
  
  const downloadHistoryVoice = (item: GenerationResult) => {
    const url = URL.createObjectURL(item.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_${item.id}_${new Date(item.timestamp).toISOString().slice(0, 19).replace(/:/g, '-')}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const playVoice = (item: GenerationResult) => {
    const audio = new Audio(URL.createObjectURL(item.audioBlob));
    audio.play().catch(console.error);
  };

  return (
    <div className="space-y-6">
      {/* Voice History */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <History className="w-4 h-4 text-primary mr-2" />
              Voice History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearHistory}
              data-testid="button-clear-history"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" data-testid="voice-history-list">
            {voiceHistory.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No voices generated yet
              </div>
            ) : (
              voiceHistory.map((item) => (
                <div
                  key={item.id}
                  className="voice-item bg-muted rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => playVoice(item)}
                  data-testid={`voice-item-${item.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">Voice {item.id}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {item.preview}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadHistoryVoice(item);
                      }}
                      className="text-primary hover:text-primary/80"
                      data-testid={`button-download-${item.id}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Voice IDs */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Star className="w-4 h-4 text-primary mr-2" />
            Recent Voice IDs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2" data-testid="recent-voice-ids-list">
            {recentVoiceIds.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-2">
                No recent voice IDs
              </div>
            ) : (
              recentVoiceIds.map((voiceId) => (
                <Button
                  key={voiceId}
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => onSelectVoiceId(voiceId)}
                  data-testid={`button-recent-voice-${voiceId}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 16V18L15 16.5V15M11 9.5V7.5L5 8V9.5H11ZM5 15V13.5L11 14.5V16H5ZM12 8.5C13.25 8.5 14.25 9.5 14.25 10.75V13.25C14.25 14.5 13.25 15.5 12 15.5S9.75 14.5 9.75 13.25V10.75C9.75 9.5 10.75 8.5 12 8.5Z"/>
                  </svg>
                  {voiceId.substring(0, 12)}...
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Zap className="w-4 h-4 text-primary mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={onSaveSettings}
              data-testid="button-save-settings"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target?.result as string);
                        localStorage.setItem('voiceGeneratorSettings', JSON.stringify(data.settings));
                        window.location.reload();
                      } catch (error) {
                        console.error('Failed to load settings:', error);
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              data-testid="button-load-settings"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={onExportHistory}
              data-testid="button-export-history"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
