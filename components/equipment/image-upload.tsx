"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      // Update form value with the public URL
      onChange(result.url);
      setPreviewUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!previewUrl && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
            isDragging && "border-primary bg-primary/5",
            !isDragging && "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
            isUploading && "cursor-wait"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-sm text-gray-600">Uploading image...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WebP or GIF (max. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative rounded-lg border border-gray-300 overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            <img
              src={previewUrl}
              alt="Equipment preview"
              className="w-full h-full object-contain"
            />
          </div>

          {!disabled && !isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <ImageIcon className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {!error && !previewUrl && !isUploading && (
        <p className="text-xs text-gray-500">
          Upload an image to help identify this equipment
        </p>
      )}
    </div>
  );
}
