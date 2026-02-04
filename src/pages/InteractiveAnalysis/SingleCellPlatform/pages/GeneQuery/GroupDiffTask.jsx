import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Row, Col, Space, Typography, Input, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import * as d3 from 'd3';
import styles from './GroupDiffTask.module.css';

const { Option } = Select;
const { Text } = Typography;

const GroupDiffTask = () => {
  // 基因信息状态
  const [geneInfo] = useState({
    geneName: 'Gene1',
    geneId: 'ENSG00000243485',
    symbol: 'RP11-34P13.3',
    description: '-'
  });

  // 图表选择器状态
  const [selectedCluster, setSelectedCluster] = useState('Cluster');
  const [selectedEnrichment, setSelectedEnrichment] = useState('GO');

  // 图表引用
  const expressionChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const umapChartRef = useRef(null);
  const enrichmentChartRef = useRef(null);

  // 模拟数据
  const clusterOptions = ['Cluster', 'Cluster_0', 'Cluster_1', 'Cluster_2', 'Cluster_3', 'Cluster_4'];
  const enrichmentOptions = ['GO', 'KEGG', 'Reactome'];

  // 绘制表达量统计图
  const drawExpressionChart = () => {
    if (!expressionChartRef.current) return;

    d3.select(expressionChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = expressionChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(expressionChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 模拟数据
    const data = Array.from({ length: 13 }, (_, i) => ({
      cluster: i,
      value: Math.random() * 0.8 + 0.1
    }));

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.cluster))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // 绘制散点
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.cluster) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#1890ff')
      .attr('opacity', 0.6);

    // 添加阈值线
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0.5))
      .attr('y2', yScale(0.5))
      .attr('stroke', '#ff9800')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // 添加标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('表达量统计图');
  };

  // 绘制雷达图
  const drawRadarChart = () => {
    if (!radarChartRef.current) return;

    d3.select(radarChartRef.current).selectAll('*').remove();

    const width = radarChartRef.current.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 60;

    const svg = d3.select(radarChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // 模拟数据 - 13个cluster
    const clusters = Array.from({ length: 13 }, (_, i) => i);
    const angleSlice = (Math.PI * 2) / clusters.length;

    // 绘制背景圆圈
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      svg.append('circle')
        .attr('r', (radius / levels) * i)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);
    }

    // 绘制轴线和标签
    clusters.forEach((cluster, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // 轴线
      svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);

      // 标签
      const labelRadius = radius + 20;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .style('fill', '#666')
        .text(cluster);
    });

    // 绘制数据点和区域
    const dataPositive = clusters.map((cluster, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const value = Math.random() * 0.8 + 0.2;
      return {
        x: Math.cos(angle) * radius * value,
        y: Math.sin(angle) * radius * value,
        cluster
      };
    });

    const dataNegative = clusters.map((cluster, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const value = Math.random() * 0.5 + 0.1;
      return {
        x: Math.cos(angle) * radius * value,
        y: Math.sin(angle) * radius * value,
        cluster
      };
    });

    // 绘制区域
    const lineGenerator = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);

    svg.append('path')
      .datum(dataPositive)
      .attr('d', lineGenerator)
      .attr('fill', '#ff9999')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#ff6666')
      .attr('stroke-width', 2);

    svg.append('path')
      .datum(dataNegative)
      .attr('d', lineGenerator)
      .attr('fill', '#9999ff')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#6666ff')
      .attr('stroke-width', 2);

    // 绘制数据点
    dataPositive.forEach(d => {
      svg.append('circle')
        .attr('cx', d.x)
        .attr('cy', d.y)
        .attr('r', 4)
        .attr('fill', '#4fc3f7');
    });

    // 中心标签
    svg.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(`${geneInfo.symbol}表达差异`);

    svg.append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#ff6666')
      .text('● scale > 0');

    svg.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6666ff')
      .text('● scale < 0');

    // 标题
    svg.append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('表达差异雷达图');
  };

  // 绘制UMAP分布图
  const drawUmapChart = () => {
    if (!umapChartRef.current) return;

    d3.select(umapChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 40 };
    const width = umapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(umapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 模拟UMAP数据
    const clusters = 13;
    const pointsPerCluster = 50;
    const data = [];

    for (let c = 0; c < clusters; c++) {
      const centerX = (Math.random() - 0.5) * 8;
      const centerY = (Math.random() - 0.5) * 8;
      
      for (let i = 0; i < pointsPerCluster; i++) {
        data.push({
          x: centerX + (Math.random() - 0.5) * 2,
          y: centerY + (Math.random() - 0.5) * 2,
          cluster: c,
          expression: Math.random()
        });
      }
    }

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([height, 0]);

    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateYlOrRd);

    // 绘制散点
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 2)
      .attr('fill', d => colorScale(d.expression))
      .attr('opacity', 0.6);

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('表达分布图');

    // 图例
    const legendHeight = 10;
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    const legendScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, legendHeight * 10]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    // 渐变色条
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d3.interpolateYlOrRd(0));

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d3.interpolateYlOrRd(1));

    legend.append('rect')
      .attr('width', 15)
      .attr('height', legendHeight * 10)
      .style('fill', 'url(#legend-gradient)');

    legend.append('g')
      .attr('transform', `translate(15, 0)`)
      .call(legendAxis);
  };

  // 绘制富集通路统计图
  const drawEnrichmentChart = () => {
    if (!enrichmentChartRef.current) return;

    d3.select(enrichmentChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 40, left: 120 };
    const width = enrichmentChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(enrichmentChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 模拟数据
    const data = [
      { pathway: 'Cluster_0', value: 0 },
      { pathway: 'Cluster_1', value: 0 },
      { pathway: 'Cluster_2', value: 0 },
      { pathway: 'Cluster_3', value: 0 },
      { pathway: 'Cluster_4', value: 0 }
    ];

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 1])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.pathway))
      .range([0, height])
      .padding(0.2);

    const colors = ['#ff9800', '#4fc3f7', '#f44336', '#4caf50', '#ffeb3b'];

    // 绘制条形图
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.pathway))
      .attr('width', d => xScale(d.value))
      .attr('height', yScale.bandwidth())
      .attr('fill', (d, i) => colors[i])
      .attr('opacity', 0.8);

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('差异富集通路统计图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 10)`);

    data.forEach((d, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colors[i]);

      legendRow.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .style('font-size', '10px')
        .text(d.pathway);
    });
  };

  // 初始化和更新图表
  useEffect(() => {
    drawExpressionChart();
    drawRadarChart();
    drawUmapChart();
    drawEnrichmentChart();

    const handleResize = () => {
      drawExpressionChart();
      drawRadarChart();
      drawUmapChart();
      drawEnrichmentChart();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedCluster, selectedEnrichment, geneInfo]);

  return (
    <PageTemplate 
      pageTitle="组间差异任务"
      showGeneSelectors={true}
    >
      <div className={styles.container}>
        {/* 基因信息栏 */}
        <Card className={styles.geneInfoCard}>
          <Space size="large" style={{ width: '100%' }}>
            <Space>
              <Text strong>Gene1</Text>
            </Space>
            <Space>
              <Text type="secondary">Gene_ID:</Text>
              <Text>{geneInfo.geneId}</Text>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => navigator.clipboard.writeText(geneInfo.geneId)}
              />
            </Space>
            <Space>
              <Text type="secondary">Symbol:</Text>
              <Text>{geneInfo.symbol}</Text>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => navigator.clipboard.writeText(geneInfo.symbol)}
              />
            </Space>
            <Space>
              <Text type="secondary">Description:</Text>
              <Text>{geneInfo.description}</Text>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => navigator.clipboard.writeText(geneInfo.description)}
              />
            </Space>
          </Space>
        </Card>

        {/* 图表区域 */}
        <Row gutter={[16, 16]}>
          {/* 左上：表达量统计图 */}
          <Col xs={24} lg={8}>
            <Card 
              title="表达量统计图"
              extra={
                <Select
                  value={selectedCluster}
                  onChange={setSelectedCluster}
                  style={{ width: 120 }}
                  size="small"
                >
                  {clusterOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              }
              className={styles.chartCard}
            >
              <div ref={expressionChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 中上：表达差异雷达图 */}
          <Col xs={24} lg={8}>
            <Card 
              title="表达差异雷达图"
              className={styles.chartCard}
            >
              <div ref={radarChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 右上：表达分布图 */}
          <Col xs={24} lg={8}>
            <Card 
              title="表达分布图"
              extra={
                <Select
                  value="UMAP"
                  style={{ width: 100 }}
                  size="small"
                >
                  <Option value="UMAP">UMAP</Option>
                  <Option value="tSNE">t-SNE</Option>
                </Select>
              }
              className={styles.chartCard}
            >
              <div ref={umapChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 左下：差异富集通路统计图 */}
          <Col xs={24} lg={12}>
            <Card 
              title="差异富集通路统计图"
              extra={
                <Select
                  value={selectedEnrichment}
                  onChange={setSelectedEnrichment}
                  style={{ width: 120 }}
                  size="small"
                >
                  {enrichmentOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              }
              className={styles.chartCard}
            >
              <div ref={enrichmentChartRef} className={styles.chartContainer} />
            </Card>
          </Col>
        </Row>
      </div>
    </PageTemplate>
  );
};

export default GroupDiffTask;