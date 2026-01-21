import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-screen min-h-screen bg-red-900/20 text-red-500 font-mono p-10 overflow-auto flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">SYSTEM FAILURE // CRITICAL ERROR</h1>
                    <div className="text-xl border border-red-500 p-4 bg-black/50 rounded">
                        {this.state.error && this.state.error.toString()}
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-red-300 opacity-70">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 text-black font-bold hover:bg-red-500 w-fit"
                    >
                        REBOOT SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
