import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const UpregulatedGOEnrichment = () => {
  const [activeTab, setActiveTab] = useState('classification-bar');
  const classificationBarChartRef = useRef(null);
  const significantBarChartRef = useRef(null);
  const goBarChartRef = useRef(null);
  const bubbleChartRef = useRef(null);
  const enrichmentCircleChartRef = useRef(null);

  // 选中的行
  const [selectedClassificationBarRows, setSelectedClassificationBarRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedSignificantBarRows, setSelectedSignificantBarRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedGoBarRows, setSelectedGoBarRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedBubbleRows, setSelectedBubbleRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedCircleRows, setSelectedCircleRows] = useState(['1', '2', '3', '4', '5']);

  // 分类二级柱形图表数据
  const classificationBarTableData = [
    { key: '1', category: '生物过程', term: 'GO:0006915', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', category: '生物过程', term: 'GO:0006954', count: 32, pValue: 0.002, adjPValue: 0.021 },
    { key: '3', category: '分子功能', term: 'GO:0003674', count: 28, pValue: 0.003, adjPValue: 0.028 },
    { key: '4', category: '细胞组分', term: 'GO:0005634', count: 24, pValue: 0.004, adjPValue: 0.034 },
    { key: '5', category: '分子功能', term: 'GO:0005515', count: 21, pValue: 0.005, adjPValue: 0.042 },
  ];

  const classificationBarTableColumns = [
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: 'GO术语', dataIndex: 'term', key: 'term' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // 显著富集柱状图表数据
  const significantBarTableData = [
    { key: '1', term: '凋亡过程', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', term: '免疫反应', count: 32, pValue: 0.002, adjPValue: 0.021 },
    { key: '3', term: '信号传导', count: 28, pValue: 0.003, adjPValue: 0.028 },
    { key: '4', term: '细胞周期', count: 24, pValue: 0.004, adjPValue: 0.034 },
    { key: '5', term: 'DNA修复', count: 21, pValue: 0.005, adjPValue: 0.042 },
  ];

  const significantBarTableColumns = [
    { title: 'GO术语', dataIndex: 'term', key: 'term' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // GO富集条形图表数据
  const goBarTableData = [
    { key: '1', term: '细胞凋亡', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', term: '细胞增殖', count: 32, pValue: 0.002, adjPValue: 0.021 },
    { key: '3', term: '炎症反应', count: 28, pValue: 0.003, adjPValue: 0.028 },
    { key: '4', term: '信号转导', count: 24, pValue: 0.004, adjPValue: 0.034 },
    { key: '5', term: '代谢过程', count: 21, pValue: 0.005, adjPValue: 0.042 },
  ];

  const goBarTableColumns = [
    { title: 'GO术语', dataIndex: 'term', key: 'term' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // 显著富集气泡图表数据
  const bubbleTableData = [
    { key: '1', term: '细胞凋亡', count: 45, pValue: 0.001, adjPValue: 0.012, enrichment: 2.3 },
    { key: '2', term: '免疫反应', count: 32, pValue: 0.002, adjPValue: 0.021, enrichment: 1.8 },
    { key: '3', term: '信号传导', count: 28, pValue: 0.003, adjPValue: 0.028, enrichment: 1.9 },
    { key: '4', term: '细胞周期', count: 24, pValue: 0.004, adjPValue: 0.034, enrichment: 1.6 },
    { key: '5', term: 'DNA修复', count: 21, pValue: 0.005, adjPValue: 0.042, enrichment: 1.7 },
  ];

  const bubbleTableColumns = [
    { title: 'GO术语', dataIndex: 'term', key: 'term' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
    { title: '富集倍数', dataIndex: 'enrichment', key: 'enrichment', sorter: (a, b) => a.enrichment - b.enrichment },
  ];

  // 富集圈图表数据
  const circleTableData = [
    { key: '1', category: '生物过程', term: '细胞凋亡', count: 45, pValue: 0.001, adjPValue: 0.012 },
    { key: '2', category: '分子功能', term: '蛋白结合', count: 32, pValue: 0.002, adjPValue: 0.021 },
    { key: '3', category: '细胞组分', term: '细胞核', count: 28, pValue: 0.003, adjPValue: 0.028 },
    { key: '4', category: '生物过程', term: '细胞周期', count: 24, pValue: 0.004, adjPValue: 0.034 },
    { key: '5', category: '分子功能', term: '酶活性', count: 21, pValue: 0.005, adjPValue: 0.042 },
  ];

  const circleTableColumns = [
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: 'GO术语', dataIndex: 'term', key: 'term' },
    { title: '基因数量', dataIndex: 'count', key: 'count', sorter: (a, b) => a.count - b.count },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
    { title: '调整P值', dataIndex: 'adjPValue', key: 'adjPValue', sorter: (a, b) => a.adjPValue - b.adjPValue },
  ];

  // 更新分类二级柱形图 (D3)
  const updateClassificationBarChart = (selectedKeys) => {
    if (!classificationBarChartRef.current) return;

    // 清空之前的内容
    d3.select(classificationBarChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = classificationBarTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = classificationBarChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(classificationBarChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 按类别分组数据
    const groupedData = d3.groups(selectedData, d => d.category);
    const categories = groupedData.map(d => d[0]);
    const subTerms = selectedData.map(d => d.term);

    // 创建嵌套数据结构
    const nestedData = categories.map(category => {
      const categoryData = selectedData.filter(d => d.category === category);
      return {
        category: category,
        terms: categoryData.map(d => ({
          term: d.term,
          count: d.count,
          pValue: d.pValue,
          adjPValue: d.adjPValue
        }))
      };
    });

    // 计算层级结构
    const x0 = d3.scaleBand()
      .domain(categories)
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(subTerms)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(selectedData, d => d.count)])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(subTerms)
      .range(d3.schemeCategory10);

    // 绘制柱形图
    nestedData.forEach(group => {
      group.terms.forEach(term => {
        const xPosition = x0(group.category);
        const subXPosition = x1(term.term);
        
        svg.append("rect")
          .attr("x", xPosition + subXPosition)
          .attr("y", y(term.count))
          .attr("width", x1.bandwidth())
          .attr("height", height - y(term.count))
          .attr("fill", color(term.term));
      });
    });

    // 添加坐标轴
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("font-size", "12px");

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
      .text("分类二级柱形图");

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    subTerms.forEach((term, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(term));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(term);
    });
  };

  // 更新显著富集柱状图 (D3)
  const updateSignificantBarChart = (selectedKeys) => {
    if (!significantBarChartRef.current) return;

    // 清空之前的内容
    d3.select(significantBarChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = significantBarTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = significantBarChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(significantBarChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.term))
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
      .attr("x", d => x(d.term))
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
      .text("显著富集柱状图");
  };

  // 更新GO富集条形图 (D3)
  const updateGoBarChart = (selectedKeys) => {
    if (!goBarChartRef.current) return;

    // 清空之前的内容
    d3.select(goBarChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = goBarTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = goBarChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(goBarChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Y 轴比例尺 (GO术语)
    const y = d3.scaleBand()
      .domain(selectedData.map(d => d.term))
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
      .attr("y", d => y(d.term))
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
      .text("GO富集条形图");
  };

  // 更新显著富集气泡图 (D3)
  const updateBubbleChart = (selectedKeys) => {
    if (!bubbleChartRef.current) return;

    // 清空之前的内容
    d3.select(bubbleChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = bubbleTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = bubbleChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(bubbleChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X 轴比例尺 (GO术语)
    const x = d3.scaleBand()
      .domain(selectedData.map(d => d.term))
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
      .attr("cx", d => x(d.term) + x.bandwidth() / 2)
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
          .attr('x', x(d.term) + x.bandwidth() / 2 + 10)
          .attr('y', y(d.enrichment) - 60)
          .attr('width', 140)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', x(d.term) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 50)
          .text(d.term)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', x(d.term) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 35)
          .text(`基因数量: ${d.count}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', x(d.term) + x.bandwidth() / 2 + 15)
          .attr('y', y(d.enrichment) - 20)
          .text(`P值: ${d.pValue}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', x(d.term) + x.bandwidth() / 2 + 15)
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
      .text("GO术语");

    // 标题
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("显著富集气泡图");

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
              .text(item.term)
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
          .text(item.term.substring(0, 8) + (item.term.length > 8 ? ".." : ""));
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

  // 初始化分类二级柱形图 - 当 Tab 切换到分类二级柱形图时初始化
  useEffect(() => {
    if (activeTab === 'classification-bar' && classificationBarChartRef.current) {
      updateClassificationBarChart(selectedClassificationBarRows);
      
      // 响应式
      const handleResize = () => updateClassificationBarChart(selectedClassificationBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedClassificationBarRows]);

  // 初始化显著富集柱状图 - 当 Tab 切换到显著富集柱状图时初始化
  useEffect(() => {
    if (activeTab === 'significant-bar' && significantBarChartRef.current) {
      updateSignificantBarChart(selectedSignificantBarRows);
      
      // 响应式
      const handleResize = () => updateSignificantBarChart(selectedSignificantBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedSignificantBarRows]);

  // 初始化GO富集条形图 - 当 Tab 切换到GO富集条形图时初始化
  useEffect(() => {
    if (activeTab === 'go-bar' && goBarChartRef.current) {
      updateGoBarChart(selectedGoBarRows);
      
      // 响应式
      const handleResize = () => updateGoBarChart(selectedGoBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedGoBarRows]);

  // 初始化显著富集气泡图 - 当 Tab 切换到显著富集气泡图时初始化
  useEffect(() => {
    if (activeTab === 'bubble' && bubbleChartRef.current) {
      updateBubbleChart(selectedBubbleRows);
      
      // 响应式
      const handleResize = () => updateBubbleChart(selectedBubbleRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedBubbleRows]);

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

  // 下载处理
  const handleClassificationBarDownload = (selectedRowKeys) => {
    message.success(`正在下载分类二级柱形图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleSignificantBarDownload = (selectedRowKeys) => {
    message.success(`正在下载显著富集柱状图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleGoBarDownload = (selectedRowKeys) => {
    message.success(`正在下载GO富集条形图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleBubbleDownload = (selectedRowKeys) => {
    message.success(`正在下载显著富集气泡图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleCircleDownload = (selectedRowKeys) => {
    message.success(`正在下载富集圈图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleClassificationBarRefresh = () => {
    message.success('已刷新分类二级柱形图数据');
    setSelectedClassificationBarRows(['1', '2', '3', '4', '5']);
  };

  const handleSignificantBarRefresh = () => {
    message.success('已刷新显著富集柱状图数据');
    setSelectedSignificantBarRows(['1', '2', '3', '4', '5']);
  };

  const handleGoBarRefresh = () => {
    message.success('已刷新GO富集条形图数据');
    setSelectedGoBarRows(['1', '2', '3', '4', '5']);
  };

  const handleBubbleRefresh = () => {
    message.success('已刷新显著富集气泡图数据');
    setSelectedBubbleRows(['1', '2', '3', '4', '5']);
  };

  const handleCircleRefresh = () => {
    message.success('已刷新富集圈图数据');
    setSelectedCircleRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'classification-bar',
      label: '分类二级柱形图',
    },
    {
      key: 'significant-bar',
      label: '显著富集柱状图',
    },
    {
      key: 'go-bar',
      label: 'GO富集条形图',
    },
    {
      key: 'bubble',
      label: '显著富集气泡图',
    },
    {
      key: 'circle',
      label: '富集圈图',
    }
  ];

  return (
    <PageTemplate pageTitle="上调差异基因GO富集">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'classification-bar' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={classificationBarChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={classificationBarTableColumns}
          tableData={classificationBarTableData}
          selectedRowKeys={selectedClassificationBarRows}
          onSelectChange={setSelectedClassificationBarRows}
          onDownload={handleClassificationBarDownload}
          onRefresh={handleClassificationBarRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'significant-bar' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={significantBarChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={significantBarTableColumns}
          tableData={significantBarTableData}
          selectedRowKeys={selectedSignificantBarRows}
          onSelectChange={setSelectedSignificantBarRows}
          onDownload={handleSignificantBarDownload}
          onRefresh={handleSignificantBarRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'go-bar' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={goBarChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={goBarTableColumns}
          tableData={goBarTableData}
          selectedRowKeys={selectedGoBarRows}
          onSelectChange={setSelectedGoBarRows}
          onDownload={handleGoBarDownload}
          onRefresh={handleGoBarRefresh}
        />
      </div>

      <div style={{ display: activeTab === 'bubble' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={bubbleChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={bubbleTableColumns}
          tableData={bubbleTableData}
          selectedRowKeys={selectedBubbleRows}
          onSelectChange={setSelectedBubbleRows}
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
    </PageTemplate>
  );
};

export default UpregulatedGOEnrichment;