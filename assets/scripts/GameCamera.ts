import { GAME_CONFIG } from "./GameDefs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCamera extends cc.Component {

    public static _inst: GameCamera = null;
    @property(cc.Node)
    screenList: cc.Node[] = [];

    onLoad() {
        GameCamera._inst = this;
    }

    @property(cc.Node)
    followTargetNode: cc.Node = null;

    @property(cc.Node)
    limitNode: cc.Node = null;


    needFollow = true;
    protected lateUpdate(dt: number): void {
        if (!this.needFollow) {
            return
        }
        const followPos = this.followTargetNode.getPosition();
        const newPosX = cc.misc.clampf(followPos.x, -this.limitNode.width / 2 + GAME_CONFIG.HALF_DESIGN_SCREEN_WIDTH, this.limitNode.width / 2 - GAME_CONFIG.HALF_DESIGN_SCREEN_WIDTH)
        const newPosY = cc.misc.clampf(followPos.y, -this.limitNode.height / 2 + GAME_CONFIG.HALF_DESIGN_SCREEN_HEIGHT, this.limitNode.height / 2 - GAME_CONFIG.HALF_DESIGN_SCREEN_HEIGHT)
        this.node.setPosition(newPosX, newPosY)
    }

    focusOn(pos: cc.Vec2) {
        this.node.setPosition(pos)
        this.needFollow = false;
    }

    focusOf() {
        this.needFollow = true;
    }
}
