# Turistický krúžok – Azure projekt

Základ projektu pre Azure Static Web Apps.

## Obsah
- `/` – verejný web krúžku (z posledného návrhu verejného webu)
- `/pas/` – turistický pas (index-8, posledná vizuálne doladená verzia)
- `/admin/` – admin rozhranie (index-18)
- `/checkin/?token=...` – vstup z QR kódu
- `/api/health` – test API
- `/api/me` – test identity prihláseného používateľa

## Databáza
Projekt je pripravený na napojenie na existujúce SharePoint Lists:
`Ziaci`, `Vylety`, `Ucast`, `Kvizy`, `KvizOtazky`, `KvizVysledky`, `BonusyZiakov`, `Odznaky`, `ZiaciOdznaky`.

SharePoint site:
`https://zsnrudno.sharepoint.com/sites/Turistickykruzok`

## Stav
Frontend je zostavený a routy pre pas/admin/check-in sú chránené prihlásením.
Dáta v pase a admine sú zatiaľ ukážkové – ďalší krok je Graph/SharePoint API.

## Dôležité k Entra
Predkonfigurovaný Microsoft Entra provider v Azure Static Web Apps umožňuje prihlásenie Microsoft účtov všeobecne. Pre ostrú školskú prevádzku chceme single-tenant prihlásenie `zsnrudno.sk`; podľa aktuálnej dokumentácie Azure Static Web Apps to vyžaduje vlastnú registráciu Entra providera (custom authentication), ktorá je dostupná v Standard pláne. Do produkcie preto pas/admin nepovažovať za tenantovo uzamknuté, kým túto časť nenastavíme.

## API a SharePoint
Managed Azure Functions sú vhodné na prvé API, ale nemajú managed identity. Pre produkčné Graph pripojenie s least-privilege `Sites.Selected`/Selected permissions je pripravená architektúra na neskorší prechod na vlastnú Azure Function (BYO API), ak zvolíme managed identity. BYO API je podľa aktuálnej dokumentácie SWA dostupné v Standard pláne.

## Lokálne spustenie
Vyžaduje Node.js a Azure Static Web Apps CLI.

```powershell
npm install
cd api
npm install
cd ..
npm start
```

Lokálny emulátor typicky otvorí `http://localhost:4280`.

## Nasadenie
Najjednoduchšie je vytvoriť Azure Static Web App z GitHub repozitára a nastaviť:
- App location: `/`
- API location: `api`
- Output location: prázdne

GitHub workflow následne vytvorí Azure automaticky.
