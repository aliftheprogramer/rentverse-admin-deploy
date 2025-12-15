export type PropertyMini = {
  id: string;
  title?: string | null;
  city?: string | null;
  image?: string | null;
  isVerified?: boolean | null;
};

export type Property = {
  id: string;
  title?: string | null;
  description?: string | null;
  city?: string | null;
  images?: string[] | null;
  isVerified?: boolean | null;
  createdAt?: string | null;
};

export type PropertiesListResponse = {
  status: string;
  message: string;
  meta?: {
    total?: number;
    limit?: number;
    nextCursor?: string | null;
    hasMore?: boolean;
  } | null;
  data: Property[];
};

export type VerifyPropertyRequest = {
  isVerified: boolean;
  rejectionReason?: string;
};

export interface PropertyRepository {
  getProperties(params?: { limit?: number; cursor?: string | null; status?: string }): Promise<PropertiesListResponse>;
  verifyProperty(id: string, payload: VerifyPropertyRequest): Promise<Record<string, unknown>>;
}
