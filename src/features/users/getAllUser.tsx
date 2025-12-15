import React, { useEffect, useMemo, useState } from "react";
import { userRepository } from "./data/user.repository.impl";
import type { User, UsersMeta } from "./domain/user.entity";

const ROLE_OPTIONS = ["ALL", "TENANT", "LANDLORD"] as const;
const KYC_OPTIONS = ["ALL", "VERIFIED", "PENDING", "REJECTED"] as const;

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [meta, setMeta] = useState<UsersMeta | null>(null);

  const [roleFilter, setRoleFilter] = useState<typeof ROLE_OPTIONS[number]>("ALL");
  const [kycFilter, setKycFilter] = useState<typeof KYC_OPTIONS[number]>("ALL");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userRepository.getUsers(page, limit);
        if (!mounted) return;
        setUsers(res.data || []);
        setMeta(res.meta || null);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  // client-side filters (as requested)
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "ALL") {
        if (!u.roles || !u.roles.includes(roleFilter)) return false;
      }
      if (kycFilter !== "ALL") {
        // kycStatus in list response is kycStatus field
        if ((u.kycStatus || "").toUpperCase() !== kycFilter) return false;
      }
      return true;
    });
  }, [users, roleFilter, kycFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>

        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof ROLE_OPTIONS[number])}
            className="rounded border px-3 py-2"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value as typeof KYC_OPTIONS[number])}
            className="rounded border px-3 py-2"
          >
            {KYC_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">KYC</th>
              <th className="px-4 py-3">Trust</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{(u.roles || []).join(", ")}</td>
                <td className="px-4 py-3">
                  {(() => {
                    const s = (u.kycStatus || u.kyc?.status || "").toUpperCase();
                    if (!s) return <span className="text-sm text-gray-500">-</span>;
                    const base = "inline-flex items-center px-2 py-1 rounded text-sm font-medium";
                    if (s === "VERIFIED") return <span className={`${base} bg-green-100 text-green-800`}>{s}</span>;
                    if (s === "REJECTED") return <span className={`${base} bg-red-100 text-red-800`}>{s}</span>;
                    // treat SUBMITTED and PENDING as neutral
                    return <span className={`${base} bg-gray-100 text-gray-700`}>{s}</span>;
                  })()}
                </td>
                <td className="px-4 py-3">{u.trustScore ?? "-"}</td>
                <td className="px-4 py-3">{(u.joinedAt || u.createdAt || "")?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <a
                    href={`/users/${u.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          {meta ? `Page ${meta.page} / ${meta.totalPages}` : ""}
        </div>
        <div className="flex gap-2">
          <button
            disabled={!meta?.hasPrevPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!meta?.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
