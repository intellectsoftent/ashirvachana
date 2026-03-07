import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { cartApi, getUserToken } from "@/lib/api";

export interface CartItem {
  id: number;
  item_type: string;
  item_id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: { item_type: string; item_id: number; quantity?: number }) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const token = getUserToken();
    if (!token) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const raw = await cartApi.get();
      // Handle all possible API response shapes
      let cartItems: CartItem[] = [];
      if (Array.isArray(raw)) {
        cartItems = raw;
      } else if (raw && typeof raw === "object") {
        const d = raw as any;
        cartItems = Array.isArray(d.items) ? d.items
          : Array.isArray(d.cart) ? d.cart
          : Array.isArray(d.cart_items) ? d.cart_items
          : Array.isArray(d.data) ? d.data
          : [];
      }
      setItems(cartItems);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (item: { item_type: string; item_id: number; quantity?: number }) => {
    await cartApi.add({ item_type: item.item_type, item_id: item.item_id, quantity: item.quantity ?? 1 });
    await refreshCart();
  };

  const removeFromCart = async (cartItemId: number) => {
    await cartApi.remove(cartItemId);
    await refreshCart();
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    await cartApi.update(cartItemId, quantity);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartApi.clear();
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalPrice = items.reduce(
    (sum, i) =>
      sum +
      (i.unit_price ?? i.details?.price ?? i.price ?? 0) * (i.quantity || 1),
    0
  );

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
