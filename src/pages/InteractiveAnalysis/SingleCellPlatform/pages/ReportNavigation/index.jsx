import { useState, useEffect } from "react";
import {  Row, Col, Table, Modal, message, Select, Input, Carousel} from 'antd';
import { 
  ArrowRightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styles from './index.module.css';
import FirstTimeUse from "@/assets/image/backgroundImg/首次使用.png";
import Step1 from "@/assets/image/SingleCellPlatform/Procss/icon_设置分组.png";
import Step2 from "@/assets/image/SingleCellPlatform/Procss/icon_设置集合.png";
import Step3 from "@/assets/image/SingleCellPlatform/Procss/icon_提交任务.png";
import Step4 from "@/assets/image/SingleCellPlatform/Procss/icon_查看结果.png";
import Banner1 from "@/assets/image/SingleCellPlatform/SwiperImg/banner1.png";
import Banner2 from "@/assets/image/SingleCellPlatform/SwiperImg/banner2.png";
import { homeApi } from "@/services/api";

const { Search } = Input;

const ReportNavigation = () => {
  const banners = [Banner1, Banner2];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  
  // 项目信息和文章列表状态
  const [projectInfo, setProjectInfo] = useState([]);
  const [articleList, setArticleList] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取项目信息
  const fetchProjectInfo = async () => {
    try {
      setLoading(true);
      const response = await homeApi.getProjectInfo();
      if (response.status === 1) {
        setProjectInfo(response.result);
      }
    } catch (error) {
      console.error("获取项目信息失败:", error);
      message.error("获取项目信息失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取文章列表
  const fetchArticleList = async () => {
    try {
      setLoading(true);
      const response = await homeApi.getArticleList();
      if (response.status === 1) {
        setArticleList(response.result);
      }
    } catch (error) {
      console.error("获取文章列表失败:", error);
      message.error("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取更多文章
  const fetchMoreArticles = async (page = 1, size = 10, keyword = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        size,
        searchField: 'title',
        keyword,
        request_type: 'axios'
      };
      const response = await homeApi.getMoreArticle(params);
      if (response.status === 1) {
        setMoreArticles(response.result.list);
        setTotal(response.result.count);
      }
    } catch (error) {
      console.error("获取更多文章失败:", error);
      message.error("获取更多文章失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectInfo();
    fetchArticleList();
    fetchMoreArticles(1, 10);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };



  const handlePageChange = (page, size) => {
    fetchMoreArticles(page, size);
  };

  
  const Columns = [
    {
      key: "intro",
      title: "研究内容",
      dataIndex: "intro",
      width: 500,
      render: (text, record) => {
        return (
          <a
            className={styles.navigateProjectInfoTableA}
            href={record.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        );
      },
    },
    {
      title: "文章特色",
      dataIndex: "feature",
      key: "feature",
      render: (text) => {
        return <span style={{ color: "#E6A23C" }}>{text}</span>;
      },
    },
  ];
  
  // 使用从API获取的数据
  const data = articleList ? articleList.article : [];

  const Columns2 = [
    {
      title: "中文题目",
      dataIndex: "title",
      width: 400,
      ellipsis: true,
    },
    {
      title: "英文题目",
      dataIndex: "englishTitle",
      width: 400,
      ellipsis: true,
    },
    {
      title: "客户单位",
      dataIndex: "customerUnit",
      ellipsis: true,
    },
    {
      title: "研究物种",
      dataIndex: "species",
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.reportNavigation}>
      {/* 生物信息分析平台介绍部分 */}
      <div className={styles.navigateTop}>
        <div className={styles.navigateTitle1}>
          <span className={styles.navigateTitle1Text}>Omicsmart平台</span>
          <span>已助力客户文章发表</span>
          <span className={styles.navigateTitle1Text}>30篇</span>
          <span>，影响因子累计达</span>
          <span className={styles.navigateTitle1Text}>29492.23!</span>
        </div>
        <div className={styles.navigateTitle2}>
          <p className={styles.navigateTitle2P1}>
            如果您在数据处理过程中，使用了
            <span className={styles.navigateTitle2Text}>Omicsmart平台</span>
            进行分析，我们期望您写作论文时，在方法学部分或致谢部分引用或提及BioHX标准分析平台。
          </p>
          <p className={styles.navigateTitle2P2}>
            例如：Bioinformatic analysis was performed using Omicsmart, a
            dynamic real-time interactive online platform for data
            analysis(https://www.omicsmart.com)
          </p>
          <p className={styles.navigateTitle2P3}>
            或者 XX were drawn by the omicsmart system of Gene Denovo
            Corporation (https://www.omicsmart.com)
          </p>
        </div>
      </div>

      {/* 操作流程部分 */}
      <div className={styles.navigateProcess}>
        <div className={styles.navigateProcessTitle}>
          <img
            className={styles.navigateProcessTitleImg}
            src={FirstTimeUse}
            alt=""
          />
          <span className={styles.navigateProcessTitleWord}>
            简单直观的操作流程，轻松完成从数据上传到结果分析
          </span>
        </div>
        
        <Row gutter={2} className={styles.navigateProcessCenter}>
          <Col span={5} className={styles.navigateProcessStep}>
            <div className={styles.navigateProcessStepTop}>
              <img
                className={styles.navigateProcessStepTopImg}
                src={Step1}
                alt=""
              />
              <span className={styles.navigateProcessStepTopNum}>1</span>
              <span className={styles.navigateProcessStepTopTitle}>设置分组</span>
              <span className={styles.navigateProcessStepTopLongArrow}></span>
            </div>
            <div className={styles.navigateProcessStepCenter}>
              根据实验设计创建样本分组，为后续分析奠定基础。
            </div>
            <div className={styles.navigateProcessStepBottom}>
              新建分组方案
              <span style={{ margin: "0 5px" }}>→</span>
            </div>
          </Col>
          <Col span={5} className={styles.navigateProcessStep}>
            <div className={styles.navigateProcessStepTop}>
              <img
                className={styles.navigateProcessStepTopImg}
                src={Step2}
                alt=""
              />
              <span className={styles.navigateProcessStepTopNum}>2</span>
              <span className={styles.navigateProcessStepTopTitle}>设置集合</span>
              <span className={styles.navigateProcessStepTopLongArrow}></span>
            </div>
            <div className={styles.navigateProcessStepCenter}>
              通过多种条件快速构建目标集合，用于后续的个性化研究。
            </div>
            <div className={styles.navigateProcessStepBottom}>
              新建基因集
              <span style={{ margin: "0 5px" }}>→</span>
            </div>
          </Col>
          <Col span={5} className={styles.navigateProcessStep}>
            <div className={styles.navigateProcessStepTop}>
              <img
                className={styles.navigateProcessStepTopImg}
                src={Step3}
                alt=""
              />
              <span className={styles.navigateProcessStepTopNum}>3</span>
              <span className={styles.navigateProcessStepTopTitle}>提交任务</span>
              <span className={styles.navigateProcessStepTopLongArrow}></span>
            </div>
            <div className={styles.navigateProcessStepCenter}>
              选择分组方案、集合、分析参数后填写任务编号提交任务。
            </div>
            <div className={styles.navigateProcessStepBottom}>
              开始交互分析
              <span style={{ margin: "0 5px" }}>→</span>
            </div>
          </Col>
          <Col span={5} className={styles.navigateProcessStep}>
            <div className={styles.navigateProcessStepTop}>
              <img
                className={styles.navigateProcessStepTopImg}
                src={Step4}
                alt=""
              />
              <span className={styles.navigateProcessStepTopNum}>4</span>
              <span className={styles.navigateProcessStepTopTitle}>查看结果</span>
            </div>
            <div className={styles.navigateProcessStepCenter}>
              任务完成后，点击分析内容可直接跳转到结果页面，或在对应分析模块进行查看。
            </div>
            <div className={styles.navigateProcessStepBottom}>
              查看结果
              <span style={{ margin: "0 5px" }}>→</span>
            </div>
          </Col>
        </Row>
        
        <Row className={styles.navigateProcessBottom} gutter={14}>
          <Col span={8} className={styles.navigateProcessBottomLeft}>
            <div className={styles.navigateProcessBottomLeftTop}>
              快速入门指南
              <span>
                <ArrowRightOutlined style={{ color: "#000" }} />
              </span>
            </div>
            <div className={styles.navigateProcessBottomLeftBottom}>
              十分钟了解平台核心功能和基本操作流程
            </div>
          </Col>
          <Col span={8} className={styles.navigateProcessBottomCenter}>
            <div className={styles.navigateProcessBottomCenterTop}>
              中英文方法下载
              <span>
                <DownloadOutlined style={{ color: "#000" }} />
              </span>
            </div>
            <div className={styles.navigateProcessBottomCenterBottom}>
              提供中文实验方法、英文分析方法
            </div>
          </Col>
          <Col span={8} className={styles.navigateProcessBottomRight}>
            <div className={styles.navigateProcessBottomRightTop}>
              建议与反馈
              <span>
                <ArrowRightOutlined style={{ color: "#000" }} />
              </span>
            </div>
            <div className={styles.navigateProcessBottomRightBottom}>
              您的建议将帮助我们优化平台功能，提升使用体验
            </div>
          </Col>
        </Row>
      </div>

      {/* 轮播图部分 */}
      <div className={styles.navigateSwiper}>
        <Carousel 
          dots={false}
          autoplay
          infinite={true}
        >
          {banners.map((banner, index) => (
            <div key={index} className={styles.swiperSlide}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className={styles.swiperImage}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* 项目信息部分 */}
      <Row gutter={14} className={styles.navigateProjectInfo}>
        <Col span={6} className={styles.navigateProjectInfoLeft}>
          <div className={styles.navigateProjectInfoLeftTitle}>项目信息</div>
          <div className={styles.navigateProjectInfoLeftInfo}>
            {projectInfo.length > 0 ? (
              projectInfo.map((info, index) => (
                <div key={index} className={styles.navigateProjectInfoLeftInfoItem}>
                  <div className={styles.navigateProjectInfoLeftInfoItemTitle}>
                    {`组学类型：${info.title}`}
                  </div>
                  <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                    <span>物种</span>
                    <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                      {info.species}
                    </span>
                  </div>
                  <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                    <span>样本数</span>
                    <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                      {info.sample_num}
                    </span>
                  </div>
                  <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                    <span>分组数</span>
                    <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                      {info.group_num}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.navigateProjectInfoLeftInfoItem}>
                <div className={styles.navigateProjectInfoLeftInfoItemTitle}>
                  组学类型：WGCNA
                </div>
                <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                  <span>物种</span>
                  <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                    空
                  </span>
                </div>
                <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                  <span>样本数</span>
                  <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                    -----
                  </span>
                </div>
                <div className={styles.navigateProjectInfoLeftInfoItemRow}>
                  <span>分组数</span>
                  <span className={styles.navigateProjectInfoLeftInfoItemRowRight}>
                    -----
                  </span>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col span={18} className={styles.navigateProjectInfoRight}>
          <div className={styles.navigateProjectInfoRightTitle}>
            <div className={styles.navigateProjectInfoRightTitleLine1}></div>
            <div className={styles.navigateProjectInfoRightTitleText}>
              引用Bio标准分析已发表的部分经典文献
            </div>
            <div className={styles.navigateProjectInfoRightTitleLine2}></div>
          </div>
          <Table
            style={{
              height: "243px",
            }}
            columns={Columns}
            dataSource={data}
            scroll={{
              y: 200,
            }}
            pagination={false}
            loading={loading}
          />
          <div
            className={styles.navigateProjectInfoRightBottom}
            onClick={() => {
              fetchMoreArticles(1, 10, '');
              showModal();
            }}
          >
            BioHX标准分析平台已助力客户发表
            <span className={styles.navigateProjectInfoRightBottomText}>
              {total || 0}篇
            </span>
            SCI论文，更多已发表文章可直接点击查看→
          </div>
        </Col>
      </Row>

      {/* 文章列表模态框 */}
      <Modal
        title={<p>BioHX标准分析平台已助力客户发表<span style={{color:"#40A6FF"}}>{total || 0}篇</span>SCI论文</p>}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1300}
        footer={false}
      >
        <div className={styles.navigateProjectInfoRightBottomTableSearch}>
          <Select
            defaultValue={"title"}
            options={[
              {
                key: "title",
                label: "中文题目",
                value: "title",
              },
              {
                key: "englishTitle",
                label: "英文题目",
                value: "englishTitle",
              },
            ]}
          />
          <Search
            placeholder="请输入搜索内容"
            style={{
              width: 500,
            }}
          />
        </div>
        <Table
          columns={Columns2}
          dataSource={moreArticles}
          scroll={{ x: 1200 }}
          loading={loading}
          pagination={{
            current: 1,
            pageSize: 10,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            onChange: handlePageChange,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </Modal>
    </div>
  );
};

export default ReportNavigation;