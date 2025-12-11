export type BookingMini = {
  id: string;
  status?: string | null;
  property?: {
    title?: string | null;
  } | null;
};

export type Initiator = {
  name?: string | null;
  email?: string | null;
};

export type Dispute = {
  id: string;
  bookingId: string;
  initiatorId?: string | null;
  reason?: string | null;
  description?: string | null;
  status?: string | null; // e.g. OPEN, RESOLVED, REJECTED
  resolution?: string | null;
  adminNotes?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  booking?: BookingMini | null;
  initiator?: Initiator | null;
};

export type DisputesListResponse = {
  status: string;
  message: string;
  data: Dispute[];
};

export type ResolveDisputeRequest = {
  resolution: "REFUND_TENANT" | "PAYOUT_LANDLORD" | "REJECT_DISPUTE";
  adminNotes: string;
};

export interface DisputeRepository {
  getDisputes(): Promise<DisputesListResponse>;
  resolveDispute(id: string, payload: ResolveDisputeRequest): Promise<Record<string, unknown>>;
}
