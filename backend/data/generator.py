"""
Synthetic Business Data Generator for BusinessIntelligence.ai
Generates realistic multi-source retail/e-commerce datasets:
- Sales transactions (hourly grain)
- Marketing campaigns (daily grain, attribution lag)
- Inventory levels (6-hour snapshot grain)
- External macro signals (competitor price index, demand index, holidays)
- Sparse history product: SmartPhone X (17 days only)
- Injected anomaly scenarios for deterministic verification.
"""

import datetime
import numpy as np
import pandas as pd
import random
from typing import Dict, Any, Tuple

# Fix random seed for reproducible demo behavior
np.random.seed(42)
random.seed(42)

REGIONS = ["North", "South", "East", "West"]
CHANNELS = ["Direct Web", "Mobile App", "Marketplace Amazon", "Marketplace Flipkart", "B2B Enterprise"]
CATEGORIES = {
    "Electronics": ["PROD_LAPTOP_PRO", "PROD_HEADPHONES_ANC", "PROD_SMART_WATCH", "PROD_SMARTPHONE_X"],
    "Apparel": ["PROD_DENIM_JEANS", "PROD_COTTON_SHIRT", "PROD_WINTER_JACKET", "PROD_SNEAKERS_AIR"],
    "Home & Living": ["PROD_ROBOT_VACUUM", "PROD_AIR_PURIFIER", "PROD_DESK_CHAIR", "PROD_COFFEE_MAKER"],
    "Beauty & Wellness": ["PROD_FACE_SERUM", "PROD_SUNSCREEN_SPF50", "PROD_MASSAGE_GUN"]
}

BASE_PRICES = {
    "PROD_LAPTOP_PRO": 85000,
    "PROD_HEADPHONES_ANC": 12000,
    "PROD_SMART_WATCH": 18000,
    "PROD_SMARTPHONE_X": 65000, # New product (17 days history)
    "PROD_DENIM_JEANS": 3200,
    "PROD_COTTON_SHIRT": 1800,
    "PROD_WINTER_JACKET": 6500,
    "PROD_SNEAKERS_AIR": 7500,
    "PROD_ROBOT_VACUUM": 28000,
    "PROD_AIR_PURIFIER": 14500,
    "PROD_DESK_CHAIR": 12500,
    "PROD_COFFEE_MAKER": 8500,
    "PROD_FACE_SERUM": 1400,
    "PROD_SUNSCREEN_SPF50": 850,
    "PROD_MASSAGE_GUN": 4500
}

BASE_COST_MARGINS = {
    "Electronics": 0.28,
    "Apparel": 0.55,
    "Home & Living": 0.42,
    "Beauty & Wellness": 0.68
}

