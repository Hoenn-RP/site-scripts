$ = jQuery.noConflict();

function initMiniTabs() {
    // Close all tabs when clicking a mini or closetabs
    $("#mini-out").off('click', '.mini, .closetabs').on('click', '.mini, .closetabs', function () {
        const $parent = $(this).parents("#mini-out");
        $parent.children(".mini").removeClass('clicked');
        $parent.children(".tab").removeClass('show');
        $parent.children(".closetabs").addClass("remove");
        $parent.children(".palise-mini-circ").addClass("small");
        $parent.children(".palise-mini-grad").addClass("fade");
    });

    // Handle mini1 → mini6 clicks dynamically
    for (let i = 1; i <= 6; i++) {
        $(`#mini-out .mini${i}`).off('click').on('click', function () {
            const $parent = $(this).parents("#mini-out");

            // First reset all
            $parent.children(".mini").removeClass('clicked');
            $parent.children(".tab").removeClass('show');
            $parent.children(".closetabs").addClass("remove");
            $parent.children(".palise-mini-circ").addClass("small");
            $parent.children(".palise-mini-grad").addClass("fade");

            // Then activate this mini/tab
            $parent.children(`.mini${i}`).addClass('clicked');
            $parent.children(`.tab${i}`).addClass('show');
            $parent.children(".closetabs").removeClass("remove");
            $parent.children(".palise-mini-circ").removeClass("small");
            $parent.children(".palise-mini-grad").removeClass("fade");
        });
    }
}

// Initialize on page load
initMiniTabs();

// Re-initialize after any AJAX load
$(document).ajaxComplete(function () {
    initMiniTabs();
});

// ----- Palise side toggle buttons (no change needed) -----
$(".palise-clik-1").on("click", function () {
    let $parent = $(this).parents(".palise-side-2");
    $parent.children(".palise-side-toggle-1").addClass('toggle-on');
    $parent.children(".palise-side-toggle-2, .palise-side-toggle-3, .palise-side-toggle-4").removeClass('toggle-on');
});
$(".palise-clik-2").on("click", function () {
    let $parent = $(this).parents(".palise-side-2");
    $parent.children(".palise-side-toggle-2").addClass('toggle-on');
    $parent.children(".palise-side-toggle-1, .palise-side-toggle-3, .palise-side-toggle-4").removeClass('toggle-on');
});
$(".palise-clik-3").on("click", function () {
    let $parent = $(this).parents(".palise-side-2");
    $parent.children(".palise-side-toggle-3").addClass('toggle-on');
    $parent.children(".palise-side-toggle-1, .palise-side-toggle-2, .palise-side-toggle-4").removeClass('toggle-on');
});
$(".palise-clik-4").on("click", function () {
    let $parent = $(this).parents(".palise-side-2");
    $parent.children(".palise-side-toggle-4").addClass('toggle-on');
    $parent.children(".palise-side-toggle-1, .palise-side-toggle-2, .palise-side-toggle-3").removeClass('toggle-on');
});
$(".palise-side-toggle-off").on("click", function () {
    let $parent = $(this).parents(".palise-side-2");
    $parent.children(".palise-side-toggle-1, .palise-side-toggle-2, .palise-side-toggle-3, .palise-side-toggle-4").removeClass('toggle-on');
});


