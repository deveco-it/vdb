import search_decks_components


def search_decks(queries, target):
    matches = []

    for q in queries:
        function_to_call = getattr(search_decks_components, "get_decks_by_" + q["option"])
        if not matches:
            matches = function_to_call(q["value"], target)
        else:
            matches = function_to_call(q["value"], matches)

        if not matches:
            break

    uniq_matches_ids = set()
    uniq_matches = []
    for d in matches:
        if d["deckid"] not in uniq_matches_ids:
            uniq_matches.append(d)
            uniq_matches_ids.add(d["deckid"])

    return uniq_matches
