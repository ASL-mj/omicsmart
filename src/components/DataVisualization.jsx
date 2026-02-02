import { useState } from 'react';
import { Card, Row, Col, Select } from 'antd';
import ReactECharts from 'echarts-for-react';

const { Option } = Select;

const DataVisualization = () => {
  const [chartType, setChartType] = useState('volcano');

  // 火山图数据
  const volcanoOption = {
    title: {
      text: '差异表达火山图',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `基因: ${params.data[3]}<br/>Log2FC: ${params.data[0]}<br/>-Log10(P): ${params.data[1]}`;
      },
    },
    xAxis: {
      name: 'Log2 Fold Change',
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      name: '-Log10(P-Value)',
      nameLocation: 'middle',
      nameGap: 40,
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        data: [
          [2.5, 3.0, 0, 'BRCA1'],
          [-1.8, 2.7, 1, 'TP53'],
          [3.2, 4.0, 0, 'EGFR'],
          [1.9, 2.5, 0, 'MYC'],
          [-2.1, 2.8, 1, 'PTEN'],
          [0.5, 1.2, 2, 'Gene6'],
          [-0.8, 1.5, 2, 'Gene7'],
          [1.2, 2.0, 0, 'Gene8'],
          [-1.5, 2.3, 1, 'Gene9'],
          [2.8, 3.5, 0, 'Gene10'],
        ],
        itemStyle: {
          color: (params) => {
            const logFC = params.data[0];
            const pValue = params.data[1];
            if (pValue > 2 && logFC > 1) return '#cf1322';
            if (pValue > 2 && logFC < -1) return '#3f8600';
            return '#d9d9d9';
          },
        },
      },
    ],
  };

  // 热图数据
  const heatmapOption = {
    title: {
      text: '基因表达热图',
      left: 'center',
    },
    tooltip: {
      position: 'top',
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: ['Sample1', 'Sample2', 'Sample3', 'Sample4', 'Sample5'],
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: ['BRCA1', 'TP53', 'EGFR', 'MYC', 'PTEN'],
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: -2,
      max: 2,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
      },
    },
    series: [
      {
        name: 'Expression',
        type: 'heatmap',
        data: [
          [0, 0, 1.5],
          [0, 1, 1.2],
          [0, 2, -0.8],
          [0, 3, 0.5],
          [0, 4, 1.8],
          [1, 0, -1.2],
          [1, 1, -1.5],
          [1, 2, -0.9],
          [1, 3, -1.1],
          [1, 4, -1.3],
          [2, 0, 2.0],
          [2, 1, 1.8],
          [2, 2, 1.5],
          [2, 3, 1.9],
          [2, 4, 2.1],
          [3, 0, 1.0],
          [3, 1, 0.8],
          [3, 2, 1.2],
          [3, 3, 0.9],
          [3, 4, 1.1],
          [4, 0, -1.8],
          [4, 1, -1.6],
          [4, 2, -1.9],
          [4, 3, -1.7],
          [4, 4, -2.0],
        ],
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 柱状图数据
  const barOption = {
    title: {
      text: 'GO富集分析',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '-Log10(P-Value)',
    },
    yAxis: {
      type: 'category',
      data: ['细胞增殖', '细胞凋亡', 'DNA修复', '信号转导', '代谢过程'],
    },
    series: [
      {
        name: '富集程度',
        type: 'bar',
        data: [4.5, 3.8, 3.2, 2.9, 2.5],
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  };

  // 饼图数据
  const pieOption = {
    title: {
      text: '基因分类统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '基因类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 35, name: '上调基因' },
          { value: 28, name: '下调基因' },
          { value: 15, name: '无显著差异' },
          { value: 12, name: '未分类' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'volcano':
        return <ReactECharts option={volcanoOption} style={{ height: '500px' }} />;
      case 'heatmap':
        return <ReactECharts option={heatmapOption} style={{ height: '500px' }} />;
      case 'bar':
        return <ReactECharts option={barOption} style={{ height: '500px' }} />;
      case 'pie':
        return <ReactECharts option={pieOption} style={{ height: '500px' }} />;
      default:
        return <ReactECharts option={volcanoOption} style={{ height: '500px' }} />;
    }
  };

  return (
    <div>
      <Card title="数据可视化" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>选择图表类型：</span>
          <Select
            value={chartType}
            onChange={setChartType}
            style={{ width: 200 }}
          >
            <Option value="volcano">火山图</Option>
            <Option value="heatmap">热图</Option>
            <Option value="bar">柱状图</Option>
            <Option value="pie">饼图</Option>
          </Select>
        </div>
        {renderChart()}
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="箱线图">
            <ReactECharts
              option={{
                title: {
                  text: '基因表达分布',
                  left: 'center',
                },
                tooltip: {
                  trigger: 'item',
                },
                xAxis: {
                  type: 'category',
                  data: ['对照组', '处理组1', '处理组2'],
                },
                yAxis: {
                  type: 'value',
                  name: '表达量',
                },
                series: [
                  {
                    name: 'boxplot',
                    type: 'boxplot',
                    data: [
                      [1, 2, 3, 4, 5],
                      [2, 3, 4, 5, 6],
                      [3, 4, 5, 6, 7],
                    ],
                  },
                ],
              }}
              style={{ height: '300px' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="散点图">
            <ReactECharts
              option={{
                title: {
                  text: '样本相关性分析',
                  left: 'center',
                },
                tooltip: {
                  trigger: 'item',
                },
                xAxis: {
                  name: 'Sample 1',
                },
                yAxis: {
                  name: 'Sample 2',
                },
                series: [
                  {
                    type: 'scatter',
                    data: [
                      [10, 12],
                      [15, 18],
                      [20, 22],
                      [25, 28],
                      [30, 32],
                      [35, 38],
                      [40, 42],
                    ],
                    symbolSize: 10,
                    itemStyle: {
                      color: '#5470c6',
                    },
                  },
                ],
              }}
              style={{ height: '300px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataVisualization;