import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', lineHeight: '1.8' }}>
      <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' }}>
        ← Til baka
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Notkunarskilmálar</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)' }}>
        <p>
          <strong>1. Upplýsingavefur, ekki heilbrigðisþjónusta</strong><br />
          Lúlla er eingöngu upplýsingavefur sem ætlað er að aðstoða foreldra. Upplýsingarnar hér koma <strong>ekki</strong> í stað ráðgjafar, greiningar eða meðferðar hjá viðurkenndum heilbrigðisstarfsmanni. Ef þú hefur áhyggjur af heilsu eða líðan barnsins þíns, eða þinni eigin, skaltu ávallt leita til læknis, ljósmóður eða heilsugæslu.
        </p>

        <p>
          <strong>2. Engin söfnun persónugagna (Privacy by Design)</strong><br />
          Við erum ekki að logga nein persónugögn um þig eða barnið þitt fyrir okkar eigin notkun. Ef þú notar dagbókina án innskráningar eru gögnin vistuð eingöngu staðbundið á þínu eigin tæki (í vafra). Ef þú velur að skrá þig inn til að samstilla gögn á milli tækja, eru þau gögn varin og aðeins aðgengileg þér. Við seljum aldrei eða deilum gögnum með þriðja aðila.
        </p>

        <p>
          <strong>3. Engin ábyrgð á afleiðingum notkunar</strong><br />
          Neðri Hóll Hugmyndahús ehf., sem rekstraraðili vefsins, tekur enga ábyrgð á afleiðingum af notkun þeirra upplýsinga eða ráðlegginga sem hér er að finna. Notkun vefsins og hvers kyns aðgerðir sem byggðar eru á efninu eru á eigin ábyrgð.
        </p>
      </div>
    </div>
  );
}
