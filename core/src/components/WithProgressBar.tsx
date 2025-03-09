"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, PropsWithChildren, useCallback, useEffect, useRef } from "react";
import {
    NavigationInterceptionProvider,
    NavigationInterceptors,
    useNavigationInterceptors,
} from "@yaredfall/next-navigation-interception";
import { ProgressOptions, createProgress } from "../utils/progress";
import { AppProgressBar } from "./AppProgressBar";

interface WithProgressBarProps
    extends PropsWithChildren,
        Partial<Pick<ProgressOptions, "interval" | "step">>,
        Pick<ComponentPropsWithoutRef<typeof AppProgressBar>, "className" | "style"> {}

function PrivateWithProgressBar({ children, interval, step, ...props }: WithProgressBarProps) {
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
    type NavigationInterceptor = Exclude<Exclude<NavigationInterceptors, undefined>[keyof NavigationInterceptors], undefined>;
    const onRouteChange = useCallback(
        ({ args }: Parameters<NavigationInterceptor>[0]) => {
            const [target] = args;
            if (target && target === path) progress.current.stop();
            else progress.current.start();
        },
        [path]
    );
    const onPopState = useCallback(() => {
        progress.current.start();
    }, []);

    useNavigationInterceptors({
        onBack: onRouteChange,
        onForward: onRouteChange,
        onPush: onRouteChange,
        onReplace: onRouteChange,
        onRefresh: onRouteChange,
        onPopstate: onPopState,
    });

    // * Called on router navigation end
    useEffect(() => {
        if (progress.current.isActive) progress.current.stop();
    }, [path]);

    return (
        <>
            {children}
            <AppProgressBar ref={progressBar} onTransitionEnd={onTransitionEnd} {...props} />
        </>
    );
}

export default function WithProgressBar(props: WithProgressBarProps) {
    return (
        <NavigationInterceptionProvider>
            <PrivateWithProgressBar {...props} />
        </NavigationInterceptionProvider>
    );
}
