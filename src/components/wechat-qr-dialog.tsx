"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useRef, useState } from "react";

type WechatQrDialogProps = {
  alt: string;
  backdropLabel: string;
  closeLabel: string;
  imageSrc: string;
  label: string;
};

export function WechatQrDialog({ alt, backdropLabel, closeLabel, imageSrc, label }: WechatQrDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="about-contact-value about-contact-qr-trigger"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        {label}
      </button>
      {isOpen ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="wechat-qr-dialog"
          role="dialog"
        >
          <button
            aria-label={backdropLabel}
            className="wechat-qr-backdrop"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div className="wechat-qr-panel">
            <div className="wechat-qr-heading">
              <h3 id={titleId}>{label}</h3>
              <button
                aria-label={closeLabel}
                className="wechat-qr-close"
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                type="button"
              >
                {closeLabel}
              </button>
            </div>
            <img
              alt={alt}
              className="wechat-qr-image"
              src={imageSrc}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
