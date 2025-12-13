import { PlaceHolderImages } from './placeholder-images';
import type { Sweet, User, Purchase, Session } from './types';

// Mock database tables
let sweets: Sweet[] = PlaceHolderImages.map((img, index) => ({
  id: img.id,
  name: img.description.split(' with')[0].split(',')[0],
  category: ['Cake', 'Pastry', 'Cookie', 'Dessert'][index % 4],
  price: parseFloat((Math.random() * (15 - 3) + 3).toFixed(2)),
  quantity: Math.floor(Math.random() * 50),
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));

let users: User[] = [
  { id: 'user-1', email: 'admin@sweetspot.com', passwordHash: 'admin', role: 'admin' },
  { id: 'user-2', email: 'user@sweetspot.com', passwordHash: 'user', role: 'user' },
];

let purchases: Purchase[] = [];

let sessions: Session[] = [];

// API functions to interact with the mock data
export async function getAllSweets(filters: { query?: string; category?: string } = {}): Promise<Sweet[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  let filteredSweets = [...sweets];

  if (filters.query) {
    filteredSweets = filteredSweets.filter(sweet =>
      sweet.name.toLowerCase().includes(filters.query!.toLowerCase())
    );
  }

  if (filters.category && filters.category !== 'all') {
    filteredSweets = filteredSweets.filter(sweet => sweet.category === filters.category);
  }

  return filteredSweets;
}

export async function getSweetById(id: string): Promise<Sweet | undefined> {
  return sweets.find(sweet => sweet.id === id);
}

export async function getSweetCategories(): Promise<string[]> {
  const categories = new Set(sweets.map(sweet => sweet.category));
  return Array.from(categories);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    users[userIndex] = { ...users[userIndex], ...data };
    return users[userIndex];
}


export async function createSweet(sweetData: Omit<Sweet, 'id'>): Promise<Sweet> {
    const newSweet: Sweet = {
        id: `sweet-${Date.now()}`,
        ...sweetData,
    };
    sweets.push(newSweet);
    return newSweet;
}

export async function updateSweet(id: string, data: Partial<Sweet>): Promise<Sweet | null> {
    const sweetIndex = sweets.findIndex(s => s.id === id);
    if (sweetIndex === -1) return null;
    sweets[sweetIndex] = { ...sweets[sweetIndex], ...data };
    return sweets[sweetIndex];
}


export async function deleteSweet(id: string): Promise<boolean> {
    const initialLength = sweets.length;
    sweets = sweets.filter(s => s.id !== id);
    return sweets.length < initialLength;
}


export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(user => user.email === email);
}

export async function findUserById(id: string): Promise<User | undefined> {
    return users.find(user => user.id === id);
}

export async function createSession(userId: string, expiresIn: number): Promise<Session> {
  const session = {
    id: `session-${Date.now()}`,
    userId,
    expiresAt: new Date(Date.now() + expiresIn),
  };
  sessions.push(session);
  return session;
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
  return sessions.find(s => s.id === sessionId && s.expiresAt > new Date());
}

export async function deleteSession(sessionId: string): Promise<void> {
    sessions = sessions.filter(s => s.id !== sessionId);
}

export async function createPurchase(purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>): Promise<Purchase> {
    const purchase: Purchase = {
        id: `purchase-${Date.now()}`,
        ...purchaseData,
        purchaseDate: new Date().toISOString(),
    };
    purchases.push(purchase);
    return purchase;
}

export async function getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    return purchases.filter(p => p.userId === userId);
}
