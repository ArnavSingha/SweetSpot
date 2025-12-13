export type Sweet = {
  id: string;
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imageHint: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type Purchase = {
  id: string;
  _id: string;
  userId: string;
  sweetId: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: Date;
};
