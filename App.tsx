import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { ParameterControls } from './components/ParameterControls';
import { PhasePlanePlot } from './components/PhasePlanePlot';
import { TimeCoursePlot } from './components/TimeCoursePlot';
import { Spinner } from './components/Spinner';
import { useOdeSolver } from './hooks/useOdeSolver';
import type { ParametersState, TrajectoryPoint } from './types';
import { INITIAL_PARAMETERS, PLOT_DOMAIN, ODE_CONFIG } from './constants';

const App: React.FC = () => {
  const [parameters, setParameters] = useState<ParametersState>(INITIAL_PARAMETERS);
  const [trajectoryStartPoint, setTrajectoryStartPoint] = useState<TrajectoryPoint | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial calculation
  const [isRealtimeUpdateEnabled, setIsRealtimeUpdateEnabled] = useState<boolean>(true); // 追加
  const [updateTrigger, setUpdateTrigger] = useState<number>(0); // 追加

  const handleParametersChange = useCallback((newParams: ParametersState) => {
    // リアルタイム更新が有効な場合のみ、Appのparameters stateを更新
    if (isRealtimeUpdateEnabled) {
      setIsLoading(true);
      setParameters(newParams);
    }
  }, [isRealtimeUpdateEnabled]); // isRealtimeUpdateEnabled を依存配列に追加

  const handleResetParameters = useCallback(() => {
    setIsLoading(true);
    setParameters(INITIAL_PARAMETERS);
    setTrajectoryStartPoint(null);
    setUpdateTrigger(prev => prev + 1); // リセット時も更新をトリガー
  }, []);

  const handleManualUpdate = useCallback((paramsToUpdate: ParametersState) => { // 追加
    setIsLoading(true);
    setParameters(paramsToUpdate); // ParameterControlsから渡された最新のパラメータで更新
    setUpdateTrigger(prev => prev + 1); // useOdeSolverを再トリガー
  }, []);

  const handlePhasePlaneClick = useCallback((point: TrajectoryPoint) => {
    setIsLoading(true);
    setTrajectoryStartPoint(point);
  }, []);

  const {
    vectorFieldData,
    xNullclineData,
    yNullclineData,
    fixedPointsData,
    trajectoryData,
    timeCourseData,
  } = useOdeSolver({
    parameters,
    plotDomain: PLOT_DOMAIN,
    odeConfig: ODE_CONFIG,
    trajectoryStartPoint,
    updateTrigger, // 新しいプロップとして追加
  });
  
  useEffect(() => {
    // This effect runs after the state updates and useOdeSolver has (re)computed.
    // It's a way to turn off the loading indicator after computations are reflected.
    if (isLoading) {
      // Give a brief moment for React to render changes before hiding spinner
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 50); // Adjust timeout as needed, or use a more sophisticated loading pattern
      return () => clearTimeout(timer);
    }
  }, [isLoading, vectorFieldData, xNullclineData, yNullclineData, fixedPointsData, trajectoryData, timeCourseData]); // Depend on data to ensure it's updated

  // Initial load
  useEffect(() => {
    setIsLoading(true); // Ensure loading is true for the very first calculation
    // Data calculation is triggered by useOdeSolver based on initial states
    // The general useEffect above will handle turning off isLoading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formulaRef1 = useRef<HTMLDivElement>(null);
  const formulaRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formulaRef1.current) {
      katex.render(
        "\\frac{dx}{dt} = \\frac{\\alpha_x}{1 + (y/K_{dy})^{n_y}} - d_x x + I_x",
        formulaRef1.current,
        {
          throwOnError: false,
          displayMode: false, // For inline math
        }
      );
    }
    if (formulaRef2.current) {
      katex.render(
        "\\frac{dy}{dt} = \\frac{\\alpha_y}{1 + (x/K_{dx})^{n_x}} - d_y y + I_y",
        formulaRef2.current,
        {
          throwOnError: false,
          displayMode: false, // For inline math
        }
      );
    }
  }, []);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-center flex-wrap">
          <h1 className="text-3xl font-bold text-teal-400">Biphasic System Analyzer</h1>
          <div className="flex text-gray-300 text-xl mt-2 ml-4 space-x-4">
            <div ref={formulaRef1}></div>
            <div ref={formulaRef2}></div>
          </div>
        </div>
      </header>

      {isLoading && <Spinner />}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Controls */}
        <div className="w-1/3 p-4 overflow-y-auto bg-gray-800 shadow-md border-r border-gray-700 space-y-6">
          <ParameterControls
            parameters={parameters}
            onParametersChange={handleParametersChange}
            onReset={handleResetParameters}
            initialParameters={INITIAL_PARAMETERS}
            isRealtimeUpdateEnabled={isRealtimeUpdateEnabled} // 新しいプロップ
            onToggleRealtimeUpdate={setIsRealtimeUpdateEnabled} // 新しいプロップ
            onManualUpdate={handleManualUpdate} // 新しいプロップ
          />
        </div>

        {/* Right Panel: Visualizations */}
        <div className="w-2/3 flex flex-col p-4 space-y-4 overflow-hidden">
          <div className="flex-1 bg-gray-800 p-2 rounded-lg shadow-inner min-h-0"> {/* min-h-0 is crucial for flex item to shrink */}
            {/* <h2 className="text-xl font-semibold mb-2 text-center text-teal-300">Phase Plane</h2> */}
            <PhasePlanePlot
              vectorFieldData={vectorFieldData}
              xNullclineData={xNullclineData}
              yNullclineData={yNullclineData}
              fixedPointsData={fixedPointsData}
              trajectoryData={trajectoryData}
              onClick={handlePhasePlaneClick}
              xDomain={[PLOT_DOMAIN.xMin, PLOT_DOMAIN.xMax]}
              yDomain={[PLOT_DOMAIN.yMin, PLOT_DOMAIN.yMax]}
            />
          </div>
          <div className="flex-1 bg-gray-800 p-2 rounded-lg shadow-inner min-h-0">
            {/* <h2 className="text-xl font-semibold mb-2 text-center text-teal-300">Time-Course</h2> */}
            <TimeCoursePlot
              timeCourseData={timeCourseData}
              tMax={PLOT_DOMAIN.tMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
