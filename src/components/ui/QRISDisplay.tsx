"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const SIZE = 25;

function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isInFinder(row: number, col: number) {
  const corners = [
    [0, 0],
    [0, SIZE - 7],
    [SIZE - 7, 0],
  ];
  for (const [r, c] of corners) {
    if (row >= r && row < r + 7 && col >= c && col < c + 7) return true;
  }
  return false;
}

function finderCell(row: number, col: number) {
  const corners = [
    [0, 0],
    [0, SIZE - 7],
    [SIZE - 7, 0],
  ];
  for (const [r, c] of corners) {
    const lr = row - r;
    const lc = col - c;
    if (lr < 0 || lr > 6 || lc < 0 || lc > 6) continue;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
  }
  return false;
}

export function QRISDisplay({
  code,
  amount,
  merchant = "Tahu Bakso Fresh",
  className = "",
}: {
  code: string;
  amount: number;
  merchant?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const rand = mulberry32(hashString(code + ":" + amount));

  const cells: boolean[] = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (isInFinder(row, col)) {
        cells.push(finderCell(row, col));
      } else {
        cells.push(rand() > 0.52);
      }
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white rounded-2xl p-4 shadow-inner border border-gray-200 dark:border-gray-700">
        <div
          className="grid gap-[2px] p-3 bg-white"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            width: "min(260px, 70vw)",
          }}
        >
          {cells.map((filled, i) => (
            <div
              key={i}
              className="aspect-square"
              style={{ backgroundColor: filled ? "#0f172a" : "transparent" }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl shadow">
        <span className="w-8 h-8 bg-white rounded flex items-center justify-center">
          <span className="text-[10px] font-extrabold text-green-500 leading-none">
            QRIS
          </span>
        </span>
        <div className="text-left leading-tight">
          <p className="text-[10px] opacity-90">QRIS Standar Nasional</p>
          <p className="text-xs font-bold">{formatPrice(amount)}</p>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{merchant}</p>

      <div className="mt-3 w-full max-w-xs bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            No. Transaksi
          </p>
          <p className="font-mono font-semibold text-sm text-gray-900 dark:text-white truncate">
            {code}
          </p>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          aria-label="Salin nomor transaksi"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
