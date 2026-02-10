import { Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.module.css';
import { color } from 'echarts';

const AnalysisPlatformPage = () => {
  // 基础分析平台数据
  const basicPlatforms = [
    {
      id: 1,
      name: '单细胞转录组平台',
      tag: '单细胞转录组分析70元起',
      icon: '🔬',
      color: '#52c41a',
      cloudTag: '进入云端版',
    },
    {
      id: 2,
      name: '转录组平台',
      tag: '转录组分析优惠价',
      icon: '🧬',
      color: '#1890ff',
      cloudTag: '进入云端版',
    },
    {
      id:3,
      name: '微生物多样性平台【全新版本】',
      tag: '16S/ITS测序低至64元/样',
      icon: "🦠",
      color:'#',
      cloudTag: '进入云端版'
    },
  ];

  // 个性分析平台数据
  const personalPlatforms = [
  ];

  return (
    <div className={styles.analysisPlatform}>
      <div className={styles.platformSection}>
        <div className={styles.sectionHeader}>
          <h2>
            <span className={styles.icon}>📊</span>
            基础分析平台
          </h2>
        </div>
        <Row gutter={[16, 16]}>
          {basicPlatforms.map((platform) => (
            <Col xs={24} sm={12} md={8} lg={6} key={platform.id}>
              <Link to={`/analysis/${platform.id}`}>
                <Card className={styles.platformCard} hoverable>
                  <div className={styles.platformIcon}>
                    {platform.icon}
                  </div>
                  <h3 className={styles.platformName}>{platform.name}</h3>
                  <div className={styles.platformActions}>
                    <Button type="link">进入平台</Button>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <div className={styles.platformSection}>
        <div className={styles.sectionHeader}>
          <h2>
            <span className={styles.icon}>🎯</span>
            个性分析平台
          </h2>
        </div>
        <Row gutter={[16, 16]}>
          {personalPlatforms.map((platform) => (
            <Col xs={24} sm={12} md={8} lg={6} key={platform.id}>
              <Link to={`/analysis/${platform.id}`}>
                <Card className={styles.platformCard} hoverable>
                  <div className={styles.platformIcon}>
                    {platform.icon}
                  </div>
                  <h3 className={styles.platformName}>{platform.name}</h3>
                  <div className={styles.platformActions}>
                    <Button type="link">进入平台</Button>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AnalysisPlatformPage;