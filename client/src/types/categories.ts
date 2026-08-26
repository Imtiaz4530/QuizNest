export interface Exam {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  icon: string;
  isActive: boolean;
  isPopular: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamCardProps {
  exam: Exam;
}
