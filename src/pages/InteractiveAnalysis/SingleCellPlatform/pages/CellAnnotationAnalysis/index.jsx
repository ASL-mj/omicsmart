import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const CellAnnotationAnalysis = () => {
  const [activeTab, setActiveTab] = useState('tsne');
  const tsneChartRef = useRef(null);
  const umapChartRef = useRef(null);
  const circosChartRef = useRef(null);
  const stackedChartRef = useRef(null);
  const cellHeatmapChartRef = useRef(null);
  const correlationHeatmapChartRef = useRef(null);

  // 选中的行
  const [selectedTsneRows, setSelectedTsneRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedUmapRows, setSelectedUmapRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCircosRows, setSelectedCircosRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedStackedRows, setSelectedStackedRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCellHeatmapRows, setSelectedCellHeatmapRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCorrelationRows, setSelectedCorrelationRows] = useState(['1', '2', '3', '4', '5']);

  // t-SNE图表数据
  const tsneTableData = [
    { key: '1', cellType: 'T细胞', x: 2.3, y: 1.8, confidence: 0.92, markerGenes: 'CD3D, CD3E, CD3G' },
    { key: '2', cellType: 'B细胞', x: -1.2, y: 0.5, confidence: 0.88, markerGenes: 'CD79A, CD79B, MS4A1' },
    { key: '3', cellType: '巨噬细胞', x: 0.8, y: -2.1, confidence: 0.95, markerGenes: 'CD68, CSF1R, LYZ' },
    { key: '4', cellType: '树突细胞', x: 1.5, y: 0.9, confidence: 0.85, markerGenes: 'FLT3, LAMP3, CLEC9A' },
    { key: '5', cellType: 'NK细胞', x: -0.7, y: 1.6, confidence: 0.91, markerGenes: 'NCAM1, KLRD1, KLRF1' },
  ];

  const tsneTableColumns = [
    { title: '细胞类型', dataIndex: 'cellType', key: 'cellType' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '置信度', dataIndex: 'confidence', key: 'confidence', sorter: (a, b) => a.confidence - b.confidence },
    { title: '标记基因', dataIndex: 'markerGenes', key: 'markerGenes' },
  ];

  // UMAP图表数据
  const umapTableData = [
    { key: '1', cellType: 'T细胞', x: 1.8, y: 2.5, confidence: 0.92, markerGenes: 'CD3D, CD3E, CD3G' },
    { key: '2', cellType: 'B细胞', x: -0.9, y: 1.2, confidence: 0.88, markerGenes: 'CD79A, CD79B, MS4A1' },
    { key: '3', cellType: '巨噬细胞', x: 1.3, y: -1.7, confidence: 0.95, markerGenes: 'CD68, CSF1R, LYZ' },
    { key: '4', cellType: '树突细胞', x: 2.1, y: 0.4, confidence: 0.85, markerGenes: 'FLT3, LAMP3, CLEC9A' },
    { key: '5', cellType: 'NK细胞', x: -1.4, y: 2.1, confidence: 0.91, markerGenes: 'NCAM1, KLRD1, KLRF1' },
  ];

  const umapTableColumns = [
    { title: '细胞类型', dataIndex: 'cellType', key: 'cellType' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '置信度', dataIndex: 'confidence', key: 'confidence', sorter: (a, b) => a.confidence - b.confidence },
    { title: '标记基因', dataIndex: 'markerGenes', key: 'markerGenes' },
  ];

  // Circos图表数据
  const circosTableData = [
    { key: '1', source: 'T细胞', target: 'B细胞', interaction: 0.75, type: '激活' },
    { key: '2', source: 'T细胞', target: '巨噬细胞', interaction: 0.68, type: '抑制' },
    { key: '3', source: 'B细胞', target: '树突细胞', interaction: 0.52, type: '激活' },
    { key: '4', source: '树突细胞', target: 'NK细胞', interaction: 0.45, type: '激活' },
    { key: '5', source: '巨噬细胞', target: 'NK细胞', interaction: 0.58, type: '抑制' },
  ];

  const circosTableColumns = [
    { title: '源细胞', dataIndex: 'source', key: 'source' },
    { title: '目标细胞', dataIndex: 'target', key: 'target' },
    { title: '相互作用强度', dataIndex: 'interaction', key: 'interaction', sorter: (a, b) => a.interaction - b.interaction },
    { title: '相互作用类型', dataIndex: 'type', key: 'type' },
  ];

  // 堆叠图表数据
  const stackedTableData = [
    { key: '1', cluster: 'Cluster_0', TCell: 245, BCell: 187, Macrophage: 323, Dendritic: 289, NKCell: 201 },
    { key: '2', cluster: 'Cluster_1', TCell: 312, BCell: 256, Macrophage: 401, Dendritic: 345, NKCell: 289 },
    { key: '3', cluster: 'Cluster_2', TCell: 198, BCell: 145, Macrophage: 287, Dendritic: 234, NKCell: 156 },
    { key: '4', cluster: 'Cluster_3', TCell: 289, BCell: 223, Macrophage: 356, Dendritic: 278, NKCell: 187 },
    { key: '5', cluster: 'Cluster_4', TCell: 201, BCell: 176, Macrophage: 156, Dendritic: 198, NKCell: 223 },
  ];

  const stackedTableColumns = [
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: 'T细胞', dataIndex: 'TCell', key: 'TCell', sorter: (a, b) => a.TCell - b.TCell },
    { title: 'B细胞', dataIndex: 'BCell', key: 'BCell', sorter: (a, b) => a.BCell - b.BCell },
    { title: '巨噬细胞', dataIndex: 'Macrophage', key: 'Macrophage', sorter: (a, b) => a.Macrophage - b.Macrophage },
    { title: '树突细胞', dataIndex: 'Dendritic', key: 'Dendritic', sorter: (a, b) => a.Dendritic - b.Dendritic },
    { title: 'NK细胞', dataIndex: 'NKCell', key: 'NKCell', sorter: (a, b) => a.NKCell - b.NKCell },
  ];

  // 细胞鉴定热图表数据
  const cellHeatmapTableData = [
    { key: '1', gene: 'CD3D', TCell: 3.2, BCell: 0.1, Macrophage: 0.05, Dendritic: 0.08, NKCell: 0.3 },
    { key: '2', gene: 'CD79A', TCell: 0.05, BCell: 4.1, Macrophage: 0.12, Dendritic: 0.09, NKCell: 0.02 },
    { key: '3', gene: 'CD68', TCell: 0.08, BCell: 0.15, Macrophage: 3.8, Dendritic: 0.25, NKCell: 0.06 },
    { key: '4', gene: 'FLT3', TCell: 0.12, BCell: 0.25, Macrophage: 0.18, Dendritic: 3.5, NKCell: 0.09 },
    { key: '5', gene: 'NCAM1', TCell: 0.05, BCell: 0.08, Macrophage: 0.03, Dendritic: 0.12, NKCell: 3.7 },
  ];

  const cellHeatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: 'T细胞', dataIndex: 'TCell', key: 'TCell', sorter: (a, b) => a.TCell - b.TCell },
    { title: 'B细胞', dataIndex: 'BCell', key: 'BCell', sorter: (a, b) => a.BCell - b.BCell },
    { title: '巨噬细胞', dataIndex: 'Macrophage', key: 'Macrophage', sorter: (a, b) => a.Macrophage - b.Macrophage },
    { title: '树突细胞', dataIndex: 'Dendritic', key: 'Dendritic', sorter: (a, b) => a.Dendritic - b.Dendritic },
    { title: 'NK细胞', dataIndex: 'NKCell', key: 'NKCell', sorter: (a, b) => a.NKCell - b.NKCell },
  ];

  // 相关性热图表数据
  const correlationTableData = [
    { key: '1', cluster: 'Cluster_0', c0: 1.00, c1: 0.65, c2: 0.32, c3: 0.48, c4: 0.21 },
    { key: '2', cluster: 'Cluster_1', c0: 0.65, c1: 1.00, c2: 0.52, c3: 0.73, c4: 0.41 },
    { key: '3', cluster: 'Cluster_2', c0: 0.32, c1: 0.52, c2: 1.00, c3: 0.28, c4: 0.69 },
    { key: '4', cluster: 'Cluster_3', c0: 0.48, c1: 0.73, c2: 0.28, c3: 1.00, c4: 0.55 },
    { key: '5', cluster: 'Cluster_4', c0: 0.21, c1: 0.41, c2: 0.69, c3: 0.55, c4: 1.00 },
  ];

  const correlationTableColumns = [
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '亚群0', dataIndex: 'c0', key: 'c0', sorter: (a, b) => a.c0 - b.c0 },
    { title: '亚群1', dataIndex: 'c1', key: 'c1', sorter: (a, b) => a.c1 - b.c1 },
    { title: '亚群2', dataIndex: 'c2', key: 'c2', sorter: (a, b) => a.c2 - b.c2 },
    { title: '亚群3', dataIndex: 'c3', key: 'c3', sorter: (a, b) => a.c3 - b.c3 },
    { title: '亚群4', dataIndex: 'c4', key: 'c4', sorter: (a, b) => a.c4 - b.c4 },
  ];

  // 更新t-SNE图 (D3)
  const updateTsneChart = (selectedKeys) => {
    if (!tsneChartRef.current) return;

    // 清空之前的内容
    d3.select(tsneChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = tsneTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = tsneChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(tsneChartRef.current)
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

    // 置信度颜色比例尺
    const confidenceMin = d3.min(selectedData, d => d.confidence);
    const confidenceMax = d3.max(selectedData, d => d.confidence);
    const colorScale = d3.scaleSequential()
      .domain([confidenceMin, confidenceMax])
      .interpolator(d3.interpolateViridis);

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 10)
      .attr('fill', d => colorScale(d.confidence))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 40)
          .text(d.cellType)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 25)
          .text(`置信度: ${d.confidence}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`坐标: (${d.x}, ${d.y})`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`标记基因: ${d.markerGenes}`)
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
      .text('细胞注释 t-SNE 图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    // 为每个细胞类型创建图例项
    const cellTypes = [...new Set(selectedData.map(d => d.cellType))];
    cellTypes.forEach((type, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(selectedData.find(d => d.cellType === type).confidence));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(type);
    });
  };

  // 更新UMAP图 (D3)
  const updateUmapChart = (selectedKeys) => {
    if (!umapChartRef.current) return;

    // 清空之前的内容
    d3.select(umapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = umapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = umapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(umapChartRef.current)
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

    // 置信度颜色比例尺
    const confidenceMin = d3.min(selectedData, d => d.confidence);
    const confidenceMax = d3.max(selectedData, d => d.confidence);
    const colorScale = d3.scaleSequential()
      .domain([confidenceMin, confidenceMax])
      .interpolator(d3.interpolatePlasma);

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 10)
      .attr('fill', d => colorScale(d.confidence))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.x) + 10)
          .attr('y', yScale(d.y) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 40)
          .text(d.cellType)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 25)
          .text(`置信度: ${d.confidence}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`坐标: (${d.x}, ${d.y})`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`标记基因: ${d.markerGenes}`)
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
      .text('细胞注释 UMAP 图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    // 为每个细胞类型创建图例项
    const cellTypes = [...new Set(selectedData.map(d => d.cellType))];
    cellTypes.forEach((type, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(selectedData.find(d => d.cellType === type).confidence));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(type);
    });
  };

  // 更新堆叠图 (D3)
  const updateStackedChart = (selectedKeys) => {
    if (!stackedChartRef.current) return;

    // 清空之前的内容
    d3.select(stackedChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = stackedTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = stackedChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(stackedChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 准备数据
    const keys = ['TCell', 'BCell', 'Macrophage', 'Dendritic', 'NKCell'];
    const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
    
    // 堆叠数据
    const stack = d3.stack().keys(keys);
    const series = stack(selectedData);

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.cluster))
      .range([0, width])
      .padding(0.3);

    // Y 轴比例尺
    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .nice()
      .range([height, 0]);

    // 颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(colors);

    // 绘制堆叠柱状图
    svg.append('g')
      .selectAll('g')
      .data(series)
      .join('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(d.data.cluster))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 0.7);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
      });

    // X 轴
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px');

    // Y 轴
    svg.append('g')
      .call(d3.axisLeft(y))
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
      .text('细胞数');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('细胞类型堆叠图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    const legendItems = ['T细胞', 'B细胞', '巨噬细胞', '树突细胞', 'NK细胞'];
    
    legendItems.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors[i]);

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(item);
    });
  };

  // 更新细胞鉴定热图 (D3)
  const updateCellHeatmapChart = (selectedKeys) => {
    if (!cellHeatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(cellHeatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = cellHeatmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = cellHeatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(cellHeatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义细胞类型
    const cellTypes = ['TCell', 'BCell', 'Macrophage', 'Dendritic', 'NKCell'];
    const cellTypeNames = ['T细胞', 'B细胞', '巨噬细胞', '树突细胞', 'NK细胞'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      cellTypes.forEach(ct => allValues.push(d[ct]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRdYlBu);

    // 计算单元格尺寸
    const cellWidth = width / cellTypes.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      cellTypes.forEach((ct, j) => {
        const value = d[ct];
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

    // 添加列标签 (细胞类型)
    cellTypes.forEach((ct, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(cellTypeNames[j]);
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
      .text('细胞鉴定热图');

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

  // 更新相关性热图 (D3)
  const updateCorrelationHeatmapChart = (selectedKeys) => {
    if (!correlationHeatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(correlationHeatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = correlationTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = correlationHeatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(correlationHeatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义亚群
    const clusters = ['c0', 'c1', 'c2', 'c3', 'c4'];
    const clusterNames = ['亚群0', '亚群1', '亚群2', '亚群3', '亚群4'];
    
    // 计算相关性范围
    const allValues = [];
    selectedData.forEach(d => {
      clusters.forEach(c => allValues.push(d[c]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRdBu);

    // 计算单元格尺寸
    const cellWidth = width / clusters.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      clusters.forEach((c, j) => {
        const value = d[c];
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
          .style('fill', Math.abs(value - (maxVal + minVal) / 2) < 0.1 ? 'black' : 'white')
          .text(value.toFixed(2));
      });
    });

    // 添加列标签 (亚群)
    clusters.forEach((c, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(clusterNames[j]);
    });

    // 添加行标签 (亚群)
    selectedData.forEach((d, i) => {
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .text(d.cluster);
    });

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('相关性热图');

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
      .text(maxVal.toFixed(2));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(minVal.toFixed(2));
  };

  // 更新Circos图 (D3)
  const updateCircosChart = (selectedKeys) => {
    if (!circosTableData) return;

    // 清空之前的内容
    d3.select(circosChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = circosTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = circosChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // 创建 SVG
    const svg = d3.select(circosChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left + width / 2},${margin.top + height / 2})`);

    // 获取所有细胞类型
    const cellTypes = [...new Set(selectedData.flatMap(d => [d.source, d.target]))];
    
    // 创建颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(cellTypes)
      .range(d3.schemeCategory10);

    // 计算角度
    const angleStep = (2 * Math.PI) / cellTypes.length;
    
    // 绘制细胞类型标签
    cellTypes.forEach((cell, i) => {
      const angle = i * angleStep;
      const x = (radius - 20) * Math.cos(angle - Math.PI / 2);
      const y = (radius - 20) * Math.sin(angle - Math.PI / 2);
      
      // 绘制标签
      svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(cell);
        
      // 绘制圆形点
      svg.append("circle")
        .attr("cx", (radius - 35) * Math.cos(angle - Math.PI / 2))
        .attr("cy", (radius - 35) * Math.sin(angle - Math.PI / 2))
        .attr("r", 6)
        .attr("fill", color(cell));
    });

    // 绘制连接线
    selectedData.forEach(d => {
      const sourceIndex = cellTypes.indexOf(d.source);
      const targetIndex = cellTypes.indexOf(d.target);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        const sourceAngle = sourceIndex * angleStep - Math.PI / 2;
        const targetAngle = targetIndex * angleStep - Math.PI / 2;
        
        const sourceX = (radius - 35) * Math.cos(sourceAngle);
        const sourceY = (radius - 35) * Math.sin(sourceAngle);
        const targetX = (radius - 35) * Math.cos(targetAngle);
        const targetY = (radius - 35) * Math.sin(targetAngle);
        
        // 绘制连线
        svg.append("line")
          .attr("x1", sourceX)
          .attr("y1", sourceY)
          .attr("x2", targetX)
          .attr("y2", targetY)
          .attr("stroke", d.type === '激活' ? "#5470c6" : "#ee6666")
          .attr("stroke-width", d.interaction * 5)
          .attr("opacity", 0.6);
      }
    });

    // 标题
    svg.append("text")
      .attr("x", 0)
      .attr("y", -height / 2 + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("细胞相互作用 Circos 图");

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${radius - 100},${-radius + 20})`);

    const interactions = ['激活', '抑制'];
    const interactionColors = ['#5470c6', '#ee6666'];
    
    interactions.forEach((type, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('line')
        .attr('x1', 0)
        .attr('y1', 5)
        .attr('x2', 20)
        .attr('y2', 5)
        .attr('stroke', interactionColors[i])
        .attr('stroke-width', 3);

      legendRow.append('text')
        .attr('x', 25)
        .attr('y', 8)
        .style('font-size', '12px')
        .text(type);
    });
  };

  // 初始化t-SNE图 - 当 Tab 切换到t-SNE图时初始化
  useEffect(() => {
    if (activeTab === 'tsne' && tsneChartRef.current) {
      updateTsneChart(selectedTsneRows);
      
      // 响应式
      const handleResize = () => updateTsneChart(selectedTsneRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedTsneRows]);

  // 初始化UMAP图 - 当 Tab 切换到UMAP图时初始化
  useEffect(() => {
    if (activeTab === 'umap' && umapChartRef.current) {
      updateUmapChart(selectedUmapRows);
      
      // 响应式
      const handleResize = () => updateUmapChart(selectedUmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedUmapRows]);

  // 初始化Circos图 - 当 Tab 切换到Circos图时初始化
  useEffect(() => {
    if (activeTab === 'circos' && circosChartRef.current) {
      updateCircosChart(selectedCircosRows);
      
      // 响应式
      const handleResize = () => updateCircosChart(selectedCircosRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCircosRows]);

  // 初始化堆叠图 - 当 Tab 切换到堆叠图时初始化
  useEffect(() => {
    if (activeTab === 'stacked' && stackedChartRef.current) {
      updateStackedChart(selectedStackedRows);
      
      // 响应式
      const handleResize = () => updateStackedChart(selectedStackedRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedStackedRows]);

  // 初始化细胞鉴定热图 - 当 Tab 切换到细胞鉴定热图时初始化
  useEffect(() => {
    if (activeTab === 'cell-heatmap' && cellHeatmapChartRef.current) {
      updateCellHeatmapChart(selectedCellHeatmapRows);
      
      // 响应式
      const handleResize = () => updateCellHeatmapChart(selectedCellHeatmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCellHeatmapRows]);

  // 初始化相关性热图 - 当 Tab 切换到相关性热图时初始化
  useEffect(() => {
    if (activeTab === 'correlation' && correlationHeatmapChartRef.current) {
      updateCorrelationHeatmapChart(selectedCorrelationRows);
      
      // 响应式
      const handleResize = () => updateCorrelationHeatmapChart(selectedCorrelationRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCorrelationRows]);

  // 下载处理
  const handleTsneDownload = (selectedRowKeys) => {
    message.success(`正在下载t-SNE图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleUmapDownload = (selectedRowKeys) => {
    message.success(`正在下载UMAP图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCircosDownload = (selectedRowKeys) => {
    message.success(`正在下载Circos图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleStackedDownload = (selectedRowKeys) => {
    message.success(`正在下载堆叠图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCellHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载细胞鉴定热图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCorrelationDownload = (selectedRowKeys) => {
    message.success(`正在下载相关性热图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleTsneRefresh = () => {
    message.success('已刷新t-SNE图数据');
    setSelectedTsneRows(['1', '2', '3', '4', '5']);
  };

  const handleUmapRefresh = () => {
    message.success('已刷新UMAP图数据');
    setSelectedUmapRows(['1', '2', '3', '4', '5']);
  };

  const handleCircosRefresh = () => {
    message.success('已刷新Circos图数据');
    setSelectedCircosRows(['1', '2', '3', '4', '5']);
  };

  const handleStackedRefresh = () => {
    message.success('已刷新堆叠图数据');
    setSelectedStackedRows(['1', '2', '3', '4', '5']);
  };

  const handleCellHeatmapRefresh = () => {
    message.success('已刷新细胞鉴定热图数据');
    setSelectedCellHeatmapRows(['1', '2', '3', '4', '5']);
  };

  const handleCorrelationRefresh = () => {
    message.success('已刷新相关性热图数据');
    setSelectedCorrelationRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'tsne',
      label: 't-SNE图',
    },
    {
      key: 'umap',
      label: 'UMAP图',
    },
    {
      key: 'circos',
      label: 'circos图',
    },
    {
      key: 'stacked',
      label: '堆叠图',
    },
    {
      key: 'cell-heatmap',
      label: '细胞鉴定热图',
    },
    {
      key: 'correlation',
      label: '相关性热图',
    }
  ];

  return (
    <PageTemplate pageTitle="细胞注释分析">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'tsne' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={tsneChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={tsneTableColumns}
          tableData={tsneTableData}
          selectedRowKeys={selectedTsneRows}
          onSelectChange={setSelectedTsneRows}
          onDownload={handleTsneDownload}
          onRefresh={handleTsneRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'umap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={umapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={umapTableColumns}
          tableData={umapTableData}
          selectedRowKeys={selectedUmapRows}
          onSelectChange={setSelectedUmapRows}
          onDownload={handleUmapDownload}
          onRefresh={handleUmapRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'circos' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={circosChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={circosTableColumns}
          tableData={circosTableData}
          selectedRowKeys={selectedCircosRows}
          onSelectChange={setSelectedCircosRows}
          onDownload={handleCircosDownload}
          onRefresh={handleCircosRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'stacked' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={stackedChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={stackedTableColumns}
          tableData={stackedTableData}
          selectedRowKeys={selectedStackedRows}
          onSelectChange={setSelectedStackedRows}
          onDownload={handleStackedDownload}
          onRefresh={handleStackedRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'cell-heatmap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={cellHeatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={cellHeatmapTableColumns}
          tableData={cellHeatmapTableData}
          selectedRowKeys={selectedCellHeatmapRows}
          onSelectChange={setSelectedCellHeatmapRows}
          onDownload={handleCellHeatmapDownload}
          onRefresh={handleCellHeatmapRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'correlation' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={correlationHeatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={correlationTableColumns}
          tableData={correlationTableData}
          selectedRowKeys={selectedCorrelationRows}
          onSelectChange={setSelectedCorrelationRows}
          onDownload={handleCorrelationDownload}
          onRefresh={handleCorrelationRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default CellAnnotationAnalysis;