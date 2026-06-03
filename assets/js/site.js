// Context Window — progressive enhancement: scroll reveal, theme toggle,
// archive topic filter. Everything degrades to a fully usable static page.
(function () {
  var root = document.documentElement;

  // ── Theme toggle ──────────────────────────────────────────────────────
  // The head script already applied a remembered dark theme before paint;
  // here we just keep the button glyph in sync and handle clicks.
  var btn = document.getElementById("theme-toggle");
  function isDark() { return root.getAttribute("data-theme") === "dark"; }
  function paintBtn() { if (btn) btn.textContent = isDark() ? "☾" : "☀"; } // ☾ / ☀
  paintBtn();
  if (btn) {
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      if (next === "dark") root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
      try { localStorage.setItem("cw-theme", next); } catch (e) {}
      paintBtn();
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────────────
  // Opt into the hidden-until-revealed state only now that JS is running,
  // so no-JS and crawler views keep everything visible.
  root.classList.add("reveal-anim");
  var els = [].slice.call(document.querySelectorAll(".reveal"));
  var vh = window.innerHeight || 800;
  function revealAll() { els.forEach(function (el) { el.classList.add("in"); }); }

  if (!("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) {
      // Anything already in (or near) the first viewport shows immediately.
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
      else io.observe(el);
    });
    // Safety net: if anything is still hidden a moment after load, show it.
    window.addEventListener("load", function () { setTimeout(revealAll, 1200); });
  }

  // ── Archive topic filter ──────────────────────────────────────────────
  var list = document.getElementById("archive-list");
  if (list) {
    var params = new URLSearchParams(window.location.search);
    var active = (params.get("topic") || "").toLowerCase();
    var rows = [].slice.call(list.querySelectorAll(".post"));
    var empty = document.getElementById("archive-empty");
    var shown = 0;
    rows.forEach(function (row) {
      var match = !active || row.getAttribute("data-topic") === active;
      row.hidden = !match;
      if (match) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
    var chips = document.querySelectorAll("#topic-filter a");
    [].forEach.call(chips, function (a) {
      a.classList.toggle("active", (a.getAttribute("data-topic") || "") === active);
    });
  }
})();
