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

console.log(whiteListData,'whiteListData');
// console.log(blackListData,'blackListData');



