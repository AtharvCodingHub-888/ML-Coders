import { ReactNode } from "react";
// This file has been emptied/stubbed to prevent import errors with missing @floating-ui/react package.
export const Tooltip = ({ children, ...props }: any) => <>{children}</>;
export const TooltipTrigger = ({ children, ...props }: any) => <>{children}</>;
export const TooltipContent = ({ children, ...props }: any) => <>{children}</>;
export const TooltipProvider = ({ children, ...props }: any) => <>{children}</>;

export interface TooltipProps { sideOffset?: number; children?: ReactNode; side?: string; align?: string; }
export interface TooltipTriggerProps { children?: ReactNode; asChild?: boolean; }
export interface TooltipContentProps { asChild?: boolean; className?: string; children?: ReactNode; hidden?: boolean; }
export interface TooltipProviderProps { openDelay?: number; children?: ReactNode; }
