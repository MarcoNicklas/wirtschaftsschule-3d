# Schulwegweiser · Wirtschaftsschule Gunzenhausen

Öffentliche Website ohne Passwort mit Startseite, 3D-Schulmodell, Raumauswahl,
Wegführung in Etappen und verlinkter 360°-Tour.

Die Luftansicht ist eine Illustration. Der Wegweiser zeigt am Elternsprechtag
die veröffentlichte Raumbelegung mit den angegebenen Zeitfenstern. Bei Räumen
der Berufsschule nennt er den Eingang und die Raumnummer; wo die Lage im
Modell ungeklärt ist, erscheint die Raumangabe ohne 3D-Route.

## Veröffentlichung

`public-site.zip` enthält ausschließlich die öffentliche Website. Der Workflow
`.github/workflows/pages.yml` entpackt dieses Archiv und veröffentlicht es über
GitHub Pages. In den Repository-Einstellungen muss Pages als Quelle
„GitHub Actions“ verwenden.

Das Archiv wird lokal mit `build_public.py` aus den aktuellen Anwendungsdateien
erstellt. Originalscans, Fotoquellen, Fluchtplan-Bilder, interne Prüfberichte,
Kennwortunterlagen und frühere verschlüsselte Pakete gehören nicht dazu.
Die Dateien `sw.js`, `lock.js` und `unlock.js` dienen nur dem automatischen
Umstieg früherer Besucher auf die öffentliche Fassung.
