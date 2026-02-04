import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, Switch, Slider, Tabs, Select, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';

/**
 * 热图组件
 * 用途：展示矩阵数据，常用于基因表达、相关性分析
 * 特点：颜色映射数值、支持聚类树状图、行列标签
 */
const HeatmapChart = ({
  data = { matrix: [], rowLabels: [], colLabels: [] },
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
    title: '热图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    showRowLabels: true,
    showColLabels: true,
    rowLabelFontSize: 10,
    colLabelFontSize: 10,
    
    cellWidth: 30,
    cellHeight: 30,
    cellStrokeWidth: 1,
    cellStrokeColor: '#ffffff',
    
    colorScheme: 'interpolateRdYlBu',
    reverseColorScheme: true,
    showColorBar: true,
    showValues: false,
    valueFontSize: 10,
    
    marginTop: 80,
    marginRight: 100,
    marginBottom: 100,
    marginLeft: 150,
  });

  const processedData = useMemo(() => {
    const { matrix, rowLabels, colLabels } = data;
    
    if (!matrix || matrix.length === 0) return { cells: [], extent: [0, 1] };
    
    const cells = [];
    const allValues = [];
    
    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        cells.push({
          row: i,
          col: j,
          value,
          rowLabel: rowLabels[i] || `Row ${i}`,
          colLabel: colLabels[j] || `Col ${j}`,
        });
        allValues.push(value);
      });
    });
    
    const extent = d3.extent(allValues);
    
    return { cells, extent, rowCount: matrix.length, colCount: matrix[0].length };
  }, [data]);

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
    if (!svgRef.current || processedData.cells.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginLeft } = config;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    const { cells, extent, rowCount, colCount } = processedData;

    // 计算单元格尺寸
    const cellWidth = config.cellWidth;
    const cellHeight = config.cellHeight;
    const heatmapWidth = colCount * cellWidth;
    const heatmapHeight = rowCount * cellHeight;

    // 颜色比例尺
    const colorScale = d3[`scale${config.colorScheme.replace('interpolate', 'Sequential')}`]()
      .domain(config.reverseColorScheme ? [extent[1], extent[0]] : extent)
      .interpolator(d3[config.colorScheme]);

    // 绘制热图单元格
    g.selectAll('.cell')
      .data(cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', d => d.col * cellWidth)
      .attr('y', d => d.row * cellHeight)
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', config.cellStrokeColor)
      .attr('stroke-width', config.cellStrokeWidth)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#000').attr('stroke-width', 2);
        
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

        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').attr('font-weight', 'bold').text(`${d.rowLabel} × ${d.colLabel}`);
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`值: ${d.value.toFixed(3)}`);

        const bbox = tooltipText.node().getBBox();
        tooltipBg
          .attr('x', bbox.x - 8)
          .attr('y', bbox.y - 4)
          .attr('width', bbox.width + 16)
          .attr('height', bbox.height + 8);

        const tooltipX = d.col * cellWidth + cellWidth + 10;
        const tooltipY = d.row * cellHeight + cellHeight / 2 - bbox.height / 2;
        tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', config.cellStrokeColor).attr('stroke-width', config.cellStrokeWidth);
        g.selectAll('.tooltip').remove();
      });

    // 显示数值
    if (config.showValues) {
      g.selectAll('.cell-text')
        .data(cells)
        .join('text')
        .attr('class', 'cell-text')
        .attr('x', d => d.col * cellWidth + cellWidth / 2)
        .attr('y', d => d.row * cellHeight + cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', `${config.valueFontSize}px`)
        .style('fill', d => {
          const brightness = d3.hsl(colorScale(d.value)).l;
          return brightness > 0.5 ? '#000' : '#fff';
        })
        .style('pointer-events', 'none')
        .text(d => d.value.toFixed(2));
    }

    // 行标签
    if (config.showRowLabels) {
      const uniqueRows = [...new Set(cells.map(d => ({ row: d.row, label: d.rowLabel })))];
      g.selectAll('.row-label')
        .data(uniqueRows)
        .join('text')
        .attr('class', 'row-label')
        .attr('x', -10)
        .attr('y', d => d.row * cellHeight + cellHeight / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', `${config.rowLabelFontSize}px`)
        .style('fill', '#333')
        .text(d => d.label);
    }

    // 列标签
    if (config.showColLabels) {
      const uniqueCols = [...new Set(cells.map(d => ({ col: d.col, label: d.colLabel })))];
      g.selectAll('.col-label')
        .data(uniqueCols)
        .join('text')
        .attr('class', 'col-label')
        .attr('x', d => d.col * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `rotate(-45, ${d.col * cellWidth + cellWidth / 2}, -10)`)
        .style('font-size', `${config.colLabelFontSize}px`)
        .style('fill', '#333')
        .text(d => d.label);
    }

    // 颜色条
    if (config.showColorBar) {
      const colorBarWidth = 20;
      const colorBarHeight = 200;
      const colorBarX = heatmapWidth + 40;
      const colorBarY = (heatmapHeight - colorBarHeight) / 2;

      const colorBarScale = d3.scaleLinear()
        .domain(extent)
        .range([colorBarHeight, 0]);

      const colorBarAxis = d3.axisRight(colorBarScale).ticks(5);

      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'color-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const value = extent[0] + (extent[1] - extent[0]) * (i / steps);
        gradient.append('stop')
          .attr('offset', `${(i / steps) * 100}%`)
          .attr('stop-color', colorScale(value));
      }

      g.append('rect')
        .attr('x', colorBarX)
        .attr('y', colorBarY)
        .attr('width', colorBarWidth)
        .attr('height', colorBarHeight)
        .style('fill', 'url(#color-gradient)')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);

      g.append('g')
        .attr('transform', `translate(${colorBarX + colorBarWidth},${colorBarY})`)
        .call(colorBarAxis)
        .selectAll('text')
        .style('font-size', '10px');
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
                        <Form.Item label="显示行标签">
                          <Switch
                            checked={config.showRowLabels}
                            onChange={checked => setConfig({ ...config, showRowLabels: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示列标签">
                          <Switch
                            checked={config.showColLabels}
                            onChange={checked => setConfig({ ...config, showColLabels: checked })}
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
                    label: '单元格参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="单元格宽度">
                          <Slider
                            min={10}
                            max={60}
                            value={config.cellWidth}
                            onChange={value => setConfig({ ...config, cellWidth: value })}
                          />
                        </Form.Item>
                        <Form.Item label="单元格高度">
                          <Slider
                            min={10}
                            max={60}
                            value={config.cellHeight}
                            onChange={value => setConfig({ ...config, cellHeight: value })}
                          />
                        </Form.Item>
                        <Form.Item label="显示数值">
                          <Switch
                            checked={config.showValues}
                            onChange={checked => setConfig({ ...config, showValues: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="显示颜色条">
                          <Switch
                            checked={config.showColorBar}
                            onChange={checked => setConfig({ ...config, showColorBar: checked })}
                          />
                        </Form.Item>
                        <Form.Item label="颜色方案">
                          <Select
                            value={config.colorScheme}
                            onChange={value => setConfig({ ...config, colorScheme: value })}
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="interpolateRdYlBu">红黄蓝</Select.Option>
                            <Select.Option value="interpolateViridis">Viridis</Select.Option>
                            <Select.Option value="interpolatePlasma">Plasma</Select.Option>
                            <Select.Option value="interpolateInferno">Inferno</Select.Option>
                            <Select.Option value="interpolateRdYlGn">红黄绿</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="反转颜色">
                          <Switch
                            checked={config.reverseColorScheme}
                            onChange={checked => setConfig({ ...config, reverseColorScheme: checked })}
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
              </div>
            </div>
          </div>
        );
      }}
    </ChartContainer>
  );
};

HeatmapChart.propTypes = {
  data: PropTypes.shape({
    matrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    rowLabels: PropTypes.arrayOf(PropTypes.string),
    colLabels: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default HeatmapChart;