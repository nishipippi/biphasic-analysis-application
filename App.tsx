
import React, { useState, useEffect, useCallback } from 'react';
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

  const handleParametersChange = useCallback((newParams: ParametersState) => {
    setIsLoading(true);
    setParameters(newParams);
    // When parameters change, existing trajectory might become irrelevant or could be recalculated.
    // For now, let's clear it, or user can click again.
    // setTrajectoryStartPoint(null); // Optional: clear trajectory on param change
  }, []);

  const handleResetParameters = useCallback(() => {
    setIsLoading(true);
    setParameters(INITIAL_PARAMETERS);
    setTrajectoryStartPoint(null); 
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


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 p-4 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-teal-400">Biphasic System Analyzer</h1>
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
