import { singleCellPlatformConfig } from './SingleCellPlatform';
import { transcriptomePlatformConfig } from './TranscriptomePlatform';
import { MicrobiomePlatform } from './MicrobiomePlatform'

// 平台配置映射表
export const platformConfigs = {
  '1': singleCellPlatformConfig,
  '2': transcriptomePlatformConfig,
  '3': MicrobiomePlatform,
  // 后续添加新平台时，在这里导入并添加配置即可
  // '3': xxxPlatformConfig,
};

// 获取平台配置的辅助函数
export const getPlatformConfig = (platformId) => {
  return platformConfigs[platformId] || {
    id: 0,
    title: '未知平台',
    icon: '❓',
    renderLogo: () => <div className="logo-img">❓</div>,
    renderDescription: () => <div>暂无此平台的详细信息，请联系管理员。</div>,
    buttons: [],
    tabs: []
  };
};