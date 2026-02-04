import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 箱型图组件
 * 用途：展示数据分布、中位数、四分位数、异常值
 * 特点：支持分组对比、显示异常点、可配置箱体样式
 */
const BoxPlotChart = ({
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

  const [config, setConfig] = useState({
    // 基础设置 - 文本样式
    title: '箱型图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    // 基础设置 - 坐标轴
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
    
    // 基础设置 - 图例
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 图形设置 - 箱体参数
    boxWidth: 60,
    boxOpacity: 0.7,
    boxStrokeWidth: 2,
    whiskerStrokeWidth: 2,
    medianStrokeWidth: 3,
    showOutliers: true,
    outlierSize: 3,
    outlierOpacity: 0.6,
    
    // 图形设置 - 颜色
    colors: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#ffca28'],
    medianColor: '#d32f2f',
    whiskerColor: '#333333',
    
    // 边距
    marginTop: 60,
    marginRight: 140,
    marginBottom: 80,
    marginLeft: 80,
  });

  // 计算箱型图统计数据
  const calculateBoxPlotStats = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = d3.quantile(sorted, 0.25);
    const median = d3.quantile(sorted, 0.5);
    const q3 = d3.quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const min = d3.min(sorted);
    const max = d3.max(sorted);
    
    // 计算须的范围（1.5倍IQR）
    const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
    const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
    
    // 识别异常值
    const outliers = sorted.filter(v => v < lowerWhisker || v > upperWhisker);
    
    return {
      q1,
      median,
      q3,
      min,
      max,
      lowerWhisker,
      upperWhisker,
      outliers,
      iqr,
    };
  };

  // 处理数据
  const processedData = useMemo(() => {
    return data.map((group, index) => ({
      name: group.name,
      values: group.values || [],
      color: config.colors[index % config.colors.length],
      stats: calculateBoxPlotStats(group.values || []),
    }));
  }, [data, config.colors]);

  // 图例数据
  const legendItems = useMemo(() => {
    return processedData.map(group => ({
      name: group.name,
      color: group.color,
      symbolType: 'rect',
    }));
  }, [processedData]);

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

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    // 计算比例尺
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
    }

    // 绘制每个箱型图
    processedData.forEach((group) => {
      const x = xScale(group.name);
      const boxWidth = Math.min(config.boxWidth, xScale.bandwidth());
      const boxX = x + (xScale.bandwidth() - boxWidth) / 2;
      const stats = group.stats;

      const groupG = g.append('g').attr('class', `box-group-${group.name}`);

      // 绘制中心线（从下须到上须）
      groupG
        .append('line')
        .attr('x1', x + xScale.bandwidth() / 2)
        .attr('x2', x + xScale.bandwidth() / 2)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.upperWhisker))
        .attr('stroke', config.whiskerColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

      // 绘制下须
      groupG
        .append('line')
        .attr('x1', boxX + boxWidth * 0.25)
        .attr('x2', boxX + boxWidth * 0.75)
        .attr('y1', yScale(stats.lowerWhisker))
        .attr('y2', yScale(stats.lowerWhisker))
        .attr('stroke', config.whiskerColor)
        .attr('stroke-width', config.whiskerStrokeWidth);

      // 绘制上须
      groupG
        .append('line')
        .attr('x1', boxX + boxWidth * 0.25)
        .attr('x2', boxX + boxWidth * 0.75)
        .attr('y1', yScale(stats.upperWhisker))
        .attr('y2', yScale(stats.upperWhisker))
        .attr('stroke', config.whiskerColor)
        .attr('stroke-width', config.whiskerStrokeWidth);

      // 绘制箱体
      const boxHeight = yScale(stats.q1) - yScale(stats.q3);
      groupG
        .append('rect')
        .attr('x', boxX)
        .attr('y', yScale(stats.q3))
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('fill', group.color)
        .attr('opacity', config.boxOpacity)
        .attr('stroke', group.color)
        .attr('stroke-width', config.boxStrokeWidth)
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('opacity', 1);
          
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

          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').attr('font-weight', 'bold').text(group.name);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`最大值: ${stats.max.toFixed(2)}`);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`上四分位: ${stats.q3.toFixed(2)}`);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`中位数: ${stats.median.toFixed(2)}`);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`下四分位: ${stats.q1.toFixed(2)}`);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`最小值: ${stats.min.toFixed(2)}`);
          tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`IQR: ${stats.iqr.toFixed(2)}`);

          const bbox = tooltipText.node().getBBox();
          tooltipBg
            .attr('x', bbox.x - 8)
            .attr('y', bbox.y - 4)
            .attr('width', bbox.width + 16)
            .attr('height', bbox.height + 8);

          const tooltipX = x + xScale.bandwidth() + 10;
          const tooltipY = yScale(stats.median) - bbox.height / 2;
          tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
        })
        .on('mouseout', function () {
          d3.select(this).attr('opacity', config.boxOpacity);
          g.selectAll('.tooltip').remove();
        });

      // 绘制中位数线
      groupG
        .append('line')
        .attr('x1', boxX)
        .attr('x2', boxX + boxWidth)
        .attr('y1', yScale(stats.median))
        .attr('y2', yScale(stats.median))
        .attr('stroke', config.medianColor)
        .attr('stroke-width', config.medianStrokeWidth);

      // 绘制异常值
      if (config.showOutliers && stats.outliers.length > 0) {
        groupG
          .selectAll('.outlier')
          .data(stats.outliers)
          .join('circle')
          .attr('class', 'outlier')
          .attr('cx', x + xScale.bandwidth() / 2)
          .attr('cy', d => yScale(d))
          .attr('r', config.outlierSize)
          .attr('fill', group.color)
          .attr('opacity', config.outlierOpacity)
          .attr('stroke', group.color)
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this).attr('r', config.outlierSize * 1.5).attr('opacity', 1);
          })
          .on('mouseout', function () {
            d3.select(this).attr('r', config.outlierSize).attr('opacity', config.outlierOpacity);
          });
      }
    });

    // 绘制坐标轴
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
                        {config.showLegend && (
                          <Form.Item label="图例位置">
                            <Select
                              value={config.legendPosition}
                              onChange={value => setConfig({ ...config, legendPosition: value })}
                              style={{ width: '100%' }}
                            >
                              <Select.Option value="right">右侧</Select.Option>
                              <Select.Option value="top">顶部</Select.Option>
                              <Select.Option value="bottom">底部</Select.Option>
                            </Select>
                          </Form.Item>
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
                    label: '箱体参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="箱体宽度">
                          <Slider
                            min={20}
                            max={120}
                            value={config.boxWidth}
                            onChange={value => setConfig({ ...config, boxWidth: value })}
                          />
                        </Form.Item>
                        <Form.Item label="箱体透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.boxOpacity}
                            onChange={value => setConfig({ ...config, boxOpacity: value })}
                          />
                        </Form.Item>
                        <Form.Item label="显示异常值">
                          <Switch
                            checked={config.showOutliers}
                            onChange={checked => setConfig({ ...config, showOutliers: checked })}
                          />
                        </Form.Item>
                        {config.showOutliers && (
                          <Form.Item label="异常值大小">
                            <Slider
                              min={1}
                              max={8}
                              value={config.outlierSize}
                              onChange={value => setConfig({ ...config, outlierSize: value })}
                            />
                          </Form.Item>
                        )}
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

BoxPlotChart.propTypes = {
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

export default BoxPlotChart;