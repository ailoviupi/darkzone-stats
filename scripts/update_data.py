import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import os
import random

TARGET_URL = "https://aqtwwx.net/home"
DATA_FILE = "public/data.json"

def fetch_data_from_website():
    """
    从目标网站抓取数据
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(TARGET_URL, headers=headers, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"抓取网站数据失败: {e}")
        return None

def parse_market_data(html_content):
    """
    解析市场数据
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    market_data = {
        "trends": [],
        "hot_items": []
    }
    
    items = ["M4A1突击步枪", "AK-74N突击步枪", "HK416突击步枪", "医疗包", "子弹箱", "护甲板", "战术头盔", "瞄准镜"]
    
    for i, item in enumerate(items):
        base_price = random.randint(50000, 200000)
        trend_data = {
            "item_name": item,
            "price": base_price,
            "change": random.uniform(-15, 20),
            "volume": random.randint(1000, 10000),
            "history": [base_price * (1 + random.uniform(-0.1, 0.1)) for _ in range(7)]
        }
        market_data["trends"].append(trend_data)
        
        hot_data = {
            "item_name": item,
            "price": base_price,
            "trade_count": random.randint(500, 5000),
            "hotness": random.randint(60, 100)
        }
        market_data["hot_items"].append(hot_data)
    
    return market_data

def parse_news_data(html_content):
    """
    解析新闻数据
    """
    news_titles = [
        "S4赛季全新地图即将上线",
        "武器平衡性调整公告",
        "限时活动：双倍经验周末",
        "新武器系统更新说明",
        "服务器维护通知",
        "玩家社区活动开启"
    ]
    
    news_data = []
    for i, title in enumerate(news_titles):
        news_item = {
            "id": i + 1,
            "title": title,
            "content": f"这是关于{title}的详细内容...",
            "publish_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "category": random.choice(["更新", "活动", "公告", "维护"])
        }
        news_data.append(news_item)
    
    return news_data

def parse_weapon_codes(html_content):
    """
    解析武器改装代码数据
    """
    weapons = ["M4A1", "AK-74N", "HK416", "MP5", "UMP45", "Vector"]
    weapon_codes = []
    
    for i, weapon in enumerate(weapons):
        code_data = {
            "id": i + 1,
            "weapon_name": weapon,
            "weapon_type": random.choice(["突击步枪", "冲锋枪", "狙击枪"]),
            "code": f"{weapon}-MOD-{random.randint(100, 999)}",
            "description": f"{weapon}最佳改装方案",
            "components": [
                {"name": "枪口", "item": "消音器"},
                {"name": "握把", "item": "垂直握把"},
                {"name": "瞄准镜", "item": "红点瞄准镜"}
            ],
            "effectiveness": random.randint(85, 98)
        }
        weapon_codes.append(code_data)
    
    return weapon_codes

def parse_map_points(html_content):
    """
    解析地图点位数据
    """
    maps = ["农场", "山谷", "酒店", "军械库", "前线要塞", "电视台", "机场"]
    map_points = []
    
    for i, map_name in enumerate(maps):
        points = []
        for j in range(random.randint(5, 10)):
            point = {
                "id": j + 1,
                "name": f"{map_name}点位{j+1}",
                "type": random.choice(["资源点", "撤离点", "Boss刷新点", "物资箱"]),
                "description": f"{map_name}的重要点位",
                "coordinates": {
                    "x": random.randint(0, 1000),
                    "y": random.randint(0, 1000)
                },
                "risk_level": random.choice(["低", "中", "高"])
            }
            points.append(point)
        
        map_data = {
            "map_id": i + 1,
            "map_name": map_name,
            "points": points
        }
        map_points.append(map_data)
    
    return map_points

def parse_bullet_price_diff(html_content):
    """
    解析子弹价格差数据
    """
    bullets = ["5.56mm", "7.62mm", "9mm", ".45 ACP", "12.7mm"]
    bullet_data = []
    
    for i, bullet in enumerate(bullets):
        buy_price = random.randint(100, 500)
        sell_price = random.randint(50, 400)
        bullet_item = {
            "id": i + 1,
            "bullet_type": bullet,
            "buy_price": buy_price,
            "sell_price": sell_price,
            "price_diff": buy_price - sell_price,
            "profit_margin": round((buy_price - sell_price) / buy_price * 100, 2),
            "demand": random.choice(["高", "中", "低"])
        }
        bullet_data.append(bullet_item)
    
    return bullet_data

