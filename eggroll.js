function EggrollDice() {
    $('.eggroll .vdice-value').each(function () {

        // Prevent re-processing the same element
        if ($(this).data('processed')) return;

        // Get base roll value
        const baseText = $(this).text().trim();
        const baseRoll = parseInt(baseText, 10);
        if (isNaN(baseRoll)) return;

        // Get modifier (e.g. +10 or -5) from the parent .eggroll
        const eggrollText = $(this).closest('.eggroll').text();
        const modMatch = eggrollText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;

        // Final calculated roll
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        // -----------------------------
        // eggroll-1 → Moves
        // -----------------------------
        if ($(this).closest('.eggroll').hasClass('eggroll-1')) {

            if (finalRoll <= 20) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants <b>1 TM Move</b>!</div>`;
            } else if (finalRoll <= 40) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants <b>1 Egg Move</b>!</div>`;
            } else if (finalRoll <= 60) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants <b>2 Egg Moves</b>!</div>`;
            } else if (finalRoll <= 80) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants <b>1 Event Move</b>!</div>`;
            } else { // 81–120
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants <b>Wish Move</b>!</div>`;
            }

        }

        // -----------------------------
        // eggroll-2 → Effects
        // -----------------------------
        else if ($(this).closest('.eggroll').hasClass('eggroll-2')) {

            if (finalRoll <= 20) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg has <b>Hidden Ability</b>!</div>`;
            } else if (finalRoll <= 40) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg replaces ability with <b>Cute Charm</b>!</div>`;
            } else if (finalRoll <= 60) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg hatches a <b>Shiny</b> Pokémon!</div>`;
            } else if (finalRoll <= 80) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg hatches a <b>Pink</b> Pokémon!</div>`;
            } else if (finalRoll <= 100) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg hatches an <b>Illumina Pokémon</b>!</div>`;
            } else if (finalRoll <= 110) {
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants an <b>Extra Moveslot</b>!</div>`;
            } else { // 111–120
                resultText = `
                <img src="https://i.imgur.com/bwjRsaA.png" title="Pokemon Egg">
                <div class="cramomatic-desc">This egg grants an <b>Extra Ability Slot</b>!</div>`;
            }

        }

        // -----------------------------
        // eggroll-3 → Species
        // -----------------------------
        else if ($(this).closest('.eggroll').hasClass('eggroll-3')) {

            if (finalRoll <= 4) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Bunnelby Egg"><div class="cramomatic-desc">The egg hatches into <b>Bunnelby</b>!</div>`;
            } else if (finalRoll <= 8) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Cherubi Egg"><div class="cramomatic-desc">The egg hatches into <b>Cherubi</b>!</div>`;
            } else if (finalRoll <= 12) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Tynamo Egg"><div class="cramomatic-desc">The egg hatches into <b>Tynamo</b>!</div>`;
            } else if (finalRoll <= 16) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Psyduck Egg"><div class="cramomatic-desc">The egg hatches into <b>Psyduck</b>!</div>`;
            } else if (finalRoll <= 20) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Shroomish Egg"><div class="cramomatic-desc">The egg hatches into <b>Shroomish</b>!</div>`;
            } else if (finalRoll <= 24) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Togepi Egg"><div class="cramomatic-desc">The egg hatches into <b>Togepi</b>!</div>`;
            } else if (finalRoll <= 28) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Tyrogue Egg"><div class="cramomatic-desc">The egg hatches into <b>Tyrogue</b>!</div>`;
            } else if (finalRoll <= 32) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Smoochum Egg"><div class="cramomatic-desc">The egg hatches into <b>Smoochum</b>!</div>`;
            } else if (finalRoll <= 36) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Elekid Egg"><div class="cramomatic-desc">The egg hatches into <b>Elekid</b>!</div>`;
            } else if (finalRoll <= 40) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Magby Egg"><div class="cramomatic-desc">The egg hatches into <b>Magby</b>!</div>`;
            } else if (finalRoll <= 44) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Cleffa Egg"><div class="cramomatic-desc">The egg hatches into <b>Cleffa</b>!</div>`;
            } else if (finalRoll <= 48) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Igglybuff Egg"><div class="cramomatic-desc">The egg hatches into <b>Igglybuff</b>!</div>`;
            } else if (finalRoll <= 52) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Azurill Egg"><div class="cramomatic-desc">The egg hatches into <b>Azurill</b>!</div>`;
            } else if (finalRoll <= 56) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Wynaut Egg"><div class="cramomatic-desc">The egg hatches into <b>Wynaut</b>!</div>`;
            } else if (finalRoll <= 60) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Budew Egg"><div class="cramomatic-desc">The egg hatches into <b>Budew</b>!</div>`;
            } else if (finalRoll <= 64) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Chingling Egg"><div class="cramomatic-desc">The egg hatches into <b>Chingling</b>!</div>`;
            } else if (finalRoll <= 68) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Bonsly Egg"><div class="cramomatic-desc">The egg hatches into <b>Bonsly</b>!</div>`;
            } else if (finalRoll <= 72) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Mime Jr. Egg"><div class="cramomatic-desc">The egg hatches into <b>Mime Jr.</b>!</div>`;
            } else if (finalRoll <= 76) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Happiny Egg"><div class="cramomatic-desc">The egg hatches into <b>Happiny</b>!</div>`;
            } else if (finalRoll <= 80) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Munchlax Egg"><div class="cramomatic-desc">The egg hatches into <b>Munchlax</b>!</div>`;
            } else if (finalRoll <= 84) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Mantyke Egg"><div class="cramomatic-desc">The egg hatches into <b>Mantyke</b>!</div>`;
            } else if (finalRoll <= 88) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Toxel Egg"><div class="cramomatic-desc">The egg hatches into <b>Toxel</b>!</div>`;
            } else if (finalRoll <= 92) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Skitty Egg"><div class="cramomatic-desc">The egg hatches into <b>Skitty</b>!</div>`;
            } else if (finalRoll <= 96) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Buneary Egg"><div class="cramomatic-desc">The egg hatches into <b>Buneary</b>!</div>`;
            } else if (finalRoll <= 100) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Drifloon Egg"><div class="cramomatic-desc">The egg hatches into <b>Drifloon</b>!</div>`;
            } else if (finalRoll <= 104) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Teddiursa Egg"><div class="cramomatic-desc">The egg hatches into <b>Teddiursa</b>!</div>`;
            } else if (finalRoll <= 108) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Torchic Egg"><div class="cramomatic-desc">The egg hatches into <b>Torchic</b>!</div>`;
            } else if (finalRoll <= 112) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Riolu Egg"><div class="cramomatic-desc">The egg hatches into <b>Riolu</b>!</div>`;
            } else if (finalRoll <= 116) {
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Pichu Egg"><div class="cramomatic-desc">The egg hatches into <b>Pichu</b>!</div>`;
            } else { // 117–120
                resultText = `<img src="https://i.imgur.com/bwjRsaA.png" title="Eevee Egg"><div class="cramomatic-desc">The egg hatches into <b>Eevee</b>!</div>`;
            }

        }

        // -----------------------------
        // Fallback if something goes wrong
        // -----------------------------
        else {
            resultText = `
            <div class="mkj-wrapper">
                <div class="mkj-textbox">
                    (${finalRoll}) Something went wrong...
                </div>
            </div>`;
        }

        // Replace the original roll with the result HTML
        $(this).html(resultText);

        // Mark as processed so it does not run again
        $(this).data('processed', true);
    });
}

$(document).ready(function () {
    EggrollDice();

    // Observe content changes (for ProBoards dynamic page updates)
    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            EggrollDice();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
});
