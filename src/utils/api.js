import request from './request';

// 首页相关API
export const homeApi = {
  // 获取项目信息
  getProjectInfo: () => request.get("/HomePage/getProjectInfo"),

  // 获取文章列表
  getArticleList: () => request.get("/HomePage/getArticleList"),

  // 获取更多文章
  getMoreArticle: (params) =>
    request.get("/HomePage/getMoreArticle", { params }),
};

// 任务相关API
export const TaskApi = {
  // 获取任务列表
  getTaskLists: () => request.get("/getTaskLists", {})
};

export const GroupApi = {
  // 查看分组详情
  postGroupCheck: (data) => request.post("/GroupScheme/groupCheck", data),


  // 创建新分组方案
  postCreateGroupScheme: (data) => request.post("/GroupScheme/create", data),

  // 获取分组列表
  postGroupSchemeIndex: (params) =>
    request.get("/GroupScheme/index", { params }),

  // 分组处理
  postGrouping: (data) => request.post("/GroupScheme/grouping", data),
};



// 细胞过滤相关API
export const CellFilterApi = {
  // 获取细胞列表
  getCellLists: (data) => request.post("/Cellfilter/getCellLists", data),
  
  // 获取细胞列表详情
  getListDetail: (data) => request.post("/Cellfilter/getListDetail", data),

  // 获取分组名称
  getGroupNames: (data) => request.post("/Cellfilter/getGroupNames", data),

  // 获取所有基因
  getAllGenes: (data) => request.post("/Cellfilter/getAllGenes", data),

  // 获取多胞细胞列表
  getMutilCellsLists: () => request.post("/Cellfilter/getMutilCellsLists", {}),

  // 获取多胞细胞信息
  getMultiCellsInfo: () => request.post("/Cellfilter/getMultiCellsInfo", {}),
};

export const TargetCellApi = {
  // 获取任务列表（用于目标细胞筛选）
  getTasksToQuasi: () => request.post("/Cellfilter/TargetCells/getTasksToQuasi", {}),
  
  // 获取目标细胞列表
  getTargetCellListDetails: (data) => request.post("/Cellfilter/TargetCells/getCellListDetails", data),

  // 获取目标细胞列表
  getTargetCellLists: (data) => request.post("/Cellfilter/TargetCells/getCellLists", data),

  // 获取目标细胞列表详情
  getTargetCellDetail: (data) => request.post("/Cellfilter/TargetCells/getDetail", data),

  // 获取目标细胞创建
  getTargetCellCreateTasks: () => request.post("/Cellfilter/TargetCells/getTasksToCreateCells", {}),

  // 获取亚群列表 taskNumber:test_19
  getClusterNamesList: (data) => request.post("/Cellfilter/TargetCells/getClusterNamesList", data),
}
