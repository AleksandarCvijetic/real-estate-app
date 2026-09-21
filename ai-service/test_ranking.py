import sys
import time

from sentence_transformers import SentenceTransformer

# Naziv modela se prosledjuje kao argument, npr:
#   python test_ranking.py intfloat/multilingual-e5-base
model_name = sys.argv[1] if len(sys.argv) > 1 else "intfloat/multilingual-e5-small"
model = SentenceTransformer(model_name)

# Oglasi u formatu koji ce praviti AI servis (prefiks "passage: " se dodaje ispod)
oglasi = [
    "Stan za izdavanje, jednosoban (garsonjera). Novi Sad, Telep. 25 m², 3. sprat. Namešteno. "
    "Grejanje na gas. Ima parking. Mala garsonjera, idealna za jednu osobu.",
    "Kuća na prodaju, 4 sobe. Sremska Kamenica. 140 m². Nenamešteno. Grejanje na gas. Ima parking. "
    "Porodična kuća sa velikim dvorištem i baštom.",
    "Stan na prodaju, dvosoban. Novi Sad, Centar. 62 m², 3. sprat. Namešteno. Centralno grejanje. "
    "Dozvoljeni kućni ljubimci. Luksuzan stan u centru grada.",
    "Stan za izdavanje, trosoban. Novi Sad, Liman 3. 78 m², 5. sprat. Polunamešteno. Centralno grejanje. "
    "Ima parking. Blizu keja i Univerziteta.",
    "Kuća za izdavanje, 3 sobe. Veternik. 95 m². Namešteno. Etažno grejanje. Dozvoljeni kućni ljubimci. "
    "Mirno naselje, ograđeno dvorište.",
]

# upit -> skup indeksa oglasa koji se racunaju kao tacan prvi rezultat
upiti = {
    "mali stan za studenta": {0},
    "kuća sa dvorištem za porodicu": {1, 4},
    "stan u centru za kupovinu": {2},
    "iznajmljujem sa psom": {4},
    "blizu fakulteta": {3},
}

start = time.perf_counter()
vektori_oglasa = model.encode(["passage: " + t for t in oglasi], normalize_embeddings=True)

pogoci = 0
for upit, tacni in upiti.items():
    vektor_upita = model.encode("query: " + upit, normalize_embeddings=True)
    skorovi = vektori_oglasa @ vektor_upita          # cosine similarity sa svakim oglasom
    redosled = skorovi.argsort()[::-1]               # od najslicnijeg ka najmanje slicnom

    pogodak = redosled[0] in tacni
    pogoci += pogodak
    print(f"\n>>> {upit}   {'OK' if pogodak else 'PROMASAJ'}")
    for i in redosled:
        oznaka = "*" if i in tacni else " "
        print(f" {oznaka} {skorovi[i]:.3f}  {oglasi[i][:70]}")

trajanje = time.perf_counter() - start
print(f"\nModel: {model_name}  (dimenzija {vektori_oglasa.shape[1]})")
print(f"Tacan prvi rezultat: {pogoci}/{len(upiti)}")
print(f"Vreme za {len(oglasi)} oglasa + {len(upiti)} upita: {trajanje:.2f} s")