import ScreenBase, { SCREEN_ID } from "./ScreenBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScreenManager extends cc.Component {

    public static _inst: ScreenManager = null;
    @property(cc.Node)
    screenList: cc.Node[] = [];

    @property(cc.Node)
    trans: cc.Node = null;

    onLoad() {
        ScreenManager._inst = this;
        this.trans.active = false;
        this.showScreen(SCREEN_ID.MAINMENU, true);
    }


    hideAll() {
        this.screenList.forEach(screen => {
            screen.getComponent(ScreenBase).hide();
            screen.active = false;
        })
    }

    showScreen( screen: SCREEN_ID, force = false) {
        this.trans.opacity = 0;
        this.trans.active = true;
        const showFnc = () => {
            this.screenList.forEach((s, i) => {
                if (i === screen) {
                    s.active = true;       
                    s.getComponent(ScreenBase).show();
                } else {
                    s.getComponent(ScreenBase).hide();
                    s.active = false;    
                }
            })
        }
        if ( force ) {
            showFnc();
            return;
        }
        cc.tween(this.trans)
        .to( 0.5, {opacity: 255}).call( () => showFnc())
        .to( 0.5, {opacity: 0}).call(() => this.trans.active = false)
        .start();
    }
}
