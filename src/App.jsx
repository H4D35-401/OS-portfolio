import React, { useState } from 'react';
import Desktop from "./components/Desktop";
import BootLoader from "./components/BootLoader";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
    const [booted, setBooted] = useState(false);

    if (!booted) {
        return <BootLoader onComplete={() => setBooted(true)} />;
    }

    return (
        <ErrorBoundary>
            <Desktop />
        </ErrorBoundary>
    );
};

export default App;
