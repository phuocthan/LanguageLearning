// Cannot use cc.sys.platform === cc.sys.IPHONE, because cc.sys.platform is going to be always `sys.MOBILE_BROWSER`... 
var isIPhone = !!navigator.platform.match(/iPhone|iPod/);

var isKeyboardOpen = false;

var baseRatio = 1280 / 720;
// The magic code
function overrideDefaultEventHandlerToTriggerFullScreenMode() {

    var oldAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(eventName, eventHandler)
    {
        oldAddEventListener.call(this, eventName, function(event) {

            if (eventName.startsWith('touchend')) {

                var isFullScreen = document.isFullScreen || 
                                    document.webkitIsFullScreen || 
                                    document.mozIsFullScreen || 
                                    document.msIsFullScreen;

                if (!isFullScreen) {
                    // Set element game-shell to full screen
                    var elem = document.getElementById("game-shell");
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                    // Set framesize again only landscape mode
                    var isLandscape = window.matchMedia("(orientation: landscape)").matches;
                    if (isLandscape) {
                        setTimeout(function () {
                            cc.view.setFrameSize(window.innerHeight * baseRatio, window.innerHeight);
                        }, 500);
                    } else {
                        // Try to display rotate notice after loading
                        setTimeout(function () {
                            forceDisplayRotatePopup();
                        }, 2000);
                    }
                    // cc.view.enableAutoFullScreen(true);
                }
            }

            if (eventName === 'resize') {
                detectKeyboard();
                
                // When the game has any kind of webview open, and focusing on an input field triggers the mobile keyboard to open.
                // The mobile keyboard is triggering a "resize" event, as a result the whole game will be resized to a "very smalle" size.
                // Is not the expected behaviour, so when the keyboard is opening, avoid triggering the "resize" event handlers, as a result none the game or the webcontent will be resized. 
                if (isKeyboardOpen) {
                    return;
                }
            }

            eventHandler.call(this, event);
        });
    };
}

// The magic code II
function overrideFrameResizerOniOS14AndAbove() {

    // Issiue: [PRIORITY] IOS 14 Orientation issue (https://app.asana.com/0/1165698955906401/1199557937426315)
    // On some iOS device cocos misdetect the landscape screen size (especially the height) in the  `initFrameSize` function
    // Using this "monkey patch" we can relay on window sizes.
    const isIOSDevice = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && isIPhone;
    if (!isIOSDevice) {
        return
    }

    console.log('IOS PHONE - NO NEED MONKEYPATCH the resizing')
    const initFrameSize = cc.view._initFrameSize.bind(cc.view);
    const frameResizer = () => {
        const isPortrait = window.innerHeight > window.innerWidth 
        initFrameSize();
        if (!isPortrait) {
            const locFrameSize = cc.view._frameSize;
            var w = window.innerWidth;
            var h = window.innerHeight;
            locFrameSize.width = h * baseRatio;
            locFrameSize.height = h;
        }
    }

    cc.view._initFrameSize = frameResizer;

    updateCanvasBoundingRect();
}

function updateCanvasBoundingRect() {
    const updateCanvasBoundingRectOrig = cc.internal.inputManager._updateCanvasBoundingRect.bind(cc.internal.inputManager);

    const updateCanvasBoundingRectNew = () => {
        updateCanvasBoundingRectOrig();
        if (window.addressBar) {
            // In Safari iOS15, the scrollTo(0, 1) triggers the address bar showing up, so we cannot scroll up on this wey
            // scrollTo(0, window.addressBar) works great to make the screen fullscreen, but it is messing up the touch detection
            // but if we reset the canvas element height to be the original, not full-screen canvas, it works great 
            cc.internal.inputManager._canvasBoundingRect.height = window.innerHeight - window.addressBar;
        }
    }

    cc.internal.inputManager._updateCanvasBoundingRect = updateCanvasBoundingRectNew;
}


function saveWindowSizes() {
	window.lastInnerWidth = window.innerWidth;
	window.lastInnerHeight = window.innerHeight;
	window.lastOrientation = window.orientation;
	// Stays the same for iOS, so that's our ticket to detect iOS keyboard
	window.lastBodyHeight = document.body.clientHeight;
};

