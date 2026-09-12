import mongoose, { Schema, Document } from 'mongoose';

export interface IInstrument extends Document {
  name: string;
  alternativeNames: string[];
  state: string;
  region: string;
  family: string;
  tradition: string;
  origin: string;
  description: string;
  history: string;
  construction: string;
  howItIsPlayed: string;
  culturalUses: string[];
  festivals: string[];
  community: string;
  materials: string[];
  interestingFacts: string[];
  imageUrl: string;
  audioUrl?: string | null;
  audioNote?: string;
  popularity: number;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InstrumentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    alternativeNames: [{ type: String, trim: true }],
    state: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    family: {
      type: String,
      required: true,
      enum: ['String', 'Wind', 'Percussion', 'Folk', 'Classical', 'Tribal', 'Keyboard / other'],
    },
    tradition: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    history: { type: String, required: true },
    construction: { type: String, required: true },
    howItIsPlayed: { type: String, required: true },
    culturalUses: [{ type: String, trim: true }],
    festivals: [{ type: String, trim: true }],
    community: { type: String, required: true, trim: true },
    materials: [{ type: String, trim: true }],
    interestingFacts: [{ type: String, trim: true }],
    imageUrl: { type: String, required: true, trim: true },
    audioUrl: { type: String, default: null },
    audioNote: { type: String, default: 'C4' },
    popularity: { type: Number, default: 80, min: 0, max: 100 },
    slug: { type: String, trim: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Search text index for fast search queries
InstrumentSchema.index({
  name: 'text',
  alternativeNames: 'text',
  state: 'text',
  tradition: 'text',
  description: 'text',
});

export const Instrument: mongoose.Model<IInstrument> =
  (mongoose.models.Instrument as mongoose.Model<IInstrument>) ||
  mongoose.model<IInstrument>('Instrument', InstrumentSchema);
