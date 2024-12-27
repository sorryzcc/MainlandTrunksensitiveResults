const XLSX = require('xlsx');
const path = require('path');

// 定义文件路径
const Mappath = path.join(__dirname, '266.国内文本关卡配置表@MapTranslationConfiguration.xlsx');
const Totalpath = path.join(__dirname, '266.国内文本配置表@TotalTranslationConfiguration.xlsx');
const Systempath = path.join(__dirname, '266.国内文本系统配置表@SystemTranslationConfiguration.xlsx');
const Opspath = path.join(__dirname, '266.国内文本运营配置表@OpsEvenTranslationConfiguration.xlsx');
const Battlepath = path.join(__dirname, '266.国内文本战斗配置表@BattleTranslationConfiguration.xlsx');

// 使用绝对路径或确保路径正确
const translateDiffPath = path.join(__dirname, 'TranslateDiff', '大陆版敏感词241121.xlsx'); // 包含 blacklist 和 whitelist 的文件

// 读取 Excel 文件并记录文件名
function readExcel(filePath, fileName) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet).map(item => ({ ...item, "来源": fileName }));
        console.log(`成功读取文件 ${filePath}`);
        return data;
    } catch (error) {
        console.error(`读取文件 ${filePath} 失败:`, error);
        return [];
    }
}

// 从单个文件读取两个工作表的数据
function readSheetsFromSingleFile(filePath, sheetNames) {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetsData = {};
        const actualSheetNames = workbook.SheetNames;

        // 调试输出：打印所有工作表名称
        console.log('Available sheets in the file:', actualSheetNames);

        sheetNames.forEach(sheetName => {
            if (actualSheetNames.includes(sheetName)) {
                const worksheet = workbook.Sheets[sheetName];
                sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                console.log(`成功读取工作表 ${sheetName}`);
            } else {
                console.warn(`工作表 "${sheetName}" 未在文件中找到.`);
            }
        });

        return sheetsData;
    } catch (error) {
        console.error(`读取文件 ${filePath} 失败:`, error);
        return {};
    }
}

// 读取七个 Excel 文件并记录文件名
const MapData = readExcel(Mappath, "MapTranslationConfiguration");
const TotalData = readExcel(Totalpath, "TotalTranslationConfiguration");
const SystemData = readExcel(Systempath, "SystemTranslationConfiguration");
const OpsData = readExcel(Opspath, "OpsEvenTranslationConfiguration");
const BattleData = readExcel(Battlepath, "BattleTranslationConfiguration");

// 从单个文件读取黑名单和白名单数据，并打印可用的工作表名称
const { blacklist, whitelist } = readSheetsFromSingleFile(translateDiffPath, ['blacklist', 'whitelist']);

// 检查是否成功读取了黑名单和白名单数据
if (!blacklist || !Array.isArray(blacklist) || blacklist.length === 0) {
    console.error('未能正确读取 blacklist 数据');
}
if (!whitelist || !Array.isArray(whitelist) || whitelist.length === 0) {
    console.error('未能正确读取 whitelist 数据');
}

// 合并数据
const combinedData = [...MapData, ...TotalData, ...SystemData, ...OpsData, ...BattleData];

// 获取黑名单和白名单集合
const blackListSet = new Set((blacklist || []).map(item => item['blacklist']));
const whiteListSet = new Set((whitelist || []).map(item => item['whitelist']));

// 检查 Translate 列是否包含黑名单内容并且不包含白名单内容，并记录包含的黑名单词汇
function checkTranslateContent(item) {
    // 确保 Translate 属性存在并且转换为字符串
    if (!item.Translate) {
        return null; // 跳过没有 Translate 字段的对象
    }
    const translateStr = String(item.Translate);

    let blackWord = ''; // 记录包含的黑名单词汇

    for (let black of blackListSet) {
        if (translateStr.includes(black)) {
            // 检查是否也包含白名单内容
            let containsWhite = false;
            for (let white of whiteListSet) {
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
XLSX.writeFile(workbook, 'MainlandTrunksensitiveResults241227.xlsx');