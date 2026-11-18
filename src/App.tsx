import { ChristmasGiftGenerator } from "@/components/ChristmasGiftGenerator";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ChristmasGiftGenerator />
    </ErrorBoundary>
  );
}
