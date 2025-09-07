enum MessageType {
    创建群,
    退出群,
    加入群,
    ICE变更,
    回调消息,
    群主接收,
    群员接收,
    取群列表
}

class MessagePacket {

    type: MessageType;
    data: {};

    constructor(type: MessageType, data?: {}) {
        this.type = type;
        this.data = data;
    }
}