import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Eye, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrders, Order } from "@/context/OrderContext";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const AdminOrders = () => {
  const { orders, loading, refreshOrders, updateOrderStatus } = useOrders();
  const [viewing, setViewing] = useState<Order | null>(null);
  const [panditInput, setPanditInput] = useState("");

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const assignPandit = async (orderId: string | number) => {
    if (panditInput.trim()) {
      await updateOrderStatus(orderId, { priest_name: panditInput.trim(), status: "confirmed" });
      setPanditInput("");
    }
  };


  const getTotal = (o: Order) => Number(o.totalWithGST ?? o.total_amount ?? 0);
  const getName = (o: Order) => o.customerName ?? o.customer_name ?? "";
  const getPhone = (o: Order) => o.customerPhone ?? o.customer_phone ?? "";
  const getEmail = (o: Order) => o.customerEmail ?? o.customer_email ?? "";
  const getLocation = (o: Order) => o.location ?? o.city ?? "";
  const getDate = (o: Order) => o.createdAt ?? o.created_at ?? "";
  const getPandit = (o: Order) => o.assignedPandit ?? o.priest_name ?? "";
  const getPaymentType = (o: Order) => o.paymentType ?? o.payment_status ?? "full";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Booked Orders</h2>
        <span className="font-body text-sm text-muted-foreground">{orders.length} total orders</span>
      </div>

      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">Total Revenue</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              ₹{orders
                .filter((o) => o.status !== "cancelled")
                .reduce((s, o) => s + Number(getTotal(o) || 0), 0)
                .toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">Total Orders</p>
            <p className="font-display text-2xl font-bold text-primary mt-1">
              {orders.filter((o) => o.status !== "cancelled").length}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <p className="font-body text-muted-foreground">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-display text-xl text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={String(order.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl shadow-card border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-display text-sm font-semibold text-foreground">#{String(order.id).slice(0, 8)}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                      getPaymentType(order) === "partial" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                    }`}>
                      {getPaymentType(order) === "partial" ? "Partial Payment" : "Full Payment"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="font-body text-xs text-muted-foreground">{getName(order)}</span>
                    <span className="font-body text-xs text-muted-foreground">{getLocation(order)}</span>
                    <span className="font-body text-xs font-medium text-primary">₹{getTotal(order).toLocaleString()}</span>
                    {getDate(order) && (
                      <span className="font-body text-xs text-muted-foreground">
                        {new Date(getDate(order)).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                  {getPandit(order) && (
                    <p className="font-body text-xs text-green-600 mt-1">Pandit: {getPandit(order)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewing(viewing?.id === order.id ? null : order)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>

              {viewing?.id === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Customer Details</p>
                      <p className="font-body text-sm text-foreground">{getName(order)}</p>
                      <p className="font-body text-sm text-muted-foreground">{getPhone(order)}</p>
                      <p className="font-body text-sm text-muted-foreground">{getEmail(order)}</p>
                      <p className="font-body text-sm text-muted-foreground">{getLocation(order)}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Items</p>
                      {(order.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 mb-1">
                          {(item.item_image || item.image || item.image_url) && <img src={item.item_image || item.image || item.image_url} alt={item.item_name || item.name} className="w-8 h-8 rounded object-cover" />}
                          <span className="font-body text-sm text-foreground">{item.item_name || item.name} x{item.quantity || 1}</span>
                          <span className="font-body text-xs text-primary ml-auto">₹{((item.unit_price || item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Payment</p>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-medium text-foreground">₹{getTotal(order).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!getPandit(order) && (
                    <div className="mt-4 flex gap-2">
                      <Input
                        value={panditInput}
                        onChange={(e) => setPanditInput(e.target.value)}
                        placeholder="Assign pandit name..."
                        className="bg-secondary/50 font-body max-w-xs"
                      />
                      <Button onClick={() => assignPandit(order.id)} size="sm" className="bg-gradient-gold text-primary-foreground font-body gap-1">
                        <UserCheck className="w-4 h-4" /> Assign
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {order.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, { status: "confirmed" })} className="font-body">
                        Confirm
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, { status: "completed" })} className="font-body">
                        Mark Completed
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, { status: "cancelled" })} className="font-body text-destructive">
                        Cancel
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
