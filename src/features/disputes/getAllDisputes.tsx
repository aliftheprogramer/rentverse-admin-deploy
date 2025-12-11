import React, { useEffect, useState } from "react";
import { disputeRepository } from "./data/dispute.repository.impl";
import type { Dispute, ResolveDisputeRequest } from "./domain/dispute.entity";

const RESOLUTION_OPTIONS = ["REFUND_TENANT", "PAYOUT_LANDLORD", "REJECT_DISPUTE"] as const;

const DisputesList: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState<typeof RESOLUTION_OPTIONS[number] | "">("");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await disputeRepository.getDisputes();
      setDisputes(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const openResolve = (d: Dispute) => {
    setSelected(d);
    setResolution("");
    setAdminNotes("");
    setShowModal(true);
  };

  const doResolve = async () => {
    if (!selected) return;
    if (!resolution) return alert("Please choose a resolution");
    if (!adminNotes || adminNotes.trim().length < 5) return alert("Admin notes must be at least 5 characters");

    setSubmitting(true);
    const payload: ResolveDisputeRequest = {
      resolution: resolution as ResolveDisputeRequest["resolution"],
      adminNotes: adminNotes.trim(),
    };

    try {
      await disputeRepository.resolveDispute(selected.id, payload);
      // refetch list to reflect changes
      await fetchDisputes();
      setShowModal(false);
      alert("Dispute resolved successfully");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to resolve dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Disputes</h2>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Initiator</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{d.reason}</div>
                  <div className="text-xs text-gray-600">{d.description}</div>
                </td>
                <td className="px-4 py-3">{d.booking?.property?.title || "-"}</td>
                <td className="px-4 py-3">{d.initiator?.name || d.initiator?.email || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${d.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : d.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                    {d.status || "-"}
                  </span>
                </td>
                <td className="px-4 py-3">{(d.createdAt || "").slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openResolve(d)}
                      className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                    >
                      Resolve
                    </button>
                    <a href={`/bookings/${d.bookingId}`} className="px-3 py-1 rounded border text-sm">Booking</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Resolve Dispute</h3>
            <div className="text-sm text-gray-700 mb-4">
              <div><strong>Reason:</strong> {selected.reason}</div>
              <div className="mt-1"><strong>Property:</strong> {selected.booking?.property?.title || '-'}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value as any)} className="w-full rounded border px-3 py-2 mt-1">
                  <option value="">Select</option>
                  {RESOLUTION_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Admin Notes</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full rounded border px-3 py-2 mt-1" rows={4} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 rounded border">Cancel</button>
              <button onClick={doResolve} disabled={submitting} className="px-3 py-1 rounded bg-green-600 text-white">{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputesList;
