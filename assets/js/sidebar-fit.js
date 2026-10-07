/*
 * Keeps every text of the sidebar on a single line: an entry that does not
 * fit in the sidebar's width is hidden rather than wrapped onto a second line.
 * The check is redone when the window is resized and once the web fonts are
 * loaded, since both change the width of the text.
 * The hiding class is styled in _sass/_sidebar.scss.
 */
(function () {
  "use strict";

  var selector = ".sidebar .author__name, .sidebar .author__pronouns, " +
                 ".sidebar .author__bio, .sidebar .author__urls li";
  var hiddenClass = "sidebar__too-long";

  function fit() {
    var items = document.querySelectorAll(selector);
    var i, el;
    // show everything and forbid wrapping, so the true width can be measured
    for (i = 0; i < items.length; i++) {
      items[i].classList.remove(hiddenClass);
      items[i].style.whiteSpace = "nowrap";
    }
    for (i = 0; i < items.length; i++) {
      el = items[i];
      // clientWidth is 0 while the element is not displayed (e.g. the
      // mobile "Follow" menu is closed): nothing to decide then
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1) {
        el.classList.add(hiddenClass);
      }
    }
  }

  var pending = null;
  function scheduleFit() {
    if (pending === null) {
      pending = window.requestAnimationFrame(function () {
        pending = null;
        fit();
      });
    }
  }

  fit();
  window.addEventListener("resize", scheduleFit);
  window.addEventListener("load", scheduleFit);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFit);
  }
})();
