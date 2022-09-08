import ScreenBase, { SCREEN_ID } from "./ScreenBase";
import ScreenManager from "./ScreenManager";
import SoundManager from "./Sound/SoundManager";
import { UserInfo } from "./UserInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuManager extends ScreenBase {

    @property(cc.EditBox)
    nameEdit: cc.EditBox = null;

    @property(cc.Label)
    highScoreLbl: cc.EditBox = null;

    onLoad() {
        SoundManager.inst.playGameMusic();
    }

    onEditNameEnd() {
        UserInfo.userName = this.nameEdit.string;
    }

    loadSaveProfile() {
        this.highScoreLbl.string = '' + UserInfo.bestScore;
        this.nameEdit.string = UserInfo.userName;
    }

    show() {
        this.loadSaveProfile();
        console.log('@@@@ MainMenuManager showw')
    }

    onPlayGameBtnClick() {
        ScreenManager._inst.showScreen(SCREEN_ID.GAMEPLAY);
        SoundManager.inst.playClickSFX();
       
    }
}
