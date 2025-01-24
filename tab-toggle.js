    $(".mini, .closetabs").on("click", function () {
        $(this).parents("#mini-out").children(".mini").removeClass('clicked');
        $(this).parents("#mini-out").children(".tab").removeClass('show');
        $(this).parents("#mini-out").children(".closetabs").addClass("remove");
        $(this).parents("#mini-out").children(".palise-mini-circ").addClass("small");
        $(this).parents("#mini-out").children(".palise-mini-grad").addClass("fade");
    });
    $(".mini1").on("click", function () {
        $(this).parents("#mini-out").children(".mini1").addClass('clicked');
        $(this).parents("#mini-out").children(".tab1").addClass('show');
        $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
        $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
        $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
    });
    $(".mini2").on("click", function () {
        $(this).parents("#mini-out").children(".mini2").addClass('clicked');
        $(this).parents("#mini-out").children(".tab2").addClass('show');
        $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
        $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
        $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
    });
    $(".mini3").on("click", function () {
        $(this).parents("#mini-out").children(".mini3").addClass('clicked');
        $(this).parents("#mini-out").children(".tab3").addClass('show');
        $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
        $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
        $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
    });
    $ = jQuery.noConflict();
    $(document).ajaxComplete(function () {
        $(".mini, .closetabs").on("click", function () {
            $(this).parents("#mini-out").children(".mini").removeClass('clicked');
            $(this).parents("#mini-out").children(".tab").removeClass('show');
            $(this).parents("#mini-out").children(".closetabs").addClass("remove");
            $(this).parents("#mini-out").children(".palise-mini-circ").addClass("small");
            $(this).parents("#mini-out").children(".palise-mini-grad").addClass("fade");
        });

        $(".mini1").on("click", function () {
            $(this).parents("#mini-out").children(".mini1").addClass('clicked');
            $(this).parents("#mini-out").children(".tab1").addClass('show');
            $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
            $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
            $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
        });

        $(".mini2").on("click", function () {
            $(this).parents("#mini-out").children(".mini2").addClass('clicked');
            $(this).parents("#mini-out").children(".tab2").addClass('show');
            $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
            $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
            $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
        });

        $(".mini3").on("click", function () {
            $(this).parents("#mini-out").children(".mini3").addClass('clicked');
            $(this).parents("#mini-out").children(".tab3").addClass('show');
            $(this).parents("#mini-out").children(".closetabs").removeClass("remove");
            $(this).parents("#mini-out").children(".palise-mini-circ").removeClass("small");
            $(this).parents("#mini-out").children(".palise-mini-grad").removeClass("fade");
        });
    });
    $(".palise-clik-1").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-1").addClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-2").removeClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-3").removeClass('toggle-on');
    });

    $(".palise-side-toggle-off").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-1").removeClass('toggle-on');
    });

    $(".palise-clik-2").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-2").addClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-1").removeClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-3").removeClass('toggle-on');
    });

    $(".palise-side-toggle-off").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-2").removeClass('toggle-on');
    });
    $(".palise-clik-3").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-3").addClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-1").removeClass('toggle-on');
        $(this).parents(".palise-side-2").children(".palise-side-toggle-2").removeClass('toggle-on');
    });

    $(".palise-side-toggle-off").on("click", function () {
        $(this).parents(".palise-side-2").children(".palise-side-toggle-3").removeClass('toggle-on');
    });