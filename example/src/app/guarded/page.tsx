"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useNavigationInterceptors } from "@yaredfall/next-navigation-interception";

export default function Page() {
const router = useRouter();

    const onBeforeunload = useCallback(() => {
        // Just return `false` to prevent navigation!
        return false;
    }, []);
    const onBeforePageChange = useCallback(() => {
        return confirm("Are you sure you want to leave this page?");
    }, []);

    useNavigationInterceptors({ 
        onBeforeunload,
        onPopstate: onBeforePageChange,
        onBack: onBeforePageChange,
        onForward: onBeforePageChange,
        onPush: onBeforePageChange,
        onReplace: onBeforePageChange,
        onRefresh: onBeforePageChange,
    });

    return <div>User will be prompted before page leave <button onClick={() => router.refresh()}>refresh</button></div>;
}