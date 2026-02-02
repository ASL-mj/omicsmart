import { Card, Tabs, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { CloseOutlined, RightOutlined } from '@ant-design/icons';
import { getPlatformConfig } from './platforms/index.jsx';
import styles from './index.module.css';

const PlatformDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 从配置文件中获取平台信息
  const platform = getPlatformConfig(id);

  // 处理进入结果交互分析
  const handleInteractiveAnalysis = () => {
    // 根据平台ID跳转到对应的结果分析页面
    if (id === '1') {
      navigate('/interactive-analysis/single-cell');
    } else if (id === '2') {
      // 转录组的结果分析页面（后续添加）
      navigate('/interactive-analysis/transcriptome');
    }
  };

  return (
    <div className={styles.platformDetailPage}>
      <Card className={styles.platformDetailCard} bordered={false}>
        <CloseOutlined className={styles.closeIcon} />
        
        <div className={styles.introduce}>
          {/* 左侧：Logo容器 (40%) - 通过renderLogo自定义 */}
          <div className={styles.logoContainer}>
            {platform.renderLogo && platform.renderLogo()}
          </div>

          {/* 右侧：内容容器 (60%) */}
          <div className={styles.passageContainer}>
            {/* 标题部分 */}
            <h3 className={styles.title}>
              <span>{platform.icon} {platform.title}</span>
            </h3>

            {/* 介绍部分 - 通过renderDescription自定义，支持Tooltip */}
            <Tooltip 
              title={platform.renderDescription()} 
              placement="left"
              bordered
              arrowPointAtCenter
              color="#f9f9f9"
              overlayStyle={{ maxWidth: '500px' }}
            >
              <div className={styles.introduction}>
                {platform.renderDescription && platform.renderDescription()}
              </div>
            </Tooltip>

            {/* 按钮部分 - 通过buttons数组自定义 */}
            <p className={styles.btnBar}>
              {platform.buttons && platform.buttons.map((button, index) => (
                <span key={index} className={`${styles.btnSpan} ${styles[button.className] || ''}`}>
                  {button.icon} {button.text}
                </span>
              ))}
              {/* 进入结果交互分析按钮 - 必有 */}
              <span className={`${styles.btnSpan} ${styles.btnSpan2}`} onClick={handleInteractiveAnalysis}>
                <RightOutlined /> 进入结果交互分析
              </span>
            </p>
          </div>
        </div>

        {/* 底部Tab标签 - 通过tabs数组自定义 */}
        {platform.tabs && platform.tabs.length > 0 && (
          <div className={styles.platformTabsWrapper}>
            <Tabs 
              defaultActiveKey={platform.tabs[0]?.key} 
              items={platform.tabs}
              className={styles.platformTabs}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlatformDetailPage;