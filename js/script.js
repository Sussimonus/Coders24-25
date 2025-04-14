
    let lunghezzaCanvas = document.getElementById("areaSimulazione").clientHeight;
    let larghezzaCanvas = document.getElementById("areaSimulazione").clientWidth;
    


    function resizeArea()
    {
        lunghezzaCanvas = document.getElementById("areaSimulazione").clientHeight;
        larghezzaCanvas = document.getElementById("areaSimulazione").clientWidth;
        suoloY = lunghezzaCanvas - raggioNavicella
        x = ProporzioneOrizzontale * larghezzaCanvas;
        y = ProporzioneVerticale * lunghezzaCanvas;
    }

    const raggioNavicella = document.getElementById("navicella").clientWidth / 2;

    const velocitaOrizzontale = 5;
    const G = 6.674e-11;
    const mLuna = 7.348e22;
    const rLuna = 1.737e6;
    const maxLandingV = 5;
    const consumoPerTick = 0.8;
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
    const btnPropulsore = document.getElementById("btnPropulsore");

    let dt = 0.05;
    let v = 0;
    let y = 0;
    let x = lunghezzaCanvas /2;
    let ProporzioneOrizzontale = x / larghezzaCanvas;
    let ProporzioneVerticale = y / lunghezzaCanvas;

    let fuel = 100;
    let spinta = false;
    let tempoPressione = 0;
    let atterrato = false;
    let spostaSinistra = false;
    let spostaDestra = false;

    let intervallo;

    btnPropulsore.addEventListener("mousedown", () => spinta = true);
    btnPropulsore.addEventListener("mouseup", () => spinta = false);
    btnPropulsore.addEventListener("touchstart", () => spinta = true);
    btnPropulsore.addEventListener("touchend", () => spinta = false);

    document.addEventListener("keydown", (e) => {
      if (e.key === "w"|| e.key == "w") spinta = true;
      switch(e.key)
      {
        case "ArrowLeft":
            spostaSinistra = true;
            break;
            case "ArrowRight":
            spostaDestra = true;
            break;
      }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "w"|| e.key == "w") spinta = false;
        switch(e.key)
        {
          case "ArrowLeft":
              spostaSinistra = false;
              break;
              case "ArrowRight":
              spostaDestra = false;
              break;
        }

    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      resetSimulazione();

      v = parseFloat(document.getElementById("velocita").value);
      x = Math.random() * (larghezzaCanvas - raggioNavicella)  + raggioNavicella;
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

        if (spinta && fuel > 0) {
          tempoPressione += dt;
          const thrust = maxThrust * (1 - Math.exp(-k * tempoPressione));
          acc -= thrust;
          fuel = Math.max(0, fuel - consumoPerTick);
        } else {
          tempoPressione = 0;
        }

        if(spostaSinistra && x>= raggioNavicella)
        {
            x -= Math.abs(velocitaOrizzontale) * dt * moltiplicatoreVisivo;
            ProporzioneOrizzontale = x / larghezzaCanvas;
        }

        
        if(spostaDestra && x<= larghezzaCanvas - raggioNavicella)
            {
                x += Math.abs(velocitaOrizzontale) * dt * moltiplicatoreVisivo;
                ProporzioneOrizzontale = x / larghezzaCanvas;
            }

        v += acc * dt;
        y += v * dt * moltiplicatoreVisivo;
        ProporzioneVerticale = y / lunghezzaCanvas;

        if(y <= -raggioNavicella*2)
        {
            y = -raggioNavicella*2;
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

          if(x >= ((larghezzaCanvas / 2) - 10) && x <= ((larghezzaCanvas / 2) + 10))
          {
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
      x = larghezzaCanvas /2;
      fuel = 100;
      spinta = false;
      tempoPressione = 0;
      statoEl.textContent = "In attesa...";
      navicella.style.top = "0px";
    }