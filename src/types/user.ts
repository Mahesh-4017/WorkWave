export interface UserProfile {
  uid: string;
  email: string;
  role: 'seeker' | 'employer' | 'admin';
  name?: string;
  createdAt: string;
}
