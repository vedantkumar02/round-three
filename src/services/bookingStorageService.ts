import type { BookingFormData, ProviderType } from "../types/booking";

export type SavedBookingState = {
  provider: ProviderType;
  sessionId: string;
  formData: BookingFormData;
  stepIndex: number;
  savedAt: number;
  isSubmitted: boolean;
};

function getStorageKey(provider: ProviderType, sessionId: string) {
  return `booking-wizard:${provider}:${sessionId}`;
}

function isBookingStorageKey(key: string) {
  return (
    key.startsWith("booking-wizard:") &&
    key !== "booking-wizard:active-sessions"
  );
}

export const bookingStorageService = {
  save(
    provider: ProviderType,
    sessionId: string,
    formData: BookingFormData,
    stepIndex: number,
    isSubmitted = false,
  ) {
    localStorage.setItem(
      getStorageKey(provider, sessionId),
      JSON.stringify({
        provider,
        sessionId,
        formData,
        stepIndex,
        savedAt: Date.now(),
        isSubmitted,
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

  list() {
    const drafts: SavedBookingState[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (!key || !isBookingStorageKey(key)) continue;

      const rawValue = localStorage.getItem(key);

      if (!rawValue) continue;

      try {
        drafts.push(JSON.parse(rawValue) as SavedBookingState);
      } catch {
        continue;
      }
    }

    return drafts.sort((a, b) => b.savedAt - a.savedAt);
  },

  clear(provider: ProviderType, sessionId: string) {
    localStorage.removeItem(getStorageKey(provider, sessionId));
  },
};
