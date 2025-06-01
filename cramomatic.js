function CramomaticDice() {
  $(document).ready(function () {
    $('.cramomatic-01 .vdice-value').each(function () {
      const rollText = $(this).text().trim();
      const roll = parseInt(rollText, 10);

      if (isNaN(roll)) return;

      let resultText = '';

      if (roll >= 1 && roll <= 10) {
        resultText = `
        <img src="https://i.imgur.com/bwjRsaA.png" title="shiny swap">
        <div class="cramomatic-desc">The Cram-o-matic coughed up a Shiny Swap!</div>`;
      } else if (roll >= 11 && roll <= 20) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/incense/full.png" title="shiny incense - use at the start of a wild thread to make the last encountered pokemon shiny">
        <div class="cramomatic-desc">The Cram-o-matic billowed out a Shiny Incense!</div>`;
      } else if (roll >= 21 && roll <= 30) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/heavy.png" title="strange mineral - select an unevolved pokemon from the mineral egg group as a gacha pokemon ( claim in shop )">
        <div class="cramomatic-desc">The Cram-o-matic hacked up a Strange Mineral!</div>`;
      } else if (roll >= 31 && roll <= 40) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/evo-item/up-grade.png" title="disc of reuse - teaches a pokemon Recycle, even if it can't normally learn it">
        <div class="cramomatic-desc">The Cram-o-matic ejected a Disc of Reuse!</div>`;
      } else if (roll >= 41 && roll <= 45) {
        resultText = `
        <img src="https://file.garden/ZXZrnWMYuz15frfJ/SPRITES/safari%20ticket.png" title="safari ticket">
        <div class="cramomatic-desc">The Cram-o-matic dispensed a Safari Ticket!</div>`;
      } else if (roll >= 46 && roll <= 50) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/mega-stone/abomasite.png" title="mega stone">
        <div class="cramomatic-desc">The Cram-o-matic barfed up a Mega Stone!</div>`;
      } else if (roll >= 51 && roll <= 55) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/z-crystals/waterium-z--held.png" title="z-crystal">
        <div class="cramomatic-desc">The Cram-o-matic expelled a Z-Crystal!</div>`;
      } else if (roll >= 56 && roll <= 60) {
        resultText = `
        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Hoenn/Item%20Sprites/stellar%20tera%20shard%20sprite%20hoenn.png" title="tera shard of your choice">
        <div class="cramomatic-desc">The Cram-o-matic heaved out a Tera Crystal!</div>`;
      } else if (roll >= 61 && roll <= 65) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/fossil/helix.png" title="fossil - select an unevolved fossil pokemon as a gacha pokemon ( claim in shop )">
        <div class="cramomatic-desc">The Cram-o-matic dropped a Fossil!</div>`;
      } else if (roll >= 66 && roll <= 70) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/exp-candy/xl.png" title="legendary candy">
        <div class="cramomatic-desc">The Cram-o-matic spit out a Legendary Candy!</div>`;
      } else if (roll >= 71 && roll <= 75) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/plate/iron.png" title="plate of your choice">
        <div class="cramomatic-desc">The Cram-o-matic released a strange Plate!</div>`;
      } else if (roll >= 76 && roll <= 80) {
        resultText = `
        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Hoenn/Item%20Sprites/mythical%20pecha%20berry.png" title="mythical pecha berry">
        <div class="cramomatic-desc">The Cram-o-matic burped out a Mythical Pecha Berry!</div>`;
      } else if (roll >= 81 && roll <= 85) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/hold-item/black-sludge.png" title="shadow sludge">
        <div class="cramomatic-desc">The Cram-o-matic barfed up Shadow Sludge!</div>`;
      } else if (roll >= 86 && roll <= 90) {
        resultText = `
        <img src="https://file.garden/ZXZrnWMYuz15frfJ/SPRITES/crystabloomitemsprite%20by%20king.png" title="crystalbloom">
        <div class="cramomatic-desc">The Cram-o-matic hacked up a Crystalbloom!</div>`;
      } else if (roll >= 91 && roll <= 92) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/occa.png" title="occa berry">
        <div class="cramomatic-desc">The Cram-o-matic chucked out an Occa Berry!</div>`;
      } else if (roll >= 93 && roll <= 94) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/mysticticket.png" title="warden's ticket">
        <div class="cramomatic-desc">The Cram-o-matic produced a Warden's Ticket!</div>`;
      } else if (roll >= 95 && roll <= 96) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/valuable-item/comet-shard.png" title="three gachapon tickets">
        <div class="cramomatic-desc">The Cram-o-matic dropped three gachapon tickets!</div>`;
      } else if (roll === 97) {
        resultText = `
        <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/rule-book.png" title="extra move slot">
        <div class="cramomatic-desc">The Cram-o-matic provided an Extra Move Slot!</div>`;
      } else if (roll === 98) {
        resultText = `
        <img src="https://i.imgur.com/oNiM0nd.png" title="three premium gachapon tickets">
        <div class="cramomatic-desc">The Cram-o-matic distributed three premium gachapon tickets!</div>`;
      } else if (roll === 99) {
        resultText = `
        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Hoenn/Item%20Sprites/custompokemonticket.png" title="custom pokemon ticket">
        <div class="cramomatic-desc">The Cram-o-matic delivered a Custom Pokemon Ticket!</div>`;
      } else if (roll === 100) {
        resultText = `
        <img src="https://file.garden/Zz6LAVCcyQejC5CU/Hoenn/Item%20Sprites/cramorant.png" title="AWARD UNLOCKED OR 250 PD CLAIMABLE IN SHOP IF ALREADY OWNED ">
        <div class="cramomatic-desc">The Cram-o-matic released treasure from its beak!</div>`;
      } else {
        resultText = `<img src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/poke.png" title="what went wrong?">
        <div class="cramomatic-desc">Something went wrong with the roll...</div>`;
      }

      $(this).html(resultText);
    });
  });
}

$(document).ready(function () {
  CramomaticDice();

  const target = document.querySelector('.content');
  if (target) {
    const observer = new MutationObserver(() => {
      CramomaticDice();
    });

    observer.observe(target, { childList: true, subtree: true });
  }
});
