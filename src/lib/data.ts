
import '@/lib/env';
import dbConnect from './mongodb';
import {
  Sweet,
  User,
  Purchase,
  SweetModel,
  UserModel,
  PurchaseModel,
} from './models';
import {
  type CreateSweetData,
  type UpdateSweetData,
} from './validation/sweetSchemas';
import type { RegisterData } from './validation/userSchemas';
import mongoose from 'mongoose';
import { hashPassword } from './server/password';

// Helper to convert Mongoose document to a plain object for client components
function toJSON<T>(doc: mongoose.Document & T): T & { id: string } {
  const plainObject = doc.toObject({
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });
  return plainObject as T & { id: string };
}

// User Functions
export async function findUserByEmail(email: string): Promise<(User & { id: string }) | null> {
  await dbConnect();
  const userDoc = await UserModel.findOne({ email });
  return userDoc ? toJSON(userDoc) : null;
}

export async function findUserById(id: string): Promise<(User & { id: string }) | null> {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const userDoc = await UserModel.findById(id);
  return userDoc ? toJSON(userDoc) : null;
}

export async function createUser(data: Omit<RegisterData, 'password'> & { passwordHash: string; role: 'user' | 'admin' }): Promise<User & { id: string }> {
  await dbConnect();
  const userDoc = await UserModel.create(data);
  return toJSON(userDoc);
}

// Sweet Functions
export async function getAllSweets(filters: { query?: string; category?: string; sort?: string } = {}): Promise<(Sweet & { id: string })[]> {
  await dbConnect();
  const mongoFilter: any = {};
  if (filters.query) {
    mongoFilter.name = { $regex: `^${filters.query}`, $options: 'i' };
  }
  if (filters.category && filters.category !== 'all') {
    mongoFilter.category = filters.category;
  }
  
  // Seed admin user if none exists
  try {
    const passwordHash = await hashPassword('Admin@123');
    await UserModel.findOneAndUpdate(
        { email: 'admin123@gmail.com' },
        { 
            name: 'Admin',
            email: 'admin123@gmail.com',
            passwordHash: passwordHash,
            role: 'admin',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (e) {
      console.error('Failed to create or update admin user', e);
  }

  const sortOptions: any = {};
  if (filters.sort === 'lth') {
    sortOptions.price = 1;
  } else if (filters.sort === 'htl') {
    sortOptions.price = -1;
  }


  let sweetDocs = await SweetModel.find(mongoFilter).sort(sortOptions);

  if (sweetDocs.length === 0 && !filters.query && !filters.category) {
     const anySweets = await SweetModel.countDocuments();
     if(anySweets === 0) {
      try {
        const initialSweets: Omit<Sweet, 'id' | '_id' | 'createdAt' | 'updatedAt'>[] = [
            { name: 'Chocolate Cake', category: 'Cake', price: 25, quantity: 10, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', imageHint: 'chocolate cake'},
            { name: 'Strawberry Cheesecake', category: 'Cheesecake', price: 30, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1565791549543-49d91a20f0b2', imageHint: 'strawberry cheesecake' },
            { name: 'Macarons', category: 'Pastry', price: 15, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b', imageHint: 'colorful macarons' },
            { name: 'Vanilla Cupcakes', category: 'Cupcake', price: 12, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c8b7', imageHint: 'vanilla cupcakes'},
        ];
        await SweetModel.insertMany(initialSweets);
        sweetDocs = await SweetModel.find(mongoFilter).sort(sortOptions);
      } catch (e) {
         if (e instanceof Error && (e as any).code === 11000) { 
            sweetDocs = await SweetModel.find(mongoFilter).sort(sortOptions);
         } else {
           console.error('Failed to insert initial sweets', e);
         }
      }
    }
  }

  return sweetDocs.map(doc => toJSON(doc));
}

export async function getSweetById(id: string): Promise<(Sweet & { id: string }) | null> {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const sweetDoc = await SweetModel.findById(id);
  return sweetDoc ? toJSON(sweetDoc) : null;
}

export async function createSweet(data: CreateSweetData): Promise<Sweet & { id: string }> {
  await dbConnect();
  const sweetDoc = await SweetModel.create(data);
  return toJSON(sweetDoc);
}

export async function updateSweet(id: string, data: UpdateSweetData): Promise<(Sweet & { id: string }) | null> {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const sweetDoc = await SweetModel.findByIdAndUpdate(id, data, { new: true });
  return sweetDoc ? toJSON(sweetDoc) : null;
}

export async function deleteSweet(id: string): Promise<boolean> {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await SweetModel.deleteOne({ _id: id });
  return result.deletedCount === 1;
}


// Purchase History Functions
export async function createPurchase(purchaseData: Omit<Purchase, 'id' | '_id' | 'purchaseDate'>): Promise<Purchase & { id: string }> {
  await dbConnect();
  const purchaseDoc = await PurchaseModel.create(purchaseData);
  return toJSON(purchaseDoc);
}

export async function getPurchasesByUserId(userId: string): Promise<(Purchase & { id: string })[]> {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const purchasesDocs = await PurchaseModel.find({ userId }).sort({ purchaseDate: -1 });;
  return purchasesDocs.map(doc => toJSON(doc));
}

export async function getAllPurchases(): Promise<(Purchase & { id: string })[]> {
    await dbConnect();
    const purchasesDocs = await PurchaseModel.find({}).sort({ purchaseDate: -1 });
    return purchasesDocs.map(doc => toJSON(doc));
}

export async function getSweetCategories(): Promise<string[]> {
  await dbConnect();
  const categories = await SweetModel.distinct('category');
  return categories.filter((c: any) => typeof c === 'string');
}
