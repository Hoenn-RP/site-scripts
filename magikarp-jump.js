$(document).ready(function () {
    $('.magikarp-jump-1 .vdice-value').each(function () {
        const rollText = $(this).text().trim();
        const roll = parseInt(rollText, 10);

        if (isNaN(roll)) return; // just in case

        let resultText = '';

        if (roll >= 1 && roll <= 5) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp appears to be festive when it uses the move <b>Celebrate</b>!</div>
                </div>`;
        } else if (roll >= 6 && roll <= 10) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp fires coins from the water while using <b>Happy Hour</b>!</div>
                </div>`;
        } else if (roll >= 11 && roll <= 20) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp flops violently and somehow unleashes <b>Incinerate</b>!</div>
                </div>`;
        } else if (roll >= 21 && roll <= 30) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp charges up and lets loose a wild <b>Zap Cannon</b>!</div>
                </div>`;
        } else if (roll >= 31 && roll <= 40) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp locks eyes with you and uses <b>Mimic</b>.</div>
                </div>`;
        } else if (roll >= 41 && roll <= 50) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Dark energy swirls around the Magikarp as it uses <b>Curse</b>.</div>
                </div>`;
        } else if (roll >= 51 && roll <= 60) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp tucks in and launches itself with <b>Skull Bash</b>!</div>
                </div>`;
        } else if (roll >= 61 && roll <= 70) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A surge of water explodes from the Magikarp when it uses <b>Brine</b>!</div>
                </div>`;
        } else if (roll >= 71 && roll <= 80) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Ice builds around the Magikarp as it uses <b>Avalanche</b>!</div>
                </div>`;
        } else if (roll >= 81 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A shimmering barrier appears around the Magikarp as it casts <b>Reflect</b>.</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The Magikarp flips and counters with <b>Reversal</b>!</div>
                </div>`;
        } else {
            resultText = '<div class="mkj-wrapper"><div class="mkj-textbox">Something went wrong with the roll...</div></div>';
        }

        // replace number with HTML content
        $(this).html(resultText);
    });

    
        $('.magikarp-jump-2 .vdice-value').each(function () {
        const rollText = $(this).text().trim();
        const roll = parseInt(rollText, 10);

        if (isNaN(roll)) return;

        let resultText = '';

        if (roll >= 1 && roll <= 13) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">That’s a tiny one! This Magikarp weighs only <b>5.0 kg (XXXS)</b>!</div>
                </div>`;
        } else if (roll >= 14 && roll <= 26) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">You start to reel in a lightweight fish at <b>7.5 kg (XXS)</b>.</div>
                </div>`;
        } else if (roll >= 27 && roll <= 39) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Slightly small. It only weighs <b>9.0 kg (XS)</b>.</div>
                </div>`;
        } else if (roll >= 40 && roll <= 52) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A standard catch! This one weighs <b>10.0 kg (Normal)</b>.</div>
                </div>`;
        } else if (roll >= 53 && roll <= 65) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Getting hefty! This is a <b>11.0 kg (XL)</b> Magikarp.</div>
                </div>`;
        } else if (roll >= 66 && roll <= 78) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">It’s heavy! This Magikarp weighs <b>12.5 kg (XXL)</b>!</div>
                </div>`;
        } else if (roll >= 79 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Holy smokes! It’s huge! A whopping <b>15.0 kg (XXXL)</b>!</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">It’s an <b>Alpha</b> Magikarp radiating power! It has the ability <b>Wild Might</b> and weighs <b>22.5 kg (ALPHA)</b>!</div>
                </div>`;
        } else {
            resultText = 'Something went wrong with the roll...';
        }

        // Replace the number with the HTML content
        $(this).html(resultText);
    });
});
