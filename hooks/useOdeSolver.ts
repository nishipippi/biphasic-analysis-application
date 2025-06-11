
import { useMemo } from 'react';
import type { ParametersState, TrajectoryPoint, TimePoint, PlotDomain, OdeConfig, PlotlyData } from '../types';
import { COLORS } from '../constants';

// ODE model: dx/dt and dy/dt
const odeModel = (x: number, y: number, params: ParametersState): [number, number] => {
  const { alphaX, alphaY, Kdx, Kdy, nx, ny, dx, dy, Ix, Iy } = params;

  // Ensure Kdx and Kdy are not zero to avoid division by zero.
  // The constants already define min Kdx/Kdy as 0.1, so this check is mostly for safety.
  const safeKdy = Math.max(Kdy, 1e-9);
  const safeKdx = Math.max(Kdx, 1e-9);

  const dxdt = (alphaX / (1 + Math.pow(y / safeKdy, ny))) - dx * x + Ix;
  const dydt = (alphaY / (1 + Math.pow(x / safeKdx, nx))) - dy * y + Iy;
  
  return [dxdt, dydt];
};

// 4th Order Runge-Kutta (RK4) solver
const rk4Solver = (
  initial: TrajectoryPoint,
  params: ParametersState,
  tMax: number,
  dt: number
): TimePoint[] => {
  const P = params;
  let x = initial.x;
  let y = initial.y;
  let t = 0;
  const results: TimePoint[] = [{ t, x, y }];

  while (t < tMax) {
    const [k1x, k1y] = odeModel(x, y, P);
    const [k2x, k2y] = odeModel(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y, P);
    const [k3x, k3y] = odeModel(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y, P);
    const [k4x, k4y] = odeModel(x + dt * k3x, y + dt * k3y, P);

    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    t += dt;
    
    // Ensure x and y stay within reasonable bounds if needed, e.g., non-negative
    x = Math.max(0, x);
    y = Math.max(0, y);

    results.push({ t, x, y });
    if (t + dt > tMax && t < tMax) { // ensure last step reaches tMax if dt doesn't align perfectly
        dt = tMax - t; 
    }
  }
  return results;
};

interface OdeSolverProps {
  parameters: ParametersState;
  plotDomain: PlotDomain;
  odeConfig: OdeConfig;
  trajectoryStartPoint: TrajectoryPoint | null;
}

