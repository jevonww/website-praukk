import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const GUEST_KEY = "cart-storage";
const keyForOwner = (ownerId: number | null) =>
  ownerId ? `cart-storage:user:${ownerId}` : GUEST_KEY;

let currentKey = GUEST_KEY;

const cartStorage = {
  getItem() {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(currentKey);
    } catch {
      return null;
    }
  },
  setItem(_name: string, value: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(currentKey, value);
    } catch {
      // storage unavailable
    }
  },
  removeItem() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(currentKey);
    } catch {
      // storage unavailable
    }
  },
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage", storage: createJSONStorage(() => cartStorage) }
  )
);

function readCart(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items = parsed?.state?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeCart(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify({ state: { items }, version: 0 }));
  } catch {
    // storage unavailable
  }
}

function mergeItems(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const map = new Map<number, CartItem>();
  for (const item of base) map.set(item.id, { ...item });
  for (const item of incoming) {
    const existing = map.get(item.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + item.quantity, existing.stock);
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
}

export function syncCartOwner(ownerId: number | null) {
  const nextKey = keyForOwner(ownerId);
  if (nextKey === currentKey) return;

  const fromGuest = currentKey === GUEST_KEY;
  if (fromGuest) {
    const guestItems = readCart(GUEST_KEY);
    if (guestItems.length > 0) {
      const existingUserItems = readCart(nextKey);
      writeCart(nextKey, mergeItems(existingUserItems, guestItems));
      try {
        window.localStorage.removeItem(GUEST_KEY);
      } catch {
        // storage unavailable
      }
    }
  }

  currentKey = nextKey;
  useCart.setState({ items: readCart(nextKey) });
}
