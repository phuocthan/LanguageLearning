import CharacterBase from "./Character/CharacterBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NPCManager extends CharacterBase {

    type = '';

    @property
    ngcType = '';

    onLoad() {
        this.type = this.ngcType;
        super.onLoad();
    }

    isLocalPlayer: boolean = false;
    
}
