"""Refresh remix-data/abilities.json from the game's text (a/0/3/2 files 101 = names, 102 = descriptions).

Writes the same format as the extractor's abilities.json ([name, desc] per ability, index = ability id - 1),
so a correct extractor file can simply replace it later.

Usage:  python tools/refresh_ability_names.py "<Citra mods romfs folder>"
Then rebuild the calc (npm run compile).
"""
import json, os, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "remix-data", "abilities.json")


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


def text_lines(b):
    lc = struct.unpack_from("<H", b, 2)[0]
    so = struct.unpack_from("<I", b, 0xC)[0]
    key, res = 0x7C89, []
    for i in range(lc):
        off, ln = struct.unpack_from("<IH", b, so + 4 + 8 * i)
        k, s = key, []
        for j in range(ln):
            c = struct.unpack_from("<H", b, so + off + 2 * j)[0] ^ k
            k = ((k << 3) | (k >> 13)) & 0xFFFF
            if c == 0:
                break
            s.append(chr(c))
        res.append("".join(s))
        key = (key + 0x2983) & 0xFFFF
    return res


def clean(t):
    # game private-use glyphs -> plain text
    return t.replace("\ue07f", "\u2019").replace("\u2019", "'").replace("\ue08e", "\u00e9").replace("\r", "")


def main():
    romfs = sys.argv[1]
    files = garc_files(os.path.join(romfs, "a", "0", "3", "2"))
    names, descs = text_lines(files[101]), text_lines(files[102])
    out = [[clean(names[i]), clean(descs[i]).replace("\n", " ")] for i in range(1, len(names))]
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    odd = sorted({c for n, d in out for c in n + d if ord(c) > 0x7E})
    print("wrote %d abilities; non-ASCII chars: %s" % (len(out), [hex(ord(c)) for c in odd]))


main()
