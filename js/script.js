
let lunghezzaCanvas = document.getElementById("areaSimulazione").clientHeight;
let larghezzaCanvas = document.getElementById("areaSimulazione").clientWidth;



function resizeArea() {
  lunghezzaCanvas = document.getElementById("areaSimulazione").clientHeight;
  larghezzaCanvas = document.getElementById("areaSimulazione").clientWidth;
  suoloY = lunghezzaCanvas - raggioNavicella
  x = ProporzioneOrizzontale * larghezzaCanvas;
  y = ProporzioneVerticale * lunghezzaCanvas;
  suoloY = lunghezzaCanvas - raggioNavicella;

  if (y > suoloY) y = suoloY;

  navicella.style.top = `${y}px`;
  navicella.style.left = x + "px";

}

const raggioNavicella = document.getElementById("navicella").clientWidth / 2;

const velocitaOrizzontale = 5;
const G = 6.674e-11;
const mLuna = 7.348e22;
const rLuna = 1.737e6;
const maxLandingV = 5;
const consumoPerTick = 0; //0.8
const moltiplicatoreVisivo = 10;
const maxThrust = 6;
const k = 2.5;
const altMax = 500000;
let suoloY = lunghezzaCanvas - raggioNavicella;
const altitudineSicura = 0; // Altitudine target per un atterraggio perfetto

const form = document.getElementById("inputForm");
const navicella = document.getElementById("navicella");
const statoEl = document.getElementById("stato");
const velEl = document.getElementById("teleVel");
const altEl = document.getElementById("teleAlt");
const fuelEl = document.getElementById("teleFuel");
const btnPropulsoreSinistra = document.getElementById("btnPropulsoreSinistra");
const btnPropulsoreRallenta = document.getElementById("btnPropulsoreRallenta");
const btnPropulsoreDestra = document.getElementById("btnPropulsoreDestra");
const btnPropulsoreAccelera = document.getElementById("btnPropulsoreAccelera");


let dt = 0.05;
let v = 0;
let y = 0;
let x = lunghezzaCanvas / 2;
let ProporzioneOrizzontale = x / larghezzaCanvas;
let ProporzioneVerticale = y / lunghezzaCanvas;

let fuel = 100;
let rallenta = false;
let accellera = false;
let tempoPressione = 0;
let atterrato = false;
let spostaSinistra = false;
let spostaDestra = false;

let intervallo;

btnPropulsoreSinistra.addEventListener("mousedown", () => spostaSinistra = true);
btnPropulsoreSinistra.addEventListener("mouseup", () => spostaSinistra = false);
btnPropulsoreSinistra.addEventListener("touchstart", () => spostaSinistra = true);
btnPropulsoreSinistra.addEventListener("touchend", () => spostaSinistra = false);

btnPropulsoreDestra.addEventListener("mousedown", () => spostaDestra = true);
btnPropulsoreDestra.addEventListener("mouseup", () => spostaDestra = false);
btnPropulsoreDestra.addEventListener("touchstart", () => spostaDestra = true);
btnPropulsoreDestra.addEventListener("touchend", () => spostaDestra = false);

btnPropulsoreRallenta.addEventListener("mousedown", () => rallenta = true);
btnPropulsoreRallenta.addEventListener("mouseup", () => rallenta = false);
btnPropulsoreRallenta.addEventListener("touchstart", () => rallenta = true);
btnPropulsoreRallenta.addEventListener("touchend", () => rallenta = false);

btnPropulsoreAccelera.addEventListener("mousedown", () => accellera = true);
btnPropulsoreAccelera.addEventListener("mouseup", () => accellera = false);
btnPropulsoreAccelera.addEventListener("touchstart", () => accellera = true);
btnPropulsoreAccelera.addEventListener("touchend", () => accellera = false);

document.addEventListener("keydown", (e) => {
  document.getElementById("prova").textContent = "premuto: " + e.key.toLowerCase();

  switch (e.key.toLowerCase()) {
    case "w":
      rallenta = true;
      break;
    case "s":
      accellera = true;
      break;
    case "a":
      spostaSinistra = true;
      break;
    case "d":
      spostaDestra = true;
      break;
  }
});
document.addEventListener("keyup", (e) => {

  document.getElementById("prova").textContent = "rilasciato: " + e.key.toLowerCase();
  switch (e.key.toLowerCase()) {
    case "w":
      rallenta = false;
      break;
    case "s":
      accellera = false;
      break;
    case "a":
      spostaSinistra = false;
      break;
    case "d":
      spostaDestra = false;
      break;
  }

});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  resetSimulazione();

  v = parseFloat(document.getElementById("velocita").value);
  x = Math.random() * (larghezzaCanvas - raggioNavicella) + raggioNavicella;
  y = 0;
  fuel = 100;
  tempoPressione = 0;
  atterrato = false;
  navicella.style.top = y + "px";
  statoEl.textContent = "Simulazione in corso...";

  intervallo = setInterval(() => {
    const altitudine = ((suoloY - y) / suoloY) * altMax;
    const altitudineReale = Math.max(0, altitudine); // blocco sotto zero
    const r = rLuna + altitudineReale;

    const g = G * mLuna / (r * r);

    let acc = g;

    
    if (rallenta && fuel > 0) {
      tempoPressione += dt;
      const thrust = maxThrust * (1 - Math.exp(-k * tempoPressione));
      acc -= thrust;
      fuel = Math.max(0, fuel - consumoPerTick);
    } else if (accellera && fuel > 0) {
      tempoPressione += dt;
      const thrust = maxThrust * (1 - Math.exp(-k * tempoPressione));
      acc += thrust;
      fuel = Math.max(0, fuel - consumoPerTick);
    } else {
      tempoPressione = 0;
    }

    if (spostaSinistra && x >= raggioNavicella) {
      x -= Math.abs(velocitaOrizzontale) * dt * moltiplicatoreVisivo;
      ProporzioneOrizzontale = x / larghezzaCanvas;
    }


    if (spostaDestra && x <= larghezzaCanvas - raggioNavicella) {
      x += Math.abs(velocitaOrizzontale) * dt * moltiplicatoreVisivo;
      ProporzioneOrizzontale = x / larghezzaCanvas;
    }

    v += acc * dt;
    y += v * dt * moltiplicatoreVisivo;
    ProporzioneVerticale = y / lunghezzaCanvas;

    if (y <= -raggioNavicella * 2) {
      y = -raggioNavicella * 2;
      v = 0;
    }

    navicella.style.top = `${Math.min(y, suoloY)}px`;
    navicella.style.left = x + "px";
    velEl.textContent = v.toFixed(2);
    altEl.textContent = altitudineReale.toFixed(0);
    fuelEl.textContent = fuel.toFixed(0);

    if (altitudineReale <= altitudineSicura && !atterrato) {
      clearInterval(intervallo);
      atterrato = true;

      if (x >= ((larghezzaCanvas / 2) - 10) && x <= ((larghezzaCanvas / 2) + 10)) {
        if (v <= maxLandingV) {
          statoEl.textContent = "Atterraggio riuscito!";
        } else {
          statoEl.textContent = "Crash! Troppa velocità.";
        }
      } else {
        statoEl.textContent = "Fuori Area.";
      }

    }
  }, dt * 1000);
});

function resetSimulazione() {
  clearInterval(intervallo);
  v = 0;
  y = 0;
  x = larghezzaCanvas / 2;
  fuel = 100;
  rallenta = false;
  accellera = false;
  tempoPressione = 0;
  statoEl.textContent = "In attesa...";
  navicella.style.top = "0px";
}