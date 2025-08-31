














var ProjectGame = (function (_super) {
    __extends(ProjectGame, _super);
    function ProjectGame() {
        var _this_1 = _super.call(this) || this;
        EventUtils.addEventListenerFunction(GameGate, GameGate.EVENT_IN_SCENE_STATE_CHANGE, _this_1.onInSceneStateChange, _this_1);
        return _this_1;
    }
    ProjectGame.prototype.init = function () {
        this.player = new ProjectPlayer();
        EventUtils.addEventListenerFunction(Game, Game.EVENT_PAUSE_CHANGE, this.onPauseChange, this);
    };
    Object.defineProperty(ProjectGame.prototype, "gameTime", {
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
    ProjectGame.prototype.onInSceneStateChange = function (inNewSceneState) {
        if (GameGate.gateState == GameGate.STATE_0_START_EXECUTE_LEAVE_SCENE_EVENT) {
            if (inNewSceneState == 1) {
                ProjectGame.gameStartTime = new Date();
            }
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
//# sourceMappingURL=ProjectGame.js.map