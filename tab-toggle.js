$ = jQuery.noConflict();

function initMiniTabs() {
    $("#mini-out").off('click', '.mini, .closetabs').on('click', '.mini, .closetabs', function () {
        const $parent = $(this).parents("#mini-out");
        $parent.children(".mini").removeClass('clicked');
        $parent.children(".tab").removeClass('show');
        $parent.children(".closetabs").addClass("remove");
        $parent.children(".palise-mini-circ").addClass("small");
        $parent.children(".palise-mini-grad").addClass("fade");
    });

    for (let i = 1; i <= 6; i++) {
        $(document).off(`click.mini${i}`).on(`click.mini${i}`, `#mini-out .mini${i}`, function () {
            const $parent = $(this).parents("#mini-out");

            $parent.children(".mini").removeClass('clicked');
            $parent.children(".tab").removeClass('show');
            $parent.children(".closetabs").addClass("remove");
            $parent.children(".palise-mini-circ").addClass("small");
            $parent.children(".palise-mini-grad").addClass("fade");

            $parent.children(`.mini${i}`).addClass('clicked');
            $parent.children(`.tab${i}`).addClass('show');
            $parent.children(".closetabs").removeClass("remove");
            $parent.children(".palise-mini-circ").removeClass("small");
            $parent.children(".palise-mini-grad").removeClass("fade");
        });
    }
}

$(document).ready(function() {
    initMiniTabs();
});

$(document).ajaxComplete(function() {
    initMiniTabs();
});

const observer = new MutationObserver(() => initMiniTabs());
observer.observe(document.body, { childList: true, subtree: true });

// Palise side toggles (unchanged)
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




