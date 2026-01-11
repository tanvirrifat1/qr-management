import { model, Schema } from 'mongoose';
import { IAbout } from './about.interface';

const aboutSchema = new Schema<IAbout>(
  {
    description: { type: String, required: true },
    location: { type: String, required: true },
    memberSince: { type: String, required: true },
    seller: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const About = model<IAbout>('About', aboutSchema);
