export type ProviderType = "doctor" | "salon";

export type BookingFormData = {
  fullName: string;
  email: string;
  bookingType: "self" | "group" | "";
  guests: string;
  notes: string;
};

export type FieldErrors = Partial<Record<keyof BookingFormData, string>>;

export type BookingStep = {
  id: string;
  title: string;
  fields: (keyof BookingFormData)[];
  shouldInclude?: (data: BookingFormData, provider: ProviderType) => boolean;
  validate: (data: BookingFormData) => FieldErrors;
};
