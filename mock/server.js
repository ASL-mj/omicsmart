import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import cors from "cors";
import { db } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

// 中间件
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

/**
 * 首页接口/通用接口
 */
// 新增接口: GET /HomePage/getProjectInfo
server.get("/api/HomePage/getProjectInfo", (req, res) => {
  const projectInfo = db.getProjectInfo();
  res.jsonp({
    status: 1,
    result: projectInfo,
  });
});

// 新增接口: GET /HomePage/getArticleList
server.get("/api/HomePage/getArticleList", (req, res) => {
  const articleList = db.getArticleList();
  res.jsonp({
    status: 1,
    result: articleList,
  });
});

// 新增接口: GET /HomePage/getMoreArticle
server.get("/api/HomePage/getMoreArticle", (req, res) => {
  // 获取查询参数
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const searchField = req.query.searchField || "title";
  const keyword = req.query.keyword || "";

  // 使用database.js中的数据
  const result = db.getMoreArticles(page, size, searchField, keyword);
  
  res.jsonp({
    status: 1,
    result: result,
  });
});

// 新增接口: GET /GroupScheme/getTaskLists - 传递任务列表给PageTemplate组件
server.get("/api/getTaskLists", (req, res) => {
  const taskListResult = db.getTaskList();
  res.jsonp({
    status: 1,
    result: taskListResult,
  });
});




/**
 * 分组接口
 */

// 新增接口: POST /GroupScheme/groupCheck - 查看分组详情
server.post("/api/GroupScheme/groupCheck", (req, res) => {
  const { id } = req.body;
  const groupDetail = db.getGroupDetail(id);
  res.jsonp({
    status: 1,
    result: groupDetail,
  });
});

// 新增接口: POST /GroupScheme/create - 创建新分组方案
server.post("/api/GroupScheme/create", (req, res) => {
  const { name, samples } = req.body;
  const newGroup = db.createGroup(name, samples);
  res.jsonp({
    status: 1,
    result: newGroup,
  });
});

// 新增接口: GET /GroupScheme/index - 获取分组列表
server.get("/api/GroupScheme/index", (req, res) => {
  const groupListResult = db.getGroupList();
  res.jsonp({
    status: 1,
    result: groupListResult,
  });
});

// 新增接口: POST /10X/Home/grouping - 处理分组数据
server.post("/api/GroupScheme/grouping", (req, res) => {
  const result = db.processGrouping();
  res.jsonp({
    status: 1,
    message: result.message || "添加成功！"
  });
});




/**
 * 流程细胞过滤相关API 
 */

// 新增接口: POST /10X/filter/getCellLists - 获取细胞列表
server.post("/api/Cellfilter/getCellLists", (req, res) => {
  const { page = 1, perPageNum = 10, keyWord = '' } = req.body;
  const result = db.getCellLists(parseInt(page), parseInt(perPageNum), keyWord);
  res.jsonp({
    status: 1,
    result: result.list,
    total: result.total,
  });
});

// 新增接口: POST /Cellfilter/getListDetail - 获取列表详情
server.post("/api/Cellfilter/getListDetail", (req, res) => {
  const { listId } = req.body;
  const result = db.getListDetail(listId);
  if (result) {
    res.jsonp({
      status: 1,
      result: result,
    });
  } else {
    res.jsonp({
      status: 0,
      message: "未找到对应的细胞列表详情",
    });
  }
});

// 新增接口: POST /Cellfilter/getGroupNames - 获取分组名称列表
server.post("/api/Cellfilter/getGroupNames", (req, res) => {
  res.jsonp({
    status: 1,
    result: db.getGroupNames(),
  });
});

// 新增接口: POST /Cellfilter/getAllGenes - 获取所有基因
server.post("/api/Cellfilter/getAllGenes", (req, res) => {
  res.jsonp({
    status: 1,
    list: db.getAllGenes(),
  });
});

// 新增接口: POST /Cellfilter/getMutilCellsLists - 获取多细胞集列表
server.post("/api/Cellfilter/getMutilCellsLists", (req, res) => {
  res.jsonp({
    status: 1,
    result: db.getMultiCellLists(),
  });
});

// 新增接口: POST /Cellfilter/getMultiCellsInfo - 获取多细胞集信息
server.post("/api/Cellfilter/getMultiCellsInfo", (req, res) => {
  res.jsonp({
    status: 1,
    result: db.getMultiCellInfo(),
  });
});




/**
 * 目标细胞筛选相关API
 */

// 新增接口: POST /10X/Task/getTasksToQuasi - 获取任务列表（用于目标细胞筛选）
server.post("/api/Cellfilter/TargetCells/getTasksToQuasi", (req, res) => {
  res.jsonp({
    status: 1,
    result: db.getTasksToQuasi(),
  });
});

// 新增接口: POST /10X/TargetCells/getCellLists - 获取目标细胞列表
server.post("/api/Cellfilter/TargetCells/getCellListDetails", (req, res) => {
  const { page = 1, perPageNum = 10, keyWord = '', searchKey = 'list_name' } = req.body;
  const result = db.getTargetCellListDetails(parseInt(page), parseInt(perPageNum), keyWord, searchKey);
  res.jsonp({
    status: 1,
    result: {
      total: result.total,
      lists: result.lists,
    },
  });
});

// 新增接口: POST /10X/TargetCells/getCellLists - 获取目标细胞列表
server.post("/api/Cellfilter/TargetCells/getCellLists", (req, res) => {
  const result = db.getTargetCellList();
  res.jsonp({
    status: 1,
    result: result,
  });
});

server.post("/api/Cellfilter/TargetCells/getDetail", (req, res) => {
  const result = db.getTargetCellDetail();
  res.jsonp({
    status: 1,
    result: result,
  });
});

server.post("/api/Cellfilter/TargetCells/getTasksToCreateCells", (req, res) => {
  const result = db.getTargetCellCreateTasks();
  res.jsonp({
    status: 1,
    result: result,
  });
});

server.post("/api/Cellfilter/TargetCells/getClusterNamesList", (req, res) => {
  const result = db.getClusterNamesList();
  res.jsonp({
    status: 1,
    result: result,
  });
});


const port = process.env.MOCK_PORT || 15001;
server.listen(port, () => {
  console.log(`Mock Server is running on http://localhost:${port}`);
});
