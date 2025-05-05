# QR Code Generator Web App

Une application web permettant de générer des QR codes à partir d'une URL, d'un texte ou d'un fichier image (JPEG, SVG).

## Fonctionnalités

- Génération de QR codes personnalisables (format : SVG, PNG ou TXT, couleur d'arrière-plan, etc.)
- Téléchargement ou affichage immédiat du QR code généré
- Génération d'un PDF contenant plusieurs QR codes pour impression, avec options de taille
- Historique local des contenus déjà utilisés par utilisateur, stocké via `localStorage`

## Technologies utilisées

- [qrcode (npm)](https://www.npmjs.com/package/qrcode) pour la génération de QR codes
- [jspdf (npm)](https://www.npmjs.com/package/jspdf) pour la création de fichiers PDF
