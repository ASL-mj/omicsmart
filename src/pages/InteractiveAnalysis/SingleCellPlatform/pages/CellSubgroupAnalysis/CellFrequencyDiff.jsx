import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const CellFrequencyDiff = () => {
  const [activeTab, setActiveTab] = useState('boxplot');
  const boxplotChartRef = useRef(null);
  const heatmapChartRef = useRef(null);

  // 选中的行
  const [selectedBoxplotRows, setSelectedBoxplotRows] = useState(['1', '2', '3']);
  const [selectedHeatmapRows, setSelectedHeatmapRows] = useState(['1', '2', '3']);

  // 差异箱型图表格数据
  const boxplotTableData = [
    { key: '1', cluster: 'Cluster_0', sample1: 245, sample2: 312, pValue: 0.023 },
    { key: '2', cluster: 'Cluster_1', sample1: 189, sample2: 156, pValue: 0.045 },
    { key: '3', cluster: 'Cluster_2', sample1: 423, sample2: 398, pValue: 0.156 },
  ];

  const boxplotTableColumns = [
    { title: '亚群', dataIndex: 'cluster', key: 'cluster' },
    { title: '样本1细胞数', dataIndex: 'sample1', key: 'sample1', sorter: (a, b) => a.sample1 - b.sample1 },
    { title: '样本2细胞数', dataIndex: 'sample2', key: 'sample2', sorter: (a, b) => a.sample2 - b.sample2 },
    { title: 'P值', dataIndex: 'pValue', key: 'pValue', sorter: (a, b) => a.pValue - b.pValue },
  ];

  // Ro/E热图表数据
  const heatmapTableData = [
    { key: '1', gene: 'GENE_001', sample1: 2.3, sample2: 1.8, roe: 1.28 },
    { key: '2', gene: 'GENE_002', sample1: 3.1, sample2: 2.9, roe: 1.07 },
    { key: '3', gene: 'GENE_003', sample1: 1.5, sample2: 2.4, roe: 0.63 },
  ];

  const heatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '样本1表达', dataIndex: 'sample1', key: 'sample1', sorter: (a, b) => a.sample1 - b.sample1 },
    { title: '样本2表达', dataIndex: 'sample2', key: 'sample2', sorter: (a, b) => a.sample2 - b.sample2 },
    { title: 'Ro/E值', dataIndex: 'roe', key: 'roe', sorter: (a, b) => a.roe - b.roe },
  ];

  // 更新差异箱型图 (D3)
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

    // 准备数据
    const clusters = selectedData.map(d => d.cluster);
    const colors = ['#5470c6', '#91cc75'];

    // X 轴比例尺
    const x = d3.scaleBand()
      .domain(clusters)
      .range([0, width])
      .padding(0.1);

    // Y 轴比例尺
    const maxValue = d3.max(selectedData, d => Math.max(d.sample1, d.sample2));
    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([height, 0]);

    // 绘制箱型图的简化版 - 用柱状图代替
    const g = svg.append('g');
    
    selectedData.forEach((d) => {
      const barWidth = x.bandwidth() / 2;
      const xPosition = x(d.cluster);
      
      // 第一个样本
      g.append('rect')
        .attr('x', xPosition)
        .attr('y', y(d.sample1))
        .attr('width', barWidth)
        .attr('height', height - y(d.sample1))
        .attr('fill', colors[0])
        .attr('opacity', 0.7);

      // 第二个样本
      g.append('rect')
        .attr('x', xPosition + barWidth)
        .attr('y', y(d.sample2))
        .attr('width', barWidth)
        .attr('height', height - y(d.sample2))
        .attr('fill', colors[1])
        .attr('opacity', 0.7);
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
      .style('font-weight', 'bold')
      .text('细胞数');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('差异箱型图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 10)`);

    const legendItems = ['样本1', '样本2'];
    
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

  // 更新 Ro/E 热图 (D3)
  const updateHeatmapChart = (selectedKeys) => {
    if (!heatmapChartRef.current) return;

    // 清空之前的内容
    d3.select(heatmapChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = heatmapTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = heatmapChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(heatmapChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 准备数据
    const genes = selectedData.map(d => d.gene);
    const samples = ['样本1', '样本2', 'Ro/E'];

    // 计算矩阵尺寸
    const cellWidth = width / samples.length;
    const cellHeight = height / genes.length;

    // 创建颜色映射
    const colorScale = d3.scaleSequential()
      .domain(d3.extent([...selectedData.map(d => d.sample1), ...selectedData.map(d => d.sample2), ...selectedData.map(d => d.roe)]))
      .interpolator(d3.interpolateRdYlGn);

    // 绘制热图矩形
    selectedData.forEach((d, i) => {
      // 样本1
      svg.append('rect')
        .attr('x', 0)
        .attr('y', i * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', colorScale(d.sample1))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

      // 样本2
      svg.append('rect')
        .attr('x', cellWidth)
        .attr('y', i * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', colorScale(d.sample2))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

      // Ro/E
      svg.append('rect')
        .attr('x', cellWidth * 2)
        .attr('y', i * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', colorScale(d.roe))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    });

    // 添加文本标签
    selectedData.forEach((d, i) => {
      // 基因标签
      svg.append('text')
        .attr('x', -10)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .text(d.gene);

      // 样本1数值
      svg.append('text')
        .attr('x', cellWidth / 2)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d.sample1.toFixed(2));

      // 样本2数值
      svg.append('text')
        .attr('x', cellWidth + cellWidth / 2)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d.sample2.toFixed(2));

      // Ro/E数值
      svg.append('text')
        .attr('x', cellWidth * 2 + cellWidth / 2)
        .attr('y', i * cellHeight + cellHeight / 2)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d.roe.toFixed(2));
    });

    // 添加列标签
    samples.forEach((sample, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(sample);
    });

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Ro/E热图');

    // 颜色图例
    const legendWidth = 20;
    const legendHeight = 10;
    const values = d3.range(0, 1, 0.1).reverse();
    
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width + 20}, 50)`);

    values.forEach((val, idx) => {
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', idx * legendHeight)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .attr('fill', colorScale(d3.scaleLinear()
          .domain(d3.extent([...selectedData.map(d => d.sample1), ...selectedData.map(d => d.sample2), ...selectedData.map(d => d.roe)]))
          .range([0, 1])(val)));
    });

    // 颜色图例标签
    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', 0)
      .style('font-size', '10px')
      .text(d3.max([...selectedData.map(d => d.sample1), ...selectedData.map(d => d.sample2), ...selectedData.map(d => d.roe)]).toFixed(2));

    legendGroup.append('text')
      .attr('x', legendWidth + 5)
      .attr('y', values.length * legendHeight)
      .style('font-size', '10px')
      .text(d3.min([...selectedData.map(d => d.sample1), ...selectedData.map(d => d.sample2), ...selectedData.map(d => d.roe)]).toFixed(2));
  };

  // 初始化差异箱型图 - 当 Tab 切换到差异箱型图时初始化
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

  // 初始化 Ro/E 热图 - 当 Tab 切换到热图时初始化
  useEffect(() => {
    if (activeTab === 'heatmap' && heatmapChartRef.current) {
      updateHeatmapChart(selectedHeatmapRows);
      
      // 响应式
      const handleResize = () => updateHeatmapChart(selectedHeatmapRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedHeatmapRows]);

  // 下载处理
  const handleBoxplotDownload = (selectedRowKeys) => {
    message.success(`正在下载差异箱型图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载 Ro/E 热图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleBoxplotRefresh = () => {
    message.success('已刷新差异箱型图数据');
    setSelectedBoxplotRows(['1', '2', '3']);
  };

  const handleHeatmapRefresh = () => {
    message.success('已刷新 Ro/E 热图数据');
    setSelectedHeatmapRows(['1', '2', '3']);
  };

  const tabItems = [
    {
      key: 'boxplot',
      label: '差异箱型图',
    },
    {
      key: 'heatmap',
      label: 'Ro/E热图',
    }
  ];

  return (
    <PageTemplate pageTitle="细胞频率差异">
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

      <div style={{ display: activeTab === 'heatmap' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={heatmapChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={heatmapTableColumns}
          tableData={heatmapTableData}
          selectedRowKeys={selectedHeatmapRows}
          onSelectChange={setSelectedHeatmapRows}
          onDownload={handleHeatmapDownload}
          onRefresh={handleHeatmapRefresh}
        />
      </div>
    </PageTemplate>
  );
};

export default CellFrequencyDiff;
