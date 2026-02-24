import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ordersApi, getAdminToken } from "@/lib/api";

export interface Order {
  id: number | string;
  order_type?: string;
  items: any[];
  total_amount?: number;
  totalPrice?: number;
  totalWithGST?: number;
  advancePaid?: number;
  advance_paid?: number;
  balanceDue?: number;
  balance_due?: number;
  paymentType?: string;
  payment_status?: string;
  customer_name?: string;
  customerName?: string;
  customer_phone?: string;
  customerPhone?: string;
  customer_email?: string;
  customerEmail?: string;
  location?: string;
  city?: string;
  assignedPandit?: string;
  priest_name?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (id: string | number, body: Record<string, any>) => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({} as OrderContextType);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      let data: any;
      if (token) {
        data = await ordersApi.adminGetAll();
      } else {
        data = await ordersApi.getMyOrders().catch(() => []);
      }
      const list = Array.isArray(data) ? data : (data as any)?.orders ?? (data as any)?.data ?? [];
      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const updateOrderStatus = async (id: string | number, body: Record<string, any>) => {
    await ordersApi.adminUpdateStatus(id, body);
    await refreshOrders();
  };

  return (
    <OrderContext.Provider value={{ orders, loading, refreshOrders, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
