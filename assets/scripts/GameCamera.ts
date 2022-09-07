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

    start() {

    }



    needFollow = true;
    protected lateUpdate(dt: number): void {
        if (!this.needFollow) {
            return
        }
        const followPos = this.followTargetNode.getPosition();
        const newPosX = cc.misc.clampf(followPos.x, -this.limitNode.width / 2 + 1280 / 2, this.limitNode.width / 2 - 1280 / 2)
        const newPosY = cc.misc.clampf(followPos.y, -this.limitNode.height / 2 + 720 / 2, this.limitNode.height / 2 - 720 / 2)
        this.node.setPosition(newPosX, newPosY)

        // Utils.setWorldPos(this.node, followNodeWPos);
    }

    focusOn(pos: cc.Vec2) {
        this.node.setPosition(pos)
        this.needFollow = false;
        console.log('@@@@ focusOn ', pos)
    }

    focusOf() {
        this.needFollow = true;
    }

    update(dt) { }
}
