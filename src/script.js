(() => {
  const sliders = Array.from(document.getElementById("sliders").children);

  const options = {
    connect: "lower",
    direction: "rtl",
    orientation: "vertical",
    pips: {
      mode: "steps",
      density: 2,
    },
    range: {
      min: -12,
      max: 12,
    },
    start: 0,
    step: 1,
    tooltips: true,
  };

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const handles = new Array(sliders.length);
  const values = new Array(sliders.length);
  let selected = -1;
  let started = false;

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  sliders.forEach((el, i) => {
    noUiSlider.create(el, options);

    el.noUiSlider.on("update", ([db]) => {
      const vol = Math.pow(10, (db - 12) / 20);
      gain.gain.value = values[i] = vol;
    });

    const handle = el.noUiSlider.target.getElementsByClassName(
      "noUi-handle"
    )[0];
    handles[i] = handle;
    handle.addEventListener("focus", () => {
      if (!started) {
        oscillator.start();
        started = true;
      }
      oscillator.frequency.value = el.dataset.freqnum;
      gain.gain.value = values[i];
      selected = i;
    });
    handle.addEventListener("blur", () => {
      gain.gain.value = 0;
      selected = -1;
    });
  });

  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        handles[selected].blur();
      } else if (e.key === "ArrowRight") {
        e.stopPropagation();
        if (selected < sliders.length - 1) {
          selected++;
          handles[selected].focus();
        }
      } else if (e.key === "ArrowLeft") {
        e.stopPropagation();
        if (selected > 0) {
          selected--;
          handles[selected].focus();
        }
      }
    },
    { capture: true }
  );
})();
