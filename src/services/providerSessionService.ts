import type { ProviderType } from "../types/booking";

const activeSessionsKey = "booking-wizard:active-sessions";
const lastActiveProviderKey = "booking-wizard:last-active-provider";

function loadActiveSessions(): Partial<Record<ProviderType, string>> {
  const rawValue = localStorage.getItem(activeSessionsKey);

  if (!rawValue) return {};

  try {
    return JSON.parse(rawValue) as Partial<Record<ProviderType, string>>;
  } catch {
    return {};
  }
}

function saveActiveSessions(sessions: Partial<Record<ProviderType, string>>) {
  localStorage.setItem(activeSessionsKey, JSON.stringify(sessions));
}

export const providerSessionService = {
  getActive(provider: ProviderType) {
    const sessions = loadActiveSessions();
    return sessions[provider] ?? null;
  },

  getLastActiveProvider(): ProviderType | null {
    const provider = localStorage.getItem(lastActiveProviderKey);

    if (provider === "doctor" || provider === "salon") {
      return provider;
    }

    return null;
  },

  remember(provider: ProviderType, sessionId: string) {
    const sessions = loadActiveSessions();
    sessions[provider] = sessionId;
    saveActiveSessions(sessions);
    localStorage.setItem(lastActiveProviderKey, provider);
  },

  create(provider: ProviderType) {
    const sessions = loadActiveSessions();
    const nextSession = crypto.randomUUID();
    sessions[provider] = nextSession;
    saveActiveSessions(sessions);
    localStorage.setItem(lastActiveProviderKey, provider);
    return nextSession;
  },

  getOrCreate(provider: ProviderType) {
    const sessions = loadActiveSessions();
    const existingSession = sessions[provider];

    if (existingSession) return existingSession;

    return this.create(provider);
  },

  clear(provider: ProviderType, sessionId: string) {
    const sessions = loadActiveSessions();

    if (sessions[provider] !== sessionId) return;

    delete sessions[provider];
    saveActiveSessions(sessions);

    if (this.getLastActiveProvider() !== provider) return;

    const nextProvider = (Object.keys(sessions)[0] as ProviderType | undefined) ?? null;

    if (nextProvider) {
      localStorage.setItem(lastActiveProviderKey, nextProvider);
      return;
    }

    localStorage.removeItem(lastActiveProviderKey);
  },
};
