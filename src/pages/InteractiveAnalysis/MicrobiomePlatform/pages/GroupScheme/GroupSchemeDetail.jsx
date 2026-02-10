import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Input,
  Checkbox,
  Table,
  Space,
  Select,
  Card,
  message,
  Typography,
  Divider,
} from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate';
import styles from './GroupSchemeDetail.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * 分组方案详情页面（查看/编辑/新建）
 * 复刻自: https://www.omicsmart.com/16SNew/home.html#/group/checkGroup
 */
const GroupSchemeDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view'; // view, edit, create
  const id = searchParams.get('id');

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  // 状态管理
  const [groupName, setGroupName] = useState('testaaaaccd');
  const [sampleSearch, setSampleSearch] = useState('');
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [tableSearch, setTableSearch] = useState('');

  // 所有样本列表
  const allSamples = [
    'A-1', 'A-2', 'A-3', 'A-4', 'A-5', 'A-6',
    'B-1', 'B-2', 'B-3', 'B-4', 'B-5', 'B-6',
    'C-1', 'C-2', 'C-3', 'C-4', 'C-5', 'C-6',
  ];

  // 样本分组数据
  const [sampleGroupData, setSampleGroupData] = useState([
    { key: '1', originalName: 'A-1', newName: 'A-1', groupName: 'A' },
    { key: '2', originalName: 'A-2', newName: 'A-2', groupName: 'A' },
    { key: '3', originalName: 'A-3', newName: 'A-3', groupName: 'B' },
    { key: '4', originalName: 'A-4', newName: 'A-4', groupName: 'B' },
    { key: '5', originalName: 'A-5', newName: 'A-5', groupName: 'C' },
    { key: '6', originalName: 'A-6', newName: 'A-6', groupName: 'C' },
    { key: '7', originalName: 'B-1', newName: 'B-1', groupName: 'F' },
    { key: '8', originalName: 'B-2', newName: 'B-2', groupName: 'F' },
  ]);

  // 比较方案
  const [singleComparison, setSingleComparison] = useState({
    enabled: true,
    sample1: 'A-1',
    sample2: 'A-3',
  });

  const [pairwiseComparison, setPairwiseComparison] = useState({
    enabled: true,
    group1: 'B',
    group2: 'D',
  });

  const [multiGroupComparison, setMultiGroupComparison] = useState({
    enabled: true,
    groups: ['A', 'B', 'C'],
  });

  // 表格列定义
  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: (_, record) => (
        <Checkbox disabled={isViewMode} />
      ),
    },
    {
      title: '样本名称',
      dataIndex: 'originalName',
      key: 'originalName',
      width: 150,
    },
    {
      title: (
        <Space>
          <span>新样本名称</span>
          {!isViewMode && (
            <Button size="small" disabled={isViewMode}>
              调整样本顺序
            </Button>
          )}
        </Space>
      ),
      dataIndex: 'newName',
      key: 'newName',
      render: (text, record) => (
        <Input
          value={text}
          disabled={isViewMode}
          onChange={(e) => {
            const newData = [...sampleGroupData];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].newName = e.target.value;
            setSampleGroupData(newData);
          }}
        />
      ),
    },
    {
      title: (
        <Space>
          <span>分组名称</span>
          {!isViewMode && (
            <Button size="small" disabled={isViewMode}>
              调整分组顺序
            </Button>
          )}
        </Space>
      ),
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text, record) => (
        <Input
          value={text}
          disabled={isViewMode}
          onChange={(e) => {
            const newData = [...sampleGroupData];
            const index = newData.findIndex(item => item.key === record.key);
            newData[index].groupName = e.target.value;
            setSampleGroupData(newData);
          }}
        />
      ),
    },
  ];

  // 处理返回
  const handleBack = () => {
    navigate('/interactive-analysis/microbiome/group-scheme');
  };

  // 过滤样本数据
  const filteredSampleData = sampleGroupData.filter(item =>
    item.originalName.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.newName.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.groupName.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <PageTemplate pageTitle="分组方案">
      <div className={styles.detailContainer}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
            >
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              {isViewMode && '● 查看分组'}
              {isEditMode && '● 编辑分组'}
              {isCreateMode && '● 新建分组'}
            </Title>
          </Space>
        </div>

        <Divider />

        {/* 1. 分组方案名称 */}
        <Card className={styles.section}>
          <div className={styles.sectionTitle}>
            <Text strong>1、分组方案名称</Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (由字母、数字、下划线和"-"组成,只能以字母开头)
            </Text>
          </div>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={isViewMode}
            placeholder="请输入分组方案名称"
            style={{ maxWidth: 400 }}
          />
        </Card>

        {/* 2. 样本选择 */}
        <Card className={styles.section}>
          <div className={styles.sectionTitle}>
            <Text strong>2、样本选择</Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (选择需要进行分析的样本)
            </Text>
          </div>
          <div className={styles.sampleSelection}>
            <div className={styles.sampleToolbar}>
              <Checkbox disabled={isViewMode}>全选</Checkbox>
              <Input
                placeholder="请输入搜索内容"
                prefix={<SearchOutlined />}
                value={sampleSearch}
                onChange={(e) => setSampleSearch(e.target.value)}
                disabled={isViewMode}
                style={{ width: 200 }}
              />
            </div>
            <div className={styles.sampleList}>
              {allSamples
                .filter(sample => sample.toLowerCase().includes(sampleSearch.toLowerCase()))
                .map(sample => (
                  <Checkbox
                    key={sample}
                    disabled={isViewMode}
                    checked={selectedSamples.includes(sample)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSamples([...selectedSamples, sample]);
                      } else {
                        setSelectedSamples(selectedSamples.filter(s => s !== sample));
                      }
                    }}
                  >
                    {sample}
                  </Checkbox>
                ))}
            </div>
            <Button type="primary" disabled={isViewMode} style={{ marginTop: 12 }}>
              确认
            </Button>
          </div>
        </Card>

        {/* 3. 样本分组 */}
        <Card className={styles.section}>
          <div className={styles.sectionTitle}>
            <Text strong>3、样本分组</Text>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (对已选择的样本进行分组；样本名称、分组名称只能包括字母、数字、横线、下划线，且要以字母开头)
            </Text>
          </div>
          <div className={styles.tableToolbar}>
            <Button disabled={isViewMode}>移除选中的样本</Button>
            <Input
              placeholder="请输入搜索内容"
              prefix={<SearchOutlined />}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              disabled={isViewMode}
              style={{ width: 200 }}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredSampleData}
            pagination={false}
            bordered
            size="small"
            className={styles.sampleTable}
          />
        </Card>

        {/* 4. 单样品比较 */}
        <Card className={styles.section}>
          <div className={styles.comparisonSection}>
            <Checkbox
              checked={singleComparison.enabled}
              onChange={(e) => setSingleComparison({ ...singleComparison, enabled: e.target.checked })}
            >
              <Text strong>4、单样品比较</Text>
            </Checkbox>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              请勾选需要提交的比较
            </Text>
          </div>
          <Space style={{ marginTop: 12 }}>
            <Select
              value={singleComparison.sample1}
              onChange={(value) => setSingleComparison({ ...singleComparison, sample1: value })}
              disabled={isViewMode}
              style={{ width: 120 }}
            >
              {allSamples.map(sample => (
                <Option key={sample} value={sample}>{sample}</Option>
              ))}
            </Select>
            <Text>VS</Text>
            <Select
              value={singleComparison.sample2}
              onChange={(value) => setSingleComparison({ ...singleComparison, sample2: value })}
              disabled={isViewMode}
              style={{ width: 120 }}
            >
              {allSamples.map(sample => (
                <Option key={sample} value={sample}>{sample}</Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* 5. 两两组间比较 */}
        <Card className={styles.section}>
          <div className={styles.comparisonSection}>
            <Checkbox
              checked={pairwiseComparison.enabled}
              onChange={(e) => setPairwiseComparison({ ...pairwiseComparison, enabled: e.target.checked })}
            >
              <Text strong>5、两两组间比较</Text>
            </Checkbox>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              样品少于2个的分组不能做该比较
            </Text>
          </div>
          <Space style={{ marginTop: 12 }}>
            <Select
              value={pairwiseComparison.group1}
              onChange={(value) => setPairwiseComparison({ ...pairwiseComparison, group1: value })}
              disabled={isViewMode}
              style={{ width: 120 }}
            >
              {['A', 'B', 'C', 'D', 'E', 'F'].map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
            <Text>VS</Text>
            <Select
              value={pairwiseComparison.group2}
              onChange={(value) => setPairwiseComparison({ ...pairwiseComparison, group2: value })}
              disabled={isViewMode}
              style={{ width: 120 }}
            >
              {['A', 'B', 'C', 'D', 'E', 'F'].map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* 6. 多组组间比较 */}
        <Card className={styles.section}>
          <div className={styles.comparisonSection}>
            <Checkbox
              checked={multiGroupComparison.enabled}
              onChange={(e) => setMultiGroupComparison({ ...multiGroupComparison, enabled: e.target.checked })}
            >
              <Text strong>6、多组组间比较</Text>
            </Checkbox>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              样品少于2个的分组不能做该比较
            </Text>
          </div>
          <Space style={{ marginTop: 12 }}>
            {multiGroupComparison.groups.map((group, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Text>VS</Text>}
                <Select
                  value={group}
                  onChange={(value) => {
                    const newGroups = [...multiGroupComparison.groups];
                    newGroups[index] = value;
                    setMultiGroupComparison({ ...multiGroupComparison, groups: newGroups });
                  }}
                  disabled={isViewMode}
                  style={{ width: 120 }}
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(g => (
                    <Option key={g} value={g}>{g}</Option>
                  ))}
                </Select>
              </React.Fragment>
            ))}
          </Space>
        </Card>

        {/* 底部按钮 */}
        <div className={styles.footer}>
          <Button onClick={handleBack}>返回</Button>
          {!isViewMode && (
            <Button
              type="primary"
              onClick={() => {
                message.success('保存成功');
                handleBack();
              }}
              style={{ marginLeft: 12 }}
            >
              保存
            </Button>
          )}
        </div>
      </div>
    </PageTemplate>
  );
};

export default GroupSchemeDetail;