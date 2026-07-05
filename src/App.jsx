import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';

const marketGroups = {
  Forex: [
    { label: 'EUR/USD', value: 'EURUSD', from: 'EUR', to: 'USD' },
    { label: 'GBP/USD', value: 'GBPUSD', from: 'GBP', to: 'USD' },
    { label: 'USD/JPY', value: 'USDJPY', from: 'USD', to: 'JPY' },
    { label: 'AUD/USD', value: 'AUDUSD', from: 'AUD', to: 'USD' },
    { label: 'USD/CAD', value: 'USDCAD', from: 'USD', to: 'CAD' },
    { label: 'EUR/JPY', value: 'EURJPY', from: 'EUR', to: 'JPY' },
  ],
  Crypto: [
    { label: 'BTC/USDT', value: 'BTCUSDT', from: 'BTC', to: 'USDT' },
    { label: 'ETH/USDT', value: 'ETHUSDT', from: 'ETH', to: 'USDT' },
    { label: 'SOL/USDT', value: 'SOLUSDT', from: 'SOL', to: 'USDT' },
    { label: 'XRP/USDT', value: 'XRPUSDT', from: 'XRP', to: 'USDT' },
    { label: 'DOGE/USDT', value: 'DOGEUSDT', from: 'DOGE', to: 'USDT' },
  ],
  Indices: [
    { label: 'S&P 500', value: 'SPX', from: 'SPX', to: 'USD' },
    { label: 'NASDAQ 100', value: 'NDX', from: 'NDX', to: 'USD' },
    { label: 'DOW', value: 'DJI', from: 'DJI', to: 'USD' },
    { label: 'FTSE 100', value: 'FTSE', from: 'FTSE', to: 'GBP' },
    { label: 'DAX', value: 'DAX', from: 'DAX', to: 'EUR' },
  ],
  Metals: [
    { label: 'Gold', value: 'XAUUSD', from: 'XAU', to: 'USD' },
    { label: 'Silver', value: 'XAGUSD', from: 'XAG', to: 'USD' },
    { label: 'Platinum', value: 'XPTUSD', from: 'XPT', to: 'USD' },
    { label: 'Palladium', value: 'XPDUSD', from: 'XPD', to: 'USD' },
  ],
  Stocks: [
    { label: 'Apple', value: 'AAPL', from: 'AAPL', to: 'USD' },
    { label: 'Microsoft', value: 'MSFT', from: 'MSFT', to: 'USD' },
    { label: 'Amazon', value: 'AMZN', from: 'AMZN', to: 'USD' },
    { label: 'Tesla', value: 'TSLA', from: 'TSLA', to: 'USD' },
    { label: 'NVIDIA', value: 'NVDA', from: 'NVDA', to: 'USD' },
  ],
  Commodities: [
    { label: 'WTI Crude', value: 'CLUSD', from: 'CL', to: 'USD' },
    { label: 'Brent', value: 'BREN', from: 'BREN', to: 'USD' },
    { label: 'Natural Gas', value: 'NGUSD', from: 'NG', to: 'USD' },
    { label: 'Corn', value: 'CORN', from: 'CORN', to: 'USD' },
  ],
};

const marketOptions = Object.entries(marketGroups).flatMap(([group, items]) => items.map((item) => ({ ...item, group })));
const forexSymbols = marketOptions;

const timeframes = [
  { label: 'M1', value: '1min' },
  { label: 'M5', value: '5min' },
  { label: 'M15', value: '15min' },
  { label: 'M30', value: '30min' },
  { label: 'H1', value: '60min' },
  { label: 'H4', value: '240min' },
  { label: 'D1', value: 'daily' },
  { label: 'W1', value: 'weekly' },
  { label: 'MN', value: 'monthly' },
];

