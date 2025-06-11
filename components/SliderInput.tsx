
import React from 'react';

interface SliderInputProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    } else if (event.target.value === "") {
        // Allow clearing input, could set to min or a default
        onChange(min);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}: <span className="text-teal-400 font-semibold">{value.toFixed(step.toString().includes('.') ? step.toString().split('.')[1].length : 2)}</span>
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          id={id}
          name={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm text-right focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
    </div>
  );
};
