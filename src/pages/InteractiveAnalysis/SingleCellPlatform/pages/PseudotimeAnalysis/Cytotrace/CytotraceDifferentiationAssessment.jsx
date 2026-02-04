import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const CytotraceDifferentiationAssessment = () => {
  const [activeTab, setActiveTab] = useState('boxplot');
  const boxplotChartRef = useRef(null);

  // 选中的行
  const [selectedBoxplotRows, setSelectedBoxplotRows] = useState(['1', '2', '3', '4', '5']);

  // 盒型图表数据
  const boxplotTableData = [
    { key: '1', gene: 'GENE_001', group_a: 1.2, group_b: 2.3, group_c: 3.1, mean: 2.2, std: 0.5 },
    { key: '2', gene: 'GENE_002', group_a: 2.1, group_b: 1.8, group_c: 1.5, mean: 1.8, std: 0.4 },
    { key: '3', gene: 'GENE_003', group_a: 0.8, group_b: 1.9, group_c: 2.7, mean: 1.8, std: 0.6 },
    { key: '4', gene: 'GENE_004', group_a: 2.5, group_b: 2.1, group_c: 1.6, mean: 2.1, std: 0.3 },
    { key: '5', gene: 'GENE_005', group_a: 1.0, group_b: 1.7, group_c: 2.8, mean: 1.8, std: 0.7 },
  ];

  const boxplotTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '组A', dataIndex: 'group_a', key: 'group_a', sorter: (a, b) => a.group_a - b.group_a },
    { title: '组B', dataIndex: 'group_b', key: 'group_b', sorter: (a, b) => a.group_b - b.group_b },
    { title: '组C', dataIndex: 'group_c', key: 'group_c', sorter: (a, b) => a.group_c - b.group_c },
    { title: '均值', dataIndex: 'mean', key: 'mean', sorter: (a, b) => a.mean - b.mean },
    { title: '标准差', dataIndex: 'std', key: 'std', sorter: (a, b) => a.std - b.std },
  ];

  // 更新盒型图 (D3)
  const updateBoxplotChart = (selectedKeys) => {
    if (!boxplotChartRef.current) return;

    // 清空之前的内容
    d3.select(boxplotChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = boxplotTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = boxplotChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(boxplotChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义组别
    const groups = ['group_a', 'group_b', 'group_c'];
    const groupNames = ['组A', '组B', '组C'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      groups.forEach(g => allValues.push(d[g]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // X 轴比例尺 (基因)
    const xScale = d3.scaleBand()
      .domain(selectedData.map(d => d.gene))
      .range([0, width])
      .padding(0.1);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([minVal - 0.5, maxVal + 0.5])
      .range([height, 0]);

    // 颜色比例尺
    const colorScale = d3.scaleOrdinal()
      .domain(groupNames)
      .range(d3.schemeCategory10.slice(0, 3));

    // 计算每个基因在每个组别的表达量分布
    selectedData.forEach((d) => {
      const geneX = xScale(d.gene) + xScale.bandwidth() / 3;
      
      groups.forEach((group, j) => {
        const value = d[group];
        const yPos = yScale(value);
        
        // 绘制垂直线表示表达量
        svg.append('line')
          .attr('x1', geneX + j * (xScale.bandwidth() / 3))
          .attr('x2', geneX + j * (xScale.bandwidth() / 3))
          .attr('y1', yScale(maxVal)) // 从底部开始
          .attr('y2', yPos)
          .attr('stroke', colorScale(groupNames[j]))
          .attr('stroke-width', 2);
        
        // 绘制点表示表达量
        svg.append('circle')
          .attr('cx', geneX + j * (xScale.bandwidth() / 3))
          .attr('cy', yPos)
          .attr('r', 5)
          .attr('fill', colorScale(groupNames[j]))
          .attr('opacity', 0.7)
          .on('mouseover', function() {
            d3.select(this).attr('opacity', 1);
            
            // 显示提示信息
            const tooltip = svg.append('g')
              .attr('class', 'tooltip')
              .attr('pointer-events', 'none');
              
            tooltip.append('rect')
              .attr('x', geneX + j * (xScale.bandwidth() / 3) + 10)
              .attr('y', yPos - 40)
              .attr('width', 150)
              .attr('height', 60)
              .attr('fill', 'white')
              .attr('stroke', 'black')
              .attr('stroke-width', 1)
              .attr('rx', 5)
              .attr('ry', 5);
              
            tooltip.append('text')
              .attr('x', geneX + j * (xScale.bandwidth() / 3) + 15)
              .attr('y', yPos - 30)
              .text(d.gene)
              .style('font-size', '12px')
              .style('font-weight', 'bold');
              
            tooltip.append('text')
              .attr('x', geneX + j * (xScale.bandwidth() / 3) + 15)
              .attr('y', yPos - 15)
              .text(`${groupNames[j]}: ${value}`)
              .style('font-size', '12px');
              
            tooltip.append('text')
              .attr('x', geneX + j * (xScale.bandwidth() / 3) + 15)
              .attr('y', yPos)
              .text(`组别: ${groupNames[j]}`)
              .style('font-size', '12px');
          })
          .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.7);
            svg.selectAll('.tooltip').remove();
          });
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
      .text('盒型图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    groupNames.forEach((group, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(group));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(group);
    });
  };

  // 初始化盒型图 - 当 Tab 切换到盒型图时初始化
  useEffect(() => {
    if (activeTab === 'boxplot' && boxplotChartRef.current) {
      updateBoxplotChart(selectedBoxplotRows);
      
      // 响应式
      const handleResize = () => updateBoxplotChart(selectedBoxplotRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedBoxplotRows]);

  // 下载处理
  const handleBoxplotDownload = (selectedRowKeys) => {
    message.success(`正在下载盒型图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleBoxplotRefresh = () => {
    message.success('已刷新盒型图数据');
    setSelectedBoxplotRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'boxplot',
      label: '盒型图',
    }
  ];

  return (
    <PageTemplate pageTitle="分化评估">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'boxplot' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={boxplotChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={boxplotTableColumns}
          tableData={boxplotTableData}
          selectedRowKeys={selectedBoxplotRows}
          onSelectChange={setSelectedBoxplotRows}
          onDownload={handleBoxplotDownload}
          onRefresh={handleBoxplotRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default CytotraceDifferentiationAssessment;