import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';

/**
 * 渐变色散点图组件
 * 支持：根据数值显示渐变色、自动响应、工具栏、渐变色图例、参数设置
 * 特性：宽度自适应，高度固定，图表内容可超出容器
 */
const GradientScatterChart = ({
  data = [],
  valueKey = 'value',
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
  
  // 图表内部绘制尺寸（独立于容器高度）
  const [chartInnerDimensions, setChartInnerDimensions] = useState({
    width: 800,
    height: 600,
  });

  // 图表配置状态
  const [config, setConfig] = useState({
    // 基础设置 - 文本样式
    title: '散点图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    // 基础设置 - 坐标轴
    xAxisLabel: 'X 轴',
    yAxisLabel: 'Y 轴',
    showXAxis: true,
    showYAxis: true,
    xAxisLabelFontSize: 14,
    yAxisLabelFontSize: 14,
    xAxisTickFontSize: 12,
    yAxisTickFontSize: 12,
    showGrid: true,
    gridColor: '#e0e0e0',
    gridOpacity: 0.5,
    
    // 基础设置 - 图例
    showLegend: true,
    legendWidth: 20,
    legendHeight: 300,
    
    // 图形设置 - 图形参数
    pointSize: 4,
    pointOpacity: 0.8,
    pointStrokeWidth: 0,
    pointStrokeColor: '#ffffff',
    
    // 图形设置 - 渐变色
    colorScheme: 'viridis', // viridis, plasma, inferno, magma, turbo, blues, greens, reds
    
    // 边距
    marginTop: 60,
    marginRight: 100,
    marginBottom: 60,
    marginLeft: 80,
  });

  // 颜色方案映射
  const colorSchemes = {
    viridis: d3.interpolateViridis,
    plasma: d3.interpolatePlasma,
    inferno: d3.interpolateInferno,
    magma: d3.interpolateMagma,
    turbo: d3.interpolateTurbo,
    blues: d3.interpolateBlues,
    greens: d3.interpolateGreens,
    reds: d3.interpolateReds,
    oranges: d3.interpolateOranges,
    purples: d3.interpolatePurples,
  };

  // 处理数据并计算值域
  const { processedData, valueExtent } = useMemo(() => {
    if (!data || data.length === 0) {
      return { processedData: [], valueExtent: [0, 1] };
    }

    const points = data.map(point => ({
      x: point.x,
      y: point.y,
      value: point[valueKey] || 0,
      ...point,
    }));

    const extent = d3.extent(points, d => d.value);
    
    return {
      processedData: points,
      valueExtent: extent,
    };
  }, [data, valueKey]);

  // 自适应功能
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
  
  // 监听容器宽度变化
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

  // 绘制图表
  useEffect(() => {
    if (!svgRef.current || processedData.length === 0) return;

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    // 创建主绘图区域
    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    // 计算比例尺
    const xExtent = d3.extent(processedData, d => d.x);
    const yExtent = d3.extent(processedData, d => d.y);

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
      .range([innerHeight, 0])
      .nice();

    // 颜色比例尺
    const colorScale = d3
      .scaleSequential(colorSchemes[config.colorScheme] || d3.interpolateViridis)
      .domain(valueExtent);

    // 绘制网格线
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

      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickFormat('')
        )
        .style('stroke', config.gridColor)
        .style('stroke-dasharray', '3,3')
        .style('stroke-opacity', config.gridOpacity)
        .select('.domain')
        .remove();
    }

    // 绘制散点
    g.selectAll('.point')
      .data(processedData)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', config.pointSize)
      .attr('fill', d => colorScale(d.value))
      .attr('opacity', config.pointOpacity)
      .attr('stroke', config.pointStrokeColor)
      .attr('stroke-width', config.pointStrokeWidth)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('r', config.pointSize * 1.5);

        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');

        const tooltipBg = tooltip
          .append('rect')
          .attr('fill', 'white')
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .attr('rx', 4)
          .attr('ry', 4);

        const tooltipText = tooltip
          .append('text')
          .attr('font-size', '12px')
          .attr('fill', '#333');

        tooltipText
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.2em')
          .text(`X: ${typeof d.x === 'number' ? d.x.toFixed(4) : d.x}`);

        tooltipText
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.2em')
          .text(`Y: ${typeof d.y === 'number' ? d.y.toFixed(4) : d.y}`);

        tooltipText
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.2em')
          .attr('font-weight', 'bold')
          .text(`${valueKey}: ${d.value}`);

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
        d3.select(this).attr('opacity', config.pointOpacity).attr('r', config.pointSize);
        g.selectAll('.tooltip').remove();
      });

    // 绘制坐标轴
    if (config.showXAxis) {
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(8))
        .selectAll('text')
        .style('font-size', `${config.xAxisTickFontSize}px`);
    }

    if (config.showYAxis) {
      g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .selectAll('text')
        .style('font-size', `${config.yAxisTickFontSize}px`);
    }

    // X轴标签
    if (config.showXAxis) {
      svg
        .append('text')
        .attr('x', marginLeft + innerWidth / 2)
        .attr('y', chartInnerDimensions.height - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', `${config.xAxisLabelFontSize}px`)
        .style('fill', '#333')
        .text(config.xAxisLabel);
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

    // 绘制渐变色图例
    if (config.showLegend) {
      const legendX = chartInnerDimensions.width - marginRight + 40;
      const legendY = marginTop;
      const legendWidth = config.legendWidth;
      const legendHeight = config.legendHeight;

      // 创建渐变定义
      const defs = svg.append('defs');
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'gradient-legend')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

      // 添加渐变色阶
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const offset = (i / steps) * 100;
        const value = valueExtent[0] + (valueExtent[1] - valueExtent[0]) * (i / steps);
        gradient
          .append('stop')
          .attr('offset', `${offset}%`)
          .attr('stop-color', colorScale(value));
      }

      // 绘制渐变矩形
      svg
        .append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#gradient-legend)')
        .style('stroke', '#ccc')
        .style('stroke-width', 1);

      // 添加刻度
      const legendScale = d3
        .scaleLinear()
        .domain(valueExtent)
        .range([legendHeight, 0]);

      const legendAxis = d3
        .axisRight(legendScale)
        .ticks(5)
        .tickFormat(d3.format('.0f'));

      svg
        .append('g')
        .attr('transform', `translate(${legendX + legendWidth},${legendY})`)
        .call(legendAxis)
        .selectAll('text')
        .style('font-size', '12px');

      // 图例标题
      svg
        .append('text')
        .attr('x', legendX + legendWidth / 2)
        .attr('y', legendY - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(valueKey);
    }
  }, [processedData, chartInnerDimensions, config, zoomLevel, valueExtent, valueKey]);

  // 参数设置面板
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
                            <Form.Item label="标题字号">
                              <Slider
                                min={12}
                                max={32}
                                value={config.titleFontSize}
                                onChange={value => setConfig({ ...config, titleFontSize: value })}
                              />
                            </Form.Item>
                          </>
                        )}
                      </Form>
                    ),
                  },
                  {
                    key: 'axis',
                    label: '坐标轴',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="显示X轴">
                          <Switch
                            checked={config.showXAxis}
                            onChange={checked => setConfig({ ...config, showXAxis: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示Y轴">
                          <Switch
                            checked={config.showYAxis}
                            onChange={checked => setConfig({ ...config, showYAxis: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示网格">
                          <Switch
                            checked={config.showGrid}
                            onChange={checked => setConfig({ ...config, showGrid: checked })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'legend',
                    label: '图例',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="显示图例">
                          <Switch
                            checked={config.showLegend}
                            onChange={checked => setConfig({ ...config, showLegend: checked })}
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
                    key: 'params',
                    label: '图形参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="点大小">
                          <Slider
                            min={1}
                            max={10}
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
                    key: 'colors',
                    label: '颜色方案',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="颜色方案">
                          <Select
                            value={config.colorScheme}
                            onChange={value => setConfig({ ...config, colorScheme: value })}
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="viridis">Viridis</Select.Option>
                            <Select.Option value="plasma">Plasma</Select.Option>
                            <Select.Option value="inferno">Inferno</Select.Option>
                            <Select.Option value="magma">Magma</Select.Option>
                            <Select.Option value="turbo">Turbo</Select.Option>
                            <Select.Option value="blues">Blues</Select.Option>
                            <Select.Option value="greens">Greens</Select.Option>
                            <Select.Option value="reds">Reds</Select.Option>
                            <Select.Option value="oranges">Oranges</Select.Option>
                            <Select.Option value="purples">Purples</Select.Option>
                          </Select>
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
            {/* 工具栏 */}
            <ChartToolbar
              containerRef={containerRef}
              svgRef={svgRef}
              isFullscreen={isFullscreen}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
              onAutoFit={handleAutoFit}
              settingsPanel={renderSettingsPanel()}
            />

            {/* 图表主体容器 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* 图表缩放容器 */}
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
              </div>
            </div>
          </div>
        );
      }}
    </ChartContainer>
  );
};

GradientScatterChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  valueKey: PropTypes.string,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default GradientScatterChart;