"use client";

import { formatPrice } from "@/lib/utils";

export function QRISDisplay({
  amount,
  merchant = "Tahu Bakso Fresh",
  className = "",
}: {
  code: string;
  amount: number;
  merchant?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white rounded-2xl p-4 shadow-inner border border-gray-200 dark:border-gray-700">
        <img
          src="/qris.jpg"
          alt="QRIS Pembayaran"
          className="w-64 h-64 object-contain"
        />
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
    </div>
  );
}
