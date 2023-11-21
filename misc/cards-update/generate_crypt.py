import csv
import re
import json
import unicodedata


with open("../../frontend/src/assets/data/disciplinesList.json", "r") as disciplines_file, open(
        "../../frontend/src/assets/data/virtuesList.json", "r") as virtues_file, open(
            "vtes.json", "r", encoding="utf8") as krcg_file, open(
                "twda.json", "r") as twda_input:

        krcg_cards = json.load(krcg_file)
        twda = json.load(twda_input)
        disciplines_list = json.load(disciplines_file)
        virtues_list = json.load(virtues_file)

        disciplines = {}
        for d in disciplines_list.items():
            disciplines[d[1]] = {
                "name": d[0],
                "value": 1
            }
            disciplines[d[1].upper()] = {
                "name": d[0],
                "value": 2
            }

        virtues = {}
        for v in virtues_list.items():
            virtues[v[1]] = v[0]

def letters_to_ascii(text):
    return "".join(
        c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn"
    )


artist_fixes = {
    "Alejandro Collucci": "Alejandro Colucci",
    "Chet Masterz": "Chet Masters",
    "Dimple": "Nicolas Bigot",
    "EM Gist": "Erik Gist",
    "G. Goleash": "Grant Goleash",
    "Gin\u00e9s Qui\u00f1onero-Santiago": "Gin\u00e9s Qui\u00f1onero",
    "Glenn Osterberger": "Glen Osterberger",
    "Heather V. Kreiter": "Heather Kreiter",
    'Jeff "el jefe" Holt': "Jeff Holt",
    "L. Snelly": "Lawrence Snelly",
    "Mathias Tapia": "Matias Tapia",
    "Mattias Tapia": "Matias Tapia",
    "Matt Mitchell": "Matthew Mitchell",
    "Mike Gaydos": "Michael Gaydos",
    "Mike Weaver": "Michael Weaver",
    'Nicolas "Dimple" Bigot': "Nicolas Bigot",
    "Pat McEvoy": "Patrick McEvoy",
    "Ron Spenser": "Ron Spencer",
    "Sam Araya": "Samuel Araya",
    "Sandra Chang": "Sandra Chang-Adair",
    "T. Bradstreet": "Tim Bradstreet",
    "Tom Baxa": "Thomas Baxa",
    "zelgaris": "Tomáš Zahradníček",
}

# Groups are not integers because of ANY-group vampires (e.g. Anarch Convert)
integer_fields = ["Id", "Capacity"]
useless_fields = ["Aka"]


def generate_artists(cardbase_csv, artist_file, artist_file_min):
    csv_cards = csv.DictReader(cardbase_csv)

    artists = set()
    for card in csv_cards:
        for artist in re.split("; | & ", card["Artist"]):
            if artist in artist_fixes.keys():
                artists.add(artist_fixes[artist])
            else:
                artists.add(artist)

    json.dump(sorted(artists), artists_file_min, separators=(",", ":"))
    json.dump(sorted(artists), artists_file, indent=4, separators=(",", ":"))


