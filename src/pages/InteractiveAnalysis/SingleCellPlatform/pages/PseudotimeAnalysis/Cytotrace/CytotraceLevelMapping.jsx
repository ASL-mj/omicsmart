import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const CytotraceLevelMapping = () => {
  const [activeTab, setActiveTab] = useState('dimensionality');
  const dimensionalityChartRef = useRef(null);

  // 选中的行
  const [selectedDimensionalityRows, setSelectedDimensionalityRows] = useState(['1', '2', '3', '4', '5']);

  // 分化水平降维图表数据
  const dimensionalityTableData = [
    { key: '1', cell: 'Cell_001', x: 2.3, y: 1.8, differentiation_level: 0.23, cluster: 'Cluster_1', state: 'State_1' },
    { key: '2', cell: 'Cell_002', x: -1.2, y: 0.5, differentiation_level: 0.45, cluster: 'Cluster_2', state: 'State_2' },
    { key: '3', cell: 'Cell_003', x: 0.8, y: -2.1, differentiation_level: 0.67, cluster: 'Cluster_2', state: 'State_2' },
    { key: '4', cell: 'Cell_004', x: 1.5, y: 0.9, differentiation_level: 0.82, cluster: 'Cluster_3', state: 'State_3' },
    { key: '5', cell: 'Cell_005', x: -0.7, y: 1.6, differentiation_level: 0.35, cluster: 'Cluster_1', state: 'State_1' },
  ];

  const dimensionalityTableColumns = [
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: 'X坐标', dataIndex: 'x', key: 'x', sorter: (a, b) => a.x - b.x },
    { title: 'Y坐标', dataIndex: 'y', key: 'y', sorter: (a, b) => a.y - b.y },
    { title: '分化水平', dataIndex: 'differentiation_level', key: 'differentiation_level', sorter: (a, b) => a.differentiation_level - b.differentiation_level },
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '状态', dataIndex: 'state', key: 'state' },
  ];

  // 更新分化水平降维图 (D3)
  const updateDimensionalityChart = (selectedKeys) => {
    if (!dimensionalityChartRef.current) return;

    // 清空之前的内容
    d3.select(dimensionalityChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = dimensionalityTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = dimensionalityChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(dimensionalityChartRef.current)
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
    const levelMin = d3.min(selectedData, d => d.differentiation_level);
    const levelMax = d3.max(selectedData, d => d.differentiation_level);
    
    // X 轴比例尺
    const xScale = d3.scaleLinear()
      .domain([xMin - 0.5, xMax + 0.5])
      .range([0, width]);

    // Y 轴比例尺
    const yScale = d3.scaleLinear()
      .domain([yMin - 0.5, yMax + 0.5])
      .range([height, 0]);

    // 分化水平颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([levelMin, levelMax])
      .interpolator(d3.interpolatePlasma);

    // 亚群颜色比例尺
    const clusters = [...new Set(selectedData.map(d => d.cluster))];
    const clusterColorScale = d3.scaleOrdinal()
      .domain(clusters)
      .range(d3.schemeCategory10.slice(0, clusters.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.differentiation_level))
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
          .attr('height', 80)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 40)
          .text(d.cell)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 25)
          .text(`分化水平: ${d.differentiation_level}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) - 10)
          .text(`亚群: ${d.cluster}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 5)
          .text(`状态: ${d.state}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.x) + 15)
          .attr('y', yScale(d.y) + 20)
          .text(`坐标: (${d.x}, ${d.y})`)
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
      .text('Y坐标');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('X坐标');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('分化水平降维图');

    // 颜色图例 (分化水平)
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(levelMin, levelMax, (levelMax - levelMin) / 50).reverse();
    
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
      .text(levelMax.toFixed(2));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(levelMin.toFixed(2));

    // 亚群图例
    const clusterLegend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 150)`);

    clusters.forEach((cluster, i) => {
      const legendRow = clusterLegend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', clusterColorScale(cluster));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(cluster);
    });
  };

  // 初始化分化水平降维图 - 当 Tab 切换到分化水平降维图时初始化
  useEffect(() => {
    if (activeTab === 'dimensionality' && dimensionalityChartRef.current) {
      updateDimensionalityChart(selectedDimensionalityRows);
      
      // 响应式
      const handleResize = () => updateDimensionalityChart(selectedDimensionalityRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedDimensionalityRows]);

  // 下载处理
  const handleDimensionalityDownload = (selectedRowKeys) => {
    message.success(`正在下载分化水平降维图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleDimensionalityRefresh = () => {
    message.success('已刷新分化水平降维图数据');
    setSelectedDimensionalityRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'dimensionality',
      label: '分化水平降维图',
    }
  ];

  return (
    <PageTemplate pageTitle="分化水平映射图">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'dimensionality' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={dimensionalityChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={dimensionalityTableColumns}
          tableData={dimensionalityTableData}
          selectedRowKeys={selectedDimensionalityRows}
          onSelectChange={setSelectedDimensionalityRows}
          onDownload={handleDimensionalityDownload}
          onRefresh={handleDimensionalityRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default CytotraceLevelMapping;