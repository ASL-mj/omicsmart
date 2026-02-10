import React from 'react';
import { Alert, Typography, Card, Table } from 'antd';
import { InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import PageTemplate from '../../components/PageTemplate';
import styles from './index.module.css';

// 导入图片
import labFlowImg from './images/lab_flow.png';
import analysisFlowImg from './images/analysis_flow.png';
import readsFillImg from './images/reads_fill.png';
import readsStackImg from './images/reads_stack.png';
import tagsOtusCountImg from './images/tags_otus_count.png';

const { Title, Paragraph, Text } = Typography;

/**
 * 质控报告页面
 * 复刻自: https://www.omicsmart.com/16SNew/home.html#/qualityReport
 */
const QCReport = () => {
  // 项目概述数据
  const projectInfoData = [
    { key: '1', label: '项目编号', value: '16S_newdemo' },
    { key: '2', label: '扩增子类型', value: '16S' },
    { key: '3', label: 'sequence_target', value: '16S' },
    { key: '4', label: '测序区域', value: 'V3+V4' },
    { key: '5', label: '聚类方法', value: 'Usearch' },
    { key: '6', label: '样品信息', value: 'A-1¦A-2¦A-3¦A-4¦A-5¦A-6¦B-1¦B-2¦B-3¦B-4¦B-5¦B-6¦C-1¦C-2¦C-3¦C-4¦C-5¦C-6' },
    { key: '7', label: '分组方案', value: 'A:A-1&A-2&A-3&A-4&A-5&A-6¦B:B-1&B-2&B-3&B-4&B-5&B-6¦C:C-1&C-2&C-3&C-4&C-5&C-6' },
    { key: '8', label: '两组差异分析方案', value: 'A-vs-B' },
    { key: '9', label: '多组差异分析方案', value: 'A-vs-C-vs-B' },
  ];

  // Tags详细信息表数据
  const tagsInfoColumns = [
    { title: 'SampleID', dataIndex: 'sampleId', key: 'sampleId', width: 100 },
    { title: 'Tags Number', dataIndex: 'tagsNumber', key: 'tagsNumber', width: 120 },
    { title: 'Total length', dataIndex: 'totalLength', key: 'totalLength', width: 120 },
    { title: 'Max length', dataIndex: 'maxLength', key: 'maxLength', width: 100 },
    { title: 'Min length', dataIndex: 'minLength', key: 'minLength', width: 100 },
    { title: 'N50', dataIndex: 'n50', key: 'n50', width: 80 },
    { title: 'N90', dataIndex: 'n90', key: 'n90', width: 80 },
  ];

  const tagsInfoData = [
    { key: '1', sampleId: 'A-1', tagsNumber: 134512, totalLength: 61623834, maxLength: 470, minLength: 316, n50: 461, n90: 441 },
    { key: '2', sampleId: 'A-2', tagsNumber: 130821, totalLength: 60009287, maxLength: 474, minLength: 351, n50: 461, n90: 441 },
    { key: '3', sampleId: 'A-3', tagsNumber: 153205, totalLength: 70234771, maxLength: 474, minLength: 343, n50: 461, n90: 441 },
    { key: '4', sampleId: 'A-4', tagsNumber: 146466, totalLength: 67170379, maxLength: 470, minLength: 356, n50: 461, n90: 441 },
    { key: '5', sampleId: 'A-5', tagsNumber: 126533, totalLength: 57941289, maxLength: 470, minLength: 374, n50: 461, n90: 441 },
    { key: '6', sampleId: 'A-6', tagsNumber: 138641, totalLength: 63379812, maxLength: 470, minLength: 404, n50: 461, n90: 441 },
    { key: '7', sampleId: 'B-1', tagsNumber: 133864, totalLength: 60856254, maxLength: 471, minLength: 314, n50: 461, n90: 441 },
    { key: '8', sampleId: 'B-2', tagsNumber: 128926, totalLength: 58558037, maxLength: 470, minLength: 353, n50: 461, n90: 441 },
    { key: '9', sampleId: 'B-3', tagsNumber: 136640, totalLength: 62107292, maxLength: 469, minLength: 351, n50: 461, n90: 441 },
    { key: '10', sampleId: 'B-4', tagsNumber: 145691, totalLength: 66164396, maxLength: 469, minLength: 302, n50: 461, n90: 441 },
    { key: '11', sampleId: 'B-5', tagsNumber: 125745, totalLength: 57167893, maxLength: 472, minLength: 336, n50: 461, n90: 441 },
    { key: '12', sampleId: 'B-6', tagsNumber: 121821, totalLength: 55409050, maxLength: 470, minLength: 383, n50: 461, n90: 441 },
    { key: '13', sampleId: 'C-1', tagsNumber: 164699, totalLength: 74722036, maxLength: 472, minLength: 304, n50: 460, n90: 441 },
    { key: '14', sampleId: 'C-2', tagsNumber: 159048, totalLength: 72102323, maxLength: 469, minLength: 319, n50: 460, n90: 441 },
    { key: '15', sampleId: 'C-3', tagsNumber: 143865, totalLength: 65155103, maxLength: 469, minLength: 423, n50: 446, n90: 441 },
    { key: '16', sampleId: 'C-4', tagsNumber: 144628, totalLength: 65578211, maxLength: 469, minLength: 338, n50: 460, n90: 441 },
    { key: '17', sampleId: 'C-5', tagsNumber: 136746, totalLength: 61942534, maxLength: 469, minLength: 338, n50: 446, n90: 441 },
    { key: '18', sampleId: 'C-6', tagsNumber: 142661, totalLength: 64618369, maxLength: 469, minLength: 336, n50: 446, n90: 441 },
  ];

  // OTUs和Tags数量统计表数据
  const otusTagsColumns = [
    { title: 'SampleID', dataIndex: 'sampleId', key: 'sampleId', width: 100 },
    { title: 'Total Tags', dataIndex: 'totalTags', key: 'totalTags', width: 100 },
    { title: 'Unique Tags', dataIndex: 'uniqueTags', key: 'uniqueTags', width: 110 },
    { title: 'Taxon Tags', dataIndex: 'taxonTags', key: 'taxonTags', width: 110 },
    { title: 'Unclassified Tags', dataIndex: 'unclassifiedTags', key: 'unclassifiedTags', width: 140 },
    { title: 'Singleton Tags', dataIndex: 'singletonTags', key: 'singletonTags', width: 130 },
    { title: 'OTUs', dataIndex: 'otus', key: 'otus', width: 80 },
  ];

  const otusTagsData = [
    { key: '1', sampleId: 'A-1', totalTags: 134512, uniqueTags: 61903, taxonTags: 130125, unclassifiedTags: 0, singletonTags: 4387, otus: 1054 },
    { key: '2', sampleId: 'A-2', totalTags: 130821, uniqueTags: 60219, taxonTags: 127575, unclassifiedTags: 0, singletonTags: 3246, otus: 1232 },
    { key: '3', sampleId: 'A-3', totalTags: 153205, uniqueTags: 69043, taxonTags: 149807, unclassifiedTags: 0, singletonTags: 3398, otus: 1386 },
    { key: '4', sampleId: 'A-4', totalTags: 146466, uniqueTags: 67607, taxonTags: 142620, unclassifiedTags: 0, singletonTags: 3846, otus: 1294 },
    { key: '5', sampleId: 'A-5', totalTags: 126533, uniqueTags: 54829, taxonTags: 124900, unclassifiedTags: 0, singletonTags: 1633, otus: 1051 },
    { key: '6', sampleId: 'A-6', totalTags: 138641, uniqueTags: 58906, taxonTags: 136705, unclassifiedTags: 0, singletonTags: 1936, otus: 1206 },
    { key: '7', sampleId: 'B-1', totalTags: 133864, uniqueTags: 56132, taxonTags: 132497, unclassifiedTags: 0, singletonTags: 1367, otus: 1260 },
    { key: '8', sampleId: 'B-2', totalTags: 128926, uniqueTags: 55813, taxonTags: 127564, unclassifiedTags: 0, singletonTags: 1362, otus: 1263 },
    { key: '9', sampleId: 'B-3', totalTags: 136640, uniqueTags: 57351, taxonTags: 135366, unclassifiedTags: 0, singletonTags: 1274, otus: 1271 },
    { key: '10', sampleId: 'B-4', totalTags: 145691, uniqueTags: 61284, taxonTags: 143764, unclassifiedTags: 0, singletonTags: 1927, otus: 1349 },
    { key: '11', sampleId: 'B-5', totalTags: 125745, uniqueTags: 54163, taxonTags: 124394, unclassifiedTags: 0, singletonTags: 1351, otus: 1200 },
    { key: '12', sampleId: 'B-6', totalTags: 121821, uniqueTags: 51874, taxonTags: 120434, unclassifiedTags: 0, singletonTags: 1387, otus: 1237 },
    { key: '13', sampleId: 'C-1', totalTags: 164699, uniqueTags: 83418, taxonTags: 158378, unclassifiedTags: 0, singletonTags: 6321, otus: 1694 },
    { key: '14', sampleId: 'C-2', totalTags: 159048, uniqueTags: 75656, taxonTags: 154948, unclassifiedTags: 0, singletonTags: 4100, otus: 1694 },
    { key: '15', sampleId: 'C-3', totalTags: 143865, uniqueTags: 68303, taxonTags: 141130, unclassifiedTags: 0, singletonTags: 2735, otus: 1583 },
    { key: '16', sampleId: 'C-4', totalTags: 144628, uniqueTags: 71498, taxonTags: 140901, unclassifiedTags: 0, singletonTags: 3727, otus: 1771 },
    { key: '17', sampleId: 'C-5', totalTags: 136746, uniqueTags: 65156, taxonTags: 134766, unclassifiedTags: 0, singletonTags: 1980, otus: 1629 },
    { key: '18', sampleId: 'C-6', totalTags: 142661, uniqueTags: 65156, taxonTags: 134766, unclassifiedTags: 0, singletonTags: 1980, otus: 1629 },
    { key: '19', sampleId: 'Avg', totalTags: 139520, uniqueTags: 63126, taxonTags: 136816, unclassifiedTags: 0, singletonTags: 2704, otus: 1363 },
  ];

  return (
    <PageTemplate pageTitle="质控报告">
      <div className={styles.qcReportContainer}>
        {/* 提示信息 */}
        <Alert
          message="当前为体验账号，可在【首个分析模块】进行部分功能的体验，其他功能需购买产品后使用！"
          type="warning"
          showIcon
          icon={<InfoCircleOutlined />}
          className={styles.alertBanner}
        />

        {/* 主要内容区域 */}
        <div className={styles.contentWrapper}>
          {/* 项目概述 */}
          <section className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>项目概述</Title>
            <Table
              dataSource={projectInfoData}
              columns={[
                { title: '', dataIndex: 'label', key: 'label', width: 200 },
                { title: '', dataIndex: 'value', key: 'value' },
              ]}
              pagination={false}
              showHeader={false}
              bordered
              size="small"
              className={styles.projectInfoTable}
            />
          </section>

          {/* 技术介绍 */}
          <section className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>技术介绍</Title>
            <div className={styles.textContent}>
              <Paragraph>
                微生物多样性扩增子测序是一种利用高通量测序技术对16S、18S、ITS等微生物特征序列进行PCR扩增并测序分析的研究方法。此类方法不需要对微生物进行分离纯化培养，基于提取的总DNA即可开展丰富的微生物群落研究，在医学、工业、食品、环境科学等各领域都有十分广泛的应用。
              </Paragraph>
              <Paragraph>
                <Text strong>16S rDNA</Text>（即16S rRNA gene）是原核生物核糖体RNA对应的基因片段，常用于细菌、古菌的多样性分析。
              </Paragraph>
              <Paragraph>
                <Text strong>18S rDNA</Text>是真核生物核糖体小亚基rRNA对应的基因片段，常用于藻类、线虫等的多样性分析。
              </Paragraph>
              <Paragraph>
                <Text strong>ITS</Text>是核糖体基因片段上的转录间隔区（internal transcribed spacer），位于真核生物核糖体DNA的18S 和28S 基因之间，主要包括ITS1和ITS2。常用于真菌多样性分析。
              </Paragraph>
            </div>
          </section>

          {/* 实验流程 */}
          <section className={styles.section}>
            <Title level={3} className={styles.subsectionTitle}>实验流程</Title>
            <div className={styles.textContent}>
              <Paragraph>
                从样本中提取基因组DNA后，用带有barcode的特异引物扩增16S rDNA的V3 + V4区。引物序列为: 341F:CCTACGGGNGGCWGCAG;806R:GGACTACHVGGGTATCTAAT。 将纯化后的扩增产物（即扩增子）连接测序接头，构建测序文库，Illumina上机测序。
              </Paragraph>
            </div>
            
            <Card className={styles.imageCard}>
              <img src={labFlowImg} alt="实验流程图" className={styles.flowImage} />
              <div className={styles.imageCaption}>Fig 2-1-1 实验流程图</div>
            </Card>
          </section>

          {/* 信息分析流程 */}
          <section className={styles.section}>
            <Title level={3} className={styles.subsectionTitle}>信息分析流程</Title>
            <div className={styles.textContent}>
              <Paragraph>
                微生物多样性研究主要分为alpha、beta多样性研究、物种分析、功能研究、环境关系研究6大部分。测序得到raw Reads之后，我们提供两种分析策略可选，基于Usearch软件或者基于DADA2软件。
              </Paragraph>
              <Paragraph>
                若选择Usearch软件，我们先对低质量Reads进行过滤，然后将双端Reads拼接为Tag，再对Tag进行低质量过滤，得到的数据称为Clean Tag。接下来基于Clean Tag，使用Usearch软件进行聚类，去除聚类过程中检测到的嵌合体Tag，获得OTU的丰度和OTU代表序列。
              </Paragraph>
              <Paragraph>
                若选择DADA2软件，我们先使用DADA2对Reads进行过滤、校正，并输出非冗余的Reads和对应的丰度信息，然后将Reads拼接为Tag，再去除嵌合体Tag，获得用于后续分析的Tag序列和丰度，即ASV序列和ASV丰度信息。
              </Paragraph>
              <Paragraph>
                基于OTU或ASV的序列、丰度数据，开展物种注释、物种组成分析、指示物种分析、α多样性分析、β多样性分析、群落功能预测等。若存在有效分组，则进行组间差异比较和统计检验。最后，结合其他因素（例如环境因子），进行特定的例如CCA等高级分析，以解答微生物与环境之间的关系。
              </Paragraph>
            </div>

            <Card className={styles.imageCard}>
              <img src={analysisFlowImg} alt="信息分析流程图" className={styles.flowImage} />
              <div className={styles.imageCaption}>Fig 2-2-1 信息分析流程图</div>
            </Card>

            <Alert
              message={
                <div>
                  <Paragraph style={{ margin: 0 }}>
                    项目总体分析流程，带*为高级分析，其它为满足有效分组条件下的常规流程分析。样品数小于3个，不能进行Beta Diversity分析，所有差异分析和环境因子关联分析；若无分组信息或者生物学重复少于3个，则不能进行所有差异分析和环境因子关联分析；环境因子关联分析需要客户提供环境因子数据。
                  </Paragraph>
                  <Paragraph style={{ margin: '8px 0 0 0' }}>
                    <Text strong>提示：</Text>样品数小于3个，不能进行Beta Diversity分析、所有差异分析、环境因子关联分析；若无分组信息或者生物学重复少于3个，则不能进行所有差异分析、环境因子关联分析；环境因子关联分析需要客户上传环境因子数据。
                  </Paragraph>
                </div>
              }
              type="info"
              showIcon
              className={styles.infoAlert}
            />
          </section>

          {/* 数据处理 */}
          <section className={styles.section}>
            <Title level={3} className={styles.subsectionTitle}>数据处理</Title>
            <div className={styles.textContent}>
              <Paragraph>
                测序得到原始数据后，由于PCR错误、测序错误等会产生大量的低质量数据或者无生物学意义数据（例如嵌合体）， 因此为保证后续分析具有统计可靠性和生物学有效性，我们在Reads利用、Tags拼接、OTU（Operational Taxonomic Units）聚类等多个数据处理过程进行严格的质控。
              </Paragraph>
            </div>

            <Card className={styles.imageCard}>
              <img src={readsFillImg} alt="数据预处理分布图（百分比）" className={styles.chartImage} />
              <div className={styles.imageCaption}>Fig 3-1-1 数据预处理分布图（百分比）</div>
            </Card>

            <Card className={styles.imageCard}>
              <img src={readsStackImg} alt="数据预处理分布图（数值）" className={styles.chartImage} />
              <div className={styles.imageCaption}>Fig 3-1-2 数据预处理分布图（数值）</div>
            </Card>
          </section>

          {/* Tags丰度统计 */}
          <section className={styles.section}>
            <Title level={3} className={styles.subsectionTitle}>Tags丰度统计</Title>
            <div className={styles.textContent}>
              <Paragraph>
                Tags的数目和丰度情况与测序数据量、样本类型等存在密切关系，对各样本的Effective Tags总数、长度等基础信息统计有利于了解样本背景。
              </Paragraph>
              <Paragraph>Effective Tags的统计信息如下：</Paragraph>
            </div>

            <Table
              dataSource={tagsInfoData}
              columns={tagsInfoColumns}
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 800 }}
              className={styles.dataTable}
            />

            <div className={styles.tableDescription}>
              <Text strong>表格说明：</Text>
              <ul className={styles.descriptionList}>
                <li><Text strong>SampleID：</Text>样本名</li>
                <li><Text strong>Tags Number：</Text>该样本获得的Effective Tags数</li>
                <li><Text strong>Total length：</Text>Tags的总长度，bp</li>
                <li><Text strong>Max length：</Text>最长Tag的长度</li>
                <li><Text strong>Min length：</Text>最短Tag的长度</li>
                <li><Text strong>N50：</Text>将Tag从长到短排序并依次累加长度，当累加长度达到总长的50% 时对应Tags的长度</li>
                <li><Text strong>N90：</Text>将Tag从长到短排序并依次累加长度，当累加长度达到总长的90% 时对应Tags的长度</li>
              </ul>
            </div>
          </section>

          {/* OTU/ASV统计 */}
          <section className={styles.section}>
            <Title level={3} className={styles.subsectionTitle}>OTU/ASV统计</Title>
            <div className={styles.textContent}>
              <Paragraph>
                <Text strong>OTU：</Text>Operational Taxonomic Units，人为设定的操作分类单元。将Tag序列按相似度聚类，分成不同的序列集合（cluster），一个cluster即为1个OTU。进行聚类操作既可以提高运算效率，还可以减小测序错误的影响（相对于高丰度序列，低丰度序列出现测序错误的概率更高，cluster中选取高丰度序列作为代表，避免了低丰度序列直接参与后续分析）。
              </Paragraph>
              <Paragraph>
                <Text strong>ASV：</Text>amplicon sequence variants，DADA2软件将输出结果称为ASV，类似于按100%相似度聚类得到的OTU序列。图表中统一使用OTU展示。
              </Paragraph>
              <Paragraph>
                基于OTU的丰度信息、物种注释信息，统计汇总各样本OTU的总体特征，低丰度OTU、Tags注释等信息，统计结果如下图表所示：
              </Paragraph>
            </div>

            <Table
              dataSource={otusTagsData}
              columns={otusTagsColumns}
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 900 }}
              className={styles.dataTable}
            />

            <div className={styles.tableDescription}>
              <Text strong>表格说明：</Text>
              <ul className={styles.descriptionList}>
                <li><Text strong>SampleID：</Text>样本名，最后一行avg表示所有样本均值</li>
                <li><Text strong>Total Tags：</Text>Effective Tags数量</li>
                <li><Text strong>Unique Tags：</Text>按100%相似度聚类获得的Tag</li>
                <li><Text strong>Taxon Tags：</Text>有物种注释的Tags数量</li>
                <li><Text strong>Unclassified Tags：</Text>没有物种注释的Tags数量</li>
                <li><Text strong>Singleton Tags：</Text>该样本中的Singleton数量，在所有样本中Tag总数为1的OTU，称为Singleton Tag，是被过滤掉的OTU</li>
                <li><Text strong>OTUs：</Text>最终得到的OTU数量</li>
              </ul>
            </div>

            <Card className={styles.imageCard} style={{ marginTop: 24 }}>
              <img src={tagsOtusCountImg} alt="OTUs和Tags数量统计图" className={styles.chartImage} />
              <div className={styles.imageCaption}>Fig 4-1-1 不同样本的OTUs和Tags数量统计图</div>
            </Card>

            <div className={styles.tableDescription}>
              <Text strong>图片说明：</Text>
              <ul className={styles.descriptionList}>
                <li>横轴表示样本，左纵轴表示Tag数量，右纵轴表示OTU数量，柱子颜色表示Tag类型。</li>
                <li><Text strong>Total Tags：</Text>Effective Tags数量</li>
                <li><Text strong>Unique Tags：</Text>按100%相似度聚类获得的Tag</li>
                <li><Text strong>Taxon Tags：</Text>有物种注释的Tags数量</li>
                <li><Text strong>Unclassified Tags：</Text>没有物种注释的Tags数量</li>
                <li><Text strong>Singleton Tags：</Text>该样本中的Singleton数量，在所有样本中Tag总数为1的OTU，称为Singleton Tag，是被过滤掉的OTU</li>
                <li><Text strong>OTUs：</Text>最终得到的OTU数量</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </PageTemplate>
  );
};

export default QCReport;