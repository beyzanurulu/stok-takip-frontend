import React from "react";
import { X } from "lucide-react";

export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog" role="document">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="btn btn--ghost" aria-label="Kapat" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </div>
  );
}


