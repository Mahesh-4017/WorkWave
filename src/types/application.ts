export interface JobApplication {
  id: string;
  jobId: string;
  seekerId: string;
  status: 'applied' | 'reviewing' | 'interviewing' | 'accepted' | 'rejected';
  resumeUrl: string;
  createdAt: string;
}
