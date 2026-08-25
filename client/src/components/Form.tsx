import { ExternalLink } from "lucide-react";

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950";

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold">{label}</label>

    {children}
  </div>
);

export const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </p>

    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium dark:border-slate-800 dark:bg-slate-950">
      {value}
    </div>
  </div>
);

export const SocialLink = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  if (!value) {
    return (
      <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-400 dark:bg-slate-800">
        {label} not added
      </span>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
    >
      {label}
      <ExternalLink size={13} />
    </a>
  );
};

export const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>

    <p className="mt-2 text-2xl font-black">{value}</p>
  </div>
);

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const formatBDPhone = (
  phone: string | number | null | undefined,
): string => {
  if (!phone) return "Not provided";

  const digits = String(phone).replace(/\D/g, "");

  // 880 + 9 digits
  if (digits.startsWith("880") && digits.length === 12) {
    return `+880 ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // 880 + 10 digits
  if (digits.startsWith("880") && digits.length === 13) {
    return `+880 ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // 01XXXXXXXXX
  if (digits.startsWith("01") && digits.length === 11) {
    return `+880 ${digits.slice(1, 5)} ${digits.slice(5)}`;
  }

  return String(phone);
};
