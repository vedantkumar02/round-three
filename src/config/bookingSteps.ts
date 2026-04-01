import type { BookingFormData, BookingStep } from "../types/booking";

export const initialBookingFormData: BookingFormData = {
  fullName: "",
  email: "",
  bookingType: "",
  guests: "",
  notes: "",
};

export const bookingSteps: BookingStep[] = [
  {
    id: "basic-info",
    title: "Basic Info",
    fields: ["fullName", "email"],
    validate: (data) => {
      const errors: Partial<Record<keyof BookingFormData, string>> = {};

      if (!data.fullName.trim()) {
        errors.fullName = "Full name is required";
      }

      if (!data.email.trim()) {
        errors.email = "Email is required";
      }

      return errors;
    },
  },
  {
    id: "booking-type",
    title: "Booking Type",
    fields: ["bookingType"],
    validate: (data) => {
      const errors: Partial<Record<keyof BookingFormData, string>> = {};

      if (!data.bookingType) {
        errors.bookingType = "Please select booking type";
      }

      return errors;
    },
  },
  {
    id: "group-details",
    title: "Group Details",
    fields: ["guests"],
    shouldInclude: (data) => data.bookingType === "group",
    validate: (data) => {
      const errors: Partial<Record<keyof BookingFormData, string>> = {};

      if (!data.guests.trim()) {
        errors.guests = "Guest count is required";
      }

      return errors;
    },
  },
  {
    id: "notes",
    title: "Notes",
    fields: ["notes"],
    shouldInclude: (_, provider) => provider === "doctor",
    validate: () => ({}),
  },
];
