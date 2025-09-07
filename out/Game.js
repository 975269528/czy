var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 自定义事件命令
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
var CommandExecute;
(function (CommandExecute) {
    //------------------------------------------------------------------------------------------------------
    // 交互
    //------------------------------------------------------------------------------------------------------
    /**
     * 预加载
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值（如有）
     * @param p 自定义命令参数
     */
    function customCommand_1(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var _this = this;
        // 如果不存在预加载则忽略掉
        if (p.preloadAssets.length == 0)
            return;
        // 暂停当前触发线的事件推进，当加载资源完毕时再继续执行
        trigger.pause = true;
        // 推进一行，以便下次执行时执行下一行事件
        trigger.offset(1);
        var g = getAssetValues;
        // 图集
        var imageArr = g(0);
        // 判断是否存在字体加载
        var fontArr = g(7);
        var hasFont;
        if (fontArr.length > 0) {
            hasFont = true;
        }
        // 如果需要显示加载界面的话则打开界面
        if (p.isShowLoadingUI && p.bindingUI && p.bindingUI.uiID) {
            // 该界面本身要加载（使用了自动释放模式的预载入，所以会自动清空此次预加载的引用）
            AssetManager.preLoadUIAsset(p.bindingUI.uiID, Callback.New(function () {
                var loadingUI = GameUI.show(p.bindingUI.uiID);
                doLoadAsset.apply(_this, [loadingUI]);
            }, this), true, true, true);
        }
        else {
            doLoadAsset.apply(this);
        }
        // 加载完毕时处理
        function onLoadComplete(displayProgressComp) {
            setProgressUI.apply(this, [displayProgressComp, 100]);
            Callback.New(function () {
                if (p.isShowLoadingUI && p.bindingUI)
                    GameUI.dispose(p.bindingUI.uiID);
                CommandPage.executeEvent(trigger);
            }, this).delayRun(100);
        }
        // 加载资源
        function doLoadAsset(loadingUI) {
            var _this = this;
            // 如果存在需要显示加载进度效果的话则准备显示
            var displayProgressComp = null;
            if (loadingUI && p.bindingUI && p.bindingUI.uiID && p.bindingUI.compName && p.bindingUI.varName) {
                displayProgressComp = loadingUI[p.bindingUI.compName];
                if (!displayProgressComp) {
                    trace("error:can not find component:".concat(p.bindingUI.compName));
                }
            }
            // 加载资源
            AssetManager.batchPreLoadAsset(Callback.New(function () {
                if (hasFont) {
                    AssetManager.preloadFonts(Callback.New(onLoadComplete, _this, [displayProgressComp]));
                }
                else {
                    onLoadComplete.apply(_this, [displayProgressComp]);
                }
            }, this, [1, true]), Callback.New(function (current, count) {
                // 若存在字体文件
                if (hasFont)
                    count += 1;
                // 显示加载进度效果
                var progressStr = Math.floor(current * 100 / count).toString();
                setProgressUI.apply(_this, [displayProgressComp, progressStr]);
            }, this), imageArr, [], g(2), g(3), g(4), g(5), [], g(1), g(6));
        }
        // 根据资源类别筛选数组
        function getAssetValues(assetType) {
            // -- 筛选对应assetType的资源组，如获取所有需要预加载的图像组DataStructure格式数据
            var dsArr = ArrayUtils.matchAttributes(p.preloadAssets, { assetType: assetType }, false);
            // -- 获取DataStructure格式数组内对象的资源属性值重新组成一个新的数组
            return ArrayUtils.getChildAttributeToCreateArray(dsArr, "asset" + assetType);
        }
        // 进度条
        function setProgressUI(displayProgressComp, v) {
            if (!displayProgressComp)
                return;
            v = MathUtils.int(v);
            Tween.clearAll(displayProgressComp);
            var attrObj = {};
            attrObj[p.bindingUI.varName] = v;
            Tween.to(displayProgressComp, attrObj, 100);
        }
    }
    CommandExecute.customCommand_1 = customCommand_1;
    /**
     * 等待玩家输入文本
     */
    function customCommand_2(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var _this = this;
        if (p.inputUI == 0)
            return;
        var inputUI = GameUI.show(p.inputUI);
        var inputText = inputUI["input"];
        if (inputText) {
            inputText.setTextForce(p.useVar == 1 ? Game.player.variable.getString(p.defTextVarID) : p.defText);
            inputText.focus = true;
            inputText.off(EventObject.ENTER, inputText, ____onInputEnter);
            inputText.on(EventObject.ENTER, inputText, ____onInputEnter, [p.inputUI]);
        }
        trigger.pause = true;
        inputUI.once(EventObject.REMOVED, this, function () {
            trigger.offset(1);
            Callback.CallLaterBeforeRender(function () {
                // @ts-ignore
                CommandPage.executeEvent.apply(_this, arguments);
            }, CommandPage, [trigger, [inputText ? inputText.text : ""]]);
        }, []);
    }
    CommandExecute.customCommand_2 = customCommand_2;
    function ____onInputEnter(uiID) {
        GameUI.hide(uiID);
    }
    /**
     * 按键事件
     */
    var keyEventSigns = {};
    function customCommand_3(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 永久,执行一次,调用该命令时执行的事件完毕为止
        var evType = (p.isMulKey == 1 || p.isMulKey == 3) ? p.evType2 : p.evType;
        var typeEvent = evType != 1 ? EventObject.KEY_DOWN : EventObject.KEY_UP;
        var sign;
        // 根据执行一次与否决定使用on或once
        var f = function (p, trigger, sign, e) {
            var bool = false;
            // 普通单按键
            if (p.isMulKey == 0) {
                bool = e.keyCode == p.key;
            }
            // 普通多按键
            else if (p.isMulKey == 1) {
                bool = p.keys.indexOf(e.keyCode) != -1;
            }
            // 系统单按键
            else if (p.isMulKey == 2) {
                var systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
                var systemKeyboardInfo = GUI_Setting.KEY_BOARD[systemKeyName];
                bool = systemKeyboardInfo.keys.indexOf(e.keyCode) != -1;
            }
            // 系统多按键
            else {
                bool = false;
                for (var i = 0; i < p.systemKeys.length; i++) {
                    var systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKeys[i]];
                    var systemKeyboardInfo = GUI_Setting.KEY_BOARD[systemKeyName];
                    bool = systemKeyboardInfo.keys.indexOf(e.keyCode) != -1;
                    if (bool)
                        break;
                }
            }
            // 组合键判定
            if (p.isMulKey <= 1) {
                if (((p.CTRL && !e.ctrlKey) || (!p.CTRL && e.ctrlKey)) && e.keyCode != 17 /*Keyboard.CONTROL*/)
                    bool = false;
                if (((p.SHIFT && !e.shiftKey) || (!p.SHIFT && e.shiftKey)) && e.keyCode != 16 /*Keyboard.SHIFT*/)
                    bool = false;
                if (((p.ALT && !e.altKey) || (!p.ALT && e.altKey)) && e.keyCode != 18 /*Keyboard.ALTERNATE*/)
                    bool = false;
            }
            // 是否未按下的模式
            var isNotKeyDown = (!(p.isMulKey == 1 || p.isMulKey == 3) && p.evType == 2);
            // 未按下模式下未按下或满足按下条件
            if ((isNotKeyDown && !bool) || (!isNotKeyDown && bool)) {
                if (p.type == 1) {
                    // @ts-ignore
                    stage.off(typeEvent, trigger, arguments.callee);
                    if (sign)
                        delete keyEventSigns[sign];
                }
                CommandPage.startTriggerFragmentEvent(p.eventPage, Game.player.sceneObject, Game.player.sceneObject);
            }
        };
        // 记录按键标识
        if (p.recordListen && p.recordListenVar > 0) {
            sign = ObjectUtils.getRandID();
            keyEventSigns[sign] = { typeEvent: typeEvent, thisPtr: trigger, func: f };
            Game.player.variable.setString(p.recordListenVar, sign);
        }
        // 注册按键事件
        stage.on(typeEvent, trigger, f, [p, trigger, sign]);
        // 调用该命令时执行的事件完毕为止：监听当前事件完毕，完毕则清除掉该次按键事件
        if (p.type == 2) {
            EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New(function (typeEvent, trigger, f, sign) {
                stage.off(typeEvent, trigger, f);
                if (sign)
                    delete keyEventSigns[sign];
            }, this, [typeEvent, trigger, f, sign]), true);
        }
    }
    CommandExecute.customCommand_3 = customCommand_3;
    /**
     * 鼠标事件
     */
    var mouseEventSigns = {};
    function customCommand_4(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 永久,执行一次,调用该命令时执行的事件完毕为止
        var typeEvent = MouseControl.mouseEvents[p.mouseType];
        var sign;
        // 根据执行一次与否决定使用on或once
        var f = function (typeEvent, p, trigger, sign, e) {
            if (e.type == typeEvent) {
                if (p.type == 1) {
                    // @ts-ignore
                    stage.off(typeEvent, trigger, arguments.callee);
                    if (sign)
                        delete mouseEventSigns[sign];
                }
                CommandPage.startTriggerFragmentEvent(p.eventPage, Game.player.sceneObject, Game.player.sceneObject);
            }
        };
        // 记录鼠标标识
        if (p.recordListen && p.recordListenVar > 0) {
            sign = ObjectUtils.getRandID();
            mouseEventSigns[sign] = { typeEvent: typeEvent, thisPtr: trigger, func: f };
            Game.player.variable.setString(p.recordListenVar, sign);
        }
        // 仅限于场景上使用
        if (p.onlyInScene) {
            MouseControl.eventDispatcher.on(typeEvent, trigger, f, [typeEvent, p, trigger, sign]);
        }
        else {
            stage.on(typeEvent, trigger, f, [typeEvent, p, trigger, sign]);
        }
        // 调用该命令时执行的事件完毕为止：监听当前事件完毕，完毕则清除掉该次按键事件
        if (p.type == 2) {
            EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New(function (onlyInScene, typeEvent, trigger, f, sign) {
                if (p.onlyInScene) {
                    MouseControl.eventDispatcher.off(typeEvent, trigger, f);
                }
                else {
                    stage.off(typeEvent, trigger, f);
                }
                if (sign)
                    delete mouseEventSigns[sign];
            }, this, [p.onlyInScene, typeEvent, trigger, f, sign]), true);
        }
    }
    CommandExecute.customCommand_4 = customCommand_4;
    /**
     * 设置界面属性
     */
    function customCommand_5(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 获取界面
        var uiID = p.useVar ? Game.player.variable.getVariable(p.uiIDvarID) : p.uiID;
        var ui = GameUI.get(uiID);
        if (!ui)
            return;
        // 修改本体属性
        if (p.type == 0) {
            var uiAttrName = p.uiAttrNameUseVar ? Game.player.variable.getString(p.uiAttrNameVarID) : p.uiAttrName;
            var uiAttrValue = void 0;
            if (p.uiAttrValueUseVar == 0) {
                uiAttrValue = p.uiAttrValue;
            }
            else if (p.uiAttrValueUseVar == 1) {
                uiAttrValue = Game.player.variable.getVariable(p.uiAttrValueVarID1);
            }
            else if (p.uiAttrValueUseVar == 2) {
                uiAttrValue = Game.player.variable.getSwitch(p.uiAttrValueVarID2) ? true : false;
            }
            else if (p.uiAttrValueUseVar == 3) {
                uiAttrValue = Game.player.variable.getString(p.uiAttrValueVarID3);
            }
            setSafeValue(ui, uiAttrName, uiAttrValue);
        }
        // 修改元件属性
        else {
            var compName = p.compNameUseVar ? Game.player.variable.getString(p.compNameVarID) : p.compName;
            var comp = ui[compName];
            if (!comp)
                return;
            var compAttrName = p.compAttrNameUseVar ? Game.player.variable.getString(p.compAttrNameVarID) : p.compAttrName;
            var compAttrValue = void 0;
            if (p.compAttrValueUseVar == 0) {
                compAttrValue = p.compAttrValue;
            }
            else if (p.compAttrValueUseVar == 1) {
                compAttrValue = Game.player.variable.getVariable(p.compAttrValueVarID1);
            }
            else if (p.compAttrValueUseVar == 2) {
                compAttrValue = Game.player.variable.getSwitch(p.compAttrValueVarID2) ? true : false;
            }
            else if (p.compAttrValueUseVar == 3) {
                compAttrValue = Game.player.variable.getString(p.compAttrValueVarID3);
            }
            setSafeValue(comp, compAttrName, compAttrValue);
        }
        function setSafeValue(obj, attrName, newValue) {
            var attrType = obj[attrName];
            if (typeof attrType == "string") {
                obj[attrName] = String(newValue);
            }
            else if (typeof attrType == "number") {
                obj[attrName] = MathUtils.float(newValue);
            }
            else if (typeof attrType == "boolean") {
                obj[attrName] = newValue == "true" ? true : (newValue != "false" && newValue != "0" ? true : false);
            }
            else {
                obj[attrName] = newValue;
            }
        }
    }
    CommandExecute.customCommand_5 = customCommand_5;
    /**
     * 按钮按键焦点设置
     */
    var ____uiButtonFocus = {};
    function customCommand_6(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var uiID = p.useVar ? Game.player.variable.getVariable(p.uiIDVarID) : p.uiID;
        var ui = GameUI.get(uiID);
        if (!ui || !ui.stage)
            return;
        // 根据参数记录标识
        var sign;
        var btnFocusManager;
        if (p.useCache) {
            sign = "";
            sign += uiID + "_";
            sign += p.isAutoFocus ? "1_" : "0_";
            sign += p.isAddButton ? "1_" : "0_";
            sign += p.isExcludeButton ? "1_" : "0_";
            if (p.isAutoFocus) {
                sign += p.autoFocusType ? "1_" : "0_";
                sign += "_".concat(p.autoFocusParentCompName, "_");
            }
            if (p.isAddButton) {
                sign += p.addButtons.join("+");
            }
            if (p.isExcludeButton) {
                sign += p.excludeButtons.join("-");
            }
            sign += p.selEffectUI + "_";
            sign += p.useFocusAnimation ? "1_" : "0_";
            btnFocusManager = ____uiButtonFocus[sign];
        }
        if (btnFocusManager) {
            btnFocusManager.shortcutKeyExit = p.shortcutKeyExit;
            btnFocusManager.whenExitBackLastFocus = p.whenExitBackLastFocus;
            btnFocusManager.whenExitEvent = p.whenExitEvent;
        }
        else {
            btnFocusManager = ____uiButtonFocus[sign] = new FocusButtonsManager(ui, p.isAutoFocus, p.isAddButton ? p.addButtons : [], p.isExcludeButton ? p.excludeButtons : [], p.selEffectUI, p.useFocusAnimation, p.shortcutKeyExit, p.whenExitBackLastFocus, p.autoFocusType, p.autoFocusParentCompName);
            btnFocusManager.whenExitEvent = p.whenExitEvent;
            // 监听销毁事件，如果界面被销毁则此处也清理掉引用记录
            ui.once(GameSprite.ON_DISPOSE, this, function (sign, btnFocusManager) {
                delete ____uiButtonFocus[sign];
                btnFocusManager.dispose();
            }, [sign, btnFocusManager]);
        }
        if (btnFocusManager.buttons.length == 0)
            return;
        // 设置焦点
        FocusButtonsManager.focus = btnFocusManager;
        // 非缓存模式下，当按钮焦点发生变化时
        if (!p.useCache) {
            EventUtils.addEventListenerFunction(FocusButtonsManager, FocusButtonsManager.EVENT_UNACTIVATE, onUnActivateFocus, btnFocusManager, [btnFocusManager]);
        }
        // 设置焦点索引
        if (p.setSelectedIndex && FocusButtonsManager.focus) {
            FocusButtonsManager.focus.selectedIndex = p.selectedIndex;
        }
    }
    CommandExecute.customCommand_6 = customCommand_6;
    function onUnActivateFocus(buttonFocus, unActivateFocus) {
        if (buttonFocus == unActivateFocus) {
            EventUtils.removeEventListenerFunction(FocusButtonsManager, FocusButtonsManager.EVENT_UNACTIVATE, onUnActivateFocus, buttonFocus);
            buttonFocus.dispose();
        }
    }
    /**
     * 关闭界面焦点
     */
    function customCommand_7(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (p.focusType == 0 || p.focusType == 2) {
            FocusButtonsManager.focus = null;
        }
        if (p.focusType == 1 || p.focusType == 2) {
            UIList.focus = null;
        }
    }
    CommandExecute.customCommand_7 = customCommand_7;
    /**
     * 取消按键事件
     */
    function customCommand_8(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var sign = Game.player.variable.getString(p.recordListenVar);
        if (sign) {
            var keyInfo = keyEventSigns[sign];
            if (keyInfo) {
                stage.off(keyInfo.typeEvent, keyInfo.thisPtr, keyInfo.func);
            }
        }
    }
    CommandExecute.customCommand_8 = customCommand_8;
    /**
     * 取消鼠标事件
     */
    function customCommand_9(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var sign = Game.player.variable.getString(p.recordListenVar);
        if (sign) {
            var mouseInfo = mouseEventSigns[sign];
            if (mouseInfo) {
                stage.off(mouseInfo.typeEvent, mouseInfo.thisPtr, mouseInfo.func);
                MouseControl.eventDispatcher.off(mouseInfo.typeEvent, mouseInfo.thisPtr, mouseInfo.func);
            }
        }
    }
    CommandExecute.customCommand_9 = customCommand_9;
    /**
     * 模拟按键
     */
    function customCommand_10(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 键盘按键
        if (p.isMulKey == 0) {
            simulateKey(p.key);
        }
        // 系统按键
        else {
            var systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
            var systemKeyboardInfo = GUI_Setting.KEY_BOARD[systemKeyName];
            var realKeyCode = systemKeyboardInfo.keys[0];
            if (!realKeyCode)
                return;
            simulateKey(realKeyCode);
        }
        // 模拟按键
        function simulateKey(key) {
            // -- 按下/弹起
            if (p.evType <= 1) {
                var e = new EventObject;
                e.type = [EventObject.KEY_DOWN, EventObject.KEY_UP][p.evType];
                var oe = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT });
                e.nativeEvent = oe;
                e.keyCode = key;
                stage.event(e.type, [e]);
            }
            // -- 按下并弹起
            else if (p.evType == 2) {
                var e = new EventObject;
                e.type = EventObject.KEY_DOWN;
                var oe = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT });
                e.nativeEvent = oe;
                e.keyCode = key;
                stage.event(EventObject.KEY_DOWN, [e]);
                setTimeout(function () {
                    var e = new EventObject;
                    e.type = EventObject.KEY_UP;
                    var oe = new KeyboardEvent(e.type, { ctrlKey: p.CTRL, shiftKey: p.SHIFT, altKey: p.ALT });
                    e.nativeEvent = oe;
                    e.keyCode = key;
                    stage.event(e.type, [e]);
                }, p.interval);
            }
        }
    }
    CommandExecute.customCommand_10 = customCommand_10;
    /**
     * 提交信息
     */
    function customCommand_11(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var inputMessages = [];
        for (var i = 0; i < p.messages.length; i++) {
            var d = p.messages[i];
            var f = void 0;
            var v = void 0;
            if (d.type == 0) {
                f = CustomGameNumber["f" + d.numberValue[0]];
                v = f ? f(null, d.numberValue[1]) : null;
                inputMessages.push(v);
            }
            else if (d.type == 1) {
                f = CustomCondition["f" + d.booleanValue[0]];
                v = f ? f(null, d.booleanValue[1]) : null;
                inputMessages.push(v);
            }
            else if (d.type == 2) {
                f = CustomGameString["f" + d.stringValue[0]];
                v = f ? f(null, d.stringValue[1]) : null;
                inputMessages.push(v);
            }
        }
        GameCommand.inputMessageAndContinueExecute(inputMessages);
    }
    CommandExecute.customCommand_11 = customCommand_11;
    /**
     * 选中列表焦点
     */
    function customCommand_12(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var uiListInfo = p.list;
        if (!uiListInfo)
            return;
        var ui = GameUI.get(uiListInfo.uiID);
        if (!ui)
            return;
        var uiList = ui[uiListInfo.compName];
        if (!uiList || !(uiList instanceof UIList))
            return;
        UIList.focus = uiList;
    }
    CommandExecute.customCommand_12 = customCommand_12;
    /**
     * 倒计时
     */
    var countDownStartTime = 0;
    CommandExecute.countDownNowTime = 0;
    var countDownNowType = 2;
    var settingTime;
    function customCommand_13(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        GameUI.show(13);
        settingTime = p.second + p.minute * 60;
        countDownNowType = p.type;
        if (p.type == 0 || p.type == 1) {
            countDownStartTime = Game.now;
            os.remove_ENTERFRAME(countDownLoop, globalThis);
            os.add_ENTERFRAME(countDownLoop, globalThis, [p.type]);
        }
        else {
            os.remove_ENTERFRAME(countDownLoop, globalThis);
            GameUI.hide(13);
        }
    }
    CommandExecute.customCommand_13 = customCommand_13;
    function countDownLoop(type) {
        var dt = Game.now - countDownStartTime;
        if (type == 0) {
            CommandExecute.countDownNowTime = Math.max(Math.floor(settingTime - dt * 0.001), 0);
        }
        else {
            CommandExecute.countDownNowTime = Math.floor(settingTime + dt * 0.001);
        }
        var newTime = new Date(CommandExecute.countDownNowTime * 1000);
        var timeUI = GameUI.get(13);
        if (timeUI)
            timeUI.time.text = ProjectUtils.dateFormat("MM:SS", newTime);
    }
    SinglePlayerGame.regSaveCustomData("____countDown", Callback.New(function () {
        return { countDownStartTime: countDownStartTime, countDownNowTime: CommandExecute.countDownNowTime, countDownNowType: countDownNowType, settingTime: settingTime };
    }, globalThis));
    EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_ON_AFTER_RECOVERY_DATA, Callback.New(function (trigger) {
        var d = SinglePlayerGame.getSaveCustomData("____countDown");
        if (d) {
            countDownStartTime = d.countDownStartTime;
            CommandExecute.countDownNowTime = d.countDownNowTime;
            countDownNowType = d.countDownNowType;
            settingTime = d.settingTime;
            if (countDownNowType <= 1) {
                os.add_ENTERFRAME(countDownLoop, globalThis, [countDownNowType, settingTime]);
            }
        }
    }, null));
    //------------------------------------------------------------------------------------------------------
    // 效果
    //------------------------------------------------------------------------------------------------------
    /**
     * 设置数据层
     */
    function customCommand_1001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var xGrid = p.useVar ? Game.player.variable.getVariable(p.xVarID) : p.x;
        var yGrid = p.useVar ? Game.player.variable.getVariable(p.yVarID) : p.y;
        if (xGrid < 0 || xGrid >= Game.currentScene.gridWidth)
            return;
        if (yGrid < 0 || yGrid >= Game.currentScene.gridHeight)
            return;
        var state = p.on == 2 ? p.value : (p.on == 0 ? 1 : 0);
        var dataLayerIndex = p.layer;
        Game.currentScene.setDataGridState(dataLayerIndex, xGrid, yGrid, state);
    }
    CommandExecute.customCommand_1001 = customCommand_1001;
    /**
     * 绘制图块
     */
    function customCommand_1002(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 图块
        var layerID = p.layerUseVar ? Game.player.variable.getVariable(p.layerVarID) : p.layer;
        var layer = Game.currentScene.getLayerByPreset(layerID);
        if (!layer || !layer.drawMode)
            return;
        var tileData = TileData.getTileData(p.tileID);
        var xGrid = p.useVar ? Game.player.variable.getVariable(p.xVarID) : p.x;
        var yGrid = p.useVar ? Game.player.variable.getVariable(p.yVarID) : p.y;
        if (xGrid < 0 || xGrid >= Game.currentScene.gridWidth)
            return;
        if (yGrid < 0 || yGrid >= Game.currentScene.gridHeight)
            return;
        // 如果贴图不存在于内存中则忽略
        var tex = AssetManager.getImage(tileData.url);
        if (!tex)
            return;
        // 贴图图源超出范围的话则忽略
        var texGridW = Math.floor(tex.width / Config.SCENE_GRID_SIZE);
        var texGridH = Math.floor(tex.height / Config.SCENE_GRID_SIZE);
        if (p.sourceX < 0 || p.sourceX >= texGridW || p.sourceY < 0 || p.sourceY >= texGridH)
            return;
        layer.drawTile(xGrid, yGrid, { tex: tex, texID: p.tileID, x: p.sourceX * Config.SCENE_GRID_SIZE, y: p.sourceY * Config.SCENE_GRID_SIZE, w: Config.SCENE_GRID_SIZE, h: Config.SCENE_GRID_SIZE });
        // 到下一次渲染前调用flushTile，以便优化性能
        Callback.CallLaterBeforeRender(layer.flushTile, layer);
    }
    CommandExecute.customCommand_1002 = customCommand_1002;
    /**
     * 绘制自动元件
     */
    function customCommand_1003(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 图块
        var layerID = p.layerUseVar ? Game.player.variable.getVariable(p.layerVarID) : p.layer;
        var layer = Game.currentScene.getLayerByPreset(layerID);
        if (!layer || !layer.drawMode)
            return;
        var tileData = AutoTileData.getAutoTileData(p.autoTileID);
        var xGrid = p.useVar ? Game.player.variable.getVariable(p.xVarID) : p.x;
        var yGrid = p.useVar ? Game.player.variable.getVariable(p.yVarID) : p.y;
        if (xGrid < 0 || xGrid >= Game.currentScene.gridWidth)
            return;
        if (yGrid < 0 || yGrid >= Game.currentScene.gridHeight)
            return;
        // 如果贴图不存在于内存中则忽略
        var tex = AssetManager.getImage(tileData.url);
        if (!tex)
            return;
        layer.drawAutoTile(xGrid, yGrid, p.autoTileID, tex);
        // 到下一次渲染前调用flushTile，以便优化性能
        Callback.CallLaterBeforeRender(layer.flushTile, layer);
    }
    CommandExecute.customCommand_1003 = customCommand_1003;
    /**
     * 清除图块
     */
    function customCommand_1004(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 图块
        var layerID = p.layerUseVar ? Game.player.variable.getVariable(p.layerVarID) : p.layer;
        var layer = Game.currentScene.getLayerByPreset(layerID);
        if (!layer || !layer.drawMode)
            return;
        if (p.type) {
            layer.clearTile();
            return;
        }
        var xGrid = p.useVar ? Game.player.variable.getVariable(p.xVarID) : p.x;
        var yGrid = p.useVar ? Game.player.variable.getVariable(p.yVarID) : p.y;
        if (xGrid < 0 || xGrid >= Game.currentScene.gridWidth)
            return;
        if (yGrid < 0 || yGrid >= Game.currentScene.gridHeight)
            return;
        // 贴图图源超出范围的话则忽略
        layer.drawTile(xGrid, yGrid, null);
        // 到下一次渲染前调用flushTile，以便优化性能
        Callback.CallLaterBeforeRender(layer.flushTile, layer);
    }
    CommandExecute.customCommand_1004 = customCommand_1004;
    /**
     * 设置图层属性
     */
    function customCommand_1005(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 图块
        var layerID = p.layerUseVar ? Game.player.variable.getVariable(p.layerVarID) : p.layerID;
        var layer = Game.currentScene.getLayerByPreset(layerID);
        if (!layer)
            return;
        if (p.offsetEnabled) {
            layer.dx = p.dxUseVar ? Game.player.variable.getVariable(p.dxVarID) : p.dx;
            layer.dy = p.dyUseVar ? Game.player.variable.getVariable(p.dyVarID) : p.dy;
        }
        if (p.scaleEnabled) {
            layer.scaleX = p.scaleXUseVar ? Game.player.variable.getVariable(p.scaleXVarID) : p.scaleX;
            layer.scaleY = p.scaleYUseVar ? Game.player.variable.getVariable(p.scaleYVarID) : p.scaleY;
        }
        if (p.autoMoveEnabled) {
            layer.xMove = p.xMoveUseVar ? Game.player.variable.getVariable(p.xMoveVarID) : p.xMove;
            layer.yMove = p.yMoveUseVar ? Game.player.variable.getVariable(p.yMoveVarID) : p.yMove;
        }
        if (p.alphaEnabled) {
            layer.alpha = p.alphaUseVar ? Game.player.variable.getVariable(p.alphaVarID) : p.alpha;
        }
        if (p.visibleEnabled) {
            layer.visible = p.visibleUseVar ? Game.player.variable.getSwitch(p.visibleVarID) == 1 : (p.visible == 0);
        }
    }
    CommandExecute.customCommand_1005 = customCommand_1005;
    /**
     * 显示动画
     */
    function customCommand_1006(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 场景对象
        if (p.useType == 0) {
            var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.soIndex, p.useVar, p.soIndexVarID, trigger);
            if (!soc)
                return;
            soc.playAnimation(p.aniID, false, true);
        }
        // 场景坐标
        else if (p.useType == 1) {
            var x = void 0, y = void 0;
            if (p.posUseVar) {
                x = Game.player.variable.getVariable(p.xVarID);
                y = Game.player.variable.getVariable(p.yVarID);
            }
            else {
                x = p.x;
                y = p.y;
            }
            if (p.isGrid) {
                x = x * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE * 0.5;
                y = y * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE * 0.5;
            }
            if (x < 0 || x >= Game.currentScene.width || y < 0 || y >= Game.currentScene.height)
                return;
            var layer = p.layer == 1 ? Game.currentScene.animationHighLayer : Game.currentScene.animationLowLayer;
            var ani = new GCAnimation();
            ani.showHitEffect = true;
            ani.once(GCAnimation.PLAY_COMPLETED, this, function (ani) {
                ani.dispose();
            }, [ani]);
            ani.id = p.aniUseVar ? Game.player.variable.getVariable(p.aniIDVarID) : p.aniID;
            ani.play();
            ani.x = x;
            ani.y = y;
            layer.addChild(ani);
        }
    }
    CommandExecute.customCommand_1006 = customCommand_1006;
    /**
     * 镜头缩放
     */
    function customCommand_1007(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var _this = this;
        if (!Game.currentScene)
            return;
        if (p.useTrans) {
            var transData_1 = GameUtils.getTransData(p.trans);
            var sx_1 = p.scaleXUseVar == 1 ? Game.player.variable.getVariable(p.scaleX2) : p.scaleX;
            var sy_1 = p.scaleYUseVar == 1 ? Game.player.variable.getVariable(p.scaleY2) : p.scaleY;
            var oldsx_1 = Game.currentScene.camera.scaleX;
            var oldsy_1 = Game.currentScene.camera.scaleY;
            var frameCount_1 = p.time;
            var scene_1 = Game.currentScene;
            var f = void 0;
            os.add_ENTERFRAME(f = function (f) {
                if (Game.pause)
                    return;
                if (scene_1 != Game.currentScene) {
                    os.remove_ENTERFRAME(f, _this);
                    return;
                }
                frameCount_1--;
                var per = (p.time - frameCount_1) / p.time;
                var value = GameUtils.getValueByTransData(transData_1, per);
                if (p.useScaleX) {
                    Game.currentScene.camera.scaleX = (sx_1 - oldsx_1) * value + oldsx_1;
                }
                if (p.useScaleY) {
                    Game.currentScene.camera.scaleY = (sy_1 - oldsy_1) * value + oldsy_1;
                }
                if (frameCount_1 == 0) {
                    os.remove_ENTERFRAME(f, _this);
                }
            }, this, [f]);
        }
        else {
            if (p.useScaleX) {
                var sx = p.scaleXUseVar == 1 ? Game.player.variable.getVariable(p.scaleX2) : p.scaleX;
                Game.currentScene.camera.scaleX = sx;
            }
            if (p.useScaleY) {
                var sy = p.scaleYUseVar == 1 ? Game.player.variable.getVariable(p.scaleY2) : p.scaleY;
                Game.currentScene.camera.scaleY = sy;
            }
        }
    }
    CommandExecute.customCommand_1007 = customCommand_1007;
    /**
     * 镜头旋转
     */
    function customCommand_1008(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var _this = this;
        if (!Game.currentScene)
            return;
        var ro = p.useVar ? Game.player.variable.getVariable(p.rotationVarID) : p.rotation;
        if (p.useTrans) {
            var transData_2 = GameUtils.getTransData(p.trans);
            var oldro_1 = Game.currentScene.camera.rotation;
            var frameCount_2 = p.time;
            var scene_2 = Game.currentScene;
            var f = void 0;
            os.add_ENTERFRAME(f = function (f) {
                if (Game.pause)
                    return;
                if (scene_2 != Game.currentScene) {
                    os.remove_ENTERFRAME(f, _this);
                    return;
                }
                frameCount_2--;
                var per = (p.time - frameCount_2) / p.time;
                var value = GameUtils.getValueByTransData(transData_2, per);
                Game.currentScene.camera.rotation = (ro - oldro_1) * value + oldro_1;
                if (frameCount_2 == 0) {
                    os.remove_ENTERFRAME(f, _this);
                }
            }, this, [f]);
        }
        else {
            Game.currentScene.camera.rotation = ro;
        }
    }
    CommandExecute.customCommand_1008 = customCommand_1008;
    //------------------------------------------------------------------------------------------------------
    // 玩法
    //------------------------------------------------------------------------------------------------------
    /**
     * 金币
     */
    function customCommand_2001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var v = p.useVar ? Game.player.variable.getVariable(p.goldVarID) : p.gold;
        ProjectPlayer.increaseGold(p.symbol == 0 ? v : -v);
    }
    CommandExecute.customCommand_2001 = customCommand_2001;
    /**
     * 道具
     */
    function customCommand_2002(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var itemID = p.useVar1 ? Game.player.variable.getVariable(p.itemIDVarID) : p.itemID;
        var num = p.useVar2 ? Game.player.variable.getVariable(p.numVarID) : p.num;
        ProjectPlayer.changeItemNumber(itemID, p.symbol == 0 ? num : -num);
    }
    CommandExecute.customCommand_2002 = customCommand_2002;
    /**
     * 克隆对象
     */
    function customCommand_2003(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var _this = this;
        var sceneID = p.sceneID;
        var soIndexID = p.useVar ? Game.player.variable.getVariable(p.noVarID) : p.no;
        var toScene = Game.currentScene;
        if (!toScene)
            return;
        // 暂停事件，等待完成后再继续
        trigger.pause = true;
        var syncState = 0;
        // 加载第一个场景，作为存放队伍成员模型
        ProjectClientScene.createSceneHelper(sceneID, Callback.New(function (toScene, soIndexID, p, fromScene, isSync) {
            // 由于可能异步加载，此时已经切换了新的场景，场景符合的话才设置
            if (Game.currentScene == toScene) {
                // 创建到坐标
                var posP = p.posUseVar ? new Point(Game.player.variable.getVariable(p.xVarID), Game.player.variable.getVariable(p.yVarID)) : new Point(p.x, p.y);
                if (p.isGrid) {
                    posP = GameUtils.getGridCenterByGrid(posP);
                }
                var persetSceneObject = {
                    x: posP.x,
                    y: posP.y
                };
                // 创建对象
                var newSoc = toScene.addSceneObjectFromClone(fromScene.id, soIndexID, true, persetSceneObject);
                // 将新创建出来的对象编号储存至变量，以便其他事件访问到该对象
                if (p.newSoIndex > 0)
                    Game.player.variable.setVariable(p.newSoIndex, newSoc.index);
                // 执行事件
                var eventCB = null;
                if (p.waitEventComplete) {
                    eventCB = Callback.New(function () {
                        continueExecute(trigger);
                    }, _this);
                }
                CommandPage.startTriggerFragmentEvent(p.newSoExecuteEvent, trigger.trigger, newSoc, eventCB);
            }
            // 如果已暂停的话说明是异步回调需要恢复执行
            if (!p.waitEventComplete) {
                continueExecute(trigger);
            }
        }, this, [toScene, soIndexID, p]));
        syncState = 1;
        function continueExecute(trigger) {
            if (syncState == 0) {
                trigger.pause = false;
            }
            else {
                trigger.offset(1);
                CommandPage.executeEvent(trigger);
            }
        }
    }
    CommandExecute.customCommand_2003 = customCommand_2003;
    /**
     * 销毁克隆的对象
     */
    function customCommand_2004(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType + 1, p.no, p.useVar, p.noVarID, trigger);
        // 终止并表示需要强行完成事件执行
        if (soc && soc.isCopy && soc == trigger.executor) {
            trigger.cmdReturn = true;
            trigger["commandScope"].length = 1;
        }
        // 下一帧渲染前销毁掉对象，以避免先销毁对象后事件无法完成的问题
        Callback.CallLaterBeforeRender(function (soc) {
            if (soc && soc.isCopy)
                soc.dispose();
        }, this, [soc]);
    }
    CommandExecute.customCommand_2004 = customCommand_2004;
    /**
     * 暂时隐藏对象，从场景上移除但记录列表中仍然存在，可以通过index获取到该对象
     */
    function customCommand_2005(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType + 1, p.no, p.useVar, p.noVarID, trigger);
        if (soc && soc.inScene)
            Game.currentScene.removeSceneObject(soc, false);
    }
    CommandExecute.customCommand_2005 = customCommand_2005;
    /**
     * 停止移动
     */
    function customCommand_2006(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc && soc.isMoving)
            soc.stopMove();
    }
    CommandExecute.customCommand_2006 = customCommand_2006;
    /**
     * 记录移动路径
     */
    function customCommand_2007(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc)
            soc.recordMoveRoadInfo = soc.getRecordMoveState();
    }
    CommandExecute.customCommand_2007 = customCommand_2007;
    /**
     * 恢复移动路径
     */
    function customCommand_2008(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc) {
            soc.restoryMove(soc.recordMoveRoadInfo);
            soc.recordMoveRoadInfo = null;
        }
    }
    CommandExecute.customCommand_2008 = customCommand_2008;
    /**
     * 修改场景对象的自定义属性
     */
    function customCommand_2009(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 获取对象
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc) {
            //获取设置的名称
            var varName = void 0;
            if (p.attributeData.selectMode == 1) {
                var mode = p.attributeData.inputModeInfo.mode;
                var constName = p.attributeData.inputModeInfo.constName;
                var varNameIndex = p.attributeData.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.attributeData.varName;
            }
            if (soc[varName] == undefined)
                return;
            //设置属性
            if (p.attributeData.compAttrEnable) {
                //界面属性模式
                var ui = soc[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return;
                var cmdParam = p.attributeData.value.value[1];
                if (!cmdParam)
                    return;
                var atts = cmdParam[2];
                if (!atts || !atts.uiID)
                    return;
                // -- 图像层的场合
                var passageID = 3000000 + atts.uiID;
                // 标识：由于移动界面元件支持对同一个界面多次叠加，此处sign则是唯一
                var sign = "gcUICompMove" + ObjectUtils.getRandID();
                // 立即模式：无需清理此行为
                if (cmdParam[5] == 0) {
                    var comps = GameUI.getAllCompChildren(ui, true);
                    for (var compID in atts.atts) {
                        var uiComp = comps.keyValue[compID];
                        if (uiComp) {
                            var attsValues = atts.atts[compID][1];
                            //@ts-ignore
                            var useVarAndTransitionAttrs = atts.atts[compID][2];
                            for (var attName in attsValues) {
                                var attValue = attsValues[attName];
                                //同步材质
                                if (attName == "materialData") {
                                    CommandExecute.refreshCompMaterials.apply({}, [attValue, uiComp]);
                                }
                                else {
                                    //变量
                                    //@ts-ignore
                                    if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                                        //@ts-ignore
                                        if (useVarAndTransitionAttrs[attName].type == 0) {
                                            //@ts-ignore
                                            attValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                                        }
                                        //@ts-ignore
                                        else if (useVarAndTransitionAttrs[attName].type == 1) {
                                            //@ts-ignore
                                            attValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                                        }
                                        //@ts-ignore
                                        else if (useVarAndTransitionAttrs[attName].type == 2) {
                                            //@ts-ignore
                                            attValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                                        }
                                    }
                                    // 字符串变量（设置成字符串仅根据当前的值而非绑定字符串）
                                    if (typeof attValue == "string") {
                                        var strVarID = GameUtils.getVarID(attValue);
                                        if (strVarID != 0) {
                                            attValue = Game.player.variable.getString(strVarID);
                                        }
                                        else {
                                            //@ts-ignore
                                            var globalStrVarID = GameUtils.getGlobalVarID(attValue);
                                            if (globalStrVarID != 0) {
                                                attValue = ClientWorld.variable.getString(globalStrVarID);
                                            }
                                        }
                                    }
                                    uiComp[attName] = attValue;
                                }
                            }
                        }
                    }
                }
                else {
                    var m = {
                        time: cmdParam[0],
                        curTime: 1,
                        transData: GameUtils.getTransData(cmdParam[1]),
                        attrInfos: []
                    };
                    var comps = GameUI.getAllCompChildren(ui, true);
                    for (var compID in atts.atts) {
                        var uiComp = comps.keyValue[compID];
                        if (uiComp) {
                            var attsValues = atts.atts[compID][1];
                            //@ts-ignore
                            var useVarAndTransitionAttrs = atts.atts[compID][2];
                            for (var attName in attsValues) {
                                var oldValue = uiComp[attName];
                                var needTween = typeof oldValue == "number";
                                if (attName == "materialData")
                                    needTween = true;
                                //@ts-ignore
                                var useVarAndTransition = useVarAndTransitionAttrs[attName];
                                if (useVarAndTransition) {
                                    // 如果并非过渡渐变的话则表示立即变更，效果会受到「无法渐变的属性处理」影响
                                    if (!useVarAndTransition.change) {
                                        needTween = false;
                                    }
                                }
                                var newValue = attsValues[attName];
                                //变量
                                //@ts-ignore
                                if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                                    //@ts-ignore
                                    if (useVarAndTransitionAttrs[attName].type == 0) {
                                        //@ts-ignore
                                        newValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                                    }
                                    //@ts-ignore
                                    else if (useVarAndTransitionAttrs[attName].type == 1) {
                                        //@ts-ignore
                                        newValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                                    }
                                    //@ts-ignore
                                    else if (useVarAndTransitionAttrs[attName].type == 2) {
                                        //@ts-ignore
                                        newValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                                    }
                                }
                                var attrInfo = { uiComp: uiComp, uiCompID: uiComp.id, attName: attName, oldValue: oldValue, needTween: needTween, newValue: newValue };
                                //@ts-ignore
                                m.attrInfos.push(attrInfo);
                            }
                        }
                    }
                    //
                    var thisPtr = {};
                    GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcUICompMoveFrameUpdate, thisPtr, [ui, m, passageID, sign, cmdParam[3]], sign);
                    // 立刻开始执行一帧
                    CommandExecute.gcUICompMoveFrameUpdate.apply(thisPtr, [ui, m, passageID, sign, cmdParam[3]]);
                }
            }
            else {
                //普通模式
                var count = function (oldValue, value) {
                    if (typeof oldValue != "number" || typeof value != "number")
                        return value;
                    var v;
                    //@ts-ignore
                    if (!p.attributeData.operationType)
                        v = value;
                    //@ts-ignore
                    switch (p.attributeData.operationType) {
                        case 1:
                            v = oldValue + value;
                            break; //加
                        case 2:
                            v = oldValue - value;
                            break; //减
                        case 3:
                            v = oldValue * value;
                            break; //乘
                        case 4:
                            v = oldValue / value;
                            break; //除
                        case 5:
                            v = oldValue % value;
                            break; //余
                        case 6:
                            v = Math.pow(oldValue, value);
                            break; //幂
                    }
                    //@ts-ignore
                    return p.attributeData.isRounded ? MathUtils.int(v) : v;
                };
                if (p.attributeData.valueType == 0) {
                    var v = p.attributeData.value;
                    if (v) {
                        //object类型
                        if (p.attributeData.selectMode == 1 && p.attributeData.inputModeInfo.typeIndex == 3) {
                            try {
                                v.value = JSON.parse(v.value);
                            }
                            catch (e) {
                                v.value = {};
                            }
                        }
                        soc[varName] = count(soc[varName], v.value);
                    }
                }
                else {
                    var v = p.attributeData.value;
                    if (v && v.value) {
                        var varID = v.value;
                        switch (v.varType) {
                            case 0:
                                soc[varName] = count(soc[varName], Game.player.variable.getVariable(varID));
                                break;
                            case 1:
                                soc[varName] = Game.player.variable.getString(varID);
                                break;
                            case 2:
                                soc[varName] = Game.player.variable.getSwitch(varID);
                                break;
                        }
                    }
                }
            }
        }
    }
    CommandExecute.customCommand_2009 = customCommand_2009;
    /**
     * 修改场景对象的行走图的部件
     */
    function customCommand_2011(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 获取对象
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc) {
            var partID = p.partID;
            var newAvatarID = p.newPartUseVar ? Game.player.variable.getVariable(p.newPartVarID) : p.newPart;
            soc.avatar.changePartByAvatarID(newAvatarID, partID);
        }
    }
    CommandExecute.customCommand_2011 = customCommand_2011;
    /**
     * 商店
     */
    function customCommand_2012(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 暂停事件，等待完成后再继续
        trigger.pause = true;
        // 加载商店界面
        GameUI.load(11);
        var gui = GameUI.get(11);
        // 存入数据
        gui.shopEventData = p;
        // 恢复执行事件
        gui.once(EventObject.UNDISPLAY, this, function () {
            gui.shopEventData = null;
            trigger.offset(1);
            CommandPage.executeEvent(trigger);
        });
        // 打开商店界面
        GameUI.show(11);
    }
    CommandExecute.customCommand_2012 = customCommand_2012;
    /**
     * 清除对象行为
     */
    function customCommand_2013(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // 获取对象
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc) {
            soc.clearBehaviors();
            soc.stopBehavior();
        }
    }
    CommandExecute.customCommand_2013 = customCommand_2013;
    //------------------------------------------------------------------------------------------------------
    // 系统
    //------------------------------------------------------------------------------------------------------
    /**
     * 允许玩家控制
     */
    function customCommand_4001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        WorldData.playCtrlEnabled = true;
    }
    CommandExecute.customCommand_4001 = customCommand_4001;
    /**
     * 禁止玩家控制
     */
    function customCommand_4002(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        WorldData.playCtrlEnabled = false;
    }
    CommandExecute.customCommand_4002 = customCommand_4002;
    /**
     * 允许使用菜单
     */
    function customCommand_4003(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        WorldData.menuEnabled = true;
    }
    CommandExecute.customCommand_4003 = customCommand_4003;
    /**
     * 禁止使用菜单
     */
    function customCommand_4004(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        WorldData.menuEnabled = false;
    }
    CommandExecute.customCommand_4004 = customCommand_4004;
    /**
     * 开始游戏
     */
    var callNewGame = false;
    function customCommand_4005(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (callNewGame)
            return;
        callNewGame = true;
        SinglePlayerGame.newGame();
    }
    CommandExecute.customCommand_4005 = customCommand_4005;
    /**
     * 存档
     */
    function customCommand_4006(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (p.saveType == 0) {
            trigger.pause = true;
            trigger.offset(1);
            SinglePlayerGame.saveGlobalData(Callback.New(function () {
                CommandPage.executeEvent(trigger);
            }, this));
        }
        else if (p.saveType == 1) {
            if (GUI_SaveFileManager.currentSveFileIndexInfo) {
                // 命令偏移一行，以便下次恢复执行时执行下一行而不是本行
                trigger.offset(1);
                GUI_SaveFileManager.saveFile(GUI_SaveFileManager.currentSveFileIndexInfo.id, p.silenceMode ? false : true, Callback.New(function () {
                    CommandPage.executeEvent(trigger);
                }, this), true);
                // 暂停必须放在存档后面，否则存档将正在执行的该事件暂停状态也一起保存了
                trigger.pause = true;
            }
        }
        else {
            var saveID = p.saveID;
            // 命令偏移一行，以便下次恢复执行时执行下一行而不是本行
            trigger.offset(1);
            GUI_SaveFileManager.saveFile(saveID, p.silenceMode ? false : true, Callback.New(function () {
                CommandPage.executeEvent(trigger);
            }, this), true);
            // 暂停必须放在存档后面，否则存档将正在执行的该事件暂停状态也一起保存了
            trigger.pause = true;
        }
    }
    CommandExecute.customCommand_4006 = customCommand_4006;
    /**
     *  音量
     */
    function customCommand_4007(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var v = p.useVar ? Game.player.variable.getVariable(p.volumeVarID) : p.volume;
        if (p.type == 0) {
            GameAudio.bgmVolume = v / 100;
            return;
        }
        if (p.type == 1) {
            GameAudio.bgsVolume = v / 100;
            return;
        }
        if (p.type == 2) {
            GameAudio.seVolume = v / 100;
            return;
        }
        if (p.type == 3) {
            GameAudio.tsVolume = v / 100;
            return;
        }
    }
    CommandExecute.customCommand_4007 = customCommand_4007;
    /**
     *  返回标题
     */
    function customCommand_4008(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        window.location.reload();
    }
    CommandExecute.customCommand_4008 = customCommand_4008;
    /**
     *  暂停游戏
     */
    function customCommand_4009(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        Game.pause = true;
    }
    CommandExecute.customCommand_4009 = customCommand_4009;
    /**
     *  恢复游戏
     */
    function customCommand_4010(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        Game.pause = false;
    }
    CommandExecute.customCommand_4010 = customCommand_4010;
    /**
     *  关闭窗口
     */
    function customCommand_4011(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        os.closeWindow();
    }
    CommandExecute.customCommand_4011 = customCommand_4011;
    /**
     *  对话框音效设置
     */
    function customCommand_4012(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        WorldData.dialogSEEnabled = p.dialogSE == 0 ? true : false;
    }
    CommandExecute.customCommand_4012 = customCommand_4012;
    /**
     *  设置世界属性
     */
    function customCommand_4013(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var varName;
        if (p.worldData.selectMode == 1) {
            var mode = p.worldData.inputModeInfo.mode;
            var constName = p.worldData.inputModeInfo.constName;
            var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.worldData.varName;
        }
        if (WorldData[varName] == undefined)
            return;
        var count = function (oldValue, value) {
            if (typeof oldValue != "number" || typeof value != "number")
                return value;
            var v;
            //@ts-ignore
            if (!p.worldData.operationType)
                v = value;
            //@ts-ignore
            switch (p.worldData.operationType) {
                case 1:
                    v = oldValue + value;
                    break; //加
                case 2:
                    v = oldValue - value;
                    break; //减
                case 3:
                    v = oldValue * value;
                    break; //乘
                case 4:
                    v = oldValue / value;
                    break; //除
                case 5:
                    v = oldValue % value;
                    break; //余
                case 6:
                    v = Math.pow(oldValue, value);
                    break; //幂
            }
            //@ts-ignore
            return p.worldData.isRounded ? MathUtils.int(v) : v;
        };
        if (p.worldData.valueType == 0) {
            var v = p.worldData.value;
            if (v) {
                //object类型
                if (p.worldData.selectMode == 1 && p.worldData.inputModeInfo.typeIndex == 3) {
                    try {
                        v.value = JSON.parse(v.value);
                    }
                    catch (e) {
                        v.value = {};
                    }
                }
                WorldData[varName] = count(WorldData[varName], v.value);
            }
        }
        else {
            var v = p.worldData.value;
            if (v && v.value) {
                var varID = v.value;
                switch (v.varType) {
                    case 0:
                        WorldData[varName] = count(WorldData[varName], Game.player.variable.getVariable(varID));
                        break;
                    case 1:
                        WorldData[varName] = Game.player.variable.getString(varID);
                        break;
                    case 2:
                        WorldData[varName] = Game.player.variable.getSwitch(varID);
                        break;
                }
            }
        }
    }
    CommandExecute.customCommand_4013 = customCommand_4013;
    /**
     *  设置玩家属性
     */
    function customCommand_4014(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var varName;
        if (p.playerData.selectMode == 1) {
            var mode = p.playerData.inputModeInfo.mode;
            var constName = p.playerData.inputModeInfo.constName;
            var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.playerData.varName;
        }
        if (Game.player.data[varName] == undefined)
            return;
        var count = function (oldValue, value) {
            if (typeof oldValue != "number" || typeof value != "number")
                return value;
            var v;
            //@ts-ignore
            if (!p.playerData.operationType)
                v = value;
            //@ts-ignore
            switch (p.playerData.operationType) {
                case 1:
                    v = oldValue + value;
                    break; //加
                case 2:
                    v = oldValue - value;
                    break; //减
                case 3:
                    v = oldValue * value;
                    break; //乘
                case 4:
                    v = oldValue / value;
                    break; //除
                case 5:
                    v = oldValue % value;
                    break; //余
                case 6:
                    v = Math.pow(oldValue, value);
                    break; //幂
            }
            //@ts-ignore
            return p.playerData.isRounded ? MathUtils.int(v) : v;
        };
        if (p.playerData.valueType == 0) {
            var v = p.playerData.value;
            if (v) {
                //object类型
                if (p.playerData.selectMode == 1 && p.playerData.inputModeInfo.typeIndex == 3) {
                    try {
                        v.value = JSON.parse(v.value);
                    }
                    catch (e) {
                        v.value = {};
                    }
                }
                Game.player.data[varName] = count(Game.player.data[varName], v.value);
            }
        }
        else {
            var v = p.playerData.value;
            if (v && v.value) {
                var varID = v.value;
                switch (v.varType) {
                    case 0:
                        Game.player.data[varName] = count(Game.player.data[varName], Game.player.variable.getVariable(varID));
                        break;
                    case 1:
                        Game.player.data[varName] = Game.player.variable.getString(varID);
                        break;
                    case 2:
                        Game.player.data[varName] = Game.player.variable.getSwitch(varID);
                        break;
                }
            }
        }
    }
    CommandExecute.customCommand_4014 = customCommand_4014;
    //------------------------------------------------------------------------------------------------------
    //  场景对象模块
    //------------------------------------------------------------------------------------------------------
    /**
     * 增减场景对象模块
     */
    function customCommand_8001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // -- 获取目标对象
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.soUseVar, p.noVarID, trigger);
        if (soc) {
            // -- 获取指定的模块添加或移除
            var moduleID = p.valueUseVar ? Game.player.variable.getVariable(p.valueVarID) : p.value;
            if (p.symbol == 0)
                soc.addModuleByID(moduleID);
            else
                soc.removeModuleByID(moduleID);
        }
    }
    CommandExecute.customCommand_8001 = customCommand_8001;
    /**
     * 设置场景对象模块的属性
     */
    function customCommand_8002(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (!Game.currentScene)
            return;
        // -- 获取目标对象
        var soc = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.noVarID, trigger);
        if (soc) {
            // -- 获取指定的模块添加或移除
            var moduleID = p.attr.moduleID;
            var soModule_1 = soc.getModule(moduleID);
            if (soModule_1) {
                //获取设置的名称
                var varName_1;
                if (p.attr.selectMode == 1) {
                    var mode = p.attr.inputModeInfo.mode;
                    var constName = p.attr.inputModeInfo.constName;
                    var varNameIndex = p.attr.inputModeInfo.varNameIndex;
                    varName_1 = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
                }
                else {
                    varName_1 = p.attr.varName;
                }
                //设置属性
                if (p.attr.compAttrEnable) {
                    //界面属性模式
                    var cmdParam = p.attr.value.value[1];
                    if (!cmdParam)
                        return;
                    var atts = cmdParam[2];
                    if (!atts || !atts.uiID)
                        return;
                    //获得场景模块的显示对象
                    var ui = void 0;
                    var list = soc["getCustomDisplayLayers"]();
                    for (var i = 0; i < list.length; i++) {
                        var customDisplay = list[i];
                        if (!customDisplay || !(customDisplay instanceof GUI_BASE) || customDisplay.guiID != atts.uiID)
                            continue;
                        ui = customDisplay;
                    }
                    if (!ui)
                        return;
                    // -- 图像层的场合
                    var passageID = 2000000 + atts.uiID;
                    // 标识：由于移动界面元件支持对同一个界面多次叠加，此处sign则是唯一
                    var sign = "gcUICompMove" + ObjectUtils.getRandID();
                    // 立即模式：无需清理此行为
                    if (cmdParam[5] == 0) {
                        var comps = GameUI.getAllCompChildren(ui, true);
                        for (var compID in atts.atts) {
                            var uiComp = comps.keyValue[compID];
                            if (uiComp) {
                                var attsValues = atts.atts[compID][1];
                                //@ts-ignore
                                var useVarAndTransitionAttrs = atts.atts[compID][2];
                                for (var attName in attsValues) {
                                    var attValue = attsValues[attName];
                                    //同步材质
                                    if (attName == "materialData") {
                                        CommandExecute.refreshCompMaterials.apply({}, [attValue, uiComp]);
                                    }
                                    else {
                                        //变量
                                        //@ts-ignore
                                        if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                                            //@ts-ignore
                                            if (useVarAndTransitionAttrs[attName].type == 0) {
                                                //@ts-ignore
                                                attValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                                            }
                                            //@ts-ignore
                                            else if (useVarAndTransitionAttrs[attName].type == 1) {
                                                //@ts-ignore
                                                attValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                                            }
                                            //@ts-ignore
                                            else if (useVarAndTransitionAttrs[attName].type == 2) {
                                                //@ts-ignore
                                                attValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                                            }
                                        }
                                        // 字符串变量（设置成字符串仅根据当前的值而非绑定字符串）
                                        if (typeof attValue == "string") {
                                            var strVarID = GameUtils.getVarID(attValue);
                                            if (strVarID != 0) {
                                                attValue = Game.player.variable.getString(strVarID);
                                            }
                                            else {
                                                //@ts-ignore
                                                var globalStrVarID = GameUtils.getGlobalVarID(attValue);
                                                if (globalStrVarID != 0) {
                                                    attValue = ClientWorld.variable.getString(globalStrVarID);
                                                }
                                            }
                                        }
                                        uiComp[attName] = attValue;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        var m = {
                            time: cmdParam[0],
                            curTime: 1,
                            transData: GameUtils.getTransData(cmdParam[1]),
                            attrInfos: []
                        };
                        var comps = GameUI.getAllCompChildren(ui, true);
                        for (var compID in atts.atts) {
                            var uiComp = comps.keyValue[compID];
                            if (uiComp) {
                                var attsValues = atts.atts[compID][1];
                                //@ts-ignore
                                var useVarAndTransitionAttrs = atts.atts[compID][2];
                                for (var attName in attsValues) {
                                    var oldValue = uiComp[attName];
                                    var needTween = typeof oldValue == "number";
                                    if (attName == "materialData")
                                        needTween = true;
                                    //@ts-ignore
                                    var useVarAndTransition = useVarAndTransitionAttrs[attName];
                                    if (useVarAndTransition) {
                                        // 如果并非过渡渐变的话则表示立即变更，效果会受到「无法渐变的属性处理」影响
                                        if (!useVarAndTransition.change) {
                                            needTween = false;
                                        }
                                    }
                                    var newValue = attsValues[attName];
                                    //变量
                                    //@ts-ignore
                                    if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                                        //@ts-ignore
                                        if (useVarAndTransitionAttrs[attName].type == 0) {
                                            //@ts-ignore
                                            newValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                                        }
                                        //@ts-ignore
                                        else if (useVarAndTransitionAttrs[attName].type == 1) {
                                            //@ts-ignore
                                            newValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                                        }
                                        //@ts-ignore
                                        else if (useVarAndTransitionAttrs[attName].type == 2) {
                                            //@ts-ignore
                                            newValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                                        }
                                    }
                                    var attrInfo = { uiComp: uiComp, uiCompID: uiComp.id, attName: attName, oldValue: oldValue, needTween: needTween, newValue: newValue };
                                    //@ts-ignore
                                    m.attrInfos.push(attrInfo);
                                }
                            }
                        }
                        //
                        var thisPtr = {};
                        GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcUICompMoveFrameUpdate, thisPtr, [ui, m, passageID, sign, cmdParam[3]], sign);
                        // 立刻开始执行一帧
                        CommandExecute.gcUICompMoveFrameUpdate.apply(thisPtr, [ui, m, passageID, sign, cmdParam[3]]);
                    }
                }
                else {
                    if (soModule_1[varName_1] == undefined)
                        return;
                    var setAttr = function (value) {
                        if (soModule_1[varName_1] instanceof GCAnimation && typeof value == "number")
                            soModule_1[varName_1].id = value;
                        else if (soModule_1[varName_1] instanceof UIBase && typeof value == "number") {
                            var p_1 = soModule_1[varName_1].parent;
                            var index = p_1.getChildIndex(soModule_1[varName_1]);
                            p_1.removeChild(soModule_1[varName_1]);
                            var gui = GameUI.load(value, true);
                            soModule_1[varName_1] = gui;
                            p_1.addChildAt(soModule_1[varName_1], index);
                        }
                        else
                            soModule_1[varName_1] = count_1(soModule_1[varName_1], value);
                    };
                    var count_1 = function (oldValue, value) {
                        if (typeof oldValue != "number" || typeof value != "number")
                            return value;
                        var v;
                        //@ts-ignore
                        if (!p.attr.operationType)
                            v = value;
                        //@ts-ignore
                        switch (p.attr.operationType) {
                            case 1:
                                v = oldValue + value;
                                break; //加
                            case 2:
                                v = oldValue - value;
                                break; //减
                            case 3:
                                v = oldValue * value;
                                break; //乘
                            case 4:
                                v = oldValue / value;
                                break; //除
                            case 5:
                                v = oldValue % value;
                                break; //余
                            case 6:
                                v = Math.pow(oldValue, value);
                                break; //幂
                        }
                        //@ts-ignore
                        return p.attr.isRounded ? MathUtils.int(v) : v;
                    };
                    //普通模式
                    if (p.attr.valueType == 0) {
                        var v = p.attr.value;
                        if (v) {
                            //object类型
                            if (p.attr.selectMode == 1 && p.attr.inputModeInfo.typeIndex == 3) {
                                try {
                                    v.value = JSON.parse(v.value);
                                }
                                catch (e) {
                                    v.value = {};
                                }
                            }
                            setAttr(v.value);
                        }
                    }
                    else {
                        var v = p.attr.value;
                        if (v && v.value) {
                            var varID = v.value;
                            switch (v.varType) {
                                case 0:
                                    setAttr(Game.player.variable.getVariable(varID));
                                    break;
                                case 1:
                                    setAttr(Game.player.variable.getString(varID));
                                    break;
                                case 2:
                                    setAttr(Game.player.variable.getSwitch(varID));
                                    break;
                            }
                        }
                    }
                }
                Callback.CallLaterBeforeRender(soModule_1.refresh, soModule_1);
            }
        }
    }
    CommandExecute.customCommand_8002 = customCommand_8002;
})(CommandExecute || (CommandExecute = {}));
/**
 * 自定义事件命令
 * -- 图像/动画/立绘/界面/视频/音频相关的指令
 * -- 对于图像显示以及移动过程追加了存档读档支持
 * Created by 黑暗之神KDS on 2018-12-18 17:17:50.
 */
var CommandExecute;
(function (CommandExecute) {
    //------------------------------------------------------------------------------------------------------
    // 图像系统基础指令运行时
    //------------------------------------------------------------------------------------------------------
    /**
     * 显示图片
     */
    function customCommand_3001(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 清理通道
        GameImageLayer.deletePassage(passageID);
        // 获取属性值
        var image = cp.imageUseVar ? Game.player.variable.getString(cp.imageVar) : cp.image;
        var dpX, dpY, dpWidth, dpHeight;
        if (cp.posUseVar) {
            dpX = Game.player.variable.getVariable(cp.dpXVar);
            dpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            dpX = cp.dpX;
            dpY = cp.dpY;
        }
        var dpz = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            dpWidth = Game.player.variable.getVariable(cp.dpWidthVar);
            dpHeight = Game.player.variable.getVariable(cp.dpHeightVar);
        }
        else {
            dpWidth = cp.dpWidth;
            dpHeight = cp.dpHeight;
        }
        var rotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var opacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        // 创建显示对象
        var a = new UIBitmap();
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a);
        Game.layer.imageLayer.addChild(a);
        a.dpDisplayPriority = passageID;
        a.image = image;
        a.useDPCoord = true;
        a.dpX = dpX;
        a.dpY = dpY;
        a.dpZ = dpz;
        a.dpWidth = dpWidth;
        a.dpHeight = dpHeight;
        a.rotation1 = rotation;
        a.opacity = opacity;
        a.pivotType = cp.pivotType;
        a.flip = cp.flip;
        a.blendMode = [null, "lighter", "blend5-1", "blend4-1", "blend4-7", "blend4-4"][cp.blendMode];
        a.dpCoordToRealCoord();
    }
    CommandExecute.customCommand_3001 = customCommand_3001;
    /**
     * 移动图像
     */
    function customCommand_3002(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIBitmap))
            return;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcImageMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        // 获取属性
        var toDpX, toDpY, toDpWidth, toDpHeight;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpWidth = Game.player.variable.getVariable(cp.dpWidthVar);
            toDpHeight = Game.player.variable.getVariable(cp.dpHeightVar);
        }
        else {
            toDpWidth = cp.dpWidth;
            toDpHeight = cp.dpHeight;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        // 立即模式：无需清理此行为
        if (cp.timeType == 0) {
            a.dpX = toDpX;
            a.dpY = toDpY;
            a.dpZ = toDpZ;
            a.dpWidth = toDpWidth;
            a.dpHeight = toDpHeight;
            a.rotation = toRotation;
            a.opacity = toOpacity;
            a.pivotType = cp.pivotType;
            a.blendMode = [null, "lighter", "blend5-1", "blend4-1", "blend4-7", "blend4-4"][cp.blendMode];
            a.flip = cp.flip;
        }
        // 过渡模式：由于注册了帧刷，需要清理
        else {
            // 下一帧开始移动 1/MAX
            var m = {
                time: cp.time,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                width: a.dpWidth,
                height: a.dpHeight,
                rotation: a.rotation1,
                opacity: a.opacity,
                x2: toDpX - a.dpX,
                y2: toDpY - a.dpY,
                z2: toDpZ - a.dpZ,
                width2: toDpWidth - a.dpWidth,
                height2: toDpHeight - a.dpHeight,
                rotation2: toRotation - a.rotation1,
                opacity2: toOpacity - a.opacity,
                pivotType2: cp.pivotType,
                blendMode2: cp.blendMode,
                flip2: cp.flip,
                transData: GameUtils.getTransData(cp.trans)
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            // 立刻开始执行一帧
            gcImageMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3002 = customCommand_3002;
    /**
     * 移动图像层相机
     */
    function customCommand_3003(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var passageID = 10001;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcCameraMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        var tocameraX = cp.xUseVar ? Game.player.variable.getVariable(cp.cameraXVar) : cp.cameraX;
        var tocameraY = cp.yUseVar ? Game.player.variable.getVariable(cp.cameraYVar) : cp.cameraY;
        var tocameraZ = cp.zUseVar ? Game.player.variable.getVariable(cp.cameraZVar) : cp.cameraZ;
        var tocameraRotation = cp.roUseVar ? Game.player.variable.getVariable(cp.cameraRotationVar) : cp.cameraRotation;
        var imageLayer = Game.layer.imageLayer;
        var m = {
            time: cp.time,
            curTime: 1,
            x: imageLayer.camera.viewPort.x,
            y: imageLayer.camera.viewPort.y,
            z: imageLayer.camera.z,
            rotation: imageLayer.camera.rotation,
            x2: tocameraX - imageLayer.camera.viewPort.x,
            y2: tocameraY - imageLayer.camera.viewPort.y,
            z2: tocameraZ - imageLayer.camera.z,
            rotation2: tocameraRotation - imageLayer.camera.rotation,
            transData: GameUtils.getTransData(cp.trans)
        };
        // 立即模式
        if (cp.timeType == 0) {
            imageLayer.camera.viewPort.x = tocameraX;
            imageLayer.camera.viewPort.y = tocameraY;
            imageLayer.camera.z = tocameraZ;
            imageLayer.camera.rotation = tocameraRotation;
        }
        else {
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcCameraMoveFrameUpdate, thisPtr, [null, m, passageID, sign], sign);
            // 立刻开始执行一帧
            gcCameraMoveFrameUpdate.apply(thisPtr, [null, m, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3003 = customCommand_3003;
    /**
     * 显示动画
     */
    function customCommand_3004(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 清理通道
        GameImageLayer.deletePassage(passageID);
        // 获取属性
        var animationID = cp.objectUseVar ? Game.player.variable.getVariable(cp.animationVar) : cp.animation;
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        var aniFrame = cp.aniFrameUseVar ? Game.player.variable.getVariable(cp.aniFrameVar) : cp.aniFrame;
        // 创建图片显示对象
        var a = new UIAnimation();
        a.animation.syncLoadWhenAssetExist = true;
        a.useDPCoordScaleMode = true;
        a.dpDisplayPriority = passageID;
        a.animationID = animationID;
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a);
        Game.layer.imageLayer.addChild(a);
        a.useDPCoord = true;
        a.dpX = toDpX;
        a.dpY = toDpY;
        a.dpZ = toDpZ;
        a.dpScaleX = toDpScaleX;
        a.dpScaleY = toDpScaleY;
        a.rotation1 = toRotation;
        a.opacity = toOpacity;
        a.silentMode = cp.silentMode;
        a.showHitEffect = cp.showHitEffect;
        a.playFps = cp.playFps;
        a.aniFrame = aniFrame;
        a.playType = cp.playType;
        // 刷新坐标
        a.dpCoordToRealCoord();
    }
    CommandExecute.customCommand_3004 = customCommand_3004;
    /**
     * 移动动画
     */
    function customCommand_3005(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIAnimation))
            return;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcAnimationMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        // 获取属性
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        var toFrame = cp.frameUseVar ? Game.player.variable.getVariable(cp.aniFrameVar) : cp.aniFrame;
        // 立即模式：无需清理此行为
        if (cp.timeType == 0) {
            a.dpX = toDpX;
            a.dpY = toDpY;
            a.dpZ = toDpZ;
            a.dpScaleX = toDpScaleX;
            a.dpScaleY = toDpScaleY;
            a.rotation1 = toRotation;
            a.opacity = toOpacity;
            if (cp.changeFrame)
                a.aniFrame = toFrame;
            a.dpCoordToRealCoord();
        }
        // 过渡模式：由于注册了帧刷，需要清理
        else {
            // 下一帧开始移动 1/MAX
            var m = {
                time: cp.time,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                scaleX: a.dpScaleX,
                scaleY: a.dpScaleY,
                rotation: a.rotation1,
                opacity: a.opacity,
                aniFrame: a.aniFrame,
                x2: toDpX - a.dpX,
                y2: toDpY - a.dpY,
                z2: toDpZ - a.dpZ,
                scaleX2: toDpScaleX - a.dpScaleX,
                scaleY2: toDpScaleY - a.dpScaleY,
                rotation2: toRotation - a.rotation1,
                opacity2: toOpacity - a.opacity,
                aniFrame2: toFrame - a.aniFrame,
                transData: GameUtils.getTransData(cp.trans)
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcAnimationMoveFrameUpdate, thisPtr, [a, m, passageID, sign, cp.changeFrame], sign);
            // 立刻开始执行一帧
            gcAnimationMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign, cp.changeFrame]);
        }
    }
    CommandExecute.customCommand_3005 = customCommand_3005;
    /**
     * 显示立绘
     */
    function customCommand_3006(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 清理通道
        GameImageLayer.deletePassage(passageID);
        // 获取属性
        var standAvatarID = cp.objectUseVar ? Game.player.variable.getVariable(cp.standAvatarVar) : cp.standAvatar;
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        var avatarFrame = cp.frameUseVar ? Game.player.variable.getVariable(cp.avatarFrameVar) : cp.avatarFrame;
        var expression = cp.expressionUseVar ? Game.player.variable.getVariable(cp.expressionVar) : cp.expression;
        //
        // 创建图片显示对象
        var a = new UIStandAvatar();
        a.avatar.syncLoadWhenAssetExist = true;
        // 设定显示优先度，以便在同Z轴时，编号越大，显示在越前方
        a.useDPCoordScaleMode = true;
        a.dpDisplayPriority = passageID;
        a.avatarID = standAvatarID;
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a);
        Game.layer.imageLayer.addChild(a);
        a.useDPCoord = true;
        a.dpX = toDpX;
        a.dpY = toDpY;
        a.dpZ = toDpZ;
        a.dpScaleX = toDpScaleX;
        a.dpScaleY = toDpScaleY;
        a.rotation1 = toRotation;
        a.opacity = toOpacity;
        a.playOnce = cp.playType == 1;
        a.avatarFPS = cp.avatarFPS;
        a.avatarFrame = avatarFrame;
        a.actionID = expression;
        a.isPlay = cp.playType != 0;
        // 刷新坐标
        a.dpCoordToRealCoord();
    }
    CommandExecute.customCommand_3006 = customCommand_3006;
    /**
     * 移动立绘
     */
    function customCommand_3007(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIStandAvatar))
            return;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcStandAvatarMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        // 获取属性
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        var avatarFrame = cp.frameUseVar ? Game.player.variable.getVariable(cp.avatarFrameVar) : cp.avatarFrame;
        var expression = cp.expressionUseVar ? Game.player.variable.getVariable(cp.expressionVar) : cp.expression;
        // 立即模式：无需清理此行为
        if (cp.timeType == 0) {
            a.dpX = toDpX;
            a.dpY = toDpY;
            a.dpZ = toDpZ;
            a.dpScaleX = toDpScaleX;
            a.dpScaleY = toDpScaleY;
            a.rotation1 = toRotation;
            a.opacity = toOpacity;
            if (cp.changeExpression) {
                a.avatar.actionID = expression;
            }
            if (cp.changeFrame) {
                a.avatarFrame = avatarFrame;
            }
            a.dpCoordToRealCoord();
        }
        // 过渡模式：由于注册了帧刷，需要清理
        else {
            // 下一帧开始移动 1/MAX
            // GameUtils.getValueByTransData(null, );
            var m = {
                time: cp.time,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                scaleX: a.dpScaleX,
                scaleY: a.dpScaleY,
                rotation: a.rotation1,
                opacity: a.opacity,
                avatarFrame: a.avatarFrame,
                x2: toDpX - a.dpX,
                y2: toDpY - a.dpY,
                z2: toDpZ - a.dpZ,
                scaleX2: toDpScaleX - a.dpScaleX,
                scaleY2: toDpScaleY - a.dpScaleY,
                rotation2: toRotation - a.rotation1,
                opacity2: toOpacity - a.opacity,
                transData: GameUtils.getTransData(cp.trans),
                actionID: expression,
                avatarFrame2: avatarFrame - a.avatarFrame,
                changeExpression: cp.changeExpression,
                changeFrame: cp.changeFrame
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcStandAvatarMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            // 立刻开始执行一帧
            gcStandAvatarMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3007 = customCommand_3007;
    /**
     * 清理图像
     */
    function customCommand_3008(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 派发清理事件
        var a = GameImageLayer.getImageSprite(passageID);
        if (a)
            a.event("___deletePassage");
        // 清理通道
        GameImageLayer.deletePassage(passageID);
    }
    CommandExecute.customCommand_3008 = customCommand_3008;
    /**
     * 自动旋转
     */
    function customCommand_3009(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof GameSprite))
            return;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcImageSpriteRotationMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        // 如果不存在的话
        if (cp.rotation != 0) {
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcGameSpriteRotationMoveFrameUpdate, thisPtr, [a, cp.rotation, passageID, sign], sign);
            // 立刻开始执行一帧
            gcGameSpriteRotationMoveFrameUpdate.apply(thisPtr, [a, cp.rotation, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3009 = customCommand_3009;
    /**
     * 显示界面
     */
    function customCommand_3010(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 界面ID
        var uiID = cp.objectUseVar ? Game.player.variable.getVariable(cp.uiVar) : cp.uiID;
        // -- 图像层的场合
        if (cp.showType == 1) {
            passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        }
        // -- 界面层的场合
        else {
            passageID = 1000000 + uiID;
        }
        // 清理通道
        // GameImageLayer.deletePassage(passageID);
        // 获取属性
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        // 创建图片显示对象
        var a = GameUI.load(uiID, cp.showType == 1);
        // a.syncLoadWhenAssetExist = true;
        // 设定显示优先度，以便在同Z轴时，编号越大，显示在越前方
        a.useDPCoordScaleMode = true;
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a);
        if (cp.showType == 1) {
            Game.layer.imageLayer.addChild(a);
            a.dpDisplayPriority = passageID;
            a.useDPCoord = true;
            if (cp.setAttr) {
                a.dpX = toDpX;
                a.dpY = toDpY;
                a.dpZ = toDpZ;
                a.dpScaleX = toDpScaleX;
                a.dpScaleY = toDpScaleY;
                a.rotation1 = toRotation;
                a.opacity = toOpacity;
            }
            // 刷新坐标
            a.dpCoordToRealCoord();
        }
        else {
            GameUI.show(uiID);
            if (cp.setAttr) {
                a.x = toDpX;
                a.y = toDpY;
                a.scaleX = toDpScaleX;
                a.scaleY = toDpScaleY;
                a.rotation1 = toRotation;
                a.opacity = toOpacity;
            }
        }
    }
    CommandExecute.customCommand_3010 = customCommand_3010;
    /**
     * 移动界面
     */
    function customCommand_3011(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 界面ID
        var uiID = cp.objectUseVar ? Game.player.variable.getVariable(cp.uiVar) : cp.uiID;
        // -- 图像层的场合
        if (cp.showType == 1) {
            passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        }
        // -- 界面层的场合
        else {
            passageID = 1000000 + uiID;
        }
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof GUI_BASE))
            return;
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcUIMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        // 获取属性
        var toDpX, toDpY, toDpScaleX, toDpScaleY;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpScaleX = Game.player.variable.getVariable(cp.dpScaleXVar);
            toDpScaleY = Game.player.variable.getVariable(cp.dpScaleYVar);
        }
        else {
            toDpScaleX = cp.dpScaleX;
            toDpScaleY = cp.dpScaleY;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        //
        // 立即模式：无需清理此行为
        if (cp.timeType == 0) {
            if (cp.showType == 1) {
                a.dpX = toDpX;
                a.dpY = toDpY;
                a.dpZ = toDpZ;
                a.dpScaleX = toDpScaleX;
                a.dpScaleY = toDpScaleY;
                a.dpCoordToRealCoord();
            }
            else {
                a.x = toDpX;
                a.y = toDpY;
                a.scaleX = toDpScaleX;
                a.scaleY = toDpScaleY;
            }
            a.rotation1 = toRotation;
            a.opacity = toOpacity;
        }
        // 过渡模式：由于注册了帧刷，需要清理
        else {
            // 下一帧开始移动 1/MAX
            // GameUtils.getValueByTransData(null, );
            var cX = void 0, cY = void 0, cScaleX = void 0, cScaleY = void 0;
            if (cp.showType == 1) {
                cX = a.dpX;
                cY = a.dpY;
                cScaleX = a.dpScaleX;
                cScaleY = a.dpScaleY;
            }
            else {
                cX = a.x;
                cY = a.y;
                cScaleX = a.scaleX;
                cScaleY = a.scaleY;
            }
            var m = {
                time: cp.time,
                curTime: 1,
                x: cX,
                y: cY,
                z: a.dpZ,
                scaleX: cScaleX,
                scaleY: cScaleY,
                rotation: a.rotation1,
                opacity: a.opacity,
                x2: toDpX - cX,
                y2: toDpY - cY,
                z2: toDpZ - a.dpZ,
                scaleX2: toDpScaleX - cScaleX,
                scaleY2: toDpScaleY - cScaleY,
                rotation2: toRotation - a.rotation1,
                opacity2: toOpacity - a.opacity,
                transData: GameUtils.getTransData(cp.trans)
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcUIMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            // 立刻开始执行一帧
            gcUIMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3011 = customCommand_3011;
    /**
     * 关闭界面
     */
    function customCommand_3012(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // -- 图像层的场合
        if (cp.showType == 1) {
            // 获取通道
            var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
            passageID = MathUtils.int(passageID);
            passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
            GameImageLayer.deletePassage(passageID);
        }
        // -- 界面层的场合
        else {
            var uiID = cp.objectUseVar ? Game.player.variable.getVariable(cp.uiVar) : cp.uiID;
            GameUI.hide(uiID);
        }
    }
    CommandExecute.customCommand_3012 = customCommand_3012;
    /**
     * 移动界面元件
     */
    function customCommand_3013(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 解析移动数据
        if (!cp.changeUIAttr || !Array.isArray(cp.changeUIAttr))
            return;
        var cmdParam = cp.changeUIAttr[1];
        if (!cmdParam)
            return;
        var atts = cmdParam[2];
        if (!atts || !atts.uiID)
            return;
        // 获取通道
        var uiID = atts.uiID;
        // -- 图像层的场合
        var passageID = 1000000 + uiID;
        // 获取通道显示对象
        //@ts-ignore
        var a = GameImageLayer.getImageSprite(passageID);
        //@ts-ignore
        if (!a || !(a instanceof GUI_BASE))
            return;
        // 标识：由于移动界面元件支持对同一个界面多次叠加，此处sign则是唯一
        var sign = "gcUICompMove" + ObjectUtils.getRandID();
        // 立即模式：无需清理此行为
        if (cmdParam[5] == 0) {
            var comps = GameUI.getAllCompChildren(a, true);
            for (var compID in atts.atts) {
                var uiComp = comps.keyValue[compID];
                if (uiComp) {
                    var attsValues = atts.atts[compID][1];
                    //@ts-ignore
                    var useVarAndTransitionAttrs = atts.atts[compID][2];
                    for (var attName in attsValues) {
                        var attValue = attsValues[attName];
                        //同步材质
                        if (attName == "materialData") {
                            refreshCompMaterials.apply({}, [attValue, uiComp]);
                        }
                        else {
                            //变量
                            //@ts-ignore
                            if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                                //@ts-ignore
                                if (useVarAndTransitionAttrs[attName].type == 0) {
                                    //@ts-ignore
                                    attValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                                }
                                //@ts-ignore
                                else if (useVarAndTransitionAttrs[attName].type == 1) {
                                    //@ts-ignore
                                    attValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                                }
                                //@ts-ignore
                                else if (useVarAndTransitionAttrs[attName].type == 2) {
                                    //@ts-ignore
                                    attValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                                }
                            }
                            // 字符串变量（设置成字符串仅根据当前的值而非绑定字符串）
                            if (typeof attValue == "string") {
                                var strVarID = GameUtils.getVarID(attValue);
                                if (strVarID != 0) {
                                    attValue = Game.player.variable.getString(strVarID);
                                }
                                else {
                                    //@ts-ignore
                                    var globalStrVarID = GameUtils.getGlobalVarID(attValue);
                                    if (globalStrVarID != 0) {
                                        attValue = ClientWorld.variable.getString(globalStrVarID);
                                    }
                                }
                            }
                            uiComp[attName] = attValue;
                        }
                    }
                }
            }
        }
        else {
            var m = {
                time: cmdParam[0],
                curTime: 1,
                transData: GameUtils.getTransData(cmdParam[1]),
                attrInfos: []
            };
            var comps = GameUI.getAllCompChildren(a, true);
            for (var compID in atts.atts) {
                var uiComp = comps.keyValue[compID];
                if (uiComp) {
                    var attsValues = atts.atts[compID][1];
                    //@ts-ignore
                    var useVarAndTransitionAttrs = atts.atts[compID][2];
                    for (var attName in attsValues) {
                        var oldValue = uiComp[attName];
                        var needTween = typeof oldValue == "number";
                        if (attName == "materialData")
                            needTween = true;
                        //@ts-ignore
                        var useVarAndTransition = useVarAndTransitionAttrs[attName];
                        if (useVarAndTransition) {
                            // 如果并非过渡渐变的话则表示立即变更，效果会受到「无法渐变的属性处理」影响
                            if (!useVarAndTransition.change) {
                                needTween = false;
                            }
                        }
                        var newValue = attsValues[attName];
                        //变量
                        //@ts-ignore
                        if (useVarAndTransitionAttrs && useVarAndTransitionAttrs[attName].type != null) {
                            //@ts-ignore
                            if (useVarAndTransitionAttrs[attName].type == 0) {
                                //@ts-ignore
                                newValue = Game.player.variable.getVariable(useVarAndTransitionAttrs[attName].index);
                            }
                            //@ts-ignore
                            else if (useVarAndTransitionAttrs[attName].type == 1) {
                                //@ts-ignore
                                newValue = Game.player.variable.getString(useVarAndTransitionAttrs[attName].index);
                            }
                            //@ts-ignore
                            else if (useVarAndTransitionAttrs[attName].type == 2) {
                                //@ts-ignore
                                newValue = Game.player.variable.getSwitch(useVarAndTransitionAttrs[attName].index) ? true : false;
                            }
                        }
                        var attrInfo = { uiComp: uiComp, uiCompID: uiComp.id, attName: attName, oldValue: oldValue, needTween: needTween, newValue: newValue };
                        //@ts-ignore
                        m.attrInfos.push(attrInfo);
                    }
                }
            }
            //
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcUICompMoveFrameUpdate, thisPtr, [a, m, passageID, sign, cmdParam[3]], sign);
            // 立刻开始执行一帧
            gcUICompMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign, cmdParam[3]]);
        }
    }
    CommandExecute.customCommand_3013 = customCommand_3013;
    /**
     * 添加材质
     */
    function customCommand_3014(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 材质数据设置，格式：[{ materials: [] },{ materials: [] }]  渲染用的materialData不更改，其他数组等容器复制
        var materialData = [];
        for (var i = 0; i < cp.materialData.length; i++) {
            var md = { materials: cp.materialData[i].materials.concat() };
            materialData.push(md);
        }
        // -- 图像层
        if (cp.targetType == 0) {
            addMaterialToLayer(Game.layer.imageLayer);
        }
        // -- 指定的图像编号
        else if (cp.targetType == 1) {
            var imagePassageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
            var imagePassageInfos = { passageID: imagePassageID, materialSetting: materialData };
            // 获取通道显示对象
            var a = GameImageLayer.getImageSprite(imagePassageID);
            if (!a || !(a instanceof GameSprite))
                return;
            // 遍历所有的通道
            for (var p = 0; p < imagePassageInfos.materialSetting.length; p++) {
                var materialSetting = imagePassageInfos.materialSetting[p];
                // 遍历所有的材质
                for (var s = 0; s < materialSetting.materials.length; s++) {
                    var mData = materialSetting.materials[s];
                    mData.____timeInfo = {};
                    var m = a.getMaterialByID(mData.id, p);
                    // 如果已存在的话需要移除掉，替换新的同ID材质
                    if (m)
                        a.removeMaterial(mData, p);
                    a.addMaterial(mData, p);
                    a.setMaterialDirty();
                }
            }
        }
        // -- 指定的界面
        else if (cp.targetType == 2) {
            var uiID = cp.objectUseVar ? Game.player.variable.getVariable(cp.uiVar) : cp.uiID;
            var uiPassageInfos = { uiID: uiID, materialSetting: materialData };
            var targetPassageID = 1000000 + uiPassageInfos.uiID;
            // 获取界面
            var b = GameImageLayer.getImageSprite(targetPassageID);
            if (!b || !(b instanceof GUI_BASE))
                return;
            // 遍历所有的通道
            for (var p = 0; p < uiPassageInfos.materialSetting.length; p++) {
                var materialSetting = uiPassageInfos.materialSetting[p];
                // 遍历所有的材质
                for (var s = 0; s < materialSetting.materials.length; s++) {
                    var mData = materialSetting.materials[s];
                    mData.____timeInfo = {};
                    var m = b.getMaterialByID(mData.id, p);
                    // 如果已存在的话需要移除掉，替换新的同ID材质
                    if (m)
                        b.removeMaterial(mData, p);
                    b.addMaterial(mData, p);
                    b.setMaterialDirty();
                }
            }
        }
        // -- 界面层
        else if (cp.targetType == 3) {
            addMaterialToLayer(Game.layer.uiLayer);
        }
        // -- 全画面
        else if (cp.targetType == 4) {
            addMaterialToLayer(Game.layer);
        }
        // -- 场景层
        else if (cp.targetType == 5) {
            addMaterialToLayer(Game.layer.sceneLayer);
        }
        function addMaterialToLayer(layer) {
            var stageInfos = materialData;
            // 遍历所有的通道
            for (var p = 0; p < stageInfos.length; p++) {
                var stageInfo = stageInfos[p];
                // 遍历所有的材质
                for (var s = 0; s < stageInfo.materials.length; s++) {
                    var mData = stageInfo.materials[s];
                    mData.____timeInfo = {};
                    var m = layer.getMaterialByID(mData.id, p);
                    // 如果已存在的话需要移除掉，替换新的同ID材质
                    if (m)
                        layer.removeMaterial(mData, p);
                    layer.addMaterial(mData, p);
                }
            }
        }
    }
    CommandExecute.customCommand_3014 = customCommand_3014;
    /**
     * 更改材质：同添加材质
     */
    function customCommand_3015(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        customCommand_3014.apply(this, arguments);
    }
    CommandExecute.customCommand_3015 = customCommand_3015;
    /**
     * 删除材质
     */
    function customCommand_3016(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var cmdParams = cp;
        if (cmdParams.targetType == 0) {
            clearLayerMaterials(Game.layer.imageLayer);
        }
        // // -- 指定的图像编号
        else if (cmdParams.targetType == 1) {
            var imagePassageID = cmdParams.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cmdParams.passageID;
            // 获取通道显示对象
            var a = GameImageLayer.getImageSprite(imagePassageID);
            if (!a || !(a instanceof GameSprite))
                return;
            if (cmdParams.clearType == 1) {
                a.removeMaterialByID(cp.materialID, cp.materialPassage);
            }
            else {
                a.clearMaterials();
            }
        }
        // -- 指定的界面
        else if (cmdParams.targetType == 2) {
            var uiID = cp.objectUseVar ? Game.player.variable.getVariable(cp.uiVar) : cp.uiID;
            var targetPassageID = 1000000 + uiID;
            // 获取界面
            var b = GameImageLayer.getImageSprite(targetPassageID);
            if (!b || !(b instanceof GUI_BASE))
                return;
            uiID = cmdParams.uiID;
            var uiPassageID = cmdParams.uiID + 1000000;
            if (cmdParams.clearType == 1) {
                b.removeMaterialByID(cp.materialID, cp.materialPassage);
            }
            else {
                b.clearMaterials();
            }
        }
        // -- 界面层
        else if (cp.targetType == 3) {
            clearLayerMaterials(Game.layer.uiLayer);
        }
        // -- 全画面
        else if (cp.targetType == 4) {
            clearLayerMaterials(Game.layer);
        }
        // -- 场景层
        else if (cp.targetType == 5) {
            clearLayerMaterials(Game.layer.sceneLayer);
        }
        function clearLayerMaterials(layer) {
            if (cmdParams.clearType == 1) {
                // 遍历所有来自指令的添加
                layer.removeMaterialByID(cp.materialID, cp.materialPassage);
            }
            else {
                layer.clearMaterials();
            }
        }
    }
    CommandExecute.customCommand_3016 = customCommand_3016;
    /**
     * 显示视频
     */
    var startVideo;
    function customCommand_3018(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var _this = this;
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取属性值
        var video = cp.objectUseVar ? Game.player.variable.getString(cp.videoVar) : cp.video;
        var dpX, dpY, dpWidth, dpHeight;
        if (cp.posUseVar) {
            dpX = Game.player.variable.getVariable(cp.dpXVar);
            dpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            dpX = cp.dpX;
            dpY = cp.dpY;
        }
        var dpz = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            dpWidth = Game.player.variable.getVariable(cp.dpWidthVar);
            dpHeight = Game.player.variable.getVariable(cp.dpHeightVar);
        }
        else {
            dpWidth = cp.dpWidth;
            dpHeight = cp.dpHeight;
        }
        var rotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var opacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        // 创建显示对象
        var a = new UIVideo();
        startVideo = a;
        // 先暂停，等真正载入完毕时才继续
        trigger.pause = true;
        trigger.offset(1);
        a.once(EventObject.LOADED, this, function () {
            a.dpX = dpX;
            a.dpY = dpY;
            a.dpZ = dpz;
            a.dpWidth = dpWidth;
            a.dpHeight = dpHeight;
            a.rotation1 = rotation;
            a.opacity = opacity;
            a.flip = cp.flip;
            var currentTime = cp.currentTimeUseVar ? Game.player.variable.getVariable(cp.currentTimeVar) : cp.currentTime;
            a.muted = cp.muted;
            a.loop = cp.loop;
            a.volume = cp.volume;
            a.currentTime = currentTime;
            a.playbackRate = cp.playbackRate;
            a.playType = cp.playType;
            a.dpCoordToRealCoord();
            Game.layer.imageLayer.addChild(a);
            a.visible = false;
            if (a.playType != 0 || a.isPlaying) {
                GameImageLayer.deletePassage(passageID);
                // 设置通道由该显示对象占用
                GameImageLayer.setImageSprite(passageID, a);
                a.visible = true;
                CommandPage.executeEvent(trigger, []);
            }
            else {
                os.add_ENTERFRAME(function () {
                    if (a.isPlaying) {
                        setFrameout(function () {
                            GameImageLayer.deletePassage(passageID);
                            // 设置通道由该显示对象占用
                            GameImageLayer.setImageSprite(passageID, a);
                            CommandPage.executeEvent(trigger, []);
                            a.visible = true;
                            a.event("Video_Real_Loaded");
                        }, 1);
                        //@ts-ignore
                        os.remove_ENTERFRAME(arguments.callee, _this);
                    }
                }, _this);
            }
        });
        a.useDPCoord = true;
        a.dpDisplayPriority = passageID;
        a.videoURL = video;
        if (cp.blendMode != null)
            a.blendMode = [null, "lighter", "blend5-1", "blend4-1", "blend4-7", "blend4-4"][cp.blendMode];
    }
    CommandExecute.customCommand_3018 = customCommand_3018;
    /**
     * 移动视频
     */
    function customCommand_3019(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        // 获取通道
        var passageID = cp.passageIDUseVar ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        passageID = MathUtils.int(passageID);
        // 获取通道显示对象
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIBitmap)) {
            return;
        }
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        var sign = "gcVideoMove";
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        // 获取属性
        var toDpX, toDpY, toDpWidth, toDpHeight;
        if (cp.posUseVar) {
            toDpX = Game.player.variable.getVariable(cp.dpXVar);
            toDpY = Game.player.variable.getVariable(cp.dpYVar);
        }
        else {
            toDpX = cp.dpX;
            toDpY = cp.dpY;
        }
        var toDpZ = cp.zUseVar ? Game.player.variable.getVariable(cp.dpZVar) : cp.dpZ;
        if (cp.sizeUseVar) {
            toDpWidth = Game.player.variable.getVariable(cp.dpWidthVar);
            toDpHeight = Game.player.variable.getVariable(cp.dpHeightVar);
        }
        else {
            toDpWidth = cp.dpWidth;
            toDpHeight = cp.dpHeight;
        }
        var toRotation = cp.rotationUseVar ? Game.player.variable.getVariable(cp.rotationVar) : cp.rotation;
        var toOpacity = cp.opacityUseVar ? Game.player.variable.getVariable(cp.opacityVar) : cp.opacity;
        var toCurrentTime = cp.changeStartTime ? (cp.currentTimeUseVar ? Game.player.variable.getVariable(cp.currentTimeVar) : cp.currentTime) : null;
        // 立即模式：无需清理此行为
        if (cp.timeType == 0) {
            a.dpX = toDpX;
            a.dpY = toDpY;
            a.dpZ = toDpZ;
            a.dpWidth = toDpWidth;
            a.dpHeight = toDpHeight;
            a.rotation = toRotation;
            a.opacity = toOpacity;
            a.flip = cp.flip;
            if (cp.playType != null && a.playType != cp.playType)
                a.playType = cp.playType;
            if (cp.muted != null)
                a.muted = cp.muted;
            if (cp.loop != null)
                a.loop = cp.loop;
            if (cp.playbackRate != null)
                a.playbackRate = cp.playbackRate;
            if (cp.changeStartTime)
                a.currentTime = toCurrentTime;
            if (cp.volume != null)
                a.volume = cp.volume;
            if (cp.blendMode != null)
                a.blendMode = [null, "lighter", "blend5-1", "blend4-1", "blend4-7", "blend4-4"][cp.blendMode];
        }
        // 过渡模式：由于注册了帧刷，需要清理
        else {
            // 下一帧开始移动 1/MAX
            var m = {
                time: cp.time,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                width: a.dpWidth,
                height: a.dpHeight,
                rotation: a.rotation1,
                opacity: a.opacity,
                x2: toDpX - a.dpX,
                y2: toDpY - a.dpY,
                z2: toDpZ - a.dpZ,
                width2: toDpWidth - a.dpWidth,
                height2: toDpHeight - a.dpHeight,
                rotation2: toRotation - a.rotation1,
                opacity2: toOpacity - a.opacity,
                pivotType2: a.pivotType,
                blendMode2: cp.blendMode,
                flip2: cp.flip,
                transData: GameUtils.getTransData(cp.trans),
                volume: a.volume,
                currentTime: a.currentTime,
                volume2: cp.volume != null ? cp.volume - a.volume : null,
                currentTime2: toCurrentTime == null ? null : toCurrentTime - a.currentTime,
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            // 立即更改
            if (cp.playType != null && a.playType != cp.playType) {
                a.playType = cp.playType;
            }
            if (cp.muted != null)
                a.muted = cp.muted;
            if (cp.loop != null)
                a.loop = cp.loop;
            if (cp.playbackRate != null)
                a.playbackRate = cp.playbackRate;
            // 立刻开始执行一帧
            gcImageMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    }
    CommandExecute.customCommand_3019 = customCommand_3019;
    /**
     * 等待指定视频播放完成
     */
    function customCommand_3021(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var passageID = cp.varType == 1 ? Game.player.variable.getVariable(cp.passageIDVar) : cp.passageID;
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIVideo)) {
            // -- 再次查询即将开始的UIVideo
            a = startVideo;
            if (!a) {
                return;
            }
            // -- 找到后等待真正加载完成
            else {
                startVideo = null;
                // 停止
                a.once("Video_Real_Loaded", this, doWaitVideo, [true]);
                return;
            }
        }
        function doWaitVideo(realLoaded) {
            var _this = this;
            if (realLoaded === void 0) { realLoaded = false; }
            // 如果被删除掉了
            a.once("___deletePassage", this, doNext);
            // 等待真正的加载完毕后
            if (realLoaded) {
                trigger.pause = true;
                trigger.offset(1);
                a.once(EventObject.COMPLETE, this, doNext, [trigger]);
            }
            // 未加载完成时先加载
            else if (isNaN(a.duration)) {
                a.once(EventObject.LOADED, this, function () {
                    a.once(EventObject.COMPLETE, _this, doNext, [trigger]);
                });
            }
            else if (a.isPlaying) {
                // 等待播放完成后继续执行
                a.once(EventObject.COMPLETE, this, doNext, [trigger]);
            }
            else {
                doNext.apply(this);
            }
        }
        function doNext() {
            a.offAll("___deletePassage");
            if (trigger.pause)
                CommandPage.executeEvent(trigger, []);
        }
        // 停止
        trigger.pause = true;
        trigger.offset(1);
        doWaitVideo.apply(this);
    }
    CommandExecute.customCommand_3021 = customCommand_3021;
    /**
     * 记录监听的界面以及对应的触发器标识
     */
    var isWaitingUICloseInfos = [];
    /**
     * 额外的存档标识
     */
    var extSaveSign = "waitCloseUIListener";
    /**
     * 等待指定界面关闭
     */
    function customCommand_3020(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        // 根据常量或变量或者界面编号
        var uiID = p.useVar == 1 ? Game.player.variable.getVariable(p.uiVar) : p.uiID;
        // 如果该界面已打开的话则暂停并监听关闭后继续事件
        if (GameUI.isOpened(uiID)) {
            trigger.pause = true;
            trigger.offset(1);
            listenerWhenUIClose(uiID, trigger);
        }
    }
    CommandExecute.customCommand_3020 = customCommand_3020;
    /**
     * 存档时保存额外的信息：记录正处于监听界面关闭的状态
     */
    SinglePlayerGame.regSaveCustomData(extSaveSign, Callback.New(function () {
        return isWaitingUICloseInfos;
    }, null));
    /**
     * 读档：重新恢复监听界面关闭的状态
     */
    EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_RECOVER_TRIGGER, Callback.New(function (trigger) {
        var listers = SinglePlayerGame.getSaveCustomData(extSaveSign);
        // 检查该触发器是否在listers中
        var lister = ArrayUtils.matchAttributes(listers, { triggerMainType: trigger.mainType, triggerIndexType: trigger.indexType, triggerFrom: trigger.from }, true)[0];
        if (lister) {
            listenerWhenUIClose(lister.uiID, trigger);
        }
    }, null));
    /**
     * 监听当窗口关闭时的状态
     * @param uiID 系统界面组中的界面编号
     * @param trigger 触发器
     */
    function listenerWhenUIClose(uiID, trigger) {
        var _this = this;
        // 添加监听记录至列表，以便读档后恢复
        var t = { uiID: uiID, triggerMainType: trigger.mainType, triggerIndexType: trigger.indexType, triggerFrom: trigger.from };
        isWaitingUICloseInfos.push(t);
        // 添加监听指定的界面关闭时事件
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, function (closeUIID) {
            if (closeUIID == uiID) {
                ArrayUtils.remove(isWaitingUICloseInfos, t);
                //@ts-ignore
                EventUtils.removeEventListenerFunction(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, arguments.callee, _this);
                CommandPage.executeEvent(trigger, []);
            }
        }, this);
    }
    //------------------------------------------------------------------------------------------------------
    //  音频
    //------------------------------------------------------------------------------------------------------
    /**
     * 播放背景音乐
     */
    function customCommand_5001(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var bgmURL = cp.advanceSetting && cp.bgmUseVar ? Game.player.variable.getString(cp.bgmVarID) : cp.bgm;
        var volume = 1;
        var pitch = 1;
        if (bgmURL) {
            var bgmURLArr = bgmURL.split(",");
            if (bgmURLArr.length == 3) {
                volume = MathUtils.float(parseFloat(bgmURLArr[1]) / 100);
                pitch = MathUtils.float(parseFloat(bgmURLArr[2]) / 100);
            }
        }
        var fadeIn = MathUtils.int(cp.advanceSetting && cp.fadeInTimeUseVar ? Game.player.variable.getVariable(cp.fadeInTimeVarID) : cp.fadeInTime);
        GameAudio.playBGM(bgmURL, volume, 99999, fadeIn != 0, fadeIn * 1000, pitch);
    }
    CommandExecute.customCommand_5001 = customCommand_5001;
    /**
     * 停止背景音乐
     */
    function customCommand_5002(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var fadeOut = MathUtils.int(cp.fadeOutTimeUseVar ? Game.player.variable.getVariable(cp.fadeOutTimeVarID) : cp.fadeOutTime);
        GameAudio.stopBGM(fadeOut != 0, fadeOut * 1000);
    }
    CommandExecute.customCommand_5002 = customCommand_5002;
    /**
     * 播放环境声效
     */
    function customCommand_5003(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var bgsURL = cp.advanceSetting && cp.bgsUseVar ? Game.player.variable.getString(cp.bgsVarID) : cp.bgs;
        var volume = 1;
        var pitch = 1;
        if (bgsURL) {
            var bgsURLArr = bgsURL.split(",");
            if (bgsURLArr.length == 3) {
                volume = MathUtils.float(parseFloat(bgsURLArr[1]) / 100);
                pitch = MathUtils.float(parseFloat(bgsURLArr[2]) / 100);
            }
        }
        var fadeIn = MathUtils.int(cp.advanceSetting && cp.fadeInTimeUseVar ? Game.player.variable.getVariable(cp.fadeInTimeVarID) : cp.fadeInTime);
        GameAudio.playBGS(bgsURL, volume, 99999, fadeIn != 0, fadeIn * 1000, pitch);
    }
    CommandExecute.customCommand_5003 = customCommand_5003;
    /**
     * 停止环境声效
     */
    function customCommand_5004(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var fadeOut = MathUtils.int(cp.fadeOutTimeUseVar ? Game.player.variable.getVariable(cp.fadeOutTimeVarID) : cp.fadeOutTime);
        GameAudio.stopBGS(fadeOut != 0, fadeOut * 1000);
    }
    CommandExecute.customCommand_5004 = customCommand_5004;
    /**
     * 播放音效
     */
    function customCommand_5005(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var soc = null;
        // 如果触发器类型来源于场景对象且勾选了近大远小的效果
        if (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && cp.nearBigFarSmall) {
            soc = trigger.executor;
        }
        var seURL;
        if (cp.systemSE) {
            switch (cp.systemSEType) {
                case 0:
                    seURL = WorldData.selectSE;
                    break;
                case 1:
                    seURL = WorldData.sureSE;
                    break;
                case 2:
                    seURL = WorldData.cancelSE;
                    break;
                case 3:
                    seURL = WorldData.disalbeSE;
                    break;
                default:
                    return;
            }
            GameAudio.playSE(seURL);
        }
        else {
            seURL = (cp.seUseVar ? Game.player.variable.getString(cp.seVarID) : cp.se);
            var volume = 1;
            var pitch = 1;
            if (seURL) {
                var seURLArr = seURL.split(",");
                if (seURLArr.length == 3) {
                    volume = MathUtils.float(parseFloat(seURLArr[1]) / 100);
                    pitch = MathUtils.float(parseFloat(seURLArr[2]) / 100);
                }
            }
            GameAudio.playSE(seURL, volume, pitch, soc);
        }
    }
    CommandExecute.customCommand_5005 = customCommand_5005;
    /**
     * 停止全部音效
     */
    function customCommand_5006(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        GameAudio.stopSE();
    }
    CommandExecute.customCommand_5006 = customCommand_5006;
    /**
     * 播放语音
     */
    function customCommand_5007(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        var soc = null;
        // 如果触发器类型来源于场景对象且勾选了近大远小的效果
        if (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && cp.nearBigFarSmall) {
            soc = trigger.executor;
        }
        var tsURL = cp.tsUseVar ? Game.player.variable.getString(cp.tsVarID) : cp.ts;
        var volume = 1;
        var pitch = 1;
        if (tsURL) {
            var tsURLArr = tsURL.split(",");
            if (tsURLArr.length == 3) {
                volume = MathUtils.float(parseFloat(tsURLArr[1]) / 100);
                pitch = MathUtils.float(parseFloat(tsURLArr[2]) / 100);
            }
        }
        GameAudio.playTS(tsURL, volume, pitch, soc);
    }
    CommandExecute.customCommand_5007 = customCommand_5007;
    /**
     * 停止全部语音
     */
    function customCommand_5008(commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        GameAudio.stopTS();
    }
    CommandExecute.customCommand_5008 = customCommand_5008;
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 移动图片时的逐帧执行的函数
     */
    function gcImageMoveFrameUpdate(a, m, passageID, sign) {
        // 首帧变化的属性
        if (m.curTime == 1) {
            a.pivotType = m.pivotType2;
            a.blendMode = [null, "lighter", "blend5-1", "blend4-1", "blend4-7", "blend4-4"][m.blendMode2];
            a.flip = m.flip2;
        }
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpWidth = m.width2 * value + m.width;
        a.dpHeight = m.height2 * value + m.height;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        if (a instanceof UIVideo) {
            if (m.volume2 != null)
                a.volume = m.volume2 * value + m.volume;
            if (m.currentTime2 != null)
                a.currentTime = m.currentTime2 * value + m.currentTime;
        }
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
        a.dpCoordToRealCoord();
    }
    CommandExecute.gcImageMoveFrameUpdate = gcImageMoveFrameUpdate;
    /**
     * 移动相机时的逐帧执行的函数
     */
    function gcCameraMoveFrameUpdate(a, m, passageID, sign) {
        var imageLayer = Game.layer.imageLayer;
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        imageLayer.camera.viewPort.x = m.x2 * value + m.x;
        imageLayer.camera.viewPort.y = m.y2 * value + m.y;
        imageLayer.camera.z = m.z2 * value + m.z;
        imageLayer.camera.rotation = m.rotation2 * value + m.rotation;
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
        imageLayer.updateFrame(true);
    }
    CommandExecute.gcCameraMoveFrameUpdate = gcCameraMoveFrameUpdate;
    /**
     * 移动动画时的逐帧执行的函数
     */
    function gcAnimationMoveFrameUpdate(a, m, passageID, sign, changeFrame) {
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpScaleX = m.scaleX2 * value + m.scaleX;
        a.dpScaleY = m.scaleY2 * value + m.scaleY;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        if (changeFrame) {
            a.aniFrame = m.aniFrame2 * value + m.aniFrame;
        }
        a.dpCoordToRealCoord();
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
    }
    CommandExecute.gcAnimationMoveFrameUpdate = gcAnimationMoveFrameUpdate;
    /**
     * 移动立绘时的逐帧执行的函数
     */
    function gcStandAvatarMoveFrameUpdate(a, m, passageID, sign) {
        // 立即变更
        if (m.curTime == 1) {
            if (m.changeExpression) {
                a.actionID = m.actionID;
            }
        }
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpScaleX = m.scaleX2 * value + m.scaleX;
        a.dpScaleY = m.scaleY2 * value + m.scaleY;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        a.dpCoordToRealCoord();
        if (m.changeFrame) {
            a.avatarFrame = m.avatarFrame2 * value + m.avatarFrame;
        }
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
    }
    CommandExecute.gcStandAvatarMoveFrameUpdate = gcStandAvatarMoveFrameUpdate;
    /**
     * 自动旋转的逐帧执行的函数
     */
    function gcGameSpriteRotationMoveFrameUpdate(a, rotation, passageID, sign) {
        // 该通道的显示对象开始旋转
        if (a) {
            a.rotation2 += rotation;
        }
        // 如果已没有显示对象的话就直接清理掉该函数
        else {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
    }
    CommandExecute.gcGameSpriteRotationMoveFrameUpdate = gcGameSpriteRotationMoveFrameUpdate;
    /**
     * 移动界面的逐帧执行的函数
     */
    function gcUIMoveFrameUpdate(a, m, passageID, sign) {
        // 没有显示对象或已被释放的情况
        if (!a || a.isDisposed) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
            return;
        }
        // 计算过渡值
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        if (a.useDPCoord) {
            a.dpX = m.x2 * value + m.x;
            a.dpY = m.y2 * value + m.y;
            a.dpZ = m.z2 * value + m.z;
            a.dpScaleX = m.scaleX2 * value + m.scaleX;
            a.dpScaleY = m.scaleY2 * value + m.scaleY;
            a.dpCoordToRealCoord();
        }
        else {
            a.x = m.x2 * value + m.x;
            a.y = m.y2 * value + m.y;
            a.scaleX = m.scaleX2 * value + m.scaleX;
            a.scaleY = m.scaleY2 * value + m.scaleY;
        }
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
    }
    CommandExecute.gcUIMoveFrameUpdate = gcUIMoveFrameUpdate;
    /**
     * 移动界面元件的逐帧执行的函数
     */
    function gcUICompMoveFrameUpdate(a, m, passageID, sign, nonTweenType) {
        var per = m.curTime / m.time;
        for (var i = 0; i < m.attrInfos.length; i++) {
            var attrInfo = m.attrInfos[i];
            if (!attrInfo.needTween) {
                // 无法渐变过渡的属性处理方式：在第一帧时变动/在最后一帧变动
                if ((nonTweenType == 0 && m.curTime == 1) || (nonTweenType == 1 && per == 1)) {
                    if (attrInfo.attName == "materialData") {
                        refreshCompMaterials.apply({}, [attrInfo.newValue, attrInfo.uiComp]);
                    }
                    else {
                        attrInfo.uiComp[attrInfo.attName] = attrInfo.newValue;
                    }
                }
            }
            else {
                var valuePer = GameUtils.getValueByTransData(m.transData, per);
                //同步材质
                if (attrInfo.attName == "materialData") {
                    var materials = refreshCompMaterialsTrans.apply({}, [attrInfo.newValue, attrInfo.oldValue, valuePer, nonTweenType, m.curTime]);
                    refreshCompMaterials.apply({}, [materials, attrInfo.uiComp]);
                }
                else {
                    attrInfo.uiComp[attrInfo.attName] = (attrInfo.newValue - attrInfo.oldValue) * valuePer + attrInfo.oldValue;
                }
            }
        }
        m.curTime++;
        if (per == 1) {
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        }
    }
    CommandExecute.gcUICompMoveFrameUpdate = gcUICompMoveFrameUpdate;
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 储存界面层的界面状态和界面内元件的状态，以便读档后打开界面时使用一次恢复
     */
    var useOnceUIInfos = {};
    /**
     * 监听界面打开：通过使用GameUI.show()打开的界面（位于界面层）
     */
    EventUtils.addEventListener(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, Callback.New(function (uiID) {
        // -- 获取通道
        var passageID = 1000000 + uiID;
        var ui = GameUI.get(uiID);
        if (!ui)
            return;
        // -- 装载属性
        var useOnceUIInfo = useOnceUIInfos[uiID];
        if (useOnceUIInfo) {
            for (var i in useOnceUIInfo) {
                if (i == "uiCompInfo")
                    continue;
                ui[i] = useOnceUIInfo[i];
            }
            var childs = GameUI.getAllCompChildren(ui, true, function (uiComp) {
                // 列表的属性忽略，一般由创建时刷新
                if (uiComp instanceof UIList) {
                    return false;
                }
            }).keyValue;
            for (var uiCompID in useOnceUIInfo.uiCompInfo) {
                var uiComp = childs[uiCompID];
                if (!uiComp)
                    continue;
                var uiCompInfo = useOnceUIInfo.uiCompInfo[uiCompID];
                for (var varName in uiCompInfo) {
                    uiComp[varName] = uiCompInfo[varName];
                }
            }
            delete useOnceUIInfos[uiID];
        }
        // -- 储存
        GameImageLayer.setImageSprite(passageID, ui);
    }, null));
    /**
     * 监听界面关闭
     */
    EventUtils.addEventListener(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, Callback.New(function (uiID) {
        // -- 获取通道
        var passageID = 1000000 + uiID;
        // -- 删除该通道
        // GameImageLayer.deletePassage(passageID);
    }, null));
    //------------------------------------------------------------------------------------------------------
    // 存档和读档-追加这些事件的修改的状态
    //------------------------------------------------------------------------------------------------------
    /**
     * 注册储存额外的自定义数据：
     * -- 当前显示的图像
     * -- 当前正在移动中的效果
     */
    if (!Config.BEHAVIOR_EDIT_MODE) {
        SinglePlayerGame.regSaveCustomData("cmdImagerLayer", Callback.New(function () {
            // 储存显示对象
            var imageSpriteInfos = {};
            for (var passageIDStr in GameImageLayer.imageSprites) {
                var disobjectInfo = GameImageLayer.imageSprites[passageIDStr];
                var sp = disobjectInfo.displayObject;
                var displayObjectAttrs = {};
                // 记录身上的材质
                var materialData = sp.getAllMaterialDatas();
                displayObjectAttrs["___materialData"] = materialData;
                // 视频
                if (sp instanceof UIVideo) {
                    var saveAttrs = ["videoURL", "dpX", "dpY", "dpZ", "dpWidth", "dpHeight", "rotation1", "rotation2", "opacity", "flip",
                        "playType", "muted", "volume", "loop", "currentTime", "playbackRate", "blendMode"];
                    for (var i in saveAttrs) {
                        var attrName = saveAttrs[i];
                        displayObjectAttrs[attrName] = sp[attrName];
                    }
                    imageSpriteInfos[passageIDStr] = {
                        type: "UIVideo",
                        displayObjectAttrs: displayObjectAttrs
                    };
                }
                // 图片
                else if (sp instanceof UIBitmap) {
                    var saveAttrs = ["image", "dpX", "dpY", "dpZ", "dpWidth", "dpHeight", "rotation1", "rotation2", "opacity", "pivotType", "blendMode", "flip"];
                    for (var i in saveAttrs) {
                        var attrName = saveAttrs[i];
                        displayObjectAttrs[attrName] = sp[attrName];
                    }
                    imageSpriteInfos[passageIDStr] = {
                        type: "UIBitmap",
                        displayObjectAttrs: displayObjectAttrs
                    };
                }
                // 动画
                else if (sp instanceof UIAnimation) {
                    var saveAttrs = ["animationID", "dpX", "dpY", "dpZ", "dpScaleX", "dpScaleY", "rotation1", "rotation2", "opacity", "playType", "silentMode", "showHitEffect", "playFps", "blendMode"];
                    for (var i in saveAttrs) {
                        var attrName = saveAttrs[i];
                        displayObjectAttrs[attrName] = sp[attrName];
                    }
                    // 记录当前帧
                    displayObjectAttrs["aniFrame"] = sp.animation.currentFrame;
                    imageSpriteInfos[passageIDStr] = {
                        type: "UIAnimation",
                        displayObjectAttrs: displayObjectAttrs
                    };
                }
                // 立绘
                else if (sp instanceof UIStandAvatar) {
                    var saveAttrs = ["avatarID", "dpX", "dpY", "dpZ", "dpScaleX", "dpScaleY", "rotation1", "rotation2", "opacity", "isPlay", "playOnce", "actionID", "avatarFPS", "blendMode"];
                    for (var i in saveAttrs) {
                        var attrName = saveAttrs[i];
                        displayObjectAttrs[attrName] = sp[attrName];
                    }
                    displayObjectAttrs["avatarFrame"] = sp.avatar.currentFrame;
                    imageSpriteInfos[passageIDStr] = {
                        type: "UIStandAvatar",
                        displayObjectAttrs: displayObjectAttrs
                    };
                }
                // 界面
                else if (sp instanceof GUI_BASE) {
                    if (!sp.stage)
                        continue;
                    var saveAttrs = void 0;
                    if (sp.useDPCoord) {
                        saveAttrs = ["useDPCoord", "dpX", "dpY", "dpZ", "dpScaleX", "dpScaleY", "rotation1", "rotation2", "opacity", "blendMode"];
                    }
                    else {
                        saveAttrs = ["useDPCoord", "x", "y", "scaleX", "scaleY", "rotation1", "rotation2", "opacity", "blendMode"];
                        displayObjectAttrs["___childIndex"] = Game.layer.uiLayer.getChildIndex(sp);
                    }
                    for (var i in saveAttrs) {
                        var attrName = saveAttrs[i];
                        displayObjectAttrs[attrName] = sp[attrName];
                    }
                    displayObjectAttrs["guiID"] = sp.guiID;
                    imageSpriteInfos[passageIDStr] = {
                        type: "GUI_BASE",
                        displayObjectAttrs: displayObjectAttrs
                    };
                }
                // 其他的情况
                else {
                    continue;
                }
            }
            // 储存移动效果
            var passageFrameUpdateDatas = {};
            var passageFrameUpdates = GameImageLayer.getPassageFrameUpdates();
            for (var passageIDStr in passageFrameUpdates) {
                var pArr = passageFrameUpdates[passageIDStr];
                if (pArr) {
                    var pDataArr = passageFrameUpdateDatas[passageIDStr] = [];
                    for (var s = 0; s < pArr.length; s++) {
                        var p = pArr[s];
                        var args = p.args.concat();
                        args.shift(); // 去除头-显示对象
                        // 移动界面元件时需要记录下
                        if (p.sign.indexOf("gcUICompMove") != -1) {
                            var m = args[0];
                            var newM = {
                                time: m.time,
                                curTime: m.curTime,
                                transData: m.transData,
                                attrInfos: []
                            };
                            for (var k = 0; k < m.attrInfos.length; k++) {
                                var oldAttrInfo = m.attrInfos[k];
                                var oldComp = oldAttrInfo.uiComp;
                                oldAttrInfo.uiComp = null;
                                newM.attrInfos[k] = ObjectUtils.depthClone(oldAttrInfo);
                                oldAttrInfo.uiComp = oldComp;
                            }
                            args[0] = newM;
                        }
                        pDataArr.push({ sign: p.sign, args: args });
                    }
                }
            }
            // 储存界面层的系统组界面以及其元件状态
            var allSystemGroupUIs = GameUI.getAllSystemGroupUIs();
            var saveDataUseOnceUIInfo = {};
            var BASE_ATTRS_OBJ = { x: true, y: true, width: true, height: true, rotation: true, show: true, opacity: true, mouseEventEnabledData: true };
            var _loop_1 = function (o) {
                var uiID = parseInt(o);
                var ui = allSystemGroupUIs[o];
                if (!ui)
                    return "continue";
                var uiPosData = {
                    // 界面基础属性
                    x: ui.x, y: ui.y, scaleX: ui.scaleX, scaleY: ui.scaleX, rotation1: ui.rotation1, rotation2: ui.rotation2, opacity: ui.opacity,
                    // 界面内元件的属性
                    uiCompInfo: {}
                };
                saveDataUseOnceUIInfo[uiID] = uiPosData;
                var allComps = GameUI.getAllCompChildren(ui, false).arr;
                allComps.forEach(function (comp) {
                    if (comp instanceof UIBase) {
                        var uiCompAtts = uiPosData.uiCompInfo[comp.id] = {};
                        // 基础属性记录
                        for (var b in BASE_ATTRS_OBJ) {
                            uiCompAtts[b] = comp[b];
                        }
                        // 自定义属性记录
                        var __compCustomAttributes = GameUI["__compCustomAttributes"];
                        if (__compCustomAttributes) {
                            var customAttrs = __compCustomAttributes[comp.className];
                            for (var c in customAttrs) {
                                var b = customAttrs[c];
                                uiCompAtts[b] = comp[b];
                            }
                        }
                    }
                });
            };
            for (var o in allSystemGroupUIs) {
                _loop_1(o);
            }
            // 储存当前镜头
            var imageLayer = Game.layer.imageLayer;
            var cameraInfo = {
                x: imageLayer.camera.viewPort.x,
                y: imageLayer.camera.viewPort.y,
                z: imageLayer.camera.z,
                rotation: imageLayer.camera.rotation
            };
            // 储存图像层的材质
            var imageLayerMaterialData = Game.layer.imageLayer.getAllMaterialDatas();
            // 储存界面层的材质
            var uiLayerMaterialData = Game.layer.uiLayer.getAllMaterialDatas();
            // 储存全画面的材质
            var screenMaterialData = Game.layer.getAllMaterialDatas();
            // 储存场景的材质
            var sceneLayerMaterialData = Game.layer.sceneLayer.getAllMaterialDatas();
            return { cameraInfo: cameraInfo, imageSpriteInfos: imageSpriteInfos, passageFrameUpdateDatas: passageFrameUpdateDatas, saveDataUseOnceUIInfo: saveDataUseOnceUIInfo, imageLayerMaterialData: imageLayerMaterialData, uiLayerMaterialData: uiLayerMaterialData, screenMaterialData: screenMaterialData, sceneLayerMaterialData: sceneLayerMaterialData };
        }, {}));
        /**
         * 监听读档恢复数据，恢复储存的自定义数据-图像相关事件
         */
        EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_ON_BEFORE_RECOVERY_DATA, Callback.New(function () {
            // 停止当前对话
            GameDialog.stop();
            // 清理所有图像
            for (var pi in GameImageLayer.imageSprites) {
                var passageID = parseInt(pi);
                var sp = GameImageLayer.getImageSprite(passageID);
                // 标题界面和读档界面以及对话菜单不释放
                if (sp instanceof GUI_BASE && (sp.guiID == 1 || sp.guiID == 2 || sp.guiID == 2003 || sp.guiID == 12))
                    continue;
                GameImageLayer.deletePassage(passageID);
                if (sp instanceof GUI_BASE) {
                    if (sp == GameUI.get(sp.guiID)) {
                        GameUI.dispose(sp.guiID);
                    }
                }
            }
            // 清理图像层材质
            Game.layer.imageLayer.clearMaterials();
            // 安装材质的方法
            function installMaterialData(sp, materialData) {
                if (!materialData || materialData.length == 0)
                    return;
                sp.installMaterialData(materialData, false);
            }
            var o = SinglePlayerGame.getSaveCustomData("cmdImagerLayer");
            if (!o)
                return;
            // 恢复 saveDataUseOnceUIInfo
            useOnceUIInfos = o.saveDataUseOnceUIInfo;
            // 显示对象
            var imageSpriteInfos = o.imageSpriteInfos;
            for (var passageIDStr in imageSpriteInfos) {
                var passageID = MathUtils.int(passageIDStr);
                var imageSpriteInfo = imageSpriteInfos[passageIDStr];
                // -- 视频
                if (imageSpriteInfo.type == "UIVideo") {
                    var e = new UIVideo();
                    e.dpDisplayPriority = passageID;
                    GameImageLayer.setImageSprite(passageID, e);
                    e.useDPCoord = true;
                    Game.layer.imageLayer.addChild(e);
                    for (var i in imageSpriteInfo.displayObjectAttrs) {
                        e[i] = imageSpriteInfo.displayObjectAttrs[i];
                    }
                    installMaterialData(e, imageSpriteInfo.displayObjectAttrs["___materialData"]);
                }
                // -- 图片
                else if (imageSpriteInfo.type == "UIBitmap") {
                    var a = new UIBitmap();
                    a.dpDisplayPriority = passageID;
                    GameImageLayer.setImageSprite(passageID, a);
                    a.useDPCoord = true;
                    Game.layer.imageLayer.addChild(a);
                    for (var i in imageSpriteInfo.displayObjectAttrs) {
                        a[i] = imageSpriteInfo.displayObjectAttrs[i];
                    }
                    installMaterialData(a, imageSpriteInfo.displayObjectAttrs["___materialData"]);
                }
                // -- 动画
                else if (imageSpriteInfo.type == "UIAnimation") {
                    var b = new UIAnimation();
                    b.animation.syncLoadWhenAssetExist = true;
                    b.dpDisplayPriority = passageID;
                    GameImageLayer.setImageSprite(passageID, b);
                    b.useDPCoord = true;
                    b.useDPCoordScaleMode = true;
                    Game.layer.imageLayer.addChild(b);
                    for (var i in imageSpriteInfo.displayObjectAttrs) {
                        b[i] = imageSpriteInfo.displayObjectAttrs[i];
                    }
                    installMaterialData(b, imageSpriteInfo.displayObjectAttrs["___materialData"]);
                }
                // -- 立绘
                else if (imageSpriteInfo.type == "UIStandAvatar") {
                    var c = new UIStandAvatar();
                    c.avatar.syncLoadWhenAssetExist = true;
                    c.dpDisplayPriority = passageID;
                    GameImageLayer.setImageSprite(passageID, c);
                    c.useDPCoord = true;
                    c.useDPCoordScaleMode = true;
                    Game.layer.imageLayer.addChild(c);
                    for (var i in imageSpriteInfo.displayObjectAttrs) {
                        c[i] = imageSpriteInfo.displayObjectAttrs[i];
                    }
                    installMaterialData(c, imageSpriteInfo.displayObjectAttrs["___materialData"]);
                }
                // -- 界面
                else if (imageSpriteInfo.type == "GUI_BASE") {
                    var uiID = imageSpriteInfo.displayObjectAttrs["guiID"];
                    var useDPCoord = imageSpriteInfo.displayObjectAttrs["useDPCoord"];
                    var d = GameUI.load(uiID, useDPCoord);
                    GameImageLayer.setImageSprite(passageID, d);
                    d.useDPCoordScaleMode = true;
                    if (useDPCoord) {
                        d.dpDisplayPriority = passageID;
                        Game.layer.imageLayer.addChild(d);
                    }
                    else {
                        // 记录显示层次，以便读档后
                        d.dpDisplayPriority = imageSpriteInfo.displayObjectAttrs["___childIndex"];
                        GameUI.show(uiID);
                    }
                    for (var i in imageSpriteInfo.displayObjectAttrs) {
                        d[i] = imageSpriteInfo.displayObjectAttrs[i];
                    }
                    installMaterialData(d, imageSpriteInfo.displayObjectAttrs["___materialData"]);
                }
            }
            // 界面层刷新层次 childIndex
            var uiChilds = [];
            var uiChildLength = Game.layer.uiLayer.numChildren;
            for (var s = 0; s < uiChildLength; s++) {
                uiChilds.push(Game.layer.uiLayer.getChildAt(s));
            }
            uiChilds.sort(function (a, b) {
                return a.dpDisplayPriority < b.dpDisplayPriority ? -1 : 1;
            });
            for (var j = 0; j < uiChildLength; j++) {
                Game.layer.uiLayer.setChildIndex(uiChilds[j], j);
            }
            // 当前的镜头
            var imageLayer = Game.layer.imageLayer;
            imageLayer.camera.viewPort.x = o.cameraInfo.x;
            imageLayer.camera.viewPort.y = o.cameraInfo.y;
            imageLayer.camera.z = o.cameraInfo.z;
            imageLayer.camera.rotation = o.cameraInfo.rotation;
            // 图像层刷新
            Game.layer.imageLayer.updateFrame(true);
            // 移动中效果
            var passageFrameUpdateDatas = o.passageFrameUpdateDatas;
            for (var passageIDStr in passageFrameUpdateDatas) {
                var passageID = MathUtils.int(passageIDStr);
                var pArr = passageFrameUpdateDatas[passageIDStr];
                if (pArr) {
                    for (var s = 0; s < pArr.length; s++) {
                        var p = pArr[s];
                        var thisPtr = {};
                        if (p.sign == "gcImageMove") {
                            var bmp = GameImageLayer.getImageSprite(passageID);
                            if (!bmp || !(bmp instanceof UIBitmap))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcImageMoveFrameUpdate, thisPtr, [bmp].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcVideoMove") {
                            var video = GameImageLayer.getImageSprite(passageID);
                            if (!video || !(video instanceof UIVideo))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcImageMoveFrameUpdate, thisPtr, [video].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcCameraMove") {
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcCameraMoveFrameUpdate, thisPtr, [null].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcAnimationMove") {
                            var ani = GameImageLayer.getImageSprite(passageID);
                            if (!ani || !(ani instanceof UIAnimation))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcAnimationMoveFrameUpdate, thisPtr, [ani].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcStandAvatarMove") {
                            var standAvatar = GameImageLayer.getImageSprite(passageID);
                            if (!standAvatar || !(standAvatar instanceof UIStandAvatar))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcStandAvatarMoveFrameUpdate, thisPtr, [standAvatar].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcImageSpriteRotationMove") {
                            var sp = GameImageLayer.getImageSprite(passageID);
                            if (!sp || !(sp instanceof GameSprite))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcGameSpriteRotationMoveFrameUpdate, thisPtr, [sp].concat(p.args), p.sign);
                        }
                        else if (p.sign == "gcUIMove") {
                            var ui = GameImageLayer.getImageSprite(passageID);
                            if (!ui || !(ui instanceof GUI_BASE))
                                continue;
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcUIMoveFrameUpdate, thisPtr, [ui].concat(p.args), p.sign);
                        }
                        // 移动界面元件时需要记录下
                        else if (p.sign.indexOf("gcUICompMove") != -1) {
                            var ui = GameImageLayer.getImageSprite(passageID);
                            if (!ui || !(ui instanceof GUI_BASE))
                                continue;
                            var m = p.args[0];
                            var uiComps = GameUI.getAllCompChildren(ui, true);
                            for (var k = 0; k < m.attrInfos.length; k++) {
                                var attrInfo = m.attrInfos[k];
                                attrInfo.uiComp = uiComps.keyValue[attrInfo.uiCompID];
                                // 如果不存在组件的情况则无视该移动（可能新版本已无该组件）
                                if (!attrInfo.uiComp) {
                                    m.attrInfos.splice(k, 1);
                                    k--;
                                }
                            }
                            GameImageLayer.regPassageFrameUpdate(passageID, CommandExecute.gcUICompMoveFrameUpdate, thisPtr, [ui].concat(p.args), p.sign);
                        }
                    }
                }
            }
            // 图像层材质
            installMaterialData(Game.layer.imageLayer, o.imageLayerMaterialData);
            // 界面层的材质
            if (o.uiLayerMaterialData)
                installMaterialData(Game.layer.uiLayer, o.uiLayerMaterialData);
            // 储存全画面的材质
            if (o.screenMaterialData)
                installMaterialData(Game.layer, o.screenMaterialData);
            // 储存场景的材质
            if (o.sceneLayerMaterialData)
                installMaterialData(Game.layer.sceneLayer, o.sceneLayerMaterialData);
        }, {}, null));
    }
    //------------------------------------------------------------------------------------------------------
    // 预加载和卸载
    //------------------------------------------------------------------------------------------------------
    // 使用资源的自定义指令编号
    var PLUGIN_COMMAND_SHOWPICTURE = 3001;
    var PLUGIN_COMMAND_SHOWANIMATION = 3004;
    var PLUGIN_COMMAND_SHOWSTANDAVATAR = 3006;
    var PLUGIN_COMMAND_SHOWUI = 3010;
    // 缓存
    var preloadCommandPageInfo = {};
    // 重写预加载事件页
    var oldPreLoadCommandPage = AssetManager.preLoadCommandPage;
    AssetManager.preLoadCommandPage = function (commandPage, complete, syncCallbackWhenAssetExist, autoDispose) {
        if (complete === void 0) { complete = null; }
        if (syncCallbackWhenAssetExist === void 0) { syncCallbackWhenAssetExist = false; }
        if (autoDispose === void 0) { autoDispose = false; }
        // 资源获取
        var imageArr = [];
        var aniArr = [];
        var standAvatarArr = [];
        var uiArr = [];
        // 记录
        preloadCommandPageInfo[commandPage.id] = {
            imageArr: imageArr,
            aniArr: aniArr,
            standAvatarArr: standAvatarArr,
            uiArr: uiArr
        };
        for (var i = 0; i < commandPage.commands.length; i++) {
            var cmd = commandPage.commands[i];
            if (cmd.customID == PLUGIN_COMMAND_SHOWPICTURE) {
                var cp = cmd.params[0];
                if (!cp.imageUseVar) {
                    imageArr.push(cp.image);
                }
            }
            else if (cmd.customID == PLUGIN_COMMAND_SHOWANIMATION) {
                var cp2 = cmd.params[0];
                if (!cp2.objectUseVar) {
                    aniArr.push(cp2.animation);
                }
            }
            else if (cmd.customID == PLUGIN_COMMAND_SHOWSTANDAVATAR) {
                var cp3 = cmd.params[0];
                if (!cp3.objectUseVar) {
                    standAvatarArr.push(cp3.standAvatar);
                }
            }
            else if (cmd.customID == PLUGIN_COMMAND_SHOWUI) {
                var cp4 = cmd.params[0];
                if (!cp4.objectUseVar) {
                    uiArr.push(cp4.uiID);
                }
            }
        }
        // 记录旧的参数
        var oldArgs = arguments;
        // 需要加载的
        var totalCount = 1 + aniArr.length + standAvatarArr.length + uiArr.length;
        var currentLoad = 0;
        function onLoadOver() {
            currentLoad++;
            if (totalCount == currentLoad) {
                oldPreLoadCommandPage.apply(this, oldArgs);
            }
        }
        var onLoadOverCB = Callback.New(onLoadOver, this);
        AssetManager.loadImages(imageArr, onLoadOverCB, true, true, true);
        for (var i = 0; i < aniArr.length; i++) {
            AssetManager.preLoadAnimationAsset(aniArr[i], onLoadOverCB, true, false, true);
        }
        for (var i = 0; i < standAvatarArr.length; i++) {
            AssetManager.preLoadStandAvatarAsset(standAvatarArr[i], onLoadOverCB, true, false, true);
        }
        for (var i = 0; i < uiArr.length; i++) {
            AssetManager.preLoadUIAsset(uiArr[i], onLoadOverCB, true, false, true);
        }
    };
    // 重写卸载事件页
    var oldDisposeCommandPage = AssetManager.disposeCommandPage;
    AssetManager.disposeCommandPage = function (commandPage) {
        var cache = preloadCommandPageInfo[commandPage.id];
        if (cache) {
            var imageCache = cache.imageArr, uiCache = cache.uiArr, animationCache = cache.aniArr, standAvatarCache = cache.standAvatarArr;
            AssetManager.disposeImages(imageCache);
            for (var s = 0; s < uiCache.length; s++)
                AssetManager.disposeUIAsset(uiCache[s]);
            for (var s = 0; s < animationCache.length; s++)
                AssetManager.disposeAnimationAsset(animationCache[s]);
            for (var s = 0; s < standAvatarCache.length; s++)
                AssetManager.disposeStandAvatarAsset(standAvatarCache[s]);
            delete preloadCommandPageInfo[commandPage.id];
        }
        oldDisposeCommandPage.apply(this, arguments);
    };
    //------------------------------------------------------------------------------------------------------
    // 材质
    //------------------------------------------------------------------------------------------------------
    function refreshCompMaterialsTrans(newValue, oldValue, per, nonTweenType, curTime) {
        var materials = ObjectUtils.depthClone(newValue);
        //材质组
        for (var i = 0; i < materials.length; i++) {
            var pass1 = materials[i];
            var pass2 = oldValue[i];
            if (!pass1 || !pass1.materials || !pass2 || !pass2.materials)
                continue;
            //对比材质
            for (var m = 0; m < pass1.materials.length; m++) {
                var material1 = pass1.materials[m];
                var material2 = pass2.materials[m];
                //存在相同材质才会过渡
                if (material2 && material1.id == material2.id) {
                    for (var key in material1) {
                        //id和过渡信息除外
                        if (key == "id" || key == "____timeInfo")
                            continue;
                        var materialValue1 = material1[key];
                        var materialValue2 = material2[key];
                        //只支持number类型的数据过渡
                        if (typeof materialValue1 == "number" && typeof materialValue2 == "number") {
                            material1[key] = (materialValue1 - materialValue2) * per + materialValue2;
                        }
                        else {
                            // 无法渐变过渡的属性处理方式：在第一帧时变动/在最后一帧变动
                            if ((nonTweenType == 0 && curTime != 1) || (nonTweenType == 1 && per != 1)) {
                                material1[key] = materialValue2;
                            }
                        }
                    }
                }
            }
        }
        return materials;
    }
    //@ts-ignore
    function refreshCompMaterials(attValue, uiComp) {
        //增删材质组
        if (attValue.length != uiComp.materialData.length) {
            uiComp.materialData = attValue;
            uiComp.installMaterialData(uiComp.materialData);
            return;
        }
        for (var i = 0; i < attValue.length; i++) {
            var pass1 = attValue[i];
            var pass2 = uiComp.materialData[i];
            if (!pass1 || !pass1.materials || !pass2 || !pass2.materials)
                continue;
            //增删材质
            if (pass1.materials.length != pass2.materials.length) {
                uiComp.materialData = attValue;
                uiComp.installMaterialData(uiComp.materialData);
                return;
            }
            for (var j = 0; j < pass1.materials.length; j++) {
                var material1 = pass1.materials[j];
                var material2 = pass2.materials[j];
                //替换材质
                if (material1.id != material2.id) {
                    uiComp.materialData = attValue;
                    uiComp.installMaterialData(uiComp.materialData);
                    return;
                }
                var materialValues = {};
                for (var key in material1) {
                    //id和过渡信息除外
                    if (key == "id" || key == "____timeInfo")
                        continue;
                    var materialValue1 = material1[key];
                    var materialValue2 = material2[key];
                    if (materialValue1 != materialValue2) {
                        //材质只支持fast设置number类型的数据
                        if (typeof materialValue1 == "number" && typeof materialValue1 == "number") {
                            materialValues["mu".concat(material1.id, "_").concat(key)] = materialValue1;
                        }
                        else {
                            uiComp.materialData = attValue;
                            uiComp.installMaterialData(uiComp.materialData);
                            return;
                        }
                    }
                }
                //设置材质效果
                uiComp.setMaterialValueFast(materialValues, j);
            }
        }
        //
        uiComp.materialData = attValue;
    }
    CommandExecute.refreshCompMaterials = refreshCompMaterials;
})(CommandExecute || (CommandExecute = {}));
/**
 * 自定义条件分歧
 * Created by 黑暗之神KDS on 2020-09-16 19:47:24.
 */
var CustomCondition;
(function (CustomCondition) {
    /**
     * 场景对象
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean]
     */
    function f1(trigger, p) {
        // 获取场景对象
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.soIndex, p.useVar, p.soIndexVarID, trigger);
        if (!so)
            return;
        // 非自定义属性的话如果不是1号原型则忽略掉其他项属性
        if (p.type != 13 && !(so instanceof ProjectClientSceneObject))
            return false;
        // 类别
        if (p.type == 0)
            return so.inScene;
        if (p.type == 1)
            return so.fixOri;
        if (p.type == 2)
            return so.selectEnabled;
        if (p.type == 3)
            return so.bridge;
        if (p.type == 4)
            return so.through;
        if (p.type == 5)
            return so.moveAutoChangeAction;
        if (p.type == 6)
            return so.ignoreCantMove;
        if (p.type == 7)
            return so.autoPlayEnable;
        if (p.type == 8)
            return so.isMoving;
        if (p.type == 9)
            return so.isJumping;
        if (p.type == 10)
            return so.repeatedTouchEnabled;
        if (p.type == 11)
            return so.onlyPlayerTouch;
        if (p.type == 12)
            return so.waitTouchEvent;
        if (p.type == 13) {
            //获取设置的名称
            var varName = void 0;
            if (p.soCustomAttr.selectMode == 1) {
                var mode = p.soCustomAttr.inputModeInfo.mode;
                var constName = p.soCustomAttr.inputModeInfo.constName;
                var varNameIndex = p.soCustomAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soCustomAttr.varName;
            }
            //指定界面
            if (p.soCustomAttr.compAttrEnable) {
                // 获取界面
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return false;
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.soCustomAttr.compInfo.compID];
                if (!comp)
                    return false;
                return comp[p.soCustomAttr.compInfo.varName] ? true : false;
            }
            else {
                return so[varName] ? true : false;
            }
        }
        if (p.type == 14) {
            var soModuleID = p.soModuleType == 1 ? p.soModuleID : p.soModuleAttr.moduleID;
            var soModule = so.getModule(soModuleID);
            if (!soModule)
                return false;
            if (p.soModuleType == 1) {
                return true;
            }
            //获取设置的名称
            var varName = void 0;
            if (p.soModuleAttr.selectMode == 1) {
                var mode = p.soModuleAttr.inputModeInfo.mode;
                var constName = p.soModuleAttr.inputModeInfo.constName;
                var varNameIndex = p.soModuleAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soModuleAttr.varName;
            }
            //指定界面
            if (p.soModuleAttr.compAttrEnable) {
                // 获取界面
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return false;
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return false;
                return comp[p.soModuleAttr.compInfo.varName] ? true : false;
            }
            else {
                return soModule[varName] ? true : false;
            }
        }
    }
    CustomCondition.f1 = f1;
    /**
     * 界面
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean]
     */
    function f2(trigger, p) {
        // 获取界面
        var uiID;
        if (p.checkType == 0) {
            if (p.useVarID) {
                uiID = Game.player.variable.getVariable(p.uiIDVarID);
            }
            else {
                uiID = p.uiID;
            }
        }
        else {
            uiID = p.uiComp.uiID;
        }
        // 界面ID
        var ui = GameUI.get(uiID);
        if (!ui) {
            if (p.checkType == 0 && p.type == 3)
                return true;
            return false;
        }
        if (p.checkType == 1) {
            // 根据组件唯一ID找到该组件
            var comp = ui.compsIDInfo[p.uiComp.compID];
            if (!comp)
                return false;
            var value = comp[p.uiComp.varName];
            return value ? true : false;
        }
        if (p.type == 0)
            return true;
        if (p.type == 1)
            return false;
        if (p.type == 2)
            return ui.stage ? true : false;
        if (p.type == 3)
            return ui.stage ? false : true;
        if (p.type == 4) {
            var topLayer = Game.layer.uiLayer.numChildren - 1;
            var topUI = Game.layer.uiLayer.getChildAt(topLayer);
            if (!topUI)
                return false;
            // 虚拟键盘的情况下
            if (topUI == GameUI.get(12)) {
                if (topLayer >= 1)
                    return Game.layer.uiLayer.getChildAt(topLayer - 1) == ui;
                else
                    return false;
            }
            else {
                return topUI == ui;
            }
        }
    }
    CustomCondition.f2 = f2;
    /**
     * 系统信息
     */
    function f3(trigger, p) {
        if (p.type == 0)
            return !WorldData.menuEnabled || GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START || Controller.isPlayerTriggerEvent;
        if (p.type == 1)
            return !Controller.inSceneEnabled;
        if (p.type == 2)
            return Game.pause;
        if (p.type == 3)
            return GameDialog.isInDialog;
        if (p.type == 4)
            return WorldData[p.worldAttrName] ? true : false;
        if (p.type == 5)
            return Browser.onMobile;
        if (p.type == 6)
            return os.platform == 3 || os.platform == 0;
        if (p.type == 7) {
            var systemKeyName = GUI_Setting.SYSTEM_KEYS[p.systemKey];
            var systemKeyboardInfo = GUI_Setting.KEY_BOARD[systemKeyName];
            for (var i = 0; i < ProjectUtils.keyboardEvents.length; i++) {
                if (systemKeyboardInfo.keys.indexOf(ProjectUtils.keyboardEvents[i].keyCode) != -1)
                    return true;
            }
            return false;
        }
    }
    CustomCondition.f3 = f3;
    /**
     * 自定义模块 - 布尔值属性
     */
    function f4(trigger, p) {
        var moduleID = p.modelData.moduleID;
        var dataID;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        var moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData)
            return false;
        //获取设置的名称
        var varName;
        if (p.modelData.selectMode == 1) {
            var mode = p.modelData.inputModeInfo.mode;
            var constName = p.modelData.inputModeInfo.constName;
            var varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined)
            return false;
        return !!moduleData[varName];
    }
    CustomCondition.f4 = f4;
    /**
     * 世界属性 - 布尔值属性
     */
    function f5(trigger, p) {
        //获取设置的名称
        var varName;
        if (p.worldData.selectMode == 1) {
            var mode = p.worldData.inputModeInfo.mode;
            var constName = p.worldData.inputModeInfo.constName;
            var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.worldData.varName;
        }
        if (WorldData[varName] == undefined)
            return false;
        return !!WorldData[varName];
    }
    CustomCondition.f5 = f5;
    /**
     * 玩家属性 - 布尔值属性
     */
    function f6(trigger, p) {
        //获取设置的名称
        var varName;
        if (p.playerData.selectMode == 1) {
            var mode = p.playerData.inputModeInfo.mode;
            var constName = p.playerData.inputModeInfo.constName;
            var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.playerData.varName;
        }
        if (Game.player.data[varName] == undefined)
            return false;
        return !!Game.player.data[varName];
    }
    CustomCondition.f6 = f6;
})(CustomCondition || (CustomCondition = {}));
/**
 * 自定义游戏数值
 * Created by 黑暗之神KDS on 2020-09-16 19:47:24.
 */
var CustomGameNumber;
(function (CustomGameNumber) {
    /**
     * 场景数值获取
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f1(trigger, p) {
        // 没有场景的情况下返回0，比如切换场景中的情况
        if (!Game.currentScene)
            return 0;
        var scene = Game.currentScene;
        if (p.type == 0)
            return scene.id;
        if (p.type == 1)
            return p.isGrid ? scene.gridWidth : scene.width;
        if (p.type == 2)
            return p.isGrid ? scene.gridHeight : scene.height;
        if (p.type == 3)
            return scene.sceneObjects.length - 1;
        if (p.type == 4) {
            var xGrid = p.dataGridUseVar ? Game.player.variable.getVariable(p.x2) : p.x;
            var yGrid = p.dataGridUseVar ? Game.player.variable.getVariable(p.y2) : p.y;
            if (p.dataGridIndex == 0) {
                ProjectUtils.pointHelper.x = xGrid;
                ProjectUtils.pointHelper.y = yGrid;
                var soc = ProjectClientScene.getSceneObjectBySetting(p.dataLayerSoType, p.dataLayerSoIndex, p.dataLayerSoUseVar, p.dataLayerSoVarID, trigger);
                return p.dynamicObs ? (scene.sceneUtils.isObstacleGrid(ProjectUtils.pointHelper, soc) ? 1 : 0) : (scene.sceneUtils.isFixedObstacleGrid(ProjectUtils.pointHelper) ? 1 : 0);
            }
            else {
                return scene.getDataGridState(p.dataGridIndex, xGrid, yGrid);
            }
        }
        if (p.type == 5) {
            if (p.cameraAttr == 0)
                return scene.camera.viewPort.x;
            if (p.cameraAttr == 1)
                return scene.camera.viewPort.y;
            if (p.cameraAttr == 2)
                return scene.camera.scaleX;
            if (p.cameraAttr == 3)
                return scene.camera.scaleY;
            if (p.cameraAttr == 4)
                return scene.camera.rotation;
        }
    }
    CustomGameNumber.f1 = f1;
    /**
     * 场景对象数值
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f2(trigger, p) {
        // 没有场景的情况下返回0，比如切换场景中的情况
        if (!Game.currentScene)
            return 0;
        // 获取对象
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.varID, trigger);
        if (!(so instanceof ProjectClientSceneObject) && p.type != 13)
            return 0;
        // 属性
        if (p.type == 0)
            return so.index;
        if (p.type == 1)
            return so.modelID;
        if (p.type == 2) {
            if (p.posMode == 0) {
                return so.x;
            }
            else if (p.posMode == 1) {
                return Math.floor(so.x / Config.SCENE_GRID_SIZE);
            }
            else {
                return Game.currentScene.getGlobalPos(so.x, so.y).x;
            }
        }
        if (p.type == 3) {
            if (p.posMode == 0) {
                return so.y;
            }
            else if (p.posMode == 1) {
                return Math.floor(so.y / Config.SCENE_GRID_SIZE);
            }
            else {
                return Game.currentScene.getGlobalPos(so.x, so.y).y;
            }
        }
        if (p.type == 4)
            return so.avatar.id;
        if (p.type == 5)
            return so.scale;
        if (p.type == 6)
            return so.avatarAlpha;
        if (p.type == 7)
            return so.avatarHue;
        if (p.type == 8)
            return so.avatarFPS;
        if (p.type == 9)
            return so.moveSpeed;
        if (p.type == 10)
            return so.avatar.orientation;
        if (p.type == 11)
            return so.avatar.actionID;
        if (p.type == 12)
            return so.avatar.currentFrame;
        if (p.type == 13) {
            //获取设置的名称
            var varName = void 0;
            if (p.customAttr.selectMode == 1) {
                var mode = p.customAttr.inputModeInfo.mode;
                var constName = p.customAttr.inputModeInfo.constName;
                var varNameIndex = p.customAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.customAttr.varName;
            }
            if (so[varName] == undefined)
                return 0;
            //@ts-ignore
            if (p.customAttr.isCustomModule)
                return so[varName].id;
            //指定界面
            if (p.customAttr.compAttrEnable) {
                // 获取界面
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return 0;
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.customAttr.compInfo.compID];
                if (!comp)
                    return 0;
                return MathUtils.float(comp[p.customAttr.compInfo.varName]);
            }
            else {
                return MathUtils.float(so[varName]);
            }
        }
        if (p.type == 14) {
            var soModule = so.getModule(p.soModuleAttr.moduleID);
            if (!soModule)
                return 0;
            //获取设置的名称
            var varName = void 0;
            if (p.soModuleAttr.selectMode == 1) {
                var mode = p.soModuleAttr.inputModeInfo.mode;
                var constName = p.soModuleAttr.inputModeInfo.constName;
                var varNameIndex = p.soModuleAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soModuleAttr.varName;
            }
            if (soModule[varName] == undefined)
                return 0;
            //@ts-ignore
            if (p.soModuleAttr.isCustomModule)
                return soModule[varName].id;
            //指定界面
            if (p.soModuleAttr.compAttrEnable) {
                // 获取界面
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return 0;
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return 0;
                return MathUtils.float(comp[p.soModuleAttr.compInfo.varName]);
            }
            else {
                if (soModule[varName] instanceof GCAnimation)
                    return soModule[varName].id;
                else if (soModule[varName] instanceof UIBase)
                    return soModule[varName].guiID;
                else
                    return MathUtils.float(soModule[varName]);
            }
        }
    }
    CustomGameNumber.f2 = f2;
    /**
     * 场景对象关系
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f3(trigger, p) {
        // 没有场景的情况下返回0，比如切换场景中的情况
        if (!Game.currentScene)
            return 0;
        // 获取对象
        var so1 = ProjectClientScene.getSceneObjectBySetting(p.soType1, p.no1, p.useVar1, p.varID1, trigger);
        if (!so1)
            return 0;
        var so2 = ProjectClientScene.getSceneObjectBySetting(p.soType2, p.no2, p.useVar2, p.varID2, trigger);
        if (!so2)
            return 0;
        // 比较属性
        if (p.type == 0)
            return GameUtils.getOriByAngle(MathUtils.direction360(so1.x, so1.y, so2.x, so2.y));
        if (p.type == 1) {
            var dis = Point.distance2(so1.x, so1.y, so2.x, so2.y);
            return p.isGrid ? Math.floor(dis / Config.SCENE_GRID_SIZE) : dis;
        }
        if (p.type == 2)
            return p.isGrid ? Math.floor((so2.x - so1.x) / Config.SCENE_GRID_SIZE) : so2.x - so1.x;
        if (p.type == 3)
            return p.isGrid ? Math.floor((so2.y - so1.y) / Config.SCENE_GRID_SIZE) : so2.y - so1.y;
        if (p.type == 4)
            return MathUtils.direction360(so1.x, so1.y, so2.x, so2.y);
    }
    CustomGameNumber.f3 = f3;
    /**
     * 玩家
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f4(trigger, p) {
        if (p.type == 0)
            return Game.player.data.gold;
        if (p.type == 1) {
            var itemDS = ProjectPlayer.getItemDS(p.itemID);
            return itemDS ? itemDS.number : 0;
        }
        if (p.type == 2) {
            //获取设置的名称
            var varName = void 0;
            if (p.playerData.selectMode == 1) {
                var mode = p.playerData.inputModeInfo.mode;
                var constName = p.playerData.inputModeInfo.constName;
                var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.playerData.varName;
            }
            if (Game.player.data[varName] == undefined)
                return 0;
            //@ts-ignore
            if (p.playerData.isCustomModule)
                return Game.player.data[varName].id;
            return MathUtils.float(Game.player.data[varName]);
        }
    }
    CustomGameNumber.f4 = f4;
    /**
     * 界面
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f5(trigger, p) {
        // 界面按钮焦点数
        if (p.type == 2) {
            if (!FocusButtonsManager.focus)
                return -1;
            return FocusButtonsManager.focus.selectedIndex;
        }
        // 获取界面
        var uiID;
        if (p.useVarID) {
            uiID = Game.player.variable.getVariable(p.uiIDVarID);
        }
        else {
            uiID = p.type == 1 ? p.uiComp.uiID : p.uiID;
        }
        // 界面ID
        var ui = GameUI.get(uiID);
        if (!ui)
            return 0;
        // 界面本体属性
        if (p.type == 0) {
            return MathUtils.float(ui[p.uiAttrName]);
        }
        // 界面内组件的属性
        else if (p.type == 1) {
            // 根据组件唯一ID找到该组件
            var comp = ui.compsIDInfo[p.uiComp.compID];
            if (!comp)
                return 0;
            return MathUtils.float(comp[p.uiComp.varName]);
        }
    }
    CustomGameNumber.f5 = f5;
    /**
     * 鼠标
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f6(trigger, p) {
        if (p.type == 0)
            return stage.mouseX;
        else if (p.type == 1)
            return stage.mouseY;
        else if (p.type == 2) {
            var gridX = Game.currentScene ? (p.isGrid ? Math.floor(Game.currentScene.localX / Config.SCENE_GRID_SIZE) : Game.currentScene.localX) : 0;
            var res = Math.min(Math.max(gridX, 0), (p.isGrid ? Game.currentScene.gridWidth : Game.currentScene.width) - 1);
            return res;
        }
        else if (p.type == 3) {
            var gridY = Game.currentScene ? (p.isGrid ? Math.floor(Game.currentScene.localY / Config.SCENE_GRID_SIZE) : Game.currentScene.localY) : 0;
            var res = Math.min(Math.max(gridY, 0), (p.isGrid ? Game.currentScene.gridHeight : Game.currentScene.height) - 1);
            return res;
        }
        else if (p.type == 4)
            return MouseControl.selectSceneObject && MouseControl.selectSceneObject.inScene ? MouseControl.selectSceneObject.index : -1;
        else if (p.type == 5)
            return ProjectUtils.mouseWhileValue;
        else if (p.type == 6)
            return p.pointKeyboard;
        else if (p.type == 7)
            return ProjectUtils.keyboardEvents.length > 0 ? ProjectUtils.keyboardEvents[ProjectUtils.keyboardEvents.length - 1].keyCode : -1;
        else if (p.type == 8) {
            var keyCode = ProjectUtils.keyboardEvents.length > 0 ? ProjectUtils.keyboardEvents[ProjectUtils.keyboardEvents.length - 1].keyCode : -1;
            if (keyCode == -1)
                return -1;
            var resultI = -1;
            var min = Number.MAX_VALUE;
            for (var i = 0; i < GUI_Setting.SYSTEM_KEYS.length; i++) {
                var keys = GUI_Setting.KEY_BOARD[GUI_Setting.SYSTEM_KEYS[i]].keys;
                if (keys) {
                    var idx = keys.indexOf(keyCode);
                    if (idx != -1 && idx < min) {
                        resultI = i;
                        min = idx;
                    }
                }
            }
            return resultI;
        }
    }
    CustomGameNumber.f6 = f6;
    /**
     * 模块 - 数值属性
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f7(trigger, p) {
        var moduleID = p.modelData.moduleID;
        var dataID;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        var moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData)
            return 0;
        //获取设置的名称
        var varName;
        if (p.modelData.selectMode == 1) {
            var mode = p.modelData.inputModeInfo.mode;
            var constName = p.modelData.inputModeInfo.constName;
            var varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined)
            return 0;
        //@ts-ignore
        if (p.modelData.isCustomModule)
            return moduleData[varName].id;
        return MathUtils.float(moduleData[varName]);
    }
    CustomGameNumber.f7 = f7;
    /**
     * 世界 - 数值属性
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f8(trigger, p) {
        if (p.type == 0) {
            if (p.presetType == 0)
                return GameAudio.bgmVolume * 100;
            if (p.presetType == 1)
                return GameAudio.bgsVolume * 100;
            if (p.presetType == 2)
                return GameAudio.seVolume * 100;
            if (p.presetType == 3)
                return GameAudio.tsVolume * 100;
        }
        else {
            //获取设置的名称
            var varName = void 0;
            if (p.worldData.selectMode == 1) {
                var mode = p.worldData.inputModeInfo.mode;
                var constName = p.worldData.inputModeInfo.constName;
                var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.worldData.varName;
            }
            if (WorldData[varName] == undefined)
                return 0;
            //@ts-ignore
            if (p.worldData.isCustomModule)
                return WorldData[varName].id;
            return MathUtils.float(WorldData[varName]);
        }
    }
    CustomGameNumber.f8 = f8;
    /**
     * 其他
     */
    function f9(trigger, p) {
        switch (p.normalNumber) {
            case 0:
                return !ProjectGame.gameStartTime ? 0 : (Date.now() - ProjectGame.gameStartTime.getTime());
            case 1:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 1000));
            case 2:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 60000));
            case 3:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 3600000));
            case 4:
                return !ProjectGame.gameStartTime ? 0 : (Math.floor((Date.now() - ProjectGame.gameStartTime.getTime()) / 86400000));
            case 5:
                return new Date().getSeconds();
            case 6:
                return new Date().getMinutes();
            case 7:
                return new Date().getHours();
            case 8:
                return new Date().getDay();
            case 9:
                return new Date().getDate();
            case 10:
                return new Date().getMonth() + 1;
            case 11:
                return new Date().getFullYear();
            case 12:
                return GUI_SaveFileManager.currentSveFileIndexInfo ? GUI_SaveFileManager.currentSveFileIndexInfo.id : 0;
            case 13:
                return MathUtils.float(trigger.inputMessage[0]);
            case 14:
                return MathUtils.float(trigger.inputMessage[1]);
            case 15:
                return MathUtils.float(trigger.inputMessage[2]);
            case 16:
                return MathUtils.float(trigger.inputMessage[3]);
            case 17:
                return MathUtils.float(trigger.inputMessage[4]);
            case 18:
                return __fCount;
            case 19:
                return CommandExecute.countDownNowTime;
        }
    }
    CustomGameNumber.f9 = f9;
})(CustomGameNumber || (CustomGameNumber = {}));
/**
 * Created by 黑暗之神KDS on 2021-03-11 10:24:08.
 */
var CustomGameString;
(function (CustomGameString) {
    /**
     * 场景
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f1(trigger, p) {
        switch (p.type) {
            case 0:
                return Game.currentScene ? Game.currentScene.name : "";
        }
        return "";
    }
    CustomGameString.f1 = f1;
    /**
     * 场景对象
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f2(trigger, p) {
        // 没有场景的情况下返回0，比如切换场景中的情况
        if (!Game.currentScene)
            return "";
        // 获取对象
        var so = ProjectClientScene.getSceneObjectBySetting(p.soType, p.no, p.useVar, p.varID, trigger);
        if (!(so instanceof ProjectClientSceneObject) && p.type != 1)
            return "";
        // 属性
        if (p.type == 0)
            return so.name;
        if (p.type == 1) {
            //获取设置的名称
            var varName = void 0;
            if (p.customAttr.selectMode == 1) {
                var mode = p.customAttr.inputModeInfo.mode;
                var constName = p.customAttr.inputModeInfo.constName;
                var varNameIndex = p.customAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.customAttr.varName;
            }
            if (so[varName] == undefined || so[varName] == null)
                return "";
            //指定界面
            if (p.customAttr.compAttrEnable) {
                // 获取界面
                var ui = so[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return "";
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.customAttr.compInfo.compID];
                if (!comp)
                    return "";
                return comp[p.customAttr.compInfo.varName].toString();
            }
            else {
                return so[varName].toString();
            }
        }
        if (p.type == 2) {
            var soModule = so.getModule(p.soModuleAttr.moduleID);
            if (!soModule)
                return "";
            //获取设置的名称
            var varName = void 0;
            if (p.soModuleAttr.selectMode == 1) {
                var mode = p.soModuleAttr.inputModeInfo.mode;
                var constName = p.soModuleAttr.inputModeInfo.constName;
                var varNameIndex = p.soModuleAttr.inputModeInfo.varNameIndex;
                varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
            }
            else {
                varName = p.soModuleAttr.varName;
            }
            if (soModule[varName] == undefined || soModule[varName] == null)
                return "";
            //指定界面
            if (p.soModuleAttr.compAttrEnable) {
                // 获取界面
                var ui = soModule[varName];
                if (!ui || !(ui instanceof GUI_BASE))
                    return "";
                // 根据组件唯一ID找到该组件
                var comp = ui.compsIDInfo[p.soModuleAttr.compInfo.compID];
                if (!comp)
                    return "";
                return comp[p.soModuleAttr.compInfo.varName].toString();
            }
            else {
                return soModule[varName].toString();
            }
        }
    }
    CustomGameString.f2 = f2;
    /**
     * 玩家
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f3(trigger, p) {
        //获取设置的名称
        var varName;
        if (p.playerData.selectMode == 1) {
            var mode = p.playerData.inputModeInfo.mode;
            var constName = p.playerData.inputModeInfo.constName;
            var varNameIndex = p.playerData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.playerData.varName;
        }
        if (Game.player.data[varName] == undefined)
            return "";
        return Game.player.data[varName];
    }
    CustomGameString.f3 = f3;
    /**
     * 界面
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f4(trigger, p) {
        // 获取界面
        var uiID = p.uiComp.uiID;
        // 界面ID
        var ui = GameUI.get(uiID);
        if (!ui)
            return "";
        // 根据组件唯一ID找到该组件
        var comp = ui.compsIDInfo[p.uiComp.compID];
        if (!comp)
            return "";
        var value = comp[p.uiComp.varName];
        return value == null ? "" : value.toString();
    }
    CustomGameString.f4 = f4;
    /**
     * 模块 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f5(trigger, p) {
        var moduleID = p.modelData.moduleID;
        var dataID;
        if (p.modelData.dataIsUseVar) {
            dataID = Game.player.variable.getVariable(p.modelData.dataVarID);
        }
        else {
            dataID = p.modelData.dataID;
        }
        var moduleData = GameData.getModuleData(moduleID, dataID);
        if (!moduleData)
            return "";
        //获取设置的名称
        var varName;
        if (p.modelData.selectMode == 1) {
            var mode = p.modelData.inputModeInfo.mode;
            var constName = p.modelData.inputModeInfo.constName;
            var varNameIndex = p.modelData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.modelData.varName;
        }
        if (moduleData[varName] == undefined || moduleData[varName] == null)
            return "";
        return moduleData[varName].toString();
    }
    CustomGameString.f5 = f5;
    /**
     * 世界 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f6(trigger, p) {
        //获取设置的名称
        var varName;
        if (p.worldData.selectMode == 1) {
            var mode = p.worldData.inputModeInfo.mode;
            var constName = p.worldData.inputModeInfo.constName;
            var varNameIndex = p.worldData.inputModeInfo.varNameIndex;
            varName = mode == 0 ? constName : Game.player.variable.getString(varNameIndex);
        }
        else {
            varName = p.worldData.varName;
        }
        if (WorldData[varName] == undefined || WorldData[varName] == null)
            return "";
        return WorldData[varName].toString();
    }
    CustomGameString.f6 = f6;
    /**
     * 系统
     */
    function f7(trigger, p) {
        switch (p.type) {
            case 0:
                return GUI_Setting.getSystemKeyDesc(GUI_Setting.SYSTEM_KEYS[p.systemKeys]);
            case 1:
                return "".concat(GameAudio.lastBgmURL, ",").concat(GameAudio.lastBGMVolume, ",").concat(GameAudio.lastBGMPitch);
            case 2:
                return "".concat(GameAudio.lastBgsURL, ",").concat(GameAudio.lastBGSVolume, ",").concat(GameAudio.lastBGSPitch);
            case 3:
                return ProjectUtils.timerFormat(Game.gameTime);
        }
    }
    CustomGameString.f7 = f7;
})(CustomGameString || (CustomGameString = {}));
/**
 * 游戏总控制器
 * -- 管理其他控制器
 * -- 场景对象的操作
 * -- 场景对象相关事件触发
 * -- 进入场景事件完毕后才会开启控制器
 *
 * Created by 黑暗之神KDS on 2018-10-07 16:18:25.
 */
var Controller = /** @class */ (function () {
    function Controller() {
    }
    /**
     * 启动控制器
     */
    Controller.start = function () {
        // 调用一次清理
        this.stop();
        // 控制器启动状态
        Controller.ctrlStart = true;
        // 监听场景对象点击事件和场景进入事件的执行，以便禁止玩家控制
        this.startEvent();
        // 鼠标控制器启动
        MouseControl.start();
        // 键盘控制器启动
        KeyboardControl.start();
        // 手柄控制器启动
        GamepadControl.start();
        // 其他初始化
        Controller.waitTouchEventStart = false;
        Controller.needWaitTouchExcuteCount = 0;
        // 派发事件
        EventUtils.happen(Controller, Controller.EVENT_CONTROLLER_START);
    };
    /**
     * 停止控制
     */
    Controller.stop = function () {
        // 控制器关闭状态
        Controller.ctrlStart = false;
        // 取消监听相关事件
        this.clearEvent();
        // 鼠标控制器关闭
        MouseControl.stop();
        // 键盘控制器关闭
        KeyboardControl.stop();
        // 手柄控制器关闭
        GamepadControl.stop();
    };
    Object.defineProperty(Controller, "inSceneEnabled", {
        //------------------------------------------------------------------------------------------------------
        // 控制器是否有效
        //------------------------------------------------------------------------------------------------------
        /**
         * 在场景中是否可控制
         */
        get: function () {
            // 暂停、禁用操作、控制关闭时无法控制
            if (Game.pause || !WorldData.playCtrlEnabled || !Controller.ctrlStart)
                return false;
            // 检测是否未满足全部可控状态，未满足则无法控制
            for (var i in Controller.enabledMapping) {
                if (!Controller.enabledMapping[i])
                    return false;
            }
            if (Controller.needWaitTouchExcuteCount > 0)
                return false;
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller, "isPlayerTriggerEvent", {
        /**
         * 是否玩家触发事件中（点击事件、碰触事件）
         */
        get: function () {
            for (var i in Controller.enabledMapping) {
                if (!Controller.enabledMapping[i])
                    return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 摇杆移动
     * @param dirAngle 角度
     * @param recordAngle [可选] 默认值=true 记录角度，以便拒绝小规模角度偏移导致不断触发移动
     * @param tryTimes [可选] 默认值=-1 尝试次数（当遇到障碍的时候系统会自动尝试更换角度来移动，比如碰到NPC、撞墙等，以便平滑）
     * @param oriAngle [可选] 默认值=null 原始发出的角度
     */
    Controller.startJoy = function (dirAngle, recordAngle, tryTimes, oriAngle) {
        if (recordAngle === void 0) { recordAngle = true; }
        if (tryTimes === void 0) { tryTimes = -1; }
        if (oriAngle === void 0) { oriAngle = null; }
        ProjectUtils.lastControl = 2;
        // 禁止控制的情况
        if (!Controller.ctrlStart || !Controller.inSceneEnabled)
            return;
        // 中心点模式
        if (WorldData.moveToGridCenter) {
            if (!Game.player.sceneObject.isMoving) {
                var dir = GameUtils.getOriByAngle(dirAngle);
                var offset = KeyboardControl.dirOffsetArr[dir];
                var xGrid = Math.floor(Game.player.sceneObject.x / Config.SCENE_GRID_SIZE) + offset[0];
                var yGrid = Math.floor(Game.player.sceneObject.y / Config.SCENE_GRID_SIZE) + offset[1];
                if (!Game.currentScene.sceneUtils.isOutsideByGrid(new Point(xGrid, yGrid))) {
                    KeyboardControl.moveDirectGrid(xGrid, yGrid);
                }
            }
            return;
        }
        // 与上一个角度比较接近的情况则忽略掉
        if (recordAngle) {
            var nearAngle = 5;
            if (this.lastJoyAngle != null) {
                if (MathUtils.inAngleRange(0 - nearAngle, 0 + nearAngle, dirAngle) && MathUtils.inAngleRange(0 - nearAngle, 0 + nearAngle, this.lastJoyAngle)) {
                    return;
                }
                else if (Math.abs(dirAngle - this.lastJoyAngle) <= nearAngle * 2) {
                    return;
                }
            }
            this.lastJoyAngle = dirAngle;
        }
        // 给一个趋势开始运动：已知玩家位置，朝向目标的角度，固定给出的半径R，求目标点位置
        var currentX = Game.player.sceneObject.x;
        var currentY = Game.player.sceneObject.y;
        var R = 1000000;
        var radian = dirAngle * Math.PI / 180;
        var targetX = Math.sin(radian) * R + currentX;
        var targetY = -Math.cos(radian) * R + currentY;
        Game.player.sceneObject.off(ProjectClientSceneObject.COLLISION, this, this.onJoyCollision);
        Game.player.sceneObject.on(ProjectClientSceneObject.COLLISION, this, this.onJoyCollision, [dirAngle, tryTimes, oriAngle]);
        var lastX = Game.player.sceneObject.x;
        var lastY = Game.player.sceneObject.y;
        Game.player.sceneObject.startMove([[targetX, targetY]], Game.oneFrame);
        // 未能移动的情况则尝试更换角度进行移动
        if (lastX == Game.player.sceneObject.x && lastY == Game.player.sceneObject.y) {
            Game.player.sceneObject.setTo(lastX, lastY);
            if (oriAngle == null)
                oriAngle = dirAngle;
            if (tryTimes == -1) {
                tryTimes = 2;
            }
            else {
                if (tryTimes <= 0)
                    return;
                tryTimes--;
            }
            dirAngle = this.getCollisionAutoTryAngle(oriAngle, tryTimes);
            this.startJoy(dirAngle % 360, false, tryTimes, oriAngle);
        }
        // 成功移动的情况下，重置，重新正常移动
        else {
            this.lastJoyAngle = dirAngle;
            Game.player.sceneObject.stopMove();
            Game.player.sceneObject.setTo(lastX, lastY);
            Game.player.sceneObject.startMove([[targetX, targetY]]);
        }
    };
    /**
     * 停止摇杆
     */
    Controller.stopJoy = function () {
        this.lastJoyAngle = null;
        // 不是移动至格子中心点的话立即停止移动
        if (!ClientWorld.data.moveToGridCenter) {
            Game.player.sceneObject.stopMove();
        }
        else {
            // 如果已在中心点的话则允许停止
            var pCenter = GameUtils.getGridCenter(Game.player.sceneObject.pos);
            if (Game.player.sceneObject.x == pCenter.x && Game.player.sceneObject.y == pCenter.y) {
                Game.player.sceneObject.stopMove();
            }
        }
        Game.player.sceneObject.off(ProjectClientSceneObject.COLLISION, this, this.onJoyCollision);
    };
    //------------------------------------------------------------------------------------------------------
    // 点击事件：触发者=玩家的对象 执行者=被点击的对象
    // -- 玩家鼠标点击对象时候如果在远处则会移动到对象身边再触发，如果对象也在移动中，此时会进入自动追逐状态，追逐完成则触发
    // -- 玩家通过键位会对当前朝向方向的对象进行触发点击事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始触发场景对象的点击事件
     * @param target 目标对象
     * @param playerFaceToTarget [可选] 默认值=false 是否执行事件时玩家面向对象
     */
    Controller.startSceneObjectClickEvent = function (target, playerFaceToTarget) {
        var _this = this;
        if (playerFaceToTarget === void 0) { playerFaceToTarget = false; }
        // 如果处于暂停阶段的话忽略
        if (Game.pause)
            return;
        if (target) {
            // 不在场景上或处于跳跃中则忽略
            if (!target.inScene || target.scene != Game.currentScene || target.isJumping)
                return;
            // 存在点击事件的话
            if (target.hasCommand[0]) {
                // 执行该事件时需要执行者等待，未能成功等待时说明有其他需要等待的事件正在执行，则忽略该事件
                var bool = target.eventStartWait(Game.player.sceneObject);
                if (!bool)
                    return;
                // 玩家停止移动
                Game.player.sceneObject.stopMove();
                // 面向目标
                if (playerFaceToTarget && !Game.player.sceneObject.fixOri) {
                    var dis = Point.distance2(Game.player.sceneObject.x, Game.player.sceneObject.y, target.x, target.y);
                    var gridDis = Math.floor(dis / Config.SCENE_GRID_SIZE);
                    if (gridDis >= 1)
                        Game.player.sceneObject.addBehavior([[25, 2]], false, Game.player.sceneObject, null, false, 0, true, false, 0, target);
                }
                // 不允许控制：来源-点击事件
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [true]);
                // 调用「点击事件」前的处理
                GameCommand.startCommonCommand(14012, [], Callback.New(function () {
                    // 执行点击事件
                    GameCommand.startSceneObjectCommand(target.index, 0, null, Callback.New(function (target) {
                        target.eventCompleteContinue();
                        // 恢复控制：来源-点击事件
                        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
                    }, _this, [target]), Game.player.sceneObject);
                }, this), Game.player.sceneObject, target);
            }
        }
    };
    /**
     * 移动至目标场景对象附近后出发点击事件
     * @param targetSceneObject 目标场景对象
     */
    Controller.moveToNearTargetSceneObjectAndTriggerClickEvent = function (targetSceneObject) {
        // 无事件则忽略
        if (!targetSceneObject.hasCommand[0])
            return;
        // 清理移动至目标场景对象附近后出发点击事件的命令
        Controller.clearNearTargetSceneObjectAndTriggerClickEvent();
        // 如果已距离1.5个格子以下则直接开始执行
        if (targetSceneObject.clickEventNoDistance || Point.distanceSquare(targetSceneObject.pos, Game.player.sceneObject.pos) <= Math.pow(Config.SCENE_GRID_SIZE * 1.5, 2)) {
            Controller.startSceneObjectClickEvent(targetSceneObject, true);
        }
        // 否则移动至其附近
        else {
            // 监听移动结束后再尝试触发点击事件
            Game.player.sceneObject.once(ProjectClientSceneObject.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent, [targetSceneObject]);
            // 移动至目标对象附近（如果遇到障碍则自动重试）
            Game.player.sceneObject.autoFindRoadMove(targetSceneObject.x, targetSceneObject.y, 1, 0, true, true, true);
            // 如果目标出现了新的移动则清理掉（而非自动重试的话）
            Game.player.sceneObject.on(ProjectClientSceneObject.MOVE_START, Controller, this.clearNearTargetSceneObjectAndTriggerClickEvent);
        }
    };
    /**
     * 清理移动至目标场景对象附近后出发点击事件的命令
     * @param fromAutoRetry [可选] 默认值=false 来自自动重试
     */
    Controller.clearNearTargetSceneObjectAndTriggerClickEvent = function (fromAutoRetry) {
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        if (fromAutoRetry)
            return;
        Game.player.sceneObject.off(ProjectClientSceneObject.MOVE_START, Controller, Controller.clearNearTargetSceneObjectAndTriggerClickEvent);
        Game.player.sceneObject.off(ProjectClientSceneObject.MOVE_OVER, Controller, Controller.moveToNearTargetSceneObjectAndTriggerClickEvent);
    };
    //------------------------------------------------------------------------------------------------------
    // 碰触事件：触发者=主动碰触别人的对象 执行者=被碰触的对象
    // -- 由A对象主动碰到B对象，触发B对象的碰触事件（只有被触发的对象才会执行触发事件）
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始触发碰触事件
     * @param trigger 碰触者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 执行事件完成后回调
     * @return [boolean] 是否成功
     */
    Controller.startSceneObjectTouchEvent = function (trigger, executor, onCommandExecuteOver) {
        if (onCommandExecuteOver === void 0) { onCommandExecuteOver = null; }
        // 如果还未真正登陆场景则忽略（即预先摆放接触的对象不会触发碰触事件）
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            Callback.New(Controller.startSceneObjectTouchEvent, Controller, [trigger, executor, onCommandExecuteOver]).delayRun(0);
            return false;
        }
        // 如果处于暂停阶段的话监听游戏暂停状态改变后再重新开始
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        // 不在场景上时忽略
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene || !trigger.root.visible || !executor.root.visible)
            return false;
        // 跳跃中时忽略
        if (executor.isJumping || trigger.isJumping)
            return false;
        // 派发碰触事件
        executor.event(ProjectClientSceneObject.TOUCH, [trigger]);
        // 不允许非玩家以外的对象执行时则忽略
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject)
            return false;
        // 如果需要玩家等待的场合
        if (executor.waitTouchEvent && trigger == Game.player.sceneObject) {
            // 测试执行者是否已经处于事件等待中
            if (executor.isEventStartWait) {
                return false;
            }
            // 调用「碰触事件」前的处理
            GameCommand.startCommonCommand(14013, [], null, trigger, executor);
            // 执行者身上未有碰触事件的话则不执行其身上的碰触事件
            if (!executor.hasCommand[1])
                return false;
            // 执行该事件时需要执行者等待，未能成功等待时说明有其他需要等待的事件正在执行，则忽略该事件
            var bool = executor.eventStartWait(trigger);
            if (!bool)
                return false;
            // 玩家停止移动
            if (!Controller.waitTouchEventStart) {
                trigger.stopMove();
            }
            // 不允许控制：来源-碰触事件
            EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [true]);
            Controller.waitTouchEventStart = true;
            Controller.needWaitTouchExcuteCount++;
            // 执行完毕后处理
            var touchCompleteCallback = Callback.New(function () {
                executor.eventCompleteContinue();
                // 恢复控制：来源-碰触事件
                Controller.needWaitTouchExcuteCount--;
                EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
                Controller.waitTouchEventStart = false;
                onCommandExecuteOver && onCommandExecuteOver.run();
            }, this);
            // 执行碰触事件
            var touchEventSuccess = GameCommand.startSceneObjectCommand(executor.index, 1, null, touchCompleteCallback, trigger);
            if (!touchEventSuccess)
                touchCompleteCallback.run();
            return touchEventSuccess;
        }
        else {
            // 调用「碰触事件」前的处理
            GameCommand.startCommonCommand(14013, [], null, trigger, executor);
            // 执行者身上未有碰触事件的话则不执行其身上的碰触事件
            if (!executor.hasCommand[1])
                return false;
            return GameCommand.startSceneObjectCommand(executor.index, 1, null, onCommandExecuteOver, trigger);
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 离开碰触的事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始离开碰触的事件：当已碰触该对象的对象不再碰触该对象时触发
     * @param trigger 触发者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 当执行完成时回调
     * @return [boolean] 是否执行成功
     */
    Controller.startSceneObjectTouchOutEvent = function (trigger, executor, onCommandExecuteOver) {
        if (onCommandExecuteOver === void 0) { onCommandExecuteOver = null; }
        // 如果处于暂停阶段的话监听游戏暂停状态改变后再重新开始
        if (Game.pause) {
            EventUtils.addEventListener(Game, Game.EVENT_PAUSE_CHANGE, Callback.New(Controller.startSceneObjectTouchEvent, this, [trigger, executor, onCommandExecuteOver]), true);
            return false;
        }
        // 不在场景上时忽略
        if (!executor.inScene || !trigger.inScene || trigger.scene != Game.currentScene || executor.scene != Game.currentScene || !trigger.root.visible || !executor.root.visible)
            return false;
        // 派发碰触事件
        executor.event(ProjectClientSceneObject.AWAY_TOUCH, [trigger]);
        // 不允许非玩家以外的对象执行时则忽略
        if (executor.onlyPlayerTouch && trigger != Game.player.sceneObject)
            return false;
        // 离开离开碰触的事件
        GameCommand.startCommonCommand(14014, [], null, trigger, executor);
        // 没有事件时忽略
        if (!executor.hasCommand[4])
            return false;
        return GameCommand.startSceneObjectCommand(executor.index, 4, null, onCommandExecuteOver, trigger);
    };
    //------------------------------------------------------------------------------------------------------
    // 内部-事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始事件
     */
    Controller.startEvent = function () {
        this.clearEvent();
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE]));
        EventUtils.addEventListener(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, Callback.New(this.onCommandStart, this, [Controller.ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE]));
    };
    /**
     * 清理事件
     */
    Controller.clearEvent = function () {
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND, [false]);
        EventUtils.happen(Controller, Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND, [false]);
    };
    //------------------------------------------------------------------------------------------------------
    // 内部
    //------------------------------------------------------------------------------------------------------
    /**
     * 当命令开始时
     * @param enabledID 命令编号
     * @param isStart 是否开始
     */
    Controller.onCommandStart = function (enabledID, isStart) {
        Controller.enabledMapping[enabledID] = !isStart;
    };
    /**
     * 当摇杆操作时发生了碰撞
     * @param dirAngle 当前角度
     * @param tryTimes 尝试的次数
     * @param oriAngle 最初操作的原始角度
     */
    Controller.onJoyCollision = function (dirAngle, tryTimes, oriAngle) {
        // 尝试改变角度
        if (oriAngle == null)
            oriAngle = dirAngle;
        if (tryTimes == -1) {
            tryTimes = 2;
        }
        else {
            if (tryTimes <= 0)
                return;
            tryTimes--;
        }
        dirAngle = this.getCollisionAutoTryAngle(oriAngle, tryTimes);
        this.startJoy(dirAngle % 360, false, tryTimes, oriAngle);
    };
    /**
     * 获取碰撞后自动尝试的角度
     * -- 当fromAngle角度接近四方向的角度则返回四方向
     * @param fromAngle 参考角度
     * @param tryTimes 尝试的次数 2、1
     * @return [number]
     */
    Controller.getCollisionAutoTryAngle = function (fromAngle, tryTimes) {
        // 判断是否接近四方向的角度
        var nearAngle = 22;
        if (fromAngle > 360 - nearAngle || fromAngle < 0 + nearAngle) {
            return 0;
        }
        else if (Math.abs(90 - fromAngle) <= nearAngle) {
            return 90;
        }
        else if (Math.abs(180 - fromAngle) <= nearAngle) {
            return 180;
        }
        else if (Math.abs(270 - fromAngle) <= nearAngle) {
            return 270;
        }
        // 否则根据接近度尝试两次
        if (fromAngle >= 315) {
            if (tryTimes == 2)
                return 0;
            else if (tryTimes == 1)
                return 270;
        }
        else if (fromAngle >= 270) {
            if (tryTimes == 2)
                return 270;
            else if (tryTimes == 1)
                return 0;
        }
        else if (fromAngle >= 225) {
            if (tryTimes == 2)
                return 270;
            else if (tryTimes == 1)
                return 180;
        }
        else if (fromAngle >= 180) {
            if (tryTimes == 2)
                return 180;
            else if (tryTimes == 1)
                return 270;
        }
        else if (fromAngle >= 135) {
            if (tryTimes == 2)
                return 180;
            else if (tryTimes == 1)
                return 90;
        }
        else if (fromAngle >= 90) {
            if (tryTimes == 2)
                return 90;
            else if (tryTimes == 1)
                return 180;
        }
        else if (fromAngle >= 45) {
            if (tryTimes == 2)
                return 90;
            else if (tryTimes == 1)
                return 0;
        }
        else if (fromAngle >= 0) {
            if (tryTimes == 2)
                return 0;
            else if (tryTimes == 1)
                return 90;
        }
        return fromAngle;
    };
    /** 控制器开启事件 */
    Controller.EVENT_CONTROLLER_START = "ControllerEVENT_CONTROLLER_START";
    /** 控制器关闭事件 */
    Controller.EVENT_CONTROLLER_STOP = "ControllerEVENT_CONTROLLER_STOP";
    /** 点击事件的命令 true=开始 false=结束 */
    Controller.EVENT_SCENE_OBJECT_CLICK_COMMAND = "GameCommand_EVENT_SCENE_OBJECT_CLICK_COMMAND";
    /** 碰触事件的命令 true=开始 false=结束 */
    Controller.EVENT_SCENE_OBJECT_TOUCH_COMMAND = "GameCommand_EVENT_SCENE_OBJECT_TOUCH_COMMAND";
    /** 控制可用状态：点击事件执行中 */
    Controller.ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE = 0;
    /** 控制可用状态：碰触事件执行中 */
    Controller.ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE = 1;
    /** 控制可用状态是否可控，需要条件全满足才可控制 */
    Controller.enabledMapping = {
        0: true,
        1: true
    };
    /** 需要等待的碰触事件执行中计数 */
    Controller.needWaitTouchExcuteCount = 0;
    /**
     * 当前方向键输入状态：0-无 1-键盘输入 2-手柄输入 3-虚拟按键 4-其他
     */
    Controller.inputState = 0;
    return Controller;
}());
/**
 * 游戏手柄控制器
 * Created by 黑暗之神KDS on 2020-03-26 03:50:18.
 */
var GamepadControl = /** @class */ (function () {
    function GamepadControl() {
    }
    //------------------------------------------------------------------------------------------------------
    // 启动和停止
    //------------------------------------------------------------------------------------------------------
    GamepadControl.init = function () {
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_LEFT_JOY_DIR4_CHANGE, this, this.onGamepadMenuDirChange, [true]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, this, this.onGamepadMenuDirChange, [false]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_KEY_DOWN, this, this.onGamepadKeyDown, [EventObject.KEY_DOWN]);
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_KEY_UP, this, this.onGamepadKeyDown, [EventObject.KEY_UP]);
    };
    /**
     * 启动
     */
    GamepadControl.start = function () {
        // 摇杆
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, this, this.onLeftKeyChange);
        os.add_ENTERFRAME(this.update, this);
    };
    /**
     * 停止
     */
    GamepadControl.stop = function () {
        // 按键
        GCGamepad.pad1.off(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, this, this.onLeftKeyChange);
        os.remove_ENTERFRAME(this.update, this);
    };
    //------------------------------------------------------------------------------------------------------
    // 方向移动
    //------------------------------------------------------------------------------------------------------
    /**
     * 左方向键按键移动
     * @param dir 方向
     */
    GamepadControl.onLeftKeyChange = function (dir) {
        KeyboardControl.setDirKeyDown(dir);
    };
    /**
     * 更新：处理左摇杆-角色移动
     */
    GamepadControl.update = function () {
        if (!Controller.inSceneEnabled)
            return;
        var joyX = GCGamepad.pad1.leftJoyPoint.x;
        var joyY = GCGamepad.pad1.leftJoyPoint.y;
        // 标准化摇杆值
        var max = Math.max(Math.abs(joyX), Math.abs(joyY));
        if (max != 0) {
            var per = 1 / max;
            joyX *= per;
            joyY *= per;
        }
        if (joyX == 0 && joyY == 0) {
            if (Controller.inputState == 2) {
                Controller.inputState = 0;
                Controller.stopJoy();
            }
            return;
        }
        // 四方向移动：根据角度计算方向
        if (ClientWorld.data.moveDir4) {
            var angle_1 = MathUtils.direction360(0, 0, joyX, joyY);
            var dir = GameUtils.getOriByAngle(angle_1);
            var dir4 = GameUtils.getAssetOri(dir, 4);
            var offset = KeyboardControl.dirOffsetArr[dir4];
            joyX = offset[0];
            joyY = offset[1];
        }
        var angle;
        var toX = Game.player.sceneObject.x + joyX * Config.SCENE_GRID_SIZE;
        var toY = Game.player.sceneObject.y + joyY * Config.SCENE_GRID_SIZE;
        // 移动至格子中心点且八方向的情况
        if (WorldData.moveToGridCenter && !WorldData.moveDir4) {
            ProjectUtils.pointHelper.x = joyX;
            ProjectUtils.pointHelper.y = joyY;
            angle = GCGamepad.pad1.getJoyPointAngle(ProjectUtils.pointHelper);
            if (Game.player.sceneObject.isMoving) {
                var joyAngle8 = GameUtils.getAngleByOri(GameUtils.getOriByAngle(angle));
                if (this.lastJoyAngle8 == joyAngle8) {
                    return;
                }
                this.lastJoyAngle8 = joyAngle8;
                Controller.stopJoy();
            }
        }
        else {
            angle = Math.floor(MathUtils.direction360(Game.player.sceneObject.x, Game.player.sceneObject.y, toX, toY));
            if (ClientWorld.data.moveToGridCenter && Game.player.sceneObject.isMoving) {
                Controller.stopJoy();
                return;
            }
            // 移动至格子中心点，转化为格子中心点
            if (ClientWorld.data.moveToGridCenter) {
                var toP = GameUtils.getGridCenter(new Point(toX, toY));
                toX = toP.x;
                toY = toP.y;
            }
        }
        Controller.inputState = 2;
        Controller.startJoy(angle);
    };
    //------------------------------------------------------------------------------------------------------
    // 手柄通用操作-内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 当使用手柄控制菜单方向
     * @param isJoy
     * @param dir
     */
    GamepadControl.onGamepadMenuDirChange = function (isJoy, dir) {
        ProjectUtils.fromGamePad = true;
        // 在菜单中支持控制（List）
        if (Controller.inSceneEnabled)
            return;
        // if (!GUI_Manager.inMenu && !GameDialog.isInDialog) return;
        var m = {
            2: GUI_Setting.KEY_BOARD.DOWN.keys[0], 4: GUI_Setting.KEY_BOARD.LEFT.keys[0],
            6: GUI_Setting.KEY_BOARD.RIGHT.keys[0], 8: GUI_Setting.KEY_BOARD.UP.keys[0]
        };
        var transKeyCode = m[dir];
        if (transKeyCode)
            stage.event(EventObject.KEY_DOWN, [{ keyCode: transKeyCode }]);
    };
    /**
     * 手柄按键-映射成键盘按键功能
     * -- 菜单按键映射菜单按键（头部标识为MENU）
     * -- 非菜单按键映射成非菜单按键
     * @param keyCode
     */
    GamepadControl.onGamepadKeyDown = function (keyboardEventType, keyCode) {
        var _a;
        ProjectUtils.fromGamePad = true;
        if (GUI_Setting.IS_INPUT_KEY_MODE)
            return;
        switch (keyCode) {
            case GCGamepad.leftKeyIndex:
                return this.onGamepadMenuDirChange(true, 4);
            case GCGamepad.rightKeyIndex:
                return this.onGamepadMenuDirChange(true, 6);
            case GCGamepad.downKeyIndex:
                return this.onGamepadMenuDirChange(true, 2);
            case GCGamepad.upKeyIndex:
                return this.onGamepadMenuDirChange(true, 8);
        }
        var mapping = (_a = {},
            _a[GUI_Setting.GAMEPAD.X.key] = GUI_Setting.KEY_BOARD.X,
            _a[GUI_Setting.GAMEPAD.Y.key] = GUI_Setting.KEY_BOARD.Y,
            _a[GUI_Setting.GAMEPAD.A.key] = GUI_Setting.KEY_BOARD.A,
            _a[GUI_Setting.GAMEPAD.B.key] = GUI_Setting.KEY_BOARD.B,
            _a[GUI_Setting.GAMEPAD.L1.key] = GUI_Setting.KEY_BOARD.L1,
            _a[GUI_Setting.GAMEPAD.L2.key] = GUI_Setting.KEY_BOARD.L2,
            _a[GUI_Setting.GAMEPAD.R1.key] = GUI_Setting.KEY_BOARD.R1,
            _a[GUI_Setting.GAMEPAD.R2.key] = GUI_Setting.KEY_BOARD.R2,
            _a[GUI_Setting.GAMEPAD.BACK.key] = GUI_Setting.KEY_BOARD.BACK,
            _a[GUI_Setting.GAMEPAD.START.key] = GUI_Setting.KEY_BOARD.START,
            _a[GCGamepad.leftKeyIndex] = GUI_Setting.KEY_BOARD.LEFT,
            _a[GCGamepad.rightKeyIndex] = GUI_Setting.KEY_BOARD.RIGHT,
            _a[GCGamepad.downKeyIndex] = GUI_Setting.KEY_BOARD.DOWN,
            _a[GCGamepad.upKeyIndex] = GUI_Setting.KEY_BOARD.UP,
            _a);
        var keyboardInfo = mapping[keyCode];
        if (!keyboardInfo)
            return;
        stage.event(keyboardEventType, [{ keyCode: keyboardInfo.keys[0] }]);
    };
    return GamepadControl;
}());
/**
 * 按键控制器
 * -- 移动
 * -- 调查/对话
 * -- 其他
 *
 * Created by 黑暗之神KDS on 2018-10-08 19:21:25.
 */
var KeyboardControl = /** @class */ (function () {
    function KeyboardControl() {
    }
    /**
     * 是否已启动
     */
    //------------------------------------------------------------------------------------------------------
    // 启动和停止
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    KeyboardControl.init = function () {
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
        stage.on(EventObject.KEY_UP, this, this.onKeyUp);
    };
    /**
     * 启动
     */
    KeyboardControl.start = function () {
        // 按键
        if (!this.onKeyUpdateCB)
            this.onKeyUpdateCB = Callback.New(this.update, this);
        os.add_ENTERFRAME(this.update, this);
        Game.player.sceneObject.off(ProjectClientSceneObject.MOVE_OVER, this, this.update);
        Game.player.sceneObject.on(ProjectClientSceneObject.MOVE_OVER, this, this.update);
    };
    /**
     * 停止
     */
    KeyboardControl.stop = function () {
        // 按键
        os.remove_ENTERFRAME(this.update, this);
        if (Game.player.sceneObject)
            Game.player.sceneObject.off(ProjectClientSceneObject.MOVE_OVER, this, this.update);
    };
    //------------------------------------------------------------------------------------------------------
    // 功能
    //------------------------------------------------------------------------------------------------------
    /**
     * 设置按键方向根据指定的方向
     * @param dir 方向
     */
    KeyboardControl.setDirKeyDown = function (dir) {
        // 0DOWN/1UP/2LEFT/3RIGHT
        var arr = [
            null,
            [0, 2],
            [0],
            [0, 3],
            [2],
            null,
            [3],
            [1, 2],
            [1],
            [1, 3] // 9
        ];
        var dirs = arr[dir];
        this.clearKeyDown();
        for (var i in dirs) {
            this.dirKeyDown[dirs[i]] = true;
        }
        this.updateDir();
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-按键
    //------------------------------------------------------------------------------------------------------
    /**
     * 当键盘按下时
     * @param e
     */
    KeyboardControl.onKeyDown = function (e) {
        // 跳过对话
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
            if (GameDialog.isInDialog) {
                if (GameDialog.isPlaying) {
                    Callback.CallLaterBeforeRender(GameDialog.showall, GameDialog);
                }
                else {
                    Callback.CallLaterBeforeRender(GameDialog.skip, GameDialog);
                }
                return;
            }
        }
        // 当允许场景控制时
        if (Controller.inSceneEnabled) {
            // 方向按键按下
            this.dirKeyDownTrue(e.keyCode, true);
            // 调查/对话
            if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
                Callback.CallLaterBeforeRender(KeyboardControl.tryTriggerSceneObjectClickEvent, KeyboardControl);
            }
        }
    };
    /**
     * 当按键弹起时
     * @param e
     */
    KeyboardControl.onKeyUp = function (e) {
        this.dirKeyDownTrue(e.keyCode, false);
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-场景对象点击事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 尝试触发场景对象点击事件
     * -- 第一判断：然后按照本这个格子触发
     * -- 第二判断：优先按照方向前一格
     */
    KeyboardControl.tryTriggerSceneObjectClickEvent = function () {
        var d = Game.player.sceneObject.avatarOri;
        if (this.dirOffsetArr[d] == null)
            return;
        if (!Game.currentScene)
            return;
        var sceneUtils = Game.currentScene.sceneUtils;
        var playerGridPos = Game.player.sceneObject.posGrid;
        // 第一判断：然后按照本这个格子触发
        // 本格越界的场合忽略掉
        if (sceneUtils.isOutsideByGrid(playerGridPos))
            return;
        // 自定义碰撞区触发
        var customCollisionArr = SoModule_CustomCollision.collisionTest(Game.player.sceneObject, true, null, false);
        if (customCollisionArr.length > 0) {
            for (var i = 0; i < customCollisionArr.length; i++) {
                var ccInfo = customCollisionArr[i];
                if (ccInfo.so.hasCommand[0]) {
                    Controller.startSceneObjectClickEvent(ccInfo.so);
                    return;
                }
            }
        }
        // 本格触发
        var thisGridSos = sceneUtils.gridSceneObjects[Game.player.sceneObject.posGrid.x][Game.player.sceneObject.posGrid.y];
        for (var i = 0; i < thisGridSos.length; i++) {
            var so = thisGridSos[i];
            if (so == null || !so.inScene || so == Game.player.sceneObject || !so.hasCommand[0])
                continue;
            Controller.startSceneObjectClickEvent(so);
            return;
        }
        // 我的范围
        var myPosRect = Game.player.sceneObject.posRect;
        // 碰撞中的对象
        var intersectionMin = Config.SCENE_GRID_SIZE / 4; // 1/4格子大小最低交叉
        var soLen = Game.currentScene.sceneObjects.length;
        for (var i = 0; i < soLen; i++) {
            var so = Game.currentScene.sceneObjects[i];
            // 无对象、玩家自己、无点击事件、不在场上的对象忽略掉
            if (so == null || !so.inScene || so == Game.player.sceneObject || !so.hasCommand[0])
                continue;
            // 判断是否击中
            var intersectionRect = so.posRect.intersection(myPosRect);
            // 交集超过1/4格子时
            if (intersectionRect && intersectionRect.width >= intersectionMin && intersectionRect.height > intersectionMin) {
                Controller.startSceneObjectClickEvent(so);
                return;
            }
        }
        // 向前模拟一格开始碰撞
        var halfGrid = (Config.SCENE_GRID_SIZE) * (Config.SCENE_GRID_SIZE);
        if (WorldData.moveToGridCenter)
            halfGrid * 0.75;
        var myPoTest = new Point(Game.player.sceneObject.x, Game.player.sceneObject.y);
        myPoTest.x += this.dirOffsetArr[d][0] / 2 * Config.SCENE_GRID_SIZE;
        myPoTest.y += this.dirOffsetArr[d][1] / 2 * Config.SCENE_GRID_SIZE;
        var minTarget = null;
        var minNumber = Number.MAX_VALUE;
        for (var i = 0; i < soLen; i++) {
            var so = Game.currentScene.sceneObjects[i];
            // 无对象、玩家自己、无点击事件、不在场上的对象忽略掉
            if (so == null || !so.inScene || so == Game.player.sceneObject || !so.hasCommand[0])
                continue;
            // 判断是否击中
            var dis2 = Point.distanceSquare2(so.x, so.y, myPoTest.x, myPoTest.y);
            // 交集超过1/4格子时
            if (dis2 <= halfGrid) {
                if (dis2 < minNumber) {
                    minTarget = so;
                    minNumber = dis2;
                }
            }
        }
        if (minTarget)
            Controller.startSceneObjectClickEvent(minTarget);
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-方向
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新：方向键移动人物
     * -- 当面向0时不响应
     * -- 当没有改变按键方向的话，检测未到达目的地就不再请求移动
     */
    KeyboardControl.update = function () {
        if (!Controller.inSceneEnabled)
            return;
        var toX;
        var toY;
        // 弹起了所有移动方向按键的情况
        if (this.dir == 0) {
            if (Controller.inputState == 1) {
                Controller.inputState = 0;
                // 不是移动至格子中心点的话立即停止移动
                if (!ClientWorld.data.moveToGridCenter) {
                    Game.player.sceneObject.stopMove();
                }
                else {
                    // 如果已在中心点的话则允许停止
                    var pCenter = GameUtils.getGridCenter(Game.player.sceneObject.pos);
                    if (Game.player.sceneObject.x == pCenter.x && Game.player.sceneObject.y == pCenter.y) {
                        Game.player.sceneObject.stopMove();
                    }
                }
            }
            return;
        }
        // 计算移动的目的地
        Controller.inputState = 1;
        this.isChangeDir = false;
        var xGrid = Math.floor(Game.player.sceneObject.x / Config.SCENE_GRID_SIZE) + this.dirOffsetArr[this.dir][0];
        var yGrid = Math.floor(Game.player.sceneObject.y / Config.SCENE_GRID_SIZE) + this.dirOffsetArr[this.dir][1];
        if (ClientWorld.data.moveToGridCenter) {
            toX = xGrid;
            toY = yGrid;
        }
        else {
            toX = Game.player.sceneObject.x + this.dirOffsetArr[this.dir][0] * Config.SCENE_GRID_SIZE * 2;
            toY = Game.player.sceneObject.y + this.dirOffsetArr[this.dir][1] * Config.SCENE_GRID_SIZE * 2;
        }
        // 不是移动至格子中心点的情况：
        if (!ClientWorld.data.moveToGridCenter) {
            // 变更了目的地的情况允许移动
            if (this.lastDx != this.dirOffsetArr[this.dir][0] || this.lastDy != this.dirOffsetArr[this.dir][1]) {
                this.lastDx = this.dirOffsetArr[this.dir][0];
                this.lastDy = this.dirOffsetArr[this.dir][1];
            }
            // 未变更目的地的情况如果处于移动中则无法再次移动
            else if (Game.player.sceneObject.isMoving) {
                return;
            }
            this.moveDirect(toX, toY);
        }
        // 移动至格子中心点的情况，如果不处于移动状态才允许继续移动
        else if (!Game.player.sceneObject.isMoving) {
            this.moveDirectGrid(xGrid, yGrid);
        }
    };
    /**
     * 开启按键后持续移动用的清除
     */
    KeyboardControl.clearKeyDown = function () {
        for (var i in this.dirKeyDown) {
            this.dirKeyDown[i] = false;
        }
        this.dir = 0;
    };
    /**
     * 确定按键按下状态
     * @param keyCode 按键值
     * @param isDown 是否按下
     * @return [boolean]
     */
    KeyboardControl.dirKeyDownTrue = function (keyCode, isDown) {
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.DOWN)) {
            this.lastKeyDown = 0;
            this.dirKeyDown[0] = isDown;
            this.updateDir();
            return true;
        }
        else if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.UP)) {
            this.lastKeyDown = 1;
            this.dirKeyDown[1] = isDown;
            this.updateDir();
            return true;
        }
        else if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            this.lastKeyDown = 2;
            this.dirKeyDown[2] = isDown;
            this.updateDir();
            return true;
        }
        else if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            this.lastKeyDown = 3;
            this.dirKeyDown[3] = isDown;
            this.updateDir();
            return true;
        }
        return false;
    };
    /**
     * 根据按键按下状态刷新方向
     */
    KeyboardControl.updateDir = function () {
        var oldDir = this.dir;
        this.dir = 0;
        if (this.leftDown && this.upDown) {
            this.dir = 7;
        }
        else if (this.rightDown && this.upDown) {
            this.dir = 9;
        }
        else if (this.rightDown && this.downDown) {
            this.dir = 3;
        }
        else if (this.leftDown && this.downDown) {
            this.dir = 1;
        }
        else if (this.leftDown) {
            this.dir = 4;
        }
        else if (this.rightDown) {
            this.dir = 6;
        }
        else if (this.downDown) {
            this.dir = 2;
        }
        else if (this.upDown) {
            this.dir = 8;
        }
        if (ClientWorld.data.moveDir4) {
            if (this.dir == 7)
                this.dir = this.lastKeyDown == 2 ? 4 : 8;
            if (this.dir == 9)
                this.dir = this.lastKeyDown == 3 ? 6 : 8;
            if (this.dir == 3)
                this.dir = this.lastKeyDown == 3 ? 6 : 2;
            if (this.dir == 1)
                this.dir = this.lastKeyDown == 2 ? 4 : 2;
        }
        this.isChangeDir = this.dir != oldDir;
        // 取消移动结束后触发点击事件（空白事件）
        this.offMoveOverTriggerClickEvent();
    };
    Object.defineProperty(KeyboardControl, "leftDown", {
        /**
         * 获取左方向键是否按下
         * @return [boolean]
         */
        get: function () {
            return this.dirKeyDown[2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyboardControl, "rightDown", {
        /**
         * 获取右方向键是否按下
         */
        get: function () {
            return this.dirKeyDown[3];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyboardControl, "downDown", {
        /**
         * 获取下方向键是否按下
         */
        get: function () {
            return this.dirKeyDown[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyboardControl, "upDown", {
        /**
         * 获取上方向键是否按下
         */
        get: function () {
            return this.dirKeyDown[1];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 移动至指定的格子中心点
     * @param xGrid 格子坐标点x
     * @param yGrid 格子坐标点y
     */
    KeyboardControl.moveDirectGrid = function (xGrid, yGrid) {
        if (!Game.player.sceneObject.fixOri)
            Game.player.sceneObject.avatarOri = this.dir;
        Game.player.sceneObject.ignoreCantMove = true;
        Game.player.sceneObject.keepMoveActWhenCollsionObstacleAndIgnoreCantMove = true;
        var toX = xGrid * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2;
        var toY = yGrid * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2;
        Game.player.sceneObject.autoFindRoadMove(toX, toY, 2, Game.oneFrame);
    };
    /**
     * 移动至指定坐标
     * @param x 像素点x
     * @param y 像素点y
     * @param trySingleDir 尝试单方向移动，斜方向可能走不通的情况，变为只移动x或只移动y来尝试滑动
     */
    KeyboardControl.moveDirect = function (x, y, trySingleDir) {
        if (trySingleDir === void 0) { trySingleDir = true; }
        Game.player.sceneObject.ignoreCantMove = true;
        Game.player.sceneObject.keepMoveActWhenCollsionObstacleAndIgnoreCantMove = true;
        if (trySingleDir) {
            if (this.dir != 0 && !Game.player.sceneObject.fixOri)
                Game.player.sceneObject.avatarOri = this.dir;
        }
        var oldX = Game.player.sceneObject.x;
        var oldY = Game.player.sceneObject.y;
        Game.player.sceneObject.startMove([[x, y]], Game.oneFrame);
        // 如果未能移动的话，尝试
        if (Game.player.sceneObject.x == oldX && Game.player.sceneObject.y == oldY) {
            // 派发的移动需要在遇到障碍时停止移动。
            if (trySingleDir) {
                // 斜方向的话就尝试
                if (x != Game.player.sceneObject.x && y != Game.player.sceneObject.y) {
                    var newX = Game.player.sceneObject.x;
                    var newY = Game.player.sceneObject.y + (y - Game.player.sceneObject.y < 0 ? -Config.SCENE_GRID_SIZE : Config.SCENE_GRID_SIZE);
                    if (!this.moveDirect(newX, newY, false)) {
                        newX = Game.player.sceneObject.x + (x - Game.player.sceneObject.x < 0 ? -Config.SCENE_GRID_SIZE : Config.SCENE_GRID_SIZE);
                        newY = Game.player.sceneObject.y;
                        if (!this.moveDirect(newX, newY, false)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        return true;
                    }
                }
                // 非斜方向的话看看趋势格子是否存在障碍，如果不存在障碍就使用平滑移动
                else {
                    if (Game.player.sceneObject.lastTouchObjects.length == 0) {
                        var dx = x - Game.player.sceneObject.x;
                        var dy = y - Game.player.sceneObject.y;
                        if (dx != 0)
                            dx = dx < 0 ? -1 : 1;
                        if (dy != 0)
                            dy = dy < 0 ? -1 : 1;
                        // 如果目标点无障碍且我当前未接触任何对象时允许移动
                        var dGridP = new Point(Game.player.sceneObject.posGrid.x + dx, Game.player.sceneObject.posGrid.y + dy);
                        if (!Game.currentScene.sceneUtils.isFixedObstacleGrid(dGridP)) {
                            var newToP = GameUtils.getGridCenterByGrid(dGridP);
                            Game.player.sceneObject.autoFindRoadMove(newToP.x, newToP.y, 0, Game.oneFrame, true, false, true);
                        }
                    }
                }
            }
            return false;
        }
        return true;
    };
    /**
     * 取消移动结束后触发点击事件（空白事件）
     */
    KeyboardControl.offMoveOverTriggerClickEvent = function () {
        var f = GlobalTempData["__listenMoveOver"];
        if (f) {
            Game.player.sceneObject.off(ProjectClientSceneObject.MOVE_OVER, Game.player, f);
            f = null;
        }
    };
    /**
     * 方向
     */
    KeyboardControl.dir = 0;
    /**
     * 是否更改了方向
     */
    KeyboardControl.isChangeDir = false;
    /**
     * 方向按键储存：DOWN/UP/LEFT/RIGHT
     */
    KeyboardControl.dirKeyDown = [false, false, false, false];
    /**
     * 方向偏移
     */
    KeyboardControl.dirOffsetArr = [
        null,
        [-1, 1],
        [0, 1],
        [1, 1],
        [-1, 0],
        null,
        [1, 0],
        [-1, -1],
        [0, -1],
        [1, -1] // 9
    ];
    /**
     * 辅助计算
     */
    KeyboardControl.clickNpc3Mode = [
        null,
        [new Point(0, 1), new Point(-1, 0)],
        [new Point(1, 1), new Point(-1, 1)],
        [new Point(1, 0), new Point(0, 1)],
        [new Point(-1, 1), new Point(-1, -1)],
        null,
        [new Point(1, 1), new Point(1, -1)],
        [new Point(-1, 0), new Point(0, -1)],
        [new Point(-1, -1), new Point(1, -1)],
        [new Point(0, -1), new Point(1, 0)] // 9 方向8+6
    ];
    return KeyboardControl;
}());
/**
 * 鼠标控制器
 * Created by 黑暗之神KDS on 2020-03-26 06:05:08.
 */
var MouseControl = /** @class */ (function () {
    function MouseControl() {
    }
    //------------------------------------------------------------------------------------------------------
    // 启动或停止
    //------------------------------------------------------------------------------------------------------
    /**
     * 启动控制器
     */
    MouseControl.start = function () {
        var sceneLayer = Game.layer.sceneLayer;
        // 初始化选中时效果
        if (WorldData.selectSceneObjectEffect != 0 && !this.selectEffect) {
            this.selectEffect = new GCAnimation;
            this.selectEffect.id = WorldData.selectSceneObjectEffect;
            this.selectEffect.loop = true;
            this.selectEffect.play();
        }
        // 初始化
        sceneLayer.width = Config.WINDOW_WIDTH;
        sceneLayer.height = Config.WINDOW_HEIGHT;
        // 抛出同等事件
        for (var i in MouseControl.mouseEvents) {
            sceneLayer.on(MouseControl.mouseEvents[i], this, this.onSceneLayerMouseEvent);
        }
        // 操作事件
        sceneLayer.on(EventObject.MOUSE_DOWN, this, MouseControl.onSceneMouseDown);
        sceneLayer.on(EventObject.MOUSE_MOVE, this, MouseControl.onSceneMouseMove);
    };
    /**
     * 关闭控制器
     */
    MouseControl.stop = function () {
        if (MouseControl.selectSceneObject)
            this.unselectOneSceneObject(MouseControl.selectSceneObject);
        var sceneLayer = Game.layer.sceneLayer;
        for (var i in MouseControl.mouseEvents) {
            sceneLayer.on(MouseControl.mouseEvents[i], this, this.onSceneLayerMouseEvent);
        }
        // 场景对象
        sceneLayer.off(EventObject.MOUSE_DOWN, this, MouseControl.onSceneMouseDown);
        sceneLayer.off(EventObject.MOUSE_MOVE, this, MouseControl.onSceneMouseMove);
    };
    //------------------------------------------------------------------------------------------------------
    // 选中效果
    //------------------------------------------------------------------------------------------------------
    /**
     * 更新选中场景对象的效果
     * @param e
     */
    MouseControl.updateSelectSceneObject = function () {
        if (!Game.currentScene || Game.currentScene == ClientScene.EMPTY)
            return;
        var len = Game.currentScene.sceneObjects.length;
        var globalP = Game.currentScene.globalPos;
        for (var i = len - 1; i >= 0; i--) {
            var soc = Game.currentScene.sceneObjects[i];
            if (!soc)
                continue;
            if (!soc.root.stage)
                continue;
            if (!soc.selectEnabled)
                continue;
            // 非选中效果
            this.unselectOneSceneObject(soc);
            // 像素级检测
            if (soc.avatar.hitTestPoint(globalP.x, globalP.y)) {
                this.selectOneSceneObject(soc);
                return;
            }
        }
    };
    /**
     * 取消选中场景对象
     */
    MouseControl.unselectOneSceneObject = function (soc) {
        if (soc == this.selectSceneObject) {
            this.selectSceneObject = null;
            if (WorldData.selectSceneObjectEffect != 0 && this.selectEffect) {
                this.selectEffect.removeFromGameSprite();
            }
        }
    };
    /**
     * 选中场景对象
     * @param soc 场景对象
     */
    MouseControl.selectOneSceneObject = function (soc) {
        if (this.selectSceneObject)
            this.unselectOneSceneObject(this.selectSceneObject);
        this.selectSceneObject = soc;
        if (WorldData.selectSceneObjectEffect != 0 && this.selectEffect) {
            this.selectEffect.addToGameSprite(soc.avatarContainer, soc.animationLowLayer, soc.animationHighLayer);
        }
    };
    /**
     * 场景鼠标事件
     * @param e
     */
    MouseControl.onSceneLayerMouseEvent = function (e) {
        this.eventDispatcher.event(e.type, [e]);
    };
    /**
     * 鼠标左键点击场景的场合
     * @param e
     */
    MouseControl.onSceneMouseDown = function (e) {
        // 刷新选中效果
        this.updateSelectSceneObject();
        // 当无法控制时忽略
        if (!Controller.inSceneEnabled)
            return;
        // 选中对象时：移动至其附近并执行点击事件
        if (this.selectSceneObject && this.selectSceneObject.inScene) {
            Controller.moveToNearTargetSceneObjectAndTriggerClickEvent(this.selectSceneObject);
        }
    };
    /**
     * 鼠标在场景中移动的场合
     */
    MouseControl.onSceneMouseMove = function () {
        // 刷新选中效果
        this.updateSelectSceneObject();
    };
    /**
     * 鼠标事件集
     */
    MouseControl.mouseEvents = [EventObject.MOUSE_DOWN, EventObject.MOUSE_UP, EventObject.CLICK, EventObject.DOUBLE_CLICK, EventObject.RIGHT_MOUSE_DOWN, EventObject.RIGHT_MOUSE_UP, EventObject.RIGHT_CLICK, EventObject.MOUSE_WHEEL, EventObject.MOUSE_MOVE];
    /**
     * 事件派发器
     */
    MouseControl.eventDispatcher = new EventDispatcher;
    return MouseControl;
}());
/**
 * 场景的工具类
 * 用于计算障碍、遮罩、桥属性、碰撞检测等
 *
 * Created by 黑暗之神KDS on 2020-01-24 02:55:52.
 */
var SceneUtils = /** @class */ (function () {
    //------------------------------------------------------------------------------------------------------
    // 实例
    //------------------------------------------------------------------------------------------------------
    /**
     * 构造函数
     */
    function SceneUtils(scene) {
        /**
         * 格子上的场景对象：初始化时即设置了gridWidth x gridHeight的空数组
         */
        this.gridSceneObjects = [];
        /**
         * 场景对象上次所在的格子坐标
         */
        this.lastUpdateObsBridgeGrid = [];
        this.scene = scene;
        // 碰撞组数据缓存
        if (SceneUtils.banCollisionMapping == null) {
            SceneUtils.banCollisionMapping = {};
            for (var i = 0; i < WorldData.banCollisionSetting.length; i++) {
                var setting = WorldData.banCollisionSetting[i];
                var collisionSign1 = setting.group1 + "_" + setting.group2;
                var collisionSign2 = setting.group2 + "_" + setting.group1;
                SceneUtils.banCollisionMapping[collisionSign1] = true;
                SceneUtils.banCollisionMapping[collisionSign2] = true;
            }
        }
        this.halfGridPlus = Config.SCENE_GRID_SIZE / 2 + 1;
        // 计算内边界
        this.innerBoundaryRect = new Rectangle(Config.SCENE_GRID_SIZE / 2, Config.SCENE_GRID_SIZE / 2, scene.width - Config.SCENE_GRID_SIZE + 1, scene.height - Config.SCENE_GRID_SIZE + 1);
        // 初始化格子中的场景对象引用
        for (var x = 0; x < scene.gridWidth; x++) {
            var gsx = this.gridSceneObjects[x] = [];
            for (var y = 0; y < scene.gridHeight; y++) {
                gsx[y] = [];
            }
        }
        // 图块障碍和遮罩合并进来
        var maskData = scene.dataLayers[1];
        if (!maskData)
            maskData = scene.dataLayers[1] = [];
        var obsData = scene.dataLayers[0];
        if (!obsData)
            obsData = scene.dataLayers[0] = [];
        var bridgeData = scene.dataLayers[2];
        if (!bridgeData)
            bridgeData = scene.dataLayers[2] = [];
        // 遍历图层
        for (var i_1 = 0; i_1 < scene.LayerDatas.length; i_1++) {
            var layerData = scene.LayerDatas[i_1];
            // 忽略对象层
            if (layerData.p)
                continue;
            // 如果图层是绘制模式且未能偏移或自动移动或修改缩放、远景、斜率的话则计算图块里面预设的障碍和遮罩
            if (layerData.drawMode && layerData.dx == 0 && layerData.dy == 0 && layerData.xMove == 0 && layerData.yMove == 0
                && layerData.scaleX == 1 && layerData.scaleY == 1 && layerData.prospectsPerX == 1 && layerData.prospectsPerY == 1 && layerData.skewX == 0 && layerData.skewY == 0) {
                // 遍历格子
                for (var x = 0; x < scene.gridWidth; x++) {
                    var tileDataW = layerData.tileData[x];
                    if (!tileDataW)
                        continue;
                    for (var y = 0; y < scene.gridHeight; y++) {
                        var layerTileData = tileDataW[y];
                        if (!layerTileData)
                            continue;
                        // 获取图块属性
                        var tileData = void 0;
                        var isAutoData = false;
                        if (layerTileData.texID < 0) {
                            tileData = AutoTileData.getAutoTileData(-layerTileData.texID);
                            isAutoData = true;
                        }
                        else {
                            tileData = TileData.getTileData(layerTileData.texID);
                        }
                        if (!tileData)
                            continue;
                        var tileGridP = GameUtils.getGridPostion(new Point(layerTileData.x, layerTileData.y));
                        // 障碍合并
                        mergeTileGridData(x, y, tileData, 0, isAutoData, obsData, tileGridP);
                        // 遮罩合并
                        mergeTileGridData(x, y, tileData, 1, isAutoData, maskData, tileGridP);
                        // 桥属性合并
                        mergeTileGridData(x, y, tileData, 2, isAutoData, bridgeData, tileGridP);
                    }
                }
            }
        }
        // 合并图块格子数据
        function mergeTileGridData(x, y, tileData, dataLayerIndex, isAutoData, gridDataFild, tileGridP) {
            var tileGridDatas = tileData.dataLayers[dataLayerIndex];
            if (tileGridDatas) {
                if (isAutoData) {
                    var gridDataX = gridDataFild[x];
                    if (!gridDataX)
                        gridDataX = gridDataFild[x] = [];
                    gridDataX[y] = 1;
                }
                else {
                    var tileDataMaskX = tileGridDatas[tileGridP.x];
                    if (tileDataMaskX && tileDataMaskX[tileGridP.y]) {
                        var gridDataX = gridDataFild[x];
                        if (!gridDataX)
                            gridDataX = gridDataFild[x] = [];
                        gridDataX[y] = 1;
                    }
                }
            }
        }
    }
    //------------------------------------------------------------------------------------------------------
    // 静态方法
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取附近可通行的格子点
     * @param gridP 障碍格子点
     * @param targetP [可选] 默认值=null 参考目标点，会优先选择与该目标点最近的点
     * @return [Point]
     */
    SceneUtils.getNearThroughGrid = function (gridP, targetP) {
        if (targetP === void 0) { targetP = null; }
        var nearGrid = 5;
        var currentScene = Game.currentScene;
        var n_32_x1 = gridP.x - nearGrid;
        var n_32_x2 = gridP.x + nearGrid;
        var n_32_y1 = gridP.y - nearGrid;
        var n_32_y2 = gridP.y + nearGrid;
        n_32_x1 = n_32_x1 < 0 ? 0 : n_32_x1;
        n_32_y1 = n_32_y1 < 0 ? 0 : n_32_y1;
        n_32_x2 = n_32_x2 > Game.currentScene.gridWidth ? Game.currentScene.gridWidth : n_32_x2;
        n_32_y2 = n_32_y2 > Game.currentScene.gridHeight ? Game.currentScene.gridHeight : n_32_y2;
        var findGrid = new Point(-1, -1);
        var helpP = new Point();
        var dis_x = 9999;
        var findGrids = [];
        for (var x = n_32_x1; x < n_32_x2; x++) {
            for (var y = n_32_y1; y < n_32_y2; y++) {
                helpP.x = x;
                helpP.y = y;
                // 如果是界外
                if (currentScene.sceneUtils.isOutsideByGrid(helpP)) {
                    continue;
                }
                // 如果是障碍
                if (currentScene.sceneUtils.isObstacleGrid(helpP)) {
                    continue;
                }
                // 当前点与终点的距离
                var n_jin_x32 = Math.abs(x - gridP.x);
                var n_jin_y32 = Math.abs(y - gridP.y);
                var dis = n_jin_x32 + n_jin_y32;
                if (targetP) {
                    if (dis <= dis_x) {
                        findGrid.x = x;
                        findGrid.y = y;
                        if (dis_x != dis)
                            findGrids.length = 0;
                        dis_x = dis;
                        findGrids.push(new Point(findGrid.x, findGrid.y));
                    }
                }
                else {
                    if (dis < dis_x) {
                        findGrid.x = x;
                        findGrid.y = y;
                        dis_x = dis;
                    }
                }
            }
        }
        if (targetP) {
            findGrid = new Point(-1, -1);
            dis_x = 9999;
            for (var p in findGrids) {
                var tp = findGrids[p];
                var n_jin_x32 = Math.abs(tp.x - targetP.x);
                var n_jin_y32 = Math.abs(tp.y - targetP.y);
                var dis = n_jin_x32 + n_jin_y32;
                if (dis < dis_x) {
                    findGrid = tp;
                    dis_x = dis;
                }
            }
        }
        if (findGrid.x == -1)
            return null;
        return findGrid;
    };
    /**
     * 计算两点间是否存在障碍 穷举法
     * @param x1 起点x坐标
     * @param y1 起点y坐标
     * @param x2 终点x坐标
     * @param y2 终点y坐标
     * @param scene 场景
     * @param except [可选] 默认值=null 排除在外的对象
     * @param exceptToP [可选] 默认值=false 终点是否排除在外
     * @return [boolean]
     */
    SceneUtils.twoPointHasObstacle = function (x1, y1, x2, y2, scene, except, exceptToP) {
        if (except === void 0) { except = null; }
        if (exceptToP === void 0) { exceptToP = false; }
        //遮挡是地图的遮挡
        var p1 = new Point(x1, y1);
        var p2 = new Point(x2, y2);
        // 计算两点的长度 S
        var step = 16;
        var dis = Point.distance(p1, p2);
        // ADD一个数组，该数组应包含初始点，每16像素的点，以及终点
        var nArr = []; //初始点
        var len = Math.floor(dis / step);
        for (var i = 1; i <= len; i++) {
            var newX = (p2.x - p1.x) / (dis / step) * i + p1.x;
            var newY = (p2.y - p1.y) / (dis / step) * i + p1.y;
            if (exceptToP && newX == x2 && newY == y2)
                continue;
            var point = new Point(newX, newY);
            if (except) {
                var r = SoModule_CustomCollision.collisionTest(except, true, point, true);
                if (r.length > 0) {
                    return true;
                }
            }
            nArr.push(point);
        }
        if (!exceptToP)
            nArr.push(new Point(x2, y2)); //终点
        for (var s in nArr) {
            if (scene.sceneUtils.isObstacle(nArr[s], except)) {
                return true;
            }
        }
        return false;
    };
    //------------------------------------------------------------------------------------------------------
    // 障碍
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否障碍,实际坐标（含动态障碍）
     * @param p 实际坐标
     * @param except [可选] 默认值=null 忽略计算的对象（如玩家自身）
     * @return [boolean]
     */
    SceneUtils.prototype.isObstacle = function (p, except) {
        if (except === void 0) { except = null; }
        var map32 = GameUtils.getGridPostion(p);
        return this.isObstacleGrid(map32, except);
    };
    /**
     * 是否是障碍格子（含动态障碍）
     * @param gridP 格子坐标
     * @param except 排除者
     * @param checker 检查者
     * @return [boolean]
     */
    SceneUtils.prototype.isObstacleGrid = function (gridP, except, checker) {
        if (except === void 0) { except = null; }
        if (checker === void 0) { checker = null; }
        if (this.isOutsideByGrid(gridP)) {
            return true;
        }
        // 检查是否具备动态穿透属性
        var gridStatus = this.getGridDynamicObsStatus(gridP, except, null, checker);
        if (gridStatus == 1) {
            return false;
        }
        else if (gridStatus == 2) {
            return true;
        }
        // 检查地图阻碍
        return this.isFixedObstacleGrid(gridP);
    };
    /**
     * 是否存在地图固定障碍（地图或图块设置的障碍）
     * @param gridP 格子坐标
     * @param calcBridge 计算桥属性
     * @return [boolean]
     */
    SceneUtils.prototype.isFixedObstacleGrid = function (gridP, calcBridge) {
        if (calcBridge === void 0) { calcBridge = true; }
        if (!calcBridge)
            return this.scene.getDataGridState(0, gridP.x, gridP.y) == 1;
        return this.scene.getDataGridState(0, gridP.x, gridP.y) == 1 && this.scene.getDataGridState(2, gridP.x, gridP.y) != 1;
    };
    /**
     * 是否存在地图固定桥属性
     * @param gridP 格子坐标
     * @return [boolean]
     */
    SceneUtils.prototype.isFixedBridgeGrid = function (gridP) {
        // 存在障碍设定且不存在地图桥属性的话则视为地图固定障碍
        return this.scene.getDataGridState(2, gridP.x, gridP.y) == 1;
    };
    //------------------------------------------------------------------------------------------------------
    // 遮罩 
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否存在遮罩，根据实际坐标
     * @param p
     * @return [boolean]
     */
    SceneUtils.prototype.isMask = function (p) {
        var map32 = GameUtils.getGridPostion(p);
        return this.isMaskGrid(map32);
    };
    /**
     * 是否存在遮罩，根据格子
     * @param gridP
     * @return [boolean]
     */
    SceneUtils.prototype.isMaskGrid = function (gridP) {
        return this.scene.getDataGridState(1, gridP.x, gridP.y) == 1;
    };
    //------------------------------------------------------------------------------------------------------
    // 范围
    //------------------------------------------------------------------------------------------------------
    /**
     * 是否在场外
     * @param p 坐标
     * @param innerBoundary 计算内边界
     * @return [boolean]
     */
    SceneUtils.prototype.isOutside = function (p, innerBoundary) {
        if (innerBoundary === void 0) { innerBoundary = false; }
        if (innerBoundary) {
            if (p.x < this.innerBoundaryRect.x || p.x >= this.innerBoundaryRect.right || p.y < this.innerBoundaryRect.y || p.y >= this.innerBoundaryRect.bottom) {
                return true;
            }
        }
        else {
            if (p.x < 0 || p.x >= this.scene.width || p.y < 0 || p.y >= this.scene.height) {
                return true;
            }
        }
        return false;
    };
    /**
     * 是否在场外，根据格子
     * @param gridP 格子坐标
     * @return [boolean]
     */
    SceneUtils.prototype.isOutsideByGrid = function (gridP) {
        if (gridP.x < 0 || gridP.x >= this.scene.gridWidth || gridP.y < 0 || gridP.y >= this.scene.gridHeight) {
            return true;
        }
        return false;
    };
    /**
     * 将坐标限制在场景内
     * @param p 指定坐标
     */
    SceneUtils.prototype.limitInside = function (p, innerBoundary) {
        if (innerBoundary === void 0) { innerBoundary = false; }
        var wh = Scene.getRealWidth(this.scene);
        wh.width -= 1;
        wh.height -= 1;
        if (!innerBoundary) {
            if (p.x < 0) {
                p.x = 0;
            }
            else if (p.x > wh.width) {
                p.x = wh.width;
            }
            if (p.y < 0) {
                p.y = 0;
            }
            else if (p.y > wh.height) {
                p.y = wh.height;
            }
        }
        else {
            if (p.x < this.innerBoundaryRect.x) {
                p.x = this.innerBoundaryRect.x;
            }
            else if (p.x >= this.innerBoundaryRect.right) {
                p.x = this.innerBoundaryRect.right;
            }
            if (p.y < this.innerBoundaryRect.y) {
                p.y = this.innerBoundaryRect.y;
            }
            else if (p.y >= this.innerBoundaryRect.bottom) {
                p.y = this.innerBoundaryRect.bottom;
            }
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 格子的动态障碍
    //------------------------------------------------------------------------------------------------------
    /**
     * 检查该格子是否具备动态穿透属性
     * 只包含 ProjectClientSceneObject，因为其他场景对象类未拥有障碍特性
     * -- 只要有桥对象则视为穿透
     * -- 否则只要有障碍物则视为有障碍
     * @param gridP 当前格子
     * @param excepter [可选] 默认值=null 排除在外的对象（比如自己）
     * @param gridSceneObjects [可选] 默认值=null 所在当前格子的场景对象（如有）
     * @param checker [可选] 默认值=null 如果与检查者是穿透关系，则不作为
     * @return [number] 0-无障碍 1-桥属性 2-存在障碍
     */
    SceneUtils.prototype.getGridDynamicObsStatus = function (gridP, excepter, gridSceneObjects, checker) {
        if (excepter === void 0) { excepter = null; }
        if (gridSceneObjects === void 0) { gridSceneObjects = null; }
        if (checker === void 0) { checker = null; }
        // 忽略超过边界的情况
        if (this.isOutsideByGrid(gridP))
            return 2;
        // 不存在外部传入进来的在当前格的对象集的话就重新取得一下
        if (!gridSceneObjects)
            gridSceneObjects = this.gridSceneObjects[gridP.x][gridP.y];
        var len = gridSceneObjects.length;
        for (var i = 0; i < len; i++) {
            var so = gridSceneObjects[i];
            // 忽略需要排除在外的对象（比如自己）
            if (so == excepter)
                continue;
            // 忽略空对象
            if (so == null)
                continue;
            // 不在场景上，当做不存在
            if (!so.inScene)
                continue;
            // 跳跃中的对象忽略掉，当做不存在
            if (so.isJumping)
                continue;
            // 如果发现一个存在桥属性的人则返回1，表示允许通行
            if (so.bridge) {
                return 1;
            }
            // 目标与你是穿透关系的话
            if (checker && this.isBothBanCollision(checker, so))
                continue;
            // 目标不是穿透且行走图存在的话：这里设置hasDyncmicObs而非返回，因为后面可能会存在bridge
            if (!so.through) {
                // 目标不是自定义碰撞体的话
                if (!checker || (checker && !checker.through)) {
                    var soCcModule = so.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
                    if (soCcModule && soCcModule.isObstacle) {
                        return 0;
                    }
                }
            }
            // 穿透的情况-忽略掉
            else {
                continue;
            }
            // 不存在行走图的话-忽略掉
            if (so.avatarID == 0)
                continue;
            return 2;
        }
        return 0;
    };
    /**
     * 两个场景对象是否是禁止碰撞
     * @param so1 场景对象1
     * @param so2 场景对象2
     * @return [boolean]
     */
    SceneUtils.prototype.isBothBanCollision = function (so1, so2) {
        var sign = so1.collisionGroup + "_" + so2.collisionGroup;
        if (SceneUtils.banCollisionMapping[sign]) {
            return true;
        }
        return false;
    };
    /**
     * 刷新动态障碍和桥，根据单位场景对象
     * @param soc 障碍对象
     * @param inScene 是否在场景上
     * @return isChange 是否真正更新过坐标
     */
    SceneUtils.prototype.updateDynamicObsAndBridge = function (soc, inScene, posGrid) {
        if (posGrid === void 0) { posGrid = null; }
        if (Config.EDIT_MODE)
            return false;
        if (this.isOutside(new Point(soc.x, soc.y))) {
            return false;
        }
        // 获取当前的格子坐标
        var nowGrid;
        if (posGrid != null) {
            nowGrid = new Point(posGrid.x, posGrid.y);
        }
        else {
            var nowP = new Point(soc.x, soc.y);
            nowGrid = GameUtils.getGridPostion(nowP, nowP);
        }
        var lastGrid = this.lastUpdateObsBridgeGrid[soc.index];
        // 忽略已处理过的坐标点
        if (lastGrid && nowGrid.x == lastGrid.x && nowGrid.y == lastGrid.y && inScene)
            return false;
        // 桥状态更新
        if (lastGrid) {
            var sos = this.gridSceneObjects[lastGrid.x][lastGrid.y];
            sos.splice(sos.indexOf(soc), 1);
            delete this.lastUpdateObsBridgeGrid[soc.index];
        }
        if (inScene) {
            var gridSceneObjectsXArr = this.gridSceneObjects[nowGrid.x];
            if (!gridSceneObjectsXArr)
                return false;
            var sos = gridSceneObjectsXArr[nowGrid.y];
            sos.push(soc);
            this.lastUpdateObsBridgeGrid[soc.index] = nowGrid;
            return true;
        }
        return false;
    };
    //------------------------------------------------------------------------------------------------------
    // 碰撞检测
    //------------------------------------------------------------------------------------------------------
    /**
     * 碰撞检测
     * @param checker 检查者
     * @param useGridObstacle 是否使用格子计算障碍模式
     * @param posP 检查者即将到达的坐标（单位：像素）
     * @param posGridP [可选] 默认值=null 检查者的即将到达的坐标（单位：格子）
     * @param trendP [可选] 默认值=null 检查者移动趋势坐标（单位：像素）
     * @param trendGridP 检查者移动趋势坐标（单位：格子）
     * @return 障碍和碰触信息 isObstacle=是否碰到障碍 touchSceneObjects=碰触到的对象列表（可能包含自己） correctPos 修正坐标
     */
    SceneUtils.prototype.touchCheck = function (checker, useGridObstacle, posP, posGridP, trendP, trendGridP) {
        if (posGridP === void 0) { posGridP = null; }
        if (trendP === void 0) { trendP = null; }
        if (!posGridP)
            posGridP = GameUtils.getGridPostion(posP);
        // 使用格子计算障碍的方式
        if (useGridObstacle) {
            return this.collsionCheckGrid(checker, posP, posGridP, trendP);
        }
        // 使用矩形计算障碍
        else {
            return this.collsionCheckRect(checker, posP, trendP, posGridP);
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 获取数据
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取指定对象的周围的坐标位置
     * @param mode 0-按照指定的对象1的背面顺时针 1-按照对象2相对于对象1最近的方向开始顺时针
     * @param so1 被接近的目标
     * @param so2 接近的目标
     * @param positionSize [可选] 默认值=1 最多需要的位置数目，如3表示最多需要3个位置
     * @param calcWantToGo [可选] 默认值=false 是否计算想达到，如果计算的话想到达的位置也算被占用
     * @param gridSize [可选] 默认值= Config.SCENE_GRID_SIZE 格子尺寸，默认值是系统格子尺寸，如48
     * @param oneStep [可选] 默认值=false 单步
     * @return 获取周围的位置
     */
    SceneUtils.getAroundPositions = function (mode, so1, so2, positionSize, calcWantToGo, gridSize, oneStep) {
        if (positionSize === void 0) { positionSize = 1; }
        if (calcWantToGo === void 0) { calcWantToGo = true; }
        if (gridSize === void 0) { gridSize = Config.SCENE_GRID_SIZE; }
        if (oneStep === void 0) { oneStep = false; }
        positionSize = Math.max(Math.min(MathUtils.int(positionSize), 8), 1);
        // 面向偏移的格子 1 2 3 6 9 8 7 4
        var dirOffsetMapping = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
        var antiClockwiseMapping = [null, 0, 1, 2, 7, null, 3, 6, 5, 4];
        // 位置顺序的偏移，比如背后的点，由正背后0，左背后-1,右背后1...等等（逆时针）
        //                 计算到背后的点是2，想要3个位置应该是2,1,3这样的顺序，所以对于数值2来说偏移就是0,-1,1
        // 7  8  9
        // 4 KDS 6
        // 1  2  3
        var offsets = [0, -1, 1, -2, 2, -3, 3, 4];
        var so1X, so1Y;
        if (!oneStep) {
            so1X = so1.x;
            so1Y = so1.y;
        }
        else {
            var dx = void 0, dy = void 0;
            var disX = Math.abs(so1.x - so2.x);
            var disY = Math.abs(so1.y - so2.y);
            if (disX > disY) {
                dy = 0;
                dx = so1.x > so2.x ? 1 : -1;
            }
            else {
                dx = 0;
                dy = so1.y > so2.y ? 1 : -1;
            }
            so1X = so2.x + dx * gridSize;
            so1Y = so2.y + dy * gridSize;
        }
        // 计算起点：so1背后的点
        var startIndex, flip;
        if (mode == 0) {
            startIndex = antiClockwiseMapping[so1.avatar.orientation];
            flip = -1;
        }
        // 计算起点：so2离so1最近的点
        else if (mode == 1) {
            var angle = MathUtils.direction360(so1X, so1Y, so2.x, so2.y);
            startIndex = antiClockwiseMapping[GameUtils.getOriByAngle(angle)];
            flip = 1;
        }
        // 按照逆时针将dirOffsetMapping连续安排成一个数组
        var newDirOffsetMapping = [];
        for (var i = 0; i < dirOffsetMapping.length; i++) {
            var newDirOffset = dirOffsetMapping[(startIndex + i) % dirOffsetMapping.length];
            newDirOffsetMapping.push(newDirOffset);
        }
        // 遍历可用的位置，超出positionSize后则不再添加位置
        var finalPostions = [];
        var sceneObjects = Game.currentScene.sceneObjects;
        for (var i = 0; i < newDirOffsetMapping.length; i++) {
            var offset = offsets[i];
            offset = (offset + 8) % 8;
            var positionOffset = newDirOffsetMapping[offset];
            var finalPosition = new Point(so1X + gridSize * positionOffset[0] * flip, so1Y + gridSize * positionOffset[1] * flip);
            var finalPositionGrid = GameUtils.getGridPostion(finalPosition);
            // 如果该点存在障碍则忽略
            if (Game.currentScene.sceneUtils.isObstacleGrid(finalPositionGrid, so2))
                continue;
            // 如果该点已被占用则忽略
            if (calcWantToGo && so2) {
                var wantToGoExist = false;
                for (var s = 0; s < sceneObjects.length; s++) {
                    var btSo = sceneObjects[s];
                    if (!btSo || btSo == so2)
                        continue;
                    if (btSo.wantToGoGrid && btSo.wantToGoGrid.x == finalPositionGrid.x && btSo.wantToGoGrid.y == finalPositionGrid.y) {
                        wantToGoExist = true;
                        break;
                    }
                }
                if (wantToGoExist)
                    continue;
            }
            if (so2)
                so2.wantToGoGrid = finalPositionGrid;
            finalPostions.push(finalPosition);
            if (finalPostions.length >= positionSize)
                break;
        }
        return finalPostions;
    };
    //------------------------------------------------------------------------------------------------------
    // 私有实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 碰撞检测-格子版
     * @param checker
     * @param posP
     * @param posGridP [可选] 默认值=null
     * @param trendP  [可选] 默认值=null 趋势移动点
     * @param calcTrendP [可选] 默认值=true 计算趋势点接触碰撞信息
     */
    SceneUtils.prototype.collsionCheckGrid = function (checker, posP, posGridP, trendP, calcTrendP) {
        if (posGridP === void 0) { posGridP = null; }
        if (trendP === void 0) { trendP = null; }
        if (calcTrendP === void 0) { calcTrendP = true; }
        var res = { isObstacle: false, touchSceneObjects: [], alreadyCalcPosRect: false };
        // 不允许接触的场合
        if (!checker.touchEnabled)
            return res;
        // 如果是边界的情况：视为障碍并返回
        if (this.isOutside(posP) || this.isOutsideByGrid(posGridP)) {
            res.isObstacle = true;
            return res;
        }
        // 1.[非自定义碰撞体列表] 获取接触的非自定义碰撞体对象
        // -- 接触者设置为当前格所在的所有对象
        var touchSceneObjects = this.gridSceneObjects[posGridP.x][posGridP.y];
        // -- 如果是移动至格子中心点模式下的情况下，目标对象是静止且穿透/无行走图的话则需要与目标近似重叠才视为接触
        if (WorldData.moveToGridCenter) {
            var _touchSceneObjects = [];
            var errorValue = Math.max(checker.moveSpeed / (18 + Config.SCENE_GRID_SIZE), 1);
            for (var i = 0; i < touchSceneObjects.length; i++) {
                var touchSo = touchSceneObjects[i];
                if (touchSo == checker)
                    continue;
                if ((touchSo.through || touchSo.avatarID == 0)) {
                    // 如果目的地无法去到的话对比的是当前位置而非趋势位置
                    var checkPos = void 0;
                    if (trendP) {
                        checkPos = new Point(checker.x, checker.y);
                    }
                    else {
                        checkPos = posP;
                    }
                    // 如果该目标对象不在格子中心点的话则无需重叠
                    var standPos = GameUtils.getGridCenterByGrid(touchSo.posGrid);
                    if (!touchSo.isMoving && standPos.x == touchSo.x && standPos.y == touchSo.y) {
                        if (Math.abs(checkPos.x - touchSo.x) < errorValue && Math.abs(checkPos.y - touchSo.y) < errorValue) {
                            if (_touchSceneObjects.indexOf(touchSo) == -1)
                                _touchSceneObjects.push(touchSo);
                        }
                    }
                    else {
                        if (_touchSceneObjects.indexOf(touchSo) == -1)
                            _touchSceneObjects.push(touchSo);
                    }
                }
                else {
                    if (_touchSceneObjects.indexOf(touchSo) == -1)
                        _touchSceneObjects.push(touchSo);
                }
            }
            touchSceneObjects = _touchSceneObjects;
        }
        else {
            touchSceneObjects = this.gridSceneObjects[posGridP.x][posGridP.y];
        }
        // -- 防止改动gridSceneObjects的数据
        touchSceneObjects = touchSceneObjects.concat();
        // -- 追加趋势格的所有对象
        var trendPToGrid;
        var ignoreCheckGrid = false; // 忽略检查者自身（其他对象正在朝检查者移动时）
        if (calcTrendP) {
            var dGridX = Math.round(trendP.x - posP.x);
            var dGridY = Math.round(trendP.y - posP.y);
            trendPToGrid = new Point(Math.floor((posP.x - dGridX * this.halfGridPlus) / Config.SCENE_GRID_SIZE) + dGridX, Math.floor((posP.y - dGridY * this.halfGridPlus) / Config.SCENE_GRID_SIZE) + dGridY);
            var trendPTouchRes = this.collsionCheckGrid(checker, trendP, trendPToGrid, null, false);
            for (var i = 0; i < trendPTouchRes.touchSceneObjects.length; i++) {
                var trendPTouchSceneObject = trendPTouchRes.touchSceneObjects[i];
                if (touchSceneObjects.indexOf(trendPTouchSceneObject) == -1)
                    touchSceneObjects.push(trendPTouchSceneObject);
            }
            if (trendPTouchRes.isObstacle)
                res.isObstacle = true;
            // -- 检查者正在移动且目标趋势格不存在障碍时
            if (checker.isMoving && (trendPToGrid.x != posGridP.x || trendPToGrid.y != posGridP.y) && !trendPTouchRes.isObstacle) {
                ignoreCheckGrid = true;
            }
        }
        // -- 非自定义碰撞体加入到 res.touchSceneObjects
        for (var i = 0; i < touchSceneObjects.length; i++) {
            var touchSceneObject = touchSceneObjects[i];
            // 对方是自定义碰撞体-不在此计算（在下方）
            var ccModule = touchSceneObject.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
            if (ccModule && ccModule.isObstacle)
                continue;
            if (res.touchSceneObjects.indexOf(touchSceneObject) == -1)
                res.touchSceneObjects.push(touchSceneObject);
        }
        // -- 格子中心点的话如果目标正在移动且正远离当前格的话则忽略掉该对象
        if (WorldData.moveToGridCenter) {
            var checkOffsetX = checker.moveTrendInfo.to.x - checker.moveTrendInfo.from.x > 0 ? 1 : -1;
            var checkOffsetY = checker.moveTrendInfo.to.y - checker.moveTrendInfo.from.y > 0 ? 1 : -1;
            var checkGridCenterP = null;
            for (var i = 0; i < res.touchSceneObjects.length; i++) {
                var targetSo = res.touchSceneObjects[i];
                if (targetSo.isMoving) {
                    // 同方向，不同速度时不用排除该对象（该对象视为障碍）
                    if (targetSo.moveTrendInfo && checker.isMoving && checker.moveTrendInfo) {
                        var targetSoOffsetX = targetSo.moveTrendInfo.to.x - targetSo.moveTrendInfo.from.x > 0 ? 1 : -1;
                        var targetSoOffsetY = targetSo.moveTrendInfo.to.y - targetSo.moveTrendInfo.from.y > 0 ? 1 : -1;
                        if (targetSoOffsetX == checkOffsetX && targetSoOffsetY == checkOffsetY && targetSo.moveSpeed != checker.moveSpeed) {
                            continue;
                        }
                    }
                    // 正在远离所在的格子坐标，不视为障碍
                    if (targetSo.moveRealInfo) {
                        if (!targetSo.moveRealInfo.to) {
                            continue;
                        }
                        var gridCenterP = GameUtils.getGridCenterByGrid(targetSo.posGrid);
                        var fromDis = Point.distanceSquare(targetSo.moveRealInfo.from, gridCenterP);
                        var toDis = Point.distanceSquare(targetSo.moveRealInfo.to, gridCenterP);
                        if (toDis > fromDis) {
                            res.touchSceneObjects.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                    // 检查者确定会离开该格子的话，则忽略掉前往检查者格子的对象以及已在该格子的对象
                    if (ignoreCheckGrid && targetSo.moveTrendInfo) {
                        // -- 已位于该格子的对象
                        if (targetSo.posGrid.x == posGridP.x && targetSo.posGrid.y == posGridP.y) {
                            res.touchSceneObjects.splice(i, 1);
                            i--;
                            continue;
                        }
                        // -- 忽略掉前往检查者格子的对象
                        if (!checkGridCenterP)
                            checkGridCenterP = GameUtils.getGridCenterByGrid(posGridP);
                        var fromDis = Point.distanceSquare(targetSo.moveTrendInfo.from, checkGridCenterP);
                        var toDis = Point.distanceSquare(targetSo.moveTrendInfo.to, checkGridCenterP);
                        if (toDis < fromDis) {
                            res.touchSceneObjects.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                }
                // 检查者确定会离开该格子的话,则忽略掉前已在该格子未移动的对象
                else if (ignoreCheckGrid) {
                    // -- 已位于该格子的对象
                    if (targetSo.posGrid.x == posGridP.x && targetSo.posGrid.y == posGridP.y) {
                        res.touchSceneObjects.splice(i, 1);
                        i--;
                        continue;
                    }
                }
            }
        }
        // 2.[非自定义碰撞体列表] 获取动态障碍的列表（非自定义碰触体）
        var checkObsSceneObjestArr = res.touchSceneObjects.concat();
        for (var i = 0; i < checkObsSceneObjestArr.length; i++) {
            var checkObsSceneObjest = checkObsSceneObjestArr[i];
            if (checkObsSceneObjest.avatar.id == 0) {
                checkObsSceneObjestArr.splice(i, 1);
                i--;
            }
        }
        var customCollisionArr = SoModule_CustomCollision.collisionTest(checker, false, trendP);
        if (customCollisionArr.length > 0) {
            for (var i = 0; i < customCollisionArr.length; i++) {
                var customCollisionInfo = customCollisionArr[i];
                // 记录为接触目标
                if (res.touchSceneObjects.indexOf(customCollisionInfo.so) == -1) {
                    res.touchSceneObjects.push(customCollisionInfo.so);
                    checkObsSceneObjestArr.push(customCollisionInfo.so);
                }
            }
        }
        // 4.获取固定的桥属性，如果存在则不计算障碍，返回
        var gridFixedBridge = null;
        if (trendPToGrid) {
            if (this.isFixedBridgeGrid(trendPToGrid))
                gridFixedBridge = true;
        }
        else if (this.isFixedBridgeGrid(posGridP))
            gridFixedBridge = true;
        if (gridFixedBridge)
            return res;
        // 5.获取动态的桥属性，如果存在则不计算障碍，返回
        var gridDynamicBridge = null;
        if (trendPToGrid) {
            if (this.getGridDynamicObsStatus(trendPToGrid) == 1)
                gridDynamicBridge = true;
        }
        else if (this.getGridDynamicObsStatus(posGridP) == 1)
            gridDynamicBridge = true;
        if (gridDynamicBridge)
            return res;
        // 6.判断是否含有动态障碍 和 固定障碍
        if (!checker.through) {
            // --- 动态障碍
            for (var i = 0; i < checkObsSceneObjestArr.length; i++) {
                var targetSo = checkObsSceneObjestArr[i];
                // -- 非自身
                if (targetSo != checker) {
                    // -- 发现目标拥有桥属性则直接返回，视为无障碍
                    if (targetSo.bridge) {
                        res.isObstacle = false;
                        return res;
                    }
                    // -- 目标非穿透属性 且 与检测者不存在禁止碰触的关系
                    if (!targetSo.through && !this.isBothBanCollision(checker, targetSo)) {
                        res.isObstacle = true;
                        return res;
                    }
                }
            }
            // ---- 固定障碍
            if (trendPToGrid) {
                if (this.isFixedObstacleGrid(trendPToGrid, false)) {
                    res.isObstacle = true;
                    return res;
                }
            }
            else if (this.isFixedObstacleGrid(posGridP, false)) {
                res.isObstacle = true;
                return res;
            }
        }
        return res;
    };
    /**
     * 碰撞检测-矩形包围盒版
     * 碰撞为了优化计算按照场景对象原点 + WorldData.sceneObjectCollisionSize-1 计算。
     * @param p
     * @param trendP
     * @param checker
     * @param isObstacle
     * @param touchSceneObjects
     */
    SceneUtils.prototype.collsionCheckRect = function (checker, p, trendP, gridP) {
        if (gridP === void 0) { gridP = null; }
        var res = { isObstacle: false, touchSceneObjects: [], alreadyCalcPosRect: false };
        // 不允许接触的场合
        if (!checker.touchEnabled)
            return res;
        var size = WorldData.sceneObjectCollisionSize;
        var fixedGridRangleOffset = size / 2;
        // 获取实际碰撞矩形尺寸
        if (!gridP)
            gridP = GameUtils.getGridPostion(p);
        // 边界碰撞的情况
        if (this.isOutside(p, true)) {
            res.isObstacle = true;
            return res;
        }
        // 检测者是否自定义碰撞体
        var checkerCCModule = checker.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
        var checkerIsCustomCollision = checkerCCModule != null;
        // 我的矩形包围盒（如果当前步不允许走的话回回退）
        checker.posRect.x = p.x;
        checker.posRect.y = p.y;
        checker.posRect.width = checker.posRect.height = size - 1;
        res.alreadyCalcPosRect = true;
        var pRect = checker.posRect;
        // 获取其所在的周围九个格子，中的玩家对象的RECT是否和与我有交集，有交集则算作碰到
        var targetGrid = new Point;
        var fixRect = new Rectangle(0, 0, Config.SCENE_GRID_SIZE - 1, Config.SCENE_GRID_SIZE - 1);
        var dirOffsetMapping = [[0, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
        var hasBridge = false;
        // 如果该格子已是固定桥属性则表示接触到了桥允许走出去
        if (this.isFixedBridgeGrid(gridP))
            hasBridge = true;
        else if (this.getGridDynamicObsStatus(gridP, checker, null, checker) == 1)
            hasBridge = true;
        // 当前格不是桥但再计算趋势格子是否是桥
        else {
            var trendPToGrid = new Point(gridP.x + Math.round(trendP.x - p.x), gridP.y + Math.round(trendP.y - p.y));
            if (!this.isOutsideByGrid(trendPToGrid)) {
                if (this.isFixedBridgeGrid(trendPToGrid))
                    hasBridge = true;
                else if (this.getGridDynamicObsStatus(trendPToGrid, checker, null, checker) == 1)
                    hasBridge = true;
            }
        }
        // 遍历周围九个格子：查询接触的对象
        for (var i = 0; i < dirOffsetMapping.length; i++) {
            var d = dirOffsetMapping[i];
            targetGrid.x = gridP.x + d[0];
            targetGrid.y = gridP.y + d[1];
            // 格子超出边界的情况下忽略掉
            if (this.isOutsideByGrid(targetGrid))
                continue;
            // 获取碰触的场景对象
            var gridSceneObjects = this.gridSceneObjects[targetGrid.x][targetGrid.y];
            var gridSceneObjectsLen = gridSceneObjects.length;
            // 遍历指定格子的所有场景对象
            for (var s = 0; s < gridSceneObjectsLen; s++) {
                var tSo = gridSceneObjects[s];
                // 不是自己的话
                if (tSo != checker) {
                    // 忽略掉跳跃中的对象
                    if (tSo.isJumping)
                        continue;
                    if (tSo.posRect == null)
                        continue;
                    // 自定义碰撞体-不在此计算（在下方）
                    var ccModule = tSo.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
                    if (ccModule && ccModule.isObstacle)
                        continue;
                    if (!res.isObstacle) {
                        // 如果checker是自定义碰撞体的话，则检测
                        if (checkerIsCustomCollision) {
                            if (checkerCCModule.collisionTestByNormalTarget(tSo)) {
                                if (res.touchSceneObjects.indexOf(tSo) == -1)
                                    res.touchSceneObjects.push(tSo);
                                if (!hasBridge) {
                                    if (tSo.bridge)
                                        hasBridge = true;
                                    else if (!checker.through && !tSo.through && tSo.avatar.id != 0) {
                                        if (this.isBothBanCollision(checker, tSo))
                                            continue;
                                        var d1 = Point.distanceSquare(tSo.pos, p);
                                        var d2 = Point.distanceSquare(tSo.pos, trendP);
                                        if (Config.SCENE_GRID_SIZE < fixedGridRangleOffset) {
                                            // 碰撞框小于格子的一半的情况下，趋势是远离我的话则不视为障碍
                                            var _toLeft = trendP.x < p.x;
                                            var _toRight = trendP.x > p.x;
                                            var _toTop = trendP.y < p.y;
                                            var _toBottom = trendP.y > p.y;
                                            if (_toLeft) {
                                                // 往左走
                                                if (dirOffsetMapping[i][0] === 1) {
                                                    continue;
                                                }
                                            }
                                            if (_toRight) {
                                                // 往右走
                                                if (dirOffsetMapping[i][0] === -1) {
                                                    continue;
                                                }
                                            }
                                            if (_toTop) {
                                                // 往上走
                                                if (dirOffsetMapping[i][1] === 1) {
                                                    continue;
                                                }
                                            }
                                            if (_toBottom) {
                                                // 往下走
                                                if (dirOffsetMapping[i][1] === -1) {
                                                    continue;
                                                }
                                            }
                                            if ((_toLeft && !_toBottom) || (_toTop && !_toRight)) {
                                                if (d2 > d1) {
                                                    res.isObstacle = true;
                                                }
                                            }
                                            else {
                                                if (d2 < d1) {
                                                    res.isObstacle = true;
                                                }
                                            }
                                            continue;
                                        }
                                        if (d2 < d1) {
                                            res.isObstacle = true;
                                        }
                                    }
                                }
                            }
                            continue;
                        }
                        // 检查矩形是否存在交集，存在交集的话添加到接触列表中
                        tSo.posRect.x = tSo.x;
                        tSo.posRect.y = tSo.y;
                        var tRect = tSo.posRect;
                        var jRect = tRect.intersection(pRect);
                        // 碰触到的情况
                        if (jRect && jRect.width > 0 && jRect.height > 0) {
                            if (res.touchSceneObjects.indexOf(tSo) == -1)
                                res.touchSceneObjects.push(tSo);
                            // 没有遇到桥的话还需要判定是否是动态桥或动态障碍
                            if (!hasBridge) {
                                // 该对象有桥属性，表示可以通行
                                if (tSo.bridge)
                                    hasBridge = true;
                                // 双方都不是穿透的话则视为障碍（但趋势是远离我的话则不视为障碍）
                                else if (!checker.through && !tSo.through && tSo.avatar.id != 0) {
                                    // -- 禁止碰撞的不再检测
                                    if (this.isBothBanCollision(checker, tSo))
                                        continue;
                                    var d1 = Point.distanceSquare(tSo.pos, p);
                                    var d2 = Point.distanceSquare(tSo.pos, trendP);
                                    if (d2 < d1) {
                                        res.isObstacle = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // 检查地图固定障碍：当此前未检测到障碍且当前格并没有遇到桥属性以及检查者非穿透模式的话
            if (!res.isObstacle && !hasBridge && !checker.through) {
                // 如果该格是地图障碍格的话
                if (this.isFixedObstacleGrid(targetGrid, false)) {
                    var targetGridPosX = targetGrid.x * Config.SCENE_GRID_SIZE + fixedGridRangleOffset;
                    var targetGridPosY = targetGrid.y * Config.SCENE_GRID_SIZE + fixedGridRangleOffset;
                    fixRect.x = targetGridPosX;
                    fixRect.y = targetGridPosY;
                    var jRect = fixRect.intersection(pRect);
                    // 碰触到的情况
                    if (jRect && jRect.width > 0 && jRect.height > 0) {
                        if (this.isFixedBridgeGrid(targetGrid)) {
                            hasBridge = true;
                            continue;
                        }
                        // 如果趋势是远离我的话则不视为障碍
                        var d1 = new Point(targetGridPosX, targetGridPosY).distance(p.x, p.y);
                        var d2 = new Point(targetGridPosX, targetGridPosY).distance(trendP.x, trendP.y);
                        if (d2 < d1) {
                            res.isObstacle = true;
                        }
                    }
                }
            }
        }
        // 追加自定义碰撞区域检测（checker与全自定义碰撞区进行检测）
        // -- 获取全部接触者
        var customCollisionArr = SoModule_CustomCollision.collisionTest(checker, false, trendP);
        if (customCollisionArr.length > 0) {
            for (var i = 0; i < customCollisionArr.length; i++) {
                var customCollisionInfo = customCollisionArr[i];
                // 记录为接触目标
                if (res.touchSceneObjects.indexOf(customCollisionInfo.so) == -1)
                    res.touchSceneObjects.push(customCollisionInfo.so);
                // 检查是否是障碍
                if (!hasBridge) {
                    // 该对象有桥属性，表示可以通行，该区域部视为障碍
                    if (customCollisionInfo.so.bridge)
                        hasBridge = true;
                    // 双方都不是穿透的话则视为障碍（但趋势是远离我的话则不视为障碍）
                    else if (!checker.through && !customCollisionInfo.so.through) {
                        // -- 禁止碰撞的不再检测
                        if (this.isBothBanCollision(checker, customCollisionInfo.so))
                            continue;
                        res.isObstacle = true;
                    }
                }
            }
        }
        if (hasBridge) {
            res.isObstacle = false;
        }
        return res;
    };
    return SceneUtils;
}());
/**
 * 自定义场景对象行为
 * 一个对象可能拥有多层行为，当前总是执行最后层的行为
 * 当行为播放完毕的时候根据循环决定是否重复播放或是清除行为
 * 当处于logicPause状态下时会不在继续执行后面的行为
 *
 * Created by 黑暗之神KDS on 2019-08-07 13:24:13.
 */
var ProjectSceneObjectBehaviors = /** @class */ (function (_super) {
    __extends(ProjectSceneObjectBehaviors, _super);
    /**
     * 构造函数
     * @param so 执行行为的场景对象
     * @param loop 是否循环
     * @param targetSceneObject 事件触发者
     * @param onOver 当行为执行完毕时回调 onOver(soBehavior:SceneObjectBehaviors)
     * @param startIndex [可选] 默认值=0 起始行为索引行
     * @param executor [可选] 默认值=null 事件执行者（也是行为派发者）
     */
    function ProjectSceneObjectBehaviors(so, loop, targetSceneObject, onOver, startIndex, executor) {
        if (startIndex === void 0) { startIndex = 0; }
        if (executor === void 0) { executor = null; }
        var _this = _super.call(this, so, loop, targetSceneObject, onOver, startIndex, executor) || this;
        // 记录模块参数，以便还原：1-影子
        if (Config.BEHAVIOR_EDIT_MODE) {
            var soModule_shadow = _this.so.getModule(1);
            if (soModule_shadow)
                _this.soModule_shadow_default = [soModule_shadow.shadowWidth, soModule_shadow.shadowHeight, soModule_shadow.shadowAlpha];
        }
        return _this;
    }
    Object.defineProperty(ProjectSceneObjectBehaviors.prototype, "logicPause", {
        /**
         * 逻辑用的暂停标识，比如行为在运动结束前不在执行下一步动作（如配合Game.pause的效果）
         * 实现类可以根据具体的游戏规则重写该属性，以便能够正确的暂停下一步行为执行
         * 如RPG中处于移动中的对象只有等待执行完毕后再继续执行：
         */
        // @ts-ignore
        get: function () {
            return (this.executeCommandPageFragment || this.so.isMoving || this.so.isJumping || this.isWaitingActionOver) ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 重置：还原到最初始的状态
     * 仅在行为编辑器预览使用，项目层需要实现行为的重置，以便预览时能够正确显示效果
     */
    ProjectSceneObjectBehaviors.prototype.reset = function (defSceneObejct) {
        // 模块初始化：1-影子
        if (this.soModule_shadow_default) {
            this.so.addModuleByID(1);
            var soModuleShadow = this.so.getModule(1);
            soModuleShadow.shadowWidth = this.soModule_shadow_default[0];
            soModuleShadow.shadowHeight = this.soModule_shadow_default[1];
            soModuleShadow.shadowAlpha = this.soModule_shadow_default[2];
        }
        else {
            this.so.removeModuleByID(1);
        }
        // 其他初始化
        this.so.stopMove();
        this.so.stopAllAnimation();
        ObjectUtils.clone(defSceneObejct, this.so);
        this.so.scene.camera.sceneObject = this.so;
        this.so.scene.updateCamera();
        this.so.refreshCoordinate();
    };
    //------------------------------------------------------------------------------------------------------
    // 行为处理
    //------------------------------------------------------------------------------------------------------
    /**
     * 设置行走图
     * 该行为系统内置，由项目层实现
     * @param avatarID 行走图ID
     * @param actID 动作
     * @param frame 帧数
     * @param ori  [可选] 默认值=null 表示面向
     */
    ProjectSceneObjectBehaviors.prototype.behavior0 = function (avatarID, actID, frame, ori) {
        if (ori === void 0) { ori = null; }
        this.so.avatarID = avatarID;
        this.so.avatarAct = actID;
        this.so.avatarFrame = frame;
        this.so.avatarOri = ori;
    };
    //------------------------------------------------------------------------------------------------------
    // 移动
    //------------------------------------------------------------------------------------------------------
    /** 向下移动一步 2 */
    ProjectSceneObjectBehaviors.prototype.behavior1 = function () {
        this.behaviorMoveD(0, 1);
    };
    /** 向左移动一步 4 */
    ProjectSceneObjectBehaviors.prototype.behavior2 = function () {
        this.behaviorMoveD(-1, 0);
    };
    /** 向上移动一步 8 */
    ProjectSceneObjectBehaviors.prototype.behavior3 = function () {
        this.behaviorMoveD(0, -1);
    };
    /** 向右移动一步 6 */
    ProjectSceneObjectBehaviors.prototype.behavior4 = function () {
        this.behaviorMoveD(1, 0);
    };
    /** 向左下移动一步 1 */
    ProjectSceneObjectBehaviors.prototype.behavior5 = function () {
        this.behaviorMoveD(-1, 1);
    };
    /** 向右下移动一步 3 */
    ProjectSceneObjectBehaviors.prototype.behavior6 = function () {
        this.behaviorMoveD(1, 1);
    };
    /** 向左上移动一步 7 */
    ProjectSceneObjectBehaviors.prototype.behavior7 = function () {
        this.behaviorMoveD(-1, -1);
    };
    /** 向右上移动一步 9 */
    ProjectSceneObjectBehaviors.prototype.behavior8 = function () {
        this.behaviorMoveD(1, -1);
    };
    /** 随机移动一步 */
    ProjectSceneObjectBehaviors.prototype.behavior9 = function () {
        var arr = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        if (!WorldData.moveDir4 && !this.so.behaviorDir4) {
            arr.push([-1, -1], [1, 1], [1, -1], [-1, 1]);
        }
        var dp = arr[MathUtils.rand(arr.length)];
        // 随机移动视为强制忽略无法移动的场合，需要在此次移动结束后恢复原来的状态
        var currentIgnoreCantMove = this.so.ignoreCantMove;
        this.so.ignoreCantMove = true;
        if (!currentIgnoreCantMove) {
            this.behaviors.splice(this.index, 0, [this.behavior37, [1, true, this.so.keepMoveActWhenCollsionObstacleAndIgnoreCantMove]]);
        }
        this.behaviorMoveD(dp[0], dp[1], true, true);
    };
    /** 靠近场景对象 */
    ProjectSceneObjectBehaviors.prototype.behavior10 = function (type, useVar, varID, soIndex, flip) {
        if (flip === void 0) { flip = 1; }
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        // 获取目标对象
        var targetSceneObject;
        if (type == 0)
            targetSceneObject = Game.player.sceneObject;
        else if (type == 1)
            targetSceneObject = this.targetSceneObject;
        else if (type == 2)
            targetSceneObject = this.executor;
        else {
            if (useVar == 1) {
                soIndex = Game.player.variable.getVariable(varID);
            }
            if (soIndex < 0)
                return;
            targetSceneObject = this.so.scene.sceneObjects[soIndex];
        }
        // 如果目标对象存在且不是自己的话则开始执行
        if (targetSceneObject && this.so != targetSceneObject) {
            var px = targetSceneObject.x - this.so.x;
            var py = targetSceneObject.y - this.so.y;
            if (Math.abs(px) < Config.SCENE_GRID_SIZE / 2)
                px = 0;
            if (Math.abs(py) < Config.SCENE_GRID_SIZE / 2)
                py = 0;
            var dx = px < 0 ? -1 : px == 0 ? 0 : 1;
            var dy = py < 0 ? -1 : py == 0 ? 0 : 1;
            if (ClientWorld.data.moveDir4 || this.so.behaviorDir4) {
                if (Math.abs(dx) == 1 && Math.abs(dy) == 1) {
                    px > py ? dy = 0 : dx = 0;
                }
            }
            this.behaviorMoveD(dx * flip, dy * flip);
        }
    };
    /** 远离玩家移动一步 */
    ProjectSceneObjectBehaviors.prototype.behavior11 = function (type, useVar, varID, soIndex) {
        this.behavior10(type, useVar, varID, soIndex, -1);
    };
    /** 移动至 */
    ProjectSceneObjectBehaviors.prototype.behavior12 = function (useVar, x, y, autoFindRoad, xVarID, yVarID, useGrid, relative, whenCantMoveRetry, moveToGridCenter, ifObstacleHandleMode, mode) {
        // 使用变量指定坐标的场合
        if (useVar == 1) {
            x = Game.player.variable.getVariable(xVarID);
            y = Game.player.variable.getVariable(yVarID);
            if (Config.BEHAVIOR_EDIT_MODE)
                return;
        }
        // 相对坐标
        if (relative) {
            if (!useGrid) {
                x += this.so.x;
                y += this.so.y;
            }
            else {
                if (!moveToGridCenter) {
                    x += this.so.x / Config.SCENE_GRID_SIZE;
                    y += this.so.y / Config.SCENE_GRID_SIZE;
                }
                else {
                    x += this.so.posGrid.x;
                    y += this.so.posGrid.y;
                }
            }
        }
        // 根据是否格子坐标计算实际到达的坐标点
        var toP = useGrid ? ((moveToGridCenter || !relative || !useGrid) ? GameUtils.getGridCenter(new Point(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE)) : new Point(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE)) : new Point(x, y);
        // 忽略范围外
        if (this.so.scene.sceneUtils.isOutside(toP)) {
            return;
        }
        // 行为编辑器模式下直接设置值
        if (this.ignoreProcess) {
            this.so.x = toP.x;
            this.so.y = toP.y;
        }
        else {
            // 移动
            if (mode == null) {
                // 自动寻路
                if (autoFindRoad) {
                    this.so.autoFindRoadMove(toP.x, toP.y, ifObstacleHandleMode, 0, true, whenCantMoveRetry, true, this.so.behaviorDir4);
                }
                // 直接去往
                else {
                    this.so.startMove([[toP.x, toP.y]], Game.oneFrame);
                }
            }
            // 跳跃/设置位置
            else {
                // 等待或忽略的情况:遇到障碍后
                if (ifObstacleHandleMode == 0 || ifObstacleHandleMode == 2) {
                    if (!this.so.through && this.so.scene.sceneUtils.isObstacle(toP, this.so)) {
                        if (ifObstacleHandleMode == 0)
                            this.index--;
                        return;
                    }
                }
                if (mode == 1)
                    this.so.jumpTo(toP.x, toP.y);
                else
                    this.so.setTo(toP.x, toP.y);
            }
        }
    };
    /** 跳跃至坐标 */
    ProjectSceneObjectBehaviors.prototype.behavior13 = function (useVar, x, y, xVarID, yVarID, useGrid, relative, ifObstacleHandleMode, moveToGridCenter) {
        this.behavior12(useVar, x, y, false, xVarID, yVarID, useGrid, relative, false, moveToGridCenter, ifObstacleHandleMode, 1);
    };
    /** 设置至坐标 */
    ProjectSceneObjectBehaviors.prototype.behavior14 = function (useVar, x, y, xVarID, yVarID, useGrid, relative, ifObstacleHandleMode, moveToGridCenter) {
        this.behavior12(useVar, x, y, false, xVarID, yVarID, useGrid, relative, false, moveToGridCenter, ifObstacleHandleMode, 2);
    };
    /** 等待 */
    ProjectSceneObjectBehaviors.prototype.behavior15 = function (useVar, waitF, waitFVarID) {
        if (useVar) {
            waitF = Game.player.variable.getVariable(waitFVarID);
            if (Config.BEHAVIOR_EDIT_MODE)
                waitF = 30;
        }
        this.waitFrame(waitF);
    };
    //------------------------------------------------------------------------------------------------------
    // 面向
    //------------------------------------------------------------------------------------------------------
    /** 面向朝下 */
    ProjectSceneObjectBehaviors.prototype.behavior16 = function () {
        this.so.avatarOri = 2;
    };
    /** 面向朝左 */
    ProjectSceneObjectBehaviors.prototype.behavior17 = function () {
        this.so.avatarOri = 4;
    };
    /** 面向朝上 */
    ProjectSceneObjectBehaviors.prototype.behavior18 = function () {
        this.so.avatarOri = 8;
    };
    /** 面向朝右 */
    ProjectSceneObjectBehaviors.prototype.behavior19 = function () {
        this.so.avatarOri = 6;
    };
    /** 面向朝左下 */
    ProjectSceneObjectBehaviors.prototype.behavior20 = function () {
        this.so.avatarOri = 1;
    };
    /** 面向朝右下 */
    ProjectSceneObjectBehaviors.prototype.behavior21 = function () {
        this.so.avatarOri = 3;
    };
    /** 面向朝左上 */
    ProjectSceneObjectBehaviors.prototype.behavior22 = function () {
        this.so.avatarOri = 7;
    };
    /** 面向朝右上 */
    ProjectSceneObjectBehaviors.prototype.behavior23 = function () {
        this.so.avatarOri = 9;
    };
    /** 随机朝向 */
    ProjectSceneObjectBehaviors.prototype.behavior24 = function () {
        var arr = [2, 4, 6, 8];
        if (!WorldData.moveDir4 && !this.so.behaviorDir4) {
            arr.push(1, 3, 7, 9);
        }
        this.so.avatarOri = arr[MathUtils.rand(arr.length)];
    };
    /** 面向指定的场景对象 */
    ProjectSceneObjectBehaviors.prototype.behavior25 = function (type, useVar, soIndexVarID, soIndex, isFlip) {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        // 获取目标对象
        var targetSceneObject;
        if (type == 0)
            targetSceneObject = Game.player.sceneObject;
        else if (type == 1)
            targetSceneObject = this.targetSceneObject;
        else if (type == 2)
            targetSceneObject = this.executor;
        else {
            if (useVar) {
                soIndex = Game.player.variable.getVariable(soIndexVarID);
            }
            if (soIndex < 0)
                return;
            targetSceneObject = this.so.scene.sceneObjects[soIndex];
        }
        if (!targetSceneObject)
            return;
        var angle = MathUtils.direction360(this.so.x, this.so.y, targetSceneObject.x, targetSceneObject.y);
        var ori = GameUtils.getOriByAngle(angle);
        this.so.avatarOri = isFlip ? GameUtils.getFlipOri(ori) : ori;
    };
    /** 背向指定的场景对象 */
    ProjectSceneObjectBehaviors.prototype.behavior26 = function (type, useVar, soIndexVarID, soIndex) {
        this.behavior25(type, useVar, soIndexVarID, soIndex, true);
    };
    /** 使用变量指定面向 */
    ProjectSceneObjectBehaviors.prototype.behavior27 = function (oriVarID) {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        var ori = Game.player.variable.getVariable(oriVarID);
        this.so.avatarOri = ori;
    };
    //------------------------------------------------------------------------------------------------------
    // 行走图相关
    //------------------------------------------------------------------------------------------------------
    /** 更改体型 */
    ProjectSceneObjectBehaviors.prototype.behavior28 = function (useVar, v, varID) {
        if (useVar) {
            v = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                v = 1;
        }
        this.so.scale = v;
    };
    /** 更改移动速度 */
    ProjectSceneObjectBehaviors.prototype.behavior29 = function (useVar, v, varID) {
        if (useVar) {
            v = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                v = 200;
        }
        this.so.moveSpeed = v;
    };
    /** 更改透明度 */
    ProjectSceneObjectBehaviors.prototype.behavior30 = function (useVar, v, varID) {
        if (useVar) {
            v = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                v = 1;
        }
        this.so.avatarAlpha = v;
    };
    /** 更改色相 */
    ProjectSceneObjectBehaviors.prototype.behavior31 = function (useVar, v, varID) {
        if (useVar) {
            v = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                v = 0;
        }
        this.so.avatarHue = v;
    };
    /** 更改动作播放帧率 */
    ProjectSceneObjectBehaviors.prototype.behavior32 = function (useVar, v, varID) {
        if (useVar) {
            v = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                v = 12;
        }
        this.so.avatarFPS = v;
    };
    /** 更改影子 */
    ProjectSceneObjectBehaviors.prototype.behavior33 = function (enabled, w, h, alpha) {
        if (enabled) {
            var soModule = this.so.getModule(1);
            if (!soModule)
                soModule = this.so.addModuleByID(1);
            if (soModule) {
                var soModule_shadow = soModule;
                soModule_shadow.shadowWidth = w;
                soModule_shadow.shadowHeight = h;
                soModule_shadow.shadowAlpha = alpha;
                soModule_shadow.refresh();
            }
        }
        else {
            this.so.removeModuleByID(1);
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 媒体
    //------------------------------------------------------------------------------------------------------
    /** 播放动画 */
    ProjectSceneObjectBehaviors.prototype.behavior34 = function (aniID, showHitEffect, loop, fps, useVar, varID, waitOver) {
        var _this = this;
        if (useVar) {
            aniID = Game.player.variable.getVariable(varID);
            if (Config.BEHAVIOR_EDIT_MODE)
                aniID = 0;
        }
        var ani = this.so.playAnimation(aniID, loop, showHitEffect ? true : false, fps);
        if (ani && waitOver) {
            this.isWaitingActionOver = true;
            ani.once(GCAnimation.PLAY_COMPLETED, this, function () {
                _this.isWaitingActionOver = false;
                _this.update();
            });
        }
    };
    /** 停止动画 */
    ProjectSceneObjectBehaviors.prototype.behavior35 = function (useVar, aniID, varID) {
        if (useVar && !Config.BEHAVIOR_EDIT_MODE)
            aniID = Game.player.variable.getVariable(varID);
        this.so.stopAnimation(aniID);
    };
    /** 播放音效 */
    ProjectSceneObjectBehaviors.prototype.behavior36 = function (url, varID, useVar) {
        if (this.ignoreProcess)
            return;
        url = useVar == 1 ? Game.player.variable.getString(varID) : url;
        GameAudio.playSE(url, 1, 1, this.so);
    };
    //------------------------------------------------------------------------------------------------------
    // 状态
    //------------------------------------------------------------------------------------------------------
    /**
     * 忽略不能移动的场合
     * @param v 是否忽略不能移动的场合 0=ON 1=OFF
     * @param keepMoveActWhenCollsionObstacleAndIgnoreCantMove
     * @param systemRecovery 来自系统恢复还原此前的设置
     */
    ProjectSceneObjectBehaviors.prototype.behavior37 = function (v, keepMoveActWhenCollsionObstacleAndIgnoreCantMove, systemRecovery) {
        this.so.ignoreCantMove = v == 0 ? true : false;
        this.so.keepMoveActWhenCollsionObstacleAndIgnoreCantMove = keepMoveActWhenCollsionObstacleAndIgnoreCantMove;
        if (systemRecovery) {
            this.behaviors.splice(this.index - 1, 1);
            this.index--;
        }
    };
    /** 允许选中 */
    ProjectSceneObjectBehaviors.prototype.behavior38 = function (v) {
        this.so.selectEnabled = v == 0 ? true : false;
    };
    /** 固定朝向 */
    ProjectSceneObjectBehaviors.prototype.behavior39 = function (v) {
        this.so.fixOri = v == 0 ? true : false;
    };
    /** 更改显示层次 */
    ProjectSceneObjectBehaviors.prototype.behavior40 = function (v) {
        this.so.layerLevel = v;
    };
    /** 桥属性 */
    ProjectSceneObjectBehaviors.prototype.behavior41 = function (v) {
        this.so.bridge = v == 0 ? true : false;
    };
    /** 自动播放动作 */
    ProjectSceneObjectBehaviors.prototype.behavior42 = function (v) {
        this.so.autoPlayEnable = v == 0 ? true : false;
    };
    /** 移动时自动切换动作 */
    ProjectSceneObjectBehaviors.prototype.behavior43 = function (v) {
        this.so.moveAutoChangeAction = v == 0 ? true : false;
    };
    /** 穿透 */
    ProjectSceneObjectBehaviors.prototype.behavior44 = function (v) {
        this.so.through = v == 0 ? true : false;
    };
    /** 限定四方向 */
    ProjectSceneObjectBehaviors.prototype.behavior45 = function (v) {
        this.so.behaviorDir4 = v == 0 ? true : false;
    };
    //------------------------------------------------------------------------------------------------------
    // 行走图
    //------------------------------------------------------------------------------------------------------
    /** 更改行走图ID */
    ProjectSceneObjectBehaviors.prototype.behavior46 = function (useVar, avatarID, avatarIDVarID) {
        this.so.avatarID = useVar ? Game.player.variable.getVariable(avatarIDVarID) : avatarID;
    };
    /** 更改动作 */
    ProjectSceneObjectBehaviors.prototype.behavior47 = function (useVar, actionID, actionIDVarID, once, waitOver) {
        var _this = this;
        var actID = useVar ? Game.player.variable.getVariable(actionIDVarID) : actionID;
        if (once) {
            if (this.so.avatar.hasActionID(actID)) {
                if (waitOver) {
                    this.isWaitingActionOver = true;
                }
                this.so.avatar.currentFrame = this.so.avatar.currentFrame % this.so.avatar.totalFrame;
                this.so.avatar.once(Avatar.ACTION_PLAY_COMPLETED, this, function () {
                    _this.so.avatarFrame = _this.so.avatar.totalFrame;
                    _this.so.autoPlayEnable = false;
                    _this.isWaitingActionOver = false;
                });
            }
        }
        this.so.avatarAct = useVar ? Game.player.variable.getVariable(actionIDVarID) : actionID;
    };
    /** 更改帧 */
    ProjectSceneObjectBehaviors.prototype.behavior48 = function (useVar, frame, frameVarID) {
        this.so.avatarFrame = useVar ? Game.player.variable.getVariable(frameVarID) : frame;
    };
    //------------------------------------------------------------------------------------------------------
    // 其他
    //------------------------------------------------------------------------------------------------------
    /** 事件页：触发者-事件触发者 执行者-自身 */
    ProjectSceneObjectBehaviors.prototype.behavior49 = function (feData) {
        var _this = this;
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        this.executeCommandPageFragment = true;
        CommandPage.startTriggerFragmentEvent(feData, this.targetSceneObject, this.executor, Callback.New(function () {
            _this.executeCommandPageFragment = false;
            _this.sceneObjectUpdate();
        }, this));
    };
    /** 编辑器预览 */
    ProjectSceneObjectBehaviors.prototype.behavior50 = function (x, y, avatarID, actionID, ori, usePos, useAvatarID, useActionID, useOri, isGrid) {
        if (!Config.BEHAVIOR_EDIT_MODE)
            return;
        if (usePos) {
            this.so.x = isGrid ? x * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2 : x;
            this.so.y = isGrid ? y * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2 : y;
        }
        if (useAvatarID) {
            this.so.avatarID = avatarID;
        }
        if (useActionID) {
            this.so.avatarAct = actionID;
        }
        if (useOri) {
            var mappings = [8, 2, 4, 6, 7, 1, 9, 3];
            this.so.avatarOri = mappings[ori];
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 内部方法
    //------------------------------------------------------------------------------------------------------
    ProjectSceneObjectBehaviors.prototype.behaviorMoveD = function (dx, dy, forceIgnoreCantMove, checkObstacle) {
        if (forceIgnoreCantMove === void 0) { forceIgnoreCantMove = false; }
        if (checkObstacle === void 0) { checkObstacle = false; }
        if (!this.so.scene)
            return;
        var toGrid = GameUtils.getGridPostion(new Point(this.so.x, this.so.y));
        toGrid.x += dx;
        toGrid.y += dy;
        // 步进统一进入到格子中心点
        var toP = new Point(toGrid.x * Config.SCENE_GRID_SIZE, toGrid.y * Config.SCENE_GRID_SIZE);
        toP = GameUtils.getGridCenter(toP);
        var hasObs = false;
        // 无需移动的情况
        if (dx == 0 && dy == 0) {
            hasObs = true;
        }
        else {
            // -- 行为编辑器中需要计算障碍的情况
            if (Config.BEHAVIOR_EDIT_MODE || checkObstacle) {
                if (!this.so.through) {
                    if (this.so.scene.sceneUtils.isObstacleGrid(toGrid, this.so)) {
                        hasObs = true;
                    }
                }
                // -- 需要计算边界
                else {
                    if (this.so.scene.sceneUtils.isOutsideByGrid(toGrid)) {
                        hasObs = true;
                    }
                }
            }
        }
        if (hasObs) {
            // 如果不是忽略无法移动的场合则等待
            if (!this.so.ignoreCantMove && !forceIgnoreCantMove) {
                this.index--;
            }
            return;
        }
        // -- 判断是否允许移动的情况
        if (this.ignoreProcess) {
            if (!this.so.fixOri)
                this.so.avatarOri = GameUtils.getOriByAngle(MathUtils.direction360(this.so.x, this.so.y, toP.x, toP.y));
            this.so.x = toP.x;
            this.so.y = toP.y;
        }
        else {
            // 移动结束后立即更新一下当前的行为执行者
            this.so.startMove([[toP.x, toP.y]], Game.oneFrame, WorldData.moveToGridCenter, Callback.New(this.sceneObjectUpdate, this));
        }
    };
    /**
     * 刷新场景对象
     */
    ProjectSceneObjectBehaviors.prototype.sceneObjectUpdate = function () {
        this.so.update(Game.now);
    };
    return ProjectSceneObjectBehaviors;
}(SceneObjectBehaviors));
SceneObjectBehaviors.implClass = ProjectSceneObjectBehaviors;
/**
 * 按钮组焦点管理器
 * 进入新的焦点时可以保留原焦点显示，但动画将会停止
 * 退出焦点时焦点显示会移除
 * Created by 黑暗之神KDS on 2020-09-21 18:41:20.
 */
var FocusButtonsManager = /** @class */ (function () {
    /**
     * 构造函数
     * @param ui 所属界面
     * @param isAutoFocus 是否自动选择根容器的第一层子节点中的所有按钮组件作为按键焦点集
     * @param addButtons 额外追加的按钮
     * @param excludeButtons 自动选择后希望剔除掉的按钮
     * @param selEffectUI 选中时皮肤界面的组件
     * @param useFocusAnimation 是否使用焦点动画
     * @param shortcutKeyExit [可选] 默认值=false 快捷键退出
     * @param whenExitBackLastFocus [可选] 默认值=false 当退出时回到上一个焦点
     */
    function FocusButtonsManager(ui, isAutoFocus, addButtons, excludeButtons, selEffectUIID, useFocusAnimation, shortcutKeyExit, whenExitBackLastFocus, autoFocusType, autoFocusParentCompName) {
        if (shortcutKeyExit === void 0) { shortcutKeyExit = false; }
        if (whenExitBackLastFocus === void 0) { whenExitBackLastFocus = false; }
        if (autoFocusType === void 0) { autoFocusType = 0; }
        if (autoFocusParentCompName === void 0) { autoFocusParentCompName = null; }
        /**
         * 是否已经按下确认键
         */
        this.keyDownEnter = false;
        /**
         * 是否已按下取消键
         */
        this.keyDownEsc = false;
        /**
         * 可作为焦点的按钮集
         */
        this.buttons = [];
        /**
         * 按钮位置信息
         */
        this.btnInfos = [];
        // 记录
        this.ui = ui;
        // 计算可作为焦点的按钮集
        var buttons = this.buttons;
        if (isAutoFocus) {
            if (autoFocusType == 0) {
                for (var i = 0; i < ui.numChildren; i++) {
                    var comp = ui.getChildAt(i);
                    if (comp instanceof UIButton && comp.visible)
                        buttons.push(comp);
                }
            }
            else {
                var parentComp = ui[autoFocusParentCompName];
                if (parentComp) {
                    for (var i = 0; i < parentComp.numChildren; i++) {
                        var comp = parentComp.getChildAt(i);
                        if (comp instanceof UIButton && comp.visible)
                            buttons.push(comp);
                    }
                }
            }
        }
        for (var i = 0; i < addButtons.length; i++) {
            var buttonName = addButtons[i];
            var comp = ui[buttonName];
            if (comp && comp instanceof UIButton && comp.visible)
                buttons.push(comp);
        }
        for (var i = 0; i < excludeButtons.length; i++) {
            var buttonName = excludeButtons[i];
            var comp = ui[buttonName];
            if (comp && comp instanceof UIButton) {
                var idx = buttons.indexOf(comp);
                if (idx != -1)
                    buttons.splice(idx, 1);
            }
        }
        // 去重
        ArrayUtils.removeSameObject(buttons);
        if (buttons.length == 0)
            return;
        // 选中效果
        this.selEffectUI = GameUI.load(selEffectUIID, true);
        if (this.selEffectUI) {
            if (this.selEffectUI["target"])
                this.selEffectTargetComp = this.selEffectUI["target"];
            for (var i = 0; i < this.selEffectUI.numChildren; i++) {
                if (this.selEffectUI.getChildAt(i) instanceof UIBase) {
                    this.selEffectUI = this.selEffectUI.getChildAt(i);
                    break;
                }
            }
        }
        // 如果需要选中皮肤的动画时，判断存在选中界面和target属性的话则绑定动画效果，利用动画的目标效果制作特效
        if (this.selEffectUI && this.selEffectTargetComp && useFocusAnimation && WorldData.uiCompFocusAnimation) {
            var uiCompFocusAnimation = this.uiCompFocusAnimation = new GCAnimation;
            uiCompFocusAnimation.id = WorldData.uiCompFocusAnimation;
            uiCompFocusAnimation.target = this.selEffectTargetComp;
            uiCompFocusAnimation.loop = true;
        }
        if (this.selEffectUI)
            this.selEffectUI.mouseEnabled = false;
        this.shortcutKeyExit = shortcutKeyExit;
        this.whenExitBackLastFocus = whenExitBackLastFocus;
    }
    //------------------------------------------------------------------------------------------------------
    // 设置焦点
    //------------------------------------------------------------------------------------------------------
    /**
     * 管理器初始化
     */
    FocusButtonsManager.init = function () {
        if (this.inited)
            return;
        this.inited = true;
        // 当列表焦点改变时
        EventUtils.addEventListener(UIList, UIList.EVENT_FOCUS_CHANGE, Callback.New(function (lastFocus, currentFocus) {
            // 如果存在列表焦点，且当前存在按钮焦点的话，取消按钮焦点
            if (currentFocus && FocusButtonsManager._focus) {
                FocusButtonsManager._focus.deactivate();
                FocusButtonsManager._focus = null;
            }
        }, this));
    };
    Object.defineProperty(FocusButtonsManager, "focus", {
        get: function () {
            return FocusButtonsManager._focus;
        },
        /**
         * 焦点设置和获取
         * @param btnFocusManager 按钮组焦点
         */
        set: function (btnFocusManager) {
            if (!WorldData.focusEnabled)
                return;
            FocusButtonsManager.init();
            // 清空LIST焦点
            UIList.focus = null;
            // 取消激活上一个焦点
            var lastFocus = FocusButtonsManager._focus;
            if (lastFocus) {
                lastFocus.deactivate();
                FocusButtonsManager._focus = null;
            }
            if (btnFocusManager) {
                FocusButtonsManager._focus = btnFocusManager;
                btnFocusManager.activate(lastFocus);
            }
            EventUtils.happen(FocusButtonsManager, FocusButtonsManager.EVENT_CHANGE_FOCUS, [lastFocus, btnFocusManager]);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 关闭
     */
    FocusButtonsManager.closeFocus = function () {
        if (FocusButtonsManager.focus) {
            if (FocusButtonsManager.focus.selEffectUI)
                FocusButtonsManager.focus.selEffectUI.removeSelf();
            FocusButtonsManager.focus.selBtn = null;
            FocusButtonsManager.focus.deactivate();
            FocusButtonsManager.focus = null;
        }
    };
    /**
     * 按钮处于焦点中的状态
     * @param btn 按钮
     * @return [number] 0-未启用焦点或未在该焦点组中 1-已在该焦点组中，但未选中 2-已在该焦点组中同时也选中了
     */
    FocusButtonsManager.inFocusState = function (btn) {
        if (!FocusButtonsManager.focus || FocusButtonsManager.focus.buttons.indexOf(btn) == -1)
            return 0;
        return FocusButtonsManager.focus.selBtn.btn == btn ? 2 : 1;
    };
    /**
     * 选中焦点
     * @param btn 按钮
     */
    FocusButtonsManager.setFocusButton = function (btn) {
        if (!FocusButtonsManager.focus)
            return true;
        var selBtnInfo = ArrayUtils.matchAttributes(FocusButtonsManager.focus.btnInfos, { btn: btn }, true)[0];
        if (selBtnInfo)
            FocusButtonsManager.focus.selectButton(selBtnInfo);
    };
    /**
     * 销毁
     */
    FocusButtonsManager.prototype.dispose = function () {
        if (this.selBtn) {
            var e = new EventObject;
            e.type = EventObject.MOUSE_OUT;
            e.target = this.selBtn.btn;
            this.selBtn.btn.event(EventObject.MOUSE_OUT, [e]);
        }
        if (this.uiCompFocusAnimation)
            this.uiCompFocusAnimation.dispose();
        if (this.selEffectUI)
            this.selEffectUI.dispose();
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
    };
    Object.defineProperty(FocusButtonsManager.prototype, "selectedIndex", {
        /**
         * 获取和设置按钮索引
         */
        get: function () {
            if (!this.selBtn)
                return -1;
            return this.realButtons.indexOf(this.selBtn.btn);
        },
        set: function (v) {
            if (FocusButtonsManager.focus != this)
                return;
            this.selectButton(this.btnInfos[v]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusButtonsManager.prototype, "realButtons", {
        /**
         * 获取实际存在的焦点按钮（可能焦点按钮不再显示了）
         */
        get: function () {
            var buttons = this.buttons.concat();
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                if (!btn.stage || !btn.visible) {
                    buttons.splice(i, 1);
                    i--;
                    continue;
                }
            }
            return buttons;
        },
        enumerable: false,
        configurable: true
    });
    //------------------------------------------------------------------------------------------------------
    // 私有
    //------------------------------------------------------------------------------------------------------
    /**
     * 选中按钮
     * @param btn
     * @param btnPos
     */
    FocusButtonsManager.prototype.selectButton = function (selBtnInfo) {
        if (this.selBtn && this.selBtn && this.selBtn.btn) {
            var e_1 = new EventObject;
            e_1.type = EventObject.MOUSE_OUT;
            e_1.target = this.selBtn.btn;
            this.selBtn.btn.event(EventObject.MOUSE_OUT, [e_1]);
        }
        // 设置选中的组件记录
        this.selBtn = selBtnInfo;
        // 根据预设target决定皮肤的宽高设置
        if (!selBtnInfo || !selBtnInfo.btn)
            return;
        if (this.selEffectTargetComp) {
            this.selEffectTargetComp.width = selBtnInfo.btn.width;
            this.selEffectTargetComp.height = selBtnInfo.btn.height;
        }
        else if (this.selEffectUI) {
            this.selEffectUI.width = selBtnInfo.btn.width;
            this.selEffectUI.height = selBtnInfo.btn.height;
        }
        if (this.selEffectUI) {
            selBtnInfo.btn.addChildAt(this.selEffectUI, 1);
        }
        var e = new EventObject;
        e.type = EventObject.MOUSE_OVER;
        e.target = selBtnInfo.btn;
        selBtnInfo.btn.event(EventObject.MOUSE_OVER, [e]);
    };
    /**
     * 激活
     */
    FocusButtonsManager.prototype.activate = function (lastFocus) {
        var _this = this;
        if (lastFocus === void 0) { lastFocus = null; }
        var buttons = this.realButtons;
        var ui = this.ui;
        if (ui.isDisposed || !ui.stage)
            return;
        // 计算位置信息
        var btnInfos = this.btnInfos = [];
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            // 转为同一个坐标系，方便比较
            var btnPos = ui.globalToLocal(btn.localToGlobal(new Point(0, 0)));
            btnInfos.push({ btn: btn, btnPos: btnPos });
        }
        // 如果没有选中组件或已选中的组件已不在该界面里了的话则开始选中组件
        if (!this.selBtn || !this.selBtn.btn.isInherit(ui)) {
            // 找到组件开始选中最上边的进行选中(都一样的话则选择最左边的)
            btnInfos.sort(function (a, b) {
                if (a.btnPos.y == b.btnPos.y)
                    return a.btnPos.x < b.btnPos.x ? -1 : 1;
                return a.btnPos.y < b.btnPos.y ? -1 : 1;
            });
            var selBtnInfo = btnInfos[0];
            this.selectButton(selBtnInfo);
        }
        // 更新 this.selBtn
        var idx = ArrayUtils.matchAttributes(btnInfos, { btn: this.selBtn.btn }, true, "==", true)[0];
        this.selBtn = btnInfos[idx];
        if (this.uiCompFocusAnimation)
            this.uiCompFocusAnimation.play();
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
        stage.off(EventObject.KEY_UP, this, this.onKeyUp);
        stage.on(EventObject.KEY_UP, this, this.onKeyUp);
        // 监听当该界面关闭时激活上一个按钮组
        if (lastFocus && this.whenExitBackLastFocus) {
            this.lastFocus = lastFocus;
            this.onExitBackLastFocusCB = Callback.New(function (myUI, lastFocus, uiID) {
                if (uiID == myUI.guiID) {
                    _this.recoveryLastFocus();
                    EventUtils.removeEventListener(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, _this.onExitBackLastFocusCB);
                }
            }, this, [this.ui, lastFocus]);
            EventUtils.addEventListener(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, this.onExitBackLastFocusCB);
        }
        EventUtils.happen(FocusButtonsManager, FocusButtonsManager.EVENT_ACTIVATE, [this]);
    };
    /**
     * 取消激活
     */
    FocusButtonsManager.prototype.deactivate = function () {
        if (this.uiCompFocusAnimation)
            this.uiCompFocusAnimation.stop(this.uiCompFocusAnimation.currentFrame);
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
        EventUtils.happen(FocusButtonsManager, FocusButtonsManager.EVENT_UNACTIVATE, [this]);
    };
    /**
     * 当按键按下时
     * @param e
     */
    FocusButtonsManager.prototype.onKeyDown = function (e) {
        // 已不在舞台的情况或对话框显示的情况则忽略掉操作
        if (!this.selBtn || !this.ui.stage || GameDialog.isInDialog)
            return;
        var realButtons = this.realButtons;
        // left
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            var idx = this.selBtn ? realButtons.indexOf(this.selBtn.btn) : -1;
            var toIdx = ProjectUtils.groupElementsMoveIndex(realButtons, idx, 4);
            if (toIdx != null) {
                var newSelBtnInfo = ArrayUtils.matchAttributes(this.btnInfos, { btn: realButtons[toIdx] }, true)[0];
                this.selectButton(newSelBtnInfo);
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
        }
        // right
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            var idx = this.selBtn ? realButtons.indexOf(this.selBtn.btn) : -1;
            var toIdx = ProjectUtils.groupElementsMoveIndex(realButtons, idx, 6);
            if (toIdx != null) {
                var newSelBtnInfo = ArrayUtils.matchAttributes(this.btnInfos, { btn: realButtons[toIdx] }, true)[0];
                this.selectButton(newSelBtnInfo);
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
        }
        // up
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.UP)) {
            var idx = this.selBtn ? realButtons.indexOf(this.selBtn.btn) : -1;
            var toIdx = ProjectUtils.groupElementsMoveIndex(realButtons, idx, 8);
            if (toIdx != null) {
                var newSelBtnInfo = ArrayUtils.matchAttributes(this.btnInfos, { btn: realButtons[toIdx] }, true)[0];
                this.selectButton(newSelBtnInfo);
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
        }
        // down
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.DOWN)) {
            var idx = this.selBtn ? realButtons.indexOf(this.selBtn.btn) : -1;
            var toIdx = ProjectUtils.groupElementsMoveIndex(realButtons, idx, 2);
            if (toIdx != null) {
                var newSelBtnInfo = ArrayUtils.matchAttributes(this.btnInfos, { btn: realButtons[toIdx] }, true)[0];
                this.selectButton(newSelBtnInfo);
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
        }
        // enter
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
            if (!this.keyDownEnter) {
                this.keyDownEnter = true;
                this.selBtn.btn.event(EventObject.CLICK);
            }
        }
        // exit：当允许使用快捷键关闭界面的场合 
        else if (this.shortcutKeyExit && GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.B)) {
            if (!this.keyDownEsc) {
                this.keyDownEsc = true;
                var recoverySuccess = this.recoveryLastFocus();
                if (recoverySuccess)
                    GameAudio.playSE(WorldData.cancelSE);
            }
        }
    };
    /**
     * 弹起按键时事件
     * @param e
     */
    FocusButtonsManager.prototype.onKeyUp = function (e) {
        // 弹起ENTER键时允许ENTER再次按下，以避免按下时自动连续调用多次的问题
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
            this.keyDownEnter = false;
        }
        // 弹起ESC键时允许ESC再次按下，以避免按下时自动连续调用多次的问题
        else if (this.shortcutKeyExit && GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.B)) {
            this.keyDownEsc = false;
        }
    };
    /**
     * 恢复上个焦点
     * -- 该界面被关闭时
     * -- 退出焦点时
     */
    FocusButtonsManager.prototype.recoveryLastFocus = function () {
        if (FocusButtonsManager.focus != this)
            return false;
        if (!this.whenExitBackLastFocus || (this.lastFocus && this.lastFocus.ui && this.lastFocus.ui.stage)) {
            if (FocusButtonsManager._focus) {
                if (FocusButtonsManager._focus.selEffectUI) {
                    FocusButtonsManager._focus.selEffectUI.removeSelf();
                }
                FocusButtonsManager._focus.selBtn = null;
                FocusButtonsManager._focus.deactivate();
            }
            FocusButtonsManager._focus = this.lastFocus;
            if (this.lastFocus)
                this.lastFocus.activate();
            // 执行事件
            if (this.whenExitEvent) {
                CommandPage.startTriggerFragmentEvent(this.whenExitEvent, Game.player.sceneObject, Game.player.sceneObject);
            }
            return true;
        }
        return false;
    };
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：改变焦点时事件
     * onChangeFocus(lastButtonFocus:FocusButtonsManager,newButtonFocus:FocusButtonsManager);
     */
    FocusButtonsManager.EVENT_CHANGE_FOCUS = "FocusButtonsEVENT_CHANGE_FOCUS";
    /**
     * 事件：激活焦点事件
     * onActivateFocus(buttonFocus:FocusButtonsManager);
     */
    FocusButtonsManager.EVENT_ACTIVATE = "FocusButtonsManagerEVENT_ACTIVATE";
    /**
     * 事件：取消激活焦点事件
     * onUnActivateFocus(buttonFocus:FocusButtonsManager);
     */
    FocusButtonsManager.EVENT_UNACTIVATE = "FocusButtonsManagerEVENT_UNACTIVATE";
    return FocusButtonsManager;
}());
/**
 * 游戏UI管理器
 * Created by 黑暗之神KDS on 2020-03-17 02:20:53.
 */
var GUI_Manager = /** @class */ (function () {
    function GUI_Manager() {
    }
    //------------------------------------------------------------------------------------------------------
    // 标准化组件
    //------------------------------------------------------------------------------------------------------
    /**
     * 标准化列表LIST
     * -- 键位滚动至可见区域
     */
    GUI_Manager.standardList = function (list, useItemClickSe) {
        if (useItemClickSe === void 0) { useItemClickSe = true; }
        list.on(EventObject.CHANGE, this, function (list, state) {
            if (state == 0)
                list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, function (list) {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    };
    /**
     * 标准化标签栏
     * -- 快捷键
     * @param tab
     */
    GUI_Manager.standardTab = function (tab) {
        stage.on(EventObject.KEY_DOWN, tab, GUI_Manager.onStandardTabKeyDown, [tab]);
        tab["__lastIdx"] = tab.selectedIndex;
        tab.on(EventObject.CHANGE, this, function (tab) {
            var lastIndex = tab["__lastIdx"];
            if (lastIndex >= 0) {
                GameAudio.playSE(ClientWorld.data.selectSE);
            }
            tab["__lastIdx"] = tab.selectedIndex;
        }, [tab]);
    };
    /**
     * 注册鼠标点击区域后激活指定的列表
     * @param area 区域
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     * @param onFocus [可选] 默认值=null 当产生焦点时回调
     * @param thisPtr [可选] 默认值=null 当产生焦点时回调的作用域
     */
    GUI_Manager.regHitAreaFocusList = function (area, list, playSureSE, onFocus, thisPtr) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (onFocus === void 0) { onFocus = null; }
        if (thisPtr === void 0) { thisPtr = null; }
        list.on(UIList.ITEM_CREATE, this, hitAreaFocusListCallback);
        function hitAreaFocusListCallback(ui, data, index) {
            ui.on(EventObject.MOUSE_DOWN, this, function (e) { e.stopPropagation(); });
        }
        area.on(EventObject.MOUSE_DOWN, GUI_Manager, function (list, playSureSE) {
            onFocus && onFocus.apply(thisPtr);
            GUI_Manager.focusList(list, playSureSE);
        }, [list, playSureSE]);
    };
    /**
     * 激活List并选中
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     */
    GUI_Manager.focusList = function (list, playSureSE) {
        if (playSureSE === void 0) { playSureSE = true; }
        if (UIList.focus == list)
            return;
        UIList.focus = list;
        for (var i = 0; i < list.length; i++) {
            var itemBox = list.getItemUI(i);
            if (itemBox.mouseX >= 0 && itemBox.mouseX <= list.itemWidth && itemBox.mouseY >= 0 && itemBox.mouseY <= list.itemHeight) {
                list.selectedIndex = i;
                break;
            }
        }
        if (playSureSE)
            GameAudio.playSE(WorldData.sureSE);
    };
    //------------------------------------------------------------------------------------------------------
    // 标准化标签栏-内部实现
    //------------------------------------------------------------------------------------------------------
    /**
     * 按键更改标签索引
     */
    GUI_Manager.onStandardTabKeyDown = function (tab, e) {
        if (!tab.stage || !tab.mouseEnabled) {
            return;
        }
        var keyCode = e.keyCode;
        var index = tab.selectedIndex;
        if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.L1)) {
            index--;
        }
        else if ((GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.R1))) {
            index++;
        }
        else {
            return;
        }
        index = Math.min(tab.length - 1, Math.max(index, 0));
        tab.selectedIndex = index;
    };
    return GUI_Manager;
}());
/**
 * 档案管理
 * Created by 黑暗之神KDS on 2020-09-15 17:17:25.
 */
var GUI_SaveFileManager = /** @class */ (function () {
    function GUI_SaveFileManager() {
    }
    //------------------------------------------------------------------------------------------------------
    // 存档和读档
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化档案列表
     * @param list 档案列表组件
     */
    GUI_SaveFileManager.initSaveFileList = function (list, saveMode) {
        if (saveMode === void 0) { saveMode = false; }
        // 标准化list
        GUI_Manager.standardList(list);
        list.on(EventObject.DISPLAY, this, GUI_SaveFileManager.onSaveFileListDisplay, [list]);
        list.on(UIList.ITEM_CREATE, this, GUI_SaveFileManager.onCreateSaveFileItem, [saveMode]);
        list.on(UIList.ITEM_CLICK, this, GUI_SaveFileManager.onListItemClick, [list, saveMode]);
        stage.on(EventObject.KEY_DOWN, list, GUI_SaveFileManager.onKeyDown, [list]);
    };
    /**
     * 存档
     * @param id 档案ID
     * @param executeEvent [可选] 默认值=true 是否执行「存档完毕事件」
     * @param onFin [可选] 默认值=null 存档完毕后回调
     * @param waitEventCompleteCallback [可选] 默认值=true 存档完毕后回调是否等待「存档完毕事件」执行完成后回调
     */
    GUI_SaveFileManager.saveFile = function (id, executeEvent, onFin, waitEventCompleteCallback) {
        var _this = this;
        if (executeEvent === void 0) { executeEvent = true; }
        if (onFin === void 0) { onFin = null; }
        if (waitEventCompleteCallback === void 0) { waitEventCompleteCallback = true; }
        if (GameGate.STATE_3_IN_SCENE_COMPLETE < 3) {
            onFin && onFin.run();
            return;
        }
        // -- 储存
        SinglePlayerGame.saveGame(id, Callback.New(function (success) {
            if (executeEvent) {
                if (onFin && !waitEventCompleteCallback)
                    onFin.run();
                if (success) {
                    var saveUI = GameUI.get(5);
                    if (saveUI)
                        GUI_SaveFileManager.refreshSaveFileItem(saveUI.list);
                    // 储存档案-成功
                    GameCommand.startCommonCommand(14008, [], Callback.New(function (onFin) {
                        onFin && onFin.run();
                    }, _this, [waitEventCompleteCallback ? onFin : null]));
                }
                else {
                    // 储存档案-失败
                    GameCommand.startCommonCommand(14009, [], Callback.New(function (onFin) {
                        onFin && onFin.run();
                    }, _this, [waitEventCompleteCallback ? onFin : null]));
                }
            }
            else {
                if (onFin)
                    onFin.run();
            }
        }, this), this.getCustomSaveIndexInfo());
    };
    /**
     * 读档
     * @param id 档案编号
     * @param onFin [可选] 默认值=null 读档完毕后回调
     */
    GUI_SaveFileManager.loadFile = function (id, onFin) {
        var _this = this;
        if (onFin === void 0) { onFin = null; }
        // 读取中的情况不再能够读取
        if (GUI_SaveFileManager.isLoading)
            return;
        GUI_SaveFileManager.isLoading = true;
        // 读取存档时清理下玩家输入状态
        GameCommand.isNeedPlayerInput = false;
        // 如果已在游戏内的话则进行一次性重启读档
        if (Game.currentScene != ClientScene.EMPTY) {
            if (SinglePlayerGame.getSaveInfoByID(id) == null)
                return;
            // 直接读档的场合
            LocalStorage.setJSON(GUI_SaveFileManager.onceInSceneLoadGameSign, { id: id });
            window.location.reload();
            return;
        }
        // 读取存档，失败的话调用失败时事件处理
        SinglePlayerGame.loadGame(id, Callback.New(function (success, customData) {
            // 成功时回调
            if (success) {
                // 监听实际进入游戏场景后取消读取进度中的状态
                EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(function () {
                    if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                        GUI_SaveFileManager.isLoading = false;
                    }
                }, _this));
            }
            else {
                // 读取存档-失败
                GameCommand.startCommonCommand(14007);
                GUI_SaveFileManager.isLoading = false;
            }
            GUI_SaveFileManager.currentSaveFileCustomData = customData;
            if (onFin)
                onFin.runWith([success]);
        }, this));
    };
    //------------------------------------------------------------------------------------------------------
    // 私有函数-档案界面显示处理
    //------------------------------------------------------------------------------------------------------
    /**
     * 当档案列表所属的界面显示时
     * @param list 列表
     */
    GUI_SaveFileManager.onSaveFileListDisplay = function (list) {
        // 设置焦点到List
        UIList.focus = list;
        // 刷新档案列表
        this.refreshSaveFileItem(list);
    };
    /**
     * 当列表项显示对象点击时
     * @param saveMode
     */
    GUI_SaveFileManager.onListItemClick = function (list, saveMode) {
        // 未选中任何项的话忽略
        var selectedIndex = list.selectedIndex;
        if (selectedIndex < 0)
            return;
        // 存档
        if (saveMode) {
            GUI_SaveFileManager.saveFile(selectedIndex + 1);
        }
        else {
            // 不存在档案数据的话则忽略
            var saveFileData = list.selectedItem.data;
            if (!saveFileData)
                return;
            // 读取存档，失败的话调用失败时事件处理
            GUI_SaveFileManager.currentSveFileIndexInfo = saveFileData;
            GUI_SaveFileManager.loadFile(selectedIndex + 1);
        }
    };
    /**
     * 当每创建一个档案项时回调函数
     * @param saveMode 存档模式
     * @param ui 档案项界面
     * @param data 档案项数据
     * @param index 档案项索引
     */
    GUI_SaveFileManager.onCreateSaveFileItem = function (saveMode, ui, data, index) {
        var saveFileData = data.data;
        // 如果没有档案数据则删除按钮和缩略图都隐藏
        if (ui.screenshotImg)
            ui.screenshotImg.visible = (saveFileData ? true : false);
        if (ui.delBtn) {
            ui.delBtn.on(EventObject.MOUSE_DOWN, this, function (e) { e.stopPropagation(); });
            ui.delBtn.on(EventObject.MOUSE_UP, this, function (e) { e.stopPropagation(); });
            if (saveFileData) {
                ui.texts.visible = true;
                ui.delBtn.visible = true;
                ui.delBtn.commandInputMessage = [saveFileData.id];
            }
            else {
                ui.texts.visible = false;
                ui.delBtn.visible = false;
            }
        }
    };
    /**
     * 刷新存档数据显示
     * @param list 档案列表组件
     */
    GUI_SaveFileManager.refreshSaveFileItem = function (list) {
        if (!list)
            return;
        var saveInfo = SinglePlayerGame.getSaveInfo();
        var items = [];
        for (var i = 1; i <= WorldData.saveFileMax; i++) {
            var saveFile = ArrayUtils.matchAttributes(saveInfo, { id: i }, true)[0];
            var itemData = new ListItem_1001();
            itemData.no = i.toString();
            // 存在档案数据的情况
            if (saveFile) {
                itemData.data = saveFile;
                itemData.screenshotImg = saveFile.indexInfo.screenshotImg;
                //@ts-ignore
                var info = GameData.parseTemplateLanguage({ key: saveFile.indexInfo.mapName });
                itemData.mapName = info.key;
                itemData.gameTimeStr = ProjectUtils.timerFormat(saveFile.indexInfo.gameTime);
                itemData.dateStr = ProjectUtils.dateFormat("YYYY-mm-dd HH:MM", new Date(saveFile.now));
            }
            else {
                itemData.screenshotImg = "";
                itemData.mapName = "";
                itemData.gameTimeStr = "";
                itemData.dateStr = "";
            }
            items.push(itemData);
        }
        list.items = items;
    };
    //------------------------------------------------------------------------------------------------------
    // 私有函数-获取存档相关数据
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取自定义档案目录数据
     * -- 截图
     * -- 场景名称
     * -- 游戏时间
     */
    GUI_SaveFileManager.getCustomSaveIndexInfo = function () {
        // -- 游戏截图：隐藏界面后截图，先全屏再缩放后截一次
        var per = 0.25;
        Game.layer.uiLayer.alpha = 0;
        var fullScreenTex = AssetManager.drawToTexture(Game.layer, stage.width, stage.height);
        Game.layer.uiLayer.alpha = 1;
        var screenRoot = new GameSprite();
        var screenBitmap = new UIBitmap;
        screenBitmap.texture = fullScreenTex;
        screenRoot.addChild(screenBitmap);
        screenBitmap.scaleX = screenBitmap.scaleY = per;
        var smallScreenTex = AssetManager.drawToTexture(screenRoot, MathUtils.int(stage.width * per), MathUtils.int(stage.height * per));
        fullScreenTex.dispose();
        var smallScreenTexBase64 = AssetManager.textureToBase64(smallScreenTex);
        smallScreenTex.dispose();
        var customSaveIndexInfo = new SaveFileListCustomData;
        customSaveIndexInfo.screenshotImg = smallScreenTexBase64;
        customSaveIndexInfo.gameTime = Game.gameTime;
        customSaveIndexInfo.mapName = Game.currentScene.name;
        return customSaveIndexInfo;
    };
    /**
     * 当按键按下时
     * @param list
     * @param e
     */
    GUI_SaveFileManager.onKeyDown = function (list, e) {
        if (list.stage && UIList.focus == list) {
            if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.X)) {
                var ui = list.getItemUI(list.selectedIndex);
                var uiComp = ui.delBtn;
                // 触发删除按钮的点击事件
                GameCommand.startUICommand(uiComp, 0, uiComp.commandInputMessage);
            }
        }
    };
    /**
     * 游戏内读档重启方式直接进入档案的标识符
     */
    GUI_SaveFileManager.onceInSceneLoadGameSign = "gc_rpg_greenFeather_" + window.location.href;
    /**
     * 是否读档中
     */
    GUI_SaveFileManager.isLoading = false;
    return GUI_SaveFileManager;
}());
/**
 * 档案目录追加的自定义数据
 * 档案目录使用GC-LifeData，是一种全局数据，在游戏启动时会自动读取
 * 该模板追加了一些自定义的档案目录数据，以便在读档前即可查看档案的一些缩略资料（目录）
 *
 * Created by 黑暗之神KDS on 2020-09-15 13:09:31.
 */
var SaveFileListCustomData = /** @class */ (function () {
    function SaveFileListCustomData() {
    }
    return SaveFileListCustomData;
}());
/**
 * UI控件的相关事件类别实现
 * Created by 黑暗之神KDS on 2019-08-07 13:18:39.
 */
//------------------------------------------------------------------------------------------------------
// 界面组件扩展
//------------------------------------------------------------------------------------------------------
// 监听每个组件的构造事件（创建预设界面时才会派发，而自行创建的组件不会派发该事件）
EventUtils.addEventListener(UIBase, UIBase.EVENT_COMPONENT_CONSTRUCTOR_INIT, Callback.New(uiComponentInit, this, [false]));
/**
 * 组件初始化
 * @param isRoot 是否根容器（界面本体）
 * @param uiComp 组件
 */
function uiComponentInit(isRoot, uiComp) {
    // 界面组件的自定义事件：可在菜单-自定义编辑器-触发事件类别-界面组件事件类别中设置
    var hasMouseEvent = false;
    var hasCommandName = isRoot ? "hasRootCommand" : "hasCommand";
    // 对应事件
    var allEvents = [
        EventObject.CLICK,
        EventObject.MOUSE_OVER,
        EventObject.MOUSE_OUT,
        EventObject.DISPLAY,
        EventObject.UNDISPLAY,
        EventObject.MOUSE_DOWN,
        EventObject.MOUSE_UP,
        EventObject.DOUBLE_CLICK,
        EventObject.MOUSE_MOVE,
        EventObject.RIGHT_MOUSE_DOWN,
        EventObject.RIGHT_MOUSE_UP,
        EventObject.RIGHT_CLICK
    ];
    // 遍历所有组件事件
    for (var i = 0; i < 12; i++) {
        var hasCommand = uiComp[hasCommandName][i];
        if (hasCommand) {
            // 除了显示事件和消失事件外表示存在鼠标事件，
            if (i != 3 && i != 4) {
                hasMouseEvent = true;
            }
            // 需要追加额外特殊效果的事件后面单独处理
            if (i == 1)
                continue;
            // 注册事件
            var evType = allEvents[i];
            uiComp.on(evType, uiComp, function (uiComp, i) {
                if (i == 3 && !uiComp.visible)
                    return;
                else if (i == 4 && !uiComp.visible)
                    return;
                // 获取该组件绑定的玩家提交信息。主要用于绑定后将该信息提交到事件里面
                // 在事件页中可通过玩家输入值来获取（事件中的脚本则是：trigger.inputMessage）
                var commandInputMessage;
                if (uiComp.commandInputMessage instanceof Callback) {
                    commandInputMessage = uiComp.commandInputMessage.run();
                }
                else {
                    commandInputMessage = uiComp.commandInputMessage;
                }
                // 开始执行界面组件事件
                GameCommand.startUICommand(uiComp, i, commandInputMessage);
            }, [uiComp, i]);
        }
    }
    // 向上开启允许鼠标响应的事件
    if (hasMouseEvent) {
        var p = uiComp;
        while (p) {
            p.mouseEnabled = true;
            if (p == uiComp.guiRoot) {
                break;
            }
            p = p.parent;
        }
    }
    // 注册悬停鼠标事件
    if (uiComp instanceof UIButton || uiComp[hasCommandName][1]) {
        uiComp.on(EventObject.MOUSE_OVER, uiComp, function (uiComp) {
            // 按钮的情况：如果未能在焦点中的话就视为选中
            if (uiComp instanceof UIButton && FocusButtonsManager.inFocusState(uiComp) == 1) {
                GameAudio.playSE(ClientWorld.data.selectSE);
                FocusButtonsManager.setFocusButton(uiComp);
            }
            // 存在悬停可视化事件
            if (uiComp[hasCommandName][1]) {
                var commandInputMessage = void 0;
                if (uiComp.commandInputMessage instanceof Callback) {
                    commandInputMessage = uiComp.commandInputMessage.run();
                }
                else {
                    commandInputMessage = uiComp.commandInputMessage;
                }
                GameCommand.startUICommand(uiComp, 1, commandInputMessage);
            }
        }, [uiComp]);
    }
    // 显示和消失事件
    if (uiComp[hasCommandName][3] || uiComp[hasCommandName][4]) {
        uiComp.on(UIBase.ON_VISIBLE_CHANGE, uiComp, function () {
            var commandInputMessage;
            if (uiComp.commandInputMessage instanceof Callback) {
                commandInputMessage = uiComp.commandInputMessage.run();
            }
            else {
                commandInputMessage = uiComp.commandInputMessage;
            }
            if (uiComp[hasCommandName][3] && uiComp.visible) {
                GameCommand.startUICommand(uiComp, 3, commandInputMessage);
            }
            else if (uiComp[hasCommandName][4] && !uiComp.visible) {
                GameCommand.startUICommand(uiComp, 4, commandInputMessage);
            }
        });
    }
}
// 界面添加时处理
EventUtils.addEventListener(GameUI, GameUI.EVENT_CREATE_UI, Callback.New(function (ui) {
    uiComponentInit.apply(ui, [true, ui]);
}, this));
//------------------------------------------------------------------------------------------------------
// 对话框扩展：
// -- 当关闭对话框时
//------------------------------------------------------------------------------------------------------
// 界面关闭时处理
EventUtils.addEventListener(GameUI, GameUI.EVENT_CLOSE_SYSTEM_UI, Callback.New(function (ui) {
    // -- 按键焦点：关闭界面时如果焦点不存在或不在舞台上则重新回到可能存在的选项中
    if (GameDialog.isInDialog && GameDialog.lastDialog) {
        var optionList = GameDialog.lastDialog.optionList;
        if (optionList && optionList.stage) {
            if (!UIList.focus || !UIList.focus.stage) {
                UIList.focus = optionList;
            }
        }
    }
}, this));
var ___lastListFocus;
var ___lastButtonsFocus;
var ___lastFocusIsList = false;
var ___isRecordFoucs = false;
var playDialogSEEnabled = false;
// 监听对话框开启事件：记录焦点
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_START, Callback.New(function (isOption, content, options, name, head, expression, audioURL, speed) {
    // 记录上一个焦点
    if (!___isRecordFoucs) {
        if (UIList.focus) {
            ___lastListFocus = UIList.focus;
            UIList.focus = null;
            ___lastFocusIsList = true;
            ___isRecordFoucs = true;
        }
        else if (FocusButtonsManager.focus) {
            ___lastFocusIsList = false;
            ___isRecordFoucs = true;
            ___lastButtonsFocus = FocusButtonsManager.focus;
        }
    }
    // 文字音效允许
    playDialogSEEnabled = !isOption && speed != 5;
}, this));
// 监听对话框开启事件：记录焦点
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_AFTER_DIALOG_START, Callback.New(function (isOption) {
    // 选项
    if (isOption) {
        var optionList_1 = GameDialog.lastDialog.optionList;
        optionList_1.selectedImageAlpha = 1;
        optionList_1.overImageAlpha = 1;
        if (optionList_1["___onSelected"])
            optionList_1.off(EventObject.CHANGE, optionList_1, optionList_1["___onSelected"]);
        var f = function (state) {
            if (state == 0) {
                var optionBtns = GameDialog.lastDialog.optionUIs;
                if (!optionBtns)
                    return;
                for (var i = 0; i < optionBtns.length; i++) {
                    var optionSp = optionList_1.getItemUI(i);
                    var btn = optionBtns[i];
                    var e = new EventObject();
                    e.target = btn;
                    if (i == optionList_1.selectedIndex) {
                        optionSp.event(EventObject.MOUSE_OVER, [i]);
                        btn.event(EventObject.MOUSE_OVER, [e]);
                    }
                    else {
                        optionSp.event(EventObject.MOUSE_OUT, [i]);
                        btn.event(EventObject.MOUSE_OUT, [e]);
                    }
                }
            }
        };
        optionList_1.on(EventObject.CHANGE, optionList_1, f);
        optionList_1["___onSelected"] = f;
        f(0);
    }
}, this));
// 监听对话框关闭事件：恢复焦点
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_END, Callback.New(function (gameDialog) {
    // 关闭的情况：恢复焦点
    if (___lastFocusIsList) {
        UIList.focus = ___lastListFocus;
        ___lastListFocus = null;
    }
    else {
        FocusButtonsManager.focus = ___lastButtonsFocus;
        ___lastButtonsFocus = null;
    }
    ___isRecordFoucs = false;
}, this));
// 监听对话框播放文字事件：播放音效
EventUtils.addEventListener(GameDialog, GameDialog.EVENT_DIALOG_WORD_PLAY, Callback.New(function () {
    if (playDialogSEEnabled && WorldData.dialogSEEnabled)
        GameAudio.playSE(ClientWorld.data.dialogSE);
}, this));
//------------------------------------------------------------------------------------------------------
// UIList焦点动画效果
//------------------------------------------------------------------------------------------------------
(function () {
    var ani = null;
    // 监听UIList焦点改变事件
    EventUtils.addEventListener(UIList, UIList.EVENT_FOCUS_CHANGE, Callback.New(function (lastFocus, currentFocus) {
        // 如果设置了动画且不存在动画时需要创建一次动画
        if (!ani && WorldData.uiCompFocusAnimation) {
            ani = new GCAnimation;
            ani.id = WorldData.uiCompFocusAnimation;
            ani.loop = true;
        }
        if (!ani)
            return;
        // 动画绑定到该列表选中项图片中
        if (currentFocus && (!GameDialog.lastDialog || (GameDialog.lastDialog && !currentFocus.isInherit(GameDialog.lastDialog)))) {
            ani.target = currentFocus.selectedImage;
            ani.play();
        }
        else {
            ani.stop(ani.currentFrame);
        }
    }, this));
})();
//------------------------------------------------------------------------------------------------------
// UIList-音效：键盘操控和鼠标操控移动光标音效
//------------------------------------------------------------------------------------------------------
var UIListOnListKeyDown = UIList["onListKeyDown"];
UIList["onListKeyDown"] = function (e) {
    if (!this._focus || !this._focus.stage)
        return;
    var keyCode = e.keyCode;
    var lastIndex = this._focus.selectedIndex;
    UIListOnListKeyDown.apply(this, arguments);
    if (UIList.KEY_LEFT.indexOf(keyCode) != -1 || UIList.KEY_RIGHT.indexOf(keyCode) != -1 ||
        UIList.KEY_UP.indexOf(keyCode) != -1 || UIList.KEY_DOWN.indexOf(keyCode) != -1) {
        if (lastIndex != this._focus.selectedIndex) {
            GameAudio.playSE(ClientWorld.data.selectSE);
        }
    }
};
var UIListitemInit = UIList.prototype["itemInit"];
UIList.prototype["itemInit"] = function (ui, data, index) {
    var _this = this;
    ui.on(EventObject.MOUSE_DOWN, this, function (ui, data, index) {
        if (_this.selectedItem != data) {
            GameAudio.playSE(ClientWorld.data.selectSE);
        }
    }, [ui, data, index]);
    UIListitemInit.apply(this, arguments);
};
/**
 * A星算法
 * -- 以前使用AS3编写的翻译成TS后先使用，后期可优化
 * -- 支持四方向和八方向寻路
 * Created by 黑暗之神KDS on 2013-5-07 15:02:01.
 */
var AstarUtils = /** @class */ (function () {
    function AstarUtils() {
        this.openList = new Array(); //开启列表
        this.closeList = new Array(); //关闭列表
        this.roadArr = new Array(); //返回的路径
    }
    /**
     * 移动至
     * 只在起点周围计算A星
     * @param x_x1 起点X
     * @param x_y1 起点Y
     * @param x_x2 终点X
     * @param x_y2 终点Y
     * @param gridW 格子宽
     * @param gridH 格子高
     * @param obsArr 障碍数组 [x][y] = true/false
     * @param toGridAsThroughEnabled 目的地看作是可通行点
     * @param throughMode 是否穿透模式，忽略障碍
     * @param checker 检查者（如忽略掉与检查者具有穿透关系的动态障碍）
     * @return [string] 返回移动路线结果 [有效路径]=|x,y|x,y|x,y|x,y [无效路径]=null
     */
    AstarUtils.moveTo = function (x_x1, x_y1, x_x2, x_y2, gridW, gridH, scene, ori4, toGridAsThroughEnabled, throughMode, checker) {
        if (ori4 === void 0) { ori4 = false; }
        if (toGridAsThroughEnabled === void 0) { toGridAsThroughEnabled = false; }
        if (throughMode === void 0) { throughMode = false; }
        if (checker === void 0) { checker = null; }
        var sceneUtils = scene.sceneUtils;
        var GRID_SIZE = Config.SCENE_GRID_SIZE;
        var GRID_SIZE_HALF = Math.floor(Config.SCENE_GRID_SIZE / 2); // - 1;
        //初始化地图信息
        var x_mapw = gridW;
        var x_maph = gridH;
        //范围数值#32 与角色相差多少,如+-10，角色在中间 比如10范围就代表总共21，前10，中我，后10
        var rangeW = Math.floor(Config.WINDOW_WIDTH / GRID_SIZE) + 1;
        var rangeH = Math.floor(Config.WINDOW_HEIGHT / GRID_SIZE) + 1;
        //范围X1，Y1，X2，Y2 (根据这个来计算范围内的值..就是在角色周围)
        var n_f_x1 = Math.floor(x_x1 / GRID_SIZE) - rangeW;
        var n_f_y1 = Math.floor(x_y1 / GRID_SIZE) - rangeH;
        var n_f_x2 = Math.floor(x_x1 / GRID_SIZE) + rangeW;
        var n_f_y2 = Math.floor(x_y1 / GRID_SIZE) + rangeH;
        //超出范围的话就return
        if (Math.abs(x_x2 - x_x1) > rangeW * GRID_SIZE || Math.abs(x_y2 - x_y1) > rangeH * GRID_SIZE) {
            return null;
        }
        //只有起点为0,有效，其他另外在做
        var mapmapmap = [];
        var thisBox;
        //先偏移，在一个虚拟的范围内根据这里的障碍物返回坐标，然后再偏移回去计算哦。
        n_f_x1 = n_f_x1 < 0 ? 0 : n_f_x1;
        n_f_y1 = n_f_y1 < 0 ? 0 : n_f_y1;
        n_f_x2 = n_f_x2 > x_mapw ? x_mapw : n_f_x2;
        n_f_y2 = n_f_y2 > x_maph ? x_maph : n_f_y2;
        //偏移量是n_f_x1与0之间的差异具体有多少，n_f_y1与0的差异有多少
        var offsetX = n_f_x1 - 0;
        var offsetY = n_f_y1 - 0;
        var yLen = (n_f_y2 - n_f_y1);
        var xLen = (n_f_x2 - n_f_x1);
        //allmap 虚拟的范围 范围内地图添加（仅用于计算路径，而不是显示）
        for (var y = 0; y < yLen; y++) // *** <=yLen
         {
            var mapmapmapY = mapmapmap[y] = [];
            for (var x = 0; x < xLen; x++) // *** <=xLen
             {
                thisBox = new AstarBox(); // 
                mapmapmapY.push(thisBox);
                thisBox.px = x;
                thisBox.py = y;
                thisBox.go = 0;
            }
        }
        var helpP = new Point();
        //增加障碍物 scene.isObstacleGrid(helpP)  || !scene.isDynamicThrough(helpP)
        if (!throughMode) {
            for (var _x = n_f_x1; _x < n_f_x2; _x++) {
                var _loop_2 = function (_y) {
                    helpP.x = _x;
                    helpP.y = _y;
                    var thisBox_1 = mapmapmap[_y - offsetY][_x - offsetX];
                    if (sceneUtils.isObstacleGrid(helpP, null, checker)) {
                        thisBox_1.go = 1;
                    }
                    // -- 检查自定义范围 
                    if (checker && checker.avatarID != 0 && !checker.through) {
                        // -- 不在桥格子上
                        if (!sceneUtils.isFixedBridgeGrid(helpP)) {
                            var checkPixPoint = GameUtils.getGridCenterByGrid(helpP);
                            var r = SoModule_CustomCollision.collisionTest(checker, false, checkPixPoint, true, function (so, collision) {
                                // -- 目标是桥属性或穿透，不计入障碍，且将该格视为通行
                                if (so.bridge) {
                                    thisBox_1.go = 2;
                                    return false;
                                }
                                // -- 目标是穿透，或者目标与check是禁止碰撞的组，不计入障碍
                                if (so.through || checker.scene.sceneUtils.isBothBanCollision(checker, so))
                                    return false;
                                return true;
                            });
                            // -- 自定义碰撞范围是桥，则该格不计入障碍
                            if (thisBox_1.go == 2) {
                                thisBox_1.go = 0;
                            }
                            // -- 否则碰触
                            else if (r.length > 0) {
                                thisBox_1.go = 1;
                            }
                        }
                    }
                };
                for (var _y = n_f_y1; _y < n_f_y2; _y++) {
                    _loop_2(_y);
                }
            }
        }
        //出发点 AstarBox
        var goX = Math.floor(x_y1 / GRID_SIZE) - offsetY;
        var mapGoXs = mapmapmap[goX];
        if (!mapGoXs)
            return null;
        var goY = Math.floor(x_x1 / GRID_SIZE) - offsetX;
        var actor_go = mapGoXs[goY];
        if (!actor_go)
            return null;
        //目的地 AstarBox
        var toX = Math.floor(x_y2 / GRID_SIZE) - offsetY;
        var mapToXs = mapmapmap[toX];
        if (!mapToXs)
            return null;
        var toY = Math.floor(x_x2 / GRID_SIZE) - offsetX;
        var actor_to = mapToXs[toY];
        if (!actor_to)
            return null;
        // 目的地看作是可通行点
        if (toGridAsThroughEnabled) {
            actor_to.go = 0;
        }
        // 查询路线
        var _ARoad = new AstarUtils(); // *是否存在内存溢出？
        _ARoad.ori4 = ori4;
        var roadList = _ARoad.searchRoad(actor_go, actor_to, mapmapmap);
        // 如果计算不出就返回NULL
        if (roadList.length < 1) {
            return null;
        }
        //返回路径试试看..给回偏移量
        var roadLines = [];
        for (var i = roadList.length - 1; i > 0; i--) {
            var n_px_real = roadList[i].px + offsetX;
            var n_py_real = roadList[i].py + offsetY;
            roadLines.push([n_px_real * GRID_SIZE + GRID_SIZE_HALF, n_py_real * GRID_SIZE + GRID_SIZE_HALF]);
        }
        roadLines.push([x_x2, x_y2]);
        return roadLines;
    };
    /**
     * 大地图移动模式缓存
     * @param gridW
     * @param gridH
     * @param obsArr
     */
    AstarUtils.def_bigMoveTo = function (gridW, gridH, obsArr) {
        var n_f_x1 = 0;
        var n_f_y1 = 0;
        var n_f_x2 = gridW;
        var n_f_y2 = gridH;
        //只有起点为0,有效，其他另外在做
        var mapmapmap = [];
        var thisBox;
        //偏移量是n_f_x1与0之间的差异具体有多少，n_f_y1与0的差异有多少
        var offsetX = n_f_x1 - 0;
        var offsetY = n_f_y1 - 0;
        var yLen = (n_f_y2 - n_f_y1);
        var xLen = (n_f_x2 - n_f_x1);
        //allmap 虚拟的范围 范围内地图添加（仅用于计算路径，而不是显示）
        for (var y = 0; y <= yLen; y++) {
            mapmapmap[y] = [];
            for (var x = 0; x <= xLen; x++) {
                thisBox = new AstarBox(); // *是否存在内存溢出？
                mapmapmap[y].push(thisBox);
                mapmapmap[y][x].px = x;
                mapmapmap[y][x].py = y;
                mapmapmap[y][x].go = 0;
            }
        }
        //增加障碍物
        for (var _x = n_f_x1; _x < n_f_x2; _x++) {
            for (var _y = n_f_y1; _y < n_f_y2; _y++) {
                if (obsArr[_x][_y]) {
                    mapmapmap[_y - offsetY][_x - offsetX].go = 1;
                }
            }
        }
        this.big_mapmapmap = mapmapmap;
    };
    /**
     * 大地图移动
     * @param x_x1 起点
     * @param x_y1 起点
     * @param x_x2 终点
     * @param x_y2 终点
     * @return [string]
     */
    AstarUtils.bigMoveTo = function (x_x1, x_y1, x_x2, x_y2) {
        var GRID_SIZE = Config.SCENE_GRID_SIZE;
        var GRID_SIZE_HALF = Math.floor(Config.SCENE_GRID_SIZE / 2) - 1;
        var mapmapmap = this.big_mapmapmap;
        //出发点 AstarBox
        var actor_go = mapmapmap[Math.floor(x_y1 / GRID_SIZE)][Math.floor(x_x1 / GRID_SIZE)];
        //目的地 AstarBox
        var actor_to = mapmapmap[Math.floor(x_y2 / GRID_SIZE)][Math.floor(x_x2 / GRID_SIZE)];
        //查询路线
        var _ARoad = new AstarUtils();
        var roadList = _ARoad.searchRoad(actor_go, actor_to, mapmapmap);
        //如果计算不出就返回NULL
        if (roadList.length < 1) {
            return null;
        }
        //返回路径试试看..给回偏移量
        var roadLines = [];
        for (var i = roadList.length - 1; i > 0; i--) {
            var n_px_real = roadList[i].px;
            var n_py_real = roadList[i].py;
            roadLines.push([n_px_real * GRID_SIZE + GRID_SIZE_HALF, n_py_real * GRID_SIZE + GRID_SIZE_HALF]);
        }
        roadLines.push([x_x2, x_y2]);
        return roadLines;
    };
    //寻路
    AstarUtils.prototype.searchRoad = function (start, end, map) {
        this.startPoint = start; //获得寻路起点
        this.endPoint = end; //获得要到达的目的地
        this.mapArr = map; //获得地图信息
        this.w = this.mapArr[0].length - 1; //获得地图横向的节点数
        this.h = this.mapArr.length - 1; //获得地图纵向的节点数
        this.openList.push(this.startPoint); //将起点加入开启列表
        var ix = 0;
        while (true) {
            ix++;
            if (this.openList.length < 1 || ix >= AstarUtils.ROAD_FIND_MAX) { //无路可走 || (ix>=Config.STV_roadFindTimeMax && !moveControl.isBigMove)
                return this.roadArr;
            }
            var thisPoint = this.openList.splice(this.getMinF(), 1)[0]; //每次取出开启列表中的第一个节点
            if (thisPoint == this.endPoint) { //找到路径
                //从终点开始往回找父节点，以生成路径列表，直到父节点为起始点
                while (thisPoint.father != this.startPoint.father) {
                    this.roadArr.push(thisPoint);
                    thisPoint = thisPoint.father;
                }
                return this.roadArr; //返回路径列表
            }
            this.closeList.push(thisPoint); //把当前节点加入关闭列表
            this.addAroundPoint(thisPoint); //开始检查当前节点四周的节点
            /*this.openList.sortOn(["F"]);//对开启列表中的节点按F值排序
           */
        } //End while
    }; //End Fun
    //检查当前节点四周的八个节点，可通过并不在关闭及开启列表中的节点加入至开启列表
    AstarUtils.prototype.addAroundPoint = function (thisPoint) {
        var thisPx = thisPoint.px; //当前节点横向索引
        var thisPy = thisPoint.py; //当前节点纵向索引
        //添加左右两个直点的同时过滤四个角点，以提高速度。
        //即如果左边点不存在或不可通过则左上左下两角点就不需检查，右边点不存在或不可通过则右上右下两角点不需检查
        //后面添加四个为角点，角点的判断为，自身可通过&&它相邻的两个当前点的直点都可通过
        if (thisPx > 0 && this.mapArr[thisPy][thisPx - 1].go == 0) { //加入左边点
            if (!this.inArr(this.mapArr[thisPy][thisPx - 1], this.closeList)) { //是否在关闭列表中
                if (!this.inArr(this.mapArr[thisPy][thisPx - 1], this.openList)) { //是否在开启列表中
                    this.setGHF(this.mapArr[thisPy][thisPx - 1], thisPoint, 10); //计算GHF值
                    this.openList.push(this.mapArr[thisPy][thisPx - 1]); //加入节点
                }
                else {
                    this.checkG(this.mapArr[thisPy][thisPx - 1], thisPoint); //检查G值
                } //End if
            } //End if
            //加入左上点
            if (!this.ori4 && thisPy > 0 && this.mapArr[thisPy - 1][thisPx - 1].go == 0 && this.mapArr[thisPy - 1][thisPx].go == 0) {
                if (!this.inArr(this.mapArr[thisPy - 1][thisPx - 1], this.closeList) && !this.inArr(this.mapArr[thisPy - 1][thisPx - 1], this.openList)) {
                    this.setGHF(this.mapArr[thisPy - 1][thisPx - 1], thisPoint, 14); //计算GHF值
                    this.openList.push(this.mapArr[thisPy - 1][thisPx - 1]); //加入节点
                } //End if
            } //End if
            //加入左下点
            if (!this.ori4 && thisPy < this.h && this.mapArr[thisPy + 1][thisPx - 1].go == 0 && this.mapArr[thisPy + 1][thisPx].go == 0) {
                if (!this.inArr(this.mapArr[thisPy + 1][thisPx - 1], this.closeList) && !this.inArr(this.mapArr[thisPy + 1][thisPx - 1], this.openList)) {
                    this.setGHF(this.mapArr[thisPy + 1][thisPx - 1], thisPoint, 14); //计算GHF值
                    this.openList.push(this.mapArr[thisPy + 1][thisPx - 1]); //加入节点
                } //End if
            } //End if
        } //End if
        if (thisPx < this.w && this.mapArr[thisPy][thisPx + 1].go == 0) { //加入右边点
            if (!this.inArr(this.mapArr[thisPy][thisPx + 1], this.closeList)) { //是否在关闭列表中
                if (!this.inArr(this.mapArr[thisPy][thisPx + 1], this.openList)) { //是否在开启列表中
                    this.setGHF(this.mapArr[thisPy][thisPx + 1], thisPoint, 10); //计算GHF值
                    this.openList.push(this.mapArr[thisPy][thisPx + 1]); //加入节点
                }
                else {
                    this.checkG(this.mapArr[thisPy][thisPx + 1], thisPoint); //检查G值
                } //End if
            } //End if
            //加入右上点
            if (!this.ori4 && thisPy > 0 && this.mapArr[thisPy - 1][thisPx + 1].go == 0 && this.mapArr[thisPy - 1][thisPx].go == 0) {
                if (!this.inArr(this.mapArr[thisPy - 1][thisPx + 1], this.closeList) && !this.inArr(this.mapArr[thisPy - 1][thisPx + 1], this.openList)) {
                    this.setGHF(this.mapArr[thisPy - 1][thisPx + 1], thisPoint, 14); //计算GHF值
                    this.openList.push(this.mapArr[thisPy - 1][thisPx + 1]); //加入节点
                } //End if
            } //End if
            //加入右下点
            if (!this.ori4 && thisPy < this.h && this.mapArr[thisPy + 1][thisPx + 1].go == 0 && this.mapArr[thisPy + 1][thisPx].go == 0) {
                if (!this.inArr(this.mapArr[thisPy + 1][thisPx + 1], this.closeList) && !this.inArr(this.mapArr[thisPy + 1][thisPx + 1], this.openList)) {
                    this.setGHF(this.mapArr[thisPy + 1][thisPx + 1], thisPoint, 14); //计算GHF值
                    this.openList.push(this.mapArr[thisPy + 1][thisPx + 1]); //加入节点
                } //End if
            } //End if
        } //End if
        if (thisPy > 0 && this.mapArr[thisPy - 1][thisPx].go == 0) { //加入上面点
            if (!this.inArr(this.mapArr[thisPy - 1][thisPx], this.closeList)) { //是否在关闭列表中
                if (!this.inArr(this.mapArr[thisPy - 1][thisPx], this.openList)) { //是否在开启列表中
                    this.setGHF(this.mapArr[thisPy - 1][thisPx], thisPoint, 10); //计算GHF值
                    this.openList.push(this.mapArr[thisPy - 1][thisPx]); //加入节点
                }
                else {
                    this.checkG(this.mapArr[thisPy - 1][thisPx], thisPoint); //检查G值
                } //End if
            } //End if
        } //End if
        if (thisPy < this.h && this.mapArr[thisPy + 1][thisPx].go == 0) { //加入下面点
            if (!this.inArr(this.mapArr[thisPy + 1][thisPx], this.closeList)) { //是否在关闭列表中
                if (!this.inArr(this.mapArr[thisPy + 1][thisPx], this.openList)) { //是否在开启列表中
                    this.setGHF(this.mapArr[thisPy + 1][thisPx], thisPoint, 10); //计算GHF值
                    this.openList.push(this.mapArr[thisPy + 1][thisPx]); //加入节点
                }
                else {
                    this.checkG(this.mapArr[thisPy + 1][thisPx], thisPoint); //检查G值
                } //End if
            } //End if
        } //End if
    }; //End Fun
    //判断当前点是否在开启列表中－－－－－－－－－－－－－－－－－－－－－－－－－－－－》
    AstarUtils.prototype.inArr = function (obj, arr) {
        for (var m in arr) {
            var mc = arr[m];
            if (obj == mc) {
                return true;
            } //End if
        } //End for
        return false;
    }; //End Fun
    //设置节点的G/H/F值－－－－－－－－－－－－－－－－－－－－－－－－－－－－》
    AstarUtils.prototype.setGHF = function (point, thisPoint, G) {
        if (!thisPoint.G) {
            thisPoint.G = 0;
        }
        point.G = thisPoint.G + G;
        //H值为当前节点的横纵向到重点的节点数×10
        point.H = (Math.abs(point.px - this.endPoint.px) + Math.abs(point.py - this.endPoint.py)) * 10;
        point.F = point.H + point.G; //计算F值
        point.father = thisPoint; //指定父节点
    }; //End Fun
    //检查新的G值以判断新的路径是否更优
    AstarUtils.prototype.checkG = function (chkPoint, thisPoint) {
        var newG = thisPoint.G + 10; //新G值为当前节点的G值加上10（因为只检查当前节点的直点）
        if (newG <= chkPoint.G) { //如果新的G值比原来的G值低或相等，说明新的路径会更好
            chkPoint.G = newG; //更新G值
            chkPoint.F = chkPoint.H + newG; //同时F值重新被计算
            chkPoint.father = thisPoint; //将其父节点更新为当前点
        } //End if
    }; //End Fun
    //获取开启列表中的F值最小的节点，返回的是该节点所在的索引
    AstarUtils.prototype.getMinF = function () {
        var tmpF = 100000000; //用以存放最小F值（这里先假定了一个很大的数值）
        var id = 0;
        var rid;
        for (var m in this.openList) {
            var mc = this.openList[m];
            //如果列表中的当前节点的F值比目前存放的F值小，就将F值更新为当前节点的F值，否则就什么都不做
            //这样循环和列表中所有节点的F值比较完成后，最后用以存放最小F值里的F值就是最小的
            if (mc.F < tmpF) {
                tmpF = mc.F;
                rid = id; //同时更新返加的索引值为当前节点的索引
            }
            id++; //因为for each方法是从数组中的第一个对象开始遍历，而每比一次id＋1刚好可以匹配其索引位置
            //也可以使用FOR遍历，但FLASH中用 FOR EACH方法效率更高
        } //End for
        return rid; //比较完成后返回最小F值所在的索引
    }; //End fun
    AstarUtils.ROAD_FIND_MAX = 500;
    return AstarUtils;
}()); //End Class
var AstarBox = /** @class */ (function () {
    function AstarBox() {
    }
    return AstarBox;
}());
/**
 * 游戏手柄类
 *   该类适配了XBOX类、PS5的手柄
 * Created by 黑暗之神KDS on 2020-03-20 01:49:30.
 */
var GCGamepad = /** @class */ (function (_super) {
    __extends(GCGamepad, _super);
    /**
     * 构造函数
     * @param index
     */
    function GCGamepad(index) {
        var _this = _super.call(this) || this;
        //------------------------------------------------------------------------------------------------------
        // 键位映射
        //------------------------------------------------------------------------------------------------------
        /**
         * 键位映射：左摇杆
         */
        _this.leftJoy1 = 0;
        _this.leftJoy2 = 1;
        /**
         * 键位映射：左方向键
         */
        _this.leftKey = 9;
        /**
         * 键位映射：右摇杆
         */
        _this.rightJoy1 = 2;
        _this.rightJoy2 = 3;
        /**
         * 键位映射：按键 aKey、bKey、xKey、yKey、LBKey、LTKey、RBKey、RTKey、backKey、startKey、leftJoyDownKey、rightJoyDownKey
         * 储存值是代表原生gamepad的buttons中的位置，比如3代表pad.buttons[3]，默认代表xKey
         */
        _this.keyMappings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        /**
         * 键位
         */
        _this.xKey = 2;
        _this.yKey = 3;
        _this.aKey = 0;
        _this.bKey = 1;
        _this.LBKey = 4;
        _this.LTKey = 6;
        _this.RBKey = 5;
        _this.RTKey = 7;
        _this.backKey = 8;
        _this.startKey = 9;
        _this.leftJoyDownKey = 10;
        _this.rightJoyDownKey = 11;
        /**
         * 键位默认值：摇杆未摇动的默认值
         */
        _this.joyDefValue = 0.003921627998352051;
        /**
         * 方向键位应：
         */
        _this.dirKeyMapping = {
            "1": 7, "-1": 8, "-0.7142857313156128": 9, "-0.4285714030265808": 6, "-0.1428571343421936": 3, "0.14285719394683838": 2, "0.4285714626312256": 1, "0.7142857313156128": 4
        };
        //------------------------------------------------------------------------------------------------------
        // 当前键位记录
        //------------------------------------------------------------------------------------------------------
        /**
         * 左摇杆点
         */
        _this.leftJoyPoint = new Point();
        /**
         * 右摇杆点
         */
        _this.rightJoyPoint = new Point();
        /**
         * 左方向键 1-8（不包含5） 对应小键盘面向
         */
        _this.leftKeyDir = 0;
        /**
         * 普通按键
         */
        _this.buttons = [false, false, false, false, false, false, false, false, false, false, false, false];
        //------------------------------------------------------------------------------------------------------
        // 辅助计算
        //------------------------------------------------------------------------------------------------------
        _this.tempPoint = new Point();
        _this.lastDir4Info = [
            { lastMenuJoyTime: 0, lastMenuClick: null, lastJoy: [0, 0] },
            { lastMenuJoyTime: 0, lastMenuClick: null, lastJoy: [0, 0] }
        ];
        _this.index = index;
        os.add_ENTERFRAME(_this.update, _this);
        return _this;
    }
    /**
     * 获取游戏手柄
     * @param index 手柄索引
     * @return [GamePad]
     */
    GCGamepad.getPad = function (index) {
        var pad = GCGamepad.pads[index];
        if (!pad)
            pad = GCGamepad.pads[index] = new GCGamepad(index);
        return pad;
    };
    Object.defineProperty(GCGamepad, "pad1", {
        /**
         * 常用手柄1
         */
        get: function () {
            return this.getPad(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GCGamepad, "pad2", {
        /**
         * 常用手柄2
         */
        get: function () {
            return this.getPad(1);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GCGamepad, "pad3", {
        /**
         * 常用手柄3
         */
        get: function () {
            return this.getPad(2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GCGamepad, "pad4", {
        /**
         * 常用手柄4
         */
        get: function () {
            return this.getPad(3);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 根据键位获取索引
     * @param keyCode 键位值
     */
    GCGamepad.prototype.getKeyIndex = function (keyCode) {
        return this.keyMappings.indexOf(MathUtils.int(keyCode));
    };
    /**
     * 获取指定摇杆点的角度 0~360
     * @param 指定的摇杆点 如leftJoyPoint/rightJoyPoint
     */
    GCGamepad.prototype.getJoyPointAngle = function (joyPoint) {
        // 270~360  x越大越靠近270，y越大，越靠近360
        if (joyPoint.x <= 0 && joyPoint.y <= 0) {
            return (joyPoint.x - joyPoint.y) * 45 + 315;
        }
        else if (joyPoint.x <= 0 && joyPoint.y >= 0) {
            return (-joyPoint.x - joyPoint.y) * 45 + 225;
        }
        else if (joyPoint.x >= 0 && joyPoint.y <= 0) {
            return (joyPoint.x + joyPoint.y) * 45 + 45;
        }
        else if (joyPoint.x >= 0 && joyPoint.y >= 0) {
            return (-joyPoint.x + joyPoint.y) * 45 + 135;
        }
        return 0;
    };
    /**
     * 销毁
     */
    GCGamepad.prototype.dispose = function () {
        this.offAll();
        os.remove_ENTERFRAME(this.update, this);
    };
    /**
     * 刷新
     */
    GCGamepad.prototype.update = function () {
        // 获取可用的手柄
        if (!navigator.getGamepads)
            return;
        var gamepads = navigator.getGamepads();
        if (!gamepads || gamepads.length == 0)
            return;
        var pad;
        for (var i = 0, index = 0; i < gamepads.length; i++) {
            pad = gamepads[i];
            if (!pad || pad.id.indexOf("Unknown") != -1)
                continue;
            if (index == this.index)
                break;
            index++;
        }
        if (!pad)
            return;
        var now = new Date().getTime();
        // 左摇杆：状态不同则派发事件或连续按键间隔连续派发事件
        this.getJoyValue(pad, this.leftJoy1, this.leftJoy2, this.tempPoint);
        if (this.tempPoint.x != this.leftJoyPoint.x || this.tempPoint.y != this.leftJoyPoint.y) {
            this.leftJoyPoint.x = this.tempPoint.x;
            this.leftJoyPoint.y = this.tempPoint.y;
            this.leftJoyStartTime = now;
            this.leftJoyFirstChangeTimes = true;
            this.onGamepadJoyChange(true, this.leftJoyPoint.x, this.leftJoyPoint.y);
            this.event(GCGamepad.GAMEPAD_JOY_CHANGE, [true, this.leftJoyPoint.x, this.leftJoyPoint.y, true]);
        }
        else {
            if (((this.leftJoyFirstChangeTimes && now - this.leftJoyStartTime > GCGamepad.firstContinuityDelayTime) ||
                (!this.leftJoyFirstChangeTimes && now - this.leftJoyStartTime > GCGamepad.continuityDelayTime)) &&
                (this.leftJoyPoint.x != 0 || this.leftJoyPoint.y != 0)) {
                this.leftJoyStartTime = now;
                this.leftJoyFirstChangeTimes = false;
                this.onGamepadJoyChange(true, this.leftJoyPoint.x, this.leftJoyPoint.y);
                this.event(GCGamepad.GAMEPAD_JOY_CHANGE, [true, this.leftJoyPoint.x, this.leftJoyPoint.y, false]);
            }
        }
        // 右摇杆
        this.getJoyValue(pad, this.rightJoy1, this.rightJoy2, this.tempPoint);
        if (this.tempPoint.x != this.rightJoyPoint.x || this.tempPoint.y != this.rightJoyPoint.y) {
            this.rightJoyPoint.x = this.tempPoint.x;
            this.rightJoyPoint.y = this.tempPoint.y;
            this.rightJoyStartTime = now;
            this.rightJoyFirstChangeTimes = true;
            this.event(GCGamepad.GAMEPAD_JOY_CHANGE, [false, this.rightJoyPoint.x, this.rightJoyPoint.y, true]);
        }
        else {
            if (((this.rightJoyFirstChangeTimes && now - this.rightJoyStartTime > GCGamepad.firstContinuityDelayTime) ||
                (!this.rightJoyFirstChangeTimes && now - this.rightJoyStartTime > GCGamepad.continuityDelayTime)) &&
                (this.rightJoyPoint.x != 0 || this.rightJoyPoint.y != 0)) {
                this.rightJoyStartTime = now;
                this.rightJoyFirstChangeTimes = false;
                this.onGamepadJoyChange(false, this.rightJoyPoint.x, this.rightJoyPoint.y);
                this.event(GCGamepad.GAMEPAD_JOY_CHANGE, [false, this.rightJoyPoint.x, this.rightJoyPoint.y, false]);
            }
        }
        // 左方向键
        var leftKeyDir = this.getDirectionKey(pad, this.leftKey);
        if (leftKeyDir != this.leftKeyDir) {
            this.leftKeyDir = leftKeyDir;
            this.leftKeyStartTime = now;
            this.leftKeyFirstChangeTimes = true;
            this.event(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, [leftKeyDir]);
        }
        else {
            if (((this.leftKeyFirstChangeTimes && now - this.leftKeyStartTime > GCGamepad.firstContinuityDelayTime) ||
                (!this.leftKeyFirstChangeTimes && now - this.leftKeyStartTime > GCGamepad.continuityDelayTime)) &&
                (this.leftKeyDir != 0)) {
                this.leftKeyStartTime = now;
                this.leftKeyFirstChangeTimes = false;
                this.event(GCGamepad.GAMEPAD_LEFT_KEY_CHANGE, [leftKeyDir]);
            }
        }
        // 普通键位
        for (var s in pad.buttons) {
            var padpressed = pad.buttons[s].pressed;
            if (padpressed != this.buttons[s]) {
                this.buttons[s] = padpressed;
                if (padpressed)
                    this.event(GCGamepad.GAMEPAD_KEY_DOWN, [s]);
                else
                    this.event(GCGamepad.GAMEPAD_KEY_UP, [s]);
            }
        }
    };
    /**
     * 获取摇杆数值
     * @param pad 原生摇杆
     * @param joy1Index 摇杆映射索引1
     * @param joy2Index 摇杆映射索引2
     * @param p 储存的点
     */
    GCGamepad.prototype.getJoyValue = function (pad, joy1Index, joy2Index, p) {
        var joyValue1 = pad.axes[joy1Index];
        var joyValue2 = pad.axes[joy2Index];
        if (joyValue1 != this.joyDefValue || joyValue2 != this.joyDefValue) {
            var joyX = parseFloat(joyValue1.toFixed(2));
            var joyY = parseFloat(joyValue2.toFixed(2));
            if (Math.abs(joyX) <= 0.3)
                joyX = 0;
            if (Math.abs(joyY) <= 0.3)
                joyY = 0;
            p.x = joyX;
            p.y = joyY;
        }
        else {
            p.x = 0;
            p.y = 0;
        }
    };
    /**
     * 获取方向键，转为1-8面向表示
     * @param pad 原生摇杆
     * @param keyIndex
     * @return [number]
     */
    GCGamepad.prototype.getDirectionKey = function (pad, keyIndex) {
        var dir = this.dirKeyMapping[pad.axes[this.leftKey]];
        if (dir == null)
            dir = 0;
        return dir;
    };
    /**
     * 当摇杆更改时，派发摇杆的方向事件（转换为方向键功能作用派发）
     * @param isleft 是否左摇杆
     * @param joyX 摇杆x值
     * @param joyY 摇杆y值
     */
    GCGamepad.prototype.onGamepadJoyChange = function (isleft, joyX, joyY) {
        if (isleft) {
            if (!this.hasListener(GCGamepad.GAMEPAD_LEFT_JOY_DIR4_CHANGE))
                return;
        }
        else {
            if (!this.hasListener(GCGamepad.GAMEPAD_RIGHT_JOY_DIR4_CHANGE))
                return;
        }
        var helpInfo = this.lastDir4Info[isleft ? 0 : 1];
        var GAMEPAD_JOY_DIR4_CHANGE = isleft ? GCGamepad.GAMEPAD_LEFT_JOY_DIR4_CHANGE : GCGamepad.GAMEPAD_RIGHT_JOY_DIR4_CHANGE;
        var lastJoyX = helpInfo.lastJoy[0];
        var lastJoyY = helpInfo.lastJoy[1];
        helpInfo.lastJoy = [joyX, joyY];
        var p = 0.8;
        if (Math.abs(joyX) < p && Math.abs(joyY) < p) {
            helpInfo.lastJoy = [0, 0];
            helpInfo.lastMenuJoyTime = 0;
            if (lastJoyX != 0 || lastJoyY != 0) {
                this.event(GAMEPAD_JOY_DIR4_CHANGE, [0]);
            }
            return;
        }
        var now = new Date().getTime();
        var menuClick;
        if (Math.abs(joyX) > Math.abs(joyY)) {
            if (Math.abs(joyX) < p)
                return;
            if (joyX < 0)
                menuClick = 4;
            else
                menuClick = 6;
        }
        else {
            if (Math.abs(joyY) < p)
                return;
            if (joyY < 0)
                menuClick = 8;
            else
                menuClick = 2;
        }
        // 如果摇杆值完全相同则允许（连续按键）
        if ((lastJoyX == joyX && lastJoyY == joyY) || (helpInfo.lastMenuClick != menuClick && now - helpInfo.lastMenuJoyTime > 150)
            || (helpInfo.lastMenuClick == menuClick && now - helpInfo.lastMenuJoyTime > 300)) {
        }
        // 摇杆值未完全相同，但相同功能键短期内不再派发 if (now - this.lastMenuJoyTime < this.menuJoyInterval)
        else {
            return;
        }
        // 记录上次派发按键的时间
        helpInfo.lastMenuJoyTime = now;
        helpInfo.lastMenuClick = menuClick;
        helpInfo.lastJoy = [joyX, joyY];
        this.event(GAMEPAD_JOY_DIR4_CHANGE, [helpInfo.lastMenuClick]);
    };
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：按键按下 onGamepadKeyDown(key:number) key对应GCGamepad的键位映射类别 如pad.xKey
     */
    GCGamepad.GAMEPAD_KEY_DOWN = "GCGamepad1";
    /**
     * 事件：按键弹起 onGamepadKeyUp(key:number) key对应GCGamepad的键位映射类别 如pad.xKey
     */
    GCGamepad.GAMEPAD_KEY_UP = "GCGamepad2";
    /**
     * 事件：摇杆改变 onGamepadJoyChange(isLeft:boolean,joyX:number,joyY:number,isFirstChange:boolean)
     */
    GCGamepad.GAMEPAD_JOY_CHANGE = "GCGamepad3";
    /**
     * 事件：方向键改变 onGamepadLeftKeyChange(dir:number) dir=0、1-8(5除外) 以小键盘5为中心的数字面向，0表示未按下
     */
    GCGamepad.GAMEPAD_LEFT_KEY_CHANGE = "GCGamepad4";
    /**
     * 事件：摇杆四方向 onGamepadLeftJoyDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    GCGamepad.GAMEPAD_LEFT_JOY_DIR4_CHANGE = "GCGamepad5";
    /**
     * 事件：摇杆四方向 onGamepadRightJoyDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    GCGamepad.GAMEPAD_RIGHT_JOY_DIR4_CHANGE = "GCGamepad6";
    /**
     * 键位名称
     */
    GCGamepad.keyNames = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "BACK", "START", "LEFT_JOY_DOWN", "RIGHT_JOY_DOWN"];
    /**
     * 键位所在的keyMappings索引（该键位值默认为XBOX-360键位，而传统手柄键位通常在abxy上有一些差别）
     */
    GCGamepad.xKeyIndex = 2;
    GCGamepad.yKeyIndex = 3;
    GCGamepad.aKeyIndex = 0;
    GCGamepad.bKeyIndex = 1;
    GCGamepad.LBKeyIndex = 4;
    GCGamepad.LTKeyIndex = 6;
    GCGamepad.RBKeyIndex = 5;
    GCGamepad.RTKeyIndex = 7;
    GCGamepad.backKeyIndex = 8;
    GCGamepad.startKeyIndex = 9;
    GCGamepad.leftJoyDownKeyIndex = 10;
    GCGamepad.rightJoyDownKeyIndex = 11;
    GCGamepad.leftKeyIndex = 14;
    GCGamepad.rightKeyIndex = 15;
    GCGamepad.upKeyIndex = 12;
    GCGamepad.downKeyIndex = 13;
    //------------------------------------------------------------------------------------------------------
    // 静态方法
    //------------------------------------------------------------------------------------------------------
    GCGamepad.pads = [];
    GCGamepad.firstContinuityDelayTime = 500;
    GCGamepad.continuityDelayTime = 30;
    return GCGamepad;
}(EventDispatcher));
/**
 * 项目层工具类
 * Created by 黑暗之神KDS on 2020-09-13 22:48:37.
 */
var ProjectUtils = /** @class */ (function () {
    function ProjectUtils() {
    }
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    ProjectUtils.init = function () {
        var _this = this;
        // 鼠标滚动值
        stage.on(EventObject.MOUSE_WHEEL, this, function (e) { ProjectUtils.mouseWhileValue = e.delta; });
        // 鼠标移动
        stage.on(EventObject.MOUSE_MOVE, this, function (e) { ProjectUtils.lastControl = 0; });
        // 注册键盘点击事件
        stage.on(EventObject.KEY_DOWN, this, function (e) { ProjectUtils.lastControl = ProjectUtils.fromGamePad ? 2 : 1; ProjectUtils.fromGamePad = false; _this.keyboardEvent = e; if (ArrayUtils.matchAttributes(_this.keyboardEvents, { keyCode: e.keyCode }, true).length == 0) {
            _this.keyboardEvents.push({ keyCode: e.keyCode });
        } });
        // 注册键盘弹起事件
        stage.on(EventObject.KEY_UP, this, function (e) { ArrayUtils.remove(_this.keyboardEvents, ArrayUtils.matchAttributes(_this.keyboardEvents, { keyCode: e.keyCode }, true)[0]); _this.keyboardEvent = null; });
    };
    //------------------------------------------------------------------------------------------------------
    // Rectangle
    //------------------------------------------------------------------------------------------------------
    /**
     * 创建Rectangle
     */
    ProjectUtils.takeoutRect = function () {
        return ProjectUtils.rectanglePool.takeout();
    };
    /**
     * 返还Rectangle
     * @param rect
     */
    ProjectUtils.freeRect = function (rect) {
        ProjectUtils.rectanglePool.free(rect);
    };
    //------------------------------------------------------------------------------------------------------
    // 时间
    //------------------------------------------------------------------------------------------------------
    /**
     * 格式化日期
     * @param fmt 格式化字符串规格 如
     * @param date
     * @return [String]
     */
    ProjectUtils.dateFormat = function (fmt, date) {
        var ret;
        var opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString() // 秒
        };
        for (var k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")));
            }
            ;
        }
        ;
        return fmt;
    };
    /**
     * 格式化计时器
     * @param time 时间段（毫秒）
     * @return [string]
     */
    ProjectUtils.timerFormat = function (time) {
        var S = 1000;
        var M = S * 60;
        var H = M * 60;
        var hTotal = Math.floor(time / H);
        var hStr = MathUtils.fixIntDigit(hTotal, 2);
        time -= H * hTotal;
        var mTotal = Math.floor(time / M);
        var mStr = MathUtils.fixIntDigit(mTotal, 2);
        time -= M * mTotal;
        var sTotal = Math.floor(time / S);
        var sStr = MathUtils.fixIntDigit(sTotal, 2);
        return hStr + ":" + mStr + ":" + sStr;
    };
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 元素组索引移动
     * 根据相对的方位和距离计算
     * @param groupElements 元素组信息
     * @param currentIndex 索引
     * @param moveDir 2=下 4=左 6=右 8=上
     * @param fuzzySearch [可选] 默认值=false 模糊搜索，如果启用则在相对方位还会搜索临近的两个方向
     */
    ProjectUtils.groupElementsMoveIndex = function (groupElements, currentIndex, moveDir, limitSecondAxis) {
        if (limitSecondAxis === void 0) { limitSecondAxis = 50; }
        var currentElement = currentIndex == -1 ? { x: 0, y: 0 } : groupElements[currentIndex];
        // 对应移动方向允许的方位
        var allowOris = {
            2: [1, 2, 3],
            4: [1, 4, 7],
            6: [3, 6, 9],
            8: [7, 8, 9] // 上方向
        }[moveDir];
        if (!allowOris)
            return null;
        // 获取第二轴参考
        var secondAxisName = (moveDir == 4 || moveDir == 6) ? "y" : "x";
        // 遍历所有节点
        var minDis = Number.MAX_VALUE;
        var minIndex = null;
        for (var i = 0; i < groupElements.length; i++) {
            var targetEle = groupElements[i];
            if (i == currentIndex)
                continue;
            var angle = MathUtils.direction360(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            var ori = GameUtils.getOriByAngle(angle);
            // -- 去除方位不对的节点
            if (allowOris.indexOf(ori) == -1)
                continue;
            // -- 获取第二轴的距离
            var secondAxisDistance = Math.abs(targetEle[secondAxisName] - currentElement[secondAxisName]);
            if (secondAxisDistance > limitSecondAxis)
                continue;
            // -- 获取最短的距离
            var dis2 = Point.distanceSquare2(currentElement.x, currentElement.y, targetEle.x, targetEle.y);
            if (dis2 < minDis) {
                minDis = dis2;
                minIndex = i;
            }
        }
        return minIndex;
    };
    //------------------------------------------------------------------------------------------------------
    // 碰撞检测 - 辅助计算
    //------------------------------------------------------------------------------------------------------
    /**
     * 测试多边形相交，检测到任意相交就返回
     * @param polygon1 多边形1
     * @param polygon2 多边形2
     * @returns
     */
    ProjectUtils.polygonsIntersectTest = function (polygon1, polygon2) {
        var result = false;
        // 将多边形1中的每条边与多边形2中的每条边都进行检查
        var p1Len = polygon1.length;
        var p2Len = polygon2.length;
        for (var i = 0; i < p1Len; i++) {
            var p1 = polygon1[i];
            var p2 = polygon1[(i + 1) % p1Len];
            for (var j = 0; j < p2Len; j++) {
                var q1 = polygon2[j];
                var q2 = polygon2[(j + 1) % p2Len];
                // 如果两条线段相交，则返回true
                if (this.isLinesIntersect(p1, p2, q1, q2)) {
                    result = true;
                    return result;
                }
            }
        }
        // 包含关系：多边形A包含多边形B或相反
        for (var i = 0; i < p1Len; i++) {
            var p1 = polygon1[i];
            if (this.isPointInsidePolygon(p1, polygon2)) {
                result = true;
                return result;
            }
        }
        for (var i = 0; i < p2Len; i++) {
            var p1 = polygon2[i];
            if (this.isPointInsidePolygon(p1, polygon1)) {
                result = true;
                return result;
            }
        }
        // 如果所有线段都不相交，则返回false
        return result;
    };
    /**
     * 两条线是否相交
     * @param p1 线段1起点 如[0,0]
     * @param p2 线段1终点
     * @param q1 线段2起点
     * @param q2 线段2终点
     * @return [boolean]
     */
    ProjectUtils.isLinesIntersect = function (p1, p2, q1, q2) {
        if (this.linesIntersectInfo(p1, p2, q1, q2)) {
            return true;
        }
        return false;
    };
    /**
     * 两条线相交返回相交点的比例（0~1）
     * @param p1 线段1起点 如[0,0]
     * @param p2 线段1终点
     * @param q1 线段2起点
     * @param q2 线段2终点
     * @return p1Per=线段1中的点的比例（0~1） p2Per=线段2中的点的比例（0~1）
     */
    ProjectUtils.linesIntersectInfo = function (p1, p2, q1, q2, offsetY) {
        if (offsetY === void 0) { offsetY = 0; }
        var q11 = q1[1] + offsetY;
        var q21 = q2[1] + offsetY;
        var dx1 = p2[0] - p1[0];
        var dy1 = p2[1] - p1[1];
        var dx2 = q2[0] - q1[0];
        var dy2 = q21 - q11;
        var denominator = dx1 * dy2 - dy1 * dx2;
        if (denominator === 0) {
            return null; // 线段平行，不相交
        }
        var t1 = ((q1[0] - p1[0]) * dy2 - (q11 - p1[1]) * dx2) / denominator;
        var t2 = ((q1[0] - p1[0]) * dy1 - (q11 - p1[1]) * dx1) / denominator;
        var res = t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
        if (res) {
            return { p1Per: t1, p2Per: t2 };
        }
        return null;
    };
    /**
     * 判断点是否在多边形内
     * @param point
     * @param polygon
     * @return [boolean]
     */
    ProjectUtils.isPointInsidePolygon = function (point, polygon) {
        var points = polygon;
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            var intersect = ((points[i][1] > point[1]) != (points[j][1] > point[1]))
                && (point[0] < (points[j][0] - points[i][0]) * (point[1] - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0]);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };
    // 最近的鼠标滚动值
    ProjectUtils.mouseWhileValue = 0;
    /**
     * 回调函数辅助者：重用实例
     */
    ProjectUtils.callbackHelper = new Callback;
    /**
     * 点辅助者：重用实例
     */
    ProjectUtils.pointHelper = new Point;
    /**
     * 矩形辅助者：重用实例
     */
    ProjectUtils.rectangleHelper = new Rectangle;
    ProjectUtils.keyboardEvents = [];
    /**
     * 最近的操控方式 0-鼠标 1-按键 2-手柄
     */
    ProjectUtils.lastControl = 0;
    /**
     * 矩形对象池
     */
    ProjectUtils.rectanglePool = new PoolUtils(Rectangle);
    return ProjectUtils;
}());
/**
 * 项目层游戏管理器实现类
 * -- 为了让系统API属性的类别直接指向项目层的实现类
 *    游戏内会经常用到Game.player以及Game.currentScene，实现此类可指向项目层自定义的「玩家类」和「场景类」
 *
 *
 * Created by 黑暗之神KDS on 2020-09-08 17:00:46.
 */
var ProjectGame = /** @class */ (function (_super) {
    __extends(ProjectGame, _super);
    /**
     * 构造函数
     */
    function ProjectGame() {
        var _this = _super.call(this) || this;
        EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, _this.onInSceneStateChange, _this);
        return _this;
    }
    /**
     * 初始化
     */
    ProjectGame.prototype.init = function () {
        // 创建的玩家是这个项目层自定义类的实例
        this.player = new ProjectPlayer();
        EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onPauseChange, this);
    };
    Object.defineProperty(ProjectGame.prototype, "gameTime", {
        /**
         * 获取游戏时间
         */
        get: function () {
            var gameStartTime;
            if (ProjectGame.gamePauseStartTime) {
                var dTime = Date.now() - ProjectGame.gamePauseStartTime.getTime();
                gameStartTime = new Date(ProjectGame.gameStartTime.getTime() + dTime);
            }
            else {
                gameStartTime = ProjectGame.gameStartTime;
            }
            return new Date().getTime() - gameStartTime.getTime();
        },
        enumerable: false,
        configurable: true
    });
    //------------------------------------------------------------------------------------------------------
    // 私有实现
    //------------------------------------------------------------------------------------------------------
    ProjectGame.prototype.onInSceneStateChange = function (inNewSceneState) {
        // 状态：离开场景时（标题时视为离开空场景）
        if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            // 新游戏的话：记录当前时间为启动时间
            if (inNewSceneState == 1) {
                ProjectGame.gameStartTime = new Date();
            }
            // 读取存档的情况：以当前的时间减去已游戏时间来记录
            else if (inNewSceneState == 2) {
                ProjectGame.gameStartTime = new Date((Date.now() - GUI_SaveFileManager.currentSveFileIndexInfo.indexInfo.gameTime));
            }
        }
    };
    ProjectGame.prototype.onPauseChange = function () {
        if (Game.pause) {
            ProjectGame.gamePauseStartTime = new Date();
        }
        else {
            if (ProjectGame.gamePauseStartTime) {
                var dTime = Date.now() - ProjectGame.gamePauseStartTime.getTime();
                ProjectGame.gameStartTime = new Date(ProjectGame.gameStartTime.getTime() + dTime);
                ProjectGame.gamePauseStartTime = null;
            }
        }
    };
    return ProjectGame;
}(GameBase));
/**
 * 游戏大门：用于处理进入游戏、读取存档、更换场景
 * Created by 黑暗之神KDS on 2020-09-11 19:18:46.
 */
var GameGate = /** @class */ (function () {
    function GameGate() {
    }
    /**
     * 开始
     */
    GameGate.start = function () {
        // 监听进入场景的事件：新游戏、读档、切换场景
        EventUtils.addEventListener(ClientScene, ClientScene.EVENT_IN_NEW_SCENE, Callback.New(GameGate.onInNewScene, GameGate));
        // 初始化GameCreator内核：完成后显示标题界面
        EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(GameGate.onWorldInit, this), true);
    };
    /**
     * 世界初始化
     */
    GameGate.onWorldInit = function () {
        // 键盘初始化
        KeyboardControl.init();
        // 初始化设置
        GUI_Setting.initHotKeySetting();
        // 手柄初始化
        GamepadControl.init();
        // 初始化项目工具类
        ProjectUtils.init();
        // 场景初始化
        ProjectClientScene.init();
        // 移动端屏幕显示
        if (Browser.onMobile) {
            stage.screenMode = ClientWorld.data.screenMode == 0 ? "horizontal" : "vertical";
            stage.setScreenSize(Browser.width, Browser.height);
        }
        // 启动LIST内置按键和焦点功能
        UIList.SINGLE_FOCUS_MODE = WorldData.focusEnabled;
        UIList.KEY_BOARD_ENABLED = WorldData.hotKeyListEnabled;
        // 直接读档的场合
        var onceLoadGame = LocalStorage.getJSON(GUI_SaveFileManager.onceInSceneLoadGameSign);
        if (onceLoadGame && onceLoadGame.id != null && SinglePlayerGame.getSaveInfoByID(onceLoadGame.id)) {
            // 移除一次读档的操作
            LocalStorage.removeItem(GUI_SaveFileManager.onceInSceneLoadGameSign);
            // 读取存档，失败的话调用失败时事件处理
            GUI_SaveFileManager.currentSveFileIndexInfo = SinglePlayerGame.getSaveInfoByID(onceLoadGame.id);
            GUI_SaveFileManager.loadFile(onceLoadGame.id, Callback.New(function (success) {
                if (!success)
                    GameCommand.startCommonCommand(14007);
            }, this));
            return;
        }
        // 启动事件
        GameCommand.startCommonCommand(14001);
    };
    /**
     * 当接收到进入新的场景时事件
     * @param sceneID 场景模型ID
     * @param inNewSceneState 进入场景的方式 0-切换游戏场景 1-新游戏 2-读取存档
     */
    GameGate.onInNewScene = function (sceneID, inNewSceneState) {
        // 如果正处于切换场景中的话忽略掉
        if (this.gateState != null && this.gateState < GameGate.STATE_3_IN_SCENE_COMPLETE)
            return;
        // 停止可能存在的移动行为
        if (Game.player.sceneObject.stopMove) {
            Game.player.sceneObject.stopMove(true);
        }
        // 清理掉已派发的主角行为
        if (Game.player.sceneObject.clearBehaviors) {
            Game.player.sceneObject.clearBehaviors();
        }
        // 停止控制器
        Controller.stop();
        // 【0】设置游戏之门状态：离开场景，开始执行相关准备事件
        GameGate.gateState = GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT;
        EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
        // 根据state状态来执行相关准备事件（离开场景时事件、新游戏开始事件、读档开始事件）
        var startEvents = [14011, 14003, 14005];
        GameCommand.startCommonCommand(startEvents[inNewSceneState], [], Callback.New(disposeLastScene, this));
        var lastTonal = null;
        // 释放上一个场景
        function disposeLastScene() {
            // 【1】设置游戏之门状态：开始加载场景
            GameGate.gateState = GameGate.STATE_1_START_LOAD_SCENE;
            EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
            if (Game.currentScene) {
                // 玩家的场景对象移除出来不用销毁
                if (Game.player.sceneObject.inScene)
                    Game.currentScene.removeSceneObject(Game.player.sceneObject);
                // 获取上一个场景
                var lastScene = Game.currentScene;
                // 记录上一个场景的色调
                lastTonal = lastScene.displayObject.getTonal();
                // 移除上一个场景
                Game.layer.sceneLayer.removeChildren();
                // 卸载进入场景前预加载的资源，减少引用计数
                if (inNewSceneState == 0)
                    AssetManager.disposeScene(lastScene.id);
                // 卸载当前场景
                lastScene.dispose();
                Game.currentScene = null;
            }
            loadPlayerAsset();
        }
        // 加载玩家场景对象需要的资源
        function loadPlayerAsset() {
            if (inNewSceneState != 0)
                AssetManager.preLoadSceneObjectAsset(Game.player.data.sceneObject, Callback.New(loadNewScene, this));
            else
                loadNewScene.apply(this);
        }
        // 加载新的场景
        function loadNewScene() {
            var _this = this;
            // 预加载场景资源，增加引用计数
            AssetManager.preLoadSceneAsset(sceneID, Callback.New(function () {
                // 创建场景
                ClientScene.createScene(sceneID, Callback.New(function (scene) {
                    // 配置数据加载完毕时：如果场景需要播放的音乐不再是当前音乐则结束掉之前的音乐或者首次进入游戏场景
                    // 渐变停止掉此前的背景音乐和环境音效音效，使用SyncTask类让任务单一执行，直到音乐渐出完毕才会在后面渐入新的音乐
                    if ((scene.bgm && (GameAudio.lastBgmURL != scene.bgm || GameAudio.lastBGMPitch != scene.bgmPitch)) || inNewSceneState != 0) {
                        new SyncTask(GameGate.bgmSyncTaskName, function () {
                            GameAudio.playBGM(GameAudio.lastBgmURL, 0, 9999, true, ClientWorld.data.sceneBGMGradientTime * 1000, GameAudio.lastBGMPitch);
                            Callback.New(SyncTask.taskOver, SyncTask, [GameGate.bgmSyncTaskName]).delayRun(ClientWorld.data.sceneBGMGradientTime * 1000);
                        });
                    }
                    if ((scene.bgs && GameAudio.lastBgsURL != scene.bgs || GameAudio.lastBGSPitch != scene.bgsPitch) || inNewSceneState != 0) {
                        new SyncTask(GameGate.bgsSyncTaskName, function () {
                            GameAudio.playBGS(GameAudio.lastBgsURL, 0, 9999, true, ClientWorld.data.sceneBGSGradientTime * 1000, GameAudio.lastBGSPitch);
                            Callback.New(SyncTask.taskOver, SyncTask, [GameGate.bgsSyncTaskName]).delayRun(ClientWorld.data.sceneBGSGradientTime * 1000);
                        });
                    }
                }, _this), Callback.New(onLoadedNewScene, _this), true);
            }, this), true, false, true);
        }
        /**
         * 当场景资源加载完毕时
         * @param scene 新的场景
         */
        function onLoadedNewScene(scene) {
            // 记录新的场景
            Game.currentScene = scene;
            // 恢复上个场景的色调
            if (lastTonal) {
                var t = lastTonal;
                Game.currentScene.displayObject.setTonal(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
            }
            // 非读档模式下：添加预设的场景对象（读档的话会自动恢复场景对象和其自定义属性、独立开关）
            if (inNewSceneState != 2) {
                var sceneObjects = scene.getPresetSceneObjectDatas();
                var len = sceneObjects.length;
                for (var i = 0; i < len; i++) {
                    var soObj = sceneObjects[i];
                    if (!soObj)
                        continue;
                    var soc = scene.addSceneObjectFromClone(sceneID, i, false);
                    // 安装对象开关
                    var soSwitchs = SinglePlayerGame.getSceneObjectSwitch(sceneID, i);
                    if (soSwitchs) {
                        soc.installSwitchs(soSwitchs);
                    }
                }
            }
            // 添加玩家场景对象
            var insertNewPostion = inNewSceneState != 2;
            if (!GameGate.inSceneInited) {
                GameGate.addPlayerSceneObject(Game.player.data.sceneObject, false, insertNewPostion);
            }
            else {
                GameGate.addPlayerSceneObject(Game.player.sceneObject, true, insertNewPostion);
            }
            // 场景开始渲染
            Game.currentScene.startRender();
            // 添加到显示列表中
            Game.layer.sceneLayer.addChild(Game.currentScene.displayObject);
            // 背景音乐播放
            if (inNewSceneState != 2) {
                new SyncTask(GameGate.bgmSyncTaskName, function (sceneBgm, bgmVolume, bgmPitch) {
                    if (sceneBgm) {
                        GameAudio.playBGM(sceneBgm, bgmVolume, 9999, true, ClientWorld.data.sceneBGMGradientTime * 1000, bgmPitch);
                    }
                    SyncTask.taskOver(GameGate.bgmSyncTaskName);
                }, [Game.currentScene.bgm, Game.currentScene.bgmVolume, Game.currentScene.bgmPitch]);
                new SyncTask(GameGate.bgsSyncTaskName, function (sceneBgs, bgsVolume, bgsPitch) {
                    if (sceneBgs) {
                        GameAudio.playBGS(sceneBgs, bgsVolume, 9999, true, ClientWorld.data.sceneBGSGradientTime * 1000, bgsPitch);
                    }
                    SyncTask.taskOver(GameGate.bgsSyncTaskName);
                }, [Game.currentScene.bgs, Game.currentScene.bgsVolume, Game.currentScene.bgsPitch]);
            }
            // 如果是从存档恢复的则恢复存档数据
            if (inNewSceneState == 2) {
                SinglePlayerGame.recoveryData();
            }
            startExecuteSceneLoadedEvent.apply(this);
        }
        // 【2】开始执行场景加载完成时事件
        function startExecuteSceneLoadedEvent() {
            GameGate.gateState = GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT;
            EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
            // 进入场景、新的档案-完成、读取档案-完成
            var endEvents = [14010, 14004, 14006];
            GameCommand.startCommonCommand(endEvents[inNewSceneState], [], Callback.New(inSceneComplete, this));
        }
        /**
         * 【3】进入场景完成
         */
        function inSceneComplete() {
            GameGate.gateState = GameGate.STATE_3_IN_SCENE_COMPLETE;
            EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
            // 游戏首次登入场景时初始化事件（无论通过新游戏还是存档，都会调用，用于进入游戏时自定义初始化用）
            if (!GameGate.inSceneInited) {
                GameGate.inSceneInited = true;
                GameCommand.startCommonCommand(14002);
            }
            // 非读档的情况
            if (inNewSceneState != 2) {
                // 获取进入场景的事件
                var sceneCmdTypeIndex = 0;
                var commandPageInScene = Game.currentScene.customCommandPages[sceneCmdTypeIndex];
                var inSceneCmdLength = commandPageInScene.commands.length;
                // 执行场景进入事件则派发事件
                if (inSceneCmdLength > 0) {
                    // 获取事件触发器：由玩家触发，执行者也是玩家
                    var commandTriggerInScene = Game.player.sceneObject.getCommandTrigger(CommandTrigger.COMMAND_MAIN_TYPE_SCENE, sceneCmdTypeIndex, Game.currentScene, Game.player.sceneObject);
                    // 监听一次事件执行，完毕后启动控制器
                    EventUtils.addEventListener(commandTriggerInScene, CommandTrigger.EVENT_OVER, Callback.New(function () {
                        Controller.start();
                        GameGate.gateState = GameGate.STATE_4_PLAYER_CONTROL_START;
                        EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
                    }, this, []), true);
                    // 开始执行事件
                    commandPageInScene.startTriggerEvent(commandTriggerInScene);
                }
                // 启动控制器
                else {
                    Controller.start();
                    GameGate.gateState = GameGate.STATE_4_PLAYER_CONTROL_START;
                    EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
                }
            }
            else {
                GameGate.gateState = GameGate.STATE_4_PLAYER_CONTROL_START;
                EventUtils.happen(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, [inNewSceneState]);
            }
        }
    };
    /**
     * 添加玩家的场景对象
     * @param so 玩家场景对象数据
     * @param isEntity 是否是场景对象实体
     * @param insertNewPostion 插入到新的空位置上，如普通的切换场景时
     */
    GameGate.addPlayerSceneObject = function (so, isEntity, insertNewPostion) {
        if (isEntity === void 0) { isEntity = false; }
        if (insertNewPostion === void 0) { insertNewPostion = true; }
        if (!Game.currentScene)
            return;
        if (!isEntity)
            delete so.player;
        else {
            so.x = Game.player.data.sceneObject.x;
            so.y = Game.player.data.sceneObject.y;
        }
        // 取得空位置
        if (insertNewPostion) {
            var newIndex = ArrayUtils.getNullPosition(Game.currentScene.sceneObjects);
            so.index = newIndex;
        }
        var soc = Game.currentScene.addSceneObject(so, isEntity, true);
        Game.player.sceneObject = soc;
        Game.player.sceneObject.stopMove();
        // 记录场景对象
        soc.player = Game.player;
        // 设置镜头并绑定到主角身上
        Game.currentScene.camera.sceneObject = soc;
        Game.currentScene.updateCamera();
    };
    /**
     * 事件：进入场景的状态改变时派发事件，对应 GameGate.STATE_XXX
     * onInSceneStateChange(inNewSceneState:number);
     */
    GameGate.EVENT_IN_SCENE_STATE_CHANGE = "GameGateEVENT_SCENE_STATE_CHANGE";
    /**
     * 状态：离开场景，开始执行相关准备事件（离开场景时事件、新游戏开始事件、读档开始事件）
     */
    GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT = 0;
    /**
     * 状态：相关准备事件执行完毕，开始加载场景
     */
    GameGate.STATE_1_START_LOAD_SCENE = 1;
    /**
     * 状态：加载场景完毕，开始执行对应的完成事件（进入场景时事件、新游戏完成事件、读档完成事件）
     */
    GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT = 2;
    /**
     * 状态：场景已进入完毕
     */
    GameGate.STATE_3_IN_SCENE_COMPLETE = 3;
    /**
     * 状态：玩家可控制阶段开始
     */
    GameGate.STATE_4_PLAYER_CONTROL_START = 4;
    /**
     * 辅助计算用
     */
    GameGate.bgmSyncTaskName = "bgmTask";
    GameGate.bgsSyncTaskName = "bgsTask";
    return GameGate;
}());
//------------------------------------------------------------------------------------------------------
// 「RPG游戏模板-苍之羽」
// 模板功能：
// -- 游戏类型：Role Playing Game 角色扮演游戏（2D俯视角度-无战斗）
// -- 控制器支持：鼠标+键盘+游戏手柄
// 
// 程序设计：黑暗之神KDS
// 素材设计：GC默认素材-经典像素游戏套（月散、Mr.UAV、理世子）
// 润色助力：阿赖耶石
//------------------------------------------------------------------------------------------------------
// 创建Game类，全局使用
var Game = new ProjectGame();
// 全局临时数据
var GlobalTempData = {};
// 非处于行为编辑器的环境下开始游戏
//（行为编辑器也运行了一个小窗口，包含了运行了这些脚本，以便实时预览项目层设计的行为效果）
if (!Config.BEHAVIOR_EDIT_MODE) {
    GameGate.start();
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义指令 1-预加载资源
*/
var CustomCommandParams_1 = /** @class */ (function () {
    function CustomCommandParams_1() {
    }
    return CustomCommandParams_1;
}());
/**
* 自定义指令 2-等待玩家输入文本
*/
var CustomCommandParams_2 = /** @class */ (function () {
    function CustomCommandParams_2() {
    }
    return CustomCommandParams_2;
}());
/**
* 自定义指令 3-按键事件
*/
var CustomCommandParams_3 = /** @class */ (function () {
    function CustomCommandParams_3() {
    }
    return CustomCommandParams_3;
}());
/**
* 自定义指令 4-鼠标事件
*/
var CustomCommandParams_4 = /** @class */ (function () {
    function CustomCommandParams_4() {
    }
    return CustomCommandParams_4;
}());
/**
* 自定义指令 5-设置界面属性
*/
var CustomCommandParams_5 = /** @class */ (function () {
    function CustomCommandParams_5() {
    }
    return CustomCommandParams_5;
}());
/**
* 自定义指令 6-设置按钮焦点
*/
var CustomCommandParams_6 = /** @class */ (function () {
    function CustomCommandParams_6() {
    }
    return CustomCommandParams_6;
}());
/**
* 自定义指令 7-关闭界面焦点
*/
var CustomCommandParams_7 = /** @class */ (function () {
    function CustomCommandParams_7() {
    }
    return CustomCommandParams_7;
}());
/**
* 自定义指令 8-取消按键事件
*/
var CustomCommandParams_8 = /** @class */ (function () {
    function CustomCommandParams_8() {
    }
    return CustomCommandParams_8;
}());
/**
* 自定义指令 9-取消鼠标事件
*/
var CustomCommandParams_9 = /** @class */ (function () {
    function CustomCommandParams_9() {
    }
    return CustomCommandParams_9;
}());
/**
* 自定义指令 10-模拟按键
*/
var CustomCommandParams_10 = /** @class */ (function () {
    function CustomCommandParams_10() {
    }
    return CustomCommandParams_10;
}());
/**
* 自定义指令 11-提交信息
*/
var CustomCommandParams_11 = /** @class */ (function () {
    function CustomCommandParams_11() {
    }
    return CustomCommandParams_11;
}());
/**
* 自定义指令 12-设置列表焦点
*/
var CustomCommandParams_12 = /** @class */ (function () {
    function CustomCommandParams_12() {
    }
    return CustomCommandParams_12;
}());
/**
* 自定义指令 13-计时器
*/
var CustomCommandParams_13 = /** @class */ (function () {
    function CustomCommandParams_13() {
    }
    return CustomCommandParams_13;
}());
/**
* 自定义指令 1001-设置地图网格数据
*/
var CustomCommandParams_1001 = /** @class */ (function () {
    function CustomCommandParams_1001() {
    }
    return CustomCommandParams_1001;
}());
/**
* 自定义指令 1002-绘制图块
*/
var CustomCommandParams_1002 = /** @class */ (function () {
    function CustomCommandParams_1002() {
    }
    return CustomCommandParams_1002;
}());
/**
* 自定义指令 1003-绘制自动元件
*/
var CustomCommandParams_1003 = /** @class */ (function () {
    function CustomCommandParams_1003() {
    }
    return CustomCommandParams_1003;
}());
/**
* 自定义指令 1004-清除图块
*/
var CustomCommandParams_1004 = /** @class */ (function () {
    function CustomCommandParams_1004() {
    }
    return CustomCommandParams_1004;
}());
/**
* 自定义指令 1005-设置图层属性
*/
var CustomCommandParams_1005 = /** @class */ (function () {
    function CustomCommandParams_1005() {
    }
    return CustomCommandParams_1005;
}());
/**
* 自定义指令 1006-显示场景动画
*/
var CustomCommandParams_1006 = /** @class */ (function () {
    function CustomCommandParams_1006() {
    }
    return CustomCommandParams_1006;
}());
/**
* 自定义指令 1007-缩放场景镜头
*/
var CustomCommandParams_1007 = /** @class */ (function () {
    function CustomCommandParams_1007() {
    }
    return CustomCommandParams_1007;
}());
/**
* 自定义指令 1008-旋转场景镜头
*/
var CustomCommandParams_1008 = /** @class */ (function () {
    function CustomCommandParams_1008() {
    }
    return CustomCommandParams_1008;
}());
/**
* 自定义指令 2001-增减金币
*/
var CustomCommandParams_2001 = /** @class */ (function () {
    function CustomCommandParams_2001() {
    }
    return CustomCommandParams_2001;
}());
/**
* 自定义指令 2002-增减道具
*/
var CustomCommandParams_2002 = /** @class */ (function () {
    function CustomCommandParams_2002() {
    }
    return CustomCommandParams_2002;
}());
/**
* 自定义指令 2003-克隆对象
*/
var CustomCommandParams_2003 = /** @class */ (function () {
    function CustomCommandParams_2003() {
    }
    return CustomCommandParams_2003;
}());
/**
* 自定义指令 2004-销毁克隆的对象
*/
var CustomCommandParams_2004 = /** @class */ (function () {
    function CustomCommandParams_2004() {
    }
    return CustomCommandParams_2004;
}());
/**
* 自定义指令 2005-暂时移除对象
*/
var CustomCommandParams_2005 = /** @class */ (function () {
    function CustomCommandParams_2005() {
    }
    return CustomCommandParams_2005;
}());
/**
* 自定义指令 2006-停止移动
*/
var CustomCommandParams_2006 = /** @class */ (function () {
    function CustomCommandParams_2006() {
    }
    return CustomCommandParams_2006;
}());
/**
* 自定义指令 2007-记录移动路径
*/
var CustomCommandParams_2007 = /** @class */ (function () {
    function CustomCommandParams_2007() {
    }
    return CustomCommandParams_2007;
}());
/**
* 自定义指令 2008-恢复移动路径
*/
var CustomCommandParams_2008 = /** @class */ (function () {
    function CustomCommandParams_2008() {
    }
    return CustomCommandParams_2008;
}());
/**
* 自定义指令 2009-设置场景对象的属性
*/
var CustomCommandParams_2009 = /** @class */ (function () {
    function CustomCommandParams_2009() {
    }
    return CustomCommandParams_2009;
}());
/**
* 自定义指令 2010-
*/
var CustomCommandParams_2010 = /** @class */ (function () {
    function CustomCommandParams_2010() {
    }
    return CustomCommandParams_2010;
}());
/**
* 自定义指令 2011-修改行走图部件
*/
var CustomCommandParams_2011 = /** @class */ (function () {
    function CustomCommandParams_2011() {
    }
    return CustomCommandParams_2011;
}());
/**
* 自定义指令 2012-打开商店
*/
var CustomCommandParams_2012 = /** @class */ (function () {
    function CustomCommandParams_2012() {
    }
    return CustomCommandParams_2012;
}());
/**
* 自定义指令 2013-清除对象行为
*/
var CustomCommandParams_2013 = /** @class */ (function () {
    function CustomCommandParams_2013() {
    }
    return CustomCommandParams_2013;
}());
/**
* 自定义指令 3001-显示图片
*/
var CustomCommandParams_3001 = /** @class */ (function () {
    function CustomCommandParams_3001() {
    }
    return CustomCommandParams_3001;
}());
/**
* 自定义指令 3002-移动图片
*/
var CustomCommandParams_3002 = /** @class */ (function () {
    function CustomCommandParams_3002() {
    }
    return CustomCommandParams_3002;
}());
/**
* 自定义指令 3003-设置图像层镜头
*/
var CustomCommandParams_3003 = /** @class */ (function () {
    function CustomCommandParams_3003() {
    }
    return CustomCommandParams_3003;
}());
/**
* 自定义指令 3004-显示动画
*/
var CustomCommandParams_3004 = /** @class */ (function () {
    function CustomCommandParams_3004() {
    }
    return CustomCommandParams_3004;
}());
/**
* 自定义指令 3005-移动动画
*/
var CustomCommandParams_3005 = /** @class */ (function () {
    function CustomCommandParams_3005() {
    }
    return CustomCommandParams_3005;
}());
/**
* 自定义指令 3006-显示立绘
*/
var CustomCommandParams_3006 = /** @class */ (function () {
    function CustomCommandParams_3006() {
    }
    return CustomCommandParams_3006;
}());
/**
* 自定义指令 3007-移动立绘
*/
var CustomCommandParams_3007 = /** @class */ (function () {
    function CustomCommandParams_3007() {
    }
    return CustomCommandParams_3007;
}());
/**
* 自定义指令 3008-消除图像
*/
var CustomCommandParams_3008 = /** @class */ (function () {
    function CustomCommandParams_3008() {
    }
    return CustomCommandParams_3008;
}());
/**
* 自定义指令 3009-自动旋转
*/
var CustomCommandParams_3009 = /** @class */ (function () {
    function CustomCommandParams_3009() {
    }
    return CustomCommandParams_3009;
}());
/**
* 自定义指令 3010-显示界面
*/
var CustomCommandParams_3010 = /** @class */ (function () {
    function CustomCommandParams_3010() {
    }
    return CustomCommandParams_3010;
}());
/**
* 自定义指令 3011-移动界面
*/
var CustomCommandParams_3011 = /** @class */ (function () {
    function CustomCommandParams_3011() {
    }
    return CustomCommandParams_3011;
}());
/**
* 自定义指令 3012-关闭界面
*/
var CustomCommandParams_3012 = /** @class */ (function () {
    function CustomCommandParams_3012() {
    }
    return CustomCommandParams_3012;
}());
/**
* 自定义指令 3013-移动界面内的元件
*/
var CustomCommandParams_3013 = /** @class */ (function () {
    function CustomCommandParams_3013() {
    }
    return CustomCommandParams_3013;
}());
/**
* 自定义指令 3014-添加材质
*/
var CustomCommandParams_3014 = /** @class */ (function () {
    function CustomCommandParams_3014() {
    }
    return CustomCommandParams_3014;
}());
/**
* 自定义指令 3015-更改材质
*/
var CustomCommandParams_3015 = /** @class */ (function () {
    function CustomCommandParams_3015() {
    }
    return CustomCommandParams_3015;
}());
/**
* 自定义指令 3016-删除材质
*/
var CustomCommandParams_3016 = /** @class */ (function () {
    function CustomCommandParams_3016() {
    }
    return CustomCommandParams_3016;
}());
/**
* 自定义指令 3017-
*/
var CustomCommandParams_3017 = /** @class */ (function () {
    function CustomCommandParams_3017() {
    }
    return CustomCommandParams_3017;
}());
/**
* 自定义指令 3018-显示视频
*/
var CustomCommandParams_3018 = /** @class */ (function () {
    function CustomCommandParams_3018() {
    }
    return CustomCommandParams_3018;
}());
/**
* 自定义指令 3019-移动视频
*/
var CustomCommandParams_3019 = /** @class */ (function () {
    function CustomCommandParams_3019() {
    }
    return CustomCommandParams_3019;
}());
/**
* 自定义指令 3020-等待关闭界面
*/
var CustomCommandParams_3020 = /** @class */ (function () {
    function CustomCommandParams_3020() {
    }
    return CustomCommandParams_3020;
}());
/**
* 自定义指令 3021-等待视频播放完成
*/
var CustomCommandParams_3021 = /** @class */ (function () {
    function CustomCommandParams_3021() {
    }
    return CustomCommandParams_3021;
}());
/**
* 自定义指令 4001-允许玩家控制
*/
var CustomCommandParams_4001 = /** @class */ (function () {
    function CustomCommandParams_4001() {
    }
    return CustomCommandParams_4001;
}());
/**
* 自定义指令 4002-禁止玩家控制
*/
var CustomCommandParams_4002 = /** @class */ (function () {
    function CustomCommandParams_4002() {
    }
    return CustomCommandParams_4002;
}());
/**
* 自定义指令 4003-允许使用菜单
*/
var CustomCommandParams_4003 = /** @class */ (function () {
    function CustomCommandParams_4003() {
    }
    return CustomCommandParams_4003;
}());
/**
* 自定义指令 4004-禁止使用菜单
*/
var CustomCommandParams_4004 = /** @class */ (function () {
    function CustomCommandParams_4004() {
    }
    return CustomCommandParams_4004;
}());
/**
* 自定义指令 4005-开始游戏
*/
var CustomCommandParams_4005 = /** @class */ (function () {
    function CustomCommandParams_4005() {
    }
    return CustomCommandParams_4005;
}());
/**
* 自定义指令 4006-存档
*/
var CustomCommandParams_4006 = /** @class */ (function () {
    function CustomCommandParams_4006() {
    }
    return CustomCommandParams_4006;
}());
/**
* 自定义指令 4007-设置全局音量
*/
var CustomCommandParams_4007 = /** @class */ (function () {
    function CustomCommandParams_4007() {
    }
    return CustomCommandParams_4007;
}());
/**
* 自定义指令 4008-返回标题界面
*/
var CustomCommandParams_4008 = /** @class */ (function () {
    function CustomCommandParams_4008() {
    }
    return CustomCommandParams_4008;
}());
/**
* 自定义指令 4009-暂停游戏
*/
var CustomCommandParams_4009 = /** @class */ (function () {
    function CustomCommandParams_4009() {
    }
    return CustomCommandParams_4009;
}());
/**
* 自定义指令 4010-恢复游戏
*/
var CustomCommandParams_4010 = /** @class */ (function () {
    function CustomCommandParams_4010() {
    }
    return CustomCommandParams_4010;
}());
/**
* 自定义指令 4011-关闭窗口
*/
var CustomCommandParams_4011 = /** @class */ (function () {
    function CustomCommandParams_4011() {
    }
    return CustomCommandParams_4011;
}());
/**
* 自定义指令 4012-设置对话音效
*/
var CustomCommandParams_4012 = /** @class */ (function () {
    function CustomCommandParams_4012() {
    }
    return CustomCommandParams_4012;
}());
/**
* 自定义指令 4013-设置世界属性
*/
var CustomCommandParams_4013 = /** @class */ (function () {
    function CustomCommandParams_4013() {
    }
    return CustomCommandParams_4013;
}());
/**
* 自定义指令 4014-设置玩家属性
*/
var CustomCommandParams_4014 = /** @class */ (function () {
    function CustomCommandParams_4014() {
    }
    return CustomCommandParams_4014;
}());
/**
* 自定义指令 5001-播放背景音乐
*/
var CustomCommandParams_5001 = /** @class */ (function () {
    function CustomCommandParams_5001() {
    }
    return CustomCommandParams_5001;
}());
/**
* 自定义指令 5002-停止背景音乐
*/
var CustomCommandParams_5002 = /** @class */ (function () {
    function CustomCommandParams_5002() {
    }
    return CustomCommandParams_5002;
}());
/**
* 自定义指令 5003-播放环境声效
*/
var CustomCommandParams_5003 = /** @class */ (function () {
    function CustomCommandParams_5003() {
    }
    return CustomCommandParams_5003;
}());
/**
* 自定义指令 5004-停止环境声效
*/
var CustomCommandParams_5004 = /** @class */ (function () {
    function CustomCommandParams_5004() {
    }
    return CustomCommandParams_5004;
}());
/**
* 自定义指令 5005-播放音效
*/
var CustomCommandParams_5005 = /** @class */ (function () {
    function CustomCommandParams_5005() {
    }
    return CustomCommandParams_5005;
}());
/**
* 自定义指令 5006-停止音效
*/
var CustomCommandParams_5006 = /** @class */ (function () {
    function CustomCommandParams_5006() {
    }
    return CustomCommandParams_5006;
}());
/**
* 自定义指令 5007-播放语音
*/
var CustomCommandParams_5007 = /** @class */ (function () {
    function CustomCommandParams_5007() {
    }
    return CustomCommandParams_5007;
}());
/**
* 自定义指令 5008-停止语音
*/
var CustomCommandParams_5008 = /** @class */ (function () {
    function CustomCommandParams_5008() {
    }
    return CustomCommandParams_5008;
}());
/**
* 自定义指令 8001-增减场景对象的模块
*/
var CustomCommandParams_8001 = /** @class */ (function () {
    function CustomCommandParams_8001() {
    }
    return CustomCommandParams_8001;
}());
/**
* 自定义指令 8002-修改场景对象模块属性
*/
var CustomCommandParams_8002 = /** @class */ (function () {
    function CustomCommandParams_8002() {
    }
    return CustomCommandParams_8002;
}());
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义条件 1-场景对象
*/
var CustomConditionParams_1 = /** @class */ (function () {
    function CustomConditionParams_1() {
    }
    return CustomConditionParams_1;
}());
/**
* 自定义条件 2-界面
*/
var CustomConditionParams_2 = /** @class */ (function () {
    function CustomConditionParams_2() {
    }
    return CustomConditionParams_2;
}());
/**
* 自定义条件 3-系统信息
*/
var CustomConditionParams_3 = /** @class */ (function () {
    function CustomConditionParams_3() {
    }
    return CustomConditionParams_3;
}());
/**
* 自定义条件 4-模块
*/
var CustomConditionParams_4 = /** @class */ (function () {
    function CustomConditionParams_4() {
    }
    return CustomConditionParams_4;
}());
/**
* 自定义条件 5-世界
*/
var CustomConditionParams_5 = /** @class */ (function () {
    function CustomConditionParams_5() {
    }
    return CustomConditionParams_5;
}());
/**
* 自定义条件 6-玩家
*/
var CustomConditionParams_6 = /** @class */ (function () {
    function CustomConditionParams_6() {
    }
    return CustomConditionParams_6;
}());
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义游戏数值 1-场景
*/
var CustomGameNumberParams_1 = /** @class */ (function () {
    function CustomGameNumberParams_1() {
    }
    return CustomGameNumberParams_1;
}());
/**
* 自定义游戏数值 2-场景对象
*/
var CustomGameNumberParams_2 = /** @class */ (function () {
    function CustomGameNumberParams_2() {
    }
    return CustomGameNumberParams_2;
}());
/**
* 自定义游戏数值 3-场景对象关系
*/
var CustomGameNumberParams_3 = /** @class */ (function () {
    function CustomGameNumberParams_3() {
    }
    return CustomGameNumberParams_3;
}());
/**
* 自定义游戏数值 4-玩家
*/
var CustomGameNumberParams_4 = /** @class */ (function () {
    function CustomGameNumberParams_4() {
    }
    return CustomGameNumberParams_4;
}());
/**
* 自定义游戏数值 5-界面
*/
var CustomGameNumberParams_5 = /** @class */ (function () {
    function CustomGameNumberParams_5() {
    }
    return CustomGameNumberParams_5;
}());
/**
* 自定义游戏数值 6-鼠键
*/
var CustomGameNumberParams_6 = /** @class */ (function () {
    function CustomGameNumberParams_6() {
    }
    return CustomGameNumberParams_6;
}());
/**
* 自定义游戏数值 7-模块
*/
var CustomGameNumberParams_7 = /** @class */ (function () {
    function CustomGameNumberParams_7() {
    }
    return CustomGameNumberParams_7;
}());
/**
* 自定义游戏数值 8-世界
*/
var CustomGameNumberParams_8 = /** @class */ (function () {
    function CustomGameNumberParams_8() {
    }
    return CustomGameNumberParams_8;
}());
/**
* 自定义游戏数值 9-其他
*/
var CustomGameNumberParams_9 = /** @class */ (function () {
    function CustomGameNumberParams_9() {
    }
    return CustomGameNumberParams_9;
}());
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义游戏字符串 1-场景
*/
var CustomGameStringParams_1 = /** @class */ (function () {
    function CustomGameStringParams_1() {
    }
    return CustomGameStringParams_1;
}());
/**
* 自定义游戏字符串 2-场景对象
*/
var CustomGameStringParams_2 = /** @class */ (function () {
    function CustomGameStringParams_2() {
    }
    return CustomGameStringParams_2;
}());
/**
* 自定义游戏字符串 3-玩家
*/
var CustomGameStringParams_3 = /** @class */ (function () {
    function CustomGameStringParams_3() {
    }
    return CustomGameStringParams_3;
}());
/**
* 自定义游戏字符串 4-界面
*/
var CustomGameStringParams_4 = /** @class */ (function () {
    function CustomGameStringParams_4() {
    }
    return CustomGameStringParams_4;
}());
/**
* 自定义游戏字符串 5-模块
*/
var CustomGameStringParams_5 = /** @class */ (function () {
    function CustomGameStringParams_5() {
    }
    return CustomGameStringParams_5;
}());
/**
* 自定义游戏字符串 6-世界
*/
var CustomGameStringParams_6 = /** @class */ (function () {
    function CustomGameStringParams_6() {
    }
    return CustomGameStringParams_6;
}());
/**
* 自定义游戏字符串 7-系统
*/
var CustomGameStringParams_7 = /** @class */ (function () {
    function CustomGameStringParams_7() {
    }
    return CustomGameStringParams_7;
}());
/**
 * #1 道具
 */
var Module_Item = /** @class */ (function () {
    function Module_Item() {
    }
    return Module_Item;
}());
/**
 * #1 preloadAsset
 */
var DataStructure_preloadAsset = /** @class */ (function () {
    function DataStructure_preloadAsset() {
    }
    return DataStructure_preloadAsset;
}());
/**
 * #2 packageItem
 */
var DataStructure_packageItem = /** @class */ (function () {
    function DataStructure_packageItem() {
    }
    return DataStructure_packageItem;
}());
/**
 * #3 keys
 */
var DataStructure_keys = /** @class */ (function () {
    function DataStructure_keys() {
    }
    return DataStructure_keys;
}());
/**
 * #4 point
 */
var DataStructure_point = /** @class */ (function () {
    function DataStructure_point() {
    }
    return DataStructure_point;
}());
/**
 * #5 shopItem
 */
var DataStructure_shopItem = /** @class */ (function () {
    function DataStructure_shopItem() {
    }
    return DataStructure_shopItem;
}());
/**
 * #6 gameKeyboard
 */
var DataStructure_gameKeyboard = /** @class */ (function () {
    function DataStructure_gameKeyboard() {
    }
    return DataStructure_gameKeyboard;
}());
/**
 * #7 inputMessage
 */
var DataStructure_inputMessage = /** @class */ (function () {
    function DataStructure_inputMessage() {
    }
    return DataStructure_inputMessage;
}());
/**
 * #8 collisionGroupSetting
 */
var DataStructure_collisionGroupSetting = /** @class */ (function () {
    function DataStructure_collisionGroupSetting() {
    }
    return DataStructure_collisionGroupSetting;
}());
var WorldData = /** @class */ (function () {
    function WorldData() {
    }
    return WorldData;
}());
var PlayerData = /** @class */ (function () {
    function PlayerData() {
    }
    return PlayerData;
}());
/**
 * 该文件为GameCreator编辑器自动生成的代码
 */
/**
 * 材质数据基类
 */
var MaterialData = /** @class */ (function () {
    function MaterialData() {
        this.____timeInfo = {}; // 储存过渡的当前时间/帧信息，若同一个材质数据需要重置时间复用，可修改该属性后再重新添加材质
    }
    return MaterialData;
}());
/**
 * 材质1-色调变更
 */
var MaterialData1 = /** @class */ (function (_super) {
    __extends(MaterialData1, _super);
    function MaterialData1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 1;
        _this.r = 0; // 红 
        _this.g = 0; // 绿 
        _this.b = 0; // 蓝 
        _this.gray = 0; // 灰度 
        _this.mr = 1; // 红曝光 
        _this.mg = 1; // 绿曝光 
        _this.mb = 1; // 蓝曝光 
        _this.useTime = false; // 时间过渡 
        _this.time = ""; // 时间设定 
        return _this;
    }
    return MaterialData1;
}(MaterialData));
/**
 * 材质2-色相
 */
var MaterialData2 = /** @class */ (function (_super) {
    __extends(MaterialData2, _super);
    function MaterialData2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 2;
        _this.hue = 0; // 色相 
        return _this;
    }
    return MaterialData2;
}(MaterialData));
/**
 * 材质3-模糊
 */
var MaterialData3 = /** @class */ (function (_super) {
    __extends(MaterialData3, _super);
    function MaterialData3() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 3;
        _this.strength = 0; // 强度 
        _this.useTime = false; // 时间过渡 
        _this.time = ""; // 时间设定 
        return _this;
    }
    return MaterialData3;
}(MaterialData));
/**
 * 材质4-外发光
 */
var MaterialData4 = /** @class */ (function (_super) {
    __extends(MaterialData4, _super);
    function MaterialData4() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 4;
        _this.color = "#00FF00"; // 颜色 
        _this.blur = 2; // 模糊度 
        _this.offsetX = 0; // 水平偏移 
        _this.offsetY = 0; // 垂直偏移 
        return _this;
    }
    return MaterialData4;
}(MaterialData));
/**
 * 材质5-滚筒
 */
var MaterialData5 = /** @class */ (function (_super) {
    __extends(MaterialData5, _super);
    function MaterialData5() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 5;
        _this.useTrans = false; // 曲率过渡 
        _this.sigma = 0.2; // 曲率 
        _this.trans = ""; // 曲率过渡 
        _this.aspect = 1.7; // 纵横比 
        return _this;
    }
    return MaterialData5;
}(MaterialData));
/**
 * 材质6-色彩滚筒
 */
var MaterialData6 = /** @class */ (function (_super) {
    __extends(MaterialData6, _super);
    function MaterialData6() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 6;
        _this.useTrans = false; // 时间过渡 
        _this.time = 0; // 时间 
        _this.trans = ""; // 时间过渡 
        _this.useTrans1 = false; // 曲率过渡 
        _this.sigma = 0.2; // 曲率 
        _this.trans1 = ""; // 曲率过渡 
        _this.useTrans2 = false; // 强度过渡 
        _this.strength = 0.02; // 强度 
        _this.trans2 = ""; // 强度过渡 
        _this.aspect = 1.7; // 纵横比 
        return _this;
    }
    return MaterialData6;
}(MaterialData));
/**
 * 材质7-正片叠底
 */
var MaterialData7 = /** @class */ (function (_super) {
    __extends(MaterialData7, _super);
    function MaterialData7() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 7;
        _this.tex2 = ""; // 纹理贴图 
        _this.useTrans = false; // 时间过渡 
        _this.time = 1; // 时间 
        _this.trans = ""; // 时间过渡 
        return _this;
    }
    return MaterialData7;
}(MaterialData));
/**
 * 材质8-辉光
 */
var MaterialData8 = /** @class */ (function (_super) {
    __extends(MaterialData8, _super);
    function MaterialData8() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 8;
        _this.useTrans = false; // 时间过渡 
        _this.time = 0; // 时间 
        _this.trans = ""; // 时间过渡 
        _this.zoom = 0.5; // 缩放 
        _this.multiplier = 0.5; // 倍数 
        _this.centerX = 0.5; // 中心点X 
        _this.centerY = 0.5; // 中心点Y 
        return _this;
    }
    return MaterialData8;
}(MaterialData));
/**
 * 材质9-滤色
 */
var MaterialData9 = /** @class */ (function (_super) {
    __extends(MaterialData9, _super);
    function MaterialData9() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 9;
        _this.tex2 = ""; // 纹理贴图 
        _this.useTrans = false; // 时间过渡 
        _this.time = 0; // 时间 
        _this.trans = ""; // 时间过渡 
        return _this;
    }
    return MaterialData9;
}(MaterialData));
/**
 * 材质10-淡入淡出
 */
var MaterialData10 = /** @class */ (function (_super) {
    __extends(MaterialData10, _super);
    function MaterialData10() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 10;
        _this.mask = ""; // 遮罩贴图 
        _this.useTrans = false; // 时间过渡 
        _this.time = 0; // 时间 
        _this.trans = ""; // 时间过渡 
        _this.vagueness = 0.25; // 模糊 
        _this.invertMask = 0; // 反转遮罩 
        return _this;
    }
    return MaterialData10;
}(MaterialData));
/**
 * 材质11-混合添加
 */
var MaterialData11 = /** @class */ (function (_super) {
    __extends(MaterialData11, _super);
    function MaterialData11() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 11;
        _this.tex2 = ""; // 纹理贴图 
        _this.useTrans = false; // 时间过渡 
        _this.time = 0; // 时间 
        _this.trans = ""; // 时间过渡 
        _this.colorMulR = 1; // 色彩倍增r 
        _this.colorMulG = 1; // 色彩倍增g 
        _this.colorMulB = 1; // 色彩倍增b 
        _this.colorMulA = 1; // 色彩倍增a 
        _this.colorAddR = 0; // 色彩偏移r 
        _this.colorAddG = 0; // 色彩偏移g 
        _this.colorAddB = 0; // 色彩偏移b 
        _this.colorAddA = 0; // 色彩偏移a 
        _this.invertMask = 0; // 反转遮罩 
        _this.alphaFactor = 0; // a系数 
        return _this;
    }
    return MaterialData11;
}(MaterialData));
/**
 * 材质12-马赛克
 */
var MaterialData12 = /** @class */ (function (_super) {
    __extends(MaterialData12, _super);
    function MaterialData12() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 12;
        _this.trans = "false"; // 时间过渡 
        _this.pixelSize = 64; // 像素尺寸 
        return _this;
    }
    return MaterialData12;
}(MaterialData));
/**
 * 材质13-波浪
 */
var MaterialData13 = /** @class */ (function (_super) {
    __extends(MaterialData13, _super);
    function MaterialData13() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 13;
        _this.t = ""; // 时间过渡 
        _this.amplitude = 0.3; // 振幅 
        _this.angularVelocity = 10; // 角速度 
        _this.speed = 10; // 速度 速度为5的整数倍即可完成波浪的无缝循环
        return _this;
    }
    return MaterialData13;
}(MaterialData));
/**
 * 材质14-花屏闪烁
 */
var MaterialData14 = /** @class */ (function (_super) {
    __extends(MaterialData14, _super);
    function MaterialData14() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 14;
        _this.t = ""; // 时间过渡 
        _this.timeScale = 1; // 花屏速度 
        return _this;
    }
    return MaterialData14;
}(MaterialData));
/**
 * 材质15-热浪扭曲
 */
var MaterialData15 = /** @class */ (function (_super) {
    __extends(MaterialData15, _super);
    function MaterialData15() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 15;
        _this.tex2 = ""; // 纹理贴图 
        _this.uvScale = 1; // UV缩放比 
        _this.noiseTimeScale = 1; // 噪间缩放 
        _this.t = ""; // 时间过渡 
        return _this;
    }
    return MaterialData15;
}(MaterialData));
/**
 * 材质16-溶解
 */
var MaterialData16 = /** @class */ (function (_super) {
    __extends(MaterialData16, _super);
    function MaterialData16() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 16;
        _this.tex2 = ""; // 纹理贴图 
        _this.t = ""; // 时间过渡 
        _this.dissolveSpeed = 1; // 溶解速度 
        _this.edgeWidth = 1; // 边缘宽度 
        _this.edgeColorR = 1; // 边缘颜色r 
        _this.edgeColorG = 1; // 边缘颜色g 
        _this.edgeColorB = 1; // 边缘颜色b 
        _this.edgeColorA = 1; // 边缘颜色a 
        _this.startTime = 0; // 开始时间 
        return _this;
    }
    return MaterialData16;
}(MaterialData));
/**
 * 材质17-扫描翻页
 */
var MaterialData17 = /** @class */ (function (_super) {
    __extends(MaterialData17, _super);
    function MaterialData17() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 17;
        _this.lineColorR = 0; // 线条颜色r 
        _this.lineColorG = 0; // 线条颜色g 
        _this.lineColorB = 0; // 线条颜色b 
        _this.lineColorA = 0; // 线条颜色a 
        _this.lineWidth = 0.1; // 线条宽度 
        _this.rangeX = ""; // X过渡 
        return _this;
    }
    return MaterialData17;
}(MaterialData));
/**
 * 场景-项目层实现类
 * Created by 黑暗之神KDS on 2020-09-08 17:10:24.
 */
var ProjectClientScene = /** @class */ (function (_super) {
    __extends(ProjectClientScene, _super);
    //------------------------------------------------------------------------------------------------------
    // 实例
    //------------------------------------------------------------------------------------------------------
    /**
     * 构造函数
     */
    function ProjectClientScene() {
        return _super.call(this) || this;
    }
    ProjectClientScene.debugColor = function (mode) { return ["#FF0000", "#FFFF00", "#00FF00"][mode]; };
    ; // 0-障碍 1-穿透 2-桥属性
    ProjectClientScene.getDebugColorBySceneObject = function (target) {
        var debugColorMode = target.bridge ? 2 : (target.through ? 1 : 0);
        var deubugColor = ProjectClientScene.debugColor(debugColorMode);
        return deubugColor;
    };
    //------------------------------------------------------------------------------------------------------
    // 静态函数
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    ProjectClientScene.init = function () {
        // 注册自定义储存信息
        SinglePlayerGame.regSaveCustomData("Scene", Callback.New(this.getSaveData, this));
        // 恢复数据
        EventUtils.addEventListener(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, Callback.New(this.onInSceneStateChange, this));
    };
    /**
     * 根据设定获取场景对象
     * @param soType 类别：0-玩家的场景对象 1-触发者 2-执行者 3-指定编号
     * @param soIndex 指定的编号
     * @param pointSoMode [可选] 默认值=0 指定场景对象编号的模式 0-常量 1-变量
     * @param soIndexVarID [可选] 默认值=0 使用的变量ID
     * @param trigger [可选] 默认值=null 触发器，如在事件执行时调用该函数则可传递触发器过来使用，以便判定触发者、执行者
     */
    ProjectClientScene.getSceneObjectBySetting = function (soType, soIndex, pointSoMode, soIndexVarID, trigger) {
        if (pointSoMode === void 0) { pointSoMode = 0; }
        if (soIndexVarID === void 0) { soIndexVarID = 0; }
        if (trigger === void 0) { trigger = null; }
        var so;
        if (soType == 0) {
            so = Game.player.sceneObject;
        }
        else if (soType == 1) {
            so = trigger ? trigger.trigger : Game.player.sceneObject;
        }
        else if (soType == 2) {
            so = trigger ? trigger.executor : Game.player.sceneObject;
        }
        else if (soType == 3) {
            if (!Game.currentScene)
                return null;
            if (pointSoMode == 1) {
                soIndex = Game.player.variable.getVariable(soIndexVarID);
            }
            so = soIndex < 0 ? null : Game.currentScene.sceneObjects[soIndex];
        }
        return so;
    };
    /**
     * 获取辅助场景，如用于克隆里面的场景对象使用，并不会实际作为游戏场景使用
     * 已存在的话同步回调
     * @param sceneID 场景ID
     * @param onFin 完成时回调 onFin(scene:ClientScene,isSync)
     */
    ProjectClientScene.createSceneHelper = function (sceneID, onFin) {
        // 已存在缓存的场景则直接同步返回
        var scene = ProjectClientScene.sceneHelpers[sceneID];
        if (scene) {
            onFin.runWith([scene, true]);
            return;
        }
        // 如果已存在加载中的场景则监听一次加载完成事件后回调
        if (ProjectClientScene.sceneHelperLoadings[sceneID]) {
            EventUtils.addEventListener(ProjectClientScene, "____createSceneHelper", onFin, true);
            return;
        }
        ProjectClientScene.sceneHelperLoadings[sceneID] = true;
        ClientScene.createScene(sceneID, Callback.New(function (scene) {
            ProjectClientScene.sceneHelpers[scene.id] = scene;
            delete ProjectClientScene.sceneHelperLoadings[sceneID];
            onFin.runWith([scene, false]);
            EventUtils.happen(ProjectClientScene, "____createSceneHelper", [scene, false]);
        }, this));
    };
    /**
     * 销毁辅助场景
     * @param sceneID 场景ID
     */
    ProjectClientScene.disposeSceneHelper = function (sceneID) {
        var scene = ProjectClientScene.sceneHelpers[sceneID];
        if (scene) {
            scene.dispose();
            delete ProjectClientScene.sceneHelpers[sceneID];
            return true;
        }
        return false;
    };
    /**
     * 当场景解析时函数：由系统调用
     * @param jsonObj 解析数据
     * @param gameData 游戏数据
     */
    ProjectClientScene.prototype.parse = function (jsonObj, gameData) {
        _super.prototype.parse.call(this, jsonObj, gameData);
        // 创建场景工具
        this.sceneUtils = new SceneUtils(this);
    };
    /**
     * 当渲染时：每帧执行的逻辑
     */
    ProjectClientScene.prototype.onRender = function () {
        _super.prototype.onRender.apply(this, arguments);
        this.debugRender();
    };
    //------------------------------------------------------------------------------------------------------
    // 场景对象
    //------------------------------------------------------------------------------------------------------
    /**
     * 添加显示对象
     * @param soData 场景对象数据
     * @param isSoc [可选] 默认值=false 是否是实际的对象而非数据
     * @param useModelClass [可选] 默认值=false 是否使用场景对象模型的实现类
     * @return [ClientSceneObject] 添加的场景对象实例
     */
    ProjectClientScene.prototype.addSceneObject = function (soData, isSoc, useModelClass) {
        if (isSoc === void 0) { isSoc = false; }
        if (useModelClass === void 0) { useModelClass = false; }
        var soc = _super.prototype.addSceneObject.apply(this, arguments);
        if (soc) {
            // 动态障碍和桥数据更新
            this.sceneUtils.updateDynamicObsAndBridge(soc, true);
        }
        return soc;
    };
    /**
     * 移除显示对象
     * @param so 显示对象
     * @return [ClientSceneObject]
     */
    ProjectClientScene.prototype.removeSceneObject = function (so, removeFromList) {
        if (removeFromList === void 0) { removeFromList = true; }
        var soc = _super.prototype.removeSceneObject.apply(this, arguments);
        if (soc instanceof ProjectClientSceneObject) {
            var pSo = soc;
            // 清理其接触过的对象记录
            pSo.clearMyTouchRecord();
            pSo.clearTouchMeRecord();
            // 动态障碍和桥数据更新
            this.sceneUtils.updateDynamicObsAndBridge(soc, false);
        }
        return soc;
    };
    //------------------------------------------------------------------------------------------------------
    // 私有
    //------------------------------------------------------------------------------------------------------
    /**
     * DEBUG显示障碍数据
     */
    ProjectClientScene.prototype.debugRender = function () {
        if (WorldData.gridObsDebug && os.inGC() && !Config.RELEASE_GAME) {
            if (!this.debugLayer) {
                this.debugLayer = new ClientSceneLayer(this);
                this.addLayer(this.debugLayer);
                this.debugLayer.alpha = 0.7;
            }
            this.debugLayer.graphics.clear();
            var obstacleData = this.dataLayers[0];
            var bridgeData = this.dataLayers[2];
            for (var x = 0; x < this.gridWidth; x++) {
                for (var y = 0; y < this.gridHeight; y++) {
                    var gridStatus = this.sceneUtils.getGridDynamicObsStatus(new Point(x, y));
                    if (gridStatus == 1 || (bridgeData[x] && bridgeData[x][y])) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, ProjectClientScene.debugColor(2));
                        continue;
                    }
                    if (gridStatus == 2 && obstacleData[x] && obstacleData[x][y]) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF00FF");
                    }
                    if (gridStatus == 2) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF6600");
                    }
                    else if (obstacleData[x] && obstacleData[x][y]) {
                        this.debugLayer.graphics.drawRect(x * Config.SCENE_GRID_SIZE, y * Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, Config.SCENE_GRID_SIZE, "#FF0000");
                    }
                }
            }
        }
    };
    /**
     * 当场景状态改变时
     */
    ProjectClientScene.onInSceneStateChange = function (inNewSceneState) {
        // 读档的情况
        if (inNewSceneState == 2) {
            // 如果状态是加载场景的话：在恢复数据SinglePlayerGame.recoveryData之前进行一些处理
            if (GameGate.gateState == GameGate.STATE_1_START_LOAD_SCENE) {
                this.beforeRetorySaveData();
            }
            else if (GameGate.gateState == GameGate.STATE_2_START_EXECUTE_IN_SCENE_EVENT) {
                this.retorySceneObjectSaveData();
            }
            else if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
                this.retorySceneSaveData();
            }
        }
    };
    /**
     * 获取追加的自定义存档数据
     * -- 场景对象数据
     */
    ProjectClientScene.getSaveData = function () {
        if (!Game.currentScene || Game.currentScene == ClientScene.EMPTY)
            return;
        var soCustomDatas = [];
        for (var i in Game.currentScene.sceneObjects) {
            var so = Game.currentScene.sceneObjects[i];
            if (!so || !(so instanceof ProjectClientSceneObject))
                continue;
            if (so.getSaveData)
                soCustomDatas[i] = so.getSaveData();
        }
        return soCustomDatas;
    };
    /**
     * 恢复数据前的处理
     */
    ProjectClientScene.beforeRetorySaveData = function () {
        var _this = this;
        // 监听触发器恢复事件：监听需要玩家操作等待的事件：进入场景事件、场景对象点击事件、需要等待的场景对象碰触事件
        EventUtils.addEventListener(SinglePlayerGame, SinglePlayerGame.EVENT_RECOVER_TRIGGER, Callback.New(function (trigger) {
            // 场景
            if ((trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE && trigger.indexType == 0) || // 进入场景事件
                (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && trigger.indexType == 0) || // 场景对象点击事件
                (trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT && trigger.indexType == 1 && // 需要等待的场景对象碰触事件
                    trigger.trigger == Game.player.sceneObject && trigger.executor.waitTouchEvent)) {
                ProjectClientScene.hasRetoryWaitEvent = true;
                EventUtils.addEventListener(trigger, CommandTrigger.EVENT_OVER, Callback.New(function (trigger) {
                    if (trigger.executor != Game.player.sceneObject)
                        trigger.executor.eventCompleteContinue();
                    Controller.start();
                }, _this, [trigger]), true);
            }
        }, this));
    };
    /**
     * 恢复场景对象数据
     */
    ProjectClientScene.retorySceneObjectSaveData = function () {
        // 恢复场景对象数据
        var soCustomDatas = SinglePlayerGame.getSaveCustomData("Scene");
        for (var i in soCustomDatas) {
            var soData = soCustomDatas[i];
            var so = Game.currentScene.sceneObjects[i];
            if (so && soData && so.retorySaveData)
                so.retorySaveData(soData);
        }
    };
    /**
     * 恢复场景数据
     */
    ProjectClientScene.retorySceneSaveData = function () {
        // 如果未恢复让玩家无法控制的事件时则允许控制
        if (!ProjectClientScene.hasRetoryWaitEvent) {
            Controller.start();
        }
    };
    /**
     * 辅助场景集合，克隆其内的场景对象需要预先创建该场景
     */
    ProjectClientScene.sceneHelpers = {};
    ProjectClientScene.sceneHelperLoadings = {};
    return ProjectClientScene;
}(ClientScene));
/**
 * 项目层-玩家实现类
 *
 * Created by 黑暗之神KDS on 2020-03-03 09:04:41.
 */
var ProjectPlayer = /** @class */ (function (_super) {
    __extends(ProjectPlayer, _super);
    /**
     * 构造函数
     */
    function ProjectPlayer() {
        return _super.call(this, true) || this;
    }
    //------------------------------------------------------------------------------------------------------
    // 静态方法-属性
    //------------------------------------------------------------------------------------------------------
    /**
     * 增加金币
     * @param v 增加的数
     */
    ProjectPlayer.increaseGold = function (v) {
        // 修改金币
        Game.player.data.gold = Math.max(Game.player.data.gold + v, 0);
        // 派发事件
        EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER);
    };
    //------------------------------------------------------------------------------------------------------
    // 静态方法-背包
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取道具-DS类型
     * @param itemID 道具ID
     * @return [DataStructure_packageItem]
     */
    ProjectPlayer.getItemDS = function (itemID) {
        return ArrayUtils.matchAttributesD2(Game.player.data.package, "item", { id: itemID }, true)[0];
    };
    /**
     * 获取道具
     * @param itemID 道具ID
     * @return [Module_Item]
     */
    ProjectPlayer.getItem = function (itemID) {
        var itemDS = this.getItemDS(itemID);
        if (itemDS)
            return itemDS.item;
        return null;
    };
    /**
     * 改变道具数目（增减道具）
     * @param itemID 道具ID
     * @param v 增加或减少的数目
     */
    ProjectPlayer.changeItemNumber = function (itemID, v) {
        // 道具不存在的情况：忽略
        if (!GameData.getModuleData(1, itemID))
            return;
        // 增加的情况
        if (v > 0) {
            var itemDS = this.getItemDS(itemID);
            if (itemDS) {
                itemDS.number += v;
            }
            else {
                itemDS = new DataStructure_packageItem;
                itemDS.item = GameData.newModuleData(1, itemID);
                itemDS.number = v;
                Game.player.data.package.push(itemDS);
            }
        }
        // 减少的情况
        else {
            var itemDS = this.getItemDS(itemID);
            if (itemDS) {
                itemDS.number += v;
                if (itemDS.number <= 0)
                    Game.player.data.package.splice(Game.player.data.package.indexOf(itemDS), 1);
            }
        }
        // 派发事件
        EventUtils.happen(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER);
    };
    //------------------------------------------------------------------------------------------------------
    // 静态变量
    //------------------------------------------------------------------------------------------------------
    /**
      * 事件：监听道具数目改变
      */
    ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER = "ProjectPlayerCHANGE_ITEM_NUMBER";
    /**
     * 事件：监听金币改变
     */
    ProjectPlayer.EVENT_CHANGE_GOLD_NUMBER = "ProjectPlayerCHANGE_GOLD_NUMBER";
    return ProjectPlayer;
}(ClientPlayer));
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
 * 场景对象模块基类
 */
var SceneObjectModule = /** @class */ (function () {
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    function SceneObjectModule(installCB) {
        installCB && installCB.runWith([this]);
    }
    /**
     * 当移除模块时执行的函数
     */
    SceneObjectModule.prototype.onRemoved = function () {
    };
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    SceneObjectModule.prototype.refresh = function () {
    };
    /**
     * 当卸载模块时执行的函数
     */
    SceneObjectModule.prototype.dispose = function () {
        this.so = null;
        this.name = null;
        this.isDisposed = true;
    };
    SceneObjectModule.moduleClassArr = [];
    return SceneObjectModule;
}());
/**
 * 场景对象公共类，任何场景对象都继承该类
 */
var SceneObjectCommon = /** @class */ (function (_super) {
    __extends(SceneObjectCommon, _super);
    function SceneObjectCommon(soData, scene) {
        return _super.call(this, soData, scene) || this;
    }
    return SceneObjectCommon;
}(ClientSceneObject));
/**
 * 场景对象模型：影子（极简）
 */
var SceneObjectModule_1 = /** @class */ (function (_super) {
    __extends(SceneObjectModule_1, _super);
    function SceneObjectModule_1(installCB) {
        return _super.call(this, installCB) || this;
    }
    return SceneObjectModule_1;
}(SceneObjectModule));
SceneObjectModule.moduleClassArr[1] = SceneObjectModule_1;
/**
 * 场景对象模型：行走图材质
 */
var SceneObjectModule_2 = /** @class */ (function (_super) {
    __extends(SceneObjectModule_2, _super);
    function SceneObjectModule_2(installCB) {
        return _super.call(this, installCB) || this;
    }
    return SceneObjectModule_2;
}(SceneObjectModule));
SceneObjectModule.moduleClassArr[2] = SceneObjectModule_2;
/**
 * 场景对象模型：动画
 */
var SceneObjectModule_3 = /** @class */ (function (_super) {
    __extends(SceneObjectModule_3, _super);
    function SceneObjectModule_3(installCB) {
        return _super.call(this, installCB) || this;
    }
    return SceneObjectModule_3;
}(SceneObjectModule));
SceneObjectModule.moduleClassArr[3] = SceneObjectModule_3;
/**
 * 场景对象模型：自定义碰撞
 */
var SceneObjectModule_4 = /** @class */ (function (_super) {
    __extends(SceneObjectModule_4, _super);
    function SceneObjectModule_4(installCB) {
        return _super.call(this, installCB) || this;
    }
    return SceneObjectModule_4;
}(SceneObjectModule));
SceneObjectModule.moduleClassArr[4] = SceneObjectModule_4;
/**
 * 场景对象模型：光影
 */
var SceneObjectModule_5 = /** @class */ (function (_super) {
    __extends(SceneObjectModule_5, _super);
    function SceneObjectModule_5(installCB) {
        return _super.call(this, installCB) || this;
    }
    return SceneObjectModule_5;
}(SceneObjectModule));
SceneObjectModule.moduleClassArr[5] = SceneObjectModule_5;
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
 * 1-标题界面 [BASE]
 */
var GUI_1 = /** @class */ (function (_super) {
    __extends(GUI_1, _super);
    function GUI_1() {
        return _super.call(this, 1) || this;
    }
    return GUI_1;
}(GUI_BASE));
var ListItem_1 = /** @class */ (function (_super) {
    __extends(ListItem_1, _super);
    function ListItem_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1;
}(UIListItemData));
/**
 * 2-读档界面 [BASE]
 */
var GUI_2 = /** @class */ (function (_super) {
    __extends(GUI_2, _super);
    function GUI_2() {
        return _super.call(this, 2) || this;
    }
    return GUI_2;
}(GUI_BASE));
var ListItem_2 = /** @class */ (function (_super) {
    __extends(ListItem_2, _super);
    function ListItem_2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2;
}(UIListItemData));
/**
 * 3-菜单界面 [BASE]
 */
var GUI_3 = /** @class */ (function (_super) {
    __extends(GUI_3, _super);
    function GUI_3() {
        return _super.call(this, 3) || this;
    }
    return GUI_3;
}(GUI_BASE));
var ListItem_3 = /** @class */ (function (_super) {
    __extends(ListItem_3, _super);
    function ListItem_3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_3;
}(UIListItemData));
/**
 * 4-背包界面 [BASE]
 */
var GUI_4 = /** @class */ (function (_super) {
    __extends(GUI_4, _super);
    function GUI_4() {
        return _super.call(this, 4) || this;
    }
    return GUI_4;
}(GUI_BASE));
var ListItem_4 = /** @class */ (function (_super) {
    __extends(ListItem_4, _super);
    function ListItem_4() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_4;
}(UIListItemData));
/**
 * 5-存档界面 [BASE]
 */
var GUI_5 = /** @class */ (function (_super) {
    __extends(GUI_5, _super);
    function GUI_5() {
        return _super.call(this, 5) || this;
    }
    return GUI_5;
}(GUI_BASE));
var ListItem_5 = /** @class */ (function (_super) {
    __extends(ListItem_5, _super);
    function ListItem_5() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_5;
}(UIListItemData));
/**
 * 6-系统设置 [BASE]
 */
var GUI_6 = /** @class */ (function (_super) {
    __extends(GUI_6, _super);
    function GUI_6() {
        return _super.call(this, 6) || this;
    }
    return GUI_6;
}(GUI_BASE));
var ListItem_6 = /** @class */ (function (_super) {
    __extends(ListItem_6, _super);
    function ListItem_6() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_6;
}(UIListItemData));
/**
 * 7-文本输入界面 [BASE]
 */
var GUI_7 = /** @class */ (function (_super) {
    __extends(GUI_7, _super);
    function GUI_7() {
        return _super.call(this, 7) || this;
    }
    return GUI_7;
}(GUI_BASE));
var ListItem_7 = /** @class */ (function (_super) {
    __extends(ListItem_7, _super);
    function ListItem_7() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_7;
}(UIListItemData));
/**
 * 8-数字输入界面 [BASE]
 */
var GUI_8 = /** @class */ (function (_super) {
    __extends(GUI_8, _super);
    function GUI_8() {
        return _super.call(this, 8) || this;
    }
    return GUI_8;
}(GUI_BASE));
var ListItem_8 = /** @class */ (function (_super) {
    __extends(ListItem_8, _super);
    function ListItem_8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_8;
}(UIListItemData));
/**
 * 9-密码输入界面 [BASE]
 */
var GUI_9 = /** @class */ (function (_super) {
    __extends(GUI_9, _super);
    function GUI_9() {
        return _super.call(this, 9) || this;
    }
    return GUI_9;
}(GUI_BASE));
var ListItem_9 = /** @class */ (function (_super) {
    __extends(ListItem_9, _super);
    function ListItem_9() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_9;
}(UIListItemData));
/**
 * 10-游戏结束界面 [BASE]
 */
var GUI_10 = /** @class */ (function (_super) {
    __extends(GUI_10, _super);
    function GUI_10() {
        return _super.call(this, 10) || this;
    }
    return GUI_10;
}(GUI_BASE));
var ListItem_10 = /** @class */ (function (_super) {
    __extends(ListItem_10, _super);
    function ListItem_10() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_10;
}(UIListItemData));
/**
 * 11-商店界面 [BASE]
 */
var GUI_11 = /** @class */ (function (_super) {
    __extends(GUI_11, _super);
    function GUI_11() {
        return _super.call(this, 11) || this;
    }
    return GUI_11;
}(GUI_BASE));
var ListItem_11 = /** @class */ (function (_super) {
    __extends(ListItem_11, _super);
    function ListItem_11() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_11;
}(UIListItemData));
/**
 * 12-虚拟按键 [BASE]
 */
var GUI_12 = /** @class */ (function (_super) {
    __extends(GUI_12, _super);
    function GUI_12() {
        return _super.call(this, 12) || this;
    }
    return GUI_12;
}(GUI_BASE));
var ListItem_12 = /** @class */ (function (_super) {
    __extends(ListItem_12, _super);
    function ListItem_12() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_12;
}(UIListItemData));
/**
 * 13-计时器 [BASE]
 */
var GUI_13 = /** @class */ (function (_super) {
    __extends(GUI_13, _super);
    function GUI_13() {
        return _super.call(this, 13) || this;
    }
    return GUI_13;
}(GUI_BASE));
var ListItem_13 = /** @class */ (function (_super) {
    __extends(ListItem_13, _super);
    function ListItem_13() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_13;
}(UIListItemData));
/**
 * 14- [BASE]
 */
var GUI_14 = /** @class */ (function (_super) {
    __extends(GUI_14, _super);
    function GUI_14() {
        return _super.call(this, 14) || this;
    }
    return GUI_14;
}(GUI_BASE));
var ListItem_14 = /** @class */ (function (_super) {
    __extends(ListItem_14, _super);
    function ListItem_14() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_14;
}(UIListItemData));
/**
 * 1001-档案_Item [BASE]
 */
var GUI_1001 = /** @class */ (function (_super) {
    __extends(GUI_1001, _super);
    function GUI_1001() {
        return _super.call(this, 1001) || this;
    }
    return GUI_1001;
}(GUI_BASE));
var ListItem_1001 = /** @class */ (function (_super) {
    __extends(ListItem_1001, _super);
    function ListItem_1001() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1001;
}(UIListItemData));
/**
 * 1002-道具_Item [BASE]
 */
var GUI_1002 = /** @class */ (function (_super) {
    __extends(GUI_1002, _super);
    function GUI_1002() {
        return _super.call(this, 1002) || this;
    }
    return GUI_1002;
}(GUI_BASE));
var ListItem_1002 = /** @class */ (function (_super) {
    __extends(ListItem_1002, _super);
    function ListItem_1002() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1002;
}(UIListItemData));
/**
 * 1003-商品_Item [BASE]
 */
var GUI_1003 = /** @class */ (function (_super) {
    __extends(GUI_1003, _super);
    function GUI_1003() {
        return _super.call(this, 1003) || this;
    }
    return GUI_1003;
}(GUI_BASE));
var ListItem_1003 = /** @class */ (function (_super) {
    __extends(ListItem_1003, _super);
    function ListItem_1003() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1003;
}(UIListItemData));
/**
 * 1004- [BASE]
 */
var GUI_1004 = /** @class */ (function (_super) {
    __extends(GUI_1004, _super);
    function GUI_1004() {
        return _super.call(this, 1004) || this;
    }
    return GUI_1004;
}(GUI_BASE));
var ListItem_1004 = /** @class */ (function (_super) {
    __extends(ListItem_1004, _super);
    function ListItem_1004() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1004;
}(UIListItemData));
/**
 * 1005- [BASE]
 */
var GUI_1005 = /** @class */ (function (_super) {
    __extends(GUI_1005, _super);
    function GUI_1005() {
        return _super.call(this, 1005) || this;
    }
    return GUI_1005;
}(GUI_BASE));
var ListItem_1005 = /** @class */ (function (_super) {
    __extends(ListItem_1005, _super);
    function ListItem_1005() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1005;
}(UIListItemData));
/**
 * 1006- [BASE]
 */
var GUI_1006 = /** @class */ (function (_super) {
    __extends(GUI_1006, _super);
    function GUI_1006() {
        return _super.call(this, 1006) || this;
    }
    return GUI_1006;
}(GUI_BASE));
var ListItem_1006 = /** @class */ (function (_super) {
    __extends(ListItem_1006, _super);
    function ListItem_1006() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1006;
}(UIListItemData));
/**
 * 1007- [BASE]
 */
var GUI_1007 = /** @class */ (function (_super) {
    __extends(GUI_1007, _super);
    function GUI_1007() {
        return _super.call(this, 1007) || this;
    }
    return GUI_1007;
}(GUI_BASE));
var ListItem_1007 = /** @class */ (function (_super) {
    __extends(ListItem_1007, _super);
    function ListItem_1007() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1007;
}(UIListItemData));
/**
 * 1008-按钮选中效果样式1 [BASE]
 */
var GUI_1008 = /** @class */ (function (_super) {
    __extends(GUI_1008, _super);
    function GUI_1008() {
        return _super.call(this, 1008) || this;
    }
    return GUI_1008;
}(GUI_BASE));
var ListItem_1008 = /** @class */ (function (_super) {
    __extends(ListItem_1008, _super);
    function ListItem_1008() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1008;
}(UIListItemData));
/**
 * 1009-按钮选中效果样式2 [BASE]
 */
var GUI_1009 = /** @class */ (function (_super) {
    __extends(GUI_1009, _super);
    function GUI_1009() {
        return _super.call(this, 1009) || this;
    }
    return GUI_1009;
}(GUI_BASE));
var ListItem_1009 = /** @class */ (function (_super) {
    __extends(ListItem_1009, _super);
    function ListItem_1009() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1009;
}(UIListItemData));
/**
 * 1010-按钮选中效果样式3 [BASE]
 */
var GUI_1010 = /** @class */ (function (_super) {
    __extends(GUI_1010, _super);
    function GUI_1010() {
        return _super.call(this, 1010) || this;
    }
    return GUI_1010;
}(GUI_BASE));
var ListItem_1010 = /** @class */ (function (_super) {
    __extends(ListItem_1010, _super);
    function ListItem_1010() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1010;
}(UIListItemData));
/**
 * 1011- [BASE]
 */
var GUI_1011 = /** @class */ (function (_super) {
    __extends(GUI_1011, _super);
    function GUI_1011() {
        return _super.call(this, 1011) || this;
    }
    return GUI_1011;
}(GUI_BASE));
var ListItem_1011 = /** @class */ (function (_super) {
    __extends(ListItem_1011, _super);
    function ListItem_1011() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1011;
}(UIListItemData));
/**
 * 1012- [BASE]
 */
var GUI_1012 = /** @class */ (function (_super) {
    __extends(GUI_1012, _super);
    function GUI_1012() {
        return _super.call(this, 1012) || this;
    }
    return GUI_1012;
}(GUI_BASE));
var ListItem_1012 = /** @class */ (function (_super) {
    __extends(ListItem_1012, _super);
    function ListItem_1012() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1012;
}(UIListItemData));
/**
 * 1013- [BASE]
 */
var GUI_1013 = /** @class */ (function (_super) {
    __extends(GUI_1013, _super);
    function GUI_1013() {
        return _super.call(this, 1013) || this;
    }
    return GUI_1013;
}(GUI_BASE));
var ListItem_1013 = /** @class */ (function (_super) {
    __extends(ListItem_1013, _super);
    function ListItem_1013() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1013;
}(UIListItemData));
/**
 * 1014- [BASE]
 */
var GUI_1014 = /** @class */ (function (_super) {
    __extends(GUI_1014, _super);
    function GUI_1014() {
        return _super.call(this, 1014) || this;
    }
    return GUI_1014;
}(GUI_BASE));
var ListItem_1014 = /** @class */ (function (_super) {
    __extends(ListItem_1014, _super);
    function ListItem_1014() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1014;
}(UIListItemData));
/**
 * 1015- [BASE]
 */
var GUI_1015 = /** @class */ (function (_super) {
    __extends(GUI_1015, _super);
    function GUI_1015() {
        return _super.call(this, 1015) || this;
    }
    return GUI_1015;
}(GUI_BASE));
var ListItem_1015 = /** @class */ (function (_super) {
    __extends(ListItem_1015, _super);
    function ListItem_1015() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1015;
}(UIListItemData));
/**
 * 1016- [BASE]
 */
var GUI_1016 = /** @class */ (function (_super) {
    __extends(GUI_1016, _super);
    function GUI_1016() {
        return _super.call(this, 1016) || this;
    }
    return GUI_1016;
}(GUI_BASE));
var ListItem_1016 = /** @class */ (function (_super) {
    __extends(ListItem_1016, _super);
    function ListItem_1016() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1016;
}(UIListItemData));
/**
 * 1017- [BASE]
 */
var GUI_1017 = /** @class */ (function (_super) {
    __extends(GUI_1017, _super);
    function GUI_1017() {
        return _super.call(this, 1017) || this;
    }
    return GUI_1017;
}(GUI_BASE));
var ListItem_1017 = /** @class */ (function (_super) {
    __extends(ListItem_1017, _super);
    function ListItem_1017() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1017;
}(UIListItemData));
/**
 * 1018-设置_Item1 [BASE]
 */
var GUI_1018 = /** @class */ (function (_super) {
    __extends(GUI_1018, _super);
    function GUI_1018() {
        return _super.call(this, 1018) || this;
    }
    return GUI_1018;
}(GUI_BASE));
var ListItem_1018 = /** @class */ (function (_super) {
    __extends(ListItem_1018, _super);
    function ListItem_1018() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1018;
}(UIListItemData));
/**
 * 1019-设置_Item2 [BASE]
 */
var GUI_1019 = /** @class */ (function (_super) {
    __extends(GUI_1019, _super);
    function GUI_1019() {
        return _super.call(this, 1019) || this;
    }
    return GUI_1019;
}(GUI_BASE));
var ListItem_1019 = /** @class */ (function (_super) {
    __extends(ListItem_1019, _super);
    function ListItem_1019() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1019;
}(UIListItemData));
/**
 * 1020- [BASE]
 */
var GUI_1020 = /** @class */ (function (_super) {
    __extends(GUI_1020, _super);
    function GUI_1020() {
        return _super.call(this, 1020) || this;
    }
    return GUI_1020;
}(GUI_BASE));
var ListItem_1020 = /** @class */ (function (_super) {
    __extends(ListItem_1020, _super);
    function ListItem_1020() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_1020;
}(UIListItemData));
/**
 * 2001-启动载入界面 [BASE]
 */
var GUI_2001 = /** @class */ (function (_super) {
    __extends(GUI_2001, _super);
    function GUI_2001() {
        return _super.call(this, 2001) || this;
    }
    return GUI_2001;
}(GUI_BASE));
var ListItem_2001 = /** @class */ (function (_super) {
    __extends(ListItem_2001, _super);
    function ListItem_2001() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2001;
}(UIListItemData));
/**
 * 2002-新游戏载入界面 [BASE]
 */
var GUI_2002 = /** @class */ (function (_super) {
    __extends(GUI_2002, _super);
    function GUI_2002() {
        return _super.call(this, 2002) || this;
    }
    return GUI_2002;
}(GUI_BASE));
var ListItem_2002 = /** @class */ (function (_super) {
    __extends(ListItem_2002, _super);
    function ListItem_2002() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2002;
}(UIListItemData));
/**
 * 2003-读档载入界面 [BASE]
 */
var GUI_2003 = /** @class */ (function (_super) {
    __extends(GUI_2003, _super);
    function GUI_2003() {
        return _super.call(this, 2003) || this;
    }
    return GUI_2003;
}(GUI_BASE));
var ListItem_2003 = /** @class */ (function (_super) {
    __extends(ListItem_2003, _super);
    function ListItem_2003() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2003;
}(UIListItemData));
/**
 * 2004-场景载入界面 [BASE]
 */
var GUI_2004 = /** @class */ (function (_super) {
    __extends(GUI_2004, _super);
    function GUI_2004() {
        return _super.call(this, 2004) || this;
    }
    return GUI_2004;
}(GUI_BASE));
var ListItem_2004 = /** @class */ (function (_super) {
    __extends(ListItem_2004, _super);
    function ListItem_2004() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2004;
}(UIListItemData));
/**
 * 2005- [BASE]
 */
var GUI_2005 = /** @class */ (function (_super) {
    __extends(GUI_2005, _super);
    function GUI_2005() {
        return _super.call(this, 2005) || this;
    }
    return GUI_2005;
}(GUI_BASE));
var ListItem_2005 = /** @class */ (function (_super) {
    __extends(ListItem_2005, _super);
    function ListItem_2005() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_2005;
}(UIListItemData));
/**
 * 3001-我的自定义界面 [BASE]
 */
var GUI_3001 = /** @class */ (function (_super) {
    __extends(GUI_3001, _super);
    function GUI_3001() {
        return _super.call(this, 3001) || this;
    }
    return GUI_3001;
}(GUI_BASE));
var ListItem_3001 = /** @class */ (function (_super) {
    __extends(ListItem_3001, _super);
    function ListItem_3001() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_3001;
}(UIListItemData));
/**
 * 3002- [BASE]
 */
var GUI_3002 = /** @class */ (function (_super) {
    __extends(GUI_3002, _super);
    function GUI_3002() {
        return _super.call(this, 3002) || this;
    }
    return GUI_3002;
}(GUI_BASE));
var ListItem_3002 = /** @class */ (function (_super) {
    __extends(ListItem_3002, _super);
    function ListItem_3002() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListItem_3002;
}(UIListItemData));
GameUI["__compCustomAttributes"] = { "UIRoot": ["enabledLimitView", "scrollShowType", "hScrollBar", "hScrollBg", "vScrollBar", "vScrollBg", "scrollWidth", "slowmotionType", "enabledWheel", "hScrollValue", "vScrollValue"], "UIButton": ["label", "image1", "grid9img1", "image2", "grid9img2", "image3", "grid9img3", "fontSize", "color", "overColor", "clickColor", "bold", "italic", "smooth", "align", "valign", "letterSpacing", "font", "textDx", "textDy", "textStroke", "textStrokeColor"], "UIBitmap": ["image", "grid9", "flip", "isTile", "pivotType", "isAdaptiveSize"], "UIString": ["text", "fontSize", "color", "bold", "italic", "smooth", "align", "valign", "leading", "letterSpacing", "font", "wordWrap", "overflow", "shadowEnabled", "shadowColor", "shadowDx", "shadowDy", "stroke", "strokeColor", "onChangeFragEvent"], "UIVariable": ["varMode", "varID", "fontSize", "color", "bold", "italic", "smooth", "align", "valign", "leading", "letterSpacing", "font", "wordWrap", "overflow", "shadowEnabled", "shadowColor", "shadowDx", "shadowDy", "stroke", "strokeColor", "onChangeFragEvent"], "UICustomGameNumber": ["customData", "previewNum", "previewFixed", "fontSize", "color", "bold", "italic", "smooth", "align", "valign", "leading", "letterSpacing", "font", "wordWrap", "overflow", "shadowEnabled", "shadowColor", "shadowDx", "shadowDy", "stroke", "strokeColor"], "UICustomGameString": ["customData", "inEditorText", "fontSize", "color", "bold", "italic", "smooth", "align", "valign", "leading", "letterSpacing", "font", "wordWrap", "overflow", "shadowEnabled", "shadowColor", "shadowDx", "shadowDy", "stroke", "strokeColor"], "UIAvatar": ["avatarID", "scaleNumberX", "scaleNumberY", "orientationIndex", "avatarFPS", "playOnce", "isPlay", "avatarFrame", "actionID", "avatarHue"], "UIStandAvatar": ["avatarID", "actionID", "scaleNumberX", "scaleNumberY", "flip", "playOnce", "isPlay", "avatarFrame", "avatarFPS", "avatarHue"], "UIAnimation": ["animationID", "scaleNumberX", "scaleNumberY", "aniFrame", "playFps", "playType", "showHitEffect", "silentMode"], "UIInput": ["text", "fontSize", "color", "prompt", "promptColor", "bold", "italic", "smooth", "align", "leading", "font", "wordWrap", "restrict", "inputMode", "maxChars", "shadowEnabled", "shadowColor", "shadowDx", "shadowDy", "onInputFragEvent", "onEnterFragEvent"], "UICheckBox": ["selected", "image1", "grid9img1", "image2", "grid9img2", "onChangeFragEvent"], "UISwitch": ["switchMode", "selected", "image1", "grid9img1", "image2", "grid9img2", "previewselected", "onChangeFragEvent"], "UITabBox": ["selectedIndex", "itemImage1", "grid9img1", "itemImage2", "grid9img2", "itemWidth", "itemHeight", "items", "rowMode", "spacing", "labelSize", "labelColor", "labelFont", "labelBold", "labelItalic", "smooth", "labelAlign", "labelValign", "labelLetterSpacing", "labelSelectedColor", "labelDx", "labelDy", "labelStroke", "labelStrokeColor", "onChangeFragEvent"], "UISlider": ["image1", "bgGrid9", "image2", "blockGrid9", "image3", "blockFillGrid9", "step", "min", "max", "value", "transverseMode", "blockFillMode", "blockPosMode", "fillStrething", "isBindingVarID", "bindingVarID", "onChangeFragEvent"], "UIGUI": ["guiID", "instanceClassName"], "UIList": ["itemModelGUI", "previewSize", "selectEnable", "repeatX", "itemWidth", "itemHeight", "spaceX", "spaceY", "scrollShowType", "hScrollBar", "hScrollBg", "vScrollBar", "vScrollBg", "scrollWidth", "selectImageURL", "selectImageGrid9", "selectedImageAlpha", "selectedImageOnTop", "overImageURL", "overImageGrid9", "overImageAlpha", "overImageOnTop", "overSelectMode", "slowmotionType", "onChangeFragEvent1", "onChangeFragEvent2"], "UIComboBox": ["itemLabels", "selectedIndex", "bgSkin", "bgGrid9", "fontSize", "color", "bold", "italic", "smooth", "align", "valign", "letterSpacing", "font", "textDx", "textStroke", "textStrokeColor", "displayItemSize", "listScrollBg", "listScrollBar", "listAlpha", "listBgColor", "itemHeight", "itemFontSize", "itemColor", "itemBold", "itemItalic", "itemAlign", "itemValign", "itemLetterSpacing", "itemFont", "itemOverColor", "itemOverBgColor", "itemTextDx", "itemTextDy", "itemTextStroke", "itemTextStrokeColor", "onChangeFragEvent"], "UIVideo": ["videoURL", "playType", "volume", "playbackRate", "currentTime", "muted", "loop", "pivotType", "flip", "onLoadedFragEvent", "onErrorFragEvent", "onCompleteFragEvent"] };
/**
 * 场景对象模块-行走图材质
 * Created by 黑暗之神KDS on 2021-11-02 05:06:12.
 */
var SoModule_AvatarMaterial = /** @class */ (function (_super) {
    __extends(SoModule_AvatarMaterial, _super);
    /**
     * 构造函数
     * @param installCB
     */
    function SoModule_AvatarMaterial(installCB) {
        var _this = _super.call(this, installCB) || this;
        // 此处追加材质，以便不会影响它可能已有的其他材质，如果仅用于覆盖
        // 则：this.so.avatar.installMaterialData(this.materialData);
        for (var i = 0; i < _this.materialData.length; i++) {
            var materials = _this.materialData[i].materials;
            for (var s = 0; s < materials.length; s++) {
                _this.so.avatar.addMaterial(materials[s]);
            }
        }
        return _this;
    }
    /**
     * 模块移除时
     */
    SoModule_AvatarMaterial.prototype.onRemoved = function () {
        for (var i = 0; i < this.materialData.length; i++) {
            var materials = this.materialData[i].materials;
            for (var s = 0; s < materials.length; s++) {
                this.so.avatar.removeMaterial(materials[s]);
            }
        }
    };
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    SoModule_AvatarMaterial.prototype.refresh = function () {
    };
    return SoModule_AvatarMaterial;
}(SceneObjectModule_2));
/**
 * 场景对象模块-自定义碰撞
 * Created by Karson.DS on 2025-03-19 07:21:23.
 */
var SoModule_CustomCollision = /** @class */ (function (_super) {
    __extends(SoModule_CustomCollision, _super);
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    function SoModule_CustomCollision(installCB) {
        var _this = _super.call(this, installCB) || this;
        _this.init();
        SoModule_CustomCollision.arr.push(_this);
        return _this;
    }
    /**
     * 当移除模块时执行的函数
     */
    SoModule_CustomCollision.prototype.onRemoved = function () {
        os.remove_ENTERFRAME(this.onDebugUpdate, this);
        EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this);
        SoModule_CustomCollision.arr.splice(SoModule_CustomCollision.arr.indexOf(this), 1);
        if (SoModule_CustomCollision.DEBUG_DRAW) {
            this.so.root.graphics.clear();
        }
    };
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    SoModule_CustomCollision.prototype.refresh = function () {
    };
    Object.defineProperty(SoModule_CustomCollision.prototype, "isObstacle", {
        /**
         * 是否视为障碍
         */
        get: function () {
            return !this.so.through;
        },
        enumerable: false,
        configurable: true
    });
    //------------------------------------------------------------------------------------------------------
    //  碰撞检测
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取 target 与当前场景的所有自定义碰撞体的-碰撞检测
     * @param target 目标对象
     * @param onlyOne 碰撞成功一个后就返回
     * @param designatedPoint [可选] 指定的坐标，如果存在则使用该坐标而非target的坐标
     * @param onlyCheckObs [可选] 只检测障碍
     * @param conditionFunction [可选] 检查条件，满足条件才加入列表
     * @returns
     */
    SoModule_CustomCollision.collisionTest = function (target, onlyOne, designatedPoint, onlyCheckObs, conditionFunction) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        if (onlyCheckObs === void 0) { onlyCheckObs = false; }
        if (conditionFunction === void 0) { conditionFunction = null; }
        // 
        var targetCustomCollision = target.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
        if (targetCustomCollision)
            targetCustomCollision.refreshRange(designatedPoint);
        var arr = [];
        for (var i = 0; i < SoModule_CustomCollision.arr.length; i++) {
            var cc = SoModule_CustomCollision.arr[i];
            if (cc.so == target)
                continue;
            if (onlyCheckObs && !cc.isObstacle)
                continue;
            cc.refreshRange();
            if (cc.isInRange(target, targetCustomCollision, designatedPoint)) {
                if (conditionFunction) {
                    var isAddToList = conditionFunction.apply(this, [cc.so, cc]);
                    if (!isAddToList)
                        continue;
                }
                arr.push({ so: cc.so, collision: cc });
                if (onlyOne)
                    break;
            }
        }
        return arr;
    };
    /**
     * 碰撞测试-与普通对象（无自定义碰撞）
     */
    SoModule_CustomCollision.prototype.collisionTestByNormalTarget = function (target) {
        this.refreshRange();
        if (target.avatarID != 0 && this.isInRange(target, null)) {
            return true;
        }
        return false;
    };
    //------------------------------------------------------------------------------------------------------
    //  
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    SoModule_CustomCollision.prototype.init = function () {
        if (GameGate.gateState < GameGate.STATE_4_PLAYER_CONTROL_START) {
            EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.init, this, null, true);
        }
        else {
            this.onUpdateStart();
        }
        this.refreshRange();
    };
    /**
     * 帧刷开始
     */
    SoModule_CustomCollision.prototype.onUpdateStart = function () {
        if (SoModule_CustomCollision.DEBUG_DRAW == null)
            SoModule_CustomCollision.DEBUG_DRAW = WorldData.rectObsDebug && os.inGC() && !Config.RELEASE_GAME;
        if (SoModule_CustomCollision.DEBUG_DRAW)
            os.add_ENTERFRAME(this.onDebugUpdate, this);
    };
    /**
     * 刷新（DEBUG-帧刷）
     */
    SoModule_CustomCollision.prototype.onDebugUpdate = function () {
        if (!Game.currentScene)
            return;
        var forceRefreshRange = false;
        if (Game.currentScene.camera.scaleX != this.debug_recordCameraScale) {
            this.debug_recordCameraScale = Game.currentScene.camera.scaleX;
            forceRefreshRange = true;
        }
        if (this.so.through != this.debug_recordThrough) {
            this.debug_recordThrough = this.so.through;
            forceRefreshRange = true;
        }
        if (this.so.bridge != this.debug_recordBridge) {
            this.debug_recordBridge = this.so.bridge;
            forceRefreshRange = true;
        }
        if (forceRefreshRange)
            this.refreshRange(null, true);
    };
    /**
     * 判断是否在范围内
     * @param designatedPoint [可选]指定的坐标，如果存在则使用该坐标而非target的坐标
     * @return [boolean]
     */
    SoModule_CustomCollision.prototype.isInRange = function (target, targetCustomCollision, designatedPoint) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        var targetCollisionType;
        var targetCollisionRangeRect;
        var targetCollisionRectPoints;
        var targetX = designatedPoint ? designatedPoint.x : target.x;
        var targetY = designatedPoint ? designatedPoint.y : target.y;
        if (!targetCustomCollision || targetCustomCollision.type == 1) {
            targetCollisionType = 0;
            var rectX = Math.floor(targetX - WorldData.sceneObjectCollisionSize * 0.5);
            var rectY = Math.floor(targetY - WorldData.sceneObjectCollisionSize * 0.5);
            var tr = targetCollisionRangeRect = new Rectangle(rectX, rectY, WorldData.sceneObjectCollisionSize, WorldData.sceneObjectCollisionSize);
            targetCollisionRectPoints = [[tr.x, tr.y], [tr.right, tr.y], [tr.right, tr.bottom], [tr.x, tr.bottom]];
        }
        else {
            targetCollisionType = targetCustomCollision.type;
            if (targetCustomCollision.type == 0) {
                targetCollisionRangeRect = targetCustomCollision.rangeRect;
                targetCollisionRectPoints = targetCustomCollision.rangeRectPoints;
            }
        }
        // -- 矩形
        if (this.type == 0) {
            // ---- 目标矩形与我的矩形-碰撞
            if (targetCollisionType == 0) {
                return this.rangeRect.intersects(targetCollisionRangeRect);
            }
            // ---- 目标的多边形与我的矩形-碰撞
            else if (targetCollisionType == 2) {
                return ProjectUtils.polygonsIntersectTest(targetCustomCollision.customShapePoints, this.rangeRectPoints);
            }
        }
        // -- 圆形：只与目标点距离判定
        else if (this.type == 1) {
            return Point.distanceSquare2(targetX, targetY, this.radiusCenterPoint.x, this.radiusCenterPoint.y) <= this.radius2;
        }
        // -- 自定义形状
        else if (this.type == 2) {
            // ---- 目标矩形与我的多边形-碰撞
            if (targetCollisionType == 0) {
                var r = ProjectUtils.polygonsIntersectTest(targetCollisionRectPoints, this.customShapePoints);
                return r;
            }
            // ---- 目标多边形与我的多边形-碰撞
            else if (targetCollisionType == 2) {
                return ProjectUtils.polygonsIntersectTest(targetCustomCollision.customShapePoints, this.customShapePoints);
            }
        }
        return false;
    };
    /**
     * 刷新范围区域
     * @param designatedPoint [可选]指定的坐标，如果存在则使用该坐标而非target的坐标
     */
    SoModule_CustomCollision.prototype.refreshRange = function (designatedPoint, force) {
        if (designatedPoint === void 0) { designatedPoint = null; }
        if (force === void 0) { force = false; }
        var px = designatedPoint ? designatedPoint.x : this.so.x;
        var py = designatedPoint ? designatedPoint.y : this.so.y;
        // 未改变坐标时不刷新
        if (!force && this.recordMyPoint && this.recordMyPoint.x == px && this.recordMyPoint.y == py)
            return;
        if (!this.recordMyPoint)
            this.recordMyPoint = new Point(px, py);
        else {
            this.recordMyPoint.x = px;
            this.recordMyPoint.y = py;
        }
        // -- 矩形
        if (this.type == 0) {
            var w = this.width;
            var h = this.height;
            var myRectX = px + this.offsetX;
            var myRectY = py + this.offsetY;
            if (!this.rangeRect)
                this.rangeRect = new Rectangle;
            this.rangeRect.x = myRectX;
            this.rangeRect.y = myRectY;
            this.rangeRect.width = w;
            this.rangeRect.height = h;
            this.rangeRectPoints = [[this.rangeRect.x, this.rangeRect.y], [this.rangeRect.right, this.rangeRect.y], [this.rangeRect.right, this.rangeRect.bottom], [this.rangeRect.x, this.rangeRect.bottom]];
            // debug display
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                this.so.root.graphics.clear();
                var r = this.rangeRect;
                this.so.root.graphics.drawLines(0, 0, [r.x - px, r.y - py, r.right - px, r.y - py, r.right - px, r.bottom - py, r.x - px, r.bottom - py, r.x - px, r.y - py], ProjectClientScene.getDebugColorBySceneObject(this.so), 2);
            }
        }
        // -- 圆形
        else if (this.type == 1) {
            var r = this.radius;
            this.radius2 = r * r;
            if (!this.radiusCenterPoint)
                this.radiusCenterPoint = new Point;
            this.radiusCenterPoint.x = px;
            this.radiusCenterPoint.y = py;
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                this.so.root.graphics.clear();
                this.so.root.graphics.drawCircle(0, 0, Math.floor(this.radius), null, ProjectClientScene.getDebugColorBySceneObject(this.so), 1);
            }
        }
        // -- 自定义形状
        else if (this.type == 2) {
            this.customShapePoints = [[px, py]];
            var debugArr = void 0;
            if (SoModule_CustomCollision.DEBUG_DRAW)
                debugArr = [0, 0];
            for (var i = 0; i < this.pointArr.length; i++) {
                var point = this.pointArr[i];
                var p = [px + point.x, py + point.y];
                this.customShapePoints.push(p);
                if (SoModule_CustomCollision.DEBUG_DRAW)
                    debugArr.push(point.x, point.y);
            }
            // debug display
            if (SoModule_CustomCollision.DEBUG_DRAW) {
                debugArr.push(0, 0);
                this.so.root.graphics.clear();
                this.so.root.graphics.drawLines(0, 0, debugArr, ProjectClientScene.getDebugColorBySceneObject(this.so), 2);
            }
        }
        return false;
    };
    /**
     * 自定义碰撞的模块编号
     */
    SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID = 4;
    /**
     * 障碍合集
     */
    SoModule_CustomCollision.arr = [];
    return SoModule_CustomCollision;
}(SceneObjectModule_4));
/**
 * 场景对象模块-光影
 * Created by Karson.DS on 2025-03-19 16:02:36.
 */
var SoModule_LightShadow = /** @class */ (function (_super) {
    __extends(SoModule_LightShadow, _super);
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    function SoModule_LightShadow(installCB) {
        var _this = _super.call(this, installCB) || this;
        _this.lightShineTransI = 0;
        _this.init();
        return _this;
    }
    /**
     * 当移除模块时执行的函数
     */
    SoModule_LightShadow.prototype.onRemoved = function () {
        this.clear();
        if (this.shadowAvatar) {
            this.so.shadow.removeChild(this.shadowAvatar);
            this.shadowAvatar.dispose();
            this.shadowAvatar = null;
        }
        if (this.lightImageObject) {
            this.lightImageObject.dispose();
            this.lightImageObject = null;
        }
        if (this.lightAnimationObject) {
            this.lightAnimationObject.dispose();
            this.lightAnimationObject = null;
        }
        if (this.shadowImageObject) {
            this.shadowImageObject.dispose();
            this.shadowImageObject = null;
        }
        if (this.shadowRoot) {
            this.shadowRoot.dispose();
            this.shadowRoot = null;
        }
        this.so.avatar.blendMode = null;
        this.so.avatar.off(Avatar.RENDER, this, this.onAvatarRender);
        os.remove_ENTERFRAME(this.lightBrightenUpdate, this);
        os.remove_ENTERFRAME(this.onDynamicShadowUpdate, this);
        this.so.avatarContainer.scaleX = 1;
        this.so.avatarContainer.scaleY = 1;
        this.so.avatarContainer.rotation = 0;
        this.so.avatarContainer.alpha = 1;
    };
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    SoModule_LightShadow.prototype.refresh = function () {
        this.init();
    };
    //------------------------------------------------------------------------------------------------------
    //  同步
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    SoModule_LightShadow.prototype.init = function () {
        this.clear();
        if (this.type == 0) {
            this.initLight();
        }
        else {
            this.initShadow();
        }
    };
    /**
     * 清理
     */
    SoModule_LightShadow.prototype.clear = function () {
        this.removeFromGroup();
        if (this.shadowRoot)
            this.shadowRoot.removeSelf();
        if (this.shadowAvatar)
            this.shadowAvatar.removeSelf();
        if (this.shadowImageObject)
            this.shadowImageObject.removeSelf();
        if (this.lightAnimationObject)
            this.lightAnimationObject.removeSelf();
        if (this.lightImageObject)
            this.lightImageObject.removeSelf();
    };
    //------------------------------------------------------------------------------------------------------
    //  光照
    //------------------------------------------------------------------------------------------------------
    /**
     * 光照初始化
     */
    SoModule_LightShadow.prototype.initLight = function () {
        this.addToLightGroup();
        // clear
        this.createLight();
        this.refreshLightStyle();
        this.startLightBrighten();
    };
    /**
     * 刷新光照样式
     */
    SoModule_LightShadow.prototype.refreshLightStyle = function () {
        var blendTarget;
        switch (this.lightStyleType) {
            case 0:
                blendTarget = this.so.avatar;
                break;
            case 1:
                blendTarget = this.lightImageObject;
                break;
            case 2:
                blendTarget = this.lightAnimationObject;
                break;
        }
        switch (this.lightBlendMode) {
            case 0:
                blendTarget.blendMode = null;
                break;
            case 1:
                blendTarget.blendMode = "lighter";
                break;
            case 2:
                blendTarget.blendMode = "blend5-1";
                break;
            case 3:
                blendTarget.blendMode = "blend4-1";
                break;
            case 4:
                blendTarget.blendMode = "blend4-7";
                break;
            case 5:
                blendTarget.blendMode = "blend4-4";
                break;
        }
    };
    /**
     * 光照作用开始
     */
    SoModule_LightShadow.prototype.startLightBrighten = function () {
        if (!this.lightBrighten)
            return;
        var lightRange2 = this.lightRange * this.lightRange;
        if (this.lightShineEnable) {
            this.lightShineTransData = GameUtils.getTransData(this.lightShineTransition);
        }
        os.remove_ENTERFRAME(this.lightBrightenUpdate, this);
        os.add_ENTERFRAME(this.lightBrightenUpdate, this, [lightRange2]);
    };
    /**
     * 光照作用-帧刷
     * @param lightRange2
     */
    SoModule_LightShadow.prototype.lightBrightenUpdate = function (lightRange2) {
        var _this = this;
        Callback.CallLaterBeforeRender(function () {
            if (_this.isDisposed)
                return;
            var shineValue;
            if (_this.lightShineEnable) {
                if (!_this.lightShineTransData)
                    return;
                var per = (_this.lightShineTransI % _this.lightShineTransData.totalTime) / _this.lightShineTransData.totalTime;
                shineValue = GameUtils.getValueByTransData(_this.lightShineTransData, per) * _this.lightShineValue + 1;
                _this.lightShineTransI++;
            }
            else {
                shineValue = 1;
            }
            // -- 获取同组的阴影
            var shadowGroup = SoModule_LightShadow.shadowArr[_this.groupID];
            if (shadowGroup) {
                for (var i = 0; i < shadowGroup.length; i++) {
                    var soModuleShadow = shadowGroup[i];
                    if (soModuleShadow.shadowType == 1 && soModuleShadow.brightenFrame != Game.frameCount) {
                        var dis2 = Point.distanceSquare2(_this.so.x, _this.so.y, soModuleShadow.so.x, soModuleShadow.so.y);
                        if (dis2 <= lightRange2) {
                            soModuleShadow.brightenFrame = Game.frameCount;
                            var lightStrength = 1 - dis2 / lightRange2; // 0~1
                            var shadowRotation = MathUtils.direction360(_this.so.x, _this.so.y, soModuleShadow.so.x, soModuleShadow.so.y);
                            var shadowAlpha = soModuleShadow.shadowOpacity * lightStrength * soModuleShadow.shadowOpacityFactor * shineValue;
                            var shadowScaleChangeValue = soModuleShadow.shadowMaxScale - soModuleShadow.shadowMinScale;
                            var shadowScaleY = (shadowScaleChangeValue * (1 - lightStrength) * soModuleShadow.shadowScaleFactor) * shineValue + soModuleShadow.shadowMinScale;
                            soModuleShadow.setShadowStyle(shadowAlpha, shadowScaleY, shadowRotation);
                        }
                    }
                }
            }
        }, this);
    };
    /**
     * 创建灯光
     */
    SoModule_LightShadow.prototype.createLight = function () {
        // -- 图片灯光
        if (this.lightStyleType == 1) {
            // clear
            if (this.so.avatar.id != 0)
                this.so.avatar.id = 0;
            this.so.avatar.blendMode = null;
            if (this.lightAnimationObject)
                this.lightAnimationObject.stop();
            // create
            if (!this.lightImageObject)
                this.lightImageObject = new UIBitmap;
            // set
            if (this.lightImageObject.image != this.lightImage) {
                this.lightImageObject.off(EventObject.LOADED, this, this.onLightImageLoaded);
                this.lightImageObject.once(EventObject.LOADED, this, this.onLightImageLoaded);
                this.lightImageObject.image = this.lightImage;
            }
            this.so.animationHighLayer.addChild(this.lightImageObject);
            this.lightImageObject.scaleX = this.lightAnimationScaleX;
            this.lightImageObject.scaleY = this.lightAnimationScaleY;
            this.lightImageObject.rotation = this.lightAnimationRotation;
            this.lightImageObject.alpha = this.lightOpacity;
            this.onLightImageLoaded();
        }
        // -- 动画灯光
        else if (this.lightStyleType == 2) {
            // clear
            if (this.so.avatar.id != 0)
                this.so.avatar.id = 0;
            this.so.avatar.blendMode = null;
            // create
            if (!this.lightAnimationObject) {
                this.lightAnimationObject = new GCAnimation;
                this.lightAnimationObject.loop = true;
            }
            // set
            if (!this.lightAnimationObject.isPlaying)
                this.lightAnimationObject.play();
            if (this.lightAnimationObject.id != this.lightAnimation)
                this.lightAnimationObject.id = this.lightAnimation;
            this.so.animationHighLayer.addChild(this.lightAnimationObject);
            this.lightAnimationObject.scaleX = this.lightAnimationScaleX;
            this.lightAnimationObject.scaleY = this.lightAnimationScaleY;
            this.lightAnimationObject.rotation = this.lightAnimationRotation;
            this.lightAnimationObject.alpha = this.lightOpacity;
        }
        // -- 行走图灯光
        else {
            if (this.so.avatar.id != this.so.avatarID)
                this.so.avatar.id = this.so.avatarID;
            if (this.lightAnimationObject)
                this.lightAnimationObject.stop();
            this.so.avatarContainer.scaleX = this.lightAnimationScaleX;
            this.so.avatarContainer.scaleY = this.lightAnimationScaleY;
            this.so.avatarContainer.rotation = this.lightAnimationRotation;
            this.so.avatarContainer.alpha = this.lightOpacity;
        }
    };
    SoModule_LightShadow.prototype.onLightImageLoaded = function () {
        var imageTex = AssetManager.getImage(this.lightImage);
        if (imageTex && this.lightImageObject) {
            this.lightImageObject.width = imageTex.width;
            this.lightImageObject.height = imageTex.height;
            this.lightImageObject.pivotType = 1;
        }
    };
    //------------------------------------------------------------------------------------------------------
    //  阴影
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化阴影
     */
    SoModule_LightShadow.prototype.initShadow = function () {
        this.addToShadowGroup();
        this.createShadow();
    };
    /**
     * 创建阴影样式
     */
    SoModule_LightShadow.prototype.createShadow = function () {
        if (!this.shadowRoot) {
            this.shadowRoot = new UIRoot;
        }
        this.so.shadow.addChild(this.shadowRoot);
        if (this.shadowStyle == 0) {
            if (!this.shadowAvatar) {
                this.shadowAvatar = new Avatar;
                this.shadowAvatar.setTonal(0, 0, 0, 0, 0, 0, 0);
            }
            var shadowAvatar = this.shadowAvatar;
            if (shadowAvatar.id != this.so.avatarID)
                shadowAvatar.id = this.so.avatarID;
            this.shadowAvatar.x = this.shadowOffsetX;
            this.shadowAvatar.y = this.shadowOffsetY;
            this.shadowRoot.addChild(this.shadowAvatar);
            this.so.avatar.off(Avatar.RENDER, this, this.onAvatarRender);
            this.so.avatar.on(Avatar.RENDER, this, this.onAvatarRender);
            this.onAvatarRender();
        }
        else if (this.shadowStyle == 1) {
            if (!this.shadowImageObject) {
                this.shadowImageObject = new UIBitmap;
            }
            if (this.shadowImageObject.image != this.shadowImage) {
                this.shadowImageObject.off(EventObject.LOADED, this, this.onShadowImageLoaded);
                this.shadowImageObject.once(EventObject.LOADED, this, this.onShadowImageLoaded);
                this.shadowImageObject.image = this.shadowImage;
            }
            this.onShadowImageLoaded();
            this.shadowRoot.addChild(this.shadowImageObject);
        }
        if (this.shadowType == 0) {
            this.setShadowStyle(this.shadowOpacity, this.shadowScale, this.shadowRotation);
        }
        else {
            this.setShadowStyle(0, 0, 0);
            os.add_ENTERFRAME(this.onDynamicShadowUpdate, this);
        }
    };
    /**
     * 每帧先重置阴影状态
     */
    SoModule_LightShadow.prototype.onDynamicShadowUpdate = function () {
        this.setShadowStyle(0, 0, 0);
    };
    /**
     * 当阴影图片加载完毕时：初始化位置
     */
    SoModule_LightShadow.prototype.onShadowImageLoaded = function () {
        var imageTex = AssetManager.getImage(this.shadowImage);
        if (imageTex && this.shadowImageObject) {
            this.shadowImageObject.width = imageTex.width;
            this.shadowImageObject.height = imageTex.height;
            this.shadowImageObject.x = Math.floor(this.shadowOffsetX - imageTex.width * 0.5);
            this.shadowImageObject.y = this.shadowOffsetY - imageTex.height;
        }
    };
    /**
     * 当行走图渲染时-阴影同步
     */
    SoModule_LightShadow.prototype.onAvatarRender = function () {
        if (this.shadowAvatar.id != this.so.avatar.id)
            this.shadowAvatar.id = this.so.avatar.id;
        this.shadowAvatar.actionID = this.so.avatar.actionID;
        this.shadowAvatar.currentFrame = this.so.avatar.currentFrame;
        this.shadowAvatar.orientation = this.so.avatar.orientation;
    };
    /**
     * 刷新阴影样式-动态
     */
    SoModule_LightShadow.prototype.setShadowStyle = function (alpha, scaleY, rotation) {
        this.shadowRoot.alpha = alpha;
        this.shadowRoot.scaleY = scaleY;
        this.shadowRoot.rotation = rotation;
        this.shadowRoot.scaleX = rotation >= 90 && rotation <= 270 ? -1 : 1;
    };
    //------------------------------------------------------------------------------------------------------
    // 通用 
    //------------------------------------------------------------------------------------------------------
    /**
     * 添加到阴影组
     */
    SoModule_LightShadow.prototype.addToShadowGroup = function () {
        var shadowGroup = SoModule_LightShadow.shadowArr[this.groupID];
        if (!shadowGroup)
            shadowGroup = SoModule_LightShadow.shadowArr[this.groupID] = [];
        var shadowIdx = shadowGroup.indexOf(this);
        if (shadowIdx == -1)
            shadowGroup.push(this);
        this.inGroupID = this.groupID;
        this.inGroupType = this.type;
    };
    /**
     * 添加到灯光组
     */
    SoModule_LightShadow.prototype.addToLightGroup = function () {
        var lightGroup = SoModule_LightShadow.lightArr[this.groupID];
        if (!lightGroup)
            lightGroup = SoModule_LightShadow.lightArr[this.groupID] = [];
        var lightIdx = lightGroup.indexOf(this);
        if (lightIdx == -1)
            lightGroup.push(this);
        this.inGroupID = this.groupID;
        this.inGroupType = this.type;
    };
    /**
     * 从阴影/灯光组里移除
     */
    SoModule_LightShadow.prototype.removeFromGroup = function () {
        if (this.inGroupID != null) {
            var groupArr = this.inGroupType == 0 ? SoModule_LightShadow.lightArr[this.inGroupType] : SoModule_LightShadow.shadowArr[this.inGroupType];
            if (groupArr) {
                var idx = groupArr.indexOf(this);
                if (idx != -1)
                    groupArr.splice(idx, 1);
            }
        }
    };
    /**
     * 当前场景的阴影组 [groupID] = [shadow1、shadow2...]
     */
    SoModule_LightShadow.shadowArr = [];
    /**
     * 当前场景的阴影组 [groupID] = [light1、light2...]
     */
    SoModule_LightShadow.lightArr = [];
    return SoModule_LightShadow;
}(SceneObjectModule_5));
/**
 * 场景对象模块-影子
 * Created by 黑暗之神KDS on 2021-11-02 01:05:48.
 */
var SoModule_Shadow = /** @class */ (function (_super) {
    __extends(SoModule_Shadow, _super);
    /**
     * 构造函数
     * @param installCB
     */
    function SoModule_Shadow(installCB) {
        var _this = _super.call(this, installCB) || this;
        _this.so.on(ProjectClientSceneObject.JUMP_START, _this, _this.startUpdateDraw);
        _this.so.on(ProjectClientSceneObject.JUMP_OVER, _this, _this.stopUpdateDraw);
        _this.drawShadow();
        return _this;
    }
    /**
     * 模块移除时
     */
    SoModule_Shadow.prototype.onRemoved = function () {
        this.so.off(ProjectClientSceneObject.JUMP_START, this, this.startUpdateDraw);
        this.so.off(ProjectClientSceneObject.JUMP_OVER, this, this.stopUpdateDraw);
        this.stopUpdateDraw();
        this.clearShadow();
    };
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    SoModule_Shadow.prototype.refresh = function () {
        this.drawShadow();
    };
    /**
     * 清理影子
     */
    SoModule_Shadow.prototype.clearShadow = function () {
        this.so.shadow.alpha = 1;
        this.so.shadow.graphics.clear();
    };
    /**
     * 绘制影子
     */
    SoModule_Shadow.prototype.drawShadow = function () {
        var scalePer = 1 - (this.so.avatar.y / -ClientWorld.data.jumpHeight) * 0.5;
        this.so.shadow.graphics.clear();
        this.so.shadow.graphics.drawCircle(0, 0, this.shadowWidth * scalePer, "#000000");
        this.so.shadow.scaleY = this.shadowHeight / this.shadowWidth * this.so.avatar.scaleY;
        this.so.shadow.scaleX = this.so.avatar.scaleX;
        this.so.shadow.alpha = this.shadowAlpha;
    };
    //------------------------------------------------------------------------------------------------------
    // 跳跃对影子大小发生改变 
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始刷新绘制
     */
    SoModule_Shadow.prototype.startUpdateDraw = function () {
        stage.on(EventObject.RENDER, this, this.drawShadow);
    };
    /**
     * 停止刷新绘制
     */
    SoModule_Shadow.prototype.stopUpdateDraw = function () {
        stage.off(EventObject.RENDER, this, this.drawShadow);
    };
    return SoModule_Shadow;
}(SceneObjectModule_1));
/**
 * 场景对象绑定类示例
 * Created by 黑暗之神KDS on 2020-09-08 17:00:01.
 */
var ProjectClientSceneObject = /** @class */ (function (_super) {
    __extends(ProjectClientSceneObject, _super);
    //------------------------------------------------------------------------------------------------------
    // 构造
    //------------------------------------------------------------------------------------------------------
    /**
     * 构造函数
     * @param soData 场景对象数据
     * @param scene 所属场景
     */
    function ProjectClientSceneObject(soData, scene) {
        var _this = _super.call(this, soData, scene) || this;
        //------------------------------------------------------------------------------------------------------
        // RPG通用属性
        //------------------------------------------------------------------------------------------------------
        /**
         * 唯一ID
         */
        _this.sid = ObjectUtils.getInstanceID();
        /**
         * 当前所在的坐标点，Point版
         */
        _this.pos = new Point();
        /**
         * 当前所在的格子位置，通过refreshCoordinate刷新计算而来的缓存数据
         */
        _this.posGrid = new Point(-1, -1);
        /**
         * 当前所在位置的矩形数据
         */
        _this.posRect = new Rectangle();
        /**
         * 行为集，由多个行为组合而成，重写变量属性以便类别指向项目层的 ProjectSceneObjectBehaviors
         */
        _this.behaviors = [];
        /**
         * 我的上一次接触者列表
         */
        _this.myLastTouchObjects = [];
        //------------------------------------------------------------------------------------------------------
        // 辅助计算
        //------------------------------------------------------------------------------------------------------
        _this.tempGridPosHelper = new Point();
        if (!_this.root)
            return _this;
        // 已进入场景完毕的情况下直接执行初始化函数
        if (GameGate.gateState >= GameGate.STATE_3_IN_SCENE_COMPLETE) {
            _this.init();
        }
        // 否则等待进入完毕后再执行
        else {
            EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, _this.initState3, _this);
        }
        return _this;
    }
    /**
     * 等待进入完毕后再执行初始化
     */
    ProjectClientSceneObject.prototype.initState3 = function () {
        if (GameGate.gateState == GameGate.STATE_3_IN_SCENE_COMPLETE) {
            this.init();
            EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.initState3, this);
        }
    };
    /**
     * 释放函数
     */
    ProjectClientSceneObject.prototype.dispose = function () {
        if (!this.isDisposed) {
            EventUtils.removeEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, this.initState3, this);
            EventUtils.removeEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onGamePauseChangeHandle, this);
            EventUtils.removeEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onStausPageChange, this);
        }
        _super.prototype.dispose.call(this);
    };
    /**
     * 获取需要存档的自定义数据
     */
    ProjectClientSceneObject.prototype.getSaveData = function () {
        var o = { myLastTouchObjects: [], moveState: null, recordMoveRoadInfo: this.recordMoveRoadInfo, eventStartWaitInfo: this.eventStartWaitInfo };
        // 追加记录我当前的已接触者列表 myLastTouchObjects
        for (var i = 0; i < this.myLastTouchObjects.length; i++) {
            var myLastTouchSo = this.myLastTouchObjects[i];
            if (myLastTouchSo)
                o.myLastTouchObjects[i] = myLastTouchSo.index;
        }
        // 追加记录当前的移动状态
        o.moveState = this.getRecordMoveState();
        // 记录跳跃状态
        if (this.isJumping) {
            o.jumpState = {
                jumpTo: [this.jumpToPoint.x, this.jumpToPoint.y],
                currentJumpFrame: this.currentJumpFrame
            };
        }
        return o;
    };
    /**
     * 恢复需要存档的自定义数据
     */
    ProjectClientSceneObject.prototype.retorySaveData = function (o) {
        var _this = this;
        this.isFromRecorySaveData = true;
        // 恢复时的这一帧不再触发碰触事件
        this.fromRecorySaveDataGameFrame = __fCount;
        Callback.CallLaterBeforeRender(function () { _this.isFromRecorySaveData = false; }, this);
        // 恢复我当前的已接触者列表 myLastTouchObjects
        for (var i = 0; i < o.myLastTouchObjects.length; i++) {
            var myLastTouchSoIndex = o.myLastTouchObjects[i];
            if (myLastTouchSoIndex != null) {
                var myLastTouchSo = Game.currentScene.sceneObjects[myLastTouchSoIndex];
                if (myLastTouchSo)
                    this.myLastTouchObjects.push(myLastTouchSo);
            }
        }
        // 恢复移动状态
        this.restoryMove(o.moveState, true);
        // 恢复记录移动的记录
        this.recordMoveRoadInfo = o.recordMoveRoadInfo;
        // 恢复记录的正在的事件触发状态
        this.eventStartWaitInfo = o.eventStartWaitInfo;
        // 恢复跳跃状态
        if (o.jumpState) {
            this.jumpTo(o.jumpState.jumpTo[0], o.jumpState.jumpTo[1], o.jumpState.currentJumpFrame);
        }
        // 恢复触发器执行
        this.onGamePauseChangeHandle();
    };
    //------------------------------------------------------------------------------------------------------
    // 刷新
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新：场景会调用所有场景上的场景对象的该函数
     * @param nowTime 游戏时间戳（Game.pause会暂停游戏时间戳）
     */
    ProjectClientSceneObject.prototype.update = function (nowTime) {
        // 处于移动中时刷新坐标
        if (this.isMoving)
            this.updateCoordinate(nowTime);
        // 刷新行为
        this.updateBehavior();
        // 刷新并行事件
        this.parallelEventUpdate();
    };
    //------------------------------------------------------------------------------------------------------
    // 行为
    //------------------------------------------------------------------------------------------------------
    /**
     * 添加一组行为
     * @param behaviorData 行为数据
     * @param loop 是否循环
     * @param targetSceneObject 目标对象
     * @param onOver 当行为结束时回调
     * @param cover 覆盖旧的行为
     * @param startIndex [可选] 默认值=0 行为起始索引
     * @param Immediate [可选] 默认值=true 是否立即执行，否则等待帧刷
     * @param forceStopLastBehavior  [可选] 默认值=false 是否强制停止此前正在执行的行为
     * @param delayFrame [可选] 默认值=0 行为内部的需要等待的帧数
     * @return 对象行为处理器
     */
    ProjectClientSceneObject.prototype.addBehavior = function (behaviorData, loop, targetSceneObject, onOver, cover, startIndex, Immediate, forceStopLastBehavior, delayFrame, executor) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        if (Immediate === void 0) { Immediate = true; }
        if (forceStopLastBehavior === void 0) { forceStopLastBehavior = false; }
        if (delayFrame === void 0) { delayFrame = 0; }
        if (executor === void 0) { executor = null; }
        // 设置对象行为前的处理
        GameCommand.startCommonCommand(14016, [], null, this, this);
        // 新建一层行为，当该层行为结束时，通知并直接立刻继续执行上一层的行为
        var soBehavior = new ProjectSceneObjectBehaviors(this, loop, targetSceneObject, Callback.New(function (onOver, soBehavior) {
            GameCommand.startCommonCommand(14017, [], null, _this, _this);
            var idx = _this.behaviors.indexOf(soBehavior);
            if (idx != -1)
                _this.behaviors.splice(idx, 1);
            onOver && onOver.run();
            _this.updateBehavior();
        }, this, [onOver]), startIndex, executor);
        soBehavior.setBehaviors(behaviorData, delayFrame);
        // 如果是forceStopLastBehavior需要立刻停止行为执行
        if (forceStopLastBehavior) {
            this.stopBehavior(true);
        }
        // 覆盖模式下清空原行为
        if (cover)
            this.behaviors.length = 0;
        this.behaviors.push(soBehavior);
        // 立即执行行为，否则会在下一帧update时调用
        if (Immediate)
            this.updateBehavior();
        return soBehavior;
    };
    /**
     * 停止当前的行为，但不会清空行为列表，如果存在后续行为指令会继续执行。
     * 如果还想要清空行为列表，可以调用 clearBehaviors
     * @param force 强制停止，不必因移动至中心点而必须移动下一个最近的中心点才停止
     */
    ProjectClientSceneObject.prototype.stopBehavior = function (force) {
        if (force === void 0) { force = false; }
        if (this._isMoving) {
            this.stopMove(force);
        }
    };
    /**
     * 获取当前的行为层
     */
    ProjectClientSceneObject.prototype.getBehaviorLayer = function () {
        return this.behaviors.length;
    };
    /**
     * 记录行为
     */
    ProjectClientSceneObject.prototype.recordBehavior = function () {
        this._recordBehaviors = this.behaviors.concat();
    };
    /**
     * 恢复行为
     */
    ProjectClientSceneObject.prototype.recoveryBehavior = function () {
        if (this._recordBehaviors) {
            this.behaviors = this._recordBehaviors;
            this._recordBehaviors = null;
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 移动、跳跃、设置坐标
    //------------------------------------------------------------------------------------------------------
    /**
     * 直接设置坐标
     * @param x
     * @param y
     * @param stopMove [可选] 默认值=true 需要停止移动
     * @param integer [可选] 默认值=true 取整
     * @param alreadySetTempPosHelper [可选] 默认值=false [优化项]表示已计算过格子辅助体，无需重新计算
     * @param alreadySetRect [可选] 默认值=false [优化项]表示已计算过矩形范围，无需重新计算
     * @pparam clacTouchEvent [可选] 默认值=true 是否计算碰触事件
     */
    ProjectClientSceneObject.prototype.setTo = function (x, y, stopMove, integer, alreadySetTempPosHelper, alreadySetRect, clacTouchEvent) {
        if (stopMove === void 0) { stopMove = true; }
        if (integer === void 0) { integer = true; }
        if (alreadySetTempPosHelper === void 0) { alreadySetTempPosHelper = false; }
        if (alreadySetRect === void 0) { alreadySetRect = false; }
        if (clacTouchEvent === void 0) { clacTouchEvent = true; }
        if (this.isJumping)
            return;
        // 需要停止移动的场合
        if (stopMove)
            this.isMoving = false;
        // 取整进行设置坐标
        if (integer) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        this._x = x;
        this._y = y;
        this.root.pos(x, y);
        // 进入新的坐标后进行一些刷新
        this.refreshCoordinate(alreadySetTempPosHelper, alreadySetRect, clacTouchEvent);
    };
    /**
     * 自动寻路方式的移动
     * @param toX 目的地像素坐标x
     * @param toY 目的地像素坐标y
     * @param ifObstacleHandleMode [可选] 默认值=0 当目的地是障碍的处理场合 0忽略当前移动指令 1在目的地附近找到可通行点 2强行视为空地进行移动
     * @param costTime [可选] 默认值=0 已花费的时间，移动根据当前时间与初始时间计算障碍
     * @param useAstar [可选] 默认值=true 使用Astar寻路，根据周围障碍信息进行寻路
     * @param whenCantMoveRetry [可选] 默认值=true 当无法移动的时候重试（下一帧重试）
     * @param useGridObstacle [可选] 默认值=true 使用格子障碍，关闭此项将使用矩形碰撞计算障碍
     * @param forceDir4 [可选] 默认值=false 是否强制四方向
     * @param fromAutoRetry [可选] 默认值=false 是否来自自动重试
     */
    ProjectClientSceneObject.prototype.autoFindRoadMove = function (toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, forceDir4, fromAutoRetry) {
        if (ifObstacleHandleMode === void 0) { ifObstacleHandleMode = 0; }
        if (costTime === void 0) { costTime = 0; }
        if (useAstar === void 0) { useAstar = true; }
        if (whenCantMoveRetry === void 0) { whenCantMoveRetry = false; }
        if (useGridObstacle === void 0) { useGridObstacle = true; }
        if (forceDir4 === void 0) { forceDir4 = false; }
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        // 跳跃中不允许移动
        if (this.isJumping)
            return;
        // 获取目的地
        var currentScene = Game.currentScene;
        var realLineArr;
        var toP = new Point(toX, toY);
        // 限制在屏幕范围内
        currentScene.sceneUtils.limitInside(toP);
        // 限制在格子中心点
        if (ClientWorld.data.moveToGridCenter) {
            GameUtils.getGridCenter(toP, toP);
        }
        // 忽略掉同位置
        if (toP.x == this.x && toP.y == this.y)
            return;
        // 如果是移动至格子中心且正处于移动中时，确保到达最近的格子中心后再启动移动
        if (ClientWorld.data.moveToGridCenter && this.isMoving) {
            return;
        }
        // 四方向寻路
        var moveDir4 = forceDir4 ? true : WorldData.moveDir4;
        // 清理重试
        this.clearRetryAutoFindRoadMove();
        // 如果我是可穿透事件的话直接两点
        if (this.through && !moveDir4) {
            realLineArr = [[toP.x, toP.y]];
        }
        else {
            // 如果是障碍点则优先选择就近的点 || currentScene.sceneUtils.isObstacle(new Point(so.x,so.y), so)
            if (ifObstacleHandleMode != 2) {
                // 目的地是障碍点的情况
                if (currentScene.sceneUtils.isObstacle(toP, this)) {
                    // 忽略当前移动指令：如果需要重试，则下一帧重试
                    if (ifObstacleHandleMode == 0) {
                        if (whenCantMoveRetry)
                            this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                        return;
                    }
                    // 在目的地附近找到可通行点
                    var gridP = GameUtils.getGridPostion(toP);
                    var myGridP = GameUtils.getGridPostion(new Point(this.x, this.y));
                    gridP = SceneUtils.getNearThroughGrid(gridP, myGridP);
                    // 无法找到的情况：如果需要重试，则下一帧重试
                    if (!gridP) {
                        if (whenCantMoveRetry)
                            this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                        return;
                    }
                    // 目的地改为最近的替代格中心点
                    gridP.x *= Config.SCENE_GRID_SIZE;
                    gridP.y *= Config.SCENE_GRID_SIZE;
                    toP = GameUtils.getGridCenter(gridP, toP);
                }
            }
            // 计算A星寻路：目的地强行视为空地或不视为空地时计算两者的寻路
            if (useAstar && (SceneUtils.twoPointHasObstacle(this.x, this.y, toP.x, toP.y, Game.currentScene, this, ifObstacleHandleMode == 2) || moveDir4)) {
                realLineArr = AstarUtils.moveTo(this.x, this.y, toP.x, toP.y, Game.currentScene.gridWidth, Game.currentScene.gridHeight, Game.currentScene, moveDir4, ifObstacleHandleMode == 2, false, this);
                // 如果有参考点，且参考点可能无法通行的话，尝试直接走到人脸上
                if (!realLineArr || realLineArr.length === 0) {
                    realLineArr = AstarUtils.moveTo(this.x, this.y, toX, toY, Game.currentScene.gridWidth, Game.currentScene.gridHeight, Game.currentScene, moveDir4, true);
                    // 把最后一个点去掉
                    if (realLineArr && realLineArr.length > 0) {
                        realLineArr.pop();
                    }
                }
                if (!realLineArr) {
                    if (whenCantMoveRetry) {
                        this.retryAutoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle);
                    }
                    return;
                }
            }
            else {
                realLineArr = [[toP.x, toP.y]];
            }
        }
        // 移动
        if (whenCantMoveRetry) {
            this.off(ProjectClientSceneObject.COLLISION, this, this.retryAutoFindRoadMove);
            this.once(ProjectClientSceneObject.COLLISION, this, this.retryAutoFindRoadMove, [toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle]);
        }
        this.doStartMove(realLineArr, costTime, useGridObstacle, fromAutoRetry);
    };
    /**
     * 开始移动（此处不会预先计算障碍，纯粹根据指定的路径移动，但在移动过程中会判定障碍）
     * @param movePath 移动路径，首个坐标无需包含自己的坐标点
     * @param costTime [可选] 默认值=0 当前移动已花费的时间（客户端出现时可能其已在移动中途）
     * @param useGridObstacle [可选] 默认值=false 开启此项则使用格子计算障碍，否则使用矩形计算（A星计算移动则需要开启此项，通常按键可以使用矩形计算）
     * @param onMoveOver [可选] 默认值=null 当移动结束时回调，一般为无关紧要的事务处理，如果特别重要，可以自行加入到存档的自定义数据中，以便读档恢复该回调事件
     */
    ProjectClientSceneObject.prototype.startMove = function (movePath, costTime, useGridObstacle, onMoveOver) {
        if (costTime === void 0) { costTime = 0; }
        if (useGridObstacle === void 0) { useGridObstacle = false; }
        if (onMoveOver === void 0) { onMoveOver = null; }
        if (this.isJumping)
            return;
        this.onMoveOver = onMoveOver;
        this.clearRetryAutoFindRoadMove();
        this.doStartMove.apply(this, arguments);
    };
    /**
     * 停止移动
     * @param force 强制停止，不必因移动至中心点而必须移动下一个最近的中心点才停止
     */
    ProjectClientSceneObject.prototype.stopMove = function (force) {
        if (force === void 0) { force = false; }
        this.stopSendNextMoveStartEvent = false;
        this.stopSendNextMoveOverEvent = false;
        // 如果是移动至格子中心的话需要重新规划路径，到达下一个最近的格子后才能够停止
        if (!Config.BEHAVIOR_EDIT_MODE && !force && WorldData.moveToGridCenter && this.isMoving) {
            var currentRoad = this.roadsArr[this.nowRoad + 1];
            var newToP = new Point;
            var offsetX = Math.abs(currentRoad.x - this.x);
            var offsetY = Math.abs(currentRoad.y - this.y);
            // 坐标刚好
            if (offsetX == 0 && offsetX == offsetY) {
                this.isMoving = false;
                this.clearRetryAutoFindRoadMove();
                return;
            }
            // Y方向移动
            else if (offsetY > offsetX) {
                newToP.x = this.x;
                var trend = (currentRoad.y - this.y);
                var currentGridY = Math.floor(this.y / Config.SCENE_GRID_SIZE);
                var currentGridCenterY = currentGridY * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2;
                if (trend < 0) {
                    if (this.y > currentGridCenterY) {
                        newToP.y = currentGridCenterY;
                    }
                    else {
                        newToP.y = currentGridCenterY - Config.SCENE_GRID_SIZE;
                    }
                }
                else {
                    if (this.y < currentGridCenterY) {
                        newToP.y = currentGridCenterY;
                    }
                    else {
                        newToP.y = currentGridCenterY + Config.SCENE_GRID_SIZE;
                    }
                }
            }
            // X方向移动
            else {
                newToP.y = this.y;
                var trend = (currentRoad.x - this.x) / (Math.abs(currentRoad.x - this.x));
                var currentGridX = Math.floor(this.x / Config.SCENE_GRID_SIZE);
                var currentGridCenterX = currentGridX * Config.SCENE_GRID_SIZE + Config.SCENE_GRID_SIZE / 2;
                if (trend < 0) {
                    if (this.x > currentGridCenterX) {
                        newToP.x = currentGridCenterX;
                    }
                    else {
                        newToP.x = currentGridCenterX - Config.SCENE_GRID_SIZE;
                    }
                }
                else {
                    if (this.x < currentGridCenterX) {
                        newToP.x = currentGridCenterX;
                    }
                    else {
                        newToP.x = currentGridCenterX + Config.SCENE_GRID_SIZE;
                    }
                }
            }
            // 如果目的地存在障碍
            if (Game.currentScene.sceneUtils.isObstacle(newToP, this)) {
                this.isMoving = false;
                this.clearRetryAutoFindRoadMove();
                var thisGrid = GameUtils.getGridCenterByGrid(this.posGrid);
                this.setTo(thisGrid.x, thisGrid.y);
                return;
            }
            // 重新规划路径，至少需要走到下一个格子中心点，而非立即停止移动后转向
            this.updateCoordinate(Game.now);
            this.isMoving = false;
            this.clearRetryAutoFindRoadMove();
            this.stopSendNextMoveStartEvent = true;
            this.stopSendNextMoveOverEvent = true;
            this.startMove([[newToP.x, newToP.y]], 0, false, null);
        }
        else {
            this.isMoving = false;
            this.clearRetryAutoFindRoadMove();
        }
    };
    /**
     * 跳跃至
     * @param x
     * @param y
     * @param costFrame 已经花费的游戏帧数
     */
    ProjectClientSceneObject.prototype.jumpTo = function (x, y, costFrame) {
        var _this = this;
        if (costFrame === void 0) { costFrame = 0; }
        if (this.isJumping)
            return;
        this.isMoving = false;
        this.isJumping = true;
        this.jumpToPoint = new Point(x, y);
        this.event(ProjectClientSceneObject.JUMP_START);
        var oldX = this.x;
        var oldY = this.y;
        var toJumpUpY = -ClientWorld.data.jumpHeight;
        var toJumpDownY = 0;
        var oldJumpY = this.jumpY;
        this.currentJumpFrame = costFrame;
        // 计算需要修改的朝向
        if (!this.fixOri) {
            if (this.x != x || this.y != y) {
                var dir = GameUtils.getOriByAngle(MathUtils.direction360(this.x, this.y, x, y));
                this.avatarOri = dir;
            }
        }
        // 计算需要花费的游戏帧数
        var frameTotal = Math.ceil(ClientWorld.data.jumpTimeCost * 1000 / Game.oneFrame);
        var frameHalf = frameTotal / 2;
        os.add_ENTERFRAME(function () {
            if (_this.isDisposed) {
                // @ts-ignore
                os.remove_ENTERFRAME(arguments.callee, _this);
                return;
            }
            if (Game.pause)
                return;
            _this.currentJumpFrame++;
            // 已经结束的情况
            if (_this.currentJumpFrame > frameTotal) {
                // @ts-ignore
                os.remove_ENTERFRAME(arguments.callee, _this);
                _this.isJumping = false;
                if (_this.inScene) {
                    _this.refreshCoordinate();
                    _this.event(ProjectClientSceneObject.JUMP_OVER);
                }
                return;
            }
            // 位置偏移
            var per1 = _this.currentJumpFrame / frameTotal;
            var func1 = Ease.linearNone;
            _this.x = func1(per1, oldX, x - oldX, 1);
            _this.y = func1(per1, oldY, y - oldY, 1);
            // 高度偏移
            var per2, func2, toJumpY;
            if (_this.currentJumpFrame <= frameHalf) {
                per2 = _this.currentJumpFrame / frameHalf;
                func2 = Ease.quintOut;
                toJumpY = toJumpUpY;
            }
            else {
                per2 = (_this.currentJumpFrame - frameHalf) / frameHalf;
                func2 = Ease.quintIn;
                toJumpY = toJumpDownY;
                oldJumpY = toJumpUpY;
            }
            var jumpY = func2(per2, oldJumpY, toJumpY - oldJumpY, 1);
            _this.jumpY = jumpY;
        }, this);
    };
    /**
     * 记录移动状态
     */
    ProjectClientSceneObject.prototype.getRecordMoveState = function () {
        if (!this._isMoving)
            return null;
        return {
            useGridObstacle: this.useGridObstacle,
            roadsArr: ObjectUtils.depthClone(this.roadsArr),
            roadMax: this.roadMax,
            nowRoad: this.nowRoad,
            nowRoadStartDate: this.nowRoadStartDate,
            nowRoadTime: this.nowRoadTime,
            thisRoadS: this.thisRoadS,
            recordNow: Game.now,
            moveSpeed: this.moveSpeed
        };
    };
    /**
     * 恢复移动状态
     * @param force 强行恢复，无论当前是否正处于移动状态中
     */
    ProjectClientSceneObject.prototype.restoryMove = function (recordMoveStateInfo, force) {
        if (force === void 0) { force = false; }
        if (!recordMoveStateInfo)
            return;
        if (force || !this._isMoving) {
            this.useGridObstacle = recordMoveStateInfo.useGridObstacle;
            this.roadsArr = recordMoveStateInfo.roadsArr;
            this.nowRoad = recordMoveStateInfo.nowRoad;
            this.nowRoadStartDate = recordMoveStateInfo.nowRoadStartDate + (Game.now - recordMoveStateInfo.recordNow);
            this.nowRoadTime = recordMoveStateInfo.nowRoadTime;
            this.thisRoadS = recordMoveStateInfo.thisRoadS;
            // 恢复行动时如果移动速度已改变的话，重头开始
            if (this.moveSpeed != recordMoveStateInfo.moveSpeed) {
                // 重新按照剩余的路线触发
                var t = Game.now - this.nowRoadStartDate;
                var s = t * recordMoveStateInfo.moveSpeed;
                var roadArr = [];
                for (var i = this.nowRoad + 1; i < this.roadsArr.length; i++) {
                    var p = this.roadsArr[i];
                    roadArr.push([p.x, p.y]);
                }
                this.startMove(roadArr, 0, this.useGridObstacle);
            }
            else {
                for (var rs in this.roadsArr) {
                    var pointClone = this.roadsArr[rs];
                    this.roadsArr[rs] = new Point(pointClone.x, pointClone.y);
                }
                this.changeMoveAction(true);
                this._isMoving = true;
            }
        }
    };
    /**
     * 进入新的坐标后进行一些刷新
     * -- 位置改变时
     * -- 新出现时
     * @param alreadySetTempPosHelper [优化项]表示已计算过格子辅助体，无需重新计算
     * @param alreadySetRect [优化项]表示已计算过矩形范围，无需重新计算
     * @param clacTouchEvent [可选] 默认值=true 是否计算碰触事件模式
     * @param triggerEvent [可选] 默认值=true 触发碰触事件
     */
    ProjectClientSceneObject.prototype.refreshCoordinate = function (alreadySetTempPosHelper, alreadySetRect, clacTouchEvent, triggerEvent) {
        if (alreadySetTempPosHelper === void 0) { alreadySetTempPosHelper = false; }
        if (alreadySetRect === void 0) { alreadySetRect = false; }
        if (clacTouchEvent === void 0) { clacTouchEvent = true; }
        if (triggerEvent === void 0) { triggerEvent = true; }
        if (!this.inScene)
            return;
        var scene = this.scene;
        if (!scene || scene.isDisposed)
            return;
        // 相机锁定自己的情况，则需要刷新相机位置
        if (scene.camera.sceneObject == this) {
            scene.updateCamera();
        }
        // 刷新影子位置
        this.updateShadow();
        // 记录坐标
        this.pos.x = this.x;
        this.pos.y = this.y;
        // 计算所属格子
        if (!alreadySetTempPosHelper)
            GameUtils.getGridPostion(this.pos, this.tempGridPosHelper);
        // 计算矩形范围
        if (!alreadySetRect) {
            this.posRect.x = this.x;
            this.posRect.y = this.y;
            this.posRect.width = this.posRect.height = WorldData.sceneObjectCollisionSize - 1;
        }
        // 当进入到一个新的格子时
        if (this.posGrid.x != this.tempGridPosHelper.x || this.posGrid.y != this.tempGridPosHelper.y) {
            this.posGrid.x = this.tempGridPosHelper.x;
            this.posGrid.y = this.tempGridPosHelper.y;
            // 刷新动态障碍格数据
            scene.sceneUtils.updateDynamicObsAndBridge(this, true, this.posGrid);
            // 刷新遮罩效果，如果处于遮罩格子中则半透明显示
            this.root.alpha = scene.sceneUtils.isMaskGrid(this.posGrid) ? 0.5 : 1;
        }
        // 如果需要计算碰触事件的话
        if (clacTouchEvent) {
            // 取得碰撞列表
            var touchRes = scene.sceneUtils.touchCheck(this, false, this.pos, this.tempGridPosHelper, this.pos, this.tempGridPosHelper);
            // 允许计算被接触者的碰触事件
            this.touchEventHandle(touchRes, triggerEvent);
        }
    };
    Object.defineProperty(ProjectClientSceneObject.prototype, "isEventStartWait", {
        //------------------------------------------------------------------------------------------------------
        // 事件
        //------------------------------------------------------------------------------------------------------
        /**
         * 是否已处于事件等待中
         * @return [boolean]
         */
        get: function () {
            return this.eventStartWaitInfo ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 事件开始时等待处理（当前对象是执行者身份）
     * @param trigger 触发者
     * @param faceToTrigger 面向触发者
     * @param 是否等待成功
     */
    ProjectClientSceneObject.prototype.eventStartWait = function (trigger, faceToTrigger) {
        if (faceToTrigger === void 0) { faceToTrigger = true; }
        if (this.eventStartWaitInfo)
            return false;
        if (this.fixOri)
            faceToTrigger = false;
        this.eventStartWaitInfo = {
            faceToTrigger: faceToTrigger,
            oldOri: this.avatar.orientation,
            moveState: this.getRecordMoveState()
        };
        // 锁定行为层
        this.lockBehaviorLayer = this.getBehaviorLayer();
        // 停止移动
        if (this.isMoving)
            this.stopMove(true);
        // 面向触发者
        if (faceToTrigger) {
            this.addBehavior([[25, 1]], false, trigger, null, false);
            // 监听一次更改面向的行为，如果在事件执行中又让他更改了面向则不恢复
            this.once(ProjectClientSceneObject.CHANGE_ORI, this, this.onExecuteWaitEventChangeOri);
            // 监听移动指令，如果中途存在移动的话则不再恢复此前的移动
            this.once(ProjectClientSceneObject.MOVE_START, this, this.onExecuteWaitEventNewMove);
        }
        return true;
    };
    /**
     * 事件结束时恢复
     * @return 是否恢复成功
     */
    ProjectClientSceneObject.prototype.eventCompleteContinue = function () {
        if (!this.eventStartWaitInfo)
            return false;
        this.off(ProjectClientSceneObject.CHANGE_ORI, this, this.onExecuteWaitEventChangeOri);
        this.off(ProjectClientSceneObject.MOVE_START, this, this.onExecuteWaitEventNewMove);
        this.lockBehaviorLayer = 0;
        if (this.eventStartWaitInfo.faceToTrigger)
            this.avatarOri = this.eventStartWaitInfo.oldOri;
        this.restoryMove(this.eventStartWaitInfo.moveState, true);
        this.eventStartWaitInfo = null;
        return true;
    };
    //------------------------------------------------------------------------------------------------------
    // 其他
    //------------------------------------------------------------------------------------------------------
    /**
     * 清除我接触的对象记录
     * @param targetSo [可选] 默认值=null 指定的接触过的对象，如果为null则清理全部
     */
    ProjectClientSceneObject.prototype.clearMyTouchRecord = function (targetSo) {
        if (targetSo === void 0) { targetSo = null; }
        if (targetSo) {
            ArrayUtils.remove(this.myLastTouchObjects, targetSo);
        }
        else {
            this.myLastTouchObjects.length = 0;
        }
    };
    /**
     * 清理所有人接触我的记录
     */
    ProjectClientSceneObject.prototype.clearTouchMeRecord = function () {
        for (var i = 0; i < Game.currentScene.sceneObjects.length; i++) {
            var targetSo = Game.currentScene.sceneObjects[i];
            if (targetSo instanceof ProjectClientSceneObject)
                targetSo.clearMyTouchRecord(this);
        }
    };
    Object.defineProperty(ProjectClientSceneObject.prototype, "touchEnabled", {
        /**
         * 是否允许接触
         */
        get: function () {
            return this.inScene && this.scene.sceneObjects[this.index] == this && !this.isJumping;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProjectClientSceneObject.prototype, "lastTouchObjects", {
        /**
         * 获取接触者列表
         */
        get: function () {
            return this.myLastTouchObjects;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 判断指定对象是否在我的接触者列表中
     */
    ProjectClientSceneObject.prototype.isInMyTouchList = function (targetSo) {
        return this.myLastTouchObjects.indexOf(targetSo) != -1;
    };
    /**
     * 开始移动（此处不会预先计算障碍，纯粹根据指定的路径移动，但在移动过程中会判定障碍）
     */
    ProjectClientSceneObject.prototype.doStartMove = function (movePath, costTime, useGridObstacle, fromAutoRetry) {
        if (costTime === void 0) { costTime = 0; }
        if (useGridObstacle === void 0) { useGridObstacle = false; }
        if (fromAutoRetry === void 0) { fromAutoRetry = false; }
        // 转为Point数组
        var roadsArr = [new Point(this.x, this.y)];
        for (var i in movePath) {
            roadsArr.push(new Point(movePath[i][0], movePath[i][1]));
        }
        var lastPoint = roadsArr[roadsArr.length - 1];
        // 目的地与当前相同则忽略
        if (roadsArr.length == 2 && lastPoint.x == this.x && lastPoint.y == this.y) {
            return;
        }
        // 记录是否开启格子计算障碍模式
        this.useGridObstacle = useGridObstacle;
        // 获取当前时间
        var now = Game.now;
        // 刷新一次坐标，因为可能有不足1帧未能结算的移动
        if (this._isMoving)
            this.updateCoordinate(now);
        // 如果路径㛮则开始移动
        this.roadMax = roadsArr.length;
        if (movePath && this.roadMax > 1) {
            // 记录起步时间（同时减去已移动过的时间）
            this.nowRoadStartDate = now;
            this.nowRoadStartDate -= costTime;
            // 储存可用的路径数组
            this.roadsArr = roadsArr;
            // 允许移动标识：标识开启
            this.isMoving = true;
            // 抛出事件
            if (!this.stopSendNextMoveStartEvent) {
                this.event(ProjectClientSceneObject.MOVE_START, [fromAutoRetry]);
            }
            this.stopSendNextMoveStartEvent = false;
        }
    };
    Object.defineProperty(ProjectClientSceneObject.prototype, "isMoving", {
        /**
         * 更改移动状态
         */
        get: function () { return this._isMoving; },
        set: function (isMove) {
            // 改变移动状态后的初始化:移动开始
            if (isMove) {
                this.changeMoveAction(true);
                //初始化当前路段的信息
                this.nowRoad = 0;
                this.nowRoadTime = 0;
                this._isMoving = isMove;
                var now = Game.now;
                // 立即刷新坐标
                this.updateCoordinate(now);
            }
            // 改变移动状态后的初始化:移动停止
            else {
                this.changeMoveAction(false);
                this._isMoving = false;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 更改移动时动作
     */
    ProjectClientSceneObject.prototype.changeMoveAction = function (isMove) {
        if (isMove) {
            // 当开启了自动变更移动时动作的话
            if (this.moveAutoChangeAction) {
                // 设置为行走动作
                var moveAct = WorldData.sceneObjectMoveStartAct;
                // 如果开启了奔跑模式的话，满足条件则播放奔跑动作（速度必须大于设定值，且该对象拥有奔跑动作）
                if (WorldData.useSceneObjectMoveStartAct2 && this.moveSpeed >= WorldData.sceneObjectMoveStartAct2Speed &&
                    ArrayUtils.matchAttributes(this.avatar.actionList, { id: WorldData.sceneObjectMoveStartAct2 }, true)[0]) {
                    moveAct = WorldData.sceneObjectMoveStartAct2;
                }
                if (this.avatar.hasActionID(moveAct))
                    this.avatarAct = moveAct;
            }
        }
        else {
            // 当开启了自动变更移动时动作的话
            if (this.moveAutoChangeAction) {
                if (this.avatarAct == WorldData.sceneObjectMoveStartAct || this.avatarAct == WorldData.sceneObjectMoveStartAct2)
                    this.avatarAct = 1;
            }
        }
    };
    /**
     * 刷新坐标
     * @param _nowTime 当前游戏时间戳
     */
    ProjectClientSceneObject.prototype.updateCoordinate = function (_nowTime) {
        var per;
        var isChangeDir = false;
        var isMoveOver = false;
        // 获取当前路段需要花费的时间段（nowRoadTime，新路段需要计算）
        var thisRoadP = this.roadsArr[this.nowRoad];
        var nextRoadP = this.roadsArr[this.nowRoad + 1];
        // 相同坐标的路段剔除掉
        if (thisRoadP.x == nextRoadP.x && thisRoadP.y == nextRoadP.y) {
            this.nowRoad++;
            this.updateCoordinate(_nowTime);
            return;
        }
        if (this.nowRoadTime == 0) {
            var thisRoadS = this.thisRoadS = thisRoadP.distance(nextRoadP.x, nextRoadP.y);
            this.nowRoadTime = Math.max(thisRoadS * 1000 / this.moveSpeed, Game.oneFrame + 1);
            isChangeDir = true;
        }
        // 大于当前路段终点的时间时
        var nowRoadEndDate = this.nowRoadStartDate + this.nowRoadTime;
        if (_nowTime > nowRoadEndDate) {
            // 当路段未走完的情况：下一个路段
            this.nowRoad++;
            if (this.nowRoad < this.roadMax - 1) {
                this.nowRoadStartDate += this.nowRoadTime;
                this.nowRoadTime = 0;
                this.updateCoordinate(_nowTime);
                return;
            }
            // 当路段已到达最终的情况
            else {
                per = 1;
                this.isMoving = false;
                isMoveOver = true;
            }
        }
        else {
            per = (_nowTime - this.nowRoadStartDate) / this.nowRoadTime;
        }
        // 如果需要改变朝向的话，不是固定朝向模式时则改变
        if (isChangeDir && !this.fixOri) {
            var dir = GameUtils.getOriByAngle(MathUtils.direction360(this.x, this.y, nextRoadP.x, nextRoadP.y));
            this.avatarOri = dir;
        }
        // 计算当前路段
        var nowP = Point.interpolate(nextRoadP, thisRoadP, per);
        // let nowPClone = new Point(nowP.x,nowP.y);
        // 是否移动过
        var isMoved = this.x != nowP.x || this.y != nowP.y;
        // 计算移动趋势
        var trendP = new Point(nowP.x, nowP.y);
        var dx = nextRoadP.x - thisRoadP.x;
        var dy = nextRoadP.y - thisRoadP.y;
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);
        if (absDx > absDy) {
            trendP.x += dx < 0 ? -1 : 1;
            trendP.y += (nextRoadP.y - thisRoadP.y) * 1 / absDx;
        }
        else {
            trendP.x += (nextRoadP.x - thisRoadP.x) * 1 / absDy;
            trendP.y += dy < 0 ? -1 : 1;
        }
        var moveFrom = new Point(this.x, this.y);
        this.moveTrendInfo = { from: moveFrom, to: trendP };
        if (!this.moveRealInfo)
            this.moveRealInfo = { from: moveFrom, to: null };
        else
            this.moveRealInfo.from = moveFrom;
        // 计算格子坐标
        GameUtils.getGridPostion(nowP, this.tempGridPosHelper);
        // 如果是最终路段的话，强行使用矩形障碍计算
        // 使用矩形障碍的情况下记录当前位置矩形，以便还原
        var lastRectX, lastRectY;
        if (!this.useGridObstacle) {
            lastRectX = this.posRect.x;
            lastRectY = this.posRect.y;
        }
        // 碰触检测
        var touchRes = this.scene.sceneUtils.touchCheck(this, this.useGridObstacle, nowP, this.tempGridPosHelper, trendP, null);
        // 碰到障碍的情况
        if (touchRes.isObstacle) {
            // 还原碰撞矩形，因为此路不通，内部设置的值失效了
            if (touchRes.alreadyCalcPosRect) {
                this.posRect.x = lastRectX;
                this.posRect.y = lastRectY;
            }
            // 忽略无法移动的场合
            if (this.ignoreCantMove) {
                if (this.keepMoveActWhenCollsionObstacleAndIgnoreCantMove) {
                    this._isMoving = false;
                }
                else {
                    this.isMoving = false;
                }
            }
            // 等待一游戏帧
            else {
                this.nowRoadStartDate += Game.oneFrame;
            }
            // 碰触事件处理
            if (isMoved) {
                var myLastX = this.x;
                var myLastY = this.y;
                var hasTouchEvent = this.touchEventHandle(touchRes);
                // 如果已触发事件的话就再尝试计算碰触，因为可能由于触发的事件让周围的对方发生了位置变更，我的目的地又被允许了
                // 还必须保证我也还在原来的位置上，否则可能属于被传送掉了，无需设置到该坐标上
                if (hasTouchEvent && myLastX == this.x && myLastY == this.y && this._isMoving) {
                    var touchResAgain = this.scene.sceneUtils.touchCheck(this, this.useGridObstacle, nowP, this.tempGridPosHelper, trendP, null);
                    if (!touchResAgain.isObstacle) {
                        this.setTo(nowP.x, nowP.y, false, true, true, touchRes.alreadyCalcPosRect, false);
                    }
                }
            }
            // 抛出碰触事件
            this.event(ProjectClientSceneObject.COLLISION, [touchRes]);
        }
        // 未碰到障碍的话直接设置值
        else {
            // 此次设置坐标不计算碰触，因为这里已经计算过了，直接执行碰触事件即可
            this.setTo(nowP.x, nowP.y, false, true, true, touchRes.alreadyCalcPosRect, false);
            // 碰触事件处理
            if (isMoved)
                this.touchEventHandle(touchRes);
        }
        // 如果移动结束的话抛出移动结束事件
        if (isMoveOver) {
            if (this.onMoveOver)
                this.onMoveOver.run();
            // 抛出移动至终点事件
            if (!this.stopSendNextMoveOverEvent) {
                this.event(ProjectClientSceneObject.MOVE_OVER);
            }
            this.stopSendNextMoveOverEvent = false;
        }
        this.moveRealInfo.to = new Point(this.x, this.y);
    };
    Object.defineProperty(ProjectClientSceneObject.prototype, "jumpY", {
        /**
         * 跳跃时更改的属性值
         */
        get: function () {
            return this.avatar ? this.avatar.y : 0;
        },
        set: function (v) {
            if (this.isDisposed)
                return;
            this.avatar.y = v;
        },
        enumerable: false,
        configurable: true
    });
    //------------------------------------------------------------------------------------------------------
    // 事件命令执行
    //------------------------------------------------------------------------------------------------------
    /**
     * 碰触事件处理，碰触是相互的，执行了对方的碰触事件也会执行自己的碰触事件
     * @param touchRes 我的碰触信息
     * @param triggerEvent 是否触发碰触事件
     * @return 是否触发过事件
     */
    ProjectClientSceneObject.prototype.touchEventHandle = function (touchRes, triggerEvent) {
        if (triggerEvent === void 0) { triggerEvent = true; }
        // 恢复存档时当前不会触发事件
        if (this.isFromRecorySaveData && this.fromRecorySaveDataGameFrame == __fCount)
            return false;
        var hasTouchEvent = false;
        for (var t in touchRes.touchSceneObjects) {
            var targetSo = touchRes.touchSceneObjects[t];
            if (!targetSo || targetSo == this)
                continue;
            // 执行对方的碰触事件：如果对方不允许重复碰触的话，对方已在我上一次的碰触列表中则不会执行他的碰触事件
            var canExecuteTargetTouchEvent = true;
            if (!targetSo.repeatedTouchEnabled) {
                var index = this.myLastTouchObjects.indexOf(targetSo);
                if (index != -1) {
                    canExecuteTargetTouchEvent = false;
                }
                index = targetSo.myLastTouchObjects.indexOf(this);
                if (index != -1) {
                    canExecuteTargetTouchEvent = false;
                }
            }
            if (canExecuteTargetTouchEvent && triggerEvent) {
                var hasTouchTargetEvent = Controller.startSceneObjectTouchEvent(this, targetSo);
                if (hasTouchTargetEvent)
                    hasTouchEvent = true;
            }
            // 执行我的碰触事件：如果我不允许重复碰触的话，我已经在对方的碰触列表中则不会执行我的碰触事件
            var canExecuteMyTouchEvent = true;
            if (!this.repeatedTouchEnabled) {
                var index = targetSo.myLastTouchObjects.indexOf(this);
                if (index != -1) {
                    canExecuteMyTouchEvent = false;
                }
            }
            if (canExecuteMyTouchEvent && triggerEvent) {
                var hasTouchMyEvent = Controller.startSceneObjectTouchEvent(targetSo, this);
                if (hasTouchMyEvent)
                    hasTouchEvent = true;
            }
            // 如果我并不在对方的碰撞记录列表中则加上
            if (targetSo.myLastTouchObjects.indexOf(this) == -1) {
                targetSo.myLastTouchObjects.push(this);
            }
        }
        // 对比列表，将旧列表中不再接触的人也清理掉我的接触记录
        var subtractList = ArrayUtils.compare(touchRes.touchSceneObjects, this.myLastTouchObjects).subtract;
        for (var i = 0; i < subtractList.length; i++) {
            var subtractSo = subtractList[i];
            // 离开事件：由this离开了subtractSo，所以这属于双方都【被离开】了
            if (subtractSo != this) {
                // 如果对方还存在我的接触列表的话，就离开
                if (subtractSo.isInMyTouchList(this)) {
                    subtractSo.clearMyTouchRecord(this);
                    if (triggerEvent) {
                        var hasTouchTargetOutEvent = Controller.startSceneObjectTouchOutEvent(this, subtractSo);
                        if (hasTouchTargetOutEvent)
                            hasTouchEvent = true;
                    }
                }
                if (triggerEvent) {
                    var hasTouchMyOutEvent = Controller.startSceneObjectTouchOutEvent(subtractSo, this);
                    if (hasTouchMyOutEvent)
                        hasTouchEvent = true;
                }
            }
        }
        // 记录新的列表
        this.myLastTouchObjects = touchRes.touchSceneObjects;
        return hasTouchEvent;
    };
    /**
     * 并行事件处理
     */
    ProjectClientSceneObject.prototype.parallelEventUpdate = function () {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        // 未在场景上或未能真正场景完成时忽略执行
        if (!this.inScene || GameGate.gateState < GameGate.STATE_3_IN_SCENE_COMPLETE)
            return;
        // 如果存在并行事件则运行并行事件（并行事件是该模板自定义的事件类别之一）
        var updateCmdPage = this.customCommandPages[2];
        if (updateCmdPage && updateCmdPage.commands.length != 0) {
            var updateTrigger = this.getCommandTrigger(1, 2, Game.currentScene, this);
            if (updateTrigger) {
                updateCmdPage.startTriggerEvent(updateTrigger);
            }
        }
    };
    /**
     * 执行出现事件
     */
    ProjectClientSceneObject.prototype.appearEventHandle = function () {
        // 调用「出现事件」前的处理
        GameCommand.startCommonCommand(14015, [], null, this, this);
        if (this.hasCommand[3]) {
            GameCommand.startSceneObjectCommand(this.index, 3, null, null, this);
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-初始化和事件监听
    //------------------------------------------------------------------------------------------------------
    /**
     * 初始化
     */
    ProjectClientSceneObject.prototype.init = function () {
        var _this = this;
        // 刷新位置
        this.refreshCoordinate(false, false, true, false);
        // 监听状态页更改时事件执行 onStausPageChange(false)
        EventUtils.addEventListenerFunction(this, SceneObjectEntity.EVENT_CHANGE_STATUS_PAGE_FOR_INSTANCE, this.onStausPageChange, this, [false]);
        // 监听游戏暂停事件
        EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onGamePauseChangeHandle, this);
        // 开始执行当前状态页的默认行为和出现事件
        if (this.inScene && this.scene && this.scene.sceneObjects[this.index] == this) {
            this.onStausPageChange(true);
        }
        else {
            this.once(EventObject.ADDED, this, function () {
                _this.onStausPageChange(true);
            });
        }
    };
    /**
     * 当状态页改变时
     * @param isFirst 首次出现时
     */
    ProjectClientSceneObject.prototype.onStausPageChange = function (isFirst) {
        // 如果未出现在场景上的话则忽略
        if (!this.inScene)
            return;
        // Debug-显示碰撞盒
        if (WorldData.rectObsDebug && os.inGC() && !Config.RELEASE_GAME) {
            var ccModule = this.getModule(SoModule_CustomCollision.PLUGIN_SCENEOBJECT_MODULE_ID);
            if (!(ccModule && ccModule.isObstacle) && this.avatarID != 0) {
                var size = WorldData.sceneObjectCollisionSize;
                var rect = new Rectangle(-size / 2, -size / 2, size - 1, size - 1);
                this.root.graphics.clear();
                this.root.graphics.drawLines(0, 0, [rect.x, rect.y, rect.right, rect.y, rect.right, rect.bottom, rect.x, rect.bottom, rect.x, rect.y], ProjectClientScene.getDebugColorBySceneObject(this), 1);
            }
        }
        // 暂停的话等待取消暂停后执行
        if (Game.pause) {
            EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onStausPageChange, this, [], true);
            return;
        }
        // 非恢复存档时
        if (!this.isFromRecorySaveData) {
            // 清理接触者列表
            if (!isFirst) {
                this.clearMyTouchRecord();
                this.clearTouchMeRecord();
            }
            // 执行默认行为
            this.startDefBehavior();
            // 执行初始化事件
            Callback.CallLaterBeforeRender(this.appearEventHandle, this);
            // 碰触计算
            if (!isFirst) {
                Callback.CallLaterBeforeRender(this.refreshCoordinate, this);
            }
        }
    };
    /**
     * 当状态页更改前
     */
    ProjectClientSceneObject.prototype.onBeforeStausPageChange = function () {
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-行为
    //------------------------------------------------------------------------------------------------------
    /**
     * 开始执行默认行为
     */
    ProjectClientSceneObject.prototype.startDefBehavior = function () {
        // 不是恢复存档数据的话才添加默认行为，否则已经被恢复了
        this.stopBehavior();
        this.clearBehaviors();
        var beData = SceneObjectBehaviors.toBehaviorData(this.defBehavior);
        if (beData.behaviorData.length > 0) {
            this.addBehavior(beData.behaviorData, beData.loop, this, null, beData.cover, 0, false, beData.forceStopLastBehavior, 0, this);
        }
    };
    /**
     * 刷新行为
     */
    ProjectClientSceneObject.prototype.updateBehavior = function () {
        // 处于行为编辑器中时忽略
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        // 游戏暂停时不执行
        if (Game.pause)
            return;
        // 禁止行为的话
        if (this.banBehavior)
            return;
        // 未能真正进入场景或场景不存在时不执行
        if (!this.inScene || GameGate.gateState < GameGate.STATE_3_IN_SCENE_COMPLETE || Game.currentScene.sceneObjects[this.index] != this)
            return;
        // 存在行为的话则执行
        if (this.behaviors.length > 0) {
            var layer = this.behaviors.length - 1;
            // 锁定层以下的话不允许执行
            if (layer < this.lockBehaviorLayer)
                return;
            var newestBehavior = this.behaviors[this.behaviors.length - 1];
            newestBehavior.update();
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-重试自动寻路
    //------------------------------------------------------------------------------------------------------
    /**
     * 重试自动寻路
     */
    ProjectClientSceneObject.prototype.retryAutoFindRoadMove = function (toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, touchRes) {
        var _this = this;
        if (ifObstacleHandleMode === void 0) { ifObstacleHandleMode = 0; }
        if (costTime === void 0) { costTime = 0; }
        if (useAstar === void 0) { useAstar = true; }
        if (whenCantMoveRetry === void 0) { whenCantMoveRetry = false; }
        if (useGridObstacle === void 0) { useGridObstacle = true; }
        if (touchRes === void 0) { touchRes = null; }
        if (touchRes && !touchRes.isObstacle)
            return;
        this.clearRetryAutoFindRoadMove(false);
        this.needRetryAutoFindRoadMoveSign = setFrameout(function () {
            if (_this.isDisposed || !_this.inScene)
                return;
            _this.autoFindRoadMove(toX, toY, ifObstacleHandleMode, costTime, useAstar, whenCantMoveRetry, useGridObstacle, false, true);
        }, 16);
    };
    /**
     * 清理重试自动寻路的状态
     */
    ProjectClientSceneObject.prototype.clearRetryAutoFindRoadMove = function (offCollisionEvent) {
        if (offCollisionEvent === void 0) { offCollisionEvent = true; }
        if (Game.player.sceneObject == this)
            this.off(ProjectClientSceneObject.COLLISION, this, this.retryAutoFindRoadMove);
        if (this.needRetryAutoFindRoadMoveSign)
            clearFrameout(this.needRetryAutoFindRoadMoveSign);
        this.needRetryAutoFindRoadMoveSign = null;
    };
    //------------------------------------------------------------------------------------------------------
    // 内部实现-其他
    //------------------------------------------------------------------------------------------------------
    /**
     * 当系统事件被执行时
     * @param mode 0-对话框显示时 1-对话选择框显示时 2-其他（如更换场景）
     */
    ProjectClientSceneObject.prototype.onSystemCommandStart = function (mode) {
        if (this == Game.player.sceneObject)
            this.stopMove();
    };
    /**
     * 当执行等待事件时更改了面向
     */
    ProjectClientSceneObject.prototype.onExecuteWaitEventChangeOri = function () {
        if (this.eventStartWaitInfo)
            this.eventStartWaitInfo.faceToTrigger = false;
    };
    /**
     * 当执行等待事件时重新执行了新的移动指令
     */
    ProjectClientSceneObject.prototype.onExecuteWaitEventNewMove = function () {
        if (this.eventStartWaitInfo) {
            this.eventStartWaitInfo.moveState = null;
        }
    };
    /**
     * 当游戏暂停状态改变时处理
     */
    ProjectClientSceneObject.prototype.onGamePauseChangeHandle = function () {
        // 暂停/恢复全部场景相关的触发器
        for (var i in this.triggerLines) {
            var trigger = this.triggerLines[i];
            if (trigger && trigger.mainType == CommandTrigger.COMMAND_MAIN_TYPE_SCENE_OBJECT)
                trigger.delayPause = Game.pause;
        }
    };
    /**
     * 面向
     */
    ProjectClientSceneObject.CHANGE_ORI = "so_1CHANGE_ORI";
    /**
     * 移动开始事件 onMoveStart(fromAutoRetry:boolean) fromAutoRetry=是否来自自动重试的移动
     */
    ProjectClientSceneObject.MOVE_START = "so_1MOVE_START";
    /**
     * 移动结束事件
     */
    ProjectClientSceneObject.MOVE_OVER = "so_1MOVE_OVER";
    /**
     * 跳跃开始事件
     */
    ProjectClientSceneObject.JUMP_START = "so_1JUMP_START";
    /**
     * 跳跃结束事件
     */
    ProjectClientSceneObject.JUMP_OVER = "so_1JUMP_OVER";
    /**
     * 碰撞事件 onCollision(touchRes:{ isObstacle: boolean, touchSceneObjects: ProjectClientSceneObject[] })
     */
    ProjectClientSceneObject.COLLISION = "so_1COLLISION";
    /**
     * 碰触事件 onTouch(toucher:ProjectClientSceneObject)
     */
    ProjectClientSceneObject.TOUCH = "so_TOUCH";
    /**
     * 离开碰触事件 onTouch(awayer:ProjectClientSceneObject)
     */
    ProjectClientSceneObject.AWAY_TOUCH = "so_AWAY_TOUCH";
    return ProjectClientSceneObject;
}(SceneObjectCommon));
// 重写属性
ObjectUtils.reDefineGetSet("ProjectClientSceneObject.prototype", {
    avatarOri: function (v) {
        if (this.avatar) {
            if (this.avatar.orientation != v)
                this.avatar.orientation = v;
            this.event(ProjectClientSceneObject.CHANGE_ORI);
        }
    },
    avatarAct: function (v) {
        if (this.avatar && this.avatar.actionID != v) {
            if (!this.banAvatarAction) {
                this.avatar.actionID = v;
            }
        }
    }
});
/**
 * 读档界面
 * Created by 黑暗之神KDS on 2020-09-15 12:22:43.
 */
var GUI_Load = /** @class */ (function (_super) {
    __extends(GUI_Load, _super);
    /**
     * 构造函数
     */
    function GUI_Load() {
        var _this = _super.call(this) || this;
        // 监听事件：当界面显示时
        if (_this.list)
            GUI_SaveFileManager.initSaveFileList(_this.list);
        return _this;
    }
    return GUI_Load;
}(GUI_2));
/**
 * 背包
 * Created by 黑暗之神KDS on 2020-09-17 14:56:35.
 */
var GUI_Package = /** @class */ (function (_super) {
    __extends(GUI_Package, _super);
    /**
     * 构造函数
     */
    function GUI_Package() {
        var _this = _super.call(this) || this;
        // 标准化列表
        GUI_Manager.standardList(_this.list, false);
        // 事件监听：当界面显示时
        _this.on(EventObject.DISPLAY, _this, _this.onDisplay);
        // 事件监听：当列表选择项改变时-刷新道具描述
        _this.list.on(EventObject.CHANGE, _this, _this.refreshItemInfo);
        // 事件监听：当项选中时-刷新道具
        _this.list.on(UIList.ITEM_CLICK, _this, _this.onItemClick);
        // 事件监听：当道具更改时
        EventUtils.addEventListenerFunction(ProjectPlayer, ProjectPlayer.EVENT_CHANGE_ITEM_NUMBER, _this.onItemChange, _this);
        // 事件监听：当创建项对象时
        _this.list.onCreateItem = Callback.New(_this.onCreateItemUI, _this);
        return _this;
    }
    //------------------------------------------------------------------------------------------------------
    // 事件
    //------------------------------------------------------------------------------------------------------
    /**
     * 当界面显示时事件
     */
    GUI_Package.prototype.onDisplay = function () {
        // 设置焦点为道具列表
        UIList.focus = this.list;
        // 刷新道具列表
        this.refreshItems(0);
        // 刷新选中的道具详情
        this.refreshItemInfo();
    };
    /**
     * 当创建项显示对象时
     */
    GUI_Package.prototype.onCreateItemUI = function (ui, data, index) {
        var itemDS = data.data;
        // 空数据透明化
        if (!itemDS)
            ui.alpha = 0;
        // 禁用:不可使用的道具
        if (itemDS && !itemDS.item.isUse) {
            ui.itemName.alpha = ui.icon.alpha = ui.itemNum.alpha = 0.2;
        }
    };
    /**
     * 当道具发生变更时
     */
    GUI_Package.prototype.onItemChange = function () {
        // 刷新道具（优化：延迟到下一帧渲染前执行，以保证连续多次更改道具后仅刷新一次而非多次）
        Callback.CallLaterBeforeRender(this.refreshItems, this, [0]);
    };
    /**
     * 当道具点击时
     */
    GUI_Package.prototype.onItemClick = function () {
        var _this = this;
        // 锁定状态下时不触发使用效果
        if (this.useItemLock)
            return;
        // 获取当前选中的列表项
        var selectedItem = this.list.selectedItem;
        if (selectedItem && selectedItem.data) {
            // 获取道具DS格式（此结构额外追加储存了道具的数目）
            var itemDS = selectedItem.data;
            // 获取道具
            var item = itemDS.item;
            // 可使用道具的情况
            if (item.isUse) {
                // 播放使用音效
                if (item.se)
                    GameAudio.playSE(item.se);
                // 锁定，在执行完毕事件前不允许再次使用
                this.useItemLock = true;
                // 执行片段事件
                var trigger = CommandPage.startTriggerFragmentEvent(item.callEvent, Game.player.sceneObject, Game.player.sceneObject, Callback.New(function () {
                    _this.useItemLock = false;
                }, this));
                if (!trigger)
                    this.useItemLock = false;
                // 消耗品的情况：道具-1
                if (item.isConsumables)
                    ProjectPlayer.changeItemNumber(item.id, -1);
            }
            // 否则禁止使用的场合播放禁用音效
            else {
                GameAudio.playSE(WorldData.disalbeSE);
                return;
            }
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 刷新
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新道具列表
     */
    GUI_Package.prototype.refreshItems = function (state) {
        if (state != 0)
            return;
        var arr = [];
        // 遍历玩家自定义数据-背包
        for (var i = 0; i < Game.player.data.package.length; i++) {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            var d = new ListItem_1002;
            // 获取背包的道具DS格式
            var itemDS = Game.player.data.package[i];
            // 绑定项数据，项显示对象会自动根据项数据设置对应的值，参考UIList.api头部注释（CTRL+SHIFT+R搜索UIList.api）
            d.data = itemDS; // 项数据记录对应的道具，以便能够通过项数据找到其对应的道具
            d.icon = itemDS.item.icon; // 设置图标
            d.itemName = itemDS.item.name; // 设置名称
            d.itemNum = "x" + itemDS.number.toString(); // 设置道具数目
            arr.push(d);
        }
        // 如果没有道具的话：追加一个空项
        if (Game.player.data.package.length == 0) {
            var emptyItem = new ListItem_1002;
            emptyItem.icon = "";
            emptyItem.itemName = "";
            emptyItem.itemNum = "";
            arr.push(emptyItem);
        }
        // 刷新排列
        arr.sort(function (aListItem, bListItem) {
            var a = aListItem.data;
            var b = bListItem.data;
            if (!a || !b)
                return -1;
            // -- 道具比装备更优先
            if (a.item.isUse != b.item.isUse) {
                return a.item.isUse ? -1 : 1;
            }
            // -- 装备按照编号排列
            else {
                return a.item.id < b.item.id ? -1 : 1;
            }
        });
        // 刷新列表
        this.list.items = arr;
    };
    /**
     * 刷新道具详情
     */
    GUI_Package.prototype.refreshItemInfo = function () {
        // 获取选中的项数据
        var selectedItem = this.list.selectedItem;
        // 未选中任何道具的情况
        if (!selectedItem || !selectedItem.data) {
            this.itemName.text = "";
            this.itemIntro.text = "";
        }
        // 已选中道具的情况：显示该道具详情
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
/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
var GUI_Save = /** @class */ (function (_super) {
    __extends(GUI_Save, _super);
    function GUI_Save() {
        var _this = _super.call(this) || this;
        if (_this.list)
            GUI_SaveFileManager.initSaveFileList(_this.list, true);
        return _this;
    }
    return GUI_Save;
}(GUI_5));
/**
 * 系统设置
 * Created by 黑暗之神KDS on 2020-03-12 13:55:53.
 */
var GUI_Setting = /** @class */ (function (_super) {
    __extends(GUI_Setting, _super);
    //------------------------------------------------------------------------------------------------------
    // 初始化
    //------------------------------------------------------------------------------------------------------
    function GUI_Setting() {
        var _this = _super.call(this) || this;
        // 标准化TAB
        GUI_Manager.standardTab(_this.typeTab);
        // 标准化LIST
        GUI_Manager.standardList(_this.keyboardList);
        GUI_Manager.standardList(_this.gamepadList);
        // 初始化按键设定
        _this.initKeyboardSetting();
        // 初始化手柄设定
        _this.initGamepadSetting();
        // 监听标签改变
        _this.typeTab.on(EventObject.CHANGE, _this, _this.refreshFocus);
        // 刷新
        _this.on(EventObject.DISPLAY, _this, _this.onDisplay);
        return _this;
    }
    /**
     * 界面显示时
     */
    GUI_Setting.prototype.onDisplay = function () {
        this.refreshFocus();
        this.cancelInputKey();
    };
    /**
     * 获取系统键位描述
     * @param key 系统键位名，对应GUI_Setting.KEY_BOARD的键
     */
    GUI_Setting.getSystemKeyDesc = function (key) {
        if (ProjectUtils.lastControl <= 1) {
            var keyInfo = GUI_Setting.KEY_BOARD[key];
            if (!GUI_Setting.KEY_BOARD || !Keyboard || !Keyboard.getKeyName)
                return "";
            return Keyboard.getKeyName(keyInfo.keys[0]);
        }
        else {
            return key;
        }
    };
    //------------------------------------------------------------------------------------------------------
    // 载入设定
    //------------------------------------------------------------------------------------------------------
    GUI_Setting.initHotKeySetting = function () {
        // 默认键盘键位设置
        for (var i = 0; i < WorldData.keyboards.length; i++) {
            var keyboardInfo = WorldData.keyboards[i];
            var sysKeyName = GUI_Setting.SYSTEM_KEYS[keyboardInfo.gameKey];
            var keySetting = GUI_Setting.KEY_BOARD[sysKeyName];
            if (keyboardInfo.keyCode1)
                keySetting.keys.push(keyboardInfo.keyCode1);
            if (keyboardInfo.keyCode2)
                keySetting.keys.push(keyboardInfo.keyCode2);
            if (keyboardInfo.keyCode3)
                keySetting.keys.push(keyboardInfo.keyCode3);
            if (keyboardInfo.keyCode4)
                keySetting.keys.push(keyboardInfo.keyCode4);
        }
        GUI_Setting.KEY_BOARD_DEFAULT = ObjectUtils.depthClone(GUI_Setting.KEY_BOARD);
        // 载入配置
        var settingData = SinglePlayerGame.getSaveCustomGlobalData("Setting");
        if (settingData) {
            GameAudio.bgmVolume = settingData.bgmVolume;
            GameAudio.bgsVolume = settingData.bgsVolume;
            GameAudio.seVolume = settingData.seVolume;
            GameAudio.tsVolume = settingData.tsVolume;
            if (settingData.KEY_BOARD)
                ObjectUtils.clone(settingData.KEY_BOARD, GUI_Setting.KEY_BOARD);
            if (settingData.GAMEPAD)
                ObjectUtils.clone(settingData.GAMEPAD, GUI_Setting.GAMEPAD);
        }
        // 同步LIST内置按键
        this.syncListKeyDownSetting();
        // 注册自定义储存信息
        SinglePlayerGame.regSaveCustomGlobalData("Setting", Callback.New(this.getGlobalData, this));
    };
    /**
     * 获取全局数据
     */
    GUI_Setting.getGlobalData = function () {
        return {
            KEY_BOARD: GUI_Setting.KEY_BOARD,
            GAMEPAD: GUI_Setting.GAMEPAD,
            bgmVolume: GameAudio.bgmVolume,
            bgsVolume: GameAudio.bgsVolume,
            seVolume: GameAudio.seVolume,
            tsVolume: GameAudio.tsVolume
        };
    };
    //------------------------------------------------------------------------------------------------------
    // 功能
    //------------------------------------------------------------------------------------------------------
    /**
     * 判断系统按键是否按下
     * @param keyCode 按键值
     * @param keyInfo 对应 GUI_Setting.KEY_BOARD
     * @return [boolean]
     */
    GUI_Setting.IS_KEY = function (keyCode, keyInfo) {
        return keyInfo.keys.indexOf(keyCode) != -1;
    };
    Object.defineProperty(GUI_Setting, "IS_KEY_DOWN_DirectionKey", {
        /**
         * 判断系统方向键是否已按下
         * @return [boolean]
         */
        get: function () {
            if (!ProjectUtils.keyboardEvent)
                return;
            var keyCode = ProjectUtils.keyboardEvent.keyCode;
            if (GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.UP) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.DOWN) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.LEFT) ||
                GUI_Setting.IS_KEY(keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
                return true;
            }
            return false;
        },
        enumerable: false,
        configurable: true
    });
    //------------------------------------------------------------------------------------------------------
    // 快捷键设定-键盘
    //------------------------------------------------------------------------------------------------------
    GUI_Setting.prototype.initKeyboardSetting = function () {
        var _this = this;
        // 创建每个项对象时
        this.keyboardList.onCreateItem = Callback.New(function (ui, data, index) {
            var keyBoardInfo = data.data;
            ui.key1.label = GUI_Setting.getKeyBoardName(keyBoardInfo.keys[0]);
            ui.key2.label = GUI_Setting.getKeyBoardName(keyBoardInfo.keys[1]);
            ui.key3.label = GUI_Setting.getKeyBoardName(keyBoardInfo.keys[2]);
            ui.key4.label = GUI_Setting.getKeyBoardName(keyBoardInfo.keys[3]);
            ui.key1.on(EventObject.CLICK, _this, _this.openWaitInputKeyboard, [0]);
            ui.key2.on(EventObject.CLICK, _this, _this.openWaitInputKeyboard, [1]);
            ui.key3.on(EventObject.CLICK, _this, _this.openWaitInputKeyboard, [2]);
            ui.key4.on(EventObject.CLICK, _this, _this.openWaitInputKeyboard, [3]);
        }, this);
        // 显示全部按键
        this.refreshKeyboardList();
        // 用快捷键操作设置键位
        stage.on(EventObject.KEY_DOWN, this, this.onSetKeyboardByHotKey);
        // 还原默认值
        this.keyboardReset.on(EventObject.CLICK, this, this.resetKeyboard);
    };
    /**
     * 刷新显示全部按键信息列表
     */
    GUI_Setting.prototype.refreshKeyboardList = function () {
        // 显示全部按键
        var keyBoards = [];
        for (var i in GUI_Setting.KEY_BOARD) {
            var kInfo = GUI_Setting.KEY_BOARD[i];
            keyBoards.push({ name: i, keys: kInfo.keys, index: kInfo.index });
        }
        keyBoards.sort(function (a, b) { return a.index < b.index ? -1 : 1; });
        var items = [];
        for (var s = 0; s < keyBoards.length; s++) {
            var d = new ListItem_1018;
            var keyBoardInfo = keyBoards[s];
            d.data = keyBoardInfo;
            d.keyName = keyBoardInfo.name;
            items.push(d);
        }
        this.keyboardList.items = items;
    };
    /**
     * 等待输入按键
     * @param keyIndex 按键位置 0-第一个按键 1-第二个按键
     */
    GUI_Setting.prototype.openWaitInputKeyboard = function (keyIndex) {
        if (!this.keyboardList.selectedItem || this.needInputKeyPanel.visible)
            return;
        var keyBoardInfo = this.keyboardList.selectedItem.data;
        if (!keyBoardInfo)
            return;
        this.typeTab.mouseEnabled = false;
        this.needInputKeyPanel.visible = true;
        this.needInputKeyLabel.text = keyBoardInfo.name + " " + WorldData.word_keyboardInput.replace("$1", (keyIndex + 1).toString());
        this.refreshFocus();
        GUI_Setting.IS_INPUT_KEY_MODE = true;
        stage.once(EventObject.KEY_DOWN, this, this.onSetKeyboard, [keyBoardInfo, keyIndex]);
        stage.once(EventObject.MOUSE_DOWN, this, this.cancelInputKey);
    };
    /**
     * 关闭等待输入按键
     */
    GUI_Setting.prototype.closeWaitInputKeyboard = function () {
        stage.off(EventObject.KEY_DOWN, this, this.onSetKeyboard);
        GUI_Setting.IS_INPUT_KEY_MODE = false;
        this.needInputKeyPanel.visible = false;
        this.typeTab.mouseEnabled = true;
        this.refreshFocus();
    };
    /**
     * 当设置按键按下时
     */
    GUI_Setting.prototype.onSetKeyboard = function (keyBoardInfo, keyIndex, e) {
        keyBoardInfo.keys[keyIndex] = e.keyCode;
        var ui = this.keyboardList.getItemUI(this.keyboardList.selectedIndex);
        ui["key" + (keyIndex + 1)].label = GUI_Setting.getKeyBoardName(e.keyCode);
        if (keyBoardInfo == GUI_Setting.KEY_BOARD.UP)
            UIList.KEY_UP[keyIndex] = e.keyCode;
        if (keyBoardInfo == GUI_Setting.KEY_BOARD.DOWN)
            UIList.KEY_DOWN[keyIndex] = e.keyCode;
        if (keyBoardInfo == GUI_Setting.KEY_BOARD.LEFT)
            UIList.KEY_LEFT[keyIndex] = e.keyCode;
        if (keyBoardInfo == GUI_Setting.KEY_BOARD.RIGHT)
            UIList.KEY_RIGHT[keyIndex] = e.keyCode;
        if (keyBoardInfo == GUI_Setting.KEY_BOARD.A)
            UIList.KEY_ENTER[keyIndex] = e.keyCode;
        this.closeWaitInputKeyboard();
        EventUtils.happen(GUI_Setting, GUI_Setting.EVENT_CHANGE_HOT_KEY);
        GameAudio.playSE(ClientWorld.data.sureSE);
    };
    /**
     * 当设置按键按下时（快捷键呼出）
     * @param e
     */
    GUI_Setting.prototype.onSetKeyboardByHotKey = function (e) {
        // 焦点不在设置键位上或该界面未显示则忽略
        if (UIList.focus != this.keyboardList || !this.keyboardList.stage || UIList.focus != this.keyboardList)
            return;
        // 左键设置第一个键位，右键设置第二个键位
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            this.openWaitInputKeyboard(0);
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
            this.openWaitInputKeyboard(1);
        }
    };
    /**
     * 重置按键
     */
    GUI_Setting.prototype.resetKeyboard = function () {
        GUI_Setting.KEY_BOARD = ObjectUtils.depthClone(GUI_Setting.KEY_BOARD_DEFAULT);
        this.refreshKeyboardList();
        GUI_Setting.syncListKeyDownSetting();
    };
    //------------------------------------------------------------------------------------------------------
    // 快捷键设定-手柄
    //------------------------------------------------------------------------------------------------------
    GUI_Setting.prototype.initGamepadSetting = function () {
        var _this = this;
        // 创建每个项对象时
        this.gamepadList.onCreateItem = Callback.New(function (ui, data, index) {
            var gamepadInfo = data.data;
            ui.key1.label = _this.getGamepadName(gamepadInfo.key);
            ui.key1.on(EventObject.CLICK, _this, _this.openWaitInputGamepad);
        }, this);
        // 显示全部按键
        this.refreshGamepadList();
        // 用快捷键操作设置键位
        stage.on(EventObject.KEY_DOWN, this, this.onSetGamepadByHotKey);
        // 还原默认值
        this.gamepadReset.on(EventObject.CLICK, this, this.resetGamepad);
    };
    /**
     * 刷新显示全部按键信息列表
     */
    GUI_Setting.prototype.refreshGamepadList = function () {
        // 显示全部按键
        var gamepads = [];
        for (var i in GUI_Setting.GAMEPAD) {
            var kInfo = GUI_Setting.GAMEPAD[i];
            kInfo.name = i;
            gamepads.push(kInfo);
        }
        gamepads.sort(function (a, b) { return a.index < b.index ? -1 : 1; });
        var items = [];
        for (var s = 0; s < gamepads.length; s++) {
            var d = new ListItem_1019;
            var gamepadInfo = gamepads[s];
            d.data = gamepadInfo;
            d.keyName = gamepadInfo.name;
            items.push(d);
        }
        this.gamepadList.items = items;
    };
    /**
     * 获取键盘按键名
     * @param key 键位
     * @return [string]
     */
    GUI_Setting.prototype.getGamepadName = function (keyIndex) {
        if (keyIndex == -1)
            return "--/--";
        var name = "[" + keyIndex + "]" + GCGamepad.keyNames[keyIndex];
        return name ? name : "--/--";
    };
    /**
     * 等待输入按键
     * @param keyIndex 按键位置 0-第一个按键 1-第二个按键
     */
    GUI_Setting.prototype.openWaitInputGamepad = function (keyIndex) {
        if (!this.gamepadList.selectedItem || this.needInputKeyPanel.visible || UIList.focus != this.gamepadList)
            return;
        var gamepadInfo = this.gamepadList.selectedItem.data;
        if (!gamepadInfo)
            return;
        this.typeTab.mouseEnabled = false;
        this.needInputKeyPanel.visible = true;
        this.needInputKeyLabel.text = gamepadInfo.name + "\uFF1A".concat(WorldData.word_gamepadInput, "...");
        this.refreshFocus();
        GUI_Setting.IS_INPUT_KEY_MODE = true;
        GCGamepad.pad1.on(GCGamepad.GAMEPAD_KEY_DOWN, this, this.onSetGamepad, [gamepadInfo]);
        stage.once(EventObject.MOUSE_DOWN, this, this.cancelInputKey);
    };
    /**
     * 关闭等待输入按键
     */
    GUI_Setting.prototype.closeWaitInputGamepad = function () {
        GUI_Setting.IS_INPUT_KEY_MODE = false;
        GCGamepad.pad1.off(GCGamepad.GAMEPAD_KEY_DOWN, this, this.onSetGamepad);
        this.needInputKeyPanel.visible = false;
        this.typeTab.mouseEnabled = true;
        this.refreshFocus();
    };
    /**
     * 当设置按键按下时
     */
    GUI_Setting.prototype.onSetGamepad = function (gamepadInfo, keyCode, lastCtrlEnabled) {
        var keyIndex = GCGamepad.pad1.getKeyIndex(keyCode);
        // 将其他的同键位清空
        for (var i in GUI_Setting.GAMEPAD) {
            if (GUI_Setting.GAMEPAD[i].key == keyIndex)
                GUI_Setting.GAMEPAD[i].key = -1;
        }
        gamepadInfo.key = keyIndex;
        this.closeWaitInputGamepad();
        GameAudio.playSE(ClientWorld.data.sureSE);
        this.refreshGamepadList();
    };
    /**
     * 当设置按键按下时（快捷键呼出）
     * @param e
     */
    GUI_Setting.prototype.onSetGamepadByHotKey = function (e) {
        // 焦点不在设置键位上或该界面未显示则忽略
        if (UIList.focus != this.gamepadList || !this.gamepadList.stage)
            return;
        // 左键设置第一个键位，右键设置第二个键位
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
            this.openWaitInputGamepad(0);
        }
    };
    /**
     * 重置按键
     */
    GUI_Setting.prototype.resetGamepad = function () {
        GUI_Setting.GAMEPAD = ObjectUtils.depthClone(GUI_Setting.GAMEPAD_DEFAULT);
        this.refreshGamepadList();
    };
    //------------------------------------------------------------------------------------------------------
    // 内部
    //------------------------------------------------------------------------------------------------------
    /**
     * 同步LIST内置按键
     */
    GUI_Setting.syncListKeyDownSetting = function () {
        UIList.KEY_UP = GUI_Setting.KEY_BOARD.UP.keys;
        UIList.KEY_DOWN = GUI_Setting.KEY_BOARD.DOWN.keys;
        UIList.KEY_LEFT = GUI_Setting.KEY_BOARD.LEFT.keys;
        UIList.KEY_RIGHT = GUI_Setting.KEY_BOARD.RIGHT.keys;
        UIList.KEY_ENTER = GUI_Setting.KEY_BOARD.A.keys;
    };
    /**
     * 获取键盘按键名
     * @param key 键位
     * @return [string]
     */
    GUI_Setting.getKeyBoardName = function (key) {
        if (key != null && Keyboard) {
            for (var s in Keyboard) {
                if (Keyboard[s] == key)
                    return s;
            }
        }
        return "--/--";
    };
    /**
        * 根据标签类别刷新焦点
        */
    GUI_Setting.prototype.refreshFocus = function () {
        if (this.needInputKeyPanel.visible) {
            UIList.focus = null;
            return;
        }
        switch (this.typeTab.selectedIndex) {
            case 0:
                // UIList.focus = this.audioSettingList;
                break;
            case 1:
                UIList.focus = this.keyboardList;
                break;
            case 2:
                UIList.focus = this.gamepadList;
                break;
            case 3:
                UIList.focus = null;
                break;
        }
    };
    /**
     * 取消输入
     */
    GUI_Setting.prototype.cancelInputKey = function () {
        GUI_Setting.IS_INPUT_KEY_MODE = false;
        stage.off(EventObject.KEY_DOWN, this, this.onSetKeyboard);
        GCGamepad.pad1.off(GCGamepad.GAMEPAD_KEY_DOWN, this, this.onSetGamepad);
        this.needInputKeyPanel.visible = false;
        this.typeTab.mouseEnabled = true;
        this.refreshFocus();
    };
    //------------------------------------------------------------------------------------------------------
    // 静态
    //------------------------------------------------------------------------------------------------------
    /**
     * 事件：改变快捷键
     */
    GUI_Setting.EVENT_CHANGE_HOT_KEY = "GUI_SettingEVENT_CHANGE_HOT_KEY";
    /**
     * 系统按键集
     */
    GUI_Setting.SYSTEM_KEYS = ["UP", "DOWN", "LEFT", "RIGHT", "A", "B", "X", "Y", "START", "BACK", "L1", "L2", "R1", "R2"];
    /**
     * 当前键盘按键设定
     */
    GUI_Setting.KEY_BOARD = {
        "UP": { index: 1, keys: [] },
        "DOWN": { index: 2, keys: [] },
        "LEFT": { index: 3, keys: [] },
        "RIGHT": { index: 4, keys: [] },
        "A": { index: 5, keys: [] },
        "B": { index: 17, keys: [] },
        "X": { index: 18, keys: [] },
        "Y": { index: 19, keys: [] },
        "START": { index: 20, keys: [] },
        "BACK": { index: 21, keys: [] },
        "L1": { index: 22, keys: [] },
        "L2": { index: 23, keys: [] },
        "R1": { index: 24, keys: [] },
        "R2": { index: 25, keys: [] }
    };
    GUI_Setting.GAMEPAD = {
        "X": { index: 1, key: GCGamepad.xKeyIndex },
        "Y": { index: 2, key: GCGamepad.yKeyIndex },
        "A": { index: 3, key: GCGamepad.aKeyIndex },
        "B": { index: 4, key: GCGamepad.bKeyIndex },
        "START": { index: 5, key: GCGamepad.startKeyIndex },
        "BACK": { index: 6, key: GCGamepad.backKeyIndex },
        "L1": { index: 7, key: GCGamepad.LBKeyIndex },
        "L2": { index: 8, key: GCGamepad.LTKeyIndex },
        "R1": { index: 9, key: GCGamepad.RBKeyIndex },
        "R2": { index: 10, key: GCGamepad.RTKeyIndex }
    };
    GUI_Setting.GAMEPAD_DEFAULT = ObjectUtils.depthClone(GUI_Setting.GAMEPAD);
    return GUI_Setting;
}(GUI_6));
/**
 * 商店界面
 * Created by 七星瓢虫 on 2020-10-07 21:21:25.
 */
var GUI_Shop = /** @class */ (function (_super) {
    __extends(GUI_Shop, _super);
    //===============================================================================
    // 初始化
    //===============================================================================
    /**
     * 构造函数
     */
    function GUI_Shop() {
        var _this = _super.call(this) || this;
        // 标准化列表
        GUI_Manager.standardList(_this.goodsList, false);
        GUI_Manager.standardList(_this.sellItemList, false);
        // 记录标签类别
        _this.preTypeTabItem = _this.typeTab.items;
        // 开启监听
        _this.listenQueue();
        return _this;
    }
    /**
     * 界面监听事件列表
     */
    GUI_Shop.prototype.listenQueue = function () {
        var _this = this;
        // 事件监听：当界面显示时
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        // 事件监听：当界面隐藏时
        this.on(EventObject.UNDISPLAY, this, this.onUndisplay);
        // 事件监听：当商品列表选择项改变时 - 选中商品
        this.goodsList.on(EventObject.CHANGE, this, this.refreshItemInfo, [this.goodsList]);
        // 事件监听：当出售列表选择项改变时 - 选中待售品
        this.sellItemList.on(EventObject.CHANGE, this, this.refreshItemInfo, [this.sellItemList]);
        // 事件监听：当商品列表项选中时 - 刷新道具
        this.goodsList.on(UIList.ITEM_CLICK, this, this.onGoodsClick);
        // 事件监听：当出售列表项选中时 - 刷新道具
        this.sellItemList.on(UIList.ITEM_CLICK, this, this.onSellItemClick);
        // 事件监听：当切换购买出售标签时
        this.typeTab.on(EventObject.CHANGE, this, this.onTypeTabChange);
        // 事件监听：当按下关闭按钮时
        this.closeBtn.on(EventObject.CLICK, this, function () {
            GameAudio.playSE(WorldData.cancelSE);
            GameUI.hide(_this.guiID);
        });
        // 购买/出售相关按钮
        this.subNumBtn.on(EventObject.CLICK, this, this.onSubNumChange);
        this.addNumBtn.on(EventObject.CLICK, this, this.onAddNumChange);
        this.maxNumBtn.on(EventObject.CLICK, this, this.onMaxNumChange);
        this.sureBtn.on(EventObject.CLICK, this, this.onSureNumChange);
        this.cancelBtn.on(EventObject.CLICK, this, this.onCancelNumChange);
        // 鼠标右键
        stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.onRightMouseDOwn);
    };
    /**
     * 初始化商品列表
     */
    GUI_Shop.prototype.initGoodsList = function () {
        var dataArr;
        var p = this.shopEventData;
        if (!p || !p.goodsList || p.goodsList.length == 0) {
            this.goodsList.items = [];
            this.goodsList.selectedIndex = -1;
            return;
        }
        dataArr = p.goodsList;
        var items = [];
        // 遍历
        for (var i = 0; i < dataArr.length; i++) {
            var goods = dataArr[i];
            var data = new ListItem_1003();
            var moduleID = 1;
            var gooldsID = goods.item;
            var item = GameData.getModuleData(moduleID, gooldsID);
            // 道具不存在的情况：忽略
            if (!item)
                continue;
            data.data = goods;
            data.icon = item.icon;
            data.itemName = item.name;
            if (goods.numberType == 0) {
                data.itemNum = this.shopEventData.nameWhenInfinite;
            }
            else if (goods.numberType == 1) {
                data.itemNum = goods.number.toString();
            }
            else {
                data.itemNum = Game.player.variable.getVariable(goods.numberVar).toString();
            }
            if (goods.priceType == 0) {
                data.itemPrice = item.sell.toString();
            }
            else if (goods.priceType == 1) {
                data.itemPrice = goods.price.toString();
            }
            else {
                data.itemPrice = Game.player.variable.getVariable(goods.priceVar).toString();
            }
            var playerItemDS = ProjectPlayer.getItemDS(item.id);
            data.ownNum = playerItemDS ? playerItemDS.number.toString() : "0";
            items.push(data);
        }
        // 赋值
        this.goodsList.items = items;
        // 默认悬停第一项
        this.goodsList.selectedIndex = 0;
        // 刷新商品列表显示效果
        this.refreshGoodsListView();
    };
    //===============================================================================
    // 监听反馈
    //===============================================================================
    /**
     * 显示界面时
     */
    GUI_Shop.prototype.onDisplay = function () {
        var _this = this;
        // 容错：没有商店数据时
        if (!this.shopEventData)
            return;
        // 禁用菜单
        this.preMenuEnabled = WorldData.menuEnabled;
        WorldData.menuEnabled = false;
        // 调整出售按钮
        if (this.shopEventData.enableSell) {
            this.typeTab.items = this.preTypeTabItem;
        }
        else {
            this.typeTab.items = this.preTypeTabItem.split(",")[0];
        }
        // 隐藏购买区域
        this.buyBoxArea.visible = false;
        // 初始化商品列表
        this.initGoodsList();
        // 更新焦点状态：0-商品列表(延迟1帧)
        setFrameout(function () { UIList.focus = _this.goodsList; }, 1);
        this.focusState = 0;
        // 刷新选中的道具详情
        this.refreshItemInfo();
        // 开启按键监听
        stage.on(EventObject.KEY_DOWN, this, this.onKeyDown);
    };
    /**
     * 隐藏界面时
     */
    GUI_Shop.prototype.onUndisplay = function () {
        // 恢复禁用菜单为原先状态
        WorldData.menuEnabled = this.preMenuEnabled;
        // 取消按键监听
        stage.off(EventObject.KEY_DOWN, this, this.onKeyDown);
        // 回到购买页面
        this.typeTab.selectedIndex = 0;
    };
    /**
     * 选中商品时
     */
    GUI_Shop.prototype.onGoodsClick = function () {
        // 获取当前选中的列表项
        var selectedItem = this.goodsList.selectedItem;
        if (selectedItem && selectedItem.data) {
            // 获取商品信息
            var itemID = selectedItem.data; // 道具编号
            var itemNum = Number(selectedItem.itemNum); // 剩余数量
            var itemPrice = Number(selectedItem.itemPrice); // 当前价格
            // 可购买的情况
            if (itemPrice <= Game.player.data.gold && itemNum != 0) {
                // 播放 确认音效
                GameAudio.playSE(ClientWorld.data.sureSE);
                // 更新焦点状态：1-购买区域
                this.focusState = 1;
                // 显示购买区域
                this.buyBoxArea.visible = true;
                this.buyNum_text.visible = true;
                this.sellNum_text.visible = false;
                UIList.focus = null;
                this.buyNum.text = "1";
                // 刷新购买数量
                this.refreshBuyNum(selectedItem);
            }
            else { // 不可购买的情况
                // 播放 禁用音效
                GameAudio.playSE(ClientWorld.data.disalbeSE);
            }
        }
    };
    /**
     * 选中待售品时
     */
    GUI_Shop.prototype.onSellItemClick = function () {
        // 获取当前选中的列表项
        var selectedItem = this.sellItemList.selectedItem;
        if (selectedItem && selectedItem.data) {
            // 获取待售品信息
            var itemID = selectedItem.data; // 道具编号
            var itemNum = Number(selectedItem.itemNum); // 持有数量
            var itemPrice = Number(selectedItem.itemPrice); // 出售价格
            // 可出售的情况
            if (itemNum > 0) {
                // 播放 确认音效
                GameAudio.playSE(ClientWorld.data.sureSE);
                // 更新焦点状态：1-出售区域
                this.focusState = 1;
                // 显示购买区域
                this.buyBoxArea.visible = true;
                this.buyNum_text.visible = false;
                this.sellNum_text.visible = true;
                UIList.focus = null;
                this.buyNum.text = "1";
                // 刷新出售数量
                this.refreshSellNum(selectedItem);
            }
            else { // 不可出售的情况
                // 播放 禁用音效
                GameAudio.playSE(ClientWorld.data.disalbeSE);
            }
        }
    };
    /**
     * 当购买出售类别改变时处理
     */
    GUI_Shop.prototype.onTypeTabChange = function () {
        // 购买
        if (this.typeTab.selectedIndex == 0) {
            // 隐藏待售列表
            this.sellItemList.visible = false;
            // 显示商品列表
            this.goodsList.visible = true;
            // 更新焦点状态：0-商品列表
            UIList.focus = this.goodsList;
            this.focusState = 0;
            this.buyBoxArea.visible = false;
            this.refreshItemInfo(this.goodsList);
            // 更换提示文字
            this.buyNum_text.visible = true;
            this.sellNum_text.visible = false;
            // 刷新商品列表显示效果
            this.refreshGoodsListView();
        }
        // 出售
        else if (this.typeTab.selectedIndex == 1) {
            // 刷新出售列表
            this.refreshSellItemList();
            // 隐藏商品列表
            this.goodsList.visible = false;
            // 显示待售列表
            this.sellItemList.visible = true;
            // 更新焦点状态：0-待售列表
            UIList.focus = this.sellItemList;
            this.focusState = 0;
            this.buyBoxArea.visible = false;
            this.refreshItemInfo(this.sellItemList);
            // 更换提示文字
            this.buyNum_text.visible = false;
            this.sellNum_text.visible = true;
        }
    };
    //===============================================================================
    // 监听反馈 仅显示时监听
    //===============================================================================
    GUI_Shop.prototype.onKeyDown = function (e) {
        var keyCode = e.keyCode;
        // 按键：切换标签
        if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.L1)) {
            if (this.typeTab.selectedIndex > 0) {
                this.typeTab.selectedIndex--;
                GameAudio.playSE(WorldData.selectSE);
            }
        }
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.R1)) {
            if (this.typeTab.selectedIndex < this.typeTab.length - 1) {
                this.typeTab.selectedIndex++;
                GameAudio.playSE(WorldData.selectSE);
            }
        }
        // 按键：退出
        else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.B)) {
            if (this.focusState == 0) {
                // ESC键：离开商店
                GameAudio.playSE(WorldData.cancelSE);
                GameUI.hide(this.guiID);
            }
            else if (this.focusState == 1) {
                GameAudio.playSE(WorldData.cancelSE);
                this.focusState = 0;
                this.buyBoxArea.visible = false;
                if (this.typeTab.selectedIndex == 0) {
                    UIList.focus = this.goodsList;
                }
                else {
                    UIList.focus = this.sellItemList;
                }
            }
        }
        // 操作购买/售出数值
        if (this.focusState == 1) {
            // 获取当前选中的列表项
            var selectedItem = void 0;
            if (this.typeTab.selectedIndex == 0)
                selectedItem = this.goodsList.selectedItem;
            else if (this.typeTab.selectedIndex == 1)
                selectedItem = this.sellItemList.selectedItem;
            // 方向键：数量操作
            var buyNum = Number(this.buyNum.text);
            var flag_key_num = false;
            // 下：减 10
            if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.DOWN)) {
                flag_key_num = true;
                if (buyNum > 10)
                    buyNum -= 10;
                else
                    buyNum = 1;
            }
            // 上：加 10
            else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.UP)) {
                flag_key_num = true;
                if (buyNum < 990)
                    buyNum += 10;
                else
                    buyNum = 999;
            }
            // 左：减 1
            else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.LEFT)) {
                flag_key_num = true;
                if (buyNum > 1)
                    buyNum -= 1;
            }
            // 右：加 1
            else if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.RIGHT)) {
                flag_key_num = true;
                if (buyNum < 999)
                    buyNum += 1;
            }
            // 触发方向键时
            if (flag_key_num == true) {
                // 刷新数量
                if (this.typeTab.selectedIndex == 0)
                    this.refreshBuyNum(selectedItem, buyNum);
                else if (this.typeTab.selectedIndex == 1)
                    this.refreshSellNum(selectedItem, buyNum);
                GameAudio.playSE(WorldData.selectSE);
            }
            // 确定键：购买
            if (GUI_Setting.IS_KEY(e.keyCode, GUI_Setting.KEY_BOARD.A)) {
                // 买卖商品
                if (this.typeTab.selectedIndex == 0)
                    this.buyGoods(selectedItem, Math.floor(Number(this.buyNum.text)));
                else if (this.typeTab.selectedIndex == 1)
                    this.sellItem(selectedItem, Math.floor(Number(this.buyNum.text)));
            }
        }
    };
    /**
     * 右键鼠标按下时
     */
    GUI_Shop.prototype.onRightMouseDOwn = function () {
        if (!this.stage)
            return;
        var e = new EventObject;
        e.keyCode = GUI_Setting.KEY_BOARD.BACK.keys[0];
        this.onKeyDown(e);
    };
    /**
     * 使用按钮减少1个购买或卖出数量
     */
    GUI_Shop.prototype.onSubNumChange = function () {
        var buyNum = Number(this.buyNum.text);
        if (buyNum > 1)
            buyNum -= 1;
        this.changeBuyOrSellNum(buyNum);
    };
    /**
     * 使用按钮增加1个购买或卖出数量
     */
    GUI_Shop.prototype.onAddNumChange = function () {
        var buyNum = Number(this.buyNum.text);
        if (buyNum < 999)
            buyNum += 1;
        this.changeBuyOrSellNum(buyNum);
    };
    /**
     * 使用按钮最大化购买或卖出数量
     */
    GUI_Shop.prototype.onMaxNumChange = function () {
        var buyNum = 999;
        this.changeBuyOrSellNum(buyNum);
    };
    /**
     * 使用按钮确认购买或卖出
     */
    GUI_Shop.prototype.onSureNumChange = function () {
        var selectedItem;
        if (this.typeTab.selectedIndex == 0)
            selectedItem = this.goodsList.selectedItem;
        else if (this.typeTab.selectedIndex == 1)
            selectedItem = this.sellItemList.selectedItem;
        if (this.typeTab.selectedIndex == 0)
            this.buyGoods(selectedItem, Math.floor(Number(this.buyNum.text)));
        else if (this.typeTab.selectedIndex == 1)
            this.sellItem(selectedItem, Math.floor(Number(this.buyNum.text)));
    };
    /**
     * 使用按钮取消购买或卖出
     */
    GUI_Shop.prototype.onCancelNumChange = function () {
        GameAudio.playSE(WorldData.cancelSE);
        this.focusState = 0;
        this.buyBoxArea.visible = false;
        if (this.typeTab.selectedIndex == 0) {
            UIList.focus = this.goodsList;
        }
        else {
            UIList.focus = this.sellItemList;
        }
    };
    /**
     * 更改购买或卖出的数量
     */
    GUI_Shop.prototype.changeBuyOrSellNum = function (buyNum) {
        GameAudio.playSE(WorldData.selectSE);
        var selectedItem;
        if (this.typeTab.selectedIndex == 0)
            selectedItem = this.goodsList.selectedItem;
        else if (this.typeTab.selectedIndex == 1)
            selectedItem = this.sellItemList.selectedItem;
        if (this.typeTab.selectedIndex == 0)
            this.refreshBuyNum(selectedItem, buyNum);
        else if (this.typeTab.selectedIndex == 1)
            this.refreshSellNum(selectedItem, buyNum);
    };
    //===============================================================================
    // 数据交互
    //===============================================================================
    /**
     * 购买商品
     */
    GUI_Shop.prototype.buyGoods = function (selectedItem, buyNum) {
        // 容错
        if (!selectedItem || !selectedItem.data)
            return;
        var itemDS = selectedItem.data;
        var itemPrice = Math.floor(Number(selectedItem.itemPrice));
        if (itemPrice * buyNum > Game.player.data.gold)
            return;
        var itemID = itemDS.item;
        // 播放 确认音效
        GameAudio.playSE(ClientWorld.data.sureSE);
        // 扣除对应货币
        ProjectPlayer.increaseGold(-itemPrice * buyNum);
        // 减少对应库存
        this.reduceGoodsNum(buyNum);
        // 增加对应道具
        ProjectPlayer.changeItemNumber(itemID, buyNum);
        // 刷新持有数量
        this.refreshItemInPackage(itemID, selectedItem);
        // 刷新列表显示
        this.refreshGoodsListView();
        // 隐藏购买区域
        this.buyBoxArea.visible = false;
        // 更新焦点状态：0-商品列表
        this.focusState = 0;
        UIList.focus = this.goodsList;
    };
    /**
     * 减少库存
     */
    GUI_Shop.prototype.reduceGoodsNum = function (buyNum) {
        // 获取选中项索引
        var selectedItemIndex = this.goodsList.selectedIndex;
        if (selectedItemIndex < 0)
            return;
        // 获取商品数据
        var goods = this.goodsList.items[selectedItemIndex];
        // 获取商店事件原始数据
        var data = this.shopEventData.goodsList[selectedItemIndex];
        // 当数量类型为无限时，什么都不发生
        if (data.numberType == 0)
            return;
        // 更新库存数量
        goods.itemNum = (Number(goods.itemNum) - buyNum).toString();
        this.goodsList.replaceItem(goods, selectedItemIndex);
        // 当数量类型为变量时，修改对应变量
        if (data.numberType == 2)
            Game.player.variable.setVariable(data.numberVar, Number(goods.itemNum));
    };
    /**
     * 出售商品
     */
    GUI_Shop.prototype.sellItem = function (selectedItem, sellNum) {
        // 容错
        if (!selectedItem || !selectedItem.data || sellNum <= 0)
            return;
        var itemDS = selectedItem.data;
        var itemPrice = Math.floor(Number(selectedItem.itemPrice));
        var itemID = itemDS.item.id;
        // 播放 确认音效
        GameAudio.playSE(ClientWorld.data.sureSE);
        // 增加对应货币
        ProjectPlayer.increaseGold(itemPrice * sellNum);
        // 减少对应道具
        ProjectPlayer.changeItemNumber(itemID, -sellNum);
        // 刷新持有数量
        this.refreshItemInPackage(itemID, null);
        // 刷新待售列表
        this.refreshSellItemList();
        // 刷新列表显示
        this.refreshSellItemListView();
        // 隐藏购买区域
        this.buyBoxArea.visible = false;
        // 更新焦点状态：0-待售列表
        this.focusState = 0;
        UIList.focus = this.sellItemList;
    };
    //===============================================================================
    // 刷新
    //===============================================================================
    /**
     * 刷新商品列表显示效果
     */
    GUI_Shop.prototype.refreshGoodsListView = function () {
        for (var i = 0; i < this.goodsList.length; i++) {
            // 获取对应商品的界面
            var goodsUI = this.goodsList.getItemUI(i);
            // 获取对应商品的数据
            var goods = this.goodsList.items[i];
            // 根据价格判断是否不可购买更改显示效果（这里默认就是半透明啦~）
            if (Number(goods.itemPrice) > Game.player.data.gold || goods.itemNum == "0") {
                goodsUI.alpha = 0.5;
            }
            else {
                goodsUI.alpha = 1;
            }
        }
    };
    /**
     * 刷新待售列表显示效果
     */
    GUI_Shop.prototype.refreshSellItemListView = function () {
        for (var i = 0; i < this.sellItemList.length; i++) {
            // 获取对应商品的界面
            var sellItemUI = this.sellItemList.getItemUI(i);
            // 获取对应商品的数据
            var sellItem = this.sellItemList.items[i];
            // 根据价格判断是否不可购买更改显示效果（这里默认就是半透明啦~）
            if (Number(sellItem.itemNum) <= 0) {
                sellItemUI.alpha = 0.5;
            }
            else {
                sellItemUI.alpha = 1;
            }
        }
    };
    /**
     * 刷新道具详情
     */
    GUI_Shop.prototype.refreshItemInfo = function (list) {
        if (list === void 0) { list = this.goodsList; }
        // 获取选中的项数据
        var selectedItem = list.selectedItem;
        // 未选中任何道具的情况
        if (!selectedItem || !selectedItem.data) {
            this.clearItemInfo();
        }
        // 已选中道具的情况：显示该道具详情
        else {
            var item = void 0;
            if (this.typeTab.selectedIndex == 0) {
                var itemDS = selectedItem.data;
                item = GameData.getModuleData(1, itemDS.item);
            }
            else {
                var inPackageItemDS = selectedItem.data;
                item = (inPackageItemDS.item);
            }
            if (!item) {
                this.clearItemInfo();
                return;
            }
            this.itemIntro.text = item.intro;
            this.itemName.text = item.name;
            // 刷新持有数量
            this.refreshItemInPackage(item.id, selectedItem);
        }
        // 重置购买数量
        this.buyNum.text = "1";
        // 刷新文本容器
        this.itemIntro.height = this.itemIntro.textHeight;
        this.itemIntroRoot.refresh();
    };
    GUI_Shop.prototype.clearItemInfo = function () {
        this.itemName.text = "";
        this.itemIntro.text = "";
    };
    /**
     * 刷新持有数量
     */
    GUI_Shop.prototype.refreshItemInPackage = function (itemID, selectedItem) {
        var itemInPackage = ProjectPlayer.getItemDS(itemID);
        // 没有选中项数据时动态查找，查找不到则无需刷新
        if (!selectedItem) {
            selectedItem = ArrayUtils.matchAttributesD2(this.goodsList.items, "data", { item: itemID }, true)[0];
            if (!selectedItem)
                return;
        }
        var index = this.goodsList.items.indexOf(selectedItem);
        selectedItem.ownNum = itemInPackage ? itemInPackage.number.toString() : "0";
        this.goodsList.replaceItem(selectedItem, index);
    };
    /**
     * 刷新购买数量
     */
    GUI_Shop.prototype.refreshBuyNum = function (selectedItem, buyNum) {
        if (!buyNum)
            buyNum = Number(this.buyNum.text);
        if (selectedItem && selectedItem.data) {
            // 修正最大购买数量，不超过商品剩余数量
            if (selectedItem.itemNum != this.shopEventData.nameWhenInfinite && buyNum > Number(selectedItem.itemNum)) {
                buyNum = Number(selectedItem.itemNum);
            }
            // 修正最大购买数量，不超过持有金额
            if (Number(selectedItem.itemPrice) > 0 && buyNum * Number(selectedItem.itemPrice) > Game.player.data.gold) {
                buyNum = Game.player.data.gold / Number(selectedItem.itemPrice);
            }
            // 刷新文本
            this.buyNum.text = Math.floor(buyNum).toString();
        }
    };
    /**
     * 刷新出售数量
     */
    GUI_Shop.prototype.refreshSellNum = function (selectedItem, buyNum) {
        if (!buyNum)
            buyNum = Number(this.buyNum.text);
        if (selectedItem && selectedItem.data) {
            // 修正最大出售数量，不超过持有数量
            if (buyNum > Number(selectedItem.itemNum)) {
                buyNum = Number(selectedItem.itemNum);
            }
            // 刷新文本
            this.buyNum.text = Math.floor(buyNum).toString();
        }
    };
    /**
     * 刷新待售列表
     */
    GUI_Shop.prototype.refreshSellItemList = function () {
        var items = [];
        // 遍历玩家自定义数据-背包
        for (var i = 0; i < Game.player.data.package.length; i++) {
            // 创建对应的背包物品项数据，该项数据由系统自动生成
            var d = new ListItem_1003();
            // 获取背包的道具DS格式
            var itemDS = Game.player.data.package[i];
            // 不允许出售的情况：不列举
            if (!itemDS.item.sellEnabled)
                continue;
            var sell = itemDS.item.sell;
            // 跳过数据库中售价为0的物品
            if (sell == 0)
                continue;
            var sellPrice = Math.ceil(sell * this.shopEventData.discount);
            d.data = itemDS; // 模块编号
            // 绑定数据
            d.icon = itemDS.item.icon; // 图标
            d.itemName = itemDS.item.name; // 名称
            d.itemNum = itemDS.number.toString(); // 数目
            d.itemPrice = sellPrice.toString(); // 价格
            d.ownNum = "";
            items.push(d);
        }
        // 赋值
        this.sellItemList.items = items;
    };
    return GUI_Shop;
}(GUI_11));
/**
 * 虚拟键盘
 * Created by 黑暗之神KDS on 2022-03-11 20:28:26.
 */
var GUI_VirtualKeyboard = /** @class */ (function (_super) {
    __extends(GUI_VirtualKeyboard, _super);
    function GUI_VirtualKeyboard() {
        var _this_1 = _super.call(this) || this;
        /**
         * 摇杆中心点
         */
        _this_1.rockerCenterPoint = new Point;
        /**
         * 记录上次的方向键值
         */
        _this_1.lastMenuDir = 0;
        GUI_VirtualKeyboard.self = _this_1;
        _this_1.init();
        return _this_1;
    }
    /**
     * 初始化
     */
    GUI_VirtualKeyboard.prototype.init = function () {
        var _this_1 = this;
        if (!this.rocker || !this.rockerBg)
            return;
        // 初始化参数
        this.rockerCenterPoint = new Point(Math.floor(this.rockerBg.width / 2), Math.floor(this.rockerBg.height / 2));
        this.rockerR = this.rockerBg.width / 2;
        this.stopDragRocker(null);
        // 初始化事件
        this.rocker.on(EventObject.MOUSE_DOWN, this, this.startDragRocker);
        this.rockerBg.on(EventObject.MOUSE_DOWN, this, this.startDragRocker);
        // 监听方向键改变
        this.on(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, this, this.onVirtualKeyboardMenuDirChange);
        // 保持该界面最前方显示
        EventUtils.addEventListenerFunction(GameUI, GameUI.EVENT_OPEN_SYSTEM_UI, function (uiID) {
            if (uiID != 12) {
                if (_this_1.stage)
                    GameUI.show(12);
            }
        }, this);
        EventUtils.addEventListenerFunction(GameDialog, GameDialog.EVENT_DIALOG_START, function (isOption, content, options, name, head, expression, audioURL, speed) {
            if (_this_1.stage)
                GameUI.show(12);
        }, this);
    };
    /**
     * 开始拖拽摇杆
     * @param e
     */
    GUI_VirtualKeyboard.prototype.startDragRocker = function (e) {
        this.stopDragRocker(null);
        this.touchId = e.touchId;
        stage.on(EventObject.MOUSE_UP, this, this.stopDragRocker);
        if (!this.isUseTouch)
            stage.on(EventObject.MOUSE_MOVE, this, this.updateRocker);
        else
            this.startBeyondBoundariesHandle(e);
        this.updateRocker(e);
    };
    /**
     * 停止拖拽摇杆
     * @param e
     */
    GUI_VirtualKeyboard.prototype.stopDragRocker = function (e) {
        if (this.isDisposed)
            return;
        if (e && e.touchId != this.touchId)
            return;
        this.touchId = null;
        this.endBeyondBoundariesHandle();
        stage.off(EventObject.MOUSE_MOVE, this, this.updateRocker);
        stage.off(EventObject.MOUSE_UP, this, this.stopDragRocker);
        this.rocker.x = this.rockerCenterPoint.x;
        this.rocker.y = this.rockerCenterPoint.y;
        Controller.stopJoy();
        if (this.lastMenuDir != 0) {
            this.lastMenuDir = 0;
            this.event(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, [0]);
        }
    };
    /**
     * 更新摇杆
     */
    GUI_VirtualKeyboard.prototype.updateRocker = function (e) {
        if (this.isDisposed)
            return;
        if (e && e.touchId != this.touchId)
            return;
        // 限制在圆形范围内
        var localMouseX = this.lockRockerMouseX != null ? this.lockRockerMouseX : this.rockerBg.mouseX;
        var localMouseY = this.lockRockerMouseY != null ? this.lockRockerMouseY : this.rockerBg.mouseY;
        var dis = Point.distance2(this.rockerCenterPoint.x, this.rockerCenterPoint.y, localMouseX, localMouseY);
        var per = this.rockerR / dis;
        if (per > 1)
            per = 1;
        var currentP = Point.interpolate2(localMouseX, localMouseY, this.rockerCenterPoint.x, this.rockerCenterPoint.y, per);
        this.rocker.x = currentP[0];
        this.rocker.y = currentP[1];
        // 距离过小则忽略
        if (dis < this.rockerR * 0.4)
            return;
        // 获取方位角度
        var angle = MathUtils.direction360(this.rockerCenterPoint.x, this.rockerCenterPoint.y, localMouseX, localMouseY);
        // 四方向移动：根据角度计算方向
        if (ClientWorld.data.moveDir4) {
            angle = GameUtils.getAngleByOri(GameUtils.getAssetOri(GameUtils.getOriByAngle(angle), 4));
        }
        // 四方向
        var menuDir;
        if (angle <= 45 || angle >= 315) {
            menuDir = 8;
        }
        else if (angle >= 45 && angle <= 135) {
            menuDir = 6;
        }
        else if (angle >= 135 && angle <= 225) {
            menuDir = 2;
        }
        else if (angle >= 225 && angle <= 315) {
            menuDir = 4;
        }
        if (this.lastMenuDir != menuDir) {
            this.lastMenuDir = menuDir;
            this.event(GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE, [menuDir]);
        }
        Controller.startJoy(angle);
    };
    GUI_VirtualKeyboard.prototype.onVirtualKeyboardMenuDirChange = function (dir) {
        // 在菜单中支持控制（List）
        if (Controller.inSceneEnabled)
            return;
        var m = {
            2: GUI_Setting.KEY_BOARD.DOWN.keys[0], 4: GUI_Setting.KEY_BOARD.LEFT.keys[0],
            6: GUI_Setting.KEY_BOARD.RIGHT.keys[0], 8: GUI_Setting.KEY_BOARD.UP.keys[0]
        };
        var transKeyCode = m[dir];
        if (transKeyCode)
            stage.event(EventObject.KEY_DOWN, [{ keyCode: transKeyCode }]);
    };
    //------------------------------------------------------------------------------------------------------
    // 用于修正摇杆超出游戏区域边界外后的处理：mouseup后仍然可以归位
    //------------------------------------------------------------------------------------------------------
    GUI_VirtualKeyboard.prototype.startBeyondBoundariesHandle = function (ev) {
        var e = ev.nativeEvent;
        this.startClientX = this.getClientX(e, this.touchId);
        this.startClientY = this.getClientY(e, this.touchId);
        this.startRockerBgMouseX = this.rockerBg.mouseX;
        this.startRockerBgMouseY = this.rockerBg.mouseY;
        this.endBeyondBoundariesHandle();
        document.addEventListener(this.mouseMoveType, this.doCheckBeyondBoundaries);
    };
    GUI_VirtualKeyboard.prototype.endBeyondBoundariesHandle = function () {
        this.startWindowMouseUpToStopDragRokered = false;
        document.removeEventListener(this.mouseUpType, this.doWindowMouseUpToStopDragRoker);
        document.removeEventListener(this.mouseMoveType, this.doCheckBeyondBoundaries);
    };
    GUI_VirtualKeyboard.prototype.doCheckBeyondBoundaries = function (e) {
        var _a, _b;
        var _this = GUI_VirtualKeyboard.self;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (touch.identifier == _this.touchId) {
                var winW = window.innerWidth;
                var winH = window.innerHeight;
                var per = GameUtils.getAutoFitSizePre(new Rectangle(0, 0, stage.width, stage.height), new Rectangle(0, 0, winW, winH));
                var stageW = per * stage.width;
                var stageH = per * stage.height;
                var clientX = Browser.onPC ? e.clientX : (_a = e.changedTouches[_this.touchId]) === null || _a === void 0 ? void 0 : _a.clientX;
                var clientY = Browser.onPC ? e.clientY : (_b = e.changedTouches[_this.touchId]) === null || _b === void 0 ? void 0 : _b.clientY;
                var gameClientX = _this.getClientX(e, _this.touchId);
                var gameClientY = _this.getClientY(e, _this.touchId);
                _this.lockRockerMouseX = _this.startRockerBgMouseX + (gameClientX - _this.startClientX);
                _this.lockRockerMouseY = _this.startRockerBgMouseY + (gameClientY - _this.startClientY);
                _this.updateRocker({ touchId: _this.touchId });
                if (winW > stageW) {
                    var eW = (winW - stageW) / 2;
                    if (clientX <= eW || clientX >= eW + stageW) {
                        _this.startWindowMouseUpToStopDragRoker();
                    }
                }
                if (winH > stageH) {
                    var eH = (winH - stageH) / 2;
                    if (clientY <= eH || clientY >= eH + stageH) {
                        _this.startWindowMouseUpToStopDragRoker();
                    }
                }
            }
        }
    };
    GUI_VirtualKeyboard.prototype.startWindowMouseUpToStopDragRoker = function () {
        var _this = GUI_VirtualKeyboard.self;
        if (_this.startWindowMouseUpToStopDragRokered) {
            return;
        }
        _this.startWindowMouseUpToStopDragRokered = true;
        document.addEventListener(this.mouseUpType, _this.doWindowMouseUpToStopDragRoker);
    };
    GUI_VirtualKeyboard.prototype.doWindowMouseUpToStopDragRoker = function (e) {
        var _this = GUI_VirtualKeyboard.self;
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            if (touch.identifier == _this.touchId) {
                _this.stopDragRocker(null);
                _this.endBeyondBoundariesHandle();
                _this.startWindowMouseUpToStopDragRokered = false;
                document.removeEventListener(this.mouseUpType, _this.doWindowMouseUpToStopDragRoker);
                _this.lockRockerMouseX = null;
                _this.lockRockerMouseY = null;
            }
        }
    };
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "mouseMoveType", {
        //------------------------------------------------------------------------------------------------------
        // 
        //------------------------------------------------------------------------------------------------------
        get: function () {
            return Browser.onPC ? "mousemove" : "touchmove";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "mouseUpType", {
        get: function () {
            return Browser.onPC ? "mouseup" : "touchend";
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 获取ClientX
     */
    GUI_VirtualKeyboard.prototype.getClientX = function (nativeE, touchId) {
        var _a, _b;
        var isOri = (!this.isNativeAPP && stage.screenMode == "horizontal" && stage.width > stage.height);
        var oClientX;
        if (isOri) {
            oClientX = Browser.onPC ? nativeE.clientY : (_a = this.getChangedTouches(nativeE, touchId)) === null || _a === void 0 ? void 0 : _a.clientY;
        }
        else {
            oClientX = Browser.onPC ? nativeE.clientX : (_b = this.getChangedTouches(nativeE, touchId)) === null || _b === void 0 ? void 0 : _b.clientX;
        }
        oClientX = oClientX * Browser.pixelRatio / stage.clientScaleX;
        return oClientX;
    };
    /**
     * 获取touchObject根据touchID
     * @param touchId
     */
    GUI_VirtualKeyboard.prototype.getClientY = function (nativeE, touchId) {
        var _a, _b;
        var isOri = (!this.isNativeAPP && stage.screenMode == "horizontal" && stage.width > stage.height);
        var oClientY;
        if (isOri) {
            oClientY = Browser.onPC ? nativeE.clientX : (_a = this.getChangedTouches(nativeE, touchId)) === null || _a === void 0 ? void 0 : _a.clientX;
            oClientY = stage.height / stage.clientScaleY - oClientY;
        }
        else {
            oClientY = Browser.onPC ? nativeE.clientY : (_b = this.getChangedTouches(nativeE, touchId)) === null || _b === void 0 ? void 0 : _b.clientY;
        }
        oClientY = oClientY * Browser.pixelRatio / stage.clientScaleY;
        return oClientY;
    };
    /**
     * 获取touchObject根据touchID
     * @param touchId
     */
    GUI_VirtualKeyboard.prototype.getChangedTouches = function (nativeE, touchId) {
        for (var i = 0; i < nativeE.changedTouches.length; i++) {
            var touch = nativeE.changedTouches[i];
            if (touch.identifier == touchId) {
                return touch;
            }
        }
        return null;
    };
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "isUseTouch", {
        /**
         * 是否使用触碰实现
         */
        get: function () {
            return !Browser.onPC && typeof document != "undefined";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_VirtualKeyboard.prototype, "isNativeAPP", {
        get: function () {
            return [0, 2, 3].indexOf(os.platform) == -1;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 事件：摇杆四方向 onVirtualKeyboardDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    GUI_VirtualKeyboard.VIRTUALKEYBOARD_DIR4_CHANGE = "VIRTUALKEYBOARD_DIR4_CHANGE";
    return GUI_VirtualKeyboard;
}(GUI_12));
//# sourceMappingURL=Game.js.map