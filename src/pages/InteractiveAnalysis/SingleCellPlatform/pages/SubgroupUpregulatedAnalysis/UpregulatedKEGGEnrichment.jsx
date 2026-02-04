import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const UpregulatedKEGGEnrichment = () => {
  const [activeTab, setActiveTab] = useState('count-stats');
  const countStatsChartRef = useRef(null);
  const significanceBarChartRef = useRef(null);
  const keggBarChartRef = useRef(null);
  const significanceBubbleChartRef = useRef(null);
  const enrichmentCircleChartRef = useRef(null);
  const pathwayChartRef = useRef(null);

  // 选中的行
  const [selectedCountStatsRows, setSelectedCountStatsRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedSignificanceBarRows, setSelectedSignificanceBarRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedKeggBarRows, setSelectedKeggBarRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedSignificanceBubbleRows, setSelectedSignificanceBubbleRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCircleRows, setSelectedCircleRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedPathwayRows, setSelectedPathwayRows] = useState(['1', '2', '3', '4', '5']);

  // 数目统计图表数据
  const countStatsTableData = [
    { key: '1', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012, genes: 'MAPK1, MAPK3, MAPK8, MAP2K1' },
    { key: '2', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018, genes: 'AKT1, AKT2, PIK3CA, PTEN' },
    { key: '3', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024, genes: 'IL2RA, IL2RB, JAK1, STAT3' },
    { key: '4', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029, genes: 'CDK1, CDK2, CCNA2, CCNB1' },
    { key: '5', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035, genes: 'TP53, CDKN1A, BAX, CASP3' },
  ];

  const countStatsTableColumns = [
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
    { title: '相关基因', dataIndex: 'genes', key: 'genes' },
  ];

  // 显著性柱状图表数据
  const significanceBarTableData = [
    { key: '1', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018 },
    { key: '3', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024 },
    { key: '4', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029 },
    { key: '5', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035 },
  ];

  const significanceBarTableColumns = [
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // KEGG富集条形图表数据
  const keggBarTableData = [
    { key: '1', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018 },
    { key: '3', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024 },
    { key: '4', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029 },
    { key: '5', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035 },
  ];

  const keggBarTableColumns = [
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // 显著性气泡图表数据
  const significanceBubbleTableData = [
    { key: '1', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012, enrichment: 2.3 },
    { key: '2', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018, enrichment: 1.9 },
    { key: '3', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024, enrichment: 1.7 },
    { key: '4', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029, enrichment: 1.6 },
    { key: '5', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035, enrichment: 1.5 },
  ];

  const significanceBubbleTableColumns = [
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
    { title: '富集倍数', dataIndex: 'enrichment', key: 'enrichment', sorter: (a, b) => a.enrichment - b.enrichment },
  ];

  // 富集圈图表数据
  const circleTableData = [
    { key: '1', category: '信号转导', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', category: '信号转导', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018 },
    { key: '3', category: '免疫系统', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024 },
    { key: '4', category: '细胞生长', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029 },
    { key: '5', category: '细胞凋亡', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035 },
  ];

  const circleTableColumns = [
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // 显著性通路图表数据
  const pathwayTableData = [
    { key: '1', pathway: 'MAPK信号通路', count: 45, pValue: 0.001, adjPValue: 0.012, category: '信号转导' },
    { key: '2', pathway: 'PI3K-Akt信号通路', count: 38, pValue: 0.002, adjPValue: 0.018, category: '信号转导' },
    { key: '3', pathway: '细胞因子受体相互作用', count: 32, pValue: 0.003, adjPValue: 0.024, category: '免疫系统' },
    { key: '4', pathway: '细胞周期', count: 28, pValue: 0.004, adjPValue: 0.029, category: '细胞生长' },
    { key: '5', pathway: 'p53信号通路', count: 24, pValue: 0.005, adjPValue: 0.035, category: '细胞凋亡' },
  ];

  const pathwayTableColumns = [
    { title: '通路名称', dataIndex: 'pathway', key: 'pathway' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
    { title: '分类', dataIndex: 'category', key: 'category' },
  ];

  // 更新数目统计图 (D3)
  const updateCountStatsChart = (selectedKeys) => {
    if (!countStatsChartRef.current) return;

    // 清空之前的内容
    d3.select(countStatsChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = countStatsTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = countStatsChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(countStatsChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.pathway))
      .range([0, width])
      .padding(0.2);

    // Y 轴比例尺
    const y = d3.scaleLinear()
      .domain([0, d3.max(selectedData, d => d.count)])
      .range([height, 0]);

    // 颜色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 绘制柱形图
    svg.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.pathway))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", (d, i) => color(i));

    // 添加坐标轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("angle", -45)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Y 轴标签
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("基因数量");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("KEGG富集数目统计图");
  };

  // 更新显著性柱状图 (D3)
  const updateSignificanceBarChart = (selectedKeys) => {
    if (!significanceBarChartRef.current) return;

    // 清空之前的内容
    d3.select(significanceBarChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = significanceBarTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = significanceBarChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(significanceBarChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.pathway))
      .range([0, width])
      .padding(0.2);

    // Y 轴比例尺
    const y = d3.scaleLinear()
      .domain([0, d3.max(selectedData, d => d.count)])
      .range([height, 0]);

    // 颜色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 绘制柱形图
    svg.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.pathway))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", (d, i) => color(i));

    // 添加坐标轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("angle", -45)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Y 轴标签
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("基因数量");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("显著性柱状图");
  };

  // 更新KEGG富集条形图 (D3)
  const updateKeggBarChart = (selectedKeys) => {
    if (!keggBarChartRef.current) return;

    // 清空之前的内容
    d3.select(keggBarChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = keggBarTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = keggBarChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(keggBarChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y 轴比例尺 (通路)
    const y = d3.scaleBand()
      .domain(selectedData.map(d => d.pathway))
      .range([0, height])
      .padding(0.1);

    // X 轴比例尺 (基因数量)
    const x = d3.scaleLinear()
      .domain([0, d3.max(selectedData, d => d.count)])
      .range([0, width]);

    // 颜色比例尺
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 绘制条形图
    svg.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.pathway))
      .attr("x", 0)
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => color(i));

    // 添加坐标轴
    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px");

    // X 轴标签
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("基因数量");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("KEGG富集条形图");
  };

  // 更新显著性气泡图 (D3)
  const updateSignificanceBubbleChart = (selectedKeys) => {
    if (!significanceBubbleChartRef.current) return;

    // 清空之前的内容
    d3.select(significanceBubbleChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = significanceBubbleTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = significanceBubbleChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(significanceBubbleChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺 (通路)
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.pathway))
      .range([0, width])
      .padding(0.1);

    // Y 轴比例尺 (富集倍数)
    const y = d3.scaleLinear()
      .domain(d3.extent(selectedData, d => d.enrichment))
      .range([height, 0]);

    // 半径比例尺 (基因数量)
    const r = d3.scaleSqrt()
      .domain(d3.extent(selectedData, d => d.count))
      .range([5, 20]);

    // 颜色比例尺 (P值)
    const color = d3.scaleSequential()
      .domain(d3.extent(selectedData, d => d.pValue))
      .interpolator(d3.interpolateReds);

    // 绘制气泡图
    svg.selectAll(".bubble")
      .data(selectedData)
      .enter().append("circle")
      .attr("class", "bubble")
      .attr("cx", d => x(d.pathway) + x.bandwidth() / 2)
      .attr("cy", d => y(d.enrichment))
      .attr("r", d => r(d.count))
      .attr("fill", d => color(d.pValue))
      .attr("opacity", 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', x(d.pathway) + x.bandwidth() / 2 + 10)
          .attr('y', y(d.enrichment) - 60)
          .attr('width', 140)
          .attr('height', 80)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', x(d.pathway) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 50)
          .text(d.pathway)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', x(d.pathway) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 35)
          .text(`基因数量: ${d.count}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', x(d.pathway) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 20)
          .text(`P值: ${d.pValue}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', x(d.pathway) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 5)
          .text(`富集倍数: ${d.enrichment}`)
          .style('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        svg.selectAll('.tooltip').remove();
      });

    // 添加坐标轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("angle", -45)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Y 轴标签
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("富集倍数");

    // X 轴标签
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("通路名称");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("显著性气泡图");

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    // 添加图例说明
    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', '12px')
      .text('气泡大小: 基因数量');
    legend.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .style('font-size', '12px')
      .text('颜色深浅: P值');
  };

  // 更新富集圈图 (D3)
  const updateEnrichmentCircleChart = (selectedKeys) => {
    if (!enrichmentCircleChartRef.current) return;

    // 清空之前的内容
    d3.select(enrichmentCircleChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = circleTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = enrichmentCircleChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // 创建 SVG
    const svg = d3.select(enrichmentCircleChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left + width / 2},${margin.top + height / 2})`);

    // 按分类分组数据
    const categories = d3.group(selectedData, d => d.category);
    const categoryNames = Array.from(categories.keys());
    
    // 创建颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(categoryNames)
      .range(d3.schemeCategory10.slice(0, categoryNames.length));

    // 每个分类内的项数
    const maxItemsPerCategory = Math.max(...Array.from(categories.values()).map(arr => arr.length));
    
    // 计算角度
    const angleStep = (2 * Math.PI) / (categories.size * maxItemsPerCategory);
    
    // 绘制每个分类的环
    let ringIndex = 0;
    categories.forEach((items, categoryName) => {
      const ringRadius = radius * 0.3 + (radius * 0.6 * ringIndex / categories.size);
      
      items.forEach((item, itemIndex) => {
        const angle = angleStep * (ringIndex * maxItemsPerCategory + itemIndex);
        const x = ringRadius * Math.cos(angle - Math.PI / 2);
        const y = ringRadius * Math.sin(angle - Math.PI / 2);
        
        // 绘制圆形节点
        svg.append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 10)
          .attr("fill", color(categoryName))
          .attr("opacity", 0.7)
          .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            
            // 显示提示信息
            const tooltip = svg.append('g')
              .attr('class', 'tooltip')
              .attr('pointer-events', 'none');
              
            tooltip.append('rect')
              .attr('x', x + 10)
              .attr('y', y - 40)
              .attr('width', 140)
              .attr('height', 70)
              .attr('fill', 'white')
              .attr('stroke', 'black')
              .attr('stroke-width', 1)
              .attr('rx', 5)
              .attr('ry', 5);
              
            tooltip.append('text')
              .attr('x', x + 15)
              .attr('y', y - 30)
              .text(item.pathway)
              .style('font-size', '12px')
              .style('font-weight', 'bold');
              
            tooltip.append('text')
              .attr('x', x + 15)
              .attr('y', y - 15)
              .text(`分类: ${item.category}`)
              .style('font-size', '12px');
              
            tooltip.append('text')
              .attr('x', x + 15)
              .attr('y', y)
              .text(`基因数量: ${item.count}`)
              .style('font-size', '12px');
              
            tooltip.append('text')
              .attr('x', x + 15)
              .attr('y', y + 15)
              .text(`P值: ${item.pValue}`)
              .style('font-size', '12px');
          })
          .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.7);
            svg.selectAll('.tooltip').remove();
          });
        
        // 添加标签
        const labelX = (ringRadius + 15) * Math.cos(angle - Math.PI / 2);
        const labelY = (ringRadius + 15) * Math.sin(angle - Math.PI / 2);
        
        svg.append("text")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "10px")
          .text(item.pathway.substring(0, 8) + (item.pathway.length > 8 ? ".." : ""));
      });
      
      ringIndex++;
    });

    // 添加中心文本
    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("富集圈图");

    // 添加图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width / 2 - margin.left},${-height / 2 + margin.top})`);

    categoryNames.forEach((cat, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', color(cat));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cat);
    });
  };

  // 更新显著性通路图 (D3)
  const updatePathwayChart = (selectedKeys) => {
    if (!pathwayChartRef.current) return;

    // 清空之前的内容
    d3.select(pathwayChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = pathwayTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = pathwayChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(pathwayChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.pathway))
      .range([0, width])
      .padding(0.2);

    // Y 轴比例尺
    const y = d3.scaleLinear()
      .domain([0, d3.max(selectedData, d => d.count)])
      .range([height, 0]);

    // 颜色比例尺 (按分类)
    const categories = [...new Set(selectedData.map(d => d.category))];
    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(d3.schemeCategory10.slice(0, categories.length));

    // 绘制柱形图
    svg.selectAll(".bar")
      .data(selectedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.pathway))
      .attr("y", d => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.count))
      .attr("fill", d => color(d.category));

    // 添加坐标轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .attr("angle", -45)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px");

    // Y 轴标签
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("基因数量");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("显著性通路图");

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    categories.forEach((cat, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(cat));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(cat);
    });
  };

  // 初始化数目统计图 - 当 Tab 切换到数目统计图时初始化
  useEffect(() => {
    if (activeTab === 'count-stats' && countStatsChartRef.current) {
      updateCountStatsChart(selectedCountStatsRows);
      
      // 响应式
      const handleResize = () => updateCountStatsChart(selectedCountStatsRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCountStatsRows]);

  // 初始化显著性柱状图 - 当 Tab 切换到显著性柱状图时初始化
  useEffect(() => {
    if (activeTab === 'significance-bar' && significanceBarChartRef.current) {
      updateSignificanceBarChart(selectedSignificanceBarRows);
      
      // 响应式
      const handleResize = () => updateSignificanceBarChart(selectedSignificanceBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedSignificanceBarRows]);

  // 初始化KEGG富集条形图 - 当 Tab 切换到KEGG富集条形图时初始化
  useEffect(() => {
    if (activeTab === 'kegg-bar' && keggBarChartRef.current) {
      updateKeggBarChart(selectedKeggBarRows);
      
      // 响应式
      const handleResize = () => updateKeggBarChart(selectedKeggBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedKeggBarRows]);

  // 初始化显著性气泡图 - 当 Tab 切换到显著性气泡图时初始化
  useEffect(() => {
    if (activeTab === 'bubble' && significanceBubbleChartRef.current) {
      updateSignificanceBubbleChart(selectedSignificanceBubbleRows);
      
      // 响应式
      const handleResize = () => updateSignificanceBubbleChart(selectedSignificanceBubbleRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedSignificanceBubbleRows]);

  // 初始化富集圈图 - 当 Tab 切换到富集圈图时初始化
  useEffect(() => {
    if (activeTab === 'circle' && enrichmentCircleChartRef.current) {
      updateEnrichmentCircleChart(selectedCircleRows);
      
      // 响应式
      const handleResize = () => updateEnrichmentCircleChart(selectedCircleRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedCircleRows]);

  // 初始化显著性通路图 - 当 Tab 切换到显著性通路图时初始化
  useEffect(() => {
    if (activeTab === 'pathway' && pathwayChartRef.current) {
      updatePathwayChart(selectedPathwayRows);
      
      // 响应式
      const handleResize = () => updatePathwayChart(selectedPathwayRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedPathwayRows]);

  // 下载处理
  const handleCountStatsDownload = (selectedRowKeys) => {
    message.success(`正在下载数目统计图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleSignificanceBarDownload = (selectedRowKeys) => {
    message.success(`正在下载显著性柱状图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleKeggBarDownload = (selectedRowKeys) => {
    message.success(`正在下载KEGG富集条形图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleBubbleDownload = (selectedRowKeys) => {
    message.success(`正在下载显著性气泡图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCircleDownload = (selectedRowKeys) => {
    message.success(`正在下载富集圈图的 ${selectedRowKeys.length} 条数据`);
  };

  const handlePathwayDownload = (selectedRowKeys) => {
    message.success(`正在下载显著性通路图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleCountStatsRefresh = () => {
    message.success('已刷新数目统计图数据');
    setSelectedCountStatsRows(['1', '2', '3', '4', '5']);
  };

  const handleSignificanceBarRefresh = () => {
    message.success('已刷新显著性柱状图数据');
    setSelectedSignificanceBarRows(['1', '2', '3', '4', '5']);
  };

  const handleKeggBarRefresh = () => {
    message.success('已刷新KEGG富集条形图数据');
    setSelectedKeggBarRows(['1', '2', '3', '4', '5']);
  };

  const handleBubbleRefresh = () => {
    message.success('已刷新显著性气泡图数据');
    setSelectedSignificanceBubbleRows(['1', '2', '3', '4', '5']);
  };

  const handleCircleRefresh = () => {
    message.success('已刷新富集圈图数据');
    setSelectedCircleRows(['1', '2', '3', '4', '5']);
  };

  const handlePathwayRefresh = () => {
    message.success('已刷新显著性通路图数据');
    setSelectedPathwayRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'count-stats',
      label: '数目统计图',
    },
    {
      key: 'significance-bar',
      label: '显著性柱状图',
    },
    {
      key: 'kegg-bar',
      label: 'KEGG富集条形图',
    },
    {
      key: 'bubble',
      label: '显著性气泡图',
    },
    {
      key: 'circle',
      label: '富集圈图',
    },
    {
      key: 'pathway',
      label: '显著性通路图',
    }
  ];

  return (
    <PageTemplate pageTitle="上调差异基因KEGG富集">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'count-stats' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={countStatsChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={countStatsTableColumns}
          tableData={countStatsTableData}
          selectedRowKeys={selectedCountStatsRows}
          onSelectChange={setSelectedCountStatsRows}
          onDownload={handleCountStatsDownload}
          onRefresh={handleCountStatsRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'significance-bar' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={significanceBarChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={significanceBarTableColumns}
          tableData={significanceBarTableData}
          selectedRowKeys={selectedSignificanceBarRows}
          onSelectChange={setSelectedSignificanceBarRows}
          onDownload={handleSignificanceBarDownload}
          onRefresh={handleSignificanceBarRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'kegg-bar' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={keggBarChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={keggBarTableColumns}
          tableData={keggBarTableData}
          selectedRowKeys={selectedKeggBarRows}
          onSelectChange={setSelectedKeggBarRows}
          onDownload={handleKeggBarDownload}
          onRefresh={handleKeggBarRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'bubble' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={significanceBubbleChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={significanceBubbleTableColumns}
          tableData={significanceBubbleTableData}
          selectedRowKeys={selectedSignificanceBubbleRows}
          onSelectChange={setSelectedSignificanceBubbleRows}
          onDownload={handleBubbleDownload}
          onRefresh={handleBubbleRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'circle' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={enrichmentCircleChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={circleTableColumns}
          tableData={circleTableData}
          selectedRowKeys={selectedCircleRows}
          onSelectChange={setSelectedCircleRows}
          onDownload={handleCircleDownload}
          onRefresh={handleCircleRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'pathway' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={pathwayChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={pathwayTableColumns}
          tableData={pathwayTableData}
          selectedRowKeys={selectedPathwayRows}
          onSelectChange={setSelectedPathwayRows}
          onDownload={handlePathwayDownload}
          onRefresh={handlePathwayRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default UpregulatedKEGGEnrichment;