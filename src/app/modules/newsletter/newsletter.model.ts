import { Schema, Types, model } from 'mongoose';

export interface INewsletter extends Document {
  title: string;
  content: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const NewsletterModel = model<INewsletter>('Newsletter', NewsletterSchema);

export default NewsletterModel;