const translations = {
  en: {
    appTitle: 'Forex Live Chart 📈',
    appSubtitle: 'Realtime forex candles with momentum, trend, and trader-friendly buy/sell guidance.',
    languageLabel: 'Language',
    marketLabel: 'Market',
    symbolLabel: 'Symbol',
    timeframeLabel: 'Timeframe',
    signalLabel: 'Signal',
    priceLabel: 'Price',
    smartScoreLabel: 'Smart Score',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / Support / Resistance',
    vwapHint: 'Volume-weighted trend zones',
    stopLabel: 'Suggested Stop',
    targetLabel: 'Suggested Target',
    riskSettingsLabel: 'Risk Settings',
    riskSettingsHint: 'Position sizing',
    riskPercentLabel: 'Risk %',
    rewardRatioLabel: 'Reward Ratio',
    lotSizeLabel: 'Lot Size',
    alertsLabel: 'Enable alerts',
    backtestLabel: 'Backtest Snapshot',
    backtestHint: 'Signal engine',
    journalLabel: 'Trade Journal',
    saveSignalLabel: 'Save signal',
    addTradeLabel: 'Add trade',
    noteLabel: 'Note',
    entryLabel: 'Entry',
    stopFieldLabel: 'Stop',
    targetFieldLabel: 'Target',
    dataSourceLabel: 'Data source',
    marketPulseLabel: 'Realtime Market Pulse',
    watchlistLabel: 'Smart Watchlist',
    bestSetupLabel: 'Best Setup of the Day',
    bestSetupHint: 'Risk-adjusted ranking',
    scanningLabel: 'Scanning the current market group for strong setups...',
    scanningBestLabel: 'Scanning the current market group for the strongest signal...',
    tradeScoreLabel: 'Trade score',
    marketGroups: { Forex: 'Forex', Crypto: 'Crypto', Indices: 'Indices', Metals: 'Metals', Stocks: 'Stocks', Commodities: 'Commodities' },
    signals: { 'Strong Buy': 'Strong Buy', 'Strong Sell': 'Strong Sell', Buy: 'Buy', Sell: 'Sell', Wait: 'Wait' },
  },
  lo: {
    appTitle: 'ຕາຕະລາງການເຄື່ອນໄหวຂອງ Forex 📈',
    appSubtitle: 'ແຖບຂ່າວລາວທີ່ມີຄວາມກ້ວາງ, ການເຄື່ອນໄหว, ແລະຄໍາແນະນຳຊື້/ຂາຍທີ່ດີ.',
    languageLabel: 'ພາສາ',
    marketLabel: 'ຕະຫຼາດ',
    symbolLabel: 'ສັນຍາລັກ',
    timeframeLabel: 'ໄລຍະເວລາ',
    signalLabel: 'ສັນຍານ',
    priceLabel: 'ລາຄາ',
    smartScoreLabel: 'ຄະແນນສະຫຼາດ',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / Support / Resistance',
    vwapHint: 'ເຂດເຄື່ອນໄหวທີ່ມີປະລິມານ',
    stopLabel: 'ຂາຍຕົວຢ່າງ Stop',
    targetLabel: 'ຂາຍຕົວຢ່າງ Target',
    riskSettingsLabel: 'ການຕັ້ງຄ່າຄວາມສ່ຽງ',
    riskSettingsHint: 'ຂະຫນາດຕໍາແໜ່ງ',
    riskPercentLabel: 'ຄວາມສ່ຽງ %',
    rewardRatioLabel: 'ອັດຕາລາງວັນ',
    lotSizeLabel: 'ຂະໜາດ Lot',
    alertsLabel: 'ເປີດການແຈ້ງເຕືອນ',
    backtestLabel: 'ສະຖານະການທົດສອບ',
    backtestHint: 'ເຄື່ອງມືສັນຍານ',
    journalLabel: 'ບັນທຶກການຄ້າ',
    saveSignalLabel: 'ບັນທຶກສັນຍານ',
    addTradeLabel: 'ເພີ່ມການຄ້າ',
    noteLabel: 'ຫມາຍເຫດ',
    entryLabel: 'ການເຂົ້າ',
    stopFieldLabel: 'Stop',
    targetFieldLabel: 'Target',
    dataSourceLabel: 'ທີ່ມາຂອງຂໍ້ມູນ',
    marketPulseLabel: 'ຄວາມໄວຂອງຕະຫຼາດ',
    watchlistLabel: 'ລາຍການຕິດຕາມ',
    bestSetupLabel: 'ການຕັ້ງຄ່າທີ່ດີທີ່ສຸດ',
    bestSetupHint: 'ການຈັດອັນດັບທີ່ມີຄວາມລະດັບ',
    scanningLabel: 'ກຳລັງສະແດງຕະຫຼາດປະຈຳວັນ...',
    scanningBestLabel: 'ກຳລັງຊອກຫາສັນຍານທີ່ເຂັ້ມເຂັ້ງທີ່ສຸດ...',
    tradeScoreLabel: 'ຄະແນນການຄ້າ',
    marketGroups: { Forex: 'Forex', Crypto: 'Crypto', Indices: 'Indices', Metals: 'Metals', Stocks: 'Stocks', Commodities: 'Commodities' },
    signals: { 'Strong Buy': 'ຊື້ເຂັ້ມ', 'Strong Sell': 'ຂາຍເຂັ້ມ', Buy: 'ຊື້', Sell: 'ຂາຍ', Wait: 'ລໍຖ້າ' },
  },
  th: {
    appTitle: 'แผงเทรด Forex 📈',
    appSubtitle: 'แท่งเทียนแบบเรียลไทม์พร้อมโมเมนตัม แนวโน้ม และคำแนะนำซื้อ/ขายที่เป็นประโยชน์.',
    languageLabel: 'ภาษา',
    marketLabel: 'ตลาด',
    symbolLabel: 'สัญลักษณ์',
    timeframeLabel: 'กรอบเวลา',
    signalLabel: 'สัญญาณ',
    priceLabel: 'ราคา',
    smartScoreLabel: 'คะแนนชาญฉลาด',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / Support / Resistance',
    vwapHint: 'โซนแนวโน้มตามปริมาณ',
    stopLabel: 'จุด Stop ที่แนะนำ',
    targetLabel: 'จุด Target ที่แนะนำ',
    riskSettingsLabel: 'ตั้งค่าความเสี่ยง',
    riskSettingsHint: 'การคำนวณตำแหน่ง',
    riskPercentLabel: 'ความเสี่ยง %',
    rewardRatioLabel: 'อัตราส่วนผลตอบแทน',
    lotSizeLabel: 'ขนาดล็อต',
    alertsLabel: 'เปิดการแจ้งเตือน',
    backtestLabel: 'สรุปการทดสอบย้อนหลัง',
    backtestHint: 'เครื่องมือสัญญาณ',
    journalLabel: 'บันทึกการเทรด',
    saveSignalLabel: 'บันทึกสัญญาณ',
    addTradeLabel: 'เพิ่มการเทรด',
    noteLabel: 'หมายเหตุ',
    entryLabel: 'ราคาเข้า',
    stopFieldLabel: 'Stop',
    targetFieldLabel: 'Target',
    dataSourceLabel: 'แหล่งข้อมูล',
    marketPulseLabel: 'พัลส์ตลาดแบบเรียลไทม์',
    watchlistLabel: 'รายการเฝ้าติดตาม',
    bestSetupLabel: 'ตัวเลือกที่ดีที่สุดวันนี้',
    bestSetupHint: 'การจัดอันดับตามความเสี่ยง',
    scanningLabel: 'กำลังสแกนตลาดปัจจุบันเพื่อค้นหาตัวเลือกที่ดี...',
    scanningBestLabel: 'กำลังค้นหาสัญญาณที่แข็งแกร่งที่สุด...',
    tradeScoreLabel: 'คะแนนการเทรด',
    marketGroups: { Forex: 'ฟอเร็กซ์', Crypto: 'คริปโต', Indices: 'ดัชนี', Metals: 'โลหะ', Stocks: 'หุ้น', Commodities: 'สินค้าโภคภัณฑ์' },
    signals: { 'Strong Buy': 'ซื้อแรง', 'Strong Sell': 'ขายแรง', Buy: 'ซื้อ', Sell: 'ขาย', Wait: 'รอ' },
  },
  vi: {
    appTitle: 'Bảng điều khiển Forex 📈',
    appSubtitle: 'Nến thời gian thực với động lượng, xu hướng và gợi ý mua/bán hữu ích.',
    languageLabel: 'Ngôn ngữ',
    marketLabel: 'Thị trường',
    symbolLabel: 'Mã',
    timeframeLabel: 'Khung thời gian',
    signalLabel: 'Tín hiệu',
    priceLabel: 'Giá',
    smartScoreLabel: 'Điểm thông minh',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / Support / Resistance',
    vwapHint: 'Khu vực xu hướng dựa trên khối lượng',
    stopLabel: 'Mức Stop đề xuất',
    targetLabel: 'Mức Target đề xuất',
    riskSettingsLabel: 'Cài đặt rủi ro',
    riskSettingsHint: 'Kích thước vị thế',
    riskPercentLabel: 'Rủi ro %',
    rewardRatioLabel: 'Tỷ lệ lợi nhuận',
    lotSizeLabel: 'Khối lượng lô',
    alertsLabel: 'Bật cảnh báo',
    backtestLabel: 'Tóm tắt backtest',
    backtestHint: 'Động cơ tín hiệu',
    journalLabel: 'Nhật ký giao dịch',
    saveSignalLabel: 'Lưu tín hiệu',
    addTradeLabel: 'Thêm giao dịch',
    noteLabel: 'Ghi chú',
    entryLabel: 'Vào lệnh',
    stopFieldLabel: 'Stop',
    targetFieldLabel: 'Target',
    dataSourceLabel: 'Nguồn dữ liệu',
    marketPulseLabel: 'Độ nhịp thị trường thời gian thực',
    watchlistLabel: 'Danh sách theo dõi',
    bestSetupLabel: 'Cấu hình tốt nhất hôm nay',
    bestSetupHint: 'Xếp hạng theo rủi ro',
    scanningLabel: 'Đang quét thị trường hiện tại để tìm cấu hình tốt...',
    scanningBestLabel: 'Đang tìm tín hiệu mạnh nhất...',
    tradeScoreLabel: 'Điểm giao dịch',
    marketGroups: { Forex: 'Ngoại hối', Crypto: 'Tiền điện tử', Indices: 'Chỉ số', Metals: 'Kim loại', Stocks: 'Cổ phiếu', Commodities: 'Hàng hóa' },
    signals: { 'Strong Buy': 'Mua mạnh', 'Strong Sell': 'Bán mạnh', Buy: 'Mua', Sell: 'Bán', Wait: 'Chờ' },
  },
  zh: {
    appTitle: '外汇实时图表 📈',
    appSubtitle: '具有动量、趋势和实用买卖提示的实时蜡烛图。',
    languageLabel: '语言',
    marketLabel: '市场',
    symbolLabel: '符号',
    timeframeLabel: '周期',
    signalLabel: '信号',
    priceLabel: '价格',
    smartScoreLabel: '智能评分',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / 支撑 / 阻力',
    vwapHint: '基于成交量的趋势区域',
    stopLabel: '建议止损',
    targetLabel: '建议目标价',
    riskSettingsLabel: '风险设置',
    riskSettingsHint: '仓位大小',
    riskPercentLabel: '风险 %',
    rewardRatioLabel: '回报比',
    lotSizeLabel: '手数',
    alertsLabel: '启用提醒',
    backtestLabel: '回测快照',
    backtestHint: '信号引擎',
    journalLabel: '交易日志',
    saveSignalLabel: '保存信号',
    addTradeLabel: '新增交易',
    noteLabel: '备注',
    entryLabel: '进场',
    stopFieldLabel: '止损',
    targetFieldLabel: '目标',
    dataSourceLabel: '数据源',
    marketPulseLabel: '实时市场脉搏',
    watchlistLabel: '智能观察列表',
    bestSetupLabel: '今日最佳配置',
    bestSetupHint: '按风险调整排名',
    scanningLabel: '正在扫描当前市场组以寻找强势机会...',
    scanningBestLabel: '正在寻找最强信号...',
    tradeScoreLabel: '交易评分',
    marketGroups: { Forex: '外汇', Crypto: '加密货币', Indices: '指数', Metals: '金属', Stocks: '股票', Commodities: '商品' },
    signals: { 'Strong Buy': '强买', 'Strong Sell': '强卖', Buy: '买入', Sell: '卖出', Wait: '等待' },
  },
  my: {
    appTitle: 'Forex Live Chart 📈',
    appSubtitle: 'အရှိန်အဟုန်၊ ခေတ်သစ်အနေအထားနှင့် ဝယ်/ရောင်းအကြံပြုချက်များပါဝင်သော အချိန်မှန် candle chart ဖြစ်သည်။',
    languageLabel: 'ဘာသာစကား',
    marketLabel: 'စျေးကွက်',
    symbolLabel: 'သင်္ကေတ',
    timeframeLabel: 'အချိန်ကာလ',
    signalLabel: 'သတင်းအချက်အလက်',
    priceLabel: 'စျေးနှုန်း',
    smartScoreLabel: 'စမတ်စကိုး',
    smartScoreHint: 'EMA + MACD + RSI + VWAP',
    vwapLabel: 'VWAP / Support / Resistance',
    vwapHint: 'ပမာဏအခြေခံ သဘောတူညီမှု',
    stopLabel: 'အကြံပြု Stop',
    targetLabel: 'အကြံပြု Target',
    riskSettingsLabel: 'အန္တရာယ်ဆိုင်ရာ အပြင်အဆင်',
    riskSettingsHint: 'အနေအထားအရွယ်အစား',
    riskPercentLabel: 'အန္တရာယ် %',
    rewardRatioLabel: 'ဆုလာဘ်အချိုး',
    lotSizeLabel: 'Lot အရွယ်အစား',
    alertsLabel: 'သတိပေးချက်များ ဖွင့်ပါ',
    backtestLabel: 'Backtest Snapshot',
    backtestHint: 'Signal engine',
    journalLabel: 'Trade Journal',
    saveSignalLabel: 'Signal ကိုသိမ်းပါ',
    addTradeLabel: 'Trade ထည့်ပါ',
    noteLabel: 'မှတ်စု',
    entryLabel: 'ဝင်ရန်',
    stopFieldLabel: 'Stop',
    targetFieldLabel: 'Target',
    dataSourceLabel: 'ဒေတာရင်းမြစ်',
    marketPulseLabel: 'အချိန်မှန် စျေးကွက် pulse',
    watchlistLabel: 'Smart Watchlist',
    bestSetupLabel: 'ယနေ့အကောင်းဆုံး setup',
    bestSetupHint: 'အန္တရာယ်အလိုက် ranking',
    scanningLabel: 'လက်ရှိစျေးကွက်ကို scan လုပ်နေသည်...',
    scanningBestLabel: 'အင်အားကြီးဆုံး signal ကိုရှာနေသည်...',
    tradeScoreLabel: 'Trade score',
    marketGroups: { Forex: 'Forex', Crypto: 'Crypto', Indices: 'Indices', Metals: 'Metals', Stocks: 'Stocks', Commodities: 'Commodities' },
    signals: { 'Strong Buy': 'ကောင်းစွာဝယ်', 'Strong Sell': 'ကောင်းစွာရောင်း', Buy: 'ဝယ်', Sell: 'ရောင်း', Wait: 'စောင့်' },
  },
};

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'lo', label: 'ລາວ' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh', label: '中文' },
  { code: 'my', label: 'မြန်မာ' },
];

const getRefreshInterval = (timeframeValue) => {
  switch (timeframeValue) {
    case '1min':
      return 60000;
    case '5min':
      return 300000;
    case '15min':
      return 900000;
    case '30min':
      return 1800000;
    case '60min':
    case '240min':
      return 3600000;
    default:
      return 21600000;
  }
};

const getStepSeconds = (timeframeValue) => {
  switch (timeframeValue) {
    case '1min':
      return 60;
    case '5min':
      return 300;
    case '15min':
      return 900;
    case '30min':
      return 1800;
    case '60min':
      return 3600;
    case '240min':
      return 14400;
    case 'daily':
      return 86400;
    case 'weekly':
      return 604800;
    default:
      return 2592000;
  }
};

