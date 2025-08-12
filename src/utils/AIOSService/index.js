import Thrift from './thrift';
import aios from './aios_service_types';
import { reactive } from 'vue'
let ws = null;
let thriftClient = null;
let clientId = '123213213';
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let reconnectTimeout = null;
export const socketState = reactive({
    messages: [],
    isConnected: false,
    message: ''
    // 其他状态
})
// 初始化Thrift客户端
function initThriftClient() {
    try {
        const transport = new Thrift.Transport("http://localhost:52002/thrift");
        // 修改前
        const protocol = new Thrift.TJSONProtocol(transport);
        thriftClient = new aios.AIOSServiceClient(protocol);
        console.log("Thrift客户端初始化成功！");
        registerAndConnect()
    } catch (error) {
        console.log(error);

    }
}

// 注册并连接WebSocket
function registerAndConnect() {
    if (!clientId) return
    // 调用Thrift的registerClient接口获取WebSocket地址
    try {
        thriftClient.registerClient(clientId, function (response) {
            if (response && response.code === aios.ResultCode.SUCCESS) {
                // 使用返回的WebSocket URL连接
                console.log('Received wsUrl:', response.wsUrl); // 调试信息
                connectWebSocket(response.wsUrl)
            } else {
                attemptReconnect();
            }
        });
    } catch (error) {
        console.log(error);
        attemptReconnect();
    }
}

// 连接到WebSocket服务器
function connectWebSocket(wsUrl) {
    // 清除之前的重连尝试
    reconnectAttempts = 0;

    // 连接到提供的WebSocket服务器URL
    ws = new WebSocket(wsUrl);
    ws.onopen = function (event) {
        reconnectAttempts = 0; // 重置重连计数
        console.log("WebSocket is open now.");
    };

    ws.onmessage = function (event) {
        const message = event.data
        // 将消息添加到响应式数据中
        socketState.messages.push(message)
        socketState.message = message
    };

    ws.onclose = function (event) {
        console.log("WebSocket is closed.");
        attemptReconnect();
    };

    ws.onerror = function (error) {
        console.log("WebSocket is error.");
        attemptReconnect();
    };
}

// 尝试重连
function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        // 清除之前的重连定时器
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
        }

        // 设置重连延迟（指数退避）
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
        reconnectTimeout = setTimeout(() => {
            console.log(`尝试重新连接，第${reconnectAttempts}次`);
            if (clientId) {
                registerAndConnect();
            }
        }, delay);
    }
}

function disconnect() {
    // 清除重连定时器
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }

    if (ws) {
        ws.close();
        ws = null;
    }

    reconnectAttempts = 0;
}
function sendHeartbeat() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // 发送心跳消息
        ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
    }
}
function sendWebSocketMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN && message) {
        ws.send(message);
    }
}

export function sendIntent(intentType, intentParams) {
    if (!thriftClient) {
        return;
    }

    if (!intentType) {
        alert('Please enter intent type');
        return;
    }

    // 构造IntentMessage对象
    const intentMessage = new aios.IntentMessage();
    intentMessage.clientId = clientId;
    intentMessage.intentType = intentType;

    // 解析参数
    if (intentParams) {
        intentMessage.params = intentParams
    } else {
        intentMessage.params = {};
    }
    // 调用Thrift的sendIntent接口
    thriftClient.sendIntent(intentMessage, function (response) {
        if (response.code === aios.ResultCode.SUCCESS) {
            console.log('sendIntent发送成功', response);
        }
    })
    /* try {
        return new Promise((resolve, reject) => {
            console.log("sendIntent: " + intentMessage)
            thriftClient.sendIntent(intentMessage, {
                success: function (response) {
                    console.log('sendIntent', response);
                    if (response.code === aios.ResultCode.SUCCESS) {
                    }
                    resolve(response)
                },
                error: function (error) {
                    reject(error)
                }
            });
        });
    } catch (error) {
        console.log('sendIntent调用失败', error);
    } */
}

function sendToClient(targetClientId, message) {
    if (!thriftClient) {
        return;
    }

    if (!targetClientId || !message) {
        alert('Please enter target client ID and message');
        return;
    }

    // 构造ClientMessage对象
    const clientMessage = new aios.ClientMessage();
    clientMessage.fromClientId = clientId;
    clientMessage.toClientId = targetClientId;
    clientMessage.content = message;

    // 调用Thrift的sendToClient接口
    try {
        thriftClient.sendToClient(clientMessage, {
            success: function (response) {
                if (response.code === aios.ResultCode.SUCCESS) {
                }
            },
            error: function (error) {
            }
        });
    } catch (error) {
    }
}
// 初始化Thrift客户端
initThriftClient();