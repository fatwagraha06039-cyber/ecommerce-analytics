/**
 * Google Apps Script Backend — E-Commerce Analytics API
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Sheet with columns: Date, Order ID, Customer ID, Customer Name, Product, Category, Region, Quantity, Revenue, Profit
 * 2. Open Extensions > Apps Script
 * 3. Paste this entire file into Code.gs
 * 4. Click Deploy > New Deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL
 * 6. Paste it into data-engine.js as GOOGLE_SHEET_API_URL
 * 
 * SHEET FORMAT (Sheet1, Row 1 = Headers):
 * | Date | Order ID | Customer ID | Customer Name | Product | Category | Region | Quantity | Revenue | Profit |
 */

function doGet(e) {
    try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName('Sheet1');
        
        if (!sheet) {
            return createJsonResponse({ error: 'Sheet1 not found', orders: [] });
        }
        
        var data = sheet.getDataRange().getValues();
        var headers = data[0];
        var orders = [];
        
        for (var i = 1; i < data.length; i++) {
            var row = data[i];
            // Skip empty rows
            if (!row[0] || !row[1]) continue;
            
            var orderDate = formatDate(row[0]);
            var revenue = parseFloat(row[8]) || 0;
            var profit = parseFloat(row[9]) || 0;
            var quantity = parseInt(row[7]) || 1;
            
            orders.push({
                date: orderDate,
                order_id: String(row[1]).trim(),
                customer_id: String(row[2]).trim(),
                customer_name: String(row[3]).trim(),
                product: String(row[4]).trim(),
                category: String(row[5]).trim(),
                region: String(row[6]).trim(),
                quantity: quantity,
                revenue: revenue,
                profit: profit,
                cost: revenue - profit,
                status: revenue > 0 ? 'Completed' : 'Cancelled',
                year_month: orderDate.substring(0, 7)
            });
        }
        
        // Aggregate KPIs
        var totalRevenue = orders.reduce(function(s, o) { return s + o.revenue; }, 0);
        var totalProfit = orders.reduce(function(s, o) { return s + o.profit; }, 0);
        var totalOrders = orders.length;
        var uniqueCustomers = {};
        var categories = {};
        var products = {};
        var regions = {};
        var monthly = {};
        
        orders.forEach(function(o) {
            uniqueCustomers[o.customer_id] = true;
            
            if (!categories[o.category]) categories[o.category] = { revenue: 0, profit: 0, orders: 0 };
            categories[o.category].revenue += o.revenue;
            categories[o.category].profit += o.profit;
            categories[o.category].orders++;
            
            if (!products[o.product]) products[o.product] = { revenue: 0, profit: 0, orders: 0 };
            products[o.product].revenue += o.revenue;
            products[o.product].profit += o.profit;
            products[o.product].orders++;
            
            if (!regions[o.region]) regions[o.region] = { revenue: 0, profit: 0, orders: 0, customers: {} };
            regions[o.region].revenue += o.revenue;
            regions[o.region].profit += o.profit;
            regions[o.region].orders++;
            regions[o.region].customers[o.customer_id] = true;
            
            if (!monthly[o.year_month]) monthly[o.year_month] = { revenue: 0, profit: 0, orders: 0, customers: {} };
            monthly[o.year_month].revenue += o.revenue;
            monthly[o.year_month].profit += o.profit;
            monthly[o.year_month].orders++;
            monthly[o.year_month].customers[o.customer_id] = true;
        });
        
        var uniqueCustomerCount = Object.keys(uniqueCustomers).length;
        
        // Build monthly array
        var monthlyArr = Object.keys(monthly).sort().map(function(ym) {
            return {
                month: ym,
                revenue: Math.round(monthly[ym].revenue * 100) / 100,
                profit: Math.round(monthly[ym].profit * 100) / 100,
                orders: monthly[ym].orders,
                customers: Object.keys(monthly[ym].customers).length
            };
        });
        
        // Calculate growth
        for (var j = 1; j < monthlyArr.length; j++) {
            var prev = monthlyArr[j - 1].revenue;
            var curr = monthlyArr[j].revenue;
            monthlyArr[j].revenue_growth = prev > 0 ? Math.round((curr - prev) / prev * 10000) / 100 : 0;
            var prevP = monthlyArr[j - 1].profit;
            var currP = monthlyArr[j].profit;
            monthlyArr[j].profit_growth = prevP > 0 ? Math.round((currP - prevP) / prevP * 10000) / 100 : 0;
        }
        if (monthlyArr.length > 0) {
            monthlyArr[0].revenue_growth = 0;
            monthlyArr[0].profit_growth = 0;
        }
        
        // Build category array
        var categoriesArr = Object.keys(categories).map(function(cat) {
            return {
                category: cat,
                revenue: Math.round(categories[cat].revenue * 100) / 100,
                profit: Math.round(categories[cat].profit * 100) / 100,
                margin: Math.round(categories[cat].profit / categories[cat].revenue * 10000) / 100,
                orders: categories[cat].orders,
                share_pct: Math.round(categories[cat].revenue / totalRevenue * 10000) / 100
            };
        }).sort(function(a, b) { return b.revenue - a.revenue; });
        
        // Build products array
        var productsArr = Object.keys(products).map(function(prod) {
            return {
                product: prod,
                revenue: Math.round(products[prod].revenue * 100) / 100,
                profit: Math.round(products[prod].profit * 100) / 100,
                margin: Math.round(products[prod].profit / products[prod].revenue * 10000) / 100,
                orders: products[prod].orders
            };
        }).sort(function(a, b) { return b.revenue - a.revenue; });
        
        // Build region array
        var regionsArr = Object.keys(regions).map(function(reg) {
            return {
                region: reg,
                revenue: Math.round(regions[reg].revenue * 100) / 100,
                profit: Math.round(regions[reg].profit * 100) / 100,
                margin: Math.round(regions[reg].profit / regions[reg].revenue * 10000) / 100,
                orders: regions[reg].orders,
                customers: Object.keys(regions[reg].customers).length
            };
        }).sort(function(a, b) { return b.revenue - a.revenue; });
        
        // Top customers
        var custMap = {};
        orders.forEach(function(o) {
            if (!custMap[o.customer_id]) custMap[o.customer_id] = { name: o.customer_name, revenue: 0, orders: 0, last_order: '' };
            custMap[o.customer_id].revenue += o.revenue;
            custMap[o.customer_id].orders++;
            if (o.date > custMap[o.customer_id].last_order) custMap[o.customer_id].last_order = o.date;
        });
        var topCustomers = Object.keys(custMap).map(function(cid) {
            return {
                customer_id: cid,
                customer_name: custMap[cid].name,
                revenue: Math.round(custMap[cid].revenue * 100) / 100,
                orders: custMap[cid].orders,
                last_order: custMap[cid].last_order
            };
        }).sort(function(a, b) { return b.revenue - a.revenue; }).slice(0, 20);
        
        var topCategory = categoriesArr.length > 0 ? categoriesArr[0].category : 'N/A';
        var topProduct = productsArr.length > 0 ? productsArr[0].product : 'N/A';
        var topRegion = regionsArr.length > 0 ? regionsArr[0].region : 'N/A';
        
        var result = {
            status: 'success',
            last_updated: new Date().toISOString(),
            record_count: orders.length,
            kpis: {
                total_revenue: Math.round(totalRevenue * 100) / 100,
                total_profit: Math.round(totalProfit * 100) / 100,
                total_orders: totalOrders,
                unique_customers: uniqueCustomerCount,
                avg_order_value: totalOrders > 0 ? Math.round(totalRevenue / totalOrders * 100) / 100 : 0,
                profit_margin: totalRevenue > 0 ? Math.round(totalProfit / totalRevenue * 10000) / 100 : 0,
                top_category: topCategory,
                top_product: topProduct,
                top_region: topRegion
            },
            monthly: monthlyArr,
            categories: categoriesArr,
            products: productsArr,
            regions: regionsArr,
            top_customers: topCustomers
        };
        
        return createJsonResponse(result);
        
    } catch (error) {
        return createJsonResponse({
            status: 'error',
            error: error.message,
            last_updated: new Date().toISOString(),
            record_count: 0,
            kpis: { total_revenue: 0, total_profit: 0, total_orders: 0, unique_customers: 0, avg_order_value: 0, profit_margin: 0, top_category: 'N/A', top_product: 'N/A', top_region: 'N/A' },
            monthly: [],
            categories: [],
            products: [],
            regions: [],
            top_customers: []
        });
    }
}

function formatDate(val) {
    if (val instanceof Date) {
        return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    return String(val).trim().substring(0, 10);
}

function createJsonResponse(obj) {
    return ContentService
        .createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function — run this to verify your sheet structure
 */
function testConnection() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Sheet1');
    var data = sheet.getDataRange().getValues();
    Logger.log('Headers: ' + JSON.stringify(data[0]));
    Logger.log('Total rows: ' + (data.length - 1));
    Logger.log('Sample row 2: ' + JSON.stringify(data[1]));
}
