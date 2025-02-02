import json
import multiprocessing

with open("cardbase_crypt.json", "r") as crypt_file:
    crypt_db = json.load(crypt_file)

with open("cardbase_lib.json", "r") as library_file:
    library_db = json.load(library_file)


def generate_twd(i):
    deck = {
        "author": i["player"] if "player" in i else "Unknown",
        "capacity": None,
        "cards": {},
        "cardtypes_ratio": {},
        "clan": None,
        "creation_date": i["date"],
        "crypt_total": i["crypt"]["count"],
        "deckid": i["id"],
        "description": i["comments"] if "comments" in i else "Unknown",
        "disciplines": [],
        "event": i["event"],
        "format": i["tournament_format"] if "tournament_format" in i else "Unknown",
        "library_total": i["library"]["count"],
        "link": i["event_link"] if "event_link" in i else "",
        "location": i["place"] if "place" in i else "Unknown",
        "name": i["name"] if "name" in i else "Unknown",
        "players": i["players_count"] if "players_count" in i else "Unknown",
        "score": i["score"] if "score" in i else "Unknown",
        "sect": None,
        "traits": [],
    }

    crypt = {}
    clans = {}
    sects = {}
    disciplines = set()
    crypt_disciplines = set()
    total_capacity_ex_ac = 0
    total_crypt_ex_ac = 0

    for card in i["crypt"]["cards"]:
        crypt[card["id"]] = crypt_db[str(card["id"])]
        crypt[card["id"]]["q"] = card["count"]
        if card["id"] != 200076:
            total_crypt_ex_ac += card["count"]

    for id, c in crypt.items():
        q = c["q"]
        deck["cards"][id] = q

        # Skip Anarch Convert
        if id != 200076:
            total_capacity_ex_ac += q * c["capacity"]

            if (clan := c["clan"]) in clans:
                clans[clan] += q
            else:
                clans[clan] = q

        if (sect := c["sect"]) in sects:
            sects[sect] += q
        else:
            sects[sect] = q

        if "star" not in deck["traits"] and id != 200076:
            if c["adv"] and c["adv"][1] in crypt:
                q += crypt[c["adv"][1]]["q"]

            if q / total_crypt_ex_ac > 0.33:
                deck["traits"].append("star")

        for d in c["disciplines"].keys():
            crypt_disciplines.add(d)

    for clan, q in clans.items():
        if q / total_crypt_ex_ac > 0.5:
            deck["clan"] = clan

    if len(clans) <= 1 and "monoclan" not in deck["traits"]:
        deck["traits"].append("monoclan")

    for sect, q in sects.items():
        if q / deck["crypt_total"] > 0.65:
            deck["sect"] = sect

    deck["capacity"] = round(total_capacity_ex_ac / total_crypt_ex_ac, 1)

    for ct in i["library"]["cards"]:
        deck["cardtypes_ratio"][ct["type"].lower()] = round(ct["count"] / deck["library_total"], 2)

        for card in ct["cards"]:
            deck["cards"][card["id"]] = card["count"]

            discipline_entry = library_db[str(card["id"])]["discipline"]
            if "&" in discipline_entry:
                for d in discipline_entry.split(" & "):
                    if d in [*crypt_disciplines, "Flight", "Maleficia", "Striga"]:
                        disciplines.add(d)

            elif "/" in discipline_entry:
                for d in discipline_entry.split("/"):
                    if d in [*crypt_disciplines, "Flight", "Maleficia", "Striga"]:
                        disciplines.add(d)

            elif discipline_entry in [
                *crypt_disciplines,
                "Flight",
                "Maleficia",
                "Striga",
            ]:
                disciplines.add(discipline_entry)

    deck["disciplines"] = sorted(list(disciplines))
    return deck


with open("twda.json", "r") as twd_input, open("twd_decks.json", "w") as twd_decks_file:
    decks = []
    decks_by_id = {}

    twda = json.load(twd_input)
    total = len(twda)

    pool = multiprocessing.Pool(processes=4)
    decks = pool.map(generate_twd, twda)

    for deck in decks:
        if len(deck["deckid"]) == 9:
            deck["deckid"] = f'{deck["deckid"]}0'

        decks_by_id[deck["deckid"]] = deck

    json.dump(decks_by_id, twd_decks_file, indent=4, separators=(",", ":"))

with open("twda.json", "r") as twd_input, open(
    "twd_locations.json", "w"
) as twd_locations_file, open("twd_players.json", "w") as twd_players_file:

    twda = json.load(twd_input)
    cities = set(())
    countries = set(())
    players = set(())
    total = len(twda)

    for i in twda:
        if "place" in i:
            place = i["place"].split(", ")
            countries.add(place[-1])
            if len(place) > 1:
                cities.add(f"{place[-2]}, {place[-1]}")

        players.add(i["player"])

    cities = sorted(cities)
    countries = sorted(countries)
    players = sorted(players)

    json.dump(players, twd_players_file, indent=4, separators=(",", ":"))
    json.dump(
        {"countries": countries, "cities": cities},
        twd_locations_file,
        indent=4,
        separators=(",", ":"),
    )
