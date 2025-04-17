$(document).ready(function () {
    $('.magikarp-jump-x .vdice-value').each(function () {
        const rollText = $(this).text().trim();
        const roll = parseInt(rollText, 10);

        if (isNaN(roll)) return; // just in case

        let resultText = '';

        if (roll >= 1 && roll <= 5) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp appears to be festive when it uses the move <b>Celebrate</b>!</div>
                </div>`;
        } else if (roll >= 6 && roll <= 10) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp fires coins from the water while using <b>Happy Hour</b>!</div>
                </div>`;
        } else if (roll >= 11 && roll <= 20) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp flops violently and somehow unleashes <b>Incinerate</b>!</div>
                </div>`;
        } else if (roll >= 21 && roll <= 30) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp charges up and lets loose a wild <b>Zap Cannon</b>!</div>
                </div>`;
        } else if (roll >= 31 && roll <= 40) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp locks eyes with you and uses <b>Mimic</b>.</div>
                </div>`;
        } else if (roll >= 41 && roll <= 50) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Dark energy swirls around Magikarp as it uses <b>Curse</b>.</div>
                </div>`;
        } else if (roll >= 51 && roll <= 60) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp tucks in and launches itself with <b>Skull Bash</b>!</div>
                </div>`;
        } else if (roll >= 61 && roll <= 70) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A surge of water explodes from Magikarp when it uses <b>Brine</b>!</div>
                </div>`;
        } else if (roll >= 71 && roll <= 80) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Ice builds around Magikarp as it uses <b>Avalanche</b>!</div>
                </div>`;
        } else if (roll >= 81 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A shimmering barrier appears around Magikarp as it casts <b>Reflect</b>.</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Magikarp flips and counters with <b>Reversal</b>!</div>
                </div>`;
        } else {
            resultText = '<div class="mkj-wrapper"><div class="mkj-textbox">Something went wrong with the roll...</div></div>';
        }

        // replace number with HTML content
        $(this).html(resultText);
    });
});
