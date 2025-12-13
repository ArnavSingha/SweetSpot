import '@/lib/env';
import clientPromise from './mongodb';
import type { Sweet, User, Purchase, Session } from './types';
import { ObjectId } from 'mongodb';

async function getDb() {
    if (!process.env.MONGODB_URI) {
        console.warn("MONGODB_URI not found. Using in-memory data store.");
        return null;
    }
    try {
        const client = await clientPromise;
        return client.db();
    } catch (e) {
        console.error("Failed to connect to MongoDB", e);
        return null;
    }
}

// Helper to convert MongoDB document _id to string
function fromMongo<T extends { _id: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest as Omit<T, '_id'> };
}

// In-memory data store
let mockSweets: Sweet[] = [
    { id: '1', name: 'Chocolate Cake', category: 'Cake', price: 25, quantity: 10, imageUrl: 'https://picsum.photos/seed/1/400/300', imageHint: 'chocolate cake' },
    { id: '2', name: 'Strawberry Cheesecake', category: 'Cheesecake', price: 30, quantity: 5, imageUrl: 'https://picsum.photos/seed/2/400/300', imageHint: 'strawberry cheesecake' },
    { id: '3', name: 'Macarons', category: 'Pastry', price: 15, quantity: 20, imageUrl: 'https://picsum.photos/seed/3/400/300', imageHint: 'colorful macarons' },
    { id: '4', name: 'Vanilla Cupcakes', category: 'Cupcake', price: 12, quantity: 15, imageUrl: 'https://picsum.photos/seed/4/400/300', imageHint: 'vanilla cupcakes' }
];
let mockUsers: User[] = [
    { id: '1', email: 'user@sweetspot.com', passwordHash: 'password123', role: 'user' },
    { id: '2', email: 'admin@sweetspot.com', passwordHash: 'admin', role: 'admin' },
];
let mockPurchases: Purchase[] = [];
let mockSessions: Session[] = [];

// API functions to interact with the data
export async function getAllSweets(filters: { query?: string; category?: string } = {}): Promise<Sweet[]> {
    const db = await getDb();
    if (db) {
        const mongoFilter: any = {};
        if (filters.query) {
            mongoFilter.name = { $regex: filters.query, $options: 'i' };
        }
        if (filters.category && filters.category !== 'all') {
            mongoFilter.category = filters.category;
        }
        const sweetsDocs = await db.collection('sweets').find(mongoFilter).toArray();
        return sweetsDocs.map(doc => fromMongo(doc as any));
    } else {
        // Mock implementation
        return mockSweets.filter(s => {
            const queryMatch = !filters.query || s.name.toLowerCase().includes(filters.query.toLowerCase());
            const categoryMatch = !filters.category || filters.category === 'all' || s.category === filters.category;
            return queryMatch && categoryMatch;
        });
    }
}

export async function getSweetById(id: string): Promise<Sweet | undefined> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(id)) return undefined;
        const sweetDoc = await db.collection('sweets').findOne({ _id: new ObjectId(id) });
        return sweetDoc ? fromMongo(sweetDoc as any) : undefined;
    } else {
        return mockSweets.find(s => s.id === id);
    }
}

export async function getSweetCategories(): Promise<string[]> {
    const db = await getDb();
    if (db) {
        return await db.collection('sweets').distinct('category');
    } else {
        return [...new Set(mockSweets.map(s => s.category))];
    }
}

export async function createSweet(sweetData: Omit<Sweet, 'id'>): Promise<Sweet> {
    const db = await getDb();
    if (db) {
        const result = await db.collection('sweets').insertOne(sweetData);
        return fromMongo({ ...sweetData, _id: result.insertedId } as any);
    } else {
        const newSweet: Sweet = { id: new ObjectId().toString(), ...sweetData };
        mockSweets.push(newSweet);
        return newSweet;
    }
}

export async function updateSweet(id: string, data: Partial<Omit<Sweet, 'id'>>): Promise<Sweet | null> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(id)) return null;
        const result = await db.collection('sweets').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: data },
            { returnDocument: 'after' }
        );
        return result ? fromMongo(result as any) : null;
    } else {
        const index = mockSweets.findIndex(s => s.id === id);
        if (index > -1) {
            mockSweets[index] = { ...mockSweets[index], ...data };
            return mockSweets[index];
        }
        return null;
    }
}

export async function deleteSweet(id: string): Promise<boolean> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(id)) return false;
        const result = await db.collection('sweets').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    } else {
        const initialLength = mockSweets.length;
        mockSweets = mockSweets.filter(s => s.id !== id);
        return mockSweets.length < initialLength;
    }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    if (db) {
        const userDoc = await db.collection('users').findOne({ email });
        return userDoc ? fromMongo(userDoc as any) : undefined;
    } else {
        return mockUsers.find(u => u.email === email);
    }
}

export async function findUserById(id: string): Promise<User | undefined> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(id)) return undefined;
        const userDoc = await db.collection('users').findOne({ _id: new ObjectId(id) });
        return userDoc ? fromMongo(userDoc as any) : undefined;
    } else {
        return mockUsers.find(u => u.id === id);
    }
}

export async function createSession(userId: string, expiresIn: number): Promise<Session> {
    const db = await getDb();
    const expiresAt = new Date(Date.now() + expiresIn);
    if (db) {
        const session = { userId: new ObjectId(userId), expiresAt };
        const result = await db.collection('sessions').insertOne(session);
        return fromMongo({ _id: result.insertedId, ...session } as any);
    } else {
        const newSession: Session = { id: new ObjectId().toString(), userId, expiresAt };
        mockSessions.push(newSession);
        return newSession;
    }
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(sessionId)) return undefined;
        return await db.collection('sessions').findOne({ 
            _id: new ObjectId(sessionId),
            expiresAt: { $gt: new Date() }
        }).then(doc => doc ? fromMongo(doc as any) : undefined);
    } else {
        return mockSessions.find(s => s.id === sessionId && s.expiresAt > new Date());
    }
}

export async function deleteSession(sessionId: string): Promise<void> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(sessionId)) return;
        await db.collection('sessions').deleteOne({ _id: new ObjectId(sessionId) });
    } else {
        mockSessions = mockSessions.filter(s => s.id !== sessionId);
    }
}

export async function createPurchase(purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>): Promise<Purchase> {
    const db = await getDb();
    const purchaseToInsert = {
        ...purchaseData,
        purchaseDate: new Date().toISOString()
    };
    if (db) {
        const result = await db.collection('purchases').insertOne({ ...purchaseToInsert, userId: new ObjectId(purchaseData.userId), sweetId: new ObjectId(purchaseData.sweetId) });
        return fromMongo({ ...purchaseToInsert, _id: result.insertedId, userId: purchaseData.userId, sweetId: purchaseData.sweetId } as any);
    } else {
        const newPurchase: Purchase = { id: new ObjectId().toString(), ...purchaseToInsert };
        mockPurchases.push(newPurchase);
        return newPurchase;
    }
}

export async function getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    const db = await getDb();
    if (db) {
        if (!ObjectId.isValid(userId)) return [];
        const purchasesDocs = await db.collection('purchases').find({ userId: new ObjectId(userId) }).toArray();
        return purchasesDocs.map(doc => fromMongo(doc as any));
    } else {
        return mockPurchases.filter(p => p.userId === userId);
    }
}
