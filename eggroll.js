function EggrollDice() {
    $(document).ready(function () {

        // ----------------------------
        // Eggroll 1
        // ----------------------------
        $('.eggroll-1 .vdice-value').each(function () {
            if ($(this).data('processed')) return;

            const roll = parseInt($(this).text().trim(), 10);
            if (isNaN(roll)) return;

            let output = '';

            if (roll <= 10) {
                output = `<div class="eggroll-result">Eggroll-1: <b>Hatch a Common Pokémon</b></div>`;
            } else if (roll <= 30) {
                output = `<div class="eggroll-result">Eggroll-1: <b>Gain 1 TM</b></div>`;
            } else if (roll <= 60) {
                output = `<div class="eggroll-result">Eggroll-1: <b>Hatch a Rare Pokémon</b></div>`;
            } else if (roll <= 90) {
                output = `<div class="eggroll-result">Eggroll-1: <b>Gain 2 Egg Moves</b></div>`;
            } else {
                output = `<div class="eggroll-result">Eggroll-1: <b>Hatch a Shiny Pokémon</b></div>`;
            }

            $(this).html(output);
            $(this).data('processed', true);
        });

        // ----------------------------
        // Eggroll 2
        // ----------------------------
        $('.eggroll-2 .vdice-value').each(function () {
            if ($(this).data('processed')) return;

            const roll = parseInt($(this).text().trim(), 10);
            if (isNaN(roll)) return;

            let output = '';

            if (roll <= 20) {
                output = `<div class="eggroll-result">Eggroll-2: <b>Extra HP Boost</b></div>`;
            } else if (roll <= 40) {
                output = `<div class="eggroll-result">Eggroll-2: <b>Gain a Random Berry</b></div>`;
            } else if (roll <= 65) {
                output = `<div class="eggroll-result">Eggroll-2: <b>Hatch a Pink Pokémon</b></div>`;
            } else if (roll <= 85) {
                output = `<div class="eggroll-result">Eggroll-2: <b>Extra Move Slot</b></div>`;
            } else {
                output = `<div class="eggroll-result">Eggroll-2: <b>Hatch a Legendary Pokémon</b></div>`;
            }

            $(this).html(output);
            $(this).data('processed', true);
        });

        // ----------------------------
        // Eggroll 3
        // ----------------------------
        $('.eggroll-3 .vdice-value').each(function () {
            if ($(this).data('processed')) return;

            const roll = parseInt($(this).text().trim(), 10);
            if (isNaN(roll)) return;

            let output = '';

            if (roll <= 15) {
                output = `<div class="eggroll-result">Eggroll-3: <b>Gain Wish Move</b></div>`;
            } else if (roll <= 35) {
                output = `<div class="eggroll-result">Eggroll-3: <b>Gain a Special Item</b></div>`;
            } else if (roll <= 55) {
                output = `<div class="eggroll-result">Eggroll-3: <b>Extra Moveslot</b></div>`;
            } else if (roll <= 75) {
                output = `<div class="eggroll-result">Eggroll-3: <b>Hatch a Rare Pokémon</b></div>`;
            } else if (roll <= 95) {
                output = `<div class="eggroll-result">Eggroll-3: <b>Hatch a Shiny Pokémon</b></div>`;
            } else {
                output = `<div class="eggroll-result">Eggroll-3: <b>Hatch a Legendary Pokémon</b></div>`;
            }

            $(this).html(output);
            $(this).data('processed', true);
        });

    });
}

// Initialize
$(document).ready(function () {
    EggrollDice();

    // Watch for ProBoards dynamic updates
    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            EggrollDice();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
});
