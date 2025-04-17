import React from 'react';
import { cn } from '@/lib/constant/utils';
import { CheckCircle2 } from 'lucide-react';

const CheckoutSteps = ({ current = 0 }) => {
  const steps = ['User Login', 'Shipping Address', 'Payment Method', 'Place Order'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="relative">
        {/* Progress line - desktop */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden md:block" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 hidden md:block transition-all duration-300"
          style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
        />

        {/* Progress container */}
        <div className="flex justify-between items-center relative z-10 overflow-x-auto">
          <div className="flex flex-nowrap md:flex-row justify-between w-full min-w-max md:min-w-0 gap-2 md:gap-0">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-2 px-2">
                  {/* Step indicator */}
                  <div
                    className={cn(
                      'w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2',
                      'transition-colors duration-300 shrink-0',
                      index < current 
                        ? 'bg-primary border-primary text-white'
                        : index === current
                        ? 'border-primary bg-white text-primary'
                        : 'border-gray-300 bg-white text-gray-400'
                    )}
                  >
                    {index < current ? (
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <span className="font-medium text-sm md:text-base">{index + 1}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={cn(
                      'text-xs md:text-sm font-medium text-center whitespace-nowrap',
                      index <= current ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step}
                  </span>
                </div>

                {/* Connector - only show between steps */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    'h-1 bg-gray-200 mx-1',
                    'w-8 md:w-16 lg:w-24',
                    'hidden md:block'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;