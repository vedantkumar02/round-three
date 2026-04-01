import type { BookingFormData, ProviderType } from "../types/booking";

type SavedBookingState = {
  provider: ProviderType;
  sessionId: string;
  formData: BookingFormData;
  savedAt: number;
};

function getStorageKey(provider: ProviderType, sessionId: string) {
  return `booking-wizard:${provider}:${sessionId}`;
}

export const bookingStorageService = {
  save(provider: ProviderType, sessionId: string, formData: BookingFormData) {
    localStorage.setItem(
      getStorageKey(provider, sessionId),
      JSON.stringify({
        provider,
        sessionId,
        formData,
        savedAt: Date.now(),
      }),
    );
  },

  load(provider: ProviderType, sessionId: string): SavedBookingState | null {
    const rawValue = localStorage.getItem(getStorageKey(provider, sessionId));

    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue) as SavedBookingState;
    } catch {
      return null;
    }
  },

  clear(provider: ProviderType, sessionId: string) {
    localStorage.removeItem(getStorageKey(provider, sessionId));
  },
};
