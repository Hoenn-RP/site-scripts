(function ($) {
    "use strict";

    function fontSize() {
        let fontBtn = $(".fontbtn");
        let target = $(".posts .post .content, blockquote, .omgenmid, .omgen"); // Update this selector if needed
        let defaultSize = 12;
        let htmlFontSize = parseInt(localStorage.getItem("fontSize"), 10);

        if (isNaN(htmlFontSize)) htmlFontSize = defaultSize;

        target.css("font-size", htmlFontSize + "px");

        fontBtn.click(function (e) {
            e.preventDefault();
            let $this = $(this);

            if ($this.hasClass("fontinc")) {
                htmlFontSize += 1;
            } else if ($this.hasClass("fontdec")) {
                htmlFontSize -= 1;
            } else if ($this.hasClass("fontres")) {
                htmlFontSize = defaultSize;
            }

            target.css("font-size", htmlFontSize + "px");
            localStorage.setItem("fontSize", htmlFontSize);
        });
    }

    $(window).on("load", function () {
        fontSize();
    });

})(jQuery);
