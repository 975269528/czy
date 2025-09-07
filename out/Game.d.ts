/**
 * 自定义事件命令
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
declare module CommandExecute {
    /**
     * 预加载
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值（如有）
     * @param p 自定义命令参数
     */
    function customCommand_1(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1): void;
    /**
     * 等待玩家输入文本
     */
    function customCommand_2(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2): void;
    function customCommand_3(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_3): void;
    function customCommand_4(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4): void;
    /**
     * 设置界面属性
     */
    function customCommand_5(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_5): void;
    function customCommand_6(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_6): void;
    /**
     * 关闭界面焦点
     */
    function customCommand_7(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_7): void;
    /**
     * 取消按键事件
     */
    function customCommand_8(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_8): void;
    /**
     * 取消鼠标事件
     */
    function customCommand_9(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_9): void;
    /**
     * 模拟按键
     */
    function customCommand_10(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_10): void;
    /**
     * 提交信息
     */
    function customCommand_11(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_11): void;
    /**
     * 选中列表焦点
     */
    function customCommand_12(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_12): void;
    let countDownNowTime: number;
    function customCommand_13(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_13): void;
    /**
     * 设置数据层
     */
    function customCommand_1001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1001): void;
    /**
     * 绘制图块
     */
    function customCommand_1002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1002): void;
    /**
     * 绘制自动元件
     */
    function customCommand_1003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1003): void;
    /**
     * 清除图块
     */
    function customCommand_1004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1004): void;
    /**
     * 设置图层属性
     */
    function customCommand_1005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1005): void;
    /**
     * 显示动画
     */
    function customCommand_1006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1006): void;
    /**
     * 镜头缩放
     */
    function customCommand_1007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1007): void;
    /**
     * 镜头旋转
     */
    function customCommand_1008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1008): void;
    /**
     * 金币
     */
    function customCommand_2001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2001): void;
    /**
     * 道具
     */
    function customCommand_2002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2002): void;
    /**
     * 克隆对象
     */
    function customCommand_2003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2003): void;
    /**
     * 销毁克隆的对象
     */
    function customCommand_2004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2004): void;
    /**
     * 暂时隐藏对象，从场景上移除但记录列表中仍然存在，可以通过index获取到该对象
     */
    function customCommand_2005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2005): void;
    /**
     * 停止移动
     */
    function customCommand_2006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2006): void;
    /**
     * 记录移动路径
     */
    function customCommand_2007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2007): void;
    /**
     * 恢复移动路径
     */
    function customCommand_2008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2008): void;
    /**
     * 修改场景对象的自定义属性
     */
    function customCommand_2009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2009): void;
    /**
     * 修改场景对象的行走图的部件
     */
    function customCommand_2011(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2011): void;
    /**
     * 商店
     */
    function customCommand_2012(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2012): void;
    /**
     * 清除对象行为
     */
    function customCommand_2013(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2013): void;
    /**
     * 允许玩家控制
     */
    function customCommand_4001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4001): void;
    /**
     * 禁止玩家控制
     */
    function customCommand_4002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4002): void;
    /**
     * 允许使用菜单
     */
    function customCommand_4003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4003): void;
    /**
     * 禁止使用菜单
     */
    function customCommand_4004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4004): void;
    function customCommand_4005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4005): void;
    /**
     * 存档
     */
    function customCommand_4006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4006): void;
    /**
     *  音量
     */
    function customCommand_4007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4007): void;
    /**
     *  返回标题
     */
    function customCommand_4008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4008): void;
    /**
     *  暂停游戏
     */
    function customCommand_4009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4009): void;
    /**
     *  恢复游戏
     */
    function customCommand_4010(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4010): void;
    /**
     *  关闭窗口
     */
    function customCommand_4011(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4011): void;
    /**
     *  对话框音效设置
     */
    function customCommand_4012(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4012): void;
    /**
     *  设置世界属性
     */
    function customCommand_4013(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4013): void;
    /**
     *  设置玩家属性
     */
    function customCommand_4014(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_4014): void;
    /**
     * 增减场景对象模块
     */
    function customCommand_8001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_8001): void;
    /**
     * 设置场景对象模块的属性
     */
    function customCommand_8002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_8002): void;
}
/**
 * 自定义事件命令
 * -- 图像/动画/立绘/界面/视频/音频相关的指令
 * -- 对于图像显示以及移动过程追加了存档读档支持
 * Created by 黑暗之神KDS on 2018-12-18 17:17:50.
 */
declare module CommandExecute {
    /**
     * 显示图片
     */
    export function customCommand_3001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3001): void;
    /**
     * 移动图像
     */
    export function customCommand_3002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3002): void;
    /**
     * 移动图像层相机
     */
    export function customCommand_3003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3003): void;
    /**
     * 显示动画
     */
    export function customCommand_3004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3004): void;
    /**
     * 移动动画
     */
    export function customCommand_3005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3005): void;
    /**
     * 显示立绘
     */
    export function customCommand_3006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3006): void;
    /**
     * 移动立绘
     */
    export function customCommand_3007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3007): void;
    /**
     * 清理图像
     */
    export function customCommand_3008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3008): void;
    /**
     * 自动旋转
     */
    export function customCommand_3009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3009): void;
    /**
     * 显示界面
     */
    export function customCommand_3010(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3010): void;
    /**
     * 移动界面
     */
    export function customCommand_3011(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3011): void;
    /**
     * 关闭界面
     */
    export function customCommand_3012(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3012): void;
    /**
     * 移动界面元件
     */
    export function customCommand_3013(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3013): void;
    /**
     * 添加材质
     */
    export function customCommand_3014(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3014): void;
    /**
     * 更改材质：同添加材质
     */
    export function customCommand_3015(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3015): void;
    /**
     * 删除材质
     */
    export function customCommand_3016(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3016): void;
    export function customCommand_3018(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3018): void;
    /**
     * 移动视频
     */
    export function customCommand_3019(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3019): void;
    /**
     * 等待指定视频播放完成
     */
    export function customCommand_3021(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3021): void;
    /**
     * 等待指定界面关闭
     */
    export function customCommand_3020(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_3020): void;
    /**
     * 播放背景音乐
     */
    export function customCommand_5001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5001): void;
    /**
     * 停止背景音乐
     */
    export function customCommand_5002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5002): void;
    /**
     * 播放环境声效
     */
    export function customCommand_5003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5003): void;
    /**
     * 停止环境声效
     */
    export function customCommand_5004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5004): void;
    /**
     * 播放音效
     */
    export function customCommand_5005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5005): void;
    /**
     * 停止全部音效
     */
    export function customCommand_5006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5006): void;
    /**
     * 播放语音
     */
    export function customCommand_5007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5007): void;
    /**
     * 停止全部语音
     */
    export function customCommand_5008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_5008): void;
    /**
     * 移动图片时的逐帧执行的函数
     */
    export function gcImageMoveFrameUpdate(a: UIBitmap, m: ImageMoveParams, passageID: number, sign: string): void;
    /**
     * 移动相机时的逐帧执行的函数
     */
    export function gcCameraMoveFrameUpdate(a: any, m: ImageLayerCameraMoveParams, passageID: number, sign: string): void;
    /**
     * 移动动画时的逐帧执行的函数
     */
    export function gcAnimationMoveFrameUpdate(a: UIAnimation, m: AnimationMoveParams, passageID: number, sign: string, changeFrame: boolean): void;
    /**
     * 移动立绘时的逐帧执行的函数
     */
    export function gcStandAvatarMoveFrameUpdate(a: UIStandAvatar, m: StandAvatarMoveParams, passageID: number, sign: string): void;
    /**
     * 自动旋转的逐帧执行的函数
     */
    export function gcGameSpriteRotationMoveFrameUpdate(a: GameSprite, rotation: number, passageID: number, sign: string): void;
    /**
     * 移动界面的逐帧执行的函数
     */
    export function gcUIMoveFrameUpdate(a: GUI_BASE, m: ScaleSpriteMoveParams, passageID: number, sign: string): void;
    /**
     * 移动界面元件的逐帧执行的函数
     */
    export function gcUICompMoveFrameUpdate(a: GUI_BASE, m: UICompMoveParams, passageID: number, sign: string, nonTweenType: number): void;
    class ImageMoveParams {
        time: number;
        curTime: number;
        x: number;
        y: number;
        z: number;
        width: number;
        height: number;
        rotation: number;
        opacity: number;
        x2: number;
        y2: number;
        z2: number;
        width2: number;
        height2: number;
        rotation2: number;
        opacity2: number;
        pivotType2: number;
        blendMode2: number;
        flip2: boolean;
        transData: TransData;
        volume?: number;
        currentTime?: number;
        volume2?: number;
        currentTime2?: number;
    }
    class ImageLayerCameraMoveParams {
        time: number;
        curTime: number;
        x: number;
        y: number;
        z: number;
        rotation: number;
        x2: number;
        y2: number;
        z2: number;
        rotation2: number;
        transData: TransData;
    }
    class ScaleSpriteMoveParams {
        time: number;
        curTime: number;
        x: number;
        y: number;
        z: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        opacity: number;
        x2: number;
        y2: number;
        z2: number;
        scaleX2: number;
        scaleY2: number;
        rotation2: number;
        opacity2: number;
        transData: TransData;
    }
    class AnimationMoveParams extends ScaleSpriteMoveParams {
        aniFrame: number;
        aniFrame2: number;
    }
    class StandAvatarMoveParams extends ScaleSpriteMoveParams {
        actionID: number;
        avatarFrame: number;
        avatarFrame2: number;
        changeExpression: boolean;
        changeFrame: boolean;
    }
    class UICompMoveParams {
        time: any;
        curTime: number;
        transData: TransData;
        attrInfos: {
            uiComp: UIBase;
            uiCompID: number;
            attName: string;
            oldValue: any;
            needTween: boolean;
            newValue: any;
        }[];
    }
    type UIBase = any;
    export function refreshCompMaterials(attValue: any, uiComp: UIBase): void;
    export {};
}
/**
 * 自定义条件分歧
 * Created by 黑暗之神KDS on 2020-09-16 19:47:24.
 */
declare module CustomCondition {
    /**
     * 场景对象
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean]
     */
    function f1(trigger: CommandTrigger, p: CustomConditionParams_1): boolean;
    /**
     * 界面
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean]
     */
    function f2(trigger: CommandTrigger, p: CustomConditionParams_2): boolean;
    /**
     * 系统信息
     */
    function f3(trigger: CommandTrigger, p: CustomConditionParams_3): boolean;
    /**
     * 自定义模块 - 布尔值属性
     */
    function f4(trigger: CommandTrigger, p: CustomConditionParams_4): boolean;
    /**
     * 世界属性 - 布尔值属性
     */
    function f5(trigger: CommandTrigger, p: CustomConditionParams_5): boolean;
    /**
     * 玩家属性 - 布尔值属性
     */
    function f6(trigger: CommandTrigger, p: CustomConditionParams_6): boolean;
}
/**
 * 自定义游戏数值
 * Created by 黑暗之神KDS on 2020-09-16 19:47:24.
 */
declare module CustomGameNumber {
    /**
     * 场景数值获取
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f1(trigger: CommandTrigger, p: CustomGameNumberParams_1): number;
    /**
     * 场景对象数值
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f2(trigger: CommandTrigger, p: CustomGameNumberParams_2): number;
    /**
     * 场景对象关系
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f3(trigger: CommandTrigger, p: CustomGameNumberParams_3): number;
    /**
     * 玩家
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f4(trigger: CommandTrigger, p: CustomGameNumberParams_4): number;
    /**
     * 界面
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f5(trigger: CommandTrigger, p: CustomGameNumberParams_5): number;
    /**
     * 鼠标
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f6(trigger: CommandTrigger, p: CustomGameNumberParams_6): number;
    /**
     * 模块 - 数值属性
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f7(trigger: CommandTrigger, p: CustomGameNumberParams_7): number;
    /**
     * 世界 - 数值属性
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f8(trigger: CommandTrigger, p: CustomGameNumberParams_8): number;
    /**
     * 其他
     */
    function f9(trigger: CommandTrigger, p: CustomGameNumberParams_9): number;
}
/**
 * Created by 黑暗之神KDS on 2021-03-11 10:24:08.
 */
declare module CustomGameString {
    /**
     * 场景
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f1(trigger: CommandTrigger, p: CustomGameStringParams_1): string;
    /**
     * 场景对象
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f2(trigger: CommandTrigger, p: CustomGameStringParams_2): string;
    /**
     * 玩家
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f3(trigger: CommandTrigger, p: CustomGameStringParams_3): string;
    /**
     * 界面
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f4(trigger: CommandTrigger, p: CustomGameStringParams_4): string;
    /**
     * 模块 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f5(trigger: CommandTrigger, p: CustomGameStringParams_5): string;
    /**
     * 世界 - 字符串
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数
     */
    function f6(trigger: CommandTrigger, p: CustomGameStringParams_6): string;
    /**
     * 系统
     */
    function f7(trigger: CommandTrigger, p: CustomGameStringParams_7): string;
}
/**
 * 游戏总控制器
 * -- 管理其他控制器
 * -- 场景对象的操作
 * -- 场景对象相关事件触发
 * -- 进入场景事件完毕后才会开启控制器
 *
 * Created by 黑暗之神KDS on 2018-10-07 16:18:25.
 */
declare class Controller {
    /** 控制器开启事件 */
    static EVENT_CONTROLLER_START: string;
    /** 控制器关闭事件 */
    static EVENT_CONTROLLER_STOP: string;
    /** 点击事件的命令 true=开始 false=结束 */
    static EVENT_SCENE_OBJECT_CLICK_COMMAND: string;
    /** 碰触事件的命令 true=开始 false=结束 */
    static EVENT_SCENE_OBJECT_TOUCH_COMMAND: string;
    /** 控制器启动状态 */
    static ctrlStart: boolean;
    /** 控制可用状态：点击事件执行中 */
    private static ENABLED_COMMAND_SCENE_OBJECT_CLICK_EXECUTE;
    /** 控制可用状态：碰触事件执行中 */
    private static ENABLED_COMMAND_SCENE_OBJECT_TOUCH_EXECUTE;
    /** 控制可用状态是否可控，需要条件全满足才可控制 */
    private static enabledMapping;
    /** 等待碰触事件开始的状态 */
    private static waitTouchEventStart;
    /** 需要等待的碰触事件执行中计数 */
    private static needWaitTouchExcuteCount;
    /**
     * 当前方向键输入状态：0-无 1-键盘输入 2-手柄输入 3-虚拟按键 4-其他
     */
    static inputState: number;
    /**
     * 启动控制器
     */
    static start(): void;
    /**
     * 停止控制
     */
    static stop(): void;
    /**
     * 在场景中是否可控制
     */
    static get inSceneEnabled(): boolean;
    /**
     * 是否玩家触发事件中（点击事件、碰触事件）
     */
    static get isPlayerTriggerEvent(): boolean;
    private static lastJoyAngle;
    /**
     * 摇杆移动
     * @param dirAngle 角度
     * @param recordAngle [可选] 默认值=true 记录角度，以便拒绝小规模角度偏移导致不断触发移动
     * @param tryTimes [可选] 默认值=-1 尝试次数（当遇到障碍的时候系统会自动尝试更换角度来移动，比如碰到NPC、撞墙等，以便平滑）
     * @param oriAngle [可选] 默认值=null 原始发出的角度
     */
    static startJoy(dirAngle: number, recordAngle?: boolean, tryTimes?: number, oriAngle?: number): void;
    /**
     * 停止摇杆
     */
    static stopJoy(): void;
    /**
     * 开始触发场景对象的点击事件
     * @param target 目标对象
     * @param playerFaceToTarget [可选] 默认值=false 是否执行事件时玩家面向对象
     */
    static startSceneObjectClickEvent(target: ProjectClientSceneObject, playerFaceToTarget?: boolean): void;
    /**
     * 移动至目标场景对象附近后出发点击事件
     * @param targetSceneObject 目标场景对象
     */
    static moveToNearTargetSceneObjectAndTriggerClickEvent(targetSceneObject: ProjectClientSceneObject): void;
    /**
     * 清理移动至目标场景对象附近后出发点击事件的命令
     * @param fromAutoRetry [可选] 默认值=false 来自自动重试
     */
    static clearNearTargetSceneObjectAndTriggerClickEvent(fromAutoRetry?: boolean): void;
    /**
     * 开始触发碰触事件
     * @param trigger 碰触者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 执行事件完成后回调
     * @return [boolean] 是否成功
     */
    static startSceneObjectTouchEvent(trigger: ProjectClientSceneObject, executor: ProjectClientSceneObject, onCommandExecuteOver?: Callback): boolean;
    /**
     * 开始离开碰触的事件：当已碰触该对象的对象不再碰触该对象时触发
     * @param trigger 触发者
     * @param executor 执行者
     * @param onCommandExecuteOver [可选] 默认值=null 当执行完成时回调
     * @return [boolean] 是否执行成功
     */
    static startSceneObjectTouchOutEvent(trigger: ProjectClientSceneObject, executor: ProjectClientSceneObject, onCommandExecuteOver?: Callback): boolean;
    /**
     * 开始事件
     */
    private static startEvent;
    /**
     * 清理事件
     */
    private static clearEvent;
    /**
     * 当命令开始时
     * @param enabledID 命令编号
     * @param isStart 是否开始
     */
    private static onCommandStart;
    /**
     * 当摇杆操作时发生了碰撞
     * @param dirAngle 当前角度
     * @param tryTimes 尝试的次数
     * @param oriAngle 最初操作的原始角度
     */
    private static onJoyCollision;
    /**
     * 获取碰撞后自动尝试的角度
     * -- 当fromAngle角度接近四方向的角度则返回四方向
     * @param fromAngle 参考角度
     * @param tryTimes 尝试的次数 2、1
     * @return [number]
     */
    private static getCollisionAutoTryAngle;
}
/**
 * 游戏手柄控制器
 * Created by 黑暗之神KDS on 2020-03-26 03:50:18.
 */
