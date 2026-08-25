import { Loader2, Save, X } from "lucide-react";

import { Field, inputClass } from "../components/Form";
import type { ProfileFormProps } from "../types/profile";

const ProfileForm = ({
  formData,
  saving,
  onSubmit,
  onCancel,
  updateField,
  updateSocialLink,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mt-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div>
          <h2 className="text-xl font-bold">Edit Profile</h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update your personal and educational information.
          </p>
        </div>

        {/* Personal */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Personal Information
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {/* Gender */}
            <Field label="Gender">
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className={inputClass}
              >
                <option value="male">Male</option>

                <option value="female">Female</option>
              </select>
            </Field>

            {/* Date */}
            <Field label="Date of Birth">
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value.replace(/\D/g, ""))
                }
                className={inputClass}
              />
            </Field>

            {/* Education */}
            <Field label="Education Level">
              <select
                value={formData.educationLevel}
                onChange={(e) => updateField("educationLevel", e.target.value)}
                className={inputClass}
              >
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            {/* Group */}
            <Field label="Group">
              <select
                value={formData.group}
                onChange={(e) => updateField("group", e.target.value)}
                className={inputClass}
              >
                <option value="science">Science</option>

                <option value="arts">Arts</option>

                <option value="commerce">Commerce</option>
              </select>
            </Field>

            {/* Bio */}
            <div className="sm:col-span-2">
              <Field label="Bio">
                <textarea
                  rows={4}
                  maxLength={300}
                  placeholder="Tell us a little about yourself..."
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className={`${inputClass} resize-none`}
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.bio.length}/300
                </p>
              </Field>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Social Links
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Facebook">
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={formData.socialLinks.facebook}
                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="LinkedIn">
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.socialLinks.linkedin}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="GitHub">
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.socialLinks.github}
                onChange={(e) => updateSocialLink("github", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Website">
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.socialLinks.website}
                onChange={(e) => updateSocialLink("website", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
