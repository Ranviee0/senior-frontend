"use client"

import type React from "react"

type Step = {
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (index: number) => void
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className={`grid grid-cols-${steps.length} gap-0`}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center relative ${
              index < steps.length - 1
                ? "after:content-[''] after:absolute after:top-5 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200 after:z-0"
                : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10
                ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : currentStep > index
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-gray-200 text-gray-500"
                }`}
              onClick={() => onStepClick(index)}
              style={{ cursor: "pointer" }}
            >
              {index + 1}
            </div>
            <div className="text-sm font-medium text-center">{step.title}</div>
            <div className="text-xs text-gray-500 text-center px-2">{step.description}</div>

            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 z-0" style={{ transform: "translateX(0%)" }}>
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: currentStep > index ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
