"use client";

import { Plus } from "lucide-react";
import { ReactNode } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { Button } from "./button";

interface ResponsiveAddButtonProps {
  children?: ReactNode;
  className?: string;
  mobileText?: string;
  desktopText: string;
  iconOnly?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function ResponsiveAddButton({
  children,
  className,
  mobileText,
  desktopText,
  iconOnly = false,
  onClick,
  disabled,
  variant = "default",
  ...props
}: ResponsiveAddButtonProps) {
  const isMobile = useIsMobile();

  const buttonText = isMobile ? mobileText || desktopText : desktopText;
  const showIconOnly = isMobile && iconOnly;

  return (
    <Button
      className={cn(
        // Classes responsivas para tamanho
        "transition-all duration-200",
        isMobile ? "h-9 px-3" : "h-9 px-4",
        className,
      )}
      variant={variant}
      size={isMobile ? "sm" : "default"}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <Plus className={cn("h-4 w-4 shrink-0", showIconOnly ? "" : "mr-2")} />
      {!showIconOnly && (
        <span
          className={cn(
            "transition-all duration-200",
            isMobile ? "text-xs" : "text-sm",
          )}
        >
          {buttonText}
        </span>
      )}
      {children}
    </Button>
  );
}
