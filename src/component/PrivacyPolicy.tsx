import '../Styles/privacyPolicy.css';
import AppBar from '../Component/AppBar';
import BottomBar from '../Component/BottomBar';

export default function PrivacyPolicy() {
    return (
        <div  >
            <AppBar />
        <div className="    privacy-policy" >
            <h1>Polityka Prywatno�ci</h1>

            <section>
                <h2>1. Informacje og�lne</h2>
                <p>
                    1.1. Niniejsza polityka prywatno�ci okre�la zasady przetwarzania i ochrony danych osobowych u�ytkownik�w korzystaj�cych z serwisu internetowego tworz�cego drzewa genealogiczne, dost�pnego pod adresem <span>[adres strony]</span>.
                </p>
                <p>
                    1.2. Administrator danych osobowych, odpowiedzialny za zapewnienie zgodno�ci z przepisami o ochronie danych osobowych, to <span>[Nazwa firmy, dane kontaktowe, adres]</span>.
                </p>
            </section>

            <section>
                <h2>2. Dane osobowe i cele przetwarzania</h2>
                <p>2.1. Administrator przetwarza dane osobowe u�ytkownik�w w celu:</p>
                <ul>
                    <li>Umo�liwienia stworzenia, przechowywania i udost�pniania drzewa genealogicznego;</li>
                    <li>Zarz�dzania kontami u�ytkownik�w i obs�ugi technicznej serwisu;</li>
                    <li>Wysy�ania informacji na temat zmian w serwisie, aktualizacji polityki prywatno�ci, itp.;</li>
                    <li>Zabezpieczenia serwisu i zapobiegania nadu�yciom.</li>
                </ul>
                <p>2.2. Rodzaje zbieranych danych:</p>
                <ul>
                    <li>Dane identyfikacyjne: imi�, nazwisko, data urodzenia, dane przodk�w i krewnych, oraz inne informacje niezb�dne do stworzenia drzewa genealogicznego;</li>
                    <li>Dane kontaktowe: adres e-mail;</li>
                    <li>Dane techniczne: adres IP, identyfikatory sesji, pliki cookies.</li>
                </ul>
            </section>

            <section>
                <h2>3. Podstawy prawne przetwarzania danych</h2>
                <p>3.1. Przetwarzanie danych osobowych odbywa si� zgodnie z art. 6 RODO, na podstawie:</p>
                <ul>
                    <li>zgody u�ytkownika na przetwarzanie danych osobowych;</li>
                    <li>niezb�dno�ci do realizacji umowy (utworzenia drzewa genealogicznego);</li>
                    <li>uzasadnionego interesu administratora (zapewnienie bezpiecze�stwa serwisu).</li>
                </ul>
            </section>

            <section>
                <h2>4. Udost�pnianie i przekazywanie danych</h2>
                <p>
                    4.1. Dane osobowe u�ytkownik�w nie b�d� udost�pniane podmiotom trzecim bez zgody u�ytkownika, z wyj�tkiem przypadk�w przewidzianych prawem.
                </p>
                <p>
                    4.2. Administrator mo�e powierzy� przetwarzanie danych osobowych podmiotom wsp�pracuj�cym, takim jak dostawcy us�ug hostingowych, podmioty zajmuj�ce si� utrzymaniem systemu IT, lub firmy obs�uguj�ce p�atno�ci, na podstawie odpowiednich um�w.
                </p>
            </section>

            <section>
                <h2>5. Prawa u�ytkownik�w</h2>
                <p>5.1. U�ytkownik ma prawo do:</p>
                <ul>
                    <li>dost�pu do swoich danych oraz ich poprawiania;</li>
                    <li>usuni�cia danych (�prawo do bycia zapomnianym�);</li>
                    <li>ograniczenia przetwarzania danych;</li>
                    <li>przenoszenia danych;</li>
                    <li>sprzeciwu wobec przetwarzania danych;</li>
                    <li>wniesienia skargi do organu nadzorczego w przypadku naruszenia praw.</li>
                </ul>
            </section>

            <section>
                <h2>6. Okres przechowywania danych</h2>
                <p>
                    6.1. Dane osobowe przechowywane s� przez okres korzystania z us�ug serwisu oraz przez czas wymagany przepisami prawa lub do momentu wycofania zgody przez u�ytkownika.
                </p>
            </section>

            <section>
                <h2>7. Pliki cookies</h2>
                <p>
                    7.1. Serwis wykorzystuje pliki cookies, kt�re pozwalaj� na dostosowanie strony do preferencji u�ytkownik�w oraz analiz� ruchu na stronie.
                </p>
                <p>7.2. U�ytkownik mo�e zarz�dza� plikami cookies poprzez ustawienia swojej przegl�darki.</p>
            </section>

            <section>
                <h2>8. Zmiany w polityce prywatno�ci</h2>
                <p>
                    8.1. Administrator zastrzega sobie prawo do wprowadzania zmian w polityce prywatno�ci. Informacje o zmianach b�d� publikowane na stronie internetowej.
                </p>
                <p>
                    8.2. Zach�camy u�ytkownik�w do regularnego sprawdzania tre�ci polityki prywatno�ci w celu zapoznania si� z ewentualnymi zmianami.
                </p>
            </section>

            <footer>
                <p><em>Niniejsza polityka prywatno�ci obowi�zuje od dnia 14.11.2024r.</em></p>
            </footer>
            </div>
        <BottomBar/>
        </div>
    )
}