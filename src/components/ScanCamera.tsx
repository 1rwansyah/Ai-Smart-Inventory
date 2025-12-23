// src/components/ScanCamera.tsx
"use client";

import { useRef, useEffect, useState } from "react";

type ScanCameraProps = {
  onScan: (file: File) => void;
};

export default function ScanCamera({ onScan }: ScanCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
      onScan(file);
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="space-y-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="border rounded w-full max-w-md"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button
        onClick={capture}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Capture
      </button>
    </div>
  );
}
