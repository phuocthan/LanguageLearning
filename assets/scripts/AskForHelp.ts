import { EventType } from "./EventManager";
import { UserInfo } from "./UserInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AskForHelp extends cc.Component {

    @property(cc.RichText)
    askHelp: cc.RichText = null;

    @property(cc.RichText)
    npcHelloLbl: cc.RichText = null;

    @property(cc.RichText)
    helloMain: cc.RichText = null;

    @property(cc.SpriteFrame)
    redNPC: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    blueNPC: cc.SpriteFrame = null;

    @property(cc.Sprite)
    npcSprite: cc.Sprite = null;

    onYesBtnClick() {

    }

    onNoBtnClick() {
        this.node.active = false;
        // cc.systemEvent.emit(EventType.MEET_END);
    }

    start () {

    }

    onLoad() {
        // this.show(!true);
    }

    helpString = '<b> <color=#ffffff>Do you want to help</c> %d </color>';
    helloRed = '<color=#000000>Hello</c><color=#ff0000><b> Red Grunt</c><color=#000000> , how are you?</color>';
    helloBlue = '<color=#000000>Hello</c><color=#0000ff><b> Blue Grunt</c><color=#000000> , how are you?</color>';

    // helpString = '<color=#ffffff>Do you want to help</c><color=#0fffff> %d </color>'

    show(isRedNPC) {
        let helpText = this.helpString;
        helpText = helpText.replace( '%d', isRedNPC ? '<color=#ff0000><b> Red Grunt' : '<color=#0000ff> Blue Grunt');
        // <color=#0fffff> %d </color>
        // helpText.replace('%d', 'Red')
        this.askHelp.string = helpText;
        this.npcHelloLbl.string = isRedNPC ? this.helloRed : this.helloBlue;
        this.helloMain.string = '<color=#000000>Hello</c><color=#000000><b> ' + UserInfo.userName + '!!!</c>';
        
        this.npcSprite.spriteFrame = isRedNPC ? this.redNPC : this.blueNPC;
        // this.askHelp.string = 
    }
}
