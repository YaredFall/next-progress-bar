"use client";

import { useInterceptPopState } from "@/hooks/useInterceptPopState";
import { createProgress, ProgressOptions } from "@/utils/progress";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { RouterInterceptors, useInterceptedAppRouter } from "../hooks/useInterceptedRoouter";
import { AppProgressBar } from "./AppProgressBar";

interface WithProgressBarProps
    extends PropsWithChildren,
        Partial<Pick<ProgressOptions, "interval" | "step">>,
        Pick<ComponentPropsWithoutRef<typeof AppProgressBar>, "className" | "style"> {}

export default function WithProgressBar({ children, interval, step, ...props }: WithProgressBarProps) {
    const pathname = usePathname();
    const query = useSearchParams();

    const path = pathname + query.toString();

    const progressBar = useRef<HTMLDivElement>(null);

    const progress = useRef(
        createProgress({
            minimum: 0,
            maximum: 100,
            interval: interval ?? 50,
            step: step ?? ((value) => (value < 99 ? Math.random() * (value < 80 ? 2 : 1) : 0)),
            onStart: () => {
                progressBar.current?.style.setProperty("opacity", "1");
            },
            onStop: () => {
                progressBar.current?.style.setProperty("opacity", "0");
            },
            onChange: (value) => {
                progressBar.current?.style.setProperty("width", value + "%");
            },
        })
    );

    const onTransitionEnd = useCallback(() => {
        if (!progress.current.isActive) {
            // Reset progress to prevent bar animating from full width
            progress.current.set(0);
        }
    }, [progress]);

    const onRouteChange = useCallback(
        (target?: string) => {
            if (target && target === path) progress.current.stop();
            else progress.current.start();
        },
        [path]
    );
    const routerIntercepters = useMemo<RouterInterceptors>(
        () => ({
            onBack: onRouteChange,
            onForward: onRouteChange,
            onPush: onRouteChange,
            onReplace: onRouteChange,
        }),
        [onRouteChange]
    );
    const router = useInterceptedAppRouter(routerIntercepters);

    // * Called on router navigation end
    useEffect(() => {
        if (progress.current.isActive) progress.current.stop();
    }, [path]);

    const onPopState = useCallback(() => {
        progress.current.start();
    }, []);
    useInterceptPopState(onPopState);

    return (
        <AppRouterContext.Provider value={router}>
            {children}
            <AppProgressBar ref={progressBar} onTransitionEnd={onTransitionEnd} {...props} />
        </AppRouterContext.Provider>
    );
}
