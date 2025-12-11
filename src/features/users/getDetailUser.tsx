import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRepository } from "./data/user.repository.impl";
import type { User } from "./domain/user.entity";

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [deltaStr, setDeltaStr] = useState<string>("0");
  const [reason, setReason] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await userRepository.getUserById(id);
        if (!mounted) return;
        setUser(res.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleVerify = async (status: "VERIFIED" | "REJECTED") => {
    if (!id) return;
    setVerifyLoading(true);
    try {
      await userRepository.verifyUser(id, { status, rejectionReason: status === "REJECTED" ? "Rejected by admin" : null });
      // refresh
      const res = await userRepository.getUserById(id);
      setUser(res.data);
      alert("User verification updated");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to verify");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setAdjusting(true);
    try {
      const parsed = Number(deltaStr);
      if (Number.isNaN(parsed)) {
        alert("Please enter a valid number for delta");
        return;
      }
      await userRepository.adjustTrust({ userId: user.id, role: user.roles?.[0] || "TENANT", scoreDelta: parsed, reason });
      alert("Trust adjusted");
      const res = await userRepository.getUserById(user.id);
      setUser(res.data);
      setDeltaStr("0");
      setReason("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to adjust trust");
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">Roles: {(user.roles || []).join(", ")}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-gray-500">Phone</div>
            <div>{user.phone || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Trust Score</div>
            <div>{user.trustScore ?? '-'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">KYC Status</div>
            <div>{user.kyc?.status ?? user.kycStatus ?? '-'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Joined</div>
            <div>{(user.createdAt || user.joinedAt || '').slice(0,10)}</div>
          </div>
        </div>

        { (user.kyc?.ktpUrl || user.kyc?.selfieUrl || user.avatarUrl) && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">KYC Documents</h4>
            <div className="flex gap-4 flex-wrap">
              {user.avatarUrl && (
                <a href={user.avatarUrl} target="_blank" rel="noreferrer" className="block">
                  <img src={user.avatarUrl} alt="avatar" className="w-36 h-36 object-cover rounded border" loading="lazy" />
                </a>
              )}

              {user.kyc?.ktpUrl && (
                <a href={user.kyc.ktpUrl} target="_blank" rel="noreferrer" className="block">
                  <div className="text-xs text-gray-500 mb-1">KTP</div>
                  <img src={user.kyc.ktpUrl} alt="ktp" className="w-48 h-36 object-contain rounded border bg-white" loading="lazy" />
                </a>
              )}

              {user.kyc?.selfieUrl && (
                <a href={user.kyc.selfieUrl} target="_blank" rel="noreferrer" className="block">
                  <div className="text-xs text-gray-500 mb-1">Selfie</div>
                  <img src={user.kyc.selfieUrl} alt="selfie" className="w-48 h-36 object-contain rounded border bg-white" loading="lazy" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Verify KYC</h4>
          <div className="flex gap-2">
            <button onClick={() => handleVerify("VERIFIED")} className="px-3 py-2 bg-green-600 text-white rounded" disabled={verifyLoading}>
              Verify
            </button>
            <button onClick={() => handleVerify("REJECTED")} className="px-3 py-2 bg-red-600 text-white rounded" disabled={verifyLoading}>
              Reject
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-2">Adjust Trust Score</h4>
          <form onSubmit={handleAdjust} className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Delta (positive or negative)</label>
              <input
                type="text"
                value={deltaStr}
                onChange={(e) => setDeltaStr(e.target.value)}
                className="w-full border rounded px-2 py-2"
                placeholder="e.g. -10 or 5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Reason</label>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border rounded px-2 py-2" />
            </div>
            <div className="pt-2">
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded" disabled={adjusting}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
