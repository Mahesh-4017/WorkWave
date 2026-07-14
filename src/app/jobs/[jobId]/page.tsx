interface JobPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { jobId } = await params;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Job Detail: {jobId}</h1>
    </div>
  );
}
