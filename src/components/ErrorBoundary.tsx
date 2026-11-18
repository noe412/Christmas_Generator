import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  hasError: boolean;
}

/** Catches render errors so a single faulty component never results in a blank screen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-elegant text-3xl">Something went wrong.</h1>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </main>
    );
  }
}
