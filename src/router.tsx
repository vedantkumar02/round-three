import { createBrowserRouter, Navigate } from "react-router-dom";
import { BookingWizardPage } from "./components/booking/BookingWizardPage";
import { bookingStorageService } from "./services/bookingStorageService";
import { providerSessionService } from "./services/providerSessionService";

function getInitialBookingPath() {
  const provider = providerSessionService.getLastActiveProvider() ?? "doctor";
  const activeSessionId =
    providerSessionService.getActive(provider) ?? crypto.randomUUID();
  const savedDraft = bookingStorageService.load(provider, activeSessionId);
  const stepIndex = savedDraft?.stepIndex ?? 0;

  return `/booking/${provider}/${activeSessionId}/${stepIndex}`;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={getInitialBookingPath()} replace />,
  },
  {
    path: "/booking/:provider/:sessionId/:stepIndex",
    element: <BookingWizardPage />,
  },
]);
