'use client'; // Ensures this page is rendered as a client component

import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';

export default function GdprPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Ensure content is aligned to the top
        alignItems: 'center',
        minHeight: '100vh', // Still ensures full height for the page
        textAlign: 'center',
        padding: 2,
        backgroundColor: 'background.default', // Ensure background is the same as app theme
        overflowY: 'auto', // Allow scrolling if content overflows
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper', // Box background will follow the theme's background color
          borderRadius: '12px',
          padding: '30px',
          boxShadow: 3,
          width: '100%',
          maxWidth: '800px', // Limiting max width of the content
          margin: '0 20px', // Margin for spacing
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#d32f2f' }}>
          GDPR - Ochrana osobných údajov
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>1. Úvod</strong>
          <br />
          Sme odhodlaní chrániť vaše osobné údaje a vaše súkromie. Táto politika ochrany osobných údajov vysvetľuje, aké osobné údaje zbierame, ako ich používame a chránime, keď navštívite našu webovú stránku alebo používate naše služby. Používaním našich služieb súhlasíte s tým, že budete zhromažďovať a používať vaše údaje v súlade s touto politikou.
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>2. Zber údajov</strong>
          <br />
          Zbierame nasledujúce typy osobných údajov:
        </Typography>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li><strong>Identifikačné údaje</strong>: Meno, e-mailová adresa a ďalšie údaje poskytnuté pri registrácii alebo používaní našich služieb.</li>
          <li><strong>Technické údaje</strong>: Informácie o vašom zariadení, IP adresa a správanie na našej webovej stránke.</li>
          <li><strong>Údaje o polohe</strong>: Môžeme zbierať údaje o vašej polohe, ak povolíte službu určovania polohy na vašom zariadení.</li>
        </ul>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>3. Ako používame vaše údaje</strong>
          <br />
          Vaše údaje používame na nasledujúce účely:
        </Typography>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Na poskytovanie a zlepšovanie našich služieb.</li>
          <li>Na personalizáciu vašich skúseností na našej webovej stránke.</li>
          <li>Na komunikáciu s vami, vrátane zasielania aktualizácií, newsletterov a marketingových materiálov.</li>
          <li>Na splnenie právnych povinností.</li>
        </ul>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>4. Zdieľanie údajov</strong>
          <br />
          Vaše osobné údaje nepredávame ani nepožičiavame tretím stranám. Môžeme však zdieľať vaše údaje s dôveryhodnými poskytovateľmi služieb, ktorí nám pomáhajú pri prevádzke našich webových stránok a služieb. Títo poskytovatelia sú povinní uchovávať vaše údaje v tajnosti.
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>5. Vaše práva</strong>
          <br />
          Na základe GDPR máte nasledujúce práva:
        </Typography>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li><strong>Prístup</strong>: Máte právo požadovať prístup k osobným údajom, ktoré o vás uchovávame.</li>
          <li><strong>Oprava</strong>: Máte právo požadovať opravu nesprávnych alebo neúplných údajov, ktoré o vás máme.</li>
          <li><strong>Vymazanie</strong>: Máte právo požadovať vymazanie vašich osobných údajov za určitých podmienok.</li>
          <li><strong>Prenosnosť</strong>: Môžete požiadať o kópiu vašich údajov v štruktúrovanom, bežne používanom a strojovo čitateľnom formáte.</li>
          <li><strong>Námietka</strong>: Môžete vznesť námietku proti spracovaniu vašich osobných údajov na určité účely.</li>
          <li><strong>Odvolanie súhlasu</strong>: Ak ste poskytli súhlas na spracovanie údajov, máte právo tento súhlas kedykoľvek odvolať.</li>
        </ul>

        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          <strong>6. Bezpečnosť údajov</strong>
          <br />
          Používame vhodné technické a organizačné opatrenia na ochranu vašich osobných údajov pred neoprávneným prístupom, zmenami, zverejnením alebo zničením.
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          <strong>7. Kontaktujte nás</strong>
          <br />
          Ak máte akékoľvek otázky alebo obavy týkajúce sa tejto politiky ochrany osobných údajov alebo našich praktík spracovania údajov, neváhajte nás kontaktovať na:
          <br />
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={handleBackClick}
          sx={{
            marginTop: 1, // Reduced marginTop to move the button higher
            marginBottom: 3, // Added marginBottom to create space below the button
          }}
        >
          Späť
        </Button>
      </Box>
    </Box>
  );
}
