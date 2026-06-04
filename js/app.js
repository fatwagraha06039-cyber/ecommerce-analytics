/**
 * E-Commerce Analytics Dashboard
 * Premium Enterprise JavaScript Engine
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    chartColors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#84cc16'],
    gridColor: 'rgba(255,255,255,0.04)',
    textColor: '#94a3b8',
    fontFamily: "'Inter', sans-serif",
};

Chart.defaults.font.family = CONFIG.fontFamily;
Chart.defaults.color = CONFIG.textColor;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.elements.line.tension = 0.4;

// ============================================
// NOTE: Data loading is handled by data-engine.js
// DATA variable is set by that module before initDashboard() is called
// ============================================

// ============================================
// INITIALIZATION
// ============================================
function initDashboard() {
    // Navigation must init first, before any render errors can block it
    initNavigation();

    // Update header badges with live data
    if (DATA && DATA.kpis) {
        var hrc = document.getElementById('headerRecordCount');
        if (hrc) hrc.textContent = formatNumber(DATA.kpis.total_orders) + ' Transactions';
        var hcc = document.getElementById('headerCustomerCount');
        if (hcc) hcc.textContent = formatNumber(DATA.kpis.unique_customers) + ' Customers';
    }

    try { renderKPIs(); } catch(e) { console.error('renderKPIs:', e); }
    try { renderComparisons(); } catch(e) { console.error('renderComparisons:', e); }
    try { renderOverviewCharts(); } catch(e) { console.error('renderOverviewCharts:', e); }
    try { renderSalesSection(); } catch(e) { console.error('renderSalesSection:', e); }
    try { renderProductsSection(); } catch(e) { console.error('renderProductsSection:', e); }
    try { renderCustomersSection(); } catch(e) { console.error('renderCustomersSection:', e); }
    try { renderGeographicSection(); } catch(e) { console.error('renderGeographicSection:', e); }
    try { renderInsightsSection(); } catch(e) { console.error('renderInsightsSection:', e); }
    try { renderSQLShowcase(); } catch(e) { console.error('renderSQLShowcase:', e); }
    try { renderPipelineSection(); } catch(e) { console.error('renderPipelineSection:', e); }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    var tabs = document.querySelectorAll('.nav-tab');
    var sections = document.querySelectorAll('.section');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            sections.forEach(function(s) { s.classList.remove('active'); });
            tab.classList.add('active');
            var target = document.getElementById(tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ============================================
// FORMATTING UTILITIES
// ============================================
function formatCurrency(val) {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
    return '$' + val.toFixed(2);
}

function formatNumber(val) {
    return val.toLocaleString('en-US');
}

function formatPercent(val) {
    return val.toFixed(1) + '%';
}

function getChangeClass(val) {
    return val >= 0 ? 'positive' : 'negative';
}

function getChangeArrow(val) {
    return val >= 0 ? '&#9650;' : '&#9660;';
}

// ============================================
// KPI CARDS
// ============================================
function renderKPIs() {
    const kpis = DATA.kpis;
    const monthly = DATA.monthly;
    const lastMonth = monthly[monthly.length - 1];
    const prevMonth = monthly[monthly.length - 2];

    const kpiData = [
        { title: 'Total Revenue', value: formatCurrency(kpis.total_revenue), change: lastMonth.revenue_growth || 0, icon: 'revenue', iconText: '$', footer: formatNumber(kpis.total_orders) + ' orders completed' },
        { title: 'Total Profit', value: formatCurrency(kpis.total_profit), change: lastMonth.profit_growth || 0, icon: 'profit', iconText: '%', footer: formatPercent(kpis.gross_margin) + ' gross margin' },
        { title: 'Total Orders', value: formatNumber(kpis.total_orders), change: ((lastMonth.orders - prevMonth.orders) / prevMonth.orders * 100) || 0, icon: 'orders', iconText: '#', footer: formatCurrency(kpis.avg_order_value) + ' avg order value' },
        { title: 'Avg Order Value', value: formatCurrency(kpis.avg_order_value), change: 0, icon: 'revenue', iconText: '$', footer: 'Per transaction average' },
        { title: 'Customer LTV', value: formatCurrency(kpis.customer_lifetime_value), change: 0, icon: 'customers', iconText: 'L', footer: formatNumber(kpis.unique_customers) + ' unique customers' },
        { title: 'Repeat Rate', value: formatPercent(kpis.repeat_purchase_rate), change: 0, icon: 'growth', iconText: '%', footer: formatNumber(kpis.returning_customers) + ' returning customers' },
        { title: 'Gross Margin', value: formatPercent(kpis.gross_margin), change: 0, icon: 'profit', iconText: '%', footer: 'Revenue minus cost of goods' },
        { title: 'Unique Customers', value: formatNumber(kpis.unique_customers), change: 0, icon: 'customers', iconText: '#', footer: formatNumber(kpis.new_customers) + ' new | ' + formatNumber(kpis.returning_customers) + ' returning' },
    ];

    document.getElementById('kpiGrid').innerHTML = kpiData.map(function(kpi) {
        var changeHtml = '';
        if (kpi.change !== 0) {
            changeHtml = '<span class="card-change ' + getChangeClass(kpi.change) + '">' + getChangeArrow(kpi.change) + ' ' + Math.abs(kpi.change).toFixed(1) + '% vs prev month</span>';
        }
        return '<div class="card"><div class="card-header"><span class="card-title">' + kpi.title + '</span><div class="card-icon ' + kpi.icon + '">' + kpi.iconText + '</div></div><div class="card-value">' + kpi.value + '</div>' + changeHtml + '<div class="card-footer">' + kpi.footer + '</div></div>';
    }).join('');
}

// ============================================
// COMPARISON CARDS
// ============================================
function renderComparisons() {
    var monthly = DATA.monthly;
    var thisMonth = monthly[monthly.length - 1];
    var prevMonth = monthly[monthly.length - 2];
    var q4 = monthly.slice(-3);
    var q3 = monthly.slice(-6, -3);
    var q4Revenue = q4.reduce(function(s, m) { return s + m.revenue; }, 0);
    var q3Revenue = q3.reduce(function(s, m) { return s + m.revenue; }, 0);
    var q4Profit = q4.reduce(function(s, m) { return s + m.profit; }, 0);
    var q3Profit = q3.reduce(function(s, m) { return s + m.profit; }, 0);
    var year2025 = monthly.filter(function(m) { return m.month.indexOf('2025') === 0; });
    var year2024 = monthly.filter(function(m) { return m.month.indexOf('2024') === 0; });
    var y25Revenue = year2025.reduce(function(s, m) { return s + m.revenue; }, 0);
    var y24Revenue = year2024.reduce(function(s, m) { return s + m.revenue; }, 0);

    function pctChange(curr, prev) {
        return prev > 0 ? ((curr - prev) / prev * 100).toFixed(1) : '0.0';
    }

    var comparisons = [
        { title: 'Month vs Previous Month', rows: [
            { label: 'Revenue', curr: formatCurrency(thisMonth.revenue), prev: formatCurrency(prevMonth.revenue), pct: pctChange(thisMonth.revenue, prevMonth.revenue) },
            { label: 'Profit', curr: formatCurrency(thisMonth.profit), prev: formatCurrency(prevMonth.profit), pct: pctChange(thisMonth.profit, prevMonth.profit) },
            { label: 'Orders', curr: formatNumber(thisMonth.orders), prev: formatNumber(prevMonth.orders), pct: pctChange(thisMonth.orders, prevMonth.orders) },
            { label: 'Customers', curr: formatNumber(thisMonth.customers), prev: formatNumber(prevMonth.customers), pct: pctChange(thisMonth.customers, prevMonth.customers) }
        ]},
        { title: 'Quarter vs Previous Quarter', rows: [
            { label: 'Revenue', curr: formatCurrency(q4Revenue), prev: formatCurrency(q3Revenue), pct: pctChange(q4Revenue, q3Revenue) },
            { label: 'Profit', curr: formatCurrency(q4Profit), prev: formatCurrency(q3Profit), pct: pctChange(q4Profit, q3Profit) }
        ]},
        { title: 'Year vs Previous Year', rows: [
            { label: 'Revenue', curr: formatCurrency(y25Revenue), prev: formatCurrency(y24Revenue), pct: pctChange(y25Revenue, y24Revenue) }
        ]}
    ];

    document.getElementById('comparisonGrid').innerHTML = comparisons.map(function(comp) {
        var rowsHtml = comp.rows.map(function(row) {
            var pct = parseFloat(row.pct);
            return '<div class="comparison-row"><span class="comparison-label">' + row.label + '</span><div style="display:flex;align-items:center;gap:var(--space-md)"><span class="comparison-value">' + row.curr + '</span><span class="card-change ' + getChangeClass(pct) + '">' + getChangeArrow(pct) + ' ' + Math.abs(pct).toFixed(1) + '%</span></div></div>';
        }).join('');
        return '<div class="comparison-card"><div class="chart-title" style="margin-bottom:var(--space-lg)">' + comp.title + '</div>' + rowsHtml + '</div>';
    }).join('');
}

// ============================================
// OVERVIEW CHARTS
// ============================================
function renderOverviewCharts() {
    var monthly = DATA.monthly;
    var labels = monthly.map(function(m) { return m.month; });

    new Chart(document.getElementById('revenueTrendChart'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Revenue', data: monthly.map(function(m) { return m.revenue; }), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('profitTrendChart'), {
        type: 'line',
        data: { labels: labels, datasets: [{ label: 'Profit', data: monthly.map(function(m) { return m.profit; }), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    var cats = DATA.categories;
    new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: { labels: cats.map(function(c) { return c.category; }), datasets: [{ data: cats.map(function(c) { return c.revenue; }), backgroundColor: CONFIG.chartColors.slice(0, cats.length), borderWidth: 0, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { padding: 12, font: { size: 11 } } }, tooltip: { callbacks: { label: function(ctx) { return ctx.label + ': ' + formatCurrency(ctx.raw) + ' (' + cats[ctx.dataIndex].share_pct + '%)'; } } } } }
    });

    var statuses = DATA.order_status;
    var statusColors = { 'Completed': '#10b981', 'Returned': '#f59e0b', 'Cancelled': '#ef4444' };
    new Chart(document.getElementById('statusChart'), {
        type: 'doughnut',
        data: { labels: statuses.map(function(s) { return s.status; }), datasets: [{ data: statuses.map(function(s) { return s.count; }), backgroundColor: statuses.map(function(s) { return statusColors[s.status] || '#64748b'; }), borderWidth: 0, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { padding: 12, font: { size: 11 } } } } }
    });
}

// ============================================
// SALES SECTION
// ============================================
function renderSalesSection() {
    var monthly = DATA.monthly;
    var labels = monthly.map(function(m) { return m.month; });
    var kpis = DATA.kpis;

    document.getElementById('salesKpiGrid').innerHTML = [
        { title: 'Total Revenue', value: formatCurrency(kpis.total_revenue), icon: 'revenue', iconText: '$' },
        { title: 'Total Profit', value: formatCurrency(kpis.total_profit), icon: 'profit', iconText: '%' },
        { title: 'Total Orders', value: formatNumber(kpis.total_orders), icon: 'orders', iconText: '#' },
        { title: 'Gross Margin', value: formatPercent(kpis.gross_margin), icon: 'growth', iconText: '%' }
    ].map(function(kpi) {
        return '<div class="card"><div class="card-header"><span class="card-title">' + kpi.title + '</span><div class="card-icon ' + kpi.icon + '">' + kpi.iconText + '</div></div><div class="card-value">' + kpi.value + '</div></div>';
    }).join('');

    new Chart(document.getElementById('salesTrendChart'), {
        type: 'line',
        data: { labels: labels, datasets: [
            { label: 'Revenue', data: monthly.map(function(m) { return m.revenue; }), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, borderWidth: 2.5 },
            { label: 'Profit', data: monthly.map(function(m) { return m.profit; }), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, borderWidth: 2.5 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('ordersCustomersChart'), {
        type: 'bar',
        data: { labels: labels, datasets: [
            { label: 'Orders', data: monthly.map(function(m) { return m.orders; }), backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4 },
            { label: 'Customers', data: monthly.map(function(m) { return m.customers; }), backgroundColor: 'rgba(236,72,153,0.7)', borderRadius: 4 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: CONFIG.gridColor } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('growthRateChart'), {
        type: 'bar',
        data: { labels: labels.slice(1), datasets: [{ label: 'Growth %', data: monthly.slice(1).map(function(m) { return m.revenue_growth || 0; }), backgroundColor: monthly.slice(1).map(function(m) { return (m.revenue_growth || 0) >= 0 ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'; }), borderRadius: 4 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return v + '%'; } } }, x: { grid: { display: false } } } }
    });

    // Forecast
    var revenues = monthly.map(function(m) { return m.revenue; });
    var n = revenues.length;
    var xArr = []; for (var i = 0; i < n; i++) xArr.push(i);
    var sumX = xArr.reduce(function(a, b) { return a + b; }, 0);
    var sumY = revenues.reduce(function(a, b) { return a + b; }, 0);
    var sumXY = 0; for (var j = 0; j < n; j++) sumXY += xArr[j] * revenues[j];
    var sumXX = xArr.reduce(function(a, x) { return a + x * x; }, 0);
    var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;
    var forecastLabels = ['Jan 26', 'Feb 26', 'Mar 26'];
    var forecastValues = [n, n + 1, n + 2].map(function(x) { return slope * x + intercept; });
    var actualData = revenues.concat([null, null, null]);
    var forecastData = [];
    for (var k = 0; k < n; k++) forecastData.push(null);
    forecastData = forecastData.concat(forecastValues);

    new Chart(document.getElementById('forecastChart'), {
        type: 'line',
        data: { labels: labels.concat(forecastLabels), datasets: [
            { label: 'Actual', data: actualData, borderColor: '#6366f1', borderWidth: 2.5, pointRadius: 4 },
            { label: 'Forecast', data: forecastData, borderColor: '#ef4444', borderWidth: 2.5, borderDash: [5, 5], pointRadius: 4 }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    var daily = DATA.daily_distribution;
    new Chart(document.getElementById('dailyDistChart'), {
        type: 'bar',
        data: { labels: daily.map(function(d) { return d.day; }), datasets: [{ label: 'Orders', data: daily.map(function(d) { return d.orders; }), backgroundColor: daily.map(function(_, i) { return CONFIG.chartColors[i % CONFIG.chartColors.length] + 'B3'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor } }, x: { grid: { display: false } } } }
    });
}

// ============================================
// PRODUCTS SECTION
// ============================================
function renderProductsSection() {
    var products = DATA.products;
    var abc = DATA.abc_analysis;
    var cats = DATA.categories;

    var top10 = products.slice(0, 10).reverse();
    new Chart(document.getElementById('topProductsChart'), {
        type: 'bar',
        data: { labels: top10.map(function(p) { return p.product.length > 20 ? p.product.substring(0, 20) + '...' : p.product; }), datasets: [{ label: 'Revenue', data: top10.map(function(p) { return p.revenue; }), backgroundColor: top10.map(function(_, i) { return CONFIG.chartColors[i % CONFIG.chartColors.length] + 'CC'; }), borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, y: { grid: { display: false } } } }
    });

    var abcCounts = { A: 0, B: 0, C: 0 };
    abc.forEach(function(p) { abcCounts[p.abc_class]++; });
    var abcRevenue = { A: 0, B: 0, C: 0 };
    abc.forEach(function(p) { abcRevenue[p.abc_class] += p.revenue; });
    var totalRev = abcRevenue.A + abcRevenue.B + abcRevenue.C;

    new Chart(document.getElementById('abcChart'), {
        type: 'bar',
        data: { labels: ['A (Top 80%)', 'B (Next 15%)', 'C (Remaining 5%)'], datasets: [
            { label: 'Products', data: [abcCounts.A, abcCounts.B, abcCounts.C], backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)'], borderRadius: 4, yAxisID: 'y' },
            { label: 'Revenue %', data: [abcRevenue.A / totalRev * 100, abcRevenue.B / totalRev * 100, abcRevenue.C / totalRev * 100], type: 'line', borderColor: '#ec4899', borderWidth: 2.5, pointRadius: 6, yAxisID: 'y1' }
        ]},
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: CONFIG.gridColor }, title: { display: true, text: 'Product Count' } }, y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Revenue %' }, ticks: { callback: function(v) { return v + '%'; } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('categoryMarginChart'), {
        type: 'bar',
        data: { labels: cats.map(function(c) { return c.category; }), datasets: [{ label: 'Profit Margin %', data: cats.map(function(c) { return c.margin; }), backgroundColor: cats.map(function(_, i) { return CONFIG.chartColors[i % CONFIG.chartColors.length] + 'CC'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return v + '%'; } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('categoryShareChart'), {
        type: 'polarArea',
        data: { labels: cats.map(function(c) { return c.category; }), datasets: [{ data: cats.map(function(c) { return c.revenue; }), backgroundColor: CONFIG.chartColors.slice(0, cats.length).map(function(c) { return c + '99'; }), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { padding: 12, font: { size: 11 } } } }, scales: { r: { grid: { color: CONFIG.gridColor }, ticks: { display: false } } } }
    });

    document.querySelector('#productsTable tbody').innerHTML = products.slice(0, 20).map(function(p, i) {
        var badgeClass = p.abc_class === 'A' ? 'badge-success' : p.abc_class === 'B' ? 'badge-warning' : 'badge-danger';
        return '<tr><td>' + (i + 1) + '</td><td>' + p.product + '</td><td>' + p.category + '</td><td>' + formatCurrency(p.revenue) + '</td><td>' + formatCurrency(p.profit) + '</td><td>' + p.margin.toFixed(1) + '%</td><td>' + formatNumber(p.orders) + '</td><td><span class="badge ' + badgeClass + '">' + p.abc_class + '</span></td></tr>';
    }).join('');
}

// ============================================
// CUSTOMERS SECTION
// ============================================
function renderCustomersSection() {
    var kpis = DATA.kpis;
    var rfm = DATA.rfm;
    var rfmSegs = DATA.rfm_segments;
    var topCust = DATA.top_customers;

    document.getElementById('customerKpiGrid').innerHTML = [
        { title: 'Total Customers', value: formatNumber(kpis.unique_customers), icon: 'customers', iconText: '#' },
        { title: 'New Customers', value: formatNumber(kpis.new_customers), icon: 'growth', iconText: '+' },
        { title: 'Returning', value: formatNumber(kpis.returning_customers), icon: 'customers', iconText: '%' },
        { title: 'Repeat Rate', value: formatPercent(kpis.repeat_purchase_rate), icon: 'growth', iconText: '%' }
    ].map(function(kpi) {
        return '<div class="card"><div class="card-header"><span class="card-title">' + kpi.title + '</span><div class="card-icon ' + kpi.icon + '">' + kpi.iconText + '</div></div><div class="card-value">' + kpi.value + '</div></div>';
    }).join('');

    new Chart(document.getElementById('rfmChart'), {
        type: 'doughnut',
        data: { labels: rfmSegs.map(function(s) { return s.segment; }), datasets: [{ data: rfmSegs.map(function(s) { return s.count; }), backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#64748b'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12 } } } }
    });

    var segCounts = { Regular: 0, Premium: 0, VIP: 0 };
    rfm.forEach(function(c) { if (segCounts[c.segment] !== undefined) segCounts[c.segment]++; });
    new Chart(document.getElementById('customerSegmentChart'), {
        type: 'doughnut',
        data: { labels: Object.keys(segCounts), datasets: [{ data: [segCounts.Regular, segCounts.Premium, segCounts.VIP], backgroundColor: ['#64748b', '#6366f1', '#f59e0b'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12 } } } }
    });

    new Chart(document.getElementById('newReturningChart'), {
        type: 'doughnut',
        data: { labels: ['New Customers', 'Returning Customers'], datasets: [{ data: [kpis.new_customers, kpis.returning_customers], backgroundColor: ['#6366f1', '#10b981'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12 } } } }
    });

    var payments = DATA.payment_methods;
    new Chart(document.getElementById('paymentChart'), {
        type: 'bar',
        data: { labels: payments.map(function(p) { return p.method; }), datasets: [{ label: 'Transactions', data: payments.map(function(p) { return p.count; }), backgroundColor: payments.map(function(_, i) { return CONFIG.chartColors[i % CONFIG.chartColors.length] + 'CC'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor } }, x: { grid: { display: false } } } }
    });

    document.querySelector('#customersTable tbody').innerHTML = topCust.slice(0, 20).map(function(c, i) {
        var segBadge = c.segment === 'VIP' ? 'badge-warning' : c.segment === 'Premium' ? 'badge-purple' : 'badge-info';
        var rfmBadge = c.rfm_segment === 'Champions' ? 'badge-success' : c.rfm_segment === 'Loyal' ? 'badge-info' : c.rfm_segment === 'At Risk' ? 'badge-warning' : 'badge-danger';
        return '<tr><td>' + (i + 1) + '</td><td>' + c.customer_id + '</td><td><span class="badge ' + segBadge + '">' + c.segment + '</span></td><td>' + c.rfm_score + '</td><td><span class="badge ' + rfmBadge + '">' + c.rfm_segment + '</span></td><td>' + c.frequency + '</td><td>' + formatCurrency(c.monetary) + '</td><td>' + c.recency + '</td></tr>';
    }).join('');
}

// ============================================
// GEOGRAPHIC SECTION
// ============================================
function renderGeographicSection() {
    var regions = DATA.regions;
    var topRegion = regions[0];

    document.getElementById('geoKpiGrid').innerHTML = [
        { title: 'Top Region', value: topRegion.region, icon: 'growth', iconText: '#' },
        { title: 'Top Region Revenue', value: formatCurrency(topRegion.revenue), icon: 'revenue', iconText: '$' },
        { title: 'Top Region Margin', value: formatPercent(topRegion.margin), icon: 'profit', iconText: '%' },
        { title: 'Total Regions', value: regions.length.toString(), icon: 'orders', iconText: '#' }
    ].map(function(kpi) {
        return '<div class="card"><div class="card-header"><span class="card-title">' + kpi.title + '</span><div class="card-icon ' + kpi.icon + '">' + kpi.iconText + '</div></div><div class="card-value">' + kpi.value + '</div></div>';
    }).join('');

    new Chart(document.getElementById('regionChart'), {
        type: 'bar',
        data: { labels: regions.map(function(r) { return r.region; }), datasets: [{ label: 'Revenue', data: regions.map(function(r) { return r.revenue; }), backgroundColor: regions.map(function(_, i) { return CONFIG.chartColors[i % CONFIG.chartColors.length] + 'CC'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('regionProfitChart'), {
        type: 'bar',
        data: { labels: regions.map(function(r) { return r.region; }), datasets: [{ label: 'Profit', data: regions.map(function(r) { return r.profit; }), backgroundColor: regions.map(function(_, i) { return CONFIG.chartColors[(i + 2) % CONFIG.chartColors.length] + 'CC'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return formatCurrency(v); } } }, x: { grid: { display: false } } } }
    });

    new Chart(document.getElementById('regionCustomersChart'), {
        type: 'doughnut',
        data: { labels: regions.map(function(r) { return r.region; }), datasets: [{ data: regions.map(function(r) { return r.customers; }), backgroundColor: CONFIG.chartColors.slice(0, regions.length), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { padding: 12 } } } }
    });

    new Chart(document.getElementById('regionMarginChart'), {
        type: 'bar',
        data: { labels: regions.map(function(r) { return r.region; }), datasets: [{ label: 'Margin %', data: regions.map(function(r) { return r.margin; }), backgroundColor: regions.map(function(r) { return r.margin >= 60 ? 'rgba(16,185,129,0.7)' : 'rgba(245,158,11,0.7)'; }), borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: CONFIG.gridColor }, ticks: { callback: function(v) { return v + '%'; } } }, x: { grid: { display: false } } } }
    });

    document.querySelector('#regionTable tbody').innerHTML = regions.map(function(r) {
        return '<tr><td><strong>' + r.region + '</strong></td><td>' + formatCurrency(r.revenue) + '</td><td>' + formatCurrency(r.profit) + '</td><td>' + r.margin.toFixed(1) + '%</td><td>' + formatNumber(r.orders) + '</td><td>' + formatNumber(r.customers) + '</td><td>' + formatCurrency(r.revenue / r.orders) + '</td></tr>';
    }).join('');
}

// ============================================
// INSIGHTS SECTION
// ============================================
/**
 * E-Commerce Analytics Dashboard — Part 2
 * Insights, SQL, Pipeline, and Init
 */

