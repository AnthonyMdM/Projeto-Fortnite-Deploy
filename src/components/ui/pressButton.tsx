"use client";

import { useState, useRef } from "react";
import { Button } from "@/src/components/ui-cn/button";
import { Progress } from "@radix-ui/react-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { twMerge } from "tailwind-merge"; // importante para combinar classes Tailwind

interface HoldButtonProps {
  duration?: number;
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string; // <--- nova prop para customização externa
  tooltipText?: string; // opcional para o conteúdo do tooltip
}

export function HoldButton({
  duration = 2000,
  onConfirm,
  children,
  className,
  tooltipText = "Aperte e Segure",
}: HoldButtonProps) {
  const [value, setValue] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setValue(progress * 100);

      if (progress >= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onConfirm();
        setValue(0);
      }
    }, 16); // atualiza ~60fps
  };

  const handlePressEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setValue(0);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={twMerge(
              "relative overflow-hidden rounded-lg bg-yellow-300 backdrop-blur-md text-black font-roboto font-semibold shadow-md transition-all hover:scale-105 active:scale-95",
              className // aplica classes externas
            )}
          >
            {children}

            <Progress className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded">
              <div
                className="h-full bg-linear-to-r from-gray-500 to-black rounded transition-all duration-16"
                style={{ width: `${value}%` }}
              />
            </Progress>
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="bg-black/30 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium animate-fade-in mt-2"
        >
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
