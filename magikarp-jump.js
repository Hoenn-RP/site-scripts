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
                    <div class="mkj-textbox">The magikarp appears to be festive when it uses the move <b>Celebrate</b>!</div>
                </div>`;
        } else if (roll >= 6 && roll <= 10) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp fires coins from the water while using <b>Happy Hour</b>!</div>
                </div>`;
        } else if (roll >= 11 && roll <= 20) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp flops violently and somehow unleashes <b>Incinerate</b>!</div>
                </div>`;
        } else if (roll >= 21 && roll <= 30) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp charges up and lets loose a wild <b>Zap Cannon</b>!</div>
                </div>`;
        } else if (roll >= 31 && roll <= 40) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp locks eyes with you and uses <b>Mimic</b>.</div>
                </div>`;
        } else if (roll >= 41 && roll <= 50) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Dark energy swirls around the magikarp as it uses <b>Curse</b>.</div>
                </div>`;
        } else if (roll >= 51 && roll <= 60) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp tucks in and launches itself with <b>Skull Bash</b>!</div>
                </div>`;
        } else if (roll >= 61 && roll <= 70) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A surge of water explodes from the magikarp when it uses <b>Brine</b>!</div>
                </div>`;
        } else if (roll >= 71 && roll <= 80) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Ice builds around the magikarp as it uses <b>Avalanche</b>!</div>
                </div>`;
        } else if (roll >= 81 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A shimmering barrier appears around the magikarp as it casts <b>Reflect</b>.</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">The magikarp flips and counters with <b>Reversal</b>!</div>
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
                    <div class="mkj-textbox">That’s a tiny one! This magikarp weighs only <b>5.0</b> kg <b>(XXXS)</b>!</div>
                </div>`;
        } else if (roll >= 14 && roll <= 26) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">You start to reel in a lightweight fish at <b>7.5</b> kg <b>(XXS)</b>.</div>
                </div>`;
        } else if (roll >= 27 && roll <= 39) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Slightly small. It only weighs <b>9.0</b> kg <b>(XS)</b>.</div>
                </div>`;
        } else if (roll >= 40 && roll <= 52) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A standard catch! This one weighs <b>10.0</b> kg <b>(Normal)</b>.</div>
                </div>`;
        } else if (roll >= 53 && roll <= 65) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Getting hefty! This is a <b>11.0</b> kg <b>(XL)</b> Magikarp.</div>
                </div>`;
        } else if (roll >= 66 && roll <= 78) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">It’s heavy! This Magikarp weighs <b>12.5</b> kg <b>(XXL)</b>!</div>
                </div>`;
        } else if (roll >= 79 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Holy smokes! It’s huge! A whopping <b>15.0</b> kg <b>(XXXL)</b>!</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">It’s an <b>Alpha</b> Magikarp radiating power! It has the ability <b>Wild Might</b> and weighs <b>22.5</b> kg <b>(ALPHA)</b>!</div>
                </div>`;
        } else {
            resultText = 'Something went wrong with the roll...';
        }

        // Replace the number with the HTML content
        $(this).html(resultText);
    });

        $('.magikarp-jump-3 .vdice-value').each(function () {
        const rollText = $(this).text().trim();
        const roll = parseInt(rollText, 10);
        if (isNaN(roll)) return;

        let resultText = '';

        if (roll >= 1 && roll <= 4) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange & White Calico</b> pattern!</div></div>';
        } else if (roll <= 8) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange & White & Black Calico</b> pattern!</div></div>';
        } else if (roll <= 12) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>White & Orange Calico</b> pattern!</div></div>';
        } else if (roll <= 16) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange & Gold Calico</b> pattern!</div></div>';
        } else if (roll <= 19) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange Two-Tone</b> pattern!</div></div>';
        } else if (roll <= 22) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange Orca</b> pattern!</div></div>';
        } else if (roll <= 25) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange Dapples</b> pattern!</div></div>';
        } else if (roll <= 28) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Pink Two-Tone</b> pattern!</div></div>';
        } else if (roll <= 31) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Pink Orca</b> pattern!</div></div>';
        } else if (roll <= 34) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Pink Dapples</b> pattern!</div></div>';
        } else if (roll <= 37) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Gray Bubbles</b> pattern!</div></div>';
        } else if (roll <= 40) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Gray Diamonds</b> pattern!</div></div>';
        } else if (roll <= 43) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Gray Patches</b> pattern!</div></div>';
        } else if (roll <= 46) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Purple Bubbles</b> pattern!</div></div>';
        } else if (roll <= 49) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Purple Diamonds</b> pattern!</div></div>';
        } else if (roll <= 52) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Purple Patches</b> pattern!</div></div>';
        } else if (roll <= 55) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Apricot Tiger</b> pattern!</div></div>';
        } else if (roll <= 58) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Apricot Zebra</b> pattern!</div></div>';
        } else if (roll <= 61) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Apricot Stripes</b> pattern!</div></div>';
        } else if (roll <= 64) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Brown Tiger</b> pattern!</div></div>';
        } else if (roll <= 67) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Brown Zebra</b> pattern!</div></div>';
        } else if (roll <= 70) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Brown Stripes</b> pattern!</div></div>';
        } else if (roll <= 73) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange Forehead</b> pattern!</div></div>';
        } else if (roll <= 76) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Orange Mask</b> pattern!</div></div>';
        } else if (roll <= 79) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Black Forehead</b> pattern!</div></div>';
        } else if (roll <= 82) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Black Mask</b> pattern!</div></div>';
        } else if (roll <= 85) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Saucy Blue</b> pattern!</div></div>';
        } else if (roll <= 88) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Blue Raindrops</b> pattern!</div></div>';
        } else if (roll <= 91) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Saucy Violet</b> pattern!</div></div>';
        } else if (roll <= 94) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Violet Raindrops</b> pattern!</div></div>';
        } else if (roll <= 97) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">The Magikarp has the <b>Skelly</b> pattern!</div></div>';
        } else if (roll <= 100) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://archives.bulbagarden.net/media/upload/e/ed/Magikarp_Jump_Pattern_01.png"></div><div class="mkj-textbox">You fished up a <b>Gold (Shiny)</b> Magikarp! Lucky you!</div></div>';
        } else {
            resultText = 'Something went wrong with the roll...';
        }

        $(this).html(resultText);
    });
});
