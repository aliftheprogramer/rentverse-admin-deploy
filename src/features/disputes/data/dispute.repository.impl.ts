import { apiClient } from "../../../core/api.client";
import { baseUrl } from "../../../core/api.urls";
import type { DisputeRepository, DisputesListResponse, ResolveDisputeRequest } from "../domain/dispute.entity";

const DISPUTES_BASE = `${baseUrl}/admin/disputes`;

export class DisputeRepositoryImpl implements DisputeRepository {
  async getDisputes(): Promise<DisputesListResponse> {
    const res = await apiClient.get(DISPUTES_BASE);
    return res.data as DisputesListResponse;
  }

  async resolveDispute(id: string, payload: ResolveDisputeRequest): Promise<Record<string, unknown>> {
    const res = await apiClient.post(`${DISPUTES_BASE}/${id}/resolve`, payload);
    return res.data as Record<string, unknown>;
  }
}

export const disputeRepository = new DisputeRepositoryImpl();