// -1 -> keyboard closing
// 0 -> no keyboard resize, general resize or orientation change
// >0 -> keyboard opened
function detectKeyboard() {
	function orientationChange() {
        if ( ((window.lastOrientation == 0 || window.lastOrientation == 180) && (window.orientation == 0 || window.orientation == 180)) || ((window.lastOrientation == 90 || window.lastOrientation == -90) && (window.orientation == 90 || window.orientation == -90)) ) return false
		else return true;
	}
	
	// No orientation change, keyboard opening
	if ( (window.lastInnerHeight - window.innerHeight > 150 ) && window.innerWidth == window.lastInnerWidth ) {
        var keyboardHeight = window.lastInnerHeight - window.innerHeight;
        isKeyboardOpen = true;
		return keyboardHeight;
	}
	// Orientation change with keyboard already opened
	if ( orientationChange() && isKeyboardOpen) {
        var keyboardHeight = screen.height - window.topBarHeight - window.innerHeight;

        // Orientation change happened, let's close the keyboard and resize the window after
        hideVirtualKeyboard();
        isKeyboardOpen = false;
		return 0;
	}
	
	// No orientation change, keyboard closing
	if ( (window.innerHeight - window.lastInnerHeight > 150 ) && window.innerWidth == window.lastInnerWidth) {
        isKeyboardOpen = false;
		return -1;		
	} 

    isKeyboardOpen = false;
	// Orientation change or regular resize, no keyboard action
	saveWindowSizes();
	return 0;
};


var isChromeOniOS = function() {
    // Unfortuately cc.sys.browserType !== cc.sys.BROWSER_TYPE_SAFARI does not work
    return cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS && navigator.userAgent.match('CriOS');
}

var coverSwipeElement = null;
var isShowCoverSwipeElement = false;

var hideCoverSwipeElement = function(removeDelay) {

    if (!coverSwipeElement) {
        return;
    }
    coverSwipeElement.style.visibility = "hidden";
    coverSwipeElement.style.pointerEvents = "none";
    coverSwipeElement.style.top = '10000px';
    coverSwipeElement.style.touchAction = "manipulation"; // "none" is not supported in Safari
    document.body.style.overflow = 'hidden';
    isShowCoverSwipeElement = false;
}

var showCoverSwipeElement = function() {
    if (!coverSwipeElement) {
        return;
    }
    coverSwipeElement.style.pointerEvents = "auto";
    coverSwipeElement.style.touchAction = "auto";
    coverSwipeElement.style.visibility = "visible";
    coverSwipeElement.style.top = '0px';
    document.body.style.overflow = 'auto';
    isShowCoverSwipeElement = true;

    // Touch scroll must be tured off for iFrame, otherwise it has scroll conflict with the  CoverSwipe element
    var iframecontainer = document.querySelector('#Cocos2dGameContainer > div'); 
    if (iframecontainer) {
        iframecontainer.style.WebkitOverflowScrolling = 'auto';
    }
    
}

// Reset scrolltop to fix touch deviation when scrolling in blur screen
document.addEventListener("scroll", function() {
    var isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (!coverSwipeElement || isShowCoverSwipeElement || !window.addressBar || !isLandscape) {
        return;
    }
    window.scrollTo(0, window.addressBar);
});

var showSwipeUnInstructionToGoFullScreenOniOS = function() {
    // ONLY THE iPhones need this!! Not even the iPads
    if (!cc.sys.isBrowser || cc.sys.os !== cc.sys.OS_IOS || !cc.sys.isMobile || !isIPhone) {
        // If this is a browser or not iOS device, or embedded, remove this top transparent div
        coverSwipeElement = document.getElementById('swipe-up-full-screen');
        if (coverSwipeElement && coverSwipeElement.parentNode) {
            coverSwipeElement.parentNode.removeChild(coverSwipeElement);
        }
        return;
    }

    var isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (!isLandscape) {
        // In portrait, we should not optimize minimal view, it is too dangerous:
        // The bottom of the screen is not tapable on iPhone (triggers to appear the bottom browser bar)
        // The screen is very tall, no need to have us much empty space on top (/bottom)

        // This seems to be trigger the top bar to be be visible again 
        if (coverSwipeElement && coverSwipeElement.parentNode) {
            setTimeout(function() {
                window.scrollTo(0,0);
                coverSwipeElement.parentNode.removeChild(coverSwipeElement);
            }, 500); // iPhone SE, 6S needs the half sec... Maybe later it can be decreased
        }
        return;
    }

    // Landscape, let'a add back the swipe controller
    if (coverSwipeElement && !coverSwipeElement.parentNode) {
        document.body.insertBefore(coverSwipeElement, document.body.firstChild);
    }
    if (!coverSwipeElement) {
        coverSwipeElement = document.getElementById('swipe-up-full-screen');
    }

    // Came from "scream" npm module - https://github.com/gajus/scream
    // Check "web-mobile-dep-boundler" folder
    if (isMinimalViewOnSafari() || isMinimalViewOnChromeiOS() || isWebviewOniOS()) {
        hideCoverSwipeElement();
        const iOSVersion = parseInt(webMobileGlobal.getIOSVersion())
        console.log('iOSVersion: ', iOSVersion)
        if (iOSVersion > 14) {
            window.scrollTo(0, window.addressBar);
        } else {
            window.scrollTo(0, 0);
        }
        // Resizing to adjust the canvas to the body size:        
        setTimeout(function () {
            const width = getScreenWidth();
            // some webview have address bar but can not hide, we should reduce them
            const height = getScreenHeight() - (isWebviewOniOS() ? (screen.width - window.innerHeight) : 0);
            cc.view.setFrameSize(height * baseRatio, height);
            cc.view.setCanvasSize(height * baseRatio, height);
            document.getElementById("Cocos2dGameContainer").style.height = height + 'px';
        }, 250);
    } else if (coverSwipeElement) {
        showCoverSwipeElement();
        window.scrollTo(0,0);
        window.addressBar =  screen.width - window.innerHeight + 5; //addresBar spacing is 5px
    } else {

    }
}

function getOrientation () {
    return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
};

function getScreenWidth() {
    if (isChromeOniOS()) {
        // make sure return an int value
        return window.innerWidth;
    }

    if (parseInt(webMobileGlobal.getIOSVersion()) < 14)
        return webMobileGlobal.getScreenWidth();
        
    return window.screen[window.orientation === 'portrait' ? 'width' : 'height'];
}

function getScreenHeight() {

    if (isChromeOniOS()) {
        // make sure return an int value
        return window.innerHeight;
    }

    if (parseInt(webMobileGlobal.getIOSVersion()) < 14)
        return webMobileGlobal.getScreenHeight();

    return window.screen[window.orientation === 'portrait' ? 'height' : 'width'];
}

function isMinimalViewOnSafari() {
    if (isChromeOniOS()) {
        return false;
    }
    
    if (parseInt(webMobileGlobal.getIOSVersion()) < 14)
        return webMobileGlobal.isMinimalView();

    // InnerHeight can be 340 if the top bar is visible or 390 in minimal view (full screen). screen.width is always 390
    return window.innerHeight >= screen.width;
}

function isMinimalViewOnChromeiOS() {
    if (!isChromeOniOS()) {
        return false;
    }

    var intViewportHeight = parseInt(getComputedStyle(document.getElementById('height-measure-box')).height);
    // icb-height-measure-box is no longer correct now
    // var icbHeight = getComputedStyle(document.getElementById('icb-height-measure-box')).height;

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
    return intViewportHeight === window.innerHeight;
}

// return true if browser is not Chrome or Safari
function isWebviewOniOS() {
    if (navigator.userAgent.match('CriOS') || navigator.userAgent.match('Safari')) {
        return false;
    }

    return true;
}

function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
}

window.enableForceLandscapeMode = true;
function forceLandscapeMode () {

    if (!window.enableForceLandscapeMode || !cc.sys.isMobile) {
        return;
    }

    var isLandscape = window.matchMedia("(orientation: landscape)").matches;

    if (isLandscape) {
        document.getElementById('GameCanvas').style.display = "block";
        document.getElementById('portrait-to-landscape').style.display = "none";
    } else {
        document.getElementById('portrait-to-landscape').style.display = "block";
        document.getElementById('GameCanvas').style.display = "none";
    }
}

