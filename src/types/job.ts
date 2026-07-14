export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  employerId: string;
  createdAt: string;
}
