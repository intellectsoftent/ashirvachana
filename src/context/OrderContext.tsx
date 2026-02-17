import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Order {
  id: string;
  items: { id: string; name: string; price: number; image: string; quantity: number; type: "idol" | "pooja" }[];
  totalPrice: number;
  totalWithGST: number;
  advancePaid: number;
  balanceDue: number;
  paymentType: "full" | "partial";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  location: string;
  assignedPandit?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem("admin_orders");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("admin_orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);
  const updateOrder = (id: string, data: Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));
  const deleteOrder = (id: string) => setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
