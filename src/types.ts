export interface Candidate {
  id: string;
  name: string;
  teamName: string;
  voteCount: number;
  imageUrl: string;
}

export interface Student {
  uid: string;
  fullName: string;
  email: string;
  semester: string;
  registeredAt: any;
  hasVoted: boolean;
  votedFor?: string;
}

export type AppState = 'loading' | 'registering' | 'voting' | 'voted' | 'success' | 'admin-login' | 'admin-dashboard' | 'error';
