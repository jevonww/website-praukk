"use client";

import { useEffect } from "react";

export default function AutoRefresh() {
  useEffect(() => {
    const interval = setInterval(() => {
// Removed window.location.reload()

    }, 60000); // 60 detik
    return () => clearInterval(interval);
  }, []);

  return null;
}
