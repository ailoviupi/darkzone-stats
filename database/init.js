const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'darkzone.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        level INTEGER DEFAULT 1,
        total_kills INTEGER DEFAULT 0,
        total_deaths INTEGER DEFAULT 0,
        total_extractions INTEGER DEFAULT 0,
        total_coins INTEGER DEFAULT 0,
        play_time INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS weapons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        damage INTEGER NOT NULL,
        fire_rate REAL NOT NULL,
        accuracy REAL NOT NULL,
        recoil REAL NOT NULL,
        magazine_size INTEGER NOT NULL,
        usage_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS map_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        map_name TEXT UNIQUE NOT NULL,
        player_count INTEGER DEFAULT 0,
        avg_duration REAL DEFAULT 0,
        extraction_rate REAL DEFAULT 0,
        difficulty REAL DEFAULT 0,
        loot_quality REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS gold_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        map_name TEXT NOT NULL,
        location_name TEXT NOT NULL,
        spawn_rate REAL DEFAULT 0,
        last_seen DATETIME,
        UNIQUE(map_name, location_name)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS economy_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE UNIQUE NOT NULL,
        total_coins_earned INTEGER DEFAULT 0,
        total_coins_spent INTEGER DEFAULT 0,
        avg_coins_per_player REAL DEFAULT 0,
        total_items_traded INTEGER DEFAULT 0
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER,
        category TEXT NOT NULL,
        score INTEGER NOT NULL,
        rank INTEGER,
        FOREIGN KEY (player_id) REFERENCES players(id),
        UNIQUE(player_id, category)
      )`);

      const insertSampleData = () => {
        const weapons = [
          ['AK-47', '突击步枪', 45, 600, 0.75, 0.6, 30, 15420],
          ['M4A1', '突击步枪', 42, 750, 0.82, 0.55, 30, 18250],
          ['AWM', '狙击步枪', 95, 40, 0.95, 0.9, 5, 8430],
          ['MP5', '冲锋枪', 32, 900, 0.85, 0.45, 30, 12560],
          ['USP', '手枪', 25, 400, 0.78, 0.35, 15, 9230]
        ];

        const weaponStmt = db.prepare('INSERT OR IGNORE INTO weapons (name, type, damage, fire_rate, accuracy, recoil, magazine_size, usage_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        weapons.forEach(w => weaponStmt.run(w));
        weaponStmt.finalize();

        const maps = [
          ['农场', 44300, 18.5, 67.8, 3.2, 4.1],
          ['山谷', 36100, 22.3, 58.4, 4.5, 3.8],
          ['北山', 27800, 25.7, 52.1, 5.2, 4.5],
          ['前线要塞', 17600, 28.4, 45.6, 6.0, 5.0]
        ];

        const mapStmt = db.prepare('INSERT OR IGNORE INTO map_stats (map_name, player_count, avg_duration, extraction_rate, difficulty, loot_quality) VALUES (?, ?, ?, ?, ?, ?)');
        maps.forEach(m => mapStmt.run(m));
        mapStmt.finalize();

        const goldLocations = [
          ['农场', '主楼顶层', 85, new Date(Date.now() - 120000)],
          ['农场', '粮仓地下室', 72, new Date(Date.now() - 300000)],
          ['农场', '拖拉机库', 68, new Date(Date.now() - 480000)],
          ['农场', '温室', 65, new Date(Date.now() - 720000)],
          ['山谷', '别墅二楼', 88, new Date(Date.now() - 60000)],
          ['山谷', '军火库', 76, new Date(Date.now() - 240000)],
          ['山谷', '防空洞', 71, new Date(Date.now() - 420000)],
          ['山谷', '加油站', 63, new Date(Date.now() - 600000)],
          ['北山', '酒店顶层', 90, new Date(Date.now() - 180000)],
          ['北山', '科研中心', 82, new Date(Date.now() - 360000)],
          ['北山', '发电厂', 75, new Date(Date.now() - 540000)],
          ['北山', '矿场', 69, new Date(Date.now() - 660000)],
          ['前线要塞', '指挥中心', 92, new Date(Date.now() - 120000)],
          ['前线要塞', '军械库', 84, new Date(Date.now() - 300000)],
          ['前线要塞', '监狱', 78, new Date(Date.now() - 480000)],
          ['前线要塞', '兵营', 72, new Date(Date.now() - 600000)]
        ];

        const goldStmt = db.prepare('INSERT OR IGNORE INTO gold_locations (map_name, location_name, spawn_rate, last_seen) VALUES (?, ?, ?, ?)');
        goldLocations.forEach(g => goldStmt.run(g));
        goldStmt.finalize();

        const players = [
          ['暗区猎手', 85, 15234, 3421, 8765, 5234000, 1250],
          ['战术大师', 78, 12345, 4567, 7654, 4890000, 1100],
          ['生存专家', 92, 18976, 2345, 9876, 6120000, 1450],
          ['突击先锋', 65, 8765, 5678, 6543, 3450000, 890],
          ['狙击之王', 88, 16543, 3210, 8901, 5670000, 1320]
        ];

        const playerStmt = db.prepare('INSERT OR IGNORE INTO players (username, level, total_kills, total_deaths, total_extractions, total_coins, play_time) VALUES (?, ?, ?, ?, ?, ?, ?)');
        players.forEach(p => playerStmt.run(p));
        playerStmt.finalize();

        const economyData = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          economyData.push([
            dateStr,
            Math.floor(Math.random() * 5000000) + 10000000,
            Math.floor(Math.random() * 3000000) + 5000000,
            Math.floor(Math.random() * 50000) + 30000,
            Math.floor(Math.random() * 100000) + 50000
          ]);
        }

        const economyStmt = db.prepare('INSERT OR IGNORE INTO economy_stats (date, total_coins_earned, total_coins_spent, avg_coins_per_player, total_items_traded) VALUES (?, ?, ?, ?, ?)');
        economyData.forEach(e => economyStmt.run(e));
        economyStmt.finalize();
      };

      insertSampleData();

      console.log('数据库初始化完成');
      resolve();
    });
  });
};

initDatabase()
  .then(() => {
    db.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('数据库初始化失败:', err);
    process.exit(1);
  });
