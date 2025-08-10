# 🚚 AI Powered Customer Sentiment Logistics Performance Dashboard

![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?logo=tailwindcss)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0-FF6384?logo=chartdotjs)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

---

## 📜 Description

The **Logistics Performance Dashboard** is a **single-page web application** that enables operational managers and stakeholders to monitor **real-time logistics performance metrics**.  
With **interactive charts, AI-powered insights, and live customer feedback**, it helps organizations **identify bottlenecks, improve delivery times, and enhance customer satisfaction**.

**Why this project?**  
- Logistics managers often rely on multiple, fragmented tools for data monitoring.  
- This dashboard centralizes KPIs, visualizations, and insights into **one unified platform**.  
- The **AI simulation** provides proactive recommendations, helping decision-makers act before issues escalate.  

---

## 🎯 Goals
1. Provide **at-a-glance** monitoring of logistics operations.
2. Enable **data-driven decision-making** with AI insights.
3. Offer **real-time updates** without manual refresh.
4. Ensure **mobile-friendly access** for managers on the go.
5. Keep the architecture **simple, self-contained, and fast**.

---

## ✨ Features

<details>
<summary>🔑 User Authentication</summary>
- **Admin**: Full access (AI recommendations enabled)  
- **Guest**: Read-only access (AI recommendations hidden)  
</details>

<details>
<summary>📊 Key Performance Indicators (KPIs)</summary>
- On-Time Delivery Rate  
- Average Delivery Time  
- Cost Efficiency  
- Shipment Delays  
</details>

<details>
<summary>📈 Interactive Charts</summary>
- Weekly trends for delivery time & shipment volume (**Chart.js**)  
- Drill-down for **daily customer feedback**  
</details>

<details>
<summary>🎯 Filters</summary>
- Date range, Region, Product, Shipment type  
</details>

<details>
<summary>🤖 AI-Powered Insights *(Simulated)*</summary>
- AI Recommendations  
- Causal Analysis  
- Topic Modeling  
</details>

<details>
<summary>💬 Live Customer Feedback</summary>
- Real-time updates with **sentiment** & **topic** analysis  
</details>

<details>
<summary>🔍 Data Pipeline Status</summary>
- Health & sync status for mock data streams  
</details>

---

## 🏗 Architecture Overview

The application is built with a **frontend-only approach** (no backend needed) to keep it lightweight and portable.

**Main Components:**
- **Auth.jsx** → Handles Admin/Guest login
- **Dashboard.jsx** → Displays all KPIs and charts
- **Filters.jsx** → Dropdown-based data filtering
- **Charts.jsx** → Chart.js visualizations
- **AIInsights.jsx** → Simulated AI recommendations
- **Feedback.jsx** → Real-time customer feedback section
- **PipelineStatus.jsx** → Mock pipeline health monitor

---

## 🔄 How Data Refresh Works

- The app **generates mock data** in `App.jsx` using JavaScript.
- Data updates **every few seconds** using `setInterval`.
- Charts & KPIs re-render **automatically** without manual refresh.

---

## 📅 Project Update Log

| Date       | Update |
|------------|--------|
| 2025-08-01 | Initial project structure created |
| 2025-08-03 | Added Chart.js visualizations |
| 2025-08-05 | Implemented AI insights section |
| 2025-08-07 | Added responsive Tailwind design |
| 2025-08-10 | Finalized authentication & filters |

---

## 🚀 Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (with npm)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Start development server
npm start
