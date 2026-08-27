"use client";

import { useSyncExternalStore } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  address?: string | null;
  phone?: string | null;
  createdAt?: string;
}

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function useTheme() {
  return useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
}

let cachedRaw: string | null | undefined;
let cachedUser: AuthUser | null = null;

function getUserSnapshot(): AuthUser | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem("user");
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedUser;
  cachedRaw = raw;
  try {
    cachedUser = raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("tb-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("tb-auth-change", callback);
  };
}

export function useUser() {
  return useSyncExternalStore(subscribeAuth, getUserSnapshot, () => null);
}

export function notifyAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("tb-auth-change"));
}
