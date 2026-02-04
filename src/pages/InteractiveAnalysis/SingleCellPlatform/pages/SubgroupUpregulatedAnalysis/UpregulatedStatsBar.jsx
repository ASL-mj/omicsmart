import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const UpregulatedStatsBar = () => {
  const [activeTab, setActiveTab] = useState('bar-chart');
  const barChartRef = useRef(null);

  // 选中的行
  const [selectedBarRows, setSelectedBarRows] = useState(['1', '2', '3', '4', '5', '6']);

  // 柱形图表数据
  const barTableData = [
    { key: '1', cluster: 'Cluster_0', upGenes: 125, downGenes: 85, total: 210 },
    { key: '2', cluster: 'Cluster_1', upGenes: 98, downGenes: 65, total: 163 },
    { key: '3', cluster: 'Cluster_2', upGenes: 156, downGenes: 110, total: 266 },
    { key: '4', cluster: 'Cluster_3', upGenes: 78, downGenes: 54, total: 132 },
    { key: '5', cluster: 'Cluster_4', upGenes: 201, downGenes: 145, total: 346 },
    { key: '6', cluster: 'Cluster_5', upGenes: 142, downGenes: 98, total: 240 },
  ];

  const barTableColumns = [
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '上调基因数', dataIndex: 'upGenes', key: 'upGenes', sorter: (a, b) => a.upGenes - b.upGenes },
    { title: '下调基因数', dataIndex: 'downGenes', key: 'downGenes', sorter: (a, b) => a.downGenes - b.downGenes },
    { title: '总数', dataIndex: 'total', key: 'total', sorter: (a, b) => a.total - b.total },
  ];

  // 更新柱形图 (D3)
  const updateBarChart = (selectedKeys) => {
    if (!barChartRef.current) return;

    // 清空之前的内容
    d3.select(barChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = barTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = barChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 准备数据
    const keys = ['upGenes', 'downGenes'];
    const colors = ['#5470c6', '#fac858'];
    
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
      .style('font-size', '12px')
      .attr('angle', -45)
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

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
      .text('基因数量');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('亚群上调统计柱形图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    const legendItems = ['上调基因', '下调基因'];
    
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

  // 初始化柱形图 - 当 Tab 切换到柱形图时初始化
  useEffect(() => {
    if (activeTab === 'bar-chart' && barChartRef.current) {
      updateBarChart(selectedBarRows);
      
      // 响应式
      const handleResize = () => updateBarChart(selectedBarRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedBarRows]);

  // 下载处理
  const handleBarDownload = (selectedRowKeys) => {
    message.success(`正在下载柱形图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleBarRefresh = () => {
    message.success('已刷新柱形图数据');
    setSelectedBarRows(['1', '2', '3', '4', '5', '6']);
  };

  const tabItems = [
    {
      key: 'bar-chart',
      label: '柱形图',
    }
  ];

  return (
    <PageTemplate pageTitle="亚群上调统计柱形图">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'bar-chart' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={barChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={barTableColumns}
          tableData={barTableData}
          selectedRowKeys={selectedBarRows}
          onSelectChange={setSelectedBarRows}
          onDownload={handleBarDownload}
          onRefresh={handleBarRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default UpregulatedStatsBar;