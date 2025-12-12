'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, _hasHydrated } = useAuthStore();

    useEffect(() => {
        // Wait for the store to hydrate before checking authentication
        if (_hasHydrated && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, _hasHydrated, router]);

    // Show loading state while hydrating
    if (!_hasHydrated) {
        return (
            <div className="min-h-screen bg-[#f8f8f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#f9f506] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render protected content if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
