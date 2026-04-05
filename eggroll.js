function EggrollDice() {

    // -----------------------------
    // eggroll-1 → Moves
    // -----------------------------
    $('.eggroll-1 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.eggroll-1').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg1.png" title="Pokemon Egg"><div class="cramomatic-desc">This egg is kind of neat! It must have <b>ONE TM MOVE!</b></div>`;
        } else if (finalRoll <= 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg1.png" title="Pokemon Egg"><div class="cramomatic-desc">This egg seems different! It must have <b>ONE EGG MOVE!</b></div>`;
        } else if (finalRoll <= 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg1.png" title="Pokemon Egg"><div class="cramomatic-desc">This egg is really different! It must have <b>TWO EGG MOVES!</b></div>`;
        } else if (finalRoll <= 80) {
            resultText = `<img style="padding:28px;"" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg1.png" title="Pokemon Egg"><div class="cramomatic-desc">This egg is very special! It must have <b>ONE EVENT MOVE!</b></div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg1.png" title="Pokemon Egg"><div class="cramomatic-desc">This egg is something else! It must have the move <b>WISH!</b></div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.eggroll-1').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // eggroll-2 → Effects
    // -----------------------------
    $('.eggroll-2 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.eggroll-2').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        if (finalRoll <= 20) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? It's rumbling like it has a <b>HIDDEN ABILITY!</b></div>`;
        } else if (finalRoll <= 40) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg is pretty, so it must have a <b>CUTE CHARM ABILITY!</b></div>`;
        } else if (finalRoll <= 60) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg is sparkling, so it must be <b>SHINY!</b></div>`;
        } else if (finalRoll <= 80) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg has a pinkish hue, so the pokemon inside must be <b>PINK!</b></div>`;
        } else if (finalRoll <= 100) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg is glowing oddly, it must be an <b>ILLUMINA POKEMON!</b></div>`;
        } else if (finalRoll <= 110) {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg seems tough, the pokemon inside must have an <b>EXTRA MOVESLOT!</b></div>`;
        } else {
            resultText = `<img style="padding:28px;" src="https://file.garden/Zl6qcCeckR3IfItG/Eggroll/egg2.gif" title="Pokemon Egg"><div class="cramomatic-desc">Oh? This egg seems unique, the pokemon inside must have an <b>EXTRA ABILITY SLOT!</b></div>`;
        }

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.eggroll-2').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });

    // -----------------------------
    // eggroll-3 → Species
    // -----------------------------
    $('.eggroll-3 .vdice-value').each(function () {
        if ($(this).data('processed')) return;

        const baseRoll = parseInt($(this).text().trim(), 10);
        if (isNaN(baseRoll)) return;

        const modifierText = $(this).closest('.eggroll-3').clone().children('.vdice-box').remove().end().text();
        const modMatch = modifierText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;
        const finalRoll = baseRoll + modifier;

        let resultText = '';

if (finalRoll <= 4) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/659.png" title="Bunnelby Egg"><div class="cramomatic-desc"><b>Bunnelby</b> hatched from the egg!</div>`;
} else if (finalRoll <= 8) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/420.png" title="Cherubi Egg"><div class="cramomatic-desc"><b>Cherubi</b> hatched from the egg!</div>`;
} else if (finalRoll <= 12) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/602.png" title="Tynamo Egg"><div class="cramomatic-desc"><b>Tynamo</b> hatched from the egg!</div>`;
} else if (finalRoll <= 16) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" title="Psyduck Egg"><div class="cramomatic-desc"><b>Psyduck</b> hatched from the egg!</div>`;
} else if (finalRoll <= 20) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/285.png" title="Shroomish Egg"><div class="cramomatic-desc"><b>Shroomish</b> hatched from the egg!</div>`;
} else if (finalRoll <= 24) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/175.png" title="Togepi Egg"><div class="cramomatic-desc"><b>Togepi</b> hatched from the egg!</div>`;
} else if (finalRoll <= 28) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/236.png" title="Tyrogue Egg"><div class="cramomatic-desc"><b>Tyrogue</b> hatched from the egg!</div>`;
} else if (finalRoll <= 32) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/238.png" title="Smoochum Egg"><div class="cramomatic-desc"><b>Smoochum</b> hatched from the egg!</div>`;
} else if (finalRoll <= 36) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/239.png" title="Elekid Egg"><div class="cramomatic-desc"><b>Elekid</b> hatched from the egg!</div>`;
} else if (finalRoll <= 40) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/240.png" title="Magby Egg"><div class="cramomatic-desc"><b>Magby</b> hatched from the egg!</div>`;
} else if (finalRoll <= 44) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/173.png" title="Cleffa Egg"><div class="cramomatic-desc"><b>Cleffa</b> hatched from the egg!</div>`;
} else if (finalRoll <= 48) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/174.png" title="Igglybuff Egg"><div class="cramomatic-desc"><b>Igglybuff</b> hatched from the egg!</div>`;
} else if (finalRoll <= 52) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/298.png" title="Azurill Egg"><div class="cramomatic-desc"><b>Azurill</b> hatched from the egg!</div>`;
} else if (finalRoll <= 56) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/360.png" title="Wynaut Egg"><div class="cramomatic-desc"><b>Wynaut</b> hatched from the egg!</div>`;
} else if (finalRoll <= 60) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/406.png" title="Budew Egg"><div class="cramomatic-desc"><b>Budew</b> hatched from the egg!</div>`;
} else if (finalRoll <= 64) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/433.png" title="Chingling Egg"><div class="cramomatic-desc"><b>Chingling</b> hatched from the egg!</div>`;
} else if (finalRoll <= 68) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/438.png" title="Bonsly Egg"><div class="cramomatic-desc"><b>Bonsly</b> hatched from the egg!</div>`;
} else if (finalRoll <= 72) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/439.png" title="Mime Jr. Egg"><div class="cramomatic-desc"><b>Mime Jr.</b> hatched from the egg!</div>`;
} else if (finalRoll <= 76) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/440.png" title="Happiny Egg"><div class="cramomatic-desc"><b>Happiny</b> hatched from the egg!</div>`;
} else if (finalRoll <= 80) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/446.png" title="Munchlax Egg"><div class="cramomatic-desc"><b>Munchlax</b> hatched from the egg!</div>`;
} else if (finalRoll <= 84) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/458.png" title="Mantyke Egg"><div class="cramomatic-desc"><b>Mantyke</b> hatched from the egg!</div>`;
} else if (finalRoll <= 88) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/848.png" title="Toxel Egg"><div class="cramomatic-desc"><b>Toxel</b> hatched from the egg!</div>`;
} else if (finalRoll <= 92) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/300.png" title="Skitty Egg"><div class="cramomatic-desc"><b>Skitty</b> hatched from the egg!</div>`;
} else if (finalRoll <= 96) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/427.png" title="Buneary Egg"><div class="cramomatic-desc"><b>Buneary</b> hatched from the egg!</div>`;
} else if (finalRoll <= 100) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/425.png" title="Drifloon Egg"><div class="cramomatic-desc"><b>Drifloon</b> hatched from the egg!</div>`;
} else if (finalRoll <= 104) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/216.png" title="Teddiursa Egg"><div class="cramomatic-desc"><b>Teddiursa</b> hatched from the egg!</div>`;
} else if (finalRoll <= 108) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png" title="Torchic Egg"><div class="cramomatic-desc"><b>Torchic</b> hatched from the egg!</div>`;
} else if (finalRoll <= 112) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/447.png" title="Riolu Egg"><div class="cramomatic-desc"><b>Riolu</b> hatched from the egg!</div>`;
} else if (finalRoll <= 116) {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png" title="Pichu Egg"><div class="cramomatic-desc"><b>Pichu</b> hatched from the egg!</div>`;
} else {
    resultText = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" title="Eevee Egg"><div class="cramomatic-desc"><b>Eevee</b> hatched from the egg!</div>`;
}

        $(this).html(resultText);
        $(this).data('processed', true);
        $(this).closest('.eggroll-3').contents().filter(function() {
            return this.nodeType === 3;
        }).remove();
    });
}

$(document).ready(function () {
    EggrollDice();

    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            EggrollDice();
        });
        observer.observe(target, { childList: true, subtree: true });
    }
});
