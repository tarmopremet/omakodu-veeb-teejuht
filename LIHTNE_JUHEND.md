# LIHTNE JUHEND - Kuidas panna leht zone.ee-sse

## SAMM 1: Lae alla projekt
1. Mine siia: https://github.com/[sinu-kasutajanimi]/[projekti-nimi] 
2. Vajuta rohelist "Code" nuppu
3. Vali "Download ZIP"
4. Paki ZIP lahti oma arvutisse

## SAMM 2: Tee leht valmis
1. Ava cmd/terminal
2. Mine projekti kausta: `cd [kausta-nimi]`
3. Kirjuta: `npm install` (oota kuni valmis)
4. Kirjuta: `npm run build` (oota kuni valmis)
5. Nüüd on sul "dist" kaust valmis

## SAMM 3: Lae zone.ee-sse üles
1. Mine zone.ee kontopaneeli
2. Vali "Failihaldur" 
3. Mine "public_html" kausta
4. **KUSTUTA kõik mis seal on**
5. **Lae üles KÕIK failid "dist" kaustast**
   - Lohista kõik failid dist kaustast otse public_html kausta
   - MITTE dist kaust ise, vaid kõik mis on dist kaustas sees

## SAMM 4: Kontrolli
- Mine oma domeenile
- Leht peaks töötama

## KUI MIDAGI EI TÖÖTA:
- Kontrolli kas kõik failid said üles laetud
- Kontrolli kas index.html on public_html kaustas (mitte alamkaustas)

See on kõik!