
import React from 'react';
import type { ParametersState, Parameter } from '../types';
import { PARAMETER_DEFINITIONS } from '../constants';
import { SliderInput } from './SliderInput';

interface ParameterControlsProps {
  parameters: ParametersState;
  initialParameters: ParametersState; // To show if it's default
  onParametersChange: (newParams: ParametersState) => void;
  onReset: () => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  initialParameters,
  onParametersChange,
  onReset,
}) => {
  // Check if current parameters are different from initial parameters
  const hasParametersChanged = Object.keys(parameters).some(
    (key) => parameters[key as keyof ParametersState] !== initialParameters[key as keyof ParametersState]
  );

  const handleChange = (paramId: keyof ParametersState, value: number) => {
    onParametersChange({
      ...parameters,
      [paramId]: value,
    });
  };

  return (
    <div className="space-y-6 p-1 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold text-center text-teal-300 mb-4 border-b border-gray-700 pb-2">
        Model Parameters
      </h2>
      {PARAMETER_DEFINITIONS.map((paramDef: Parameter) => (
        <SliderInput
          key={paramDef.id}
          id={paramDef.id}
          label={paramDef.name}
          value={parameters[paramDef.id]}
          min={paramDef.min}
          max={paramDef.max}
          step={paramDef.step}
          onChange={(value) => handleChange(paramDef.id, value)}
        />
      ))}
      <button
        onClick={onReset}
        disabled={!hasParametersChanged} // Disable if no parameters have changed
        className={`w-full mt-6 py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out ${
          hasParametersChanged
            ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Reset Parameters
      </button>
    </div>
  );
};
