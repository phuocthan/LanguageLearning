const { ccclass, property } = cc._decorator;
export enum EventType {
  MEET_NPC = 'MEET_NPC',
  ADD_SCORE = 'ADD_SCORE',
  END_HELP = 'END_HELP',
  MEET_END = 'MEET_END',
}

@ccclass
export default class EventManager extends cc.Component {
  private static _ist : EventManager = null;
  public static getInstance() : EventManager {
    return EventManager._ist
  }
  protected onLoad(): void {
    EventManager._ist = this;
  }

  public emit(event: EventType, param) {
    let e = new cc.Event.EventCustom(event, true);
    e.detail = param;
    cc.systemEvent.dispatchEvent(e);
  }
  
}
