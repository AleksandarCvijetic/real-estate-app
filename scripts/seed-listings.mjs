// Popunjava listing-service demo oglasima (sa slikama) preko API gateway-a.
//
// Pokretanje (stek mora da radi, nalog mora biti verifikovan):
//   node scripts/seed-listings.mjs ["putanja/do/foldera/sa/slikama"]
//
// Kredencijali se unose interaktivno ili preko SEED_EMAIL / SEED_PASSWORD.
// 1. Brisu se oglasi iz prethodne verzije demo podataka (OLD_DEMO_TITLES) koje ima taj korisnik.
// 2. Kreiraju se oglasi iz LISTINGS; oni koji vec postoje (isti naslov) se preskacu.
// Sve ide kroz API, pa listing-service salje CREATED/DELETED dogadjaje i ai-service azurira indeks.
// Skriptu je bezbedno pokrenuti vise puta.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const API = process.env.SEED_API_URL ?? 'http://localhost:8080/api';
const IMAGE_DIR = process.argv[2] ?? 'scripts/seed-images';

const IMG = {
  starogradnjaParket: 'istockphoto-1020464734-612x612.jpg',
  modernStaklo: 'istockphoto-1293762741-612x612.jpg',
  svetloBiljke: 'istockphoto-1312439845-612x612.jpg',
  sivoNovogradnja: 'istockphoto-1344083240-612x612.jpg',
  otvorenaKuhinja: 'istockphoto-1351673196-612x612.jpg',
  garsonjera: 'istockphoto-1398814566-1024x1024.jpg',
  velikiProzori: 'istockphoto-1421422160-612x612.jpg',
  pogledSpavaca: 'istockphoto-1837566278-612x612.jpg',
  klasicanLuster: 'istockphoto-1990444472-612x612.jpg',
};

// Naslovi prve verzije demo oglasa - brisu se pre kreiranja novih.
const OLD_DEMO_TITLES = [
  'Dvosoban stan u starogradnji, Dorćol',
  'Luksuzan trosoban stan sa staklenom pregradom',
  'Svetao jednoiposoban stan na Limanu',
  'Novogradnja, dvoiposoban stan sa lođom',
  'Moderan stan sa otvorenom kuhinjom, Vračar',
  'Garsonjera za studente, blizu fakulteta',
  'Prostran trosoban stan sa velikim prozorima',
  'Dvosoban stan sa trpezarijom, Zvezdara',
  'Četvorosoban stan u austrougarskoj zgradi',
  'Jednosoban stan, Kragujevac centar',
  'Porodična kuća sa dvorištem, Sremska Kamenica',
  'Kuća za izdavanje, Voždovac',
];

