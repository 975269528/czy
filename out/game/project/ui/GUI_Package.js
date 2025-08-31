














var GUI_Package = (function (_super) {
    __extends(GUI_Package, _super);
    function GUI_Package() {
        var _this_1 = _super.call(this) || this;
        GUI_Manager.standardList(_this_1.list, false);
        _this_1.on(EventObject.DISPLAY, _this_1, _this_1.onDisplay);
        _this_1.list.on(EventObject.CHANGE, _this_1, _this_1.refreshItemInfo);
        _this_1.list.on(UIList.ITEM_CLICK, _this_1, _this_1.onItemClick);
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, _this_1.onItemChange, _this_1);
        _this_1.list.onCreateItem = Callback.New(_this_1.onCreateItemUI, _this_1);
        return _this_1;
    }
    GUI_Package.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.refreshItems(0);
        this.refreshItemInfo();
    };
    GUI_Package.prototype.onCreateItemUI = function (ui, data, index) {
        var itemDS = data.data;
        if (!itemDS)
            ui.alpha = 0;
        if (itemDS && !itemDS.item.isUse) {
            ui.itemName.alpha = ui.icon.alpha = ui.itemNum.alpha = 0.2;
        }
    };
    GUI_Package.prototype.onItemChange = function () {
        Callback.CallLaterBeforeRender(this.refreshItems, this, [0]);
    };
    GUI_Package.prototype.onItemClick = function () {
        var _this_1 = this;
        if (this.useItemLock)
            return;
        var selectedItem = this.list.selectedItem;
        if (selectedItem && selectedItem.data) {
            var itemDS = selectedItem.data;
            var item = itemDS.item;
            if (item.isUse) {
                if (item.se)
                    GameAudio.playSE(item.se);
                this.useItemLock = true;
                var trigger = CommandPage.startTriggerFragmentEvent(item.callEvent, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                    _this_1.useItemLock = false;
                }, this));
                if (!trigger)
                    this.useItemLock = false;
                if (item.isConsumables)
                    ProjectPlayer.changeItemNumber(item.id, -1);
            }
            else {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
        }
    };
    GUI_Package.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var arr = [];
        for (var i = 0; i < Game.player.data.package.length; i++) {
            var d = new ListItem_1002;
            var itemDS = Game.player.data.package[i];
            d.data = itemDS;
            d.icon = itemDS.item.icon;
            d.itemName = itemDS.item.name;
            d.itemNum = "x" + itemDS.number.toString();
            arr.push(d);
        }
        if (Game.player.data.package.length == 0) {
            var emptyItem = new ListItem_1002;
            emptyItem.icon = "";
            emptyItem.itemName = "";
            emptyItem.itemNum = "";
            arr.push(emptyItem);
        }
        arr.sort(function (aListItem, bListItem) {
            var a = aListItem.data;
            var b = bListItem.data;
            if (!a || !b)
                return -1;
            if (a.item.isUse != b.item.isUse) {
                return a.item.isUse ? -1 : 1;
            }
            else {
                return a.item.id < b.item.id ? -1 : 1;
            }
        });
        this.list.items = arr;
    };
    GUI_Package.prototype.refreshItemInfo = function () {
        var selectedItem = this.list.selectedItem;
        if (!selectedItem || !selectedItem.data) {
            this.itemName.text = "";
            this.itemIntro.text = "";
        }
        else {
            var itemDS = selectedItem.data;
            this.itemName.text = itemDS.item.name;
            this.itemIntro.text = itemDS.item.intro;
        }
        this.itemIntro.height = this.itemIntro.textHeight;
        this.itemIntroRoot.refresh();
    };
    return GUI_Package;
}(GUI_4));
//# sourceMappingURL=GUI_Package.js.map