def generate_cards(cards, cardbase_file, cardbase_file_min, ref_cards = None):
    cardbase = {}

    for card in cards:
        # Convert some fields values to integers
        for k in integer_fields:
            try:
                card[k] = int(card[k])
            except (ValueError):
                pass

        # Remove {} and spaces in []
        card["Card Text"] = re.sub("[{}]", "", card["Card Text"])
        card["Card Text"] = re.sub(r"\[(\w+)\s*(\w*)\]", r"[\1\2]", card["Card Text"])

        # Convert sets to dict
        if not card["Set"]:
            card["Set"] = {"PLAYTEST": {}}

        else:
            sets = card["Set"].split(", ")
            card["Set"] = {}

            for set in sets:
                if "-" in set:
                    set = set.split("-")
                elif ":" in set:
                    set = set.split(":")

                precons = set[1].split("/")

                # Fix for KoT, HttB Reprints (marked in CSV as KoT, but have only
                # bundles named "A" or "B" not existing in original KoT)
                if set[0] in ["KoT", "HttB"]:
                    counter = 0
                    for precon in precons:
                        if re.match(r"(A|B)[0-9]?", precon):
                            counter += 1

                    if counter > 0:
                        card["Set"][f"{set[0]}R"] = {}
                    if counter < len(precons):
                        card["Set"][set[0]] = {}

                elif set[0] == "Anthology":
                    for precon in precons:
                        if "LARP" in precon:
                            card["Set"]["Anthology"] = {}
                        else:
                            card["Set"]["Anthology"] = {}
                            card["Set"]["Anthology I"] = {}

                elif set[0] not in ["AU", "DM", "TU"] and set[0] not in card["Set"]:
                    card["Set"][set[0]] = {}

                # Fix for DM, TU, AU Kickstarter Unleashed
                # (merge into Kickstarter Unleashed set)
                if set[0] in ["DM", "TU", "AU"]:
                    for precon in precons:
                        if precon == "C":
                            card["Set"][set[0]] = {"C": True}
                        else:
                            if "KSU" not in card["Set"]:
                                card["Set"]["KSU"] = {}

                            if m := re.match(r"^(A|B)([0-9]+)?", precon):
                                card["Set"]["KSU"][f"{set[0]}{m.group(1)}"] = m.group(2)
                            else:
                                card["Set"]["KSU"][set[0]] = precon

                elif set[0] == "Anthology":
                    for precon in precons:
                        if "LARP" in precon:
                            m = re.match(r"^LARP([0-9]+)", precon)
                            card["Set"]["Anthology"][""] = m.group(1)
                        else:
                            card["Set"]["Anthology I"][""] = precon
                            card["Set"]["Anthology"][""] = precon

                else:
                    for precon in precons:
                        if set[0] in ["KoT", "HttB"] and (
                                m := re.match(r"^(A|B)([0-9]+)?", precon)
                        ):
                            s = f"{set[0]}R"
                            if m.group(2):
                                card["Set"][s][m.group(1)] = m.group(2)
                            else:
                                card["Set"][s][m.group(1)] = 1

                        else:
                            if m := re.match(r"^(\D+)([0-9]+)?", precon):
                                if m.group(1) in ["C", "U", "R", "V", "DTC"]:
                                    card["Set"][set[0]][m.group(1)] = True
                                elif m.group(2):
                                    card["Set"][set[0]][m.group(1)] = m.group(2)
                                else:
                                    card["Set"][set[0]][m.group(1)] = 1
                            elif m := re.match(r"^[0-9][0-9]?$", precon):
                                card["Set"][set[0]][""] = precon
                            else:
                                date = f"{precon[0:4]}-{precon[4:6]}-{precon[6:8]}"
                                card["Set"][set[0]][date] = True

        # Add Sect
        if card["Type"] == "Imbued":
            card["Sect"] = "Imbued"
        else:
            text = re.split("\W+", card["Card Text"])
            if text[0] == "Advanced":
                card["Sect"] = text[1]
            else:
                card["Sect"] = text[0]

        # ASCII-fication of name
        if card["Id"] == 201528:
            card["ASCII Name"] = "Boleslaw Gutowski"
        elif card["Id"] == 210025:
            card["ASCII Name"] = "Clara Hjortshoj"
        else:
            card["ASCII Name"] = letters_to_ascii(card["Name"])

        # Remove useless fields
        for k in useless_fields:
            del card[k]

        # Remove empty disciplines/virtues
        if card["Type"] == "Imbued":
            card_disciplines_letters = card["Disciplines"].split()
            card_disciplines = {}
            for d in card_disciplines_letters:
                if d in virtues:
                    card_disciplines[virtues[d]] = 1

            card["Disciplines"] = card_disciplines

        elif card["Type"] == "Vampire":
            card_disciplines_letters = card["Disciplines"].split()
            card_disciplines = {}
            for d in card_disciplines_letters:
                if d in disciplines:
                    card_disciplines[disciplines[d]['name']] = disciplines[d]['value']

            card["Disciplines"] = card_disciplines

        artists = []
        for artist in re.split("; | & ", card["Artist"]):
            if artist in artist_fixes.keys():
                artists.append(artist_fixes[artist])
            else:
                artists.append(artist)

        card["Artist"] = artists

        # Add rules to card
        card["Rulings"] = []
        for c in krcg_cards:
            if c["id"] == card["Id"] and "rulings" in c:
                for rule in c["rulings"]["text"]:
                    if match := re.match(r"(.*?)\[... \S+\].*", rule):
                        text = match.group(1)
                        text = re.sub(r"{The (.+?)}", r"{\1, The}", text)
                        text = text.replace("Thaumaturgy", "Blood Sorcery")
                        text = text.replace("Assamites", "Banu Haqim")
                        text = text.replace("Assamite", "Banu Haqim")
                        text = text.replace("Followers of Set", "Ministers")
                        text = text.replace("Follower of Set", "Minister")
                        text = re.sub(r"\[(\w+)\s*(\w*)\]", r"[\1\2]", text)
                        card["Rulings"].append(
                            {
                                "text": text,
                                "refs": {},
                            }
                        )

                for id in c["rulings"]["links"].keys():
                    for i, rule in enumerate(c["rulings"]["text"]):
                        if id in rule:
                            card["Rulings"][i]["refs"][id] = c["rulings"]["links"][id]

        # Add twda info
        card["Twd"] = 0
        for i in twda:
            for c in i["crypt"]["cards"]:
                if c["id"] == card["Id"]:
                    card["Twd"] += 1

        # Add Advancement info
        card["Advancement"] = ""
        for c in cards:
            if (
                    c["Name"] == card["Name"]
                    and c["Id"] != card["Id"]
                    and c["Group"] == card["Group"]
            ):
                isAdv = bool(card["Adv"])
                card["Advancement"] = [isAdv, int(c["Id"])]

        # Add new revision info
        card["New"] = False

        for c in ref_cards if ref_cards else cards:
            if (
                    c["Name"] == card["Name"]
                    and int(c["Id"]) < card["Id"]
                    and c["Group"] != card["Group"]
            ):
                card["New"] = True

        # Rename Assamite and Follower of Set
        if card["Clan"] == "Assamite":
            card["Clan"] = "Banu Haqim"

        if card["Clan"] == "Follower of Set":
            card["Clan"] = "Ministry"

        card["Card Text"] = (
            card["Card Text"]
            .replace("Assamites", "Banu Haqim")
            .replace("Assamite", "Banu Haqim")
        )

        card["Card Text"] = card["Card Text"].replace("Followers of Set", "Ministers")
        card["Card Text"] = card["Card Text"].replace("Follower of Set", "Minister")

        # Rename Thaumaturgy
        card["Card Text"] = card["Card Text"].replace("Thaumaturgy", "Blood Sorcery")

        # Prepare for export

        cardbase[card["Id"]] = {
            "ASCII Name": card["ASCII Name"],
            "Adv": card["Advancement"],
            "Artist": card["Artist"],
            "Banned": card["Banned"],
            "Capacity": card["Capacity"],
            "Card Text": card["Card Text"],
            "Clan": card["Clan"],
            "Disciplines": card["Disciplines"],
            "Group": card["Group"],
            "Id": card["Id"],
            "Name": card["Name"],
            "New": card["New"],
            "Rulings": card["Rulings"],
            "Sect": card["Sect"],
            "Set": card["Set"],
            "Title": card["Title"],
            "Twd": card["Twd"],
        }

    json.dump(cardbase, cardbase_file_min, separators=(",", ":"))
    json.dump(cardbase, cardbase_file, indent=4, separators=(",", ":"))


