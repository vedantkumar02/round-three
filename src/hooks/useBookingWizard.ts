import { useEffect, useState } from "react";
import { bookingSteps, initialBookingFormData } from "../config/bookingSteps";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import {
  bookingStorageService,
  type SavedBookingState,
} from "../services/bookingStorageService";
import type {
  BookingFormData,
  BookingStep,
  FieldErrors,
  ProviderType,
} from "../types/booking";

type UseBookingWizardParams = {
  provider: ProviderType;
  sessionId: string;
  stepIndex: number;
  navigateToStep: (nextStepIndex: number) => void;
};

type UseBookingWizardReturn = {
  formData: BookingFormData;
  errors: FieldErrors;
  savedDrafts: SavedBookingState[];
  activeSteps: BookingStep[];
  currentStep: BookingStep;
  currentStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  updateField: <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K],
  ) => void;
  goNext: () => boolean;
  goBack: () => void;
  clearDraft: (provider: ProviderType, sessionId: string) => void;
  submit: () => void;
};

export function useBookingWizard({
  provider,
  sessionId,
  stepIndex,
  navigateToStep,
}: UseBookingWizardParams): UseBookingWizardReturn {
  const autoSaveDelay = 300;

  const [formData, setFormData] = useState<BookingFormData>(initialBookingFormData);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedDrafts, setSavedDrafts] = useState<SavedBookingState[]>([]);
  const [hasPendingAutosave, setHasPendingAutosave] = useState(false);

  function refreshSavedDrafts() {
    setSavedDrafts(
      bookingStorageService.list().filter((draft) => draft.isSubmitted),
    );
  }

  function removeSavedDraft(nextProvider: ProviderType, nextSessionId: string) {
    setSavedDrafts((prev) =>
      prev.filter((draft) => {
        return !(
          draft.provider === nextProvider && draft.sessionId === nextSessionId
        );
      }),
    );
  }

  useEffect(() => {
    const restoredDraft = bookingStorageService.load(provider, sessionId);

    setFormData(restoredDraft?.formData ?? initialBookingFormData);
    refreshSavedDrafts();
    setErrors({});
    setHasPendingAutosave(false);

    if (
      restoredDraft &&
      restoredDraft.stepIndex >= 0 &&
      stepIndex !== restoredDraft.stepIndex
    ) {
      navigateToStep(restoredDraft.stepIndex);
    }
  }, [navigateToStep, provider, sessionId]);

  const activeSteps = bookingSteps.filter((step) => {
    return step.shouldInclude ? step.shouldInclude(formData, provider) : true;
  });

  const safeStepIndex = Math.min(
    Math.max(stepIndex, 0),
    activeSteps.length - 1,
  );

  const currentStep = activeSteps[safeStepIndex];

  useDebouncedEffect(
    () => {
      if (!hasPendingAutosave) return;

      bookingStorageService.save(provider, sessionId, formData, safeStepIndex);
      setHasPendingAutosave(false);
    },
    autoSaveDelay,
    [formData, hasPendingAutosave, provider, safeStepIndex, sessionId],
  );

  useEffect(() => {
    if (stepIndex !== safeStepIndex) {
      navigateToStep(safeStepIndex);
    }
  }, [navigateToStep, safeStepIndex, stepIndex]);

  function updateField<K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K],
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setHasPendingAutosave(true);
  }

  function validateStep(step: BookingStep) {
    const nextErrors = step.validate(formData);

    setErrors((prev) => {
      const remainingErrors = { ...prev };

      step.fields.forEach((field) => {
        delete remainingErrors[field];
      });

      return {
        ...remainingErrors,
        ...nextErrors,
      };
    });

    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    const isValid = validateStep(currentStep);

    if (!isValid) return false;

    const nextIndex = safeStepIndex + 1;

    if (nextIndex < activeSteps.length) {
      navigateToStep(nextIndex);
    }

    return true;
  }

  function goBack() {
    const previousIndex = safeStepIndex - 1;

    if (previousIndex >= 0) {
      navigateToStep(previousIndex);
    }
  }

  function clearDraft(nextProvider: ProviderType, nextSessionId: string) {
    bookingStorageService.clear(nextProvider, nextSessionId);
    removeSavedDraft(nextProvider, nextSessionId);

    if (nextProvider === provider && nextSessionId === sessionId) {
      setFormData(initialBookingFormData);
      setErrors({});
      setHasPendingAutosave(false);
    }
  }

  function submit() {
    bookingStorageService.save(
      provider,
      sessionId,
      formData,
      safeStepIndex,
      true,
    );
    refreshSavedDrafts();
    setHasPendingAutosave(false);

    console.log("Submit booking payload:", {
      provider,
      sessionId,
      formData,
    });
  }

  return {
    formData,
    errors,
    savedDrafts,
    activeSteps,
    currentStep,
    currentStepIndex: safeStepIndex,
    isFirstStep: safeStepIndex === 0,
    isLastStep: safeStepIndex === activeSteps.length - 1,
    updateField,
    goNext,
    goBack,
    clearDraft,
    submit,
  };
}