export const useOdeSolver = ({
  parameters,
  plotDomain,
  odeConfig,
  trajectoryStartPoint,
}: OdeSolverProps) => {

  const { xMin, xMax, yMin, yMax, tMax } = plotDomain;
  const { dt, vectorFieldGridDensity, nullclineGridDensity, fixedPointThreshold } = odeConfig;

  const gridPoints = useMemo(() => {
    const xPoints = [];
    const yPoints = [];
    for (let i = 0; i <= nullclineGridDensity; i++) {
      xPoints.push(xMin + (i / nullclineGridDensity) * (xMax - xMin));
      yPoints.push(yMin + (i / nullclineGridDensity) * (yMax - yMin));
    }
    return { xPoints, yPoints };
  }, [xMin, xMax, yMin, yMax, nullclineGridDensity]);


  const derivativesGrid = useMemo(() => {
    const dxDtGrid: number[][] = [];
    const dyDtGrid: number[][] = [];
    const fixedPts: TrajectoryPoint[] = [];

    gridPoints.yPoints.forEach(yVal => {
      const dxRow: number[] = [];
      const dyRow: number[] = [];
      gridPoints.xPoints.forEach(xVal => {
        const [dxdt, dydt] = odeModel(xVal, yVal, parameters);
        dxRow.push(dxdt);
        dyRow.push(dydt);
        if (Math.abs(dxdt) < fixedPointThreshold && Math.abs(dydt) < fixedPointThreshold) {
          fixedPts.push({ x: xVal, y: yVal });
        }
      });
      dxDtGrid.push(dxRow);
      dyDtGrid.push(dyRow);
    });
    return { dxDtGrid, dyDtGrid, fixedPts };
  }, [gridPoints, parameters, fixedPointThreshold]);


  const vectorFieldData = useMemo<PlotlyData[] | null>(() => {
    const xVec: (number | null)[] = [];
    const yVec: (number | null)[] = [];
    const scaleFactor = Math.min(xMax - xMin, yMax - yMin) / vectorFieldGridDensity / 5; // Adjust scale for visibility

    for (let i = 0; i < vectorFieldGridDensity; i++) {
      for (let j = 0; j < vectorFieldGridDensity; j++) {
        const x0 = xMin + (i / (vectorFieldGridDensity-1)) * (xMax - xMin);
        const y0 = yMin + (j / (vectorFieldGridDensity-1)) * (yMax - yMin);
        const [dx_dt, dy_dt] = odeModel(x0, y0, parameters);
        
        const norm = Math.sqrt(dx_dt*dx_dt + dy_dt*dy_dt);
        const arrowLength = scaleFactor * (norm > 0 ? 1 : 0); // Normalized length or zero if no change
        
        // To make arrows more visible for small magnitudes, could use log scale or fixed length
        // For now, proportional to magnitude up to a cap (implicit by scaleFactor)
        
        const x1 = x0 + arrowLength * (norm > 0 ? dx_dt / norm : 0);
        const y1 = y0 + arrowLength * (norm > 0 ? dy_dt / norm : 0);

        xVec.push(x0, x1, null); // null to break line segment for next arrow
        yVec.push(y0, y1, null);
      }
    }
    return [{
      type: 'scattergl', // scattergl for performance with many lines
      x: xVec,
      y: yVec,
      mode: 'lines',
      name: 'Vector Field',
      line: { color: COLORS.vectorField, width: 1 },
      hoverinfo: 'none',
      showlegend: false, // Usually too cluttered for legend
    }];
  }, [parameters, xMin, xMax, yMin, yMax, vectorFieldGridDensity]);

  const xNullclineData = useMemo<PlotlyData | null>(() => {
    return {
      type: 'contour',
      x: gridPoints.xPoints,
      y: gridPoints.yPoints,
      z: derivativesGrid.dxDtGrid,
      name: 'x-nullcline (dx/dt=0)',
      contours: {
        coloring: 'lines',
        showlines: true,
        type: 'constraint',
        operation: '=',
        value: 0,
      },
      line: { color: COLORS.xNullcline, width: 2 },
      showscale: false, // Do not show color scale for contour lines
      hoverinfo: 'name',
    };
  }, [gridPoints, derivativesGrid.dxDtGrid, parameters]); // Add parameters if dxDtGrid depends on it

  const yNullclineData = useMemo<PlotlyData | null>(() => {
    return {
      type: 'contour',
      x: gridPoints.xPoints,
      y: gridPoints.yPoints,
      z: derivativesGrid.dyDtGrid,
      name: 'y-nullcline (dy/dt=0)',
      contours: {
        coloring: 'lines',
        showlines: true,
        type: 'constraint',
        operation: '=',
        value: 0,
      },
      line: { color: COLORS.yNullcline, width: 2 },
      showscale: false,
      hoverinfo: 'name',
    };
  }, [gridPoints, derivativesGrid.dyDtGrid, parameters]); // Add parameters if dyDtGrid depends on it

  const fixedPointsData = useMemo<PlotlyData | null>(() => {
    if (derivativesGrid.fixedPts.length === 0) return null;
    return {
      type: 'scattergl',
      x: derivativesGrid.fixedPts.map(p => p.x),
      y: derivativesGrid.fixedPts.map(p => p.y),
      mode: 'markers',
      name: 'Fixed Points',
      marker: { color: COLORS.fixedPoint, size: 8, symbol: 'cross' },
      hoverinfo: 'text',
      text: derivativesGrid.fixedPts.map(p => `Fixed Point<br>x: ${p.x.toFixed(2)}, y: ${p.y.toFixed(2)}`),
    };
  }, [derivativesGrid.fixedPts]);


  const trajectoryPoints = useMemo(() => {
    if (!trajectoryStartPoint) return null;
    return rk4Solver(trajectoryStartPoint, parameters, tMax, dt);
  }, [trajectoryStartPoint, parameters, tMax, dt]);

  const trajectoryData = useMemo<PlotlyData | null>(() => {
    if (!trajectoryPoints) return null;
    return {
      type: 'scattergl',
      x: trajectoryPoints.map(p => p.x),
      y: trajectoryPoints.map(p => p.y),
      mode: 'lines',
      name: 'Trajectory',
      line: { color: COLORS.trajectory, width: 2 },
      hoverinfo: 'skip', // Or show t, x, y if desired
    };
  }, [trajectoryPoints]);

  const timeCourseData = useMemo<PlotlyData[] | null>(() => {
    if (!trajectoryPoints) return null;
    return [
      {
        type: 'scattergl',
        x: trajectoryPoints.map(p => p.t),
        y: trajectoryPoints.map(p => p.x),
        mode: 'lines',
        name: 'x(t)',
        line: { color: COLORS.xTimeCourse, width: 2 },
      },
      {
        type: 'scattergl',
        x: trajectoryPoints.map(p => p.t),
        y: trajectoryPoints.map(p => p.y),
        mode: 'lines',
        name: 'y(t)',
        line: { color: COLORS.yTimeCourse, width: 2 },
      },
    ];
  }, [trajectoryPoints]);

  return {
    vectorFieldData,
    xNullclineData,
    yNullclineData,
    fixedPointsData,
    trajectoryData,
    timeCourseData,
  };
};
