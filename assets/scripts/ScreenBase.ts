const {ccclass, property} = cc._decorator;
export enum SCREEN_ID {
    MAINMENU,
    GAMEPLAY,
    GAMEOVER,
}

@ccclass
export default class ScreenBase extends cc.Component {
    // @property(typeof)
    // screenID: SCREEN_ID = null;
    show() {

    }

    hide() {

    }
}
