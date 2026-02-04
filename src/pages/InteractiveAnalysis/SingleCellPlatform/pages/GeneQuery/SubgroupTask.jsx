import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Row, Col, Space, Typography, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import * as d3 from 'd3';
import styles from './SubgroupTask.module.css';

const { Option } = Select;
const { Text } = Typography;

const SubgroupTask = () => {
  // 基因信息状态
  const [geneInfo] = useState({
    geneName: 'Gene1',
    geneId: 'ENSG00000137818',
    symbol: 'RPLP1',
    description: 'ribosomal protein, large, P1'
  });

  // 图表选择器状态
  const [selectedCluster, setSelectedCluster] = useState('Cluster');
  const [selectedRadarType, setSelectedRadarType] = useState('P');
  const [selectedUmapType, setSelectedUmapType] = useState('UMAP');
  const [selectedEnrichment, setSelectedEnrichment] = useState('GO');

  // 图表引用
  const expressionChartRef = useRef(null);
  const radarChartRef = useRef(null);
  const violinChartRef = useRef(null);
  const umapChartRef = useRef(null);
  const enrichmentChartRef = useRef(null);

  // 模拟数据
  const clusterOptions = ['Cluster', 'myeloid_progenitor', 'Cluster_0', 'Cluster_1', 'Cluster_2'];
  const radarTypeOptions = ['P', 'log2FC', 'Expression'];
  const umapTypeOptions = ['UMAP', 't-SNE'];
  const enrichmentOptions = ['GO', 'KEGG', 'Reactome'];

  // 绘制表达量统计图（柱状图）
  const drawExpressionChart = () => {
    if (!expressionChartRef.current) return;

    d3.select(expressionChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const width = expressionChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(expressionChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 模拟数据
    const data = [
      { cluster: 'myeloid_progenitor', value: 100, percentage: 1.0 }
    ];

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.cluster))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 120])
      .range([height, 0]);

    const yScaleRight = d3.scaleLinear()
      .domain([0, 1.2])
      .range([height, 0]);

    // 绘制柱状图
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => xScale(d.cluster))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.value))
      .attr('fill', '#ffa726')
      .attr('opacity', 0.8);

    // 添加散点（右侧Y轴）
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.cluster) + xScale.bandwidth() / 2)
      .attr('cy', d => yScaleRight(d.percentage))
      .attr('r', 5)
      .attr('fill', '#333')
      .attr('opacity', 0.8);

    // 添加左侧Y轴
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // 添加右侧Y轴
    svg.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .call(d3.axisRight(yScaleRight).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // 添加X轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-15)')
      .attr('text-anchor', 'end');

    // 标题
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

    // 绘制背景圆圈
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      svg.append('circle')
        .attr('r', (radius / levels) * i)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);
    }

    // 绘制标签
    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#666')
      .text('myeloid_progenitor');

    // 绘制数据点
    const dataPoint = {
      x: 0,
      y: -radius * 0.7,
    };

    svg.append('circle')
      .attr('cx', dataPoint.x)
      .attr('cy', dataPoint.y)
      .attr('r', 8)
      .attr('fill', '#4fc3f7');

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
      .text('● log2(fc) > 0');

    svg.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6666ff')
      .text('● log2(fc) < 0');

    // 标题
    svg.append('text')
      .attr('x', 0)
      .attr('y', -height / 2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('表达差异雷达图');
  };

  // 绘制小提琴图
  const drawViolinChart = () => {
    if (!violinChartRef.current) return;

    d3.select(violinChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = violinChartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(violinChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 模拟小提琴图数据
    const violinData = [
      { group: 'Group1', values: Array.from({ length: 50 }, () => Math.random() * 3 + 2) },
      { group: 'Group2', values: Array.from({ length: 50 }, () => Math.random() * 2 + 1) }
    ];

    const xScale = d3.scaleBand()
      .domain(violinData.map(d => d.group))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .range([height, 0]);

    const colors = ['#ffa726', '#4fc3f7'];

    // 为每组绘制小提琴图
    violinData.forEach((d, i) => {
      const groupX = xScale(d.group) + xScale.bandwidth() / 2;
      const violinWidth = xScale.bandwidth() * 0.8;

      // 计算密度
      const bins = d3.bin()
        .domain(yScale.domain())
        .thresholds(20)(d.values);

      const maxBinLength = d3.max(bins, b => b.length);
      const widthScale = d3.scaleLinear()
        .domain([0, maxBinLength])
        .range([0, violinWidth / 2]);

      // 绘制小提琴形状
      const area = d3.area()
        .x0(b => groupX - widthScale(b.length))
        .x1(b => groupX + widthScale(b.length))
        .y(b => yScale((b.x0 + b.x1) / 2))
        .curve(d3.curveCatmullRom);

      svg.append('path')
        .datum(bins)
        .attr('d', area)
        .attr('fill', colors[i])
        .attr('opacity', 0.6)
        .attr('stroke', colors[i])
        .attr('stroke-width', 1);

      // 绘制箱线图
      const q1 = d3.quantile(d.values.sort(d3.ascending), 0.25);
      const median = d3.quantile(d.values.sort(d3.ascending), 0.5);
      const q3 = d3.quantile(d.values.sort(d3.ascending), 0.75);

      // 中位线
      svg.append('line')
        .attr('x1', groupX - 10)
        .attr('x2', groupX + 10)
        .attr('y1', yScale(median))
        .attr('y2', yScale(median))
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

      // 箱体
      svg.append('rect')
        .attr('x', groupX - 5)
        .attr('y', yScale(q3))
        .attr('width', 10)
        .attr('height', yScale(q1) - yScale(q3))
        .attr('fill', 'none')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);
    });

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

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('表达量比较图');
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

    // 模拟UMAP数据 - 主要是myeloid_progenitor
    const pointsPerCluster = 200;
    const data = [];

    // myeloid_progenitor cluster
    for (let i = 0; i < pointsPerCluster; i++) {
      data.push({
        x: (Math.random() - 0.3) * 4,
        y: (Math.random() - 0.3) * 4,
        cluster: 'myeloid_progenitor',
        expression: Math.random()
      });
    }

    // 其他小cluster
    for (let i = 0; i < 20; i++) {
      data.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        cluster: 'other',
        expression: Math.random() * 0.3
      });
    }

    const xScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([-5, 5])
      .range([height, 0]);

    // 绘制散点
    svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 2)
      .attr('fill', d => d.cluster === 'myeloid_progenitor' ? '#ffa726' : '#90caf9')
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
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 50)`);

    legend.append('circle')
      .attr('r', 6)
      .attr('fill', '#ffa726');

    legend.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .style('font-size', '12px')
      .text('myeloid_progenitor');
  };

  // 绘制富集通路统计图
  const drawEnrichmentChart = () => {
    if (!enrichmentChartRef.current) return;

    d3.select(enrichmentChartRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 60, left: 250 };
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
      { pathway: 'Cluster_myeloid_progenitor_down', value: 2084 }
    ];

    const xScale = d3.scaleLinear()
      .domain([0, 2500])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.pathway))
      .range([0, height])
      .padding(0.3);

    // 绘制条形图
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d.pathway))
      .attr('width', d => xScale(d.value))
      .attr('height', yScale.bandwidth())
      .attr('fill', '#ffa726')
      .attr('opacity', 0.8);

    // 添加数值标签
    svg.selectAll('text.value')
      .data(data)
      .join('text')
      .attr('class', 'value')
      .attr('x', d => xScale(d.value) + 5)
      .attr('y', d => yScale(d.pathway) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.value);

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '11px');

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
      .attr('transform', `translate(${width - 200}, -20)`);

    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', '#ffa726');

    legend.append('text')
      .attr('x', 18)
      .attr('y', 10)
      .style('font-size', '10px')
      .text('Cluster_myeloid_progenitor_down');
  };

  // 初始化和更新图表
  useEffect(() => {
    drawExpressionChart();
    drawRadarChart();
    drawViolinChart();
    drawUmapChart();
    drawEnrichmentChart();

    const handleResize = () => {
      drawExpressionChart();
      drawRadarChart();
      drawViolinChart();
      drawUmapChart();
      drawEnrichmentChart();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedCluster, selectedRadarType, selectedUmapType, selectedEnrichment, geneInfo]);

  return (
    <PageTemplate 
      pageTitle="亚群类任务"
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
                  style={{ width: 150 }}
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
              extra={
                <Select
                  value={selectedRadarType}
                  onChange={setSelectedRadarType}
                  style={{ width: 100 }}
                  size="small"
                >
                  {radarTypeOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              }
              className={styles.chartCard}
            >
              <div ref={radarChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 右上：表达量比较图 */}
          <Col xs={24} lg={8}>
            <Card 
              title="表达量比较图"
              className={styles.chartCard}
            >
              <div ref={violinChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 左下：表达分布图 */}
          <Col xs={24} lg={12}>
            <Card 
              title="表达分布图"
              extra={
                <Select
                  value={selectedUmapType}
                  onChange={setSelectedUmapType}
                  style={{ width: 100 }}
                  size="small"
                >
                  {umapTypeOptions.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              }
              className={styles.chartCard}
            >
              <div ref={umapChartRef} className={styles.chartContainer} />
            </Card>
          </Col>

          {/* 右下：差异富集通路统计图 */}
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

export default SubgroupTask;