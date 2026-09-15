"use client";

import { useId, useState } from "react";
import type { ProgressMedia } from "@/types/domain";
import { createId } from "@/lib/mock/ids";

const MAX_FILES = 6;
const MAX_IMAGE_EDGE = 480;

async function fileToMedia(file: File): Promise<ProgressMedia> {
  const kind = file.type.startsWith("video/") ? "video" : "image";
  if (kind === "video") {
    return {
      id: createId("med"),
      kind,
      name: file.name,
      thumbnailUrl: null,
    };
  }

  const thumbnailUrl = await compressImage(file);
  return {
    id: createId("med"),
    kind,
    name: file.name,
    thumbnailUrl,
  };
}

function compressImage(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

type MediaPickerProps = {
  value: ProgressMedia[];
  onChange: (files: ProgressMedia[]) => void;
};

export function MediaPicker({ value, onChange }: MediaPickerProps) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);

  const onFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setBusy(true);
    const remaining = MAX_FILES - value.length;
    const picked = Array.from(list).slice(0, remaining);
    const next = await Promise.all(picked.map(fileToMedia));
    onChange([...value, ...next]);
    setBusy(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="landing-tracked inline-flex cursor-pointer border border-black/15 bg-white px-3 py-2 text-[10px] font-semibold text-jf-ink hover:border-jf-ink"
        >
          {busy ? "Adding…" : "Add photos / video"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          disabled={busy || value.length >= MAX_FILES}
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="text-[11px] text-jf-muted">
          {value.length}/{MAX_FILES} · previews stay on this device for now
        </span>
      </div>

      {value.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((file) => (
            <li
              key={file.id}
              className="relative aspect-[4/3] border border-black/10 bg-[#e8e8e4]"
            >
              {file.kind === "image" && file.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.thumbnailUrl}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center px-2 text-center">
                  <span className="landing-tracked text-[8px] text-jf-muted">
                    Video
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((f) => f.id !== file.id))}
                className="absolute top-1 right-1 cursor-pointer bg-jf-ink/80 px-1.5 py-0.5 text-[9px] text-white"
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
