import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password - mmf.",
  description: "Reset your mmf. password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}