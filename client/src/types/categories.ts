export interface Exam {
  id: number;
  title: string;
  description: string;
  category: string;
  questions: number;
  participants: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export interface ExamCardProps {
  exam: Exam;
}
