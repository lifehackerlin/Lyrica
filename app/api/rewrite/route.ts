import { NextRequest, NextResponse } from "next/server";

interface RewriteRequest {
  text: string;
  mode: string;
  stream?: boolean;
}

const OPENROUTER_API_KEY = "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";

const MODE_PROMPTS = {
  standard: "Rewrite this text in a clear and natural way while maintaining the original meaning:",
  formal: "Rewrite this text in a formal, professional tone suitable for business or academic contexts:",
  academic: "Rewrite this text in an academic style with sophisticated vocabulary and scholarly tone:",
  expanded: "Expand and elaborate on this text, adding more detail and depth while maintaining clarity:",
  summary: "Summarize this text, capturing the main points concisely:",
  narrative: "Rewrite this text as a compelling narrative with engaging storytelling elements:",
  creative: "Rewrite this text in a creative, imaginative way that captures attention:",
};

export async function POST(request: NextRequest) {
  try {
    const body: RewriteRequest = await request.json();
    const { text, mode, stream = false } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const prompt = MODE_PROMPTS[mode as keyof typeof MODE_PROMPTS] || MODE_PROMPTS.standard;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Lyrica.ai",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: "You are a professional text rewriter. Your task is to rewrite the given text according to the specified style while preserving the original meaning and key information. Respond only with the rewritten text, no additional commentary."
          },
          {
            role: "user",
            content: `${prompt}\n\n"${text}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: stream,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to process rewrite request" },
        { status: 500 }
      );
    }

    if (stream) {
      // Handle streaming response
      const encoder = new TextEncoder();
      
      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();

          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                controller.enqueue(encoder.encode("data: {\"done\": true}\n\n"));
                controller.close();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.choices?.[0]?.delta?.content) {
                      const token = data.choices[0].delta.content;
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
                    }
                  } catch (e) {
                    // Ignore JSON parse errors
                  }
                }
              }
            }
          } catch (error) {
            controller.error(error);
          } finally {
            reader.releaseLock();
          }
        }
      });

      return new NextResponse(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Handle non-streaming response
      const data = await response.json();
      const rewrittenText = data.choices[0]?.message?.content;

      if (!rewrittenText) {
        return NextResponse.json(
          { error: "No rewritten text received" },
          { status: 500 }
        );
      }

      return NextResponse.json({ rewrittenText });
    }
  } catch (error) {
    console.error("Error in rewrite API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 