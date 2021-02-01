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

  const values = new Array(15);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
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
    handle.addEventListener("focus", () => {
      if (!started) {
        oscillator.start();
        started = true;
      }
      oscillator.frequency.value = el.dataset.freqnum;
      gain.gain.value = values[i];
    });
    handle.addEventListener("blur", () => (gain.gain.value = 0));
  });
})();
