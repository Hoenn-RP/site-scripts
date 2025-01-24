    const icons = new Set();
    document.querySelectorAll(".lock_icon .fa.fa-lock").forEach(icon => {
        if (icons.has(icon.className)) {
            icon.remove();
        } else {
            icons.add(icon.className);
        }
    });