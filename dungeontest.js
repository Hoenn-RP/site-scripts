$(document).ready(function () {
    console.log('Dungeon script loaded!');
    $('.dungeon-roll .vdice-value').each(function () {
        const roll = parseInt($(this).text().trim(), 10);
        if (isNaN(roll)) return;
        let resultText = '';
        if (roll >= 1 && roll <= 10) {
            resultText = 'A wild Pokémon has appeared! Battle it.';
        } else if (roll >= 11 && roll <= 20) {
            resultText = 'The cavern starts to shake.';
        } else if (roll >= 21 && roll <= 30) {
            resultText = 'A Pokémon ambush! Prepare to fight.';
        } else if (roll >= 31 && roll <= 40) {
            resultText = 'You hear a loud roar.';
        } else if (roll >= 41 && roll <= 50) {
            resultText = 'A special Pokéball rests before you.';
        } else if (roll >= 51 && roll <= 60) {
            resultText = 'You are given a complex riddle to solve.';
        } else if (roll >= 61 && roll <= 70) {
            resultText = 'You encounter a friendly NPC who offers guidance.';
        } else if (roll >= 71 && roll <= 80) {
            resultText = 'A magical rune pulses with ancient energy.';
        } else if (roll >= 81 && roll <= 90) {
            resultText = 'You hear whispers in the shadows.';
        } else if (roll >= 91 && roll <= 100) {
            resultText = 'You discover a secret passage leading deeper underground.';
        } else {
            resultText = 'Something went wrong with the roll...';
        }
        $(this).text(resultText);
    });
});
