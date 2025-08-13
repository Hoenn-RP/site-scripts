document.addEventListener("click", function(e) {
    const img = e.target.closest(".pc-pkmn");
    if (!img) return;

    const src = img.getAttribute("src") || "";
    const title = img.getAttribute("title") || "";
    const alt = img.getAttribute("alt") || "";

    // Build BBCode (skip attributes if empty)
    let bbcode = `[img src="${src}"`;
    if (title) bbcode += ` title="${title}"`;
    if (alt) bbcode += ` alt="${alt}"`;
    bbcode += `]`;

    navigator.clipboard.writeText(bbcode).then(() => {
        console.log("Copied:", bbcode);
    }).catch(err => {
        console.error("Failed to copy:", err);
    });
});