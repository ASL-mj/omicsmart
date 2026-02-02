import { Card, Row, Col, Button } from 'antd';
import './AnalysisPlatformPage.css';

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
  ];

  // 个性分析平台数据
  const personalPlatforms = [
  ];

  return (
    <div className="analysis-platform">
      <div className="platform-section">
        <div className="section-header">
          <h2>
            <span className="icon">📊</span>
            基础分析平台
          </h2>
        </div>
        <Row gutter={[16, 16]}>
          {basicPlatforms.map((platform) => (
            <Col xs={24} sm={12} md={8} lg={6} key={platform.id}>
              <Card className="platform-card" hoverable>
                <div className="platform-icon">
                  {platform.icon}
                </div>
                <h3 className="platform-name">{platform.name}</h3>
                <div className="platform-actions">
                  <Button type="link">进入平台</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="platform-section">
        <div className="section-header">
          <h2>
            <span className="icon">🎯</span>
            个性分析平台
          </h2>
        </div>
        <Row gutter={[16, 16]}>
          {personalPlatforms.map((platform) => (
            <Col xs={24} sm={12} md={8} lg={6} key={platform.id}>
              <Card className="platform-card" hoverable>
                <div className="platform-icon">
                  {platform.icon}
                </div>
                <h3 className="platform-name">{platform.name}</h3>
                <div className="platform-actions">
                  <Button type="link">进入平台</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AnalysisPlatformPage;