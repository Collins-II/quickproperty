"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#dc2626"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default LoadingProvider;