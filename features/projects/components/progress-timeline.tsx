"use client";

import { useState } from "react";
import type { ProgressUpdate } from "@/types/domain";
import { formatDate } from "@/lib/format";

export function ProgressTimeline({ items }: { items: ProgressUpdate[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-black/15 bg-white px-5 py-10 text-center">
        <p className="text-sm text-jf-muted">
          No progress photos or updates yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <ol className="relative space-y-0 border border-black/10 bg-white">
        {items.map((item, index) => {
          const files = item.mediaFiles ?? [];
          const slots =
            files.length > 0
              ? files
              : Array.from({
                  length: Math.max(
                    1,
                    Math.min(6, item.photoCount + (item.videoCount > 0 ? 1 : 0)),
                  ),
                }).map((_, i) => {
                  const isVideo =
                    item.videoCount > 0 &&
                    i ===
                      Math.max(
                        0,
                        Math.min(
                          5,
                          item.photoCount + (item.videoCount > 0 ? 1 : 0),
                        ) - 1,
                      ) &&
                    item.photoCount <
                      Math.min(6, item.photoCount + (item.videoCount > 0 ? 1 : 0));
                  return {
                    id: `${item.id}-${i}`,
                    kind: (isVideo ? "video" : "image") as "image" | "video",
                    name: isVideo ? "Video" : `Photo ${i + 1}`,
                    thumbnailUrl: null as string | null,
                  };
                });

          return (
            <li
              key={item.id}
              className="grid gap-4 border-b border-black/8 px-4 py-5 last:border-b-0 md:grid-cols-[7.5rem_1fr] md:px-5"
            >
              <div>
                <p className="text-xs font-medium tabular-nums text-jf-muted">
                  {formatDate(item.createdAt)}
                </p>
                <p className="mt-2 landing-tracked text-[9px] font-medium text-jf-muted">
                  {String(items.length - index).padStart(2, "0")}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-jf-ink">
                    {item.title}
                  </h3>
                  <span className="landing-tracked border border-black/15 px-2 py-0.5 text-[8px] font-semibold text-jf-muted">
                    {item.mediaLabel}
                  </span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-jf-muted">
                  {item.description}
                </p>
                {item.linkedDeliveryLabel ? (
                  <p className="mt-3 inline-flex border border-jf-red/30 bg-jf-red/5 px-2.5 py-1 text-[11px] text-jf-ink">
                    Linked delivery: {item.linkedDeliveryLabel}
                  </p>
                ) : null}
                <p className="mt-3 text-[11px] text-jf-muted">
                  Uploaded by {item.createdByName}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-md sm:grid-cols-4">
                  {slots.map((file, slot) => (
                    <button
                      key={file.id}
                      type="button"
                      className="relative aspect-[4/3] cursor-pointer border border-black/10 bg-[#e8e8e4] p-0"
                      onClick={() => {
                        if (file.thumbnailUrl) setLightbox(file.thumbnailUrl);
                      }}
                      aria-label={file.name}
                    >
                      {file.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={file.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <div
                            className="absolute inset-0 opacity-40"
                            style={{
                              backgroundImage:
                                "linear-gradient(135deg, #d0d0cc 25%, transparent 25%), linear-gradient(225deg, #d0d0cc 25%, transparent 25%)",
                              backgroundSize: "12px 12px",
                            }}
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-jf-ink/70 px-2 py-1">
                            <span className="landing-tracked text-[8px] text-white/90">
                              {file.kind === "video"
                                ? "Video"
                                : `Photo ${slot + 1}`}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {lightbox ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-jf-ink/80 p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Progress media"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}
    </>
  );
}
