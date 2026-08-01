// Loreq's Imgur Fix - 7/30/2026
(() => {
  const P = "https://external-content.duckduckgo.com/iu/?u=";
  const R = /(?:https?:)?\/\/(?:i\.)?imgur\.com\/([\w]+)(\.\w+)?/gi;
  const q = new Set();
  let scheduled = false, mute = false;

  const yield_ = () =>
    new Promise(r =>
      (globalThis.scheduler?.yield?.() || Promise.resolve()).then(() =>
        requestAnimationFrame(r)
      )
    );

  const proxied = u => /duckduckgo\.com\/iu\//i.test(u);
  const hasImgur = u => /imgur\.com/i.test(u) && !proxied(u);

  const proxy = u => {
    if (!u || !hasImgur(u)) return u;
    return u.replace(R, (_, id, ext = "") =>
      P + encodeURIComponent(`https://i.imgur.com/${id}${ext}`)
    );
  };

  const css = t =>
    !t || !hasImgur(t)
      ? t
      : t.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (_, q, u) => {
          const n = proxy(u.trim());
          return `url(${q || '"'}${n}${q || '"'})`;
        });

  const set = (el, a, next) => {
    if (next != null && next !== el.getAttribute(a)) el.setAttribute(a, next);
  };

  const patch = el => {
    if (!el || el.nodeType !== 1) return;
    mute = true;
    try {
      if (el.matches?.("img,source")) {
        const src = el.getAttribute("src");
        if (src && hasImgur(src)) set(el, "src", proxy(src));

        const ss = el.getAttribute("srcset");
        if (ss && hasImgur(ss)) {
          set(
            el,
            "srcset",
            ss
              .split(",")
              .map(p => {
                const [u, ...r] = p.trim().split(/\s+/);
                return [proxy(u), ...r].join(" ");
              })
              .join(", ")
          );
        }
      }

      if (el.hasAttribute?.("style")) {
        const s = el.getAttribute("style"), n = css(s);
        if (n !== s) el.setAttribute("style", n);
      }

      if (el.matches?.("style")) {
        const n = css(el.textContent);
        if (n !== el.textContent) el.textContent = n;
      }
    } finally {
      mute = false;
    }
  };

  const flush = async () => {
    scheduled = false;
    const batch = [...q];
    q.clear();
    for (let i = 0; i < batch.length; i++) {
      if (batch[i].isConnected) patch(batch[i]);
      if ((i + 1) % 25 === 0) await yield_();
    }
  };

  const add = el => {
    if (mute || !el || el.nodeType !== 1) return;
    q.add(el);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  };

  const scan = async () => {
    document.querySelectorAll("img,source,[style*='imgur'],style").forEach(add);
    await flush();

    // Stylesheets: read-only check first; skip cross-origin; yield often
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      if (!rules) continue;

      for (let i = 0; i < rules.length; i++) {
        if (i && i % 40 === 0) await yield_();
        const rule = rules[i];
        const list = [rule];
        try {
          if (rule.cssRules) list.push(...Array.from(rule.cssRules));
        } catch {}

        for (const r of list) {
          if (!r.style) continue;
          for (const p of [
            "background", "background-image", "list-style-image",
            "border-image", "border-image-source", "mask-image",
            "content", "cursor",
          ]) {
            const v = r.style.getPropertyValue(p);
            if (!v || !hasImgur(v)) continue;
            const n = css(v);
            if (n !== v) r.style.setProperty(p, n, r.style.getPropertyPriority(p));
          }
        }
      }
      await yield_();
    }
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => queueMicrotask(scan), { once: true })
    : queueMicrotask(scan);

  new MutationObserver(ms => {
    if (mute) return;
    for (const m of ms) {
      if (m.type === "attributes") add(m.target);
      else {
        for (const n of m.addedNodes) {
          add(n);
          n.querySelectorAll?.("img,source,[style*='imgur'],style").forEach(add);
        }
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset", "style"],
  });
})();
