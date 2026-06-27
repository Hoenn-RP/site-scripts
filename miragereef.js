function MirageReefDice() {

    // -----------------------------
    // miragereef-1 → Aura Color
    // -----------------------------
    $('.miragereef-1 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.miragereef-1').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/gold.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a brilliant <b>GOLD</b> color!</div>`;
        } else if (finalRoll <= 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/silver.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a pale <b>SILVER</b> color!</div>`;
        } else if (finalRoll <= 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/seafoamaura.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a soft <b>SEAFOAM</b> color!</div>`;
        } else if (finalRoll <= 80) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/blue.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a vivid <b>AZURE</b> blue color!</div>`;
        } else if (finalRoll <= 90) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/umbra.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a deep <b>UMBRA</b> purple color!</div>`;
        } else if (finalRoll <= 100) {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/pinkaura.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura glows a warm <b>CORAL</b> pink color!</div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://file.garden/aj8NOoeIBzAJUnjd/Aura/rainbow.gif" title="Mirage Reef"><div class="cramomatic-desc">A shimmering trail cuts through the water! The illumina aura seems to fluctuate like a <b>RAINBOW</b>!</div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.miragereef-1').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // miragereef-2 → Effect / Variance
    // -----------------------------
    $('.miragereef-2 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.miragereef-2').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 30) {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/tm/bug.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group know <b>BIOLUMINESCENT BAIT!</b></div>`;
        } else if (finalRoll <= 50) {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/tm/electric.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group know <b>PHOTOVOLTAIC VEIL!</b></div>`;
        } else if (finalRoll <= 70) {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/tm/grass.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group know <b>GLITTER BOMB!</b></div>`;
        } else if (finalRoll <= 90) {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/tm/rock.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group know <b>MOISSANITE BEAM!</b></div>`;
        } else if (finalRoll <= 100) {
            resultText = `<img style="padding:28px;" src="https://i.ibb.co/rk1GV3N/shiny-swap.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group are <b>SHINY!</b></div>`;
        } else if (finalRoll <= 110) {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/medicine/ability-capsule.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group have an <b>ADDITIONAL ABILITY SLOT!</b></div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/rule-book.png" title="Mirage Reef"><div class="cramomatic-desc">The pokemon in this group have an <b>ADDITIONAL MOVE SLOT!</b></div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.miragereef-2').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // miragereef-3 → Species
    // -----------------------------
    $('.miragereef-3 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.miragereef-3').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 5) {
            // Cursola - #864
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/864.png" title="Cursola"><div class="cramomatic-desc">A group of <b>Cursola</b> rises from the reef!</div>`;
        } else if (finalRoll <= 10) {
            // Cloyster - #91
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png" title="Cloyster"><div class="cramomatic-desc">A group of <b>Cloyster</b> rises from the reef!</div>`;
        } else if (finalRoll <= 15) {
            // Mantine - #226
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/226.png" title="Mantine"><div class="cramomatic-desc">A group of <b>Mantine</b> glides through the water!</div>`;
        } else if (finalRoll <= 20) {
            // Octillery - #224
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/224.png" title="Octillery"><div class="cramomatic-desc">A group of <b>Octillery</b> emerges from the depths!</div>`;
        } else if (finalRoll <= 25) {
            // Sharpedo - #319
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/319.png" title="Sharpedo"><div class="cramomatic-desc">A pack of <b>Sharpedo</b> cuts through the water!</div>`;
        } else if (finalRoll <= 30) {
            // Clamperl - #366
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/366.png" title="Clamperl"><div class="cramomatic-desc">A group of <b>Clamperl</b> surfaces from the seafloor!</div>`;
        } else if (finalRoll <= 35) {
            // Jellicent - #593
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/593.png" title="Jellicent"><div class="cramomatic-desc">A group of <b>Jellicent</b> drifts into view!</div>`;
        } else if (finalRoll <= 40) {
            // Wishiwashi - #746
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/746.png" title="Wishiwashi"><div class="cramomatic-desc">A school of <b>Wishiwashi</b> swirls in the current!</div>`;
        } else if (finalRoll <= 45) {
            // Palafin - #964
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/964.png" title="Palafin"><div class="cramomatic-desc">A pod of <b>Palafin</b> is here to save the day!</div>`;
        } else if (finalRoll <= 50) {
            // Wailord - #321
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/321.png" title="Wailord"><div class="cramomatic-desc">A group of <b>Wailord</b> suddenly appear!</div>`;
        } else if (finalRoll <= 55) {
            // Lapras - #131
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png" title="Lapras"><div class="cramomatic-desc">A group of <b>Lapras</b> glides peacefully into view!</div>`;
        } else if (finalRoll <= 60) {
            // Kingdra - #230
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/230.png" title="Kingdra"><div class="cramomatic-desc">A group of <b>Kingdra</b> spirals up from the deep!</div>`;
        } else if (finalRoll <= 65) {
            // Overqwil - #904
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/904.png" title="Overqwil"><div class="cramomatic-desc">A group of <b>Overqwil</b> surges through the reef!</div>`;
        } else if (finalRoll <= 70) {
            // Vaporeon - #134
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png" title="Vaporeon"><div class="cramomatic-desc">A group of <b>Vaporeon</b> dissolves in and out of the waters!</div>`;
        } else if (finalRoll <= 75) {
            // Lanturn - #171
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/171.png" title="Lanturn"><div class="cramomatic-desc">A group of <b>Lanturn</b> lights up the dark water!</div>`;
        } else if (finalRoll <= 80) {
            // Lumineon - #457
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/457.png" title="Lumineon"><div class="cramomatic-desc">A group of <b>Lumineon</b> fans their fins through the current!</div>`;
        } else if (finalRoll <= 85) {
            // Armaldo - #348
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/348.png" title="Armaldo"><div class="cramomatic-desc">A group of <b>Armaldo</b> emerges from the ancient reef!</div>`;
        } else if (finalRoll <= 90) {
            // Cradily - #346
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/346.png" title="Cradily"><div class="cramomatic-desc">A group of <b>Cradily</b> sways up from the seafloor!</div>`;
        } else if (finalRoll <= 95) {
            // Primarina - #730
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png" title="Primarina"><div class="cramomatic-desc">A group of <b>Primarina</b> sing their way into view!</div>`;
        } else if (finalRoll <= 100) {
            // Milotic - #350
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/350.png" title="Milotic"><div class="cramomatic-desc">A group of <b>Milotic</b> arches gracefully through the water!</div>`;
        } else {
            // Phione - #489
            resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/489.png" title="Phione"><div class="cramomatic-desc">A group of <b>Phione</b> magically appear!</div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.miragereef-3').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });
}

$(document).ready(function () {
    MirageReefDice();

    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            MirageReefDice();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
});
