"""Refresh remix-data/item_names.json from the game's item name text (a/0/3/2 file 40).

The calc's Gen 7 item list keeps only items that exist in the game under that name
(plus every item in remix-data/item_effects.json).

Usage:  python tools/refresh_item_names.py "<Citra mods romfs folder>"
Then rebuild the calc (npm run compile).
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from refresh_ability_names import garc_files, text_lines, clean

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "remix-data", "item_names.json")

if __name__ == "__main__":
    files = garc_files(os.path.join(sys.argv[1], "a", "0", "3", "2"))
    names = []
    for n in text_lines(files[40])[1:]:
        n = clean(n).strip()
        if n and n not in names and not n.startswith("OLD "):
            names.append(n)
    json.dump(names, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print("wrote %d item names" % len(names))
