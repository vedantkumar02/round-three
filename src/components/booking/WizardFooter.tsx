type WizardFooterProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function WizardFooter({
  isFirstStep,
  isLastStep,
  onBack,
  onNext,
}: WizardFooterProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep}
        className="cursor-pointer border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        className="cursor-pointer border px-4 py-2">
        {isLastStep ? "Submit" : "Next"}
      </button>
    </div>
  );
}
