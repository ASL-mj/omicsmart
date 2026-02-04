import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 堆叠图组件
 * 用途：展示部分与整体关系、时间序列累积
 * 特点：支持堆叠柱状图、堆叠面积图
 */
const StackedChart = ({
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
    title: '堆叠图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    xAxisLabel: '类别',
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
    
    chartType: 'bar', // 'bar' or 'area'
    barOpacity: 0.8,
    areaOpacity: 0.7,
    
    colors: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#ffca28'],
    
    marginTop: 60,
    marginRight: 140,
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

    // 比例尺
    const xScale = config.chartType === 'bar'
      ? d3.scaleBand()
          .domain(categories)
          .range([0, innerWidth])
          .padding(0.2)
      : d3.scalePoint()
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

    // 绘制堆叠图
    if (config.chartType === 'bar') {
      // 堆叠柱状图
      series.forEach((s) => {
        g.selectAll(`.bar-${s.key}`)
          .data(s.values)
          .join('rect')
          .attr('class', `bar-${s.key}`)
          .attr('x', (d, i) => xScale(categories[i]))
          .attr('y', d => yScale(d[1]))
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(d[0]) - yScale(d[1]))
          .attr('fill', s.color)
          .attr('opacity', config.barOpacity)
          .style('cursor', 'pointer')
          .on('mouseover', function (event, d) {
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

            const idx = s.values.indexOf(d);
            tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').attr('font-weight', 'bold').text(categories[idx]);
            tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`${s.key}: ${(d[1] - d[0]).toFixed(2)}`);
            tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`累计: ${d[1].toFixed(2)}`);

            const bbox = tooltipText.node().getBBox();
            tooltipBg
              .attr('x', bbox.x - 8)
              .attr('y', bbox.y - 4)
              .attr('width', bbox.width + 16)
              .attr('height', bbox.height + 8);

            const tooltipX = xScale(categories[idx]) + xScale.bandwidth() + 10;
            const tooltipY = yScale((d[0] + d[1]) / 2) - bbox.height / 2;
            tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
          })
          .on('mouseout', function () {
            d3.select(this).attr('opacity', config.barOpacity);
            g.selectAll('.tooltip').remove();
          });
      });
    } else {
      // 堆叠面积图
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
          .on('mouseover', function () {
            d3.select(this).attr('opacity', config.areaOpacity + 0.2);
          })
          .on('mouseout', function () {
            d3.select(this).attr('opacity', config.areaOpacity);
          });
      });
    }

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
                    label: '图表参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="图表类型">
                          <Select
                            value={config.chartType}
                            onChange={value => setConfig({ ...config, chartType: value })}
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="bar">柱状图</Select.Option>
                            <Select.Option value="area">面积图</Select.Option>
                          </Select>
                        </Form.Item>
                        {config.chartType === 'bar' && (
                          <Form.Item label="柱体透明度">
                            <Slider
                              min={0}
                              max={1}
                              step={0.1}
                              value={config.barOpacity}
                              onChange={value => setConfig({ ...config, barOpacity: value })}
                            />
                          </Form.Item>
                        )}
                        {config.chartType === 'area' && (
                          <Form.Item label="面积透明度">
                            <Slider
                              min={0}
                              max={1}
                              step={0.1}
                              value={config.areaOpacity}
                              onChange={value => setConfig({ ...config, areaOpacity: value })}
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

StackedChart.propTypes = {
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

export default StackedChart;