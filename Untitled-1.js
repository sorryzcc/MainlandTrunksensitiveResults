const XLSX = require('xlsx');

const Mappath = '266.国内文本关卡配置表@MapTranslationConfiguration.xlsx'; 
const Totalpath = '266.国内文本配置表@TotalTranslationConfiguration.xlsx'; 
const Systempath = '266.国内文本系统配置表@SystemTranslationConfiguration.xlsx'; 
const Opspath = '266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx'; 
const Battlepath = '266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx'; 

const blackListPath = 'blackList.xlsx'; 
const whiteListPath = 'whiteList.xlsx'; 

// 读取 Excel 文件
function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data;
}

// 读取七个 Excel 文件
const MapData = readExcel(Mappath); 
const TotalData = readExcel(Totalpath);
const SystemData = readExcel(Systempath);
const OpsData = readExcel(Opspath);
const BattleData = readExcel(Battlepath);

const blackListData = readExcel(blackListPath);
const whiteListData = readExcel(whiteListPath);

console.log(MapData,'MapData');
// console.log(blackListData,'blackListData');

  
  
  
  [{
    ID: 500091,
    Key: 'Badge_Buff_Desc_new_Lv4_006',
    ToolRemark: '徽章BUFF商业化测试\r\nroshanchen',
    Translate: '招式都处于<color=#ff5151>可用状态</color>时，使当前的会心一击几率额外提升100%。'
  },
  {
    ID: 500092,
    Key: 'Badge_Buff_Desc_new_Lv1_007',
    ToolRemark: '徽章BUFF商业化测试\r\nroshanchen',
    Translate: '对3米内的对手<color=#ff5151>首次造成伤害</color>时，2秒内获得56%伤害加成，但随后3秒造成的伤害降低25.5%。'
  },
  {
    ID: 500093,
    Key: 'Badge_Buff_Desc_new_Lv2_007',
    ToolRemark: '徽章BUFF商业化测试\r\nroshanchen',
    Translate: '对3米内的对手<color=#ff5151>首次造成伤害</color>时，2秒内获得56%伤害加成，但随后3秒造成的伤害降低27%。'
  },
  {
    ID: 500094,
    Key: 'Badge_Buff_Desc_new_Lv3_007',
    ToolRemark: '徽章BUFF商业化测试\r\nroshanchen',
    Translate: '对3米内的对手<color=#ff5151>首次造成伤害</color>时，2秒内获得56%伤害加成，但随后3秒造成的伤害降低28.5%。'
  },
  {
    ID: 500095,
    Key: 'Badge_Buff_Desc_new_Lv4_007',
    ToolRemark: '徽章BUFF商业化测试\r\nroshanchen',
    Translate: '对3米内的对手<color=#ff5151>首次造成伤害</color>时，2秒内获得56%伤害加成，但随后3秒造成的伤害降低30%。'
  }]

  前五个表格的内容是这个样子

   [{ blackList: '击倒' },
  { blackList: '参赛证' },
  { blackList: '大师' },
  { blackList: '集结能量' }]

   [ { whiteList: '集结对战' },
  { whiteList: '集结参赛证' },
  { whiteList: '大师段位' },
  { whiteList: '超核玩家' },
  {
    whiteList: '本游戏是一款玩法相对复杂的团队策略对战类游戏，适用于年满12周岁及以上的用户，建议未成年人在家长监护下使用游戏产品。'
  }
] 

  后两个list是这个样子

  帮我先把前面五个数组对象合并成一个，找出Translate列包含blackList的内容，并且不包含whiteList的内容，最后输出成表格

  包括{
    ID
    Key
    ToolRemark
    Translate
  }
  xlsx 用这个库生成表格
  怎么写代码