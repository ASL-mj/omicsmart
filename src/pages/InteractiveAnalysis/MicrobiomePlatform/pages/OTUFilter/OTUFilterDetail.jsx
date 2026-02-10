import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Select,
  Checkbox,
  Input,
  Table,
  Space,
  Typography,
  Divider,
  Tag,
} from 'antd';
import { ArrowLeftOutlined, SearchOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate';
import styles from './OTUFilterDetail.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * OTU筛选详情页面（查看/编辑）
 * 复刻自: https://www.omicsmart.com/16SNew/home.html#/filter/checkFilter
 */
const OTUFilterDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const id = searchParams.get('id');
  const tableName = searchParams.get('name') || 'tset';

  const isViewMode = mode === 'view';

  // 筛选条件状态
  const [groupScheme, setGroupScheme] = useState('testaaaaccd');
  const [speciesFilter, setSpeciesFilter] = useState({
    enabled: true,
    action: '只保留',
    level: 'Class',
    species: ['c__ABY1', 'c__Acidimicrobiia', 'c__Acidobacteriia', 'c__Actinobacteria'],
  });
  const [otuFilter, setOtuFilter] = useState({ enabled: false });
  const [rarefaction, setRarefaction] = useState({ enabled: false });
  const [absoluteAbundance, setAbsoluteAbundance] = useState({ enabled: false });
  const [sampleFrequency, setSampleFrequency] = useState({ enabled: false });
  const [rankFilter, setRankFilter] = useState({ enabled: false });
  const [removeChloroplast, setRemoveChloroplast] = useState({ enabled: false });

  // 层级切换
  const [hierarchyLevel, setHierarchyLevel] = useState('OTU');
  const [searchText, setSearchText] = useState('');

  // 模拟OTU数据
  const [otuData] = useState([
    {
      key: '1',
      otu: 'Otu000001',
      totalTags: 32012,
      'A-1_tags': 240,
      'A-2_tags': 381,
      'A-3_tags': 508,
      'A-4_tags': 443,
      'A-5_tags': 345,
      'A-6_tags': 522,
      'B-1_tags': 14699,
      'B-2_tags': 14874,
      'A-1_relative': 56.872038,
      'A-2_relative': 58.705701,
      'A-3_relative': 52.479339,
      domain: 'Bacteria',
      phylum: 'Actinobacteria',
      class: 'Actinobacteria',
      order: 'Micrococcales',
      family: 'Microbacteriaceae',
      genus: 'ML602J-51',
      species: '',
    },
    {
      key: '2',
      otu: 'Otu000002',
      totalTags: 27447,
      'A-1_tags': 86,
      'A-2_tags': 133,
      'A-3_tags': 209,
      'A-4_tags': 211,
      'A-5_tags': 168,
      'A-6_tags': 233,
      'B-1_tags': 13482,
      'B-2_tags': 12925,
      'A-1_relative': 20.379147,
      'A-2_relative': 20.493066,
      'A-3_relative': 21.590909,
      domain: 'Bacteria',
      phylum: 'Actinobacteria',
      class: 'Actinobacteria',
      order: 'Micrococcales',
      family: 'Microbacteriaceae',
      genus: '',
      species: '',
    },
  ]);

  // 表格列定义
  const columns = [
    {
      title: 'OTU',
      dataIndex: 'otu',
      key: 'otu',
      width: 120,
      fixed: 'left',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Total_tags',
      dataIndex: 'totalTags',
      key: 'totalTags',
      width: 100,
      sorter: (a, b) => a.totalTags - b.totalTags,
    },
    {
      title: 'A-1_tags',
      dataIndex: 'A-1_tags',
      key: 'A-1_tags',
      width: 90,
    },
    {
      title: 'A-2_tags',
      dataIndex: 'A-2_tags',
      key: 'A-2_tags',
      width: 90,
    },
    {
      title: 'A-3_tags',
      dataIndex: 'A-3_tags',
      key: 'A-3_tags',
      width: 90,
    },
    {
      title: 'A-4_tags',
      dataIndex: 'A-4_tags',
      key: 'A-4_tags',
      width: 90,
    },
    {
      title: 'A-5_tags',
      dataIndex: 'A-5_tags',
      key: 'A-5_tags',
      width: 90,
    },
    {
      title: 'A-6_tags',
      dataIndex: 'A-6_tags',
      key: 'A-6_tags',
      width: 90,
    },
    {
      title: 'B-1_tags',
      dataIndex: 'B-1_tags',
      key: 'B-1_tags',
      width: 90,
    },
    {
      title: 'B-2_tags',
      dataIndex: 'B-2_tags',
      key: 'B-2_tags',
      width: 90,
    },
    {
      title: 'A-1_relative_abundance',
      dataIndex: 'A-1_relative',
      key: 'A-1_relative',
      width: 150,
      render: (val) => val.toFixed(6),
    },
    {
      title: 'A-2_relative_abundance',
      dataIndex: 'A-2_relative',
      key: 'A-2_relative',
      width: 150,
      render: (val) => val.toFixed(6),
    },
    {
      title: 'A-3_relative_abundance',
      dataIndex: 'A-3_relative',
      key: 'A-3_relative',
      width: 150,
      render: (val) => val.toFixed(6),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      width: 100,
    },
    {
      title: 'Phylum',
      dataIndex: 'phylum',
      key: 'phylum',
      width: 150,
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      width: 150,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 150,
    },
    {
      title: 'Family',
      dataIndex: 'family',
      key: 'family',
      width: 150,
    },
    {
      title: 'Genus',
      dataIndex: 'genus',
      key: 'genus',
      width: 150,
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
      width: 150,
    },
  ];

  const handleBack = () => {
    navigate('/interactive-analysis/microbiome/otu-filter');
  };

  return (
    <PageTemplate pageTitle="OTU筛选">
      <div className={styles.detailContainer}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <Title level={4}>● OTU查看</Title>
        </div>

        <Divider />

        {/* 筛选条件面板 */}
        <div className={styles.filterPanel}>
          <div className={styles.filterTitle}>选择过滤条件</div>

          {/* 分组方案 */}
          <div className={styles.filterItem}>
            <Text strong>分组方案:</Text>
            <Select
              value={groupScheme}
              onChange={setGroupScheme}
              disabled={isViewMode}
              style={{ width: 200, marginLeft: 12 }}
            >
              <Option value="testaaaaccd">testaaaaccd</Option>
              <Option value="20250818">20250818</Option>
            </Select>
          </div>

          {/* 物种过滤 */}
          <div className={styles.filterItem}>
            <Checkbox
              checked={speciesFilter.enabled}
              onChange={(e) => setSpeciesFilter({ ...speciesFilter, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>物种过滤</Text>
            </Checkbox>
            {speciesFilter.enabled && (
              <div className={styles.filterSubItem}>
                <Select
                  value={speciesFilter.action}
                  onChange={(val) => setSpeciesFilter({ ...speciesFilter, action: val })}
                  disabled={isViewMode}
                  style={{ width: 100 }}
                >
                  <Option value="只保留">只保留</Option>
                  <Option value="去除">去除</Option>
                </Select>
                <Select
                  value={speciesFilter.level}
                  onChange={(val) => setSpeciesFilter({ ...speciesFilter, level: val })}
                  disabled={isViewMode}
                  style={{ width: 100, marginLeft: 8 }}
                >
                  <Option value="Phylum">Phylum</Option>
                  <Option value="Class">Class</Option>
                  <Option value="Order">Order</Option>
                  <Option value="Family">Family</Option>
                  <Option value="Genus">Genus</Option>
                </Select>
                <Text style={{ marginLeft: 8 }}>水平分类的</Text>
                <Select
                  mode="multiple"
                  value={speciesFilter.species}
                  onChange={(val) => setSpeciesFilter({ ...speciesFilter, species: val })}
                  disabled={isViewMode}
                  style={{ width: 300, marginLeft: 8 }}
                  placeholder="请选择物种"
                >
                  <Option value="c__ABY1">c__ABY1</Option>
                  <Option value="c__Acidimicrobiia">c__Acidimicrobiia</Option>
                  <Option value="c__Acidobacteriia">c__Acidobacteriia</Option>
                  <Option value="c__Actinobacteria">c__Actinobacteria</Option>
                </Select>
              </div>
            )}
          </div>

          {/* 其他筛选选项 */}
          <div className={styles.filterItem}>
            <Checkbox
              checked={otuFilter.enabled}
              onChange={(e) => setOtuFilter({ ...otuFilter, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>OTU过滤</Text>
            </Checkbox>
          </div>

          <div className={styles.filterItem}>
            <Checkbox
              checked={rarefaction.enabled}
              onChange={(e) => setRarefaction({ ...rarefaction, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>抽平</Text>
            </Checkbox>
          </div>

          <div className={styles.filterItem}>
            <Checkbox
              checked={absoluteAbundance.enabled}
              onChange={(e) => setAbsoluteAbundance({ ...absoluteAbundance, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>OTU绝对丰度筛选（tag总数）</Text>
            </Checkbox>
          </div>

          <div className={styles.filterItem}>
            <Checkbox
              checked={sampleFrequency.enabled}
              onChange={(e) => setSampleFrequency({ ...sampleFrequency, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>OTU绝对丰度筛选（样本频率+tag数）</Text>
            </Checkbox>
          </div>

          <div className={styles.filterItem}>
            <Checkbox
              checked={rankFilter.enabled}
              onChange={(e) => setRankFilter({ ...rankFilter, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>OTU排名过滤</Text>
            </Checkbox>
          </div>

          <div className={styles.filterItem}>
            <Checkbox
              checked={removeChloroplast.enabled}
              onChange={(e) => setRemoveChloroplast({ ...removeChloroplast, enabled: e.target.checked })}
              disabled={isViewMode}
            >
              <Text strong>去除比对到叶绿体和线粒体序列的OTU</Text>
            </Checkbox>
          </div>
        </div>

        <Divider />

        {/* 数据表格区域 */}
        <div className={styles.tableSection}>
          <div className={styles.tableToolbar}>
            <Space>
              <Text strong>层级切换：</Text>
              <Select
                value={hierarchyLevel}
                onChange={setHierarchyLevel}
                style={{ width: 120 }}
              >
                <Option value="OTU">OTU</Option>
                <Option value="Phylum">Phylum</Option>
                <Option value="Class">Class</Option>
                <Option value="Order">Order</Option>
                <Option value="Family">Family</Option>
                <Option value="Genus">Genus</Option>
                <Option value="Species">Species</Option>
              </Select>
            </Space>
            <Space>
              <Input
                placeholder="请输入内容"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<DownloadOutlined />}>下载表格</Button>
              <Button icon={<ReloadOutlined />}>表格刷新</Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={otuData}
            pagination={{
              total: otuData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            bordered
            scroll={{ x: 2000 }}
            size="small"
          />
        </div>

        {/* 底部信息和按钮 */}
        <div className={styles.footer}>
          <Text strong>OTU表格名称: </Text>
          <Text>{tableName}</Text>
          <Button onClick={handleBack} style={{ marginLeft: 24 }}>
            返回
          </Button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default OTUFilterDetail;