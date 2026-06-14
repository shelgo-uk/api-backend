const db = require('../config/db');

const CANCELLED = 'cancelled';

function toNum(val) {
  return parseFloat(val) || 0;
}

function formatDateKey(val) {
  if (!val) return '';
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val).slice(0, 10);
}

function fillDailyChart(rows, days) {
  const map = new Map(rows.map(r => [formatDateKey(r.date), { sales: toNum(r.sales), orders: Number(r.orders) || 0 }]));
  const chart = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    const entry = map.get(key) || { sales: 0, orders: 0 };
    chart.push({
      label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      date: key,
      sales: entry.sales,
      orders: entry.orders
    });
  }
  return chart;
}

function fillMonthlyChart(rows, months) {
  const map = new Map(rows.map(r => [r.month, { sales: toNum(r.sales), orders: Number(r.orders) || 0 }]));
  const chart = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const entry = map.get(key) || { sales: 0, orders: 0 };
    chart.push({
      label: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      date: key,
      sales: entry.sales,
      orders: entry.orders
    });
  }
  return chart;
}

function aggregateTopProducts(orderRows, limit = 5) {
  const productMap = new Map();

  for (const row of orderRows) {
    let items = row.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch { items = []; }
    }
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      const id = item.id || item.productId;
      if (!id) continue;
      const qty = Number(item.quantity) || 0;
      const price = toNum(item.salePrice ?? item.price);
      const revenue = price * qty;
      const existing = productMap.get(id) || {
        id,
        name: item.name || 'Unknown Product',
        quantitySold: 0,
        revenue: 0
      };
      existing.quantitySold += qty;
      existing.revenue += revenue;
      productMap.set(id, existing);
    }
  }

  return [...productMap.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(p => ({
      ...p,
      revenue: Math.round(p.revenue * 100) / 100
    }));
}

const Dashboard = {
  adminDashboard: async (period = 'month') => {
    const validPeriods = ['week', 'month', 'year'];
    const chartPeriod = validPeriods.includes(period) ? period : 'month';

    const [
      [summaryRows],
      [statusRows],
      [recentOrders],
      [productItems],
      [users],
      [customers],
      [products],
      [contactLeads],
      [chartRawRows]
    ] = await Promise.all([
      db.execute(`
        SELECT
          COALESCE(SUM(CASE WHEN status != ? THEN total ELSE 0 END), 0) AS totalSales,
          COALESCE(SUM(CASE WHEN status != ? AND DATE(created_at) = CURDATE() THEN total ELSE 0 END), 0) AS todaySales,
          COALESCE(SUM(CASE WHEN status != ? AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN total ELSE 0 END), 0) AS monthSales,
          COALESCE(SUM(CASE WHEN status != ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN total ELSE 0 END), 0) AS weekSales,
          COUNT(*) AS totalOrders,
          SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS todayOrders,
          SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS monthOrders,
          SUM(CASE WHEN status IN ('pending', 'confirmed', 'processing') THEN 1 ELSE 0 END) AS pendingOrders,
          COALESCE(AVG(CASE WHEN status != ? THEN total END), 0) AS averageOrderValue
        FROM orders
      `, [CANCELLED, CANCELLED, CANCELLED, CANCELLED, CANCELLED]),

      db.execute(`
        SELECT status, COUNT(*) AS count, COALESCE(SUM(total), 0) AS revenue
        FROM orders
        GROUP BY status
        ORDER BY count DESC
      `),

      db.execute(`
        SELECT o.id, o.orderNumber, o.total, o.status, o.created_at,
               c.firstName, c.lastName, c.email
        FROM orders o
        LEFT JOIN customers c ON c.id = o.customerId
        ORDER BY o.created_at DESC
        LIMIT 10
      `),

      db.execute(`SELECT items FROM orders WHERE status != ?`, [CANCELLED]),

      db.execute(`SELECT COUNT(*) AS row_count FROM users`),
      db.execute(`SELECT COUNT(*) AS row_count FROM customers`),
      db.execute(`SELECT COUNT(*) AS row_count FROM products WHERE isActive = 1`),
      db.execute(`SELECT COUNT(*) AS row_count FROM contact_leads`),

      chartPeriod === 'year'
        ? db.execute(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
                   COALESCE(SUM(total), 0) AS sales,
                   COUNT(*) AS orders
            FROM orders
            WHERE status != ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month
          `, [CANCELLED])
        : db.execute(`
            SELECT DATE(created_at) AS date,
                   COALESCE(SUM(total), 0) AS sales,
                   COUNT(*) AS orders
            FROM orders
            WHERE status != ?
              AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
          `, [CANCELLED, chartPeriod === 'week' ? 6 : 29])
    ]);

    const s = summaryRows[0];
    const salesChart = chartPeriod === 'year'
      ? fillMonthlyChart(chartRawRows, 12)
      : fillDailyChart(chartRawRows, chartPeriod === 'week' ? 7 : 30);

    return {
      status: 'success',
      data: {
        summary: {
          totalSales: toNum(s.totalSales),
          todaySales: toNum(s.todaySales),
          monthSales: toNum(s.monthSales),
          weekSales: toNum(s.weekSales),
          totalOrders: Number(s.totalOrders) || 0,
          todayOrders: Number(s.todayOrders) || 0,
          monthOrders: Number(s.monthOrders) || 0,
          pendingOrders: Number(s.pendingOrders) || 0,
          averageOrderValue: Math.round(toNum(s.averageOrderValue) * 100) / 100,
          totalUsers: Number(users[0]?.row_count) || 0,
          totalCustomers: Number(customers[0]?.row_count) || 0,
          totalProducts: Number(products[0]?.row_count) || 0,
          contactLeads: Number(contactLeads[0]?.row_count) || 0
        },
        ordersByStatus: statusRows.map(r => ({
          status: r.status,
          count: Number(r.count) || 0,
          revenue: toNum(r.revenue)
        })),
        salesChart,
        recentOrders: recentOrders.map(o => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: toNum(o.total),
          status: o.status,
          createdAt: o.created_at,
          customerName: [o.firstName, o.lastName].filter(Boolean).join(' ') || 'Guest',
          email: o.email || ''
        })),
        topProducts: aggregateTopProducts(productItems)
      }
    };
  }
};

module.exports = Dashboard;
