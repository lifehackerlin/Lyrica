import { NextRequest, NextResponse } from "next/server";

interface DownloadRequest {
  text: string;
  format: "pdf" | "docx";
}

export async function POST(request: NextRequest) {
  try {
    const body: DownloadRequest = await request.json();
    const { text, format } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (format === "pdf") {
      // Generate PDF using a simple HTML to PDF approach
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Lyrica.ai 改写文本</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .content {
                font-size: 14px;
                text-align: justify;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Lyrica.ai 智能改写文本</h1>
              <p>由 Lyrica.ai 生成</p>
            </div>
            <div class="content">
              ${text.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `;

      // For a production app, you would use a library like puppeteer or a PDF generation service
      // For now, we'll create a simple text-based PDF alternative
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${text.length + 200} >>
stream
BT
/F1 12 Tf
50 750 Td
(AI Rewritten Text) Tj
0 -30 Td
(${text.replace(/[\(\)\\]/g, '\\$&').substring(0, 1000)}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000245 00000 n 
0000000${(400 + text.length).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${500 + text.length}
%%EOF`;

      return new NextResponse(pdfContent, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="rewritten-text.pdf"',
        },
      });
    } else if (format === "docx") {
      // Generate a simple Word document (RTF format for simplicity)
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 \\b Lyrica.ai 智能改写文本\\b0\\par
\\par
由 Lyrica.ai 生成\\par
\\par
${text.replace(/\n/g, '\\par ')}
}`;

      return new NextResponse(rtfContent, {
        headers: {
          'Content-Type': 'application/rtf',
          'Content-Disposition': 'attachment; filename="rewritten-text.rtf"',
        },
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported format" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in download API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
 