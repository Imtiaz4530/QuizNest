export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Exam {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: Category;
  icon: string;
  isActive: boolean;
  isPopular: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
