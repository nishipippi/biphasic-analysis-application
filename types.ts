
export interface Parameter {
  id: keyof ParametersState;
  name: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
}

export interface ParametersState {
  alphaX: number;
  alphaY: number;
  Kdx: number;
  Kdy: number;
  nx: number;
  ny: number;
  dx: number;
  dy: number;
  Ix: number;
  Iy: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
}

export interface TimePoint extends TrajectoryPoint {
  t: number;
}

export interface PlotDomain {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  tMax: number;
}

export interface OdeConfig {
  dt: number;
  vectorFieldGridDensity: number;
  nullclineGridDensity: number;
  fixedPointThreshold: number;
}

// Plotly specific types (simplified for this context)
// For more specific types, you might install @types/plotly.js
import type { Data, Layout, Axis, Annotations, Shape } from 'plotly.js';

// Plotly specific types (simplified for this context)
// For more specific types, you might install @types/plotly.js
export type PlotlyData = Data;
export type PlotlyLayout = Layout;
export type PlotlyAxis = Axis;
export type PlotlyAnnotation = Annotations;
export type PlotlyShape = Shape;
