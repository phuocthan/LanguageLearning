import CharacterBase from "./Character/CharacterBase";
import EventManager, { EventType } from "./EventManager";
import NPCManager from "./NPCManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainCharacter extends CharacterBase {

    // @property
    // ngcType = '';

    isLocalPlayer: boolean = true;

    onCollisionEnter(selfCollider, otherCollider){

        //   console.log("collected otherCollider ", otherCollider.node);
        //   console.log("collected selfCollider ", selfCollider.node);
        const npc: NPCManager = selfCollider.node.getComponent(NPCManager);
        console.log("collected npc ", npc);
        EventManager.getInstance().emit(EventType.MEET_NPC, {npcType: npc.ngcType})
        this.setWaittingStatus(true);
        // this.moveAnim.stop();
          
    }

    onLoad() {
        super.onLoad();
        // this.moveAnim.stop();
        cc.systemEvent.on(EventType.MEET_END, this.onMeetEnd.bind(this), this)
    }

    onMeetEnd() {
        this.setWaittingStatus(false);
    }
    

    
}
