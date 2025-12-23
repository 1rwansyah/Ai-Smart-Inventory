import { ScanResult } from "@/types/scan";

export function parseScanText(text: string): ScanResult | null {
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return parsed;
  } catch (err) {
    console.error("Failed to parse scan text:", err);
    return null;
  }
}
