import { useState } from 'react';
import { Table, Input, Button, Space, Pagination } from 'antd';
import { SearchOutlined, ClearOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

/**
 * 简单的结果页面模板组件
 * 用于在已使用PageTemplate的页面中嵌套使用
 * 
 * @param {ReactNode} chartContent - 图表内容
 * @param {Array} tableColumns - 表格列配置
 * @param {Array} tableData - 表格数据
 * @param {Array} selectedRowKeys - 选中的行keys
 * @param {Function} onSelectChange - 选中行变化回调
 * @param {Function} onDownload - 下载回调函数
 * @param {Function} onRefresh - 刷新回调函数
 */
const ResultPageTemplate = ({
  chartContent,
  tableColumns = [],
  tableData = [],
  selectedRowKeys = [],
  onSelectChange,
  onDownload,
  onRefresh,
}) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // 搜索时重置到第一页
  };

  // 清空选择
  const handleClearSelection = () => {
    if (onSelectChange) {
      onSelectChange([]);
    }
  };

  // 下载
  const handleDownload = () => {
    if (onDownload) {
      onDownload(selectedRowKeys);
    } else {
      console.log('下载数据:', { selectedRows: selectedRowKeys });
    }
  };

  // 刷新
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      console.log('刷新数据');
    }
    setSearchText('');
    if (onSelectChange) {
      onSelectChange([]);
    }
    setCurrentPage(1);
  };

  // 过滤表格数据
  const getFilteredData = () => {
    if (!tableData || !searchText) {
      return tableData || [];
    }

    return tableData.filter(record => {
      return Object.values(record).some(value => 
        String(value).toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  const filteredData = getFilteredData();

  // 行选择配置
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedKeys) => {
      if (onSelectChange) {
        onSelectChange(selectedKeys);
      }
    },
  };

  // 自定义表格底部 - 左下角按钮 + 右下角分页
  const tableFooter = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px 0',
    }}>
      {/* 左侧：下载和刷新按钮 */}
      <Space>
        <Button 
          icon={<DownloadOutlined />} 
          onClick={handleDownload}
          disabled={selectedRowKeys.length === 0}
        >
          下载 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
        </Button>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
        >
          刷新
        </Button>
      </Space>

      {/* 右侧：分页组件 */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        onShowSizeChange={(current, size) => {
          setCurrentPage(1);
          setPageSize(size);
        }}
      />
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* 主体内容：上下布局 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* 上部分：图表区域 */}
        {chartContent && (
          <div style={{ 
            width: '100%',
            minHeight: 400,
          }}>
            {chartContent}
          </div>
        )}

        {/* 下部分：表格区域 */}
        {tableColumns.length > 0 && tableData.length > 0 && (
          <div style={{ 
            width: '100%',
          }}>
            {/* 表格工具栏 - 右上角 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center',
              marginBottom: 16,
              padding: '12px 16px',
              background: '#fafafa',
              borderRadius: '4px 4px 0 0',
            }}>
              <Space>
                <Button 
                  icon={<ClearOutlined />} 
                  onClick={handleClearSelection}
                  disabled={selectedRowKeys.length === 0}
                >
                  清空选择
                </Button>
                <Input.Search
                  placeholder="搜索表格内容"
                  allowClear
                  style={{ width: 250 }}
                  onSearch={handleSearch}
                  onChange={(e) => {
                    if (!e.target.value) {
                      handleSearch('');
                    }
                  }}
                  prefix={<SearchOutlined />}
                />
              </Space>
            </div>

            {/* 表格内容 */}
            <Table
              rowSelection={rowSelection}
              columns={tableColumns}
              dataSource={filteredData}
              pagination={false}
              footer={tableFooter}
              bordered
            />
          </div>
        )}

        {/* 如果没有内容，显示提示 */}
        {!chartContent && tableColumns.length === 0 && (
          <div style={{ 
            padding: 40, 
            textAlign: 'center', 
            color: '#999',
            background: '#fafafa',
            borderRadius: 4
          }}>
            暂无内容
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPageTemplate;