def generate_dataset(days: int = 120) -> Dict[str, pd.DataFrame]:
    """
    Generates synthetic multi-source business data with realistic distributions
    and ground-truth injected scenarios.
    """
    end_date = datetime.date(2026, 8, 30)
    start_date = end_date - datetime.timedelta(days=days)
    date_range = pd.date_range(start=start_date, end=end_date, freq="D")
    
    # 1. External Signals (Daily)
    external_rows = []
    for dt in date_range:
        for reg in REGIONS:
            is_weekend = dt.weekday() >= 5
            is_holiday = 1 if (dt.month == 8 and dt.day == 15) or (dt.month == 10 and dt.day >= 20 and dt.day <= 25) else 0
            
            # Competitor price index (100 is parity; <100 means competitor discounted)
            comp_index = 100.0 + np.random.normal(0, 2.5)
            # Competitor aggressive discount in South for Electronics in recent 10 days
            if reg == "South" and dt >= pd.Timestamp(end_date - datetime.timedelta(days=10)):
                comp_index = 88.0 + np.random.normal(0, 1.5)
                
            mkt_demand = 100.0 + (15.0 if is_holiday else (5.0 if is_weekend else 0.0)) + np.random.normal(0, 3.0)
            weather_impact = "Normal" if np.random.rand() > 0.1 else ("Heavy Rain" if reg == "West" else "Normal")
            
            external_rows.append({
                "date": dt.strftime("%Y-%m-%d"),
                "region": reg,
                "competitor_price_index": round(comp_index, 1),
                "market_demand_index": round(mkt_demand, 1),
                "holiday_flag": is_holiday,
                "weather_indicator": weather_impact,
                "recorded_at": (dt + datetime.timedelta(hours=23, minutes=50)).strftime("%Y-%m-%d %H:%M:%S")
            })
    df_external = pd.DataFrame(external_rows)

    # 2. Marketing Data (Daily, Regional, Channel)
    mkt_rows = []
    campaigns = ["CAMP_BRAND_AWARENESS", "CAMP_PERFORMANCE_SEARCH", "CAMP_SOCIAL_REELS", "CAMP_AFFILIATE_BOOST"]
    for dt in date_range:
        for reg in REGIONS:
            for ch in ["Direct Web", "Mobile App"]:
                for camp in campaigns:
                    base_spend = random.randint(15000, 65000)
                    # Simulate Scenario 2: Contradictory evidence in recent 5 days
                    # Marketing spend & clicks surged 25%, but attribution lag / mismatch
                    is_conflict_period = dt >= pd.Timestamp(end_date - datetime.timedelta(days=5)) and reg == "East"
                    if is_conflict_period:
                        base_spend = int(base_spend * 1.35)
                        
                    cpc = round(random.uniform(4.5, 12.0), 2)
                    clicks = int(base_spend / cpc)
                    impressions = clicks * random.randint(18, 45)
                    
                    if is_conflict_period:
                        # Stale / corrupted attribution: reports high attributed revenue despite conversion collapse
                        conversions = int(clicks * random.uniform(0.008, 0.012)) # Actually poor
                        attributed_rev = base_spend * random.uniform(3.5, 4.8) # Reported high by third-party tag
                        attribution_freshness = "Stale (26h lag - Pixel Sync Error)"
                    else:
                        conversions = int(clicks * random.uniform(0.025, 0.045))
                        attributed_rev = conversions * random.uniform(2500, 5000)
                        attribution_freshness = "Current (1h lag)"
                        
                    mkt_rows.append({
                        "date": dt.strftime("%Y-%m-%d"),
                        "campaign_id": camp,
                        "channel": ch,
                        "region": reg,
                        "campaign_spend": base_spend,
                        "impressions": impressions,
                        "clicks": clicks,
                        "conversions": conversions,
                        "attributed_revenue": round(attributed_rev, 2),
                        "attribution_quality": "Stale/Conflicted" if is_conflict_period else "Verified",
                        "refresh_cadence": "daily",
                        "last_updated": (dt + datetime.timedelta(hours=22)).strftime("%Y-%m-%d %H:%M:%S")
                    })
    df_marketing = pd.DataFrame(mkt_rows)

    # 3. Inventory Snapshots (6-Hour Grain)
    inv_rows = []
    snapshot_hours = [0, 6, 12, 18]
    for dt in date_range:
        for hr in snapshot_hours:
            snap_time = dt + datetime.timedelta(hours=hr)
            for cat, prods in CATEGORIES.items():
                for p_id in prods:
                    # Sparse history handling for SmartPhone X (only last 17 days exist)
                    if p_id == "PROD_SMARTPHONE_X" and dt < pd.Timestamp(end_date - datetime.timedelta(days=17)):
                        continue
                        
                    for reg in REGIONS:
                        base_demand = random.randint(30, 180)
                        
                        # INJECT SCENARIO 1: Severe Inventory Shortage in North region for Electronics (last 7 days)
                        is_north_electronics_shortage = (
                            reg == "North" and 
                            cat == "Electronics" and 
                            p_id in ["PROD_LAPTOP_PRO", "PROD_HEADPHONES_ANC", "PROD_SMART_WATCH"] and
                            dt >= pd.Timestamp(end_date - datetime.timedelta(days=7))
                        )
                        
                        if is_north_electronics_shortage:
                            available = int(base_demand * random.uniform(0.15, 0.35)) # Severe stockout!
                            stockout = 1
                            replenishment_delay_days = random.randint(6, 12)
                            lead_time_status = "Critical Inbound Port Congestion"
                        else:
                            available = int(base_demand * random.uniform(1.1, 1.8))
                            stockout = 0
                            replenishment_delay_days = random.randint(1, 2)
                            lead_time_status = "Normal"
                            
                        inv_rows.append({
                            "timestamp": snap_time.strftime("%Y-%m-%d %H:%M:%S"),
                            "date": dt.strftime("%Y-%m-%d"),
                            "snapshot_hour": hr,
                            "product_id": p_id,
                            "category": cat,
                            "region": reg,
                            "warehouse_id": f"WH_{reg.upper()}_01",
                            "available_units": available,
                            "demand_units": base_demand,
                            "stockout_flag": stockout,
                            "replenishment_delay_days": replenishment_delay_days,
                            "lead_time_status": lead_time_status,
                            "refresh_cadence": "6-hourly"
                        })
    df_inventory = pd.DataFrame(inv_rows)

    # 4. Sales Transactions (Aggregated & Granular)
    sales_rows = []
    order_counter = 100000
    
    for dt in date_range:
        for reg in REGIONS:
            for ch in CHANNELS:
                for cat, prods in CATEGORIES.items():
                    for p_id in prods:
                        # Skip SmartPhone X before its launch 17 days ago
                        if p_id == "PROD_SMARTPHONE_X" and dt < pd.Timestamp(end_date - datetime.timedelta(days=17)):
                            continue
                            
                        unit_price = BASE_PRICES[p_id]
                        margin_pct = BASE_COST_MARGINS[cat]
                        cost_per_unit = unit_price * (1 - margin_pct)
                        
                        # Base volume
                        base_qty = random.randint(10, 45)
                        
                        # Apply North Region Electronics Shortage impact on sales
                        is_north_electronics_shortage = (
                            reg == "North" and 
                            cat == "Electronics" and 
                            p_id in ["PROD_LAPTOP_PRO", "PROD_HEADPHONES_ANC", "PROD_SMART_WATCH"] and
                            dt >= pd.Timestamp(end_date - datetime.timedelta(days=7))
                        )
                        
                        if is_north_electronics_shortage:
                            # Sales volume drops 60-70% because goods are stocked out!
                            base_qty = int(base_qty * random.uniform(0.25, 0.40))
                            
                        # Apply East Region Contradictory Period (Conversion drop despite marketing)
                        if reg == "East" and dt >= pd.Timestamp(end_date - datetime.timedelta(days=5)):
                            base_qty = int(base_qty * random.uniform(0.70, 0.85))
                            
                        # Apply South Region Competitor price undercut
                        if reg == "South" and dt >= pd.Timestamp(end_date - datetime.timedelta(days=10)) and cat == "Electronics":
                            base_qty = int(base_qty * random.uniform(0.75, 0.90))

                        # Discount depth
                        discount_pct = 0.05 if random.random() > 0.3 else random.uniform(0.08, 0.22)
                        if p_id == "PROD_SMARTPHONE_X":
                            discount_pct = 0.02 # New launch discount
                            
                        actual_price = unit_price * (1 - discount_pct)
                        revenue = base_qty * actual_price
                        total_cost = base_qty * cost_per_unit
                        profit = revenue - total_cost
                        
                        # Granular orders simulated
                        num_orders = max(1, int(base_qty / random.uniform(1.1, 1.4)))
                        
                        for o_idx in range(num_orders):
                            order_counter += 1
                            item_qty = max(1, int(base_qty / num_orders))
                            item_rev = item_qty * actual_price
                            item_cost = item_qty * cost_per_unit
                            item_profit = item_rev - item_cost
                            
                            hour = random.randint(8, 22)
                            tx_time = dt + datetime.timedelta(hours=hour, minutes=random.randint(0, 59))
                            
                            sales_rows.append({
                                "order_id": f"ORD_{order_counter}",
                                "timestamp": tx_time.strftime("%Y-%m-%d %H:%M:%S"),
                                "date": dt.strftime("%Y-%m-%d"),
                                "customer_id": f"CUST_{random.randint(10000, 99999)}",
                                "product_id": p_id,
                                "category": cat,
                                "region": reg,
                                "channel": ch,
                                "quantity": item_qty,
                                "unit_price": unit_price,
                                "discount_pct": round(discount_pct, 4),
                                "revenue": round(item_rev, 2),
                                "cost": round(item_cost, 2),
                                "profit": round(item_profit, 2)
                            })
                            
    df_sales = pd.DataFrame(sales_rows)
    
    return {
        "sales": df_sales,
        "marketing": df_marketing,
        "inventory": df_inventory,
        "external": df_external
    }

if __name__ == "__main__":
    data = generate_dataset(30)
    print(f"Generated Sales: {len(data['sales'])} rows")
    print(f"Generated Marketing: {len(data['marketing'])} rows")
    print(f"Generated Inventory: {len(data['inventory'])} rows")
    print(f"Generated External: {len(data['external'])} rows")
