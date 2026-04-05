function EggrollDice() {
    $('.eggroll .vdice-value').each(function () {

        // Prevent re-processing the same element
        if ($(this).data('processed')) return;

        // Get base roll value
        const baseText = $(this).text().trim();
        const baseRoll = parseInt(baseText, 10);
        if (isNaN(baseRoll)) return;

        // Get modifier (e.g. +10 or -5) from the parent .eggroll
        const eggrollText = $(this).closest('.eggroll').text();
        const modMatch = eggrollText.match(/([+-]\d+)/);
        const modifier = modMatch ? parseInt(modMatch[1], 10) : 0;

        // Final calculated roll
        const finalRoll = baseRoll + modifier;

        let resultText = '';

        // Tier 1: 1–25
        if (finalRoll >= 1 && finalRoll <= 25) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        <b>(${finalRoll})</b> Tier 1 Result<br>
                        Placeholder effect for rolls 1–25.
                    </div>
                </div>`;
        }

        // Tier 2: 26–50
        else if (finalRoll <= 50) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        <b>(${finalRoll})</b> Tier 2 Result<br>
                        Placeholder effect for rolls 26–50.
                    </div>
                </div>`;
        }

        // Tier 3: 51–75
        else if (finalRoll <= 75) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        <b>(${finalRoll})</b> Tier 3 Result<br>
                        Placeholder effect for rolls 51–75.
                    </div>
                </div>`;
        }

        // Tier 4: 76–100
        else if (finalRoll <= 100) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        <b>(${finalRoll})</b> Tier 4 Result<br>
                        Placeholder effect for rolls 76–100.
                    </div>
                </div>`;
        }

        // Tier 5: 101–110
        else if (finalRoll <= 110) {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        <b>(${finalRoll})</b> Tier 5 Result ⭐<br>
                        High-tier result for rolls 101–110.
                    </div>
                </div>`;
        }

        // Fallback if something goes wrong
        else {
            resultText = `
                <div class="mkj-wrapper">
                    <div class="mkj-textbox">
                        (${finalRoll}) Something went wrong...
                    </div>
                </div>`;
        }

        // Replace the original roll with the result HTML
        $(this).html(resultText);

        // Mark as processed so it does not run again
        $(this).data('processed', true);
    });
}

$(document).ready(function () {
    EggrollDice();

    // Observe content changes (for ProBoards dynamic page updates)
    const target = document.querySelector('.content');
    if (target) {
        const observer = new MutationObserver(() => {
            EggrollDice();
        });

        observer.observe(target, { childList: true, subtree: true });
    }
});