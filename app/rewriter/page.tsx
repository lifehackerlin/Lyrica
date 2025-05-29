import TextRewriter from "@/components/text-rewriter";

export const metadata = {
  title: "Lyrica.ai - AI Text Rewriter",
  description: "Advanced AI-powered text rewriting tool with multiple writing styles, real-time streaming output, and document downloads.",
};

export default function RewriterPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Lyrica.ai AI Rewriter
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your writing with advanced AI technology. Choose from multiple writing styles and get instant, professional results.
          </p>
        </div>
        <TextRewriter />
      </div>
    </div>
  );
} 