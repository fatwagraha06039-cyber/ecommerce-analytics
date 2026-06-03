# E-Commerce Analytics Dashboard — Executive BI

> **Premium enterprise-grade business intelligence dashboard** transforming raw e-commerce transaction data into executive-level analytics.

---

## Dashboard Preview

A dark-mode, glassmorphism-styled SaaS dashboard with 8 analytical sections, 30+ interactive charts, and automated business insights.

**Live Demo:** [GitHub Pages](https://fatwagraha06039-cyber.github.io/ecommerce-analytics/)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total Revenue | $208K+ |
| Total Profit | $141K+ |
| Completed Orders | 3,930 |
| Unique Customers | 794 |
| Gross Margin | 67.9% |
| Repeat Purchase Rate | 97.7% |
| Product Categories | 6 |
| Geographic Regions | 4 (24 states) |

---

## Dashboard Sections

### 1. Executive Overview
- 8 KPI cards with trend indicators
- Month/Quarter/Year comparison analytics
- Revenue & profit trend charts
- Category distribution (doughnut)
- Order status analysis

### 2. Sales Performance
- Revenue, profit, and order trends
- Growth rate analysis (MoM)
- 3-month linear regression forecast
- Day-of-week distribution

### 3. Product Intelligence
- Top 10 products by revenue
- ABC Analysis (Pareto) — A/B/C classification
- Category profit margin comparison
- Category market share (polar area)
- Sortable product performance table

### 4. Customer Analytics
- RFM Analysis (Recency, Frequency, Monetary)
- Customer segmentation (Champions, Loyal, Potential, At Risk, Lost)
- New vs Returning customers
- Payment method distribution
- Top 20 VIP customers table

### 5. Geographic Analytics
- Revenue by region
- Profit by region
- Customer distribution
- Profit margin by region
- Regional performance summary table

### 6. Executive Insights
- 6 automated business intelligence cards
- Business impact summary (problems solved + actionable decisions)
- Tech stack showcase

### 7. SQL Showcase
- 6 analytical SQL queries with syntax highlighting
- Top Products, Revenue Growth, Customer Segmentation
- Retention Analysis, ABC Classification
- Window functions and CTEs

### 8. Data Pipeline
- 8-step analytics methodology flow
- Data quality metrics
- Python analytics workflow
- Business impact section with strategic recommendations

---

## Tools & Technologies

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Charts** | Chart.js v4 |
| **Design** | Glassmorphism, Dark Mode, CSS Variables |
| **Typography** | Inter (Google Fonts) |
| **Data** | JSON (pre-computed analytics) |
| **Analysis** | Python, Pandas, NumPy, Matplotlib |
| **SQL** | PostgreSQL-style analytical queries |
| **Methods** | RFM Analysis, ABC Analysis, Linear Regression |
| **Deployment** | GitHub Pages |

---

## Key Features

- **10 Executive KPI Cards** with trend indicators and period comparison
- **30+ Interactive Charts** (line, bar, doughnut, polar area, radar)
- **8 Navigation Tabs** for organized analytical sections
- **SQL Showcase** with syntax-highlighted analytical queries
- **Automated Insights** generated from data patterns
- **Forecasting** using linear regression
- **RFM Customer Segmentation** with 5-tier classification
- **ABC Product Analysis** with Pareto visualization
- **Responsive Design** for desktop and mobile
- **Export-ready** for PDF reports

---

## Project Structure

```
ecommerce-analytics/
├── index.html                  # Main dashboard
├── css/
│   └── main.css                # Premium dark theme (glassmorphism)
├── js/
│   └── app.js                  # Dashboard engine (charts, KPIs, insights)
├── data/
│   ├── generate_dataset.py     # Dataset generator script
│   ├── ecommerce_data.json     # Pre-computed dashboard data
│   ├── ecommerce_orders.json   # Raw transaction data (5000 records)
│   └── ecommerce_customers.json # Customer data (800 customers)
├── README.md
└── .gitignore
```

---

## Dataset

Synthetic e-commerce dataset simulating a real online retail business:

- **5,000 transactions** spanning Jan 2024 - Dec 2025
- **800 unique customers** across 4 US regions (24 states)
- **60 products** in 6 categories (Electronics, Clothing, Home & Living, Sports, Books, Beauty)
- **Revenue range:** $8 - $90 per item
- **Seasonal patterns:** Higher volume in Q4 (Nov-Dec)
- **Growth trend:** Positive upward trajectory

---

## Methodology

```
Raw Data (JSON Export)
      ↓
Data Cleaning (dedup, type conversion, null handling)
      ↓
Data Validation (completeness, consistency checks)
      ↓
Transformation (aggregation, pivoting, time-series)
      ↓
Feature Engineering (RFM scores, ABC classes, growth rates)
      ↓
Analysis (statistical, trend, segmentation)
      ↓
Visualization (30+ charts, KPI cards, tables)
      ↓
Business Insights (automated recommendations)
```

---

## SQL Skills Demonstrated

- Window Functions (LAG, RANK, SUM OVER)
- Common Table Expressions (CTEs)
- Aggregate Functions (COUNT, SUM, AVG, ROUND)
- Date Functions (DATE_TRUNC, DATEDIFF)
- CASE Statements for classification
- Subqueries and JOINs
- Percentage of total calculations
- Cumulative analysis

---

## Python Skills Demonstrated

- Pandas DataFrames (groupby, merge, pivot)
- NumPy (linear regression, statistical calculations)
- Matplotlib/Seaborn (publication-ready visualizations)
- Data cleaning and transformation
- Feature engineering
- Executive summary generation

---

## Business Impact

### Problems Solved
- Identified revenue concentration risk across product categories
- Mapped customer segments using RFM analysis for targeted marketing
- Discovered regional performance gaps for resource allocation
- Built forecasting models for revenue planning
- Quantified customer lifetime value for acquisition budgeting

### Actionable Decisions
- Expand top-performing categories (Electronics, Clothing)
- Launch VIP loyalty program for top 10% customers
- Increase marketing spend in underperforming regions
- Optimize pricing for low-margin products
- Implement churn prevention for "At Risk" RFM segment

---

## About the Author

**Marva Ahmad** — Mahasiswa Teknik Informatika | Data Analyst & BI Specialist

- Skills: SQL, Python, Pandas, NumPy, Matplotlib, Power BI, Business Intelligence, Statistical Analysis, Forecasting, Data Visualization
- GitHub: [@fatwagraha06039-cyber](https://github.com/fatwagraha06039-cyber)

---

## License

MIT
