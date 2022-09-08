import { GAME_CONFIG } from "../GameDefs";
import GamePlayManager from "../GamePlayManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CharacterBase extends cc.Component {
    //Action Move direction
    action_move = 0;
    IDLE = 0;
    MOVE_LEFT = 1;
    MOVE_RIGHT = 2;
    MOVE_UP = 3;
    MOVE_DOWN = 4;
    MOVE_COUNT = 5;

    moveDistance = 400;
    type = '';

    isLocalPlayer: boolean = true;

    @property(cc.Animation)
    moveAnim = cc.Animation = null;

    onLoad() {
        if (this.isLocalPlayer) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    }

    stopMove() {
        this.action_move = this.IDLE;
    }

    moveLeft() {
        this.action_move = this.MOVE_LEFT;
        this.node.scaleX = Math.abs(this.node.scale) * -1;
    }

    moveRight() {
        this.action_move = this.MOVE_RIGHT;
        this.node.scaleX = Math.abs(this.node.scale);
    }

    moveDown() {
        this.action_move = this.MOVE_DOWN;
    }

    moveUp() {
        this.action_move = this.MOVE_UP;
    }

    onKeyUp(event) {
        // Reset Action when key up ANY KEY
        this.action_move = this.IDLE;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
            case cc.macro.KEY.a:
                this.moveLeft()
                break;

            case cc.macro.KEY.right:
            case cc.macro.KEY.d:
                this.moveRight()
                break;

            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                this.moveUp();
                break;

            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                this.moveDown();
                break;
        }
    }

    setWaittingStatus(status) {
        this.waittingDialog = status;
    }

    waittingDialog = false;
    update(dt) {

        if (this.waittingDialog) {
            return;
        }
        let newPosX, newPosY = 0;
        newPosX = this.node.x;
        newPosY = this.node.y;
        if (this.action_move == this.MOVE_LEFT) {
            newPosX -= this.moveDistance * dt;
        }
        if (this.action_move == this.MOVE_RIGHT) {
            newPosX += this.moveDistance * dt;
        }
        if (this.action_move == this.MOVE_UP) {
            newPosY += this.moveDistance * dt;
        }
        if (this.action_move == this.MOVE_DOWN) {
            newPosY -= this.moveDistance * dt;
        }

        newPosX = cc.misc.clampf(newPosX, -GAME_CONFIG.MAP_WIDTH / 2 + 50, GAME_CONFIG.MAP_WIDTH / 2 - 50);
        newPosY = cc.misc.clampf(newPosY, -GAME_CONFIG.MAP_HEIGHT / 2 + 50, GAME_CONFIG.MAP_HEIGHT / 2 - 50);
        this.node.setPosition(newPosX, newPosY)
    }


}
