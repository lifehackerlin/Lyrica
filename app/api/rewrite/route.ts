import { NextRequest, NextResponse } from 'next/server';

// 处理POST请求
export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const { text, mode, language = 'en' } = await req.json();

    // 验证输入
    if (!text || !mode) {
      const errorMessage = language === 'zh' ? '缺少必要参数' : 'Missing required parameters';
      console.error('API错误: 缺少参数', { text: !!text, mode: !!mode, language });
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // 验证文本长度
    if (text.length > 5000) {
      const errorMessage = language === 'zh' 
        ? '文本长度超过限制(最大5000字符)' 
        : 'Text length exceeds limit (max 5000 characters)';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    console.log('处理请求:', { mode, language, textLength: text.length });

    // 调用OpenRouter API处理文本改写
    const result = await rewriteWithAI(text, mode, language);

    // 返回结果
    return NextResponse.json({ result });
  } catch (error) {
    console.error('API处理错误:', error);
    
    // 获取language变量
    let language = 'en';
    try {
      const { language: reqLanguage = 'en' } = await req.json();
      language = reqLanguage;
    } catch (e) {
      // 如果req.json()已经被读取或者发生错误，使用默认值
    }
    
    // 根据错误类型返回适当的错误信息
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: language === 'zh' ? 'API密钥配置错误' : 'API key configuration error' },
          { status: 401 }
        );
      } else if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: language === 'zh' ? '请求频率超限，请稍后再试' : 'Rate limit exceeded, please try again later' },
          { status: 429 }
        );
      }
    }
    
    const errorMessage = language === 'zh' 
      ? '服务器处理请求时出错' 
      : 'Error processing request on server';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// 调用AI进行改写
async function rewriteWithAI(text: string, mode: string, language: string): Promise<string> {
  try {
    // 使用新的API密钥
    const API_KEY = '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';
    
    console.log('API密钥状态:', { 
      hasKey: !!API_KEY, 
      keyLength: API_KEY.length
    });
    
    // 构建提示
    const systemPrompt = language === 'zh' 
      ? `你是一位多风格改写大师，擅长将一段原文改写为用户指定风格。支持以下改写模式：

1. 标准：忠实保留原意，只做流畅性提升和基础润色。
2. 正式：使用书面语、严谨句式和专业表达，适合商务、官方或职场场景。
3. 学术：采用学术风格，引用术语、逻辑严密，适合论文、研究报告。
4. 拓展：在不偏离原意的前提下添加细节、例子或解释，使内容更充实。
5. 总结：压缩内容，只保留核心观点和关键信息。
6. 故事化：将信息改写成生动的故事、场景或类比，使其更具代入感和趣味性。
7. 创意：自由发挥，可重组内容结构，加入修辞、比喻、夸张等手法，让语言富有创意。

请根据用户选择的模式对原文进行改写，仅输出改写结果，无需解释或重复模式名。`
      : `You are a master of multiple writing styles, skilled at rewriting text in a style specified by the user. You support the following rewriting modes:

1. Standard: Faithfully preserve the original meaning while improving flow and providing basic polish.
2. Formal: Use written language, rigorous sentence structures, and professional expressions, suitable for business, official, or workplace settings.
3. Academic: Adopt an academic style with references to terminology and rigorous logic, appropriate for papers and research reports.
4. Expanded: Add details, examples, or explanations without deviating from the original meaning to make the content more substantial.
5. Summary: Compress the content, keeping only the core points and key information.
6. Narrative: Rewrite information into vivid stories, scenes, or analogies to make it more engaging and interesting.
7. Creative: Freely restructure content, adding rhetorical devices, metaphors, exaggeration, and other techniques to make the language creative.

Please rewrite the original text according to the user's chosen mode. Output only the rewritten result without explanation or repeating the mode name.`;

    console.log('调用OpenRouter API...', { mode, language });
    
    // 调用API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://lyrica-ai.vercel.app',
        'X-Title': 'Lyrica AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.7-sonnet', // 使用最新的模型版本
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: language === 'zh'
            ? `请使用${mode}风格改写以下文本：\n\n${text}`
            : `Please rewrite the following text in ${mode} style:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    // 记录响应状态码
    console.log('OpenRouter API响应状态:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API错误响应详情:', errorData);
      
      // 处理特定的错误状态
      if (response.status === 401) {
        throw new Error('API key invalid or expired');
      } else if (response.status === 429) {
        throw new Error('rate limit exceeded');
      } else {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('API响应数据结构:', Object.keys(data));
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('OpenRouter API返回无效数据结构:', data);
      throw new Error('Invalid response data');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI调用错误详情:', error);
    throw error;
  }
}