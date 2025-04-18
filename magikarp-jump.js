function applyMagikarpJump() {
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
                    <div class="mkj-textbox">The Magikarp appears to be having a good time when it uses <b>Celebrate</b>!</div>
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
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">That’s a tiny one! It seems <b>Rattled</b>. This Magikarp weighs only <b>5.0</b> kg <b>(XXXS)</b>!</div>
                </div>`;
        } else if (roll >= 14 && roll <= 26) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">This small Magikarp is going for a <b>Swift Swim</b>. It only weighs <b>7.5</b> kg <b>(XXS)</b>!</div>
                </div>`;
        } else if (roll >= 27 && roll <= 39) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Appears to be slightly small during its <b>Swift Swim</b>. It only weighs <b>9.0</b> kg <b>(XS)</b>!</div>
                </div>`;
        } else if (roll >= 40 && roll <= 52) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">A standard catch! This one’s rocking <b>Swift Swim</b> and weighs <b>10.0</b> kg <b>(Normal)</b>!</div>
                </div>`;
        } else if (roll >= 53 && roll <= 65) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Pretty hefty! This <b>Swift Swim</b> Magikarp weighs <b>11.0</b> kg <b>(XL)</b>!</div>
                </div>`;
        } else if (roll >= 66 && roll <= 78) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">It’s heavy! With its <b>Swift Swim</b> ability, this Magikarp weighs <b>12.5</b> kg <b>(XXL)</b>!</div>
                </div>`;
        } else if (roll >= 79 && roll <= 90) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
                    </div>
                    <div class="mkj-textbox">Holy smokes! It’s huge! A whopping <b>15.0</b> kg <b>(XXXL)</b> and clearly <b>Rattled</b>!</div>
                </div>`;
        } else if (roll >= 91 && roll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-magikarp">
                        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_01.png">
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
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_03.png"></div><div class="mkj-textbox">It has a <b>Orange & White Calico</b> pattern! The basic example of a calico pattern has orange and white patches.</div></div>';
        } else if (roll <= 8) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_04.png"></div><div class="mkj-textbox">It has a <b>Orange & White & Black Calico</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors.</div></div>';
        } else if (roll <= 12) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_05.png"></div><div class="mkj-textbox">It has a <b>White & Orange Calico</b> pattern! This slightly different calico pattern has orange patches on a white field.</div></div>';
        } else if (roll <= 16) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_06.png"></div><div class="mkj-textbox">It has a <b>Orange & Gold Calico</b> pattern! You will feel fortunate when you see this glittering gold and orange calico!</div></div>';
        } else if (roll <= 19) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_07.png"></div><div class="mkj-textbox">It has a <b>Orange Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of orange and white.</div></div>';
        } else if (roll <= 22) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_08.png"></div><div class="mkj-textbox">It has a <b>Orange Orca</b> pattern! This rather rare two-tone pattern looks like it would make for a swift swimmer.</div></div>';
        } else if (roll <= 25) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_09.png"></div><div class="mkj-textbox">It has a <b>Orange Dapples</b> pattern! This two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div></div>';
        } else if (roll <= 28) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_10.png"></div><div class="mkj-textbox">It has a <b>Pink Two-Tone</b> pattern! This cute two-tone pattern has clear fields of pink and white.</div></div>';
        } else if (roll <= 31) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_11.png"></div><div class="mkj-textbox">It has a <b>Pink Orca</b> pattern! This two-tone pattern manages to look both cute and cool at the same time.</div></div>';
        } else if (roll <= 34) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_12.png"></div><div class="mkj-textbox">It has a <b>Pink Dapples</b> pattern! This popular two-tone look is loved for its cute coloring and pattern.</div></div>';
        } else if (roll <= 37) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_13.png"></div><div class="mkj-textbox">It has a <b>Gray Bubbles</b> pattern! This basic bubble pattern in an understated gray has many fans.</div></div>';
        } else if (roll <= 40) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_14.png"></div><div class="mkj-textbox">It has a <b>Gray Diamonds</b> pattern! This gray pattern would be right in line with a methodical mind.</div></div>';
        } else if (roll <= 43) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_15.png"></div><div class="mkj-textbox">It has a <b>Gray Patches</b> pattern! This rare gray pattern has an unusually complicated pattern.</div></div>';
        } else if (roll <= 46) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_16.png"></div><div class="mkj-textbox">It has a <b>Purple Bubbles</b> pattern! This vivid purple pattern is dappled with lovely spots.</div></div>';
        } else if (roll <= 49) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_17.png"></div><div class="mkj-textbox">It has a <b>Purple Diamonds</b> pattern! This purple pattern is covered with spots that look like diamonds.</div></div>';
        } else if (roll <= 52) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_18.png"></div><div class="mkj-textbox">It has a <b>Purple Patches</b> pattern! This captivating pattern has patches of purple on a white field.</div></div>';
        } else if (roll <= 55) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_19.png"></div><div class="mkj-textbox">It has a <b>Apricot Tiger</b> pattern! This wild striped pattern gives an impression of fierce strength.</div></div>';
        } else if (roll <= 58) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_20.png"></div><div class="mkj-textbox">It has a <b>Apricot Zebra</b> pattern! This striped pattern has real sense of personality captured in its winding lines.</div></div>';
        } else if (roll <= 61) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_21.png"></div><div class="mkj-textbox">It has a <b>Apricot Stripes</b> pattern! This basic striped pattern is simply striking, no matter how you look at it.</div></div>';
        } else if (roll <= 64) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_22.png"></div><div class="mkj-textbox">It has a <b>Brown Tiger</b> pattern! This unusual striped pattern seems somehow sturdy and reliable.</div></div>';
        } else if (roll <= 67) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_23.png"></div><div class="mkj-textbox">It has a <b>Brown Zebra</b> pattern! This striped specimen seems quite pleased with its winding lines.</div></div>';
        } else if (roll <= 70) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_24.png"></div><div class="mkj-textbox">It has a <b>Brown Stripes</b> pattern! This brown striped pattern has the alluring sheen of liquid chocolate.</div></div>';
        } else if (roll <= 73) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_25.png"></div><div class="mkj-textbox">It has a <b>Orange Forehead</b> pattern! This playful-looking pattern is known for the bright orange patch on its head.</div></div>';
        } else if (roll <= 76) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_26.png"></div><div class="mkj-textbox">It has a <b>Orange Mask</b> pattern! This eye-catching pattern has a splash of coloration only on its face.</div></div>';
        } else if (roll <= 79) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_27.png"></div><div class="mkj-textbox">It has a <b>Black Forehead</b> pattern! This rather reserved pattern has black only on its forehead.</div></div>';
        } else if (roll <= 82) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_28.png"></div><div class="mkj-textbox">It has a <b>Black Mask</b> pattern! This surprising pattern has just one patch of startling black across its face.</div></div>';
        } else if (roll <= 85) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_29.png"></div><div class="mkj-textbox">It has a <b>Saucy Blue</b> pattern! The splashy pattern on its back looks as though a bucket was upended onto it.</div></div>';
        } else if (roll <= 88) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_30.png"></div><div class="mkj-textbox">It has a <b>Blue Raindrops</b> pattern! The drippy patterns decorating its back are exquisite.</div></div>';
        } else if (roll <= 91) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_31.png"></div><div class="mkj-textbox">It has a <b>Saucy Violet</b> pattern! The violet droplets running down its sides give it a sorrowful air.</div></div>';
        } else if (roll <= 94) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="hhttps://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_32.png"></div><div class="mkj-textbox">It has a <b>Violet Raindrops</b> pattern! The eye-catching pattern on its back is popular with everyone.</div></div>';
        } else if (roll <= 97) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_02.png"></div><div class="mkj-textbox">It has a <b>Skelly</b> pattern! This Magikarp is known for the spiny-looking white lines visible on it.</div></div>';
        } else if (roll <= 100) {
            resultText = '<div class="mkj-wrapper"><div class="mkj-magikarp"><img src="https://file.garden/Zz6LAVCcyQejC5CU/Events/Magikarp/Magikarp_Jump_Pattern_99.png"></div><div class="mkj-textbox">You found a shiny Magikarp! Lucky you! This rarely found Magikarp glitters like gold from front to tail fin.</div></div>';
        } else {
            resultText = 'Something went wrong with the roll...';
        }

        $(this).html(resultText);
    });
}

$(document).ready(applyMagikarpJump);
$(document).on('pjax:end', applyMagikarpJump);
someAjaxCall().then(() => {
    applyMagikarpJump();
});
