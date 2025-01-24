    $(document).ready(function () {
        // Replace default icons with Font Awesome glyphs
        function replaceDefaultIcons() {
            // Replace interaction icons with Font Awesome glyphs
            $('a.likes-button > img').replaceWith('<i class="fa fa-heart"></i>');
            $('.button .status > img').replaceWith('<i class="fa fa-cog"></i>');
            $('.ui-search .search-filters-button .icon > img').replaceWith('<i class="fa fa-search"></i>');
            // Replace board on/off icons with Font Awesome glyphs
            $('.board.item.new > td.icon > img').replaceWith('<i class="fa fa-folder"></i>');
            $('.board.item.redirect > td.icon > img').replaceWith('<i class="fa fa-arrow-circle-o-right"></i>');
            $('.board.item > td.icon > img').replaceWith('<i class="fa fa-folder-o"></i>');
            // Replace legend on/off icons with Font Awesome glyphs
            var $legendIcons = $('.legend .content td > img');
            // Loop through each icon in the legend
            $legendIcons.each(function () {
                if ($(this).prop('alt') === 'New Posts') {
                    $(this).replaceWith('<i class="fa fa-folder"></i>');
                } else if ($(this).prop('alt') === 'No New Posts') {
                    $(this).replaceWith('<i class="fa fa-folder-o"></i>');
                }
            });

            // Replace info center icons with Font Awesome glyphs
            var $infoIcons = $('.stats .content td.icon > img');

            // Loop through each icon in the info center
            $infoIcons.each(function () {
                if ($(this).prop('alt') === 'Board Statistics') {
                    $(this).replaceWith('<i class="fa fa-info-circle"></i>');
                } else if ($(this).prop('alt') === 'Members') {
                    $(this).replaceWith('<i class="fa fa-users"></i>');
                } else if ($(this).prop('alt') === 'Members Online') {
                    $(this).replaceWith('<i class="fa fa-user-circle"></i>');
                } else if ($(this).prop('alt') === '24 Hours') {
                    $(this).replaceWith('<i class="fa fa-clock-o"></i>');
                }
            });

            // Replace thread/conversations icons with Font Awesome glyphs        
            $('.thread > .icon > img').replaceWith('<i class="fa fa-comments-o"></i>');
            $('.thread.sticky > .icon > i').replaceWith('<i class="fa fa-sticky-note-o"></i>');
            $('.thread.announcement > .icon > i').replaceWith('<i class="fa fa-bullhorn"></i>');
            $('.conversations .item > .icon > img').replaceWith('<i class="fa fa-envelope-o"></i>');
            $('.conversations .item.new > .icon > i').replaceWith('<i class="fa fa-envelope"></i>');

            // Append Font Awesome glyphs to tricky icons
            $('.lock_icon').append('<i class="fa fa-lock"></i>');
            $('.bookmark_icon').append('<i class="fa fa-bookmark"></i>');
            $('.poll_icon').append('<i class="fa fa-bar-chart"></i>');

            // Create an array for tricky icons
            var $trickyIcons = ['.lock_icon', '.bookmark_icon', '.poll_icon'];

            // Loop through each item of the tricky icons array
            $.each($trickyIcons, function (index, value) {
                // Loop through each item of the array on the page
                $(value).each(function () {
                    // Check if child images are set to display: none
                    if ($(this).children('img').css('display') == 'none') {
                        // Hide the parent if so
                        // This works better than hiding the icon
                        // It hides the padding as well
                        $(this).css('display', 'none');
                    };
                    // Finally, remove child image from the DOM
                    $(this).find('img').remove();
                });
            });

            // Create variable for the checkmark container
            var $checkContainer = $('.ui-poll .results tr td .select-box');

            // Loop through each .select-box
            $checkContainer.each(function () {
                // Append the Font Awesome checkmark to .select-box
                $(this).append($('<i class="fa fa-check"></i>'));
                // Then remove the image from the DOM
                $(this).children('img').remove();
            });
        }

        replaceDefaultIcons();
        pb.events.on('pageChange', replaceDefaultIcons);
    });