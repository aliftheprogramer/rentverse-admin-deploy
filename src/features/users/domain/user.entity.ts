export type Kyc = {
  role: string;
  status: string;
  score: number;
  ktpUrl?: string | null;
  selfieUrl?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roles: string[];
  trustScore?: number | null;
  kycStatus?: string | null;
  joinedAt?: string;
  createdAt?: string;
  isVerified?: boolean;
  wallet?: Record<string, unknown> | null;
  kyc?: Kyc | null;
};

export type UsersMeta = {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type UsersListResponse = {
  status: string;
  message: string;
  meta: UsersMeta;
  data: User[];
};

export type UserDetailResponse = {
  status: string;
  message: string;
  data: User;
};

export type VerifyUserRequest = {
  status: string; // e.g. VERIFIED or REJECTED
  rejectionReason?: string | null;
};

export type AdjustTrustRequest = {
  userId: string;
  role: string;
  scoreDelta: number;
  reason?: string;
};

export interface UserRepository {
  getUsers(page?: number, limit?: number): Promise<UsersListResponse>;
  getUserById(id: string): Promise<UserDetailResponse>;
  verifyUser(id: string, payload: VerifyUserRequest): Promise<Record<string, unknown>>;
  adjustTrust(payload: AdjustTrustRequest): Promise<Record<string, unknown>>;
}
