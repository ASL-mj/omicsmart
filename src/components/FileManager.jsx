import { useState } from 'react';
import { Card, Upload, Button, Table, Space, message, Tag, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const FileManager = () => {
  const [fileList, setFileList] = useState([
    {
      key: '1',
      name: 'sample_data.csv',
      size: '2.5 MB',
      type: 'CSV',
      uploadTime: '2024-01-15 10:30:00',
      status: 'success',
    },
    {
      key: '2',
      name: 'gene_expression.xlsx',
      size: '5.8 MB',
      type: 'Excel',
      uploadTime: '2024-01-14 15:20:00',
      status: 'success',
    },
    {
      key: '3',
      name: 'protein_data.txt',
      size: '1.2 MB',
      type: 'TXT',
      uploadTime: '2024-01-13 09:15:00',
      status: 'success',
    },
  ]);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '文件类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          CSV: 'green',
          Excel: 'blue',
          TXT: 'orange',
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'processing'}>
          {status === 'success' ? '已完成' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="link" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handlePreview = (record) => {
    Modal.info({
      title: `预览: ${record.name}`,
      content: (
        <div>
          <p>文件类型: {record.type}</p>
          <p>文件大小: {record.size}</p>
          <p>这是一个示例预览窗口</p>
        </div>
      ),
      width: 600,
    });
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个文件吗？',
      onOk: () => {
        setFileList(fileList.filter(item => item.key !== key));
        message.success('文件删除成功');
      },
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
        const newFile = {
          key: Date.now().toString(),
          name: info.file.name,
          size: `${(info.file.size / 1024 / 1024).toFixed(2)} MB`,
          type: info.file.name.split('.').pop().toUpperCase(),
          uploadTime: new Date().toLocaleString('zh-CN'),
          status: 'success',
        };
        setFileList([...fileList, newFile]);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    beforeUpload: () => {
      return false; // 阻止自动上传，仅做演示
    },
  };

  return (
    <div>
      <Card title="文件上传" style={{ marginBottom: 24 }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传。支持 CSV、Excel、TXT 等格式的数据文件
          </p>
        </Dragger>
      </Card>

      <Card title="文件列表">
        <Table columns={columns} dataSource={fileList} />
      </Card>
    </div>
  );
};

export default FileManager;