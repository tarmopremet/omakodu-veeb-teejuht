import { RendiIseHeader } from "@/components/RendiIseHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <RendiIseHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Kasutajatingimused
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Üldised tingimused</h3>
              <p className="mb-3">
                Need kasutajatingimused reguleerivad rendiettevõtte teenuste kasutamist. 
                Teenuse kasutades nõustute kõigi allpool toodud tingimustega.
              </p>
              <p>
                Ettevõte jätab endale õiguse muuta kasutajatingimusi etteteatamisega 
                vähemalt 7 päeva ette.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Broneerimise tingimused</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Broneering tuleb teha vähemalt 24 tundi ette</li>
                <li>Broneeringu kinnitamiseks on vajalik ettemaks 30% kogusummast</li>
                <li>Broneeringu tühistamine tasuta on võimalik kuni 48 tundi enne</li>
                <li>Hilisema tühistamise korral ettemaksu ei tagastata</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Seadmete kasutamine</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Seadmeid tuleb kasutada vastavalt kasutusjuhendile</li>
                <li>Kasutaja vastutab seadme korrasoleku eest rendiperidol</li>
                <li>Kahjustuste korral tasub kasutaja paranduskulud</li>
                <li>Seadme kaotamisel tasub kasutaja selle täisväärtuse</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Vastutuse piiramine</h3>
              <p className="mb-3">
                Ettevõte ei vastuta kaudsete kahjude eest, mis võivad tekkida 
                seadmete kasutamisel. Kasutaja vastutab kolmandatele isikutele 
                tekitatud kahjude eest.
              </p>
              <p>
                Ettevõtte vastutus on piiratud rendisumma suurusega.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Andmekaitse</h3>
              <p className="mb-3">
                Ettevõte töötleb isikuandmeid vastavalt kehtivale andmekaitse 
                seadusandlusele. Andmeid kasutatakse ainult teenuse osutamiseks.
              </p>
              <p>
                Kasutajal on õigus nõuda oma andmete kustutamist või muutmist.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Vaidluste lahendamine</h3>
              <p className="mb-3">
                Vaidlused lahendatakse läbirääkimiste teel. Kokkuleppe mitteleidmisel 
                lahendatakse vaidlused Eesti Vabariigi kohtutes.
              </p>
              <p>
                Kohaldatakse Eesti Vabariigi seadusandlust.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Kontaktandmed</h3>
              <p>
                Küsimuste korral võtke meiega ühendust:
                <br />
                E-mail: info@rendiseadmed.ee
                <br />
                Telefon: +372 123 4567
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};