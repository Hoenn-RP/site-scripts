(function ($) {
    "use strict";

    function setFontSize(size) {
        // Apply the font size to the target elements
        $(".palise-post-right").css("font-size", size + "px");
        // Store the font size in localStorage
        localStorage.setItem("fontSize", size);
    }

    $(document).ready(function () {
        const defaultFontSize = 12; // Default font size in pixels
        let htmlFontSize = parseInt(localStorage.getItem("fontSize"), 10) || defaultFontSize;

        // Set the initial font size
        setFontSize(htmlFontSize);

        $(".fontbtn").click(function (e) {
            e.preventDefault();

            if ($(this).hasClass("fontinc")) {
                htmlFontSize += 1;
            } else if ($(this).hasClass("fontdec")) {
                htmlFontSize -= 1;
            } else if ($(this).hasClass("fontres")) {
                htmlFontSize = defaultFontSize;
            }

            setFontSize(htmlFontSize);
        });
    });
})(jQuery);