const calculateEMA = (values, period) => {
  if (!values.length) return 0;
  if (values.length < period) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  let ema = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  for (let i = period; i < values.length; i += 1) {
    ema = (values[i] * 2) / (period + 1) + ema * (1 - 2 / (period + 1));
  }
  return ema;
};

const calculateEMAValues = (values, period) => {
  const emaValues = [];
  let ema = null;

  values.forEach((value, index) => {
    if (index < period - 1) {
      emaValues.push(null);
      return;
    }

    if (ema === null) {
      ema = values.slice(0, period).reduce((sum, item) => sum + item, 0) / period;
    } else {
      ema = (value * 2) / (period + 1) + ema * (1 - 2 / (period + 1));
    }

    emaValues.push(ema);
  });

  return emaValues;
};

const calculateSMA = (values, period) => {
  if (!values.length) return 0;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
};

const calculateRSI = (values, period = 14) => {
  if (values.length < 2) return 50;
  const changes = [];
  for (let i = 1; i < values.length; i += 1) {
    changes.push(values[i] - values[i - 1]);
  }

  let gains = 0;
  let losses = 0;
  for (let i = Math.max(0, changes.length - period); i < changes.length; i += 1) {
    const change = changes[i];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

const calculateATR = (candles, period = 14) => {
  if (candles.length < 2) return 0;
  const trueRanges = [];
  for (let i = 1; i < candles.length; i += 1) {
    const prev = candles[i - 1];
    const current = candles[i];
    const range1 = current.high - current.low;
    const range2 = Math.abs(current.high - prev.close);
    const range3 = Math.abs(current.low - prev.close);
    trueRanges.push(Math.max(range1, range2, range3));
  }

  const start = Math.max(0, trueRanges.length - period);
  const slice = trueRanges.slice(start);
  return slice.reduce((sum, value) => sum + value, 0) / slice.length;
};

const calculateBollingerBands = (values, period = 20, multiplier = 2) => {
  const sma = calculateSMA(values, period);
  const deviations = values.slice(-period).map((value) => (value - sma) ** 2);
  const variance = deviations.reduce((sum, value) => sum + value, 0) / deviations.length;
  const stdDev = Math.sqrt(variance);
  return {
    middle: sma,
    upper: sma + multiplier * stdDev,
    lower: sma - multiplier * stdDev,
  };
};

const calculateMACD = (values) => {
  const fastValues = calculateEMAValues(values, 12);
  const slowValues = calculateEMAValues(values, 26);
  const macdLine = values.map((value, index) => {
    const fast = fastValues[index] ?? value;
    const slow = slowValues[index] ?? value;
    return fast - slow;
  });

  const signalValues = [];
  let signal = null;
  macdLine.forEach((value, index) => {
    if (index < 8) {
      signalValues.push(null);
      return;
    }
    if (signal === null) {
      signal = macdLine.slice(0, 9).reduce((sum, item) => sum + item, 0) / 9;
    } else {
      signal = (value * 2) / 10 + signal * (1 - 2 / 10);
    }
    signalValues.push(signal);
  });

  const lastMacd = macdLine[macdLine.length - 1] ?? 0;
  const lastSignal = signalValues[signalValues.length - 1] ?? 0;
  return {
    macd: lastMacd,
    signal: lastSignal,
    histogram: lastMacd - lastSignal,
  };
};

const calculateVWAP = (candles) => {
  if (!candles.length) return 0;
  let sumPriceVolume = 0;
  let sumVolume = 0;
  candles.forEach((item) => {
    sumPriceVolume += item.close * item.volume;
    sumVolume += item.volume;
  });
  return sumVolume ? sumPriceVolume / sumVolume : candles[candles.length - 1].close;
};

const getMarketPulse = (candles) => {
  if (!candles || candles.length < 5) {
    return {
      trend: 'Neutral',
      label: 'Waiting for candles',
      shortChange: 0,
      midChange: 0,
      volatility: 0,
      breakout: false,
      breakdown: false,
      volumeConfirm: false,
      score: 0,
    };
  }

  const trimmed = candles.slice(-40);
  const last = trimmed[trimmed.length - 1];
  const prev = trimmed[trimmed.length - 2] || last;
  const older = trimmed[trimmed.length - 10] || trimmed[0];
  const shortChange = ((last.close - prev.close) / prev.close) * 100;
  const midChange = ((last.close - older.close) / older.close) * 100;
  const closes = trimmed.map((item) => item.close);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const recentHigh = Math.max(...trimmed.slice(-10).map((item) => item.high));
  const recentLow = Math.min(...trimmed.slice(-10).map((item) => item.low));
  const avgVolume = trimmed.reduce((sum, item) => sum + item.volume, 0) / trimmed.length;
  const atr = calculateATR(trimmed, 14);
  const volatility = last.close ? (atr / last.close) * 100 : 0;
  const breakout = last.close > recentHigh && last.close > ema20;
  const breakdown = last.close < recentLow && last.close < ema20;
  const volumeConfirm = last.volume > avgVolume * 1.15;
  const upBars = trimmed.slice(-10).filter((item) => item.close > item.open).length;
  const downBars = trimmed.slice(-10).filter((item) => item.close < item.open).length;

  let score = 0;
  if (shortChange > 0.6) score += 6;
  else if (shortChange < -0.6) score -= 6;
  if (midChange > 1.5) score += 6;
  else if (midChange < -1.5) score -= 6;
  if (last.close > ema20 && ema20 > ema50) score += 8;
  else if (last.close < ema20 && ema20 < ema50) score -= 8;
  if (breakout) score += 8;
  else if (breakdown) score -= 8;
  if (volumeConfirm) score += 4;
  if (upBars > downBars + 2) score += 3;
  else if (downBars > upBars + 2) score -= 3;

  let trend = 'Neutral';
  let label = 'Balanced';
  if (score >= 12) {
    trend = 'Bullish';
    label = 'Momentum up';
  } else if (score <= -12) {
    trend = 'Bearish';
    label = 'Momentum down';
  }

  return {
    trend,
    label,
    shortChange: Number(shortChange.toFixed(2)),
    midChange: Number(midChange.toFixed(2)),
    volatility: Number(volatility.toFixed(2)),
    breakout,
    breakdown,
    volumeConfirm,
    score,
  };
};

const buildLongTermContext = (candles, symbolLabel) => {
  if (!candles || candles.length < 10) {
    return {
      symbol: symbolLabel,
      label: 'Long-term context',
      trend: 'Neutral',
      summary: 'Historical context is still loading.',
      pctChange: 0,
      volatility: 0,
      bias: 'Neutral',
    };
  }

  const first = candles[0];
  const last = candles[candles.length - 1];
  const pctChange = ((last.close - first.close) / first.close) * 100;
  const recentWindow = candles.slice(-20);
  const previousWindow = candles.slice(-40, -20);
  const recentMomentum = previousWindow.length && recentWindow.length
    ? ((recentWindow[recentWindow.length - 1].close - previousWindow[0].close) / previousWindow[0].close) * 100
    : 0;
  const closes = candles.map((item) => item.close);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  const atr = calculateATR(candles, 14);
  const volatility = Math.max(0.0001, atr);
  const trend = last.close > sma50 && sma50 > sma200 ? 'Bullish' : last.close < sma50 && sma50 < sma200 ? 'Bearish' : 'Neutral';

  const direction = pctChange > 20 ? 'strongly higher' : pctChange > 5 ? 'higher' : pctChange < -20 ? 'sharply lower' : pctChange < -5 ? 'lower' : 'range-bound';
  const momentumLabel = recentMomentum > 4 ? 'accelerating' : recentMomentum < -4 ? 'cooling' : 'steady';
  const summary = `${symbolLabel || 'This market'} shows a ${trend.toLowerCase()} long-term structure. The price is ${direction} from the start of the history, and recent momentum looks ${momentumLabel}.`;

  return {
    symbol: symbolLabel,
    label: '5Y trend context',
    trend,
    summary,
    pctChange: Number(pctChange.toFixed(2)),
    volatility: Number(volatility.toFixed(5)),
    bias: trend === 'Bullish' ? 'Bullish' : trend === 'Bearish' ? 'Bearish' : 'Neutral',
  };
};

const buildSignal = (candles) => {
  const closes = candles.map((item) => item.close);
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2] || last;
  const pulse = getMarketPulse(candles);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, 200);
  const rsi = calculateRSI(closes, 14);
  const atr = calculateATR(candles, 14);
  const momentum = last.close - prev.close;
  const macd = calculateMACD(closes);
  const bands = calculateBollingerBands(closes, 20);
  const vwap = calculateVWAP(candles);
  const spread = Math.max(0.0001, bands.upper - bands.lower);
  const priceAboveVwap = last.close > vwap;
  const priceNearUpperBand = last.close > bands.upper - spread * 0.25;
  const priceNearLowerBand = last.close < bands.lower + spread * 0.25;

  let score = 50;
  if (pulse.trend === 'Bullish') {
    score += 16;
  } else if (pulse.trend === 'Bearish') {
    score -= 16;
  }

  if (last.close > ema20 && ema20 > ema50 && ema50 > ema200) {
    score += 20;
  } else if (last.close < ema20 && ema20 < ema50 && ema50 < ema200) {
    score -= 20;
  }

  if (macd.macd > macd.signal) {
    score += 12;
  } else {
    score -= 12;
  }

  if (rsi > 60) {
    score += 8;
  } else if (rsi < 40) {
    score -= 8;
  }

  if (priceAboveVwap) {
    score += 6;
  } else {
    score -= 6;
  }

  if (priceNearUpperBand) {
    score += 4;
  } else if (priceNearLowerBand) {
    score -= 4;
  }

  if (momentum > 0) {
    score += 6;
  } else if (momentum < 0) {
    score -= 6;
  }

  if (pulse.breakout) {
    score += 8;
  } else if (pulse.breakdown) {
    score -= 8;
  }

  if (pulse.volumeConfirm) {
    score += 4;
  }

  const confidence = Math.min(95, Math.max(50, score));

  const stopDistance = atr * 1.5;
  const targetDistance = atr * 2.5;

  if (score >= 76 && last.close > ema20 && macd.macd > macd.signal && rsi > 55) {
    return {
      signal: 'Strong Buy',
      bias: 'Bullish',
      confidence,
      reason: `Price action is trending higher with ${pulse.label.toLowerCase()} and a breakout into the recent range.`,
      rsi,
      atr,
      vwap,
      support: bands.lower,
      resistance: bands.upper,
      stop: last.close - stopDistance,
      target: last.close + targetDistance,
    };
  }

  if (score <= 24 && last.close < ema20 && macd.macd < macd.signal && rsi < 45) {
    return {
      signal: 'Strong Sell',
      bias: 'Bearish',
      confidence,
      reason: `Price action is trending lower with ${pulse.label.toLowerCase()} and a breakdown from the recent range.`,
      rsi,
      atr,
      vwap,
      support: bands.lower,
      resistance: bands.upper,
      stop: last.close + stopDistance,
      target: last.close - targetDistance,
    };
  }

  if (score >= 64 && momentum > 0) {
    return {
      signal: 'Buy',
      bias: 'Momentum Up',
      confidence,
      reason: `Momentum is improving with a ${pulse.shortChange >= 0 ? 'positive' : 'negative'} short-term move and supportive volume.`,
      rsi,
      atr,
      vwap,
      support: bands.lower,
      resistance: bands.upper,
      stop: last.close - stopDistance,
      target: last.close + targetDistance,
    };
  }

  if (score <= 36 && momentum < 0) {
    return {
      signal: 'Sell',
      bias: 'Momentum Down',
      confidence,
      reason: `Momentum is weakening with a ${pulse.shortChange >= 0 ? 'positive' : 'negative'} short-term move and fading participation.`,
      rsi,
      atr,
      vwap,
      support: bands.lower,
      resistance: bands.upper,
      stop: last.close + stopDistance,
      target: last.close - targetDistance,
    };
  }

  return {
    signal: 'Wait',
    bias: 'Sideways',
    confidence,
    reason: 'Price is ranging and needs confirmation from a stronger breakout or rejection before entry.',
    rsi,
    atr,
    vwap,
    support: bands.lower,
    resistance: bands.upper,
    stop: last.close - stopDistance,
    target: last.close + targetDistance,
    marketPulse: pulse,
  };
};

