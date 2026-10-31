# Schulwegweiser · Wirtschaftsschule Gunzenhausen

3D-Modell mit Raumwahl, blauer Wegführung, Lehrkräfte-Probezuordnung und 360°-Tour.

Die Website wird über GitHub Pages aus main / root veröffentlicht. Die Modelldaten und Anwendungsdateien liegen ausschließlich verschlüsselt in content-*.bin. Das Kennwort wird getrennt weitergegeben und ist nicht im Repository enthalten.

Verschlüsselung: AES-256-GCM, PBKDF2-SHA256 mit 600.000 Iterationen und zufälligem Salt/IV. Nach erfolgreicher Eingabe werden Dateien lokal im Browsercache entschlüsselt; „Sperren“ löscht diesen Cache. Wer das Kennwort kennt, kann Inhalte ansehen und speichern.

Zum Aktualisieren build_github_encrypted.mjs mit Node.js ausführen (lokaler Quellordner work/polycam-site/dist), danach erzeugte Veröffentlichungsdateien ersetzen. Das private Zugangsdokument niemals hochladen.
