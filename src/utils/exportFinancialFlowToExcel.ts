import ExcelJS from 'exceljs';
import type { Transaction, Category } from '../types';

export interface ExportPayload {
  transactions: Transaction[];
  categories: Category[];
}

// ── Brand colours (ARGB for ExcelJS) ─────────────────────────────────────────
const C = {
  titleBg:     'FF0A1628',
  headerBg:    'FF1A3354',
  headerFg:    'FFFFFFFF',
  accent:      'FF6366F1',
  income:      'FF059669',
  expense:     'FFDC2626',
  muted:       'FF64748B',
  body:        'FF1E293B',
  rowEven:     'FFFFFFFF',
  rowOdd:      'FFF8FAFF',
  border:      'FFE2E8F0',
  cardBg:      'FFF0F6FF',
};

// ── Utility ──────────────────────────────────────────────────────────────────

function applyHeaderCell(cell: ExcelJS.Cell, align: ExcelJS.Alignment['horizontal'] = 'center') {
  cell.font      = { bold: true, color: { argb: C.headerFg }, size: 11, name: 'Calibri' };
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.headerBg } };
  cell.alignment = { vertical: 'middle', horizontal: align };
  cell.border    = { bottom: { style: 'medium', color: { argb: C.accent } } };
}

function applyTitleCell(cell: ExcelJS.Cell, size = 16) {
  cell.font      = { bold: true, size, name: 'Calibri', color: { argb: C.headerFg } };
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
}

function numFmt(cell: ExcelJS.Cell) {
  cell.numFmt    = '#,##0.00';
}

function monthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatTRY(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n) + ' ₺';
}

// ── Chart renderer ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderChart(config: any, w = 800, h = 380): Promise<string> {
  const { Chart } = await import('chart.js/auto');

  const canvas   = document.createElement('canvas');
  canvas.width   = w;
  canvas.height  = h;
  const ctx      = canvas.getContext('2d')!;

  // Dark background plugin
  const bgPlugin = {
    id: 'chartBg',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw: (chart: any) => {
      const c = chart.canvas.getContext('2d');
      c.save();
      c.fillStyle = '#0F1623';
      c.fillRect(0, 0, chart.width, chart.height);
      c.restore();
    },
  };

  const chart = new Chart(ctx, {
    ...config,
    plugins: [bgPlugin, ...(config.plugins ?? [])],
    options: {
      ...config.options,
      animation:       false,
      responsive:      false,
      devicePixelRatio: 1.5,
      plugins: {
        ...config.options?.plugins,
        legend: {
          labels: { color: '#8B9DC3', font: { size: 12, family: 'sans-serif' } },
          ...config.options?.plugins?.legend,
        },
      },
    },
  });

  // One tick for Chart.js to finish rendering
  await new Promise(r => requestAnimationFrame(r));

  const b64 = canvas.toDataURL('image/png').split(',')[1];
  chart.destroy();
  return b64;
}

// ── Sheet 1: Financial Data ───────────────────────────────────────────────────

