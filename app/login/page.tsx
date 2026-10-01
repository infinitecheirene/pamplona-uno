import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-brand-accent-50 via-white to-brand-secondary-50 flex items-center justify-center px-4">
          <div className="w-8 h-8 border-2 border-brand-secondary-500 border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
