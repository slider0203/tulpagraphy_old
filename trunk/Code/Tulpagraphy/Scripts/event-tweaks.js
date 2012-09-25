$(function() {
    var leftButtonDown = false;

    window.tweakMouseEvent = function(e) {
        // Check from jQuery UI for IE versions < 9
        if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
            leftButtonDown = false;
        }

        // If left button is not set, set which to 0
        // This indicates no buttons pressed
        if (e.which === 1 && !leftButtonDown) e.which = 0;
    };
    $(document).mousedown(function(e) {
        // Left mouse button was pressed, set flag
        if (e.which === 1) leftButtonDown = true;
    });

    $(document).mouseup(function(e) {
        // Left mouse button was released, clear flag
        if (e.which === 1) leftButtonDown = false;
    });
});