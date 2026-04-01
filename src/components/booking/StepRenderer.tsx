import type {
  BookingFormData,
  BookingStep,
  FieldErrors,
} from "../../types/booking";

type StepRendererProps = {
  step: BookingStep;
  formData: BookingFormData;
  errors: FieldErrors;
  onChange: <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K],
  ) => void;
};

export function StepRenderer({
  step,
  formData,
  errors,
  onChange,
}: StepRendererProps) {
  if (step.id === "basic-info") {
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Full Name</label>
          <input
            value={formData.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className="w-full border px-3 py-2"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => onChange("email", event.target.value)}
            className="w-full border px-3 py-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>
    );
  }

  if (step.id === "booking-type") {
    return (
      <div>
        <label className="mb-1 block text-sm">Booking Type</label>
        <select
          value={formData.bookingType}
          onChange={(event) =>
            onChange(
              "bookingType",
              event.target.value as BookingFormData["bookingType"],
            )
          }
          className="w-full border px-3 py-2">
          <option value="">Select</option>
          <option value="self">Self</option>
          <option value="group">Group</option>
        </select>

        {errors.bookingType && (
          <p className="mt-1 text-sm text-red-600">{errors.bookingType}</p>
        )}
      </div>
    );
  }

  if (step.id === "group-details") {
    return (
      <div>
        <label className="mb-1 block text-sm">Guests</label>
        <input
          value={formData.guests}
          onChange={(event) => onChange("guests", event.target.value)}
          className="w-full border px-3 py-2"
        />
        {errors.guests && (
          <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
        )}
      </div>
    );
  }

  if (step.id === "notes") {
    return (
      <div>
        <label className="mb-1 block text-sm">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className="w-full border px-3 py-2"
        />
      </div>
    );
  }

  return null;
}
