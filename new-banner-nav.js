// BANNER NAVIGATION
paliseNavigation = function (direction) {
    var all = $('.palise-tab-fieldset input:radio');
    var current = $('.palise-tab-fieldset input:radio:checked');
    var index;
    if (direction == 'prev') {
        index = all.index(current) - 1;       
    } else {
        index = all.index(current) + 1;        
    }
    
    if(index >= all.size()) index = 0;
    all.eq(index).click();
    return false;
};