function alignGameCanvasToCenter(isResize) {
    // Dont align for IOS
    if (cc.sys.os === cc.sys.OS_IOS) {
        return;
    }

    if (window.innerWidth < window.innerHeight && !window.enableForceLandscapeMode) {
        return;
    }

    if (!cc.sys.isMobile) {
        /**
         * If window size is higher or longer than game width/height then we will move game-container
         *  component to center => display web blur background in the borders.
         */
        limitCanvasByCertainSize();
    } else if (isResize) {
        /**
         * For Android mobile full screen mode, only setFrameSize when resize
         */
        var isLandscape = window.matchMedia("(orientation: landscape)").matches;
        if (isLandscape) {
            document.getElementById("game-shell").style.display = "block";
            limitCanvasByCertainSize();
        } else {
            // Try to display rotate notice
            cc.view.setFrameSize(window.innerWidth, window.innerHeight);
            setTimeout(function () {
                forceDisplayRotatePopup();
            }, 200);
        }
    }
}

function forceDisplayRotatePopup() {
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.getElementById("game-shell").style.display = "none";
}

function limitCanvasByCertainSize() {
    const curRatio = window.innerWidth / window.innerHeight;
    if (curRatio > baseRatio) {
        cc.view.setFrameSize(window.innerHeight * baseRatio, window.innerHeight);
    } else {
        cc.view.setFrameSize(window.innerWidth, window.innerWidth / baseRatio);
    }
}

window.addEventListener("resize", (event) => {
    // Give more latency if the swipe view is already on the screen.
    var delay = coverSwipeElement && coverSwipeElement.parentNode && coverSwipeElement.style.visibility === "visible" 
                ? 300 : 10;
    setTimeout(showSwipeUnInstructionToGoFullScreenOniOS, delay);
    forceLandscapeMode();
    alignGameCanvasToCenter(true);
});
window.boot = function () {

    document.getElementById('game-container').style.visibility = "hidden";

    saveWindowSizes();

    // Reset scroll cache from browser
    window.scrollTo(0, 0);

    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;

    if (!isChromeOniOS()) {
        var chromeMeasureMentBox1 = document.getElementById('icb-height-measure-box');
        var chromeMeasureMentBox2 = document.getElementById('height-measure-box');
        chromeMeasureMentBox1.parentNode.removeChild(chromeMeasureMentBox1);
        chromeMeasureMentBox2.parentNode.removeChild(chromeMeasureMentBox2);
    }

    // This only needs for the browser which supports the full-screen API
    var fullScreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    
    if (cc.sys.isBrowser && cc.sys.isMobile && fullScreenEnabled && !isIPhone) {
        overrideDefaultEventHandlerToTriggerFullScreenMode();
    }
    overrideFrameResizerOniOS14AndAbove();

    let { RESOURCES, INTERNAL, MAIN, START_SCENE } = cc.AssetManager.BuiltinBundleName;

    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        onProgress = function (finish, total) {
            var percent = 100 * finish / total;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
            window.setTimeout(showSwipeUnInstructionToGoFullScreenOniOS, 100);
        });
    }


    var onStart = function () {

        document.getElementById('game-container').style.visibility = "visible";
        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isBrowser) {
            setLoadingDisplay();
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }

/*            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_BAIDU_APP,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
            ].indexOf(cc.sys.browserType) < 0); */
        }

        forceLandscapeMode();
        alignGameCanvasToCenter(false);
        window.forceAlignGameCanvas = () => {
            forceLandscapeMode();
            alignGameCanvasToCenter(false);
        }


        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 10;
            cc.assetManager.downloader.maxRequestsPerFrame = 10;
        }

        var launchScene = settings.launchScene;
        var bundle = cc.assetManager.bundles.find(function (b) {
            return b.getSceneInfo(launchScene);
        });
        
        bundle.loadScene(launchScene, null, onProgress,
            function (err, scene) {
                if (!err) {
                    document.getElementById('Cocos2dGameContainer').style.visibility = "visible";
                    forceLandscapeMode();
                    alignGameCanvasToCenter(true);
                    cc.director.runSceneImmediate(scene);
                    if (cc.sys.isBrowser) {
                        // show canvas
                        var canvas = document.getElementById('GameCanvas');
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                        console.log('Success to load scene: ' + launchScene);
                    }
                }
            }
        );
        
    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({ 
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server
    });
    
    var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.assetManager.loadBundle(MAIN, function (err) {
                if (!err) cc.game.run(option, onStart);
            });
        }
    }

    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

    for (var i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }
};

if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}

function hideVirtualKeyboard() {
    if (
      document.activeElement &&
      document.activeElement.blur &&
      typeof document.activeElement.blur === 'function'
    ) {
      document.activeElement.blur()
    }
  }