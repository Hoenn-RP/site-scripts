function InSitu1() {
  $(document).ready(function () {
    $('.insitu-01 .vdice-value').each(function () {
      const rollText = $(this).text().trim();
      const roll = parseInt(rollText, 10);

      if (isNaN(roll)) return;

      let resultText = '';

      if (roll >= 1 && roll <= 2) {
        resultText = `<blockquote>
    <h1>RKS SIMULATION: SUPER LUCK</h1>
    <h2>STAT CHECK STAGE</h2>
    Before you and your Pokemon, a Togepi chirps. It is happy to see you. With a waving finger of Metronome, a shower of
    digital currency clatters onto you and the ground before dissipating into pixelated confetti.

    Great joy fills your spirits as the simulation moves you to the next stage.

    <b>CONGRATULATIONS ON YOUR LUCK!</b>
    You earn <b>100 RKS POINTS</b> or a <b>CURIO</b>.
    <quote>You automatically pass this stat check.</quote>
    <div align="center"><img
            src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/togepi.png"
            style="margin-top:25px;float:none;border:none;box-shadow:none;"></div>
    </blockquote>
    `;
      } else if (roll >= 9 && roll <= 14) {
        resultText = `<blockquote>
        <h1>RKS SIMULATION: CLUB OLYMPUS</h1>
        <h2>STAT CHECK STAGE</h2>
        You find yourself attempting to enter Club Olympus, a lavish hostess club in Mauville City. However, you
        misplaced your ticket somewhere on the way here.

        The bouncer has rebuked you several times so far. Your chances of entering this fancy establishment filled with
        fine drink and even finer people seems to be slipping through your fingers...

        <b>WHAT WILL YOU DO?</b>
        Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
        <quote><b>↳ MIND</b> - Charm or seduce them.
            40 or higher.</quote>
        <quote><b>↳ SKILL</b> - Persuade or deceive them.
            60 or higher.</quote>
        <quote><b>↳ BODY</b> - Attack them.
            80 or higher.</quote>
        <div align="center"><img style="box-shadow:none;border:none;float:none;"
                src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/love.png"></div>
        </blockquote>
        `;
      } else if (roll >= 15 && roll <= 20) {
        resultText = `<blockquote>
            <h1>RKS SIMULATION: ROGUE MEGAS</h1>
            <h2>STAT CHECK STAGE</h2>
            An unseen source or energy is forcing Pokemon to mega evolve all around you. Curiously, this energy is now
            being focused on <i>you</i>. You feel your organs and bones crushing together or bending against your will;
            the pain isoverwhelming. As your Pokemon attempt to protect you, attempt to survive the influence.

            <b>WHAT WILL YOU DO?</b>
            Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
            <quote><b>↳ MIND</b> - Using your knowledge of mega evolution, find a way to resist.<break>
                    60 or higher.</quote>
            <quote><b>↳ BODY</b> - Endure the effects physically.<break>
                    45 or higher.</quote>
            <div align="center"><img
                    src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/mega-stone/absolite.png"
                    style="float:none;box-shadow:none;border:none;"></div>
            </blockquote>`;
      } else if (roll >= 3 && roll <= 8) {
        resultText = `<blockquote>
                <h1>RKS SIMULATION: SPEAR PILLAR</h1>
                <h2>STAT CHECK STAGE</h2>
                You find yourself in the middle of a grand temple. Those familiar with Sinnoh would realize that this is
                the peak of Mount Coronet. However, curiously, this temple is not in ruin. Rather, it is pristine and
                intact. Nearby, Magnezone and Nosepass wander about, attracted by the special magnetic field found here.

                Before you, a Dialga can be seen in the middle of this grand sanctuary and in chains. Red chains float
                about its dark blue body, though the simulation occasionally glitches to change these chains into
                parades of Unown.

                The Deity of Time screeches as it transforms in retaliation. Around you, the pillars collapse as Dialga
                assumes its Origin Forme before attacking.

                <b>WHAT WILL YOU DO?</b>
                Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                <quote><b>↳ SKILL</b> - Battle Dialga.
                    75 or higher.</quote>
                <quote><b>↳ BODY</b> - Dodge, Duck, Dip, Dive.
                    60 or higher.</quote>
                <div align="center"><img
                        src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/dialga-origin.png"
                        style="box-shadow:none;border:none;float:none;"></div>
                </blockquote>`;
      } else if (roll >= 21 && roll <= 26) {
        resultText = `<blockquote>
                    <h1>RKS SIMULATION: EMERGENCY CARE</h1>
                    <h2>STAT CHECK STAGE</h2>
                    You're in the middle of rushing a Pokemon to emergency care whether it is in a hospital or the
                    battlefield. Gasping and in pain, the poor creature has been injured in battle and requires
                    lifesaving attention.

                    <b>WHAT WILL YOU DO?</b>
                    Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                    <quote><b>↳ MIND</b> - You can identify the problem and proper procedure needed.
                        65 or higher.</quote>
                    <quote><b>↳ SKILL</b> - You have the medical experience to save it.
                        45 or higher.</quote>
                    <quote><b>↳ BODY</b> - Nothing a little elbow grease can't fix.
                        75 or higher.</quote>
                    <div align="center"><img style="margin-top:25px;float:none;border:none;box-shadow:none;"
                            src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/chansey.png">
                    </div>
                    </blockquote>`;
      } else if (roll >= 27 && roll <= 33) {
        resultText = `<blockquote>
                        <h1>RKS SIMULATION: THE TRUTH</h1>
                        <h2>STAT CHECK STAGE</h2>
                        You dip beneath the bright yellow of crime scene tape. You've been called here to investigate a
                        death. Curiously, there is no body. However, there is an outline of a body on the ground... one
                        not drawn by chalk. Instead, the outline is of ash and charcoal, as if the corpse had been
                        burned to a crisp.

                        Nearby, there are the tatters of a Ranger's armband, several large white feathers, and a shaken
                        witness. There are no body parts to be found, no hair strand or nail. The Chief Investigator
                        asks you for your evidence.


                        <b>WHAT WILL YOU DO?</b>
                        Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                        <quote><b>↳ MIND</b> - Question the witness.
                            75 or higher.</quote>
                        <quote><b>↳ SKILL</b> - Analyze the evidence.
                            60 or higher.</quote>
                        <div align="center"><img style="margin-top:25px;"
                                src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/reshiram.png"
                                style="box-shadow:none;border:none;float:none;"></div>
                        </blockquote>`;
      } else if (roll >= 34 && roll <= 39) {
        resultText = `<blockquote>
                            <h1>RKS SIMULATION: SEALING SHRINE</h1>
                            <h2>STAT CHECK STAGE</h2>
                            A foul beast must be sealed in the special shrine. It hisses at you; though it is a vague,
                            indiscernible shape within the darkness of the burrow. Something crunches beneath your feet.
                            You can not tell if you have stepped on ice, leaves, charred stone or earthen crumb.

                            Several stakes and a circular seal must be used to conceal this destructive Pokemon before
                            it is too late.

                            <b>WHAT WILL YOU DO?</b>
                            Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                            <quote><b>↳ MIND</b> - Resist the ruinous feelings.
                                60 or higher.</quote>
                            <quote><b>↳ SKILL</b> - Use your Pokemon/knowledge of the Ruinous Quartet.
                                60 or higher.</quote>
                            <quote><b>↳ BODY</b> - Use your strength to seal it.
                                60 or higher.</quote>
                            <div align="center"><img style="margin-top:25px;"
                                    src="https://file.garden/ZWyHNtDjIhZcqtBS/PKMN-Gen9-Normal/Wo-Chien.png"
                                    style="float:none;border:none;box-shadow:none;"></div>
                            </blockquote>
                            `;
      } else if (roll >= 40 && roll <= 45) {
        resultText = `<blockquote>
                                <h1>RKS SIMULATION: EATING CONTEST</h1>
                                <h2>STAT CHECK STAGE</h2>
                                You've been invited to an eating contest. The stakes of this contest can range from high
                                (death) to low (it's a free meal, I guess). Regardless, you're here now with your
                                partner and your Pokemon. You must find a way to reach the bottom of your plate of food
                                with the swiftness.

                                Just hope that the food isn't in the shape of your favorite Pokemon...

                                <b>WHAT WILL YOU DO?</b>
                                Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                <quote><b>↳ SKILL</b> - You're a pro gobbler.<break>
                                        75 or higher.</quote>
                                <quote><b>↳ BODY</b> - Your body is ready.<break>
                                        40 or higher.</quote>
                                <div align="center"><img
                                        src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/curry-ingredient/large-leek.png"
                                        style="float:none;box-shadow:none;border:none;"></div>
                                </blockquote>`;
      } else if (roll >= 46 && roll <= 51) {
        resultText = `<blockquote>
                                    <h1>RKS SIMULATION: INFILTRATE ROCKET</h1>
                                    <h2>STAT CHECK STAGE</h2>
                                    You are attempting to infiltrate Rocket Headquarters: a vast submarine that sails
                                    from undocumented port to undocumented port. Sootopolis City was once its main site
                                    of mooring, but ever since the League made a deal with the Rocket Boss to neutrally
                                    occupy the place, it seldom comes.

                                    Infiltrating the submarine can be done via sea or when it is docked. How will you
                                    attempt this?

                                    <b>WHAT WILL YOU DO?</b>
                                    Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                    <quote><b>↳ MIND</b> - Infiltrate via faked identity.<break>
                                            75 or higher.</quote>
                                    <quote><b>↳ SKILL</b> - Infiltrate via stealth.<break>
                                            75 or higher.</quote>
                                    <quote><b>↳ BODY</b> - Brute force.<break>
                                            75 or higher.</quote>
                                    <div align="center"><img style="float:none;box-shadow:none;border:none;"
                                            src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/key-item/card-key.png">
                                    </div>
                                    </blockquote>`;
      } else if (roll >= 52 && roll <= 57) {
        resultText = `<blockquote>
                                        <h1>RKS SIMULATION: ERUPTION</h1>
                                        <h2>STAT CHECK STAGE</h2>
                                        Mt. Chimney is erupting and you are caught within the blast radius. Around you,
                                        the Kindlers, a group of fire-type specialists dedicated to upholding the
                                        time-honored traditions of this mountain, are quick to act. They attempt to save
                                        both human and Pokemon from the debris and scalding smoke.

                                        How do you survive this catastrophe?

                                        <b>WHAT WILL YOU DO?</b>
                                        Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                        <quote><b>↳ MIND</b> - Compose yourself for a Kindler to rescue you.
                                            75 or higher.</quote>
                                        <quote><b>↳ SKILL</b> - Use your knowledge of Pokemon and/or the environment to
                                            survive.
                                            50 or higher.</quote>
                                        <quote><b>↳ BODY</b> - Run.
                                            40 or higher.</quote>
                                        <div align="center"><img
                                                style="margin-top:25px;float:none;border:none;box-shadow:none;"
                                                src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/torkoal.png">
                                        </div>
                                        </blockquote>`;
      } else if (roll >= 58 && roll <= 64) {
        resultText = `<blockquote>
                                            <h1>RKS SIMULATION: DISTORTION WORLD</h1>
                                            <h2>STAT CHECK STAGE</h2>
                                            You are lost in the Distortion World. It is said that time does not flow
                                            here, but you can not help but question how long the vague shadowy mound
                                            beside (it most likely a corpse, you believe) has been here.

                                            Other Pokemon have never lived here—until recently. Whether Giratina views
                                            them as pests or intruders is unknown. However, the ghost-type Pokemon that
                                            linger in this reversed realm wander as lost souls.

                                            However, the Giratina in its Origin Forme finally finds you. Shrieking, it
                                            attempts to excise you from its world. Rifts emerge haphazardly around
                                            you—but the Giratina does not shift into shadow near these rifts, lest it
                                            accidentally merge the Distortion World with the real world with destructive
                                            consequence.

                                            <b>WHAT WILL YOU DO?</b>
                                            Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                            <quote><b>↳ MIND</b> - Offer yourself as Giratina's worthy vessel.
                                                60 or higher.</quote>
                                            <quote><b>↳ SKILL</b> - Battle with your Pokemon.
                                                80 or higher.</quote>
                                            <quote><b>↳ BODY</b> - Use your athleticism to leap through a rift.
                                                50 or higher.</quote>
                                            <div align="center"><img
                                                    src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/giratina-origin.png"
                                                    style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                            </div>
                                            </blockquote>
                                            `;
      } else if (roll >= 65 && roll <= 70) {
        resultText = `<blockquote>
                                                <h1>RKS SIMULATION: TEACUPS</h1>
                                                <h2>STAT CHECK STAGE</h2>
                                                You have been tasked by a museum curator or tea master to discern
                                                Masterpiece Teacups from Unremarkable Teacups. The rarer iterations
                                                feature a stamp of authenticity. Poltchageist and Sinistcha who inhabit
                                                these works of art are known as Artisan or Masterpiece Forms
                                                respectively. Socialites and particularly picky trainers often desire
                                                Poltchageist and Sinistcha in these cups, rendering them remarkably
                                                valuable.

                                                However, you must be careful. Apart from accidentally damaging the cups,
                                                a hiding Poltchageist may scatter its life-draining matcha powder on
                                                you.

                                                <b>WHAT WILL YOU DO?</b>
                                                Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                                <quote><b>↳ SKILL</b> - Use your knowledge and keen eye.
                                                    40 or higher.</quote>
                                                <quote><b>↳ BODY</b> - Gentle hands.
                                                    60 or higher.</quote>
                                                <div align="center"><img
                                                        src="https://file.garden/ZWyHNtDjIhZcqtBS/PKMN-Gen9-Normal/Poltchageist.png"
                                                        style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                                </div>
                                                </blockquote>
                                                `;
      } else if (roll >= 71 && roll <= 76) {
        resultText = `<blockquote>
                                                    <h1>RKS SIMULATION: POP QUIZ</h1>
                                                    <h2>STAT CHECK STAGE</h2>
                                                    You are a student in Hoenn's prestigious Pokemon Trainer's School or
                                                    Unova's innovative Blueberry Academy. In class, you are suddenly
                                                    bestowed a pop quiz by your teacher. The subject can be decided by
                                                    you, for there are multiple quizzes available to choose from.

                                                    How will you past this course?

                                                    <b>WHAT WILL YOU DO?</b>
                                                    Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                                    <quote><b>↳ MIND</b> - You've already studied/know this subject
                                                        well.
                                                        40 or higher.</quote>
                                                    <quote><b>↳ SKILL</b> - Cheat.
                                                        60 or higher.</quote>
                                                    <quote><b>↳ BODY</b> - Cause a large enough ruckus to avoid the
                                                        quiz.
                                                        75 or higher.</quote>
                                                    <div align="center"><img
                                                            style="margin-top:25px;float:none;border:none;box-shadow:none;"
                                                            src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/clefairy.png">
                                                    </div>
                                                    </blockquote>
                                                    `;
      } else if (roll >= 77 && roll <= 82) {
        resultText = `<blockquote>
                                                        <h1>RKS SIMULATION: STORM THE LEAGUE</h1>
                                                        <h2>STAT CHECK STAGE</h2>
                                                        You are storming the Pokemon League as a member of Team Rocket.
                                                        Around you, trainers and Pokemon are slain in midst flame and
                                                        rubble. However, the League continues to call upon their
                                                        reinforcements. Their rejuvenated numbers are not the only issue
                                                        facing your syndicate. Some of their reserves are trainers who
                                                        bear immense expertise and/or power.

                                                        It is not guaranteed that the League will fall today, but you
                                                        may be the key to Team Rocket's success...

                                                        <b>WHAT WILL YOU DO?</b>
                                                        Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                                        <quote><b>↳ MIND</b> - You were a plant.
                                                            75 or higher.</quote>
                                                        <quote><b>↳ SKILL</b> - Battle/fight.
                                                            40 or higher.</quote>
                                                        <quote><b>↳ BODY</b> - Outlast your opponents.
                                                            60 or higher.</quote>
                                                        <div align="center"><img
                                                                src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/ultra.png"
                                                                style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                                        </div>
                                                        </blockquote>
                                                        `;
      } else if (roll >= 83 && roll <= 89) {
        resultText = `<blockquote>
                                                            <h1>RKS SIMULATION: PERFORMANCE</h1>
                                                            <h2>STAT CHECK STAGE</h2>
                                                            For whatever reason, you must perform. It may be to distract
                                                            the enemy, to spread propaganda, or perhaps you are in
                                                            performance-duel for your life. Regardless, the crowd is
                                                            tough one... and they are as stone-faced as any Geodude. The
                                                            stage lights swing toward you. They're so hot they sear like
                                                            a Groudon's Drought.

                                                            Whether you are singing, dancing, executing Pokemon Contest
                                                            choreography, or charming the crowd in some other fashion,
                                                            do your best.

                                                            <b>WHAT WILL YOU DO?</b>
                                                            Success will grant <b>100 RKS POINTS</b> or a <b>CURIO</b>.
                                                            <quote><b>↳ MIND</b> - Your people skills help you connect
                                                                with the audience.
                                                                40 or higher.</quote>
                                                            <quote><b>↳ SKILL</b> - You've trained for this your whole
                                                                life.
                                                                50 or higher.</quote>
                                                            <quote><b>↳ BODY</b> - Perform a great bodily feat.
                                                                60 or higher.</quote>
                                                            <div align="center"><img
                                                                    src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/meloetta.png"
                                                                    style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                                            </div>
                                                            </blockquote>
                                                            `;
      } else if (roll >= 90 && roll <= 95) {
        resultText = `<blockquote>
                                                                <h1>RKS SIMULATION: PSYCHIC TORTURE</h1>
                                                                <h2>STAT CHECK STAGE</h2>
                                                                Around you, swarms of Unown cycle around you and your
                                                                Pokemon. They prevent you from moving—even teleporting
                                                                if you have the means to. A muffled voice commands them,
                                                                out of your vision, past the sea of black and white
                                                                cyclopes.

                                                                Suddenly, these psychic-type Pokemon begin to exert
                                                                their powers against you. They begin to distort your
                                                                reality, twisting your dreams and desires, forcing
                                                                hallucinations and horrid memories into your mind...

                                                                <b>WHAT WILL YOU DO?</b>
                                                                Success will grant <b>100 RKS POINTS</b> or a
                                                                <b>CURIO</b>.
                                                                <quote><b>↳ MIND</b> - Steel your mind.
                                                                    50 or higher.</quote>
                                                                <quote><b>↳ SKILL</b> - Use your skillset to fight
                                                                    through the swarm.
                                                                    75 or higher.</quote>
                                                                <quote><b>↳ BODY</b> - Count on your endurance.
                                                                    75 or higher.</quote>
                                                                <div align="center"><img
                                                                        src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/unown.png"
                                                                        style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                                                </div>
                                                                </blockquote>
                                                                `;
      } else if (roll >= 96 && roll <= 100) {
        resultText = `<blockquote>
                                                                    <h1>RKS SIMULATION: ARCHERY</h1>
                                                                    <h2>STAT CHECK STAGE</h2>
                                                                    You find yourself alongside the ranks of Decidueye.
                                                                    Whether this is a practice range or in the middle of
                                                                    battle, you must steady your breath for urgent
                                                                    accuracy. Your Pokemon may help you—but in the end,
                                                                    you are the one wielding the bow and arrow.

                                                                    Will you hit a bullseye—or will your shot miss its
                                                                    mark?

                                                                    <b>WHAT WILL YOU DO?</b>
                                                                    Success will grant <b>100 RKS POINTS</b> or a
                                                                    <b>CURIO</b>.
                                                                    <quote><b>↳ MIND</b> - Calculate the physics.
                                                                        60 or higher.</quote>
                                                                    <quote><b>↳ SKILL</b> - You're a natural born
                                                                        toxophilite.
                                                                        50 or higher.</quote>
                                                                    <quote><b>↳ BODY</b> - Aim doesn't matter. Whatever
                                                                        you hit will be destroyed.
                                                                        75 or higher.</quote>
                                                                    <div align="center"><img
                                                                            src="https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/regular/decidueye.png"
                                                                            style="margin-top:25px;float:none;border:none;box-shadow:none;">
                                                                    </div>
                                                                    </blockquote>
                                                                    `;
      } else {
        resultText = `<img
                                                                        src="https://raw.githubusercontent.com/msikma/pokesprite/master/items/ball/poke.png"
                                                                        title="what went wrong?">
                                                                    <div class="insitu-desc">Something went wrong with
                                                                        the roll...</div>`;
      }

      $(this).html(resultText);
    });
  });
}

$(document).ready(function () {
  InSitu1();

  const target = document.querySelector('.content');
  if (target) {
    const observer = new MutationObserver(() => {
      InSitu1();
    });

    observer.observe(target, {
      childList: true, subtree:
        true
    });
  }
});