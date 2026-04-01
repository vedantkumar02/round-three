import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StorageDraftPreview } from "../../components/booking/StorageDraftPreview";
import { StepRenderer } from "../../components/booking/StepRenderer";
import { WizardFooter } from "../../components/booking/WizardFooter";
import { useBookingWizard } from "../../hooks/useBookingWizard";
import { providerSessionService } from "../../services/providerSessionService";
import type { ProviderType } from "../../types/booking";

const validProviders: ProviderType[] = ["doctor", "salon"];

export function BookingWizardPage() {
  const navigate = useNavigate();
  const params = useParams();

  const provider = validProviders.includes(params.provider as ProviderType)
    ? (params.provider as ProviderType)
    : "doctor";

  const sessionId = params.sessionId ?? crypto.randomUUID();

  const parsedStepIndex = Number(params.stepIndex ?? "0");
  const stepIndex = Number.isNaN(parsedStepIndex) ? 0 : parsedStepIndex;

  useEffect(() => {
    providerSessionService.remember(provider, sessionId);
  }, [provider, sessionId]);

  const navigateToStep = useCallback(
    (nextStepIndex: number) => {
      navigate(`/booking/${provider}/${sessionId}/${nextStepIndex}`);
    },
    [navigate, provider, sessionId],
  );

  function handleProviderChange(nextProvider: ProviderType) {
    if (nextProvider === provider) return;

    const nextSessionId = providerSessionService.getOrCreate(nextProvider);
    navigate(`/booking/${nextProvider}/${nextSessionId}/0`);
  }

  const {
    formData,
    errors,
    savedDrafts,
    currentStep,
    currentStepIndex,
    activeSteps,
    isFirstStep,
    isLastStep,
    updateField,
    goNext,
    goBack,
    clearDraft,
    submit,
  } = useBookingWizard({
    provider,
    sessionId,
    stepIndex,
    navigateToStep,
  });

  function handleNext() {
    if (!isLastStep) {
      goNext();
      return;
    }

    const isValid = goNext();

    if (isValid) {
      submit();
      const nextSessionId = providerSessionService.create(provider);
      navigate(`/booking/${provider}/${nextSessionId}/0`);
    }
  }

  return (
    <>
      <div className="mx-auto mt-10 max-w-xl border p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm">
              Step {currentStepIndex + 1} of {activeSteps.length}
            </p>

            <h1 className="mt-2 text-xl">{currentStep.title}</h1>
          </div>

          <div>
            <p className="mb-2 text-sm">Provider</p>
            <div className="inline-flex border">
              {validProviders.map((option) => {
                const isActive = option === provider;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleProviderChange(option)}
                    className={`cursor-pointer border-r px-4 py-2 text-sm capitalize ${
                      isActive ? "font-semibold underline" : ""
                    }`}>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <StepRenderer
            step={currentStep}
            formData={formData}
            errors={errors}
            onChange={updateField}
          />
        </div>

        <WizardFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onBack={goBack}
          onNext={handleNext}
        />
      </div>

      {savedDrafts.length > 0 && (
        <StorageDraftPreview
          drafts={savedDrafts}
          activeProvider={provider}
          activeSessionId={sessionId}
          onDelete={clearDraft}
        />
      )}
    </>
  );
}
