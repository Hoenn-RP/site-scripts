(function ($) {
    "use strict";
    function \Size() {
        let fontBtn = $(".fontbtn");
        if (localStorage.getItem("fontSize") === null) {
            var htmlFontSize = 12; // THIS IS YOUR DEFAULT FONT SIZE
        } else {
            var htmlFontSize = localStorage.getItem("fontSize");
            $(".posts .post .content").css("font-size", htmlFontSize + "px"); // GENERIC POST CONTAINER
        }
        fontBtn.click(function (e) {
            e.preventDefault();
            let $this = $(this);
            if ($this.hasClass("fontinc")) {
                htmlFontSize = Math.round(parseFloat(htmlFontSize) + 1);
                $(".posts .post .content").css("font-size", htmlFontSize + "px");
            } else {
                htmlFontSize = Math.round(parseFloat(htmlFontSize) - 1);
                $(".posts .post .content").css("font-size", htmlFontSize + "px");
            }
            if ($this.hasClass("fontres")) {
                htmlFontSize = 12;
                $(".posts .post .content").css("font-size", htmlFontSize + "px");
            }
            localStorage.setItem("fontSize", htmlFontSize);
        });
    }
    $(window).on("load", function () {
        fontSize();
    });
})(jQuery);
