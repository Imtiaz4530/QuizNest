import { Loader2, Pencil } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../lib/axios";
import ProfileForm from "../components/ProfileForm";
import ProfileView from "../components/ProfileView";
import type {
  SocialLinks,
  ProfileData,
  ProfileResponse,
  UpdateProfileResponse,
  ProfileFormData,
} from "../types/profile";
import type { ApiErrorResponse } from "../types/auth";

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [quizStats, setQuizStats] = useState({
    quizzesCompleted: 0,
    questionsAnswered: 0,
    averageScore: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const [formData, setFormData] = useState<ProfileFormData | null>(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get<ProfileResponse>("/profiles/me");

        setProfile(response.data.profile);
      } catch (error) {
        if ((error as any)?.response?.data?.message) {
          toast.error((error as any).response.data.message);
        } else {
          toast.error("Unable to load your profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchQuizStats = async () => {
      try {
        setStatsLoading(true);

        const response = await api.get("/quiz-attempts/my");

        const attempts = response.data.attempts || [];

        const quizzesCompleted = attempts.length;

        const questionsAnswered = attempts.reduce(
          (total: number, attempt: any) => {
            return total + (attempt.answers?.length || 0);
          },
          0,
        );

        const totalQuestions = attempts.reduce(
          (total: number, attempt: any) => {
            return total + (attempt.answers?.length || 0);
          },
          0,
        );

        // const totalCorrect = attempts.reduce((total: number, attempt: any) => {
        //   return (
        //     total +
        //     (attempt.answers?.filter((answer: any) => answer.isCorrect)
        //       .length || 0)
        //   );
        // }, 0);

        const totalScore = attempts.reduce(
          (total: number, attempt: any) => total + attempt.score,
          0,
        );

        const averageScore =
          totalQuestions > 0
            ? Math.round((totalScore / totalQuestions) * 100)
            : 0;

        setQuizStats({
          quizzesCompleted,
          questionsAnswered,
          averageScore,
        });
      } catch (error) {
        console.error("Failed to fetch quiz statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchQuizStats();
  }, []);

  const startEditing = () => {
    if (!profile) return;

    setFormData({
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
      phone: String("0" + profile.phone || ""),
      bio: profile.bio || "",
      educationLevel: profile.educationLevel,
      group: profile.group,
      examPreferences: profile.examPreferences || [],
      socialLinks: {
        facebook: profile.socialLinks?.facebook || "",
        linkedin: profile.socialLinks?.linkedin || "",
        github: profile.socialLinks?.github || "",
        website: profile.socialLinks?.website || "",
      },
    });

    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setFormData(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) return;

    try {
      setSaving(true);

      const response = await api.patch<UpdateProfileResponse>("/profiles/me", {
        ...formData,
        phone: formData.phone ? Number(formData.phone) : "",
        dateOfBirth: formData.dateOfBirth || null,
      });

      setProfile(response.data.profile);
      setEditing(false);
      setFormData(null);

      toast.success(response.data.message || "Profile updated successfully!");
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: ApiErrorResponse;
        };
      };

      toast.error(
        axiosError.response?.data?.message || "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ProfileFormData, value: string) => {
    if (!formData) return;

    setFormData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const updateSocialLink = (field: keyof SocialLinks, value: string) => {
    if (!formData) return;

    setFormData((prev) => ({
      ...prev!,
      socialLinks: {
        ...prev!.socialLinks,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-indigo-600" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-xl font-bold">Profile not found</h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't find your profile.
          </p>
        </div>
      </main>
    );
  }

  const initials = profile.userId.name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-5 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your personal and educational information.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile content */}
        {!editing ? (
          <ProfileView
            profile={profile}
            initials={initials}
            memberSince={memberSince}
            statsLoading={statsLoading}
            quizStats={quizStats}
          />
        ) : (
          <ProfileForm
            formData={formData!}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={cancelEditing}
            updateField={updateField}
            updateSocialLink={updateSocialLink}
          />
        )}
      </div>
    </main>
  );
};

export default Profile;
