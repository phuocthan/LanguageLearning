import { EventType } from "./EventManager";
import MainCharacter from "./MainCharacter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerTouchManager extends cc.Component {

    @property(MainCharacter)
    mainChar: MainCharacter = null;

    @property(cc.Node)
    dpad: cc.Node = null;
    public static _inst: PlayerTouchManager = null;
    @property(cc.Sprite)
    touchSpriteNode: cc.Sprite[]  = []

    
    onLoad() {
        PlayerTouchManager._inst = this;
        this.dpad.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this), this);
        this.dpad.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this), this);
        this.dpad.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this), this);
    }

    startPos : any;
    curPos : any;

    unHighlightAll() {
        this.touchSpriteNode.forEach( spr => {
            spr.enabled = false;
        })
    }
    _onTouchStart(event: cc.Touch) {
        this.unHighlightAll();
        let moveDir = -1;
        const localPos = event.getLocation();
        this.touchSpriteNode.forEach((spr, i) => {
            const wPosRect = spr.node.getBoundingBoxToWorld();
            const isTouched = wPosRect.contains(localPos);
            if ( isTouched) {
                console.log( '@@@@ isTouched ', i)
                moveDir = i;
            }
        })
        if ( moveDir === - 1) {
            return;
        }
        this.touchSpriteNode[moveDir].enabled = true;
        this.startPos = localPos;
        switch(moveDir) {
            case 0:
                this.mainChar.moveLeft();
                break;
            case 1:
                this.mainChar.moveRight();
                break;
            case 2:
                this.mainChar.moveUp();
                break;
            case 3:
                this.mainChar.moveDown();
                break;
            default:
                this.mainChar.stopMove();
                break;
        }
        // this.mainChar.moveLeft();
    }
    _onTouchMove(event: cc.Touch) {
        // this.curPos =this.startPos;
        // // this.curPos = this.curPos || this.startPos;
        // const localPos = event.getLocation();
        // let distanceX = localPos.x - this.curPos.y;
        // let distanceY = localPos.y - this.curPos.y
        // if (Math.abs(distanceX) > Math.abs(distanceY)) {
        //     distanceX >= 0 ? this.mainChar.moveRight() : this.mainChar.moveLeft();
        // } else {
        //     distanceY >= 0 ? this.mainChar.moveUp() : this.mainChar.moveDown();
        // }
        // this.curPos = localPos;
    }
    _onTouchEnd(event: cc.Touch) {
        const localPos = event.getLocation();
        this.mainChar.stopMove();
        this.unHighlightAll();
    }

}
