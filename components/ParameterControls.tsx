
import React, { useState, useEffect } from 'react'; // useState, useEffect をインポート
import type { ParametersState, Parameter } from '../types';
import { PARAMETER_DEFINITIONS } from '../constants';
import { SliderInput } from './SliderInput';

interface ParameterControlsProps {
  parameters: ParametersState;
  initialParameters: ParametersState;
  onParametersChange: (newParams: ParametersState) => void;
  onReset: () => void;
  isRealtimeUpdateEnabled: boolean; // 追加
  onToggleRealtimeUpdate: (enabled: boolean) => void; // 追加
  onManualUpdate: (params: ParametersState) => void; // 追加
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  initialParameters,
  onParametersChange,
  onReset,
  isRealtimeUpdateEnabled,
  onToggleRealtimeUpdate,
  onManualUpdate,
}) => {
  const [localParameters, setLocalParameters] = useState<ParametersState>(parameters); // 追加

  // parameters プロップが変更されたときに localParameters を同期
  useEffect(() => {
    setLocalParameters(parameters);
  }, [parameters]);

  // Check if current parameters are different from initial parameters (for Reset button)
  const hasParametersChanged = Object.keys(localParameters).some(
    (key) => localParameters[key as keyof ParametersState] !== initialParameters[key as keyof ParametersState]
  );

  // Check if local parameters are different from App's parameters (for Update button)
  const hasUnsavedChanges = Object.keys(localParameters).some( // 追加
    (key) => localParameters[key as keyof ParametersState] !== parameters[key as keyof ParametersState]
  );

  const handleChange = (paramId: keyof ParametersState, value: number) => {
    const newLocalParams = {
      ...localParameters,
      [paramId]: value,
    };
    setLocalParameters(newLocalParams); // ローカルstateを更新

    if (isRealtimeUpdateEnabled) {
      onParametersChange(newLocalParams); // リアルタイム更新が有効なら親に伝播
    }
  };

  const handleUpdateClick = () => { // 追加
    onManualUpdate(localParameters); // 手動更新ボタンが押されたら親にローカルstateを伝播
  };

  return (
    <div className="space-y-6 p-1 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold text-center text-teal-300 mb-4 border-b border-gray-700 pb-2">
        Model Parameters
      </h2>

      {/* リアルタイム更新トグルスイッチ */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300 text-lg">リアルタイム更新</span>
        <label htmlFor="realtime-toggle" className="flex items-center cursor-pointer">
          <div className={"relative " + (isRealtimeUpdateEnabled ? 'is-checked' : '')}>
            <input
              type="checkbox"
              id="realtime-toggle"
              className="sr-only"
              checked={isRealtimeUpdateEnabled}
              onChange={(e) => onToggleRealtimeUpdate(e.target.checked)}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
          </div>
        </label>
      </div>

      {PARAMETER_DEFINITIONS.map((paramDef: Parameter) => (
        <SliderInput
          key={paramDef.id}
          id={paramDef.id}
          label={paramDef.name}
          value={localParameters[paramDef.id]} // localParameters を使用
          min={paramDef.min}
          max={paramDef.max}
          step={paramDef.step}
          onChange={(value) => handleChange(paramDef.id, value)}
        />
      ))}

      {/* 更新ボタン */}
      {!isRealtimeUpdateEnabled && ( // リアルタイム更新がオフの場合のみ表示
        <button
          onClick={handleUpdateClick}
          disabled={!hasUnsavedChanges} // 未保存の変更がある場合のみ有効
          className={`w-full mt-4 py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out ${
            hasUnsavedChanges
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          更新
        </button>
      )}

      <button
        onClick={onReset}
        disabled={!hasParametersChanged}
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
