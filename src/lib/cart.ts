import type { CartLine } from "@/lib/types";

const KEY = "hour-abayas-cart";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((row) => {
      if (!row || typeof row !== "object") return [];
      const item = row as Partial<CartLine>;
      if (typeof item.productId !== "string" || typeof item.size !== "string") return [];
      const qty = Number(item.qty);
      if (!Number.isInteger(qty) || qty < 1) return [];
      return [{ productId: item.productId, size: item.size, qty }];
    });
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  emit();
}

export function cartCount(lines: CartLine[] = readCart()): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function clearCart() {
  writeCart([]);
}

/** Adds quantity if the resulting line still fits the live stock for that size. */
export function addToCart(line: CartLine, stock: number): { ok: true } | { ok: false; message: string } {
  if (stock < 1) return { ok: false, message: "هذا المقاس غير متوفر" };
  const lines = readCart();
  const index = lines.findIndex((item) => item.productId === line.productId && item.size === line.size);
  const nextQty = (index >= 0 ? lines[index].qty : 0) + line.qty;
  if (nextQty > stock) {
    return { ok: false, message: "الكمية المطلوبة أكبر من المتوفر لهذا المقاس" };
  }
  if (index >= 0) lines[index] = { ...lines[index], qty: nextQty };
  else lines.push({ ...line, qty: nextQty });
  writeCart(lines);
  return { ok: true };
}

export function setLineQty(
  productId: string,
  size: string,
  qty: number,
  stock: number,
): { ok: true } | { ok: false; message: string } {
  const lines = readCart();
  const index = lines.findIndex((item) => item.productId === productId && item.size === size);
  if (index < 0) return { ok: true };
  if (qty < 1) {
    lines.splice(index, 1);
    writeCart(lines);
    return { ok: true };
  }
  if (qty > stock) return { ok: false, message: "لا يمكن تجاوز كمية هذا المقاس" };
  lines[index] = { ...lines[index], qty };
  writeCart(lines);
  return { ok: true };
}

export function removeLine(productId: string, size: string) {
  writeCart(readCart().filter((item) => !(item.productId === productId && item.size === size)));
}
