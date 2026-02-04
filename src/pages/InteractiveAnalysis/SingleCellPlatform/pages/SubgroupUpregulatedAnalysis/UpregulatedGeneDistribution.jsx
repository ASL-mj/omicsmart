import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const UpregulatedGeneDistribution = () => {
  const [activeTab, setActiveTab] = useState('gene-tsne');
  const geneTsneChartRef = useRef(null);
  const geneUmapChartRef = useRef(null);
  const geneViolinChartRef = useRef(null);
  const geneBubbleChartRef = useRef(null);
  const geneHeatmapChartRef = useRef(null);

  // 选中的行
  const [selectedGeneTsneRows, setSelectedGeneTsneRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedGeneUmapRows, setSelectedGeneUmapRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedGeneViolinRows, setSelectedGeneViolinRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedGeneBubbleRows, setSelectedGeneBubbleRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedGeneHeatmapRows, setSelectedGeneHeatmapRows] = useState(['1', '2', '3', '4', '5']);

  // 基因t-SNE表格数据
  const geneTsneTableData = [
    { key: '1', gene: 'GENE_001', x: 2.3, y: 1.8, expression: 3.2, cluster: 'Cluster_0' },
    { key: '2', gene: 'GENE_002', x: -1.2, y: 0.5, expression: 2.8, cluster: 'Cluster_1' },
    { key: '3', gene: 'GENE_003', x: 0.8, y: -2.1, expression: 4.1, cluster: 'Cluster_2' },
    { key: '4', gene: 'GENE_004', x: 1.5, y: 0.9, expression: 2.5, cluster: 'Cluster_0' },
    { key: '5', gene: 'GENE_005', x: -0.7, y: 1.6, expression: 3.7, cluster: 'Cluster_1' },
  ];

  const geneTsneTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 基因UMAP表格数据
  const geneUmapTableData = [
    { key: '1', gene: 'GENE_001', x: 1.8, y: 2.5, expression: 3.0, cluster: 'Cluster_0' },
    { key: '2', gene: 'GENE_002', x: -0.9, y: 1.2, expression: 2.6, cluster: 'Cluster_1' },
    { key: '3', gene: 'GENE_003', x: 1.3, y: -1.7, expression: 3.9, cluster: 'Cluster_2' },
    { key: '4', gene: 'GENE_004', x: 2.1, y: 0.4, expression: 2.3, cluster: 'Cluster_0' },
    { key: '5', gene: 'GENE_005', x: -1.4, y: 2.1, expression: 3.5, cluster: 'Cluster_1' },
  ];

  const geneUmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
  ];

  // 基因小提琴图表格数据
  const geneViolinTableData = [
    { key: '1', gene: 'GENE_001', cluster0: 2.3, cluster1: 1.8, cluster2: 3.1, avgExpression: 2.4 },
    { key: '2', gene: 'GENE_002', cluster0: 1.2, cluster1: 2.5, cluster2: 1.9, avgExpression: 1.9 },
    { key: '3', gene: 'GENE_003', cluster0: 3.1, cluster1: 2.8, cluster2: 2.5, avgExpression: 2.8 },
    { key: '4', gene: 'GENE_004', cluster0: 1.8, cluster1: 1.5, cluster2: 2.2, avgExpression: 1.8 },
    { key: '5', gene: 'GENE_005', cluster0: 2.9, cluster1: 3.2, cluster2: 2.7, avgExpression: 2.9 },
  ];

  const geneViolinTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '亚群0', dataIndex: 'cluster0', key: 'cluster0', sorter: (a, b) => a.cluster0 - b.cluster0 },
    { title: '亚群1', dataIndex: 'cluster1', key: 'cluster1', sorter: (a, b) => a.cluster1 - b.cluster1 },
    { title: '亚群2', dataIndex: 'cluster2', key: 'cluster2', sorter: (a, b) => a.cluster2 - b.cluster2 },
    { title: '平均表达', dataIndex: 'avgExpression', key: 'avgExpression', sorter: (a, b) => a.avgExpression - b.avgExpression },
  ];

  // 基因气泡图表数据
  const geneBubbleTableData = [
    { key: '1', gene: 'GENE_001', cluster: 'Cluster_0', expression: 3.2, cells: 150, avgExp: 2.8 },
    { key: '2', gene: 'GENE_002', cluster: 'Cluster_1', expression: 2.8, cells: 120, avgExp: 2.4 },
    { key: '3', gene: 'GENE_003', cluster: 'Cluster_2', expression: 4.1, cells: 180, avgExp: 3.5 },
    { key: '4', gene: 'GENE_004', cluster: 'Cluster_0', expression: 2.5, cells: 100, avgExp: 2.1 },
    { key: '5', gene: 'GENE_005', cluster: 'Cluster_1', expression: 3.7, cells: 160, avgExp: 3.1 },
  ];

  const geneBubbleTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '细胞数', dataIndex: 'cells', key: 'cells', sorter: (a, b) => a.cells - b.cells },
    { title: '平均表达', dataIndex: 'avgExp', key: 'avgExp', sorter: (a, b) => a.avgExp - b.avgExp },
  ];

  // 基因热图表数据
  const geneHeatmapTableData = [
    { key: '1', gene: 'GENE_001', cluster0: 2.3, cluster1: 1.8, cluster2: 3.1, cluster3: 2.7 },
    { key: '2', gene: 'GENE_002', cluster0: 1.2, cluster1: 2.5, cluster2: 1.9, cluster3: 1.6 },
    { key: '3', gene: 'GENE_003', cluster0: 3.1, cluster1: 2.8, cluster2: 2.5, cluster3: 3.3 },
    { key: '4', gene: 'GENE_004', cluster0: 1.8, cluster1: 1.5, cluster2: 2.2, cluster3: 1.9 },
    { key: '5', gene: 'GENE_005', cluster0: 2.9, cluster1: 3.2, cluster2: 2.7, cluster3: 3.0 },
  ];

  const geneHeatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '亚群0', dataIndex: 'cluster0', key: 'cluster0', sorter: (a, b) => a.cluster0 - b.cluster0 },
    { title: '亚群1', dataIndex: 'cluster1', key: 'cluster1', sorter: (a, b) => a.cluster1 - b.cluster1 },
    { title: '亚群2', dataIndex: 'cluster2', key: 'cluster2', sorter: (a, b) => a.cluster2 - b.cluster2 },
    { title: '亚群3', dataIndex: 'cluster3', key: 'cluster3', sorter: (a, b) => a.cluster3 - b.cluster3 },
  ];

  // 更新基因t-SNE图 (D3)
  const updateGeneTsneChart = (selectedKeys) => {
    if (!geneTsneChartRef.current) return;

    // 清空之前的内容
    d3.select(geneTsneChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = geneTsneTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = geneTsneChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(geneTsneChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const xMin = d3.min(selectedData, d => d.x);
    const xMax = d3.max(selectedData, d => d.x);
    const yMin = d3.min(selectedData, d => d.y);
    const yMax = d3.max(selectedData, d => d.y);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 表达量颜色比例尺
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    const colorScale = d3.scaleSequential()
      .domain([expressionMin, expressionMax])
      .interpolator(d3.interpolateReds);

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.expression))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 20)
          .attr('width', 100)
          .attr('height', 50)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y))
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('t-SNE Y');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('t-SNE X');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('基因t-SNE分布图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    // 为每个亚群创建图例项
    const clusters = [...new Set(selectedData.map(d => d.cluster))];
    clusters.forEach((cluster, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', d3.schemeCategory10[i % 10]);

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cluster);
    });
  };

  // 更新基因UMAP图 (D3)
  const updateGeneUmapChart = (selectedKeys) => {
    if (!geneUmapChartRef.current) return;

    // 清空之前的内容
    d3.select(geneUmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = geneUmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = geneUmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(geneUmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const xMin = d3.min(selectedData, d => d.x);
    const xMax = d3.max(selectedData, d => d.x);
    const yMin = d3.min(selectedData, d => d.y);
    const yMax = d3.max(selectedData, d => d.y);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 表达量颜色比例尺
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    const colorScale = d3.scaleSequential()
      .domain([expressionMin, expressionMax])
      .interpolator(d3.interpolateBlues);

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.expression))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 20)
          .attr('width', 100)
          .attr('height', 50)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y))
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('UMAP Y');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('UMAP X');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('基因UMAP分布图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    // 为每个亚群创建图例项
    const clusters = [...new Set(selectedData.map(d => d.cluster))];
    clusters.forEach((cluster, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', d3.schemeCategory10[i % 10]);

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cluster);
    });
  };

  // 更新基因小提琴图 (D3)
  const updateGeneViolinChart = (selectedKeys) => {
    if (!geneViolinChartRef.current) return;

    // 清空之前的内容
    d3.select(geneViolinChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = geneViolinTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = geneViolinChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(geneViolinChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义集群
    const clusters = ['cluster0', 'cluster1', 'cluster2'];
    const clusterNames = ['亚群0', '亚群1', '亚群2'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      clusters.forEach(c => allValues.push(d[c]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // X 轴比例尺 (按基因)
    const xScale = d3.scaleBand()
      .domain(selectedData.map(d => d.gene))
      .range([0, width])
      .padding(0.1);

    // Y 轴比例尺 (按表达量)
    const yScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([height, 0]);

    // 为每个基因绘制小提琴图
    selectedData.forEach((d, i) => {
      const geneX = xScale(d.gene) + xScale.bandwidth() / 2;
      
      // 为每个集群绘制密度图
      clusters.forEach((cluster, j) => {
        const val = d[cluster];
        const yPos = yScale(val);
        
        // 绘制圆点表示表达量
        svg.append('circle')
          .attr('cx', geneX + (j - 1) * 20) // 为每个集群偏移位置
          .attr('cy', yPos)
          .attr('r', 5)
          .attr('fill', d3.schemeCategory10[j])
          .attr('opacity', 0.7);
      });
    });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .attr('angle', -45)
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('表达量');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('基因小提琴图分布');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    clusterNames.forEach((name, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', d3.schemeCategory10[i]);

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(name);
    });
  };

  // 更新基因气泡图 (D3)
  const updateGeneBubbleChart = (selectedKeys) => {
    if (!geneBubbleChartRef.current) return;

    // 清空之前的内容
    d3.select(geneBubbleChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = geneBubbleTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = geneBubbleChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(geneBubbleChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算表达量和细胞数的范围
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    const cellsMin = d3.min(selectedData, d => d.cells);
    const cellsMax = d3.max(selectedData, d => d.cells);
    
    // X 轴比例尺 (按基因)
    const xScale = d3.scaleBand()
      .domain(selectedData.map(d => d.gene))
      .range([0, width])
      .padding(0.1);

    // Y 轴比例尺 (按表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin, expressionMax])
      .range([height, 0]);

    // 半径比例尺 (按细胞数)
    const rScale = d3.scaleSqrt()
      .domain([cellsMin, cellsMax])
      .range([5, 20]); // 半径范围

    // 颜色比例尺 (按亚群)
    const clusters = [...new Set(selectedData.map(d => d.cluster))];
    const colorScale = d3.scaleOrdinal()
      .domain(clusters)
      .range(d3.schemeCategory10.slice(0, clusters.length));

    // 绘制气泡图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.gene) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.expression))
      .attr('r', d => rScale(d.cells))
      .attr('fill', d => colorScale(d.cluster))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.gene) + xScale.bandwidth() / 2 + 10)
          .attr('y', yScale(d.expression) - 40)
          .attr('width', 120)
          .attr('height', 60)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.gene) + xScale.bandwidth() / 2 + 15)
          .attr('y', yScale(d.expression) - 30)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.gene) + xScale.bandwidth() / 2 + 15)
          .attr('y', yScale(d.expression) - 15)
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.gene) + xScale.bandwidth() / 2 + 15)
          .attr('y', yScale(d.expression))
          .text(`细胞数: ${d.cells}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .attr('angle', -45)
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴标签
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('表达量');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('基因');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('基因气泡图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    clusters.forEach((cluster, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(cluster));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cluster);
    });
  };

  // 更新基因热图 (D3)
  const updateGeneHeatmapChart = (selectedKeys) => {
    if (!geneHeatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(geneHeatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = geneHeatmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = geneHeatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(geneHeatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义集群
    const clusters = ['cluster0', 'cluster1', 'cluster2', 'cluster3'];
    const clusterNames = ['亚群0', '亚群1', '亚群2', '亚群3'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      clusters.forEach(c => allValues.push(d[c]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateViridis);

    // 计算单元格尺寸
    const cellWidth = width / clusters.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      clusters.forEach((cluster, j) => {
        const value = d[cluster];
        const x = j * cellWidth;
        const y = i * cellHeight;
        
        // 绘制矩形
        svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('fill', colorScale(value))
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
          
        // 添加数值标签
        svg.append('text')
          .attr('x', x + cellWidth / 2)
          .attr('y', y + cellHeight / 2)
          .attr('dy', '0.35em')
          .style('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('fill', value > (maxVal - minVal) / 2 ? 'white' : 'black')
          .text(value.toFixed(1));
      });
    });

    // 添加列标签 (集群)
    clusters.forEach((cluster, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(clusterNames[j]);
    });

    // 添加行标签 (基因)
    selectedData.forEach((d, i) => {
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .text(d.gene);
    });

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('基因热图分布');

    // 颜色图例
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(minVal, maxVal, (maxVal - minVal) / 50).reverse();
    
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width + 20}, 50)`);

    values.forEach((val, idx) => {
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', idx * legendHeight)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .attr('fill', colorScale(val));
    });

    // 颜色图例标签
    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', 0)
      .style('font-size', '10px')
      .text(maxVal.toFixed(1));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(minVal.toFixed(1));
  };

  // 初始化基因t-SNE图 - 当 Tab 切换到基因t-SNE时初始化
  useEffect(() => {
    if (activeTab === 'gene-tsne' && geneTsneChartRef.current) {
      updateGeneTsneChart(selectedGeneTsneRows);
      
      // 响应式
      const handleResize = () => updateGeneTsneChart(selectedGeneTsneRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGeneTsneRows]);

  // 初始化基因UMAP图 - 当 Tab 切换到基因UMAP时初始化
  useEffect(() => {
    if (activeTab === 'gene-umap' && geneUmapChartRef.current) {
      updateGeneUmapChart(selectedGeneUmapRows);
      
      // 响应式
      const handleResize = () => updateGeneUmapChart(selectedGeneUmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGeneUmapRows]);

  // 初始化基因小提琴图 - 当 Tab 切换到基因小提琴图时初始化
  useEffect(() => {
    if (activeTab === 'gene-violin' && geneViolinChartRef.current) {
      updateGeneViolinChart(selectedGeneViolinRows);
      
      // 响应式
      const handleResize = () => updateGeneViolinChart(selectedGeneViolinRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGeneViolinRows]);

  // 初始化基因气泡图 - 当 Tab 切换到基因气泡图时初始化
  useEffect(() => {
    if (activeTab === 'gene-bubble' && geneBubbleChartRef.current) {
      updateGeneBubbleChart(selectedGeneBubbleRows);
      
      // 响应式
      const handleResize = () => updateGeneBubbleChart(selectedGeneBubbleRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGeneBubbleRows]);

  // 初始化基因热图 - 当 Tab 切换到基因热图时初始化
  useEffect(() => {
    if (activeTab === 'gene-heatmap' && geneHeatmapChartRef.current) {
      updateGeneHeatmapChart(selectedGeneHeatmapRows);
      
      // 响应式
      const handleResize = () => updateGeneHeatmapChart(selectedGeneHeatmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGeneHeatmapRows]);

  // 下载处理
  const handleGeneTsneDownload = (selectedRowKeys) => {
    message.success(`正在下载基因t-SNE分布的 ${selectedRowKeys.length} 条数据`);
  };

  const handleGeneUmapDownload = (selectedRowKeys) => {
    message.success(`正在下载基因UMAP分布的 ${selectedRowKeys.length} 条数据`);
  };

  const handleGeneViolinDownload = (selectedRowKeys) => {
    message.success(`正在下载基因小提琴图分布的 ${selectedRowKeys.length} 条数据`);
  };

  const handleGeneBubbleDownload = (selectedRowKeys) => {
    message.success(`正在下载基因气泡图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleGeneHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载基因热图分布的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleGeneTsneRefresh = () => {
    message.success('已刷新基因t-SNE分布数据');
    setSelectedGeneTsneRows(['1', '2', '3', '4', '5']);
  };

  const handleGeneUmapRefresh = () => {
    message.success('已刷新基因UMAP分布数据');
    setSelectedGeneUmapRows(['1', '2', '3', '4', '5']);
  };

  const handleGeneViolinRefresh = () => {
    message.success('已刷新基因小提琴图分布数据');
    setSelectedGeneViolinRows(['1', '2', '3', '4', '5']);
  };

  const handleGeneBubbleRefresh = () => {
    message.success('已刷新基因气泡图数据');
    setSelectedGeneBubbleRows(['1', '2', '3', '4', '5']);
  };

  const handleGeneHeatmapRefresh = () => {
    message.success('已刷新基因热图分布数据');
    setSelectedGeneHeatmapRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'gene-tsne',
      label: '基因t-SNE分布',
    },
    {
      key: 'gene-umap',
      label: '基因UMAP分布',
    },
    {
      key: 'gene-violin',
      label: '基因小提琴图分布',
    },
    {
      key: 'gene-bubble',
      label: '基因气泡图',
    },
    {
      key: 'gene-heatmap',
      label: '基因热图分布',
    }
  ];

  return (
    <PageTemplate pageTitle="亚群上调基因分布">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'gene-tsne' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={geneTsneChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={geneTsneTableColumns}
          tableData={geneTsneTableData}
          selectedRowKeys={selectedGeneTsneRows}
          onSelectChange={setSelectedGeneTsneRows}
          onDownload={handleGeneTsneDownload}
          onRefresh={handleGeneTsneRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'gene-umap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={geneUmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={geneUmapTableColumns}
          tableData={geneUmapTableData}
          selectedRowKeys={selectedGeneUmapRows}
          onSelectChange={setSelectedGeneUmapRows}
          onDownload={handleGeneUmapDownload}
          onRefresh={handleGeneUmapRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'gene-violin' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={geneViolinChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={geneViolinTableColumns}
          tableData={geneViolinTableData}
          selectedRowKeys={selectedGeneViolinRows}
          onSelectChange={setSelectedGeneViolinRows}
          onDownload={handleGeneViolinDownload}
          onRefresh={handleGeneViolinRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'gene-bubble' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={geneBubbleChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={geneBubbleTableColumns}
          tableData={geneBubbleTableData}
          selectedRowKeys={selectedGeneBubbleRows}
          onSelectChange={setSelectedGeneBubbleRows}
          onDownload={handleGeneBubbleDownload}
          onRefresh={handleGeneBubbleRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'gene-heatmap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={geneHeatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={geneHeatmapTableColumns}
          tableData={geneHeatmapTableData}
          selectedRowKeys={selectedGeneHeatmapRows}
          onSelectChange={setSelectedGeneHeatmapRows}
          onDownload={handleGeneHeatmapDownload}
          onRefresh={handleGeneHeatmapRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default UpregulatedGeneDistribution;