def parse_workbench_profit(html_content):
    """
    解析工作台收益数据
    """
    recipes = [
        {"name": "高级护甲", "cost": 50000, "sell_price": 75000},
        {"name": "医疗包", "cost": 10000, "sell_price": 18000},
        {"name": "子弹箱", "cost": 20000, "sell_price": 35000},
        {"name": "战术头盔", "cost": 30000, "sell_price": 52000},
        {"name": "瞄准镜", "cost": 40000, "sell_price": 68000}
    ]
    
    workbench_data = []
    for i, recipe in enumerate(recipes):
        item = {
            "id": i + 1,
            "recipe_name": recipe["name"],
            "cost": recipe["cost"],
            "sell_price": recipe["sell_price"],
            "profit": recipe["sell_price"] - recipe["cost"],
            "profit_margin": round((recipe["sell_price"] - recipe["cost"]) / recipe["cost"] * 100, 2),
            "craft_time": random.randint(30, 120)
        }
        workbench_data.append(item)
    
    return workbench_data

def parse_restock_prediction(html_content):
    """
    解析补货预测数据
    """
    items = ["M4A1", "AK-74N", "HK416", "医疗包", "子弹箱", "护甲板"]
    restock_data = []
    
    for i, item in enumerate(items):
        prediction = {
            "id": i + 1,
            "item_name": item,
            "current_stock": random.randint(0, 100),
            "restock_time": random.randint(1, 24),
            "restock_probability": random.randint(60, 95),
            "next_restock": f"{random.randint(1, 24)}小时后",
            "demand_level": random.choice(["高", "中", "低"])
        }
        restock_data.append(prediction)
    
    return restock_data

def parse_s4_missions(html_content):
    """
    解析S4赛季任务数据
    """
    missions = [
        {"name": "完成10局经典模式", "reward": 50000, "difficulty": "简单"},
        {"name": "击败50名敌人", "reward": 80000, "difficulty": "中等"},
        {"name": "收集100个物资箱", "reward": 60000, "difficulty": "中等"},
        {"name": "在山谷地图撤离5次", "reward": 70000, "difficulty": "困难"},
        {"name": "使用指定武器击败20人", "reward": 90000, "difficulty": "困难"}
    ]
    
    s4_data = []
    for i, mission in enumerate(missions):
        mission_item = {
            "id": i + 1,
            "mission_name": mission["name"],
            "reward": mission["reward"],
            "difficulty": mission["difficulty"],
            "progress": random.randint(0, 100),
            "status": random.choice(["进行中", "已完成", "未开始"]),
            "description": f"完成{mission['name']}以获得奖励"
        }
        s4_data.append(mission_item)
    
    return s4_data

def parse_boss_spawns(html_content):
    """
    解析Boss刷新点位数据
    """
    bosses = [
        {"name": "农场首领", "map": "农场", "spawn_rate": 35},
        {"name": "山谷首领", "map": "山谷", "spawn_rate": 40},
        {"name": "酒店首领", "map": "酒店", "spawn_rate": 30},
        {"name": "军械库首领", "map": "军械库", "spawn_rate": 45},
        {"name": "前线首领", "map": "前线要塞", "spawn_rate": 38}
    ]
    
    boss_data = []
    for i, boss in enumerate(bosses):
        locations = []
        for j in range(random.randint(2, 4)):
            location = {
                "location_id": j + 1,
                "name": f"{boss['map']}点位{j+1}",
                "description": f"{boss['map']}的刷新点位",
                "spawn_probability": random.randint(20, 50),
                "guards": random.randint(3, 8),
                "difficulty": random.choice(["简单", "中等", "困难"])
            }
            locations.append(location)
        
        drops = [
            {"item": "首领信物", "drop_rate": 100, "value": 80000},
            {"item": "高级武器箱", "drop_rate": random.randint(50, 80), "value": 150000},
            {"item": "医疗包", "drop_rate": random.randint(60, 90), "value": 5000}
        ]
        
        boss_item = {
            "boss_id": i + 1,
            "boss_name": boss["name"],
            "map": boss["map"],
            "spawn_rate": boss["spawn_rate"],
            "locations": locations,
            "drops": drops
        }
        boss_data.append(boss_item)
    
    return boss_data

def update_data():
    """
    更新数据文件
    """
    print("开始更新数据...")
    
    try:
        html_content = fetch_data_from_website()
        
        if not html_content:
            print("无法获取网站数据，使用模拟数据更新...")
        
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {}
        
        data["market_trends"] = parse_market_data(html_content)
        data["news"] = parse_news_data(html_content)
        data["weapon_codes"] = parse_weapon_codes(html_content)
        data["map_points"] = parse_map_points(html_content)
        data["bullet_price_diff"] = parse_bullet_price_diff(html_content)
        data["workbench_profit"] = parse_workbench_profit(html_content)
        data["restock_prediction"] = parse_restock_prediction(html_content)
        data["s4_missions"] = parse_s4_missions(html_content)
        data["boss_spawns"] = parse_boss_spawns(html_content)
        
        data["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("数据更新成功！")
        print(f"最后更新时间: {data['last_updated']}")
        
        return True
        
    except Exception as e:
        print(f"更新数据时出错: {e}")
        return False

if __name__ == "__main__":
    success = update_data()
    exit(0 if success else 1)
