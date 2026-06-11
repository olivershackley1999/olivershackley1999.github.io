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
    var topicChips = document.querySelectorAll("#topic-filter a");
    [].forEach.call(topicChips, function (a) {
      a.classList.toggle("active", (a.getAttribute("data-topic") || "") === active);
    });
  }

  // ── Reader donation tally ─────────────────────────────────────────────
  // Honor-system counter backed by Abacus (free hosted +1 counters, CORS-open,
  // keys auto-create on first hit). One counter per preset amount; the dollar
  // total is the sum of amount x that bucket's count. No backend of ours, and
  // nothing here moves money — it just tracks what readers say they gave.
  var give = document.querySelector(".give");
  if (give) {
    var ns = give.getAttribute("data-give-ns");
    var buckets = (give.getAttribute("data-give-buckets") || "").split(",")
      .map(function (n) { return parseInt(n, 10); })
      .filter(function (n) { return n > 0; });
    var API = "https://abacus.jasoncameron.dev";
    var amountEl = give.querySelector("[data-give-amount]");
    var countEl = give.querySelector("[data-give-count]");
    var tally = give.querySelector(".give-tally");
    var counts = {}; // amount -> number of gifts at that amount

    function bucketKey(amt) { return "give-" + amt; }

    function render() {
      var dollars = 0, gifts = 0;
      buckets.forEach(function (amt) {
        var c = counts[amt] || 0;
        dollars += amt * c; gifts += c;
      });
      if (amountEl) amountEl.textContent = "$" + dollars.toLocaleString();
      if (countEl) countEl.textContent = gifts.toLocaleString();
    }

    function readBucket(amt) {
      // A never-hit key returns {"error":"Key not found"} — treat as 0.
      return fetch(API + "/get/" + ns + "/" + bucketKey(amt))
        .then(function (r) { return r.json(); })
        .then(function (d) { counts[amt] = (d && typeof d.value === "number") ? d.value : 0; })
        .catch(function () { counts[amt] = counts[amt] || 0; });
    }

    // Load every bucket, then reveal the tally. It starts hidden so no-JS
    // views and failed fetches never show an empty or broken counter.
    Promise.all(buckets.map(readBucket)).then(function () {
      render();
      if (tally) tally.hidden = false;
    });

    var chips = [].slice.call(give.querySelectorAll(".give-chip"));
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var amt = parseInt(chip.getAttribute("data-give-amt"), 10);
        if (!amt || chip.disabled) return;
        chip.disabled = true;
        chip.classList.add("added");
        chip.textContent = "Added ✓";
        // Optimistic bump so it feels instant, then reconcile with the server.
        counts[amt] = (counts[amt] || 0) + 1;
        render();
        fetch(API + "/hit/" + ns + "/" + bucketKey(amt))
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && typeof d.value === "number") { counts[amt] = d.value; render(); }
          })
          .catch(function () {})
          .then(function () {
            setTimeout(function () {
              chip.textContent = "$" + amt;
              chip.classList.remove("added");
              chip.disabled = false;
            }, 1600);
          });
      });
    });
  }
})();
