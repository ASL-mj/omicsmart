import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 河流图组件（堆叠面积图）
 * 用途：展示细胞亚群在不同时间点的绝对值变化
 * 特点：堆叠面积图，横坐标是时间点（PRE/POST），纵坐标是细胞数量
 */
const RiverChart = ({
  data = [],
  height: containerHeight = 500,
  className = '',
  style = {},
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const chartBodyRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentContainerHeight, setCurrentContainerHeight] = useState(containerHeight);
  
  const [chartInnerDimensions, setChartInnerDimensions] = useState({
    width: 800,
    height: 600,
  });

  const [config] = useState({
    title: '绝对值结果图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    xAxisLabel: '',
    yAxisLabel: 'Number of cells',
    showXAxis: true,
    showYAxis: true,
    xAxisLabelFontSize: 14,
    yAxisLabelFontSize: 14,
    xAxisTickFontSize: 12,
    yAxisTickFontSize: 12,
    showGrid: true,
    gridColor: '#e0e0e0',
    gridOpacity: 0.3,
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    areaOpacity: 0.8,
    
    colors: ['#f4a460', '#5dade2', '#ec7063', '#52be80', '#f7dc6f', '#af7ac5', '#48c9b0', '#a569bd', '#5499c7'],
    
    marginTop: 60,
    marginRight: 200,
    marginBottom: 80,
    marginLeft: 80,
  });

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { series: [], categories: [], keys: [] };
    
    const categories = data.map(d => d.category);
    const keys = Object.keys(data[0].values || {});
    
    const stackData = d3.stack().keys(keys)(data.map(d => ({ category: d.category, ...d.values })));
    
    return {
      series: stackData.map((s, i) => ({
        key: s.key,
        values: s,
        color: config.colors[i % config.colors.length],
      })),
      categories,
      keys,
    };
  }, [data, config.colors]);

  const legendItems = useMemo(() => {
    return processedData.series.map(s => ({
      name: s.key,
      color: s.color,
      symbolType: 'rect',
    }));
  }, [processedData]);

  const handleAutoFit = () => {
    if (!svgRef.current) return;
    
    try {
      const svgElement = svgRef.current;
      const bbox = svgElement.getBBox();
      const contentHeight = bbox.height + bbox.y + 40;
      const scaledHeight = contentHeight * (zoomLevel / 100);
      const newHeight = Math.max(scaledHeight, 400);
      setCurrentContainerHeight(newHeight);
    } catch (error) {
      console.error('自适应高度失败:', error);
    }
  };
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const newWidth = container.clientWidth;
      setChartInnerDimensions(prev => ({
        ...prev,
        width: newWidth,
      }));
    };
    
    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || processedData.series.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    const { series, categories } = processedData;

    // 比例尺 - 使用 scalePoint 让面积图更平滑
    const xScale = d3.scalePoint()
      .domain(categories)
      .range([0, innerWidth])
      .padding(0.1);

    const maxY = d3.max(series[series.length - 1].values, d => d[1]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxY * 1.1])
      .range([innerHeight, 0])
      .nice();

    // 网格线
    if (config.showGrid) {
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat('')
        )
        .style('stroke', config.gridColor)
        .style('stroke-dasharray', '3,3')
        .style('stroke-opacity', config.gridOpacity)
        .select('.domain')
        .remove();
    }

    // 绘制堆叠面积图
    const area = d3.area()
      .x((d, i) => xScale(categories[i]))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    series.forEach((s) => {
      g.append('path')
        .datum(s.values)
        .attr('d', area)
        .attr('fill', s.color)
        .attr('opacity', config.areaOpacity)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('opacity', config.areaOpacity + 0.2);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', config.areaOpacity);
        });
    });

    // 坐标轴
    if (config.showXAxis) {
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('font-size', `${config.xAxisTickFontSize}px`);
    }

    if (config.showYAxis) {
      g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .selectAll('text')
        .style('font-size', `${config.yAxisTickFontSize}px`);
    }

    // Y轴标签
    if (config.showYAxis) {
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(marginTop + innerHeight / 2))
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', `${config.yAxisLabelFontSize}px`)
        .style('fill', '#333')
        .text(config.yAxisLabel);
    }

    // 标题
    if (config.showTitle) {
      svg
        .append('text')
        .attr('x', chartInnerDimensions.width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', `${config.titleFontSize}px`)
        .style('font-weight', config.titleFontWeight)
        .style('fill', config.titleColor)
        .text(config.title);
    }
  }, [processedData, chartInnerDimensions, config, zoomLevel]);

  return (
    <ChartContainer
      height={currentContainerHeight}
      className={className}
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: 4,
        padding: 16,
        backgroundColor: '#fff',
        ...style,
      }}
    >
      {({ isFullscreen: fullscreen }) => {
        if (fullscreen !== isFullscreen) {
          setIsFullscreen(fullscreen);
        }

        return (
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: fullscreen ? '#ffffff' : 'transparent',
            }}
          >
            <ChartToolbar
              containerRef={containerRef}
              svgRef={svgRef}
              isFullscreen={isFullscreen}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
              onAutoFit={handleAutoFit}
            />

            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                ref={chartBodyRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <svg
                  ref={svgRef}
                  width={chartInnerDimensions.width}
                  height={chartInnerDimensions.height}
                  style={{ display: 'block' }}
                />

                {config.showLegend && legendItems.length > 0 && (
                  <ChartLegend
                    items={legendItems}
                    position={config.legendPosition}
                    fontSize={config.legendFontSize}
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </ChartContainer>
  );
};

RiverChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      values: PropTypes.object.isRequired,
    })
  ).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default RiverChart;