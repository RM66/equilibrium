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

  sliders.forEach((el, i) => {
    noUiSlider.create(el, options);

    el.noUiSlider.on("update", ([val]) => {
      console.log("value, index", +val, i);
    });
  });
})();
