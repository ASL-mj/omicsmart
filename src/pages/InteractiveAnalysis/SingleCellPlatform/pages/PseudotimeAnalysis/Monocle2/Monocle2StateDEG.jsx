import { useEffect, useRef, useState } from 'react';
import PageTemplate from '../../../components/PageTemplate/index.jsx';
import ResultPageTemplate from '../../../components/ResultPageTemplate/index.jsx';
import { message, Tabs } from 'antd';
import * as d3 from 'd3';

const Monocle2StateDEG = () => {
  const [activeTab, setActiveTab] = useState('trajectory');
  const trajectoryChartRef = useRef(null);
  const boxplotChartRef = useRef(null);
  const heatmapChartRef = useRef(null);

  // 选中的行
  const [selectedTrajectoryRows, setSelectedTrajectoryRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedBoxplotRows, setSelectedBoxplotRows] = useState(['1', '2', '3', '4', '5']);
  const [selectedHeatmapRows, setSelectedHeatmapRows] = useState(['1', '2', '3', '4', '5']);

  // 细胞轨迹图表数据
  const trajectoryTableData = [
    { key: '1', gene: 'GENE_001', expression: 2.3, state: 'Early', cell: 'Cell_001', score: 0.2 },
    { key: '2', gene: 'GENE_002', expression: 1.8, state: 'Mid', cell: 'Cell_002', score: 0.5 },
    { key: '3', gene: 'GENE_003', expression: 3.1, state: 'Late', cell: 'Cell_003', score: 0.8 },
    { key: '4', gene: 'GENE_004', expression: 2.7, state: 'Early', cell: 'Cell_004', score: 0.3 },
    { key: '5', gene: 'GENE_005', expression: 1.9, state: 'Mid', cell: 'Cell_005', score: 0.6 },
  ];

  const trajectoryTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '表达量', dataIndex: 'expression', key: 'expression', sorter: (a, b) => a.expression - b.expression },
    { title: '分化状态', dataIndex: 'state', key: 'state' },
    { title: '细胞', dataIndex: 'cell', key: 'cell' },
    { title: '分化得分', dataIndex: 'score', key: 'score', sorter: (a, b) => a.score - b.score },
  ];

  // 盒型图表数据
  const boxplotTableData = [
    { key: '1', gene: 'GENE_001', early: 1.2, mid: 2.3, late: 3.1, mean: 2.2 },
    { key: '2', gene: 'GENE_002', early: 2.1, mid: 1.8, late: 1.5, mean: 1.8 },
    { key: '3', gene: 'GENE_003', early: 0.8, mid: 1.9, late: 2.7, mean: 1.8 },
    { key: '4', gene: 'GENE_004', early: 2.5, mid: 2.1, late: 1.6, mean: 2.1 },
    { key: '5', gene: 'GENE_005', early: 1.0, mid: 1.7, late: 2.8, mean: 1.8 },
  ];

  const boxplotTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '早期', dataIndex: 'early', key: 'early', sorter: (a, b) => a.early - b.early },
    { title: '中期', dataIndex: 'mid', key: 'mid', sorter: (a, b) => a.mid - b.mid },
    { title: '晚期', dataIndex: 'late', key: 'late', sorter: (a, b) => a.late - b.late },
    { title: '均值', dataIndex: 'mean', key: 'mean', sorter: (a, b) => a.mean - b.mean },
  ];

  // 热图表数据
  const heatmapTableData = [
    { key: '1', gene: 'GENE_001', early_expr: 1.2, mid_expr: 1.8, late_expr: 2.4, early_var: 0.1, mid_var: 0.2, late_var: 0.3 },
    { key: '2', gene: 'GENE_002', early_expr: 2.1, mid_expr: 1.9, late_expr: 1.7, early_var: 0.2, mid_var: 0.1, late_var: 0.15 },
    { key: '3', gene: 'GENE_003', early_expr: 0.8, mid_expr: 1.2, late_expr: 1.8, early_var: 0.15, mid_var: 0.18, late_var: 0.2 },
    { key: '4', gene: 'GENE_004', early_expr: 2.5, mid_expr: 2.3, late_expr: 2.0, early_var: 0.12, mid_var: 0.15, late_var: 0.18 },
    { key: '5', gene: 'GENE_005', early_expr: 1.0, mid_expr: 1.4, late_expr: 1.9, early_var: 0.1, mid_var: 0.12, late_var: 0.15 },
  ];

  const heatmapTableColumns = [
    { title: '基因', dataIndex: 'gene', key: 'gene' },
    { title: '早期表达', dataIndex: 'early_expr', key: 'early_expr', sorter: (a, b) => a.early_expr - b.early_expr },
    { title: '中期表达', dataIndex: 'mid_expr', key: 'mid_expr', sorter: (a, b) => a.mid_expr - b.mid_expr },
    { title: '晚期表达', dataIndex: 'late_expr', key: 'late_expr', sorter: (a, b) => a.late_expr - b.late_expr },
    { title: '早期方差', dataIndex: 'early_var', key: 'early_var', sorter: (a, b) => a.early_var - b.early_var },
    { title: '中期方差', dataIndex: 'mid_var', key: 'mid_var', sorter: (a, b) => a.mid_var - b.mid_var },
    { title: '晚期方差', dataIndex: 'late_var', key: 'late_var', sorter: (a, b) => a.late_var - b.late_var },
  ];

  // 更新细胞轨迹图 (D3)
  const updateTrajectoryChart = (selectedKeys) => {
    if (!trajectoryChartRef.current) return;

    // 清空之前的内容
    d3.select(trajectoryChartRef.current).selectAll('*').remove();

    // 根据选中的行过滤数据
    const selectedData = trajectoryTableData.filter(item => selectedKeys.includes(item.key));
    
    if (selectedData.length === 0) return;

    // 设置尺寸和边距
    const margin = { top: 60, right: 120, bottom: 50, left: 60 };
    const width = trajectoryChartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // 创建 SVG
    const svg = d3.select(trajectoryChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算坐标范围
    const scoreMin = d3.min(selectedData, d => d.score);
    const scoreMax = d3.max(selectedData, d => d.score);
    const expressionMin = d3.min(selectedData, d => d.expression);
    const expressionMax = d3.max(selectedData, d => d.expression);
    
    // X 轴比例尺 (分化得分)
    const xScale = d3.scaleLinear()
      .domain([scoreMin - 0.05, scoreMax + 0.05])
      .range([0, width]);

    // Y 轴比例尺 (表达量)
    const yScale = d3.scaleLinear()
      .domain([expressionMin - 0.5, expressionMax + 0.5])
      .range([height, 0]);

    // 分化状态颜色比例尺
    const states = [...new Set(selectedData.map(d => d.state))];
    const colorScale = d3.scaleOrdinal()
      .domain(states)
      .range(d3.schemeCategory10.slice(0, states.length));

    // 绘制散点图
    svg.append('g')
      .selectAll('circle')
      .data(selectedData)
      .join('circle')
      .attr('cx', d => xScale(d.score))
      .attr('cy', d => yScale(d.expression))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.state))
      .attr('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        
        // 显示提示信息
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('pointer-events', 'none');
          
        tooltip.append('rect')
          .attr('x', xScale(d.score) + 10)
          .attr('y', yScale(d.expression) - 50)
          .attr('width', 150)
          .attr('height', 70)
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('rx', 5)
          .attr('ry', 5);
          
        tooltip.append('text')
          .attr('x', xScale(d.score) + 15)
          .attr('y', yScale(d.expression) - 40)
          .text(d.gene)
          .style('font-size', '12px')
          .style('font-weight', 'bold');
          
        tooltip.append('text')
          .attr('x', xScale(d.score) + 15)
          .attr('y', yScale(d.expression) - 25)
          .text(`表达量: ${d.expression}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.score) + 15)
          .attr('y', yScale(d.expression) - 10)
          .text(`分化状态: ${d.state}`)
          .style('font-size', '12px');
          
        tooltip.append('text')
          .attr('x', xScale(d.score) + 15)
          .attr('y', yScale(d.expression) + 5)
          .text(`分化得分: ${d.score}`)
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
      .text('表达量');

    // X 轴标签
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('分化得分');

    // 标题
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('细胞轨迹图');

    // 图例
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    states.forEach((state, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(state));

      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '12px')
        .text(state);
    });
  };

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

    // 定义状态
    const states = ['early', 'mid', 'late'];
    const stateNames = ['早期', '中期', '晚期'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      states.forEach(s => allValues.push(d[s]));
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
      .domain(stateNames)
      .range(d3.schemeCategory10.slice(0, 3));

    // 计算每个基因在每个状态下的表达量分布
    selectedData.forEach((d, i) => {
      const geneX = xScale(d.gene) + xScale.bandwidth() / 3;
      
      states.forEach((state, j) => {
        const value = d[state];
        const yPos = yScale(value);
        
        // 绘制垂直线表示表达量
        svg.append('line')
          .attr('x1', geneX + j * (xScale.bandwidth() / 3))
          .attr('x2', geneX + j * (xScale.bandwidth() / 3))
          .attr('y1', yScale(maxVal)) // 从底部开始
          .attr('y2', yPos)
          .attr('stroke', colorScale(stateNames[j]))
          .attr('stroke-width', 2);
        
        // 绘制点表示表达量
        svg.append('circle')
          .attr('cx', geneX + j * (xScale.bandwidth() / 3))
          .attr('cy', yPos)
          .attr('r', 5)
          .attr('fill', colorScale(stateNames[j]))
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
              .text(`${stateNames[j]}: ${value}`)
              .style('font-size', '12px');
              
            tooltip.append('text')
              .attr('x', geneX + j * (xScale.bandwidth() / 3) + 15)
              .attr('y', yPos)
              .text(`状态: ${stateNames[j]}`)
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

    stateNames.forEach((state, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(state));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(state);
    });
  };

  // 更新热图 (D3)
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

    // 定义状态
    const states = ['early_expr', 'mid_expr', 'late_expr'];
    const stateNames = ['早期表达', '中期表达', '晚期表达'];
    
    // 计算表达量范围
    const allValues = [];
    selectedData.forEach(d => {
      states.forEach(s => allValues.push(d[s]));
    });
    
    const minVal = d3.min(allValues);
    const maxVal = d3.max(allValues);
    
    // 创建颜色比例尺
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRdYlBu);

    // 计算单元格尺寸
    const cellWidth = width / states.length;
    const cellHeight = height / selectedData.length;

    // 绘制热图矩阵
    selectedData.forEach((d, i) => {
      states.forEach((s, j) => {
        const value = d[s];
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

    // 添加列标签 (状态)
    states.forEach((s, j) => {
      svg.append('text')
        .attr('x', j * cellWidth + cellWidth / 2)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(stateNames[j]);
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
      .text('热图');

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

  // 初始化细胞轨迹图 - 当 Tab 切换到细胞轨迹图时初始化
  useEffect(() => {
    if (activeTab === 'trajectory' && trajectoryChartRef.current) {
      updateTrajectoryChart(selectedTrajectoryRows);
      
      // 响应式
      const handleResize = () => updateTrajectoryChart(selectedTrajectoryRows);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, selectedTrajectoryRows]);

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

  // 初始化热图 - 当 Tab 切换到热图时初始化
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
  const handleTrajectoryDownload = (selectedRowKeys) => {
    message.success(`正在下载细胞轨迹图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleBoxplotDownload = (selectedRowKeys) => {
    message.success(`正在下载盒型图的 ${selectedRowKeys.length} 条数据`);
  };

  const handleHeatmapDownload = (selectedRowKeys) => {
    message.success(`正在下载热图的 ${selectedRowKeys.length} 条数据`);
  };

  // 刷新处理
  const handleTrajectoryRefresh = () => {
    message.success('已刷新细胞轨迹图数据');
    setSelectedTrajectoryRows(['1', '2', '3', '4', '5']);
  };

  const handleBoxplotRefresh = () => {
    message.success('已刷新盒型图数据');
    setSelectedBoxplotRows(['1', '2', '3', '4', '5']);
  };

  const handleHeatmapRefresh = () => {
    message.success('已刷新热图数据');
    setSelectedHeatmapRows(['1', '2', '3', '4', '5']);
  };

  const tabItems = [
    {
      key: 'trajectory',
      label: '细胞轨迹图',
    },
    {
      key: 'boxplot',
      label: '盒型图',
    },
    {
      key: 'heatmap',
      label: '热图',
    }
  ];

  return (
    <PageTemplate pageTitle="分化状态差异基因">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 16 }}
      />

      <div style={{ display: activeTab === 'trajectory' ? 'block' : 'none' }}>
        <ResultPageTemplate 
          chartContent={
            <div 
              ref={trajectoryChartRef}
              style={{ 
                width: '100%',
                height: '500px',
                background: '#fff',
                borderRadius: 4,
              }}
            />
          }
          tableColumns={trajectoryTableColumns}
          tableData={trajectoryTableData}
          selectedRowKeys={selectedTrajectoryRows}
          onSelectChange={setSelectedTrajectoryRows}
          onDownload={handleTrajectoryDownload}
          onRefresh={handleTrajectoryRefresh}
        />
      </div>

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

export default Monocle2StateDEG;