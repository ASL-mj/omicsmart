import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 轨迹图组件
 * 用途：展示细胞发育轨迹、伪时序分析
 * 特点：曲线路径、分支结构、时间轴标注
 */
const TrajectoryChart = ({
  data = { points: [], paths: [] },
  height: containerHeight = 600,
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

  const [config, setConfig] = useState({
    title: '轨迹图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 点参数
    pointSize: 6,
    pointOpacity: 0.8,
    pointStrokeWidth: 2,
    pointStrokeColor: '#ffffff',
    showPointLabels: true,
    pointLabelFontSize: 10,
    
    // 路径参数
    pathWidth: 3,
    pathOpacity: 0.6,
    pathCurve: 'curveMonotoneX', // 曲线类型
    showArrows: true,
    arrowSize: 8,
    
    // 时间轴
    showTimeAxis: true,
    timeAxisPosition: 'bottom',
    
    colors: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#ffca28'],
    
    marginTop: 60,
    marginRight: 140,
    marginBottom: 80,
    marginLeft: 80,
  });

  const processedData = useMemo(() => {
    const { points, paths } = data;
    
    if (!points || points.length === 0) return { points: [], paths: [], branches: [] };
    
    // 处理点
    const processedPoints = points.map(point => ({
      ...point,
      x: point.x || 0,
      y: point.y || 0,
      time: point.time || 0,
      branch: point.branch || 'main',
      label: point.label || '',
    }));
    
    // 处理路径
    const processedPaths = paths.map(path => ({
      ...path,
      from: path.from,
      to: path.to,
      branch: path.branch || 'main',
    }));
    
    // 获取所有分支
    const branches = [...new Set(processedPoints.map(p => p.branch))];
    
    return {
      points: processedPoints,
      paths: processedPaths,
      branches,
    };
  }, [data]);

  const legendItems = useMemo(() => {
    return processedData.branches.map((branch, index) => ({
      name: branch,
      color: config.colors[index % config.colors.length],
      symbolType: 'line',
    }));
  }, [processedData, config.colors]);

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
    if (!svgRef.current || processedData.points.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    const { points, paths, branches } = processedData;

    // 比例尺
    const xExtent = d3.extent(points, d => d.x);
    const yExtent = d3.extent(points, d => d.y);
    
    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] * 0.9, xExtent[1] * 1.1])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] * 0.9, yExtent[1] * 1.1])
      .range([innerHeight, 0])
      .nice();

    // 颜色比例尺
    const colorScale = d3
      .scaleOrdinal()
      .domain(branches)
      .range(config.colors);

    // 定义箭头标记
    if (config.showArrows) {
      const defs = svg.append('defs');
      
      branches.forEach(branch => {
        defs
          .append('marker')
          .attr('id', `arrow-${branch}`)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 8)
          .attr('refY', 0)
          .attr('markerWidth', config.arrowSize)
          .attr('markerHeight', config.arrowSize)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', colorScale(branch));
      });
    }

    // 绘制路径
    paths.forEach(path => {
      const fromPoint = points[path.from];
      const toPoint = points[path.to];
      
      if (!fromPoint || !toPoint) return;
      
      const line = g
        .append('line')
        .attr('x1', xScale(fromPoint.x))
        .attr('y1', yScale(fromPoint.y))
        .attr('x2', xScale(toPoint.x))
        .attr('y2', yScale(toPoint.y))
        .attr('stroke', colorScale(path.branch))
        .attr('stroke-width', config.pathWidth)
        .attr('stroke-opacity', config.pathOpacity)
        .attr('fill', 'none');
      
      if (config.showArrows) {
        line.attr('marker-end', `url(#arrow-${path.branch})`);
      }
    });

    // 绘制点
    g.selectAll('.point')
      .data(points)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', config.pointSize)
      .attr('fill', d => colorScale(d.branch))
      .attr('opacity', config.pointOpacity)
      .attr('stroke', config.pointStrokeColor)
      .attr('stroke-width', config.pointStrokeWidth)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', config.pointSize * 1.5).attr('opacity', 1);
        
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');

        const tooltipBg = tooltip
          .append('rect')
          .attr('fill', 'white')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('rx', 4);

        const tooltipText = tooltip
          .append('text')
          .attr('font-size', '12px')
          .attr('fill', '#333');

        if (d.label) {
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').attr('font-weight', 'bold').text(d.label);
        }
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`分支: ${d.branch}`);
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`时间: ${d.time}`);
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`坐标: (${d.x.toFixed(1)}, ${d.y.toFixed(1)})`);

        const bbox = tooltipText.node().getBBox();
        tooltipBg
          .attr('x', bbox.x - 8)
          .attr('y', bbox.y - 4)
          .attr('width', bbox.width + 16)
          .attr('height', bbox.height + 8);

        const tooltipX = xScale(d.x) + 15;
        const tooltipY = yScale(d.y) - bbox.height / 2;
        tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', config.pointSize).attr('opacity', config.pointOpacity);
        g.selectAll('.tooltip').remove();
      });

    // 点标签
    if (config.showPointLabels) {
      g.selectAll('.point-label')
        .data(points.filter(p => p.label))
        .join('text')
        .attr('class', 'point-label')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y) - config.pointSize - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', config.pointLabelFontSize)
        .attr('fill', '#333')
        .attr('font-weight', 'bold')
        .style('pointer-events', 'none')
        .text(d => d.label);
    }

    // 时间轴
    if (config.showTimeAxis) {
      const timeExtent = d3.extent(points, d => d.time);
      const timeScale = d3
        .scaleLinear()
        .domain(timeExtent)
        .range([0, innerWidth]);

      const timeAxis = d3.axisBottom(timeScale).ticks(5);
      
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(timeAxis)
        .selectAll('text')
        .style('font-size', '12px');
      
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#333')
        .text('伪时间');
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

  const renderSettingsPanel = () => {
    return (
      <Tabs
        defaultActiveKey="basic"
        items={[
          {
            key: 'basic',
            label: '基础设置',
            children: (
              <Collapse
                defaultActiveKey={[]}
                ghost
                items={[
                  {
                    key: 'text',
                    label: '文本样式',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="显示标题">
                          <Switch
                            checked={config.showTitle}
                            onChange={checked => setConfig({ ...config, showTitle: checked })}
                          />
                        </Form.Item>
                        {config.showTitle && (
                          <>
                            <Form.Item label="标题">
                              <input
                                type="text"
                                value={config.title}
                                onChange={e => setConfig({ ...config, title: e.target.value })}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }}
                              />
                            </Form.Item>
                          </>
                        )}
                        <Form.Item label="显示点标签">
                          <Switch
                            checked={config.showPointLabels}
                            onChange={checked => setConfig({ ...config, showPointLabels: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示时间轴">
                          <Switch
                            checked={config.showTimeAxis}
                            onChange={checked => setConfig({ ...config, showTimeAxis: checked })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: 'shape',
            label: '图形设置',
            children: (
              <Collapse
                defaultActiveKey={[]}
                ghost
                items={[
                  {
                    key: 'point',
                    label: '点参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="点大小">
                          <Slider
                            min={3}
                            max={12}
                            value={config.pointSize}
                            onChange={value => setConfig({ ...config, pointSize: value })}
                          />
                        </Form.Item>
                        <Form.Item label="点透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.pointOpacity}
                            onChange={value => setConfig({ ...config, pointOpacity: value })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'path',
                    label: '路径参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="路径宽度">
                          <Slider
                            min={1}
                            max={8}
                            value={config.pathWidth}
                            onChange={value => setConfig({ ...config, pathWidth: value })}
                          />
                        </Form.Item>
                        <Form.Item label="路径透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.pathOpacity}
                            onChange={value => setConfig({ ...config, pathOpacity: value })}
                          />
                        </Form.Item>
                        <Form.Item label="显示箭头">
                          <Switch
                            checked={config.showArrows}
                            onChange={checked => setConfig({ ...config, showArrows: checked })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    );
  };

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
              settingsPanel={renderSettingsPanel()}
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

TrajectoryChart.propTypes = {
  data: PropTypes.shape({
    points: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        time: PropTypes.number,
        branch: PropTypes.string,
        label: PropTypes.string,
      })
    ).isRequired,
    paths: PropTypes.arrayOf(
      PropTypes.shape({
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired,
        branch: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TrajectoryChart;