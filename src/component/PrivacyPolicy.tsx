import "../Styles/privacyPolicy.css";
import AppBar from "./AppBars/AppBar";
import BottomBar from "./AppBars/BottomBar";

export default function PrivacyPolicy() {
  return (
    <div className="App4">
      <AppBar />
      <div className="privacy-policy">
        <h1>Polityka Prywatności</h1>

        <section>
          <h2>1. Informacje ogólne</h2>
          <p>
            1.1. Niniejsza polityka prywatności określa zasady przetwarzania i
            ochrony danych osobowych użytkowników korzystających z serwisu
            internetowego tworzącego drzewa genealogiczne, dostępnego pod
            adresem <span>[http://localhost:3000/login]</span>.
          </p>
          <p>
            1.2. Administrator danych osobowych, odpowiedzialny za zapewnienie
            zgodności z przepisami o ochronie danych osobowych, to{" "}
            <span>[MyChronicleIndustries]</span>.
          </p>
        </section>

        <section>
          <h2>2. Dane osobowe i cele przetwarzania</h2>
          <p>2.1. Administrator przetwarza dane osobowe użytkowników w celu:</p>
          <ul>
            <li>
              Umożliwienia stworzenia, przechowywania i udostępniania drzewa
              genealogicznego;
            </li>
            <li>
              Zarządzania kontami użytkowników i obsługi technicznej serwisu;
            </li>
            <li>
              Wysyłania informacji na temat zmian w serwisie, aktualizacji
              polityki prywatności, itp.;
            </li>
            <li>Zabezpieczenia serwisu i zapobiegania nadużyciom.</li>
          </ul>
          <p>2.2. Rodzaje zbieranych danych:</p>
          <ul>
            <li>
              Dane identyfikacyjne: imię, nazwisko, data urodzenia, dane
              przodków i krewnych, oraz inne informacje niezbędne do stworzenia
              drzewa genealogicznego;
            </li>
            <li>Dane kontaktowe: adres e-mail;</li>
            <li>
              Dane techniczne: adres IP, identyfikatory sesji, pliki cookies.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Podstawy prawne przetwarzania danych</h2>
          <p>
            3.1. Przetwarzanie danych osobowych odbywa się zgodnie z art. 6
            RODO, na podstawie:
          </p>
          <ul>
            <li>zgody użytkownika na przetwarzanie danych osobowych;</li>
            <li>
              niezbędności do realizacji umowy (utworzenia drzewa
              genealogicznego);
            </li>
            <li>
              uzasadnionego interesu administratora (zapewnienie bezpieczeństwa
              serwisu).
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Udostępnianie i przekazywanie danych</h2>
          <p>
            4.1. Dane osobowe użytkowników nie będą udostępniane podmiotom
            trzecim bez zgody użytkownika, z wyjątkiem przypadków przewidzianych
            prawem.
          </p>
          <p>
            4.2. Administrator może powierzyć przetwarzanie danych osobowych
            podmiotom współpracującym, takim jak dostawcy usług hostingowych,
            podmioty zajmujące się utrzymaniem systemu IT, lub firmy obsługujące
            płatności, na podstawie odpowiednich umów.
          </p>
        </section>

        <section>
          <h2>5. Prawa użytkowników</h2>
          <p>5.1. Użytkownik ma prawo do:</p>
          <ul>
            <li>dostępu do swoich danych oraz ich poprawiania;</li>
            <li>usunięcia danych („prawo do bycia zapomnianym”);</li>
            <li>ograniczenia przetwarzania danych;</li>
            <li>przenoszenia danych;</li>
            <li>sprzeciwu wobec przetwarzania danych;</li>
            <li>
              wniesienia skargi do organu nadzorczego w przypadku naruszenia
              praw.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Okres przechowywania danych</h2>
          <p>
            6.1. Dane osobowe przechowywane są przez okres korzystania z usług
            serwisu oraz przez czas wymagany przepisami prawa lub do momentu
            wycofania zgody przez użytkownika.
          </p>
        </section>

        <section>
          <h2>7. Pliki cookies</h2>
          <p>
            7.1. Serwis wykorzystuje pliki cookies, które pozwalają na
            dostosowanie strony do preferencji użytkowników oraz analizę ruchu
            na stronie.
          </p>
          <p>
            7.2. Użytkownik może zarządzać plikami cookies poprzez ustawienia
            swojej przeglądarki.
          </p>
        </section>

        <section>
          <h2>8. Zmiany w polityce prywatności</h2>
          <p>
            8.1. Administrator zastrzega sobie prawo do wprowadzania zmian w
            polityce prywatności. Informacje o zmianach będą publikowane na
            stronie internetowej.
          </p>
          <p>
            8.2. Zachęcamy użytkowników do regularnego sprawdzania treści
            polityki prywatności w celu zapoznania się z ewentualnymi zmianami.
          </p>
        </section>

        <footer>
          <p>
            <em>
              Niniejsza polityka prywatności obowiązuje od dnia 14.11.2024r.
            </em>
          </p>
        </footer>
      </div>
      <BottomBar />
    </div>
  );
}
