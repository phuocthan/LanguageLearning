export class UserInfo {

    public static setKey(key: string, value: any) {
        cc.sys.localStorage.setItem(key, value);
    }

    public static getKey(key: string, defaulValue: any) {
        let result;
        try {
            result = cc.sys.localStorage.getItem(key);
            
        } catch (error) {
            result = defaulValue;
        }
        if (result === '' || result === null || result === undefined) {
            result = defaulValue;
        }
        return result;        
    }    

    private static _userName = '';
    public static get userName(): string {
        let name = '';
        try {
            name = UserInfo.getKey('userName', '');
        } catch (error) {
           
            name = '';
        }
        return name;
    }
    public static set userName(v: string) {
        UserInfo.setKey('userName', v);
        UserInfo._userName = v;
    }

    private static _bestScore = 0;
    public static get bestScore() {
        if (UserInfo._bestScore === 0) {
            UserInfo._bestScore = UserInfo.getKey('_bestScore', 0)
        }
        return UserInfo._bestScore;
    }
    public static set bestScore(value) {
        UserInfo.setKey('_bestScore', value);
        UserInfo._bestScore = value;
    }

    private static _lastScore = 0;
    public static get lastScore() {
        if (UserInfo._lastScore === 0) {
            UserInfo._lastScore = UserInfo.getKey('_lastScore', 0)
        }
        return UserInfo._lastScore;
    }
    public static set lastScore(value) {
        UserInfo.setKey('_lastScore', value);
        UserInfo._lastScore = value;
    }
    
}