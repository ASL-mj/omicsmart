import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, Switch, Slider, Tabs, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * Circos图组件
 * 用途：展示基因组数据、染色体关系、复杂关联
 * 特点：环形布局、弧线连接、多层数据展示
 */
const CircosChart = ({
  data = { segments: [], links: [] },
  height: containerHeight = 700,
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
    height: 700,
  });

  const [config, setConfig] = useState({
    title: 'Circos图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 环形参数
    innerRadius: 180,
    outerRadius: 220,
    segmentPadding: 0.02,
    
    // 标签参数
    showSegmentLabels: true,
    segmentLabelFontSize: 12,
    
    // 连接线参数
    linkOpacity: 0.4,
    linkStrokeWidth: 1.5,
    
    marginTop: 60,
    marginRight: 140,
    marginBottom: 60,
    marginLeft: 60,
  });

  const processedData = useMemo(() => {
    const { segments, links } = data;
    
    if (!segments || segments.length === 0) return { segments: [], links: [], totalLength: 0 };
    
    // 计算总长度
    const totalLength = d3.sum(segments, d => d.end - d.start);
    
    // 为每个片段计算起始和结束角度
    let currentAngle = 0;
    const processedSegments = segments.map(segment => {
      const length = segment.end - segment.start;
      const proportion = length / totalLength;
      const angleSpan = proportion * (2 * Math.PI - segments.length * config.segmentPadding);
      
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      
      currentAngle = endAngle + config.segmentPadding;
      
      return {
        ...segment,
        startAngle,
        endAngle,
        length,
      };
    });
    
    // 处理连接线
    const processedLinks = links.map(link => {
      const sourceSegment = processedSegments.find(s => s.id === link.source);
      const targetSegment = processedSegments.find(s => s.id === link.target);
      
      if (!sourceSegment || !targetSegment) return null;
      
      // 计算源和目标在片段中的位置
      const sourcePos = (link.sourceStart - sourceSegment.start) / sourceSegment.length;
      const sourceAngle = sourceSegment.startAngle + sourcePos * (sourceSegment.endAngle - sourceSegment.startAngle);
      
      const targetPos = (link.targetStart - targetSegment.start) / targetSegment.length;
      const targetAngle = targetSegment.startAngle + targetPos * (targetSegment.endAngle - targetSegment.startAngle);
      
      return {
        ...link,
        sourceAngle,
        targetAngle,
        sourceSegment,
        targetSegment,
      };
    }).filter(Boolean);
    
    return {
      segments: processedSegments,
      links: processedLinks,
      totalLength,
    };
  }, [data, config.segmentPadding]);

  const legendItems = useMemo(() => {
    return processedData.segments.map(segment => ({
      name: segment.label,
      color: segment.color,
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
    if (!svgRef.current || processedData.segments.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = chartInnerDimensions.width;
    const height = chartInnerDimensions.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    const { segments, links } = processedData;

    // 绘制片段（染色体/区段）
    const arc = d3
      .arc()
      .innerRadius(config.innerRadius)
      .outerRadius(config.outerRadius);

    g.selectAll('.segment')
      .data(segments)
      .join('path')
      .attr('class', 'segment')
      .attr('d', d => arc({ startAngle: d.startAngle, endAngle: d.endAngle }))
      .attr('fill', d => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.8);
        
        // 高亮相关的连接线
        g.selectAll('.link')
          .attr('opacity', link =>
            link.sourceSegment.id === d.id || link.targetSegment.id === d.id
              ? config.linkOpacity * 2
              : config.linkOpacity * 0.2
          );
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        
        // 恢复连接线透明度
        g.selectAll('.link').attr('opacity', config.linkOpacity);
      });

    // 绘制片段标签
    if (config.showSegmentLabels) {
      g.selectAll('.segment-label')
        .data(segments)
        .join('text')
        .attr('class', 'segment-label')
        .attr('transform', d => {
          const angle = (d.startAngle + d.endAngle) / 2;
          const radius = config.outerRadius + 15;
          const x = Math.cos(angle - Math.PI / 2) * radius;
          const y = Math.sin(angle - Math.PI / 2) * radius;
          const rotation = (angle * 180) / Math.PI - 90;
          return `translate(${x},${y}) rotate(${rotation > 90 ? rotation + 180 : rotation})`;
        })
        .attr('text-anchor', d => {
          const angle = (d.startAngle + d.endAngle) / 2;
          const rotation = (angle * 180) / Math.PI - 90;
          return rotation > 90 ? 'end' : 'start';
        })
        .attr('font-size', config.segmentLabelFontSize)
        .attr('fill', '#333')
        .style('pointer-events', 'none')
        .text(d => d.label);
    }

    // 绘制连接线（贝塞尔曲线）
    const ribbon = (source, target) => {
      const sourceRadius = config.innerRadius;
      const targetRadius = config.innerRadius;
      
      const sx = Math.cos(source - Math.PI / 2) * sourceRadius;
      const sy = Math.sin(source - Math.PI / 2) * sourceRadius;
      const tx = Math.cos(target - Math.PI / 2) * targetRadius;
      const ty = Math.sin(target - Math.PI / 2) * targetRadius;
      
      // 控制点在圆心
      return `M ${sx},${sy} Q 0,0 ${tx},${ty}`;
    };

    g.selectAll('.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d => ribbon(d.sourceAngle, d.targetAngle))
      .attr('fill', 'none')
      .attr('stroke', d => d.sourceSegment.color)
      .attr('stroke-width', config.linkStrokeWidth)
      .attr('opacity', config.linkOpacity)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('stroke-width', config.linkStrokeWidth * 2)
          .attr('opacity', 1);
        
        // 显示提示信息
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

        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').attr('font-weight', 'bold').text(`${d.sourceSegment.label} → ${d.targetSegment.label}`);
        tooltipText.append('tspan').attr('x', 0).attr('dy', '1.2em').text(`权重: ${d.value}`);

        const bbox = tooltipText.node().getBBox();
        tooltipBg
          .attr('x', bbox.x - 8)
          .attr('y', bbox.y - 4)
          .attr('width', bbox.width + 16)
          .attr('height', bbox.height + 8);

        tooltip.attr('transform', `translate(0,${-config.innerRadius / 2})`);
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke-width', config.linkStrokeWidth)
          .attr('opacity', config.linkOpacity);
        
        g.selectAll('.tooltip').remove();
      });

    // 标题
    if (config.showTitle) {
      svg
        .append('text')
        .attr('x', width / 2)
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
                        <Form.Item label="显示片段标签">
                          <Switch
                            checked={config.showSegmentLabels}
                            onChange={checked => setConfig({ ...config, showSegmentLabels: checked })}
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
                    key: 'ring',
                    label: '环形参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="内半径">
                          <Slider
                            min={100}
                            max={250}
                            value={config.innerRadius}
                            onChange={value => setConfig({ ...config, innerRadius: value })}
                          />
                        </Form.Item>
                        <Form.Item label="外半径">
                          <Slider
                            min={150}
                            max={300}
                            value={config.outerRadius}
                            onChange={value => setConfig({ ...config, outerRadius: value })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'link',
                    label: '连接线参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="连接线透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.linkOpacity}
                            onChange={value => setConfig({ ...config, linkOpacity: value })}
                          />
                        </Form.Item>
                        <Form.Item label="连接线宽度">
                          <Slider
                            min={0.5}
                            max={5}
                            step={0.5}
                            value={config.linkStrokeWidth}
                            onChange={value => setConfig({ ...config, linkStrokeWidth: value })}
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

CircosChart.propTypes = {
  data: PropTypes.shape({
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
      })
    ).isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string.isRequired,
        sourceStart: PropTypes.number.isRequired,
        sourceEnd: PropTypes.number.isRequired,
        target: PropTypes.string.isRequired,
        targetStart: PropTypes.number.isRequired,
        targetEnd: PropTypes.number.isRequired,
        value: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CircosChart;