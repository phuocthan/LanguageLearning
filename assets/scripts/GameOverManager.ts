import ScreenBase, { SCREEN_ID } from "./ScreenBase";
import ScreenManager from "./ScreenManager";
import SoundManager from "./Sound/SoundManager";
import { UserInfo } from "./UserInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverManager extends ScreenBase {


    @property(cc.Label)
    yourPoints: cc.Label = null;


    show() {
        this.yourPoints.string = '' + UserInfo.lastScore;
    }

    onMainMenuBtnClick() {
        ScreenManager._inst.showScreen(SCREEN_ID.MAINMENU);
        SoundManager.inst.playClickSFX();
    }

    onPlayAgainBtnClick() {
        ScreenManager._inst.showScreen(SCREEN_ID.GAMEPLAY);
        SoundManager.inst.playClickSFX();
    }
    
}
