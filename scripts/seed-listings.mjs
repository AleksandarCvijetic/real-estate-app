// Popunjava listing-service demo oglasima (sa slikama) preko API gateway-a.
//
// Pokretanje (stek mora da radi, nalog mora biti verifikovan):
//   node scripts/seed-listings.mjs ["putanja/do/foldera/sa/slikama"]
//
// Kredencijali se unose interaktivno ili preko SEED_EMAIL / SEED_PASSWORD.
// Oglasi koji vec postoje kod tog korisnika (isti naslov) se preskacu,
// pa je skriptu bezbedno pokrenuti vise puta.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const API = process.env.SEED_API_URL ?? 'http://localhost:8080/api';
const IMAGE_DIR = process.argv[2] ?? 'C:/Users/acacv/OneDrive/Desktop/slike stanova';

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

const LISTINGS = [
  {
    title: 'Dvosoban stan u starogradnji, Dorćol',
    description:
      'Prostran dvosoban stan u mirnoj ulici na Dorćolu, u zgradi iz 1930-ih. Visoki plafoni, originalni parket riblja kost i ' +
      'dvokrilna vrata. Dnevna soba odvojena od radnog kutka, kupatilo renovirano 2022. Na pešačkoj udaljenosti od Knez Mihailove i Kalemegdana.',
    price: 189000, area: 64, location: 'Beograd, Dorćol', phoneNumber: '064 218 3345',
    listingType: 'SALE', numberOfRooms: 2, propertyType: 'APARTMENT', floor: 2,
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: true,
    images: [IMG.starogradnjaParket, IMG.klasicanLuster],
  },
  {
    title: 'Luksuzan trosoban stan sa staklenom pregradom',
    description:
      'Moderan trosoban stan u novogradnji sa podzemnom garažom. Kuhinja je od dnevnog boravka odvojena staklenom pregradom u ' +
      'industrijskom stilu, ugrađeni aparati, podno grejanje. Zgrada ima lift i video nadzor. Useljiv odmah.',
    price: 1150, area: 88, location: 'Beograd, Novi Beograd, Blok 67', phoneNumber: '063 771 0921',
    listingType: 'RENT', numberOfRooms: 3, propertyType: 'APARTMENT', floor: 5,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: false,
    images: [IMG.modernStaklo, IMG.otvorenaKuhinja],
  },
  {
    title: 'Svetao jednoiposoban stan na Limanu',
    description:
      'Svetao i prozračan stan na Limanu 3, na pet minuta od Štranda i Univerziteta. Parket, nove PVC stolarije, lepo ' +
      'opremljen. Idealan za par ili zaposlenog pojedinca. Kućni ljubimci dozvoljeni uz dogovor.',
    price: 520, area: 45, location: 'Novi Sad, Liman 3', phoneNumber: '065 402 1187',
    listingType: 'RENT', numberOfRooms: 1.5, propertyType: 'APARTMENT', floor: 3,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: true,
    images: [IMG.svetloBiljke],
  },
  {
    title: 'Novogradnja, dvoiposoban stan sa lođom',
    description:
      'Dvoiposoban stan u novijoj zgradi (2021) na Novom naselju. Veliki francuski prozori, lođa od 6 m², etažno grejanje ' +
      'na gas. Stan se prodaje prazan, uknjižen, bez tereta. Uz stan ide i parking mesto u dvorištu.',
    price: 142000, area: 62, location: 'Novi Sad, Novo naselje', phoneNumber: '062 889 4410',
    listingType: 'SALE', numberOfRooms: 2.5, propertyType: 'APARTMENT', floor: 4,
    furnishingStatus: 'UNFURNISHED', heatingType: 'ETAZNO', parking: true, petFriendly: true,
    images: [IMG.sivoNovogradnja],
  },
  {
    title: 'Moderan stan sa otvorenom kuhinjom, Vračar',
    description:
      'Potpuno renoviran dvosoban stan na Vračaru, blizu Hrama Svetog Save. Otvoren koncept kuhinje i dnevnog boravka, ' +
      'kuhinja po meri sa kamenom radnom pločom, ugrađeni plakari. Klima uređaj u svakoj prostoriji.',
    price: 215000, area: 58, location: 'Beograd, Vračar', phoneNumber: '064 330 5528',
    listingType: 'SALE', numberOfRooms: 2, propertyType: 'APARTMENT', floor: 3,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: false,
    images: [IMG.otvorenaKuhinja, IMG.modernStaklo],
  },
  {
    title: 'Garsonjera za studente, blizu fakulteta',
    description:
      'Kompaktna i funkcionalna garsonjera, potpuno opremljena: radni sto, kauč na razvlačenje, TV i internet. Na deset minuta ' +
      'hoda od Kampusa. Režije oko 60 EUR mesečno. Pogodna za studenta, izdaje se na minimum 6 meseci.',
    price: 290, area: 24, location: 'Novi Sad, Grbavica', phoneNumber: '061 554 7702',
    listingType: 'RENT', numberOfRooms: 1, propertyType: 'APARTMENT', floor: 1,
    furnishingStatus: 'FURNISHED', heatingType: 'ELECTRIC', parking: false, petFriendly: false,
    images: [IMG.garsonjera],
  },
  {
    title: 'Prostran trosoban stan sa velikim prozorima',
    description:
      'Izuzetno svetao trosoban stan sa tri velika prozora u dnevnoj sobi, visina plafona 3,2 m. Ugrađena biblioteka, ' +
      'dve spavaće sobe, kuhinja sa trpezarijom. Mirna ulica, blizu parka i osnovne škole.',
    price: 650, area: 82, location: 'Niš, Centar', phoneNumber: '063 612 9034',
    listingType: 'RENT', numberOfRooms: 3, propertyType: 'APARTMENT', floor: 2,
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'CENTRAL', parking: false, petFriendly: true,
    images: [IMG.velikiProzori, IMG.svetloBiljke],
  },
  {
    title: 'Dvosoban stan sa trpezarijom, Zvezdara',
    description:
      'Uredan dvosoban stan sa zasebnom spavaćom sobom i trpezarijskim delom uz dnevni boravak. Terasa sa pogledom na zelenilo, ' +
      'podrum uz stan. Dobra povezanost gradskim prevozom, market i pijaca u blizini.',
    price: 700, area: 55, location: 'Beograd, Zvezdara', phoneNumber: '065 118 2296',
    listingType: 'RENT', numberOfRooms: 2, propertyType: 'APARTMENT', floor: 6,
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: false,
    images: [IMG.pogledSpavaca],
  },
  {
    title: 'Četvorosoban stan u austrougarskoj zgradi',
    description:
      'Reprezentativan četvorosoban stan u centru Subotice, u zgradi pod zaštitom države. Visoki plafoni sa gipsanom ' +
      'dekoracijom, luster, drveni podovi. Idealan za porodicu ili kancelarijski prostor. Etažno grejanje na gas.',
    price: 118000, area: 104, location: 'Subotica, Centar', phoneNumber: '062 740 3381',
    listingType: 'SALE', numberOfRooms: 4, propertyType: 'APARTMENT', floor: 1,
    furnishingStatus: 'UNFURNISHED', heatingType: 'GAS', parking: false, petFriendly: true,
    images: [IMG.klasicanLuster, IMG.starogradnjaParket, IMG.velikiProzori],
  },
  {
    title: 'Jednosoban stan, Kragujevac centar',
    description:
      'Renoviran jednosoban stan na drugom spratu zgrade sa liftom, u samom centru grada. Nov nameštaj, klima, ' +
      'veš mašina. Stan je pogodan za investiciju, trenutno se izdaje.',
    price: 54000, area: 36, location: 'Kragujevac, Centar', phoneNumber: '064 905 6613',
    listingType: 'SALE', numberOfRooms: 1, propertyType: 'APARTMENT', floor: 2,
    furnishingStatus: 'FURNISHED', heatingType: 'TA_PEC', parking: false, petFriendly: false,
    images: [IMG.sivoNovogradnja, IMG.garsonjera],
  },
  {
    title: 'Porodična kuća sa dvorištem, Sremska Kamenica',
    description:
      'Spratna kuća od 140 m² na placu od 5 ari, deset minuta od centra Novog Sada. Prizemlje: dnevni boravak sa kuhinjom ' +
      'i trpezarijom, sprat: tri spavaće sobe i kupatilo. Uređeno dvorište, garaža za jedan automobil.',
    price: 235000, area: 140, location: 'Novi Sad, Sremska Kamenica', phoneNumber: '063 227 8850',
    listingType: 'SALE', numberOfRooms: 4.5, propertyType: 'HOUSE',
    furnishingStatus: 'SEMI_FURNISHED', heatingType: 'GAS', parking: true, petFriendly: true,
    images: [IMG.pogledSpavaca, IMG.velikiProzori, IMG.otvorenaKuhinja],
  },
  {
    title: 'Kuća za izdavanje, Voždovac',
    description:
      'Prizemna kuća sa dve spavaće sobe i dvorištem, na Voždovcu u mirnom kraju. Potpuno opremljena, ' +
      'parking za dva automobila u dvorištu. Ljubimci dobrodošli. Depozit u visini jedne kirije.',
    price: 900, area: 85, location: 'Beograd, Voždovac', phoneNumber: '061 303 4478',
    listingType: 'RENT', numberOfRooms: 3, propertyType: 'HOUSE',
    furnishingStatus: 'FURNISHED', heatingType: 'CENTRAL', parking: true, petFriendly: true,
    images: [IMG.svetloBiljke, IMG.starogradnjaParket],
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
  const existingTitles = new Set((await request('GET', '/listings/my', { token: accessToken })).map((l) => l.title));

  let created = 0;
  for (const { images, ...listing } of LISTINGS) {
    if (existingTitles.has(listing.title)) {
      console.log(`- preskacem (vec postoji): ${listing.title}`);
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

  console.log(`\nGotovo: kreirano ${created}, preskoceno ${LISTINGS.length - created}.`);
}

main().catch((err) => {
  console.error(`Greska: ${err.message}`);
  process.exit(1);
});
