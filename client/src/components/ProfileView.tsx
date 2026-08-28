import { CalendarDays, UserRound } from "lucide-react";
import type { ProfileViewProps } from "../types/profile";
import { capitalize, formatBDPhone, InfoItem, SocialLink } from "./Form";
import ProfileStats from "./ProfileStats";

const ProfileView = ({
  profile,
  initials,
  memberSince,
  statsLoading,
  quizStats,
}: ProfileViewProps) => {
  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* User card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center text-center">
            {profile.userId.avatar ? (
              <img
                src={profile.userId.avatar}
                alt={profile.userId.name}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-600 text-3xl font-black text-white shadow-lg shadow-indigo-600/20">
                {initials}
              </div>
            )}

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              {profile.userId.name}
            </h2>

            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {profile.userId.email}
            </p>

            <div className="mt-4 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              {profile.userId.role}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <CalendarDays size={17} className="text-slate-500" />
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Member since
                </p>

                <p className="mt-0.5 text-sm font-semibold">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold">Personal Information</h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your basic profile information.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <InfoItem label="Gender" value={capitalize(profile.gender)} />

            <InfoItem
              label="Date of Birth"
              value={
                profile.dateOfBirth
                  ? new Date(profile.dateOfBirth).toLocaleDateString()
                  : "Not provided"
              }
            />

            <InfoItem label="Phone" value={formatBDPhone(profile.phone)} />

            <InfoItem label="Education Level" value={profile.educationLevel} />

            <InfoItem label="Group" value={capitalize(profile.group)} />

            <InfoItem label="Email" value={profile.userId.email} />
          </div>

          <div className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bio
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {profile.bio || "No bio added yet."}
            </p>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Social Links
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <SocialLink
                label="Facebook"
                value={profile.socialLinks.facebook}
              />

              <SocialLink
                label="LinkedIn"
                value={profile.socialLinks.linkedin}
              />

              <SocialLink label="GitHub" value={profile.socialLinks.github} />

              <SocialLink label="Website" value={profile.socialLinks.website} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics placeholder */}
      {/* <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Quizzes Completed" value="0" />

        <StatCard label="Questions Answered" value="0" />

        <StatCard label="Average Score" value="0%" />
      </div> */}
      <ProfileStats statsLoading={statsLoading} quizStats={quizStats} />
    </>
  );
};

export default ProfileView;
