import NewsletterModel, { INewsletter } from './newsletter.model';

const createNewsletter = async (
  data: Partial<INewsletter>,
  adminId: string,
) => {
  const newsletter = new NewsletterModel({ ...data, createdBy: adminId });
  return await newsletter.save();
};

const getAllNewsletters = async () => {
  return await NewsletterModel.find().sort({ createdAt: -1 });
};

const updateNewsletter = async (id: string, data: Partial<INewsletter>) => {
  const updated = await NewsletterModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updated) throw new Error('Newsletter not found');
  return updated;
};

const getNewsletterById = async (id: string) => {
  const newsletter = await NewsletterModel.findById(id);
  if (!newsletter) throw new Error('Newsletter not found');
  return newsletter;
};

export const NewsletterService = {
  createNewsletter,
  getAllNewsletters,
  updateNewsletter,
  getNewsletterById,
};
