import { useLayoutEffect } from "react";

export function useInterceptPopState(cb?: () => void) {
    useLayoutEffect(() => {
        // * Called before Next.js router setup which is useEffect().
        // https://github.com/vercel/next.js/blob/50b9966ba9377fd07a27e3f80aecd131fa346482/packages/next/src/client/components/app-router.tsx#L518

        const onPopState = () => {
            cb?.();
        };

        window.addEventListener("popstate", onPopState);

        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, [cb]);
}
