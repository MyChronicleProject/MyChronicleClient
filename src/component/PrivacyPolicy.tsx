import '../Styles/privacyPolicy.css';
import AppBar from '../Component/AppBar';
import BottomBar from '../Component/BottomBar';

export default function PrivacyPolicy() {
    return (
        <div  >
            <AppBar />
        <div className="    privacy-policy" >
            <h1>Polityka Prywatnoœci</h1>

            <section>
                <h2>1. Informacje ogólne</h2>
                <p>
                    1.1. Niniejsza polityka prywatnoœci okreœla zasady przetwarzania i ochrony danych osobowych u¿ytkowników korzystaj¹cych z serwisu internetowego tworz¹cego drzewa genealogiczne, dostêpnego pod adresem <span>[adres strony]</span>.
                </p>
                <p>
                    1.2. Administrator danych osobowych, odpowiedzialny za zapewnienie zgodnoœci z przepisami o ochronie danych osobowych, to <span>[Nazwa firmy, dane kontaktowe, adres]</span>.
                </p>
            </section>

            <section>
                <h2>2. Dane osobowe i cele przetwarzania</h2>
                <p>2.1. Administrator przetwarza dane osobowe u¿ytkowników w celu:</p>
                <ul>
                    <li>Umo¿liwienia stworzenia, przechowywania i udostêpniania drzewa genealogicznego;</li>
                    <li>Zarz¹dzania kontami u¿ytkowników i obs³ugi technicznej serwisu;</li>
                    <li>Wysy³ania informacji na temat zmian w serwisie, aktualizacji polityki prywatnoœci, itp.;</li>
                    <li>Zabezpieczenia serwisu i zapobiegania nadu¿yciom.</li>
                </ul>
                <p>2.2. Rodzaje zbieranych danych:</p>
                <ul>
                    <li>Dane identyfikacyjne: imiê, nazwisko, data urodzenia, dane przodków i krewnych, oraz inne informacje niezbêdne do stworzenia drzewa genealogicznego;</li>
                    <li>Dane kontaktowe: adres e-mail;</li>
                    <li>Dane techniczne: adres IP, identyfikatory sesji, pliki cookies.</li>
                </ul>
            </section>

            <section>
                <h2>3. Podstawy prawne przetwarzania danych</h2>
                <p>3.1. Przetwarzanie danych osobowych odbywa siê zgodnie z art. 6 RODO, na podstawie:</p>
                <ul>
                    <li>zgody u¿ytkownika na przetwarzanie danych osobowych;</li>
                    <li>niezbêdnoœci do realizacji umowy (utworzenia drzewa genealogicznego);</li>
                    <li>uzasadnionego interesu administratora (zapewnienie bezpieczeñstwa serwisu).</li>
                </ul>
            </section>

            <section>
                <h2>4. Udostêpnianie i przekazywanie danych</h2>
                <p>
                    4.1. Dane osobowe u¿ytkowników nie bêd¹ udostêpniane podmiotom trzecim bez zgody u¿ytkownika, z wyj¹tkiem przypadków przewidzianych prawem.
                </p>
                <p>
                    4.2. Administrator mo¿e powierzyæ przetwarzanie danych osobowych podmiotom wspó³pracuj¹cym, takim jak dostawcy us³ug hostingowych, podmioty zajmuj¹ce siê utrzymaniem systemu IT, lub firmy obs³uguj¹ce p³atnoœci, na podstawie odpowiednich umów.
                </p>
            </section>

            <section>
                <h2>5. Prawa u¿ytkowników</h2>
                <p>5.1. U¿ytkownik ma prawo do:</p>
                <ul>
                    <li>dostêpu do swoich danych oraz ich poprawiania;</li>
                    <li>usuniêcia danych („prawo do bycia zapomnianym”);</li>
                    <li>ograniczenia przetwarzania danych;</li>
                    <li>przenoszenia danych;</li>
                    <li>sprzeciwu wobec przetwarzania danych;</li>
                    <li>wniesienia skargi do organu nadzorczego w przypadku naruszenia praw.</li>
                </ul>
            </section>

            <section>
                <h2>6. Okres przechowywania danych</h2>
                <p>
                    6.1. Dane osobowe przechowywane s¹ przez okres korzystania z us³ug serwisu oraz przez czas wymagany przepisami prawa lub do momentu wycofania zgody przez u¿ytkownika.
                </p>
            </section>

            <section>
                <h2>7. Pliki cookies</h2>
                <p>
                    7.1. Serwis wykorzystuje pliki cookies, które pozwalaj¹ na dostosowanie strony do preferencji u¿ytkowników oraz analizê ruchu na stronie.
                </p>
                <p>7.2. U¿ytkownik mo¿e zarz¹dzaæ plikami cookies poprzez ustawienia swojej przegl¹darki.</p>
            </section>

            <section>
                <h2>8. Zmiany w polityce prywatnoœci</h2>
                <p>
                    8.1. Administrator zastrzega sobie prawo do wprowadzania zmian w polityce prywatnoœci. Informacje o zmianach bêd¹ publikowane na stronie internetowej.
                </p>
                <p>
                    8.2. Zachêcamy u¿ytkowników do regularnego sprawdzania treœci polityki prywatnoœci w celu zapoznania siê z ewentualnymi zmianami.
                </p>
            </section>

            <footer>
                <p><em>Niniejsza polityka prywatnoœci obowi¹zuje od dnia 14.11.2024r.</em></p>
            </footer>
            </div>
        <BottomBar/>
        </div>
    )
}