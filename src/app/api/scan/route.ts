//src/app/api/scan/route.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
            {
              text: `
Kembalikan HANYA JSON VALID.
JANGAN markdown.
JANGAN penjelasan.

{
  "name": "",
  "brand": "",
  "category": "",
  "sku": "",
  "expired_date": ""
}
`
            }
          ]
        }
      ]
    });

    return NextResponse.json({
      text: result.text,
    });
  } catch (e) {
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}








