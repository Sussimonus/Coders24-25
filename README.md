# Coders24-25

# ANALISI – Project Work: Simulazione di Allunaggio

## 1. Obiettivo del Progetto

L’obiettivo del progetto è simulare in un’applicazione Web l’allunaggio di una navicella spaziale sul suolo lunare, garantendo la sicurezza dell’atterraggio attraverso il controllo della massa, della velocità di discesa, della gravità lunare e della posizione rispetto al punto d’atterraggio.  
L’interfaccia permetterà all’utente di inserire i dati iniziali e avviare la simulazione, osservando il movimento della navetta e ricevendo un esito (“Atterraggio riuscito” o “Crash”).

---

## 2. Dati Utilizzati

| Dato                         | Descrizione                                                       |
|------------------------------|-------------------------------------------------------------------|
| Massa navetta (massa)        | Inserita liberamente dall’utente tramite input                    |
| Velocità iniziale (velIn)    | Inserita liberamente dall’utente tramite input                    |
| Gravità lunare (gL)          | Costante: 1.66 m/s²                                               |
| Costante di gravitazione G   | 6.674 × 10⁻¹¹ (N·m²)/kg²                                          |
| Posizione iniziale           | Navetta posizionata in alto (es: y = 0)                           |
| Punto di atterraggio         | Coordinata predefinita in basso (es: y = 400)                     |
| Accelerazione                | Calcolata con: a = gL                                             |
| Velocità finale              | v = v₀ + a * t                                                    |
| Posizione verticale          | y = y₀ + v₀ * t + 0.5 * a * t²                                    |
| Tempo                        | Incrementato frame per frame nella simulazione                   |
| Tolleranza di atterraggio    | Se velocità e posizione sono accettabili, il lander atterra in sicurezza |

---

## 3. Strategia di Implementazione

L’interfaccia sarà sviluppata in **HTML**, composta da:
- Campi di input per massa e velocità iniziale
- Pulsante per avviare la simulazione
- Div grafico per visualizzare il movimento della navetta
- Area di stato per mostrare tempo, velocità, altezza, risultato

I movimenti della navetta saranno simulati in **JavaScript**, aggiornando le variabili fisiche ad ogni frame con `setInterval()`.

Si gestirà la collisione col suolo e si verificherà se l’atterraggio è avvenuto in sicurezza.


# Manuale Utente – Simulazione di Allunaggio

## Avvio

1. Inserire la **massa della navetta** (in kg)
2. Inserire la **velocità iniziale di discesa** (in m/s)
3. Cliccare su **Avvia Simulazione**

---

## Controlli

- **Tasto W** o clic su **“Rallenta atterraggio”** → accende i motori per frenare la caduta
- **Tasto S** o clic su **“Accelera atterraggio”** → accende i motori per velocizzare la caduta
- Rilasciare il tasto o bottone → spegne i motori
- I motori consumano carburante e frenano la discesa
---
- **Tasto A** o clic su **“Muovi a sinistra”** → sposta la navicella a sinistra
- **Tasto D** o clic su **“Muovi a destra** → sposta la navicella a destra
- Questi spostamenti non consumano carburante
- Servono a spostare la navicella sul punto di atterraggio dopo la sua comparsa in un punto casuale
---

## Obiettivo

Atterrare sul suolo lunare **senza superare i 5 m/s di velocità verticale**.  
La navetta atterra automaticamente quando l’altitudine raggiunge 0 metri.

---

## Stato finale

-   **Atterraggio riuscito!** → se la velocità ≤ 5 m/s  
-   **Crash! Troppa velocità.** → se la velocità > 5 m/s
-   **Fuori Area** → se non si atterra nella zona sicura

---

## Note tecniche

- Gravità calcolata dinamicamente in base alla quota
- La navetta non può andare sotto lo 0 (nessuna altitudine negativa)
- L’interfaccia mostra sempre i valori di:
  - Velocità attuale
  - Altitudine
  - Carburante residuo
