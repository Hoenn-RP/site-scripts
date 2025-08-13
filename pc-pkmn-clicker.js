document.addEventListener("click", function(e) {
    const img = e.target.closest(".pc-pkmn");
    if (!img) return;

    const src = img.getAttribute("src") || "";
    const title = img.getAttribute("title") || "";
    const alt = img.getAttribute("alt") || "";

    let bbcode = `[img src="${src}"`;
    if (title) bbcode += ` title="${title}"`;
    if (alt) bbcode += ` alt="${alt}"`;
    bbcode += `]`;

    navigator.clipboard.writeText(bbcode).catch(() => {});
});