const LISTINGS = [
  {
    title: 'Garsonjera na Limanu, kod kampusa',
    description:
      'Uredna garsonjera na pet minuta hoda od Univerzitetskog kampusa i Prirodno-matematičkog fakulteta. Idealna za jednu osobu, sa radnim kutkom pored prozora. U zgradi je tiho, a do centra se stiže biciklom za deset minuta.',
    price: 260, area: 26, location: 'Novi Sad, Liman 1',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 1.0, floor: 2,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: false,
    phoneNumber: '064/123-4567',
    images: [IMG.garsonjera],
  },
  {
    title: 'Dvosoban stan sa dve odvojene sobe, Grbavica',
    description:
      'Stan sa dve potpuno odvojene sobe, pogodan za dvoje koji dele troškove stanovanja. Svaka soba ima svoj krevet, ormar i radni sto. Do Tehnološkog i Medicinskog fakulteta ima desetak minuta hoda.',
    price: 420, area: 49, location: 'Novi Sad, Grbavica',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 2.0, floor: 3,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: false,
    phoneNumber: '063/222-1188',
    images: [IMG.pogledSpavaca, IMG.sivoNovogradnja],
  },
  {
    title: 'Stan u prizemlju sa ograđenim dvorištem, Telep',
    description:
      'Stan u prizemlju male zgrade, sa sopstvenim ograđenim delom dvorišta i izlazom iz dnevne sobe. Vlasnik dozvoljava držanje životinja. U blizini je veliki park u kom ima prostora za trčanje i šetnju.',
    price: 380, area: 46, location: 'Novi Sad, Telep',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 2.0, floor: 0,
    furnishingStatus: 'FURNISHED', heatingType: 'TA_PEC', parking: true, petFriendly: true,
    phoneNumber: '060/455-9021',
    images: [IMG.svetloBiljke],
  },
  {
    title: 'Kuća sa velikim dvorištem, Veternik',
    description:
      'Kuća sa dvorištem od četiri ara, voćnjakom i mestom za roštilj. Ulica je mirna i bez saobraćaja, a u krugu od tristo metara nalaze se vrtić i osnovna škola. Pogodno za život sa decom.',
    price: 165000, area: 145, location: 'Veternik',
    listingType: 'SALE', propertyType: 'HOUSE', numberOfRooms: 4.0, floor: null,
    furnishingStatus: 'UNFURNISHED', heatingType: 'GAS', parking: true, petFriendly: true,
    phoneNumber: '021/887-4410',
    images: [IMG.velikiProzori, IMG.starogradnjaParket],
  },
  {
    title: 'Kuća na obronku Fruške gore, Sremska Kamenica',
    description:
      'Kuća okružena zelenilom, daleko od buke i gužve. Sa terase se vidi Dunav i grad u daljini. Vazduh je čist, a komšiluk redak. Do centra Novog Sada ima petnaest minuta vožnje.',
    price: 205000, area: 175, location: 'Sremska Kamenica',
    listingType: 'SALE', propertyType: 'HOUSE', numberOfRooms: 5.0, floor: null,
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'GAS', parking: true, petFriendly: true,
    phoneNumber: '065/330-7712',
    images: [IMG.klasicanLuster, IMG.pogledSpavaca, IMG.velikiProzori],
  },
  {
    title: 'Trosoban stan u novogradnji, Novo naselje',
    description:
      'Stan u zgradi staroj dve godine, sa liftom, video nadzorom i garažnim mestom. Vrtić, škola i pijaca su u neposrednoj blizini. Dovoljno prostora za porodicu sa dvoje dece.',
    price: 620, area: 74, location: 'Novi Sad, Novo naselje',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 3.0, floor: 4,
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: false,
    phoneNumber: '062/119-4455',
    images: [IMG.sivoNovogradnja, IMG.otvorenaKuhinja],
  },
  {
    title: 'Stan sa pogledom na Dunav, Podbara',
    description:
      'Svetao stan na nekoliko koraka od keja, sa pogledom na reku i Petrovaradinsku tvrđavu. Ujutru se sa prozora vidi izlazak sunca nad vodom. Kej je pravo mesto za jutarnje trčanje ili vožnju bicikla.',
    price: 125000, area: 64, location: 'Novi Sad, Podbara',
    listingType: 'SALE', propertyType: 'APARTMENT', numberOfRooms: 2.5, floor: 5,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: true,
    phoneNumber: '064/778-2030',
    images: [IMG.velikiProzori, IMG.svetloBiljke],
  },
  {
    title: 'Luksuzan stan u strogom centru',
    description:
      'Stan vrhunskog kvaliteta na Trgu slobode, sa italijanskim pločicama, ugradnim ormarima i klimom u svakoj prostoriji. Restorani, pozorište i Zmaj Jovina ulica su ispod prozora. Uz stan ide garažno mesto.',
    price: 265000, area: 88, location: 'Novi Sad, Centar',
    listingType: 'SALE', propertyType: 'APARTMENT', numberOfRooms: 3.0, floor: 4,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: false,
    phoneNumber: '063/500-6001',
    images: [IMG.modernStaklo, IMG.otvorenaKuhinja],
  },
  {
    title: 'Jednosoban stan spreman za useljenje, Detelinara',
    description:
      'Potpuno opremljen stan u koji se useljava bez ijednog dodatnog troška. Posteljina, posuđe, veš mašina i internet već su tu. Pogodno za nekoga ko dolazi u grad na kratko i želi da se odmah smesti.',
    price: 330, area: 34, location: 'Novi Sad, Detelinara',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 1.0, floor: 1,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: false,
    phoneNumber: '060/242-8899',
    images: [IMG.pogledSpavaca],
  },
  {
    title: 'Stan za renoviranje, Bulevar oslobođenja',
    description:
      'Stan u staroj zgradi na odličnoj adresi, koji čeka novog vlasnika i njegovu ideju. Instalacije i stolarija su u originalnom stanju, pa cena prati potrebno ulaganje. Zgrada ima lift i mirno unutrašnje dvorište.',
    price: 89000, area: 58, location: 'Novi Sad, Bulevar oslobođenja',
    listingType: 'SALE', propertyType: 'APARTMENT', numberOfRooms: 2.0, floor: 3,
    furnishingStatus: 'UNFURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: false,
    phoneNumber: '021/661-3300',
    images: [IMG.starogradnjaParket, IMG.klasicanLuster],
  },
  {
    title: 'Kuća za izdavanje u Futogu',
    description:
      'Kuća sa prostranom terasom i voćnjakom, u naselju u kom se ljudi poznaju. Autobus do Novog Sada staje na dvesta metara i vozi na svakih petnaest minuta. Dvorište je ograđeno i bezbedno za životinje.',
    price: 520, area: 115, location: 'Futog',
    listingType: 'RENT', propertyType: 'HOUSE', numberOfRooms: 3.0, floor: null,
    furnishingStatus: 'FURNISHED', heatingType: 'GAS', parking: true, petFriendly: true,
    phoneNumber: '064/905-1177',
    images: [IMG.svetloBiljke, IMG.pogledSpavaca],
  },
  {
    title: 'Poslovno stambeni prostor, Bistrica',
    description:
      'Stan sa zasebnom prostorijom koja ima poseban ulaz, pogodnom za rad od kuće ili primanje stranaka. Ostatak stana je potpuno odvojen od radnog dela. Parking ispred zgrade i brza internet veza.',
    price: 480, area: 68, location: 'Novi Sad, Bistrica',
    listingType: 'RENT', propertyType: 'APARTMENT', numberOfRooms: 2.5, floor: 6,
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: false,
    phoneNumber: '062/808-4512',
    images: [IMG.garsonjera, IMG.sivoNovogradnja],
  },
];

