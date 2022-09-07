import AskForHelp from "./AskForHelp";
import CharacterBase from "./Character/CharacterBase";
import { EventType } from "./EventManager";
import GameCamera from "./GameCamera";
import NPCManager from "./NPCManager";
import ScreenBase from "./ScreenBase";
import { Utils } from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlayManager extends ScreenBase {

    @property(cc.Prefab)
    NPCPrefab: cc.Prefab[] = [];

    @property(cc.Node)
    mainChar: cc.Node = null;
    curNPC: NPCManager = null;

    @property(cc.Node)
    askHelpNode: cc.Node = null;

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        this.starNewGame();
        cc.systemEvent.on(EventType.MEET_NPC, this.onMeetNPC.bind(this), this)
    }

    // isMeetRed = false;
    onMeetNPC(npc) {
        console.log('@@@@ onMeetNPC ',npc)
        const isMeetRed = npc.detail.npcType === 'Red';
        this.showAskHelp(isMeetRed);
        // GameCamera._inst.focusOn(cc.v2(this.mainChar.x/2 + this.curNPC.node.x/2, this.mainChar.y/2 + this.curNPC.node.y/2))
    }

    showAskHelp(isMeetRed) {
        this.askHelpNode.active = true;
        this.askHelpNode.getComponent(AskForHelp).show(isMeetRed)
    }


    spawnNPC() {
        if ( this.curNPC ) {
            return;
        }
        let rand = Utils.randomRange(0, this.NPCPrefab.length-1, true);
        let newPNC = cc.instantiate(this.NPCPrefab[rand]);
        // this.node.addChild(newPNC, this.mainChar.getSiblingIndex());
        newPNC.parent = this.node.getChildByName('NPC');
        this.curNPC = newPNC.getComponent(NPCManager);
        // random pos
        let newPosX = Utils.randomRange(-2250/2 + 50, 2250/2 - 50)
        let newPosY = Utils.randomRange(-1380/2 + 50, 1380/2 - 50)
        newPNC.setPosition(newPosX, newPosY);
        newPNC.opacity = 0;
        cc.tween(newPNC)
        .to(1, {opacity: 255})
        .start();
        
    }

    starNewGame() {
        this.spawnNPC();
    }
}
