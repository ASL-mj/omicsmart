import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Select,
  Checkbox,
  Input,
  Radio,
  Space,
  Typography,
  Divider,
  InputNumber,
  Tooltip,
  message,
  Form,
} from 'antd';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate';
import styles from './OTUFilterForm.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * OTU筛选表单页面（新增表格）
 * 复刻自图片中的表单页面
 */
const OTUFilterForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 物种过滤
  const [speciesFilterEnabled, setSpeciesFilterEnabled] = useState(true);
  const [speciesAction, setSpeciesAction] = useState('只保留');
  const [speciesLevel, setSpeciesLevel] = useState(undefined);
  const [selectedSpecies, setSelectedSpecies] = useState([]);

  // OTU过滤
  const [otuFilterEnabled, setOtuFilterEnabled] = useState(true);
  const [otuList, setOtuList] = useState('');

  // 抽平
  const [rarefactionEnabled, setRarefactionEnabled] = useState(true);
  const [rarefactionMode, setRarefactionMode] = useState('最小丰度');
  const [rarefactionValue, setRarefactionValue] = useState(undefined);

  // OTU绝对丰度筛选（tag总数）
  const [tagFilterEnabled, setTagFilterEnabled] = useState(true);
  const [tagFilterOption, setTagFilterOption] = useState('1');
  const [tagFilterValue, setTagFilterValue] = useState(undefined);

  // OTU绝对丰度筛选（样本频率+tag数）
  const [sampleFreqEnabled, setSampleFreqEnabled] = useState(true);
  const [sampleFreqMode, setSampleFreqMode] = useState('至少1个');
  const [sampleFreqValue, setSampleFreqValue] = useState(undefined);
  const [tagCountMode, setTagCountMode] = useState('0');
  const [tagCountValue, setTagCountValue] = useState(undefined);

  // OTU排名过滤
  const [rankFilterEnabled, setRankFilterEnabled] = useState(true);
  const [rankFilterValue, setRankFilterValue] = useState('3000');
  const [rankFilterCustom, setRankFilterCustom] = useState(undefined);

  // 去除叶绿体和线粒体
  const [removeChloroplastEnabled, setRemoveChloroplastEnabled] = useState(false);

  // OTU表格名称
  const [tableName, setTableName] = useState('');

  // 处理提交
  const handleSubmit = () => {
    if (!tableName.trim()) {
      message.error('请输入OTU表格名称');
      return;
    }
    
    message.success('OTU表格创建成功！');
    navigate('/interactive-analysis/microbiome/otu-filter');
  };

  // 可用物种列表
  const availableSpecies = [
    'c__ABY1',
    'c__Acidimicrobiia',
    'c__Acidobacteriia',
    'c__Actinobacteria',
  ];

  return (
    <PageTemplate pageTitle="OTU筛选">
      <div className={styles.formContainer}>
        {/* 标题 */}
        <div className={styles.header}>
          <Title level={4}>● 新增表格</Title>
        </div>

        <Divider />

        {/* 表单区域 */}
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>选择过滤条件</div>

          {/* 分组方案 */}
          <div className={styles.formItem}>
            <Text strong className={styles.label}>分组方案:</Text>
            <Select
              placeholder="请选择"
              style={{ width: 200 }}
              onChange={(value) => form.setFieldValue('groupScheme', value)}
            >
              <Option value="testaaaaccd">testaaaaccd</Option>
              <Option value="20250818">20250818</Option>
            </Select>
          </div>

          {/* 物种过滤 */}
          <div className={styles.formItem}>
            <Checkbox
              checked={speciesFilterEnabled}
              onChange={(e) => setSpeciesFilterEnabled(e.target.checked)}
            >
              <Text strong>物种过滤</Text>
            </Checkbox>
            <Tooltip title="根据物种分类信息过滤OTU">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {speciesFilterEnabled && (
            <div className={styles.subFormItem}>
              <Space size="middle" wrap>
                <Select
                  value={speciesAction}
                  onChange={setSpeciesAction}
                  style={{ width: 100 }}
                >
                  <Option value="只保留">只保留</Option>
                  <Option value="去除">去除</Option>
                </Select>
                <Select
                  placeholder="请选择"
                  value={speciesLevel}
                  onChange={setSpeciesLevel}
                  style={{ width: 100 }}
                >
                  <Option value="Phylum">Phylum</Option>
                  <Option value="Class">Class</Option>
                  <Option value="Order">Order</Option>
                  <Option value="Family">Family</Option>
                  <Option value="Genus">Genus</Option>
                </Select>
                <Text>水平分类的</Text>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  value={selectedSpecies}
                  onChange={setSelectedSpecies}
                  style={{ width: 300 }}
                  maxTagCount="responsive"
                >
                  {availableSpecies.map(species => (
                    <Option key={species} value={species}>{species}</Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="small"
                  style={{ backgroundColor: '#52c41a' }}
                />
              </Space>
            </div>
          )}

          {/* OTU过滤 */}
          <div className={styles.formItem}>
            <Checkbox
              checked={otuFilterEnabled}
              onChange={(e) => setOtuFilterEnabled(e.target.checked)}
            >
              <Text strong>OTU过滤</Text>
            </Checkbox>
            <Tooltip title="根据OTU ID过滤">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {otuFilterEnabled && (
            <div className={styles.subFormItem}>
              <Input.TextArea
                placeholder="请输入OTU ID，多个ID用逗号或换行分隔"
                value={otuList}
                onChange={(e) => setOtuList(e.target.value)}
                rows={4}
                style={{ width: '100%', maxWidth: 600 }}
              />
            </div>
          )}

          {/* 抽平 */}
          <div className={styles.formItem}>
            <Checkbox
              checked={rarefactionEnabled}
              onChange={(e) => setRarefactionEnabled(e.target.checked)}
            >
              <Text strong>抽平</Text>
            </Checkbox>
            <Tooltip title="将所有样本的序列数抽平到相同水平">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {rarefactionEnabled && (
            <div className={styles.subFormItem}>
              <Radio.Group value={rarefactionMode} onChange={(e) => setRarefactionMode(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="最小丰度">最小丰度</Radio>
                  <Radio value="自定义">
                    <Space>
                      自定义
                      {rarefactionMode === '自定义' && (
                        <InputNumber
                          min={1}
                          value={rarefactionValue}
                          onChange={setRarefactionValue}
                          placeholder="请输入数值"
                        />
                      )}
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          )}

          {/* OTU绝对丰度筛选（tag总数） */}
          <div className={styles.formItem}>
            <Checkbox
              checked={tagFilterEnabled}
              onChange={(e) => setTagFilterEnabled(e.target.checked)}
            >
              <Text strong>OTU绝对丰度筛选（tag总数）</Text>
            </Checkbox>
            <Tooltip title="根据OTU的总tag数进行筛选">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {tagFilterEnabled && (
            <div className={styles.subFormItem}>
              <Radio.Group value={tagFilterOption} onChange={(e) => setTagFilterOption(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="5">5</Radio>
                  <Radio value="自定义">
                    <Space>
                      自定义
                      {tagFilterOption === '自定义' && (
                        <InputNumber
                          min={1}
                          value={tagFilterValue}
                          onChange={setTagFilterValue}
                          placeholder="请输入数值"
                        />
                      )}
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          )}

          {/* OTU绝对丰度筛选（样本频率+tag数） */}
          <div className={styles.formItem}>
            <Checkbox
              checked={sampleFreqEnabled}
              onChange={(e) => setSampleFreqEnabled(e.target.checked)}
            >
              <Text strong>OTU绝对丰度筛选（样本频率+tag数）</Text>
            </Checkbox>
            <Tooltip title="根据样本频率和tag数进行筛选">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {sampleFreqEnabled && (
            <div className={styles.subFormItem}>
              <Space direction="vertical" size="middle">
                <Space>
                  <Text>样本频率:</Text>
                  <Radio.Group value={sampleFreqMode} onChange={(e) => setSampleFreqMode(e.target.value)}>
                    <Radio value="至少1个">至少1个</Radio>
                    <Radio value="至少2个">至少2个</Radio>
                    <Radio value="所有">所有</Radio>
                    <Radio value="自定义">
                      自定义
                      {sampleFreqMode === '自定义' && (
                        <InputNumber
                          min={1}
                          value={sampleFreqValue}
                          onChange={setSampleFreqValue}
                          placeholder="请输入"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </Radio>
                  </Radio.Group>
                </Space>
                <Space>
                  <Text>Tag数:</Text>
                  <Radio.Group value={tagCountMode} onChange={(e) => setTagCountMode(e.target.value)}>
                    <Radio value="0">0</Radio>
                    <Radio value="大于等于1">大于等于1</Radio>
                    <Radio value="大于等于2">大于等于2</Radio>
                    <Radio value="自定义">
                      自定义
                      {tagCountMode === '自定义' && (
                        <InputNumber
                          min={0}
                          value={tagCountValue}
                          onChange={setTagCountValue}
                          placeholder="请输入"
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </Radio>
                  </Radio.Group>
                </Space>
              </Space>
            </div>
          )}

          {/* OTU排名过滤 */}
          <div className={styles.formItem}>
            <Checkbox
              checked={rankFilterEnabled}
              onChange={(e) => setRankFilterEnabled(e.target.checked)}
            >
              <Text strong>OTU排名过滤</Text>
            </Checkbox>
            <Tooltip title="保留丰度排名前N的OTU">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>

          {rankFilterEnabled && (
            <div className={styles.subFormItem}>
              <Radio.Group value={rankFilterValue} onChange={(e) => setRankFilterValue(e.target.value)}>
                <Space>
                  <Radio value="3000">3000</Radio>
                  <Radio value="1000">1000</Radio>
                  <Radio value="500">500</Radio>
                  <Radio value="自定义">
                    自定义
                    {rankFilterValue === '自定义' && (
                      <InputNumber
                        min={1}
                        value={rankFilterCustom}
                        onChange={setRankFilterCustom}
                        placeholder="请输入"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          )}

          {/* 去除叶绿体和线粒体序列的OTU */}
          <div className={styles.formItem}>
            <Checkbox
              checked={removeChloroplastEnabled}
              onChange={(e) => setRemoveChloroplastEnabled(e.target.checked)}
            >
              <Text strong>去除比对到叶绿体和线粒体序列的OTU</Text>
            </Checkbox>
            <Tooltip title="去除叶绿体(Chloroplast)和线粒体(Mitochondria)相关的OTU">
              <QuestionCircleOutlined className={styles.helpIcon} />
            </Tooltip>
          </div>
        </div>

        <Divider />

        {/* 底部表格名称和提交按钮 */}
        <div className={styles.footer}>
          <Space size="large">
            <Space>
              <Text strong>OTU表格名称:</Text>
              <Input
                placeholder="请输入表格名称"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                style={{ width: 200 }}
              />
            </Space>
            <Button type="primary" onClick={handleSubmit}>
              完成筛选
            </Button>
          </Space>
        </div>
      </div>
    </PageTemplate>
  );
};

export default OTUFilterForm;