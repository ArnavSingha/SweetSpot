import mongoose, { Schema, Document, models, model } from 'mongoose';
import type { Sweet, User, Purchase } from './types';

// Sweet Schema
const SweetSchema = new Schema<Sweet & Document>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    imageHint: { type: String },
  },
  { timestamps: true }
);

// User Schema
const UserSchema = new Schema<User & Document>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Purchase Schema
const PurchaseSchema = new Schema<Purchase & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sweetId: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
  }
);


export const SweetModel = models.Sweet || model<Sweet & Document>('Sweet', SweetSchema);
export const UserModel = models.User || model<User & Document>('User', UserSchema);
export const PurchaseModel = models.Purchase || model<Purchase & Document>('Purchase', PurchaseSchema);
