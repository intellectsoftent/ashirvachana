import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Eye, UserCheck, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrders, Order } from "@/context/OrderContext";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const { orders, updateOrder } = useOrders();
  const [viewing, setViewing] = useState<Order | null>(null);
  const [panditInput, setPanditInput] = useState("");

  const assignPandit = (orderId: string) => {
    if (panditInput.trim()) {
      updateOrder(orderId, { assignedPandit: panditInput.trim(), status: "confirmed" });
      setPanditInput("");
    }
  };

  const pendingPayments = orders.filter((o) => (o.balanceDue ?? 0) > 0 && o.status !== "cancelled");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Booked Orders</h2>
        <span className="font-body text-sm text-muted-foreground">{orders.length} total orders</span>
      </div>

      {/* Payment Summary Cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl shadow-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">Total Revenue</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">
              ₹{orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalWithGST, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">Advance Collected</p>
            <p className="font-display text-2xl font-bold text-primary mt-1">
              ₹{orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.advancePaid ?? o.totalWithGST), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-card border border-border p-4">
            <p className="font-body text-xs text-muted-foreground">Balance Pending</p>
            <p className="font-display text-2xl font-bold text-destructive mt-1">
              ₹{pendingPayments.reduce((s, o) => s + (o.balanceDue ?? 0), 0).toLocaleString()}
            </p>
            {pendingPayments.length > 0 && (
              <p className="font-body text-xs text-muted-foreground mt-1">{pendingPayments.length} orders with balance due</p>
            )}
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-display text-xl text-muted-foreground">No orders yet</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Orders will appear here after customers purchase</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl shadow-card border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-display text-sm font-semibold text-foreground">#{order.id.slice(0, 8)}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${
                      (order.paymentType ?? "full") === "partial" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                    }`}>
                      {(order.paymentType ?? "full") === "partial" ? "Partial Payment" : "Full Payment"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="font-body text-xs text-muted-foreground">{order.customerName}</span>
                    <span className="font-body text-xs text-muted-foreground">{order.location}</span>
                    <span className="font-body text-xs font-medium text-primary">₹{order.totalWithGST.toLocaleString()}</span>
                    {(order.balanceDue ?? 0) > 0 && (
                      <span className="font-body text-xs font-medium text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Balance: ₹{order.balanceDue?.toLocaleString()}
                      </span>
                    )}
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  {order.assignedPandit && (
                    <p className="font-body text-xs text-green-600 mt-1">Pandit: {order.assignedPandit}</p>
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
                      <p className="font-body text-sm text-foreground">{order.customerName}</p>
                      <p className="font-body text-sm text-muted-foreground">{order.customerPhone}</p>
                      <p className="font-body text-sm text-muted-foreground">{order.customerEmail}</p>
                      <p className="font-body text-sm text-muted-foreground">{order.location}</p>
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Items</p>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 mb-1">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                          <span className="font-body text-sm text-foreground">{item.name} x{item.quantity}</span>
                          <span className="font-body text-xs text-primary ml-auto">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-1">Payment Breakdown</p>
                      <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">Total (incl. GST)</span>
                          <span className="font-medium text-foreground">₹{order.totalWithGST.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-muted-foreground">Advance Paid</span>
                          <span className="font-medium text-primary">₹{(order.advancePaid ?? order.totalWithGST).toLocaleString()}</span>
                        </div>
                        {(order.balanceDue ?? 0) > 0 && (
                          <div className="flex justify-between font-body text-sm border-t border-border pt-2">
                            <span className="text-destructive font-medium">Balance Due</span>
                            <span className="font-bold text-destructive">₹{order.balanceDue?.toLocaleString()}</span>
                          </div>
                        )}
                        <p className="font-body text-xs text-muted-foreground pt-1">
                          {(order.paymentType ?? "full") === "partial"
                            ? "⚠️ Partial payment — collect balance before pooja"
                            : "✅ Full payment received"}
                        </p>
                      </div>

                      {/* Cancellation policy note for pooja orders */}
                      {order.items.some(i => i.type === "pooja") && order.status !== "cancelled" && order.status !== "completed" && (
                        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2">
                          <p className="font-body text-xs text-orange-800 font-medium mb-1">Cancellation Policy</p>
                          <p className="font-body text-[11px] text-orange-700">2+ days: Full refund</p>
                          <p className="font-body text-[11px] text-orange-700">Within 48hrs: 50% refund</p>
                          <p className="font-body text-[11px] text-orange-700">Event day: No refund</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!order.assignedPandit && order.items.some(i => i.type === "pooja") && (
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
                      <Button size="sm" variant="outline" onClick={() => updateOrder(order.id, { status: "confirmed" })} className="font-body">
                        Confirm
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button size="sm" variant="outline" onClick={() => updateOrder(order.id, { status: "completed" })} className="font-body">
                        Mark Completed
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateOrder(order.id, { status: "cancelled" })} className="font-body text-destructive">
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
