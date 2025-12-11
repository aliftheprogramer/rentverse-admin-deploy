import { apiClient } from "../../../core/api.client";
import { baseUrl } from "../../../core/api.urls";
import type{
  UserRepository,
  UsersListResponse,
  UserDetailResponse,
  VerifyUserRequest,
  AdjustTrustRequest,
} from "../domain/user.entity";

const USERS_BASE = `${baseUrl}/admin/users`;

export class UserRepositoryImpl implements UserRepository {
  async getUsers(page = 1, limit = 5): Promise<UsersListResponse> {
    const res = await apiClient.get(USERS_BASE, { params: { page, limit } });
    return res.data as UsersListResponse;
  }

  async getUserById(id: string): Promise<UserDetailResponse> {
    const res = await apiClient.get(`${USERS_BASE}/${id}`);
    return res.data as UserDetailResponse;
  }

  async verifyUser(id: string, payload: VerifyUserRequest): Promise<Record<string, unknown>> {
    const res = await apiClient.post(`${USERS_BASE}/${id}/verify`, payload);
    return res.data as Record<string, unknown>;
  }

  async adjustTrust(payload: AdjustTrustRequest): Promise<Record<string, unknown>> {
    const res = await apiClient.post(`${baseUrl}/admin/trust/adjust`, payload);
    return res.data as Record<string, unknown>;
  }
}

export const userRepository = new UserRepositoryImpl();
