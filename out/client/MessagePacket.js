;var MessageType;
(function (MessageType) {
    MessageType[MessageType["\u521B\u5EFA\u7FA4"] = 0] = "\u521B\u5EFA\u7FA4";
    MessageType[MessageType["\u9000\u51FA\u7FA4"] = 1] = "\u9000\u51FA\u7FA4";
    MessageType[MessageType["\u52A0\u5165\u7FA4"] = 2] = "\u52A0\u5165\u7FA4";
    MessageType[MessageType["ICE\u53D8\u66F4"] = 3] = "ICE\u53D8\u66F4";
    MessageType[MessageType["\u56DE\u8C03\u6D88\u606F"] = 4] = "\u56DE\u8C03\u6D88\u606F";
    MessageType[MessageType["\u7FA4\u4E3B\u63A5\u6536"] = 5] = "\u7FA4\u4E3B\u63A5\u6536";
    MessageType[MessageType["\u7FA4\u5458\u63A5\u6536"] = 6] = "\u7FA4\u5458\u63A5\u6536";
    MessageType[MessageType["\u53D6\u7FA4\u5217\u8868"] = 7] = "\u53D6\u7FA4\u5217\u8868";
})(MessageType || (MessageType = {}));
var MessagePacket = (function () {
    function MessagePacket(type, data) {
        this.type = type;
        this.data = data;
    }
    return MessagePacket;
}());
//# sourceMappingURL=MessagePacket.js.map