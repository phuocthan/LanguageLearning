import { AudioClips } from "./SoundManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundID {

    /**
     *
     */
    _clip : AudioClips;
    _id : number = -1;
    constructor(clip : AudioClips) {
        
        this._clip = clip; 
    }
    setPlayID(id : number)
    {
        this._id = id;
    }
    getClip()
    {
        return this._clip;
    }
    getPlayID()
    {
        return this._id;
    }

    // update (dt) {}
}
