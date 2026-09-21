"""
Pretvaranje oglasa u tekst koji se prosledjuje embedding modelu.

Pravila:
- enum vrednosti se prevode na srpski, jer korisnik pretragu kuca na srpskom
- navode se samo pozitivne karakteristike (modeli lose razumeju negaciju)
- cena se ne navodi, jer model ne razume da je 300 EUR "jeftino"
- strukturirani sazetak ide pre opisa, da ne bude odsecen kod dugackih opisa
"""

from app.schemas import ListingEvent

PROPERTY_TYPE = {"APARTMENT": "Stan", "HOUSE": "Kuća"}

LISTING_TYPE = {"RENT": "za izdavanje", "SALE": "na prodaju"}

FURNISHING_STATUS = {
    "FURNISHED": "Namešteno",
    "SEMI_FURNISHED": "Polunamešteno",
    "UNFURNISHED": "Nenamešteno",
}

HEATING_TYPE = {
    "CENTRAL": "Centralno grejanje",
    "ETAZNO": "Etažno grejanje",
    "TA_PEC": "Grejanje na TA peć",
    "ELECTRIC": "Električno grejanje",
    "GAS": "Grejanje na gas",
    "NONE": None,  # izostavlja se
}

ROOMS = {
    0.5: "garsonjera",
    1.0: "jednosoban (garsonjera)",
    1.5: "jednoiposoban",
    2.0: "dvosoban",
    2.5: "dvoiposoban",
    3.0: "trosoban",
    3.5: "troiposoban",
    4.0: "četvorosoban",
}


def _rooms_text(rooms: float | None, property_type: str | None) -> str | None:
    if rooms is None:
        return None
    if property_type == "HOUSE":
        # "trosobna kuća" se retko koristi, pa se navodi samo broj soba
        return f"{rooms:g} sobe"
    if rooms >= 4.5:
        return "četvoroiposoban ili veći"
    return ROOMS.get(rooms, f"{rooms:g} sobe")


def _floor_text(floor: int | None) -> str | None:
    if floor is None:
        return None
    if floor == 0:
        return "prizemlje"
    if floor < 0:
        return "suteren"
    return f"{floor}. sprat"


def build_listing_text(event: ListingEvent) -> str:
    """Sastavlja tekst oglasa od podataka iz dogadjaja."""
    recenice: list[str] = []

    # 1. Tip nekretnine, tip oglasa i broj soba
    tip = PROPERTY_TYPE.get(event.property_type or "", "Nekretnina")
    oglas = LISTING_TYPE.get(event.listing_type or "")
    sobe = _rooms_text(event.number_of_rooms, event.property_type)

    prva = tip
    if oglas:
        prva += f" {oglas}"
    if sobe:
        prva += f", {sobe}"
    recenice.append(prva + ".")

    # 2. Lokacija
    if event.location:
        recenice.append(f"{event.location}.")

    # 3. Kvadratura i sprat
    velicina = []
    if event.area is not None:
        velicina.append(f"{event.area:g} m²")
    sprat = _floor_text(event.floor)
    if sprat:
        velicina.append(sprat)
    if velicina:
        recenice.append(", ".join(velicina) + ".")

    # 4. Namestenost i grejanje
    namesteno = FURNISHING_STATUS.get(event.furnishing_status or "")
    if namesteno:
        recenice.append(f"{namesteno}.")

    grejanje = HEATING_TYPE.get(event.heating_type or "")
    if grejanje:
        recenice.append(f"{grejanje}.")

    # 5. Samo pozitivne karakteristike
    if event.parking:
        recenice.append("Ima parking.")
    if event.pet_friendly:
        recenice.append("Dozvoljeni kućni ljubimci.")

    # 6. Naslov i opis na kraju
    if event.title:
        recenice.append(f"{event.title}.")
    if event.description:
        recenice.append(event.description)

    return " ".join(recenice)