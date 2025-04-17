$(document).ready(function () {
    console.log('Dungeon script loaded!');
    $('.dungeon-roll .vdice-value').each(function () {
        const roll = parseInt($(this).text().trim(), 10);
        if (isNaN(roll)) return;
        let resultHtml = '';
        if (roll >= 1 && roll <= 10) {
            resultHtml = 'A wild Pokemon has appeared! Battle it.';
        } else if (roll >= 11 && roll <= 20) {
            resultHtml = 'The cavern starts to shake.';
        } else if (roll >= 21 && roll <= 30) {
            resultHtml = 'A Pokemon ambush! Prepare to fight. <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/venusaur.png" alt="Venusaur">';
        } else if (roll >= 31 && roll <= 40) {
            resultHtml = 'You hear a loud roar.';
        } else if (roll >= 41 && roll <= 50) {
            resultHtml = 'A special Pokeball rests before you.';
        } else if (roll >= 51 && roll <= 60) {
            resultHtml = 'You are given a complex riddle to solve.';
        } else if (roll >= 61 && roll <= 70) {
            resultHtml = 'You encounter a friendly NPC who offers guidance.';
        } else if (roll >= 71 && roll <= 80) {
            resultHtml = 'A magical rune pulses with ancient energy.';
        } else if (roll >= 81 && roll <= 90) {
            resultHtml = 'You hear whispers in the shadows.';
        } else if (roll >= 91 && roll <= 100) {
            resultHtml = 'You discover a secret passage leading deeper underground.';
        } else {
            resultHtml = 'Something went wrong with the roll...';
        }
        $(this).html(resultHtml);
    });
});
