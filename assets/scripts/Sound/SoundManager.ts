import SoundChannel, { FADE } from "./SoundChannel";
import SoundID from "./SoundID";

const { ccclass, property } = cc._decorator;
export enum AudioClips {
    background_music,
    click_sfx,
    right_sfx,
    wrong_sfx,
}

const ENGINE_CHANNEL = 3;
export enum SOUND_INDEX {
    CHANNEL,
    VOLUME,
    PRIORITY,
    LENGTH
}
const MAX_TICKET_NUMBER = 6
@ccclass
export default class SoundManager extends cc.Component {
    public SOUND_INFO =
        [
            //Channel (0 -10) , Volume (0-1), Priority(0-10),
            0, 1, 0, // click_sfx
            1, 1, 0,// dice_roll_sfx,
            2, 1, 0,// mm_show_coint_sfx
            3, 1, 0,// mm_done_sfx
        ];

    musicChannel: cc.AudioSource = null;
    @property(Boolean)
    useSound: boolean = true;

    public static inst: SoundManager = null;

    @property({ type: cc.AudioClip })
    background_music: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    click_sfx: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    right_sfx: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    wrong_sfx: cc.AudioClip = null;

    SoundIDs: SoundID[] = [];
    _channels: SoundChannel[] = [];
    _channelLength: number = 0;

    static isMusicOn = true;
    onLoad() {
        // if (SoundManager.inst! =null) {
        //     console.error("Too many Sound Managers");
        //     return;
        // }

        SoundManager.inst = this;



    }
    public isSoundPlaying(ID: number) {
        var state = cc.audioEngine.getState(ID);
        if (state == cc.audioEngine.AudioState.PLAYING) {
            return true;
        }
        return false;
    }

    public stopMusic() {
        cc.audioEngine.stopMusic();

    }
    public playStartScreenMusic() {
    }
    public playGameMusic() {
        this.playSound(AudioClips.background_music, 50, true);
    }

    public stopGameMusic() {
        // this.stopSound()
    }

    start() {
        this._channelLength = this.SOUND_INFO.length / SOUND_INDEX.LENGTH + MAX_TICKET_NUMBER;
        // console.log('this._channelLength ',this._channelLength)
        for (let i = 0; i < this._channelLength; i++) {
            this._channels.push(new SoundChannel(i));
        }
    }


    private _playSFX(clip: cc.AudioClip, volume: number, loop: boolean) {
        let id = null;

        if (clip != null && this.useSound) {
            id = cc.audioEngine.play(clip, loop || false, 1);
            cc.audioEngine.setVolume(id, volume);
        }
        // cc.log('id ',id);
        return id;
    }
    public onComplete(id: number, cb: Function) {
        cc.audioEngine.setFinishCallback(id, cb);
    }
    getDuration(audioEnum) {
        cc.audioEngine.getDuration(audioEnum);
    }
    public playSound(audioEnum: number, volume?: number, loop?: boolean) {
        if (!volume || volume > 1) volume = 1;
        if (volume < 0) volume = 0;
        //cc.log('audio:',Utils.enumToString(AudioClips,audioEnum),'volume:',volume);
        let clip = this[this.enumToString(AudioClips, audioEnum)];
        if (Array.isArray(this[this.enumToString(AudioClips, audioEnum)])) {
            clip = this.randomArr(this[this.enumToString(AudioClips, audioEnum)])
        }
        let id = this._playSFX(clip, volume, loop);
        // console.log('Play sound ',this.enumToString(AudioClips,audioEnum) +' have Duration: ',this.getDuration(id));

        return id;
    }
    enumToString(enumType, value) {

        for (var k in enumType) if (enumType[k] == value) {
            return k;
        }
        return null;

    }
    randomArr(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    };
    public stopSound(audioId) {
        cc.audioEngine.stopEffect(audioId)
    }

    public setVolume(audioId: number, volume: number) {
        if (volume < 0) volume = 0;
        cc.audioEngine.setVolume(audioId, volume);
    }
    public getVolume(audioId: number): number {
        return cc.audioEngine.getVolume(audioId);
    }
    getFreeChannel() {
        for (let i = 2; i < this._channelLength; i++) {
            if (!this._channels[i].isPlaying()) {
                return i;
            }
        }
        return 0;
    }
    public playSFX(clip: AudioClips, loop: boolean = false, force: boolean = false, fade = FADE.NA): SoundChannel {
        let c = this.SOUND_INFO[clip * (SOUND_INDEX.LENGTH) + SOUND_INDEX.CHANNEL];
        let v = this.SOUND_INFO[clip * (SOUND_INDEX.LENGTH) + SOUND_INDEX.VOLUME];
        this._channels[c].play(clip, v, loop, force, fade);
        return this._channels[c];
    }

    public isPlayingSFX(clip: AudioClips) {
        for (let i = 0; i < this._channelLength; i++) {
            let c = this._channels[i];
            if (c.getClip() == clip && c.isPlaying()) {
                return true;
            }
        }
        return false;
    }
    public stopSFX(clip: AudioClips) {
        for (let i = 0; i < this._channelLength; i++) {
            let c = this._channels[i];
            if (c.getClip() == clip && c.isPlaying()) {
                c.stop();
                break;
            }
        }
    }
    public stopSFXByChannel(index: number) {

        let c = this._channels[index];
        if (c.isPlaying()) {
            c.stop();
        }
        // console.log('stop Chanel ',index);
    }
    public stopAllSFX() {
        // cc.log("Stop all SFX");
        for (let i = 0; i < this._channelLength; i++) {
            let c = this._channels[i];
            if (c.isPlaying()) {
                c.stop();
            }
        }
    }
    update(dt) {
        if (this.useSound) {
            this._channels.forEach(e => {
                if (e) {
                    e.update();
                }
            });
        }
    }

    playClickSFX() {
        this.playSFX(AudioClips.click_sfx);
    }

    playCorrect(){
        this.playSFX(AudioClips.right_sfx);
    }

    playInCorrect(){
        this.playSFX(AudioClips.wrong_sfx);
    }


    soundOn_Off() {
        this.useSound = !this.useSound;
        if (!this.useSound) {
            this.stopAllSFX();
        }
        // this.playSFX(AudioClips.click_sfx);
    }

}
