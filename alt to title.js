
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("img[alt]").forEach(img => {
    if (!img.hasAttribute("title")) {
      img.setAttribute("title", img.getAttribute("alt"));
    }
  });
});