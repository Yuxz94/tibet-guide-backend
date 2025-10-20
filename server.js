const express = require('express');
const axios = require('axios');
const cors = require('cors'); // 1. 引入 cors 包

const app = express();
const PORT = 3000;

// --- 密钥配置 ---
const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
// --------------------------------------------------------------------

// 2. 使用 cors 中间件
// 它会自动处理所有复杂的跨域请求逻辑（包括您遇到的 preflight request）
app.use(cors()); 

// 中间件，用于解析前端发送过来的JSON格式请求体
app.use(express.json());

// 创建一个专门用于与百度千帆大模型聊天的API接口
app.post('/api/chat', async (req, res) => {
    const targetUrl = 'https://qianfan.baidubce.com/v2/chat/completions';
    
    const requestBody = req.body;

    console.log("收到前端请求，正在转发至百度千帆...");

    try {
        const response = await axios.post(targetUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + BAIDU_API_KEY
            },
            responseType: 'stream' 
        });

        res.setHeader('Content-Type', 'application/octet-stream');
        
        response.data.pipe(res);

    } catch (error) {
        console.error('请求百度千帆API时出错:', error.response ? error.response.data : error.message);
        res.status(500).send('调用AI服务时发生错误');
    }
});

app.listen(PORT, () => {
    console.log(`✅ 西藏导游专属代理服务器已启动，监听端口: http://localhost:${PORT}`);
});