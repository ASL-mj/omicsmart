import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Form, Switch, Slider, Tabs, Collapse } from 'antd';
import ChartContainer from '../core/ChartContainer';
import ChartToolbar from '../core/ChartToolbar';
import ChartLegend from '../core/ChartLegend';

/**
 * 网络图组件
 * 用途：展示节点关系、基因调控网络、细胞通讯
 * 特点：力导向布局、节点可拖拽、边权重可视化
 */
const NetworkChart = ({
  data = { nodes: [], links: [] },
  height: containerHeight = 600,
  className = '',
  style = {},
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const chartBodyRef = useRef(null);
  const simulationRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentContainerHeight, setCurrentContainerHeight] = useState(containerHeight);
  
  const [chartInnerDimensions, setChartInnerDimensions] = useState({
    width: 800,
    height: 600,
  });

  const [config, setConfig] = useState({
    title: '网络图',
    showTitle: true,
    titleFontSize: 16,
    titleColor: '#333333',
    titleFontWeight: 'bold',
    
    showLegend: true,
    legendPosition: 'right',
    legendFontSize: 12,
    
    // 节点参数
    nodeMinSize: 5,
    nodeMaxSize: 20,
    nodeOpacity: 0.8,
    nodeStrokeWidth: 2,
    nodeStrokeColor: '#ffffff',
    showNodeLabels: true,
    nodeLabelFontSize: 10,
    
    // 边参数
    linkMinWidth: 1,
    linkMaxWidth: 5,
    linkOpacity: 0.6,
    linkColor: '#999999',
    
    // 力导向参数
    chargeStrength: -300,
    linkDistance: 100,
    collisionRadius: 30,
    
    colors: ['#42a5f5', '#66bb6a', '#ffa726', '#ef5350', '#ab47bc', '#26c6da', '#ffca28'],
    
    marginTop: 60,
    marginRight: 140,
    marginBottom: 60,
    marginLeft: 60,
  });

  const processedData = useMemo(() => {
    const { nodes, links } = data;
    
    if (!nodes || nodes.length === 0) return { nodes: [], links: [], groups: [] };
    
    // 处理节点
    const processedNodes = nodes.map(node => ({
      ...node,
      id: node.id,
      group: node.group || 1,
      value: node.value || 10,
    }));
    
    // 处理边
    const processedLinks = links.map(link => ({
      ...link,
      source: link.source,
      target: link.target,
      value: link.value || 1,
    }));
    
    // 获取所有分组
    const groups = [...new Set(processedNodes.map(n => n.group))];
    
    return {
      nodes: processedNodes,
      links: processedLinks,
      groups,
    };
  }, [data]);

  const legendItems = useMemo(() => {
    return processedData.groups.map((group, index) => ({
      name: `Group ${group}`,
      color: config.colors[index % config.colors.length],
      symbolType: 'circle',
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
    if (!svgRef.current || processedData.nodes.length === 0) return;

    // 停止之前的模拟
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const { marginTop, marginRight, marginBottom, marginLeft } = config;
    const innerWidth = chartInnerDimensions.width - marginLeft - marginRight;
    const innerHeight = chartInnerDimensions.height - marginTop - marginBottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    const { nodes, links } = processedData;

    // 复制数据以避免修改原始数据
    const graphNodes = nodes.map(d => ({ ...d }));
    const graphLinks = links.map(d => ({ ...d }));

    // 节点大小比例尺
    const nodeValueExtent = d3.extent(graphNodes, d => d.value);
    const nodeSizeScale = d3
      .scaleLinear()
      .domain(nodeValueExtent)
      .range([config.nodeMinSize, config.nodeMaxSize]);

    // 边宽度比例尺
    const linkValueExtent = d3.extent(graphLinks, d => d.value);
    const linkWidthScale = d3
      .scaleLinear()
      .domain(linkValueExtent)
      .range([config.linkMinWidth, config.linkMaxWidth]);

    // 颜色比例尺
    const colorScale = d3
      .scaleOrdinal()
      .domain(processedData.groups)
      .range(config.colors);

    // 创建力导向模拟
    const simulation = d3
      .forceSimulation(graphNodes)
      .force('link', d3.forceLink(graphLinks).id(d => d.id).distance(config.linkDistance))
      .force('charge', d3.forceManyBody().strength(config.chargeStrength))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collision', d3.forceCollide().radius(config.collisionRadius));

    simulationRef.current = simulation;

    // 绘制边
    const link = g
      .append('g')
      .selectAll('line')
      .data(graphLinks)
      .join('line')
      .attr('stroke', config.linkColor)
      .attr('stroke-opacity', config.linkOpacity)
      .attr('stroke-width', d => linkWidthScale(d.value));

    // 绘制节点
    const node = g
      .append('g')
      .selectAll('circle')
      .data(graphNodes)
      .join('circle')
      .attr('r', d => nodeSizeScale(d.value))
      .attr('fill', d => colorScale(d.group))
      .attr('opacity', config.nodeOpacity)
      .attr('stroke', config.nodeStrokeColor)
      .attr('stroke-width', config.nodeStrokeWidth)
      .style('cursor', 'pointer')
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke-width', config.nodeStrokeWidth * 2);
        
        // 高亮相关的边
        link
          .attr('stroke-opacity', l =>
            l.source.id === d.id || l.target.id === d.id ? 1 : config.linkOpacity * 0.3
          )
          .attr('stroke-width', l =>
            l.source.id === d.id || l.target.id === d.id
              ? linkWidthScale(l.value) * 2
              : linkWidthScale(l.value)
          );
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', config.nodeOpacity).attr('stroke-width', config.nodeStrokeWidth);
        
        // 恢复边的样式
        link
          .attr('stroke-opacity', config.linkOpacity)
          .attr('stroke-width', d => linkWidthScale(d.value));
      });

    // 节点标签
    let labels = null;
    if (config.showNodeLabels) {
      labels = g
        .append('g')
        .selectAll('text')
        .data(graphNodes)
        .join('text')
        .text(d => d.id)
        .attr('font-size', config.nodeLabelFontSize)
        .attr('text-anchor', 'middle')
        .attr('dy', d => nodeSizeScale(d.value) + 12)
        .style('fill', '#333')
        .style('pointer-events', 'none');
    }

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('cx', d => d.x).attr('cy', d => d.y);

      if (labels) {
        labels.attr('x', d => d.x).attr('y', d => d.y);
      }
    });

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

    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
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
                        <Form.Item label="显示节点标签">
                          <Switch
                            checked={config.showNodeLabels}
                            onChange={checked => setConfig({ ...config, showNodeLabels: checked })}
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
                    key: 'node',
                    label: '节点参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="节点透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.nodeOpacity}
                            onChange={value => setConfig({ ...config, nodeOpacity: value })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'link',
                    label: '边参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="边透明度">
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={config.linkOpacity}
                            onChange={value => setConfig({ ...config, linkOpacity: value })}
                          />
                        </Form.Item>
                      </Form>
                    ),
                  },
                  {
                    key: 'force',
                    label: '力导向参数',
                    children: (
                      <Form layout="vertical" size="small">
                        <Form.Item label="排斥力强度">
                          <Slider
                            min={-500}
                            max={-100}
                            value={config.chargeStrength}
                            onChange={value => setConfig({ ...config, chargeStrength: value })}
                          />
                        </Form.Item>
                        <Form.Item label="连接距离">
                          <Slider
                            min={50}
                            max={200}
                            value={config.linkDistance}
                            onChange={value => setConfig({ ...config, linkDistance: value })}
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

NetworkChart.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        group: PropTypes.number,
        value: PropTypes.number,
      })
    ).isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string.isRequired,
        target: PropTypes.string.isRequired,
        value: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  height: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default NetworkChart;