// ============================================
// INSIGHTS (continued)
// ============================================
function renderInsightsSection() {
    var kpis = DATA.kpis;
    var monthly = DATA.monthly;
    var cats = DATA.categories;
    var regions = DATA.regions;
    var rfmSegs = DATA.rfm_segments;
    var topCust = DATA.top_customers;
    var lastMonth = monthly[monthly.length - 1];
    var prevMonth = monthly[monthly.length - 2];
    var revenueGrowth = ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1);
    var topCat = cats[0];
    var topRegionData = regions[0];
    var top10Revenue = topCust.slice(0, 10).reduce(function(s, c) { return s + c.monetary; }, 0);
    var top10Pct = (top10Revenue / kpis.total_revenue * 100).toFixed(1);

    var insights = [
        { icon: '\u{1F4C8}', title: 'Revenue Trend', text: 'Revenue ' + (parseFloat(revenueGrowth) >= 0 ? 'increased' : 'decreased') + ' by ' + Math.abs(parseFloat(revenueGrowth)).toFixed(1) + '% compared to previous month.', action: 'Monitor monthly growth rate for sustained trend.' },
        { icon: '\u{1F3AF}', title: 'Top Category', text: topCat.category + ' contributes ' + formatPercent(topCat.share_pct) + ' of total revenue with ' + formatPercent(topCat.margin) + ' profit margin.', action: 'Consider expanding ' + topCat.category + ' product line.' },
        { icon: '\u{1F48E}', title: 'VIP Customers', text: 'Top 10 customers generate ' + top10Pct + '% of total revenue (' + formatCurrency(top10Revenue) + ').', action: 'Implement VIP loyalty program to retain high-value customers.' },
        { icon: '\u{1F5FA}', title: 'Regional Performance', text: topRegionData.region + ' region leads with ' + formatCurrency(topRegionData.revenue) + ' revenue and ' + formatPercent(topRegionData.margin) + ' margin.', action: 'Investigate underperforming regions for growth opportunities.' },
        { icon: '\u{1F504}', title: 'Retention', text: formatPercent(kpis.repeat_purchase_rate) + ' repeat purchase rate with ' + formatNumber(kpis.returning_customers) + ' returning customers out of ' + formatNumber(kpis.unique_customers) + '.', action: 'Focus on converting one-time buyers to repeat customers.' },
        { icon: '\u{1F4CA}', title: 'Profitability', text: 'Gross margin stands at ' + formatPercent(kpis.gross_margin) + ' with total profit of ' + formatCurrency(kpis.total_profit) + ' on ' + formatCurrency(kpis.total_revenue) + ' revenue.', action: 'Optimize cost structure to improve margins further.' },
    ];

    document.getElementById('insightsGrid').innerHTML = insights.map(function(ins) {
        return '<div class="insight-card"><div class="insight-icon">' + ins.icon + '</div><div class="insight-title">' + ins.title + '</div><div class="insight-text">' + ins.text + '</div><div class="insight-action">' + ins.action + '</div></div>';
    }).join('');

    // Business Impact
    document.getElementById('businessImpact').innerHTML =
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-lg)">' +
        '<div><h3 style="color:var(--text-primary);margin-bottom:var(--space-md)">Problems Solved</h3>' +
        '<ul style="color:var(--text-secondary);font-size:0.875rem;line-height:2;list-style:none">' +
        '<li>&#10003; Identified revenue concentration risk across product categories</li>' +
        '<li>&#10003; Mapped customer segments using RFM analysis for targeted marketing</li>' +
        '<li>&#10003; Discovered regional performance gaps for resource allocation</li>' +
        '<li>&#10003; Built forecasting models for revenue planning</li>' +
        '<li>&#10003; Quantified customer lifetime value for acquisition budgeting</li>' +
        '</ul></div>' +
        '<div><h3 style="color:var(--text-primary);margin-bottom:var(--space-md)">Actionable Decisions</h3>' +
        '<ul style="color:var(--text-secondary);font-size:0.875rem;line-height:2;list-style:none">' +
        '<li>&#9654; Expand top-performing categories (Electronics, Clothing)</li>' +
        '<li>&#9654; Launch VIP loyalty program for top 10% customers</li>' +
        '<li>&#9654; Increase marketing spend in underperforming regions</li>' +
        '<li>&#9654; Optimize pricing for low-margin products</li>' +
        '<li>&#9654; Implement churn prevention for "At Risk" RFM segment</li>' +
        '</ul></div></div>';

    // Tech Stack
    var techItems = ['SQL', 'Python', 'Pandas', 'NumPy', 'Matplotlib', 'Power BI Concepts', 'Business Intelligence', 'Statistical Analysis', 'Forecasting', 'Data Visualization', 'Chart.js', 'RFM Analysis', 'ABC Analysis', 'Linear Regression', 'ETL Pipeline'];
    document.getElementById('techStack').innerHTML = techItems.map(function(t) {
        return '<span style="padding:6px 16px;background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:var(--radius-full);font-size:0.8125rem;color:var(--text-secondary)">' + t + '</span>';
    }).join('');
}

