
interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress = ({ currentStep, totalSteps }: OnboardingProgressProps) => {
  return (
    <div className="mb-6 mt-4">
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-10 rounded-full ${
                i + 1 <= currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
};
