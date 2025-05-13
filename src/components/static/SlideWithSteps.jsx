import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Slide from './Slide';

/**
 * SlideWithSteps manages step progression for a slide.
 * @param {Object} props
 * @param {Object} props.slide - The slide data (with base and steps)
 */
const SlideWithSteps = ({ slide, onPrevSlide, onNextSlide, isFirstSlide, isLastSlide }) => {
  const [step, setStep] = useState(0);
  const totalSteps = slide.steps ? slide.steps.length : 0;

  // Reset step to 0 when slide changes
  useEffect(() => {
    setStep(0);
  }, [slide]);

  // Compose slide content up to current step
  const composed = useMemo(() => {
    const base = slide.base || {};
    const composedBody = [base.body];
    // Always rebuild readings from base + step adds
    const composedReadings = {};
    // Start with base readings (deep copy)
    if (base.readings) {
      for (const key of Object.keys(base.readings)) {
        composedReadings[key] = {
          label: base.readings[key].label || '',
          content: Array.isArray(base.readings[key].content) ? [...base.readings[key].content] : []
        };
      }
    }
    // Apply step adds up to current step
    if (Array.isArray(slide.steps)) {
      for (let i = 0; i < step; i++) {
        const s = slide.steps[i];
        if (s && s.body && Array.isArray(s.body.add)) {
          composedBody.push(...s.body.add);
        }
        if (s && s.readings) {
          for (const key of Object.keys(s.readings)) {
            if (!composedReadings[key]) {
              composedReadings[key] = {
                label: s.readings[key]?.label || '',
                content: []
              };
            }
            if (s.readings[key] && Array.isArray(s.readings[key].add)) {
              composedReadings[key].content = [
                ...composedReadings[key].content,
                ...s.readings[key].add
              ];
            }
          }
        }
      }
    }
    return {
      heading: base.heading,
      body: composedBody.join('\n\n'),
      readings: composedReadings
    };
  }, [slide, step]);

  return (
    <div style={{ width: '100%' }}>
      <Slide slide={composed} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          justifyContent: 'center',
          marginTop: 16
        }}
      >
        <button
          onClick={onPrevSlide}
          disabled={isFirstSlide}
          aria-label="Previous slide"
          style={{
            background: 'none',
            border: 'none',
            cursor: isFirstSlide ? 'not-allowed' : 'pointer',
            color: isFirstSlide ? '#444' : '#0f0',
            fontSize: 28
          }}
        >
          <FaArrowLeft size={32} />
        </button>
        <button
          onClick={() => {
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          aria-label="Previous step"
          style={{
            background: 'none',
            border: 'none',
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            color: step === 0 ? '#444' : '#0f0',
            fontSize: 22
          }}
        >
          <FaArrowLeft size={22} />
        </button>
        <span style={{ color: '#0f0', fontFamily: 'monospace', minWidth: 80, textAlign: 'center' }}>
          Step {step + 1} / {totalSteps + 1}
        </span>
        <button
          onClick={() => {
            setStep((s) => Math.min(totalSteps, s + 1));
          }}
          disabled={step === totalSteps}
          aria-label="Next step"
          style={{
            background: 'none',
            border: 'none',
            cursor: step === totalSteps ? 'not-allowed' : 'pointer',
            color: step === totalSteps ? '#444' : '#0f0',
            fontSize: 22
          }}
        >
          <FaArrowRight size={22} />
        </button>
        <button
          onClick={onNextSlide}
          disabled={isLastSlide}
          aria-label="Next slide"
          style={{
            background: 'none',
            border: 'none',
            cursor: isLastSlide ? 'not-allowed' : 'pointer',
            color: isLastSlide ? '#444' : '#0f0',
            fontSize: 28
          }}
        >
          <FaArrowRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default SlideWithSteps;