// ============================================
// SQL SHOWCASE
// ============================================
function renderSQLShowcase() {
    var queries = [
        {
            title: 'Top 10 Products by Revenue',
            purpose: 'Identify highest revenue generating products for inventory prioritization.',
            sql: 'SELECT\n    p.product_name,\n    p.category,\n    COUNT(o.order_id) AS total_orders,\n    SUM(o.revenue) AS total_revenue,\n    SUM(o.profit) AS total_profit,\n    ROUND(SUM(o.profit) / SUM(o.revenue) * 100, 2) AS profit_margin\nFROM orders o\nJOIN products p ON o.product_id = p.product_id\nWHERE o.status = \'Completed\'\nGROUP BY p.product_name, p.category\nORDER BY total_revenue DESC\nLIMIT 10;'
        },
        {
            title: 'Monthly Revenue Growth (Window Function)',
            purpose: 'Calculate month-over-month growth rate using LAG() window function.',
            sql: 'SELECT\n    DATE_TRUNC(\'month\', order_date) AS month,\n    SUM(revenue) AS monthly_revenue,\n    LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC(\'month\', order_date)) AS prev_month,\n    ROUND(\n        (SUM(revenue) - LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC(\'month\', order_date)))\n        / LAG(SUM(revenue)) OVER (ORDER BY DATE_TRUNC(\'month\', order_date)) * 100,\n        2\n    ) AS growth_pct\nFROM orders\nWHERE status = \'Completed\'\nGROUP BY DATE_TRUNC(\'month\', order_date)\nORDER BY month;'
        },
        {
            title: 'Customer Segmentation (RFM Analysis)',
            purpose: 'Segment customers by Recency, Frequency, and Monetary value for targeted marketing.',
            sql: 'WITH rfm AS (\n    SELECT\n        customer_id,\n        DATEDIFF(day, MAX(order_date), CURRENT_DATE) AS recency,\n        COUNT(DISTINCT order_id) AS frequency,\n        SUM(revenue) AS monetary\n    FROM orders\n    WHERE status = \'Completed\'\n    GROUP BY customer_id\n)\nSELECT\n    customer_id,\n    recency,\n    frequency,\n    monetary,\n    CASE\n        WHEN recency <= 30 AND frequency >= 5 THEN \'Champions\'\n        WHEN recency <= 60 AND frequency >= 3 THEN \'Loyal\'\n        WHEN recency <= 120 THEN \'Potential\'\n        WHEN recency <= 200 THEN \'At Risk\'\n        ELSE \'Lost\'\n    END AS segment\nFROM rfm\nORDER BY monetary DESC;'
        },
        {
            title: 'Regional Revenue with Ranking',
            purpose: 'Compare regional performance using RANK() and percentage of total.',
            sql: 'SELECT\n    region,\n    COUNT(DISTINCT customer_id) AS customers,\n    COUNT(order_id) AS orders,\n    SUM(revenue) AS total_revenue,\n    SUM(profit) AS total_profit,\n    ROUND(SUM(profit) / SUM(revenue) * 100, 2) AS margin_pct,\n    ROUND(SUM(revenue) * 100.0 / SUM(SUM(revenue)) OVER (), 2) AS revenue_share,\n    RANK() OVER (ORDER BY SUM(revenue) DESC) AS revenue_rank\nFROM orders\nWHERE status = \'Completed\'\nGROUP BY region\nORDER BY total_revenue DESC;'
        },
        {
            title: 'Customer Retention Analysis (CTE)',
            purpose: 'Measure customer retention by tracking repeat purchases within 90 days.',
            sql: 'WITH first_orders AS (\n    SELECT\n        customer_id,\n        MIN(order_date) AS first_order_date\n    FROM orders\n    WHERE status = \'Completed\'\n    GROUP BY customer_id\n),\nrepeat_orders AS (\n    SELECT\n        o.customer_id,\n        COUNT(DISTINCT o.order_id) AS repeat_count\n    FROM orders o\n    JOIN first_orders f ON o.customer_id = f.customer_id\n    WHERE o.status = \'Completed\'\n        AND o.order_date > f.first_order_date\n        AND o.order_date <= DATEADD(day, 90, f.first_order_date)\n    GROUP BY o.customer_id\n)\nSELECT\n    COUNT(DISTINCT f.customer_id) AS total_customers,\n    COUNT(DISTINCT r.customer_id) AS retained_customers,\n    ROUND(COUNT(DISTINCT r.customer_id) * 100.0 / COUNT(DISTINCT f.customer_id), 2) AS retention_rate\nFROM first_orders f\nLEFT JOIN repeat_orders r ON f.customer_id = r.customer_id;'
        },
        {
            title: 'ABC Product Classification',
            purpose: 'Classify products into A/B/C tiers based on cumulative revenue contribution.',
            sql: 'WITH product_revenue AS (\n    SELECT\n        product_name,\n        SUM(revenue) AS total_revenue\n    FROM orders\n    WHERE status = \'Completed\'\n    GROUP BY product_name\n),\ncumulative AS (\n    SELECT\n        product_name,\n        total_revenue,\n        SUM(total_revenue) OVER (ORDER BY total_revenue DESC) AS cum_revenue,\n        SUM(total_revenue) OVER () AS grand_total\n    FROM product_revenue\n)\nSELECT\n    product_name,\n    total_revenue,\n    ROUND(cum_revenue / grand_total * 100, 2) AS cumulative_pct,\n    CASE\n        WHEN cum_revenue / grand_total * 100 <= 80 THEN \'A\'\n        WHEN cum_revenue / grand_total * 100 <= 95 THEN \'B\'\n        ELSE \'C\'\n    END AS abc_class\nFROM cumulative\nORDER BY total_revenue DESC;'
        }
    ];

    document.getElementById('sqlShowcase').innerHTML = queries.map(function(q) {
        // Escape HTML first
        var escaped = q.sql.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // Highlight strings first (to avoid matching keywords inside strings)
        var highlighted = escaped.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');
        // Highlight keywords (only standalone, not inside spans)
        highlighted = highlighted.replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|JOIN|LEFT JOIN|ON|AS|AND|OR|CASE|WHEN|THEN|ELSE|END|WITH|OVER|DISTINCT|NULL)\b/g, '<span class="sql-keyword">$1</span>');
        // Highlight functions
        highlighted = highlighted.replace(/\b(COUNT|SUM|AVG|MIN|MAX|ROUND|LAG|RANK|DATE_TRUNC|DATEDIFF|DATEADD|CURRENT_DATE)\b/g, '<span class="sql-function">$1</span>');
        // Highlight numbers (only outside of existing spans)
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="sql-number">$1</span>');
        return '<div class="sql-block"><div class="sql-block-header"><span class="sql-block-title">' + q.title + '</span><span class="sql-block-purpose">' + q.purpose + '</span></div><pre>' + highlighted + '</pre></div>';
    }).join('');
}

