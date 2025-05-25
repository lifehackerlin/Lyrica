import { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Lyrica AI - 智能文本改写助手 | AI写作工具 | 文案生成器',
  description: '专业的AI文本改写工具，支持多种写作风格。轻松实现文章改写、润色、扩写和压缩。适用于论文、商务文档、创意写作等场景。',
  keywords: 'AI写作,文本改写,文案生成,智能写作助手,文章润色,论文改写,AI写作工具,文本优化,内容创作,人工智能写作',
  authors: [{ name: 'Lyrica AI Team' }],
  openGraph: {
    title: 'Lyrica AI - 智能文本改写助手',
    description: '专业的AI文本改写工具，支持多种写作风格。轻松实现文章改写、润色、扩写和压缩。',
    url: 'https://lyrica-ai.vercel.app',
    siteName: 'Lyrica AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lyrica AI - 智能文本改写助手',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lyrica AI - 智能文本改写助手',
    description: '专业的AI文本改写工具，支持多种写作风格。轻松实现文章改写、润色、扩写和压缩。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'll9dhZa4pZsyZXWkYGY-TctLr_u1g5TbWarfcMRiMVs'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="canonical" href="https://lyrica-ai.vercel.app" />
        <meta name="baidu-site-verification" content="your-baidu-verification-code" />
        <meta name="google-site-verification" content="ll9dhZa4pZsyZXWkYGY-TctLr_u1g5TbWarfcMRiMVs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Plausible Analytics */}
        <script defer data-domain="lyrica-three.vercel.app" src="https://plausible.io/js/script.js"></script>
        
        {/* Microsoft Clarity */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rozjrrp5fi");
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