function buildDataSheet(wb: ExcelJS.Workbook, transactions: Transaction[], categories: Category[]) {
  const ws = wb.addWorksheet('Financial Data', {
    views: [{ state: 'frozen', ySplit: 1, xSplit: 0 }],
  });

  ws.columns = [
    { key: 'date',      width: 14 },
    { key: 'category',  width: 22 },
    { key: 'type',      width: 12 },
    { key: 'desc',      width: 36 },
    { key: 'amount',    width: 20 },
    { key: 'currency',  width: 10 },
    { key: 'direction', width: 16 },
    { key: 'balance',   width: 26 },
  ];

  // Header row
  const hdr = ws.addRow(['Date', 'Category', 'Type', 'Description', 'Amount', 'Currency', 'Flow Direction', 'Balance After Transaction']);
  hdr.height = 28;
  hdr.eachCell(cell => applyHeaderCell(cell));

  // Data rows
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let balance = 0;

  sorted.forEach((tx, i) => {
    const cat      = categories.find(c => c.id === tx.categoryId);
    const isIncome = tx.type === 'income';
    balance       += isIncome ? tx.amount : -tx.amount;

    const row = ws.addRow([
      new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      cat?.name ?? 'Unknown',
      isIncome ? 'Income' : 'Expense',
      tx.title,
      tx.amount,
      'TRY',
      isIncome ? '▲ Inflow' : '▼ Outflow',
      balance,
    ]);

    row.height     = 20;
    const bg       = i % 2 === 0 ? C.rowEven : C.rowOdd;
    const amtColor = isIncome ? C.income : C.expense;

    row.eachCell(cell => {
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.font      = { size: 10, name: 'Calibri', color: { argb: C.body } };
      cell.alignment = { vertical: 'middle' };
      cell.border    = { bottom: { style: 'thin', color: { argb: C.border } } };
    });

    // Amount
    const amtCell = row.getCell(5);
    amtCell.font      = { bold: true, color: { argb: amtColor }, size: 10, name: 'Calibri' };
    amtCell.alignment = { horizontal: 'right', vertical: 'middle' };
    numFmt(amtCell);

    // Balance
    const balCell = row.getCell(8);
    balCell.font      = { bold: true, color: { argb: balance >= 0 ? C.income : C.expense }, size: 10 };
    balCell.alignment = { horizontal: 'right', vertical: 'middle' };
    numFmt(balCell);

    // Direction / Type
    row.getCell(7).font      = { color: { argb: amtColor }, size: 10 };
    row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).font      = { color: { argb: amtColor }, size: 10 };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Totals
  const totalIn  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net      = totalIn - totalOut;

  ws.addRow([]);

  const tot = ws.addRow(['', '', '', 'NET TOTAL', net, '', '', balance]);
  tot.height = 26;
  tot.eachCell(cell => {
    cell.font   = { bold: true, size: 11, name: 'Calibri', color: { argb: C.body } };
    cell.border = { top: { style: 'medium', color: { argb: C.headerBg } } };
  });

  const totAmt = tot.getCell(5);
  totAmt.font      = { bold: true, size: 13, color: { argb: net >= 0 ? C.income : C.expense } };
  totAmt.alignment = { horizontal: 'right', vertical: 'middle' };
  numFmt(totAmt);

  const totBal = tot.getCell(8);
  totBal.font      = { bold: true, size: 13, color: { argb: balance >= 0 ? C.income : C.expense } };
  totBal.alignment = { horizontal: 'right', vertical: 'middle' };
  numFmt(totBal);

  tot.getCell(4).font = { bold: true, size: 12, color: { argb: C.headerBg } };
}

// ── Sheet 2: Charts ───────────────────────────────────────────────────────────

async function buildChartsSheet(wb: ExcelJS.Workbook, transactions: Transaction[], categories: Category[]) {
  const ws = wb.addWorksheet('Charts');

  // Monthly aggregation
  const monthly: Record<string, { inflow: number; outflow: number }> = {};
  transactions.forEach(tx => {
    const k = monthKey(tx.date);
    if (!monthly[k]) monthly[k] = { inflow: 0, outflow: 0 };
    if (tx.type === 'income') monthly[k].inflow  += tx.amount;
    else                      monthly[k].outflow += tx.amount;
  });
  const months  = Object.keys(monthly).sort();
  const mLabels = months.map(monthLabel);

  // Category expenses
  const catExp: Record<string, number> = {};
  const catColors: Record<string, string> = {};
  transactions.filter(t => t.type === 'expense').forEach(tx => {
    const cat = categories.find(c => c.id === tx.categoryId);
    const n   = cat?.name ?? 'Other';
    catExp[n]    = (catExp[n] ?? 0) + tx.amount;
    catColors[n] = cat?.color ?? '#6366F1';
  });

  const catNames  = Object.keys(catExp);
  const catVals   = catNames.map(n => catExp[n]);
  const catHexes  = catNames.map(n => catColors[n]);

  // ── Chart 1: Monthly Inflow vs Outflow (grouped bar) ────────────────────
  const chart1 = await renderChart({
    type: 'bar',
    data: {
      labels: mLabels,
      datasets: [
        {
          label: 'Inflow',
          data: months.map(m => monthly[m].inflow),
          backgroundColor: '#10B98199',
          borderColor: '#10B981',
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          label: 'Outflow',
          data: months.map(m => monthly[m].outflow),
          backgroundColor: '#F43F5E99',
          borderColor: '#F43F5E',
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Monthly Inflow vs Outflow', color: '#F0F4FF', font: { size: 15, weight: 'bold' } },
      },
      scales: {
        x: { ticks: { color: '#8B9DC3' }, grid: { color: '#1E2D4540' } },
        y: { ticks: { color: '#8B9DC3' }, grid: { color: '#1E2D4540' } },
      },
    },
  });

  // ── Chart 2: Expense Category Breakdown (doughnut) ─────────────────────
  const chart2 = await renderChart({
    type: 'doughnut',
    data: {
      labels: catNames,
      datasets: [{
        data: catVals,
        backgroundColor: catHexes.map(h => h + 'CC'),
        borderColor: catHexes,
        borderWidth: 2,
        hoverOffset: 12,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Expense Category Breakdown', color: '#F0F4FF', font: { size: 15, weight: 'bold' } },
        legend: { position: 'right', labels: { color: '#8B9DC3', font: { size: 11 }, padding: 12 } },
      },
    },
  });

  // ── Chart 3: Net Cash Flow Trend (line) ──────────────────────────────────
  let cum = 0;
  const cumData = months.map(m => {
    cum += monthly[m].inflow - monthly[m].outflow;
    return cum;
  });

  const chart3 = await renderChart({
    type: 'line',
    data: {
      labels: mLabels,
      datasets: [{
        label: 'Cumulative Net Cash Flow',
        data: cumData,
        borderColor: '#6366F1',
        backgroundColor: '#6366F125',
        borderWidth: 2.5,
        pointBackgroundColor: '#6366F1',
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      }],
    },
    options: {
      plugins: {
        title: { display: true, text: 'Net Cash Flow Trend', color: '#F0F4FF', font: { size: 15, weight: 'bold' } },
      },
      scales: {
        x: { ticks: { color: '#8B9DC3' }, grid: { color: '#1E2D4540' } },
        y: { ticks: { color: '#8B9DC3' }, grid: { color: '#1E2D4540' } },
      },
    },
  });

  // ── Embed images ─────────────────────────────────────────────────────────

  // Column widths for the charts sheet
  for (let i = 1; i <= 10; i++) ws.getColumn(i).width = 11;

  const CHART_H = 380; // px per chart
  const CHART_W = 800;
  const ROW_PX  = 18;  // approximate Excel row height in pixels
  const rowSpan = Math.ceil(CHART_H / ROW_PX) + 1; // rows per chart
  const GAP     = 2;   // blank rows between charts

  interface ChartBlock { label: string; b64: string }
  const blocks: ChartBlock[] = [
    { label: '📊  Monthly Inflow vs Outflow',  b64: chart1 },
    { label: '🍩  Expense Category Breakdown', b64: chart2 },
    { label: '📈  Net Cash Flow Trend',         b64: chart3 },
  ];

  let cursor = 0; // 0-indexed row
  blocks.forEach(({ label, b64 }) => {
    // Section title
    const titleRow = ws.getRow(cursor + 1); // 1-indexed
    ws.mergeCells(cursor + 1, 1, cursor + 1, 10);
    titleRow.height = 26;
    const titleCell = titleRow.getCell(1);
    titleCell.value = label;
    applyHeaderCell(titleCell, 'left');

    // Image just below title
    const imgId = wb.addImage({ base64: b64, extension: 'png' });
    ws.addImage(imgId, {
      tl: { col: 0, row: cursor + 1 },        // 0-indexed: starts after title
      ext: { width: CHART_W, height: CHART_H },
    });

    cursor += 1 + rowSpan + GAP;
  });
}

// ── Sheet 3: Summary ──────────────────────────────────────────────────────────

function buildSummarySheet(wb: ExcelJS.Workbook, transactions: Transaction[], categories: Category[]) {
  const ws = wb.addWorksheet('Summary');

  ws.getColumn(1).width = 32;
  ws.getColumn(2).width = 22;
  ws.getColumn(3).width = 3;   // spacer
  ws.getColumn(4).width = 32;
  ws.getColumn(5).width = 22;

  // ── Compute stats ────────────────────────────────────────────────────────
  const totalIn  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netFlow  = totalIn - totalOut;

  const monthSet = new Set(transactions.map(tx => monthKey(tx.date)));
  const mCount   = monthSet.size || 1;

  const catExp: Record<string, number> = {};
  const catInc: Record<string, number> = {};
  transactions.forEach(tx => {
    const n = categories.find(c => c.id === tx.categoryId)?.name ?? 'Unknown';
    if (tx.type === 'expense') catExp[n] = (catExp[n] ?? 0) + tx.amount;
    else                       catInc[n] = (catInc[n] ?? 0) + tx.amount;
  });

  const biggestExpCat   = Object.entries(catExp).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
  const biggestIncSrc   = Object.entries(catInc).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

  // ── Title block ──────────────────────────────────────────────────────────
  ws.mergeCells('A1:E1');
  applyTitleCell(ws.getCell('A1'), 18);
  ws.getCell('A1').value = '💰  FinanceFlow — Financial Summary Report';
  ws.getRow(1).height    = 44;

  ws.mergeCells('A2:E2');
  ws.getCell('A2').value     = `Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  ws.getCell('A2').font      = { italic: true, color: { argb: '    FF8B9DC3' }, size: 10 };
  ws.getCell('A2').fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
  ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height        = 20;

  ws.addRow([]); // spacer

  // ── Section headers ──────────────────────────────────────────────────────
  ws.mergeCells('A4:B4');
  applyHeaderCell(ws.getCell('A4'), 'left');
  ws.getCell('A4').value = '  📥  Income & Flow';

  ws.mergeCells('D4:E4');
  applyHeaderCell(ws.getCell('D4'), 'left');
  ws.getCell('D4').value = '  📤  Expenses & Balance';

  ws.getRow(4).height = 26;

  // ── Stat rows ─────────────────────────────────────────────────────────────
  interface StatRow { label: string; value: string | number; color: string; isCurrency?: boolean }

  const leftStats: StatRow[] = [
    { label: 'Total Inflow',           value: totalIn,          color: C.income,  isCurrency: true },
    { label: 'Net Cash Flow',          value: netFlow,          color: netFlow >= 0 ? C.income : C.expense, isCurrency: true },
    { label: 'Avg Monthly Inflow',     value: totalIn / mCount, color: C.income,  isCurrency: true },
    { label: 'Primary Income Source',  value: biggestIncSrc,    color: C.body },
  ];

  const rightStats: StatRow[] = [
    { label: 'Total Outflow',          value: totalOut,          color: C.expense, isCurrency: true },
    { label: 'Final Balance',          value: netFlow,           color: netFlow >= 0 ? C.income : C.expense, isCurrency: true },
    { label: 'Avg Monthly Outflow',    value: totalOut / mCount, color: C.expense, isCurrency: true },
    { label: 'Top Expense Category',   value: biggestExpCat,     color: C.body },
  ];

  const writeStatPair = (rowIdx: number, left: StatRow, right: StatRow) => {
    const row   = ws.getRow(rowIdx);
    row.height  = 24;

    const writeOne = (colLabel: number, colValue: number, stat: StatRow) => {
      const lc = row.getCell(colLabel);
      const vc = row.getCell(colValue);

      lc.value     = stat.label;
      lc.font      = { size: 10, color: { argb: C.muted }, name: 'Calibri' };
      lc.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.cardBg } };
      lc.alignment = { vertical: 'middle', indent: 1 };
      lc.border    = { bottom: { style: 'thin', color: { argb: C.border } }, right: { style: 'thin', color: { argb: C.border } } };

      vc.value     = stat.value;
      vc.font      = { bold: true, size: 12, color: { argb: stat.color }, name: 'Calibri' };
      vc.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.rowEven } };
      vc.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
      vc.border    = { bottom: { style: 'thin', color: { argb: C.border } } };

      if (stat.isCurrency) numFmt(vc);
    };

    writeOne(1, 2, left);
    writeOne(4, 5, right);
  };

  leftStats.forEach((l, i) => writeStatPair(5 + i, l, rightStats[i]));

  // Extra stat: transaction / category counts
  ws.addRow([]); // spacer

  const txRow = ws.getRow(10);
  txRow.height = 24;
  const writeCount = (col: number, label: string, val: number) => {
    const lc = txRow.getCell(col);
    const vc = txRow.getCell(col + 1);
    lc.value = label;
    lc.font  = { size: 10, color: { argb: C.muted } };
    lc.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.cardBg } };
    lc.alignment = { vertical: 'middle', indent: 1 };
    lc.border    = { bottom: { style: 'thin', color: { argb: C.border } } };
    vc.value = val;
    vc.font  = { bold: true, size: 12, color: { argb: C.body } };
    vc.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.rowEven } };
    vc.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
    vc.border    = { bottom: { style: 'thin', color: { argb: C.border } } };
  };
  writeCount(1, 'Total Transactions', transactions.length);
  writeCount(4, 'Active Categories',  categories.filter(c => transactions.some(t => t.categoryId === c.id)).length);

  // ── Analysis section ─────────────────────────────────────────────────────
  ws.addRow([]);

  ws.mergeCells('A12:E12');
  applyHeaderCell(ws.getCell('A12'), 'left');
  ws.getCell('A12').value = '  📝  Financial Analysis';
  ws.getRow(12).height    = 28;

  const lines = [
    'This report summarizes the financial flow performance based on the selected data.',
    'It highlights income, expenses, net cash movement, and category-level distribution.',
    '',
    `• Total income recorded: ${formatTRY(totalIn)} across ${transactions.filter(t => t.type === 'income').length} transactions.`,
    `• Total expenses recorded: ${formatTRY(totalOut)} across ${transactions.filter(t => t.type === 'expense').length} transactions.`,
    `• Net cash position: ${netFlow >= 0 ? 'POSITIVE' : 'NEGATIVE'} at ${formatTRY(Math.abs(netFlow))}.`,
    `• Highest spending category: ${biggestExpCat} (${formatTRY(catExp[biggestExpCat] ?? 0)}).`,
    `• Primary income source: ${biggestIncSrc} (${formatTRY(catInc[biggestIncSrc] ?? 0)}).`,
    '',
    netFlow >= 0
      ? `✅  Healthy financial position — surplus of ${formatTRY(netFlow)}.`
      : `⚠️  Deficit of ${formatTRY(Math.abs(netFlow))}. Consider reviewing expense categories.`,
  ];

  lines.forEach((line, i) => {
    const r = 13 + i;
    ws.mergeCells(`A${r}:E${r}`);
    const cell     = ws.getCell(`A${r}`);
    cell.value     = line;
    cell.font      = {
      size: 10,
      color: { argb: line.startsWith('•') || line.startsWith('✅') || line.startsWith('⚠') ? C.body : C.muted },
      name: 'Calibri',
    };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFBFF' } };
    cell.alignment = { vertical: 'middle', wrapText: true, indent: line.startsWith('•') ? 2 : 1 };
    ws.getRow(r).height = line === '' ? 8 : 18;
  });

  // Footer
  const fr = 14 + lines.length;
  ws.mergeCells(`A${fr}:E${fr}`);
  const footer = ws.getCell(`A${fr}`);
  footer.value     = `FinanceFlow Export  •  ${new Date().toUTCString()}`;
  footer.font      = { size: 9, italic: true, color: { argb: 'FFADB5C7' } };
  footer.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } };
  footer.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(fr).height = 18;
}

// ── Public export function ────────────────────────────────────────────────────

export async function exportFinancialFlowToExcel({ transactions, categories }: ExportPayload): Promise<void> {
  if (!transactions.length) {
    throw new Error('No financial data available to export.');
  }

  const wb      = new ExcelJS.Workbook();
  wb.creator    = 'FinanceFlow';
  wb.created    = new Date();
  wb.modified   = new Date();

  buildDataSheet(wb, transactions, categories);
  await buildChartsSheet(wb, transactions, categories);
  buildSummarySheet(wb, transactions, categories);

  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `financial-flow-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
