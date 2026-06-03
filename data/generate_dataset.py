"""
E-Commerce Dataset Generator
Generates realistic e-commerce transaction data for analytics dashboard.
"""

import json
import random
import datetime
from collections import defaultdict

random.seed(42)

# Configuration
START_DATE = datetime.date(2024, 1, 1)
END_DATE = datetime.date(2025, 12, 31)
NUM_ORDERS = 5000
NUM_CUSTOMERS = 800

# Product catalog
PRODUCTS = {
    "Electronics": [
        {"name": "Wireless Earbuds Pro", "cost": 18, "price": 49.99},
        {"name": "USB-C Hub 7-in-1", "cost": 12, "price": 34.99},
        {"name": "Bluetooth Speaker Mini", "cost": 15, "price": 39.99},
        {"name": "Smart Watch X200", "cost": 35, "price": 89.99},
        {"name": "Mechanical Keyboard RGB", "cost": 28, "price": 69.99},
        {"name": "Gaming Mouse Wireless", "cost": 14, "price": 39.99},
        {"name": "Laptop Stand Aluminum", "cost": 12, "price": 29.99},
        {"name": "Webcam HD 1080p", "cost": 18, "price": 44.99},
        {"name": "Portable Charger 20000mAh", "cost": 10, "price": 29.99},
        {"name": "Smart LED Strip 5m", "cost": 8, "price": 24.99},
    ],
    "Clothing": [
        {"name": "Premium Cotton T-Shirt", "cost": 6, "price": 24.99},
        {"name": "Slim Fit Jeans", "cost": 12, "price": 49.99},
        {"name": "Hoodie Oversized", "cost": 14, "price": 54.99},
        {"name": "Running Shorts", "cost": 5, "price": 19.99},
        {"name": "Polo Shirt Classic", "cost": 8, "price": 34.99},
        {"name": "Winter Jacket", "cost": 25, "price": 89.99},
        {"name": "Casual Sneakers", "cost": 18, "price": 64.99},
        {"name": "Baseball Cap", "cost": 3, "price": 14.99},
        {"name": "Dress Socks 5-Pack", "cost": 4, "price": 12.99},
        {"name": "Linen Button-Down Shirt", "cost": 10, "price": 44.99},
    ],
    "Home & Living": [
        {"name": "Scented Candle Set", "cost": 5, "price": 19.99},
        {"name": "Throw Pillow Premium", "cost": 8, "price": 29.99},
        {"name": "Stainless Steel Water Bottle", "cost": 6, "price": 24.99},
        {"name": "Bamboo Cutting Board", "cost": 7, "price": 22.99},
        {"name": "Aromatherapy Diffuser", "cost": 12, "price": 39.99},
        {"name": "Cotton Bath Towel Set", "cost": 10, "price": 34.99},
        {"name": "Wall Clock Modern", "cost": 9, "price": 29.99},
        {"name": "Plant Pot Ceramic", "cost": 5, "price": 18.99},
        {"name": "LED Desk Lamp", "cost": 14, "price": 44.99},
        {"name": "Kitchen Timer Digital", "cost": 4, "price": 14.99},
    ],
    "Sports & Outdoor": [
        {"name": "Yoga Mat Premium", "cost": 10, "price": 34.99},
        {"name": "Resistance Bands Set", "cost": 5, "price": 19.99},
        {"name": "Insulated Lunch Box", "cost": 7, "price": 24.99},
        {"name": "Hiking Backpack 40L", "cost": 20, "price": 59.99},
        {"name": "Jump Rope Speed", "cost": 3, "price": 12.99},
        {"name": "Cycling Gloves", "cost": 6, "price": 22.99},
        {"name": "Camping Headlamp", "cost": 8, "price": 24.99},
        {"name": "Foam Roller", "cost": 7, "price": 27.99},
        {"name": "Swimming Goggles", "cost": 5, "price": 16.99},
        {"name": "Tennis Balls 3-Pack", "cost": 2, "price": 9.99},
    ],
    "Books & Stationery": [
        {"name": "Moleskine Notebook Classic", "cost": 6, "price": 19.99},
        {"name": "Fountain Pen Starter", "cost": 8, "price": 29.99},
        {"name": "Business Strategy Book", "cost": 5, "price": 16.99},
        {"name": "Color Pencils 24-Pack", "cost": 4, "price": 12.99},
        {"name": "Planner 2025 Premium", "cost": 6, "price": 22.99},
        {"name": "Desk Organizer Wood", "cost": 10, "price": 34.99},
        {"name": "Sticky Notes 12-Pack", "cost": 2, "price": 7.99},
        {"name": "Book Light LED Clip", "cost": 3, "price": 11.99},
        {"name": "Whiteboard Magnetic", "cost": 12, "price": 39.99},
        {"name": "Washi Tape Set 10-Pack", "cost": 3, "price": 9.99},
    ],
    "Beauty & Health": [
        {"name": "Face Moisturizer SPF30", "cost": 5, "price": 18.99},
        {"name": "Hair Serum Argan Oil", "cost": 4, "price": 14.99},
        {"name": "Vitamin C Serum", "cost": 6, "price": 24.99},
        {"name": "Lip Balm Set 3-Pack", "cost": 2, "price": 8.99},
        {"name": "Electric Toothbrush", "cost": 15, "price": 49.99},
        {"name": "Bath Bombs Gift Set", "cost": 5, "price": 19.99},
        {"name": "Sunscreen SPF50", "cost": 4, "price": 14.99},
        {"name": "Hand Cream Luxury", "cost": 3, "price": 12.99},
        {"name": "Sleep Mask Silk", "cost": 4, "price": 16.99},
        {"name": "Essential Oil Set", "cost": 7, "price": 24.99},
    ],
}