function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) {
    rl._writeToOutput = (s) => {
      if (s.startsWith(question)) rl.output.write(question);
    };
  }
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer.trim());
    }),
  );
}

async function request(method, url, { token, json, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${url}`, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  const email = process.env.SEED_EMAIL ?? (await ask('Email vlasnika oglasa: '));
  const password = process.env.SEED_PASSWORD ?? (await ask('Lozinka: ', { hidden: true }));

  const { accessToken } = await request('POST', '/users/auth/login', { json: { email, password } });
  const myListings = await request('GET', '/listings/my', { token: accessToken });

  // 1. Brisanje stare verzije demo oglasa (zajedno sa slikama, omiljenima i prijavama).
  const oldTitles = new Set(OLD_DEMO_TITLES);
  let deleted = 0;
  for (const listing of myListings.filter((l) => oldTitles.has(l.title))) {
    await request('DELETE', `/listings/${listing.id}`, { token: accessToken });
    deleted++;
    console.log(`- obrisan #${listing.id} ${listing.title}`);
  }

  // 2. Kreiranje novih demo oglasa.
  const existingTitles = new Set(myListings.map((l) => l.title));
  let created = 0;
  for (const { images, ...listing } of LISTINGS) {
    if (existingTitles.has(listing.title)) {
      console.log(`= preskacem (vec postoji): ${listing.title}`);
      continue;
    }

    const saved = await request('POST', '/listings', { token: accessToken, json: listing });

    const form = new FormData();
    for (const name of images) {
      const bytes = await readFile(path.join(IMAGE_DIR, name));
      form.append('files', new Blob([bytes], { type: 'image/jpeg' }), name);
    }
    await request('POST', `/listings/${saved.id}/images`, { token: accessToken, body: form });

    created++;
    console.log(`+ #${saved.id} ${listing.title} (${images.length} slik${images.length === 1 ? 'a' : 'e'})`);
  }

  console.log(`\nGotovo: obrisano ${deleted}, kreirano ${created}, preskoceno ${LISTINGS.length - created}.`);
}

main().catch((err) => {
  console.error(`Greska: ${err.message}`);
  process.exit(1);
});
