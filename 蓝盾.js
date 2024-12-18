const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 定义文件路径
const Mappath = '/data/landun/workspace/PMGameClient/Tables/ResXlsx/266.国内文本关卡配置表@MapTranslationConfiguration.xlsx';
const Totalpath = '/data/landun/workspace/PMGameClient/Tables/ResXlsx/266.国内文本配置表@TotalTranslationConfiguration.xlsx';
const Systempath = '/data/landun/workspace/PMGameClient/Tables/ResXlsx/266.国内文本系统配置表@SystemTranslationConfiguration.xlsx';
const Opspath = '/data/landun/workspace/PMGameClient/Tables/ResXlsx/266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx';
const Battlepath = '/data/landun/workspace/PMGameClient/Tables/ResXlsx/266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx';
const blackListPath = '/data/landun/workspace/PMGameClient/Tables/TranslateDiff/blackList.xlsx';
const whiteListPath = '/data/landun/workspace/PMGameClient/Tables/TranslateDiff/whiteList.xlsx';

// 输出文件路径
const outputPath = '/data/landun/workspace/PMGameClient/Tables/TranslateDiff/MainlandTrunksensitiveResults241218.xlsx';
const outputDir = path.dirname(outputPath);

// 确保输出目录存在
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// 读取 Excel 文件并记录文件名
function readExcel(filePath, fileName) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet).map(item => ({ ...item, "来源": fileName }));
}

// 读取七个 Excel 文件并记录文件名
const MapData = readExcel(Mappath, "MapTranslationConfiguration");
const TotalData = readExcel(Totalpath, "TotalTranslationConfiguration");
const SystemData = readExcel(Systempath, "SystemTranslationConfiguration");
const OpsData = readExcel(Opspath, "OpsEvenTranslationConfiguration");
const BattleData = readExcel(Battlepath, "BattleTranslationConfiguration");

const blackListData = readExcel(blackListPath, "BlackList");
const whiteListData = readExcel(whiteListPath, "WhiteList");

// 合并数据
const combinedData = [...MapData, ...TotalData, ...SystemData, ...OpsData, ...BattleData];

// 获取黑名单和白名单
const blackList = new Set(blackListData.map(item => item.blackList));
const whiteList = new Set(whiteListData.map(item => item.whiteList));

// 检查 Translate 列是否包含黑名单内容并且不包含白名单内容，并记录包含的黑名单词汇
function checkTranslateContent(item) {
    if (!item.Translate) return null;

    const translateStr = String(item.Translate);
    let blackWord = '';

    for (let black of blackList) {
        if (translateStr.includes(black)) {
            let containsWhite = false;
            for (let white of whiteList) {
                if (translateStr.includes(white)) {
                    containsWhite = true;
                    break;
                }
            }
            if (!containsWhite) {
                blackWord += black + ', ';
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
    if (newItem !== null) acc.push(newItem);
    return acc;
}, []);

// 将 JSON 数据转换为工作表
const worksheet = XLSX.utils.json_to_sheet(result);

// 创建一个新的工作簿并添加工作表
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// 写入 Excel 文件到指定的绝对路径
XLSX.writeFile(workbook, outputPath);

console.log(`敏感词检测结果已保存至: ${outputPath}`);