declare class GamepadControl {
    /**
     * 辅助计算
     */
    private static lastJoyAngle8;
    static init(): void;
    /**
     * 启动
     */
    static start(): void;
    /**
     * 停止
     */
    static stop(): void;
    /**
     * 左方向键按键移动
     * @param dir 方向
     */
    private static onLeftKeyChange;
    /**
     * 更新：处理左摇杆-角色移动
     */
    private static update;
    /**
     * 当使用手柄控制菜单方向
     * @param isJoy
     * @param dir
     */
    private static onGamepadMenuDirChange;
    /**
     * 手柄按键-映射成键盘按键功能
     * -- 菜单按键映射菜单按键（头部标识为MENU）
     * -- 非菜单按键映射成非菜单按键
     * @param keyCode
     */
    private static onGamepadKeyDown;
}
/**
 * 按键控制器
 * -- 移动
 * -- 调查/对话
 * -- 其他
 *
 * Created by 黑暗之神KDS on 2018-10-08 19:21:25.
 */
declare class KeyboardControl {
    /**
     * 方向
     */
    private static dir;
    /**
     * 最近的按键
     */
    private static lastKeyDown;
    /**
     * 是否更改了方向
     */
    private static isChangeDir;
    /**
     * 方向按键储存：DOWN/UP/LEFT/RIGHT
     */
    private static dirKeyDown;
    /**
     * 方向偏移
     */
    static dirOffsetArr: number[][];
    /**
     * 辅助计算
     */
    private static clickNpc3Mode;
    private static lastDx;
    private static lastDy;
    private static lastJoyAngle;
    private static onKeyUpdateCB;
    /**
     * 是否已启动
     */
    /**
     * 初始化
     */
    static init(): void;
    /**
     * 启动
     */
    static start(): void;
    /**
     * 停止
     */
    static stop(): void;
    /**
     * 设置按键方向根据指定的方向
     * @param dir 方向
     */
    static setDirKeyDown(dir: number): void;
    /**
     * 当键盘按下时
     * @param e
     */
    private static onKeyDown;
    /**
     * 当按键弹起时
     * @param e
     */
    private static onKeyUp;
    /**
     * 尝试触发场景对象点击事件
     * -- 第一判断：然后按照本这个格子触发
     * -- 第二判断：优先按照方向前一格
     */
    private static tryTriggerSceneObjectClickEvent;
    /**
     * 刷新：方向键移动人物
     * -- 当面向0时不响应
     * -- 当没有改变按键方向的话，检测未到达目的地就不再请求移动
     */
    private static update;
    /**
     * 开启按键后持续移动用的清除
     */
    private static clearKeyDown;
    /**
     * 确定按键按下状态
     * @param keyCode 按键值
     * @param isDown 是否按下
     * @return [boolean]
     */
    private static dirKeyDownTrue;
    /**
     * 根据按键按下状态刷新方向
     */
    private static updateDir;
    /**
     * 获取左方向键是否按下
     * @return [boolean]
     */
    private static get leftDown();
    /**
     * 获取右方向键是否按下
     */
    private static get rightDown();
    /**
     * 获取下方向键是否按下
     */
    private static get downDown();
    /**
     * 获取上方向键是否按下
     */
    private static get upDown();
    /**
     * 移动至指定的格子中心点
     * @param xGrid 格子坐标点x
     * @param yGrid 格子坐标点y
     */
    static moveDirectGrid(xGrid: number, yGrid: number): void;
    /**
     * 移动至指定坐标
     * @param x 像素点x
     * @param y 像素点y
     * @param trySingleDir 尝试单方向移动，斜方向可能走不通的情况，变为只移动x或只移动y来尝试滑动
     */
    static moveDirect(x: number, y: number, trySingleDir?: boolean): boolean;
    /**
     * 取消移动结束后触发点击事件（空白事件）
     */
    private static offMoveOverTriggerClickEvent;
}
/**
 * 鼠标控制器
 * Created by 黑暗之神KDS on 2020-03-26 06:05:08.
 */
declare class MouseControl {
    /**
     * 鼠标事件集
     */
    static mouseEvents: string[];
    /**
     * 事件派发器
     */
    static eventDispatcher: EventDispatcher;
    /**
     * 选中的场景对象
     */
    static selectSceneObject: ProjectClientSceneObject;
    /**
     * 选中场景对象时的动画效果
     */
    private static selectEffect;
    /**
     * 启动控制器
     */
    static start(): void;
    /**
     * 关闭控制器
     */
    static stop(): void;
    /**
     * 更新选中场景对象的效果
     * @param e
     */
    static updateSelectSceneObject(): void;
    /**
     * 取消选中场景对象
     */
    static unselectOneSceneObject(soc: ProjectClientSceneObject): void;
    /**
     * 选中场景对象
     * @param soc 场景对象
     */
    static selectOneSceneObject(soc: ProjectClientSceneObject): void;
    /**
     * 场景鼠标事件
     * @param e
     */
    private static onSceneLayerMouseEvent;
    /**
     * 鼠标左键点击场景的场合
     * @param e
     */
    private static onSceneMouseDown;
    /**
     * 鼠标在场景中移动的场合
     */
    private static onSceneMouseMove;
}
/**
 * 场景的工具类
 * 用于计算障碍、遮罩、桥属性、碰撞检测等
 *
 * Created by 黑暗之神KDS on 2020-01-24 02:55:52.
 */
declare class SceneUtils {
    /**
     * 禁止碰撞的信息（根据场景对象的碰撞组）
     */
    static banCollisionMapping: {
        [sign: string]: boolean;
    };
    /**
     * 格子上的场景对象：初始化时即设置了gridWidth x gridHeight的空数组
     */
    gridSceneObjects: ProjectClientSceneObject[][][];
    /**
     * 场景对象上次所在的格子坐标
     */
    protected lastUpdateObsBridgeGrid: Point[];
    /**
     * 边界的内边界矩形（边界默认为0-mapWidth 0-mapHeight，内边界则需要减去半个格子）
     */
    protected innerBoundaryRect: Rectangle;
    /**
     * 场景
     */
    scene: Scene;
    /**
     * 半格多一像素
     */
    protected halfGridPlus: number;
    /**
     * 获取附近可通行的格子点
     * @param gridP 障碍格子点
     * @param targetP [可选] 默认值=null 参考目标点，会优先选择与该目标点最近的点
     * @return [Point]
     */
    static getNearThroughGrid(gridP: Point, targetP?: Point): Point;
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
    static twoPointHasObstacle(x1: number, y1: number, x2: number, y2: number, scene: ProjectClientScene, except?: ProjectClientSceneObject, exceptToP?: boolean): boolean;
    /**
     * 构造函数
     */
    constructor(scene: Scene);
    /**
     * 是否障碍,实际坐标（含动态障碍）
     * @param p 实际坐标
     * @param except [可选] 默认值=null 忽略计算的对象（如玩家自身）
     * @return [boolean]
     */
    isObstacle(p: Point, except?: ProjectClientSceneObject): boolean;
    /**
     * 是否是障碍格子（含动态障碍）
     * @param gridP 格子坐标
     * @param except 排除者
     * @param checker 检查者
     * @return [boolean]
     */
    isObstacleGrid(gridP: Point, except?: ProjectClientSceneObject, checker?: ProjectClientSceneObject): boolean;
    /**
     * 是否存在地图固定障碍（地图或图块设置的障碍）
     * @param gridP 格子坐标
     * @param calcBridge 计算桥属性
     * @return [boolean]
     */
    isFixedObstacleGrid(gridP: Point, calcBridge?: boolean): boolean;
    /**
     * 是否存在地图固定桥属性
     * @param gridP 格子坐标
     * @return [boolean]
     */
    isFixedBridgeGrid(gridP: Point): boolean;
    /**
     * 是否存在遮罩，根据实际坐标
     * @param p
     * @return [boolean]
     */
    isMask(p: Point): boolean;
    /**
     * 是否存在遮罩，根据格子
     * @param gridP
     * @return [boolean]
     */
    isMaskGrid(gridP: Point): boolean;
    /**
     * 是否在场外
     * @param p 坐标
     * @param innerBoundary 计算内边界
     * @return [boolean]
     */
    isOutside(p: Point, innerBoundary?: boolean): boolean;
    /**
     * 是否在场外，根据格子
     * @param gridP 格子坐标
     * @return [boolean]
     */
    isOutsideByGrid(gridP: Point): boolean;
    /**
     * 将坐标限制在场景内
     * @param p 指定坐标
     */
    limitInside(p: Point, innerBoundary?: boolean): void;
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
    getGridDynamicObsStatus(gridP: Point, excepter?: ProjectClientSceneObject, gridSceneObjects?: ProjectClientSceneObject[], checker?: ProjectClientSceneObject): number;
    /**
     * 两个场景对象是否是禁止碰撞
     * @param so1 场景对象1
     * @param so2 场景对象2
     * @return [boolean]
     */
    isBothBanCollision(so1: ProjectClientSceneObject, so2: ProjectClientSceneObject): boolean;
    /**
     * 刷新动态障碍和桥，根据单位场景对象
     * @param soc 障碍对象
     * @param inScene 是否在场景上
     * @return isChange 是否真正更新过坐标
     */
    updateDynamicObsAndBridge(soc: SceneObject, inScene: boolean, posGrid?: Point): boolean;
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
    touchCheck(checker: ProjectClientSceneObject, useGridObstacle: boolean, posP: Point, posGridP: Point, trendP: Point, trendGridP: Point): {
        isObstacle: boolean;
        touchSceneObjects: ProjectClientSceneObject[];
        alreadyCalcPosRect: boolean;
    };
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
    static getAroundPositions(mode: number, so1: ProjectClientSceneObject, so2: ProjectClientSceneObject, positionSize?: number, calcWantToGo?: boolean, gridSize?: number, oneStep?: boolean): Point[];
    /**
     * 碰撞检测-格子版
     * @param checker
     * @param posP
     * @param posGridP [可选] 默认值=null
     * @param trendP  [可选] 默认值=null 趋势移动点
     * @param calcTrendP [可选] 默认值=true 计算趋势点接触碰撞信息
     */
    private collsionCheckGrid;
    /**
     * 碰撞检测-矩形包围盒版
     * 碰撞为了优化计算按照场景对象原点 + WorldData.sceneObjectCollisionSize-1 计算。
     * @param p
     * @param trendP
     * @param checker
     * @param isObstacle
     * @param touchSceneObjects
     */
    private collsionCheckRect;
}
/**
 * 自定义场景对象行为
 * 一个对象可能拥有多层行为，当前总是执行最后层的行为
 * 当行为播放完毕的时候根据循环决定是否重复播放或是清除行为
 * 当处于logicPause状态下时会不在继续执行后面的行为
 *
 * Created by 黑暗之神KDS on 2019-08-07 13:24:13.
 */
declare class ProjectSceneObjectBehaviors extends SceneObjectBehaviors {
    /**
     * 执行行为者（可能是执行事件者或触发事件者或者其他指定的对象）
     */
    so: ProjectClientSceneObject;
    /**
     * 触发事件者
     */
    targetSceneObject: ProjectClientSceneObject;
    /**
     * 执行事件者（派发行为者）
     */
    executor: ProjectClientSceneObject;
    /**
     * 需要恢复的移动行为
     */
    needRecoveryMoveInfo: any;
    /**
     * 执行事件页中
     */
    private executeCommandPageFragment;
    /**
     * [行为编辑器专用]-记录预设的影子
     */
    private soModule_shadow_default;
    /**
     * 等待动作结束
     */
    protected isWaitingActionOver: boolean;
    /**
     * 逻辑用的暂停标识，比如行为在运动结束前不在执行下一步动作（如配合Game.pause的效果）
     * 实现类可以根据具体的游戏规则重写该属性，以便能够正确的暂停下一步行为执行
     * 如RPG中处于移动中的对象只有等待执行完毕后再继续执行：
     */
    protected get logicPause(): boolean;
    /**
     * 重置：还原到最初始的状态
     * 仅在行为编辑器预览使用，项目层需要实现行为的重置，以便预览时能够正确显示效果
     */
    reset(defSceneObejct: SceneObject): void;
    /**
     * 构造函数
     * @param so 执行行为的场景对象
     * @param loop 是否循环
     * @param targetSceneObject 事件触发者
     * @param onOver 当行为执行完毕时回调 onOver(soBehavior:SceneObjectBehaviors)
     * @param startIndex [可选] 默认值=0 起始行为索引行
     * @param executor [可选] 默认值=null 事件执行者（也是行为派发者）
     */
    constructor(so: SceneObjectEntity, loop: boolean, targetSceneObject: SceneObject, onOver: Callback, startIndex?: number, executor?: SceneObjectEntity);
    /**
     * 设置行走图
     * 该行为系统内置，由项目层实现
     * @param avatarID 行走图ID
     * @param actID 动作
     * @param frame 帧数
     * @param ori  [可选] 默认值=null 表示面向
     */
    private behavior0;
    /** 向下移动一步 2 */
    private behavior1;
    /** 向左移动一步 4 */
    private behavior2;
    /** 向上移动一步 8 */
    private behavior3;
    /** 向右移动一步 6 */
    private behavior4;
    /** 向左下移动一步 1 */
    private behavior5;
    /** 向右下移动一步 3 */
    private behavior6;
    /** 向左上移动一步 7 */
    private behavior7;
    /** 向右上移动一步 9 */
    private behavior8;
    /** 随机移动一步 */
    private behavior9;
    /** 靠近场景对象 */
    private behavior10;
    /** 远离玩家移动一步 */
    private behavior11;
    /** 移动至 */
    private behavior12;
    /** 跳跃至坐标 */
    private behavior13;
    /** 设置至坐标 */
    private behavior14;
    /** 等待 */
    private behavior15;
    /** 面向朝下 */
    private behavior16;
    /** 面向朝左 */
    private behavior17;
    /** 面向朝上 */
    private behavior18;
    /** 面向朝右 */
    private behavior19;
    /** 面向朝左下 */
    private behavior20;
    /** 面向朝右下 */
    private behavior21;
    /** 面向朝左上 */
    private behavior22;
    /** 面向朝右上 */
    private behavior23;
    /** 随机朝向 */
    private behavior24;
    /** 面向指定的场景对象 */
    private behavior25;
    /** 背向指定的场景对象 */
    private behavior26;
    /** 使用变量指定面向 */
    private behavior27;
    /** 更改体型 */
    private behavior28;
    /** 更改移动速度 */
    private behavior29;
    /** 更改透明度 */
    private behavior30;
    /** 更改色相 */
    private behavior31;
    /** 更改动作播放帧率 */
    private behavior32;
    /** 更改影子 */
    private behavior33;
    /** 播放动画 */
    private behavior34;
    /** 停止动画 */
    private behavior35;
    /** 播放音效 */
    private behavior36;
    /**
     * 忽略不能移动的场合
     * @param v 是否忽略不能移动的场合 0=ON 1=OFF
     * @param keepMoveActWhenCollsionObstacleAndIgnoreCantMove
     * @param systemRecovery 来自系统恢复还原此前的设置
     */
    private behavior37;
    /** 允许选中 */
    private behavior38;
    /** 固定朝向 */
    private behavior39;
    /** 更改显示层次 */
    private behavior40;
    /** 桥属性 */
    private behavior41;
    /** 自动播放动作 */
    private behavior42;
    /** 移动时自动切换动作 */
    private behavior43;
    /** 穿透 */
    private behavior44;
    /** 限定四方向 */
    private behavior45;
    /** 更改行走图ID */
    private behavior46;
    /** 更改动作 */
    private behavior47;
    /** 更改帧 */
    private behavior48;
    /** 事件页：触发者-事件触发者 执行者-自身 */
    private behavior49;
    /** 编辑器预览 */
    private behavior50;
    private behaviorMoveD;
    /**
     * 刷新场景对象
     */
    private sceneObjectUpdate;
}
/**
 * 按钮组焦点管理器
 * 进入新的焦点时可以保留原焦点显示，但动画将会停止
 * 退出焦点时焦点显示会移除
 * Created by 黑暗之神KDS on 2020-09-21 18:41:20.
 */
declare class FocusButtonsManager {
    /**
     * 事件：改变焦点时事件
     * onChangeFocus(lastButtonFocus:FocusButtonsManager,newButtonFocus:FocusButtonsManager);
     */
    static EVENT_CHANGE_FOCUS: string;
    /**
     * 事件：激活焦点事件
     * onActivateFocus(buttonFocus:FocusButtonsManager);
     */
    static EVENT_ACTIVATE: string;
    /**
     * 事件：取消激活焦点事件
     * onUnActivateFocus(buttonFocus:FocusButtonsManager);
     */
    static EVENT_UNACTIVATE: string;
    /**
     * 激活的按钮组焦点
     */
    static _focus: FocusButtonsManager;
    /**
     * 是否已初始化
     */
    private static inited;
    /**
     * 是否已经按下确认键
     */
    private keyDownEnter;
    /**
     * 是否已按下取消键
     */
    private keyDownEsc;
    /**
     * 管理器初始化
     */
    private static init;
    /**
     * 焦点设置和获取
     * @param btnFocusManager 按钮组焦点
     */
    static set focus(btnFocusManager: FocusButtonsManager);
    static get focus(): FocusButtonsManager;
    /**
     * 关闭
     */
    static closeFocus(): void;
    /**
     * 按钮处于焦点中的状态
     * @param btn 按钮
     * @return [number] 0-未启用焦点或未在该焦点组中 1-已在该焦点组中，但未选中 2-已在该焦点组中同时也选中了
     */
    static inFocusState(btn: UIButton): number;
    /**
     * 选中焦点
     * @param btn 按钮
     */
    static setFocusButton(btn: UIButton): boolean;
    /**
     * 所属界面
     */
    private ui;
    /**
     * 选中的按钮
     */
    private selBtn;
    /**
     * 选中的皮肤界面
     */
    private selEffectUI;
    /**
     * 选中的皮肤界面中的target组件（用于动画的目标）
     */
    private selEffectTargetComp;
    /**
     * 选中的皮肤播放的动画效果
     */
    private uiCompFocusAnimation;
    /**
     * 可作为焦点的按钮集
     */
    buttons: UIButton[];
    /**
     * 按钮位置信息
     */
    private btnInfos;
    /**
     * 快捷键关闭
     */
    shortcutKeyExit: boolean;
    /**
     * 当关闭窗口时回到上一个焦点
     */
    whenExitBackLastFocus: boolean;
    /**
     * 当退出焦点时片段事件
     */
    whenExitEvent: string;
    /**
     * 当关闭窗口时的监听事件
     */
    private onExitBackLastFocusCB;
    /**
     * 记录来源焦点，以便关闭时能够恢复该焦点
     */
    private lastFocus;
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
    constructor(ui: GUI_BASE, isAutoFocus: boolean, addButtons: string[], excludeButtons: string[], selEffectUIID: number, useFocusAnimation: boolean, shortcutKeyExit?: boolean, whenExitBackLastFocus?: boolean, autoFocusType?: number, autoFocusParentCompName?: string);
    /**
     * 销毁
     */
    dispose(): void;
    /**
     * 获取和设置按钮索引
     */
    get selectedIndex(): number;
    set selectedIndex(v: number);
    /**
     * 获取实际存在的焦点按钮（可能焦点按钮不再显示了）
     */
    get realButtons(): UIButton[];
    /**
     * 选中按钮
     * @param btn
     * @param btnPos
     */
    private selectButton;
    /**
     * 激活
     */
    private activate;
    /**
     * 取消激活
     */
    private deactivate;
    /**
     * 当按键按下时
     * @param e
     */
    private onKeyDown;
    /**
     * 弹起按键时事件
     * @param e
     */
    private onKeyUp;
    /**
     * 恢复上个焦点
     * -- 该界面被关闭时
     * -- 退出焦点时
     */
    private recoveryLastFocus;
}
/**
 * 游戏UI管理器
 * Created by 黑暗之神KDS on 2020-03-17 02:20:53.
 */
