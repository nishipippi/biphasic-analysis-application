
import React, { useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min'; // Using dist-min for smaller bundle
import type { PlotlyData, PlotlyLayout, TrajectoryPoint } from '../types';
// import { COLORS } from '../constants'; // COLORS is not used in this file directly in the provided snippet

interface PhasePlanePlotProps {
  vectorFieldData: PlotlyData[] | null;
  xNullclineData: PlotlyData | null;
  yNullclineData: PlotlyData | null;
  fixedPointsData: PlotlyData | null;
  trajectoryData: PlotlyData | null;
  onClick: (point: TrajectoryPoint) => void;
  xDomain: [number, number];
  yDomain: [number, number];
}

export const PhasePlanePlot: React.FC<PhasePlanePlotProps> = ({
  vectorFieldData,
  xNullclineData,
  yNullclineData,
  fixedPointsData,
  trajectoryData,
  onClick,
  xDomain,
  yDomain,
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotRef.current) {
      const data: PlotlyData[] = [];
      if (vectorFieldData) data.push(...vectorFieldData);
      if (xNullclineData) data.push(xNullclineData);
      if (yNullclineData) data.push(yNullclineData);
      if (fixedPointsData) data.push(fixedPointsData);
      if (trajectoryData) data.push(trajectoryData);

      const layout: Partial<PlotlyLayout> = {
        xaxis: { 
          title: { text: 'x', font: { color: '#CBD5E0' } }, 
          range: xDomain, 
          zeroline: true, 
          gridcolor: '#4A5568', 
          linecolor: '#CBD5E0', 
          tickfont: { color: '#CBD5E0' },
          fixedrange: true, // Prevents zoom/pan by default
        },
        yaxis: { 
          title: { text: 'y', font: { color: '#CBD5E0' } }, 
          range: yDomain, 
          zeroline: true, 
          gridcolor: '#4A5568', 
          linecolor: '#CBD5E0',
          tickfont: { color: '#CBD5E0' },
          fixedrange: true,
        },
        title: { // 追加
          text: 'Phase Plane',
          font: { color: '#E2E8F0', size: 20 },
          x: 0.05, // グラフの左端から5%の位置
          xanchor: 'left',
          y: 0.95, // グラフの上端から5%の位置
          yanchor: 'top'
        },
        showlegend: true,
        legend: {
          bgcolor: 'rgba(42,52,65,0.8)',
          font: { color: '#E2E8F0' },
          orientation: 'h',
          yanchor: 'top', // 変更
          y: 0.98, // 変更
          xanchor: 'right',
          x: 1
        },
        margin: { l: 50, r: 20, b: 50, t: 50, pad: 4 }, // t: 30 から 50 に変更
        paper_bgcolor: '#1A202C',
        plot_bgcolor: '#2D3748',
        autosize: true,
      };

      Plotly.react(plotRef.current, data, layout, {responsive: true});

      // Handle click events for trajectories
      // Use type assertion for 'on' method and eventData
      (plotRef.current as any).on('plotly_click', (eventData: any) => {
        if (eventData.points.length > 0) {
          // Check if click is on an actual data point of a plot meant for interaction
          // (e.g. not on a legend item or annotation)
          // For simplicity, we assume any click on the plot area is valid.
          const point = eventData.points[0];
          const x = typeof point.x === 'number' ? point.x : parseFloat(String(point.x));
          const y = typeof point.y === 'number' ? point.y : parseFloat(String(point.y));
          if (!isNaN(x) && !isNaN(y)) {
             onClick({ x, y });
          }
        }
      });
    }
    // Cleanup Plotly event listener
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current); // Cleans up the plot instance
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vectorFieldData, xNullclineData, yNullclineData, fixedPointsData, trajectoryData, xDomain, yDomain]); // onClick is stable due to useCallback

  return <div ref={plotRef} className="w-full h-full min-h-[300px]"></div>;
};
