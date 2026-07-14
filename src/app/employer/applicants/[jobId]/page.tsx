interface ApplicantsPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const { jobId } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Applicants for Job: {jobId}</h1>
    </div>
  );
}
