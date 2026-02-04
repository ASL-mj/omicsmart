import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 小提琴图组件
 * 用途：结合箱型图和密度图，展示数据分布
 * 特点：显示数据密度曲线、支持分组、可叠加箱型图
 */
const ViolinChart = ({
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
    height: 500,
  });

  const [config, setConfig] = useState({
    // 基础设置
    title: '小提琴图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    xAxisLabel: '分组',
    yAxisLabel: '数值',
    showXAxis: true,
    showYAxis: true,
    xAxisLabelFontSize: 14,
    yAxisLabelFontSize: 14,
    xAxisTickFontSize: 12,
    yAxisTickFontSize: 12,
    showGrid: true,
    gridColor: '#e0e0e0',
    gridOpacity: 0.5,
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 小提琴图特有参数
    violinWidth: 200,
    violinOpacity: 1,
    showBoxPlot: true,
    boxWidth: 15,
    showMedian: true,
    medianColor: '#ffffff',
    medianStrokeWidth: 2,
    bandwidth: null, // KDE 带宽 - 自动计算
    
    colors: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#ffca28'],
    
    marginTop: 60,
    marginRight: 40,
    marginBottom: 60,
    marginLeft: 80,
  });

  // 核密度估计 (KDE)
  const kernelDensityEstimator = (kernel, X) => {
    return V => {
      return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    };
  };

  const kernelEpanechnikov = bandwidth => {
    return v => Math.abs(v /= bandwidth) <= 1 ? 0.75 * (1 - v * v) / bandwidth : 0;
  };

  // 计算统计数据
  const calculateStats = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = d3.quantile(sorted, 0.25);
    const median = d3.quantile(sorted, 0.5);
    const q3 = d3.quantile(sorted, 0.75);
    
    return { q1, median, q3 };
  };

  // 处理数据
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((group, index) => {
      const values = group.values || [];
      if (values.length === 0) return null;
      
      const extent = d3.extent(values);
      const range = extent[1] - extent[0];
      
      // 自动计算合适的带宽：使用 Silverman's rule of thumb
      // bandwidth = 0.9 * min(std, IQR/1.34) * n^(-1/5)
      const mean = d3.mean(values);
      const std = Math.sqrt(d3.mean(values.map(v => Math.pow(v - mean, 2))));
      const sorted = [...values].sort((a, b) => a - b);
      const q1 = d3.quantile(sorted, 0.25);
      const q3 = d3.quantile(sorted, 0.75);
      const iqr = q3 - q1;
      const n = values.length;
      
      const autoBandwidth = config.bandwidth || 
        0.9 * Math.min(std, iqr / 1.34) * Math.pow(n, -0.2);
      
      // 使用更合理的步长和阈值
      const numPoints = 50;
      const thresholds = d3.range(extent[0], extent[1], range / numPoints);
      
      const kde = kernelDensityEstimator(
        kernelEpanechnikov(autoBandwidth),
        thresholds
      );
      const density = kde(values);
      
      return {
        name: group.name,
        values,
        color: config.colors[index % config.colors.length],
        density,
        stats: calculateStats(values),
        bandwidth: autoBandwidth,
      };
    }).filter(Boolean);
  }, [data, config.colors, config.bandwidth, kernelDensityEstimator, kernelEpanechnikov, calculateStats]);

  const legendItems = useMemo(() => {
    return processedData.map(group => ({
      name: group.name,
      color: group.color,
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
    if (!svgRef.current || processedData.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    // 比例尺
    const xScale = d3
      .scaleBand()
      .domain(processedData.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.3);

    const allValues = processedData.flatMap(d => d.values);
    const yExtent = d3.extent(allValues);
    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
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

    // 绘制每个小提琴图
    processedData.forEach((group) => {
      const x = xScale(group.name);
      const violinWidth = Math.min(config.violinWidth, xScale.bandwidth());
      const centerX = x + xScale.bandwidth() / 2;

      // 密度比例尺
      const maxDensity = d3.max(group.density, d => d[1]);
      const xDensityScale = d3
        .scaleLinear()
        .domain([0, maxDensity])
        .range([0, violinWidth / 2]);

      const groupG = g.append('g').attr('class', `violin-group-${group.name}`);

      // 创建小提琴形状的区域生成器
      const area = d3
        .area()
        .x0(d => centerX - xDensityScale(d[1]))
        .x1(d => centerX + xDensityScale(d[1]))
        .y(d => yScale(d[0]))
        .curve(d3.curveCatmullRom);

      // 绘制小提琴形状
      groupG
        .append('path')
        .datum(group.density)
        .attr('d', area)
        .attr('fill', group.color)
        .attr('opacity', config.violinOpacity)
        .attr('stroke', group.color)
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('opacity', config.violinOpacity + 0.2);
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', config.violinOpacity);
        });

      // 叠加箱型图
      if (config.showBoxPlot) {
        const stats = group.stats;
        const boxWidth = config.boxWidth;
        const boxX = centerX - boxWidth / 2;

        // 箱体
        const boxHeight = yScale(stats.q1) - yScale(stats.q3);
        groupG
          .append('rect')
          .attr('x', boxX)
          .attr('y', yScale(stats.q3))
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('fill', 'white')
          .attr('opacity', 0.8)
          .attr('stroke', '#333')
          .attr('stroke-width', 1);

        // 中位数线
        if (config.showMedian) {
          groupG
            .append('line')
            .attr('x1', boxX)
            .attr('x2', boxX + boxWidth)
            .attr('y1', yScale(stats.median))
            .attr('y2', yScale(stats.median))
            .attr('stroke', config.medianColor)
            .attr('stroke-width', config.medianStrokeWidth);
        }
      }
    });

    // 坐标轴
    if (config.showXAxis) {
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('font-size', `${config.xAxisTickFontSize}px`)
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    }

    if (config.showYAxis) {
      g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .selectAll('text')
        .style('font-size', `${config.yAxisTickFontSize}px`);
    }

    // 轴标签
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
                        <Form.Item label="显示网格">
                          <Switch
                            checked={config.showGrid}
                            onChange={checked => setConfig({ ...config, showGrid: checked })}
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
                    label: '小提琴参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="小提琴宽度">
                          <Slider
                            min={40}
                            max={150}
                            value={config.violinWidth}
                            onChange={value => setConfig({ ...config, violinWidth: value })}
                          />
                        </Form.Item>
                        <Form.Item label="透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.violinOpacity}
                            onChange={value => setConfig({ ...config, violinOpacity: value })}
                          />
                        </Form.Item>
                        <Form.Item label="显示箱型图">
                          <Switch
                            checked={config.showBoxPlot}
                            onChange={checked => setConfig({ ...config, showBoxPlot: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="KDE带宽（留空自动计算）">
                          <Slider
                            min={0}
                            max={100}
                            step={0.1}
                            value={config.bandwidth || 0}
                            onChange={value => setConfig({ ...config, bandwidth: value === 0 ? null : value })}
                            marks={{
                              0: '自动',
                            }}
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

ViolinChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      values: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ViolinChart;