import type { SavedBookingState } from "../../services/bookingStorageService";

type StorageDraftPreviewProps = {
  drafts: SavedBookingState[];
  activeProvider: SavedBookingState["provider"];
  activeSessionId: string;
  onDelete: (
    provider: SavedBookingState["provider"],
    sessionId: string,
  ) => void;
};

export function StorageDraftPreview({
  drafts,
  activeProvider,
  activeSessionId,
  onDelete,
}: StorageDraftPreviewProps) {
  function toDisplayValue(value: unknown) {
    if (typeof value !== "string") return "";
    return value.trim();
  }

  function renderField(label: string, value: unknown) {
    const displayValue = toDisplayValue(value);

    if (!displayValue) return null;

    return (
      <p>
        <strong>{label}:</strong> {displayValue}
      </p>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-xl">
      <div>
        <h2 className="text-base font-semibold">Local Storage Drafts</h2>
      </div>

      <div className="mt-4 space-y-4">
        {drafts.map((draft) => {
          const isActive =
            draft.provider === activeProvider &&
            draft.sessionId === activeSessionId;

          return (
            <div
              key={`${draft.provider}:${draft.sessionId}`}
              className="border-t pt-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p>
                    {draft.provider} • {draft.sessionId}
                  </p>
                  <p className="text-sm text-slate-600">
                    Saved at {new Date(draft.savedAt).toLocaleString()}
                    {isActive ? " • Active" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(draft.provider, draft.sessionId)}
                  className="cursor-pointer border px-2 py-1 text-sm">
                  Delete
                </button>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                {renderField("Provider", draft.provider)}
                {renderField("Session ID", draft.sessionId)}
                {renderField("Full Name", draft.formData?.fullName)}
                {renderField("Email", draft.formData?.email)}
                {renderField(
                  "Booking Type",
                  draft.formData?.bookingType
                    ? `${draft.formData.bookingType[0].toUpperCase()}${draft.formData.bookingType.slice(1)}`
                    : "",
                )}
                {renderField("Guests", draft.formData?.guests)}
                {renderField("Notes", draft.formData?.notes)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
