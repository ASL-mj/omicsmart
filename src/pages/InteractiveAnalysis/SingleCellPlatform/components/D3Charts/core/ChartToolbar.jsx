import { useState } from 'react';
import { Button, Space, Tooltip, message } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DownloadOutlined,
  SettingOutlined,
  CompressOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * 图表工具栏组件
 * 提供：全屏、缩放、下载、设置等功能
 */
const ChartToolbar = ({
  containerRef,
  svgRef,
  isFullscreen = false,
  zoomLevel = 100,
  onZoomChange,
  onFullscreenToggle,
  onAutoFit,
  onDownload,
  settingsPanel,
  showFullscreen = true,
  showZoom = true,
  showAutoFit = true,
  showDownload = true,
  showSettings = true,
  className = '',
  style = {},
}) => {
  const [settingsVisible, setSettingsVisible] = useState(false);

  // 全屏切换
  const handleFullscreenToggle = () => {
    if (!containerRef?.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        message.error(`无法进入全屏模式: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }

    onFullscreenToggle?.();
  };

  // 放大
  const handleZoomIn = () => {
    const newLevel = Math.min(zoomLevel + 10, 200);
    onZoomChange?.(newLevel);
    message.success(`已放大至 ${newLevel}%`);
  };

  // 缩小
  const handleZoomOut = () => {
    const newLevel = Math.max(zoomLevel - 10, 50);
    onZoomChange?.(newLevel);
    message.success(`已缩小至 ${newLevel}%`);
  };

  // 自适应
  const handleAutoFit = () => {
    onAutoFit?.();
    message.success('已自适应画布大小');
  };

  // 下载 SVG
  const handleDownload = () => {
    if (!svgRef?.current) {
      message.error('无法获取图表元素');
      return;
    }

    try {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `chart_${Date.now()}.svg`;
      link.click();

      URL.revokeObjectURL(url);
      message.success('图表已下载');
      
      onDownload?.();
    } catch (error) {
      message.error(`下载失败: ${error.message}`);
    }
  };

  // 打开设置面板
  const handleSettingsToggle = () => {
    setSettingsVisible(!settingsVisible);
  };

  return (
    <>
      <div
        className={`d3-chart-toolbar ${className}`}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          ...style,
        }}
      >
        <Space>
          {showAutoFit && (
            <Tooltip title="自适应画布大小">
              <Button
                icon={<CompressOutlined />}
                onClick={handleAutoFit}
                size="small"
              />
            </Tooltip>
          )}

          {showFullscreen && (
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <Button
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={handleFullscreenToggle}
                size="small"
              />
            </Tooltip>
          )}

          {showZoom && (
            <>
              <Tooltip title="放大">
                <Button
                  icon={<ZoomInOutlined />}
                  onClick={handleZoomIn}
                  size="small"
                  disabled={zoomLevel >= 200}
                />
              </Tooltip>

              <Tooltip title="缩小">
                <Button
                  icon={<ZoomOutOutlined />}
                  onClick={handleZoomOut}
                  size="small"
                  disabled={zoomLevel <= 50}
                />
              </Tooltip>
            </>
          )}

          {showSettings && settingsPanel && (
            <Tooltip title="参数设置">
              <Button
                icon={<SettingOutlined />}
                onClick={handleSettingsToggle}
                size="small"
                type={settingsVisible ? 'primary' : 'default'}
              />
            </Tooltip>
          )}

          {showDownload && (
            <Tooltip title="下载">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                size="small"
                type="primary"
              />
            </Tooltip>
          )}
        </Space>
      </div>

      {/* 设置面板 - 悬浮div */}
      {settingsPanel && settingsVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 320,
            height: '100%',
            backgroundColor: '#fff',
            boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          {/* 设置面板头部 */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500 }}>参数设置</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleSettingsToggle}
              size="small"
            />
          </div>

          {/* 设置面板内容 */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
            }}
          >
            {settingsPanel}
          </div>
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

ChartToolbar.propTypes = {
  containerRef: PropTypes.object,
  svgRef: PropTypes.object,
  isFullscreen: PropTypes.bool,
  zoomLevel: PropTypes.number,
  onZoomChange: PropTypes.func,
  onFullscreenToggle: PropTypes.func,
  onAutoFit: PropTypes.func,
  onDownload: PropTypes.func,
  settingsPanel: PropTypes.node,
  showFullscreen: PropTypes.bool,
  showZoom: PropTypes.bool,
  showAutoFit: PropTypes.bool,
  showDownload: PropTypes.bool,
  showSettings: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ChartToolbar;