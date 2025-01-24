    $(".speekclick").click(function () {

        if (!$('#spee').hasClass("off")) {
            $('#speektopnav').animate({ 'margin-top': '0px' }, 300);
            $('#speektopnav').addClass("off");
        }

        else {
            $('#speektopnav').animate({ 'margin-top': '-255px' }, 300)
            $('#speektopnav').removeClass("off");
        };

        if (!$('#spee').hasClass("off")) {
            $('#spee').addClass("off");
        }

        else {
            $('#spee').removeClass("off");
        };
    });