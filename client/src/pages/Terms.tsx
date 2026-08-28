import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            <FileText size={23} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Legal
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Last updated: August 29, 2026
          </p>
        </div>

        <div className="mt-10 space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              By accessing or using QuizNest, you agree to these Terms of
              Service. If you do not agree with these terms, please do not use
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              2. About QuizNest
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              QuizNest is an educational quiz and exam-practice platform that
              provides multiple-choice questions, timed quizzes, quiz results,
              attempt history, and leaderboard features.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              QuizNest is intended as a practice and learning tool. Using the
              platform does not guarantee success in any academic examination,
              admission test, recruitment examination, or competitive
              examination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              3. User Accounts
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Some features of QuizNest require an account. You are responsible
              for providing accurate information and keeping your account
              credentials secure.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              You are responsible for activity performed through your account.
              Please notify us if you believe your account has been accessed
              without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Acceptable Use
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              You agree to use QuizNest only for lawful and educational
              purposes. You must not attempt to disrupt the service, gain
              unauthorized access to accounts or systems, manipulate quiz
              results, abuse the leaderboard, or interfere with other users'
              access to the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Quiz Content
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              QuizNest contains questions and educational materials intended for
              practice. Although we aim to provide useful and accurate content,
              questions may occasionally contain mistakes, inaccuracies, or
              outdated information.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              QuizNest should not be treated as an official source of
              examination questions, answers, syllabi, or government information
              unless explicitly stated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Results and Leaderboards
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Quiz results and leaderboard rankings are generated from quiz
              attempts recorded by the platform. Rankings may change as users
              complete additional quizzes.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We reserve the right to correct, remove, or invalidate results
              that appear to be generated through abuse, technical errors, or
              other prohibited activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. Intellectual Property
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              The QuizNest name, branding, interface, software, and original
              platform content belong to QuizNest or their respective rights
              holders. You may not reproduce, redistribute, or commercially
              exploit platform content without appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              8. Service Availability
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We aim to keep QuizNest available and reliable, but we cannot
              guarantee that the platform will always be available,
              uninterrupted, or completely free from errors.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Features may be updated, changed, temporarily unavailable, or
              discontinued as the platform develops.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              9. Account Suspension
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              We may restrict or suspend access to an account if we reasonably
              believe that the account is being used to violate these terms,
              abuse the platform, compromise security, or interfere with the
              experience of other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              10. Changes to These Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              These Terms of Service may be updated from time to time. When
              significant changes are made, the updated version will be
              published on this page with a revised date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              11. Contact
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              If you have questions about these Terms of Service, please use the
              contact method provided by QuizNest.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Terms;
