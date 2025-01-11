import {
    AppRouterContext,
    type AppRouterInstance
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useMemo } from "react";

export interface RouterInterceptors {
    onBack?: AppRouterInstance["back"];
    onForward?: AppRouterInstance["forward"];
    onRefresh?: AppRouterInstance["refresh"];
    onPush?: AppRouterInstance["push"];
    onReplace?: AppRouterInstance["replace"];
    onPrefetch?: AppRouterInstance["prefetch"];
}

/** Intercepts app router methods and returns the router  */
export function useInterceptedAppRouter(interceptors: RouterInterceptors) {
    const router = useContext(AppRouterContext);

    return useMemo<AppRouterInstance | null>(() => {
        if (!router) return null;

        return {
            ...router,
            back: () => {
                interceptors.onBack?.();
                router.back();
            },
            forward: () => {
                interceptors.onForward?.();
                router.forward();
            },
            refresh: () => {
                interceptors.onRefresh?.();
                router.refresh();
            },
            push: (...args) => {
                interceptors.onPush?.(...args);
                router.push(...args);
            },
            replace: (...args) => {
                interceptors.onReplace?.(...args);
                router.replace(...args);
            },
            prefetch: (...args) => {
                interceptors.onPrefetch?.(...args);
                router.prefetch(...args);
            },
        };
    }, [router, interceptors]);
}
