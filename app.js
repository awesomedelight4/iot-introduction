(function () {
  "use strict";
  var WEEKS = window.WEEKS || [];
  WEEKS.sort(function (a, b) { return a.num - b.num; });
  var mainEl = document.getElementById("main");
  var sideEl = document.getElementById("side");

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function shuffled(arr) {
    var a = arr.slice();
    for (var t = 0; t < 8; t++) {
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
      if (a.length < 2 || a.some(function (v, i) { return v !== arr[i]; })) break;
    }
    return a;
  }
  function norm(s) { return String(s).trim().toLowerCase().replace(/\s+/g, " "); }
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem("iotc:" + k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem("iotc:" + k, JSON.stringify(v)); } catch (e) { } }
  };
  function markDone(id) { var d = store.get("done") || {}; d[id] = 1; store.set("done", d); updateProgress(); }
  function isDone(id) { var d = store.get("done") || {}; return !!d[id]; }
  function codeBlock(code, lang) {
    var wrap = el("div");
    var btn = el("button", { class: "copy", type: "button" }, "Copy");
    var pre = el("pre", { class: "code" });
    var c = el("code"); c.textContent = code; pre.appendChild(c);
    btn.addEventListener("click", function () {
      try { navigator.clipboard.writeText(code).then(function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); }, function () { btn.textContent = "Select and copy"; }); }
      catch (e) { btn.textContent = "Select and copy"; }
    });
    wrap.appendChild(btn); wrap.appendChild(pre);
    return wrap;
  }
  function feedback(box, ok, msg) { box.className = "fb " + (ok ? "ok" : "bad"); box.textContent = msg; }
  function buttons(list) {
    var d = el("div", { class: "btns" });
    list.forEach(function (b) { var x = el("button", { class: "b" + (b.pri ? " pri" : ""), type: "button" }, b.label); x.addEventListener("click", b.fn); d.appendChild(x); });
    return d;
  }

  // ---------- activity renderers ----------
  var R = {};

  R.defs = function (s) {
    var dl = el("dl", { class: "defs" });
    s.items.forEach(function (it) { dl.appendChild(el("dt", null, it[0])); dl.appendChild(el("dd", null, it[1])); });
    return dl;
  };

  R.concept = function (s) { return el("div", null, s.html); };

  R.build = function (s) {
    var d = el("div");
    if (s.intro) d.appendChild(el("div", null, s.intro));
    s.steps.forEach(function (st, i) {
      var box = el("div", { class: "step" });
      box.appendChild(el("h4", null, "Step " + (i + 1) + ": " + st.title));
      if (st.html) box.appendChild(el("div", null, st.html));
      if (st.code) box.appendChild(codeBlock(st.code, st.lang));
      if (st.after) box.appendChild(el("div", null, st.after));
      d.appendChild(box);
    });
    return d;
  };

  R.fill = function (s, id) {
    var d = el("div", { class: "act" });
    d.appendChild(el("p", { class: "instr" }, s.instr || "Type the missing words. Click a word in the bank to put it in the selected blank."));
    var answers = [];
    var html = esc(s.text).replace(/\{\{(.+?)\}\}/g, function (m, a) { answers.push(a.split("|")); return '<input type="text" data-i="' + (answers.length - 1) + '" aria-label="blank ' + answers.length + '">'; });
    var words = answers.map(function (a) { return a[0]; }).concat(s.extra || []);
    var bank = el("div", { class: "bank", "aria-label": "Word bank" });
    var current = null;
    shuffled(words).forEach(function (w) {
      var c = el("button", { class: "chip", type: "button" }, esc(w));
      c.addEventListener("click", function () {
        var target = current || Array.prototype.find.call(txt.querySelectorAll("input"), function (x) { return !x.value; });
        if (target) { target.value = w; target.classList.remove("ok", "bad"); c.classList.add("used"); var nx = Array.prototype.find.call(txt.querySelectorAll("input"), function (x) { return !x.value; }); current = nx || null; if (nx) nx.focus(); }
      });
      bank.appendChild(c);
    });
    var txt = el("div", { class: "filltext" }, html.replace(/\n/g, "<br>"));
    txt.querySelectorAll("input").forEach(function (inp) { inp.addEventListener("focus", function () { current = inp; }); inp.addEventListener("input", function () { inp.classList.remove("ok", "bad"); }); });
    var fb = el("div", { class: "fb" });
    d.appendChild(bank); d.appendChild(txt);
    d.appendChild(buttons([
      { label: "Check", pri: true, fn: function () {
        var inputs = txt.querySelectorAll("input"), right = 0, empty = 0;
        inputs.forEach(function (inp) {
          var ok = answers[+inp.dataset.i].some(function (a) { return norm(a) === norm(inp.value); });
          if (!inp.value.trim()) { empty++; inp.classList.remove("ok", "bad"); return; }
          inp.classList.toggle("ok", ok); inp.classList.toggle("bad", !ok); if (ok) right++;
        });
        if (empty) { feedback(fb, false, "Fill every blank first (" + empty + " empty)."); return; }
        feedback(fb, right === inputs.length, right + " of " + inputs.length + " correct." + (right === inputs.length ? " Well done." : " Red blanks need another look."));
        if (right === inputs.length) markDone(id);
      } },
      { label: "Show answers", fn: function () { txt.querySelectorAll("input").forEach(function (inp) { inp.value = answers[+inp.dataset.i][0]; inp.classList.add("ok"); inp.classList.remove("bad"); }); bank.querySelectorAll(".chip").forEach(function (c) { c.classList.add("used"); }); } },
      { label: "Reset", fn: function () { txt.querySelectorAll("input").forEach(function (inp) { inp.value = ""; inp.classList.remove("ok", "bad"); }); bank.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("used"); }); fb.textContent = ""; current = null; } }
    ]));
    d.appendChild(fb);
    return d;
  };

  R.match = function (s, id) {
    var d = el("div", { class: "act" });
    d.appendChild(el("p", { class: "instr" }, s.instr || "Choose the matching item for each row."));
    var rights = s.pairs.map(function (p) { return p[1]; });
    var uniq = rights.filter(function (v, i) { return rights.indexOf(v) === i; }).concat(s.extra || []);
    var rows = [];
    shuffled(s.pairs).forEach(function (p) {
      var r = el("div", { class: "mrow" });
      r.appendChild(el("div", null, p[0]));
      var sel = el("select", { "aria-label": "Match for " + p[0].replace(/<[^>]+>/g, "") });
      sel.appendChild(el("option", { value: "" }, "Choose…"));
      shuffled(uniq).forEach(function (o) { sel.appendChild(el("option", { value: o }, esc(o))); });
      sel.addEventListener("change", function () { sel.classList.remove("ok", "bad"); });
      r.appendChild(sel); d.appendChild(r); rows.push({ sel: sel, ans: p[1] });
    });
    var fb = el("div", { class: "fb" });
    d.appendChild(buttons([
      { label: "Check", pri: true, fn: function () {
        var empty = rows.filter(function (r) { return !r.sel.value; }).length;
        if (empty) { feedback(fb, false, "Choose an answer for every row first (" + empty + " left)."); return; }
        var right = 0;
        rows.forEach(function (r) { var ok = r.sel.value === r.ans; r.sel.classList.toggle("ok", ok); r.sel.classList.toggle("bad", !ok); if (ok) right++; });
        feedback(fb, right === rows.length, right + " of " + rows.length + " correct.");
        if (right === rows.length) markDone(id);
      } },
      { label: "Show answers", fn: function () { rows.forEach(function (r) { r.sel.value = r.ans; r.sel.classList.add("ok"); r.sel.classList.remove("bad"); }); } }
    ]));
    d.appendChild(fb);
    return d;
  };

  R.order = function (s, id) {
    var d = el("div", { class: "act" });
    d.appendChild(el("p", { class: "instr" }, s.instr || "Put the lines in the correct order using the arrow buttons."));
    var ol = el("ol", { class: "ord" + (s.plain ? " plain" : "") });
    function render(list) {
      ol.innerHTML = "";
      list.forEach(function (txt, i) {
        var li = el("li");
        li.appendChild(el("span", { class: "n" }, String(i + 1)));
        var tx = el("span", { class: "tx" }); tx.textContent = txt; li.appendChild(tx);
        var up = el("button", { type: "button", "aria-label": "Move up" }, "▲");
        var dn = el("button", { type: "button", "aria-label": "Move down" }, "▼");
        up.addEventListener("click", function () { if (i > 0) { var a = cur(); var t = a[i - 1]; a[i - 1] = a[i]; a[i] = t; render(a); } });
        dn.addEventListener("click", function () { var a = cur(); if (i < a.length - 1) { var t = a[i + 1]; a[i + 1] = a[i]; a[i] = t; render(a); } });
        li.appendChild(up); li.appendChild(dn); ol.appendChild(li);
      });
    }
    function cur() { return Array.prototype.map.call(ol.querySelectorAll(".tx"), function (x) { return x.textContent; }); }
    render(shuffled(s.items));
    d.appendChild(ol);
    var fb = el("div", { class: "fb" });
    d.appendChild(buttons([
      { label: "Check", pri: true, fn: function () {
        var a = cur(), right = 0;
        ol.querySelectorAll("li").forEach(function (li, i) { var ok = a[i] === s.items[i]; li.classList.toggle("ok", ok); li.classList.toggle("bad", !ok); if (ok) right++; });
        feedback(fb, right === a.length, right === a.length ? "Correct order." + (s.why ? " " + s.why : "") : right + " of " + a.length + " in the right place. Green lines are correct.");
        if (right === a.length) markDone(id);
      } },
      { label: "Show answer", fn: function () { render(s.items); ol.querySelectorAll("li").forEach(function (li) { li.classList.add("ok"); }); if (s.why) feedback(fb, true, s.why); } },
      { label: "Shuffle", fn: function () { render(shuffled(s.items)); fb.textContent = ""; } }
    ]));
    d.appendChild(fb);
    return d;
  };

  R.bug = function (s, id) {
    var d = el("div", { class: "act" });
    var n = Object.keys(s.bugs).length;
    d.appendChild(el("p", { class: "instr" }, (s.instr || "Click every line that contains an error.") + " There " + (n === 1 ? "is 1 error" : "are " + n + " errors") + " to find."));
    var box = el("div", { class: "bugcode" });
    var lines = s.code.split("\n");
    var sel = {};
    lines.forEach(function (ln, i) {
      var row = el("div", { class: "l", role: "button", tabindex: "0" });
      row.appendChild(el("span", { class: "ln" }, String(i + 1)));
      var c = el("span", { class: "c" }); c.textContent = ln || " "; row.appendChild(c);
      function tog() { sel[i] = !sel[i]; row.classList.toggle("sel", !!sel[i]); row.classList.remove("hit", "miss", "missed"); }
      row.addEventListener("click", tog);
      row.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } });
      box.appendChild(row);
    });
    d.appendChild(box);
    var fb = el("div", { class: "fb" });
    var ex = el("div", { class: "explain" }); ex.style.display = "none";
    function explainAll() {
      ex.innerHTML = "<strong>The errors:</strong><ul>" + Object.keys(s.bugs).map(function (k) { return "<li>Line " + (+k + 1) + ": " + s.bugs[k] + "</li>"; }).join("") + "</ul>" + (s.fixed ? "<strong>Fixed code:</strong>" : "");
      if (s.fixed) ex.appendChild(codeBlock(s.fixed));
      ex.style.display = "block";
    }
    d.appendChild(buttons([
      { label: "Check", pri: true, fn: function () {
        var rows = box.querySelectorAll(".l"), hits = 0, wrong = 0;
        if (!Object.keys(sel).some(function (k) { return sel[k]; })) { feedback(fb, false, "Click at least one line first."); return; }
        rows.forEach(function (r, i) {
          r.classList.remove("hit", "miss", "missed", "sel");
          var isBug = Object.prototype.hasOwnProperty.call(s.bugs, i);
          if (sel[i] && isBug) { r.classList.add("hit"); hits++; }
          else if (sel[i] && !isBug) { r.classList.add("miss"); wrong++; }
        });
        var ok = hits === n && wrong === 0;
        feedback(fb, ok, "Found " + hits + " of " + n + " errors" + (wrong ? ", and " + wrong + " line" + (wrong > 1 ? "s" : "") + " marked that " + (wrong > 1 ? "are" : "is") + " fine." : ".") + (ok ? " All found." : " Keep hunting, or reveal the answer."));
        if (ok) { markDone(id); explainAll(); }
      } },
      { label: "Reveal answer", fn: function () { box.querySelectorAll(".l").forEach(function (r, i) { if (Object.prototype.hasOwnProperty.call(s.bugs, i) && !r.classList.contains("hit")) r.classList.add("missed"); }); explainAll(); } },
      { label: "Reset", fn: function () { sel = {}; box.querySelectorAll(".l").forEach(function (r) { r.classList.remove("hit", "miss", "missed", "sel"); }); fb.textContent = ""; ex.style.display = "none"; } }
    ]));
    d.appendChild(fb); d.appendChild(ex);
    return d;
  };

  R.mcq = function (s, id) {
    var d = el("div", { class: "act mcq" });
    var groups = [];
    s.qs.forEach(function (q, qi) {
      d.appendChild(el("div", { class: "q" }, (qi + 1) + ". " + q.q));
      var name = id + "-q" + qi, labels = [];
      q.opts.forEach(function (o, oi) {
        var lab = el("label"); var r = el("input", { type: "radio", name: name, value: String(oi) });
        lab.appendChild(r); lab.appendChild(document.createTextNode(" " + o)); d.appendChild(lab); labels.push(lab);
        r.addEventListener("change", function () { labels.forEach(function (l) { l.classList.remove("ok", "bad"); }); });
      });
      var why = el("div", { class: "explain" }); why.style.display = "none"; why.innerHTML = q.why || ""; d.appendChild(why);
      groups.push({ name: name, labels: labels, ans: q.a, why: why });
    });
    var fb = el("div", { class: "fb" });
    d.appendChild(buttons([{ label: "Check", pri: true, fn: function () {
      var unanswered = groups.filter(function (g) { return !d.querySelector('input[name="' + g.name + '"]:checked'); }).length;
      if (unanswered) { feedback(fb, false, "Answer every question first (" + unanswered + " left)."); return; }
      var right = 0;
      groups.forEach(function (g) {
        var v = +d.querySelector('input[name="' + g.name + '"]:checked').value;
        g.labels.forEach(function (l, i) { l.classList.remove("ok", "bad"); if (i === g.ans) l.classList.add("ok"); else if (i === v) l.classList.add("bad"); });
        if (v === g.ans) right++; if (g.why.innerHTML) g.why.style.display = "block";
      });
      feedback(fb, right === groups.length, right + " of " + groups.length + " correct.");
      if (right === groups.length) markDone(id);
    } }]));
    d.appendChild(fb);
    return d;
  };

  R.create = function (s, id) {
    var d = el("div", { class: "act" });
    if (s.brief) d.appendChild(el("div", null, s.brief));
    d.appendChild(el("p", { class: "instr" }, "Tick each item when your work meets it."));
    var saved = store.get("chk:" + id) || {};
    var boxes = [];
    s.checklist.forEach(function (c, i) {
      var lab = el("label", { style: "display:block;padding:5px 0" });
      var cb = el("input", { type: "checkbox" }); cb.checked = !!saved[i];
      cb.addEventListener("change", function () { saved[i] = cb.checked; store.set("chk:" + id, saved); upd(); });
      lab.appendChild(cb); lab.appendChild(document.createTextNode(" " + c)); d.appendChild(lab); boxes.push(cb);
    });
    var fb = el("div", { class: "fb" });
    function upd() { var n = boxes.filter(function (b) { return b.checked; }).length; feedback(fb, n === boxes.length, n + " of " + boxes.length + " criteria met." + (n === boxes.length ? " Ready to share with your group." : "")); if (n === boxes.length) markDone(id); }
    d.appendChild(fb); if (Object.keys(saved).length) upd();
    return d;
  };

  // ---------- widgets ----------
  var W = {};
  var COLS = [["black", 0, 1, null, "#141414"], ["brown", 1, 10, 1, "#78461e"], ["red", 2, 100, 2, "#cd2828"], ["orange", 3, 1e3, null, "#f08214"], ["yellow", 4, 1e4, null, "#f0d21e"], ["green", 5, 1e5, 0.5, "#28963c"], ["blue", 6, 1e6, 0.25, "#285ad2"], ["violet", 7, 1e7, 0.1, "#823cb4"], ["grey", 8, 1e8, 0.05, "#8c8c8c"], ["white", 9, 1e9, null, "#fafafa"], ["gold", null, 0.1, 5, "#c8a032"], ["silver", null, 0.01, 10, "#bebec8"]];
  function fmtOhm(v) {
    if (v >= 1e6) return +(v / 1e6).toPrecision(4) + " MΩ";
    if (v >= 1e3) return +(v / 1e3).toPrecision(4) + " kΩ";
    return +v.toPrecision(4) + " Ω";
  }
  W.resistor = function () {
    var d = el("div", { class: "widget" });
    d.innerHTML = '<div class="res-row"><label>Bands<select data-k="n"><option value="4">4 bands</option><option value="5">5 bands</option></select></label><span data-k="sels" class="res-row"></span></div><div style="margin:14px 0"><svg viewBox="0 0 360 90" width="100%" style="max-width:420px" role="img" aria-label="Resistor drawing"><line x1="0" y1="45" x2="360" y2="45" stroke="#888" stroke-width="5"/><rect x="80" y="15" width="200" height="60" rx="28" fill="#e2c897" stroke="#333"/><g data-k="bands"></g></svg></div><div class="out" data-k="out"></div><div data-k="range" style="color:var(--muted)"></div>';
    var nSel = d.querySelector('[data-k="n"]'), sels = d.querySelector('[data-k="sels"]'), bands = d.querySelector('[data-k="bands"]'), out = d.querySelector('[data-k="out"]'), range = d.querySelector('[data-k="range"]');
    function mk(label, filter, def) {
      var l = el("label", null, label); var s = el("select");
      COLS.forEach(function (c, i) { if (filter(c)) s.appendChild(el("option", { value: String(i) }, c[0])); });
      s.value = String(def); s.addEventListener("change", calc); l.appendChild(s); sels.appendChild(l); return s;
    }
    var cur = [];
    function build() {
      sels.innerHTML = ""; var five = nSel.value === "5";
      var digit = function (c) { return c[1] !== null; }, mult = function (c) { return c[2] !== null; }, tol = function (c) { return c[3] !== null; };
      cur = five ? [mk("1st digit", function (c) { return digit(c) && c[1] > 0; }, 1), mk("2nd digit", digit, 0), mk("3rd digit", digit, 0), mk("Multiplier", mult, 0), mk("Tolerance", tol, 1)]
                 : [mk("1st digit", function (c) { return digit(c) && c[1] > 0; }, 2), mk("2nd digit", digit, 2), mk("Multiplier", mult, 1), mk("Tolerance", tol, 10)];
      calc();
    }
    function calc() {
      var idx = cur.map(function (s) { return +s.value; });
      var digits = idx.slice(0, idx.length - 2).map(function (i) { return COLS[i][1]; }).join("");
      var m = COLS[idx[idx.length - 2]][2], t = COLS[idx[idx.length - 1]][3];
      var v = parseInt(digits, 10) * m;
      out.textContent = fmtOhm(v) + "  ±" + t + "%";
      range.textContent = "Acceptable range: " + fmtOhm(v * (1 - t / 100)) + " to " + fmtOhm(v * (1 + t / 100));
      var xs = idx.length === 4 ? [105, 135, 165, 245] : [100, 125, 150, 175, 245];
      bands.innerHTML = idx.map(function (i, k) { return '<rect x="' + xs[k] + '" y="16" width="14" height="58" fill="' + COLS[i][4] + '" stroke="#555" stroke-width=".5"/>'; }).join("");
    }
    nSel.addEventListener("change", build); build();
    return d;
  };
  W.ledcalc = function () {
    var d = el("div", { class: "widget" });
    d.innerHTML = '<div class="res-row"><label>Supply voltage (V)<select data-k="vs"><option value="5">5 V (Arduino Uno)</option><option value="3.3">3.3 V (ESP32, Raspberry Pi)</option></select></label><label>LED colour<select data-k="vf"><option value="2.0">Red (about 2.0 V)</option><option value="2.1">Yellow/amber (about 2.1 V)</option><option value="3.0">Green (about 3.0 V)</option><option value="3.0">Blue/white (about 3.0 V)</option></select></label><label>Current (mA)<input data-k="i" type="number" min="1" max="20" value="15" style="width:6em"></label></div><div class="out" data-k="out"></div><div data-k="work" style="color:var(--muted)"></div>';
    var E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    function nextUp(v) { var dec = Math.pow(10, Math.floor(Math.log10(v))); for (var k = 0; k < 3; k++) { for (var i = 0; i < E12.length; i++) { if (E12[i] * dec >= v - 1e-9) return E12[i] * dec; } dec *= 10; } return v; }
    function calc() {
      var vs = +d.querySelector('[data-k="vs"]').value, vf = +d.querySelector('[data-k="vf"]').value, i = +d.querySelector('[data-k="i"]').value;
      var o = d.querySelector('[data-k="out"]'), w = d.querySelector('[data-k="work"]');
      if (!(i > 0 && i <= 20)) { o.textContent = "Enter a current from 1 to 20 mA."; w.textContent = ""; return; }
      if (vs <= vf) { o.textContent = "The supply is too low to light this LED with a resistor."; w.textContent = ""; return; }
      var r = (vs - vf) / (i / 1000);
      o.textContent = "Use " + fmtOhm(nextUp(r)) + " (next standard value up)";
      w.textContent = "R = (V supply − V LED) ÷ I = (" + vs + " − " + vf + ") ÷ " + (i / 1000) + " A = " + r.toFixed(0) + " Ω";
    }
    d.querySelectorAll("select,input").forEach(function (x) { x.addEventListener("input", calc); x.addEventListener("change", calc); });
    calc(); return d;
  };
  W.distance = function () {
    var d = el("div", { class: "widget" });
    d.innerHTML = '<div class="res-row"><label>Echo duration (µs)<input data-k="t" type="range" min="100" max="3000" step="10" value="1750" style="width:240px"></label><label>Bin depth (cm)<input data-k="depth" type="number" value="50" min="10" max="200" style="width:6em"></label></div><div class="out" data-k="out"></div><div data-k="work" style="color:var(--muted)"></div>';
    function calc() {
      var t = +d.querySelector('[data-k="t"]').value, depth = +d.querySelector('[data-k="depth"]').value;
      var dist = t * 0.0343 / 2;
      var level = Math.max(0, Math.min(100, Math.round(100 * (depth - dist) / depth)));
      d.querySelector('[data-k="out"]').textContent = "distance = " + dist.toFixed(1) + " cm → bin " + level + "% full";
      d.querySelector('[data-k="work"]').textContent = "distance = " + t + " × 0.0343 ÷ 2;  level = 100 × (" + depth + " − " + dist.toFixed(1) + ") ÷ " + depth;
    }
    d.querySelectorAll("input").forEach(function (x) { x.addEventListener("input", calc); });
    calc(); return d;
  };
  R.widget = function (s) { return W[s.name] ? W[s.name]() : el("p", null, "Missing widget"); };

  // ---------- page ----------
  var LABELS = { defs: "Definitions", concept: "Concept", build: "Build", fill: "Fill the blanks", match: "Matching", order: "Puzzle", bug: "Bug hunt", mcq: "Scenario questions", widget: "Interactive tool", create: "Design task" };
  var BLOOM = ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"];
  var ACT = ["fill", "match", "order", "bug", "mcq", "create"];

  function buildSide(active) {
    sideEl.innerHTML = "";
    WEEKS.forEach(function (w) {
      var a = el("a", { class: "wk" + (w.num === active ? " on" : ""), href: "#week-" + w.num }, "Week " + w.num + "<span>" + w.title + "</span>");
      sideEl.appendChild(a);
      if (w.num === active) {
        var sub = el("div", { class: "sub" });
        w.sections.forEach(function (s, i) { if (s.title) { var x = el("a", { href: "#week-" + w.num }, s.title); x.addEventListener("click", function (e) { e.preventDefault(); var t = document.getElementById("w" + w.num + "s" + i); if (t) t.scrollIntoView({ behavior: "smooth" }); sideEl.classList.remove("open"); }); sub.appendChild(x); } });
        sideEl.appendChild(sub);
      }
    });
    sideEl.appendChild(el("div", { class: "prog", id: "prog" }));
    updateProgress();
  }
  function countActs(w) { return w.sections.filter(function (s) { return ACT.indexOf(s.type) >= 0; }).length; }
  function updateProgress() {
    var p = document.getElementById("prog"); if (!p) return;
    var tot = 0, done = 0;
    WEEKS.forEach(function (w) { w.sections.forEach(function (s, i) { if (ACT.indexOf(s.type) >= 0) { tot++; if (isDone("w" + w.num + "s" + i)) done++; } }); });
    p.textContent = "Activities completed: " + done + " of " + tot + " (saved in this browser only)";
  }

  function renderWeek(num) {
    var w = WEEKS.filter(function (x) { return x.num === num; })[0] || WEEKS[0];
    buildSide(w.num);
    mainEl.innerHTML = "";
    mainEl.appendChild(el("div", { class: "tag" }, "Week " + w.num + " of " + WEEKS.length));
    mainEl.appendChild(el("h2", { class: "wtitle" }, w.title));
    mainEl.appendChild(el("p", { class: "wsub" }, w.subtitle));
    var lad = el("div", { class: "ladder", "aria-label": "Bloom's taxonomy levels this week" });
    BLOOM.forEach(function (b, k) {
      var n = w.sections.filter(function (s) { return s.bloom === b; }).length;
      lad.appendChild(el("div", { class: "rung" + (n ? " has" : "") }, "<b>" + (k + 1) + ". " + b + "</b><span>" + n + " section" + (n === 1 ? "" : "s") + "</span>"));
    });
    mainEl.appendChild(lad);
    var acts = 0, dn = 0; w.sections.forEach(function (s, i) { if (ACT.indexOf(s.type) >= 0) { acts++; if (isDone("w" + w.num + "s" + i)) dn++; } });
    mainEl.appendChild(el("div", { class: "wprog" }, '<div class="bar"><i style="width:' + (acts ? Math.round(100 * dn / acts) : 0) + '%"></i></div><span>' + dn + " of " + acts + " activities completed this week</span>"));
    if (w.outcomes) mainEl.appendChild(el("div", { class: "outcomes" }, "<strong>By the end of this week you can:</strong><ul>" + w.outcomes.map(function (o) { return "<li>" + o + "</li>"; }).join("") + "</ul>"));
    w.sections.forEach(function (s, i) {
      var id = "w" + w.num + "s" + i;
      var sec = el("section", { class: "blk", id: id });
      var tag = el("div", { class: "tag" }, (s.bloom ? '<span class="bl">' + s.bloom + "</span> · " : "") + (s.label || LABELS[s.type] || ""));
      if (isDone(id)) tag.appendChild(el("span", { class: "done-tick" }, "completed"));
      sec.appendChild(tag);
      if (s.title) sec.appendChild(el("h3", null, s.title));
      if (s.lead) sec.appendChild(el("div", null, s.lead));
      sec.appendChild((R[s.type] || R.concept)(s, id));
      mainEl.appendChild(sec);
    });
    if (w.sources) {
      var sec = el("section", { class: "blk" });
      sec.appendChild(el("div", { class: "tag" }, "Sources"));
      sec.appendChild(el("h3", null, "Sources and further reading"));
      sec.appendChild(el("ul", { class: "srcs" }, w.sources.map(function (s) { return '<li><a href="' + s[1] + '" target="_blank" rel="noopener">' + s[0] + "</a>" + (s[2] ? " — " + s[2] : "") + "</li>"; }).join("")));
      mainEl.appendChild(sec);
    }
    var pg = el("div", { class: "pager" });
    var prev = WEEKS.filter(function (x) { return x.num === w.num - 1; })[0], next = WEEKS.filter(function (x) { return x.num === w.num + 1; })[0];
    pg.appendChild(prev ? el("a", { href: "#week-" + prev.num }, "← Week " + prev.num + ": " + prev.title) : el("span"));
    pg.appendChild(next ? el("a", { href: "#week-" + next.num }, "Week " + next.num + ": " + next.title + " →") : el("span"));
    mainEl.appendChild(pg);
    window.scrollTo(0, 0);
  }

  function route() {
    var m = /^#week-(\d+)$/.exec(location.hash || "");
    var num = m ? +m[1] : (store.get("lastWeek") || 1);
    store.set("lastWeek", num);
    renderWeek(num);
  }
  window.addEventListener("hashchange", route);
  document.getElementById("menuBtn").addEventListener("click", function () { sideEl.classList.toggle("open"); });
  if (!WEEKS.length) { mainEl.textContent = "Course content failed to load."; return; }
  route();
})();
