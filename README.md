# 🐔 El Pollo Loco

Ein 2D-Jump'n'Run-Browsergame, entwickelt in **Vanilla JavaScript** mit der HTML5-Canvas-API. Das Spiel entstand im Rahmen der Ausbildung bei der **Developer Akademie**.

Der Spieler steuert einen Charakter durch eine karge Wüstenlandschaft, sammelt Münzen und Flaschen, kämpft gegen kleine und normale Hühner und stellt sich am Ende einem mächtigen Endboss-Huhn.

## 🎮 Spielprinzip

- Bewege den Charakter nach links/rechts und springe über Hindernisse und Gegner
- Sammle **Münzen** und **Flaschen**, die auf der Karte verteilt sind
- Wirf gesammelte Flaschen auf Hühner, um sie zu besiegen
- Achte auf deine **Lebensanzeige** – Kontakt mit Gegnern kostet Energie
- Besiege den **Endboss** am Ende des Levels, um zu gewinnen

## 🛠️ Technologien

- **HTML5** (Canvas API)
- **CSS3**
- **Vanilla JavaScript** (objektorientiert, keine Frameworks)

## 📁 Projektstruktur

```
El-Pollo-Loco/
├── audio/          # Sound- und Musikdateien
├── img/            # Sprites, Hintergründe, UI-Grafiken
├── js/             # Spiellogik (Klassen, Level, Steuerung)
├── levels/         # Level-Definitionen
├── models/         # Spielobjekt-Klassen (Charakter, Gegner, etc.)
├── index.html      # Einstiegspunkt
└── style.css       # Layout & Styling
```

## 🚀 Installation & Start

Da es sich um ein reines Frontend-Projekt ohne Build-Prozess handelt, reicht es, das Repository lokal zu öffnen:

```bash
git clone https://github.com/NilsNeu1/El-Pollo-Loco.git
cd El-Pollo-Loco
```

Danach einfach die `index.html` im Browser öffnen – am besten über einen lokalen Live-Server (z. B. die VS-Code-Erweiterung **Live Server**), damit Assets korrekt geladen werden.

## 🎯 Steuerung

| Taste       | Aktion         |
|-------------|----------------|
| `→` / `←`   | Laufen         |
| `Leertaste` | Springen       |
| `D`         | Flasche werfen |

*(Steuerung ggf. anpassen, falls im Code anders belegt.)*

## 📱 Responsive

Das Spiel unterstützt auch mobile Endgeräte über Touch-Buttons für Bewegung, Sprung und Wurf.

## 👤 Autor

**Nils Neumann** – im Rahmen der Ausbildung zum Frontend-Entwickler

## 📄 Lizenz

Dieses Projekt wurde zu Lern- und Ausbildungszwecken erstellt.
