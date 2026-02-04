import PropTypes from 'prop-types';

/**
 * 图表图例组件
 * 提供：图例显示、位置配置
 */
const ChartLegend = ({
  items = [],
  position = 'right',
  orientation = 'vertical',
  itemGap = 25,
  symbolSize = 12,
  symbolType = 'circle',
  fontSize = 12,
  className = '',
  style = {},
}) => {
  // 根据位置计算样式
  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute',
      zIndex: 5,
    };

    switch (position) {
      case 'right':
        return { ...baseStyle, right: 20, top: '50%', transform: 'translateY(-50%)' };
      case 'left':
        return { ...baseStyle, left: 20, top: '50%', transform: 'translateY(-50%)' };
      case 'top':
        return { ...baseStyle, top: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { ...baseStyle, bottom: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...baseStyle, top: 20, right: 20 };
      case 'top-left':
        return { ...baseStyle, top: 20, left: 20 };
      case 'bottom-right':
        return { ...baseStyle, bottom: 20, right: 20 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 20, left: 20 };
      default:
        return baseStyle;
    }
  };

  // 渲染图例符号
  const renderSymbol = (color, type) => {
    const symbolStyle = {
      display: 'inline-block',
      width: symbolSize,
      height: symbolSize,
      marginRight: 8,
      verticalAlign: 'middle',
    };

    switch (type) {
      case 'circle':
        return (
          <span
            style={{
              ...symbolStyle,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
        );
      case 'rect':
      case 'square':
        return (
          <span
            style={{
              ...symbolStyle,
              backgroundColor: color,
            }}
          />
        );
      case 'line':
        return (
          <span
            style={{
              ...symbolStyle,
              height: 2,
              backgroundColor: color,
              marginTop: symbolSize / 2,
            }}
          />
        );
      case 'triangle':
        return (
          <span
            style={{
              ...symbolStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${symbolSize / 2}px solid transparent`,
              borderRight: `${symbolSize / 2}px solid transparent`,
              borderBottom: `${symbolSize}px solid ${color}`,
            }}
          />
        );
      default:
        return (
          <span
            style={{
              ...symbolStyle,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
        );
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const containerStyle = {
    ...getPositionStyle(),
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    gap: orientation === 'vertical' ? `${itemGap}px` : `${itemGap}px`,
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  return (
    <div className={`d3-chart-legend ${className}`} style={containerStyle}>
      {items.map((item, index) => (
        <div
          key={item.name || index}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: item.onClick ? 'pointer' : 'default',
            opacity: item.disabled ? 0.5 : 1,
          }}
          onClick={item.onClick}
        >
          {renderSymbol(item.color, item.symbolType || symbolType)}
          <span
            style={{
              fontSize: `${fontSize}px`,
              color: '#333',
              userSelect: 'none',
            }}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

ChartLegend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      symbolType: PropTypes.oneOf(['circle', 'rect', 'square', 'line', 'triangle']),
      disabled: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
  position: PropTypes.oneOf([
    'right',
    'left',
    'top',
    'bottom',
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
  ]),
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  itemGap: PropTypes.number,
  symbolSize: PropTypes.number,
  symbolType: PropTypes.oneOf(['circle', 'rect', 'square', 'line', 'triangle']),
  fontSize: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ChartLegend;