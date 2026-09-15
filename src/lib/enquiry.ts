import { useSyncExternalStore } from "react";

/**
 * The visitor's enquiry list: products they want a quote for. Kept in localStorage so it survives
 * reloads on the same device, and shared between tabs through the storage event.
 */
export type EnquiryItem = { code: string; quantity: number };

const STORAGE_KEY = "hilife-enquiry";
const EMPTY: EnquiryItem[] = [];

let items: EnquiryItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(stored)) {
      items = stored.filter(
        (item): item is EnquiryItem => typeof item?.code === "string" && Number.isInteger(item?.quantity) && item.quantity > 0,
      );
    }
  } catch {
    items = EMPTY;
  }
}

function commit(next: EnquiryItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing or storage full: the list still works for this page view
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

export function useEnquiry() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function addToEnquiry(code: string, quantity = 1) {
  load();
  const existing = items.find((item) => item.code === code);
  commit(
    existing
      ? items.map((item) => (item.code === code ? { ...item, quantity: item.quantity + quantity } : item))
      : [...items, { code, quantity }],
  );
}

export function setEnquiryQuantity(code: string, quantity: number) {
  load();
  commit(
    quantity > 0
      ? items.map((item) => (item.code === code ? { ...item, quantity } : item))
      : items.filter((item) => item.code !== code),
  );
}

export function removeFromEnquiry(code: string) {
  setEnquiryQuantity(code, 0);
}
