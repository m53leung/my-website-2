const ANIMATION_LENGTH = 1;

// clamps number between min and max
function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}

// Returns the section that the window is currently over
function getCurrentSection(offsetBar=false) {
    var screen = $("#topBar").offset().top;
    if (offsetBar) {
        screen += $("#topBar").height();
    }
    var toReturn = null;
    $(".section").each(function(index, element) {
        var offset = $(element).offset().top;
        var height = $(element).height();
        if (screen >= offset && screen <= offset + height) {
            toReturn = element;
            return false;
        }
    });
    return toReturn;
}

function updateTopBar() {
    $("#topBar").removeClass(['clear', 'dark', 'light']);
    if ($("#topBar").offset().top > 1) {
        var section = getCurrentSection(true);
        if (section != null) {
            $("#topBar").addClass($(section).data("topbar-style"));
        } else {
            $("#topBar").addClass('dark');
        }
    } else {
        $("#topBar").addClass("clear");
    }
}

function animate(element, force=false) {
    var offset = $("#topBar").offset().top - $(element).offset().top;
    var windowHeight = $(window).height();
    // start animation at offset = 0
    // end at offset = 2 * window height
    // runs animation over 2 window lengths of scrolling
    if (force || (offset >= 0 && offset <= 2 * windowHeight) || $(element).data("animating")) {
        var sectionContent = $(element).children(".sectionContent");
        // ranges from 0 - 1
        var progress = offset / (ANIMATION_LENGTH*windowHeight);
        sectionContent.find(".animate").each(function(index, element) {
            if ($(element).hasClass("animateFade")) {
                var opacity = progress;
                opacity = clamp(opacity, 0, 1);
                $(element).css("opacity", opacity);
            }
            // Only animate in one direction
            if ($(element).hasClass("animateEnterRight")) {
                var transform = 33 * (1 - progress);
                transform = clamp(transform, 0, 33);
                $(element).css("transform", "translateX(" + transform + "vw)");
            } else if ($(element).hasClass("animateEnterLeft")) {
                var transform = 33 * (progress - 1);
                transform = clamp(transform, -33, 0);
                $(element).css("transform", "translateX(" + transform + "vw)");
            } else if ($(element).hasClass("animateEnterTop")) {
                var transform = 3 * (progress - 1);
                transform = clamp(transform, -3, 0);
                $(element).css("transform", "translateY(" + transform + "rem)");
            } else if ($(element).hasClass("animateEnterBottom")) {
                var transform = 3 * (1 - progress);
                transform = clamp(transform, 0, 3);
                $(element).css("transform", "translateY(" + transform + "rem)");
            }
        });
        if (progress < 0 || progress > 1) {
            $(element).data("animating", false);
        } else if (!$(element).data("animating")) {
            $(element).data("animating", true);
        }
    }
}

$(document).ready(function() {
    updateTopBar();
    $(".section").each(function(index, element) {
        animate(element, true);
    });
    $(window).scroll(function(e) {
        updateTopBar();
        $(".section").each(function(index, element) {
            if ($(element).data("animating")) {
                animate(element);
            }
        });
        var section = getCurrentSection();
        if (section != null && !$(section).data("animating")) {
            animate(section);
        }
    });
});

