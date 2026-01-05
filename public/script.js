document.addEventListener('DOMContentLoaded', function() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    let mapChart = null;
    let economyChart = null;
    let economyLineChart = null;
    let weaponRadarChart = null;
    let socket = null;

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

    initWebSocket();
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
            }
        });
    });

    loadGameplayInfo();

    function loadGameplayInfo() {
        showLoading();
        fetch('/api/gameplay-info')
            .then(response => response.json())
            .then(data => {
                const gameModes = data.gameModes;
                
                document.getElementById('classic-players').textContent = gameModes[0].playerCount.toLocaleString();
                document.getElementById('classic-duration').textContent = gameModes[0].avgDuration;
                
                document.getElementById('team-players').textContent = gameModes[1].playerCount.toLocaleString();
                document.getElementById('team-duration').textContent = gameModes[1].avgDuration;
                
                document.getElementById('survival-players').textContent = gameModes[2].playerCount.toLocaleString();
                document.getElementById('survival-duration').textContent = gameModes[2].avgDuration;
                
                const tipsList = document.getElementById('game-tips');
                tipsList.innerHTML = '';
                data.tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.textContent = tip;
                    tipsList.appendChild(li);
                });
                
                showToast('游戏玩法信息加载成功', 'success');
            })
            .catch(error => {
                console.error('加载游戏玩法信息失败:', error);
                showToast('加载失败，请稍后重试', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    }

    function loadPlayerStats() {
        fetch('/api/player-stats')
            .then(response => response.json())
            .then(data => {
                document.getElementById('total-players').textContent = data.totalPlayers.toLocaleString();
                document.getElementById('active-players').textContent = data.activePlayers.toLocaleString();
                document.getElementById('avg-level').textContent = data.avgLevel.toFixed(1);
                document.getElementById('avg-playtime').textContent = data.avgPlayTime;

                updateMapChart(data.topMaps);
            })
            .catch(error => {
                console.error('加载玩家数据失败:', error);
            });
    }

    function updateMapChart(topMaps) {
        const ctx = document.getElementById('mapChart').getContext('2d');
        
        if (mapChart) {
            mapChart.destroy();
        }

        mapChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topMaps.map(map => map.name),
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
        fetch('/api/map-preferences')
            .then(response => response.json())
            .then(data => {
                const mapCards = document.querySelectorAll('.map-card');
                
                data.maps.forEach((map, index) => {
                    if (mapCards[index]) {
                        const stats = mapCards[index].querySelector('.map-stats');
                        stats.innerHTML = `
                            <p>玩家数量: <strong>${map.playerCount.toLocaleString()}</strong></p>
                            <p>平均时长: <strong>${map.avgDuration}</strong> 分钟</p>
                            <p>撤离成功率: <strong>${map.extractionRate}</strong>%</p>
                            <p>难度: <strong>${map.difficulty}</strong>/10</p>
                            <p>物资质量: <strong>${map.lootQuality}</strong>/10</p>
                        `;
                    }
                });
            })
            .catch(error => {
                console.error('加载地图偏好数据失败:', error);
            });
    }

    function loadGoldSpawnRate() {
        fetch('/api/gold-spawn-rate')
            .then(response => response.json())
            .then(data => {
                const updateTime = new Date(data.lastUpdated);
                document.getElementById('last-updated').textContent = updateTime.toLocaleString('zh-CN');

                const goldMaps = document.querySelectorAll('.gold-map');
                
                data.maps.forEach((mapData, mapIndex) => {
                    if (goldMaps[mapIndex]) {
                        const tbody = goldMaps[mapIndex].querySelector('tbody');
                        tbody.innerHTML = '';
                        
                        mapData.goldLocations.forEach(location => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${location.location}</td>
                                <td class="spawn-rate">${location.spawnRate}%</td>
                                <td>${location.lastSeen}</td>
                            `;
                            tbody.appendChild(row);
                        });
                    }
                });
            })
            .catch(error => {
                console.error('加载大金刷新率数据失败:', error);
            });
    }

    setInterval(() => {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            if (sectionId === 'player-stats') {
                loadPlayerStats();
            } else if (sectionId === 'map-preferences') {
                loadMapPreferences();
            } else if (sectionId === 'gold-spawn') {
                loadGoldSpawnRate();
            } else if (sectionId === 'gameplay') {
                loadGameplayInfo();
            }
        }
    }, 60000);

    function initWebSocket() {
        socket = io();
        
        socket.on('connect', () => {
            console.log('已连接到服务器');
            socket.emit('subscribe-updates');
        });

        socket.on('gold-update', (data) => {
            console.log('收到大金更新:', data);
            if (document.querySelector('.section.active').id === 'gold-spawn') {
                loadGoldSpawnRate();
            }
        });

        socket.on('disconnect', () => {
            console.log('与服务器断开连接');
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query.length < 2) {
                alert('请输入至少2个字符进行搜索');
                return;
            }

            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    displaySearchResults(data);
                    showSection('search-results');
                })
                .catch(error => {
                    console.error('搜索失败:', error);
                });
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
                        <span>等级: ${player.level} | 击杀: ${player.total_kills} | 金币: ${player.total_coins.toLocaleString()}</span>
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
                        <span>玩家数: ${map.player_count.toLocaleString()} | 难度: ${map.difficulty}/10</span>
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
        const typeFilter = document.getElementById('weapon-type-filter');
        const sortFilter = document.getElementById('weapon-sort-filter');
        
        let url = '/api/weapons?';
        if (typeFilter.value) {
            url += `type=${encodeURIComponent(typeFilter.value)}&`;
        }
        if (sortFilter.value) {
            url += `sort=${encodeURIComponent(sortFilter.value)}`;
        }

        showLoading();
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayWeapons(data.weapons);
                updateWeaponRadarChart(data.weapons.slice(0, 5));
                showToast(`已加载 ${data.weapons.length} 个武器`, 'success');
            })
            .catch(error => {
                console.error('加载武器数据失败:', error);
                showToast('加载武器数据失败', 'error');
            })
            .finally(() => {
                hideLoading();
            });
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
        showLoading();
        fetch('/api/economy-stats?days=30')
            .then(response => response.json())
            .then(data => {
                const today = data.stats[data.stats.length - 1];
                
                document.getElementById('today-coins-earned').textContent = today.totalCoinsEarned.toLocaleString();
                document.getElementById('today-coins-spent').textContent = today.totalCoinsSpent.toLocaleString();
                document.getElementById('avg-coins').textContent = today.avgCoinsPerPlayer.toLocaleString();
                document.getElementById('today-trades').textContent = today.totalItemsTraded.toLocaleString();

                updateEconomyChart(data.stats);
                showToast('经济统计数据加载成功', 'success');
            })
            .catch(error => {
                console.error('加载经济统计数据失败:', error);
                showToast('加载经济统计数据失败', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    }

    function updateEconomyChart(stats) {
        const ctx = document.getElementById('economyChart').getContext('2d');
        
        if (economyChart) {
            economyChart.destroy();
        }

        economyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stats.map(s => s.date.slice(5)),
                datasets: [
                    {
                        label: '金币收入',
                        data: stats.map(s => s.totalCoinsEarned),
                        borderColor: 'rgba(233, 69, 96, 1)',
                        backgroundColor: 'rgba(233, 69, 96, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '金币支出',
                        data: stats.map(s => s.totalCoinsSpent),
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

        updateEconomyLineChart(stats);
    }

    function updateEconomyLineChart(stats) {
        const ctx = document.getElementById('economyLineChart').getContext('2d');
        
        if (economyLineChart) {
            economyLineChart.destroy();
        }

        economyLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stats.map(s => s.date.slice(5)),
                datasets: [
                    {
                        label: '金币净收入',
                        data: stats.map(s => s.totalCoinsEarned - s.totalCoinsSpent),
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
        const limitSelect = document.getElementById('leaderboard-limit');

        categorySelect.addEventListener('change', loadLeaderboard);
        limitSelect.addEventListener('change', loadLeaderboard);
    }

    function loadLeaderboard() {
        const categorySelect = document.getElementById('leaderboard-category');
        const limitSelect = document.getElementById('leaderboard-limit');

        showLoading();
        fetch(`/api/leaderboard?category=${categorySelect.value}&limit=${limitSelect.value}`)
            .then(response => response.json())
            .then(data => {
                displayLeaderboard(data.players);
                showToast(`已加载 ${data.players.length} 条排行榜数据`, 'success');
            })
            .catch(error => {
                console.error('加载排行榜失败:', error);
                showToast('加载排行榜失败', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    }

    function displayLeaderboard(players) {
        const tbody = document.getElementById('leaderboard-body');
        
        if (players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">暂无数据</td></tr>';
            return;
        }

        tbody.innerHTML = players.map(player => `
            <tr>
                <td class="rank-${player.rank}">${player.rank}</td>
                <td>${player.username}</td>
                <td>${player.level}</td>
                <td>${player.stats.kills.toLocaleString()}</td>
                <td>${player.stats.extractions.toLocaleString()}</td>
                <td>${player.stats.coins.toLocaleString()}</td>
            </tr>
        `).join('');
    }

    function initExportButtons() {
        document.getElementById('export-weapons-json').addEventListener('click', () => exportData('json', 'weapons'));
        document.getElementById('export-weapons-csv').addEventListener('click', () => exportData('csv', 'weapons'));
        document.getElementById('export-economy-json').addEventListener('click', () => exportData('json', 'economy-stats'));
        document.getElementById('export-economy-csv').addEventListener('click', () => exportData('csv', 'economy-stats'));
        document.getElementById('export-leaderboard-json').addEventListener('click', () => exportData('json', 'leaderboard'));
        document.getElementById('export-leaderboard-csv').addEventListener('click', () => exportData('csv', 'leaderboard'));
    }

    function exportData(type, dataType) {
        window.location.href = `/api/export/${type}?data=${dataType}`;
    }
});
