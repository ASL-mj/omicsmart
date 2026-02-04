import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

/**
 * 图表坐标轴组件
 * 提供：X轴、Y轴渲染
 */
const ChartAxis = ({
  type = 'bottom',
  scale,
  transform = '',
  ticks = 5,
  tickSize = 6,
  tickPadding = 3,
  tickFormat,
  label = '',
  labelOffset = 40,
  fontSize = 12,
  labelFontSize = 14,
  showGrid = false,
  gridWidth,
  gridHeight,
  className = '',
}) => {
  const axisRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!axisRef.current || !scale) return;

    // 选择对应的轴生成器
    let axis;
    switch (type) {
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      case 'top':
        axis = d3.axisTop(scale);
        break;
      case 'left':
        axis = d3.axisLeft(scale);
        break;
      case 'right':
        axis = d3.axisRight(scale);
        break;
      default:
        axis = d3.axisBottom(scale);
    }

    // 配置轴
    axis
      .ticks(ticks)
      .tickSize(tickSize)
      .tickPadding(tickPadding);

    if (tickFormat) {
      axis.tickFormat(tickFormat);
    }

    // 渲染轴
    const axisGroup = d3.select(axisRef.current);
    axisGroup.call(axis);

    // 设置字体大小
    axisGroup.selectAll('text').style('font-size', `${fontSize}px`);

    // 渲染网格线
    if (showGrid && gridRef.current && (gridWidth || gridHeight)) {
      const gridGroup = d3.select(gridRef.current);
      gridGroup.selectAll('*').remove();

      let gridAxis;
      if (type === 'bottom' || type === 'top') {
        gridAxis = d3.axisBottom(scale).tickSize(-gridHeight).tickFormat('');
      } else {
        gridAxis = d3.axisLeft(scale).tickSize(-gridWidth).tickFormat('');
      }

      gridAxis.ticks(ticks);
      gridGroup.call(gridAxis);

      // 样式化网格线
      gridGroup
        .selectAll('line')
        .style('stroke', '#e0e0e0')
        .style('stroke-dasharray', '3,3')
        .style('stroke-opacity', 0.5);

      gridGroup.select('.domain').remove();
    }
  }, [
    scale,
    type,
    ticks,
    tickSize,
    tickPadding,
    tickFormat,
    fontSize,
    showGrid,
    gridWidth,
    gridHeight,
  ]);

  // 计算标签位置
  const getLabelTransform = () => {
    switch (type) {
      case 'bottom':
        return `translate(0, ${labelOffset})`;
      case 'top':
        return `translate(0, -${labelOffset})`;
      case 'left':
        return `translate(-${labelOffset}, 0) rotate(-90)`;
      case 'right':
        return `translate(${labelOffset}, 0) rotate(90)`;
      default:
        return '';
    }
  };

  return (
    <g className={`d3-chart-axis ${className}`} transform={transform}>
      {/* 网格线 */}
      {showGrid && <g ref={gridRef} className="grid" />}

      {/* 坐标轴 */}
      <g ref={axisRef} />

      {/* 轴标签 */}
      {label && (
        <text
          transform={getLabelTransform()}
          textAnchor="middle"
          style={{
            fontSize: `${labelFontSize}px`,
            fill: '#333',
            fontWeight: 500,
          }}
        >
          {label}
        </text>
      )}
    </g>
  );
};

ChartAxis.propTypes = {
  type: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  scale: PropTypes.func.isRequired,
  transform: PropTypes.string,
  ticks: PropTypes.number,
  tickSize: PropTypes.number,
  tickPadding: PropTypes.number,
  tickFormat: PropTypes.func,
  label: PropTypes.string,
  labelOffset: PropTypes.number,
  fontSize: PropTypes.number,
  labelFontSize: PropTypes.number,
  showGrid: PropTypes.bool,
  gridWidth: PropTypes.number,
  gridHeight: PropTypes.number,
  className: PropTypes.string,
};

export default ChartAxis;