const XLSX = require('xlsx');

const Mappath = '266.国内文本关卡配置表@MapTranslationConfiguration.xlsx';
const Totalpath = '266.国内文本配置表@TotalTranslationConfiguration.xlsx';
const Systempath = '266.国内文本系统配置表@SystemTranslationConfiguration.xlsx';
const Opspath = '266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx';
const Battlepath = '266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx';

const sensitiveWordsPath = '大陆版敏感词241017 - 副本.xlsx';

// 读取 Excel 文件并记录文件名
function readExcel(filePath, fileName, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames.find(name => name === sheetName)];
    const data = XLSX.utils.sheet_to_json(worksheet).map(item => ({ ...item, "来源": fileName }));

    return data;
}

// 读取五个 Excel 文件并记录文件名
const MapData = readExcel(Mappath, "MapTranslationConfiguration", "MapTranslationConfiguration");
const TotalData = readExcel(Totalpath, "TotalTranslationConfiguration", "TotalTranslationConfiguration");
const SystemData = readExcel(Systempath, "SystemTranslationConfiguration", "SystemTranslationConfiguration");
const OpsData = readExcel(Opspath, "OpsEvenTranslationConfiguration", "OpsEvenTranslationConfiguration");
const BattleData = readExcel(Battlepath, "BattleTranslationConfiguration", "BattleTranslationConfiguration");

console.log("MapData:", MapData.length > 0 ? "Loaded" : "Empty");
console.log("TotalData:", TotalData.length > 0 ? "Loaded" : "Empty");
console.log("SystemData:", SystemData.length > 0 ? "Loaded" : "Empty");
console.log("OpsData:", OpsData.length > 0 ? "Loaded" : "Empty");
console.log("BattleData:", BattleData.length > 0 ? "Loaded" : "Empty");

// 从敏感词 Excel 文件中读取两个工作表
const blackListData = readExcel(sensitiveWordsPath, "blacklist", "blacklist");
const whiteListData = readExcel(sensitiveWordsPath, "whitelist", "whitelist");

console.log("blackListData:", blackListData.length > 0 ? "Loaded" : "Empty");
console.log("whiteListData:", whiteListData.length > 0 ? "Loaded" : "Empty");

// 获取黑名单和白名单
const blackList = new Set(blackListData.map(item => item.blackList || item.BlackList));
const whiteList = new Set(whiteListData.map(item => item.whiteList || item.WhiteList));

console.log("blackList size:", blackList.size);
console.log("whiteList size:", whiteList.size);

// 合并数据
const combinedData = [...MapData, ...TotalData, ...SystemData, ...OpsData, ...BattleData];

console.log("Combined Data size:", combinedData.length);

// 检查 Translate 列是否包含黑名单内容并且不包含白名单内容，并记录包含的黑名单词汇
function checkTranslateContent(item) {
    // 确保 Translate 属性存在并且转换为字符串
    if (!item.Translate) {
        return null; // 跳过没有 Translate 字段的对象
    }
    const translateStr = String(item.Translate);

    let blackWord = ''; // 记录包含的黑名单词汇

    for (let black of blackList) {
        if (translateStr.includes(black)) {
            // 检查是否也包含白名单内容
            let containsWhite = false;
            for (let white of whiteList) {
                if (translateStr.includes(white)) {
                    containsWhite = true;
                    break;
                }
            }
            if (!containsWhite) {
                blackWord += black + ', '; // 记录黑名单词汇
            }
        }
    }

    if (blackWord) {
        blackWord = blackWord.slice(0, -2); // 去掉最后一个逗号和空格
        return { ...item, blackWord }; // 包含黑名单内容但不包含白名单内容
    }

    return null; // 不包含黑名单内容或者也包含了白名单内容
}

// 过滤数据并添加 blackWord 字段
const result = combinedData.reduce((acc, item) => {
    const newItem = checkTranslateContent(item);
    if (newItem !== null) {
        acc.push(newItem);
    }
    return acc;
}, []);

console.log(result, 'result');

// 将 JSON 数据转换为工作表
const worksheet = XLSX.utils.json_to_sheet(result);

// 创建一个新的工作簿并添加工作表
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// 写入 Excel 文件
XLSX.writeFile(workbook, '测试1018.xlsx');