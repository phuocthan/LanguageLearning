import EventManager, { EventType } from "./EventManager";
import { UserInfo } from "./UserInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogManager extends cc.Component {

    @property(cc.RichText)
    askHelp: cc.RichText = null;

    @property(cc.RichText)
    helpNPCLbl: cc.RichText = null;

    @property(cc.RichText)
    helloMain: cc.RichText = null;

    @property(cc.SpriteFrame)
    redNPC: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    blueNPC: cc.SpriteFrame = null;

    @property(cc.Sprite)
    npcSprite: cc.Sprite = null;

    @property(cc.Sprite)
    answerSprite: cc.Sprite = null;

    @property(cc.Sprite)
    answerSprs: cc.Sprite[] = [];

    @property(cc.Label)
    answerLbls: cc.Label[] = [];

    @property(cc.Node)
    addPoints: cc.Node = null;

    onLoad() {
        this.show(!true);
    }

    helpString = '<b> <color=#ffffff>Do you want to help</c> %d </color>';
    helloRed = '<color=#000000>What would you like to do with</c><color=#ff0000><b> Red Grunt</c>'
    helloBlue = '<color=#000000>What would you like to do with</c><color=#0000ff><b> Blue Grunt</c>'

    askHelpText = '<color=#000000>Please</c><color=#0000ff><b> ___</c><color=#000000> me</c>'
    anwserTexts = [];
    correctAnswer = 'Feed';

    show(isRedNPC) {
        // let helpText = this.helpString;
        // helpText = helpText.replace( '%d', isRedNPC ? '<color=#ff0000><b> Red Grunt' : '<color=#0000ff> Blue Grunt');
        // this.askHelp.string = helpText;
        this.helpNPCLbl.string = isRedNPC ? this.helloRed : this.helloBlue;
        // this.npcHelloLbl.string = isRedNPC ? this.helloRed : this.helloBlue;
        // this.helloMain.string = '<color=#000000>Hello</c><color=#000000><b> ' + UserInfo.userName + '!!!</c>';
        
        this.npcSprite.spriteFrame = isRedNPC ? this.redNPC : this.blueNPC;
        this.anwserTexts = isRedNPC ?  ['Help', 'Find', 'Pet'] : ['Feed', 'Play with', 'Ignore']
        this.correctAnswer = isRedNPC ?  'Help' : 'Feed'
        this.answerLbls.forEach( (label, idx) => {
            label.string = '-  ' + this.anwserTexts[idx];
        })

    }

    pickedAnswer = false;

    onAnwserClick(event, customEvent) {
        if (this.pickedAnswer) {
            return;
        }
        const index = parseInt(customEvent);
        this.answerSprs[index].enabled = true;
        this.pickedAnswer = true;
        setTimeout( () => {
            let helpText = this.askHelpText;
            helpText = helpText.replace( '___', this.anwserTexts[index])
            this.askHelp.string = helpText;
            this.checkResult(this.anwserTexts[index])
        } , 500)
    }

    private readonly _rightColor = new cc.Color(0, 255, 0);
    private readonly _wrongColor = new cc.Color(255, 63, 63);
    checkResult(anwser) {
        setTimeout( () => {
        const isCorrect = anwser === this.correctAnswer;
        this.answerSprite.node.color = isCorrect ? this._rightColor : this._wrongColor;
        this.askHelp.string = isCorrect? '<color=#000000>Thank you so much!</c>' : '<color=#000000>Ops, wrong anwser, please try again!</c>'
        if ( isCorrect) {
            this.addPoints.active = true;
        }
        setTimeout( () => {
            this.sendResult(isCorrect)
          } , 500)
      } , 500)
    }

    sendResult(isCorrect) {
        EventManager.getInstance().emit(EventType.SEND_RESULT, {result: isCorrect});
        setTimeout( () => {
            this.node.active = false;
            this.node.removeFromParent();
          } , 750)
    }
}
