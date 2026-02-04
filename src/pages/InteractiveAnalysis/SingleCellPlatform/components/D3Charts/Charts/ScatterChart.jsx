import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 散点图组件
 * 支持：多组数据、自动响应、工具栏、图例、参数设置
 * 特性：宽度自适应，高度固定，图表内容可超出容器
 */
const ScatterChart = ({
  data = {},
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
    height: 600, // 图表内部固定高度，可以大于容器高度
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
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 图形设置 - 图形参数
    pointSize: 4,
    pointOpacity: 0.6,
    pointStrokeWidth: 0,
    pointStrokeColor: '#ffffff',
    
    // 图形设置 - 图形颜色
    colors: ['#ffa726', '#42a5f5', '#66bb6a', '#ef5350', '#ab47bc'],
    
    // 边距
    marginTop: 60,
    marginRight: 140,
    marginBottom: 60,
    marginLeft: 80,
  });

  // 处理数据格式 - 支持两种格式
  const processedData = useMemo(() => {
    // 格式1: 数组格式 [{ name: "group1", data: [{x, y}, ...] }, ...]
    if (Array.isArray(data)) {
      return data.map((group, index) => ({
        name: group.name,
        points: group.data || [],
        color: config.colors[index % config.colors.length],
      }));
    }
    
    // 格式2: 对象格式 { "group1": { values: [...] }, ... }
    const groups = Object.keys(data);
    return groups.map((groupName, index) => ({
      name: groupName,
      points: (data[groupName].values || []).map((value, idx) => ({ x: idx, y: value })),
      color: config.colors[index % config.colors.length],
    }));
  }, [data, config.colors]);

  // 图例数据
  const legendItems = useMemo(() => {
    return processedData.map(group => ({
      name: group.name,
      color: group.color,
      symbolType: 'circle',
    }));
  }, [processedData]);

  // 自适应功能 - 让容器高度适应图表实际高度（考虑缩放）
  const handleAutoFit = () => {
    if (!svgRef.current) return;
    
    try {
      // 获取SVG的实际内容高度
      const svgElement = svgRef.current;
      const bbox = svgElement.getBBox();
      const contentHeight = bbox.height + bbox.y + 40; // 加padding
      
      // 考虑缩放比例，计算实际需要的容器高度
      const scaledHeight = contentHeight * (zoomLevel / 100);
      
      // 调整容器高度以完整显示图表
      const newHeight = Math.max(scaledHeight, 400);
      setCurrentContainerHeight(newHeight);
    } catch (error) {
      console.error('自适应高度失败:', error);
    }
  };
  
  // 监听容器宽度变化，更新图表内部宽度
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

    // 准备所有数据点
    const allPoints = [];
    processedData.forEach(group => {
      group.points.forEach(point => {
        allPoints.push({
          x: point.x,
          y: point.y,
          group: group.name,
          color: group.color,
        });
      });
    });

    if (allPoints.length === 0) return;

    // 计算比例尺
    const xExtent = d3.extent(allPoints, d => d.x);
    const yExtent = d3.extent(allPoints, d => d.y);

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
      .data(allPoints)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', config.pointSize)
      .attr('fill', d => d.color)
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
          .attr('font-weight', 'bold')
          .text(d.group);

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
  }, [processedData, chartInnerDimensions, config, zoomLevel]);

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
                            <Form.Item label="标题颜色">
                              <ColorPicker
                                value={config.titleColor}
                                onChange={(_, hex) => setConfig({ ...config, titleColor: hex })}
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
                        {config.showXAxis && (
                          <>
                            <Form.Item label="X轴标签">
                              <input
                                type="text"
                                value={config.xAxisLabel}
                                onChange={e => setConfig({ ...config, xAxisLabel: e.target.value })}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }}
                              />
                            </Form.Item>
                            <Form.Item label="X轴标签字号">
                              <Slider
                                min={10}
                                max={20}
                                value={config.xAxisLabelFontSize}
                                onChange={value => setConfig({ ...config, xAxisLabelFontSize: value })}
                              />
                            </Form.Item>
                          </>
                        )}
                        <Form.Item label="显示Y轴">
                          <Switch
                            checked={config.showYAxis}
                            onChange={checked => setConfig({ ...config, showYAxis: checked })}
                          />
                        </Form.Item>
                        {config.showYAxis && (
                          <>
                            <Form.Item label="Y轴标签">
                              <input
                                type="text"
                                value={config.yAxisLabel}
                                onChange={e => setConfig({ ...config, yAxisLabel: e.target.value })}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #d9d9d9', borderRadius: 4 }}
                              />
                            </Form.Item>
                            <Form.Item label="Y轴标签字号">
                              <Slider
                                min={10}
                                max={20}
                                value={config.yAxisLabelFontSize}
                                onChange={value => setConfig({ ...config, yAxisLabelFontSize: value })}
                              />
                            </Form.Item>
                          </>
                        )}
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
                        {config.showLegend && (
                          <>
                            <Form.Item label="图例位置">
                              <Select
                                value={config.legendPosition}
                                onChange={value => setConfig({ ...config, legendPosition: value })}
                                style={{ width: '100%' }}
                              >
                                <Select.Option value="right">右侧</Select.Option>
                                <Select.Option value="left">左侧</Select.Option>
                                <Select.Option value="top">顶部</Select.Option>
                                <Select.Option value="bottom">底部</Select.Option>
                                <Select.Option value="top-right">右上</Select.Option>
                                <Select.Option value="top-left">左上</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item label="图例字号">
                              <Slider
                                min={10}
                                max={16}
                                value={config.legendFontSize}
                                onChange={value => setConfig({ ...config, legendFontSize: value })}
                              />
                            </Form.Item>
                          </>
                        )}
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
                        <Form.Item label="点边框宽度">
                          <Slider
                            min={0}
                            max={3}
                            value={config.pointStrokeWidth}
                            onChange={value => setConfig({ ...config, pointStrokeWidth: value })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'colors',
                    label: '图形颜色',
                    children: (
                      <Form layout="vertical" size="small">
                        {config.colors.map((color, index) => (
                          <Form.Item key={index} label={`颜色 ${index + 1}`}>
                            <ColorPicker
                              value={color}
                              onChange={(_, hex) => {
                                const newColors = [...config.colors];
                                newColors[index] = hex;
                                setConfig({ ...config, colors: newColors });
                              }}
                            />
                          </Form.Item>
                        ))}
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

            {/* 图表主体容器 - 负责隐藏超出部分 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden', // 超出部分隐藏
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

                {/* 图例 */}
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

ScatterChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array, // 新格式: [{ name, data: [{x, y}] }]
    PropTypes.object, // 旧格式: { group: { values: [] } }
  ]).isRequired,
  height: PropTypes.number, // 容器固定高度
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ScatterChart;