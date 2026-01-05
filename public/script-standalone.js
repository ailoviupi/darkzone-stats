document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    let mapChart = null;
    let economyChart = null;
    let economyLineChart = null;
    let weaponRadarChart = null;
    let gameData = null;

    const loadingOverlay = document.getElementById('loading-overlay');
    const toast = document.getElementById('toast');

    function showLoading() {
        loadingOverlay.classList.add('active');
    }

    function hideLoading() {
        loadingOverlay.classList.remove('active');
    }

    function showToast(message, type = 'info') {
        toast.textContent = message;
        toast.className = 'toast show';
        
        if (type === 'success') {
            toast.classList.add('success');
        } else if (type === 'error') {
            toast.classList.add('error');
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    async function loadData() {
        try {
            const response = await fetch('data.json');
            gameData = await response.json();
            console.log('数据加载成功:', gameData);
            return gameData;
        } catch (error) {
            console.error('加载数据失败:', error);
            showToast('加载数据失败', 'error');
            return null;
        }
    }

    initSearch();
    initWeaponFilters();
    initLeaderboardControls();
    initExportButtons();

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });

            if (sectionId === 'player-stats') {
                loadPlayerStats();
            } else if (sectionId === 'map-preferences') {
                loadMapPreferences();
            } else if (sectionId === 'gold-spawn') {
                loadGoldSpawnRate();
            } else if (sectionId === 'gameplay') {
                loadGameplayInfo();
            } else if (sectionId === 'weapons') {
                loadWeapons();
            } else if (sectionId === 'economy') {
                loadEconomyStats();
            } else if (sectionId === 'leaderboard') {
                loadLeaderboard();
            } else if (sectionId === 'bullet-price-diff') {
                loadBulletPriceDiff();
            } else if (sectionId === 'workbench-profit') {
                loadWorkbenchProfit();
            } else if (sectionId === 'mission-flow') {
                loadMissionFlow();
            } else if (sectionId === 'restock-prediction') {
                loadRestockPrediction();
            } else if (sectionId === 'market-trends') {
                loadMarketTrends();
            } else if (sectionId === 'market-hot') {
                loadMarketHot();
            } else if (sectionId === 'market-news') {
                loadMarketNews();
            } else if (sectionId === 'weapon-codes') {
                loadWeaponCodes();
            } else if (sectionId === 'map-points') {
                loadMapPoints();
            }
        });
    });

    loadData().then(() => {
        loadGameplayInfo();
    });

    function loadGameplayInfo() {
        if (!gameData) return;
        
        showLoading();
        
        const gameModes = gameData.game_modes;
        
        document.getElementById('classic-players').textContent = gameModes.classic.online_players.toLocaleString();
        document.getElementById('classic-duration').textContent = gameModes.classic.average_duration;
        
        document.getElementById('team-players').textContent = gameModes.team.online_players.toLocaleString();
        document.getElementById('team-duration').textContent = gameModes.team.average_duration;
        
        document.getElementById('survival-players').textContent = gameModes.survival.online_players.toLocaleString();
        document.getElementById('survival-duration').textContent = gameModes.survival.average_duration;
        
        const tipsList = document.getElementById('game-tips');
        const tips = [
            '合理搭配装备，根据地图特点选择武器',
            '注意观察环境，利用掩体进行战术移动',
            '团队模式中与队友保持沟通，协同作战',
            '撤离时选择安全的撤离点，避免被伏击',
            '收集物资时优先考虑高价值物品'
        ];
        tipsList.innerHTML = '';
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
        
        showToast('游戏玩法信息加载成功', 'success');
        hideLoading();
    }

    function loadPlayerStats() {
        if (!gameData) return;
        
        const stats = gameData.stats;
        document.getElementById('total-players').textContent = stats.total_players.toLocaleString();
        document.getElementById('active-players').textContent = stats.active_players.toLocaleString();
        document.getElementById('avg-level').textContent = '52.3';
        document.getElementById('avg-playtime').textContent = '3.5 小时';

        updateMapChart(gameData.map_preferences.slice(0, 4));
    }

    function updateMapChart(topMaps) {
        const ctx = document.getElementById('mapChart').getContext('2d');
        
        if (mapChart) {
            mapChart.destroy();
        }

        mapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topMaps.map(map => map.map_name),
                datasets: [{
                    label: '玩家占比 (%)',
                    data: topMaps.map(map => map.percentage),
                    backgroundColor: [
                        'rgba(233, 69, 96, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(255, 205, 86, 0.8)'
                    ],
                    borderColor: [
                        'rgba(233, 69, 96, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            color: '#e0e0e0',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    function loadMapPreferences() {
        if (!gameData) return;
        
        const mapCards = document.querySelectorAll('.map-card');
        const difficulties = ['中等', '困难', '极难', '困难', '中等'];
        const lootQualities = ['7', '8', '9', '8', '7'];
        
        gameData.map_preferences.forEach((map, index) => {
            if (mapCards[index]) {
                const stats = mapCards[index].querySelector('.map-stats');
                stats.innerHTML = `
                    <p>玩家数量: <strong>${map.play_count.toLocaleString()}</strong></p>
                    <p>平均时长: <strong>${18 + index * 2}</strong> 分钟</p>
                    <p>撤离成功率: <strong>${(map.avg_extractions * 100).toFixed(0)}</strong>%</p>
                    <p>难度: <strong>${difficulties[index]}</strong>/10</p>
                    <p>物资质量: <strong>${lootQualities[index]}</strong>/10</p>
                `;
            }
        });
    }

    function loadGoldSpawnRate() {
        if (!gameData) return;
        
        const updateTime = new Date();
        document.getElementById('last-updated').textContent = updateTime.toLocaleString('zh-CN');

        const goldMaps = document.querySelectorAll('.gold-map');
        const goldMapsData = Object.values(gameData.gold_spawn);
        
        goldMapsData.forEach((mapData, mapIndex) => {
            if (goldMaps[mapIndex]) {
                const tbody = goldMaps[mapIndex].querySelector('tbody');
                tbody.innerHTML = '';
                
                const locations = [
                    { location: '主楼', spawnRate: mapData.spawn_rate, lastSeen: '5分钟前' },
                    { location: '仓库', spawnRate: mapData.spawn_rate * 0.8, lastSeen: '12分钟前' },
                    { location: '地下室', spawnRate: mapData.spawn_rate * 0.6, lastSeen: '20分钟前' }
                ];
                
                locations.forEach(loc => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${loc.location}</td>
                        <td class="spawn-rate">${loc.spawnRate.toFixed(1)}%</td>
                        <td>${loc.lastSeen}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        const performSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                alert('请输入至少2个字符进行搜索');
                return;
            }
            
            if (!gameData) {
                alert('数据尚未加载');
                return;
            }

            const results = {
                players: [],
                weapons: [],
                maps: []
            };

            gameData.leaderboard.kills.forEach(player => {
                if (player.username.toLowerCase().includes(query)) {
                    results.players.push(player);
                }
            });

            gameData.weapons.forEach(weapon => {
                if (weapon.name.toLowerCase().includes(query) || weapon.type.toLowerCase().includes(query)) {
                    results.weapons.push(weapon);
                }
            });

            gameData.map_preferences.forEach(map => {
                if (map.map_name.toLowerCase().includes(query)) {
                    results.maps.push(map);
                }
            });

            displaySearchResults(results);
            showSection('search-results');
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function displaySearchResults(results) {
        const content = document.getElementById('search-results-content');
        let html = '';

        if (!results.players && !results.weapons && !results.maps) {
            html = '<div class="no-results">没有找到相关结果</div>';
        } else {
            if (results.players && results.players.length > 0) {
                html += '<div class="search-result-section"><h3>玩家</h3>';
                results.players.forEach(player => {
                    html += `<div class="search-result-item">
                        <strong>${player.username}</strong>
                        <span>等级: ${player.level} | 击杀: ${player.total_kills} | 科恩币: ${(player.total_coins || 0).toLocaleString()}</span>
                    </div>`;
                });
                html += '</div>';
            }

            if (results.weapons && results.weapons.length > 0) {
                html += '<div class="search-result-section"><h3>武器</h3>';
                results.weapons.forEach(weapon => {
                    html += `<div class="search-result-item">
                        <strong>${weapon.name}</strong>
                        <span>类型: ${weapon.type} | 伤害: ${weapon.damage} | 使用次数: ${weapon.usage_count}</span>
                    </div>`;
                });
                html += '</div>';
            }

            if (results.maps && results.maps.length > 0) {
                html += '<div class="search-result-section"><h3>地图</h3>';
                results.maps.forEach(map => {
                    html += `<div class="search-result-item">
                        <strong>${map.map_name}</strong>
                        <span>玩家数: ${map.play_count.toLocaleString()} | 撤离率: ${(map.avg_extractions * 100).toFixed(0)}%</span>
                    </div>`;
                });
                html += '</div>';
            }
        }

        content.innerHTML = html;
    }

    function showSection(sectionId) {
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    }

    function initWeaponFilters() {
        const typeFilter = document.getElementById('weapon-type-filter');
        const sortFilter = document.getElementById('weapon-sort-filter');

        typeFilter.addEventListener('change', loadWeapons);
        sortFilter.addEventListener('change', loadWeapons);
    }

    function loadWeapons() {
        if (!gameData) return;
        
        const typeFilter = document.getElementById('weapon-type-filter');
        const sortFilter = document.getElementById('weapon-sort-filter');
        
        let weapons = [...gameData.weapons];
        
        if (typeFilter.value) {
            weapons = weapons.filter(w => w.type === typeFilter.value);
        }
        
        if (sortFilter.value) {
            weapons.sort((a, b) => b[sortFilter.value] - a[sortFilter.value]);
        }

        showLoading();
        displayWeapons(weapons);
        updateWeaponRadarChart(weapons.slice(0, 5));
        showToast(`已加载 ${weapons.length} 个武器`, 'success');
        hideLoading();
    }

    function updateWeaponRadarChart(weapons) {
        const ctx = document.getElementById('weaponRadarChart').getContext('2d');
        
        if (weaponRadarChart) {
            weaponRadarChart.destroy();
        }

        const colors = [
            'rgba(233, 69, 96, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 205, 86, 0.7)',
            'rgba(54, 162, 235, 0.7)'
        ];

        const borderColors = [
            'rgba(233, 69, 96, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(54, 162, 235, 1)'
        ];

        weaponRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['伤害', '射速', '精度', '后坐力控制', '弹匣容量'],
                datasets: weapons.map((weapon, index) => ({
                    label: weapon.name,
                    data: [
                        (weapon.damage / 100) * 100,
                        (weapon.fire_rate / 1000) * 100,
                        weapon.accuracy * 100,
                        (1 - weapon.recoil) * 100,
                        (weapon.magazine_size / 100) * 100
                    ],
                    backgroundColor: colors[index],
                    borderColor: borderColors[index],
                    borderWidth: 2,
                    pointBackgroundColor: borderColors[index],
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        },
                        pointLabels: {
                            color: '#e0e0e0',
                            font: {
                                size: 13
                            }
                        },
                        ticks: {
                            color: '#e0e0e0',
                            backdropColor: 'transparent',
                            stepSize: 20
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    function displayWeapons(weapons) {
        const grid = document.getElementById('weapons-grid');
        
        if (weapons.length === 0) {
            grid.innerHTML = '<div class="no-results">没有找到武器数据</div>';
            return;
        }

        grid.innerHTML = weapons.map(weapon => `
            <div class="weapon-card">
                <h3>${weapon.name}</h3>
                <span class="weapon-type">${weapon.type}</span>
                <div class="weapon-stats">
                    <p>伤害: <strong>${weapon.damage}</strong></p>
                    <p>射速: <strong>${weapon.fire_rate}/min</strong></p>
                    <p>精度: <strong>${(weapon.accuracy * 100).toFixed(0)}%</strong></p>
                    <p>后坐力: <strong>${(weapon.recoil * 100).toFixed(0)}%</strong></p>
                    <p>弹匣: <strong>${weapon.magazine_size}</strong></p>
                    <p>使用: <strong>${weapon.usage_count.toLocaleString()}</strong></p>
                </div>
            </div>
        `).join('');
    }

    function loadEconomyStats() {
        if (!gameData) return;
        
        showLoading();
        const today = gameData.economy[gameData.economy.length - 1];
        
        document.getElementById('today-coins-earned').textContent = (today.total_coins * 0.6).toLocaleString();
        document.getElementById('today-coins-spent').textContent = (today.total_coins * 0.4).toLocaleString();
        document.getElementById('avg-coins').textContent = today.avg_coins_per_player.toLocaleString();
        document.getElementById('today-trades').textContent = today.transactions.toLocaleString();

        updateEconomyChart(gameData.economy);
        showToast('经济统计数据加载成功', 'success');
        hideLoading();
    }

    function updateEconomyChart(economyData) {
        const ctx = document.getElementById('economyChart').getContext('2d');
        
        if (economyChart) {
            economyChart.destroy();
        }

        economyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: economyData.map(s => s.date.slice(5)),
                datasets: [
                    {
                        label: '科恩币收入',
                        data: economyData.map(s => s.total_coins * 0.6),
                        borderColor: 'rgba(233, 69, 96, 1)',
                        backgroundColor: 'rgba(233, 69, 96, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '科恩币支出',
                        data: economyData.map(s => s.total_coins * 0.4),
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#e0e0e0',
                            callback: function(value) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });

        updateEconomyLineChart(economyData);
    }

    function updateEconomyLineChart(economyData) {
        const ctx = document.getElementById('economyLineChart').getContext('2d');
        
        if (economyLineChart) {
            economyLineChart.destroy();
        }

        economyLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: economyData.map(s => s.date.slice(5)),
                datasets: [
                    {
                        label: '科恩币净收入',
                        data: economyData.map(s => s.total_coins * 0.2),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return '净收入: ' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: '#e0e0e0',
                            callback: function(value) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e0e0e0'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    function initLeaderboardControls() {
        const categorySelect = document.getElementById('leaderboard-category');
        
        categorySelect.addEventListener('change', () => {
            loadLeaderboard();
        });
    }

    function loadLeaderboard() {
        if (!gameData) return;
        
        const categorySelect = document.getElementById('leaderboard-category');
        const category = categorySelect.value;
        
        let data = [];
        let title = '';
        
        switch(category) {
            case 'kills':
                data = gameData.leaderboard.kills;
                title = '击杀排行榜';
                break;
            case 'extractions':
                data = gameData.leaderboard.extractions;
                title = '撤离排行榜';
                break;
            case 'coins':
                data = gameData.leaderboard.coins;
                title = '科恩币排行榜';
                break;
            case 'level':
                data = gameData.leaderboard.level;
                title = '等级排行榜';
                break;
        }
        
        const tbody = document.querySelector('#leaderboard tbody');
        tbody.innerHTML = data.map(player => {
            let value = '';
            if (category === 'kills') {
                value = player.total_kills.toLocaleString();
            } else if (category === 'extractions') {
                value = player.total_extractions.toLocaleString();
            } else if (category === 'coins') {
                value = player.total_coins.toLocaleString();
            } else if (category === 'level') {
                value = player.level;
            }
            
            return `
                <tr>
                    <td class="rank rank-${player.rank}">${player.rank}</td>
                    <td class="username">${player.username}</td>
                    <td class="value">${value}</td>
                    <td class="level">Lv.${player.level}</td>
                </tr>
            `;
        }).join('');
        
        document.querySelector('#leaderboard h2').textContent = title;
    }

    function initExportButtons() {
        const exportWeaponsCsv = document.getElementById('export-weapons-csv');
        const exportWeaponsJson = document.getElementById('export-weapons-json');
        const exportLeaderboardCsv = document.getElementById('export-leaderboard-csv');
        const exportLeaderboardJson = document.getElementById('export-leaderboard-json');
        const exportEconomyCsv = document.getElementById('export-economy-csv');
        const exportEconomyJson = document.getElementById('export-economy-json');
        const exportBulletCsv = document.getElementById('export-bullet-csv');
        const exportBulletJson = document.getElementById('export-bullet-json');
        const exportWorkbenchCsv = document.getElementById('export-workbench-csv');
        const exportWorkbenchJson = document.getElementById('export-workbench-json');
        const exportMissionCsv = document.getElementById('export-mission-csv');
        const exportMissionJson = document.getElementById('export-mission-json');
        const exportRestockCsv = document.getElementById('export-restock-csv');
        const exportRestockJson = document.getElementById('export-restock-json');

        exportWeaponsCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.weapons, 'weapons.csv');
            showToast('武器数据已导出为CSV', 'success');
        });

        exportWeaponsJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.weapons, 'weapons.json');
            showToast('武器数据已导出为JSON', 'success');
        });

        exportLeaderboardCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.leaderboard.kills, 'leaderboard.csv');
            showToast('排行榜数据已导出为CSV', 'success');
        });

        exportLeaderboardJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.leaderboard.kills, 'leaderboard.json');
            showToast('排行榜数据已导出为JSON', 'success');
        });

        exportEconomyCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.economy, 'economy.csv');
            showToast('经济数据已导出为CSV', 'success');
        });

        exportEconomyJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.economy, 'economy.json');
            showToast('经济数据已导出为JSON', 'success');
        });

        exportBulletCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.bullet_price_diff, 'bullet-price-diff.csv');
            showToast('子弹差价榜已导出为CSV', 'success');
        });

        exportBulletJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.bullet_price_diff, 'bullet-price-diff.json');
            showToast('子弹差价榜已导出为JSON', 'success');
        });

        exportWorkbenchCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.workbench_profit, 'workbench-profit.csv');
            showToast('工作台利润排行已导出为CSV', 'success');
        });

        exportWorkbenchJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.workbench_profit, 'workbench-profit.json');
            showToast('工作台利润排行已导出为JSON', 'success');
        });

        exportMissionCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.mission_flow, 'mission-flow.csv');
            showToast('任务流程已导出为CSV', 'success');
        });

        exportMissionJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.mission_flow, 'mission-flow.json');
            showToast('任务流程已导出为JSON', 'success');
        });

        exportRestockCsv.addEventListener('click', () => {
            if (!gameData) return;
            exportToCSV(gameData.restock_prediction, 'restock-prediction.csv');
            showToast('补货预测已导出为CSV', 'success');
        });

        exportRestockJson.addEventListener('click', () => {
            if (!gameData) return;
            exportToJSON(gameData.restock_prediction, 'restock-prediction.json');
            showToast('补货预测已导出为JSON', 'success');
        });
    }

    function loadBulletPriceDiff() {
        if (!gameData) return;
        
        showLoading();
        const sortSelect = document.getElementById('bullet-sort');
        let bullets = [...gameData.bullet_price_diff];
        
        if (sortSelect.value === 'profit_rate') {
            bullets.sort((a, b) => b.profit_rate - a.profit_rate);
        } else if (sortSelect.value === 'profit') {
            bullets.sort((a, b) => b.profit - a.profit);
        } else if (sortSelect.value === 'demand') {
            const demandOrder = { '高': 3, '中': 2, '低': 1 };
            bullets.sort((a, b) => demandOrder[b.demand] - demandOrder[a.demand]);
        }
        
        const tbody = document.getElementById('bullet-price-diff-body');
        tbody.innerHTML = bullets.map(bullet => `
            <tr>
                <td>${bullet.bullet_name}</td>
                <td>${bullet.buy_price.toLocaleString()}</td>
                <td>${bullet.sell_price.toLocaleString()}</td>
                <td class="profit-positive">${bullet.profit.toLocaleString()}</td>
                <td>${bullet.profit_rate.toFixed(1)}%</td>
                <td class="demand-${bullet.demand}">${bullet.demand}</td>
            </tr>
        `).join('');
        
        sortSelect.onchange = loadBulletPriceDiff;
        showToast('子弹差价榜加载成功', 'success');
        hideLoading();
    }

    function loadWorkbenchProfit() {
        if (!gameData) return;
        
        showLoading();
        const sortSelect = document.getElementById('workbench-sort');
        let items = [...gameData.workbench_profit];
        
        if (sortSelect.value === 'profit_rate') {
            items.sort((a, b) => b.profit_rate - a.profit_rate);
        } else if (sortSelect.value === 'profit') {
            items.sort((a, b) => b.profit - a.profit);
        } else if (sortSelect.value === 'difficulty') {
            const difficultyOrder = { '困难': 3, '中等': 2, '简单': 1 };
            items.sort((a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]);
        }
        
        const tbody = document.getElementById('workbench-profit-body');
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td>${item.craft_time}</td>
                <td>${item.materials_cost.toLocaleString()}</td>
                <td>${item.sell_price.toLocaleString()}</td>
                <td class="profit-positive">${item.profit.toLocaleString()}</td>
                <td>${item.profit_rate.toFixed(1)}%</td>
                <td class="difficulty-${item.difficulty}">${item.difficulty}</td>
            </tr>
        `).join('');
        
        sortSelect.onchange = loadWorkbenchProfit;
        showToast('工作台利润排行加载成功', 'success');
        hideLoading();
    }

    function loadMissionFlow() {
        if (!gameData) return;
        
        showLoading();
        const filterSelect = document.getElementById('mission-filter');
        let missions = [...gameData.mission_flow];
        
        if (filterSelect.value === 'completed') {
            missions = missions.filter(m => m.stage === '完成');
        } else if (filterSelect.value === 'in_progress') {
            missions = missions.filter(m => m.stage === '进行中');
        } else if (filterSelect.value === 'not_started') {
            missions = missions.filter(m => m.stage === '未开始');
        }
        
        const content = document.getElementById('mission-flow-content');
        content.innerHTML = missions.map(mission => `
            <div class="mission-card">
                <div class="mission-header">
                    <h3>${mission.mission_name}</h3>
                    <span class="mission-status status-${mission.stage}">${mission.stage}</span>
                </div>
                <div class="mission-stages">
                    ${mission.stages.map(stage => `
                        <div class="mission-stage stage-${stage.status}">
                            <div class="stage-info">
                                <h4>${stage.stage_name}</h4>
                                <p>${stage.description}</p>
                            </div>
                            <div class="stage-reward">
                                <span class="reward-amount">${stage.reward.toLocaleString()}</span>
                                <span class="reward-label">科恩币</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        filterSelect.onchange = loadMissionFlow;
        showToast('任务流程加载成功', 'success');
        hideLoading();
    }

    function loadRestockPrediction() {
        if (!gameData) return;
        
        showLoading();
        const sortSelect = document.getElementById('restock-sort');
        let items = [...gameData.restock_prediction];
        
        if (sortSelect.value === 'urgency') {
            const urgencyOrder = { '极高': 4, '高': 3, '中': 2, '低': 1 };
            items.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);
        } else if (sortSelect.value === 'probability') {
            items.sort((a, b) => b.probability - a.probability);
        } else if (sortSelect.value === 'restock_time') {
            items.sort((a, b) => new Date(a.restock_time) - new Date(b.restock_time));
        }
        
        const tbody = document.getElementById('restock-prediction-body');
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.item_name}</td>
                <td>${item.current_stock}</td>
                <td>${item.restock_time}</td>
                <td>${item.restock_quantity}</td>
                <td>${item.probability}%</td>
                <td class="urgency-${item.urgency}">${item.urgency}</td>
            </tr>
        `).join('');
        
        sortSelect.onchange = loadRestockPrediction;
        showToast('补货预测加载成功', 'success');
        hideLoading();
    }

    function exportToCSV(data, filename) {
        if (!data || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportToJSON(data, filename) {
        if (!data) return;
        
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function loadMarketTrends() {
        if (!gameData) return;
        
        showLoading();
        const timeFilter = document.getElementById('market-time-filter');
        const tabs = document.querySelectorAll('.market-tab');
        let currentTab = 'rise';
        
        const updateTrends = () => {
            let data = currentTab === 'rise' ? gameData.market_trends.rise : gameData.market_trends.fall;
            const tbody = document.getElementById('market-trends-body');
            
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td class="rank rank-${item.rank}">${item.rank}</td>
                    <td class="item-name">${item.item_name}</td>
                    <td>${item.current_price.toLocaleString()}</td>
                    <td class="change-${item.change_rate >= 0 ? 'positive' : 'negative'}">${item.change_rate >= 0 ? '+' : ''}${item.change_rate}%</td>
                    <td class="change-${item.change_amount >= 0 ? 'positive' : 'negative'}">${item.change_amount >= 0 ? '+' : ''}${item.change_amount.toLocaleString()}</td>
                </tr>
            `).join('');
        };
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                updateTrends();
            });
        });
        
        timeFilter.addEventListener('change', () => {
            showToast(`已切换至${timeFilter.options[timeFilter.selectedIndex].text}`, 'info');
            updateTrends();
        });
        
        updateTrends();
        showToast('市场涨跌幅排行加载成功', 'success');
        hideLoading();
    }

    function loadMarketHot() {
        if (!gameData) return;
        
        showLoading();
        const hotTabs = document.querySelectorAll('.hot-tab');
        let currentTab = 'items';
        
        const updateHotData = () => {
            let data;
            let title;
            
            switch(currentTab) {
                case 'items':
                    data = gameData.market_hot.items;
                    title = '热门物品';
                    break;
                case 'keys':
                    data = gameData.market_hot.keys;
                    title = '热门钥匙';
                    break;
                case 'price':
                    data = gameData.market_hot.price;
                    title = '价格排行榜';
                    break;
            }
            
            const tbody = document.getElementById('market-hot-body');
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td class="rank rank-${item.rank}">${item.rank}</td>
                    <td class="item-name">${item.item_name}</td>
                    <td>${item.current_price.toLocaleString()}</td>
                    <td>${item.trade_count.toLocaleString()}</td>
                    <td>${item.trend}</td>
                </tr>
            `).join('');
            
            document.querySelector('#market-hot h2').textContent = title;
        };
        
        hotTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                hotTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                updateHotData();
            });
        });
        
        updateHotData();
        showToast('市场热度排行加载成功', 'success');
        hideLoading();
    }

    function loadMarketNews() {
        if (!gameData) return;
        
        showLoading();
        const newsContainer = document.getElementById('market-news-content');
        
        newsContainer.innerHTML = gameData.market_news.map(news => `
            <div class="news-item">
                <div class="news-header">
                    <span class="news-time">${news.time}</span>
                    <span class="news-type type-${news.type}">${news.type}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-content">${news.content}</p>
                <div class="news-impact">
                    <span>影响: ${news.impact}</span>
                </div>
            </div>
        `).join('');
        
        showToast('市场快讯加载成功', 'success');
        hideLoading();
    }

    function loadWeaponCodes() {
        if (!gameData) return;
        
        showLoading();
        const weaponTypeFilter = document.getElementById('weapon-code-type-filter');
        let codes = [...gameData.weapon_codes];
        
        if (weaponTypeFilter.value) {
            codes = codes.filter(c => c.weapon_type === weaponTypeFilter.value);
        }
        
        const container = document.getElementById('weapon-codes-content');
        container.innerHTML = codes.map(code => `
            <div class="weapon-code-card">
                <div class="code-header">
                    <h3>${code.weapon_name}</h3>
                    <span class="weapon-type">${code.weapon_type}</span>
                </div>
                <div class="code-content">
                    <div class="code-block">
                        <span class="copy-btn" onclick="copyCode('${code.code}')">复制</span>
                        <pre>${code.code}</pre>
                    </div>
                </div>
                <div class="code-stats">
                    <span>使用次数: ${code.usage_count.toLocaleString()}</span>
                    <span>收藏: ${code.favorites.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
        
        weaponTypeFilter.onchange = loadWeaponCodes;
        showToast('改枪码加载成功', 'success');
        hideLoading();
    }

    function copyCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            showToast('改枪码已复制到剪贴板', 'success');
        }).catch(() => {
            showToast('复制失败', 'error');
        });
    }

    function loadMapPoints() {
        if (!gameData) return;
        
        showLoading();
        const mapTypeFilter = document.getElementById('map-points-type-filter');
        let mapType = mapTypeFilter.value;
        
        if (!mapType) {
            const mapTypes = Object.keys(gameData.map_points);
            mapType = mapTypes[0];
        }
        
        const mapData = gameData.map_points[mapType];
        
        if (!mapData) {
            document.getElementById('map-points-content').innerHTML = '<div class="no-results">暂无该地图数据</div>';
            hideLoading();
            return;
        }
        
        const container = document.getElementById('map-points-content');
        container.innerHTML = `
            <div class="map-info">
                <h3>${mapData.map_name}</h3>
                <p>${mapData.description}</p>
            </div>
            <div class="points-list">
                ${mapData.points.map(point => `
                    <div class="point-card">
                        <div class="point-header">
                            <h4>${point.name}</h4>
                            <span class="point-type type-${point.type}">${point.type}</span>
                        </div>
                        <div class="point-details">
                            <p><strong>位置:</strong> ${point.location}</p>
                            <p><strong>描述:</strong> ${point.description}</p>
                            <p><strong>风险等级:</strong> ${point.risk_level}</p>
                            <p><strong>推荐装备:</strong> ${point.recommended_gear}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        mapTypeFilter.onchange = loadMapPoints;
        showToast('地图点位加载成功', 'success');
        hideLoading();
    }
});
