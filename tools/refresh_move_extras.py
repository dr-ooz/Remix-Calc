"""Refresh remix-data/move_extras.json from the game's move file (a/0/1/1).

Only needed when moves change in fields the extractor's moves.json doesn't include
(priority, hit count, drain/recoil, crit stage, contact, target, secondary effects).

Usage:  python tools/refresh_move_extras.py "<Citra mods romfs folder>"
Then rebuild the calc (npm run compile).
"""
import json, os, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
# pk3DS move flag bits used by Remix abilities (Iron Fist, Amplifier, Dancer, Sharpness, Strong Jaw,
# Bulletproof, Mega Launcher, Showstopper, Wind Rider)
FLAG_BITS = {7: "punch", 8: "sound", 16: "dance", 17: "slicing", 18: "bite", 19: "bullet",
             20: "pulse", 22: "showstopper", 26: "wind"}
EXTRAS = os.path.join(HERE, "..", "remix-data", "move_extras.json")

# ---- game file reading (only needed with --romfs) ----
def garc_files(path):
    d = open(path, "rb").read()
    hs = struct.unpack_from("<I", d, 4)[0]
    n = struct.unpack_from("<H", d, hs + 8)[0]
    fatb = hs + struct.unpack_from("<I", d, hs + 4)[0]
    data = struct.unpack_from("<I", d, 0x10)[0]
    out = []
    for i in range(n):
        o = struct.unpack_from("<I", d, hs + 12 + 4 * i)[0]
        s, e, l = struct.unpack_from("<III", d, fatb + 12 + o + 4)
        out.append(d[data + s:data + s + l])
    return out


def mini_pack(b):
    n = struct.unpack_from("<H", b, 2)[0]
    offs = [struct.unpack_from("<I", b, 4 + 4 * i)[0] for i in range(n + 1)]
    return [b[offs[i]:offs[i + 1]] for i in range(n)]


def refresh_extras(romfs):
    entries = mini_pack(garc_files(os.path.join(romfs, "a", "0", "1", "1"))[0])
    extras = {}
    for num, e in enumerate(entries):
        hits, inflict_pct, flinch = e[7], e[10], e[15]
        stat_pcts = e[27:30]
        extras[str(num)] = {
            "priority": struct.unpack_from("<b", e, 6)[0],
            "hitMin": hits & 0xF, "hitMax": hits >> 4,
            "drainRecoil": struct.unpack_from("<b", e, 18)[0],  # >0 drain %, <0 recoil %
            "crit": e[14],
            "target": e[20],
            "contact": bool(struct.unpack_from("<I", e, 36)[0] & 1),
            "secondary": bool(inflict_pct or flinch or any(stat_pcts)),
            "trap": struct.unpack_from("<H", e, 8)[0] == 8,
            "protect": bool(struct.unpack_from("<I", e, 36)[0] & 8),
            # Remix move flags (pk3DS flag bits): ability move lists
            "flags": [name for bit, name in FLAG_BITS.items() if struct.unpack_from("<I", e, 36)[0] >> bit & 1],  # blocked by Protect  # partial-trap condition (end-of-turn damage)
        }
    json.dump(extras, open(EXTRAS, "w"), indent=0)
    print("refreshed", EXTRAS, "from", romfs)



if __name__ == "__main__":
    refresh_extras(sys.argv[1])
