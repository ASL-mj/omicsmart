import React, { useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Spin, 
  Space, 
  Button, 
  Tooltip, 
  Modal, 
  Form, 
  InputNumber, 
  Select, 
  message,
  Tabs,
  Switch,
  Input,
  Slider,
  Drawer
} from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  SettingOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

/**
 * 细胞亚群分布散点图组件
 * @param {Object} props
 * @param {Array} props.data - 散点图数据，格式：[[x, y, cluster, sample], ...]
 * @param {string} props.graphType - 图形类型（tsne/umap/pca）
 * @param {boolean} props.loading - 加载状态
 * @param {number} props.height - 图表高度（默认600px）
 * @param {string} props.title - 图表标题（默认：细胞亚群分布散点图）
 */
const CellScatterChart = ({ 
  data = [], 
  graphType = '', 
  loading = false, 
  height = 600,
  title = '细胞亚群分布散点图'
}) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartHeight, setChartHeight] = useState(height);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [settingsForm] = Form.useForm();
  const [previewForm] = Form.useForm();
  
  // 完整的图表配置状态
  const [chartConfig, setChartConfig] = useState({
    // 文本样式
    fontFamily: 'Arial',
    title: {
      show: true,
      fontSize: 18,
      color: '#333333',
      fontWeight: 'bold',
      text: title,
      position: 'center'
    },
    axisTitle: {
      show: true,
      fontSize: 14,
      color: '#666666',
      fontWeight: 'normal',
      xAxisName: graphType ? graphType.toUpperCase() + '_1' : 'X',
      yAxisName: graphType ? graphType.toUpperCase() + '_2' : 'Y'
    },
    // 坐标轴系
    axis: {
      showGridLine: false,
      showAxisLine: true,
      axisLabelSize: 12,
      autoScale: true
    },
    // 图例
    legend: {
      show: true,
      itemSize: 14,
      fontSize: 12,
      color: '#333333',
      fontWeight: 'normal',
      position: 'right'
    },
    // 图形参数
    graph: {
      symbolSize: 4,
      opacity: 0.8
    },
    // 配色方案
    colorScheme: 'default'
  });

  // 配色方案
  const colorSchemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    warm: ['#c23531', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    cool: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e062ae', '#e690d1'],
    pastel: ['#ffd6e7', '#ffb3d9', '#c9c9ff', '#b3d9ff', '#b3ffb3', '#ffffb3', '#ffd9b3', '#ffb3b3', '#e6b3ff']
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        setChartHeight(window.innerHeight - 150);
      } else {
        setChartHeight(height);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [height]);

  // 生成散点图配置
  const getScatterChartOption = () => {
    if (!data || data.length === 0) {
      return {};
    }

    // 按亚群（cluster）分组数据
    const clusterGroups = {};
    data.forEach(item => {
      const [x, y, cluster, sample] = item;
      if (!clusterGroups[cluster]) {
        clusterGroups[cluster] = [];
      }
      clusterGroups[cluster].push([parseFloat(x), parseFloat(y), cluster, sample]);
    });

    // 对cluster进行排序
    const sortedClusters = Object.keys(clusterGroups).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

    // 获取配色
    const colors = colorSchemes[chartConfig.colorScheme] || colorSchemes.default;

    // 生成系列数据
    const series = sortedClusters.map((cluster, index) => ({
      name: `Cluster ${cluster}`,
      type: 'scatter',
      data: clusterGroups[cluster].map(item => [item[0], item[1]]),
      symbolSize: chartConfig.graph.symbolSize,
      itemStyle: {
        opacity: chartConfig.graph.opacity,
        color: colors[index % colors.length]
      },
      emphasis: {
        focus: 'series'
      }
    }));

    return {
      color: colors,
      title: chartConfig.title.show ? {
        text: chartConfig.title.text,
        left: chartConfig.title.position,
        textStyle: {
          fontFamily: chartConfig.fontFamily,
          fontSize: chartConfig.title.fontSize,
          color: chartConfig.title.color,
          fontWeight: chartConfig.title.fontWeight
        }
      } : null,
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const dataIndex = params.dataIndex;
          const clusterName = params.seriesName;
          const cluster = clusterName.replace('Cluster ', '');
          const pointData = clusterGroups[cluster][dataIndex];
          return `亚群: ${cluster}<br/>样本: ${pointData[3]}<br/>X: ${pointData[0].toFixed(2)}<br/>Y: ${pointData[1].toFixed(2)}`;
        }
      },
      legend: chartConfig.legend.show ? {
        orient: 'vertical',
        right: chartConfig.legend.position === 'right' ? 10 : undefined,
        left: chartConfig.legend.position === 'left' ? 10 : undefined,
        top: 'center',
        data: sortedClusters.map(cluster => `Cluster ${cluster}`),
        type: 'scroll',
        itemWidth: chartConfig.legend.itemSize,
        itemHeight: chartConfig.legend.itemSize,
        textStyle: {
          fontFamily: chartConfig.fontFamily,
          fontSize: chartConfig.legend.fontSize,
          color: chartConfig.legend.color,
          fontWeight: chartConfig.legend.fontWeight
        }
      } : null,
      grid: {
        left: '10%',
        right: chartConfig.legend.show && chartConfig.legend.position === 'right' ? '20%' : '10%',
        bottom: '15%',
        top: chartConfig.title.show ? '15%' : '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: chartConfig.axisTitle.show ? chartConfig.axisTitle.xAxisName : '',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontFamily: chartConfig.fontFamily,
          fontSize: chartConfig.axisTitle.fontSize,
          color: chartConfig.axisTitle.color,
          fontWeight: chartConfig.axisTitle.fontWeight
        },
        axisLine: {
          show: chartConfig.axis.showAxisLine
        },
        axisTick: {
          show: chartConfig.axis.showAxisLine
        },
        axisLabel: {
          fontSize: chartConfig.axis.axisLabelSize
        },
        splitLine: {
          show: chartConfig.axis.showGridLine
        },
        scale: chartConfig.axis.autoScale
      },
      yAxis: {
        type: 'value',
        name: chartConfig.axisTitle.show ? chartConfig.axisTitle.yAxisName : '',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          fontFamily: chartConfig.fontFamily,
          fontSize: chartConfig.axisTitle.fontSize,
          color: chartConfig.axisTitle.color,
          fontWeight: chartConfig.axisTitle.fontWeight
        },
        axisLine: {
          show: chartConfig.axis.showAxisLine
        },
        axisTick: {
          show: chartConfig.axis.showAxisLine
        },
        axisLabel: {
          fontSize: chartConfig.axis.axisLabelSize
        },
        splitLine: {
          show: chartConfig.axis.showGridLine
        },
        scale: chartConfig.axis.autoScale
      },
      series: series,
      toolbox: {
        show: false
      }
    };
  };

  // 自适应画布大小
  const handleAutoResize = () => {
    if (chartRef.current) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      echartsInstance.resize();
      message.success('已自适应画布大小');
    }
  };

  // 全屏切换（真正的浏览器全屏）
  const handleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          await containerRef.current.mozRequestFullScreen();
        } else if (containerRef.current.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      message.error('全屏切换失败');
      console.error('Fullscreen error:', error);
    }
  };

  // 放大
  const handleZoomIn = () => {
    if (chartRef.current) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      echartsInstance.dispatchAction({
        type: 'dataZoom',
        start: 20,
        end: 80
      });
      message.success('已放大');
    }
  };

  // 缩小
  const handleZoomOut = () => {
    if (chartRef.current) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      echartsInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100
      });
      message.success('已缩小');
    }
  };

  // 打开设置对话框
  const handleOpenSettings = () => {
    settingsForm.setFieldsValue({
      fontFamily: chartConfig.fontFamily,
      'title.show': chartConfig.title.show,
      'title.fontSize': chartConfig.title.fontSize,
      'title.color': chartConfig.title.color,
      'title.fontWeight': chartConfig.title.fontWeight,
      'title.text': chartConfig.title.text,
      'title.position': chartConfig.title.position,
      'axisTitle.show': chartConfig.axisTitle.show,
      'axisTitle.fontSize': chartConfig.axisTitle.fontSize,
      'axisTitle.color': chartConfig.axisTitle.color,
      'axisTitle.fontWeight': chartConfig.axisTitle.fontWeight,
      'axisTitle.xAxisName': chartConfig.axisTitle.xAxisName,
      'axisTitle.yAxisName': chartConfig.axisTitle.yAxisName,
      'axis.showGridLine': chartConfig.axis.showGridLine,
      'axis.showAxisLine': chartConfig.axis.showAxisLine,
      'axis.axisLabelSize': chartConfig.axis.axisLabelSize,
      'axis.autoScale': chartConfig.axis.autoScale,
      'legend.show': chartConfig.legend.show,
      'legend.itemSize': chartConfig.legend.itemSize,
      'legend.fontSize': chartConfig.legend.fontSize,
      'legend.color': chartConfig.legend.color,
      'legend.fontWeight': chartConfig.legend.fontWeight,
      'legend.position': chartConfig.legend.position,
      'graph.symbolSize': chartConfig.graph.symbolSize,
      'graph.opacity': chartConfig.graph.opacity,
      colorScheme: chartConfig.colorScheme
    });
    setSettingsVisible(true);
  };

  // 保存设置
  const handleSaveSettings = () => {
    settingsForm.validateFields().then(values => {
      const newConfig = {
        fontFamily: values.fontFamily,
        title: {
          show: values['title.show'],
          fontSize: values['title.fontSize'],
          color: values['title.color'],
          fontWeight: values['title.fontWeight'],
          text: values['title.text'],
          position: values['title.position']
        },
        axisTitle: {
          show: values['axisTitle.show'],
          fontSize: values['axisTitle.fontSize'],
          color: values['axisTitle.color'],
          fontWeight: values['axisTitle.fontWeight'],
          xAxisName: values['axisTitle.xAxisName'],
          yAxisName: values['axisTitle.yAxisName']
        },
        axis: {
          showGridLine: values['axis.showGridLine'],
          showAxisLine: values['axis.showAxisLine'],
          axisLabelSize: values['axis.axisLabelSize'],
          autoScale: values['axis.autoScale']
        },
        legend: {
          show: values['legend.show'],
          itemSize: values['legend.itemSize'],
          fontSize: values['legend.fontSize'],
          color: values['legend.color'],
          fontWeight: values['legend.fontWeight'],
          position: values['legend.position']
        },
        graph: {
          symbolSize: values['graph.symbolSize'],
          opacity: values['graph.opacity']
        },
        colorScheme: values.colorScheme
      };
      setChartConfig(newConfig);
      setSettingsVisible(false);
      message.success('设置已保存');
    });
  };

  // 打开预览对话框
  const handleOpenPreview = () => {
    previewForm.setFieldsValue({
      width: 800,
      height: 600,
      format: 'png'
    });
    setPreviewVisible(true);
  };

  // 下载图表
  const handleDownload = (customSize = null) => {
    if (chartRef.current) {
      const echartsInstance = chartRef.current.getEchartsInstance();
      const downloadOptions = {
        type: customSize?.format || 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      };

      if (customSize) {
        downloadOptions.width = customSize.width;
        downloadOptions.height = customSize.height;
      }

      const url = echartsInstance.getDataURL(downloadOptions);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chartConfig.title.text}_${new Date().getTime()}.${downloadOptions.type}`;
      link.click();
      message.success('图表下载成功');
      setPreviewVisible(false);
    }
  };

  // 预览并下载
  const handlePreviewDownload = () => {
    previewForm.validateFields().then(values => {
      handleDownload(values);
    });
  };

  // 判断是否有数据
  const hasData = data && data.length > 0;
  const isDisabled = loading || !hasData;

  return (
    <div ref={containerRef} style={{ position: 'relative', background: isFullscreen ? '#fff' : 'transparent' }}>
      {/* 工具栏 */}
      <div style={{ 
        marginBottom: 12, 
        padding: '8px 12px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Space>
          <Tooltip title="自适应画布大小">
            <Button 
              icon={<ExpandOutlined />} 
              onClick={handleAutoResize}
              size="small"
              disabled={isDisabled}
            >
              自适应
            </Button>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "退出全屏" : "全屏"}>
            <Button 
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
              onClick={handleFullscreen}
              size="small"
              disabled={isDisabled}
            >
              {isFullscreen ? '退出全屏' : '全屏'}
            </Button>
          </Tooltip>
          
          <Tooltip title="放大">
            <Button 
              icon={<ZoomInOutlined />} 
              onClick={handleZoomIn}
              size="small"
              disabled={isDisabled}
            >
              放大
            </Button>
          </Tooltip>
          
          <Tooltip title="缩小">
            <Button 
              icon={<ZoomOutOutlined />} 
              onClick={handleZoomOut}
              size="small"
              disabled={isDisabled}
            >
              缩小
            </Button>
          </Tooltip>
        </Space>

        <Space>
          <Tooltip title="设置图表参数">
            <Button 
              icon={<SettingOutlined />} 
              onClick={handleOpenSettings}
              size="small"
              disabled={isDisabled}
            >
              设置
            </Button>
          </Tooltip>
          
          <Tooltip title="预览并设置下载尺寸">
            <Button 
              icon={<EyeOutlined />} 
              onClick={handleOpenPreview}
              size="small"
              disabled={isDisabled}
            >
              预览
            </Button>
          </Tooltip>
          
          <Tooltip title="下载图表">
            <Button 
              type="primary"
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload()}
              size="small"
              disabled={isDisabled}
            >
              下载
            </Button>
          </Tooltip>
        </Space>
      </div>

      {/* 图表区域 */}
      <Spin spinning={loading}>
        {hasData ? (
          <ReactECharts 
            ref={chartRef}
            option={getScatterChartOption()} 
            style={{ 
              height: `${chartHeight}px`, 
              width: '100%',
              transition: 'height 0.3s ease'
            }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            {loading ? '加载中...' : '暂无数据'}
          </div>
        )}
      </Spin>

      {/* 设置抽屉 */}
      <Drawer
        title="图表设置"
        placement="right"
        open={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        width={500}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setSettingsVisible(false)}>
                取消
              </Button>
              <Button type="primary" onClick={handleSaveSettings}>
                保存设置
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={settingsForm}
          layout="vertical"
        >
          <Tabs defaultActiveKey="1">
            {/* 基本设置 */}
            <TabPane tab="基本设置" key="1">
              {/* 字体选择 */}
              <Form.Item label="字体" name="fontFamily">
                <Select>
                  <Option value="Arial">Arial</Option>
                  <Option value="Microsoft YaHei">微软雅黑</Option>
                  <Option value="SimSun">宋体</Option>
                  <Option value="SimHei">黑体</Option>
                  <Option value="Times New Roman">Times New Roman</Option>
                </Select>
              </Form.Item>

              <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>标题</h4>
                <Form.Item label="显示标题" name="title.show" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="字号" name="title.fontSize">
                  <InputNumber min={12} max={48} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="颜色" name="title.color">
                  <Input type="color" />
                </Form.Item>
                <Form.Item label="粗体" name="title.fontWeight">
                  <Select>
                    <Option value="normal">正常</Option>
                    <Option value="bold">粗体</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="标题名称" name="title.text">
                  <Input />
                </Form.Item>
                <Form.Item label="位置" name="title.position">
                  <Select>
                    <Option value="left">左对齐</Option>
                    <Option value="center">居中</Option>
                    <Option value="right">右对齐</Option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>X/Y轴标题</h4>
                <Form.Item label="显示轴标题" name="axisTitle.show" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="字号" name="axisTitle.fontSize">
                  <InputNumber min={10} max={24} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="颜色" name="axisTitle.color">
                  <Input type="color" />
                </Form.Item>
                <Form.Item label="粗体" name="axisTitle.fontWeight">
                  <Select>
                    <Option value="normal">正常</Option>
                    <Option value="bold">粗体</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="X轴标题" name="axisTitle.xAxisName">
                  <Input />
                </Form.Item>
                <Form.Item label="Y轴标题" name="axisTitle.yAxisName">
                  <Input />
                </Form.Item>
              </div>

              <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>坐标轴系</h4>
                <Form.Item label="网格线" name="axis.showGridLine" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="轴刻度线" name="axis.showAxisLine" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="轴文字大小" name="axis.axisLabelSize">
                  <InputNumber min={8} max={20} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="轴刻度自适应" name="axis.autoScale" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>

              <div style={{ padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>图例</h4>
                <Form.Item label="显示图例" name="legend.show" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="图例尺寸" name="legend.itemSize">
                  <InputNumber min={8} max={30} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="字号" name="legend.fontSize">
                  <InputNumber min={10} max={20} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="颜色" name="legend.color">
                  <Input type="color" />
                </Form.Item>
                <Form.Item label="粗体" name="legend.fontWeight">
                  <Select>
                    <Option value="normal">正常</Option>
                    <Option value="bold">粗体</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="位置" name="legend.position">
                  <Select>
                    <Option value="left">左侧</Option>
                    <Option value="right">右侧</Option>
                  </Select>
                </Form.Item>
              </div>
            </TabPane>

            {/* 图形设置 */}
            <TabPane tab="图形设置" key="2">
              <div style={{ marginBottom: 24, padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>图形参数</h4>
                <Form.Item label="点大小" name="graph.symbolSize">
                  <Slider min={1} max={20} />
                </Form.Item>
              </div>

              <div style={{ padding: 16, background: '#fafafa', borderRadius: 4 }}>
                <h4 style={{ marginBottom: 16 }}>图形颜色</h4>
                <Form.Item label="不透明度" name="graph.opacity">
                  <Slider min={0} max={1} step={0.1} />
                </Form.Item>
                <Form.Item label="配色方案" name="colorScheme">
                  <Select>
                    <Option value="default">默认配色</Option>
                    <Option value="warm">暖色调</Option>
                    <Option value="cool">冷色调</Option>
                    <Option value="pastel">柔和色调</Option>
                  </Select>
                </Form.Item>
              </div>
            </TabPane>
          </Tabs>
        </Form>
      </Drawer>

      {/* 预览对话框 */}
      <Modal
        title="预览并下载"
        open={previewVisible}
        onOk={handlePreviewDownload}
        onCancel={() => setPreviewVisible(false)}
        width={500}
      >
        <Form
          form={previewForm}
          layout="vertical"
        >
          <Form.Item
            label="图片宽度（像素）"
            name="width"
            rules={[{ required: true, message: '请输入图片宽度' }]}
          >
            <InputNumber min={400} max={4000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="图片高度（像素）"
            name="height"
            rules={[{ required: true, message: '请输入图片高度' }]}
          >
            <InputNumber min={300} max={4000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="图片格式"
            name="format"
            rules={[{ required: true, message: '请选择图片格式' }]}
          >
            <Select>
              <Option value="png">PNG</Option>
              <Option value="jpg">JPG</Option>
              <Option value="svg">SVG</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CellScatterChart;