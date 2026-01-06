'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  targetSelector: string
}

interface TutorialProps {
  steps: TutorialStep[]
  onComplete: () => void
}

export default function Tutorial({ steps, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [elementFound, setElementFound] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete()
      return
    }

    const step = steps[currentStep]
    
    // Find element immediately
    const findElement = () => {
      const element = document.querySelector(step.targetSelector) as HTMLElement

      if (element) {
        setElementFound(true)
        // Get initial position
        const rect = element.getBoundingClientRect()
        setHighlightRect(rect)
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Update highlight position after scroll completes
        setTimeout(() => {
          const updatedRect = element.getBoundingClientRect()
          setHighlightRect(updatedRect)
        }, 500)
      } else {
        setElementFound(false)
        // If element not found, show tutorial card in center
        setHighlightRect({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 150,
          width: 300,
          height: 200,
          bottom: window.innerHeight / 2 + 100,
          right: window.innerWidth / 2 + 150,
        } as DOMRect)
      }
    }

    // Try immediately
    findElement()
    
    // Also try after a short delay in case DOM isn't ready
    const timeout = setTimeout(findElement, 50)
    
    return () => clearTimeout(timeout)
  }, [currentStep, steps, onComplete])

  useEffect(() => {
    const updateHighlight = () => {
      const step = steps[currentStep]
      const element = document.querySelector(step.targetSelector) as HTMLElement
      if (element) {
        setElementFound(true)
        const rect = element.getBoundingClientRect()
        setHighlightRect(rect)
      }
    }

    window.addEventListener('resize', updateHighlight)
    window.addEventListener('scroll', updateHighlight, true)

    return () => {
      window.removeEventListener('resize', updateHighlight)
      window.removeEventListener('scroll', updateHighlight, true)
    }
  }, [currentStep, steps])

  if (currentStep >= steps.length) return null

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Default position if no element found
  const defaultRect: DOMRect = {
    top: window.innerHeight / 2 - 100,
    left: window.innerWidth / 2 - 150,
    width: 300,
    height: 200,
    bottom: window.innerHeight / 2 + 100,
    right: window.innerWidth / 2 + 150,
  } as DOMRect

  const displayRect = highlightRect || defaultRect

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <>
      {/* Dark overlay with cutout for highlighted element */}
      {highlightRect && elementFound ? (
        <>
          {/* Top overlay */}
          {highlightRect.top > 0 && (
            <div
              className="fixed z-50 bg-black/60 backdrop-blur-sm transition-all duration-300"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: highlightRect.top - 8,
              }}
              onClick={handleSkip}
            />
          )}
          {/* Left overlay */}
          {highlightRect.left > 8 && (
            <div
              className="fixed z-50 bg-black/60 backdrop-blur-sm transition-all duration-300"
              style={{
                top: Math.max(0, highlightRect.top - 8),
                left: 0,
                width: highlightRect.left - 8,
                height: highlightRect.height + 16,
              }}
              onClick={handleSkip}
            />
          )}
          {/* Right overlay */}
          {highlightRect.right < window.innerWidth && (
            <div
              className="fixed z-50 bg-black/60 backdrop-blur-sm transition-all duration-300"
              style={{
                top: Math.max(0, highlightRect.top - 8),
                left: highlightRect.right + 8,
                right: 0,
                height: highlightRect.height + 16,
              }}
              onClick={handleSkip}
            />
          )}
          {/* Bottom overlay */}
          {highlightRect.bottom < window.innerHeight && (
            <div
              className="fixed z-50 bg-black/60 backdrop-blur-sm transition-all duration-300"
              style={{
                top: highlightRect.bottom + 8,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              onClick={handleSkip}
            />
          )}
          {/* Highlight box with ring */}
          <div
            className="fixed z-[51] border-4 border-[#0066cc] rounded-lg pointer-events-none transition-all duration-300 ease-out bg-transparent ring-4 ring-[#0066cc]/20"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              transition: 'top 0.3s ease-out, left 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out',
            }}
          />
        </>
      ) : (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleSkip}
        />
      )}

      {/* Tutorial card - always visible */}
      <div
        className="fixed z-[52] card p-4 shadow-xl w-72 transition-all duration-300 ease-out"
        style={{
          top: displayRect.bottom + 16 > window.innerHeight - 200
            ? displayRect.top - 180
            : Math.min(displayRect.bottom + 16, window.innerHeight - 200),
          left: Math.min(Math.max(displayRect.left, 16), window.innerWidth - 304),
          transition: 'top 0.3s ease-out, left 0.3s ease-out',
        }}
      >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-[#d4d4d1]">
                  {currentStep + 1}/{steps.length}
                </span>
                <div className="flex-1 h-0.5 bg-[#3a3a38] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0066cc] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <h3 className="serif-heading text-sm mb-1 text-[#FAF9F6]">{step.title}</h3>
              <p className="text-xs text-[#d4d4d1] leading-relaxed">{step.description}</p>
            </div>
            <button
              onClick={handleSkip}
              className="card p-1 hover:bg-[#3a3a38] transition-colors ml-2 flex-shrink-0"
              aria-label="Close tutorial"
            >
              <X className="w-3 h-3 text-[#d4d4d1]" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleSkip}
              className="card px-2 py-1 text-xs hover:bg-[#3a3a38] transition-colors text-[#d4d4d1]"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="card px-3 py-1 bg-[#0066cc] text-white text-xs hover:bg-[#0052a3] transition-colors font-medium"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
    </>
  )
}
