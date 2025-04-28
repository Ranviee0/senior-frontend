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
  // Calculate grid template columns based on number of steps
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
  }

  return (
    <div className="mb-8">
      <div style={gridStyle} className="gap-0">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* Step circle */}
            <button
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 transition-colors
                ${
                  currentStep === index
                    ? "bg-primary text-primary-foreground"
                    : currentStep > index
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-gray-200 text-gray-500"
                }`}
              onClick={() => onStepClick(index)}
            >
              {index + 1}
            </button>

            {/* Step text */}
            <div className="text-sm font-medium text-center">{step.title}</div>
            <div className="text-xs text-gray-500 text-center px-2">{step.description}</div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-300"
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
