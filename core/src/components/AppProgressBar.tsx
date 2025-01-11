import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

export const AppProgressBar = forwardRef<ComponentRef<"div">, Omit<ComponentPropsWithoutRef<"div">, "children">>(
    ({ style, ...other }, ref) => {
        return (
            <div
                ref={ref}
                style={{
                    height: 2,
                    width: 0,
                    opacity: 0,
                    color: "red",
                    backgroundColor: "currentColor",
                    position: "fixed",
                    transition: "width ease 100ms, opacity ease 300ms",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999999,
                    ...style,
                }}
                aria-hidden
                inert
                {...other}
            >
                <div
                    style={{
                        width: 100,
                        height: "100%",
                        background: "linear-gradient(to right, transparent, currentColor)",
                        filter: "blur(2px)",
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                ></div>
            </div>
        );
    }
);
AppProgressBar.displayName = "AppProgressBar";
