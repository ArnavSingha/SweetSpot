export type Sweet = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  imageHint: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
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
  userId: string;
  sweetId: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
