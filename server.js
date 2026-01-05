require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database', 'darkzone.db');
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

app.get('/api/player-stats', async (req, res) => {
  try {
    const totalPlayers = await dbGet('SELECT COUNT(*) as count FROM players');
    const activePlayers = await dbGet('SELECT COUNT(*) as count FROM players WHERE updated_at > datetime("now", "-7 days")');
    const avgLevel = await dbGet('SELECT AVG(level) as avg FROM players');
    const avgPlayTime = await dbGet('SELECT AVG(play_time) as avg FROM players');
    
    const mapStats = await dbQuery('SELECT map_name as name, player_count as playerCount FROM map_stats ORDER BY player_count DESC');
    const totalMapPlayers = mapStats.reduce((sum, m) => sum + m.playerCount, 0);
    const topMaps = mapStats.map(m => ({
      name: m.name,
      percentage: ((m.playerCount / totalMapPlayers) * 100).toFixed(1)
    }));

    res.json({
      totalPlayers: totalPlayers.count,
      activePlayers: activePlayers.count,
      avgLevel: avgLevel.avg ? avgLevel.avg.toFixed(1) : 0,
      avgPlayTime: avgPlayTime.avg ? Math.round(avgPlayTime.avg) : 0,
      topMaps
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/map-preferences', async (req, res) => {
  try {
    const maps = await dbQuery(`
      SELECT 
        map_name as name,
        player_count as playerCount,
        avg_duration as avgDuration,
        extraction_rate as extractionRate,
        difficulty,
        loot_quality as lootQuality
      FROM map_stats 
      ORDER BY player_count DESC
    `);
    res.json({ maps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gold-spawn-rate', async (req, res) => {
  try {
    const maps = await dbQuery('SELECT DISTINCT map_name FROM gold_locations ORDER BY map_name');
    
    const result = await Promise.all(maps.map(async (map) => {
      const locations = await dbQuery(`
        SELECT 
          location_name as location,
          spawn_rate as spawnRate,
          datetime(last_seen) as lastSeen
        FROM gold_locations 
        WHERE map_name = ? 
        ORDER BY spawn_rate DESC
      `, [map.map_name]);

      return {
        name: map.map_name,
        goldLocations: locations.map(loc => ({
          location: loc.location,
          spawnRate: loc.spawnRate,
          lastSeen: getTimeAgo(loc.lastSeen)
        }))
      };
    }));

    res.json({
      lastUpdated: new Date().toISOString(),
      maps: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gameplay-info', async (req, res) => {
  try {
    const gameModes = [
      {
        name: '经典模式',
        description: '传统撤离射击玩法，收集物资并成功撤离',
        playerCount: 85200,
        avgDuration: 20
      },
      {
        name: '团队竞技',
        description: '4v4团队对抗，消灭敌方队伍获得胜利',
        playerCount: 28400,
        avgDuration: 15
      },
      {
        name: '生存挑战',
        description: '单人或小队生存模式，坚持到最后',
        playerCount: 12400,
        avgDuration: 25
      }
    ];

    const tips = [
      '合理规划撤离路线，避免被埋伏',
      '优先收集高价值物资，注意背包容量',
      '熟悉地图布局，了解主要交战区域',
      '团队配合是成功的关键',
      '注意听声辨位，提前发现敌人'
    ];

    res.json({ gameModes, tips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/weapons', async (req, res) => {
  try {
    const { type, sort } = req.query;
    let sql = 'SELECT * FROM weapons';
    let params = [];

    if (type) {
      sql += ' WHERE type = ?';
      params.push(type);
    }

    if (sort) {
      const validSorts = ['damage', 'fire_rate', 'accuracy', 'usage_count'];
      if (validSorts.includes(sort)) {
        sql += ` ORDER BY ${sort} DESC`;
      }
    } else {
      sql += ' ORDER BY usage_count DESC';
    }

    const weapons = await dbQuery(sql, params);
    res.json({ weapons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/economy-stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await dbQuery(`
      SELECT 
        date,
        total_coins_earned as totalCoinsEarned,
        total_coins_spent as totalCoinsSpent,
        avg_coins_per_player as avgCoinsPerPlayer,
        total_items_traded as totalItemsTraded
      FROM economy_stats 
      ORDER BY date DESC 
      LIMIT ?
    `, [parseInt(days)]);

    res.json({ stats: stats.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { category = 'total_kills', limit = 10 } = req.query;
    
    const validCategories = ['total_kills', 'total_extractions', 'total_coins', 'level'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const columnMap = {
      'total_kills': 'total_kills',
      'total_extractions': 'total_extractions',
      'total_coins': 'total_coins',
      'level': 'level'
    };

    const players = await dbQuery(`
      SELECT 
        id,
        username,
        level,
        ${columnMap[category]} as score,
        total_kills,
        total_extractions,
        total_coins
      FROM players 
      ORDER BY ${columnMap[category]} DESC 
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({ 
      category,
      players: players.map((p, index) => ({
        rank: index + 1,
        username: p.username,
        level: p.level,
        score: p.score,
        stats: {
          kills: p.total_kills,
          extractions: p.total_extractions,
          coins: p.total_coins
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.query;

    if (!['player-stats', 'map-preferences', 'weapons', 'economy-stats', 'leaderboard'].includes(data)) {
      return res.status(400).json({ error: 'Invalid data type' });
    }

    let exportData;
    let filename;

    switch (data) {
      case 'player-stats':
        exportData = await dbQuery('SELECT * FROM players');
        filename = 'player_stats';
        break;
      case 'map-preferences':
        exportData = await dbQuery('SELECT * FROM map_stats');
        filename = 'map_preferences';
        break;
      case 'weapons':
        exportData = await dbQuery('SELECT * FROM weapons');
        filename = 'weapons';
        break;
      case 'economy-stats':
        exportData = await dbQuery('SELECT * FROM economy_stats');
        filename = 'economy_stats';
        break;
      case 'leaderboard':
        exportData = await dbQuery('SELECT * FROM players ORDER BY total_kills DESC LIMIT 100');
        filename = 'leaderboard';
        break;
    }

    if (type === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
      res.json(exportData);
    } else if (type === 'csv') {
      const headers = Object.keys(exportData[0]).join(',');
      const rows = exportData.map(row => Object.values(row).join(',')).join('\n');
      const csv = headers + '\n' + rows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      res.send(csv);
    } else {
      res.status(400).json({ error: 'Invalid export type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }

    let results = {};

    if (type === 'all' || type === 'players') {
      results.players = await dbQuery(`
        SELECT username, level, total_kills, total_coins 
        FROM players 
        WHERE username LIKE ?
        LIMIT 10
      `, [`%${q}%`]);
    }

    if (type === 'all' || type === 'weapons') {
      results.weapons = await dbQuery(`
        SELECT name, type, damage, usage_count 
        FROM weapons 
        WHERE name LIKE ?
        LIMIT 10
      `, [`%${q}%`]);
    }

    if (type === 'all' || type === 'maps') {
      results.maps = await dbQuery(`
        SELECT map_name, player_count, difficulty, loot_quality 
        FROM map_stats 
        WHERE map_name LIKE ?
      `, [`%${q}%`]);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function getTimeAgo(dateString) {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}小时前`;
  return `${Math.floor(diffMins / 1440)}天前`;
}

io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id);

  socket.on('subscribe-updates', () => {
    socket.join('updates');
  });

  socket.on('disconnect', () => {
    console.log('客户端已断开:', socket.id);
  });
});

setInterval(async () => {
  try {
    const goldLocations = await dbQuery(`
      SELECT map_name, location_name, spawn_rate 
      FROM gold_locations 
      ORDER BY RANDOM() 
      LIMIT 5
    `);
    
    io.to('updates').emit('gold-update', {
      timestamp: new Date().toISOString(),
      updates: goldLocations.map(loc => ({
        map: loc.map_name,
        location: loc.location_name,
        newSpawnRate: Math.min(100, loc.spawn_rate + Math.floor(Math.random() * 10) - 5)
      }))
    });
  } catch (error) {
    console.error('实时更新错误:', error);
  }
}, 30000);

httpServer.listen(PORT, () => {
  console.log(`暗区突围-无限服务器运行在 http://localhost:${PORT}`);
  console.log(`WebSocket服务器已启动`);
});
