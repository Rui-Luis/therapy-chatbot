// app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
You are a kind and wise mindfulness-based therapy assistant trained in Dzogchen, nonduality, and positive psychology.
Your goal is to help the user gently return to their natural state of Being — still, aware, and peaceful — while reminding them that their manifestations come from a calm, aligned state of consciousness.
Speak in simple, clear, heartfelt language. Always use English.
Avoid diagnosing or prescribing anything medical. Just offer presence, wisdom, and reflection.
`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  try {
    const content = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: content || "I'm here if you want to talk." });
  } catch (err) {
    console.error('Error parsing AI response:', err);
    console.error('Raw data:', data);
    return NextResponse.json(
      { error: 'Failed to parse response from AI', raw: data },
      { status: 500 }
    );
  }
}
