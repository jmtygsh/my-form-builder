import { ResetPasswordForm } from "~/components/auth/reset-password-form";

export const metadata = {
  title: "Set New Password - mmf.",
  description: "Set your new mmf. password",
};

export default function ResetPasswordPage({
  params,
}: {
  params: { id: string };
}) {
  return <ResetPasswordForm id={params.id} />;
}