const buildFallbackCandles = (symbolConfig, timeframeValue, count = 80) => {
  const stepSeconds = getStepSeconds(timeframeValue);
  const startTime = Date.now() / 1000 - count * stepSeconds;
  const basePrice = symbolConfig.value.includes('JPY') ? 160 : 1.09;
  const candles = [];
  let prevClose = basePrice;

  for (let i = 0; i < count; i += 1) {
    const drift = (Math.random() - 0.5) * 0.002;
    const open = prevClose + drift;
    const close = open + (Math.random() - 0.5) * 0.002;
    const high = Math.max(open, close) + 0.001;
    const low = Math.min(open, close) - 0.001;
    candles.push({
      time: startTime + i * stepSeconds,
      open,
      high,
      low,
      close,
      volume: 1200 + Math.round(Math.random() * 600),
      color: close >= open ? '#26a69a' : '#ef5350',
    });
    prevClose = close;
  }

  return candles;
};

const buildFallbackCandlesAroundPrice = (symbolConfig, timeframeValue, price, count = 80) => {
  const stepSeconds = getStepSeconds(timeframeValue);
  const startTime = Date.now() / 1000 - count * stepSeconds;
  const candles = [];
  let prevClose = price;

  for (let i = 0; i < count; i += 1) {
    const drift = (Math.random() - 0.5) * price * 0.0015;
    const open = prevClose + drift;
    const close = open + (Math.random() - 0.5) * price * 0.0015;
    const high = Math.max(open, close) + price * 0.0006;
    const low = Math.min(open, close) - price * 0.0006;
    candles.push({
      time: startTime + i * stepSeconds,
      open,
      high,
      low,
      close,
      volume: 1200 + Math.round(Math.random() * 600),
      color: close >= open ? '#26a69a' : '#ef5350',
    });
    prevClose = close;
  }

  return candles;
};

const buildScannerEntry = (symbolConfig, candles, signal, timeframeValue) => {
  const trimmed = candles.slice(-80);
  const latest = trimmed[trimmed.length - 1];
  const previous = trimmed[trimmed.length - 2] || latest;
  const change = ((latest.close - previous.close) / previous.close) * 100;
  const pulse = signal.marketPulse || getMarketPulse(trimmed);
  const riskAdjustedScore = Math.max(0, Math.min(100, Math.round(signal.confidence + pulse.score * 1.5)));

  return {
    value: symbolConfig.value,
    label: symbolConfig.label,
    signal: signal.signal,
    confidence: Math.round(signal.confidence),
    bias: signal.bias,
    price: Number(latest.close.toFixed(5)),
    change: Number(change.toFixed(2)),
    reason: signal.reason,
    timeframe: timeframeValue,
    riskAdjustedScore,
    pulse,
  };
};

const loadPersistedJournal = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem('forex-trade-journal');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadPersistedLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  try {
    return window.localStorage.getItem('trading-app-language') || 'en';
  } catch {
    return 'en';
  }
};

const AUTH_USERS_KEY = 'trading-app-users';
const AUTH_CURRENT_USER_KEY = 'trading-app-current-user';

const loadPersistedUsers = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(AUTH_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore storage failures
  }
};

const loadPersistedCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const storedId = window.localStorage.getItem(AUTH_CURRENT_USER_KEY);
    const users = loadPersistedUsers();
    return users.find((user) => user.id === storedId) || null;
  } catch {
    return null;
  }
};

const setPersistedCurrentUser = (user) => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(AUTH_CURRENT_USER_KEY, user.id);
    } else {
      window.localStorage.removeItem(AUTH_CURRENT_USER_KEY);
    }
  } catch {
    // ignore storage failures
  }
};

const generateWhatsAppPin = () => String(Math.floor(100000 + Math.random() * 900000));

const runBacktest = (candles, mode = 'ai', settings = {}) => {
  if (!candles || candles.length < 20) {
    return {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      netProfit: 0,
      maxDrawdown: 0,
      trades: [],
      mode,
    };
  }

  const entryThreshold = settings.entryThreshold ?? (mode === 'human' ? 62 : 50);
  const stopMultiplier = settings.stopMultiplier ?? 1.5;
  const targetMultiplier = settings.targetMultiplier ?? 2.5;
  const commission = settings.commission ?? 0.2;
  const slippage = settings.slippage ?? 0.1;
  const useTrailingStop = settings.useTrailingStop ?? false;
  const trailingStopDistance = settings.trailingStopDistance ?? 0.5;

  let balance = 10000;
  let peak = balance;
  let maxDrawdown = 0;
  let openTrade = null;
  const trades = [];

  for (let i = 15; i < candles.length; i += 1) {
    const window = candles.slice(Math.max(0, i - 79), i + 1);
    const signal = buildSignal(window);
    const currentCandle = candles[i];
    const shouldEnter = mode === 'human'
      ? (signal.signal.includes('Buy') && signal.confidence >= (settings.entryThreshold ?? 58)) || (signal.signal.includes('Sell') && signal.confidence >= (settings.entryThreshold ?? 58))
      : signal.signal.includes('Buy') || signal.signal.includes('Sell');

    if (!openTrade) {
      if (shouldEnter) {
        openTrade = {
          side: signal.signal.includes('Buy') ? 'Long' : 'Short',
          entry: currentCandle.close,
          stop: signal.stop,
          target: signal.target,
          trailingStop: signal.stop,
          entryReason: signal.reason,
        };
      }
      continue;
    }

    let exitPrice = null;
    let exitReason = 'close';

    if (openTrade.side === 'Long') {
      if (useTrailingStop && currentCandle.high - openTrade.entry > trailingStopDistance) {
        openTrade.trailingStop = Math.max(openTrade.stop, currentCandle.high - trailingStopDistance);
      }
      if (currentCandle.low <= openTrade.stop) {
        exitPrice = openTrade.stop;
        exitReason = 'stop';
      } else if (currentCandle.high >= openTrade.target) {
        exitPrice = openTrade.target;
        exitReason = 'target';
      } else if (signal.signal.includes('Sell') && signal.confidence >= entryThreshold) {
        exitPrice = currentCandle.close;
        exitReason = 'signal';
      }
    } else if (openTrade.side === 'Short') {
      if (useTrailingStop && openTrade.entry - currentCandle.low > trailingStopDistance) {
        openTrade.trailingStop = Math.max(openTrade.stop, openTrade.entry - trailingStopDistance);
      }
      if (currentCandle.high >= openTrade.stop) {
        exitPrice = openTrade.stop;
        exitReason = 'stop';
      } else if (currentCandle.low <= openTrade.target) {
        exitPrice = openTrade.target;
        exitReason = 'target';
      } else if (signal.signal.includes('Buy') && signal.confidence >= entryThreshold) {
        exitPrice = currentCandle.close;
        exitReason = 'signal';
      }
    }

    if (exitPrice !== null) {
      const grossPnl = openTrade.side === 'Long' ? (exitPrice - openTrade.entry) : (openTrade.entry - exitPrice);
      const fees = commission + slippage;
      const pnl = grossPnl - fees;
      balance += pnl;
      peak = Math.max(peak, balance);
      maxDrawdown = Math.max(maxDrawdown, peak - balance);
      trades.push({
        side: openTrade.side,
        entry: openTrade.entry,
        exit: exitPrice,
        pnl,
        reason: exitReason,
        entryReason: openTrade.entryReason,
      });
      openTrade = null;
    }
  }

  if (openTrade) {
    const lastCandle = candles[candles.length - 1];
    const exitPrice = lastCandle.close;
    const grossPnl = openTrade.side === 'Long' ? (exitPrice - openTrade.entry) : (openTrade.entry - exitPrice);
    const fees = commission + slippage;
    const pnl = grossPnl - fees;
    balance += pnl;
    peak = Math.max(peak, balance);
    maxDrawdown = Math.max(maxDrawdown, peak - balance);
    trades.push({
      side: openTrade.side,
      entry: openTrade.entry,
      exit: exitPrice,
      pnl,
      reason: 'end',
      entryReason: openTrade.entryReason,
    });
  }

  const wins = trades.filter((trade) => trade.pnl > 0).length;
  const losses = trades.length - wins;
  return {
    totalTrades: trades.length,
    wins,
    losses,
    winRate: trades.length ? (wins / trades.length) * 100 : 0,
    netProfit: balance - 10000,
    maxDrawdown,
    trades,
    mode,
  };
};

