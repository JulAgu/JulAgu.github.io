/*
 * Conway's Game of Life, quietly evolving behind every page.
 *
 * The badge on the corner of the profile picture switches it on and off. The
 * soup only starts in a few round zones (one around the picture, the others at
 * random spots on the screen), and spreads from there.
 * The choice is remembered for the browser session, so it survives page
 * navigation.
 * The canvas is created here and styled in _sass/_life-background.scss, which
 * also gives it its colour (the site's main colour), so nothing is duplicated.
 * The grid wraps around its edges. When the board settles into still lifes and
 * blinkers (or dies out), new zones are filled with soup to wake it up.
 * With "reduce motion" on, a single still generation is drawn instead.
 */
(function () {
  "use strict";

  var canvas = document.createElement("canvas");
  if (!canvas.getContext) {
    return;
  }
  canvas.className = "life-background";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext("2d");
  var cellPx = 20;      // size of a cell, in CSS pixels
  var stepMs = 1000;     // time between two generations
  var density = 0.25;   // share of living cells in a fresh soup
  var zoneCells = 6;    // radius of a starting zone, in cells
  var zoneCount = 3;    // number of starting zones, the picture's included

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cols, rows, cells, next, previous;

  /* the cell under the centre of the profile picture (or of the screen) */
  function pictureCentre() {
    var picture = document.querySelector(".life-avatar img");
    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    if (picture) {
      var box = picture.getBoundingClientRect();
      x = box.left + box.width / 2;
      y = box.top + box.height / 2;
    }
    /* scrolled out of view: keep the zone on screen */
    return {
      x: Math.min(cols - 1, Math.max(0, Math.floor(x / cellPx))),
      y: Math.min(rows - 1, Math.max(0, Math.floor(y / cellPx)))
    };
  }

  function randomCentre() {
    return {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
  }

  /* fill a round zone with random soup */
  function seedZone(centre) {
    for (var dy = -zoneCells; dy <= zoneCells; dy++) {
      for (var dx = -zoneCells; dx <= zoneCells; dx++) {
        if (dx * dx + dy * dy > zoneCells * zoneCells) {
          continue;
        }
        var x = (centre.x + dx + cols) % cols;
        var y = (centre.y + dy + rows) % rows;
        cells[y * cols + x] = Math.random() < density ? 1 : 0;
      }
    }
  }

  function seedZones() {
    seedZone(pictureCentre());
    for (var n = 1; n < zoneCount; n++) {
      seedZone(randomCentre());
    }
  }

  function resize() {
    /* the size the stylesheet gives the canvas: the viewport without its
       scrollbars (window.innerWidth would count them, and overflow) */
    var ratio = window.devicePixelRatio || 1;
    var width = canvas.clientWidth || document.documentElement.clientWidth;
    var height = canvas.clientHeight || document.documentElement.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    var newCols = Math.ceil(width / cellPx);
    var newRows = Math.ceil(height / cellPx);
    if (newCols !== cols || newRows !== rows) {
      /* keep the living cells that still fit, so that mobile browsers, which
         resize the viewport while scrolling, don't wipe the board */
      var kept = new Uint8Array(newCols * newRows);
      if (cells) {
        for (var y = 0; y < Math.min(rows, newRows); y++) {
          for (var x = 0; x < Math.min(cols, newCols); x++) {
            kept[y * newCols + x] = cells[y * cols + x];
          }
        }
      }
      cols = newCols;
      rows = newRows;
      cells = kept;
      next = new Uint8Array(cols * rows);
      previous = new Uint8Array(cols * rows);
    }
    draw();
  }

  function step() {
    for (var y = 0; y < rows; y++) {
      var up = ((y - 1 + rows) % rows) * cols;
      var row = y * cols;
      var down = ((y + 1) % rows) * cols;
      for (var x = 0; x < cols; x++) {
        var left = (x - 1 + cols) % cols;
        var right = (x + 1) % cols;
        var neighbours =
          cells[up + left] + cells[up + x] + cells[up + right] +
          cells[row + left] + cells[row + right] +
          cells[down + left] + cells[down + x] + cells[down + right];
        next[row + x] = neighbours === 3 || (neighbours === 2 && cells[row + x]) ? 1 : 0;
      }
    }

    /* same as two generations ago: only still lifes and blinkers are left,
       or nothing at all */
    var settled = true;
    for (var i = 0; i < next.length; i++) {
      if (next[i] !== previous[i]) {
        settled = false;
        break;
      }
    }

    var oldest = previous;
    previous = cells;
    cells = next;
    next = oldest;

    if (settled) {
      seedZones();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, cols * cellPx, rows * cellPx);
    ctx.fillStyle = window.getComputedStyle(canvas).color;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        if (cells[y * cols + x]) {
          ctx.fillRect(x * cellPx + 1, y * cellPx + 1, cellPx - 2, cellPx - 2);
        }
      }
    }
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    if (!running) {
      return;
    }
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  });

  var toggle = document.querySelector("[data-life-toggle]");
  var storageKey = "life-background";
  var running = false;
  var frame = null;
  var last = 0;

  /* requestAnimationFrame pauses by itself when the tab is hidden */
  function tick(now) {
    if (now - last >= stepMs) {
      last = now;
      step();
      draw();
    }
    frame = window.requestAnimationFrame(tick);
  }

  function remember(on) {
    try {
      window.sessionStorage.setItem(storageKey, on ? "on" : "off");
    } catch (e) {
      /* storage unavailable: the choice just won't survive navigation */
    }
  }

  function start() {
    running = true;
    resize();
    cells.fill(0);
    seedZones();
    draw();
    canvas.classList.add("is-on");
    if (!reduceMotion) {
      frame = window.requestAnimationFrame(tick);
    }
  }

  function stop() {
    running = false;
    canvas.classList.remove("is-on");
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  }

  function setRunning(on) {
    if (on) {
      start();
    } else {
      stop();
    }
    if (toggle) {
      var label = on ? "Stop the Game of Life" : "Start a Game of Life";
      toggle.setAttribute("aria-pressed", on ? "true" : "false");
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setRunning(!running);
      remember(running);
    });
  }

  var saved = null;
  try {
    saved = window.sessionStorage.getItem(storageKey);
  } catch (e) {
    /* storage unavailable: start switched off */
  }
  setRunning(saved === "on");
})();
