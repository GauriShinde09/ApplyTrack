
import { useState } from "react";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  X,
  CalendarDays,
  BriefcaseBusiness,
  Building2,
  FileText,
  Clock,
  ClipboardList,
  Target,
} from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const STATUS_STYLES = {
  Applied: "bg-[#F0EAFE] text-[#7251CC]",
  Interview: "bg-[#FFF3DD] text-[#A66D12]",
  Offer: "bg-[#E2F6EC] text-[#24845F]",
  Rejected: "bg-[#FFE9ED] text-[#C84F64]",
};

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(`${date}`.length === 10 ? `${date}T00:00:00` : date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "Applied"}
    </span>
  );
}

export default function ApplicationTable({
  applications = [],
  onEdit,
  onDelete,
}) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#EAE3FA] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#F8F6FD]">
              <tr className="text-xs font-bold uppercase tracking-wider text-[#887CA6]">
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Job Role</th>
                <th className="px-5 py-4">Applied Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Interview Date</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0EBF8]">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAFE] text-[#7251CC]">
                      <BriefcaseBusiness size={25} />
                    </div>
                    <p className="mt-4 font-semibold text-[#30264D]">
                      No applications found
                    </p>
                    <p className="mt-1 text-sm text-[#887CA6]">
                      Add an application to see it here.
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition hover:bg-[#FBFAFE]"
                  >
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedApplication(application)}
                        className="text-left font-bold text-[#30264D] transition hover:text-[#7251CC]"
                      >
                        {application.company || "Unnamed company"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#655780]">
                        {application.role || "Not specified"}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#756A91]">
                      {formatDate(application.date)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#756A91]">
                      {formatDate(application.interviewDate)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="View details"
                          aria-label={`View ${application.company} details`}
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                          className="rounded-xl p-2 text-[#7251CC] transition hover:bg-[#F0EAFE]"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit application"
                          aria-label={`Edit ${application.company}`}
                          onClick={() => onEdit?.(application)}
                          className="rounded-xl p-2 text-[#A66D12] transition hover:bg-[#FFF3DD]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete application"
                          aria-label={`Delete ${application.company}`}
                          onClick={() => setDeleteCandidate(application)}
                          className="rounded-xl p-2 text-[#C84F64] transition hover:bg-[#FFE9ED]"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {applications.length > 0 && (
          <div className="border-t border-[#F0EBF8] bg-[#FCFBFE] px-5 py-3 text-xs text-[#887CA6]">
            Showing {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#21183D]/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#EAE3FA] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#7250C2] to-[#A38AE8] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2
                      id="application-details-title"
                      className="text-xl font-bold"
                    >
                      Application Details
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Your job application information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close details"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-xl p-2 transition hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm text-[#887CA6]">Company</p>
                <h3 className="mt-1 text-lg font-bold text-[#30264D]">
                  {selectedApplication.company || "Not specified"}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={<BriefcaseBusiness size={17} />}
                  label="Job Role"
                  value={selectedApplication.role}
                />

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#887CA6]">
                    Application Status
                  </p>
                  <StatusBadge status={selectedApplication.status} />
                </div>

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Applied Date"
                  value={formatDate(selectedApplication.date)}
                />

                <DetailItem
                  icon={<Clock size={17} />}
                  label="Interview Date"
                  value={formatDate(selectedApplication.interviewDate)}
                />
              </div>

              <div className="rounded-2xl border border-[#EAE3FA] bg-[#FBFAFE] p-4">
                <div className="flex items-center gap-2 text-[#7251CC]">
                  <FileText size={17} />
                  <p className="text-sm font-bold">Notes</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#655780]">
                  {selectedApplication.notes || "No notes added."}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-[#7251CC]">
                  <Target size={17} />
                  <p className="text-sm font-bold">Job Posting</p>
                </div>

                {selectedApplication.jobLink ? (
                  <a
                    href={selectedApplication.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 break-all text-sm font-semibold text-[#7251CC] hover:underline"
                  >
                    Open job posting
                    <ExternalLink size={15} />
                  </a>
                ) : (
                  <p className="text-sm text-[#887CA6]">
                    No job link added.
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#F0EBF8] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-xl border border-[#E6DFF5] px-5 py-2.5 text-sm font-semibold text-[#655780] transition hover:bg-[#F7F4FD]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const application = selectedApplication;
                    setSelectedApplication(null);
                    onEdit?.(application);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7251CC] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6040B5]"
                >
                  <Pencil size={16} />
                  Edit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        application={deleteCandidate}
        onCancel={() => setDeleteCandidate(null)}
        onConfirm={() => {
          if (!deleteCandidate) return;

          onDelete?.(deleteCandidate.id);
          setDeleteCandidate(null);
        }}
      />
    </>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#887CA6]">
        <span className="text-[#7251CC]">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-semibold text-[#30264D]">
        {value || "Not specified"}
      </p>
    </div>
  );
}
