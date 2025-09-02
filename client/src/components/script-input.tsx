import { useState } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ScriptInputProps {
  script: string;
  onScriptChange: (script: string) => void;
}

export default function ScriptInput({ script, onScriptChange }: ScriptInputProps) {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);

  const charCount = script.length;
  const alphabetCount = (script.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  const percentage = (charCount / 10000) * 100;

  const getCharStatus = () => {
    if (charCount > 10000) {
      return {
        message: `Exceeds limit by ${charCount - 10000}`,
        className: "text-destructive",
        icon: "⚠️"
      };
    } else if (charCount > 8000) {
      return {
        message: `${10000 - charCount} characters remaining`,
        className: "text-yellow-600",
        icon: "⚠️"
      };
    } else {
      return {
        message: "Within limit",
        className: "text-green-600",
        icon: "✅"
      };
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        let content = e.target?.result as string;
        content = content.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        onScriptChange(content);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${content.length} characters`,
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file",
        variant: "destructive",
      });
    }
    // Reset input
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        let content = e.target?.result as string;
        content = content.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        onScriptChange(content);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${content.length} characters`,
        });
      };
      reader.readAsText(file);
    }
  };

  const status = getCharStatus();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 text-primary mr-2" />
            Script Input
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('fileInput')?.click()}
              data-testid="button-upload-file"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload .txt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScriptChange("")}
              data-testid="button-clear-script"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`relative ${dragOver ? 'bg-accent/50' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Enter your script here... The text will be converted to speech using the selected voice settings."
            className="min-h-32 resize-none"
            data-testid="textarea-script"
          />
          
          {dragOver && (
            <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
              <p className="text-primary font-medium">Drop .txt file here</p>
            </div>
          )}
        </div>
        
        {/* Character Count Display */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium" data-testid="text-char-count">{charCount}</span> / 10,000 characters
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium" data-testid="text-alphabet-count">{alphabetCount}</span> alphabetic chars
            </div>
          </div>
          <div className={`text-sm font-medium ${status.className}`} data-testid="text-char-status">
            {status.icon} {status.message}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <Progress 
            value={Math.min(percentage, 100)} 
            className={`h-2 ${charCount > 10000 ? '[&>div]:bg-destructive' : charCount > 8000 ? '[&>div]:bg-yellow-500' : ''}`}
          />
        </div>
        
        <input
          type="file"
          id="fileInput"
          accept=".txt"
          className="hidden"
          onChange={handleFileUpload}
        />
      </CardContent>
    </Card>
  );
}