declare class GUI_Manager {
    /**
     * 标准化列表LIST
     * -- 键位滚动至可见区域
     */
    static standardList(list: UIList, useItemClickSe?: boolean): void;
    /**
     * 标准化标签栏
     * -- 快捷键
     * @param tab
     */
    static standardTab(tab: UITabBox): void;
    /**
     * 注册鼠标点击区域后激活指定的列表
     * @param area 区域
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     * @param onFocus [可选] 默认值=null 当产生焦点时回调
     * @param thisPtr [可选] 默认值=null 当产生焦点时回调的作用域
     */
    static regHitAreaFocusList(area: UIBase, list: UIList, playSureSE?: boolean, onFocus?: Function, thisPtr?: any): void;
    /**
     * 激活List并选中
     * @param list 列表
     * @param playSureSE [可选] 默认值=true 是否播放确认音效
     */
    private static focusList;
    /**
     * 按键更改标签索引
     */
    private static onStandardTabKeyDown;
}
/**
 * 档案管理
 * Created by 黑暗之神KDS on 2020-09-15 17:17:25.
 */
declare class GUI_SaveFileManager {
    /**
     * 当前档案的目录信息
     */
    static currentSveFileIndexInfo: {
        indexInfo: SaveFileListCustomData;
        id: number;
        now: number;
    };
    /**
     * 游戏内读档重启方式直接进入档案的标识符
     */
    static onceInSceneLoadGameSign: string;
    /**
     * 已读档后的自定义数据
     */
    private static currentSaveFileCustomData;
    /**
     * 是否读档中
     */
    private static isLoading;
    /**
     * 初始化档案列表
     * @param list 档案列表组件
     */
    static initSaveFileList(list: UIList, saveMode?: boolean): void;
    /**
     * 存档
     * @param id 档案ID
     * @param executeEvent [可选] 默认值=true 是否执行「存档完毕事件」
     * @param onFin [可选] 默认值=null 存档完毕后回调
     * @param waitEventCompleteCallback [可选] 默认值=true 存档完毕后回调是否等待「存档完毕事件」执行完成后回调
     */
    static saveFile(id: number, executeEvent?: boolean, onFin?: Callback, waitEventCompleteCallback?: boolean): void;
    /**
     * 读档
     * @param id 档案编号
     * @param onFin [可选] 默认值=null 读档完毕后回调
     */
    static loadFile(id: number, onFin?: Callback): void;
    /**
     * 当档案列表所属的界面显示时
     * @param list 列表
     */
    private static onSaveFileListDisplay;
    /**
     * 当列表项显示对象点击时
     * @param saveMode
     */
    private static onListItemClick;
    /**
     * 当每创建一个档案项时回调函数
     * @param saveMode 存档模式
     * @param ui 档案项界面
     * @param data 档案项数据
     * @param index 档案项索引
     */
    private static onCreateSaveFileItem;
    /**
     * 刷新存档数据显示
     * @param list 档案列表组件
     */
    static refreshSaveFileItem(list: UIList): void;
    /**
     * 获取自定义档案目录数据
     * -- 截图
     * -- 场景名称
     * -- 游戏时间
     */
    private static getCustomSaveIndexInfo;
    /**
     * 当按键按下时
     * @param list
     * @param e
     */
    private static onKeyDown;
}
/**
 * 档案目录追加的自定义数据
 * 档案目录使用GC-LifeData，是一种全局数据，在游戏启动时会自动读取
 * 该模板追加了一些自定义的档案目录数据，以便在读档前即可查看档案的一些缩略资料（目录）
 *
 * Created by 黑暗之神KDS on 2020-09-15 13:09:31.
 */
declare class SaveFileListCustomData {
    /**
     * 截图：base64字符串，Web版游戏本存在存档容量限定，所以缩略截图尽可能小
     */
    screenshotImg: string;
    /**
     * 地图名
     */
    mapName: string;
    /**
     * 总游戏时间（毫秒）
     */
    gameTime: number;
}
/**
 * 组件初始化
 * @param isRoot 是否根容器（界面本体）
 * @param uiComp 组件
 */
declare function uiComponentInit(isRoot: boolean, uiComp: UIBase): void;
declare let ___lastListFocus: UIList;
declare let ___lastButtonsFocus: FocusButtonsManager;
declare let ___lastFocusIsList: boolean;
declare let ___isRecordFoucs: boolean;
declare let playDialogSEEnabled: boolean;
declare let UIListOnListKeyDown: any;
declare let UIListitemInit: any;
/**
 * A星算法
 * -- 以前使用AS3编写的翻译成TS后先使用，后期可优化
 * -- 支持四方向和八方向寻路
 * Created by 黑暗之神KDS on 2013-5-07 15:02:01.
 */
declare class AstarUtils {
    static ROAD_FIND_MAX: number;
    private startPoint;
    private endPoint;
    private mapArr;
    private w;
    private h;
    private openList;
    private closeList;
    private roadArr;
    private isPath;
    private isSearch;
    private ori4;
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
    static moveTo(x_x1: number, x_y1: number, x_x2: number, x_y2: number, gridW: number, gridH: number, scene: ProjectClientScene, ori4?: boolean, toGridAsThroughEnabled?: boolean, throughMode?: boolean, checker?: ProjectClientSceneObject): number[][];
    private static big_mapmapmap;
    /**
     * 大地图移动模式缓存
     * @param gridW
     * @param gridH
     * @param obsArr
     */
    static def_bigMoveTo(gridW: number, gridH: number, obsArr: boolean[][]): void;
    /**
     * 大地图移动
     * @param x_x1 起点
     * @param x_y1 起点
     * @param x_x2 终点
     * @param x_y2 终点
     * @return [string]
     */
    static bigMoveTo(x_x1: number, x_y1: number, x_x2: number, x_y2: number): number[][];
    private searchRoad;
    private addAroundPoint;
    private inArr;
    private setGHF;
    private checkG;
    private getMinF;
}
declare class AstarBox {
    G: number;
    H: number;
    F: number;
    father: AstarBox;
    px: number;
    py: number;
    go: number;
}
/**
 * 游戏手柄类
 *   该类适配了XBOX类、PS5的手柄
 * Created by 黑暗之神KDS on 2020-03-20 01:49:30.
 */
declare class GCGamepad extends EventDispatcher {
    /**
     * 事件：按键按下 onGamepadKeyDown(key:number) key对应GCGamepad的键位映射类别 如pad.xKey
     */
    static GAMEPAD_KEY_DOWN: string;
    /**
     * 事件：按键弹起 onGamepadKeyUp(key:number) key对应GCGamepad的键位映射类别 如pad.xKey
     */
    static GAMEPAD_KEY_UP: string;
    /**
     * 事件：摇杆改变 onGamepadJoyChange(isLeft:boolean,joyX:number,joyY:number,isFirstChange:boolean)
     */
    static GAMEPAD_JOY_CHANGE: string;
    /**
     * 事件：方向键改变 onGamepadLeftKeyChange(dir:number) dir=0、1-8(5除外) 以小键盘5为中心的数字面向，0表示未按下
     */
    static GAMEPAD_LEFT_KEY_CHANGE: string;
    /**
     * 事件：摇杆四方向 onGamepadLeftJoyDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    static GAMEPAD_LEFT_JOY_DIR4_CHANGE: string;
    /**
     * 事件：摇杆四方向 onGamepadRightJoyDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    static GAMEPAD_RIGHT_JOY_DIR4_CHANGE: string;
    /**
     * 键位名称
     */
    static keyNames: any;
    /**
     * 键位所在的keyMappings索引（该键位值默认为XBOX-360键位，而传统手柄键位通常在abxy上有一些差别）
     */
    static xKeyIndex: number;
    static yKeyIndex: number;
    static aKeyIndex: number;
    static bKeyIndex: number;
    static LBKeyIndex: number;
    static LTKeyIndex: number;
    static RBKeyIndex: number;
    static RTKeyIndex: number;
    static backKeyIndex: number;
    static startKeyIndex: number;
    static leftJoyDownKeyIndex: number;
    static rightJoyDownKeyIndex: number;
    static leftKeyIndex: number;
    static rightKeyIndex: number;
    static upKeyIndex: number;
    static downKeyIndex: number;
    private static pads;
    private static firstContinuityDelayTime;
    private static continuityDelayTime;
    /**
     * 获取游戏手柄
     * @param index 手柄索引
     * @return [GamePad]
     */
    static getPad(index: number): GCGamepad;
    /**
     * 常用手柄1
     */
    static get pad1(): GCGamepad;
    /**
     * 常用手柄2
     */
    static get pad2(): GCGamepad;
    /**
     * 常用手柄3
     */
    static get pad3(): GCGamepad;
    /**
     * 常用手柄4
     */
    static get pad4(): GCGamepad;
    /**
     * 索引，用于获取游戏手柄中可用的手柄
     */
    private index;
    /**
     * 键位映射：左摇杆
     */
    private leftJoy1;
    private leftJoy2;
    /**
     * 键位映射：左方向键
     */
    private leftKey;
    /**
     * 键位映射：右摇杆
     */
    private rightJoy1;
    private rightJoy2;
    /**
     * 键位映射：按键 aKey、bKey、xKey、yKey、LBKey、LTKey、RBKey、RTKey、backKey、startKey、leftJoyDownKey、rightJoyDownKey
     * 储存值是代表原生gamepad的buttons中的位置，比如3代表pad.buttons[3]，默认代表xKey
     */
    keyMappings: number[];
    /**
     * 根据键位获取索引
     * @param keyCode 键位值
     */
    getKeyIndex(keyCode: number): number;
    /**
     * 键位
     */
    xKey: number;
    yKey: number;
    aKey: number;
    bKey: number;
    LBKey: number;
    LTKey: number;
    RBKey: number;
    RTKey: number;
    backKey: number;
    startKey: number;
    leftJoyDownKey: number;
    rightJoyDownKey: number;
    /**
     * 键位默认值：摇杆未摇动的默认值
     */
    joyDefValue: number;
    /**
     * 方向键位应：
     */
    dirKeyMapping: {
        "1": number;
        "-1": number;
        "-0.7142857313156128": number;
        "-0.4285714030265808": number;
        "-0.1428571343421936": number;
        "0.14285719394683838": number;
        "0.4285714626312256": number;
        "0.7142857313156128": number;
    };
    /**
     * 左摇杆点
     */
    leftJoyPoint: Point;
    /**
     * 右摇杆点
     */
    rightJoyPoint: Point;
    /**
     * 获取指定摇杆点的角度 0~360
     * @param 指定的摇杆点 如leftJoyPoint/rightJoyPoint
     */
    getJoyPointAngle(joyPoint: Point): number;
    /**
     * 左方向键 1-8（不包含5） 对应小键盘面向
     */
    leftKeyDir: number;
    /**
     * 普通按键
     */
    private buttons;
    private tempPoint;
    private leftJoyStartTime;
    private leftJoyFirstChangeTimes;
    private rightJoyStartTime;
    private rightJoyFirstChangeTimes;
    private leftKeyStartTime;
    private leftKeyFirstChangeTimes;
    private lastDir4Info;
    /**
     * 构造函数
     * @param index
     */
    constructor(index: number);
    /**
     * 销毁
     */
    dispose(): void;
    /**
     * 刷新
     */
    private update;
    /**
     * 获取摇杆数值
     * @param pad 原生摇杆
     * @param joy1Index 摇杆映射索引1
     * @param joy2Index 摇杆映射索引2
     * @param p 储存的点
     */
    private getJoyValue;
    /**
     * 获取方向键，转为1-8面向表示
     * @param pad 原生摇杆
     * @param keyIndex
     * @return [number]
     */
    private getDirectionKey;
    /**
     * 当摇杆更改时，派发摇杆的方向事件（转换为方向键功能作用派发）
     * @param isleft 是否左摇杆
     * @param joyX 摇杆x值
     * @param joyY 摇杆y值
     */
    private onGamepadJoyChange;
}
/**
 * 项目层工具类
 * Created by 黑暗之神KDS on 2020-09-13 22:48:37.
 */
declare class ProjectUtils {
    static mouseWhileValue: number;
    /**
     * 回调函数辅助者：重用实例
     */
    static callbackHelper: Callback;
    /**
     * 点辅助者：重用实例
     */
    static pointHelper: Point;
    /**
     * 矩形辅助者：重用实例
     */
    static rectangleHelper: Rectangle;
    /**
     * 当前按键的事件对象
     */
    static keyboardEvent: EventObject;
    static keyboardEvents: {
        keyCode: number;
    }[];
    /**
     * 最近的操控方式 0-鼠标 1-按键 2-手柄
     */
    static lastControl: number;
    /**
     * 当前按键来自手柄
     */
    static fromGamePad: boolean;
    /**
     * 矩形对象池
     */
    private static rectanglePool;
    static init(): void;
    /**
     * 创建Rectangle
     */
    static takeoutRect(): Rectangle;
    /**
     * 返还Rectangle
     * @param rect
     */
    static freeRect(rect: Rectangle): void;
    /**
     * 格式化日期
     * @param fmt 格式化字符串规格 如
     * @param date
     * @return [String]
     */
    static dateFormat(fmt: string, date: Date): string;
    /**
     * 格式化计时器
     * @param time 时间段（毫秒）
     * @return [string]
     */
    static timerFormat(time: number): string;
    /**
     * 元素组索引移动
     * 根据相对的方位和距离计算
     * @param groupElements 元素组信息
     * @param currentIndex 索引
     * @param moveDir 2=下 4=左 6=右 8=上
     * @param fuzzySearch [可选] 默认值=false 模糊搜索，如果启用则在相对方位还会搜索临近的两个方向
     */
    static groupElementsMoveIndex(groupElements: {
        x: number;
        y: number;
    }[], currentIndex: number, moveDir: number, limitSecondAxis?: number): number;
    /**
     * 测试多边形相交，检测到任意相交就返回
     * @param polygon1 多边形1
     * @param polygon2 多边形2
     * @returns
     */
    static polygonsIntersectTest(polygon1: number[][], polygon2: number[][]): boolean;
    /**
     * 两条线是否相交
     * @param p1 线段1起点 如[0,0]
     * @param p2 线段1终点
     * @param q1 线段2起点
     * @param q2 线段2终点
     * @return [boolean]
     */
    static isLinesIntersect(p1: number[], p2: number[], q1: number[], q2: number[]): boolean;
    /**
     * 两条线相交返回相交点的比例（0~1）
     * @param p1 线段1起点 如[0,0]
     * @param p2 线段1终点
     * @param q1 线段2起点
     * @param q2 线段2终点
     * @return p1Per=线段1中的点的比例（0~1） p2Per=线段2中的点的比例（0~1）
     */
    static linesIntersectInfo(p1: number[], p2: number[], q1: number[], q2: number[], offsetY?: number): {
        p1Per: number;
        p2Per: number;
    };
    /**
     * 判断点是否在多边形内
     * @param point
     * @param polygon
     * @return [boolean]
     */
    static isPointInsidePolygon(point: number[], polygon: number[][]): boolean;
}
/**
 * 项目层游戏管理器实现类
 * -- 为了让系统API属性的类别直接指向项目层的实现类
 *    游戏内会经常用到Game.player以及Game.currentScene，实现此类可指向项目层自定义的「玩家类」和「场景类」
 *
 *
 * Created by 黑暗之神KDS on 2020-09-08 17:00:46.
 */
declare class ProjectGame extends GameBase {
    /**
     * 游戏开始时间（新游戏时记录，读档后记录档案的时间会计算差值以便获得游戏总游玩时间）
     */
    static gameStartTime: Date;
    private static gamePauseStartTime;
    /**
    * 当前的场景对象：重写，以便类别能够对应项目层自定义的子类
    */
    currentScene: ProjectClientScene;
    /**
     * 玩家对象：重写，便类别能够对应项目层自定义的子类
     */
    player: ProjectPlayer;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 初始化
     */
    init(): void;
    /**
     * 获取游戏时间
     */
    get gameTime(): number;
    private onInSceneStateChange;
    private onPauseChange;
}
/**
 * 游戏大门：用于处理进入游戏、读取存档、更换场景
 * Created by 黑暗之神KDS on 2020-09-11 19:18:46.
 */
