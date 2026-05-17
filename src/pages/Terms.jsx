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
          <strong>2. Meðhöndlun og geymsla gagna (Persónuvernd)</strong><br />
          Við virðum friðhelgi þína og barnsins þíns og gætum fyllsta öryggis í meðferð allra gagna. Hér er útskýrt nákvæmlega hvernig gögn eru geymd:
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Staðbundin vistun (Án innskráningar):</strong> Ef þú notar kerfið án þess að búa til aðgang, eru öll gögn (dagbókarfærslur, svefn, næring) eingöngu vistuð staðbundið í vafra tækisins þíns. Við höfum engan aðgang að þeim og þau eru ekki send á neina netþjóna.</li>
            <li><strong>Skýjavistun (Með innskráningu):</strong> Ef þú ákveður að stofna aðgang (til að samstilla gögn milli tækja), vistum við grunnupplýsingar um aðganginn þinn (t.d. netfang) og dagbókarfærslurnar þínar.</li>
            <li><strong>Hvar gögnin eru geymd:</strong> Gögn innskráðra notenda eru vistuð í skýjaþjónustu Google (Firebase) á netþjónum sem uppfylla ströngustu öryggiskröfur um gagnavernd (GDPR).</li>
            <li><strong>Dulkóðun og öryggi:</strong> Öll samskipti milli tækis þíns og gagnagrunns okkar fara fram yfir örugga dulkóðaða tengingu (HTTPS/SSL). Einnig eru öll gögn dulkóðuð í hvíld (encrypted at rest) í gagnagrunnum Firebase, sem þýðir að þau eru ólæsileg án réttrar auðkenningar.</li>
            <li><strong>Sölu gagna hafnað:</strong> Við deilum hvorki né seljum upplýsingarnar þínar til þriðja aðila. Þær eru eingöngu nýttar til að veita þér aðgang að eigin skráningum.</li>
          </ul>
        </p>

        <p>
          <strong>3. Engin ábyrgð á afleiðingum notkunar</strong><br />
          Neðri Hóll Hugmyndahús ehf., sem rekstraraðili vefsins, tekur enga ábyrgð á afleiðingum af notkun þeirra upplýsinga eða ráðlegginga sem hér er að finna. Notkun vefsins og hvers kyns aðgerðir sem byggðar eru á efninu eru á eigin ábyrgð.
        </p>
      </div>
    </div>
  );
}
