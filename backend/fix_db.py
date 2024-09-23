from api import app, db
from models import Deck, User
import json

# NOT REQUIRED; USE ONLY AS TEMPLATE FOR FUTURE FIXES

with open("../frontend/public/data/cardbase_crypt.json", "r") as crypt_file, open("../frontend/public/data/cardbase_lib.json", "r") as library_file, open("../frontend/public/data/cardbase_lib_playtest.json", "r") as library_playtest_file, open("../frontend/public/data/cardbase_crypt_playtest.json", "r") as crypt_playtest_file:
    cardlist = sorted([*json.load(crypt_file).keys(), *json.load(library_file).keys(), *json.load(crypt_playtest_file).keys(),*json.load(library_playtest_file).keys(),])


with app.app_context():
    # REMOVE OLD PLAYTEST CARDS FROM DECKS
    # REPLACE CARDID FOR PLAYTEST CARDS AFTER RELEASE
    # changes = {
    # }
    # for deck in Deck.query.all():
    #     new_cards = {}
    #     new_used_cards = {}

    #     for k, v in deck.cards.items():
    #         if k in changes.keys():
    #             new_cards[changes[k]] = v
    #             print(f"{k} to {changes[k]} in deck")
    #             if k in deck.used_in_inventory:
    #                 print(f"{k} to {changes[k]} in used")
    #                 new_used_cards[changes[k]] = deck.used_in_inventory[k]

    #         elif str(k) not in cardlist:
    #             print(f"{k} deleted from deck")
    #             continue

    #         else:
    #             new_cards[k] = v
    #             if k in deck.used_in_inventory:
    #                 new_used_cards[k] = deck.used_in_inventory[k]


    #     deck.used_in_inventory = new_used_cards
    #     deck.cards = new_cards

    # CLEAR PLAYTEST REPORTS
    # for playtester in User.query.filter_by(playtester=True).all():
    #     if 'lang' in playtester.playtest_report:
    #         playtester.playtest_report = { 'lang': playtester.playtest_report['lang']}
    #     else:
    #         playtester.playtest_report = {}

    # db.session.commit()

    # UPDATE PLAYTEST PROFILE
    for u in User.query.all():
        if 'lang' in u.playtest_report:
            u.playtest_profile = {
                'lang': u.playtest_report['lang']
            }
            del u.playtest_report['lang']
        else:
            u.playtest_profile = {}

    db.session.commit()
