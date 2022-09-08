import AskForHelp from "./AskForHelp";
import CharacterBase from "./Character/CharacterBase";
import DialogManager from "./DialogManager";
import { EventType } from "./EventManager";
import GameCamera from "./GameCamera";
import { GAME_CONFIG } from "./GameDefs";
import NPCManager from "./NPCManager";
import ScreenBase, { SCREEN_ID } from "./ScreenBase";
import ScreenManager from "./ScreenManager";
import { UserInfo } from "./UserInfo";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlayManager extends ScreenBase {

    @property(cc.Prefab)
    NPCPrefab: cc.Prefab[] = [];

    @property(cc.Node)
    mainChar: cc.Node = null;
    curNPC: NPCManager = null;

    @property(cc.Node)
    askHelpNode: cc.Node = null;

    @property(cc.Node)
    dialogNode: cc.Node = null;
    curPoints: number;

    @property(cc.Prefab)
    dialogPrefab: cc.Prefab = null;

    @property(cc.Label)
    pointLbl: cc.Label = null;

    @property(cc.Label)
    timerLabel: cc.Label = null;

    startTimer: number;
    endTimer: number;

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.systemEvent.on(EventType.MEET_NPC, this.onMeetNPC.bind(this), this)
        cc.systemEvent.on(EventType.MEET_END, this.onMeetEndNPC.bind(this), this)
        cc.systemEvent.on(EventType.SEND_RESULT, this.onReceivedResult.bind(this), this)
    }

    show(): void {
        this.starNewGame();
    }


    onReceivedResult(data) {
        const isCorrect = data.detail.result;
        cc.systemEvent.emit(EventType.MEET_END);
        if (isCorrect) {
            this.updatePoints(GAME_CONFIG.CORRECT_ANSWER_POINT);
        }
    }

    updatePoints(addPoint) {
        this.curPoints += addPoint;
        UserInfo.bestScore = Math.max(UserInfo.bestScore, this.curPoints)
        this.updatePointText();
    }

    updatePointText() {
        this.pointLbl.string = 'Points: ' + this.curPoints;
    }

    onMeetEndNPC() {
        this.curNPC.getComponent(cc.Collider).enabled = false;
        cc.tween(this.curNPC.node)
            .to(0.5, { opacity: 0 }).call(() => {
                this.curNPC.node.removeFromParent();
                this.curNPC.node.active = false;
                this.curNPC.node = null;
                this.curNPC = null;
                this.spawnNPC();
                this.pauseTimer = false;
            })
            .start();
    }
    isMeetRed = false;
    pauseTimer = false;
    onMeetNPC(npc) {
        this.isMeetRed = npc.detail.npcType === 'Red';
        this.showAskHelp(this.isMeetRed);
        this.pauseTimer = true;
    }

    showAskHelp(isMeetRed) {
        this.askHelpNode.active = true;
        this.askHelpNode.getComponent(AskForHelp).show(isMeetRed, this.showDialog.bind(this))
    }

    showDialog() {
        this.askHelpNode.active = false;
        this.dialogNode.removeFromParent();
        this.dialogNode = cc.instantiate(this.dialogPrefab);
        this.dialogNode.parent = this.node;
        this.dialogNode.active = true;
        this.dialogNode.getComponent(DialogManager).show(this.isMeetRed)
    }


    spawnNPC() {
        if (this.curNPC) {
            return;
        }
        let rand = Utils.randomRange(0, this.NPCPrefab.length - 1, true);
        let newPNC = cc.instantiate(this.NPCPrefab[rand]);
        newPNC.parent = this.node.getChildByName('NPC');
        this.curNPC = newPNC.getComponent(NPCManager);
        let pickedNPC = false
        let newPosX;
        let newPosY;
        // random pos and keep distance with mainChar
        while (!pickedNPC) {
            newPosX = Utils.randomRange( -GAME_CONFIG.MAP_WIDTH / 2 + 50, GAME_CONFIG.MAP_WIDTH / 2 - 50)
            newPosY = Utils.randomRange( -GAME_CONFIG.MAP_HEIGHT/ 2 + 50, GAME_CONFIG.MAP_HEIGHT / 2 - 50)
            if (Math.abs(newPosX - this.mainChar.x) / 2 > GAME_CONFIG.MIN_DISTANCE_ALLOW) {
                pickedNPC = true;
            }
        }
        newPNC.setPosition(newPosX, newPosY);
        newPNC.opacity = 0;
        cc.tween(newPNC)
            .to(1, { opacity: 255 })
            .start();

    }

    starNewGame() {
        this.curPoints = 0
        this.spawnNPC();
        this.updatePointText();
        this.startTimer = Date.now();
        this.endTimer = Date.now() + GAME_CONFIG.GAME_DURATION_TIME;
        this.isGameOver = false;
        this.mainChar.setPosition(0, 0);
    }

    updateTimer() {

        let remainTime = Math.floor((this.endTimer - this.startTimer) / 1000);
        if (remainTime < 0) {
            remainTime = 0;
        }
        this.timerLabel.string = '' + remainTime;
    }

    gameOver() {
        UserInfo.lastScore = this.curPoints;
        ScreenManager._inst.showScreen(SCREEN_ID.GAMEOVER);
    }

    isGameOver = false;
    update(dt) {
        if (this.pauseTimer || this.isGameOver) {
            return;
        }
        this.startTimer += dt * 1000;

        this.updateTimer();
        if (this.startTimer >= this.endTimer) {
            this.isGameOver = true;
            this.gameOver();
        }
    }
}
