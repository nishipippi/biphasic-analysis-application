
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
export interface PlotlyData {
  x?: (number | string | Date | null)[];
  y?: (number | string | Date | null)[];
  z?: (number | string | Date | null)[][] | (number | string | Date | null)[];
  type?: PlotlyTraceType;
  mode?: string;
  name?: string;
  line?: { color?: string; width?: number; shape?: string };
  marker?: { 
    color?: string | string[]; 
    size?: number | number[]; 
    symbol?: string | string[];
    opacity?: number;
  };
  contours?: {
    coloring?: string;
    showlines?: boolean;
    start?: number;
    end?: number;
    size?: number;
    value?: number; // For single contour line
    type?: string; // Added for 'constraint' type
    operation?: string; // Added for '=' operation
  };
  showlegend?: boolean;
  hoverinfo?: string;
  // For vector fields (represented as line segments)
  // x-coordinates for vectors [x_start1, x_end1, null, x_start2, x_end2, null, ...]
  // y-coordinates for vectors [y_start1, y_end1, null, y_start2, y_end2, null, ...]
  // For contour plots
  xaxis?: string;
  yaxis?: string;
  colorbar?: object;
  colorscale?: string | object[]; // Added for contour colorscale if needed
  showscale?: boolean; // Added for contour colorbar visibility
  text?: string | string[]; // For hover text
}

export type PlotlyTraceType = 
  | 'scatter' | 'scattergl' | 'bar' | 'pie' | 'heatmap' | 'contour' 
  | 'surface' | 'mesh3d' | 'scatter3d' | 'cone'; // Add more as needed


export interface PlotlyLayout {
  title?: string | { text: string; font?: { size?: number; color?: string; family?: string; }; x?: number; y?: number; };
  xaxis?: Partial<PlotlyAxis>;
  yaxis?: Partial<PlotlyAxis>;
  zaxis?: Partial<PlotlyAxis>;
  autosize?: boolean;
  width?: number;
  height?: number;
  margin?: { l?: number; r?: number; b?: number; t?: number; pad?: number; };
  paper_bgcolor?: string;
  plot_bgcolor?: string;
  font?: { color?: string; family?: string; };
  showlegend?: boolean;
  legend?: { 
    orientation?: 'h' | 'v';
    x?: number; 
    y?: number; 
    yanchor?: 'auto' | 'top' | 'middle' | 'bottom';
    xanchor?: 'auto' | 'left' | 'center' | 'right';
    traceorder?: string; 
    font?: { family?: string; size?: number; color?: string; }; 
    bgcolor?: string; 
    bordercolor?: string; 
    borderwidth?: number; 
  };
  grid?: { rows: number; columns: number; pattern: 'independent' }; // For subplots
  annotations?: Partial<PlotlyAnnotation>[];
  shapes?: Partial<PlotlyShape>[];
}

export interface PlotlyAxis {
  title?: string | { text?: string; font?: { size?: number; color?: string; family?: string; }; standoff?: number; };
  range?: [number | string, number | string];
  type?: 'linear' | 'log' | 'date' | 'category';
  autorange?: boolean | 'reversed';
  showgrid?: boolean;
  zeroline?: boolean;
  gridcolor?: string;
  linecolor?: string;
  linewidth?: number;
  tickfont?: { size?: number; color?: string; family?: string; };
  tickcolor?: string;
  dtick?: number | string; // Tick spacing
  fixedrange?: boolean; // Disable zoom/pan on this axis
  scaleanchor?: string; // e.g., "y" to make x-axis scale with y-axis for square plots
  scaleratio?: number;  // e.g., 1 for square plots
  zerolinecolor?: string;
  zerolinewidth?: number;
  constrain?: 'range' | 'domain';
  constraintoward?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export interface PlotlyAnnotation {
  x?: number | string;
  y?: number | string;
  ax?: number;
  ay?: number;
  xref?: 'paper' | 'x';
  yref?: 'paper' | 'y';
  axref?: 'pixel'; // Typically 'pixel' for arrowheads
  ayref?: 'pixel'; // Typically 'pixel' for arrowheads
  text?: string;
  showarrow?: boolean;
  arrowhead?: number; // Style of arrowhead
  arrowsize?: number;
  arrowwidth?: number;
  arrowcolor?: string;
  font?: { size?: number; color?: string; };
  bgcolor?: string;
  borderpad?: number;
}

export interface PlotlyShape {
  type?: 'rect' | 'circle' | 'line' | 'path';
  xref?: 'paper' | 'x';
  yref?: 'paper' | 'y';
  x0?: number | string;
  y0?: number | string;
  x1?: number | string;
  y1?: number | string;
  xs?: (number | string)[]; // For path
  ys?: (number | string)[]; // For path
  path?: string; // SVG path string
  fillcolor?: string;
  opacity?: number;
  line?: { color?: string; width?: number; dash?: string; };
}
