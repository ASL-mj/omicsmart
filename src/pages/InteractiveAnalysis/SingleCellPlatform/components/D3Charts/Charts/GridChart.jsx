import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, Switch, Slider, Tabs, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 网格图组件
 * 用途：类似热图但更简化，展示分类数据
 * 特点：网格布局、颜色编码、支持标签
 */
const GridChart = ({
  data = { data: [], rowLabels: [], colLabels: [], categories: [] },
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
    title: '网格图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    showRowLabels: true,
    showColLabels: true,
    rowLabelFontSize: 10,
    colLabelFontSize: 10,
    
    cellSize: 30,
    cellStrokeWidth: 1,
    cellStrokeColor: '#ffffff',
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    marginTop: 80,
    marginRight: 140,
    marginBottom: 100,
    marginLeft: 150,
  });

  const processedData = useMemo(() => {
    const { data: gridData, rowLabels, colLabels, categories } = data;
    
    if (!gridData || gridData.length === 0) return { cells: [], categories: [], rowCount: 0, colCount: 0 };
    
    const cells = [];
    
    gridData.forEach((row, i) => {
      row.forEach((value, j) => {
        const category = categories.find(c => c.value === value);
        cells.push({
          row: i,
          col: j,
          value,
          rowLabel: rowLabels[i] || `Row ${i}`,
          colLabel: colLabels[j] || `Col ${j}`,
          color: category?.color || '#cccccc',
          label: category?.label || String(value),
        });
      });
    });
    
    return {
      cells,
      categories,
      rowCount: gridData.length,
      colCount: gridData[0]?.length || 0,
    };
  }, [data]);

  const legendItems = useMemo(() => {
    return processedData.categories.map(cat => ({
      name: cat.label,
      color: cat.color,
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
    if (!svgRef.current || processedData.cells.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginLeft } = config;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    const { cells } = processedData;

    const cellSize = config.cellSize;

    // 绘制网格单元格
    g.selectAll('.cell')
      .data(cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', d => d.col * cellSize)
      .attr('y', d => d.row * cellSize)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => d.color)
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
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`类别: ${d.label}`);
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`值: ${d.value}`);

        const bbox = tooltipText.node().getBBox();
        tooltipBg
          .attr('x', bbox.x - 8)
          .attr('y', bbox.y - 4)
          .attr('width', bbox.width + 16)
          .attr('height', bbox.height + 8);

        const tooltipX = d.col * cellSize + cellSize + 10;
        const tooltipY = d.row * cellSize + cellSize / 2 - bbox.height / 2;
        tooltip.attr('transform', `translate(${tooltipX},${tooltipY})`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', config.cellStrokeColor).attr('stroke-width', config.cellStrokeWidth);
        g.selectAll('.tooltip').remove();
      });

    // 行标签
    if (config.showRowLabels) {
      const uniqueRows = [...new Set(cells.map(d => ({ row: d.row, label: d.rowLabel })))];
      g.selectAll('.row-label')
        .data(uniqueRows)
        .join('text')
        .attr('class', 'row-label')
        .attr('x', -10)
        .attr('y', d => d.row * cellSize + cellSize / 2)
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
        .attr('x', d => d.col * cellSize + cellSize / 2)
        .attr('y', -10)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('transform', d => `rotate(-45, ${d.col * cellSize + cellSize / 2}, -10)`)
        .style('font-size', `${config.colLabelFontSize}px`)
        .style('fill', '#333')
        .text(d => d.label);
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
                        <Form.Item label="单元格大小">
                          <Slider
                            min={15}
                            max={60}
                            value={config.cellSize}
                            onChange={value => setConfig({ ...config, cellSize: value })}
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

GridChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    rowLabels: PropTypes.arrayOf(PropTypes.string),
    colLabels: PropTypes.arrayOf(PropTypes.string),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default GridChart;