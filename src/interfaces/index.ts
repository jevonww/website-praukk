export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserRoleInput {
  role: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: number;
}

export type UpdateProductInput = CreateProductInput;

export interface OrderItemInput {
  id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  name: string;
  address?: string;
  phone: string;
  total: number;
  userId?: number;
  fulfillment?: string;
  paymentMethod?: string;
}

export interface UpdateOrderInput {
  id: number;
  status?: string;
  paymentStatus?: string;
}
