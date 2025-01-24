    // Apply colors immediately to avoid flickering
    (function applyColorsImmediately() {
        const accentColor = localStorage.getItem('accent_color');
        const accentColor2 = localStorage.getItem('accent_color_2');
        const accentGradient = localStorage.getItem('accent_gradient');

        const defaultColors = `
            :root {
                --accent_color: #7dabe3;
                --accent_color_2: #85ccca;
                --accent_gradient: linear-gradient(to bottom right, #7dabe3, #85ccca);
            }
        `;

        // Generate the dynamic styles for saved colors or fall back to defaults
        const dynamicColors = accentColor && accentColor2 && accentGradient
            ? `
                :root {
                    --accent_color: ${accentColor};
                    --accent_color_2: ${accentColor2};
                    --accent_gradient: ${accentGradient};
                }
            `
            : defaultColors;

        // Insert the styles into the head synchronously
        const style = document.createElement('style');
        style.textContent = dynamicColors;
        document.head.appendChild(style);
    })();

    // Main script
    document.addEventListener('DOMContentLoaded', () => {

        const boxes = document.querySelectorAll('.palise-side-color-box');

        function setColors(accentColor, accentColor2, accentGradient) {
            document.documentElement.style.setProperty('--accent_color', accentColor);
            document.documentElement.style.setProperty('--accent_color_2', accentColor2);
            document.documentElement.style.setProperty('--accent_gradient', accentGradient);

            localStorage.setItem('accent_color', accentColor);
            localStorage.setItem('accent_color_2', accentColor2);
            localStorage.setItem('accent_gradient', accentGradient);
        }

        boxes.forEach((box, index) => {
            box.addEventListener('click', () => {

                const accentColor = box.getAttribute('data-accent-color');
                const accentColor2 = box.getAttribute('data-accent-color-2');
                const accentGradient = box.getAttribute('data-accent-gradient');

                if (accentColor && accentColor2 && accentGradient) {
                    setColors(accentColor, accentColor2, accentGradient);
                } else {
                    console.error('Box is missing data attributes:', box);
                }
            });
        });
    });