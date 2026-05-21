import { FormBuilder } from "~/components/dashboard-ui/FormBuilder";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function BuildFormPage({ params }: PageProps) {
    // Await the params object (Required for Next.js App Router dynamic routes)
    const { id } = await params;

    return <FormBuilder formId={id} />;
}