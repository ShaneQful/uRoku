/**
 * Wait before the DOM has been loaded before initializing the Ubuntu UI layer
 */

window.onload = function () {
    function addClass(elem, className) {
        if (elem) {
            elem.className += ' ' + className;
        }
    };

    function removeClass(elem, className) {
        if (elem) {
            elem.className = elem.className.replace(className, '');
        }
    };

    var app = new Application(UbuntuUI);
    app.init();

    // Detect if Cordova script is uncommented or not and show the appropriate status.
    var hasCordovaScript = false;
    var scripts = [].slice.call(document.querySelectorAll('script'));
    scripts.forEach(function (element) {
        var attributes = element.attributes;
        if (attributes && attributes.src && attributes.src.value.indexOf('cordova.js') !== -1) {
            hasCordovaScript = true;
        }
    });

    var cordovaLoadingIndicator = document.querySelector('.load-cordova');
    if (!hasCordovaScript) {
        removeClass(document.querySelector('.ko-cordova'), 'is-hidden');
        addClass(cordovaLoadingIndicator, 'is-hidden');
    }

    // Add an event listener that is pending on the initialization
    //  of the platform layer API, if it is being used.
    document.addEventListener("deviceready", function() {
        if (console && console.log) {
            console.log('Platform layer API ready');
        }
        removeClass(document.querySelector('.ok-cordova'), 'is-hidden');
        addClass(cordovaLoadingIndicator, 'is-hidden');
    }, false);
};