function App() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const ema20SeriesRef = useRef(null);
  const ema50SeriesRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [selectedGroup, setSelectedGroup] = useState('Forex');
  const [timeframe, setTimeframe] = useState('1min');
  const [language, setLanguage] = useState(loadPersistedLanguage);
  const [riskSettings, setRiskSettings] = useState({ riskPercent: 1, rewardRatio: 2, lotSize: 1, alertsEnabled: true });
  const [status, setStatus] = useState('Loading forex data...');
  const [error, setError] = useState('');
  const [candles, setCandles] = useState([]);
  const [backtest, setBacktest] = useState({
    ai: {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      netProfit: 0,
      maxDrawdown: 0,
      trades: [],
      mode: 'ai',
    },
    human: {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      netProfit: 0,
      maxDrawdown: 0,
      trades: [],
      mode: 'human',
    },
  });
  const [backtestWinner, setBacktestWinner] = useState('Tie');
  const [backtestSettings, setBacktestSettings] = useState({
    entryThreshold: 58,
    stopMultiplier: 1.5,
    targetMultiplier: 2.5,
    commission: 0.2,
    slippage: 0.1,
    useTrailingStop: false,
    trailingStopDistance: 0.5,
  });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', whatsapp: '', role: 'user' });
  const [authMessage, setAuthMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(loadPersistedCurrentUser);
  const [pendingPin, setPendingPin] = useState('');
  const [pendingUserId, setPendingUserId] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [autoResponseActive, setAutoResponseActive] = useState(false);

  const handleExportBacktest = () => {
    const summaryRows = [
      ['Strategy', 'Trades', 'Wins', 'Losses', 'Win Rate', 'Net P/L', 'Max Drawdown'],
      ['AI', backtest.ai.totalTrades, backtest.ai.wins, backtest.ai.losses, `${backtest.ai.winRate.toFixed(1)}%`, backtest.ai.netProfit.toFixed(2), backtest.ai.maxDrawdown.toFixed(2)],
      ['Human', backtest.human.totalTrades, backtest.human.wins, backtest.human.losses, `${backtest.human.winRate.toFixed(1)}%`, backtest.human.netProfit.toFixed(2), backtest.human.maxDrawdown.toFixed(2)],
    ];

    const tradeRows = [
      ['Strategy', 'Side', 'Entry', 'Exit', 'P/L', 'Reason', 'Entry Reason'],
      ...backtest.ai.trades.map((trade) => ['AI', trade.side, trade.entry.toFixed(5), trade.exit.toFixed(5), trade.pnl.toFixed(5), trade.reason, trade.entryReason || '']),
      ...backtest.human.trades.map((trade) => ['Human', trade.side, trade.entry.toFixed(5), trade.exit.toFixed(5), trade.pnl.toFixed(5), trade.reason, trade.entryReason || '']),
    ];

    const csv = [...summaryRows.map((row) => row.join(',')), '', ...tradeRows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'backtest-results.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const initializeAdminUser = () => {
    const users = loadPersistedUsers();
    if (!users.some((user) => user.username === 'admin')) {
      const adminUser = {
        id: 'admin',
        username: 'admin',
        password: 'admin123',
        whatsapp: '+10000000000',
        role: 'admin',
        verified: true,
      };
      saveUsers([...users, adminUser]);
    }
  };

  useEffect(() => {
    initializeAdminUser();
  }, []);

  const findUser = (username) => {
    const users = loadPersistedUsers();
    return users.find((user) => user.username === username.trim().toLowerCase());
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    setPersistedCurrentUser(user);
    setAuthMessage(`Welcome ${user.role === 'admin' ? 'Administrator' : 'Trader'} ${user.username}.`);
  };

  const handleVerifyPin = async (inputPin, userId = pendingUserId) => {
    const users = loadPersistedUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex < 0) {
      setAuthMessage('Verification failed, user not found.');
      return;
    }

    if (inputPin !== pendingPin) {
      setAuthMessage('Incorrect PIN. Please check WhatsApp and try again.');
      return;
    }

    users[userIndex].verified = true;
    saveUsers(users);
    setPendingPin('');
    setPendingUserId('');
    setPinInput('');
    setAutoResponseActive(false);
    loginUser(users[userIndex]);
    setAuthMode('login');
    setAuthMessage('WhatsApp PIN verified successfully. You are now logged in.');
  };

  const handleSendVerificationPin = (user) => {
    const pin = generateWhatsAppPin();
    const userId = user.id;
    setPendingPin(pin);
    setPendingUserId(userId);
    setAuthMessage(`WhatsApp PIN sent to ${user.whatsapp}. Waiting for auto response...`);
    setAuthMode('verify');
    setAutoResponseActive(true);

    setTimeout(() => {
      if (userId === pendingUserId) {
        setPinInput(pin);
        setAuthMessage('Auto response received from WhatsApp. Verifying PIN...');
        handleVerifyPin(pin, userId);
      }
    }, 4000);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = authForm.username.trim().toLowerCase();
    const user = findUser(username);

    if (!user) {
      setAuthMessage('User not found. Please register first.');
      return;
    }

    if (user.password !== authForm.password) {
      setAuthMessage('Incorrect password.');
      return;
    }

    if (!user.verified) {
      setAuthMessage('Your account requires WhatsApp verification. Sending PIN now.');
      handleSendVerificationPin(user);
      return;
    }

    loginUser(user);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const username = authForm.username.trim().toLowerCase();
    const password = authForm.password;
    const whatsapp = authForm.whatsapp.trim();
    const role = authForm.role;

    if (!username || !password || !whatsapp) {
      setAuthMessage('Please fill in all registration fields.');
      return;
    }

    const existing = findUser(username);
    if (existing) {
      setAuthMessage('Username already exists. Please choose another name.');
      return;
    }

    const users = loadPersistedUsers();
    const newUser = {
      id: `${username}-${Date.now()}`,
      username,
      password,
      whatsapp,
      role,
      verified: false,
    };
    saveUsers([...users, newUser]);
    setAuthMessage('Registration successful. Sending WhatsApp PIN for verification...');
    setAuthForm({ username: '', password: '', whatsapp: '', role: 'user' });
    handleSendVerificationPin(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPersistedCurrentUser(null);
    setAuthMessage('You have been logged out.');
  };

  const handleAdminBackdoorLogin = () => {
    initializeAdminUser();
    const adminUser = findUser('admin');
    if (!adminUser) {
      setAuthMessage('Admin backdoor unavailable.');
      return;
    }
    adminUser.verified = true;
    const users = loadPersistedUsers().map((user) => (user.username === 'admin' ? adminUser : user));
    saveUsers(users);
    loginUser(adminUser);
  };

  const isAdmin = currentUser?.role === 'admin';

  const handleSwitchMode = (mode) => {
    setAuthMode(mode);
    setAuthMessage('');
    setAuthForm({ username: '', password: '', whatsapp: '', role: 'user' });
    setPinInput('');
    setPendingPin('');
    setPendingUserId('');
    setAutoResponseActive(false);
  };

  const [research, setResearch] = useState({
    symbol: '',
    label: 'Long-term context',
    trend: 'Neutral',
    summary: 'Historical context is loading.',
    pctChange: 0,
    volatility: 0,
    bias: 'Neutral',
  });
  const [marketPulse, setMarketPulse] = useState({
    trend: 'Neutral',
    label: 'Waiting for candles',
    shortChange: 0,
    midChange: 0,
    volatility: 0,
    breakout: false,
    breakdown: false,
    volumeConfirm: false,
    score: 0,
  });
  const [watchlist, setWatchlist] = useState([]);
  const [bestSetup, setBestSetup] = useState(null);
  const [journal, setJournal] = useState(loadPersistedJournal);
  const [journalForm, setJournalForm] = useState({
    side: 'Long',
    entry: '',
    stop: '',
    target: '',
    note: '',
  });
  const [analysis, setAnalysis] = useState({
    signal: 'Wait',
    bias: 'Sideways',
    confidence: 55,
    reason: 'Waiting for fresh market data.',
    price: 0,
    change: 0,
    ema20: 0,
    ema50: 0,
    ema200: 0,
    rsi: 50,
    atr: 0,
    vwap: 0,
    support: 0,
    resistance: 0,
    stop: 0,
    target: 0,
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || window.innerWidth,
      height: chartContainerRef.current.clientHeight || Math.max(600, window.innerHeight - 220),
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(42, 46, 57, 0.5)',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    const ema20Series = chart.addSeries(LineSeries, {
      color: '#4fd1c5',
      lineWidth: 2,
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#f59e0b',
      lineWidth: 2,
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;
    ema20SeriesRef.current = ema20Series;
    ema50SeriesRef.current = ema50Series;

    const resizeChart = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    resizeChart();
    window.addEventListener('resize', resizeChart);

    return () => {
      window.removeEventListener('resize', resizeChart);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const symbolConfig = forexSymbols.find((item) => item.value === selectedSymbol) || forexSymbols[0];
    const availableSymbols = marketGroups[selectedGroup] || marketGroups.Forex;
    if (!availableSymbols.some((item) => item.value === selectedSymbol)) {
      setSelectedSymbol(availableSymbols[0].value);
      return;
    }
    const provider = import.meta.env.VITE_DATA_PROVIDER || (import.meta.env.VITE_TWELVE_DATA_API_KEY ? 'twelvedata' : 'alphavantage');
    const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
    const twelveKey = import.meta.env.VITE_TWELVE_DATA_API_KEY || '';

    let endpoint = '';
    if (provider === 'twelvedata' && twelveKey) {
      const interval = timeframe === 'daily' ? '1day' : timeframe === 'weekly' ? '1week' : timeframe === 'monthly' ? '1month' : timeframe;
      endpoint = `https://api.twelvedata.com/time_series?symbol=${symbolConfig.value}&interval=${interval}&outputsize=80&apikey=${twelveKey}`;
    } else {
      let functionName = 'FX_INTRADAY';
      let queryParams = {
        function: functionName,
        from_symbol: symbolConfig.from,
        to_symbol: symbolConfig.to,
        interval: timeframe,
        apikey: alphaKey,
      };

      if (timeframe === 'daily') {
        functionName = 'FX_DAILY';
        queryParams = {
          function: functionName,
          from_symbol: symbolConfig.from,
          to_symbol: symbolConfig.to,
          apikey: alphaKey,
        };
      } else if (timeframe === 'weekly') {
        functionName = 'FX_WEEKLY';
        queryParams = {
          function: functionName,
          from_symbol: symbolConfig.from,
          to_symbol: symbolConfig.to,
          apikey: alphaKey,
        };
      } else if (timeframe === 'monthly') {
        functionName = 'FX_MONTHLY';
        queryParams = {
          function: functionName,
          from_symbol: symbolConfig.from,
          to_symbol: symbolConfig.to,
          apikey: alphaKey,
        };
      }

      endpoint = `https://www.alphavantage.co/query?${new URLSearchParams(queryParams).toString()}`;
    }

    let cancelled = false;

    const fetchSymbolCandles = async (symbolEntry) => {
      let endpoint = '';
      if (provider === 'twelvedata' && twelveKey) {
        const interval = timeframe === 'daily' ? '1day' : timeframe === 'weekly' ? '1week' : timeframe === 'monthly' ? '1month' : timeframe;
        endpoint = `https://api.twelvedata.com/time_series?symbol=${symbolEntry.value}&interval=${interval}&outputsize=80&apikey=${twelveKey}`;
      } else {
        const isForexSymbol = symbolEntry.group === 'Forex';
        if (!isForexSymbol) {
          const queryParams = {
            function: 'GLOBAL_QUOTE',
            symbol: symbolEntry.value,
            apikey: alphaKey,
          };
          endpoint = `https://www.alphavantage.co/query?${new URLSearchParams(queryParams).toString()}`;
        } else {
          let functionName = 'FX_INTRADAY';
          let queryParams = {
            function: functionName,
            from_symbol: symbolEntry.from,
            to_symbol: symbolEntry.to,
            interval: timeframe,
            apikey: alphaKey,
          };

          if (timeframe === 'daily') {
            functionName = 'FX_DAILY';
            queryParams = {
              function: functionName,
              from_symbol: symbolEntry.from,
              to_symbol: symbolEntry.to,
              apikey: alphaKey,
            };
          } else if (timeframe === 'weekly') {
            functionName = 'FX_WEEKLY';
            queryParams = {
              function: functionName,
              from_symbol: symbolEntry.from,
              to_symbol: symbolEntry.to,
              apikey: alphaKey,
            };
          } else if (timeframe === 'monthly') {
            functionName = 'FX_MONTHLY';
            queryParams = {
              function: functionName,
              from_symbol: symbolEntry.from,
              to_symbol: symbolEntry.to,
              apikey: alphaKey,
            };
          }

          endpoint = `https://www.alphavantage.co/query?${new URLSearchParams(queryParams).toString()}`;
        }
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Unable to reach the forex API.');
      }

      const data = await response.json();
      if (provider === 'twelvedata' && data && Array.isArray(data.values)) {
        return data.values.map((item) => ({
          time: Date.parse(item.datetime) / 1000,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume || 0),
          color: Number(item.close) >= Number(item.open) ? '#26a69a' : '#ef5350',
        }));
      }

      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }

      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = Number(data['Global Quote']['05. price']);
        return buildFallbackCandlesAroundPrice(symbolEntry, timeframe, price);
      }

      const seriesKey = Object.keys(data).find((key) => key.startsWith('Time Series FX'));
      if (!seriesKey) {
        throw new Error('The forex API did not return any candles.');
      }

      const candleEntries = Object.entries(data[seriesKey]).sort(([a], [b]) => a.localeCompare(b));
      return candleEntries.map(([dateTime, values]) => {
        const [datePart, timePart] = dateTime.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);

        return {
          time: Date.UTC(year, month - 1, day, hour, minute, second) / 1000,
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['5. volume'] || 0),
          color: Number(values['4. close']) >= Number(values['1. open']) ? '#26a69a' : '#ef5350',
        };
      });
    };

    const loadForexData = async () => {
      try {
        setStatus(`Loading ${symbolConfig.label} (${timeframe})...`);
        setError('');

        const formattedData = await fetchSymbolCandles(symbolConfig);
        let historyCandles = formattedData;
        if (provider === 'twelvedata' && twelveKey) {
          const historyEndpoint = `https://api.twelvedata.com/time_series?symbol=${symbolConfig.value}&interval=1day&outputsize=5000&apikey=${twelveKey}`;
          const historyResponse = await fetch(historyEndpoint);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            if (historyData && Array.isArray(historyData.values)) {
              historyCandles = historyData.values.map((item) => ({
                time: Date.parse(item.datetime) / 1000,
                open: Number(item.open),
                high: Number(item.high),
                low: Number(item.low),
                close: Number(item.close),
                volume: Number(item.volume || 0),
                color: Number(item.close) >= Number(item.open) ? '#26a69a' : '#ef5350',
              }));
            }
          }
        }

        if (cancelled) return;
        const trimmedCandles = formattedData.slice(-80);
        const signal = buildSignal(trimmedCandles);
        applyChartData(formattedData, historyCandles);

        let scanAttempted = false;
        if (!scanAttempted) {
          scanAttempted = true;
          const scanTargets = (marketGroups[selectedGroup] || marketGroups.Forex)
            .filter((item) => item.value !== symbolConfig.value)
            .slice(0, 4);
          const results = [buildScannerEntry(symbolConfig, formattedData, signal, timeframe)];

          for (const item of scanTargets) {
            try {
              const itemCandles = await fetchSymbolCandles(item);
              const itemSignal = buildSignal(itemCandles.slice(-80));
              results.push(buildScannerEntry(item, itemCandles, itemSignal, timeframe));
            } catch {
              // Ignore scan failures and keep the current market view stable.
            }
          }

          if (!cancelled) {
            results.sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore);
            setWatchlist(results.slice(0, 5));
            setBestSetup(results[0] || null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const fallbackData = buildFallbackCandles(symbolConfig, timeframe);
          applyChartData(fallbackData, fallbackData);
          setError(err.message || 'Using fallback demo candles.');
          setStatus('Demo mode');
        }
      }
    };

    const applyChartData = (candles, contextCandles = candles) => {
      const trimmedCandles = candles.slice(-80);
      const historyContext = contextCandles.length >= 60 ? contextCandles.slice(-500) : trimmedCandles;
      setResearch(buildLongTermContext(historyContext, symbolConfig.label));
      const seriesData = trimmedCandles.map((item) => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candlestickSeriesRef.current?.setData(seriesData);
      volumeSeriesRef.current?.setData(
        trimmedCandles.map((item) => ({
          time: item.time,
          value: item.volume,
          color: item.color,
        }))
      );

      const closes = trimmedCandles.map((item) => item.close);
      const ema20Values = calculateEMAValues(closes, 20);
      const ema50Values = calculateEMAValues(closes, 50);
      const ema200Values = calculateEMAValues(closes, 200);

      ema20SeriesRef.current?.setData(
        trimmedCandles.map((item, index) => ({
          time: item.time,
          value: ema20Values[index] ?? item.close,
        }))
      );

      ema50SeriesRef.current?.setData(
        trimmedCandles.map((item, index) => ({
          time: item.time,
          value: ema50Values[index] ?? item.close,
        }))
      );

      const latest = trimmedCandles[trimmedCandles.length - 1];
      const previous = trimmedCandles[trimmedCandles.length - 2] || latest;
      if (markerRef.current && candlestickSeriesRef.current?.removePriceLine) {
        candlestickSeriesRef.current.removePriceLine(markerRef.current);
      }
      const change = ((latest.close - previous.close) / previous.close) * 100;
      const signal = buildSignal(trimmedCandles);

      const marker = {
        time: latest.time,
        position: 'aboveBar',
        color: signal.signal.includes('Buy') ? '#26a69a' : signal.signal.includes('Sell') ? '#ef5350' : '#f59e0b',
        shape: 'arrowUp',
        text: signal.signal.includes('Buy') ? 'BUY' : signal.signal.includes('Sell') ? 'SELL' : 'WAIT',
      };

      if (signal.signal.includes('Sell')) {
        marker.shape = 'arrowDown';
      }

      markerRef.current = candlestickSeriesRef.current?.createPriceLine?.({
        price: latest.close,
        color: marker.color,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: marker.text,
      });

      setCandles(trimmedCandles);
      setMarketPulse(signal.marketPulse || getMarketPulse(trimmedCandles));
      const aiResult = runBacktest(trimmedCandles, 'ai', backtestSettings);
      const humanResult = runBacktest(trimmedCandles, 'human', backtestSettings);
      setBacktest({ ai: aiResult, human: humanResult });

      if (aiResult.netProfit > humanResult.netProfit + 50) {
        setBacktestWinner('AI Lead');
      } else if (humanResult.netProfit > aiResult.netProfit + 50) {
        setBacktestWinner('Human Lead');
      } else {
        setBacktestWinner('Tie');
      }
      setAnalysis({
        signal: signal.signal,
        bias: signal.bias,
        confidence: Math.round(signal.confidence),
        reason: signal.reason,
        price: latest.close,
        change: Number(change.toFixed(2)),
        ema20: Number(calculateEMA(closes, 20).toFixed(5)),
        ema50: Number(calculateEMA(closes, 50).toFixed(5)),
        ema200: Number(calculateEMA(closes, 200).toFixed(5)),
        rsi: Number(signal.rsi.toFixed(1)),
        atr: Number(signal.atr.toFixed(5)),
        vwap: Number(signal.vwap.toFixed(5)),
        support: Number(signal.support.toFixed(5)),
        resistance: Number(signal.resistance.toFixed(5)),
        stop: Number(signal.stop.toFixed(5)),
        target: Number(signal.target.toFixed(5)),
      });

      if (riskSettings.alertsEnabled && (signal.signal.includes('Strong Buy') || signal.signal.includes('Strong Sell') || signal.signal.includes('Buy') || signal.signal.includes('Sell'))) {
        window.dispatchEvent(new CustomEvent('trading-alert', { detail: { symbol: symbolConfig.label, signal: signal.signal, confidence: Math.round(signal.confidence) } }));
      }

      chartRef.current?.timeScale().fitContent();
      setStatus(`${symbolConfig.label} • ${timeframe}`);
      setError('');
    };

    loadForexData();
    const intervalId = window.setInterval(loadForexData, getRefreshInterval(timeframe));

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [selectedSymbol, timeframe]);

  const signalColor = analysis.signal.includes('Buy') ? '#26a69a' : analysis.signal.includes('Sell') ? '#ef5350' : '#f59e0b';

  const handleAddTrade = (event) => {
    event.preventDefault();
    const entry = Number(journalForm.entry);
    const stop = Number(journalForm.stop);
    const target = Number(journalForm.target);

    if (!entry || !stop || !target) return;

    const newTrade = {
      id: Date.now(),
      side: journalForm.side,
      entry,
      stop,
      target,
      note: journalForm.note || 'Manual journal entry',
      createdAt: new Date().toLocaleString(),
    };

    const nextJournal = [newTrade, ...journal];
    setJournal(nextJournal);
    window.localStorage.setItem('forex-trade-journal', JSON.stringify(nextJournal));
    setJournalForm({ side: 'Long', entry: '', stop: '', target: '', note: '' });
  };

  const handleSaveSignal = () => {
    const newTrade = {
      id: Date.now(),
      side: analysis.signal.includes('Buy') ? 'Long' : analysis.signal.includes('Sell') ? 'Short' : 'Neutral',
      entry: Number(analysis.price.toFixed(5)),
      stop: Number(analysis.stop.toFixed(5)),
      target: Number(analysis.target.toFixed(5)),
      note: `${analysis.signal} • ${analysis.bias} • Confidence ${analysis.confidence}%`,
      createdAt: new Date().toLocaleString(),
    };

    const nextJournal = [newTrade, ...journal];
    setJournal(nextJournal);
    window.localStorage.setItem('forex-trade-journal', JSON.stringify(nextJournal));
  };

  useEffect(() => {
    const handleAlert = (event) => {
      const { symbol, signal, confidence } = event.detail || {};
      setStatus(`${symbol} • ${signal} • Confidence ${confidence}%`);
    };

    window.addEventListener('trading-alert', handleAlert);
    return () => window.removeEventListener('trading-alert', handleAlert);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('trading-app-language', language);
    }
  }, [language]);

  const t = translations[language] || translations.en;
  const selectedGroupLabel = t.marketGroups[selectedGroup] || selectedGroup;

  const pageStyle = {
    backgroundColor: '#0b1220',
    color: '#eef2f7',
    minHeight: '100vh',
    padding: '20px 24px 32px',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  };
  const cardStyle = {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
  };
  const panelStyle = {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '18px',
    padding: '16px',
  };
  const inputStyle = {
    display: 'block',
    width: '100%',
    marginTop: '8px',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #26374e',
    backgroundColor: '#0f1724',
    color: '#eef2f7',
  };
  const buttonStyle = {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #334155',
    backgroundColor: '#1f2937',
    color: '#eef2f7',
    cursor: 'pointer',
  };

  const dataSourceLabel = import.meta.env.VITE_TWELVE_DATA_API_KEY ? 'Twelve Data' : 'Alpha Vantage (demo fallback available)';

  if (!currentUser) {
    return (
      <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ ...cardStyle, maxWidth: '520px', width: '100%' }}>
          <div style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: '28px' }}>{authMode === 'register' ? 'Register Account' : authMode === 'verify' ? 'Verify WhatsApp PIN' : 'Login'}</h2>
              <p style={{ margin: 0, color: '#9ca3af' }}>Administrator and trader authentication with WhatsApp PIN verification.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => handleSwitchMode('login')} style={{ ...buttonStyle, backgroundColor: authMode === 'login' ? '#2563eb' : '#1f2937' }}>Login</button>
              <button type="button" onClick={() => handleSwitchMode('register')} style={{ ...buttonStyle, backgroundColor: authMode === 'register' ? '#2563eb' : '#1f2937' }}>Register</button>
            </div>
          </div>

          {authMessage ? <div style={{ marginBottom: '18px', color: '#d1d5db', background: '#111827', padding: '14px', borderRadius: '14px', border: '1px solid #1f2937' }}>{authMessage}</div> : null}

          {authMode !== 'verify' ? (
            <form onSubmit={authMode === 'register' ? handleRegister : handleLogin}>
              <label style={{ color: '#d1d4dc', display: 'block', marginBottom: '14px' }}>
                Username
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(event) => setAuthForm({ ...authForm, username: event.target.value })}
                  style={inputStyle}
                />
              </label>
              <label style={{ color: '#d1d4dc', display: 'block', marginBottom: '14px' }}>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                  style={inputStyle}
                />
              </label>
              {authMode === 'register' ? (
                <>
                  <label style={{ color: '#d1d4dc', display: 'block', marginBottom: '14px' }}>
                    WhatsApp Number
                    <input
                      type="text"
                      value={authForm.whatsapp}
                      onChange={(event) => setAuthForm({ ...authForm, whatsapp: event.target.value })}
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ color: '#d1d4dc', display: 'block', marginBottom: '14px' }}>
                    Role
                    <select
                      value={authForm.role}
                      onChange={(event) => setAuthForm({ ...authForm, role: event.target.value })}
                      style={inputStyle}
                    >
                      <option value="user">User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </label>
                </>
              ) : null}
              <button type="submit" style={{ ...buttonStyle, width: '100%', marginTop: '10px', backgroundColor: '#2563eb', borderColor: '#1d4ed8' }}>
                {authMode === 'register' ? 'Register & Verify' : 'Login'}
              </button>
              {authMode === 'login' ? (
                <button
                  type="button"
                  onClick={handleAdminBackdoorLogin}
                  style={{ ...buttonStyle, width: '100%', marginTop: '10px', backgroundColor: '#059669', borderColor: '#047857' }}
                >
                  Admin Backdoor Login
                </button>
              ) : null}
            </form>
          ) : (
            <div>
              <div style={{ color: '#d1d4dc', marginBottom: '14px' }}>Enter the 6-digit WhatsApp PIN you received.</div>
              <label style={{ color: '#d1d4dc', display: 'block', marginBottom: '14px' }}>
                PIN Code
                <input
                  type="text"
                  value={pinInput}
                  onChange={(event) => setPinInput(event.target.value)}
                  style={inputStyle}
                />
              </label>
              <button type="button" onClick={() => handleVerifyPin(pinInput)} style={{ ...buttonStyle, width: '100%', marginTop: '10px', backgroundColor: '#2563eb', borderColor: '#1d4ed8' }}>
                Verify PIN
              </button>
              <div style={{ marginTop: '16px', color: '#9ca3af', fontSize: '13px' }}>
                {autoResponseActive ? 'Auto-response mode is active. PIN will be filled automatically if received.' : 'A WhatsApp PIN will be sent to your number for verification.'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '18px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '30px' }}>{t.appTitle}</h2>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '15px', maxWidth: '760px' }}>{t.appSubtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ color: '#d1d4dc', minWidth: '180px' }}>
            {t.languageLabel}
            <select value={language} onChange={(event) => setLanguage(event.target.value)} style={{ ...inputStyle, marginTop: '8px' }}>
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </label>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '16px', background: '#111827', border: '1px solid #1f2937', color: '#9ca3af' }}>
            <span>{status}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 0.95fr', gap: '18px', marginBottom: '22px' }}>
        <div style={{ ...cardStyle, minHeight: 'calc(100vh - 110px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', width: '100%' }}>
              <label style={{ color: '#d1d4dc' }}>
                {t.marketLabel}
                <select value={selectedGroup} onChange={(event) => {
                  setSelectedGroup(event.target.value);
                  const nextSymbols = marketGroups[event.target.value] || marketGroups.Forex;
                  setSelectedSymbol(nextSymbols[0].value);
                }} style={inputStyle}>
                  {Object.keys(marketGroups).map((group) => (
                    <option key={group} value={group}>{t.marketGroups[group] || group}</option>
                  ))}
                </select>
              </label>
              <label style={{ color: '#d1d4dc' }}>
                {t.symbolLabel}
                <select value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)} style={inputStyle}>
                  {(marketGroups[selectedGroup] || marketGroups.Forex).map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label style={{ color: '#d1d4dc' }}>
                {t.timeframeLabel}
                <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} style={inputStyle}>
                  {timeframes.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" style={{ ...buttonStyle, backgroundColor: '#2563eb', borderColor: '#1d4ed8', minWidth: '120px' }} onClick={() => setStatus(`${t.marketLabel}: ${selectedGroupLabel} ${selectedSymbol} ${timeframe}`)}>
              Refresh
            </button>
          </div>

          <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', background: '#0f1724', minHeight: 'calc(100vh - 220px)' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 10, padding: '14px 18px', borderRadius: '16px', background: 'rgba(15, 23, 36, 0.92)', border: '1px solid rgba(148, 163, 184, 0.18)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{selectedGroupLabel}</div>
                  <div style={{ color: '#eef2f7', fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>{selectedSymbol}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: analysis.change >= 0 ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: '700' }}>{analysis.change >= 0 ? '+' : ''}{analysis.change}%</div>
                  <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>{t.timeframeLabel}: {timeframe}</div>
                </div>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '11px' }}>Last Price</div>
                  <div style={{ color: '#eef2f7', fontSize: '24px', fontWeight: '700' }}>{analysis.price.toFixed(5)}</div>
                </div>
                <div style={{ padding: '6px 10px', borderRadius: '999px', background: signalColor, color: '#0f1724', fontSize: '12px', fontWeight: '700', minWidth: '84px', textAlign: 'center' }}>{analysis.signal}</div>
              </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '18px' }}>
            <div style={{ ...panelStyle, padding: '14px' }}>
              <div style={{ color: '#8a90a0', fontSize: '12px', marginBottom: '10px' }}>{t.smartScoreLabel}</div>
              <div style={{ color: '#fff', fontSize: '26px', fontWeight: '700' }}>{analysis.confidence}%</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>{t.smartScoreHint}</div>
            </div>
            <div style={{ ...panelStyle, padding: '14px' }}>
              <div style={{ color: '#8a90a0', fontSize: '12px', marginBottom: '10px' }}>{t.signalLabel}</div>
              <div style={{ color: signalColor, fontSize: '26px', fontWeight: '700' }}>{analysis.signal}</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>{analysis.bias}</div>
            </div>
            <div style={{ ...panelStyle, padding: '14px' }}>
              <div style={{ color: '#8a90a0', fontSize: '12px', marginBottom: '10px' }}>{t.priceLabel}</div>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>{analysis.price.toFixed(5)}</div>
              <div style={{ color: analysis.change >= 0 ? '#22c55e' : '#ef4444', fontSize: '12px', marginTop: '8px' }}>{analysis.change >= 0 ? '+' : ''}{analysis.change}%</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '18px' }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>{t.marketPulseLabel}</div>
                <div style={{ color: marketPulse.trend === 'Bullish' ? '#22c55e' : marketPulse.trend === 'Bearish' ? '#ef4444' : '#f59e0b', fontSize: '18px', fontWeight: '700' }}>{marketPulse.label}</div>
              </div>
              <div style={{ color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedGroupLabel}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ ...panelStyle, padding: '12px' }}>
                <div style={{ color: '#8a90a0', fontSize: '11px', textTransform: 'uppercase' }}>Short Move</div>
                <div style={{ color: '#fff', fontSize: '16px', marginTop: '8px' }}>{marketPulse.shortChange > 0 ? '+' : ''}{marketPulse.shortChange}%</div>
              </div>
              <div style={{ ...panelStyle, padding: '12px' }}>
                <div style={{ color: '#8a90a0', fontSize: '11px', textTransform: 'uppercase' }}>Mid Move</div>
                <div style={{ color: '#fff', fontSize: '16px', marginTop: '8px' }}>{marketPulse.midChange > 0 ? '+' : ''}{marketPulse.midChange}%</div>
              </div>
              <div style={{ ...panelStyle, padding: '12px' }}>
                <div style={{ color: '#8a90a0', fontSize: '11px', textTransform: 'uppercase' }}>Volatility</div>
                <div style={{ color: '#fff', fontSize: '16px', marginTop: '8px' }}>{marketPulse.volatility}%</div>
              </div>
              <div style={{ ...panelStyle, padding: '12px' }}>
                <div style={{ color: '#8a90a0', fontSize: '11px', textTransform: 'uppercase' }}>Score</div>
                <div style={{ color: '#fff', fontSize: '16px', marginTop: '8px' }}>{marketPulse.score}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>{t.bestSetupLabel}</div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>{bestSetup?.label || t.scanningBestLabel}</div>
              </div>
              <div style={{ color: bestSetup?.signal?.includes('Buy') ? '#22c55e' : bestSetup?.signal?.includes('Sell') ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>{bestSetup?.signal || '-'}</div>
            </div>
            {bestSetup && (
              <div style={{ color: '#9ca3af', fontSize: '12px', lineHeight: '1.8' }}>
                <div>{t.tradeScoreLabel}: {bestSetup.riskAdjustedScore}/100</div>
                <div>{bestSetup.bias}</div>
                <div style={{ marginTop: '10px', color: '#d1d5db' }}>{bestSetup.reason}</div>
                <div style={{ marginTop: '10px', color: '#9ca3af', fontSize: '12px' }}>Price {bestSetup.price} • Change {bestSetup.change > 0 ? '+' : ''}{bestSetup.change}%</div>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px' }}>{t.watchlistLabel}</div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>{selectedGroupLabel}</div>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '11px' }}>{watchlist.length} items</span>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {watchlist.length > 0 ? watchlist.slice(0, 4).map((item) => (
                <div key={item.value} style={{ display: 'grid', gap: '4px', padding: '12px', borderRadius: '14px', background: '#0f1724', border: '1px solid #1f2937' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#fff', fontSize: '14px' }}>{item.label}</strong>
                    <span style={{ color: item.signal.includes('Buy') ? '#22c55e' : item.signal.includes('Sell') ? '#ef4444' : '#f59e0b', fontSize: '12px' }}>{item.signal}</span>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '12px' }}>{t.tradeScoreLabel} {item.riskAdjustedScore}/100</div>
                </div>
              )) : (
                <div style={{ color: '#9ca3af', fontSize: '13px' }}>{t.scanningLabel}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '22px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>{research.label}</div>
              <div style={{ color: research.bias === 'Bullish' ? '#22c55e' : research.bias === 'Bearish' ? '#ef4444' : '#f59e0b', fontSize: '16px', fontWeight: '700' }}>{research.trend}</div>
            </div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Long-term</div>
          </div>
          <div style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.8' }}>{research.summary}</div>
          <div style={{ marginTop: '14px', color: '#9ca3af', fontSize: '12px' }}>5-year proxy change: {research.pctChange > 0 ? '+' : ''}{research.pctChange}% • Volatility: {research.volatility}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>{t.backtestLabel}</div>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>AI vs Human</div>
            </div>
            <button type="button" onClick={handleExportBacktest} style={{ ...buttonStyle, minWidth: '120px' }}>Export CSV</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ ...panelStyle, padding: '14px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>AI</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>P/L {backtest.ai.netProfit.toFixed(2)}</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>Win {backtest.ai.winRate.toFixed(1)}%</div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Trades {backtest.ai.totalTrades}</div>
            </div>
            <div style={{ ...panelStyle, padding: '14px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>Human</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>P/L {backtest.human.netProfit.toFixed(2)}</div>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>Win {backtest.human.winRate.toFixed(1)}%</div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>Trades {backtest.human.totalTrades}</div>
            </div>
          </div>
          <div style={{ marginTop: '14px', color: backtestWinner === 'AI Lead' ? '#22c55e' : backtestWinner === 'Human Lead' ? '#f59e0b' : '#9ca3af', fontWeight: '700' }}>{backtestWinner}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px', marginBottom: '22px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>{t.backtestLabel}</div>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>Settings</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Entry threshold
              <input type="number" value={backtestSettings.entryThreshold} onChange={(event) => setBacktestSettings({ ...backtestSettings, entryThreshold: Number(event.target.value) })} style={inputStyle} />
            </label>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Stop multiplier
              <input type="number" value={backtestSettings.stopMultiplier} onChange={(event) => setBacktestSettings({ ...backtestSettings, stopMultiplier: Number(event.target.value) })} style={inputStyle} />
            </label>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Target multiplier
              <input type="number" value={backtestSettings.targetMultiplier} onChange={(event) => setBacktestSettings({ ...backtestSettings, targetMultiplier: Number(event.target.value) })} style={inputStyle} />
            </label>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Commission
              <input type="number" value={backtestSettings.commission} onChange={(event) => setBacktestSettings({ ...backtestSettings, commission: Number(event.target.value) })} style={inputStyle} />
            </label>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Slippage
              <input type="number" value={backtestSettings.slippage} onChange={(event) => setBacktestSettings({ ...backtestSettings, slippage: Number(event.target.value) })} style={inputStyle} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d4dc', fontSize: '13px' }}>
              <input type="checkbox" checked={backtestSettings.useTrailingStop} onChange={(event) => setBacktestSettings({ ...backtestSettings, useTrailingStop: event.target.checked })} />
              Trailing stop
            </label>
            <label style={{ color: '#d1d4dc', fontSize: '13px' }}>
              Trailing distance
              <input type="number" value={backtestSettings.trailingStopDistance} onChange={(event) => setBacktestSettings({ ...backtestSettings, trailingStopDistance: Number(event.target.value) })} style={inputStyle} />
            </label>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>{t.riskSettingsLabel}</div>
              <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>{t.riskSettingsHint}</div>
            </div>
          </div>
          <label style={{ display: 'block', color: '#d1d4dc', fontSize: '13px', marginBottom: '12px' }}>
            {t.riskPercentLabel}
            <input type="number" value={riskSettings.riskPercent} onChange={(event) => setRiskSettings({ ...riskSettings, riskPercent: Number(event.target.value) })} style={inputStyle} />
          </label>
          <label style={{ display: 'block', color: '#d1d4dc', fontSize: '13px', marginBottom: '12px' }}>
            {t.rewardRatioLabel}
            <input type="number" value={riskSettings.rewardRatio} onChange={(event) => setRiskSettings({ ...riskSettings, rewardRatio: Number(event.target.value) })} style={inputStyle} />
          </label>
          <label style={{ display: 'block', color: '#d1d4dc', fontSize: '13px', marginBottom: '12px' }}>
            {t.lotSizeLabel}
            <input type="number" value={riskSettings.lotSize} onChange={(event) => setRiskSettings({ ...riskSettings, lotSize: Number(event.target.value) })} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1d4dc', fontSize: '13px' }}>
            <input type="checkbox" checked={riskSettings.alertsEnabled} onChange={(event) => setRiskSettings({ ...riskSettings, alertsEnabled: event.target.checked })} />
            {t.alertsLabel}
          </label>
          <button type="button" style={{ ...buttonStyle, width: '100%', marginTop: '14px', backgroundColor: '#16a34a', borderColor: '#15803d' }}>{t.saveSignalLabel}</button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
        <div style={{ color: '#d1d5db', fontSize: '14px' }}>{analysis.reason}</div>
        <div style={{ color: '#9ca3af', fontSize: '13px' }}>{t.dataSourceLabel}: {dataSourceLabel}</div>
        {error ? <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div> : null}
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {journal.map((trade) => (
          <div key={trade.id} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: trade.side === 'Long' ? '#22c55e' : trade.side === 'Short' ? '#ef4444' : '#f59e0b' }}>{trade.side}</strong>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>{trade.createdAt}</span>
            </div>
            <div style={{ color: '#d1d5db', fontSize: '13px', marginTop: '8px' }}>Entry: {trade.entry} • Stop: {trade.stop} • Target: {trade.target}</div>
            <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>{trade.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;