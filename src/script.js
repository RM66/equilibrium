(() => {
  const configDialog = document.querySelector("dialog");
  const configInput = configDialog.querySelector("input");

  configDialog
    .getElementsByClassName("suggestions")[0]
    .addEventListener("click", (e) => (configInput.value = e.target.text));

  configDialog
    .querySelector("button[type=reset]")
    .addEventListener("click", () => configDialog.close());

  configDialog
    .querySelector("button[type=submit]")
    .addEventListener("click", () => {
      init(parseFreqsString(configInput.value));
      configDialog.close();
    });

  // returns array of [title, value]
  function parseFreqsString(str) {
    const arr = str.split(/\s+/);
    return arr.reduce((acc, curr) => {
      let value = parseFloat(curr);
      if (!isNaN(value)) {
        if (curr.includes("k") || curr.includes("к")) {
          value *= 1000;
        }
        const title = value > 1000 ? `${value / 1000} kHz` : `${value} Hz`;
        acc.push([title, value]);
      }
      return acc;
    }, []);
  }

  const slidersRoot = document.getElementById("sliders");

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

  let sliders, handles, values;
  let selected = -1;
  let started = false;

  function init(freqsSet) {
    slidersRoot.innerHTML = "";
    sliders = [];
    handles = [];
    values = new Array(freqsSet.length);

    freqsSet.forEach(([title, value], i) => {
      const el = document.createElement("div");
      el.className = "band";
      el.dataset.title = title;
      el.dataset.value = value;
      slidersRoot.appendChild(el);

      const slider = noUiSlider.create(el, options);
      slider.on("update", ([db]) => {
        const vol = Math.pow(10, (db - 12) / 20);
        gain.gain.value = values[i] = vol;
      });
      sliders.push(slider);

      const handle = slider.target.getElementsByClassName("noUi-handle")[0];
      handle.addEventListener("focus", () => {
        if (!started) {
          oscillator.start();
          started = true;
        }
        oscillator.frequency.value = el.dataset.value;
        gain.gain.value = values[i];
        selected = i;
      });
      handle.addEventListener("touchend", function () {
        this.focus();
      });
      handle.addEventListener("blur", () => {
        stop();
      });
      handles.push(handle);
    });
  }

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  function stop() {
    gain.gain.value = 0;
    selected = -1;
  }

  document.getElementById("configure").addEventListener("click", () => {
    stop();
    configDialog.showModal();
  });

  document.getElementById("reset").addEventListener("click", () => {
    stop();
    sliders.forEach((x) => x.reset());
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

  configDialog.showModal();
})();
