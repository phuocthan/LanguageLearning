const { ccclass } = cc._decorator;

// Best practice is to import what is required:
import { keyBy } from 'lodash';

@ccclass
export class Utils {
  /**
   * find rendom value
   * @param min random start from min
   * @param max to max
   */
  public static findRandom ( min: number, max: number ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  }

  public static testFileExtension ( fileName: string, extension: string ): boolean {
    return fileName.slice( -extension.length ) === extension;
  }

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` thru `iteratee`. The corresponding value of
   * each key is the last element responsible for generating the key. The
   * iteratee is invoked with one argument: (value).
   *
   * @since 4.0.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The iteratee to transform keys.
   * @returns {Object} Returns the composed aggregate object.
   * @see groupBy, partition
   * @example
   *
   * const array = [
   *   { 'dir': 'left', 'code': 97 },
   *   { 'dir': 'right', 'code': 100 }
   * ]
   *
   * keyBy(array, ({ code }) => String.fromCharCode(code))
   * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
   */
  public static keyBy ( collection, keyName ) {
    return keyBy( collection, keyName );
  }

  // JavaScript implementation of Java's String.hashCode() method. Seems reasonably short and very effective.
  // https://stackoverflow.com/a/8831937/1545278
  public static getHash = function ( inputStr: string ): number {
    let hash = 0,
      i,
      chr;
    if ( inputStr.length === 0 ) {
      return hash;
    }
    for ( i = 0; i < inputStr.length; i++ ) {
      chr = inputStr.charCodeAt( i );
      hash = ( hash << 5 ) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  /* display a number to 2 decimal places.
    roundFloat(1.005, 2); // return 1.01
    roundFloat(1.004, 2); // return 1 instead of 1.00 - unlike .toFixed(2)
  */
  public static roundFloat ( value: number, decimals: number ): number {
    return Number( Math.round( Number( value + 'e' + decimals ) ) + 'e-' + decimals );
  }

  public static isFileExistsOnServer ( url: string ): boolean {
    try {
      let http = new XMLHttpRequest();
      http.open( 'HEAD', url, false );
      http.send();
      return http.status !== 404;
    } catch(e) {
      return false;
    }
  }

  public static parseURLParams ( url: string ): { [key: string]: string; } {
    let queryStart = url.indexOf( '?' ) + 1,
      queryEnd = url.indexOf( '#' ) + 1 || url.length + 1,
      query = url.slice( queryStart, queryEnd - 1 ),
      pairs = query.replace( /\+/g, ' ' ).split( '&' ),
      parms = {},
      i,
      n,
      v,
      nv;

    if ( query === url || query === '' ) {
      return parms;
    }

    for ( i = 0; i < pairs.length; i++ ) {
      nv = pairs[i].split( '=', 2 );
      n = decodeURIComponent( nv[0] );
      v = decodeURIComponent( nv[1] );

      parms[n] = nv.length === 2 ? v : null;
    }
    return parms;
  }

  // Is a given variable an object?
  public static isObject ( value: any ): boolean {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  // How many decimals does the given number has
  // e.g.getPrecision(12.3456) // 4
  // https://stackoverflow.com/a/27865285/1545278
  public static getPrecision ( a: number ): number {
    if ( !isFinite( a ) ) {
      return 0;
    }
    let e = 1,
      p = 0;
    while ( Math.round( a * e ) / e !== a ) {
      e *= 10;
      p++;
    }
    return p;
  }

  // Helper function to decide if the game is running
  // on a retina display device
  public static isRetinaDisplay () {
    return cc.sys.isBrowser && window.devicePixelRatio === 2;
  }

  /**
   *  set the animation speed scale of a given node
   */
  public static setAnimationSpeed ( animNode: cc.Node, timescale: number ) {
    if ( !animNode ) {
      return;
    }

    const skeleton: sp.Skeleton = animNode.getComponent( sp.Skeleton );
    if ( skeleton ) {
      skeleton.timeScale = timescale;
    }
  }

  /**
   * Performs a deep merge of objects and returns new object. Does not modify
   * objects (immutable) and merges arrays via concatenation.
   *
   * @param {...object} objects - Objects to merge
   * @returns {object} New object with merged key/values
   */
  public static mergeDeep ( ...objects ) {
    const isObject = ( obj ) => obj && typeof obj === 'object';

    return objects.reduce( ( prev, obj ) => {
      Object.keys( obj ).forEach( ( key ) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if ( Array.isArray( pVal ) && Array.isArray( oVal ) ) {
          prev[key] = pVal.concat( ...oVal );
        } else if ( isObject( pVal ) && isObject( oVal ) ) {
          prev[key] = Utils.mergeDeep( pVal, oVal );
        } else {
          prev[key] = oVal;
        }
      } );

      return prev;
    }, {} );
  }

  /**
   *  get duration of given animation of given node
   */
  public static getAnimationDuration ( animNode: cc.Node, animName: string ) {
    if ( !animNode ) {
      return;
    }
    const skeleton: sp.Skeleton = animNode.getComponent( sp.Skeleton );
    const anim: sp.spine.Animation = skeleton ? skeleton.findAnimation( animName ) : null;
    return anim ? anim.duration : 0.0;
  }

  public static getAnimationDurationBySke ( ske: sp.Skeleton, animName: string ) {
    const anim: sp.spine.Animation = ske ? ske.findAnimation( animName ) : null;
    return anim ? anim.duration : 0.0;
  }

  public static mixMainAnimationWithRunning ( animNode: cc.Node, animName: string, loop: boolean = false, trackIndex = 0) {
    if ( !animNode ) {
      return;
    }

    const skeleton: sp.Skeleton = animNode.getComponent( sp.Skeleton );

    if ( skeleton && !skeleton.findAnimation( animName ) ) {
      cc.error( 'ERROR mixMainAnimationWithRunning - missing animation:', animName );
      return;
    }
    if ( skeleton ) {
      let currentTrack = skeleton.getCurrent( trackIndex );
      let trackTime = currentTrack ? currentTrack.trackTime : 0.0;
      const animTrack = skeleton.setAnimation( trackIndex, animName, loop );
      animTrack.trackTime = trackTime;
    }
  }

  public static addSpineAnimation(skeleton: sp.Skeleton, trackIndex: number, animName: string, loop: boolean = false): any {
    if ( skeleton && skeleton.findAnimation(animName) ) {
      return skeleton.addAnimation(trackIndex, animName, loop);
    }
    return null;
  }

  public static setSpineAnimation(skeleton: sp.Skeleton, trackIndex: number, animName: string,  loop: boolean = false): any {
    if ( skeleton && skeleton.findAnimation(animName) ) {
      return skeleton.setAnimation(trackIndex, animName, loop);
    }
    return null;
  }

  public static getBrowserBrandInfo (): { brandName: string; } {
    if ( !cc.sys.isBrowser ) {
      return null;
    }

    const params = Utils.parseURLParams( window.location.href );
    if ( !( 'brand' in params ) ) {
      return {
        brandName: 'default'
      };
    }

    const brandName = params['brand'];
    return {
      brandName
    };
  }

  public static getBrowserTypeInfo (): { browserType: string; } {
    if ( !cc.sys.isBrowser ) {
      return null;
    }
    const browserType = cc.sys.browserType;
    return {
      browserType
    };
  }

  /**
   * Draw a colorized border on the given node. Only for testing purposes!
   * @param node
   * @param color
   */
  public static drawOuterColorBorder ( node: cc.Node, color: cc.Color = cc.Color.RED ) {
    let drawing = node.getComponent( cc.Graphics );
    if ( !drawing ) {
      drawing = node.addComponent( cc.Graphics );
    }
    drawing.clear();
    drawing.lineWidth = 6;
    drawing.moveTo( -node.width / 2.0, -node.height / 2.0 );
    drawing.lineTo( node.width / 2.0, -node.height / 2.0 );
    drawing.lineTo( node.width / 2.0, node.height / 2.0 );
    drawing.lineTo( -node.width / 2.0, node.height / 2.0 );
    drawing.lineTo( -node.width / 2.0, -node.height / 2.0 );
    drawing.strokeColor = cc.Color.RED;
    drawing.stroke();
  }

  public static isEmptyObject ( obj: Object ) {
    return !obj || ( Object.keys( obj ).length === 0 && obj.constructor === Object );
  }

  public static debounce ( fn, time ) {
    let timeout;

    return function () {
      const args = arguments;
      const functionCall = () => fn.apply( this, args );

      clearTimeout( timeout );
      timeout = setTimeout( functionCall, time );
    };
  }

  public static getAbsoluteURLOnWeb ( relativeUrl ) {
    let link = document.createElement( 'a' );
    link.href = relativeUrl;
    return link.href;
  }

  public static throttle ( callback, wait, immediate = false ) {
    let timeout = null;
    let initialCall = true;

    return function () {
      const callNow = immediate && initialCall;
      const args = arguments;

      const next = () => {
        callback.apply( this, args );
        timeout = null;
      };

      if ( callNow ) {
        initialCall = false;
        next();
      }

      if ( !timeout ) {
        timeout = setTimeout( next, wait );
      }
    };
  }

  /**
   * Return a Cartesian vector converted from given Polar vector
   * @param polar Polar vector
   */
  public static polarToCartesian ( polar: cc.Vec2 ): cc.Vec2 {
    const [len, angle] = [polar.x, polar.y];

    return cc.v2( len * Math.cos( angle ), len * Math.sin( angle ) );
  }

  /**
   * Return a Polar vector converted from given Cartesian vector
   * @param cartesian Cartesian vector
   */
  public static cartesianToPolar ( cartesian: cc.Vec2 ): cc.Vec2 {
    const [x, y] = [cartesian.x, cartesian.y];
    const angle = Math.atan2( y, x );

    return cc.v2( cartesian.len(), angle );
  }

  /**
   * Return a degrees angle of the given Cartesian vector
   * @param vector cartesian vector
   */
  public static angleOfVector ( vector: cc.Vec2 ): number {
    const radian = Math.atan2( vector.y, vector.x );

    return cc.misc.radiansToDegrees( radian );
  }

  public static getWorldPos ( node: cc.Node ) {
    return node.convertToWorldSpaceAR( cc.v2( 0, 0 ) );
  }

  public static setWorldPos ( node: cc.Node, posWS: cc.Vec2 ) {
    node.setPosition( node.parent.convertToNodeSpaceAR( posWS ) );
  }

  public static changeParent(node: cc.Node, newParent: cc.Node) {
    const wPos = Utils.getWorldPos( node );
    const newPos = newParent.convertToNodeSpaceAR( wPos );
    node.parent = newParent;
    node.setPosition ( newPos );
  }

  public static randomRange ( min: number, max: number, int: boolean = false ) {
    let delta = max - min;
    let rnd = Math.random();
    let result = min + rnd * delta;

    if ( int ) {
      result = Math.round( result );
    }
    return result;
  }

  public static resolveRelativeURL( relativeUrl: string, baseUrl: string ) {
    const oldBase = document.getElementsByTagName('base')[0];
    const oldHref = oldBase && oldBase.href;
    const docHead = document.head || document.getElementsByTagName('head')[0];
    const ourBase = oldBase || docHead.appendChild(document.createElement('base'));
    const resolver = document.createElement('a');

    ourBase.href = baseUrl || '';
    resolver.href = relativeUrl;
    const resolvedUrl  = resolver.href; // browser magic - href resolves fine

    if (oldBase) {
      oldBase.href = oldHref;
    } else {
      docHead.removeChild(ourBase);
    }
    return resolvedUrl;
  }

  public static setLocalData(key: string, data:any){
    if(data != null)
      localStorage.setItem(key, data);
  }
  
  public static getLocalData(key: string) : any{
    let data: any = localStorage.getItem(key);
    if(data === null)
      return -1;
    else
      return JSON.parse(data);
  }
}
