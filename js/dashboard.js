// ============================================================
// DASHBOARD.JS — shared by ALL dashboard pages (operator + admin)
// - Auth guard (role must match page)
// - Fills logged-in user's name/role/initial/email
// - Highlights the active sidebar link based on current file
// - Sidebar toggle for mobile (open/close/backdrop) + logout
// - Renders mock data tables/lists used across the sub-pages
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const pageRole = document.body.dataset.role; // 'operator' or 'admin'
  const stored = localStorage.getItem('scm_user');
  let user = null;

  try { user = stored ? JSON.parse(stored) : null; } catch (e) { user = null; }

  // ---- Auth guard ----
  if (!user || !user.name || !user.role) {
    window.location.href = 'login.html';
    return;
  }
  if (user.role !== pageRole) {
    window.location.href = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-operator.html';
    return;
  }

  // ---- Fill user info ----
  const email = user.email || (user.name.trim().toLowerCase().replace(/\s+/g, '') + '@stackly.com');

  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
  document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = email);
  document.querySelectorAll('[data-user-initial]').forEach(el => {
    el.textContent = user.name.trim().charAt(0).toUpperCase() || '?';
  });
  document.querySelectorAll('[data-role-pill]').forEach(el => {
    el.textContent = pageRole;
  });

  // ---- Section switching (single-page dashboard, no reloads) ----
  const sectionTitles = {
    overview:   { operator: ['Operator Overview', "Track shipments, inventory, and routes in real time."], admin: ['Admin Overview', 'Monitor the whole network — users, hubs, and system health.'] },
    shipments:  { operator: ['Shipments', 'All shipments moving through your assigned hubs.'], admin: ['All Shipments', 'Network-wide shipment visibility across every hub.'] },
    inventory:  { operator: ['Inventory', 'Stock levels across all hubs in your network.'] },
    routes:     { operator: ['Routes', 'Active delivery routes and their current load.'] },
    reports:    { operator: ['Reports', 'Download performance and inventory reports.'] },
    users:      { admin: ['Users & Operators', 'Manage every account across the network.'] },
    hubs:       { admin: ['Hubs & Inventory', 'Capacity and inventory health across every hub.'] },
    analytics:  { admin: ['Analytics', 'Network performance trends over the last 30 days.'] },
    access:     { admin: ['Access Control', 'Permissions by role across the platform.'] },
    
  };

  function showSection(name) {
    document.querySelectorAll('.dash-section').forEach(sec => {
      sec.hidden = sec.id !== `section-${name}`;
    });
    document.querySelectorAll('.dash-nav a[data-section]').forEach(link => {
      link.classList.toggle('active', link.dataset.section === name);
    });
    const titleEl = document.getElementById('pageTitle');
    const subtitleEl = document.getElementById('pageSubtitle');
    const entry = sectionTitles[name] && sectionTitles[name][pageRole];
    if (titleEl && entry) titleEl.textContent = entry[0];
    if (subtitleEl) {
      // Overview keeps a personalized welcome line right under the title
      // (matches the reference layout — no separate welcome banner).
      subtitleEl.textContent = name === 'overview'
        ? `Welcome back, ${user.name} 👋`
        : (entry ? entry[1] : '');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.dash-nav a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
      closeSidebar();
    });
  });

  document.querySelectorAll('[data-section-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.sectionLink);
    });
  });

  // Set the initial title/subtitle (overview) now that we know the user's name
  showSection('overview');

  // ---- Sidebar toggle (mobile) ----
  const sidebar = document.getElementById('dashSidebar');
  const menuToggle = document.getElementById('dashMenuToggle');
  const backdrop = document.getElementById('dashBackdrop');
  const sidebarClose = document.getElementById('dashSidebarClose');

  function openSidebar() { sidebar.classList.add('open'); backdrop.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); backdrop.classList.remove('show'); }
  if (menuToggle) menuToggle.addEventListener('click', openSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);

  // ---- Search bar (Enter to search) ----
  document.querySelectorAll('.dash-search input').forEach(input => {
    const originalPlaceholder = input.placeholder;
    let restoreTimer = null;

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const box = input.closest('.dash-search');
      const value = input.value.trim();

      if (!value) {
        clearTimeout(restoreTimer);
        box.classList.remove('dash-search-error');
        void box.offsetWidth; // restart animation if triggered again quickly
        box.classList.add('dash-search-error');
        input.placeholder = 'Type something to search';
        restoreTimer = setTimeout(() => {
          box.classList.remove('dash-search-error');
          input.placeholder = originalPlaceholder;
        }, 1800);
        return;
      }

      window.location.href = '404.html';
    });
  });

  // ---- Logout ----
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('scm_user');
      window.location.href = 'login.html';
    });
  });

  // ============================================================
  // MOCK DATA
  // ============================================================

  const allShipments = [
    { id: 'SHP-2291', route: 'Chennai → Colombo', hub: 'Chennai Hub', status: 'In Transit', eta: 'Today, 6:40 PM', kind: 'yellow' },
    { id: 'SHP-2287', route: 'Coimbatore → Kochi', hub: 'Coimbatore Hub', status: 'Delivered', eta: 'Yesterday', kind: 'green' },
    { id: 'SHP-2276', route: 'Madurai → Bengaluru', hub: 'Madurai Hub', status: 'Delayed', eta: 'Delayed 4h', kind: 'red' },
    { id: 'SHP-2264', route: 'Salem → Hyderabad', hub: 'Salem Hub', status: 'In Transit', eta: 'Tomorrow, 9:00 AM', kind: 'yellow' },
    { id: 'SHP-2251', route: 'Trichy → Mumbai', hub: 'Trichy Hub', status: 'Delivered', eta: '2 days ago', kind: 'green' },
    { id: 'SHP-2248', route: 'Chennai → Bengaluru', hub: 'Chennai Hub', status: 'Delivered', eta: '2 days ago', kind: 'green' },
    { id: 'SHP-2239', route: 'Coimbatore → Chennai', hub: 'Coimbatore Hub', status: 'In Transit', eta: 'Tomorrow, 2:00 PM', kind: 'yellow' },
    { id: 'SHP-2231', route: 'Madurai → Kochi', hub: 'Madurai Hub', status: 'Delayed', eta: 'Delayed 1h', kind: 'red' },
    { id: 'SHP-2220', route: 'Salem → Chennai', hub: 'Salem Hub', status: 'Delivered', eta: '3 days ago', kind: 'green' },
    { id: 'SHP-2214', route: 'Trichy → Hyderabad', hub: 'Trichy Hub', status: 'In Transit', eta: 'Today, 11:15 PM', kind: 'yellow' },
  ];

  const inventoryItems = [
    { item: 'Cold-chain Packaging', hub: 'Coimbatore Hub', stock: 42, min: 100, status: 'Low', kind: 'red' },
    { item: 'Pallet Wrap Rolls', hub: 'Chennai Hub', stock: 310, min: 150, status: 'Healthy', kind: 'green' },
    { item: 'Barcode Labels', hub: 'Madurai Hub', stock: 88, min: 120, status: 'Low', kind: 'yellow' },
    { item: 'Shipping Crates (L)', hub: 'Salem Hub', stock: 205, min: 100, status: 'Healthy', kind: 'green' },
    { item: 'Insulated Containers', hub: 'Trichy Hub', stock: 15, min: 60, status: 'Critical', kind: 'red' },
    { item: 'Pallet Wrap Rolls', hub: 'Madurai Hub', stock: 176, min: 150, status: 'Healthy', kind: 'green' },
  ];

  const routes = [
    { name: 'Chennai → Colombo', distance: '520 km · Sea + Road', duration: '~18 hrs', shipments: 12, status: 'Active', kind: 'green' },
    { name: 'Coimbatore → Kochi', distance: '190 km · Road', duration: '~4.5 hrs', shipments: 8, status: 'Active', kind: 'green' },
    { name: 'Madurai → Bengaluru', distance: '440 km · Road', duration: '~9 hrs', shipments: 5, status: 'Congested', kind: 'yellow' },
    { name: 'Salem → Hyderabad', distance: '620 km · Road', duration: '~12 hrs', shipments: 6, status: 'Active', kind: 'green' },
    { name: 'Trichy → Mumbai', distance: '1150 km · Rail + Road', duration: '~30 hrs', shipments: 3, status: 'Delayed', kind: 'red' },
    { name: 'Chennai → Bengaluru', distance: '350 km · Road', duration: '~6.5 hrs', shipments: 14, status: 'Active', kind: 'green' },
  ];

  const reports = [
    { name: 'Weekly Delivery Performance', period: 'Sep 1 – Sep 7, 2026', size: '1.2 MB' },
    { name: 'Monthly Inventory Audit', period: 'August 2026', size: '3.4 MB' },
    { name: 'Route Efficiency Summary', period: 'Q3 2026', size: '860 KB' },
    { name: 'Delayed Shipments Analysis', period: 'Sep 1 – Sep 7, 2026', size: '640 KB' },
    { name: 'Fuel & Cost Breakdown', period: 'August 2026', size: '2.1 MB' },
  ];

  const allUsers = [
    { name: 'Arun Kumar', role: 'Operator', region: 'Chennai Hub', status: 'Active', kind: 'green' },
    { name: 'Divya Rajan', role: 'Operator', region: 'Coimbatore Hub', status: 'Active', kind: 'green' },
    { name: 'Ferdin Joe', role: 'Operator', region: 'Madurai Hub', status: 'Inactive', kind: 'red' },
    { name: 'Priya Suresh', role: 'Admin', region: 'HQ', status: 'Active', kind: 'green' },
    { name: 'Vignesh S', role: 'Operator', region: 'Salem Hub', status: 'On Leave', kind: 'yellow' },
    { name: 'Kavitha M', role: 'Operator', region: 'Trichy Hub', status: 'Active', kind: 'green' },
    { name: 'Naveen R', role: 'Admin', region: 'HQ', status: 'Active', kind: 'green' },
    { name: 'Sathish P', role: 'Operator', region: 'Chennai Hub', status: 'Active', kind: 'green' },
  ];

  const hubs = [
    { name: 'Chennai Hub', address: 'Ambattur Industrial Estate, Chennai', manager: 'Arun Kumar', capacity: 82 },
    { name: 'Coimbatore Hub', address: 'Peelamedu, Coimbatore', manager: 'Divya Rajan', capacity: 64 },
    { name: 'Madurai Hub', address: 'Tallakulam, Madurai', manager: 'Ferdin Joe', capacity: 91 },
    { name: 'Salem Hub', address: 'Suramangalam, Salem', manager: 'Vignesh S', capacity: 47 },
    { name: 'Trichy Hub', address: 'Thillai Nagar, Trichy', manager: 'Kavitha M', capacity: 58 },
  ];

  // ---- Renderers (only run if the target element exists on this page) ----

  const shipmentTableBody = document.getElementById('shipmentTableBody');
  if (shipmentTableBody) {
    shipmentTableBody.innerHTML = allShipments.slice(0, 5).map(row => `
      <tr>
        <td>${row.id}</td><td>${row.route}</td>
        <td><span class="dash-pill ${row.kind}">${row.status}</span></td>
        <td>${row.eta}</td>
      </tr>`).join('');
  }

  const allShipmentTableBody = document.getElementById('allShipmentTableBody');
  if (allShipmentTableBody) {
    function renderShipments(filter) {
      const rows = filter === 'All' ? allShipments : allShipments.filter(r => r.status === filter);
      allShipmentTableBody.innerHTML = rows.map(row => `
        <tr>
          <td>${row.id}</td><td>${row.route}</td><td>${row.hub}</td>
          <td><span class="dash-pill ${row.kind}">${row.status}</span></td>
          <td>${row.eta}</td>
        </tr>`).join('');
    }
    renderShipments('All');
    document.querySelectorAll('.dash-tab[data-filter]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dash-tab[data-filter]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderShipments(tab.dataset.filter);
      });
    });
  }

  const inventoryTableBody = document.getElementById('inventoryTableBody');
  if (inventoryTableBody) {
    inventoryTableBody.innerHTML = inventoryItems.map(row => `
      <tr>
        <td>${row.item}</td><td>${row.hub}</td><td>${row.stock} units</td><td>${row.min} units</td>
        <td><span class="dash-pill ${row.kind}">${row.status}</span></td>
      </tr>`).join('');
  }

  const routeGrid = document.getElementById('routeGrid');
  if (routeGrid) {
    routeGrid.innerHTML = routes.map(r => `
      <div class="dash-item-card">
        <div class="dash-item-card-head">
          <div>
            <h4>${r.name}</h4>
            <p>${r.distance}</p>
          </div>
          <div class="dash-item-icon"><i class="fa-solid fa-route"></i></div>
        </div>
        <span class="dash-pill ${r.kind}">${r.status}</span>
        <div class="dash-item-meta">
          <span><i class="fa-solid fa-clock"></i>${r.duration}</span>
          <span><i class="fa-solid fa-truck"></i>${r.shipments} shipments</span>
        </div>
      </div>`).join('');
  }

  const reportList = document.getElementById('reportList');
  if (reportList) {
    reportList.innerHTML = reports.map(r => `
      <div class="dash-list-item" style="align-items:center;">
        <div class="dash-list-icon"><i class="fa-solid fa-file-lines"></i></div>
        <div style="flex:1;">
          <p>${r.name}</p>
          <span>${r.period} · ${r.size}</span>
        </div>
        <a href="404.html" style="color:var(--accent);font-size:13px;font-weight:600;"><i class="fa-solid fa-download"></i></a>
      </div>`).join('');
  }

  const userTableBody = document.getElementById('userTableBody');
  if (userTableBody) {
    userTableBody.innerHTML = allUsers.slice(0, 5).map(row => `
      <tr>
        <td>${row.name}</td><td>${row.role}</td><td>${row.region}</td>
        <td><span class="dash-pill ${row.kind}">${row.status}</span></td>
      </tr>`).join('');
  }

  const allUserTableBody = document.getElementById('allUserTableBody');
  if (allUserTableBody) {
    allUserTableBody.innerHTML = allUsers.map(row => `
      <tr>
        <td>${row.name}</td><td>${row.role}</td><td>${row.region}</td>
        <td><span class="dash-pill ${row.kind}">${row.status}</span></td>
        <td><a href="404.html" style="color:var(--accent);font-size:12.5px;font-weight:600;">Edit</a></td>
      </tr>`).join('');
  }

  const hubGrid = document.getElementById('hubGrid');
  if (hubGrid) {
    hubGrid.innerHTML = hubs.map(h => `
      <div class="dash-item-card">
        <div class="dash-item-card-head">
          <div>
            <h4>${h.name}</h4>
            <p>${h.address}</p>
          </div>
          <div class="dash-item-icon"><i class="fa-solid fa-warehouse"></i></div>
        </div>
        <div class="dash-progress-row" style="margin-bottom:0;">
          <div class="dash-progress-labels"><span>Capacity</span><span>${h.capacity}%</span></div>
          <div class="dash-progress-track"><div class="dash-progress-fill" style="width:${h.capacity}%"></div></div>
        </div>
        <div class="dash-item-meta">
          <span><i class="fa-solid fa-user-tie"></i>${h.manager}</span>
        </div>
      </div>`).join('');
  }

  // ---- Toggle switches (Settings page) ----
  document.querySelectorAll('.dash-switch').forEach(sw => {
    sw.addEventListener('click', () => sw.classList.toggle('on'));
  });
});