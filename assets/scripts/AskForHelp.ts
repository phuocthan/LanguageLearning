import { EventType } from "./EventManager";
import SoundManager from "./Sound/SoundManager";
import { UserInfo } from "./UserInfo";

const { ccclass, property } = cc._decorator;

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

    yesFnc: any;

    onYesBtnClick() {
        this.yesFnc && this.yesFnc();
        SoundManager.inst.playClickSFX();
    }

    onNoBtnClick() {
        this.node.active = false;
        cc.systemEvent.emit(EventType.MEET_END);
        SoundManager.inst.playClickSFX();
    }

    helpString = '<b> <color=#ffffff>Do you want to help</c> %d </color>';
    helloRed = '<color=#000000>Hello</c><color=#ff0000><b> Red Grunt</c><color=#000000> , how are you?</color>';
    helloBlue = '<color=#000000>Hello</c><color=#0000ff><b> Blue Grunt</c><color=#000000> , how are you?</color>';


    show(isRedNPC, yesFnc) {
        let helpText = this.helpString;
        helpText = helpText.replace('%d', isRedNPC ? '<color=#ff0000><b> Red Grunt' : '<color=#0000ff> Blue Grunt');
        this.askHelp.string = helpText;
        
        this.npcHelloLbl.string = isRedNPC ? this.helloRed : this.helloBlue;
        this.helloMain.string = '<color=#000000>Hello</c><color=#000000><b> ' + UserInfo.userName + '!!!</c>';

        this.npcSprite.spriteFrame = isRedNPC ? this.redNPC : this.blueNPC;
        this.yesFnc = yesFnc;
    }
}
