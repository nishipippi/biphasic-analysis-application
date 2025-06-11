
import React, { useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { PlotlyData, PlotlyLayout } from '../types';

interface TimeCoursePlotProps {
  timeCourseData: PlotlyData[] | null;
  tMax: number;
}

export const TimeCoursePlot: React.FC<TimeCoursePlotProps> = ({ timeCourseData, tMax }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotRef.current) {
      const data: PlotlyData[] = timeCourseData || [];
      const layout: Partial<PlotlyLayout> = {
        xaxis: { 
          title: { text: 'Time (t)', font: { color: '#CBD5E0' } }, 
          range: [0, tMax], 
          gridcolor: '#4A5568', 
          linecolor: '#CBD5E0',
          tickfont: { color: '#CBD5E0' },
          fixedrange: true,
        },
        yaxis: { 
          title: { text: 'Concentration', font: { color: '#CBD5E0' } }, 
          gridcolor: '#4A5568', 
          linecolor: '#CBD5E0',
          tickfont: { color: '#CBD5E0' },
          fixedrange: true, // Often good to fix y-axis range or make it dynamic based on data
          // autorange: true, // Or set a fixed range if preferred
        },
        showlegend: true,
        legend: {
          bgcolor: 'rgba(42,52,65,0.8)',
          font: { color: '#E2E8F0' },
          orientation: 'h',
          yanchor: 'bottom',
          y: 1.02,
          xanchor: 'right',
          x: 1
        },
        margin: { l: 60, r: 20, b: 50, t: 30, pad: 4 },
        paper_bgcolor: '#1A202C',
        plot_bgcolor: '#2D3748',
        autosize: true,
      };

      Plotly.react(plotRef.current, data, layout, {responsive: true});
    }
     return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [timeCourseData, tMax]);

  return <div ref={plotRef} className="w-full h-full min-h-[300px]"></div>;
};
