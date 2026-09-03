import { type FormEvent } from "react";

export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface ProfileData {
  _id: string;
  userId: ProfileUser;
  gender: "male" | "female";
  dateOfBirth: string | null;
  phone: number | string;
  bio: string;
  educationLevel: "SSC" | "HSC" | "Undergraduate" | "Graduate" | "Other";
  group: "science" | "arts" | "commerce";
  examPreferences: string[];
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  profile: ProfileData;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile: ProfileData;
}

export interface ProfileFormData {
  gender: "male" | "female";
  dateOfBirth: string;
  phone: string;
  bio: string;
  educationLevel: "SSC" | "HSC" | "Undergraduate" | "Graduate" | "Other";
  group: "science" | "arts" | "commerce";
  examPreferences: string[];
  socialLinks: SocialLinks;
}

// Profile Form
export interface ProfileFormProps {
  formData: ProfileFormData;
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  updateField: (field: keyof ProfileFormData, value: string) => void;
  updateSocialLink: (field: keyof SocialLinks, value: string) => void;
}

export interface QuizStats {
  quizzesCompleted: number;
  questionsAnswered: number;
  averageScore: number;
}

// Profile View
export interface ProfileViewProps {
  profile: ProfileData;
  initials: string;
  memberSince: string;
  statsLoading: boolean;
  quizStats: QuizStats;
}
