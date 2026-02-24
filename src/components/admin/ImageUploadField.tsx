import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const ImageUploadField = ({ imageUrl, onImageUrlChange, onFileSelect, selectedFile }: ImageUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewSrc = selectedFile ? URL.createObjectURL(selectedFile) : imageUrl;

  return (
    <div className="md:col-span-2">
      <label className="font-body text-sm font-medium text-foreground mb-2 block">Image</label>
      <div className="flex gap-4 items-start">
        {/* File upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-28 h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-secondary/30 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden flex-shrink-0"
        >
          {previewSrc ? (
            <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="font-body text-xs text-muted-foreground">Upload</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onFileSelect(file);
          }}
        />
        <div className="flex-1 space-y-2">
          {selectedFile && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <span className="font-body text-xs text-foreground truncate flex-1">{selectedFile.name}</span>
              <button onClick={() => { onFileSelect(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          )}
          <div>
            <span className="font-body text-xs text-muted-foreground">Or paste image URL:</span>
            <Input
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://..."
              className="bg-secondary/50 font-body mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;
