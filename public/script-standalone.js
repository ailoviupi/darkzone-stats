document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const navCategoryBtns = document.querySelectorAll('.nav-category-btn');
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

    const navOverlay = document.querySelector('.nav-overlay');
    const isMobile = window.innerWidth <= 768;

    function closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeAllDropdowns);
    }

    navCategoryBtns.forEach(categoryBtn => {
        categoryBtn.addEventListener('click', function(e) {
            const category = this.getAttribute('data-category');
            const dropdown = this.nextElementSibling;
            
            if (isMobile && dropdown && dropdown.classList.contains('nav-dropdown')) {
                e.preventDefault();
                e.stopPropagation();
                
                const isActive = dropdown.classList.contains('active');
                closeAllDropdowns();
                
                if (!isActive) {
                    dropdown.classList.add('active');
                    if (navOverlay) {
                        navOverlay.classList.add('active');
                    }
                }
            } else {
                navCategoryBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                if (dropdown && dropdown.classList.contains('nav-dropdown')) {
                    const firstBtn = dropdown.querySelector('.nav-btn');
                    if (firstBtn) {
                        firstBtn.click();
                    }
                }
            }
        });
    });

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const parentCategory = this.closest('.nav-category');
            if (parentCategory) {
                const categoryBtn = parentCategory.querySelector('.nav-category-btn');
                if (categoryBtn) {
                    navCategoryBtns.forEach(btn => btn.classList.remove('active'));
                    categoryBtn.classList.add('active');
                }
            }
            
            if (isMobile) {
                closeAllDropdowns();
            }
            
            hideLoading();
            
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
            } else if (sectionId === 's4-missions') {
                loadS4MissionFlow();
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
            } else if (sectionId === 'boss-spawns') {
                loadBossSpawns();
            } else if (sectionId === 'equipment-recommend') {
                loadEquipmentRecommend();
            } else if (sectionId === 'weapon-compare') {
                loadWeaponCompare();
            } else if (sectionId === 'map-guides') {
                loadMapGuides();
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

        updateMapChart(gameData.map_preferences);
    }

    function updateMapChart(topMaps) {
        const ctx = document.getElementById('mapChart').getContext('2d');
        
        if (mapChart) {
            mapChart.destroy();
        }

        const backgroundColors = [
            'rgba(233, 69, 96, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(153, 102, 255, 0.8)'
        ];

        const borderColors = [
            'rgba(233, 69, 96, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)'
        ];

        mapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topMaps.map(map => map.map_name),
                datasets: [{
                    label: '玩家占比 (%)',
                    data: topMaps.map(map => map.percentage),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
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
                        borderWidth: 1,
                        padding: window.innerWidth <= 768 ? 10 : 15,
                        titleFont: {
                            size: window.innerWidth <= 768 ? 12 : 14
                        },
                        bodyFont: {
                            size: window.innerWidth <= 768 ? 11 : 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
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
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
                            maxRotation: window.innerWidth <= 768 ? 45 : 0,
                            minRotation: window.innerWidth <= 768 ? 45 : 0
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
        const difficulties = ['中等', '困难', '极难', '困难', '中等', '困难', '极难'];
        const lootQualities = ['7', '8', '9', '8', '7', '9', '10'];
        
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

        if (!searchInput || !searchBtn) {
            console.log('搜索功能未启用：缺少搜索输入框或按钮');
            return;
        }

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
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
                            padding: window.innerWidth <= 768 ? 8 : 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1,
                        padding: window.innerWidth <= 768 ? 10 : 15,
                        titleFont: {
                            size: window.innerWidth <= 768 ? 12 : 14
                        },
                        bodyFont: {
                            size: window.innerWidth <= 768 ? 11 : 13
                        }
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
                                size: window.innerWidth <= 768 ? 11 : 13
                            }
                        },
                        ticks: {
                            color: '#e0e0e0',
                            backdropColor: 'transparent',
                            stepSize: 20,
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            }
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
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 11 : 13
                            },
                            padding: window.innerWidth <= 768 ? 10 : 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1,
                        padding: window.innerWidth <= 768 ? 10 : 15,
                        titleFont: {
                            size: window.innerWidth <= 768 ? 12 : 14
                        },
                        bodyFont: {
                            size: window.innerWidth <= 768 ? 11 : 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
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
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
                            maxRotation: window.innerWidth <= 768 ? 45 : 0,
                            minRotation: window.innerWidth <= 768 ? 45 : 0
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
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 11 : 13
                            },
                            padding: window.innerWidth <= 768 ? 10 : 15
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#e94560',
                        bodyColor: '#e0e0e0',
                        borderColor: '#e94560',
                        borderWidth: 1,
                        padding: window.innerWidth <= 768 ? 10 : 15,
                        titleFont: {
                            size: window.innerWidth <= 768 ? 12 : 14
                        },
                        bodyFont: {
                            size: window.innerWidth <= 768 ? 11 : 13
                        },
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
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
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
                            color: '#e0e0e0',
                            font: {
                                size: window.innerWidth <= 768 ? 10 : 12
                            },
                            maxRotation: window.innerWidth <= 768 ? 45 : 0,
                            minRotation: window.innerWidth <= 768 ? 45 : 0
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
        const exportS4MissionCsv = document.getElementById('export-s4-mission-csv');
        const exportS4MissionJson = document.getElementById('export-s4-mission-json');
        const exportBossCsv = document.getElementById('export-boss-csv');
        const exportBossJson = document.getElementById('export-boss-json');

        if (exportWeaponsCsv) {
            exportWeaponsCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.weapons, 'weapons.csv');
                showToast('武器数据已导出为CSV', 'success');
            });
        }

        if (exportWeaponsJson) {
            exportWeaponsJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.weapons, 'weapons.json');
                showToast('武器数据已导出为JSON', 'success');
            });
        }

        if (exportLeaderboardCsv) {
            exportLeaderboardCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.leaderboard.kills, 'leaderboard.csv');
                showToast('排行榜数据已导出为CSV', 'success');
            });
        }

        if (exportLeaderboardJson) {
            exportLeaderboardJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.leaderboard.kills, 'leaderboard.json');
                showToast('排行榜数据已导出为JSON', 'success');
            });
        }

        if (exportEconomyCsv) {
            exportEconomyCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.economy, 'economy.csv');
                showToast('经济数据已导出为CSV', 'success');
            });
        }

        if (exportEconomyJson) {
            exportEconomyJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.economy, 'economy.json');
                showToast('经济数据已导出为JSON', 'success');
            });
        }

        if (exportBulletCsv) {
            exportBulletCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.bullet_price_diff, 'bullet-price-diff.csv');
                showToast('子弹差价榜已导出为CSV', 'success');
            });
        }

        if (exportBulletJson) {
            exportBulletJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.bullet_price_diff, 'bullet-price-diff.json');
                showToast('子弹差价榜已导出为JSON', 'success');
            });
        }

        if (exportWorkbenchCsv) {
            exportWorkbenchCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.workbench_profit, 'workbench-profit.csv');
                showToast('工作台利润排行已导出为CSV', 'success');
            });
        }

        if (exportWorkbenchJson) {
            exportWorkbenchJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.workbench_profit, 'workbench-profit.json');
                showToast('工作台利润排行已导出为JSON', 'success');
            });
        }

        if (exportMissionCsv) {
            exportMissionCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.mission_flow, 'mission-flow.csv');
                showToast('任务流程已导出为CSV', 'success');
            });
        }

        if (exportMissionJson) {
            exportMissionJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.mission_flow, 'mission-flow.json');
                showToast('任务流程已导出为JSON', 'success');
            });
        }

        if (exportRestockCsv) {
            exportRestockCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.restock_prediction, 'restock-prediction.csv');
                showToast('补货预测已导出为CSV', 'success');
            });
        }

        if (exportRestockJson) {
            exportRestockJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.restock_prediction, 'restock-prediction.json');
                showToast('补货预测已导出为JSON', 'success');
            });
        }

        if (exportS4MissionCsv) {
            exportS4MissionCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.s4_missions, 's4-missions.csv');
                showToast('S4赛季任务已导出为CSV', 'success');
            });
        }

        if (exportS4MissionJson) {
            exportS4MissionJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.s4_missions, 's4-missions.json');
                showToast('S4赛季任务已导出为JSON', 'success');
            });
        }

        if (exportBossCsv) {
            exportBossCsv.addEventListener('click', () => {
                if (!gameData) return;
                exportToCSV(gameData.boss_spawns, 'boss-spawns.csv');
                showToast('Boss刷新点位已导出为CSV', 'success');
            });
        }

        if (exportBossJson) {
            exportBossJson.addEventListener('click', () => {
                if (!gameData) return;
                exportToJSON(gameData.boss_spawns, 'boss-spawns.json');
                showToast('Boss刷新点位已导出为JSON', 'success');
            });
        }
    }

    function loadBulletPriceDiff() {
        if (!gameData) return;
        
        showLoading();
        const bullets = gameData.bullet_price_diff || [];
        
        if (bullets.length === 0) {
            document.getElementById('high-profit-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('high-demand-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('all-bullets-list').innerHTML = '<p class="no-data">暂无数据</p>';
            hideLoading();
            return;
        }
        
        const highProfitBullets = [...bullets].sort((a, b) => b.price_diff - a.price_diff).slice(0, 5);
        const highDemandBullets = bullets.filter(b => b.demand === '高').slice(0, 5);
        
        const highProfitList = document.getElementById('high-profit-list');
        highProfitList.innerHTML = highProfitBullets.map(bullet => `
            <div class="bullet-item">
                <span class="name">${bullet.bullet_type}</span>
                <span class="price">${bullet.sell_price.toLocaleString()}</span>
                <span class="profit">${bullet.price_diff >= 0 ? '+' : ''}${bullet.price_diff.toLocaleString()}</span>
                <span class="profit-rate">${bullet.profit_margin.toFixed(1)}%</span>
            </div>
        `).join('');
        
        const highDemandList = document.getElementById('high-demand-list');
        highDemandList.innerHTML = highDemandBullets.map(bullet => `
            <div class="bullet-item">
                <span class="name">${bullet.bullet_type}</span>
                <span class="price">${bullet.sell_price.toLocaleString()}</span>
                <span class="profit">${bullet.price_diff >= 0 ? '+' : ''}${bullet.price_diff.toLocaleString()}</span>
                <span class="profit-rate">${bullet.profit_margin.toFixed(1)}%</span>
            </div>
        `).join('');
        
        const allBulletsList = document.getElementById('all-bullets-list');
        allBulletsList.innerHTML = bullets.map(bullet => `
            <div class="bullet-item">
                <span class="name">${bullet.bullet_type}</span>
                <span class="price">${bullet.sell_price.toLocaleString()}</span>
                <span class="profit">${bullet.price_diff >= 0 ? '+' : ''}${bullet.price_diff.toLocaleString()}</span>
                <span class="profit-rate">${bullet.profit_margin.toFixed(1)}%</span>
            </div>
        `).join('');
        
        showToast('子弹差价榜加载成功', 'success');
        hideLoading();
    }

    function loadWorkbenchProfit() {
        if (!gameData) return;
        
        showLoading();
        const sortSelect = document.getElementById('workbench-sort');
        
        if (!sortSelect) {
            console.log('工作台利润排行：缺少排序选择器');
            hideLoading();
            return;
        }
        
        let items = [...gameData.workbench_profit];
        
        if (sortSelect.value === 'profit_rate') {
            items.sort((a, b) => b.profit_margin - a.profit_margin);
        } else if (sortSelect.value === 'profit') {
            items.sort((a, b) => b.profit - a.profit);
        } else if (sortSelect.value === 'difficulty') {
            items.sort((a, b) => b.profit - a.profit);
        }
        
        const tbody = document.getElementById('workbench-profit-body');
        if (tbody) {
            tbody.innerHTML = items.map(item => `
                <tr>
                    <td>${item.recipe_name}</td>
                    <td>${item.craft_time}秒</td>
                    <td>${item.cost.toLocaleString()}</td>
                    <td>${item.sell_price.toLocaleString()}</td>
                    <td class="profit-positive">${item.profit.toLocaleString()}</td>
                    <td>${item.profit_margin.toFixed(1)}%</td>
                    <td>-</td>
                </tr>
            `).join('');
        }
        
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

    function loadS4MissionFlow() {
        if (!gameData) return;
        
        showLoading();
        const filterSelect = document.getElementById('s4-mission-filter');
        let missions = [...gameData.s4_missions];
        
        if (filterSelect.value === 'completed') {
            missions = missions.filter(m => m.status === '已完成');
        } else if (filterSelect.value === 'in_progress') {
            missions = missions.filter(m => m.status === '进行中');
        } else if (filterSelect.value === 'not_started') {
            missions = missions.filter(m => m.status === '未开始');
        } else if (filterSelect.value === 'easy') {
            missions = missions.filter(m => m.difficulty === '简单');
        } else if (filterSelect.value === 'medium') {
            missions = missions.filter(m => m.difficulty === '中等');
        } else if (filterSelect.value === 'hard') {
            missions = missions.filter(m => m.difficulty === '困难');
        }
        
        const content = document.getElementById('s4-mission-content');
        content.innerHTML = missions.map(mission => `
            <div class="mission-card s4-mission-card">
                <div class="mission-header">
                    <h3>${mission.mission_name}</h3>
                    <div class="mission-badges">
                        <span class="mission-difficulty difficulty-${mission.difficulty}">${mission.difficulty}</span>
                        <span class="mission-status status-${mission.status}">${mission.status}</span>
                    </div>
                </div>
                <div class="mission-description">
                    <p>${mission.description}</p>
                </div>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${mission.progress}%"></div>
                    </div>
                    <span class="progress-text">${mission.progress}%</span>
                </div>
                <div class="mission-reward">
                    <span class="reward-amount">${mission.reward.toLocaleString()}</span>
                    <span class="reward-label">科恩币</span>
                </div>
            </div>
        `).join('');
        
        filterSelect.onchange = loadS4MissionFlow;
        showToast('S4赛季任务加载成功', 'success');
        hideLoading();
    }

    function loadRestockPrediction() {
        if (!gameData) return;
        
        showLoading();
        const items = gameData.restock_prediction || [];
        
        if (items.length === 0) {
            document.getElementById('urgent-restock-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('high-probability-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('all-restock-list').innerHTML = '<p class="no-data">暂无数据</p>';
            hideLoading();
            return;
        }
        
        const urgencyOrder = { '极高': 4, '高': 3, '中': 2, '低': 1 };
        const urgentItems = [...items].sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]).filter(item => item.urgency === '极高' || item.urgency === '高').slice(0, 5);
        const highProbabilityItems = [...items].sort((a, b) => b.probability - a.probability).filter(item => item.probability >= 70).slice(0, 5);
        
        const urgentList = document.getElementById('urgent-restock-list');
        urgentList.innerHTML = urgentItems.map(item => `
            <div class="restock-item">
                <span class="name">${item.item_name}</span>
                <span class="stock">${item.current_stock}</span>
                <span class="time">${item.restock_time}</span>
                <span class="probability">${item.probability}%</span>
                <span class="urgency urgency-${item.urgency}">${item.urgency}</span>
            </div>
        `).join('');
        
        const highProbabilityList = document.getElementById('high-probability-list');
        highProbabilityList.innerHTML = highProbabilityItems.map(item => `
            <div class="restock-item">
                <span class="name">${item.item_name}</span>
                <span class="stock">${item.current_stock}</span>
                <span class="time">${item.restock_time}</span>
                <span class="probability">${item.probability}%</span>
                <span class="urgency urgency-${item.urgency}">${item.urgency}</span>
            </div>
        `).join('');
        
        const allRestockList = document.getElementById('all-restock-list');
        allRestockList.innerHTML = items.map(item => `
            <div class="restock-item">
                <span class="name">${item.item_name}</span>
                <span class="stock">${item.current_stock}</span>
                <span class="time">${item.restock_time}</span>
                <span class="probability">${item.probability}%</span>
                <span class="urgency urgency-${item.urgency}">${item.urgency}</span>
            </div>
        `).join('');
        
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

    function loadBossSpawns() {
        if (!gameData) return;
        
        showLoading();
        const filterSelect = document.getElementById('boss-map-filter');
        let bosses = [...gameData.boss_spawns];
        
        if (filterSelect.value !== 'all') {
            bosses = bosses.filter(b => b.map === filterSelect.value);
        }
        
        const content = document.getElementById('boss-spawns-content');
        content.innerHTML = bosses.map(boss => `
            <div class="boss-card">
                <div class="boss-header">
                    <h3>${boss.boss_name}</h3>
                    <div class="boss-info">
                        <span class="boss-map">${boss.map}</span>
                        <span class="boss-spawn-rate">刷新率: ${boss.spawn_rate}%</span>
                    </div>
                </div>
                <div class="boss-locations">
                    <h4>刷新点位</h4>
                    ${boss.locations.map(location => `
                        <div class="boss-location">
                            <div class="location-details">
                                <h5>${location.name}</h5>
                                <p>${location.description}</p>
                            </div>
                            <div class="location-stats">
                                <span class="spawn-prob">概率: ${location.spawn_probability}%</span>
                                <span class="guards">护卫: ${location.guards}人</span>
                                <span class="difficulty difficulty-${location.difficulty}">${location.difficulty}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="boss-drops">
                    <h4>掉落物品</h4>
                    ${boss.drops.map(drop => `
                        <div class="boss-drop">
                            <span class="drop-name">${drop.item}</span>
                            <span class="drop-rate">掉率: ${drop.drop_rate}%</span>
                            <span class="drop-value">价值: ${drop.value.toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        filterSelect.onchange = loadBossSpawns;
        showToast('Boss刷新点位加载成功', 'success');
        hideLoading();
    }

    function loadMarketTrends() {
        if (!gameData) return;
        
        showLoading();
        const timeFilter = document.getElementById('market-time-filter');
        const tabs = document.querySelectorAll('.market-tab');
        let currentTab = 'rise';
        let marketChart = null;
        let currentSort = { column: 'rank', direction: 'asc' };
        
        const sortData = (data, column, direction) => {
            return [...data].sort((a, b) => {
                let valA = a[column];
                let valB = b[column];
                
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                
                if (direction === 'asc') {
                    return valA > valB ? 1 : valA < valB ? -1 : 0;
                } else {
                    return valA < valB ? 1 : valA > valB ? -1 : 0;
                }
            });
        };
        
        const updateChart = () => {
            const ctx = document.getElementById('market-trends-chart').getContext('2d');
            let data = gameData.market_trends.trends || [];
            
            const topItems = data.slice(0, 5);
            const labels = topItems.map(item => item.item_name);
            const prices = topItems.map(item => item.price);
            const changes = topItems.map(item => item.change);
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, currentTab === 'rise' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)');
            gradient.addColorStop(1, 'rgba(22, 27, 34, 0)');
            
            if (marketChart) {
                marketChart.destroy();
            }
            
            marketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '涨跌幅 (%)',
                        data: changes,
                        borderColor: '#e94560',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#e94560',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#e94560',
                        pointHoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: window.innerWidth <= 768 ? 'bottom' : 'top',
                            labels: {
                                color: '#e0e0e0',
                                font: {
                                    size: window.innerWidth <= 768 ? 11 : 14,
                                    family: 'Microsoft YaHei, sans-serif'
                                },
                                padding: window.innerWidth <= 768 ? 10 : 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(22, 27, 34, 0.95)',
                            titleColor: '#e94560',
                            bodyColor: '#e0e0e0',
                            borderColor: 'rgba(233, 69, 96, 0.3)',
                            borderWidth: 1,
                            padding: window.innerWidth <= 768 ? 10 : 15,
                            displayColors: true,
                            titleFont: {
                                size: window.innerWidth <= 768 ? 12 : 14
                            },
                            bodyFont: {
                                size: window.innerWidth <= 768 ? 11 : 13
                            },
                            callbacks: {
                                label: function(context) {
                                    const item = topItems[context.dataIndex];
                                    return [
                                        `${item.item_name}`,
                                        `当前价格: ${item.price.toLocaleString()} 柯恩币`,
                                        `涨跌幅: ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`,
                                        `变化金额: ${(item.price * item.change / 100).toFixed(0).toLocaleString()} 柯恩币`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(233, 69, 96, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#e0e0e0',
                                font: {
                                    size: window.innerWidth <= 768 ? 10 : 12,
                                    family: 'Microsoft YaHei, sans-serif'
                                },
                                maxRotation: window.innerWidth <= 768 ? 45 : 0,
                                minRotation: window.innerWidth <= 768 ? 45 : 0
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(233, 69, 96, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#e0e0e0',
                                font: {
                                    size: window.innerWidth <= 768 ? 10 : 12,
                                    family: 'Microsoft YaHei, sans-serif'
                                },
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        };
        
        const updateTrends = () => {
            let data = gameData.market_trends.trends || [];
            data = sortData(data, currentSort.column, currentSort.direction);
            const tbody = document.getElementById('market-trends-body');
            
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td class="rank rank-${item.rank || 1}">${item.rank || 1}</td>
                    <td class="item-name">${item.item_name}</td>
                    <td>${item.price.toLocaleString()}</td>
                    <td class="change-${item.change >= 0 ? 'positive' : 'negative'}">${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%</td>
                    <td class="change-${item.change >= 0 ? 'positive' : 'negative'}">${(item.price * item.change / 100).toFixed(0).toLocaleString()}</td>
                </tr>
            `).join('');
            
            updateChart();
        };
        
        document.querySelectorAll('#market-trends th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = column;
                    currentSort.direction = 'asc';
                }
                
                document.querySelectorAll('#market-trends th.sortable').forEach(header => {
                    header.classList.remove('sort-asc', 'sort-desc');
                });
                th.classList.add(`sort-${currentSort.direction}`);
                
                updateTrends();
                showToast(`已按${th.textContent.trim().replace('↕', '')}${currentSort.direction === 'asc' ? '升序' : '降序'}排列`, 'info');
            });
        });
        
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
        const hotTabs = document.querySelectorAll('#market-hot .market-tab');
        let currentTab = 'items';
        let hotChart = null;
        let currentSort = { column: 'rank', direction: 'asc' };
        
        const sortData = (data, column, direction) => {
            return [...data].sort((a, b) => {
                let valA = a[column];
                let valB = b[column];
                
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                
                if (direction === 'asc') {
                    return valA > valB ? 1 : valA < valB ? -1 : 0;
                } else {
                    return valA < valB ? 1 : valA > valB ? -1 : 0;
                }
            });
        };
        
        const updateChart = () => {
            const ctx = document.getElementById('market-hot-chart').getContext('2d');
            let data;
            let title;
            
            switch(currentTab) {
                case 'items':
                    data = gameData.market_hot.items || [];
                    title = '热门物品';
                    break;
                case 'keys':
                    data = gameData.market_hot.keys || [];
                    title = '热门钥匙';
                    break;
                case 'price':
                    data = gameData.market_hot.price || [];
                    title = '价格排行榜';
                    break;
                default:
                    data = gameData.market_hot.items || [];
                    title = '热门物品';
            }
            
            if (!data || data.length === 0) {
                console.error('市场热度数据为空:', currentTab);
                hideLoading();
                return;
            }
            
            const topItems = data.slice(0, 6);
            const labels = topItems.map(item => item.item_name);
            const tradeCounts = topItems.map(item => item.hotness);
            
            const colors = [
                'rgba(233, 69, 96, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(33, 150, 243, 0.8)',
                'rgba(156, 39, 176, 0.8)',
                'rgba(255, 87, 34, 0.8)'
            ];
            
            const borderColors = [
                'rgba(233, 69, 96, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(255, 87, 34, 1)'
            ];
            
            if (hotChart) {
                hotChart.destroy();
            }
            
            hotChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '热度',
                        data: tradeCounts,
                        backgroundColor: colors,
                        borderColor: borderColors,
                        borderWidth: 2,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: window.innerWidth <= 768 ? 'bottom' : 'right',
                            labels: {
                                color: '#e0e0e0',
                                font: {
                                    size: window.innerWidth <= 768 ? 11 : 13,
                                    family: 'Microsoft YaHei, sans-serif'
                                },
                                padding: window.innerWidth <= 768 ? 10 : 15,
                                usePointStyle: true,
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                        return data.labels.map((label, i) => {
                                            const value = data.datasets[0].data[i];
                                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                            const percentage = ((value / total) * 100).toFixed(1);
                                            return {
                                                text: window.innerWidth <= 768 ? `${label}` : `${label} (${percentage}%)`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                strokeStyle: data.datasets[0].borderColor[i],
                                                lineWidth: data.datasets[0].borderWidth,
                                                hidden: false,
                                                index: i
                                            };
                                        });
                                    }
                                    return [];
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(22, 27, 34, 0.95)',
                            titleColor: '#e94560',
                            bodyColor: '#e0e0e0',
                            borderColor: 'rgba(233, 69, 96, 0.3)',
                            borderWidth: 1,
                            padding: window.innerWidth <= 768 ? 10 : 15,
                            displayColors: true,
                            titleFont: {
                                size: window.innerWidth <= 768 ? 12 : 14
                            },
                            bodyFont: {
                                size: window.innerWidth <= 768 ? 11 : 13
                            },
                            callbacks: {
                                label: function(context) {
                                    const item = topItems[context.dataIndex];
                                    return [
                                        `${item.item_name}`,
                                        `热度: ${item.hotness}`,
                                        `当前价格: ${item.price.toLocaleString()} 柯恩币`,
                                        `波动: ${item.fluctuation}%`
                                    ];
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        };
        
        const updateHotData = () => {
            let data;
            let title;
            
            switch(currentTab) {
                case 'items':
                    data = gameData.market_hot.items || [];
                    title = '热门物品';
                    break;
                case 'keys':
                    data = gameData.market_hot.keys || [];
                    title = '热门钥匙';
                    break;
                case 'price':
                    data = gameData.market_hot.price || [];
                    title = '价格排行榜';
                    break;
                default:
                    data = gameData.market_hot.items || [];
                    title = '热门物品';
            }
            
            if (!data || data.length === 0) {
                console.error('市场热度数据为空:', currentTab);
                hideLoading();
                return;
            }
            
            data = sortData(data, currentSort.column, currentSort.direction);
            const tbody = document.getElementById('market-hot-body');
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td class="rank rank-${item.rank}">${item.rank}</td>
                    <td class="item-name">${item.item_name}</td>
                    <td>${item.price.toLocaleString()}</td>
                    <td>${item.hotness}</td>
                    <td>${item.fluctuation}%</td>
                </tr>
            `).join('');
            
            document.querySelector('#market-hot h2').textContent = title;
            updateChart();
        };
        
        document.querySelectorAll('#market-hot th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = column;
                    currentSort.direction = 'asc';
                }
                
                document.querySelectorAll('#market-hot th.sortable').forEach(header => {
                    header.classList.remove('sort-asc', 'sort-desc');
                });
                th.classList.add(`sort-${currentSort.direction}`);
                
                updateHotData();
                showToast(`已按${th.textContent.trim().replace('↕', '')}${currentSort.direction === 'asc' ? '升序' : '降序'}排列`, 'info');
            });
        });
        
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
        const news = gameData.market_news || [];
        
        if (news.length === 0) {
            document.getElementById('important-news-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('latest-news-list').innerHTML = '<p class="no-data">暂无数据</p>';
            document.getElementById('all-news-list').innerHTML = '<p class="no-data">暂无数据</p>';
            hideLoading();
            return;
        }
        
        const importantNews = news.filter(n => n.tag === '重要' || n.tag === '公告').slice(0, 5);
        const latestNews = [...news].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
        
        const importantList = document.getElementById('important-news-list');
        importantList.innerHTML = importantNews.map(item => `
            <div class="news-item">
                <span class="news-time">${item.time}</span>
                <span class="news-tag tag-${item.tag}">${item.tag}</span>
                <p class="news-text">${item.content}</p>
            </div>
        `).join('');
        
        const latestList = document.getElementById('latest-news-list');
        latestList.innerHTML = latestNews.map(item => `
            <div class="news-item">
                <span class="news-time">${item.time}</span>
                <span class="news-tag tag-${item.tag}">${item.tag}</span>
                <p class="news-text">${item.content}</p>
            </div>
        `).join('');
        
        const allNewsList = document.getElementById('all-news-list');
        allNewsList.innerHTML = news.map(item => `
            <div class="news-item">
                <span class="news-time">${item.time}</span>
                <span class="news-tag tag-${item.tag}">${item.tag}</span>
                <p class="news-text">${item.content}</p>
            </div>
        `).join('');
        
        showToast('市场快讯加载成功', 'success');
        hideLoading();
    }

    function loadWeaponCodes() {
        if (!gameData) return;
        
        showLoading();
        const weaponTypeFilter = document.getElementById('weapon-type-filter');
        const weaponSort = document.getElementById('weapon-sort');
        let codes = [...gameData.weapon_codes];
        
        if (weaponTypeFilter && weaponTypeFilter.value && weaponTypeFilter.value !== 'all') {
            codes = codes.filter(c => c.weapon_type === weaponTypeFilter.value);
        }
        
        if (weaponSort) {
            switch(weaponSort.value) {
                case 'popularity':
                    codes.sort((a, b) => (b.effectiveness || 0) - (a.effectiveness || 0));
                    break;
                case 'price':
                    codes.sort((a, b) => (b.effectiveness || 0) - (a.effectiveness || 0));
                    break;
                case 'damage':
                    codes.sort((a, b) => (b.effectiveness || 0) - (a.effectiveness || 0));
                    break;
            }
        }
        
        const container = document.getElementById('weapon-codes-grid');
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
                    <span>效果: ${code.effectiveness || 0}%</span>
                    <span>描述: ${code.description || '暂无描述'}</span>
                </div>
            </div>
        `).join('');
        
        if (weaponTypeFilter) {
            weaponTypeFilter.onchange = loadWeaponCodes;
        }
        if (weaponSort) {
            weaponSort.onchange = loadWeaponCodes;
        }
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
        const mapSelect = document.getElementById('map-select');
        const pointFilters = document.querySelectorAll('.point-filter');
        let mapType = mapSelect ? mapSelect.value : 'farm';
        let pointType = 'gold';
        
        if (!mapType) {
            const mapTypes = Object.keys(gameData.map_points);
            mapType = mapTypes[0];
        }
        
        const mapData = gameData.map_points[mapType];
        
        if (!mapData) {
            document.getElementById('map-points-grid').innerHTML = '<div class="no-results">暂无该地图数据</div>';
            hideLoading();
            return;
        }
        
        let points = mapData[pointType] || [];
        
        const container = document.getElementById('map-points-grid');
        
        if (points.length === 0) {
            container.innerHTML = '<div class="no-results">暂无该类型点位数据</div>';
        } else {
            container.innerHTML = points.map((point, index) => `
                <div class="map-point-card">
                    <div class="point-header">
                        <h4>${mapData.map_name} - ${pointType === 'gold' ? '大金' : pointType === 'keys' ? '钥匙' : pointType === 'boss' ? 'Boss' : '保险箱'} #${index + 1}</h4>
                        <span class="point-type type-${pointType}">${pointType === 'gold' ? '大金' : pointType === 'keys' ? '钥匙' : pointType === 'boss' ? 'Boss' : '保险箱'}</span>
                    </div>
                    <div class="point-details">
                        <p><strong>位置:</strong> ${point.location || point.description || '未知'}</p>
                        <p><strong>描述:</strong> ${point.description || '暂无描述'}</p>
                        ${point.avg_value ? `<p><strong>平均价值:</strong> ${point.avg_value.toLocaleString()} 柯恩币</p>` : ''}
                        ${point.price ? `<p><strong>价格:</strong> ${point.price.toLocaleString()} 柯恩币</p>` : ''}
                        ${point.spawn_rate ? `<p><strong>刷新率:</strong> ${point.spawn_rate}%</p>` : ''}
                    </div>
                </div>
            `).join('');
        }
        
        if (mapSelect) {
            mapSelect.onchange = loadMapPoints;
        }
        
        pointFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                pointFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                pointType = filter.dataset.type;
                loadMapPoints();
            });
        });
        
        showToast('地图点位加载成功', 'success');
        hideLoading();
    }

    function loadEquipmentRecommend() {
        if (!gameData || !gameData.equipment_recommendations) return;
        
        showLoading();
        const levelRangeFilter = document.getElementById('level-range-filter');
        const budgetFilter = document.getElementById('budget-filter');
        
        let levelRange = levelRangeFilter ? levelRangeFilter.value : '1-20';
        let budget = budgetFilter ? budgetFilter.value : 'all';
        
        let levelData = gameData.equipment_recommendations.find(item => item.level_range === levelRange);
        
        if (!levelData) {
            document.getElementById('equipment-recommend-content').innerHTML = '<div class="no-results">暂无该等级段数据</div>';
            hideLoading();
            return;
        }
        
        let recommendations = levelData.recommendations;
        
        if (budget !== 'all' && levelData.budget !== budget) {
            document.getElementById('equipment-recommend-content').innerHTML = '<div class="no-results">暂无该预算的装备推荐</div>';
            hideLoading();
            return;
        }
        
        const container = document.getElementById('equipment-recommend-content');
        
        if (recommendations.length === 0) {
            container.innerHTML = '<div class="no-results">暂无符合条件的装备推荐</div>';
        } else {
            container.innerHTML = recommendations.map(rec => `
                <div class="equipment-recommend-card">
                    <div class="recommend-header">
                        <h3>${rec.weapon}</h3>
                        <span class="budget-tag budget-${levelData.budget}">${levelData.budget}预算</span>
                    </div>
                    <div class="recommend-details">
                        <div class="detail-item">
                            <span class="label">武器:</span>
                            <span class="value">${rec.weapon}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">防弹衣:</span>
                            <span class="value">${rec.armor}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">头盔:</span>
                            <span class="value">${rec.helmet}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">背包:</span>
                            <span class="value">${rec.backpack}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">总成本:</span>
                            <span class="value cost">${rec.total_cost.toLocaleString()} 柯恩币</span>
                        </div>
                        <div class="detail-item description">
                            <span class="label">描述:</span>
                            <span class="value">${rec.description}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        if (levelRangeFilter) {
            levelRangeFilter.onchange = loadEquipmentRecommend;
        }
        if (budgetFilter) {
            budgetFilter.onchange = loadEquipmentRecommend;
        }
        
        showToast('装备推荐加载成功', 'success');
        hideLoading();
    }

    function loadWeaponCompare() {
        if (!gameData || !gameData.weapon_comparison) return;
        
        showLoading();
        const weaponTypeFilter = document.getElementById('weapon-type-compare');
        let weaponType = weaponTypeFilter ? weaponTypeFilter.value : 'all';
        
        let weapons = [];
        
        if (weaponType === 'all' || weaponType === '突击步枪') {
            weapons = weapons.concat(gameData.weapon_comparison.assault_rifles.map(w => ({...w, weapon_type: '突击步枪'})));
        }
        if (weaponType === 'all' || weaponType === '冲锋枪') {
            weapons = weapons.concat(gameData.weapon_comparison.smgs.map(w => ({...w, weapon_type: '冲锋枪'})));
        }
        if (weaponType === 'all' || weaponType === '狙击步枪') {
            weapons = weapons.concat(gameData.weapon_comparison.snipers.map(w => ({...w, weapon_type: '狙击步枪'})));
        }
        
        const container = document.getElementById('weapon-compare-content');
        
        if (weapons.length === 0) {
            container.innerHTML = '<div class="no-results">暂无该类型武器数据</div>';
        } else {
            container.innerHTML = `
                <div class="weapon-compare-table-wrapper">
                    <table class="weapon-compare-table">
                        <thead>
                            <tr>
                                <th>武器名称</th>
                                <th>类型</th>
                                <th>伤害</th>
                                <th>射速</th>
                                <th>精度</th>
                                <th>后坐力</th>
                                <th>弹匣容量</th>
                                <th>有效射程</th>
                                <th>换弹时间</th>
                                <th>优缺点</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${weapons.map(weapon => `
                                <tr>
                                    <td><strong>${weapon.name}</strong></td>
                                    <td>${weapon.weapon_type}</td>
                                    <td>${weapon.damage}</td>
                                    <td>${weapon.fire_rate}</td>
                                    <td>${weapon.accuracy}</td>
                                    <td>${weapon.recoil}</td>
                                    <td>${weapon.magazine}</td>
                                    <td>${weapon.effective_range}m</td>
                                    <td>${weapon.reload_time}s</td>
                                    <td>
                                        <div class="pros-cons">
                                            <div class="pros">✓ ${weapon.pros.join(', ')}</div>
                                            <div class="cons">✗ ${weapon.cons.join(', ')}</div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        if (weaponTypeFilter) {
            weaponTypeFilter.onchange = loadWeaponCompare;
        }
        
        showToast('武器对比加载成功', 'success');
        hideLoading();
    }

    function loadMapGuides() {
        if (!gameData || !gameData.map_guides) return;
        
        showLoading();
        const mapGuideFilter = document.getElementById('map-guide-filter');
        let mapFilter = mapGuideFilter ? mapGuideFilter.value : 'all';
        
        let maps = gameData.map_guides;
        
        if (mapFilter !== 'all') {
            maps = maps.filter(m => m.map_name === mapFilter);
        }
        
        const container = document.getElementById('map-guides-content');
        
        if (maps.length === 0) {
            container.innerHTML = '<div class="no-results">暂无该地图攻略数据</div>';
        } else {
            container.innerHTML = maps.map(map => `
                <div class="map-guide-card">
                    <div class="map-guide-header">
                        <h3>${map.map_name}</h3>
                        <div class="map-badges">
                            <span class="difficulty-badge difficulty-${map.difficulty}">${map.difficulty}</span>
                            <span class="level-badge">等级 ${map.recommended_level}</span>
                        </div>
                    </div>
                    <div class="map-guide-content">
                        <div class="map-section">
                            <h4>关键点位</h4>
                            <div class="key-locations">
                                ${map.key_locations.map(loc => `
                                    <div class="location-item">
                                        <span class="location-name">${loc.name}</span>
                                        <span class="location-loot loot-${loc.loot_quality}">${loc.loot_quality}</span>
                                        <span class="location-danger danger-${loc.danger_level}">${loc.danger_level}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="map-section">
                            <h4>撤离点</h4>
                            <div class="extraction-points">
                                ${map.extraction_points.map(point => `
                                    <div class="extraction-item">
                                        <span class="extraction-name">${point.name}</span>
                                        <span class="extraction-requirement">${point.requirements}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="map-section">
                            <h4>游戏提示</h4>
                            <div class="game-tips">
                                ${map.tips.map((tip, index) => `
                                    <div class="tip-item">
                                        <span class="tip-number">${index + 1}</span>
                                        <span class="tip-text">${tip}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        if (mapGuideFilter) {
            mapGuideFilter.onchange = loadMapGuides;
        }
        
        showToast('地图攻略加载成功', 'success');
        hideLoading();
    }
});
