import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <ShieldCheck size={23} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Your Privacy
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 29, 2026
          </p>
        </div>

        <div className="mt-10 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex gap-3">
              <LockKeyhole
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <p className="text-sm leading-6 text-indigo-900 dark:text-indigo-200">
                QuizNest is designed to collect and use information needed to
                provide your account, quizzes, results, and other platform
                features. We aim to handle your information responsibly and only
                use it for legitimate platform purposes.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Information We Collect
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              When you create and use a QuizNest account, we may collect
              information that you provide to us, including your name, email
              address, password credentials, and profile information.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Depending on the features you use, your profile may also contain
              information such as educational details, date of birth, phone
              number, biography, exam preferences, and social links that you
              choose to provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Quiz and Activity Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              When you take quizzes, QuizNest may store information about your
              attempts, including the exam you attempted, answers submitted,
              score, correct and incorrect answers, and the time associated with
              your attempt.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              This information allows you to view your quiz history, review
              previous results, and track your progress.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. How We Use Your Information
            </h2>

            <ul className="mt-4 space-y-3">
              {[
                "Create and manage your QuizNest account.",
                "Provide quizzes and other platform features.",
                "Record and display your quiz results and history.",
                "Calculate and display leaderboard rankings.",
                "Maintain, secure, and improve the platform.",
                "Respond to support requests and platform-related communication.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Leaderboard Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              If you participate in quizzes that appear on the QuizNest
              leaderboard, information such as your display name, quiz score,
              ranking, and related attempt information may be displayed to other
              users as part of the leaderboard experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Information Security
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We take reasonable measures to protect information stored by the
              platform. However, no internet-based service can guarantee
              absolute security.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              You should also protect your account by keeping your password
              confidential and avoiding sharing your account credentials with
              others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Sharing of Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We do not intend to sell your personal information. Information
              may be processed or disclosed when reasonably necessary to
              operate, secure, maintain, or improve QuizNest, or when required
              by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. Your Profile Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              You can review and update information available through your
              QuizNest profile. Please make sure that the information you
              provide is accurate and appropriate for the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              8. Data Retention
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We may retain account, quiz attempt, and related information for
              as long as reasonably necessary to provide the platform, maintain
              your history, support security, resolve disputes, or comply with
              applicable requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              9. Third-Party Services
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              QuizNest may use third-party infrastructure or services to operate
              parts of the platform. Where applicable, those services may
              process information according to their own terms and privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              10. Changes to This Policy
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We may update this Privacy Policy as QuizNest evolves. Any updated
              version will be published on this page with a revised update date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              11. Contact
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              If you have questions or concerns about privacy and your
              information, please use the contact method provided by QuizNest.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