REGIONS = {
    "West": ["California", "Oregon", "Washington", "Nevada", "Arizona", "Colorado", "Utah"],
    "East": ["New York", "Massachusetts", "Connecticut", "New Jersey", "Pennsylvania", "Florida"],
    "Midwest": ["Illinois", "Ohio", "Michigan", "Minnesota", "Wisconsin", "Indiana"],
    "South": ["Texas", "Georgia", "North Carolina", "Virginia", "Tennessee", "Alabama"],
}

CITIES = {
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
    "Oregon": ["Portland", "Eugene", "Salem"],
    "Washington": ["Seattle", "Tacoma", "Spokane"],
    "Nevada": ["Las Vegas", "Reno"],
    "Arizona": ["Phoenix", "Tucson", "Scottsdale"],
    "Colorado": ["Denver", "Colorado Springs", "Boulder"],
    "Utah": ["Salt Lake City", "Provo", "Ogden"],
    "New York": ["New York City", "Buffalo", "Albany", "Rochester"],
    "Massachusetts": ["Boston", "Cambridge", "Worcester"],
    "Connecticut": ["Hartford", "New Haven", "Stamford"],
    "New Jersey": ["Newark", "Jersey City", "Trenton"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Harrisburg"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
    "Illinois": ["Chicago", "Springfield", "Naperville"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
    "Michigan": ["Detroit", "Ann Arbor", "Grand Rapids"],
    "Minnesota": ["Minneapolis", "Saint Paul", "Duluth"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay"],
    "Indiana": ["Indianapolis", "Fort Wayne", "South Bend"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
    "Georgia": ["Atlanta", "Savannah", "Augusta"],
    "North Carolina": ["Charlotte", "Raleigh", "Durham"],
    "Virginia": ["Virginia Beach", "Richmond", "Arlington"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville"],
    "Alabama": ["Birmingham", "Montgomery", "Huntsville"],
}

PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal", "Apple Pay", "Google Pay"]
ORDER_STATUSES = ["Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Returned", "Cancelled"]
CUSTOMER_SEGMENTS = ["Regular", "Premium", "VIP"]

def random_date(start, end):
    delta = (end - start).days
    return start + datetime.timedelta(days=random.randint(0, delta))

def generate_customers():
    customers = []
    first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
    
    for i in range(NUM_CUSTOMERS):
        region = random.choice(list(REGIONS.keys()))
        state = random.choice(REGIONS[region])
        city = random.choice(CITIES[state])
        segment = random.choices(CUSTOMER_SEGMENTS, weights=[60, 30, 10])[0]
        
        customers.append({
            "customer_id": f"CUST-{str(i+1).zfill(5)}",
            "name": f"{random.choice(first_names)} {random.choice(last_names)}",
            "email": f"customer{i+1}@email.com",
            "segment": segment,
            "region": region,
            "state": state,
            "city": city,
            "join_date": str(random_date(START_DATE - datetime.timedelta(days=365), END_DATE - datetime.timedelta(days=30))),
        })
    
    return customers

def generate_orders(customers):
    orders = []
    order_num = 1
    
    # Create seasonal weights (higher in Nov-Dec, lower in Jan-Feb)
    month_weights = {
        1: 0.7, 2: 0.75, 3: 0.85, 4: 0.9, 5: 0.95, 6: 1.0,
        7: 1.05, 8: 1.0, 9: 0.95, 10: 1.0, 11: 1.3, 12: 1.4
    }
    
    # Growth trend: later months get more orders
    total_days = (END_DATE - START_DATE).days
    
    for _ in range(NUM_ORDERS):
        # Pick a random date with seasonal weighting
        while True:
            order_date = random_date(START_DATE, END_DATE)
            month = order_date.month
            weight = month_weights.get(month, 1.0)
            # Add growth trend
            days_from_start = (order_date - START_DATE).days
            trend_factor = 1.0 + (days_from_start / total_days) * 0.5
            if random.random() < (weight * trend_factor) / 1.8:
                break
        
        customer = random.choice(customers)
        category = random.choice(list(PRODUCTS.keys()))
        product = random.choice(PRODUCTS[category])
        
        quantity = random.choices([1, 2, 3, 4, 5], weights=[50, 25, 15, 7, 3])[0]
        discount = random.choices([0, 0.05, 0.10, 0.15, 0.20, 0.25], weights=[40, 20, 15, 10, 10, 5])[0]
        
        base_revenue = product["price"] * quantity
        discount_amount = base_revenue * discount
        revenue = round(base_revenue - discount_amount, 2)
        cost = round(product["cost"] * quantity, 2)
        profit = round(revenue - cost, 2)
        
        status = random.choice(ORDER_STATUSES)
        payment = random.choice(PAYMENT_METHODS)
        
        orders.append({
            "order_id": f"ORD-{str(order_num).zfill(6)}",
            "order_date": str(order_date),
            "customer_id": customer["customer_id"],
            "customer_name": customer["name"],
            "customer_segment": customer["segment"],
            "product_name": product["name"],
            "category": category,
            "quantity": quantity,
            "unit_price": product["price"],
            "discount_pct": discount * 100,
            "discount_amount": round(discount_amount, 2),
            "revenue": revenue,
            "cost": cost,
            "profit": profit,
            "profit_margin": round((profit / revenue * 100) if revenue > 0 else 0, 2),
            "payment_method": payment,
            "status": status,
            "region": customer["region"],
            "state": customer["state"],
            "city": customer["city"],
        })
        
        order_num += 1
    
    return orders

def generate_summary(orders, customers):
    """Generate pre-computed summary data for dashboard."""
    
    # Filter completed orders only
    completed = [o for o in orders if o["status"] == "Completed"]
    
    # Monthly aggregation
    monthly = defaultdict(lambda: {"revenue": 0, "profit": 0, "orders": 0, "customers": set()})
    for o in completed:
        month_key = o["order_date"][:7]  # YYYY-MM
        monthly[month_key]["revenue"] += o["revenue"]
        monthly[month_key]["profit"] += o["profit"]
        monthly[month_key]["orders"] += 1
        monthly[month_key]["customers"].add(o["customer_id"])
    
    monthly_list = []
    for key in sorted(monthly.keys()):
        m = monthly[key]
        monthly_list.append({
            "month": key,
            "revenue": round(m["revenue"], 2),
            "profit": round(m["profit"], 2),
            "orders": m["orders"],
            "customers": len(m["customers"]),
        })
    
    # Add growth rates
    for i in range(1, len(monthly_list)):
        prev = monthly_list[i-1]["revenue"]
        curr = monthly_list[i]["revenue"]
        monthly_list[i]["revenue_growth"] = round((curr - prev) / prev * 100, 2) if prev > 0 else 0
        prev_p = monthly_list[i-1]["profit"]
        curr_p = monthly_list[i]["profit"]
        monthly_list[i]["profit_growth"] = round((curr_p - prev_p) / prev_p * 100, 2) if prev_p > 0 else 0
    monthly_list[0]["revenue_growth"] = 0
    monthly_list[0]["profit_growth"] = 0
    
    # Category aggregation
    cat_data = defaultdict(lambda: {"revenue": 0, "profit": 0, "orders": 0, "quantity": 0})
    for o in completed:
        cat_data[o["category"]]["revenue"] += o["revenue"]
        cat_data[o["category"]]["profit"] += o["profit"]
        cat_data[o["category"]]["orders"] += 1
        cat_data[o["category"]]["quantity"] += o["quantity"]
    
    categories_list = []
    total_revenue = sum(c["revenue"] for c in cat_data.values())
    for cat, data in sorted(cat_data.items(), key=lambda x: x[1]["revenue"], reverse=True):
        categories_list.append({
            "category": cat,
            "revenue": round(data["revenue"], 2),
            "profit": round(data["profit"], 2),
            "orders": data["orders"],
            "quantity": data["quantity"],
            "margin": round(data["profit"] / data["revenue"] * 100, 2) if data["revenue"] > 0 else 0,
            "share_pct": round(data["revenue"] / total_revenue * 100, 2),
        })
    
    # Region aggregation
    region_data = defaultdict(lambda: {"revenue": 0, "profit": 0, "orders": 0, "customers": set()})
    for o in completed:
        region_data[o["region"]]["revenue"] += o["revenue"]
        region_data[o["region"]]["profit"] += o["profit"]
        region_data[o["region"]]["orders"] += 1
        region_data[o["region"]]["customers"].add(o["customer_id"])
    
    regions_list = []
    for region, data in sorted(region_data.items(), key=lambda x: x[1]["revenue"], reverse=True):
        regions_list.append({
            "region": region,
            "revenue": round(data["revenue"], 2),
            "profit": round(data["profit"], 2),
            "orders": data["orders"],
            "customers": len(data["customers"]),
            "margin": round(data["profit"] / data["revenue"] * 100, 2) if data["revenue"] > 0 else 0,
        })
    
    # Product aggregation
    prod_data = defaultdict(lambda: {"revenue": 0, "profit": 0, "orders": 0, "quantity": 0, "category": ""})
    for o in completed:
        prod_data[o["product_name"]]["revenue"] += o["revenue"]
        prod_data[o["product_name"]]["profit"] += o["profit"]
        prod_data[o["product_name"]]["orders"] += 1
        prod_data[o["product_name"]]["quantity"] += o["quantity"]
        prod_data[o["product_name"]]["category"] = o["category"]
    
    products_list = []
    for prod, data in sorted(prod_data.items(), key=lambda x: x[1]["revenue"], reverse=True):
        products_list.append({
            "product": prod,
            "category": data["category"],
            "revenue": round(data["revenue"], 2),
            "profit": round(data["profit"], 2),
            "orders": data["orders"],
            "quantity": data["quantity"],
            "margin": round(data["profit"] / data["revenue"] * 100, 2) if data["revenue"] > 0 else 0,
        })
    
    # ABC Analysis
    sorted_products = sorted(products_list, key=lambda x: x["revenue"], reverse=True)
    cumulative = 0
    for p in sorted_products:
        cumulative += p["revenue"]
        pct = cumulative / total_revenue * 100
        if pct <= 80:
            p["abc_class"] = "A"
        elif pct <= 95:
            p["abc_class"] = "B"
        else:
            p["abc_class"] = "C"
    
    # Customer RFM
    customer_data = defaultdict(lambda: {"recency": None, "frequency": 0, "monetary": 0, "orders": [], "segment": ""})
    for o in completed:
        cd = customer_data[o["customer_id"]]
        cd["frequency"] += 1
        cd["monetary"] += o["revenue"]
        cd["orders"].append(o["order_date"])
        cd["segment"] = o["customer_segment"]
    
    ref_date = END_DATE
    rfm_list = []
    for cust_id, data in customer_data.items():
        last_order = max(data["orders"])
        recency = (ref_date - datetime.date.fromisoformat(last_order)).days
        rfm_list.append({
            "customer_id": cust_id,
            "recency": recency,
            "frequency": data["frequency"],
            "monetary": round(data["monetary"], 2),
            "segment": data["segment"],
        })
    
    # RFM scoring
    for c in rfm_list:
        c["r_score"] = 5 if c["recency"] <= 30 else 4 if c["recency"] <= 60 else 3 if c["recency"] <= 120 else 2 if c["recency"] <= 200 else 1
        c["f_score"] = 5 if c["frequency"] >= 10 else 4 if c["frequency"] >= 7 else 3 if c["frequency"] >= 4 else 2 if c["frequency"] >= 2 else 1
        c["m_score"] = 5 if c["monetary"] >= 500 else 4 if c["monetary"] >= 300 else 3 if c["monetary"] >= 150 else 2 if c["monetary"] >= 50 else 1
        c["rfm_score"] = c["r_score"] + c["f_score"] + c["m_score"]
        if c["rfm_score"] >= 12:
            c["rfm_segment"] = "Champions"
        elif c["rfm_score"] >= 9:
            c["rfm_segment"] = "Loyal"
        elif c["rfm_score"] >= 6:
            c["rfm_segment"] = "Potential"
        elif c["rfm_score"] >= 4:
            c["rfm_segment"] = "At Risk"
        else:
            c["rfm_segment"] = "Lost"
    
    rfm_list.sort(key=lambda x: x["rfm_score"], reverse=True)
    
    # Top customers
    top_customers = sorted(rfm_list, key=lambda x: x["monetary"], reverse=True)[:20]
    
    # Hourly distribution
    hourly = defaultdict(int)
    for o in completed:
        # Simulate hour from order (not in data, so generate)
        pass
    
    # Daily distribution
    daily = defaultdict(int)
    for o in completed:
        dow = datetime.date.fromisoformat(o["order_date"]).strftime("%A")
        daily[dow] += 1
    
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    daily_list = [{"day": d, "orders": daily.get(d, 0)} for d in day_order]
    
    # Payment method distribution
    payment_data = defaultdict(int)
    for o in completed:
        payment_data[o["payment_method"]] += 1
    payments_list = [{"method": m, "count": c} for m, c in sorted(payment_data.items(), key=lambda x: x[1], reverse=True)]
    
    # Status distribution
    status_data = defaultdict(int)
    for o in orders:
        status_data[o["status"]] += 1
    status_list = [{"status": s, "count": c} for s, c in sorted(status_data.items(), key=lambda x: x[1], reverse=True)]
    
    # Overall KPIs
    total_profit = sum(o["profit"] for o in completed)
    total_orders_completed = len(completed)
    unique_customers = len(set(o["customer_id"] for o in completed))
    avg_order_value = total_revenue / total_orders_completed if total_orders_completed > 0 else 0
    
    # Repeat purchase rate
    customer_order_counts = defaultdict(int)
    for o in completed:
        customer_order_counts[o["customer_id"]] += 1
    repeat_customers = sum(1 for c in customer_order_counts.values() if c > 1)
    repeat_rate = repeat_customers / len(customer_order_counts) * 100
    
    # Customer lifetime value
    clv = total_revenue / unique_customers if unique_customers > 0 else 0
    
    # Gross margin
    gross_margin = total_profit / total_revenue * 100 if total_revenue > 0 else 0
    
    # New vs returning
    new_customers = sum(1 for c in customer_order_counts.values() if c == 1)
    returning_customers = sum(1 for c in customer_order_counts.values() if c > 1)
    
    # RFM segment distribution
    rfm_segments = defaultdict(int)
    for c in rfm_list:
        rfm_segments[c["rfm_segment"]] += 1
    rfm_segments_list = [{"segment": s, "count": c} for s, c in sorted(rfm_segments.items(), key=lambda x: x[1], reverse=True)]
    
    return {
        "meta": {
            "source": "E-Commerce Transaction Data",
            "records_count": len(orders),
            "completed_orders": len(completed),
            "date_range": {"from": str(START_DATE), "to": str(END_DATE)},
            "last_updated": datetime.datetime.now().isoformat(),
        },
        "kpis": {
            "total_revenue": round(total_revenue, 2),
            "total_profit": round(total_profit, 2),
            "total_orders": total_orders_completed,
            "avg_order_value": round(avg_order_value, 2),
            "customer_lifetime_value": round(clv, 2),
            "repeat_purchase_rate": round(repeat_rate, 2),
            "gross_margin": round(gross_margin, 2),
            "unique_customers": unique_customers,
            "new_customers": new_customers,
            "returning_customers": returning_customers,
        },
        "monthly": monthly_list,
        "categories": categories_list,
        "regions": regions_list,
        "products": products_list,
        "abc_analysis": sorted_products,
        "rfm": rfm_list[:50],  # Top 50 for dashboard
        "rfm_segments": rfm_segments_list,
        "top_customers": top_customers,
        "daily_distribution": daily_list,
        "payment_methods": payments_list,
        "order_status": status_list,
        "customers": customers,
    }


if __name__ == "__main__":
    print("Generating customers...")
    customers = generate_customers()
    
    print("Generating orders...")
    orders = generate_orders(customers)
    
    print("Computing summaries...")
    summary = generate_summary(orders, customers)
    
    # Save orders
    with open("data/ecommerce_orders.json", "w", encoding="utf-8") as f:
        json.dump(orders, f, indent=2)
    print(f"  Orders: {len(orders)} records -> data/ecommerce_orders.json")
    
    # Save customers
    with open("data/ecommerce_customers.json", "w", encoding="utf-8") as f:
        json.dump(customers, f, indent=2)
    print(f"  Customers: {len(customers)} records -> data/ecommerce_customers.json")
    
    # Save summary (main data for dashboard)
    with open("data/ecommerce_data.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"  Dashboard data -> data/ecommerce_data.json")
    
    # Print quick stats
    kpis = summary["kpis"]
    print(f"\n{'='*50}")
    print(f"  DATASET SUMMARY")
    print(f"{'='*50}")
    print(f"  Total Revenue: ${kpis['total_revenue']:,.2f}")
    print(f"  Total Profit:  ${kpis['total_profit']:,.2f}")
    print(f"  Total Orders:  {kpis['total_orders']:,}")
    print(f"  Customers:     {kpis['unique_customers']:,}")
    print(f"  Avg Order:     ${kpis['avg_order_value']:.2f}")
    print(f"  Gross Margin:  {kpis['gross_margin']:.1f}%")
    print(f"  Repeat Rate:   {kpis['repeat_purchase_rate']:.1f}%")
    print(f"{'='*50}")
