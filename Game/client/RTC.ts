type handler = (response: any) => void;

class RTC {

    private static _实例: RTC | null = null;
    public static get 实例() {
        return this._实例 ?? (this._实例 = new RTC());

    }


    // @ts-ignore
    private handlers: Map<string, handler> = new Map();
    private ws_url: string = "ws://localhost:8080/ws";
    private ws = new WebSocket(this.ws_url);
    private peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "turn:your.turn.server:3478", username: "user", credential: "pass" },
        ]
    });
    private dataChannel: RTCDataChannel;

    private constructor() {
        this.dataChannel = this.peerConnection.createDataChannel("chat");

        // 设置 DataChannel 打开时的事件处理
        this.dataChannel.onopen = () => {
            if (this.dataChannel.readyState === 'open') {
                console.log("DataChannel 连接已打开");
                this.dataChannel.send("Hello from client A!");
            } else {
                console.log("DataChannel 连接未打开");
            }
        };

        // 群员收到消息
        this.peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;
            console.log("接收到 DataChannel: ", dataChannel.label);

            dataChannel.onopen = () => {
                console.log("DataChannel 已打开");
            };

            dataChannel.onmessage = (event) => {
                console.log("收到消息: ", event.data);
            };
        };

        // 群主收到消息
        this.dataChannel.onmessage = (event) => {
            console.log("收到对方消息:", event.data);
        };

        // 监听 ICE candidate
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // 将本地ICE变更发送到远端的其他房内成员
                this.ws.send(JSON.stringify(new MessagePacket(MessageType.ICE变更, { candidate: event.candidate })));
            }
        };

        // 监听服务器的消息
        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data as string);

                if (message.type == "回调事件") {
                    if (message.data.requestId && this.handlers.has(message.data.requestId)) {
                        const cb = this.handlers.get(message.data.requestId)!;
                        cb(message);
                        this.handlers.delete(message.data.requestId); // 用完就删除回调
                    }
                } else if (message.type == "房主事件") {
                    // 如果收到 answer 消息
                    if (message.data.answer) {
                        console.log("收到 answer, 设置远端描述");
                        this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.answer));
                    }

                    // 如果收到 ICE candidate
                    if (message.data.candidate) {
                        console.log("收到 ICE candidate");
                        this.peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate));
                    }
                }
            } catch (e) {
                console.error("消息解析失败:", event.data);
            }
        };

        // 监听服务器的打开事件
        this.ws.onopen = () => {
            console.log("信令服务器已连接");
        };

        // 监听服务器的关闭事件
        this.ws.onclose = () => {
            console.log("信令服务器已关闭");
        };
    }

    // 生成唯一的 requestId
    private generateId(): string {
        return Math.random().toString(36).slice(2);
    }

    // 发送消息并带上回调
    public sendMessage(data: any, callback: handler): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            const requestId = this.generateId();
            this.handlers.set(requestId, callback);
            this.ws.send(JSON.stringify(new MessagePacket(MessageType.回调消息, {
                requestId: requestId,
                data: data
            })));
        }
    }

    创建群(房间名称: string, 房间密码: number, 是否公开: boolean, callback: handler) {
        if (this.ws.readyState === WebSocket.OPEN) {
            // 创建房主offer
            this.peerConnection.createOffer().then(value => {
                this.peerConnection.setLocalDescription(value); // 设置本地 SDP
                // 发送 offer 到信令服务器
                this.sendMessage(new MessagePacket(MessageType.创建群, {
                    offer: value,
                    房间名称: 房间名称,
                    房间密码: 房间密码,
                    是否公开: 是否公开,
                }), callback);
                console.log(`已发送创建房间请求`);
            }).catch(error => {
                console.log(`创建房间失败: ${error}`);
            });
        }
    }

    加入群(群ID: number, callback: handler) {
        if (this.ws.readyState === WebSocket.OPEN) {
            const message = new MessagePacket(MessageType.加入群,{
                
            })
            console.log(`正在发送加入 ${群ID} 群请求`);
            this.sendMessage({
                群ID: 群ID
            }, (response: any) => {
                // 如果收到 offer 消息
                if (response.data.offer) {
                    console.log("收到 offer, 创建 answer");
                    // 设置远端的 SDP
                    this.peerConnection.setRemoteDescription(new RTCSessionDescription(response.data.offer)).then(() => {
                        // 创建 answer
                        this.peerConnection.createAnswer().then(value => {
                            // 触发ICE事件
                            this.peerConnection.setLocalDescription(value).then(() => {
                                // 将 answer 通过服务器发送给房主
                                this.ws.send(JSON.stringify({
                                    type: MessageType.群主接收,
                                    data: {
                                        answer: value
                                    }
                                }));
                            });
                        });
                    });
                } else {
                    console.log(`加入群失败 :${response.data.error}`);
                }
                callback(response.data);
            });
        }
    }

    退出群(群ID: number, callback: handler) {
        if (this.ws.readyState === WebSocket.OPEN) {
            const message = {
                type: MessageType.退出群,
                data: {
                    群ID: 群ID
                }
            };
            console.log(`正在发送退出 ${群ID} 群请求`);
            this.sendMessage(message, (response: any) => {
                callback(response.data);
            });
        }
    }

    取群列表(callback: handler) {
        if (this.ws.readyState === WebSocket.OPEN) {
            const message = {
                type: MessageType.取群列表,
                data: {}
            };
            this.sendMessage(message, callback);
            console.log(`房间列表已获取`);
        }
    }

    // 可选：关闭连接
    closeConnection() {
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        if (this.ws) {
            this.ws.close();
        }
        console.log("连接已关闭");
    }
}
