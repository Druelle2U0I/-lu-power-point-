# ENMA Formation – Fonctions de l'élu

Supports de la formation « Formation des élus municipaux 2026 – Bien débuter son mandat municipal » (7 h, 1 journée).

## Supports prêts à l'emploi (`supports/`)

| Fichier | Contenu |
| --- | --- |
| `ENMA_Formation_Fonctions_de_l_elu_2026.pptx` | Support PowerPoint, 64 diapositives, avec notes formateur |
| `ENMA_Formation_Fonctions_de_l_elu_2026.pdf` | Même support au format PDF |
| `ENMA_Formation_Mises_en_situation_elus_2026.pdf` | Recueil des 16 mises en situation, corrigé express et grille de compétences |

Structure du PowerPoint :

- 00 Ouverture et déroulé de la journée
- 01 Le rôle du Maire
- 02 Adjoints, conseillers délégués, conseillers et opposition
- 03 La gestion des agents municipaux
- 04 Droits, devoirs et responsabilités des élus
- 05 EPCI, Département, Région Hauts-de-France, État
- 06 Relations avec les habitants, exemplarité et conflits d'intérêts
- 07 Conclusion
- 08 Mises en situation et retours d'expérience (bilan, évolutions du programme, amélioration continue)

Les chiffres et verbatims de la section 08 sont illustratifs : à remplacer par les résultats réels des grilles d'observation.

## Régénérer le PowerPoint (`generateur/`)

Le PowerPoint est produit par un script Node.js ; les illustrations sont dessinées en SVG dans `illus.js` et `illus2.js`.

```bash
cd generateur
npm install
npm run build   # écrit supports/ENMA_Formation_Fonctions_de_l_elu_2026.pptx
```

Charte ENMA Formation : marine `#0B032B`, crème `#FFF9C7`, logos dans `generateur/assets/`.
