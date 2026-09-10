import ordersData from "@/data/orders.json";

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customerId: string;
  status: "processing" | "in_transit" | "delivered" | "cancelled";
  estimatedDeliveryDate: string;
  carrier: string | null;
  items: OrderItem[];
}

export interface OrderRepository {
  findAuthorizedById(orderId: string, customerId: string): Promise<OrderRecord | null>;
}

export class FixtureOrderRepository implements OrderRepository {
  private readonly orders = ordersData as OrderRecord[];

  async findAuthorizedById(orderId: string, customerId: string) {
    return this.orders.find((order) => order.id === orderId && order.customerId === customerId) ?? null;
  }
}
