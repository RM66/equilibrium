(()=>{const e=Array.from(document.getElementById("sliders").children),t={connect:"lower",direction:"rtl",orientation:"vertical",pips:{mode:"steps",density:2},range:{min:-12,max:12},start:0,step:1,tooltips:!0},n=new(window.AudioContext||window.webkitAudioContext),o=n.createOscillator(),a=n.createGain(),r=new Array(e.length),i=new Array(e.length);let s=-1,d=!1;o.connect(a),a.connect(n.destination),e.forEach(((e,n)=>{noUiSlider.create(e,t),e.noUiSlider.on("update",(([e])=>{const t=Math.pow(10,(e-12)/20);a.gain.value=i[n]=t}));const l=e.noUiSlider.target.getElementsByClassName("noUi-handle")[0];r[n]=l,l.addEventListener("focus",(()=>{d||(o.start(),d=!0),o.frequency.value=e.dataset.freqnum,a.gain.value=i[n],s=n})),l.addEventListener("blur",(()=>{a.gain.value=0,s=-1}))})),window.addEventListener("keydown",(t=>{"Escape"===t.key?r[s].blur():"ArrowRight"===t.key?(t.stopPropagation(),s<e.length-1&&(s++,r[s].focus())):"ArrowLeft"===t.key&&(t.stopPropagation(),s>0&&(s--,r[s].focus()))}),{capture:!0})})();