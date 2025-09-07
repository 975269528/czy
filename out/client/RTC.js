var RTC = (function () {
    function RTC() {
        var _this_1 = this;
        this.handlers = new Map();
        this.ws_url = "ws://localhost:8080/ws";
        this.ws = new WebSocket(this.ws_url);
        this.peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:your.turn.server:3478", username: "user", credential: "pass" },
            ]
        });
        this.dataChannel = this.peerConnection.createDataChannel("chat");
        this.dataChannel.onopen = function () {
            if (_this_1.dataChannel.readyState === 'open') {
                console.log("DataChannel 连接已打开");
                _this_1.dataChannel.send("Hello from client A!");
            }
            else {
                console.log("DataChannel 连接未打开");
            }
        };
        this.peerConnection.ondatachannel = function (event) {
            var dataChannel = event.channel;
            console.log("接收到 DataChannel: ", dataChannel.label);
            dataChannel.onopen = function () {
                console.log("DataChannel 已打开");
            };
            dataChannel.onmessage = function (event) {
                console.log("收到消息: ", event.data);
            };
        };
        this.dataChannel.onmessage = function (event) {
            console.log("收到对方消息:", event.data);
        };
        this.peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                _this_1.ws.send(JSON.stringify(new MessagePacket(MessageType.ICE变更, { candidate: event.candidate })));
            }
        };
        this.ws.onmessage = function (event) {
            try {
                var message = JSON.parse(event.data);
                if (message.type == "回调事件") {
                    if (message.data.requestId && _this_1.handlers.has(message.data.requestId)) {
                        var cb = _this_1.handlers.get(message.data.requestId);
                        cb(message);
                        _this_1.handlers.delete(message.data.requestId);
                    }
                }
                else if (message.type == "房主事件") {
                    if (message.data.answer) {
                        console.log("收到 answer, 设置远端描述");
                        _this_1.peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.answer));
                    }
                    if (message.data.candidate) {
                        console.log("收到 ICE candidate");
                        _this_1.peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate));
                    }
                }
            }
            catch (e) {
                console.error("消息解析失败:", event.data);
            }
        };
        this.ws.onopen = function () {
            console.log("信令服务器已连接");
        };
        this.ws.onclose = function () {
            console.log("信令服务器已关闭");
        };
    }
    Object.defineProperty(RTC, "\u5B9E\u4F8B", {
        get: function () {
            var _a;
            return (_a = this._实例) !== null && _a !== void 0 ? _a : (this._实例 = new RTC());
        },
        enumerable: false,
        configurable: true
    });
    RTC.prototype.generateId = function () {
        return Math.random().toString(36).slice(2);
    };
    RTC.prototype.sendMessage = function (data, callback) {
        if (this.ws.readyState === WebSocket.OPEN) {
            var requestId = this.generateId();
            this.handlers.set(requestId, callback);
            this.ws.send(JSON.stringify(new MessagePacket(MessageType.回调消息, {
                requestId: requestId,
                data: data
            })));
        }
    };
    RTC.prototype.创建群 = function (房间名称, 房间密码, 是否公开, callback) {
        var _this_1 = this;
        if (this.ws.readyState === WebSocket.OPEN) {
            this.peerConnection.createOffer().then(function (value) {
                _this_1.peerConnection.setLocalDescription(value);
                _this_1.sendMessage(new MessagePacket(MessageType.创建群, {
                    offer: value,
                    房间名称: 房间名称,
                    房间密码: 房间密码,
                    是否公开: 是否公开,
                }), callback);
                console.log("\u5DF2\u53D1\u9001\u521B\u5EFA\u623F\u95F4\u8BF7\u6C42");
            }).catch(function (error) {
                console.log("\u521B\u5EFA\u623F\u95F4\u5931\u8D25: " + error);
            });
        }
    };
    RTC.prototype.加入群 = function (群ID, callback) {
        var _this_1 = this;
        if (this.ws.readyState === WebSocket.OPEN) {
            var message = {
                type: MessageType.加入群,
                data: 
            };
            console.log("\u6B63\u5728\u53D1\u9001\u52A0\u5165 " + 群ID + " \u7FA4\u8BF7\u6C42");
            this.sendMessage({
                群ID: 群ID
            }, function (response) {
                if (response.data.offer) {
                    console.log("收到 offer, 创建 answer");
                    _this_1.peerConnection.setRemoteDescription(new RTCSessionDescription(response.data.offer)).then(function () {
                        _this_1.peerConnection.createAnswer().then(function (value) {
                            _this_1.peerConnection.setLocalDescription(value).then(function () {
                                _this_1.ws.send(JSON.stringify({
                                    type: MessageType.群主接收,
                                    data: {
                                        answer: value
                                    }
                                }));
                            });
                        });
                    });
                }
                else {
                    console.log("\u52A0\u5165\u7FA4\u5931\u8D25 :" + response.data.error);
                }
                callback(response.data);
            });
        }
    };
    RTC.prototype.退出群 = function (群ID, callback) {
        if (this.ws.readyState === WebSocket.OPEN) {
            var message = {
                type: MessageType.退出群,
                data: {
                    群ID: 群ID
                }
            };
            console.log("\u6B63\u5728\u53D1\u9001\u9000\u51FA " + 群ID + " \u7FA4\u8BF7\u6C42");
            this.sendMessage(message, function (response) {
                callback(response.data);
            });
        }
    };
    RTC.prototype.取群列表 = function (callback) {
        if (this.ws.readyState === WebSocket.OPEN) {
            var message = {
                type: MessageType.取群列表,
                data: {}
            };
            this.sendMessage(message, callback);
            console.log("\u623F\u95F4\u5217\u8868\u5DF2\u83B7\u53D6");
        }
    };
    RTC.prototype.closeConnection = function () {
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        if (this.ws) {
            this.ws.close();
        }
        console.log("连接已关闭");
    };
    RTC._实例 = null;
    return RTC;
}());
//# sourceMappingURL=RTC.js.map