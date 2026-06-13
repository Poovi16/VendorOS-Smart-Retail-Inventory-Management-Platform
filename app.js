/**
 * SP Pani Puri Shop Dashboard - Logic and State Engine
 */

// Global state variables
let state = {};
let currentActiveView = 'overview';
let selectedCustomerId = null;
let salesChartInstance = null;
let costDistributionChartInstance = null;
let incomeExpenseTrendChartInstance = null;

// Initial high-fidelity mock data
const initialMockData = {
  customers: [
    {
      id: 'cust-1',
      name: 'Rohan Sharma',
      phone: '9876543210',
      email: 'rohan.sharma@gmail.com',
      status: 'active',
      points: 180,
      reviews: [
        { id: 'rev-1', product: 'Pani Puri', rating: 5, comment: 'Best mint water and super crispy puris!', date: '2026-06-12' },
        { id: 'rev-2', product: 'Brownies', rating: 4, comment: 'Brownies were rich, but could be served warmer.', date: '2026-06-13' }
      ],
      orders: [
        { id: 'rec-101', date: '2026-06-11', items: [{ name: 'Pani Puri', qty: 2, price: 40 }, { name: 'Waffles', qty: 1, price: 90 }], total: 170 },
        { id: 'rec-104', date: '2026-06-13', items: [{ name: 'Masala Puri', qty: 1, price: 50 }, { name: 'Brownies', qty: 1, price: 120 }], total: 170 }
      ]
    },
    {
      id: 'cust-2',
      name: 'Priya Patel',
      phone: '9988776655',
      email: 'priya.patel@yahoo.com',
      status: 'active',
      points: 95,
      reviews: [
        { id: 'rev-3', product: 'Waffles', rating: 5, comment: 'Waffles with ice cream are to die for!', date: '2026-06-10' }
      ],
      orders: [
        { id: 'rec-102', date: '2026-06-10', items: [{ name: 'Waffles', qty: 1, price: 90 }], total: 90 }
      ]
    },
    {
      id: 'cust-3',
      name: 'Aditya Verma',
      phone: '9123456789',
      email: 'aditya.v@outlook.com',
      status: 'active',
      points: 310,
      reviews: [
        { id: 'rev-4', product: 'Masala Puri', rating: 5, comment: 'Perfect spicy masala paste and layout.', date: '2026-06-08' }
      ],
      orders: [
        { id: 'rec-103', date: '2026-06-08', items: [{ name: 'Masala Puri', qty: 4, price: 50 }, { name: 'Pani Puri', qty: 3, price: 40 }], total: 320 }
      ]
    }
  ],
  transactions: [
    { id: 'tx-1', date: '2026-06-08', category: 'Sales', type: 'income', amount: 320, description: 'Order rec-103 (Aditya Verma)', customerId: 'cust-3' },
    { id: 'tx-2', date: '2026-06-09', category: 'Rent', type: 'expense', amount: 8000, description: 'Shop Monthly Rent' },
    { id: 'tx-3', date: '2026-06-10', category: 'Sales', type: 'income', amount: 90, description: 'Order rec-102 (Priya Patel)', customerId: 'cust-2' },
    { id: 'tx-4', date: '2026-06-10', category: 'Raw Materials', type: 'expense', amount: 1500, description: 'Purchased Spices & Puri packet boxes' },
    { id: 'tx-5', date: '2026-06-11', category: 'Sales', type: 'income', amount: 170, description: 'Order rec-101 (Rohan Sharma)', customerId: 'cust-1' },
    { id: 'tx-6', date: '2026-06-11', category: 'Wages', type: 'expense', amount: 2500, description: 'Weekly staff wage payout' },
    { id: 'tx-7', date: '2026-06-12', category: 'Utilities', type: 'expense', amount: 1200, description: 'Electricity & water bill' },
    { id: 'tx-8', date: '2026-06-13', category: 'Sales', type: 'income', amount: 170, description: 'Order rec-104 (Rohan Sharma)', customerId: 'cust-1' },
    { id: 'tx-9', date: '2026-06-13', category: 'Raw Materials', type: 'expense', amount: 850, description: 'Order waffle batter & toppings' }
  ],
  inventory: [
    { id: 'inv-1', name: 'Puri packets', qty: 15, threshold: 20, unit: 'bags', supplierId: 'sup-1' },
    { id: 'inv-2', name: 'Masala spice paste', qty: 25, threshold: 10, unit: 'kg', supplierId: 'sup-1' },
    { id: 'inv-3', name: 'Waffle batter mix', qty: 8, threshold: 15, unit: 'kg', supplierId: 'sup-2' },
    { id: 'inv-4', name: 'Chocolate Brownies', qty: 30, threshold: 12, unit: 'pcs', supplierId: 'sup-3' },
    { id: 'inv-5', name: 'Premium Toppings', qty: 10, threshold: 5, unit: 'kg', supplierId: 'sup-2' },
    { id: 'inv-6', name: 'Mint Herb Water', qty: 45, threshold: 25, unit: 'liters', supplierId: 'sup-1' },
    { id: 'inv-7', name: 'Sweet Date Chutney', qty: 35, threshold: 15, unit: 'liters', supplierId: 'sup-1' }
  ],
  suppliers: [
    { id: 'sup-1', name: 'Spicy Street Vendors Ltd', item: 'Puri, Masala, Mint water, Chutney', contact: '+91 9898989898' },
    { id: 'sup-2', name: 'Deluxe Waffles & Flours Co', item: 'Waffle batter, Toppings', contact: '+91 8887776666' },
    { id: 'sup-3', name: 'Baker Delight Desserts', item: 'Brownies & cakes', contact: '+91 9777777777' }
  ],
  supplierOrders: [
    { id: 'so-1', date: '2026-06-05', supplierId: 'sup-1', itemId: 'inv-1', qty: 30, cost: 600 },
    { id: 'so-2', date: '2026-06-10', supplierId: 'sup-1', itemId: 'inv-2', qty: 10, cost: 900 },
    { id: 'so-3', date: '2026-06-13', supplierId: 'sup-2', itemId: 'inv-3', qty: 5, cost: 850 }
  ],
  employees: [
    { id: 'emp-1', name: 'Amit Kumar', role: 'Chef', wage: 160, phone: '9888111222', rating: 5 },
    { id: 'emp-2', name: 'Sarah Joseph', role: 'Server', wage: 110, phone: '9888333444', rating: 4 },
    { id: 'emp-3', name: 'Rahul Roy', role: 'Cashier', wage: 120, phone: '9888555666', rating: 4 },
    { id: 'emp-4', name: 'Ravi Teja', role: 'Manager', wage: 220, phone: '9888777888', rating: 5 }
  ],
  shifts: [
    { id: 'sh-1', employeeId: 'emp-1', day: 'Mon', slot: 'Morning' },
    { id: 'sh-2', employeeId: 'emp-2', day: 'Mon', slot: 'Morning' },
    { id: 'sh-3', employeeId: 'emp-3', day: 'Mon', slot: 'Evening' },
    { id: 'sh-4', employeeId: 'emp-1', day: 'Tue', slot: 'Morning' },
    { id: 'sh-5', employeeId: 'emp-2', day: 'Wed', slot: 'Evening' },
    { id: 'sh-6', employeeId: 'emp-4', day: 'Fri', slot: 'Evening' },
    { id: 'sh-7', employeeId: 'emp-3', day: 'Sat', slot: 'Morning' },
    { id: 'sh-8', employeeId: 'emp-1', day: 'Sat', slot: 'Evening' },
    { id: 'sh-9', employeeId: 'emp-2', day: 'Sun', slot: 'Evening' }
  ]
};

