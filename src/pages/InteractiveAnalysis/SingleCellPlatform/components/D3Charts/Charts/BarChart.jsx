import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, ColorPicker, Switch, Slider, Tabs, Select, Collapse, InputNumber } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 柱状图组件
 * 支持：分组柱状图、堆叠柱状图、工具栏、图例、参数设置
 * 特性：宽度自适应，高度固定，图表内容可超出容器
 */
const BarChart = ({
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
    height: 600,
  });

  // 图表配置状态
  const [config, setConfig] = useState({
    // 基础设置 - 文本样式
    title: '柱状图',
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
    barOpacity: 0.8,
    barPadding: 0.1,
    groupPadding: 0.2,
    isStacked: false,
    showValues: false,
    valueFontSize: 10,
    
    // 图形设置 - 图形颜色
    colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    
    // 边距
    marginTop: 60,
    marginRight: 140,
    marginBottom: 80,
    marginLeft: 80,
  });

  // 处理数据格式
  const processedData = useMemo(() => {
    const categories = data.categories || [];
    const series = data.series || [];
    
    return {
      categories,
      series: series.map((s, index) => ({
        name: s.name,
        values: s.values || [],
        color: config.colors[index % config.colors.length],
      })),
    };
  }, [data, config.colors]);

  // 图例数据
  const legendItems = useMemo(() => {
    return processedData.series.map(s => ({
      name: s.name,
      color: s.color,
      symbolType: 'rect',
    }));
  }, [processedData]);

  // 自适应功能 - 考虑缩放比例
  const handleAutoFit = () => {
    if (!svgRef.current) return;
    
    try {
      const svgElement = svgRef.current;
      const bbox = svgElement.getBBox();
      const contentHeight = bbox.height + bbox.y + 40;
      
      // 考虑缩放比例
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
    if (!svgRef.current || processedData.categories.length === 0 || processedData.series.length === 0) return;

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

    const categories = processedData.categories;
    const series = processedData.series;

    // X轴比例尺（分类）
    const x0 = d3
      .scaleBand()
      .domain(categories)
      .range([0, innerWidth])
      .padding(config.groupPadding);

    // X轴子比例尺（分组）
    const x1 = d3
      .scaleBand()
      .domain(series.map(s => s.name))
      .range([0, x0.bandwidth()])
      .padding(config.barPadding);

    // Y轴比例尺
    let yMax;
    if (config.isStacked) {
      // 堆叠模式：计算每个类别的总和
      yMax = d3.max(categories, (cat, i) => 
        d3.sum(series, s => s.values[i] || 0)
      );
    } else {
      // 分组模式：找最大值
      yMax = d3.max(series, s => d3.max(s.values));
    }

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
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

    // 绘制柱子
    if (config.isStacked) {
      // 堆叠柱状图
      const stack = d3.stack()
        .keys(series.map(s => s.name))
        .value((d, key) => {
          const seriesIndex = series.findIndex(s => s.name === key);
          return series[seriesIndex].values[d.index] || 0;
        });

      const stackedData = stack(categories.map((cat, index) => ({ category: cat, index })));

      stackedData.forEach((layer, layerIndex) => {
        g.selectAll(`.bar-${layerIndex}`)
          .data(layer)
          .join('rect')
          .attr('class', `bar-${layerIndex}`)
          .attr('x', d => x0(d.data.category))
          .attr('y', d => yScale(d[1]))
          .attr('width', x0.bandwidth())
          .attr('height', d => yScale(d[0]) - yScale(d[1]))
          .attr('fill', series[layerIndex].color)
          .attr('opacity', config.barOpacity)
          .style('cursor', 'pointer')
          .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            
            const value = d[1] - d[0];
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

            tooltipText.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .attr('font-weight', 'bold')
              .text(series[layerIndex].name);

            tooltipText.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .text(`类别: ${d.data.category}`);

            tooltipText.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .text(`值: ${value.toFixed(2)}`);

            const bbox = tooltipText.node().getBBox();
            tooltipBg
              .attr('x', bbox.x - 8)
              .attr('y', bbox.y - 4)
              .attr('width', bbox.width + 16)
              .attr('height', bbox.height + 8);

            const tooltipX = x0(d.data.category) + x0.bandwidth() / 2;
            const tooltipY = yScale(d[1]) - 10;
            tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
          })
          .on('mouseout', function() {
            d3.select(this).attr('opacity', config.barOpacity);
            g.selectAll('.tooltip').remove();
          });
      });
    } else {
      // 分组柱状图
      categories.forEach((category, catIndex) => {
        series.forEach((s) => {
          const value = s.values[catIndex] || 0;
          
          g.append('rect')
            .attr('x', x0(category) + x1(s.name))
            .attr('y', yScale(value))
            .attr('width', x1.bandwidth())
            .attr('height', innerHeight - yScale(value))
            .attr('fill', s.color)
            .attr('opacity', config.barOpacity)
            .style('cursor', 'pointer')
            .on('mouseover', function() {
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

              tooltipText.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.2em')
                .attr('font-weight', 'bold')
                .text(s.name);

              tooltipText.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.2em')
                .text(`类别: ${category}`);

              tooltipText.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.2em')
                .text(`值: ${value.toFixed(2)}`);

              const bbox = tooltipText.node().getBBox();
              tooltipBg
                .attr('x', bbox.x - 8)
                .attr('y', bbox.y - 4)
                .attr('width', bbox.width + 16)
                .attr('height', bbox.height + 8);

              const tooltipX = x0(category) + x1(s.name) + x1.bandwidth() / 2;
              const tooltipY = yScale(value) - 10;
              tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
            })
            .on('mouseout', function() {
              d3.select(this).attr('opacity', config.barOpacity);
              g.selectAll('.tooltip').remove();
            });

          // 显示数值
          if (config.showValues) {
            g.append('text')
              .attr('x', x0(category) + x1(s.name) + x1.bandwidth() / 2)
              .attr('y', yScale(value) - 5)
              .attr('text-anchor', 'middle')
              .attr('font-size', `${config.valueFontSize}px`)
              .attr('fill', '#333')
              .text(value.toFixed(1));
          }
        });
      });
    }

    // 绘制坐标轴
    if (config.showXAxis) {
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x0))
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
                        <Form.Item label="柱子透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.barOpacity}
                            onChange={value => setConfig({ ...config, barOpacity: value })}
                          />
                        </Form.Item>
                        <Form.Item label="柱子间距">
                          <Slider
                            min={0}
                            max={0.5}
                            step={0.05}
                            value={config.barPadding}
                            onChange={value => setConfig({ ...config, barPadding: value })}
                          />
                        </Form.Item>
                        <Form.Item label="分组间距">
                          <Slider
                            min={0}
                            max={0.5}
                            step={0.05}
                            value={config.groupPadding}
                            onChange={value => setConfig({ ...config, groupPadding: value })}
                          />
                        </Form.Item>
                        <Form.Item label="堆叠模式">
                          <Switch
                            checked={config.isStacked}
                            onChange={checked => setConfig({ ...config, isStacked: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示数值">
                          <Switch
                            checked={config.showValues}
                            onChange={checked => setConfig({ ...config, showValues: checked })}
                          />
                        </Form.Item>
                        {config.showValues && (
                          <Form.Item label="数值字号">
                            <Slider
                              min={8}
                              max={16}
                              value={config.valueFontSize}
                              onChange={value => setConfig({ ...config, valueFontSize: value })}
                            />
                          </Form.Item>
                        )}
                      </Form>
                    ),
                  },
                  {
                    key: 'colors',
                    label: '图形颜色',
                    children: (
                      <Form layout="vertical" size="small">
                        {config.colors.slice(0, 5).map((color, index) => (
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

BarChart.propTypes = {
  data: PropTypes.object.isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default BarChart;