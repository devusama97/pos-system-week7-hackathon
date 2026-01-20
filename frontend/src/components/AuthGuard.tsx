'use client';

import React from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // Auth system disabled for demo task
    return <>{children}</>;
}
