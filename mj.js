function MJDice() {

    // -----------------------------
    // mj-1 -> Moves
    // -----------------------------
    $('.mj-1 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.mj-1').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 10) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp appears to be having a good time when it uses <b>Celebrate</b>!</div>`;
        } else if (finalRoll >= 11 && finalRoll <= 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp fires coins from the water while using <b>Happy Hour</b>!</div>`;
        } else if (finalRoll >= 21 && finalRoll <= 30) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp charges up and unleashes a devastating <b>Hyper Beam</b>!</div>`;
        } else if (finalRoll >= 31 && finalRoll <= 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp slams forward with the full force of <b>Giga Impact</b>!</div>`;
        } else if (finalRoll >= 41 && finalRoll <= 50) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp rears back and delivers a solid <b>Headbutt</b>!</div>`;
        } else if (finalRoll >= 51 && finalRoll <= 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp exhales a burst of draconic energy with <b>Dragon Breath</b>!</div>`;
        } else if (finalRoll >= 61 && finalRoll <= 70) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">A surge of water explodes from the Magikarp when it uses <b>Brine</b>!</div>`;
        } else if (finalRoll >= 71 && finalRoll <= 80) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp flops violently and somehow unleashes <b>Incinerate</b>!</div>`;
        } else if (finalRoll >= 81 && finalRoll <= 90) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Dark energy swirls around the Magikarp as it uses <b>Curse</b>.</div>`;
        } else if (finalRoll >= 91 && finalRoll <= 100) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp flips and counters with <b>Reversal</b>!</div>`;
        } else if (finalRoll >= 101 && finalRoll <= 110) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp locks eyes with you and uses <b>Mimic</b>.</div>`;
        } else if (finalRoll >= 111 && finalRoll <= 120) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp tucks in and launches itself with <b>Skull Bash</b>!</div>`;
        } else if (finalRoll >= 121 && finalRoll <= 130) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Ice builds around the Magikarp as it uses <b>Avalanche</b>!</div>`;
        } else if (finalRoll >= 131 && finalRoll <= 140) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">A shimmering barrier appears around the Magikarp as it casts <b>Reflect</b>.</div>`;
        } else if (finalRoll >= 141 && finalRoll <= 150) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp throws caution to the wind and charges with a reckless <b>Double-Edge</b>!</div>`;
        } else if (finalRoll >= 151 && finalRoll <= 160) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">The Magikarp surges forward, wrapped in a crashing <b>Wave Crash</b>!</div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Something went wrong.</div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.mj-1').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // mj-2 -> Size
    // -----------------------------
    $('.mj-2 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.mj-2').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 10) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">That’s a tiny one! It seems <b>Rattled</b>. This Magikarp weighs only <b>5.0</b> kg <b>(XXXS)</b>!</div>`;
        } else if (finalRoll >= 11 && finalRoll <= 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">That’s a tiny one! It’s got <b>Swift Swim</b>. This Magikarp weighs only <b>5.0</b> kg <b>(XXXS)</b>!</div>`;
        } else if (finalRoll >= 21 && finalRoll <= 30) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">This small Magikarp seems <b>Rattled</b>. It only weighs <b>7.5</b> kg <b>(XXS)</b>!</div>`;
        } else if (finalRoll >= 31 && finalRoll <= 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">This small Magikarp is going for a <b>Swift Swim</b>. It only weighs <b>7.5</b> kg <b>(XXS)</b>!</div>`;
        } else if (finalRoll >= 41 && finalRoll <= 50) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Appears to be slightly small and a bit <b>Rattled</b>. It only weighs <b>9.0</b> kg <b>(XS)</b>!</div>`;
        } else if (finalRoll >= 51 && finalRoll <= 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Appears to be slightly small during its <b>Swift Swim</b>. It only weighs <b>9.0</b> kg <b>(XS)</b>!</div>`;
        } else if (finalRoll >= 61 && finalRoll <= 70) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">A standard catch! This one’s a bit <b>Rattled</b> and weighs <b>10.0</b> kg <b>(Normal)</b>!</div>`;
        } else if (finalRoll >= 71 && finalRoll <= 80) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">A standard catch! This one’s rocking <b>Swift Swim</b> and weighs <b>10.0</b> kg <b>(Normal)</b>!</div>`;
        } else if (finalRoll >= 81 && finalRoll <= 90) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Pretty hefty! This <b>Rattled</b> Magikarp weighs <b>11.0</b> kg <b>(XL)</b>!</div>`;
        } else if (finalRoll >= 91 && finalRoll <= 100) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Pretty hefty! This <b>Swift Swim</b> Magikarp weighs <b>11.0</b> kg <b>(XL)</b>!</div>`;
        } else if (finalRoll >= 101 && finalRoll <= 110) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">It’s heavy! With its <b>Rattled</b> nature, this Magikarp weighs <b>12.5</b> kg <b>(XXL)</b>!</div>`;
        } else if (finalRoll >= 111 && finalRoll <= 120) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">It’s heavy! With its <b>Swift Swim</b> ability, this Magikarp weighs <b>12.5</b> kg <b>(XXL)</b>!</div>`;
        } else if (finalRoll >= 121 && finalRoll <= 130) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Holy smokes! It’s huge! A whopping <b>15.0</b> kg <b>(XXXL)</b> and clearly <b>Rattled</b>!</div>`;
        } else if (finalRoll >= 131 && finalRoll <= 140) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Holy smokes! It’s huge! A whopping <b>15.0</b> kg <b>(XXXL)</b> and surprisingly quick with <b>Swift Swim</b>!</div>`;
        } else if (finalRoll >= 141 && finalRoll <= 150) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">It’s an <b>Alpha</b> Magikarp radiating power! It has the ability <b>Wild Might</b> and weighs <b>22.5</b> kg <b>(ALPHA)</b>!</div>`;
        } else if (finalRoll >= 151 && finalRoll <= 160) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Its pattern is shimmering with its own light thanks to being an <b>Illumina</b> Magikarp! It has the ability <b>Illuminate</b> and weighs <b>10.5</b> kg <b>(Normal)</b>!</div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Magikarp"><div class="cramomatic-desc">Something went wrong.</div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.mj-2').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // mj-3 -> Species
    // -----------------------------
    $('.mj-3 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.mj-3').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 1) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Shiny.png" title="Shiny Magikarp"><div class="cramomatic-desc">It's a <b>Shiny</b>! This rarely found Magikarp glitters like gold from front to tail fin!</div>`;
        } else if (finalRoll === 2) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Feebas.png" title="Feebas"><div class="cramomatic-desc">A wild <b>Feebas</b> appears in place of a Magikarp!</div>`;
        } else if (finalRoll >= 3 && finalRoll <= 5) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange.png" title="Orange Magikarp"><div class="cramomatic-desc">It's the familiar old Magikarp pattern loved by so many.</div>`;
        } else if (finalRoll === 6) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Skelly.png" title="Orange Skelly Magikarp"><div class="cramomatic-desc">It has an <b>Orange Skelly</b> pattern! This Magikarp is known for the spiny-looking white lines visible on its orange body.</div>`;
        } else if (finalRoll === 7) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Orange%20&%20White).png" title="Calico (Orange & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Orange & White)</b> pattern! The basic example of a calico pattern has orange and white patches.</div>`;
        } else if (finalRoll === 8) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Orange%2C%20White%2C%20Black).png" title="Calico (Orange, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Orange, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of orange, white, and black.</div>`;
        } else if (finalRoll === 9) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Orange%20&%20Gold).png" title="Calico (Orange & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Orange & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and orange calico!</div>`;
        } else if (finalRoll === 10) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Orange).png" title="Calico (White & Orange) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Orange)</b> pattern! This slightly different calico pattern has orange patches on a white field.</div>`;
        } else if (finalRoll === 11) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Two-Tone.png" title="Orange Two-Tone Magikarp"><div class="cramomatic-desc">It has an <b>Orange Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of orange and white.</div>`;
        } else if (finalRoll === 12) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Orca.png" title="Orange Orca Magikarp"><div class="cramomatic-desc">It has an <b>Orange Orca</b> pattern! This rather rare orange two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 13) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Dapples.png" title="Orange Dapples Magikarp"><div class="cramomatic-desc">It has an <b>Orange Dapples</b> pattern! This orange two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 14) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Bubbles.png" title="Orange Bubbles Magikarp"><div class="cramomatic-desc">It has an <b>Orange Bubbles</b> pattern! This vivid bubble pattern in orange has many fans.</div>`;
        } else if (finalRoll === 15) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Diamonds.png" title="Orange Diamonds Magikarp"><div class="cramomatic-desc">It has an <b>Orange Diamonds</b> pattern! This orange pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 16) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Patches.png" title="Orange Patches Magikarp"><div class="cramomatic-desc">It has an <b>Orange Patches</b> pattern! This captivating pattern has patches of orange on a white field.</div>`;
        } else if (finalRoll === 17) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Tiger.png" title="Orange Tiger Magikarp"><div class="cramomatic-desc">It has an <b>Orange Tiger</b> pattern! This wild orange striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 18) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Zebra.png" title="Orange Zebra Magikarp"><div class="cramomatic-desc">It has an <b>Orange Zebra</b> pattern! This striped orange pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 19) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Stripes.png" title="Orange Stripes Magikarp"><div class="cramomatic-desc">It has an <b>Orange Stripes</b> pattern! This basic orange striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Forehead.png" title="Orange Forehead Magikarp"><div class="cramomatic-desc">It has an <b>Orange Forehead</b> pattern! This playful-looking pattern is known for the bright orange patch on its forehead.</div>`;
        } else if (finalRoll === 21) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Mask.png" title="Orange Mask Magikarp"><div class="cramomatic-desc">It has an <b>Orange Mask</b> pattern! This eye-catching pattern has a splash of orange coloration only on its face.</div>`;
        } else if (finalRoll === 22) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Orange.png" title="Saucy Orange Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Orange</b> pattern! The splashy orange pattern on its back looks as though a bucket of orange paint was upended onto it.</div>`;
        } else if (finalRoll === 23) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Orange%20Raindrop.png" title="Orange Raindrop Magikarp"><div class="cramomatic-desc">It has an <b>Orange Raindrop</b> pattern! The drippy orange patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 24) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot.png" title="Apricot Magikarp"><div class="cramomatic-desc">It has an <b>Apricot</b> pattern! This Magikarp's entire body has taken on a brilliant apricot hue!</div>`;
        } else if (finalRoll === 25) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Skelly.png" title="Apricot Skelly Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its apricot body.</div>`;
        } else if (finalRoll === 26) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Apricot%20&%20White).png" title="Calico (Apricot & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Apricot & White)</b> pattern! The basic example of a calico pattern has apricot and white patches.</div>`;
        } else if (finalRoll === 27) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Apricot%2C%20White%2C%20Black).png" title="Calico (Apricot, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Apricot, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of apricot, white, and black.</div>`;
        } else if (finalRoll === 28) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Apricot%20&%20Gold).png" title="Calico (Apricot & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Apricot & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and apricot calico!</div>`;
        } else if (finalRoll === 29) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Apricot).png" title="Calico (White & Apricot) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Apricot)</b> pattern! This slightly different calico pattern has apricot patches on a white field.</div>`;
        } else if (finalRoll === 30) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Two-Tone.png" title="Apricot Two-Tone Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of apricot and white.</div>`;
        } else if (finalRoll === 31) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Orca.png" title="Apricot Orca Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Orca</b> pattern! This rather rare apricot two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 32) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Dapples.png" title="Apricot Dapples Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Dapples</b> pattern! This apricot two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 33) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Bubbles.png" title="Apricot Bubbles Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Bubbles</b> pattern! This vivid bubble pattern in apricot has many fans.</div>`;
        } else if (finalRoll === 34) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Diamonds.png" title="Apricot Diamonds Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Diamonds</b> pattern! This apricot pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 35) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Patches.png" title="Apricot Patches Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Patches</b> pattern! This captivating pattern has patches of apricot on a white field.</div>`;
        } else if (finalRoll === 36) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Tiger.png" title="Apricot Tiger Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Tiger</b> pattern! This wild apricot striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 37) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Zebra.png" title="Apricot Zebra Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Zebra</b> pattern! This striped apricot pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 38) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Stripes.png" title="Apricot Stripes Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Stripes</b> pattern! This basic apricot striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 39) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Forehead.png" title="Apricot Forehead Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Forehead</b> pattern! This playful-looking pattern is known for the bright apricot patch on its forehead.</div>`;
        } else if (finalRoll === 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Mask.png" title="Apricot Mask Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Mask</b> pattern! This eye-catching pattern has a splash of apricot coloration only on its face.</div>`;
        } else if (finalRoll === 41) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Apricot.png" title="Saucy Apricot Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Apricot</b> pattern! The splashy apricot pattern on its back looks as though a bucket of apricot paint was upended onto it.</div>`;
        } else if (finalRoll === 42) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Apricot%20Raindrop.png" title="Apricot Raindrop Magikarp"><div class="cramomatic-desc">It has an <b>Apricot Raindrop</b> pattern! The drippy apricot patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 43) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown.png" title="Brown Magikarp"><div class="cramomatic-desc">It has a <b>Brown</b> pattern! This Magikarp's entire body has taken on a brilliant brown hue!</div>`;
        } else if (finalRoll === 44) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Skelly.png" title="Brown Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Brown Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its brown body.</div>`;
        } else if (finalRoll === 45) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Brown%20&%20White).png" title="Calico (Brown & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Brown & White)</b> pattern! The basic example of a calico pattern has brown and white patches.</div>`;
        } else if (finalRoll === 46) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Brown%2C%20White%2C%20Black).png" title="Calico (Brown, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Brown, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of brown, white, and black.</div>`;
        } else if (finalRoll === 47) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Brown%20&%20Gold).png" title="Calico (Brown & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Brown & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and brown calico!</div>`;
        } else if (finalRoll === 48) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Brown).png" title="Calico (White & Brown) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Brown)</b> pattern! This slightly different calico pattern has brown patches on a white field.</div>`;
        } else if (finalRoll === 49) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Two-Tone.png" title="Brown Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Brown Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of brown and white.</div>`;
        } else if (finalRoll === 50) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Orca.png" title="Brown Orca Magikarp"><div class="cramomatic-desc">It has a <b>Brown Orca</b> pattern! This rather rare brown two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 51) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Dapples.png" title="Brown Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Brown Dapples</b> pattern! This brown two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 52) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Bubbles.png" title="Brown Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Brown Bubbles</b> pattern! This understated bubble pattern in brown has many fans.</div>`;
        } else if (finalRoll === 53) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Diamonds.png" title="Brown Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Brown Diamonds</b> pattern! This brown pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 54) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Patches.png" title="Brown Patches Magikarp"><div class="cramomatic-desc">It has a <b>Brown Patches</b> pattern! This captivating pattern has patches of brown on a white field.</div>`;
        } else if (finalRoll === 55) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Tiger.png" title="Brown Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Brown Tiger</b> pattern! This wild brown striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 56) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Zebra.png" title="Brown Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Brown Zebra</b> pattern! This striped brown pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 57) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Stripes.png" title="Brown Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Brown Stripes</b> pattern! This basic brown striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 58) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Forehead.png" title="Brown Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Brown Forehead</b> pattern! This playful-looking pattern is known for the bright brown patch on its forehead.</div>`;
        } else if (finalRoll === 59) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Mask.png" title="Brown Mask Magikarp"><div class="cramomatic-desc">It has a <b>Brown Mask</b> pattern! This eye-catching pattern has a splash of brown coloration only on its face.</div>`;
        } else if (finalRoll === 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Brown.png" title="Saucy Brown Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Brown</b> pattern! The splashy brown pattern on its back looks as though a bucket of brown paint was upended onto it.</div>`;
        } else if (finalRoll === 61) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Brown%20Raindrop.png" title="Brown Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Brown Raindrop</b> pattern! The drippy brown patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 62) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple.png" title="Purple Magikarp"><div class="cramomatic-desc">It has a <b>Purple</b> pattern! This Magikarp's entire body has taken on a brilliant purple hue!</div>`;
        } else if (finalRoll === 63) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Skelly.png" title="Purple Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Purple Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its purple body.</div>`;
        } else if (finalRoll === 64) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Purple%20&%20White).png" title="Calico (Purple & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Purple & White)</b> pattern! The basic example of a calico pattern has purple and white patches.</div>`;
        } else if (finalRoll === 65) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Purple%2C%20White%2C%20Black).png" title="Calico (Purple, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Purple, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of purple, white, and black.</div>`;
        } else if (finalRoll === 66) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Purple%20&%20Gold).png" title="Calico (Purple & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Purple & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and purple calico!</div>`;
        } else if (finalRoll === 67) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Purple).png" title="Calico (White & Purple) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Purple)</b> pattern! This slightly different calico pattern has purple patches on a white field.</div>`;
        } else if (finalRoll === 68) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Two-Tone.png" title="Purple Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Purple Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of purple and white.</div>`;
        } else if (finalRoll === 69) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Orca.png" title="Purple Orca Magikarp"><div class="cramomatic-desc">It has a <b>Purple Orca</b> pattern! This rather rare purple two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 70) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Dapples.png" title="Purple Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Purple Dapples</b> pattern! This purple two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 71) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Bubbles.png" title="Purple Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Purple Bubbles</b> pattern! This vivid bubble pattern in purple has many fans.</div>`;
        } else if (finalRoll === 72) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Diamonds.png" title="Purple Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Purple Diamonds</b> pattern! This purple pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 73) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Patches.png" title="Purple Patches Magikarp"><div class="cramomatic-desc">It has a <b>Purple Patches</b> pattern! This captivating pattern has patches of purple on a white field.</div>`;
        } else if (finalRoll === 74) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Tiger.png" title="Purple Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Purple Tiger</b> pattern! This wild purple striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 75) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Zebra.png" title="Purple Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Purple Zebra</b> pattern! This striped purple pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 76) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Stripes.png" title="Purple Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Purple Stripes</b> pattern! This basic purple striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 77) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Forehead.png" title="Purple Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Purple Forehead</b> pattern! This playful-looking pattern is known for the bright purple patch on its forehead.</div>`;
        } else if (finalRoll === 78) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Mask.png" title="Purple Mask Magikarp"><div class="cramomatic-desc">It has a <b>Purple Mask</b> pattern! This eye-catching pattern has a splash of purple coloration only on its face.</div>`;
        } else if (finalRoll === 79) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Purple.png" title="Saucy Purple Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Purple</b> pattern! The splashy purple pattern on its back looks as though a bucket of purple paint was upended onto it.</div>`;
        } else if (finalRoll === 80) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Purple%20Raindrop.png" title="Purple Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Purple Raindrop</b> pattern! The drippy purple patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 81) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet.png" title="Violet Magikarp"><div class="cramomatic-desc">It has a <b>Violet</b> pattern! This Magikarp's entire body has taken on a brilliant violet hue!</div>`;
        } else if (finalRoll === 82) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Skelly.png" title="Violet Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Violet Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its violet body.</div>`;
        } else if (finalRoll === 83) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Violet%20&%20White).png" title="Calico (Violet & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Violet & White)</b> pattern! The basic example of a calico pattern has violet and white patches.</div>`;
        } else if (finalRoll === 84) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Violet%2C%20White%2C%20Black).png" title="Calico (Violet, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Violet, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of violet, white, and black.</div>`;
        } else if (finalRoll === 85) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Violet%20&%20Gold).png" title="Calico (Violet & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Violet & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and violet calico!</div>`;
        } else if (finalRoll === 86) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Violet).png" title="Calico (White & Violet) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Violet)</b> pattern! This slightly different calico pattern has violet patches on a white field.</div>`;
        } else if (finalRoll === 87) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Two-Tone.png" title="Violet Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Violet Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of violet and white.</div>`;
        } else if (finalRoll === 88) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Orca.png" title="Violet Orca Magikarp"><div class="cramomatic-desc">It has a <b>Violet Orca</b> pattern! This rather rare violet two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 89) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Dapples.png" title="Violet Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Violet Dapples</b> pattern! This violet two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 90) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Bubbles.png" title="Violet Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Violet Bubbles</b> pattern! This vivid bubble pattern in violet has many fans.</div>`;
        } else if (finalRoll === 91) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Diamonds.png" title="Violet Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Violet Diamonds</b> pattern! This violet pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 92) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Patches.png" title="Violet Patches Magikarp"><div class="cramomatic-desc">It has a <b>Violet Patches</b> pattern! This captivating pattern has patches of violet on a white field.</div>`;
        } else if (finalRoll === 93) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Tiger.png" title="Violet Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Violet Tiger</b> pattern! This wild violet striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 94) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Zebra.png" title="Violet Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Violet Zebra</b> pattern! This striped violet pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 95) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Stripes.png" title="Violet Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Violet Stripes</b> pattern! This basic violet striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 96) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Forehead.png" title="Violet Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Violet Forehead</b> pattern! This playful-looking pattern is known for the bright violet patch on its forehead.</div>`;
        } else if (finalRoll === 97) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Mask.png" title="Violet Mask Magikarp"><div class="cramomatic-desc">It has a <b>Violet Mask</b> pattern! This eye-catching pattern has a splash of violet coloration only on its face.</div>`;
        } else if (finalRoll === 98) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Violet.png" title="Saucy Violet Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Violet</b> pattern! The splashy violet pattern on its back looks as though a bucket of violet paint was upended onto it.</div>`;
        } else if (finalRoll === 99) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Violet%20Raindrop.png" title="Violet Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Violet Raindrop</b> pattern! The drippy violet patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 100) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink.png" title="Pink Magikarp"><div class="cramomatic-desc">It has a <b>Pink</b> pattern! This Magikarp's entire body has taken on a brilliant pink hue!</div>`;
        } else if (finalRoll === 101) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Skelly.png" title="Pink Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Pink Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its pink body.</div>`;
        } else if (finalRoll === 102) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Pink%20&%20White).png" title="Calico (Pink & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Pink & White)</b> pattern! The basic example of a calico pattern has pink and white patches.</div>`;
        } else if (finalRoll === 103) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Pink%2C%20White%2C%20Black).png" title="Calico (Pink, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Pink, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of pink, white, and black.</div>`;
        } else if (finalRoll === 104) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Pink%20&%20Gold).png" title="Calico (Pink & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Pink & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and pink calico!</div>`;
        } else if (finalRoll === 105) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Pink).png" title="Calico (White & Pink) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Pink)</b> pattern! This slightly different calico pattern has pink patches on a white field.</div>`;
        } else if (finalRoll === 106) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Two-Tone.png" title="Pink Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Pink Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of pink and white.</div>`;
        } else if (finalRoll === 107) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Orca.png" title="Pink Orca Magikarp"><div class="cramomatic-desc">It has a <b>Pink Orca</b> pattern! This rather rare pink two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 108) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Dapples.png" title="Pink Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Pink Dapples</b> pattern! This pink two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 109) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Bubbles.png" title="Pink Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Pink Bubbles</b> pattern! This vivid bubble pattern in pink has many fans.</div>`;
        } else if (finalRoll === 110) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Diamonds.png" title="Pink Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Pink Diamonds</b> pattern! This pink pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 111) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Patches.png" title="Pink Patches Magikarp"><div class="cramomatic-desc">It has a <b>Pink Patches</b> pattern! This captivating pattern has patches of pink on a white field.</div>`;
        } else if (finalRoll === 112) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Tiger.png" title="Pink Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Pink Tiger</b> pattern! This wild pink striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 113) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Zebra.png" title="Pink Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Pink Zebra</b> pattern! This striped pink pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 114) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Stripes.png" title="Pink Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Pink Stripes</b> pattern! This basic pink striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 115) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Forehead.png" title="Pink Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Pink Forehead</b> pattern! This playful-looking pattern is known for the bright pink patch on its forehead.</div>`;
        } else if (finalRoll === 116) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Mask.png" title="Pink Mask Magikarp"><div class="cramomatic-desc">It has a <b>Pink Mask</b> pattern! This eye-catching pattern has a splash of pink coloration only on its face.</div>`;
        } else if (finalRoll === 117) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Pink.png" title="Saucy Pink Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Pink</b> pattern! The splashy pink pattern on its back looks as though a bucket of pink paint was upended onto it.</div>`;
        } else if (finalRoll === 118) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Pink%20Raindrop.png" title="Pink Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Pink Raindrop</b> pattern! The drippy pink patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 119) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray.png" title="Gray Magikarp"><div class="cramomatic-desc">It has a <b>Gray</b> pattern! This Magikarp's entire body has taken on a brilliant gray hue!</div>`;
        } else if (finalRoll === 120) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Skelly.png" title="Gray Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Gray Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its gray body.</div>`;
        } else if (finalRoll === 121) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Gray%20&%20White).png" title="Calico (Gray & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Gray & White)</b> pattern! The basic example of a calico pattern has gray and white patches.</div>`;
        } else if (finalRoll === 122) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Gray%2C%20White%2C%20Black).png" title="Calico (Gray, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Gray, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of gray, white, and black.</div>`;
        } else if (finalRoll === 123) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Gray%20&%20Gold).png" title="Calico (Gray & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Gray & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and gray calico!</div>`;
        } else if (finalRoll === 124) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Gray).png" title="Calico (White & Gray) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Gray)</b> pattern! This slightly different calico pattern has gray patches on a white field.</div>`;
        } else if (finalRoll === 125) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Two-Tone.png" title="Gray Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Gray Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of gray and white.</div>`;
        } else if (finalRoll === 126) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Orca.png" title="Gray Orca Magikarp"><div class="cramomatic-desc">It has a <b>Gray Orca</b> pattern! This rather rare gray two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 127) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Dapples.png" title="Gray Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Gray Dapples</b> pattern! This gray two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 128) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Bubbles.png" title="Gray Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Gray Bubbles</b> pattern! This understated bubble pattern in gray has many fans.</div>`;
        } else if (finalRoll === 129) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Diamonds.png" title="Gray Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Gray Diamonds</b> pattern! This gray pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 130) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Patches.png" title="Gray Patches Magikarp"><div class="cramomatic-desc">It has a <b>Gray Patches</b> pattern! This captivating pattern has patches of gray on a white field.</div>`;
        } else if (finalRoll === 131) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Tiger.png" title="Gray Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Gray Tiger</b> pattern! This wild gray striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 132) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Zebra.png" title="Gray Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Gray Zebra</b> pattern! This striped gray pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 133) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Stripes.png" title="Gray Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Gray Stripes</b> pattern! This basic gray striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 134) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Forehead.png" title="Gray Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Gray Forehead</b> pattern! This playful-looking pattern is known for the bright gray patch on its forehead.</div>`;
        } else if (finalRoll === 135) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Mask.png" title="Gray Mask Magikarp"><div class="cramomatic-desc">It has a <b>Gray Mask</b> pattern! This eye-catching pattern has a splash of gray coloration only on its face.</div>`;
        } else if (finalRoll === 136) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Gray.png" title="Saucy Gray Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Gray</b> pattern! The splashy gray pattern on its back looks as though a bucket of gray paint was upended onto it.</div>`;
        } else if (finalRoll === 137) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Gray%20Raindrop.png" title="Gray Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Gray Raindrop</b> pattern! The drippy gray patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 138) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue.png" title="Blue Magikarp"><div class="cramomatic-desc">It has a <b>Blue</b> pattern! This Magikarp's entire body has taken on a brilliant blue hue!</div>`;
        } else if (finalRoll === 139) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Skelly.png" title="Blue Skelly Magikarp"><div class="cramomatic-desc">It has a <b>Blue Skelly</b> pattern! This Magikarp is known for the spiny-looking lines visible on its blue body.</div>`;
        } else if (finalRoll === 140) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Blue%20&%20White).png" title="Calico (Blue & White) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Blue & White)</b> pattern! The basic example of a calico pattern has blue and white patches.</div>`;
        } else if (finalRoll === 141) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Blue%2C%20White%2C%20Black).png" title="Calico (Blue, White, Black) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Blue, White, Black)</b> pattern! This calico pattern Magikarp looks a bit extravagant with its three colors of blue, white, and black.</div>`;
        } else if (finalRoll === 142) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(Blue%20&%20Gold).png" title="Calico (Blue & Gold) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (Blue & Gold)</b> pattern! You'll feel fortunate when you see this glittering gold and blue calico!</div>`;
        } else if (finalRoll === 143) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Calico%20(White%20&%20Blue).png" title="Calico (White & Blue) Magikarp"><div class="cramomatic-desc">It has a <b>Calico (White & Blue)</b> pattern! This slightly different calico pattern has blue patches on a white field.</div>`;
        } else if (finalRoll === 144) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Two-Tone.png" title="Blue Two-Tone Magikarp"><div class="cramomatic-desc">It has a <b>Blue Two-Tone</b> pattern! This basic two-tone pattern has clearly divided sections of blue and white.</div>`;
        } else if (finalRoll === 145) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Orca.png" title="Blue Orca Magikarp"><div class="cramomatic-desc">It has a <b>Blue Orca</b> pattern! This rather rare blue two-tone pattern looks like it would make for a swift swimmer.</div>`;
        } else if (finalRoll === 146) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Dapples.png" title="Blue Dapples Magikarp"><div class="cramomatic-desc">It has a <b>Blue Dapples</b> pattern! This blue two-tone pattern is reminiscent of the spray thrown up by the ocean waves.</div>`;
        } else if (finalRoll === 147) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Bubbles.png" title="Blue Bubbles Magikarp"><div class="cramomatic-desc">It has a <b>Blue Bubbles</b> pattern! This vivid bubble pattern in blue has many fans.</div>`;
        } else if (finalRoll === 148) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Diamonds.png" title="Blue Diamonds Magikarp"><div class="cramomatic-desc">It has a <b>Blue Diamonds</b> pattern! This blue pattern is covered with spots that look like diamonds.</div>`;
        } else if (finalRoll === 149) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Patches.png" title="Blue Patches Magikarp"><div class="cramomatic-desc">It has a <b>Blue Patches</b> pattern! This captivating pattern has patches of blue on a white field.</div>`;
        } else if (finalRoll === 150) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Tiger.png" title="Blue Tiger Magikarp"><div class="cramomatic-desc">It has a <b>Blue Tiger</b> pattern! This wild blue striped pattern gives an impression of fierce strength.</div>`;
        } else if (finalRoll === 151) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Zebra.png" title="Blue Zebra Magikarp"><div class="cramomatic-desc">It has a <b>Blue Zebra</b> pattern! This striped blue pattern has a real sense of personality captured in its winding lines.</div>`;
        } else if (finalRoll === 152) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Stripes.png" title="Blue Stripes Magikarp"><div class="cramomatic-desc">It has a <b>Blue Stripes</b> pattern! This basic blue striped pattern is simply striking, no matter how you look at it.</div>`;
        } else if (finalRoll === 153) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Forehead.png" title="Blue Forehead Magikarp"><div class="cramomatic-desc">It has a <b>Blue Forehead</b> pattern! This playful-looking pattern is known for the bright blue patch on its forehead.</div>`;
        } else if (finalRoll === 154) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Mask.png" title="Blue Mask Magikarp"><div class="cramomatic-desc">It has a <b>Blue Mask</b> pattern! This eye-catching pattern has a splash of blue coloration only on its face.</div>`;
        } else if (finalRoll === 155) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Saucy%20Blue.png" title="Saucy Blue Magikarp"><div class="cramomatic-desc">It has a <b>Saucy Blue</b> pattern! The splashy blue pattern on its back looks as though a bucket of blue paint was upended onto it.</div>`;
        } else if (finalRoll === 156) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Blue%20Raindrop.png" title="Blue Raindrop Magikarp"><div class="cramomatic-desc">It has a <b>Blue Raindrop</b> pattern! The drippy blue patterns decorating its back are exquisite.</div>`;
        } else if (finalRoll === 157) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/White.png" title="White Magikarp"><div class="cramomatic-desc">It has a <b>White</b> pattern! This Magikarp's entire body has taken on a radiant white hue!</div>`;
        } else if (finalRoll === 158) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Black.png" title="Black Magikarp"><div class="cramomatic-desc">It has a <b>Black</b> pattern! This Magikarp's entire body has taken on a inky black hue!</div>`;
        } else if (finalRoll === 159) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Shiny%20Feebas.png" title="Shiny Feebas"><div class="cramomatic-desc">A beautiful <b>Shiny Feebas</b> appears in place of a Magikarp!</div>`;
        } else if (finalRoll === 160) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Magikarp%20Jump/Ditto.png" title="Ditto"><div class="cramomatic-desc">It's not a Magikarp at all! A <b>Ditto</b> was hiding among the Magikarp in disguise!</div>`;
        } else {
            resultText = `<div class="cramomatic-desc">Something went wrong.</div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.mj-3').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });
}

$(document).ready(function () {
    MJDice();

    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            MJDice();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
});
