// Loreq's Imgur Fix - 7/26/2026
(() => {
  const P = "https://external-content.duckduckgo.com/iu/?u=";
  const R = /(?:https?:)?\/\/(?:i\.)?imgur\.com\/([\w]+)(\.\w+)?/gi;
  const q = new Set();
  let busy = 0;

  const yield_ = () =>
    new Promise(r =>
      globalThis.scheduler?.yield?.().then(r) ||
      requestIdleCallback?.(r, { timeout: 50 }) ||
      requestAnimationFrame(r)
    );

  const proxy = u =>
    !u || !/imgur\.com/i.test(u) || u.includes("duckduckgo.com/iu/")
      ? u
      : u.replace(R, (_, id, ext = "") =>
          P + encodeURIComponent(`https://i.imgur.com/${id}${ext}`)
        );

  const css = t =>
    !t || !/imgur\.com/i.test(t)
      ? t
      : t.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (_, q, u) =>
          `url(${q || '"'}${proxy(u.trim())}${q || '"'})`
        );

  const patch = el => {
    if (el.matches?.("img,source")) {
      for (const a of ["src", "srcset"]) {
        const v = el.getAttribute(a);
        if (!v || !/imgur/i.test(v)) continue;
        el.setAttribute(
          a,
          a === "srcset"
            ? v.split(",").map(p => {
                const [u, ...r] = p.trim().split(/\s+/);
                return [proxy(u), ...r].join(" ");
              }).join(", ")
            : proxy(v)
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
  };

  const flush = async () => {
    const batch = [...q]; q.clear(); busy = 0;
    for (let i = 0; i < batch.length; i++) {
      batch[i].isConnected && patch(batch[i]);
      if (!((i + 1) % 25)) await yield_();
    }
  };

  const add = el => {
    if (el?.nodeType === 1) {
      q.add(el);
      if (!busy++) requestIdleCallback?.(flush, { timeout: 100 }) || requestAnimationFrame(flush);
    }
  };

  const scan = async () => {
    document.querySelectorAll("img,source,[style*='imgur' i],style").forEach(add);
    await flush();
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch { continue; }
      for (let i = 0; i < (rules?.length || 0); i++) {
        if (i && !(i % 40)) await yield_();
        for (const rule of [rules[i], ...(rules[i].cssRules || [])]) {
          if (!rule.style) continue;
          for (const p of ["background","background-image","list-style-image","border-image","border-image-source","mask-image","content","cursor"]) {
            const v = rule.style.getPropertyValue(p);
            if (v && /imgur/i.test(v))
              rule.style.setProperty(p, css(v), rule.style.getPropertyPriority(p));
          }
        }
      }
      await yield_();
    }
  };

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", () => queueMicrotask(scan))
    : queueMicrotask(scan);

  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === "attributes") add(m.target);
      else for (const n of m.addedNodes) {
        add(n);
        n.querySelectorAll?.("img,source,[style*='imgur' i],style").forEach(add);
      }
    }
  }).observe(document.documentElement, {
    childList: true, subtree: true,
    attributes: true, attributeFilter: ["src", "srcset", "style"],
  });
})();