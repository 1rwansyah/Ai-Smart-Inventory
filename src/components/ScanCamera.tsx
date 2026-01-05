// src/components/ScanCamera.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { Camera, Smartphone, AlertCircle } from "lucide-react";

type ScanCameraProps = {
  onScan: (file: File) => void;
};

export default function ScanCamera({ onScan }: ScanCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        setLoading(true);
        setError(null);
        
        // Stop previous stream
        stream?.getTracks().forEach((track) => track.stop());

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Akses kamera ditolak. Periksa izin kamera Anda.");
      } finally {
        setLoading(false);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  const toggleCamera = async () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip canvas if using front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
      onScan(file);
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="w-full space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Error Kamera</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}
      
      <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video max-h-96">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="animate-spin">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Camera Controls */}
      <div className="flex gap-2">
        <button
          onClick={capture}
          disabled={loading || !stream}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        <button
          onClick={toggleCamera}
          disabled={loading || !stream}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          title="Ganti Kamera"
        >
          <Smartphone className="w-5 h-5" />
        </button>
      </div>

      {/* Camera Info */}
      <div className="text-xs text-gray-600 text-center">
        <p>Kamera: {facingMode === "user" ? "Depan" : "Belakang"}</p>
      </div>
    </div>
  );
}