with open("vtescrypt.csv", "r", encoding="utf-8-sig") as cardbase_csv, open(
        "cardbase_crypt.json", "w", encoding="utf8"
) as cardbase_file, open(
    "cardbase_crypt.min.json", "w", encoding="utf8"
) as cardbase_file_min:
    cards = list(csv.DictReader(cardbase_csv))
    generate_cards(cards, cardbase_file, cardbase_file_min)

    try:
        with open(
                        "vtescrypt_playtest.csv", "r", encoding="utf-8-sig"
        ) as cardbase_csv_playtest, open(
                "cardbase_crypt_playtest.json", "w", encoding="utf8"
        ) as cardbase_file_playtest, open(
                "cardbase_crypt_playtest.min.json", "w", encoding="utf8"
        ) as cardbase_file_min_playtest:
                cards_playtest = list(csv.DictReader(cardbase_csv_playtest))
                generate_cards(cards_playtest, cardbase_file_playtest, cardbase_file_min_playtest, cards)

    except Exception:
            print(
                    "PLAYTEST DISABLED - NO CRYPT PLAYTEST FILES FOUND (CONTACT PLAYTEST COORDINATOR TO GET IT)"
            )

with open("vtescrypt.csv", "r", encoding="utf-8-sig") as cardbase_csv, open(
        "artistsCrypt.json", "w", encoding="utf8"
) as artists_file, open(
    "artistsCrypt.min.json", "w", encoding="utf8"
) as artists_file_min:
    generate_artists(cardbase_csv, artists_file, artists_file_min)
