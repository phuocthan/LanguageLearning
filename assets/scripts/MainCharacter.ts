import CharacterBase from "./Character/CharacterBase";
import EventManager, { EventType } from "./EventManager";
import NPCManager from "./NPCManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainCharacter extends CharacterBase {

    isLocalPlayer: boolean = true;

    onCollisionEnter(selfCollider, otherCollider) {
        const npc: NPCManager = selfCollider.node.getComponent(NPCManager);
        EventManager.getInstance().emit(EventType.MEET_NPC, { npcType: npc.ngcType })
        this.setWaittingStatus(true);
    }

    onLoad() {
        super.onLoad();
        cc.systemEvent.on(EventType.MEET_END, this.onMeetEnd.bind(this), this)
    }

    onMeetEnd() {
        this.setWaittingStatus(false);
    }



}