// ----------------- STATE & STORAGE LIFECYCLE -----------------

function loadState() {
  const saved = localStorage.getItem('sp_panipuri_state');
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved state', e);
      state = { ...initialMockData };
    }
  } else {
    state = { ...initialMockData };
    saveState();
  }
}

function saveState() {
  localStorage.setItem('sp_panipuri_state', JSON.stringify(state));
}

// ----------------- VIEW SWITCHER -----------------

function switchView(viewName) {
  currentActiveView = viewName;
  
  // Update view menu active classes
  document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Swap active screen view
  document.querySelectorAll('.app-view').forEach(view => {
    if (view.id === `view-${viewName}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Sidebar mobile slideaway
  document.getElementById('sidebar').classList.remove('active');

  // Update Header title
  const titleEl = document.getElementById('view-title');
  const subtitleEl = document.getElementById('view-subtitle');

  if (viewName === 'overview') {
    titleEl.textContent = 'Overview';
    subtitleEl.textContent = 'Quick metrics and sales performance overview.';
    renderOverview();
  } else if (viewName === 'customers') {
    titleEl.textContent = 'Customer Directory';
    subtitleEl.textContent = 'Manage loyalty points, feedback ratings and client database.';
    renderCustomers();
  } else if (viewName === 'finance') {
    titleEl.textContent = 'Finance Management';
    subtitleEl.textContent = 'Keep track of income ledger, operating costs, and generate invoices.';
    renderFinance();
  } else if (viewName === 'inventory') {
    titleEl.textContent = 'Inventory Control';
    subtitleEl.textContent = 'Ingredient catalog stock levels, supplier orders, and safety warning indicators.';
    renderInventory();
  } else if (viewName === 'employees') {
    titleEl.textContent = 'Employees & Scheduling';
    subtitleEl.textContent = 'Weekly shift timetable, hourly wages tracking and performance scorecard.';
    renderEmployees();
  }

  lucide.createIcons();
}

// ----------------- MODAL ACTIONS -----------------

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // For feedback modal, populating the customers dropdown list
    if (modalId === 'modal-add-review') {
      populateCustomerSelect('review-customer-select');
    }
    // For transaction modal, populating the customers dropdown list
    if (modalId === 'modal-add-transaction') {
      populateCustomerSelect('trans-customer');
      toggleTransactionFields();
      calculateSaleTotal();
    }
    // For restock modal, populating catalog items
    if (modalId === 'modal-restock-inventory') {
      populateInventorySelect('restock-item');
      populateSupplierSelect('restock-supplier');
    }
    // For shift scheduling modal
    if (modalId === 'modal-manage-shift') {
      populateEmployeeSelect('shift-emp-select');
    }
    lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// ----------------- DROPDOWN POPULATORS -----------------

function populateCustomerSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    // Preserve default guest/none options if they exist
    const hasNone = select.querySelector('option[value=""]') || select.querySelector('option[value="Guest"]');
    select.innerHTML = '';
    if (hasNone) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Guest (Anonymous)';
      select.appendChild(option);
    }
    state.customers.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = `${c.name} (${c.phone})`;
      select.appendChild(option);
    });
  }
}

function populateInventorySelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '';
    state.inventory.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${item.name} (${item.qty} ${item.unit})`;
      select.appendChild(option);
    });
  }
}

function populateSupplierSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '<option value="">None (Internal adjustment)</option>';
    state.suppliers.forEach(sup => {
      const option = document.createElement('option');
      option.value = sup.id;
      option.textContent = sup.name;
      select.appendChild(option);
    });
  }
}

function populateEmployeeSelect(selectId) {
  const select = document.getElementById(selectId);
  if (select) {
    select.innerHTML = '';
    state.employees.forEach(emp => {
      const option = document.createElement('option');
      option.value = emp.id;
      option.textContent = `${emp.name} (${emp.role})`;
      select.appendChild(option);
    });
  }
}