declare class GameGate {
    /**
     * 事件：进入场景的状态改变时派发事件，对应 GameGate.STATE_XXX
     * onInSceneStateChange(inNewSceneState:number);
     */
    static EVENT_IN_SCENE_STATE_CHANGE: string;
    /**
     * 状态：离开场景，开始执行相关准备事件（离开场景时事件、新游戏开始事件、读档开始事件）
     */
    static STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT: number;
    /**
     * 状态：相关准备事件执行完毕，开始加载场景
     */
    static STATE_1_START_LOAD_SCENE: number;
    /**
     * 状态：加载场景完毕，开始执行对应的完成事件（进入场景时事件、新游戏完成事件、读档完成事件）
     */
    static STATE_2_START_EXECUTE_IN_SCENE_EVENT: number;
    /**
     * 状态：场景已进入完毕
     */
    static STATE_3_IN_SCENE_COMPLETE: number;
    /**
     * 状态：玩家可控制阶段开始
     */
    static STATE_4_PLAYER_CONTROL_START: number;
    /**
     * 状态值，对应GameGate.STATE_XXXX
     */
    static gateState: number;
    /**
     * 辅助计算用
     */
    private static bgmSyncTaskName;
    private static bgsSyncTaskName;
    /**
     * 游戏首次进入场景时表示
     */
    static inSceneInited: boolean;
    /**
     * 开始
     */
    static start(): void;
    /**
     * 世界初始化
     */
    private static onWorldInit;
    /**
     * 当接收到进入新的场景时事件
     * @param sceneID 场景模型ID
     * @param inNewSceneState 进入场景的方式 0-切换游戏场景 1-新游戏 2-读取存档
     */
    private static onInNewScene;
    /**
     * 添加玩家的场景对象
     * @param so 玩家场景对象数据
     * @param isEntity 是否是场景对象实体
     * @param insertNewPostion 插入到新的空位置上，如普通的切换场景时
     */
    private static addPlayerSceneObject;
}
declare let Game: ProjectGame;
declare let GlobalTempData: any;
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义指令 1-预加载资源
*/
declare class CustomCommandParams_1 {
    preloadAssets: DataStructure_preloadAsset[];
    isShowLoadingUI: boolean;
    bindingUI: {
        uiID: number;
        compName: string;
        compID: string;
        varName: string;
    };
}
/**
* 自定义指令 2-等待玩家输入文本
*/
declare class CustomCommandParams_2 {
    inputUI: number;
    defText: string;
    useVar: number;
    defTextVarID: number;
}
/**
* 自定义指令 3-按键事件
*/
declare class CustomCommandParams_3 {
    type: number;
    isMulKey: number;
    recordListen: boolean;
    key: number;
    systemKey: number;
    evType: number;
    evType2: number;
    keys: number[];
    systemKeys: number[];
    CTRL: boolean;
    SHIFT: boolean;
    ALT: boolean;
    eventPage: string;
    recordListenVar: number;
}
/**
* 自定义指令 4-鼠标事件
*/
declare class CustomCommandParams_4 {
    type: number;
    mouseType: number;
    eventPage: string;
    onlyInScene: boolean;
    recordListen: boolean;
    recordListenVar: number;
}
/**
* 自定义指令 5-设置界面属性
*/
declare class CustomCommandParams_5 {
    uiID: number;
    useVar: number;
    uiIDvarID: number;
    type: number;
    compName: string;
    compAttrName: string;
    compAttrValue: string;
    compNameUseVar: number;
    compAttrNameUseVar: number;
    compNameVarID: number;
    compAttrNameVarID: number;
    compAttrValueUseVar: number;
    compAttrValueVarID1: number;
    compAttrValueVarID2: number;
    compAttrValueVarID3: number;
    uiAttrName: string;
    uiAttrValue: string;
    uiAttrNameUseVar: number;
    uiAttrValueUseVar: number;
    uiAttrNameVarID: number;
    uiAttrValueVarID1: number;
    uiAttrValueVarID2: number;
    uiAttrValueVarID3: number;
}
/**
* 自定义指令 6-设置按钮焦点
*/
declare class CustomCommandParams_6 {
    uiID: number;
    uiIDVarID: number;
    useVar: number;
    isAutoFocus: boolean;
    isAddButton: boolean;
    isExcludeButton: boolean;
    useCache: boolean;
    autoFocusType: number;
    autoFocusParentCompName: string;
    addButtons: string[];
    excludeButtons: string[];
    selEffectUI: number;
    useFocusAnimation: boolean;
    setSelectedIndex: boolean;
    selectedIndex: number;
    shortcutKeyExit: boolean;
    whenExitBackLastFocus: boolean;
    whenExitEvent: string;
}
/**
* 自定义指令 7-关闭界面焦点
*/
declare class CustomCommandParams_7 {
    focusType: number;
}
/**
* 自定义指令 8-取消按键事件
*/
declare class CustomCommandParams_8 {
    recordListenVar: number;
}
/**
* 自定义指令 9-取消鼠标事件
*/
declare class CustomCommandParams_9 {
    recordListenVar: number;
}
/**
* 自定义指令 10-模拟按键
*/
declare class CustomCommandParams_10 {
    isMulKey: number;
    key: number;
    systemKey: number;
    evType: number;
    interval: number;
    CTRL: boolean;
    SHIFT: boolean;
    ALT: boolean;
}
/**
* 自定义指令 11-提交信息
*/
declare class CustomCommandParams_11 {
    messages: DataStructure_inputMessage[];
}
/**
* 自定义指令 12-设置列表焦点
*/
declare class CustomCommandParams_12 {
    list: {
        uiID: number;
        compName: string;
        compID: string;
        varName: string;
    };
}
/**
* 自定义指令 13-计时器
*/
declare class CustomCommandParams_13 {
    type: number;
    minute: number;
    second: number;
}
/**
* 自定义指令 1001-设置地图网格数据
*/
declare class CustomCommandParams_1001 {
    x: number;
    y: number;
    useVar: number;
    xVarID: number;
    yVarID: number;
    layer: number;
    on: number;
    value: number;
}
/**
* 自定义指令 1002-绘制图块
*/
declare class CustomCommandParams_1002 {
    x: number;
    y: number;
    useVar: number;
    xVarID: number;
    yVarID: number;
    tileID: number;
    sourceX: number;
    sourceY: number;
    layer: number;
    layerVarID: number;
    layerUseVar: number;
}
/**
* 自定义指令 1003-绘制自动元件
*/
declare class CustomCommandParams_1003 {
    x: number;
    y: number;
    useVar: number;
    xVarID: number;
    yVarID: number;
    autoTileID: number;
    layer: number;
    layerVarID: number;
    layerUseVar: number;
}
/**
* 自定义指令 1004-清除图块
*/
declare class CustomCommandParams_1004 {
    type: number;
    layer: number;
    layerVarID: number;
    layerUseVar: number;
    x: number;
    y: number;
    useVar: number;
    xVarID: number;
    yVarID: number;
}
/**
* 自定义指令 1005-设置图层属性
*/
declare class CustomCommandParams_1005 {
    layerID: number;
    layerVarID: number;
    offsetEnabled: boolean;
    scaleEnabled: boolean;
    autoMoveEnabled: boolean;
    alphaEnabled: boolean;
    visibleEnabled: boolean;
    layerUseVar: number;
    dx: number;
    dxVarID: number;
    dy: number;
    dyVarID: number;
    dxUseVar: number;
    dyUseVar: number;
    scaleX: number;
    scaleXVarID: number;
    scaleXUseVar: number;
    scaleY: number;
    scaleYVarID: number;
    scaleYUseVar: number;
    xMove: number;
    xMoveVarID: number;
    yMove: number;
    yMoveVarID: number;
    xMoveUseVar: number;
    yMoveUseVar: number;
    alpha: number;
    alphaVarID: number;
    alphaUseVar: number;
    visible: number;
    visibleVarID: number;
    visibleUseVar: number;
}
/**
* 自定义指令 1006-显示场景动画
*/
declare class CustomCommandParams_1006 {
    useType: number;
    aniID: number;
    aniUseVar: number;
    aniIDVarID: number;
    soType: number;
    useVar: number;
    soIndex: number;
    soIndexVarID: number;
    x: number;
    y: number;
    posUseVar: number;
    isGrid: boolean;
    xVarID: number;
    yVarID: number;
    layer: number;
}
/**
* 自定义指令 1007-缩放场景镜头
*/
declare class CustomCommandParams_1007 {
    useScaleX: boolean;
    useScaleY: boolean;
    scaleX: number;
    scaleY: number;
    scaleXUseVar: number;
    scaleYUseVar: number;
    scaleX2: number;
    scaleY2: number;
    trans: string;
    useTrans: boolean;
    time: number;
}
/**
* 自定义指令 1008-旋转场景镜头
*/
declare class CustomCommandParams_1008 {
    rotation: number;
    rotationVarID: number;
    useVar: number;
    trans: string;
    useTrans: boolean;
    time: number;
}
/**
* 自定义指令 2001-增减金币
*/
declare class CustomCommandParams_2001 {
    symbol: number;
    gold: number;
    useVar: number;
    goldVarID: number;
}
/**
* 自定义指令 2002-增减道具
*/
declare class CustomCommandParams_2002 {
    symbol: number;
    itemID: number;
    useVar1: number;
    itemIDVarID: number;
    useVar2: number;
    num: number;
    numVarID: number;
}
/**
* 自定义指令 2003-克隆对象
*/
declare class CustomCommandParams_2003 {
    sceneID: number;
    useVar: number;
    no: number;
    noVarID: number;
    newSoIndex: number;
    newSoExecuteEvent: string;
    waitEventComplete: boolean;
    x: number;
    y: number;
    posUseVar: number;
    xVarID: number;
    yVarID: number;
    isGrid: boolean;
}
/**
* 自定义指令 2004-销毁克隆的对象
*/
declare class CustomCommandParams_2004 {
    soType: number;
    useVar: number;
    no: number;
    noVarID: number;
}
/**
* 自定义指令 2005-暂时移除对象
*/
declare class CustomCommandParams_2005 {
    useVar: number;
    no: number;
    noVarID: number;
    soType: number;
}
/**
* 自定义指令 2006-停止移动
*/
declare class CustomCommandParams_2006 {
    soType: number;
    useVar: number;
    no: number;
    noVarID: number;
}
/**
* 自定义指令 2007-记录移动路径
*/
declare class CustomCommandParams_2007 {
    soType: number;
    useVar: number;
    no: number;
    noVarID: number;
}
/**
* 自定义指令 2008-恢复移动路径
*/
declare class CustomCommandParams_2008 {
    soType: number;
    useVar: number;
    no: number;
    noVarID: number;
}
/**
* 自定义指令 2009-设置场景对象的属性
*/
declare class CustomCommandParams_2009 {
    attributeData: CustomCompData;
    useVar: number;
    no: number;
    noVarID: number;
    soType: number;
}
/**
* 自定义指令 2010-
*/
declare class CustomCommandParams_2010 {
}
/**
* 自定义指令 2011-修改行走图部件
*/
declare class CustomCommandParams_2011 {
    partID: number;
    useVar: number;
    no: number;
    noVarID: number;
    newPartUseVar: number;
    newPart: number;
    newPartVarID: number;
    soType: number;
}
/**
* 自定义指令 2012-打开商店
*/
declare class CustomCommandParams_2012 {
    goodsList: DataStructure_shopItem[];
    nameWhenInfinite: string;
    enableSell: boolean;
    discount: number;
}
/**
* 自定义指令 2013-清除对象行为
*/
declare class CustomCommandParams_2013 {
    useVar: number;
    no: number;
    noVarID: number;
    soType: number;
}
/**
* 自定义指令 3001-显示图片
*/
declare class CustomCommandParams_3001 {
    passageID: number;
    passageIDVar: number;
    image: string;
    imageVar: number;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpWidth: number;
    dpWidthVar: number;
    dpHeight: number;
    dpHeightVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    flip: boolean;
    pivotType: number;
    blendMode: number;
    refImageEnabled: boolean;
    higher: boolean;
    refImage: string;
    imageUseVar: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
}
/**
* 自定义指令 3002-移动图片
*/
declare class CustomCommandParams_3002 {
    passageID: number;
    passageIDVar: number;
    timeType: number;
    time: number;
    trans: string;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpWidth: number;
    dpWidthVar: number;
    dpHeight: number;
    dpHeightVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    flip: boolean;
    pivotType: number;
    blendMode: number;
    refImageEnabled: boolean;
    higher: boolean;
    refImage: string;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
}
/**
* 自定义指令 3003-设置图像层镜头
*/
declare class CustomCommandParams_3003 {
    timeType: number;
    time: number;
    trans: string;
    cameraX: number;
    cameraXVar: number;
    cameraY: number;
    cameraYVar: number;
    cameraZ: number;
    cameraZVar: number;
    cameraRotation: number;
    cameraRotationVar: number;
    higher: boolean;
    xUseVar: boolean;
    yUseVar: boolean;
    zUseVar: boolean;
    roUseVar: boolean;
}
/**
* 自定义指令 3004-显示动画
*/
declare class CustomCommandParams_3004 {
    passageID: number;
    passageIDVar: number;
    animation: number;
    animationVar: number;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    playType: number;
    silentMode: boolean;
    showHitEffect: boolean;
    playFps: number;
    aniFrame: number;
    aniFrameVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    objectUseVar: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    aniFrameUseVar: boolean;
}
/**
* 自定义指令 3005-移动动画
*/
declare class CustomCommandParams_3005 {
    passageID: number;
    passageIDVar: number;
    timeType: number;
    trans: string;
    time: number;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    changeFrame: boolean;
    aniFrame: number;
    aniFrameVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    frameUseVar: boolean;
    passageIDUseVar: boolean;
}
/**
* 自定义指令 3006-显示立绘
*/
declare class CustomCommandParams_3006 {
    passageID: number;
    passageIDVar: number;
    standAvatar: number;
    standAvatarVar: number;
    expression: number;
    expressionVar: number;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    playType: number;
    avatarFPS: number;
    avatarFrame: number;
    avatarFrameVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    objectUseVar: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    frameUseVar: boolean;
    expressionUseVar: boolean;
}
/**
* 自定义指令 3007-移动立绘
*/
declare class CustomCommandParams_3007 {
    passageID: number;
    passageIDVar: number;
    timeType: number;
    time: number;
    trans: string;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    changeExpression: boolean;
    expression: number;
    expressionVar: number;
    changeFrame: boolean;
    avatarFrame: number;
    avatarFrameVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    expressionUseVar: boolean;
    frameUseVar: boolean;
}
/**
* 自定义指令 3008-消除图像
*/
declare class CustomCommandParams_3008 {
    passageIDUseVar: boolean;
    passageID: number;
    passageIDVar: number;
}
/**
* 自定义指令 3009-自动旋转
*/
declare class CustomCommandParams_3009 {
    passageIDUseVar: boolean;
    passageID: number;
    passageIDVar: number;
    rotation: number;
}
/**
* 自定义指令 3010-显示界面
*/
declare class CustomCommandParams_3010 {
    showType: number;
    passageID: number;
    passageIDVar: number;
    uiID: number;
    uiVar: number;
    setAttr: boolean;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    objectUseVar: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
}
/**
* 自定义指令 3011-移动界面
*/
declare class CustomCommandParams_3011 {
    showType: number;
    passageID: number;
    passageIDVar: number;
    uiID: number;
    uiVar: number;
    timeType: number;
    time: number;
    trans: string;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpScaleX: number;
    dpScaleXVar: number;
    dpScaleY: number;
    dpScaleYVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    refObjectEnabled: boolean;
    higher: boolean;
    refObject: number;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    objectUseVar: boolean;
}
/**
* 自定义指令 3012-关闭界面
*/
declare class CustomCommandParams_3012 {
    showType: number;
    passageID: number;
    passageIDVar: number;
    uiID: number;
    uiVar: number;
    passageIDUseVar: boolean;
    objectUseVar: boolean;
}
/**
* 自定义指令 3013-移动界面内的元件
*/
declare class CustomCommandParams_3013 {
    changeUIAttr: any;
}
/**
* 自定义指令 3014-添加材质
*/
declare class CustomCommandParams_3014 {
    targetType: number;
    passageIDUseVar: boolean;
    passageID: number;
    passageIDVar: number;
    objectUseVar: boolean;
    uiID: number;
    uiVar: number;
    materialData: {
        materials: MaterialData[];
    }[];
}
/**
* 自定义指令 3015-更改材质
*/
declare class CustomCommandParams_3015 {
    targetType: number;
    passageIDUseVar: boolean;
    passageID: number;
    passageIDVar: number;
    objectUseVar: boolean;
    uiID: number;
    uiVar: number;
    materialData: {
        materials: MaterialData[];
    }[];
}
/**
* 自定义指令 3016-删除材质
*/
declare class CustomCommandParams_3016 {
    targetType: number;
    passageIDUseVar: boolean;
    passageID: number;
    passageIDVar: number;
    objectUseVar: boolean;
    uiID: number;
    uiVar: number;
    clearType: number;
    materialID: number;
    materialPassage: number;
}
/**
* 自定义指令 3017-
*/
declare class CustomCommandParams_3017 {
}
/**
* 自定义指令 3018-显示视频
*/
declare class CustomCommandParams_3018 {
    passageID: number;
    passageIDVar: number;
    video: string;
    videoVar: number;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpWidth: number;
    dpWidthVar: number;
    dpHeight: number;
    dpHeightVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    playType: number;
    flip: boolean;
    muted: boolean;
    loop: boolean;
    volume: number;
    currentTime: number;
    currentTimeVar: number;
    playbackRate: number;
    blendMode: number;
    higher: boolean;
    objectUseVar: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    currentTimeUseVar: boolean;
}
/**
* 自定义指令 3019-移动视频
*/
declare class CustomCommandParams_3019 {
    passageID: number;
    passageIDVar: number;
    timeType: number;
    time: number;
    trans: string;
    dpX: number;
    dpXVar: number;
    dpY: number;
    dpYVar: number;
    dpZ: number;
    dpZVar: number;
    dpWidth: number;
    dpWidthVar: number;
    dpHeight: number;
    dpHeightVar: number;
    rotation: number;
    rotationVar: number;
    opacity: number;
    opacityVar: number;
    playType: number;
    flip: boolean;
    muted: boolean;
    loop: boolean;
    volume: number;
    changeStartTime: boolean;
    currentTime: number;
    currentTimeVar: number;
    playbackRate: number;
    blendMode: number;
    higher: boolean;
    posUseVar: boolean;
    sizeUseVar: boolean;
    zUseVar: boolean;
    opacityUseVar: boolean;
    rotationUseVar: boolean;
    passageIDUseVar: boolean;
    currentTimeUseVar: boolean;
}
/**
* 自定义指令 3020-等待关闭界面
*/
declare class CustomCommandParams_3020 {
    useVar: number;
    uiID: number;
    uiVar: number;
}
/**
* 自定义指令 3021-等待视频播放完成
*/
declare class CustomCommandParams_3021 {
    passageID: number;
    passageIDVar: number;
    varType: number;
}
/**
* 自定义指令 4001-允许玩家控制
*/
declare class CustomCommandParams_4001 {
}
/**
* 自定义指令 4002-禁止玩家控制
*/
declare class CustomCommandParams_4002 {
}
/**
* 自定义指令 4003-允许使用菜单
*/
declare class CustomCommandParams_4003 {
}
/**
* 自定义指令 4004-禁止使用菜单
*/
declare class CustomCommandParams_4004 {
}
/**
* 自定义指令 4005-开始游戏
*/
declare class CustomCommandParams_4005 {
}
/**
* 自定义指令 4006-存档
*/
declare class CustomCommandParams_4006 {
    saveType: number;
    saveID: number;
    silenceMode: boolean;
}
/**
* 自定义指令 4007-设置全局音量
*/
declare class CustomCommandParams_4007 {
    type: number;
    volume: number;
    useVar: number;
    volumeVarID: number;
}
/**
* 自定义指令 4008-返回标题界面
*/
declare class CustomCommandParams_4008 {
}
/**
* 自定义指令 4009-暂停游戏
*/
declare class CustomCommandParams_4009 {
}
/**
* 自定义指令 4010-恢复游戏
*/
declare class CustomCommandParams_4010 {
}
/**
* 自定义指令 4011-关闭窗口
*/
declare class CustomCommandParams_4011 {
}
/**
* 自定义指令 4012-设置对话音效
*/
declare class CustomCommandParams_4012 {
    dialogSE: number;
}
/**
* 自定义指令 4013-设置世界属性
*/
declare class CustomCommandParams_4013 {
    worldData: CustomCompData;
}
/**
* 自定义指令 4014-设置玩家属性
*/
declare class CustomCommandParams_4014 {
    playerData: CustomCompData;
}
/**
* 自定义指令 5001-播放背景音乐
*/
declare class CustomCommandParams_5001 {
    bgm: string;
    bgmVarID: number;
    fadeInTime: number;
    fadeInTimeVarID: number;
    advanceSetting: boolean;
    bgmUseVar: boolean;
    fadeInTimeUseVar: boolean;
}
/**
* 自定义指令 5002-停止背景音乐
*/
declare class CustomCommandParams_5002 {
    fadeOutTime: number;
    fadeOutTimeVarID: number;
    fadeOutTimeUseVar: boolean;
}
/**
* 自定义指令 5003-播放环境声效
*/
declare class CustomCommandParams_5003 {
    bgs: string;
    bgsVarID: number;
    fadeInTime: number;
    fadeInTimeVarID: number;
    advanceSetting: boolean;
    bgsUseVar: boolean;
    fadeInTimeUseVar: boolean;
}
/**
* 自定义指令 5004-停止环境声效
*/
declare class CustomCommandParams_5004 {
    fadeOutTime: number;
    fadeOutTimeVarID: number;
    fadeOutTimeUseVar: boolean;
}
/**
* 自定义指令 5005-播放音效
*/
declare class CustomCommandParams_5005 {
    se: string;
    seVarID: number;
    systemSEType: number;
    systemSE: boolean;
    seUseVar: boolean;
    nearBigFarSmall: boolean;
}
/**
* 自定义指令 5006-停止音效
*/
declare class CustomCommandParams_5006 {
}
/**
* 自定义指令 5007-播放语音
*/
declare class CustomCommandParams_5007 {
    ts: string;
    tsVarID: number;
    tsUseVar: boolean;
    nearBigFarSmall: boolean;
}
/**
* 自定义指令 5008-停止语音
*/
declare class CustomCommandParams_5008 {
}
/**
* 自定义指令 8001-增减场景对象的模块
*/
declare class CustomCommandParams_8001 {
    soType: number;
    no: number;
    noVarID: number;
    soUseVar: number;
    symbol: number;
    value: number;
    valueVarID: number;
    valueUseVar: number;
}
/**
* 自定义指令 8002-修改场景对象模块属性
*/
declare class CustomCommandParams_8002 {
    useVar: number;
    no: number;
    noVarID: number;
    soType: number;
    attr: CustomCompData;
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义条件 1-场景对象
*/
declare class CustomConditionParams_1 {
    soType: number;
    soIndex: number;
    type: number;
    useVar: number;
    soIndexVarID: number;
    soCustomAttr: CustomCompData;
    soModuleType: number;
    soModuleAttr: CustomCompData;
    soModuleID: number;
}
/**
* 自定义条件 2-界面
*/
declare class CustomConditionParams_2 {
    checkType: number;
    uiIDVarID: number;
    uiID: number;
    useVarID: number;
    type: number;
    uiComp: {
        uiID: number;
        compName: string;
        compID: string;
        varName: string;
    };
}
/**
* 自定义条件 3-系统信息
*/
declare class CustomConditionParams_3 {
    type: number;
    systemKey: number;
    worldAttrName: string;
}
/**
* 自定义条件 4-模块
*/
declare class CustomConditionParams_4 {
    modelData: CustomCompData;
}
/**
* 自定义条件 5-世界
*/
declare class CustomConditionParams_5 {
    worldData: CustomCompData;
}
/**
* 自定义条件 6-玩家
*/
declare class CustomConditionParams_6 {
    playerData: CustomCompData;
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义游戏数值 1-场景
*/
declare class CustomGameNumberParams_1 {
    type: number;
    isGrid: boolean;
    dataGridIndex: number;
    dynamicObs: boolean;
    dataGridUseVar: number;
    x: number;
    y: number;
    x2: number;
    y2: number;
    dataLayerSoType: number;
    dataLayerSoUseVar: number;
    dataLayerSoVarID: number;
    dataLayerSoIndex: number;
    cameraAttr: number;
}
/**
* 自定义游戏数值 2-场景对象
*/
declare class CustomGameNumberParams_2 {
    type: number;
    posMode: number;
    customAttr: CustomCompData;
    soType: number;
    useVar: number;
    no: number;
    varID: number;
    soModuleAttr: CustomCompData;
}
/**
* 自定义游戏数值 3-场景对象关系
*/
declare class CustomGameNumberParams_3 {
    soType1: number;
    soType2: number;
    type: number;
    no1: number;
    useVar1: number;
    useVar2: number;
    varID1: number;
    no2: number;
    varID2: number;
    isGrid: boolean;
}
/**
* 自定义游戏数值 4-玩家
*/
declare class CustomGameNumberParams_4 {
    type: number;
    itemID: number;
    playerData: CustomCompData;
}
/**
* 自定义游戏数值 5-界面
*/
declare class CustomGameNumberParams_5 {
    type: number;
    uiComp: {
        uiID: number;
        compName: string;
        compID: string;
        varName: string;
    };
    uiAttrName: string;
    uiID: number;
    useVarID: number;
    uiIDVarID: number;
}
/**
* 自定义游戏数值 6-鼠键
*/
declare class CustomGameNumberParams_6 {
    type: number;
    isGrid: boolean;
    pointKeyboard: number;
}
/**
* 自定义游戏数值 7-模块
*/
declare class CustomGameNumberParams_7 {
    modelData: CustomCompData;
}
/**
* 自定义游戏数值 8-世界
*/
declare class CustomGameNumberParams_8 {
    worldData: CustomCompData;
    type: number;
    presetType: number;
}
/**
* 自定义游戏数值 9-其他
*/
declare class CustomGameNumberParams_9 {
    normalNumber: number;
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
* 自定义游戏字符串 1-场景
*/
declare class CustomGameStringParams_1 {
    type: number;
}
/**
* 自定义游戏字符串 2-场景对象
*/
declare class CustomGameStringParams_2 {
    soType: number;
    no: number;
    varID: number;
    useVar: number;
    type: number;
    customAttr: CustomCompData;
    soModuleAttr: CustomCompData;
}
/**
* 自定义游戏字符串 3-玩家
*/
declare class CustomGameStringParams_3 {
    playerData: CustomCompData;
}
/**
* 自定义游戏字符串 4-界面
*/
declare class CustomGameStringParams_4 {
    uiComp: {
        uiID: number;
        compName: string;
        compID: string;
        varName: string;
    };
}
/**
* 自定义游戏字符串 5-模块
*/
declare class CustomGameStringParams_5 {
    modelData: CustomCompData;
}
/**
* 自定义游戏字符串 6-世界
*/
declare class CustomGameStringParams_6 {
    worldData: CustomCompData;
}
/**
* 自定义游戏字符串 7-系统
*/
declare class CustomGameStringParams_7 {
    type: number;
    systemKeys: number;
}
/**
 * #1 道具
 */
declare class Module_Item {
    id: number;
    name: string;
    icon: string;
    intro: string;
    sell: number;
    isUse: boolean;
    sellEnabled: boolean;
    isConsumables: boolean;
    se: string;
    callEvent: string;
}
/**
 * #1 preloadAsset
 */
declare class DataStructure_preloadAsset {
    assetType: number;
    asset0: string;
    asset1: string;
    asset2: number;
    asset3: number;
    asset4: number;
    asset5: number;
    asset6: number;
}
/**
 * #2 packageItem
 */
declare class DataStructure_packageItem {
    item: Module_Item;
    number: number;
}
/**
 * #3 keys
 */
declare class DataStructure_keys {
    key: number;
}
/**
 * #4 point
 */
declare class DataStructure_point {
    x: number;
    y: number;
}
/**
 * #5 shopItem
 */
declare class DataStructure_shopItem {
    item: number;
    numberType: number;
    number: number;
    numberVar: number;
    priceType: number;
    price: number;
    priceVar: number;
}
/**
 * #6 gameKeyboard
 */
declare class DataStructure_gameKeyboard {
    gameKey: number;
    keyCode1: number;
    keyCode2: number;
    keyCode3: number;
    keyCode4: number;
}
/**
 * #7 inputMessage
 */
declare class DataStructure_inputMessage {
    type: number;
    numberValue: any;
    booleanValue: any;
    stringValue: any;
}
/**
 * #8 collisionGroupSetting
 */
declare class DataStructure_collisionGroupSetting {
    group1: number;
    group2: number;
}
declare class WorldData {
    static readonly screenMode: number;
    static readonly sceneBGMGradientTime: number;
    static readonly sceneBGSGradientTime: number;
    static readonly moveToGridCenter: boolean;
    static readonly moveDir4: boolean;
    static readonly jumpTimeCost: number;
    static readonly jumpHeight: number;
    static menuEnabled: boolean;
    static readonly sceneObjectCollisionSize: number;
    static readonly sceneObjectMoveStartAct: number;
    static readonly useSceneObjectMoveStartAct2: boolean;
    static readonly sceneObjectMoveStartAct2Speed: number;
    static readonly sceneObjectMoveStartAct2: number;
    static readonly selectSceneObjectEffect: number;
    static readonly saveFileMax: number;
    static playCtrlEnabled: boolean;
    static readonly uiCompFocusAnimation: number;
    static gridObsDebug: boolean;
    static rectObsDebug: boolean;
    static dragSceneObjectDebug: boolean;
    static zoomCameraDebug: boolean;
    static readonly focusEnabled: boolean;
    static readonly hotKeyListEnabled: boolean;
    static readonly sceneObjectMoveStartAct2FPS: number;
    static readonly banCollisionSetting: DataStructure_collisionGroupSetting[];
    static readonly selectSE: string;
    static readonly sureSE: string;
    static readonly cancelSE: string;
    static readonly disalbeSE: string;
    static readonly dialogSE: string;
    static dialogSEEnabled: boolean;
    static keyboards: DataStructure_gameKeyboard[];
    static word_gamepadInput: string;
    static word_keyboardInput: string;
}
declare class PlayerData {
    sceneObject: SceneObject;
    package: DataStructure_packageItem[];
    gold: number;
}
/**
 * 该文件为GameCreator编辑器自动生成的代码
 */
/**
 * 材质数据基类
 */
declare class MaterialData {
    id: number;
    enable: boolean;
    ____timeInfo: {
        [varName: string]: number;
    };
}
/**
 * 材质1-色调变更
 */
declare class MaterialData1 extends MaterialData {
    id: number;
    r: number;
    g: number;
    b: number;
    gray: number;
    mr: number;
    mg: number;
    mb: number;
    useTime: boolean;
    time: string;
}
/**
 * 材质2-色相
 */
declare class MaterialData2 extends MaterialData {
    id: number;
    hue: number;
}
/**
 * 材质3-模糊
 */
declare class MaterialData3 extends MaterialData {
    id: number;
    strength: number;
    useTime: boolean;
    time: string;
}
/**
 * 材质4-外发光
 */
declare class MaterialData4 extends MaterialData {
    id: number;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
}
/**
 * 材质5-滚筒
 */
declare class MaterialData5 extends MaterialData {
    id: number;
    useTrans: boolean;
    sigma: number;
    trans: string;
    aspect: number;
}
/**
 * 材质6-色彩滚筒
 */
declare class MaterialData6 extends MaterialData {
    id: number;
    useTrans: boolean;
    time: number;
    trans: string;
    useTrans1: boolean;
    sigma: number;
    trans1: string;
    useTrans2: boolean;
    strength: number;
    trans2: string;
    aspect: number;
}
/**
 * 材质7-正片叠底
 */
declare class MaterialData7 extends MaterialData {
    id: number;
    tex2: string;
    useTrans: boolean;
    time: number;
    trans: string;
}
/**
 * 材质8-辉光
 */
declare class MaterialData8 extends MaterialData {
    id: number;
    useTrans: boolean;
    time: number;
    trans: string;
    zoom: number;
    multiplier: number;
    centerX: number;
    centerY: number;
}
/**
 * 材质9-滤色
 */
declare class MaterialData9 extends MaterialData {
    id: number;
    tex2: string;
    useTrans: boolean;
    time: number;
    trans: string;
}
/**
 * 材质10-淡入淡出
 */
declare class MaterialData10 extends MaterialData {
    id: number;
    mask: string;
    useTrans: boolean;
    time: number;
    trans: string;
    vagueness: number;
    invertMask: number;
}
/**
 * 材质11-混合添加
 */
declare class MaterialData11 extends MaterialData {
    id: number;
    tex2: string;
    useTrans: boolean;
    time: number;
    trans: string;
    colorMulR: number;
    colorMulG: number;
    colorMulB: number;
    colorMulA: number;
    colorAddR: number;
    colorAddG: number;
    colorAddB: number;
    colorAddA: number;
    invertMask: number;
    alphaFactor: number;
}
/**
 * 材质12-马赛克
 */
declare class MaterialData12 extends MaterialData {
    id: number;
    useTrans: boolean;
    trans: string;
    pixelSize: number;
}
/**
 * 材质13-波浪
 */
declare class MaterialData13 extends MaterialData {
    id: number;
    t: string;
    amplitude: number;
    angularVelocity: number;
    speed: number;
}
/**
 * 材质14-花屏闪烁
 */
declare class MaterialData14 extends MaterialData {
    id: number;
    t: string;
    timeScale: number;
}
/**
 * 材质15-热浪扭曲
 */
declare class MaterialData15 extends MaterialData {
    id: number;
    tex2: string;
    uvScale: number;
    noiseTimeScale: number;
    t: string;
}
/**
 * 材质16-溶解
 */
declare class MaterialData16 extends MaterialData {
    id: number;
    tex2: string;
    t: string;
    dissolveSpeed: number;
    edgeWidth: number;
    edgeColorR: number;
    edgeColorG: number;
    edgeColorB: number;
    edgeColorA: number;
    startTime: number;
}
/**
 * 材质17-扫描翻页
 */
declare class MaterialData17 extends MaterialData {
    id: number;
    lineColorR: number;
    lineColorG: number;
    lineColorB: number;
    lineColorA: number;
    lineWidth: number;
    rangeX: string;
}
/**
 * 场景-项目层实现类
 * Created by 黑暗之神KDS on 2020-09-08 17:10:24.
 */
declare class ProjectClientScene extends ClientScene {
    /**
     * 场景对象列表：场景上全部的场景对象
     * 重写，如果确保场景上只有ClientSceneObject_1的话则可以如此使用，方便代码调用
     */
    sceneObjects: ProjectClientSceneObject[];
    /**
     * 场景工具
     */
    sceneUtils: SceneUtils;
    /**
     * DEBUG层
     */
    debugLayer: ClientSceneLayer;
    static debugColor(mode: number): string;
    static getDebugColorBySceneObject(target: ProjectClientSceneObject): string;
    /**
     * 辅助场景集合，克隆其内的场景对象需要预先创建该场景
     */
    private static sceneHelpers;
    private static sceneHelperLoadings;
    /**
     * 初始化
     */
    static init(): void;
    /**
     * 根据设定获取场景对象
     * @param soType 类别：0-玩家的场景对象 1-触发者 2-执行者 3-指定编号
     * @param soIndex 指定的编号
     * @param pointSoMode [可选] 默认值=0 指定场景对象编号的模式 0-常量 1-变量
     * @param soIndexVarID [可选] 默认值=0 使用的变量ID
     * @param trigger [可选] 默认值=null 触发器，如在事件执行时调用该函数则可传递触发器过来使用，以便判定触发者、执行者
     */
    static getSceneObjectBySetting(soType: number, soIndex: number, pointSoMode?: number, soIndexVarID?: number, trigger?: CommandTrigger): ProjectClientSceneObject;
    /**
     * 获取辅助场景，如用于克隆里面的场景对象使用，并不会实际作为游戏场景使用
     * 已存在的话同步回调
     * @param sceneID 场景ID
     * @param onFin 完成时回调 onFin(scene:ClientScene,isSync)
     */
    static createSceneHelper(sceneID: number, onFin: Callback): void;
    /**
     * 销毁辅助场景
     * @param sceneID 场景ID
     */
    static disposeSceneHelper(sceneID: number): boolean;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 当场景解析时函数：由系统调用
     * @param jsonObj 解析数据
     * @param gameData 游戏数据
     */
    parse(jsonObj: any, gameData: GameData): void;
    /**
     * 当渲染时：每帧执行的逻辑
     */
    onRender(): void;
    /**
     * 添加显示对象
     * @param soData 场景对象数据
     * @param isSoc [可选] 默认值=false 是否是实际的对象而非数据
     * @param useModelClass [可选] 默认值=false 是否使用场景对象模型的实现类
     * @return [ClientSceneObject] 添加的场景对象实例
     */
    addSceneObject(soData: SceneObject, isSoc?: boolean, useModelClass?: boolean): ClientSceneObject;
    /**
     * 移除显示对象
     * @param so 显示对象
     * @return [ClientSceneObject]
     */
    removeSceneObject(so: SceneObject, removeFromList?: boolean): ClientSceneObject;
    /**
     * DEBUG显示障碍数据
     */
    private debugRender;
    /** 是否恢复了需要玩家等待的的事件（即无法操控） */
    private static hasRetoryWaitEvent;
    /**
     * 当场景状态改变时
     */
    private static onInSceneStateChange;
    /**
     * 获取追加的自定义存档数据
     * -- 场景对象数据
     */
    private static getSaveData;
    /**
     * 恢复数据前的处理
     */
    private static beforeRetorySaveData;
    /**
     * 恢复场景对象数据
     */
    private static retorySceneObjectSaveData;
    /**
     * 恢复场景数据
     */
    private static retorySceneSaveData;
}
/**
 * 项目层-玩家实现类
 *
 * Created by 黑暗之神KDS on 2020-03-03 09:04:41.
 */
declare class ProjectPlayer extends ClientPlayer {
    /**
      * 事件：监听道具数目改变
      */
    static EVENT_CHANGE_ITEM_NUMBER: string;
    /**
     * 事件：监听金币改变
     */
    static EVENT_CHANGE_GOLD_NUMBER: string;
    /**
     * 玩家的游戏对象数据：重写以便类别能够指向项目层的ProjectClientSceneObject，方便调用
     */
    sceneObject: ProjectClientSceneObject;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 增加金币
     * @param v 增加的数
     */
    static increaseGold(v: number): void;
    /**
     * 获取道具-DS类型
     * @param itemID 道具ID
     * @return [DataStructure_packageItem]
     */
    static getItemDS(itemID: number): DataStructure_packageItem;
    /**
     * 获取道具
     * @param itemID 道具ID
     * @return [Module_Item]
     */
    static getItem(itemID: number): Module_Item;
    /**
     * 改变道具数目（增减道具）
     * @param itemID 道具ID
     * @param v 增加或减少的数目
     */
    static changeItemNumber(itemID: number, v: number): void;
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
 * 场景对象模块基类
 */
declare class SceneObjectModule {
    static moduleClassArr: (typeof SceneObjectModule)[];
    id: number;
    name: string;
    so: ProjectClientSceneObject;
    isDisposed: boolean;
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    constructor(installCB: Callback);
    /**
     * 当移除模块时执行的函数
     */
    onRemoved(): void;
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void;
    /**
     * 当卸载模块时执行的函数
     */
    dispose(): void;
}
/**
 * 场景对象公共类，任何场景对象都继承该类
 */
declare class SceneObjectCommon extends ClientSceneObject {
    selectEnabled: boolean;
    through: boolean;
    bridge: boolean;
    fixOri: boolean;
    ignoreCantMove: boolean;
    moveAutoChangeAction: boolean;
    lockBehaviorLayer: number;
    keepMoveActWhenCollsionObstacleAndIgnoreCantMove: boolean;
    behaviorDir4: boolean;
    repeatedTouchEnabled: boolean;
    onlyPlayerTouch: boolean;
    waitTouchEvent: boolean;
    clickEventNoDistance: boolean;
    moveSpeed: number;
    defBehavior: string;
    collisionGroup: number;
    constructor(soData: SceneObject, scene: ClientScene);
}
/**
 * 场景对象模型：影子（极简）
 */
declare class SceneObjectModule_1 extends SceneObjectModule {
    shadowWidth: number;
    shadowHeight: number;
    shadowAlpha: number;
    constructor(installCB: Callback);
}
/**
 * 场景对象模型：行走图材质
 */
declare class SceneObjectModule_2 extends SceneObjectModule {
    materialData: {
        materials: MaterialData[];
    }[];
    constructor(installCB: Callback);
}
/**
 * 场景对象模型：动画
 */
declare class SceneObjectModule_3 extends SceneObjectModule {
    ani: GCAnimation;
    constructor(installCB: Callback);
}
/**
 * 场景对象模型：自定义碰撞
 */
declare class SceneObjectModule_4 extends SceneObjectModule {
    type: number;
    color: string;
    opacity: number;
    layer: number;
    hideAvatar: boolean;
    alwaysDisplayColor: boolean;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    radius: number;
    pointArr: DataStructure_point[];
    constructor(installCB: Callback);
}
/**
 * 场景对象模型：光影
 */
declare class SceneObjectModule_5 extends SceneObjectModule {
    type: number;
    shadowType: number;
    shadowStyle: number;
    shadowImage: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowOpacity: number;
    shadowRotation: number;
    shadowScale: number;
    shadowMinScale: number;
    shadowMaxScale: number;
    shadowOpacityFactor: number;
    shadowScaleFactor: number;
    lightStyleType: number;
    lightImage: string;
    lightAnimation: number;
    lightAnimationScaleX: number;
    lightAnimationScaleY: number;
    lightAnimationRotation: number;
    lightOpacity: number;
    lightBlendMode: number;
    lightBrighten: boolean;
    lightRange: number;
    showLightRange: boolean;
    lightShineEnable: boolean;
    lightShineValue: number;
    lightShineTransition: string;
    groupID: number;
    constructor(installCB: Callback);
}
/**
 * 该文件为GameCreator编辑器自动生成的代码，请勿修改
 */
/**
 * 1-标题界面 [BASE]
 */
declare class GUI_1 extends GUI_BASE {
    标题背景: UIBitmap;
    底部装饰: UIBitmap;
    上半圆装饰: UIBitmap;
    下半圆装饰: UIBitmap;
    游戏标题: UIString;
    开始游戏按钮: UIButton;
    读取存档按钮: UIButton;
    游戏设置按钮: UIButton;
    退出游戏按钮: UIButton;
    上装饰: UIBitmap;
    下装饰: UIBitmap;
    constructor();
}
declare class ListItem_1 extends UIListItemData {
    标题背景: string;
    底部装饰: string;
    上半圆装饰: string;
    下半圆装饰: string;
    游戏标题: string;
    上装饰: string;
    下装饰: string;
}
/**
 * 2-读档界面 [BASE]
 */
declare class GUI_2 extends GUI_BASE {
    半透明背景: UIBitmap;
    界面框背景: UIBitmap;
    滚动条背景: UIBitmap;
    list: UIList;
    关闭读档界面按钮: UIButton;
    关闭标志: UIBitmap;
    界面标题背景: UIBitmap;
    界面标题: UIString;
    constructor();
}
declare class ListItem_2 extends UIListItemData {
    半透明背景: string;
    界面框背景: string;
    滚动条背景: string;
    list: UIListItemData[];
    关闭标志: string;
    界面标题背景: string;
    界面标题: string;
}
/**
 * 3-菜单界面 [BASE]
 */
declare class GUI_3 extends GUI_BASE {
    半透明背景: UIBitmap;
    背包按钮: UIButton;
    存档按钮: UIButton;
    读档按钮: UIButton;
    设置按钮: UIButton;
    返回标题界面按钮: UIButton;
    返回游戏按钮: UIButton;
    constructor();
}
declare class ListItem_3 extends UIListItemData {
    半透明背景: string;
}
/**
 * 4-背包界面 [BASE]
 */
declare class GUI_4 extends GUI_BASE {
    半透明背景: UIBitmap;
    道具框背景: UIBitmap;
    说明栏背景: UIBitmap;
    说明栏背景底衬: UIBitmap;
    货币栏背景: UIBitmap;
    滚动条背景: UIBitmap;
    list: UIList;
    itemIntroRoot: UIRoot;
    itemIntro: UIString;
    itemName: UIString;
    玩家金币数: UIString;
    关闭背包界面按钮: UIButton;
    关闭标志: UIBitmap;
    货币图片: UIBitmap;
    我的金币文本: UIString;
    界面标题背景: UIBitmap;
    界面标题: UIString;
    constructor();
}
declare class ListItem_4 extends UIListItemData {
    半透明背景: string;
    道具框背景: string;
    说明栏背景: string;
    说明栏背景底衬: string;
    货币栏背景: string;
    滚动条背景: string;
    list: UIListItemData[];
    itemIntro: string;
    itemName: string;
    关闭标志: string;
    货币图片: string;
    我的金币文本: string;
    界面标题背景: string;
    界面标题: string;
}
/**
 * 5-存档界面 [BASE]
 */
declare class GUI_5 extends GUI_BASE {
    半透明背景: UIBitmap;
    界面框背景: UIBitmap;
    滚动条背景: UIBitmap;
    list: UIList;
    关闭存档界面按钮: UIButton;
    关闭标志: UIBitmap;
    界面标题背景: UIBitmap;
    界面标题: UIString;
    constructor();
}
declare class ListItem_5 extends UIListItemData {
    半透明背景: string;
    界面框背景: string;
    滚动条背景: string;
    list: UIListItemData[];
    关闭标志: string;
    界面标题背景: string;
    界面标题: string;
}
/**
 * 6-系统设置 [BASE]
 */
declare class GUI_6 extends GUI_BASE {
    半透明背景: UIBitmap;
    设置框背景: UIBitmap;
    typeTab: UITabBox;
    常规: UIRoot;
    bgmFocus: UIButton;
    bgsFocus: UIButton;
    seFocus: UIButton;
    tsFocus: UIButton;
    bgmSlider: UISlider;
    bgsSlider: UISlider;
    seSlider: UISlider;
    tsSlider: UISlider;
    背景音乐音量文本: UIString;
    环境音效音量文本: UIString;
    音效音量文本: UIString;
    语音音量文本: UIString;
    键盘控制: UIRoot;
    键盘滚动条背景: UIBitmap;
    keyboardList: UIList;
    keyboardReset: UIButton;
    手柄控制: UIRoot;
    手柄滚动条背景: UIBitmap;
    gamepadList: UIList;
    gamepadReset: UIButton;
    关闭系统设置界面按钮: UIButton;
    关闭标志: UIBitmap;
    needInputKeyPanel: UIBitmap;
    needInputKeyLabel: UIString;
    constructor();
}
declare class ListItem_6 extends UIListItemData {
    半透明背景: string;
    设置框背景: string;
    typeTab: string;
    bgmSlider: number;
    bgsSlider: number;
    seSlider: number;
    tsSlider: number;
    背景音乐音量文本: string;
    环境音效音量文本: string;
    音效音量文本: string;
    语音音量文本: string;
    键盘滚动条背景: string;
    keyboardList: UIListItemData[];
    手柄滚动条背景: string;
    gamepadList: UIListItemData[];
    关闭标志: string;
    needInputKeyPanel: string;
    needInputKeyLabel: string;
}
/**
 * 7-文本输入界面 [BASE]
 */
declare class GUI_7 extends GUI_BASE {
    界面背景: UIBitmap;
    输入框背景: UIBitmap;
    input: UIInput;
    提交文本输入按钮: UIButton;
    constructor();
}
declare class ListItem_7 extends UIListItemData {
    界面背景: string;
    输入框背景: string;
    input: string;
}
/**
 * 8-数字输入界面 [BASE]
 */
declare class GUI_8 extends GUI_BASE {
    界面背景: UIBitmap;
    输入框背景: UIBitmap;
    input: UIInput;
    提交数字输入按钮: UIButton;
    constructor();
}
declare class ListItem_8 extends UIListItemData {
    界面背景: string;
    输入框背景: string;
    input: string;
}
/**
 * 9-密码输入界面 [BASE]
 */
declare class GUI_9 extends GUI_BASE {
    界面背景: UIBitmap;
    输入框背景: UIBitmap;
    input: UIInput;
    提交密码输入按钮: UIButton;
    constructor();
}
declare class ListItem_9 extends UIListItemData {
    界面背景: string;
    输入框背景: string;
    input: string;
}
/**
 * 10-游戏结束界面 [BASE]
 */
declare class GUI_10 extends GUI_BASE {
    半透明背景: UIBitmap;
    底部装饰: UIBitmap;
    苍之羽标志: UIBitmap;
    GameOver文本: UIString;
    constructor();
}
declare class ListItem_10 extends UIListItemData {
    半透明背景: string;
    底部装饰: string;
    苍之羽标志: string;
    GameOver文本: string;
}
/**
 * 11-商店界面 [BASE]
 */
declare class GUI_11 extends GUI_BASE {
    半透明背景: UIBitmap;
    goodsListBox: UIBitmap;
    文字底衬: UIBitmap;
    文本_商品名称: UIString;
    文本_价格: UIString;
    文本_数量: UIString;
    文本_持有数量: UIString;
    滚动条背景: UIBitmap;
    goodsList: UIList;
    sellItemList: UIList;
    说明栏背景: UIBitmap;
    buyBox: UIRoot;
    buyBoxArea: UIRoot;
    购买数量背景底衬: UIBitmap;
    buyNum_text: UIString;
    sellNum_text: UIString;
    buyNum_text2: UIString;
    subNumBtn: UIButton;
    addNumBtn: UIButton;
    maxNumBtn: UIButton;
    购买数量背景纹路: UIBitmap;
    buyNum: UIString;
    sureBtn: UIButton;
    cancelBtn: UIButton;
    itemBox: UIBitmap;
    说明栏背景底衬: UIBitmap;
    itemName: UIString;
    itemIntroRoot: UIRoot;
    itemIntro: UIString;
    货币栏背景: UIBitmap;
    goldNum: UIString;
    closeBtn: UIButton;
    关闭标志: UIBitmap;
    typeTab: UITabBox;
    我的金币文本: UIString;
    货币图片: UIBitmap;
    constructor();
}
declare class ListItem_11 extends UIListItemData {
    半透明背景: string;
    goodsListBox: string;
    文字底衬: string;
    文本_商品名称: string;
    文本_价格: string;
    文本_数量: string;
    文本_持有数量: string;
    滚动条背景: string;
    goodsList: UIListItemData[];
    sellItemList: UIListItemData[];
    说明栏背景: string;
    购买数量背景底衬: string;
    buyNum_text: string;
    sellNum_text: string;
    buyNum_text2: string;
    购买数量背景纹路: string;
    buyNum: string;
    itemBox: string;
    说明栏背景底衬: string;
    itemName: string;
    itemIntro: string;
    货币栏背景: string;
    关闭标志: string;
    typeTab: string;
    我的金币文本: string;
    货币图片: string;
}
/**
 * 12-虚拟按键 [BASE]
 */
declare class GUI_12 extends GUI_BASE {
    容器: UIRoot;
    A: UIButton;
    B: UIButton;
    START: UIButton;
    BACK: UIButton;
    rockerBg: UIBitmap;
    上标识: UIBitmap;
    右标识: UIBitmap;
    下标识: UIBitmap;
    左标识: UIBitmap;
    rocker: UIBitmap;
    dirBtnRoot: UIRoot;
    上按钮: UIButton;
    下按钮: UIButton;
    左按钮: UIButton;
    右按钮: UIButton;
    隐藏按键: UIButton;
    constructor();
}
declare class ListItem_12 extends UIListItemData {
    rockerBg: string;
    上标识: string;
    右标识: string;
    下标识: string;
    左标识: string;
    rocker: string;
}
/**
 * 13-计时器 [BASE]
 */
declare class GUI_13 extends GUI_BASE {
    图片: UIBitmap;
    time: UIString;
    constructor();
}
declare class ListItem_13 extends UIListItemData {
    图片: string;
    time: string;
}
/**
 * 14- [BASE]
 */
declare class GUI_14 extends GUI_BASE {
    constructor();
}
declare class ListItem_14 extends UIListItemData {
}
/**
 * 1001-档案_Item [BASE]
 */
declare class GUI_1001 extends GUI_BASE {
    项目背景: UIBitmap;
    screenshotImg: UIBitmap;
    截图背景: UIBitmap;
    mapName: UIString;
    dateStr: UIString;
    no: UIString;
    delBtn: UIButton;
    关闭标志: UIBitmap;
    texts: UIRoot;
    游戏时长文本: UIString;
    创建时间文本: UIString;
    gameTimeStr: UIString;
    constructor();
}
declare class ListItem_1001 extends UIListItemData {
    项目背景: string;
    screenshotImg: string;
    截图背景: string;
    mapName: string;
    dateStr: string;
    no: string;
    关闭标志: string;
    游戏时长文本: string;
    创建时间文本: string;
    gameTimeStr: string;
}
/**
 * 1002-道具_Item [BASE]
 */
declare class GUI_1002 extends GUI_BASE {
    项目背景: UIBitmap;
    itemNum: UIString;
    itemName: UIString;
    道具背景: UIBitmap;
    icon: UIBitmap;
    道具框: UIBitmap;
    constructor();
}
declare class ListItem_1002 extends UIListItemData {
    项目背景: string;
    itemNum: string;
    itemName: string;
    道具背景: string;
    icon: string;
    道具框: string;
}
/**
 * 1003-商品_Item [BASE]
 */
declare class GUI_1003 extends GUI_BASE {
    项目背景: UIBitmap;
    ownNum: UIString;
    itemNum: UIString;
    道具背景: UIBitmap;
    itemPrice: UIString;
    道具框: UIBitmap;
    itemName: UIString;
    icon: UIBitmap;
    constructor();
}
declare class ListItem_1003 extends UIListItemData {
    项目背景: string;
    ownNum: string;
    itemNum: string;
    道具背景: string;
    itemPrice: string;
    道具框: string;
    itemName: string;
    icon: string;
}
/**
 * 1004- [BASE]
 */
declare class GUI_1004 extends GUI_BASE {
    constructor();
}
declare class ListItem_1004 extends UIListItemData {
}
/**
 * 1005- [BASE]
 */
declare class GUI_1005 extends GUI_BASE {
    constructor();
}
declare class ListItem_1005 extends UIListItemData {
}
/**
 * 1006- [BASE]
 */
declare class GUI_1006 extends GUI_BASE {
    constructor();
}
declare class ListItem_1006 extends UIListItemData {
}
/**
 * 1007- [BASE]
 */
declare class GUI_1007 extends GUI_BASE {
    constructor();
}
declare class ListItem_1007 extends UIListItemData {
}
/**
 * 1008-按钮选中效果样式1 [BASE]
 */
declare class GUI_1008 extends GUI_BASE {
    容器: UIRoot;
    target: UIBitmap;
    constructor();
}
declare class ListItem_1008 extends UIListItemData {
    target: string;
}
/**
 * 1009-按钮选中效果样式2 [BASE]
 */
declare class GUI_1009 extends GUI_BASE {
    容器: UIRoot;
    target: UIBitmap;
    constructor();
}
declare class ListItem_1009 extends UIListItemData {
    target: string;
}
/**
 * 1010-按钮选中效果样式3 [BASE]
 */
declare class GUI_1010 extends GUI_BASE {
    容器: UIRoot;
    target: UIBitmap;
    constructor();
}
declare class ListItem_1010 extends UIListItemData {
    target: string;
}
/**
 * 1011- [BASE]
 */
declare class GUI_1011 extends GUI_BASE {
    constructor();
}
declare class ListItem_1011 extends UIListItemData {
}
/**
 * 1012- [BASE]
 */
declare class GUI_1012 extends GUI_BASE {
    constructor();
}
declare class ListItem_1012 extends UIListItemData {
}
/**
 * 1013- [BASE]
 */
declare class GUI_1013 extends GUI_BASE {
    constructor();
}
declare class ListItem_1013 extends UIListItemData {
}
/**
 * 1014- [BASE]
 */
declare class GUI_1014 extends GUI_BASE {
    constructor();
}
declare class ListItem_1014 extends UIListItemData {
}
/**
 * 1015- [BASE]
 */
declare class GUI_1015 extends GUI_BASE {
    constructor();
}
declare class ListItem_1015 extends UIListItemData {
}
/**
 * 1016- [BASE]
 */
declare class GUI_1016 extends GUI_BASE {
    constructor();
}
declare class ListItem_1016 extends UIListItemData {
}
/**
 * 1017- [BASE]
 */
declare class GUI_1017 extends GUI_BASE {
    constructor();
}
declare class ListItem_1017 extends UIListItemData {
}
/**
 * 1018-设置_Item1 [BASE]
 */
declare class GUI_1018 extends GUI_BASE {
    项目背景: UIBitmap;
    keyName: UIString;
    key1: UIButton;
    key2: UIButton;
    key3: UIButton;
    key4: UIButton;
    constructor();
}
declare class ListItem_1018 extends UIListItemData {
    项目背景: string;
    keyName: string;
}
/**
 * 1019-设置_Item2 [BASE]
 */
declare class GUI_1019 extends GUI_BASE {
    项目背景: UIBitmap;
    keyName: UIString;
    key1: UIButton;
    constructor();
}
declare class ListItem_1019 extends UIListItemData {
    项目背景: string;
    keyName: string;
}
/**
 * 1020- [BASE]
 */
declare class GUI_1020 extends GUI_BASE {
    constructor();
}
declare class ListItem_1020 extends UIListItemData {
}
/**
 * 2001-启动载入界面 [BASE]
 */
declare class GUI_2001 extends GUI_BASE {
    进度条背景: UIBitmap;
    loadingComp: UISlider;
    动画: UIAnimation;
    constructor();
}
declare class ListItem_2001 extends UIListItemData {
    进度条背景: string;
    loadingComp: number;
    动画: number;
}
/**
 * 2002-新游戏载入界面 [BASE]
 */
declare class GUI_2002 extends GUI_BASE {
    图片: UIBitmap;
    constructor();
}
declare class ListItem_2002 extends UIListItemData {
    图片: string;
}
/**
 * 2003-读档载入界面 [BASE]
 */
declare class GUI_2003 extends GUI_BASE {
    图片: UIBitmap;
    constructor();
}
declare class ListItem_2003 extends UIListItemData {
    图片: string;
}
/**
 * 2004-场景载入界面 [BASE]
 */
declare class GUI_2004 extends GUI_BASE {
    图片: UIBitmap;
    constructor();
}
declare class ListItem_2004 extends UIListItemData {
    图片: string;
}
/**
 * 2005- [BASE]
 */
declare class GUI_2005 extends GUI_BASE {
    constructor();
}
declare class ListItem_2005 extends UIListItemData {
}
/**
 * 3001-我的自定义界面 [BASE]
 */
declare class GUI_3001 extends GUI_BASE {
    图片: UIBitmap;
    文本: UIString;
    按钮: UIButton;
    游戏数值: UIString;
    constructor();
}
declare class ListItem_3001 extends UIListItemData {
    图片: string;
    文本: string;
}
/**
 * 3002- [BASE]
 */
declare class GUI_3002 extends GUI_BASE {
    constructor();
}
declare class ListItem_3002 extends UIListItemData {
}
/**
 * 场景对象模块-行走图材质
 * Created by 黑暗之神KDS on 2021-11-02 05:06:12.
 */
declare class SoModule_AvatarMaterial extends SceneObjectModule_2 {
    /**
     * 构造函数
     * @param installCB
     */
    constructor(installCB: Callback);
    /**
     * 模块移除时
     */
    onRemoved(): void;
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void;
}
/**
 * 场景对象模块-自定义碰撞
 * Created by Karson.DS on 2025-03-19 07:21:23.
 */
declare class SoModule_CustomCollision extends SceneObjectModule_4 {
    /**
     * 自定义碰撞的模块编号
     */
    static PLUGIN_SCENEOBJECT_MODULE_ID: number;
    /**
     * 障碍合集
     */
    private static arr;
    /**
     * 记录是否处于DEBUG绘制
     */
    private static DEBUG_DRAW;
    /**
     * 范围
     */
    private rangeRect;
    private rangeRectPoints;
    private radiusCenterPoint;
    private radius2;
    private customShapePoints;
    private recordMyPoint;
    private debug_recordCameraScale;
    private debug_recordThrough;
    private debug_recordBridge;
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    constructor(installCB: Callback);
    /**
     * 当移除模块时执行的函数
     */
    onRemoved(): void;
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void;
    /**
     * 是否视为障碍
     */
    get isObstacle(): boolean;
    /**
     * 获取 target 与当前场景的所有自定义碰撞体的-碰撞检测
     * @param target 目标对象
     * @param onlyOne 碰撞成功一个后就返回
     * @param designatedPoint [可选] 指定的坐标，如果存在则使用该坐标而非target的坐标
     * @param onlyCheckObs [可选] 只检测障碍
     * @param conditionFunction [可选] 检查条件，满足条件才加入列表
     * @returns
     */
    static collisionTest(target: ProjectClientSceneObject, onlyOne: boolean, designatedPoint?: Point, onlyCheckObs?: boolean, conditionFunction?: (so: ProjectClientSceneObject, collision: SoModule_CustomCollision) => boolean): {
        so: ProjectClientSceneObject;
        collision: SoModule_CustomCollision;
    }[];
    /**
     * 碰撞测试-与普通对象（无自定义碰撞）
     */
    collisionTestByNormalTarget(target: ProjectClientSceneObject): boolean;
    /**
     * 初始化
     */
    private init;
    /**
     * 帧刷开始
     */
    private onUpdateStart;
    /**
     * 刷新（DEBUG-帧刷）
     */
    private onDebugUpdate;
    /**
     * 判断是否在范围内
     * @param designatedPoint [可选]指定的坐标，如果存在则使用该坐标而非target的坐标
     * @return [boolean]
     */
    isInRange(target: ProjectClientSceneObject, targetCustomCollision: SoModule_CustomCollision, designatedPoint?: Point): boolean;
    /**
     * 刷新范围区域
     * @param designatedPoint [可选]指定的坐标，如果存在则使用该坐标而非target的坐标
     */
    private refreshRange;
}
/**
 * 场景对象模块-光影
 * Created by Karson.DS on 2025-03-19 16:02:36.
 */
declare class SoModule_LightShadow extends SceneObjectModule_5 {
    /**
     * 当前场景的阴影组 [groupID] = [shadow1、shadow2...]
     */
    private static shadowArr;
    /**
     * 当前场景的阴影组 [groupID] = [light1、light2...]
     */
    private static lightArr;
    /**
     * 阴影容器：shadowAvatar/shadowImageObject使用该容器装载
     */
    private shadowRoot;
    /**
     * 阴影对象-行走图
     */
    private shadowAvatar;
    /**
     * 阴影对象-图片对象
     */
    private shadowImageObject;
    /**
     * 光照对象-图片对象
     */
    private lightImageObject;
    /**
     * 光照对象-动画对象
     */
    private lightAnimationObject;
    /**
     * 所在组
     */
    private inGroupID;
    /**
     * 所在组类别 0-光照 1-阴影
     */
    private inGroupType;
    /**
     * 闪耀
     */
    private lightShineTransData;
    private lightShineTransI;
    /**
     * 记录阴影被光照作用的帧，确保同组同一帧只会收到一个光照影响
     */
    private brightenFrame;
    /**
     * 构造函数
     * @param installCB 用于安装模块的属性值
     */
    constructor(installCB: Callback);
    /**
     * 当移除模块时执行的函数
     */
    onRemoved(): void;
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void;
    /**
     * 初始化
     */
    private init;
    /**
     * 清理
     */
    private clear;
    /**
     * 光照初始化
     */
    private initLight;
    /**
     * 刷新光照样式
     */
    private refreshLightStyle;
    /**
     * 光照作用开始
     */
    private startLightBrighten;
    /**
     * 光照作用-帧刷
     * @param lightRange2
     */
    private lightBrightenUpdate;
    /**
     * 创建灯光
     */
    private createLight;
    private onLightImageLoaded;
    /**
     * 初始化阴影
     */
    private initShadow;
    /**
     * 创建阴影样式
     */
    private createShadow;
    /**
     * 每帧先重置阴影状态
     */
    private onDynamicShadowUpdate;
    /**
     * 当阴影图片加载完毕时：初始化位置
     */
    private onShadowImageLoaded;
    /**
     * 当行走图渲染时-阴影同步
     */
    private onAvatarRender;
    /**
     * 刷新阴影样式-动态
     */
    private setShadowStyle;
    /**
     * 添加到阴影组
     */
    private addToShadowGroup;
    /**
     * 添加到灯光组
     */
    private addToLightGroup;
    /**
     * 从阴影/灯光组里移除
     */
    private removeFromGroup;
}
/**
 * 场景对象模块-影子
 * Created by 黑暗之神KDS on 2021-11-02 01:05:48.
 */
declare class SoModule_Shadow extends SceneObjectModule_1 {
    /**
     * 构造函数
     * @param installCB
     */
    constructor(installCB: Callback);
    /**
     * 模块移除时
     */
    onRemoved(): void;
    /**
     * 刷新：通常在改变了属性需要调用此函数统一刷新效果
     */
    refresh(): void;
    /**
     * 清理影子
     */
    private clearShadow;
    /**
     * 绘制影子
     */
    private drawShadow;
    /**
     * 开始刷新绘制
     */
    private startUpdateDraw;
    /**
     * 停止刷新绘制
     */
    private stopUpdateDraw;
}
/**
 * 场景对象绑定类示例
 * Created by 黑暗之神KDS on 2020-09-08 17:00:01.
 */
declare class ProjectClientSceneObject extends SceneObjectCommon {
    /**
     * 面向
     */
    static CHANGE_ORI: string;
    /**
     * 移动开始事件 onMoveStart(fromAutoRetry:boolean) fromAutoRetry=是否来自自动重试的移动
     */
    static MOVE_START: string;
    /**
     * 移动结束事件
     */
    static MOVE_OVER: string;
    /**
     * 跳跃开始事件
     */
    static JUMP_START: string;
    /**
     * 跳跃结束事件
     */
    static JUMP_OVER: string;
    /**
     * 碰撞事件 onCollision(touchRes:{ isObstacle: boolean, touchSceneObjects: ProjectClientSceneObject[] })
     */
    static COLLISION: string;
    /**
     * 碰触事件 onTouch(toucher:ProjectClientSceneObject)
     */
    static TOUCH: string;
    /**
     * 离开碰触事件 onTouch(awayer:ProjectClientSceneObject)
     */
    static AWAY_TOUCH: string;
    /**
     * 唯一ID
     */
    sid: number;
    /**
     * 所属的场景
     */
    scene: ProjectClientScene;
    /**
     * 行为状态：是否处于跳跃中
     */
    isJumping: boolean;
    /**
     * 当前所在的坐标点，Point版
     */
    pos: Point;
    /**
     * 当前所在的格子位置，通过refreshCoordinate刷新计算而来的缓存数据
     */
    posGrid: Point;
    /**
     * 当前所在位置的矩形数据
     */
    posRect: Rectangle;
    /**
     * 想要到达的点（如用于SceneUtils.getAroundPositions计算）
     */
    wantToGoGrid: Point;
    /**
     * 已经保存记录的移动路径信息（如通过命令临时记录使用）
     */
    recordMoveRoadInfo: any;
    /**
     * 禁止行为
     */
    banBehavior: boolean;
    /**
     * 禁止动作
     */
    banAvatarAction: boolean;
    /**
     * 事件开始等待的状态记录（需要进入存档）
     */
    protected eventStartWaitInfo: any;
    /**
     * 行为集，由多个行为组合而成，重写变量属性以便类别指向项目层的 ProjectSceneObjectBehaviors
     */
    protected behaviors: ProjectSceneObjectBehaviors[];
    /**
     * 重试自动寻路标识
     */
    protected needRetryAutoFindRoadMoveSign: any;
    /**
     * 我的上一次接触者列表
     */
    protected myLastTouchObjects: ProjectClientSceneObject[];
    /**
     * 是否来自恢复存档数据
     */
    isFromRecorySaveData: boolean;
    /**
     * 恢复存档时的帧记录，以便在当前不会新触发事件
     */
    protected fromRecorySaveDataGameFrame: number;
    /**
     * 禁止发送下一个移动开始事件
     */
    protected stopSendNextMoveStartEvent: boolean;
    /**
     * 禁止发送下一个移动结束事件
     */
    protected stopSendNextMoveOverEvent: boolean;
    /**
     * 记录的行为
     */
    protected _recordBehaviors: ProjectSceneObjectBehaviors[];
    protected tempGridPosHelper: Point;
    /**
     * 上一次移动的趋势，由from位置移动至to位置（像素坐标）
     */
    moveTrendInfo: {
        from: Point;
        to: Point;
    };
    /**
     * 上一次实际移动的信息，由from位置移动至to位置（像素坐标）
     */
    moveRealInfo: {
        from: Point;
        to: Point;
    };
    /**
     * 构造函数
     * @param soData 场景对象数据
     * @param scene 所属场景
     */
    constructor(soData: SceneObject, scene: ClientScene);
    /**
     * 等待进入完毕后再执行初始化
     */
    private initState3;
    /**
     * 释放函数
     */
    dispose(): void;
    /**
     * 获取需要存档的自定义数据
     */
    getSaveData(): any;
    /**
     * 恢复需要存档的自定义数据
     */
    retorySaveData(o: any): void;
    /**
     * 刷新：场景会调用所有场景上的场景对象的该函数
     * @param nowTime 游戏时间戳（Game.pause会暂停游戏时间戳）
     */
    update(nowTime: number): void;
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
    addBehavior(behaviorData: any[], loop: boolean, targetSceneObject: ProjectClientSceneObject, onOver: Callback, cover: boolean, startIndex?: number, Immediate?: boolean, forceStopLastBehavior?: boolean, delayFrame?: number, executor?: SceneObjectEntity): ProjectSceneObjectBehaviors;
    /**
     * 停止当前的行为，但不会清空行为列表，如果存在后续行为指令会继续执行。
     * 如果还想要清空行为列表，可以调用 clearBehaviors
     * @param force 强制停止，不必因移动至中心点而必须移动下一个最近的中心点才停止
     */
    stopBehavior(force?: boolean): void;
    /**
     * 获取当前的行为层
     */
    getBehaviorLayer(): number;
    /**
     * 记录行为
     */
    recordBehavior(): void;
    /**
     * 恢复行为
     */
    recoveryBehavior(): void;
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
    setTo(x: number, y: number, stopMove?: boolean, integer?: boolean, alreadySetTempPosHelper?: boolean, alreadySetRect?: boolean, clacTouchEvent?: boolean): void;
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
    autoFindRoadMove(toX: number, toY: number, ifObstacleHandleMode?: number, costTime?: number, useAstar?: boolean, whenCantMoveRetry?: boolean, useGridObstacle?: boolean, forceDir4?: boolean, fromAutoRetry?: boolean): void;
    /**
     * 开始移动（此处不会预先计算障碍，纯粹根据指定的路径移动，但在移动过程中会判定障碍）
     * @param movePath 移动路径，首个坐标无需包含自己的坐标点
     * @param costTime [可选] 默认值=0 当前移动已花费的时间（客户端出现时可能其已在移动中途）
     * @param useGridObstacle [可选] 默认值=false 开启此项则使用格子计算障碍，否则使用矩形计算（A星计算移动则需要开启此项，通常按键可以使用矩形计算）
     * @param onMoveOver [可选] 默认值=null 当移动结束时回调，一般为无关紧要的事务处理，如果特别重要，可以自行加入到存档的自定义数据中，以便读档恢复该回调事件
     */
    startMove(movePath: number[][], costTime?: number, useGridObstacle?: boolean, onMoveOver?: Callback): void;
    /**
     * 停止移动
     * @param force 强制停止，不必因移动至中心点而必须移动下一个最近的中心点才停止
     */
    stopMove(force?: boolean): void;
    /**
     * 跳跃至
     * @param x
     * @param y
     * @param costFrame 已经花费的游戏帧数
     */
    jumpTo(x: number, y: number, costFrame?: number): void;
    /**
     * 记录移动状态
     */
    getRecordMoveState(): {
        useGridObstacle: boolean;
        roadsArr: Point[];
        roadMax: number;
        nowRoad: number;
        nowRoadStartDate: number;
        nowRoadTime: number;
        thisRoadS: number;
        recordNow: number;
        moveSpeed: number;
    };
    /**
     * 恢复移动状态
     * @param force 强行恢复，无论当前是否正处于移动状态中
     */
    restoryMove(recordMoveStateInfo: any, force?: boolean): void;
    /**
     * 进入新的坐标后进行一些刷新
     * -- 位置改变时
     * -- 新出现时
     * @param alreadySetTempPosHelper [优化项]表示已计算过格子辅助体，无需重新计算
     * @param alreadySetRect [优化项]表示已计算过矩形范围，无需重新计算
     * @param clacTouchEvent [可选] 默认值=true 是否计算碰触事件模式
     * @param triggerEvent [可选] 默认值=true 触发碰触事件
     */
    refreshCoordinate(alreadySetTempPosHelper?: boolean, alreadySetRect?: boolean, clacTouchEvent?: boolean, triggerEvent?: boolean): void;
    /**
     * 是否已处于事件等待中
     * @return [boolean]
     */
    get isEventStartWait(): boolean;
    /**
     * 事件开始时等待处理（当前对象是执行者身份）
     * @param trigger 触发者
     * @param faceToTrigger 面向触发者
     * @param 是否等待成功
     */
    eventStartWait(trigger: ProjectClientSceneObject, faceToTrigger?: boolean): boolean;
    /**
     * 事件结束时恢复
     * @return 是否恢复成功
     */
    eventCompleteContinue(): boolean;
    /**
     * 清除我接触的对象记录
     * @param targetSo [可选] 默认值=null 指定的接触过的对象，如果为null则清理全部
     */
    clearMyTouchRecord(targetSo?: ProjectClientSceneObject): void;
    /**
     * 清理所有人接触我的记录
     */
    clearTouchMeRecord(): void;
    /**
     * 是否允许接触
     */
    get touchEnabled(): boolean;
    /**
     * 获取接触者列表
     */
    get lastTouchObjects(): ProjectClientSceneObject[];
    /**
     * 判断指定对象是否在我的接触者列表中
     */
    isInMyTouchList(targetSo: ProjectClientSceneObject): boolean;
    protected useGridObstacle: boolean;
    protected _isMoving: boolean;
    protected roadsArr: Point[];
    protected roadMax: number;
    protected nowRoad: number;
    protected nowRoadStartDate: number;
    protected nowRoadTime: number;
    protected onMoveOver: Callback;
    protected thisRoadS: number;
    protected jumpToPoint: Point;
    protected currentJumpFrame: number;
    /**
     * 开始移动（此处不会预先计算障碍，纯粹根据指定的路径移动，但在移动过程中会判定障碍）
     */
    private doStartMove;
    /**
     * 更改移动状态
     */
    get isMoving(): boolean;
    set isMoving(isMove: boolean);
    /**
     * 更改移动时动作
     */
    protected changeMoveAction(isMove: boolean): void;
    /**
     * 刷新坐标
     * @param _nowTime 当前游戏时间戳
     */
    protected updateCoordinate(_nowTime: number): void;
    /**
     * 跳跃时更改的属性值
     */
    protected get jumpY(): number;
    protected set jumpY(v: number);
    /**
     * 碰触事件处理，碰触是相互的，执行了对方的碰触事件也会执行自己的碰触事件
     * @param touchRes 我的碰触信息
     * @param triggerEvent 是否触发碰触事件
     * @return 是否触发过事件
     */
    protected touchEventHandle(touchRes: {
        isObstacle: boolean;
        touchSceneObjects: ProjectClientSceneObject[];
    }, triggerEvent?: boolean): boolean;
    /**
     * 并行事件处理
     */
    protected parallelEventUpdate(): void;
    /**
     * 执行出现事件
     */
    protected appearEventHandle(): void;
    /**
     * 初始化
     */
    protected init(): void;
    /**
     * 当状态页改变时
     * @param isFirst 首次出现时
     */
    protected onStausPageChange(isFirst: boolean): void;
    /**
     * 当状态页更改前
     */
    protected onBeforeStausPageChange(): void;
    /**
     * 开始执行默认行为
     */
    protected startDefBehavior(): void;
    /**
     * 刷新行为
     */
    protected updateBehavior(): void;
    /**
     * 重试自动寻路
     */
    protected retryAutoFindRoadMove(toX: number, toY: number, ifObstacleHandleMode?: number, costTime?: number, useAstar?: boolean, whenCantMoveRetry?: boolean, useGridObstacle?: boolean, touchRes?: any): void;
    /**
     * 清理重试自动寻路的状态
     */
    protected clearRetryAutoFindRoadMove(offCollisionEvent?: boolean): void;
    /**
     * 当系统事件被执行时
     * @param mode 0-对话框显示时 1-对话选择框显示时 2-其他（如更换场景）
     */
    protected onSystemCommandStart(mode: number): void;
    /**
     * 当执行等待事件时更改了面向
     */
    private onExecuteWaitEventChangeOri;
    /**
     * 当执行等待事件时重新执行了新的移动指令
     */
    private onExecuteWaitEventNewMove;
    /**
     * 当游戏暂停状态改变时处理
     */
    private onGamePauseChangeHandle;
}
/**
 * 读档界面
 * Created by 黑暗之神KDS on 2020-09-15 12:22:43.
 */
declare class GUI_Load extends GUI_2 {
    /**
     * 构造函数
     */
    constructor();
}
/**
 * 背包
 * Created by 黑暗之神KDS on 2020-09-17 14:56:35.
 */
declare class GUI_Package extends GUI_4 {
    private useItemLock;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 当界面显示时事件
     */
    private onDisplay;
    /**
     * 当创建项显示对象时
     */
    private onCreateItemUI;
    /**
     * 当道具发生变更时
     */
    private onItemChange;
    /**
     * 当道具点击时
     */
    private onItemClick;
    /**
     * 刷新道具列表
     */
    private refreshItems;
    /**
     * 刷新道具详情
     */
    private refreshItemInfo;
}
/**
 * 存档界面
 * Created by 黑暗之神KDS on 2020-09-15 14:01:31.
 */
declare class GUI_Save extends GUI_5 {
    constructor();
}
/**
 * 系统设置
 * Created by 黑暗之神KDS on 2020-03-12 13:55:53.
 */
declare class GUI_Setting extends GUI_6 {
    /**
     * 是否输入按键模式
     */
    static IS_INPUT_KEY_MODE: boolean;
    constructor();
    /**
     * 界面显示时
     */
    private onDisplay;
    /**
     * 事件：改变快捷键
     */
    static EVENT_CHANGE_HOT_KEY: string;
    /**
     * 系统按键集
     */
    static SYSTEM_KEYS: string[];
    /**
     * 当前键盘按键设定
     */
    static KEY_BOARD: {
        UP: {
            index: number;
            keys: any[];
        };
        DOWN: {
            index: number;
            keys: any[];
        };
        LEFT: {
            index: number;
            keys: any[];
        };
        RIGHT: {
            index: number;
            keys: any[];
        };
        A: {
            index: number;
            keys: any[];
        };
        B: {
            index: number;
            keys: any[];
        };
        X: {
            index: number;
            keys: any[];
        };
        Y: {
            index: number;
            keys: any[];
        };
        START: {
            index: number;
            keys: any[];
        };
        BACK: {
            index: number;
            keys: any[];
        };
        L1: {
            index: number;
            keys: any[];
        };
        L2: {
            index: number;
            keys: any[];
        };
        R1: {
            index: number;
            keys: any[];
        };
        R2: {
            index: number;
            keys: any[];
        };
    };
    static GAMEPAD: {
        X: {
            index: number;
            key: number;
        };
        Y: {
            index: number;
            key: number;
        };
        A: {
            index: number;
            key: number;
        };
        B: {
            index: number;
            key: number;
        };
        START: {
            index: number;
            key: number;
        };
        BACK: {
            index: number;
            key: number;
        };
        L1: {
            index: number;
            key: number;
        };
        L2: {
            index: number;
            key: number;
        };
        R1: {
            index: number;
            key: number;
        };
        R2: {
            index: number;
            key: number;
        };
    };
    /**
     * 获取系统键位描述
     * @param key 系统键位名，对应GUI_Setting.KEY_BOARD的键
     */
    static getSystemKeyDesc(key: string): string;
    /**
     * 默认键位设定
     */
    private static KEY_BOARD_DEFAULT;
    private static GAMEPAD_DEFAULT;
    static initHotKeySetting(): void;
    /**
     * 获取全局数据
     */
    static getGlobalData(): {
        KEY_BOARD: {
            UP: {
                index: number;
                keys: any[];
            };
            DOWN: {
                index: number;
                keys: any[];
            };
            LEFT: {
                index: number;
                keys: any[];
            };
            RIGHT: {
                index: number;
                keys: any[];
            };
            A: {
                index: number;
                keys: any[];
            };
            B: {
                index: number;
                keys: any[];
            };
            X: {
                index: number;
                keys: any[];
            };
            Y: {
                index: number;
                keys: any[];
            };
            START: {
                index: number;
                keys: any[];
            };
            BACK: {
                index: number;
                keys: any[];
            };
            L1: {
                index: number;
                keys: any[];
            };
            L2: {
                index: number;
                keys: any[];
            };
            R1: {
                index: number;
                keys: any[];
            };
            R2: {
                index: number;
                keys: any[];
            };
        };
        GAMEPAD: {
            X: {
                index: number;
                key: number;
            };
            Y: {
                index: number;
                key: number;
            };
            A: {
                index: number;
                key: number;
            };
            B: {
                index: number;
                key: number;
            };
            START: {
                index: number;
                key: number;
            };
            BACK: {
                index: number;
                key: number;
            };
            L1: {
                index: number;
                key: number;
            };
            L2: {
                index: number;
                key: number;
            };
            R1: {
                index: number;
                key: number;
            };
            R2: {
                index: number;
                key: number;
            };
        };
        bgmVolume: number;
        bgsVolume: number;
        seVolume: number;
        tsVolume: number;
    };
    /**
     * 判断系统按键是否按下
     * @param keyCode 按键值
     * @param keyInfo 对应 GUI_Setting.KEY_BOARD
     * @return [boolean]
     */
    static IS_KEY(keyCode: number, keyInfo: {
        keys: number[];
    }): boolean;
    /**
     * 判断系统方向键是否已按下
     * @return [boolean]
     */
    static get IS_KEY_DOWN_DirectionKey(): boolean;
    private initKeyboardSetting;
    /**
     * 刷新显示全部按键信息列表
     */
    private refreshKeyboardList;
    /**
     * 等待输入按键
     * @param keyIndex 按键位置 0-第一个按键 1-第二个按键
     */
    private openWaitInputKeyboard;
    /**
     * 关闭等待输入按键
     */
    private closeWaitInputKeyboard;
    /**
     * 当设置按键按下时
     */
    private onSetKeyboard;
    /**
     * 当设置按键按下时（快捷键呼出）
     * @param e
     */
    private onSetKeyboardByHotKey;
    /**
     * 重置按键
     */
    private resetKeyboard;
    private initGamepadSetting;
    /**
     * 刷新显示全部按键信息列表
     */
    private refreshGamepadList;
    /**
     * 获取键盘按键名
     * @param key 键位
     * @return [string]
     */
    private getGamepadName;
    /**
     * 等待输入按键
     * @param keyIndex 按键位置 0-第一个按键 1-第二个按键
     */
    private openWaitInputGamepad;
    /**
     * 关闭等待输入按键
     */
    private closeWaitInputGamepad;
    /**
     * 当设置按键按下时
     */
    private onSetGamepad;
    /**
     * 当设置按键按下时（快捷键呼出）
     * @param e
     */
    private onSetGamepadByHotKey;
    /**
     * 重置按键
     */
    private resetGamepad;
    /**
     * 同步LIST内置按键
     */
    private static syncListKeyDownSetting;
    /**
     * 获取键盘按键名
     * @param key 键位
     * @return [string]
     */
    static getKeyBoardName(key: number): string;
    /**
        * 根据标签类别刷新焦点
        */
    private refreshFocus;
    /**
     * 取消输入
     */
    private cancelInputKey;
}
/**
 * 商店界面
 * Created by 七星瓢虫 on 2020-10-07 21:21:25.
 */
declare class GUI_Shop extends GUI_11 {
    /**
     * 商店事件数据：从「打开商店」事件中获取
     */
    shopEventData: CustomCommandParams_2012;
    /**
     * 焦点状态：0-购买/出售列表 1-购买/出售区域
     */
    private focusState;
    /**
     * 原本禁用菜单状态
     */
    private preMenuEnabled;
    /**
     * 原本禁止玩家操控状态
     */
    private prePlayCtrlEnabled;
    /**
     * 记录type
     */
    private preTypeTabItem;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 界面监听事件列表
     */
    listenQueue(): void;
    /**
     * 初始化商品列表
     */
    initGoodsList(): void;
    /**
     * 显示界面时
     */
    private onDisplay;
    /**
     * 隐藏界面时
     */
    private onUndisplay;
    /**
     * 选中商品时
     */
    onGoodsClick(): void;
    /**
     * 选中待售品时
     */
    onSellItemClick(): void;
    /**
     * 当购买出售类别改变时处理
     */
    private onTypeTabChange;
    private onKeyDown;
    /**
     * 右键鼠标按下时
     */
    private onRightMouseDOwn;
    /**
     * 使用按钮减少1个购买或卖出数量
     */
    private onSubNumChange;
    /**
     * 使用按钮增加1个购买或卖出数量
     */
    private onAddNumChange;
    /**
     * 使用按钮最大化购买或卖出数量
     */
    private onMaxNumChange;
    /**
     * 使用按钮确认购买或卖出
     */
    private onSureNumChange;
    /**
     * 使用按钮取消购买或卖出
     */
    private onCancelNumChange;
    /**
     * 更改购买或卖出的数量
     */
    private changeBuyOrSellNum;
    /**
     * 购买商品
     */
    private buyGoods;
    /**
     * 减少库存
     */
    private reduceGoodsNum;
    /**
     * 出售商品
     */
    private sellItem;
    /**
     * 刷新商品列表显示效果
     */
    private refreshGoodsListView;
    /**
     * 刷新待售列表显示效果
     */
    private refreshSellItemListView;
    /**
     * 刷新道具详情
     */
    private refreshItemInfo;
    private clearItemInfo;
    /**
     * 刷新持有数量
     */
    private refreshItemInPackage;
    /**
     * 刷新购买数量
     */
    private refreshBuyNum;
    /**
     * 刷新出售数量
     */
    private refreshSellNum;
    /**
     * 刷新待售列表
     */
    refreshSellItemList(): void;
}
/**
 * 虚拟键盘
 * Created by 黑暗之神KDS on 2022-03-11 20:28:26.
 */
declare class GUI_VirtualKeyboard extends GUI_12 {
    /**
     * 事件：摇杆四方向 onVirtualKeyboardDir4Change(dir:number) dir=2下 4左 6右 8上 0-无
     */
    static VIRTUALKEYBOARD_DIR4_CHANGE: string;
    /**
     * 单例
     */
    static self: GUI_VirtualKeyboard;
    /**
     * 摇杆中心点
     */
    private rockerCenterPoint;
    /**
     * 记录上次的方向键值
     */
    private lastMenuDir;
    /**
     * 摇杆半径
     */
    private rockerR;
    private touchId;
    /**
     * 开始进入到游戏内容区域外标识
     */
    private startWindowMouseUpToStopDragRokered;
    /**
     * 移动端-可视区域外仍然可操作相关参数
     */
    private lockRockerMouseX;
    private lockRockerMouseY;
    private startClientX;
    private startClientY;
    private startRockerBgMouseX;
    private startRockerBgMouseY;
    constructor();
    /**
     * 初始化
     */
    private init;
    /**
     * 开始拖拽摇杆
     * @param e
     */
    private startDragRocker;
    /**
     * 停止拖拽摇杆
     * @param e
     */
    private stopDragRocker;
    /**
     * 更新摇杆
     */
    private updateRocker;
    private onVirtualKeyboardMenuDirChange;
    private startBeyondBoundariesHandle;
    private endBeyondBoundariesHandle;
    private doCheckBeyondBoundaries;
    private startWindowMouseUpToStopDragRoker;
    private doWindowMouseUpToStopDragRoker;
    private get mouseMoveType();
    private get mouseUpType();
    /**
     * 获取ClientX
     */
    private getClientX;
    /**
     * 获取touchObject根据touchID
     * @param touchId
     */
    private getClientY;
    /**
     * 获取touchObject根据touchID
     * @param touchId
     */
    private getChangedTouches;
    /**
     * 是否使用触碰实现
     */
    private get isUseTouch();
    private get isNativeAPP();
}
//# sourceMappingURL=Game.d.ts.map