// ============================================
// PIPELINE SECTION
// ============================================
function renderPipelineSection() {
    // Live Data Pipeline Flow
    var isLive = DATA && DATA._live;
    var pipeSteps = [
        { label: isLive ? 'Google Sheets' : 'Local JSON', active: true },
        { label: isLive ? 'Apps Script API' : 'Static File', active: isLive },
        { label: 'JSON Processing', active: true },
        { label: 'Analytics Engine', active: true },
        { label: 'Dashboard', active: true }
    ];

    document.getElementById('pipelineSteps').innerHTML = pipeSteps.map(function(s, i) {
        var arrow = i < pipeSteps.length - 1 ? '<span class="pipe-arrow">&#8594;</span>' : '';
        return '<div class="pipe-step' + (s.active ? ' active' : '') + '">' + s.label + '</div>' + arrow;
    }).join('');

    // Data Source Info
    var recordCount = DATA ? (DATA._record_count || DATA.kpis.total_orders) : 0;
    var lastSync = DATA && DATA._last_updated ? new Date(DATA._last_updated).toLocaleString() : 'N/A';
    var uniqueCustomers = DATA ? DATA.kpis.unique_customers : 0;
    var catCount = DATA ? DATA.categories.length : 0;
    var regCount = DATA ? DATA.regions.length : 0;

    document.getElementById('dataQuality').innerHTML =
        '<div style="display:grid;gap:var(--space-md)">' +
        [
            { label: 'Data Source', value: isLive ? 'Google Sheets (Live)' : 'Local JSON (Demo)', status: isLive ? 'active' : 'warning' },
            { label: 'Total Records', value: formatNumber(recordCount), status: 'active' },
            { label: 'Last Sync', value: lastSync, status: 'active' },
            { label: 'Update Frequency', value: isLive ? 'Every 5 minutes' : 'Manual', status: isLive ? 'active' : 'warning' },
            { label: 'Unique Customers', value: formatNumber(uniqueCustomers), status: 'active' },
            { label: 'Product Categories', value: catCount.toString(), status: 'active' },
            { label: 'Geographic Regions', value: regCount.toString(), status: 'active' },
            { label: 'Connection Status', value: CONNECTION_STATUS || 'N/A', status: CONNECTION_STATUS === 'connected' ? 'active' : 'warning' },
            { label: 'Fetch Count', value: (FETCH_COUNT || 0).toString(), status: 'active' }
        ].map(function(item) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-sm) 0;border-bottom:1px solid var(--border-subtle)"><span style="color:var(--text-secondary);font-size:0.8125rem">' + item.label + '</span><div style="display:flex;align-items:center;gap:var(--space-sm)"><span class="status-dot ' + item.status + '"></span><span style="font-size:0.875rem;font-weight:500">' + item.value + '</span></div></div>';
        }).join('') + '</div>';

    // Python Workflow
    document.getElementById('pythonWorkflow').innerHTML =
        '<div style="display:grid;gap:var(--space-md)">' +
        [
            { step: '1. Data Loading', desc: 'JSON to Pandas DataFrames (data_loader.py)', icon: '\u{1F4E5}' },
            { step: '2. Data Cleaning', desc: 'Type conversion, null handling, dedup', icon: '\u{1F9F9}' },
            { step: '3. Feature Engineering', desc: 'Growth rates, time periods, shares, RFM scores', icon: '\u{2699}' },
            { step: '4. Exploratory Analysis', desc: 'Summary stats, HHI, correlation, distribution', icon: '\u{1F50D}' },
            { step: '5. Visualization', desc: '6 publication-ready charts (Matplotlib + Seaborn)', icon: '\u{1F4C8}' },
            { step: '6. Executive Summary', desc: 'Auto-generated business insights report', icon: '\u{1F4CB}' }
        ].map(function(item) {
            return '<div style="display:flex;gap:var(--space-md);align-items:flex-start;padding:var(--space-md);background:var(--bg-glass);border-radius:var(--radius-md)"><span style="font-size:1.25rem">' + item.icon + '</span><div><div style="font-size:0.875rem;font-weight:600;color:var(--text-primary)">' + item.step + '</div><div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">' + item.desc + '</div></div></div>';
        }).join('') + '</div>';

    // Business Impact Section
    var topCustPipeline = DATA.top_customers || [];
    var top10RevPipeline = topCustPipeline.slice(0, 10).reduce(function(s, c) { return s + c.monetary; }, 0);
    var top10PctPipeline = DATA.kpis.total_revenue > 0 ? (top10RevPipeline / DATA.kpis.total_revenue * 100).toFixed(1) : '0.0';

    document.getElementById('businessImpactSection').innerHTML =
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-xl)">' +
        '<div><h3 style="color:var(--text-primary);margin-bottom:var(--space-lg);font-size:1.125rem">Why This Analysis Matters</h3>' +
        '<div style="display:grid;gap:var(--space-md)">' +
        [
            { q: 'How much revenue is generated?', a: formatCurrency(DATA.kpis.total_revenue) + ' across ' + formatNumber(DATA.kpis.total_orders) + ' completed orders' },
            { q: 'Which products drive profit?', a: DATA.products[0].product + ' leads with ' + formatCurrency(DATA.products[0].revenue) + ' revenue' },
            { q: 'Which customers are most valuable?', a: 'Top 10% customers generate ' + top10PctPipeline + '% of total revenue' },
            { q: 'Which regions underperform?', a: DATA.regions[DATA.regions.length - 1].region + ' region has lowest revenue at ' + formatCurrency(DATA.regions[DATA.regions.length - 1].revenue) },
            { q: 'What trends are emerging?', a: 'Positive growth trend with seasonal peaks in Q4' }
        ].map(function(item) {
            return '<div style="padding:var(--space-md);background:var(--bg-glass);border-radius:var(--radius-md);border-left:3px solid var(--accent-primary)"><div style="font-size:0.8125rem;font-weight:600;color:var(--text-primary);margin-bottom:var(--space-xs)">' + item.q + '</div><div style="font-size:0.8125rem;color:var(--text-secondary)">' + item.a + '</div></div>';
        }).join('') + '</div></div>' +
        '<div><h3 style="color:var(--text-primary);margin-bottom:var(--space-lg);font-size:1.125rem">Strategic Recommendations</h3>' +
        '<div style="display:grid;gap:var(--space-md)">' +
        [
            'Expand top-performing product categories to capture more market share',
            'Launch targeted campaigns for "At Risk" customers before they churn',
            'Invest in West region marketing — highest margin, room for growth',
            'Implement dynamic pricing for C-class products to improve margins',
            'Build VIP loyalty program for top 20 customers to prevent defection',
            'Optimize inventory for seasonal demand patterns (Q4 peak)'
        ].map(function(rec, i) {
            return '<div style="display:flex;gap:var(--space-md);align-items:flex-start"><span style="width:24px;height:24px;border-radius:50%;background:var(--accent-primary);color:white;display:flex;align-items:center;justify-content:center;font-size:0.6875rem;font-weight:700;flex-shrink:0">' + (i + 1) + '</span><span style="font-size:0.8125rem;color:var(--text-secondary);line-height:1.6">' + rec + '</span></div>';
        }).join('') + '</div></div></div>';
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function exportCSV(data, filename) {
    if (!data || !data.length) return;
    var headers = Object.keys(data[0]);
    var csv = headers.join(',') + '\n';
    data.forEach(function(row) {
        csv += headers.map(function(h) { return '"' + String(row[h]).replace(/"/g, '""') + '"'; }).join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// NOTE: DOMContentLoaded listener is in data-engine.js
// It calls loadData() which sets DATA and then calls initDashboard()