// ----------------- OVERVIEW VIEW RENDERER -----------------

function renderOverview() {
  // Compute overview stats card
  const grossRev = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const operCosts = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = grossRev - operCosts;

  const salesTx = state.transactions.filter(t => t.type === 'income' && t.category === 'Sales');
  const avgOrder = salesTx.length > 0 ? (grossRev / salesTx.length) : 0;

  document.getElementById('stat-gross-revenue').textContent = `₹${grossRev.toLocaleString('en-IN')}`;
  document.getElementById('stat-net-profit').textContent = `₹${netProfit.toLocaleString('en-IN')}`;
  
  // Style net profit based on +/- values
  const netProfitEl = document.getElementById('stat-net-profit');
  if (netProfit < 0) {
    netProfitEl.style.color = 'var(--color-danger)';
  } else {
    netProfitEl.style.color = 'var(--text-primary)';
  }

  document.getElementById('stat-operating-costs').textContent = `₹${operCosts.toLocaleString('en-IN')}`;
  document.getElementById('stat-avg-order').textContent = `₹${Math.round(avgOrder).toLocaleString('en-IN')}`;

  // Evaluate Low Stock Alerts
  const lowStockItems = state.inventory.filter(item => item.qty <= item.threshold);
  const banner = document.getElementById('low-stock-banner');
  const warningsList = document.getElementById('quick-stock-warnings');
  
  if (lowStockItems.length > 0) {
    banner.style.display = 'flex';
    document.getElementById('low-stock-message').textContent = `Alert: ${lowStockItems.length} ingredients are running below low-stock safety thresholds!`;
    
    warningsList.innerHTML = '';
    lowStockItems.slice(0, 3).forEach(item => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '10px 14px';
      li.style.background = 'rgba(239, 68, 68, 0.05)';
      li.style.border = '1px solid rgba(239, 68, 68, 0.15)';
      li.style.borderRadius = '10px';
      li.style.fontSize = '13px';
      li.innerHTML = `
        <span style="color: #FCA5A5; font-weight: 500;">${item.name}</span>
        <span class="badge badge-danger">${item.qty} ${item.unit} left</span>
      `;
      warningsList.appendChild(li);
    });
  } else {
    banner.style.display = 'none';
    warningsList.innerHTML = '<li style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px 0;">All ingredient levels are in healthy levels.</li>';
  }

  // Render recent 5 transactions
  const overviewTbody = document.getElementById('overview-transactions-tbody');
  overviewTbody.innerHTML = '';
  
  const sortedTx = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  sortedTx.forEach(tx => {
    const tr = document.createElement('tr');
    const isIncome = tx.type === 'income';
    tr.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.category}</td>
      <td><span class="badge ${isIncome ? 'badge-success' : 'badge-danger'}">${tx.type}</span></td>
      <td style="font-weight: 600; color: ${isIncome ? 'var(--color-success)' : 'var(--color-danger)'};">
        ${isIncome ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN')}
      </td>
      <td>${tx.description}</td>
    `;
    overviewTbody.appendChild(tr);
  });

  // Render sales trends line chart
  renderSalesTrendChart();
}

function renderSalesTrendChart() {
  const ctx = document.getElementById('overviewSalesChart');
  if (!ctx) return;

  // Clear previous instance
  if (salesChartInstance) {
    salesChartInstance.destroy();
  }

  // Group sales income by date
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const dailyTotals = last7Days.map(date => {
    return state.transactions
      .filter(t => t.type === 'income' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7Days.map(d => {
        const parts = d.split('-');
        return `${parts[2]}/${parts[1]}`;
      }),
      datasets: [{
        label: 'Gross Sales (₹)',
        data: dailyTotals,
        borderColor: '#3F4EFF',
        backgroundColor: 'rgba(63, 78, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3F4EFF',
        pointBorderColor: '#FFFFFF',
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#A1A1AA',
            font: { family: 'Plus Jakarta Sans' }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#A1A1AA',
            font: { family: 'Plus Jakarta Sans' }
          }
        }
      }
    }
  });
}

// ----------------- CUSTOMER VIEW RENDERER -----------------

function renderCustomers() {
  renderCustomersList();
  
  if (selectedCustomerId) {
    inspectCustomer(selectedCustomerId);
  } else {
    document.getElementById('inspector-placeholder').style.display = 'block';
    document.getElementById('inspector-content').style.display = 'none';
  }
}

function renderCustomersList() {
  const tbody = document.getElementById('customers-list-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const searchVal = document.getElementById('customer-search').value.toLowerCase();

  const filtered = state.customers.filter(c => {
    return c.name.toLowerCase().includes(searchVal) ||
           c.phone.includes(searchVal) ||
           (c.email && c.email.toLowerCase().includes(searchVal));
  });

  filtered.forEach(c => {
    const tr = document.createElement('tr');
    if (c.id === selectedCustomerId) {
      tr.style.background = 'rgba(63, 78, 255, 0.1)';
      tr.style.borderColor = 'var(--accent-color)';
    }
    
    tr.innerHTML = `
      <td>
        <div style="font-weight: 600;">${c.name}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${c.phone}</div>
      </td>
      <td style="font-weight: 700; text-align: right; color: var(--accent-color);">${c.points} pts</td>
    `;

    tr.addEventListener('click', () => {
      selectedCustomerId = c.id;
      inspectCustomer(c.id);
      renderCustomersList(); // Refresh highlighting
    });

    tbody.appendChild(tr);
  });
}

function getLoyaltyTier(points) {
  if (points >= 300) return { name: 'Platinum', class: 'tier-platinum' };
  if (points >= 150) return { name: 'Gold', class: 'tier-gold' };
  if (points >= 50) return { name: 'Silver', class: 'tier-silver' };
  return { name: 'Bronze', class: 'tier-bronze' };
}

function inspectCustomer(id) {
  const customer = state.customers.find(c => c.id === id);
  if (!customer) return;

  document.getElementById('inspector-placeholder').style.display = 'none';
  document.getElementById('inspector-content').style.display = 'block';

  // Details fields
  const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('inspector-avatar').textContent = initials;
  document.getElementById('inspector-name').textContent = customer.name;
  document.getElementById('inspector-email').textContent = customer.email || 'No Email';
  document.getElementById('inspector-phone').textContent = customer.phone;

  // Tier setup
  const tier = getLoyaltyTier(customer.points);
  const tierEl = document.getElementById('inspector-tier');
  tierEl.className = `tier-badge ${tier.class}`;
  tierEl.innerHTML = `<i data-lucide="award"></i> ${tier.name}`;
  
  document.getElementById('inspector-points').textContent = `${customer.points} pts`;

  const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
  document.getElementById('inspector-purchases-value').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;

  // Log Feedback link hook
  const logBtn = document.getElementById('btn-inspector-review');
  logBtn.onclick = () => {
    openModal('modal-add-review');
    const select = document.getElementById('review-customer-select');
    if (select) select.value = customer.id;
  };

  // Render Reviews list
  const reviewsList = document.getElementById('inspector-reviews-list');
  reviewsList.innerHTML = '';
  if (customer.reviews.length === 0) {
    reviewsList.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">No feedback logs recorded yet.</p>';
  } else {
    customer.reviews.forEach(r => {
      const item = document.createElement('div');
      item.className = 'review-item';
      
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<i data-lucide="star" style="width: 12px; height: 12px; fill: ${i <= r.rating ? '#F59E0B' : 'transparent'}; color: ${i <= r.rating ? '#F59E0B' : 'var(--text-muted)'};"></i>`;
      }

      item.innerHTML = `
        <div class="review-meta">
          <strong style="color: var(--accent-hover);">${r.product}</strong>
          <span style="color: var(--text-muted);">${r.date}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
          ${stars}
        </div>
        <p style="font-size: 13px; color: var(--text-primary); font-style: italic;">"${r.comment}"</p>
      `;
      reviewsList.appendChild(item);
    });
  }

  // Render Order histories
  const ordersTbody = document.getElementById('inspector-orders-tbody');
  ordersTbody.innerHTML = '';
  if (customer.orders.length === 0) {
    ordersTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No orders history.</td></tr>';
  } else {
    customer.orders.forEach(order => {
      const tr = document.createElement('tr');
      const itemsList = order.items.map(i => `${i.name} (${i.qty})`).join(', ');
      tr.innerHTML = `
        <td>${order.date}</td>
        <td style="font-family: monospace;">${order.id}</td>
        <td>${itemsList}</td>
        <td style="font-weight: 600;">₹${order.total}</td>
      `;
      ordersTbody.appendChild(tr);
    });
  }
  lucide.createIcons();
}

