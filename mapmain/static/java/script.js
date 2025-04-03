  // Инициализация карты
        var map = L.map('map', {
            zoomControl: false // Отключаем стандартный контрол зума
        }).setView([65.0167, 35.7167], 10);

        // Добавление слоя OpenStreetMap с красивым стилем
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // Создаем группу для кластеризации маркеров
        var markers = L.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 60,
            iconCreateFunction: function(cluster) {
                return L.divIcon({
                    html: '<div style="background-color: rgba(0, 0, 0, 0.7); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">' + cluster.getChildCount() + '</div>',
                    className: 'marker-cluster',
                    iconSize: L.point(40, 40)
                });
            }
        });

        // Функция для получения данных через Django REST API
        async function fetchData(categoryId = null) {
            try {
                let url = '/api/mapinfo/';
                if (categoryId) {
                    url += 'by_category/?category_id=' + categoryId;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                return [];
            }
        }

        // Функция для получения категорий через Django REST API
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Ошибка при получении категорий:', error);
                return [];
            }
        }

        // Функция для добавления данных на карту
        function addDataToMap(data) {
            // Очищаем предыдущие маркеры
            markers.clearLayers();

            // Очищаем список мест
            document.getElementById('locations-list').innerHTML = '';

            // Добавляем каждый объект на карту
            data.forEach(point => {
                const lat = point.latitude;
                const lng = point.longitude;

                // Получаем URL иконки и фото
                const iconUrl = point.icons_url || 'https://cdn-icons-png.flaticon.com/512/684/684908.png';
                const photoUrl = point.photos_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Solovetsky_monastery_from_above_2.jpg/800px-Solovetsky_monastery_from_above_2.jpg';

                // Создаем кастомный маркер
                const customIcon = L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background-image: url('${iconUrl}'); background-size: contain; background-repeat: no-repeat; width: 32px; height: 32px;"></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                });

                // Создаем маркер
                const marker = L.marker([lat, lng], {
                    icon: customIcon,
                    title: point.name
                });

                // Добавляем обработчик клика
                marker.on('click', function() {
                    // Обновляем содержимое панели информации
                    document.getElementById('info-content').innerHTML = `
                        <h2>${point.name}</h2>
                        ${point.category ? `<p><strong>Эпоха:</strong> ${point.category.name}</p>` : ''}
                        <p>${point.history || 'Описание отсутствует'}</p>
                        <img src="${photoUrl}" alt="${point.name}" class="fade-in">
                    `;

                    // Показываем панель информации
                    document.getElementById('info-panel').classList.add('visible');

                    // Подсвечиваем элемент в списке
                    highlightLocationInList(point.name);
                });

                // Добавляем маркер в группу кластеризации
                markers.addLayer(marker);

                // Добавляем элемент в список мест
                addLocationToList(point.name, lat, lng);
            });

            // Добавляем группу маркеров на карту
            map.addLayer(markers);
        }

        // Функция для добавления места в список
        function addLocationToList(name, lat, lng) {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            listItem.dataset.lat = lat;
            listItem.dataset.lng = lng;

            listItem.addEventListener('click', function() {
                // Центрируем карту на выбранном месте
                map.setView([lat, lng], 15);

                // Открываем попап маркера (если возможно)
                markers.eachLayer(function(layer) {
                    if (layer.getLatLng().lat === lat && layer.getLatLng().lng === lng) {
                        layer.fire('click');
                    }
                });

                // Подсвечиваем элемент в списке
                highlightLocationInList(name);
            });

            document.getElementById('locations-list').appendChild(listItem);
        }

        // Функция для подсветки выбранного места в списке
        function highlightLocationInList(name) {
            const items = document.querySelectorAll('#locations-list li');
            items.forEach(item => {
                item.classList.remove('active');
                if (item.textContent === name) {
                    item.classList.add('active');
                    // Прокручиваем список до выбранного элемента
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }

        // Получение данных и добавление их на карту
        fetchData().then(data => {
            addDataToMap(data);
        });

        // Получение категорий и добавление их в выпадающий список
        fetchCategories().then(categories => {
            const categorySelect = document.getElementById('category-select');
            // Оставляем первую опцию "Все категории"
            while (categorySelect.options.length > 1) {
                categorySelect.remove(1);
            }

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        });

        // Обработчики событий

        // Клик по карте скрывает панели
        map.on('click', function() {
            document.getElementById('info-panel').classList.remove('visible');
            document.getElementById('locations-panel').classList.remove('visible');
        });

        // Кнопка скрытия панели информации
        document.getElementById('hide-button').addEventListener('click', function() {
            document.getElementById('info-panel').classList.remove('visible');
        });

        // Кнопки масштабирования
        document.getElementById('zoom-in').addEventListener('click', function() {
            map.zoomIn();
        });

        document.getElementById('zoom-out').addEventListener('click', function() {
            map.zoomOut();
        });

        // Кнопка открытия/закрытия панели мест
        document.getElementById('locations-button').addEventListener('click', function() {
            document.getElementById('locations-panel').classList.toggle('visible');
        });

        // Выбор категории
        document.getElementById('category-select').addEventListener('change', function() {
            const selectedCategoryId = this.value;
            fetchData(selectedCategoryId || null).then(data => {
                addDataToMap(data);

                if (data.length === 0) {
                    document.getElementById('info-content').innerHTML = `
                        <h2>Ничего не найдено</h2>
                        <p>В выбранной категории нет объектов.</p>
                    `;
                    document.getElementById('info-panel').classList.add('visible');
                }
            });
        });

        // Инициализация с открытой панелью информации
        setTimeout(() => {
            document.getElementById('info-panel').classList.add('visible');
        }, 500);