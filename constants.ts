
import type { Parameter, ParametersState, PlotDomain, OdeConfig } from './types';

export const PARAMETER_DEFINITIONS: Parameter[] = [
  { id: 'alphaX', name: 'αx (Max Gen. Rate X)', min: 0, max: 100, step: 1, initialValue: 50 },
  { id: 'alphaY', name: 'αy (Max Gen. Rate Y)', min: 0, max: 100, step: 1, initialValue: 50 },
  { id: 'Kdx', name: 'Kdx (Dissoc. Const. X)', min: 0.1, max: 100, step: 0.1, initialValue: 30 },
  { id: 'Kdy', name: 'Kdy (Dissoc. Const. Y)', min: 0.1, max: 100, step: 0.1, initialValue: 30 },
  { id: 'nx', name: 'nx (Hill Coeff. X)', min: 1, max: 10, step: 0.1, initialValue: 8 },
  { id: 'ny', name: 'ny (Hill Coeff. Y)', min: 1, max: 10, step: 0.1, initialValue: 8 },
  { id: 'dx', name: 'dx (Degrad. Rate X)', min: 0, max: 5, step: 0.1, initialValue: 1 },
  { id: 'dy', name: 'dy (Degrad. Rate Y)', min: 0, max: 5, step: 0.1, initialValue: 1 },
  { id: 'Ix', name: 'Ix (Basal Input X)', min: 0, max: 100, step: 0.1, initialValue: 0 },
  { id: 'Iy', name: 'Iy (Basal Input Y)', min: 0, max: 100, step: 0.1, initialValue: 0 },
];

export const INITIAL_PARAMETERS: ParametersState = PARAMETER_DEFINITIONS.reduce(
  (acc, param) => {
    acc[param.id] = param.initialValue;
    return acc;
  },
  {} as ParametersState
);

export const PLOT_DOMAIN: PlotDomain = {
  xMin: 0,
  xMax: 100,
  yMin: 0,
  yMax: 100,
  tMax: 50,
};

export const ODE_CONFIG: OdeConfig = {
  dt: 0.05, // Time step for RK4 solver and time course plot
  vectorFieldGridDensity: 20, // Number of arrows along each axis for vector field
  nullclineGridDensity: 50,  // Grid density for calculating nullcline contours (dx/dt=0, dy/dt=0)
  fixedPointThreshold: 0.1, // Threshold for |dx/dt| and |dy/dt| to be considered a fixed point
};

// Plot colors
export const COLORS = {
  xNullcline: '#FF0000', // Red
  yNullcline: '#0000FF', // Blue
  fixedPoint: '#000000', // Black
  trajectory: '#00FF00', // Green
  // trajectory: '#FFFFFF', // White, if green is not visible enough on dark background
  xTimeCourse: '#FFA500', // Orange
  yTimeCourse: '#00FFFF', // Cyan
  vectorField: '#CCCCCC', // Light gray for vector field arrows
};
