    // this part controls the pop-up menu
    $("#uisettings").click(function () {
        $(".uipopup").css("display", "block");
        $("#uimodaloverlay").css("display", "block");
    });
    $("#uimodaloverlay").click(function () {
        $(".uipopup").css("display", "none");
        $("#uimodaloverlay").css("display", "none");
    });
    $("#uimodal-x").click(function () {
        $(".uipopup").css("display", "none");
        $("#uimodaloverlay").css("display", "none");
    });

    // this part is for the actual ui changes
    (function ($) {
        "use strict";
        function uiDisplayPrefs() {
            if (localStorage.getItem("uiDisplayPrefs") === null) {
                var uiDisplaySetting = "default"; // if no mode detected in local storage, display ui as default
            } else {
                var uiDisplaySetting = localStorage.getItem("uiDisplayPrefs"); // select from local storage if an option was selected before
            }
            $("#uidisplay-default").click(function () { // button id for setting ui display to default
                uiDisplaySetting = "default";
                localStorage.setItem("uiDisplayPrefs", uiDisplaySetting);
                setDisplayPrefs();
            });
            $("#uidisplay-minimal").click(function () { // button id for setting ui display to minimal
                uiDisplaySetting = "minimal";
                localStorage.setItem("uiDisplayPrefs", uiDisplaySetting);
                setDisplayPrefs();
            });
            function setDisplayPrefs() { // ui modes are set via adding a class to the overall body tag
                if (uiDisplaySetting == "default") {
                    $("#uidisplay-minimal").removeClass("selected");
                    $("body").removeClass("ui-minimal");
                    $("#uidisplay-default").addClass("selected");
                    $("body").addClass("ui-default");
                }
                if (uiDisplaySetting == "minimal") {
                    $("#uidisplay-default").removeClass("selected");
                    $("body").removeClass("ui-default");
                    $("#uidisplay-minimal").addClass("selected");
                    $("body").addClass("ui-minimal");
                }
            }
            setDisplayPrefs();
        }
        $(window).on("load", function () {
            uiDisplayPrefs(); // loads the selected ui mode on page load
        });
    })(jQuery);
