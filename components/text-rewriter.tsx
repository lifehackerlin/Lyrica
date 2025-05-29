"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, FileText, Loader2, Wand2 } from "lucide-react";

type WritingMode = "standard" | "formal" | "academic" | "expanded" | "summary" | "narrative" | "creative";

const writingModes: Record<WritingMode, { label: string; color: string; description: string }> = {
  standard: { 
    label: "Standard", 
    color: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700", 
    description: "Clear and balanced writing style" 
  },
  formal: { 
    label: "Formal", 
    color: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700", 
    description: "Professional and business-appropriate tone" 
  },
  academic: { 
    label: "Academic", 
    color: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700", 
    description: "Scholarly and research-oriented style" 
  },
  expanded: { 
    label: "Expanded", 
    color: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700", 
    description: "Detailed and comprehensive content" 
  },
  summary: { 
    label: "Summary", 
    color: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700", 
    description: "Concise and essential points only" 
  },
  narrative: { 
    label: "Narrative", 
    color: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700", 
    description: "Storytelling and engaging format" 
  },
  creative: { 
    label: "Creative", 
    color: "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700", 
    description: "Imaginative and artistic expression" 
  },
};

const exampleTexts: Record<WritingMode, string> = {
  standard: "Artificial intelligence is transforming various industries by automating tasks and providing insights that were previously impossible to obtain.",
  formal: "We are writing to inform you about the implementation of new policies that will take effect next quarter.",
  academic: "Recent studies have demonstrated the significant correlation between environmental factors and cognitive development in early childhood.",
  expanded: "Climate change affects ecosystems worldwide.",
  summary: "Climate change is a global phenomenon characterized by rising temperatures, changing precipitation patterns, melting ice caps, rising sea levels, and increasing frequency of extreme weather events, all primarily caused by human activities such as burning fossil fuels, deforestation, and industrial processes.",
  narrative: "The old lighthouse stood silently on the rocky cliff, its weathered walls telling stories of countless storms.",
  creative: "Innovation is the key to success in business."
};

export default function TextRewriter() {
  const [selectedMode, setSelectedMode] = useState<WritingMode>("standard");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasAutoRewritten, setHasAutoRewritten] = useState(false);
  const [autoRewriteTimeout, setAutoRewriteTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-rewrite effect
  useEffect(() => {
    if (autoRewriteTimeout) {
      clearTimeout(autoRewriteTimeout);
    }

    if (inputText.length >= 100 && !hasAutoRewritten && !isRewriting) {
      const timeout = setTimeout(() => {
        handleRewrite();
        setHasAutoRewritten(true);
      }, 1000);
      setAutoRewriteTimeout(timeout);
    }

    return () => {
      if (autoRewriteTimeout) {
        clearTimeout(autoRewriteTimeout);
      }
    };
  }, [inputText, hasAutoRewritten, isRewriting]);

  // Reset auto-rewrite flag when input changes significantly
  useEffect(() => {
    if (inputText.length < 50) {
      setHasAutoRewritten(false);
    }
  }, [inputText]);

  const handleRewrite = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to rewrite.",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    setIsStreaming(true);
    setOutputText("");

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          mode: selectedMode,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rewrite text");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "") continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  accumulated += parsed.token;
                  setOutputText(accumulated);
                  
                  // Auto-scroll to bottom
                  if (outputRef.current) {
                    outputRef.current.scrollTop = outputRef.current.scrollHeight;
                  }
                } else if (parsed.done) {
                  setIsStreaming(false);
                  break;
                }
              } catch (error: any) {
                // Skip invalid JSON
                console.log("Skipping invalid JSON:", data);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to rewrite text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRewriting(false);
      setIsStreaming(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setHasAutoRewritten(false); // Reset auto-rewrite for new content
      toast({
        title: "Pasted!",
        description: "Text pasted from clipboard.",
      });
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to paste from clipboard.",
        variant: "destructive",
      });
    }
  };

  const loadExample = () => {
    setInputText(exampleTexts[selectedMode]);
    setHasAutoRewritten(false); // Reset auto-rewrite for example content
    toast({
      title: "Example Loaded",
      description: `${writingModes[selectedMode].label} example loaded.`,
    });
  };

  const downloadText = async (format: "pdf" | "docx") => {
    if (!outputText.trim()) {
      toast({
        title: "No Content",
        description: "Please rewrite some text first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: outputText,
          format,
          title: `Lyrica.ai Rewritten Text - ${writingModes[selectedMode].label} Mode`
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `lyrica-rewritten-text.${format === "docx" ? "docx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: `File downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Writing Mode Selection */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Writing Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {(Object.keys(writingModes) as WritingMode[]).map((mode) => (
              <Button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`font-medium transition-all duration-200 ${
                  selectedMode === mode
                    ? 'btn-primary scale-105'
                    : 'bg-secondary hover:bg-accent text-secondary-foreground'
                }`}
              >
                {writingModes[mode].label}
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground border-border">
              {writingModes[selectedMode].description}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input and Output */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Input Text</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={pasteFromClipboard}
                variant="outline" 
                size="sm"
                className="text-muted-foreground border-border hover:bg-accent"
              >
                Paste Text
              </Button>
              <Button 
                onClick={loadExample}
                variant="outline" 
                size="sm"
                className="text-muted-foreground border-border hover:bg-accent"
              >
                Load Example
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
              placeholder="Enter your text here to be rewritten..."
              className="min-h-[500px] text-lg input-enhanced resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {inputText.length} characters
                {inputText.length >= 100 && !hasAutoRewritten && !isRewriting && (
                  <span className="ml-2 text-primary">• Auto-rewrite in 1s</span>
                )}
              </span>
              <Button 
                onClick={handleRewrite}
                disabled={isRewriting || !inputText.trim()}
                className="btn-primary font-medium"
              >
                {isRewriting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rewriting...
                  </>
                ) : (
                  'Start Rewrite'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Rewritten Result</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => copyToClipboard(outputText)}
                disabled={!outputText.trim()}
                variant="outline" 
                size="sm"
                className="text-muted-foreground border-border hover:bg-accent"
              >
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </Button>
              <Button 
                onClick={() => downloadText('pdf')}
                disabled={!outputText.trim()}
                variant="outline" 
                size="sm"
                className="text-muted-foreground border-border hover:bg-accent"
              >
                <Download className="mr-1 h-4 w-4" />
                PDF Download
              </Button>
              <Button 
                onClick={() => downloadText('docx')}
                disabled={!outputText.trim()}
                variant="outline" 
                size="sm"
                className="text-muted-foreground border-border hover:bg-accent"
              >
                <FileText className="mr-1 h-4 w-4" />
                Word Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                ref={outputRef}
                value={outputText}
                readOnly
                placeholder="The rewritten text will appear here..."
                className="min-h-[500px] text-lg input-enhanced resize-none"
              />
              {isStreaming && (
                <div className="absolute bottom-4 right-4">
                  <div className="w-3 h-6 bg-primary animate-pulse rounded"></div>
                </div>
              )}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {outputText.length} characters generated
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 