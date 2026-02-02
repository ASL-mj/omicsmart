import request from "@/utils/request";

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

export const GroupApi = {
  // 查看分组详情
  postGroupCheck: (data) => request.post("/GroupScheme/groupCheck", data),

  // 获取任务列表
  getTaskLists: () => request.get("/GroupScheme/getTaskLists"),

  // 创建新分组方案
  postCreateGroupScheme: (data) => request.post("/GroupScheme/create", data),

  // 获取分组列表
  postGroupSchemeIndex: (params) =>
    request.get("/GroupScheme/index", { params }),
};
