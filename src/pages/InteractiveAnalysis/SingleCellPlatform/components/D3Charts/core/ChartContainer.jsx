import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * 图表容器组件
 * 负责：尺寸管理、Resize监听、全屏支持
 * 特性：宽度自适应父容器，高度固定
 */
const ChartContainer = ({
  children,
  width,
  height = 500,
  className = '',
  style = {},
  onResize,
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 监听容器宽度变化（宽度自适应）
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const newWidth = container.clientWidth;

      const newDimensions = {
        width: newWidth,
        height: height, // 高度固定
      };

      setDimensions(prev => {
        if (prev.width !== newDimensions.width || prev.height !== newDimensions.height) {
          onResize?.(newDimensions);
          return newDimensions;
        }
        return prev;
      });
    };

    // 初始化尺寸
    updateDimensions();

    // 监听尺寸变化
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [height, onResize]);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`d3-chart-container ${className}`}
      style={{
        position: 'relative',
        width: '100%', // 宽度始终自适应
        height: height, // 高度固定
        minHeight: 300,
        backgroundColor: isFullscreen ? '#ffffff' : 'transparent',
        ...style,
      }}
    >
      {typeof children === 'function'
        ? children({ ...dimensions, isFullscreen })
        : children}
    </div>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  width: PropTypes.number, // 初始宽度（可选）
  height: PropTypes.number, // 固定高度
  className: PropTypes.string,
  style: PropTypes.object,
  onResize: PropTypes.func,
};

export default ChartContainer;