// ----------------- FINANCE VIEW RENDERER -----------------

function renderFinance() {
  renderFinanceLedger();
  renderFinanceCharts();
}

function renderFinanceLedger() {
  const tbody = document.getElementById('finance-ledger-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const searchVal = document.getElementById('finance-search').value.toLowerCase();
  const filterType = document.getElementById('finance-filter-type').value;

  const filtered = state.transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
    const matchType = filterType === 'all' || t.type === filterType;
    return matchSearch && matchType;
  });

  // Sort descending
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  filtered.forEach(tx => {
    const tr = document.createElement('tr');
    const isIncome = tx.type === 'income';
    
    // Receipt action link
    const receiptCol = isIncome 
      ? `<button class="btn btn-secondary btn-small" onclick="generateReceiptModal('${tx.id}')"><i data-lucide="printer" style="width: 14px; height: 14px;"></i> Receipt</button>`
      : `<span style="color: var(--text-muted); font-size: 11px;">N/A (Expense)</span>`;

    tr.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.category}</td>
      <td><span class="badge ${isIncome ? 'badge-success' : 'badge-danger'}">${tx.type}</span></td>
      <td style="font-weight: 600; color: ${isIncome ? 'var(--color-success)' : 'var(--color-danger)'};">
        ${isIncome ? '+' : '-'}₹${tx.amount.toLocaleString('en-IN')}
      </td>
      <td>${tx.description}</td>
      <td>${receiptCol}</td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

function renderFinanceCharts() {
  const costCtx = document.getElementById('financeCostDistributionChart');
  const trendCtx = document.getElementById('financeIncomeExpenseTrendChart');

  if (!costCtx || !trendCtx) return;

  // 1. Costs breakdown
  if (costDistributionChartInstance) {
    costDistributionChartInstance.destroy();
  }

  const expenseCategories = ['Rent', 'Raw Materials', 'Wages', 'Utilities'];
  const expenseValues = expenseCategories.map(cat => {
    return state.transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  costDistributionChartInstance = new Chart(costCtx, {
    type: 'doughnut',
    data: {
      labels: expenseCategories,
      datasets: [{
        data: expenseValues,
        backgroundColor: ['#EF4444', '#F59E0B', '#3F4EFF', '#3B82F6'],
        borderWidth: 1,
        borderColor: '#09090b'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#A1A1AA',
            font: { family: 'Plus Jakarta Sans', size: 10 }
          }
        }
      }
    }
  });

  // 2. Trend analytics
  if (incomeExpenseTrendChartInstance) {
    incomeExpenseTrendChartInstance.destroy();
  }

  // Get dates mapping of last 5 days
  const last5Days = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last5Days.push(d.toISOString().split('T')[0]);
  }

  const incomeTrend = last5Days.map(date => {
    return state.transactions
      .filter(t => t.type === 'income' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const expenseTrend = last5Days.map(date => {
    return state.transactions
      .filter(t => t.type === 'expense' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  incomeExpenseTrendChartInstance = new Chart(trendCtx, {
    type: 'bar',
    data: {
      labels: last5Days.map(d => {
        const parts = d.split('-');
        return `${parts[2]}/${parts[1]}`;
      }),
      datasets: [
        {
          label: 'Income',
          data: incomeTrend,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderColor: '#10B981',
          borderWidth: 1
        },
        {
          label: 'Expense',
          data: expenseTrend,
          backgroundColor: 'rgba(239, 68, 68, 0.85)',
          borderColor: '#EF4444',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#A1A1AA', font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#A1A1AA', font: { size: 10 } }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#A1A1AA',
            font: { family: 'Plus Jakarta Sans', size: 10 }
          }
        }
      }
    }
  });
}

function generateReceiptModal(txId) {
  const transaction = state.transactions.find(t => t.id === txId);
  if (!transaction) return;

  const content = document.getElementById('invoice-receipt-content');
  
  // Try to find customer name
  let custName = 'Guest Customer';
  if (transaction.customerId) {
    const customer = state.customers.find(c => c.id === transaction.customerId);
    if (customer) {
      custName = customer.name;
    }
  }

  // Find linked invoice details from order history of client
  let itemsRows = '';
  let subtotal = transaction.amount;
  let tax = Math.round(transaction.amount * 0.05); // 5% CGST/SGST mock
  let finaltotal = subtotal + tax;

  // Attempt to load order items if populated
  if (transaction.customerId) {
    const customer = state.customers.find(c => c.id === transaction.customerId);
    if (customer) {
      // Find matching order based on amount and date
      const matchOrder = customer.orders.find(o => o.total === transaction.amount && o.date === transaction.date);
      if (matchOrder) {
        subtotal = 0;
        matchOrder.items.forEach(item => {
          subtotal += item.price * item.qty;
          itemsRows += `
            <div class="receipt-item-row">
              <span>${item.name} x${item.qty}</span>
              <span>₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          `;
        });
        tax = Math.round(subtotal * 0.05);
        finaltotal = subtotal + tax;
      }
    }
  }

  // If no detailed order matches, show default simple item
  if (!itemsRows) {
    itemsRows = `
      <div class="receipt-item-row">
        <span>Standard Food & Beverage Service</span>
        <span>₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="receipt-header">
      <h4>SP PANI PURI SHOP</h4>
      <p style="font-size: 12px; color: var(--text-secondary);">Premium Street Food & Desserts</p>
      <p style="font-size: 11px; margin-top: 5px;">Tx ID: ${transaction.id}</p>
      <p style="font-size: 11px;">Date: ${transaction.date}</p>
    </div>
    
    <div style="margin-bottom: 15px; font-size: 13px;">
      <strong>Customer:</strong> ${custName}
    </div>

    <div class="receipt-items-list">
      ${itemsRows}
    </div>

    <div class="receipt-summary">
      <div class="receipt-item-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div class="receipt-item-row" style="font-size: 12px; color: var(--text-secondary);">
        <span>GST (5%)</span>
        <span>₹${tax.toLocaleString('en-IN')}</span>
      </div>
      <div class="receipt-summary-row" style="margin-top: 10px;">
        <span>TOTAL DUE</span>
        <span style="color: var(--accent-hover);">₹${finaltotal.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div style="text-align: center; margin-top: 25px; font-size: 11px; color: var(--text-muted);">
      Thank you for dining with us!<br>
      Earn 1 Loyalty point per ₹1 Spent.
    </div>
  `;

  openModal('modal-receipt');
}

function printReceipt() {
  alert('Invoice receipt printing triggered (Mock action). Saved receipt to system files.');
  closeModal('modal-receipt');
}

// ----------------- INVENTORY VIEW RENDERER -----------------

function renderInventory() {
  renderInventoryCatalog();
  renderSuppliers();
}

function renderInventoryCatalog() {
  const grid = document.getElementById('inventory-catalog-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const searchVal = document.getElementById('inventory-search').value.toLowerCase();

  const filtered = state.inventory.filter(item => item.name.toLowerCase().includes(searchVal));

  filtered.forEach(item => {
    const isLow = item.qty <= item.threshold;
    
    // Calculate progress percentage (max scale set to twice the safety threshold)
    const maxScale = item.threshold * 2.5;
    const pct = Math.min((item.qty / maxScale) * 100, 100);
    
    // Choose progress color class
    let barColorClass = 'full';
    if (item.qty <= item.threshold) {
      barColorClass = 'low';
    } else if (item.qty <= item.threshold * 1.5) {
      barColorClass = 'medium';
    }

    const card = document.createElement('div');
    card.className = `glass-panel inventory-card ${isLow ? 'low-stock' : ''}`;
    
    card.innerHTML = `
      <div class="glass-panel-content">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <h3 style="font-size: 18px; margin-bottom: 4px;">${item.name}</h3>
            <span style="color: var(--text-muted); font-size: 12px;">Min Safety Level: ${item.threshold} ${item.unit}</span>
          </div>
          <span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">${isLow ? 'Low Stock' : 'In Stock'}</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 15px;">
          <span style="font-size: 28px; font-weight: 800; font-family: var(--font-headlines);">${item.qty}</span>
          <span style="color: var(--text-secondary); font-size: 14px;">${item.unit}</span>
        </div>

        <div class="inventory-progress-bar">
          <div class="inventory-progress-fill ${barColorClass}" style="width: ${pct}%;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);">
          <span>Capacity Usage</span>
          <span>${Math.round(pct)}%</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderSuppliers() {
  const supTbody = document.getElementById('suppliers-tbody');
  const supOrdersTbody = document.getElementById('supplier-orders-tbody');

  if (supTbody) {
    supTbody.innerHTML = '';
    state.suppliers.forEach(sup => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${sup.name}</strong></td>
        <td>${sup.item}</td>
        <td>${sup.contact}</td>
      `;
      supTbody.appendChild(tr);
    });
  }

  if (supOrdersTbody) {
    supOrdersTbody.innerHTML = '';
    
    // Sort orders descending
    const sortedOrders = [...state.supplierOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(so => {
      const supplier = state.suppliers.find(s => s.id === so.supplierId);
      const inventoryItem = state.inventory.find(i => i.id === so.itemId);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${so.date}</td>
        <td>${supplier ? supplier.name : 'Unknown Vendor'}</td>
        <td>${inventoryItem ? inventoryItem.name : 'Unknown Item'}</td>
        <td>${so.qty}</td>
        <td style="font-weight: 600; color: var(--color-danger);">₹${so.cost}</td>
      `;
      supOrdersTbody.appendChild(tr);
    });
  }
}

// ----------------- EMPLOYEES VIEW RENDERER -----------------

function renderEmployees() {
  renderEmployeeDirectory();
  renderPayrollCalculator();
  renderShiftScheduler();
}

function renderEmployeeDirectory() {
  const tbody = document.getElementById('employee-directory-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.employees.forEach(emp => {
    const tr = document.createElement('tr');
    
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<i data-lucide="star" style="width: 13px; height: 13px; fill: ${i <= emp.rating ? '#F59E0B' : 'transparent'}; color: ${i <= emp.rating ? '#F59E0B' : 'var(--text-muted)'};"></i>`;
    }

    tr.innerHTML = `
      <td><strong>${emp.name}</strong><br><span style="font-size: 11px; color: var(--text-muted);">${emp.phone}</span></td>
      <td><span class="badge badge-info">${emp.role}</span></td>
      <td>₹${emp.wage}/hr</td>
      <td>
        <div style="display: flex; gap: 2px;">${stars}</div>
      </td>
      <td>
        <button class="btn btn-danger btn-small" onclick="deleteEmployee('${emp.id}')">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

function renderPayrollCalculator() {
  const tbody = document.getElementById('employee-payroll-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  let totalPayrollCost = 0;

  state.employees.forEach(emp => {
    // Count shifts this employee works this week. Morning/Evening shift is 6 hrs.
    const employeeShiftsCount = state.shifts.filter(s => s.employeeId === emp.id).length;
    const hoursWorked = employeeShiftsCount * 6;
    const weeklyPayout = hoursWorked * emp.wage;
    totalPayrollCost += weeklyPayout;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.name} (${emp.role})</td>
      <td>₹${emp.wage}/hr</td>
      <td>${hoursWorked} hrs (${employeeShiftsCount} shifts)</td>
      <td style="font-weight: 600; color: var(--color-success);">₹${weeklyPayout.toLocaleString('en-IN')}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('payroll-total-cost').textContent = `₹${totalPayrollCost.toLocaleString('en-IN')}`;
}

function renderShiftScheduler() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = ['Morning', 'Evening'];

  // Clear all cell containers
  days.forEach(day => {
    slots.forEach(slot => {
      const cell = document.getElementById(`shift-cell-${day}-${slot}`);
      if (cell) cell.innerHTML = '';
    });
  });

  // Populate shift cards into the grids
  state.shifts.forEach(shift => {
    const employee = state.employees.find(e => e.id === shift.employeeId);
    if (!employee) return;

    const cell = document.getElementById(`shift-cell-${shift.day}-${shift.slot}`);
    if (cell) {
      const card = document.createElement('div');
      card.className = 'shift-card';
      card.innerHTML = `
        <div class="shift-employee-name">${employee.name}</div>
        <div class="shift-time">${employee.role}</div>
        <div style="text-align: right; margin-top: 4px;">
          <i data-lucide="trash-2" style="width: 10px; height: 10px; color: var(--color-danger); cursor: pointer;" onclick="deleteShift('${shift.id}', event)"></i>
        </div>
      `;
      cell.appendChild(card);
    }
  });
  lucide.createIcons();
}

// ----------------- STATE MODIFIERS -----------------

function handleCustomerSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const email = document.getElementById('cust-email').value;
  const status = document.getElementById('cust-status').value;

  const newCustomer = {
    id: `cust-${Date.now()}`,
    name,
    phone,
    email,
    status,
    points: 0,
    reviews: [],
    orders: []
  };

  state.customers.push(newCustomer);
  saveState();
  closeModal('modal-add-customer');
  
  // Clear form
  document.getElementById('form-add-customer').reset();
  
  // Refresh view
  renderCustomersList();
  alert('Customer added successfully!');
}

function handleReviewSubmit(e) {
  e.preventDefault();
  const customerId = document.getElementById('review-customer-select').value;
  const product = document.getElementById('review-product').value;
  const rating = parseInt(document.getElementById('review-rating-value').value);
  const comment = document.getElementById('review-comment').value;

  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;

  const newReview = {
    id: `rev-${Date.now()}`,
    product,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  customer.reviews.push(newReview);
  
  // Add loyalty points reward for rating (15 points per feedback log)
  customer.points += 15;

  saveState();
  closeModal('modal-add-review');
  
  // Reset form
  document.getElementById('form-add-review').reset();
  resetStarsSelector();

  // Refresh view
  if (currentActiveView === 'customers') {
    inspectCustomer(customerId);
    renderCustomersList();
  } else if (currentActiveView === 'overview') {
    renderOverview();
  }
  
  alert(`Feedback saved successfully! ${customer.name} earned 15 Loyalty points.`);
}

function toggleTransactionFields() {
  const transType = document.getElementById('trans-type').value;
  const incomeGroup = document.getElementById('trans-income-group');
  const catSelect = document.getElementById('trans-category');

  if (transType === 'income') {
    incomeGroup.style.display = 'block';
    
    // Set matching income categories
    catSelect.innerHTML = `
      <option value="Sales">Sales</option>
      <option value="Other Income">Other Income</option>
    `;
    calculateSaleTotal();
  } else {
    incomeGroup.style.display = 'none';
    
    // Set matching expense categories
    catSelect.innerHTML = `
      <option value="Rent">Rent</option>
      <option value="Raw Materials">Raw Materials</option>
      <option value="Wages">Wages</option>
      <option value="Utilities">Utilities</option>
    `;
    document.getElementById('trans-amount').value = '';
    document.getElementById('trans-amount').readOnly = false;
  }
}

function calculateSaleTotal() {
  const checkboxes = document.querySelectorAll('.menu-item-cb');
  let sum = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const price = parseFloat(cb.getAttribute('data-price'));
      const idPart = cb.id.replace('item-', '');
      const qtyInput = document.getElementById(`qty-${idPart}`);
      const qty = qtyInput ? parseInt(qtyInput.value) : 1;
      sum += price * qty;
    }
  });

  const amountInput = document.getElementById('trans-amount');
  const transType = document.getElementById('trans-type').value;

  if (transType === 'income') {
    amountInput.value = sum;
    amountInput.readOnly = true; // Auto-calculated based on items selection
  }
}

function handleTransactionSubmit(e) {
  e.preventDefault();
  const type = document.getElementById('trans-type').value;
  const category = document.getElementById('trans-category').value;
  const amount = parseFloat(document.getElementById('trans-amount').value);
  const date = document.getElementById('trans-date').value;
  const description = document.getElementById('trans-desc').value;
  const customerId = document.getElementById('trans-customer').value;

  if (isNaN(amount) || amount <= 0) {
    alert('Please specify a valid transaction amount.');
    return;
  }

  const transactionId = `tx-${Date.now()}`;
  
  // If income is selected, deduct quantities of items ordered from stock catalogs
  if (type === 'income') {
    const checkboxes = document.querySelectorAll('.menu-item-cb');
    const itemsPurchased = [];
    
    checkboxes.forEach(cb => {
      if (cb.checked) {
        const pName = cb.value;
        const pPrice = parseFloat(cb.getAttribute('data-price'));
        const idPart = cb.id.replace('item-', '');
        const qtyVal = parseInt(document.getElementById(`qty-${idPart}`).value);
        
        itemsPurchased.push({ name: pName, qty: qtyVal, price: pPrice });

        // Deduct raw ingredients from inventory catalog
        deductIngredientStocksForMenuItem(pName, qtyVal);
      }
    });

    // Save order history details for linked customer
    if (customerId) {
      const customer = state.customers.find(c => c.id === customerId);
      if (customer) {
        const orderReceiptId = `rec-${Date.now().toString().slice(-4)}`;
        customer.orders.push({
          id: orderReceiptId,
          date,
          items: itemsPurchased,
          total: amount
        });

        // Earn loyalty points (1 point per Rupee Spent)
        customer.points += Math.round(amount);
      }
    }
  }

  const newTx = {
    id: transactionId,
    date,
    category,
    type,
    amount,
    description: description || (type === 'income' ? `Food Order Payout` : `Business Cost`),
    customerId: customerId || null
  };

  state.transactions.push(newTx);
  saveState();
  closeModal('modal-add-transaction');

  // Reset Form
  document.getElementById('form-add-transaction').reset();
  
  // Refresh View
  if (currentActiveView === 'overview') {
    renderOverview();
  } else if (currentActiveView === 'finance') {
    renderFinance();
  } else if (currentActiveView === 'customers') {
    renderCustomers();
  }

  alert(`Transaction successfully saved!`);
}

function deductIngredientStocksForMenuItem(menuName, qty) {
  // Deduct inventory items mapping
  if (menuName === 'Pani Puri') {
    const puri = state.inventory.find(i => i.name === 'Puri packets');
    const water = state.inventory.find(i => i.name === 'Mint Herb Water');
    if (puri) puri.qty = Math.max(0, puri.qty - (qty * 0.1)); // 1 plate is 1/10th of a pack
    if (water) water.qty = Math.max(0, water.qty - (qty * 0.5)); // 0.5L water
  } else if (menuName === 'Masala Puri') {
    const masala = state.inventory.find(i => i.name === 'Masala spice paste');
    if (masala) masala.qty = Math.max(0, masala.qty - (qty * 0.2));
  } else if (menuName === 'Waffles') {
    const batter = state.inventory.find(i => i.name === 'Waffle batter mix');
    const toppings = state.inventory.find(i => i.name === 'Premium Toppings');
    if (batter) batter.qty = Math.max(0, batter.qty - (qty * 0.3));
    if (toppings) toppings.qty = Math.max(0, toppings.qty - (qty * 0.1));
  } else if (menuName === 'Brownies') {
    const brownies = state.inventory.find(i => i.name === 'Chocolate Brownies');
    if (brownies) brownies.qty = Math.max(0, brownies.qty - qty);
  }
}

function handleRestockSubmit(e) {
  e.preventDefault();
  const itemId = document.getElementById('restock-item').value;
  const action = document.getElementById('restock-action').value;
  const qtyVal = parseFloat(document.getElementById('restock-qty').value);
  const supplierId = document.getElementById('restock-supplier').value;
  const costVal = parseFloat(document.getElementById('restock-cost').value);

  const item = state.inventory.find(i => i.id === itemId);
  if (!item) return;

  if (action === 'add') {
    item.qty += qtyVal;
    
    // Log supplier transaction if linked to vendor and cost > 0
    if (supplierId && costVal > 0) {
      const newSupplierOrderId = `so-${Date.now()}`;
      state.supplierOrders.push({
        id: newSupplierOrderId,
        date: new Date().toISOString().split('T')[0],
        supplierId,
        itemId,
        qty: qtyVal,
        cost: costVal
      });

      // Create transaction ledger outflow entry
      state.transactions.push({
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        category: 'Raw Materials',
        type: 'expense',
        amount: costVal,
        description: `Purchased ${qtyVal} ${item.unit} of ${item.name}`
      });
    }
  } else {
    item.qty = Math.max(0, item.qty - qtyVal);
  }

  saveState();
  closeModal('modal-restock-inventory');
  document.getElementById('form-restock').reset();
  
  if (currentActiveView === 'inventory') {
    renderInventory();
  } else if (currentActiveView === 'overview') {
    renderOverview();
  }

  alert(`Stock levels updated successfully!`);
}

function handleSupplierSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('sup-name').value;
  const item = document.getElementById('sup-item').value;
  const contact = document.getElementById('sup-contact').value;

  const newSupplier = {
    id: `sup-${Date.now()}`,
    name,
    item,
    contact
  };

  state.suppliers.push(newSupplier);
  saveState();
  closeModal('modal-add-supplier');
  document.getElementById('form-add-supplier').reset();

  if (currentActiveView === 'inventory') {
    renderInventory();
  }

  alert(`Supplier Vendor ${name} successfully registered.`);
}

function handleEmployeeSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('emp-name').value;
  const role = document.getElementById('emp-role').value;
  const wage = parseFloat(document.getElementById('emp-wage').value);
  const phone = document.getElementById('emp-phone').value;
  const rating = parseInt(document.getElementById('emp-rating').value);

  const newEmp = {
    id: `emp-${Date.now()}`,
    name,
    role,
    wage,
    phone,
    rating
  };

  state.employees.push(newEmp);
  saveState();
  closeModal('modal-add-employee');
  document.getElementById('form-add-employee').reset();

  if (currentActiveView === 'employees') {
    renderEmployees();
  }

  alert(`Employee ${name} added successfully!`);
}

function deleteEmployee(empId) {
  if (confirm('Are you sure you want to remove this employee? Doing so will remove scheduled shifts.')) {
    state.employees = state.employees.filter(e => e.id !== empId);
    state.shifts = state.shifts.filter(s => s.employeeId !== empId);
    saveState();
    renderEmployees();
  }
}

function handleShiftSubmit(e) {
  e.preventDefault();
  const employeeId = document.getElementById('shift-emp-select').value;
  const day = document.getElementById('shift-day').value;
  const slot = document.getElementById('shift-time-slot').value;

  // Check if shift slot is already allocated to this employee
  const exists = state.shifts.find(s => s.employeeId === employeeId && s.day === day && s.slot === slot);
  if (exists) {
    alert('This shift slot is already assigned to this employee.');
    return;
  }

  const newShift = {
    id: `sh-${Date.now()}`,
    employeeId,
    day,
    slot
  };

  state.shifts.push(newShift);
  saveState();
  closeModal('modal-manage-shift');
  
  if (currentActiveView === 'employees') {
    renderEmployees();
  }

  alert('Shift scheduled successfully!');
}

function deleteShift(shiftId, event) {
  event.stopPropagation();
  if (confirm('Are you sure you want to cancel this scheduled shift?')) {
    state.shifts = state.shifts.filter(s => s.id !== shiftId);
    saveState();
    renderEmployees();
  }
}

// ----------------- HELPER LOGIC FOR STARS INPUTS -----------------

function setupStarsSelector() {
  const stars = document.querySelectorAll('#star-rating-selector .star');
  const ratingValInput = document.getElementById('review-rating-value');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      ratingValInput.value = rating;

      stars.forEach(s => {
        const r = parseInt(s.getAttribute('data-rating'));
        const path = s.querySelector('i');
        if (r <= rating) {
          s.classList.add('active');
          if (path) {
            path.style.fill = '#F59E0B';
            path.style.color = '#F59E0B';
          }
        } else {
          s.classList.remove('active');
          if (path) {
            path.style.fill = 'transparent';
            path.style.color = 'var(--text-muted)';
          }
        }
      });
    });
  });
}

function resetStarsSelector() {
  const stars = document.querySelectorAll('#star-rating-selector .star');
  const ratingValInput = document.getElementById('review-rating-value');
  ratingValInput.value = 5;
  stars.forEach(s => {
    s.classList.add('active');
    const path = s.querySelector('i');
    if (path) {
      path.style.fill = '#F59E0B';
      path.style.color = '#F59E0B';
    }
  });
}

// ----------------- INITIALIZATION -----------------

document.addEventListener('DOMContentLoaded', () => {
  // Load State
  loadState();

  // Configure Current Date Header Widget
  const dt = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date-time').textContent = dt.toLocaleDateString('en-US', options);
  
  // Set default dates on transaction input form to today
  document.getElementById('trans-date').value = dt.toISOString().split('T')[0];

  // Set up event actions on Sidebar Navigation
  document.querySelectorAll('.nav-menu .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });

  // Mobile menu action triggers
  const mobToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (mobToggle && sidebar) {
    mobToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Setup Stars feedback rating interactive listeners
  setupStarsSelector();

  // Load Overview by Default
  switchView('overview');
});
