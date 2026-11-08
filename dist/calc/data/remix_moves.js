"use strict";
exports.__esModule = true;

exports.REMIX_MOVES = {
    "(No Move)": {
        "bp": 0,
        "category": "Status",
        "type": "Normal"
    },
    "Double Hit": {
        "bp": 35,
        "type": "Normal",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true
    },
    "Karate Chop": {
        "bp": 45,
        "type": "Fighting",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "willCrit": true,
        "makesContact": true
    },
    "Slap N' Dash": {
        "bp": 30,
        "type": "Fairy",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "multihit": 2,
        "makesContact": true
    },
    "OLD Comet Punch": {
        "bp": 15,
        "type": "Psychic",
        "category": "Physical",
        "zp": 140,
        "pp": 5,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Seismic Fist": {
        "bp": 90,
        "type": "Ground",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Gold Rush": {
        "bp": 30,
        "type": "Steel",
        "category": "Physical",
        "zp": 160,
        "pp": 5,
        "multihit": 3,
        "remix": {
            "highCrit": true,
            "useHigherStat": true
        }
    },
    "Fire Punch": {
        "bp": 80,
        "type": "Fire",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Ice Punch": {
        "bp": 80,
        "type": "Ice",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Thunder Punch": {
        "bp": 80,
        "type": "Electric",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Metal Claw": {
        "bp": 45,
        "type": "Steel",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "willCrit": true,
        "makesContact": true
    },
    "Vice Grip": {
        "bp": 60,
        "type": "Steel",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Guillotine": {
        "bp": 75,
        "type": "Steel",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "makesContact": true
    },
    "Chloroblast": {
        "bp": 120,
        "type": "Grass",
        "category": "Special",
        "zp": 200,
        "pp": 1,
        "willCrit": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "spa": 1
            },
            "chargeTurn": true
        }
    },
    "Swords Dance": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": -1
    },
    "Fury Cutter": {
        "bp": 60,
        "type": "Bug",
        "category": "Physical",
        "zp": 100,
        "pp": 15,
        "willCrit": true,
        "makesContact": true
    },
    "Gust": {
        "bp": 45,
        "type": "Flying",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Dual Wingbeat": {
        "bp": 40,
        "type": "Flying",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true
    },
    "Whirlwind": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Fly": {
        "bp": 90,
        "type": "Flying",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Hydro Fang": {
        "bp": 90,
        "type": "Water",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Whiplash": {
        "bp": 85,
        "type": "Normal",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Vine Lashes": {
        "bp": 35,
        "type": "Grass",
        "category": "Physical",
        "zp": 160,
        "pp": 15,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "perHitDrop": {
                "def": -1
            }
        }
    },
    "Step-On": {
        "bp": 65,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 1,
        "makesContact": true,
        "secondaries": true
    },
    "Double Kick": {
        "bp": 35,
        "type": "Fighting",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": 2,
        "makesContact": true
    },
    "Megaton Kick": {
        "bp": 120,
        "type": "Ground",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "High Jump Kick": {
        "bp": 130,
        "type": "Fighting",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "makesContact": true
    },
    "Rolling Kick": {
        "bp": 60,
        "type": "Fighting",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true
    },
    "Sand Sling": {
        "bp": 30,
        "type": "Ground",
        "category": "Special",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "weatherBoost": {
                "Sand": 1.5
            }
        }
    },
    "Headbutt": {
        "bp": 70,
        "type": "Normal",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Snipe Shot": {
        "bp": 50,
        "type": "Water",
        "category": "Special",
        "zp": 150,
        "pp": 5,
        "priority": 4,
        "willCrit": true,
        "secondaries": true
    },
    "Spike Cannon": {
        "bp": 25,
        "type": "Steel",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ]
    },
    "Hyper Drill": {
        "bp": 60,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "willCrit": true,
        "makesContact": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Pummel": {
        "bp": 25,
        "type": "Fighting",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Body Slam": {
        "bp": 95,
        "type": "Normal",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Constrict": {
        "bp": 60,
        "type": "Poison",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Take Down": {
        "bp": 105,
        "type": "Fighting",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Kerfuffle": {
        "bp": 120,
        "type": "Fairy",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Double-Edge": {
        "bp": 125,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Tail Wag": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Poison Dart": {
        "bp": 45,
        "type": "Poison",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Barb Barrage": {
        "bp": 25,
        "type": "Poison",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "secondaries": true
    },
    "Pin Missile": {
        "bp": 25,
        "type": "Bug",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ]
    },
    "Leer": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Jagged Fangs": {
        "bp": 90,
        "type": "Rock",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Growl": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Roar": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Sing": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 2
    },
    "Pendulum Wave": {
        "bp": 65,
        "type": "Psychic",
        "category": "Special",
        "zp": 130,
        "pp": 1,
        "priority": 4,
        "secondaries": true
    },
    "Sonic Boom": {
        "bp": 25,
        "type": "Flying",
        "category": "Special",
        "zp": 110,
        "pp": 10,
        "multihit": 3,
        "remix": {
            "noVanilla": true
        }
    },
    "Disable": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Caustic Acid": {
        "bp": 50,
        "type": "Poison",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -2
            }
        }
    },
    "Ignite": {
        "bp": 45,
        "type": "Fire",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Flamethrower": {
        "bp": 90,
        "type": "Fire",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Chill Out": {
        "bp": 0,
        "type": "Ice",
        "category": "Status",
        "pp": 5
    },
    "Water Gun": {
        "bp": 45,
        "type": "Water",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Hydro Pump": {
        "bp": 125,
        "type": "Water",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Surf": {
        "bp": 95,
        "type": "Water",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "target": "allAdjacent",
        "remix": {
            "lunarAuraBoost": 1.5
        }
    },
    "Ice Beam": {
        "bp": 90,
        "type": "Ice",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Blizzard": {
        "bp": 125,
        "type": "Ice",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Influx": {
        "bp": 45,
        "type": "Psychic",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Bubble Burst": {
        "bp": 60,
        "type": "Water",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "secondaries": true
    },
    "Aurora Beam": {
        "bp": 70,
        "type": "Ice",
        "category": "Special",
        "zp": 110,
        "pp": 10,
        "secondaries": true
    },
    "Hyper Beam": {
        "bp": 140,
        "type": "Normal",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "secondaries": true
    },
    "Fury Pecks": {
        "bp": 25,
        "type": "Flying",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Drill Peck": {
        "bp": 80,
        "type": "Flying",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Submission": {
        "bp": 140,
        "type": "Fighting",
        "category": "Physical",
        "zp": 200,
        "pp": 10,
        "recoil": [
            50,
            100
        ],
        "makesContact": true
    },
    "Low Kick": {
        "bp": 1,
        "type": "Fighting",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Counter": {
        "bp": 1,
        "type": "Fighting",
        "category": "Physical",
        "zp": 160,
        "pp": 2,
        "priority": -6,
        "makesContact": true
    },
    "Ancient Impact": {
        "bp": 1,
        "type": "Ground",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "priority": 4,
        "makesContact": true,
        "secondaries": true
    },
    "Thrash": {
        "bp": 140,
        "type": "Normal",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Siphon": {
        "bp": 45,
        "type": "Bug",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "drain": [
            100,
            100
        ]
    },
    "Mega Drain": {
        "bp": 60,
        "type": "Grass",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "drain": [
            75,
            100
        ]
    },
    "Leech Seed": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 2
    },
    "Growth": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 1
    },
    "Razor Leaf": {
        "bp": 45,
        "type": "Grass",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "willCrit": true,
        "target": "allAdjacentFoes"
    },
    "Solar Beam": {
        "bp": 135,
        "type": "Grass",
        "category": "Special",
        "zp": 180,
        "pp": 5
    },
    "Poison Powder": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 20
    },
    "Stun Spore": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5
    },
    "Sleep Powder": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 2
    },
    "Petal Dance": {
        "bp": 80,
        "type": "Grass",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "useHigherStat": true,
            "selfBoost": {
                "atk": 1,
                "spa": 1
            }
        }
    },
    "String Shot": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 5
    },
    "Dragon Burst": {
        "bp": 30,
        "type": "Dragon",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "multihit": 3,
        "remix": {
            "noVanilla": true
        }
    },
    "Fire Spin": {
        "bp": 60,
        "type": "Fire",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Triple Jolt": {
        "bp": 25,
        "type": "Electric",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "multihit": 3
    },
    "Thunderbolt": {
        "bp": 90,
        "type": "Electric",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Thunder Wave": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 5
    },
    "Thunder": {
        "bp": 125,
        "type": "Electric",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true
    },
    "Sugar Rush": {
        "bp": 50,
        "type": "Fairy",
        "category": "Physical",
        "zp": 90,
        "pp": 2,
        "priority": 4,
        "secondaries": true
    },
    "Earthquake": {
        "bp": 100,
        "type": "Ground",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "target": "allAdjacent"
    },
    "Fissure": {
        "bp": 130,
        "type": "Ground",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Dig": {
        "bp": 75,
        "type": "Ground",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Toxic": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 20
    },
    "Mind Pulse": {
        "bp": 60,
        "type": "Psychic",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "secondaries": true
    },
    "Psychic": {
        "bp": 90,
        "type": "Psychic",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Hypnosis": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Meditate": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 3
    },
    "Agility": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1,
        "priority": -1
    },
    "Quick Attack": {
        "bp": 45,
        "type": "Normal",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Rage": {
        "bp": 60,
        "type": "Normal",
        "category": "Physical",
        "zp": 100,
        "pp": 10,
        "makesContact": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Teleport": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 10,
        "priority": -6
    },
    "Soul Absorb": {
        "bp": 1,
        "type": "Ghost",
        "category": "Special",
        "zp": 100,
        "pp": 5,
        "drain": [
            100,
            100
        ]
    },
    "Mimic": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Screech": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Water Shuriken": {
        "bp": 30,
        "type": "Water",
        "category": "Special",
        "zp": 190,
        "pp": 10,
        "multihit": [
            2,
            5
        ],
        "remix": {
            "useHigherStat": true
        }
    },
    "Recover": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Concentrate": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 3
    },
    "Sleep Mode": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 3,
        "priority": 4
    },
    "Contaminate": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 5
    },
    "Eerie Wave": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 2
    },
    "Withdraw": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 2
    },
    "Defense Curl": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 3
    },
    "Barrier": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Light Screen": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Dark Haze": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 10
    },
    "Reflect": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Focus Energy": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Bide": {
        "bp": 1,
        "type": "Normal",
        "category": "Physical",
        "zp": 130,
        "pp": 5,
        "priority": 1,
        "makesContact": true
    },
    "Metronome": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 10
    },
    "Mirror Move": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Detonate": {
        "bp": 250,
        "type": "Fire",
        "category": "Special",
        "zp": 250,
        "pp": 1,
        "target": "allAdjacent",
        "secondaries": true,
        "breaksProtect": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Egg Cannon": {
        "bp": 35,
        "type": "Normal",
        "category": "Physical",
        "zp": 190,
        "pp": 5,
        "multihit": 3,
        "remix": {
            "matchUserType": true
        }
    },
    "Devious Lick": {
        "bp": 20,
        "type": "Ghost",
        "category": "Physical",
        "zp": 100,
        "pp": 2,
        "makesContact": true,
        "secondaries": true
    },
    "Decompose": {
        "bp": 45,
        "type": "Poison",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "drain": [
            100,
            100
        ],
        "target": "allAdjacentFoes"
    },
    "Sludge Fling": {
        "bp": 60,
        "type": "Poison",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "secondaries": true
    },
    "Bone Club": {
        "bp": 65,
        "type": "Ground",
        "category": "Physical",
        "zp": 100,
        "pp": 3,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "groundsTarget": true
        }
    },
    "Fire Blast": {
        "bp": 125,
        "type": "Fire",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true
    },
    "Wave Crash": {
        "bp": 120,
        "type": "Water",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Clamp Down": {
        "bp": 35,
        "type": "Water",
        "category": "Physical",
        "zp": 100,
        "pp": 5,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Swift": {
        "bp": 45,
        "type": "Normal",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "target": "allAdjacentFoes"
    },
    "Skull Bash": {
        "bp": 140,
        "type": "Normal",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "matchUserType": true,
            "selfBoost": {
                "atk": 1
            },
            "chargeTurn": true
        }
    },
    "Burning Barrage": {
        "bp": 25,
        "type": "Fire",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "multihit": [
            2,
            5
        ],
        "secondaries": true
    },
    "Vine Wrap": {
        "bp": 60,
        "type": "Grass",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Amnesia": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Brainfreeze": {
        "bp": 20,
        "type": "Steel",
        "category": "Special",
        "zp": 100,
        "pp": 1,
        "priority": 4,
        "secondaries": true
    },
    "Soft-Boiled": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Divebomb": {
        "bp": 130,
        "type": "Flying",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "makesContact": true
    },
    "Glare": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Brain Drain": {
        "bp": 75,
        "type": "Psychic",
        "category": "Special",
        "zp": 120,
        "pp": 10,
        "drain": [
            100,
            100
        ]
    },
    "Poison Gas": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 5
    },
    "Triple Cannonade": {
        "bp": 35,
        "type": "Steel",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "multihit": 3
    },
    "Leech Life": {
        "bp": 80,
        "type": "Bug",
        "category": "Physical",
        "zp": 130,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Gloomy Kiss": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 1,
        "makesContact": true
    },
    "Sky Attack": {
        "bp": 120,
        "type": "Flying",
        "category": "Physical",
        "zp": 200,
        "pp": 1,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "atk": 1
            },
            "chargeTurn": true
        }
    },
    "Mewgenics": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 10,
        "priority": 6
    },
    "Dribble Drain": {
        "bp": 45,
        "type": "Water",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "drain": [
            100,
            100
        ],
        "target": "allAdjacentFoes"
    },
    "Dizzying Punches": {
        "bp": 35,
        "type": "Psychic",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "multihit": 3,
        "makesContact": true,
        "secondaries": true
    },
    "Spore": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 1
    },
    "Flash": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Brainwave": {
        "bp": 90,
        "type": "Psychic",
        "category": "Special",
        "zp": 160,
        "pp": 5,
        "remix": {
            "statusBoost": {
                "slp": 1.5
            }
        }
    },
    "Metal Maw": {
        "bp": 90,
        "type": "Steel",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Acid Armor": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 1
    },
    "Crabhammer": {
        "bp": 80,
        "type": "Water",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "willCrit": true,
        "makesContact": true
    },
    "Explosion": {
        "bp": 250,
        "type": "Normal",
        "category": "Special",
        "zp": 250,
        "pp": 1,
        "willCrit": true,
        "target": "allAdjacent",
        "breaksProtect": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Fury Swipes": {
        "bp": 25,
        "type": "Dark",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Bonemerang": {
        "bp": 50,
        "type": "Ground",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "multihit": 2,
        "secondaries": true,
        "remix": {
            "groundsTarget": true
        }
    },
    "Rest": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Rock Slide": {
        "bp": 120,
        "type": "Rock",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "priority": -5,
        "target": "allAdjacentFoes"
    },
    "Hyper Fang": {
        "bp": 80,
        "type": "Normal",
        "category": "Physical",
        "zp": 190,
        "pp": 10,
        "willCrit": true,
        "makesContact": true
    },
    "Fortify": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 5
    },
    "Conversion": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Tri Attack": {
        "bp": 35,
        "type": "Normal",
        "category": "Special",
        "zp": 170,
        "pp": 5,
        "multihit": 3,
        "secondaries": true
    },
    "Super Fang": {
        "bp": 1,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 1,
        "priority": 4,
        "makesContact": true,
        "secondaries": true
    },
    "Slash": {
        "bp": 80,
        "type": "Normal",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Substitute": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 3
    },
    "Struggle": {
        "bp": 50,
        "type": "Normal",
        "category": "Physical",
        "zp": 1,
        "pp": 1,
        "makesContact": true
    },
    "Sketch": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 7
    },
    "Triple Kick": {
        "bp": 30,
        "type": "Fighting",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "multihit": 3,
        "willCrit": true,
        "makesContact": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Thief": {
        "bp": 60,
        "type": "Dark",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "remix": {
            "stealBoost": true
        }
    },
    "Spider Web": {
        "bp": 20,
        "type": "Bug",
        "category": "Special",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "secondaries": true
    },
    "Look-Out": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Night Terror": {
        "bp": 50,
        "type": "Dark",
        "category": "Special",
        "zp": 100,
        "pp": 5,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Flame Wheel": {
        "bp": 60,
        "type": "Fire",
        "category": "Physical",
        "zp": 100,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Snore": {
        "bp": 50,
        "type": "Normal",
        "category": "Special",
        "zp": 120,
        "pp": 5,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Curse": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 5
    },
    "Flail": {
        "bp": 1,
        "type": "Normal",
        "category": "Physical",
        "zp": 200,
        "pp": 1,
        "makesContact": true
    },
    "Arcane Fangs": {
        "bp": 85,
        "type": "Dragon",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Aeroblast": {
        "bp": 130,
        "type": "Flying",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Cotton Spore": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 2
    },
    "Reversal": {
        "bp": 1,
        "type": "Fighting",
        "category": "Physical",
        "zp": 200,
        "pp": 1,
        "makesContact": true
    },
    "Soul Shed": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 3,
        "priority": 4
    },
    "Frost Flurry": {
        "bp": 45,
        "type": "Ice",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "target": "allAdjacentFoes"
    },
    "Protect": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Mach Punch": {
        "bp": 45,
        "type": "Fighting",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Scary Face": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Cheap Shot": {
        "bp": 65,
        "type": "Dark",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true,
        "remix": {
            "statusBoost": {
                "any": 2
            }
        }
    },
    "Dreamy Kiss": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 2
    },
    "Belly Drum": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Sludge Bomb": {
        "bp": 90,
        "type": "Poison",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Mud Shot": {
        "bp": 45,
        "type": "Ground",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "remix": {
            "mudslideBoost": 1.3
        }
    },
    "Scum Shot": {
        "bp": 50,
        "type": "Poison",
        "category": "Special",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "secondaries": true
    },
    "Spikes": {
        "bp": 0,
        "type": "Ground",
        "category": "Status",
        "pp": 10
    },
    "Zap Cannon": {
        "bp": 130,
        "type": "Electric",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Scorching Sands": {
        "bp": 60,
        "type": "Ground",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "weatherBoost": {
                "Sand": 1.5
            }
        }
    },
    "Destiny Bond": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Perish Song": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 1
    },
    "Icy Wind": {
        "bp": 60,
        "type": "Ice",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Burning Bulwark": {
        "bp": 0,
        "type": "Fire",
        "category": "Status",
        "pp": 2,
        "priority": 6
    },
    "Bone Rush": {
        "bp": 50,
        "type": "Ground",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "remix": {
            "groundsTarget": true
        }
    },
    "Take-Aim": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 1
    },
    "Raging Fury": {
        "bp": 130,
        "type": "Fire",
        "category": "Physical",
        "zp": 190,
        "pp": 5,
        "makesContact": true
    },
    "Sandstorm": {
        "bp": 0,
        "type": "Rock",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Giga Drain": {
        "bp": 75,
        "type": "Grass",
        "category": "Special",
        "zp": 120,
        "pp": 10,
        "drain": [
            50,
            100
        ]
    },
    "Endure": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Charm": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 2
    },
    "Roll-Out": {
        "bp": 90,
        "type": "Rock",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "makesContact": true
    },
    "Papercut": {
        "bp": 60,
        "type": "Grass",
        "category": "Physical",
        "zp": 190,
        "pp": 10,
        "willCrit": true,
        "makesContact": true,
        "remix": {
            "superEffectiveVs": [
                "Grass",
                "Steel"
            ]
        }
    },
    "Bait N' Switch": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 2
    },
    "Milk Drink": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Spark": {
        "bp": 45,
        "type": "Electric",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Creeping Strike": {
        "bp": 45,
        "type": "Bug",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Steel Wingbeat": {
        "bp": 40,
        "type": "Steel",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "perHitDrop": {
                "def": -1
            }
        }
    },
    "Mesmer-Eyes": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Attract": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 15
    },
    "Lucid Dream": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": 1
    },
    "Heal Bell": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Hoodwink": {
        "bp": 85,
        "type": "Fairy",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Special Delivery": {
        "bp": 45,
        "type": "Fairy",
        "category": "Physical",
        "zp": 170,
        "pp": 5,
        "multihit": 3,
        "remix": {
            "useHigherStat": true
        }
    },
    "Hit N' Run": {
        "bp": 70,
        "type": "Dark",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true
    },
    "Safeguard": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Pain Split": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 5
    },
    "Infernal Parade": {
        "bp": 125,
        "type": "Ghost",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true
    },
    "Aftershock": {
        "bp": 140,
        "type": "Ground",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "priority": -5,
        "target": "allAdjacent"
    },
    "Knockout Punch": {
        "bp": 125,
        "type": "Fighting",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Megahorn": {
        "bp": 140,
        "type": "Bug",
        "category": "Physical",
        "zp": 190,
        "pp": 10,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Dragon Breath": {
        "bp": 75,
        "type": "Dragon",
        "category": "Special",
        "zp": 120,
        "pp": 20,
        "secondaries": true
    },
    "Baton Pass": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 10,
        "priority": -6
    },
    "Encore": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Pursuit": {
        "bp": 75,
        "type": "Dark",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true
    },
    "Rapid Spin": {
        "bp": 40,
        "type": "Normal",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Sweet Scent": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5
    },
    "Iron Tail": {
        "bp": 95,
        "type": "Steel",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Laceration": {
        "bp": 80,
        "type": "Steel",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Skirmish": {
        "bp": 70,
        "type": "Fighting",
        "category": "Physical",
        "zp": 110,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Morning Sun": {
        "bp": 0,
        "type": "Fire",
        "category": "Status",
        "pp": 5
    },
    "Synthesis": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5
    },
    "Moonlight": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5
    },
    "Flashbang": {
        "bp": 50,
        "type": "Normal",
        "category": "Special",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Cross Chop": {
        "bp": 80,
        "type": "Fighting",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Twister": {
        "bp": 90,
        "type": "Dragon",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "weatherBoost": {
                "Rain": 1.5
            }
        }
    },
    "Rain Dance": {
        "bp": 0,
        "type": "Water",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Sunny Day": {
        "bp": 0,
        "type": "Fire",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Crunch": {
        "bp": 90,
        "type": "Dark",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Mirror Coat": {
        "bp": 1,
        "type": "Psychic",
        "category": "Special",
        "zp": 160,
        "pp": 2,
        "priority": -6
    },
    "Psych Up": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Extreme Speed": {
        "bp": 80,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 5,
        "priority": 3,
        "makesContact": true
    },
    "Ancient Power": {
        "bp": 75,
        "type": "Rock",
        "category": "Special",
        "zp": 120,
        "pp": 10,
        "secondaries": true
    },
    "Shadow Ball": {
        "bp": 90,
        "type": "Ghost",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Future Sight": {
        "bp": 140,
        "type": "Psychic",
        "category": "Special",
        "zp": 200,
        "pp": 10
    },
    "Boulder Bash": {
        "bp": 85,
        "type": "Rock",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Whirlpool": {
        "bp": 60,
        "type": "Water",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Beat Up": {
        "bp": 1,
        "type": "Dark",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "multihit": 6,
        "makesContact": true
    },
    "Fake Out": {
        "bp": 40,
        "type": "Normal",
        "category": "Physical",
        "zp": 90,
        "pp": 5,
        "priority": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Uproar": {
        "bp": 85,
        "type": "Fighting",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "statusBoost": {
                "slp": 1.5
            }
        }
    },
    "Stockpile": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 10
    },
    "Spew Out": {
        "bp": 150,
        "type": "Poison",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "willCrit": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -2
            }
        }
    },
    "Swallow": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 10,
        "priority": 4
    },
    "Heat Wave": {
        "bp": 60,
        "type": "Fire",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Snowscape": {
        "bp": 0,
        "type": "Ice",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Torment": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 2
    },
    "Curtain Call": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 2
    },
    "Will-O-Wisp": {
        "bp": 0,
        "type": "Fire",
        "category": "Status",
        "pp": 2
    },
    "Bitter Malice": {
        "bp": 60,
        "type": "Ghost",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "secondaries": true
    },
    "Facade": {
        "bp": 75,
        "type": "Normal",
        "category": "Physical",
        "zp": 150,
        "pp": 20,
        "makesContact": true
    },
    "Ice Breaker": {
        "bp": 75,
        "type": "Ice",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "remix": {
            "superEffectiveVs": [
                "Ice"
            ]
        }
    },
    "Smelling Salts": {
        "bp": 70,
        "type": "Fighting",
        "category": "Physical",
        "zp": 180,
        "pp": 3,
        "makesContact": true,
        "secondaries": true
    },
    "Follow Me": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Nature Power": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "zp": 150,
        "pp": 15
    },
    "Charge-Up": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 1,
        "priority": -1
    },
    "Taunt": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 20
    },
    "Helping Hand": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 7
    },
    "Trick": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Role Play": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Wish": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 10
    },
    "Cat's Cradle": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Ingrain": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 1
    },
    "Superpower": {
        "bp": 130,
        "type": "Fighting",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Magic Coat": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": 4
    },
    "Recycle": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Temper Flare": {
        "bp": 60,
        "type": "Fire",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "target": "allAdjacentFoes",
        "makesContact": true,
        "secondaries": true
    },
    "Brick Break": {
        "bp": 85,
        "type": "Fighting",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Yawn": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 2
    },
    "Knock Off": {
        "bp": 50,
        "type": "Dark",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true
    },
    "Endeavor": {
        "bp": 1,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 1,
        "makesContact": true
    },
    "Eruption": {
        "bp": 150,
        "type": "Fire",
        "category": "Special",
        "zp": 190,
        "pp": 5,
        "target": "allAdjacentFoes"
    },
    "Skill Swap": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Artist's Block": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Molt": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 5
    },
    "Spectral Shroud": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Snatch": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 10,
        "priority": 6
    },
    "Secret Power": {
        "bp": 70,
        "type": "Water",
        "category": "Physical",
        "zp": 160,
        "pp": 20
    },
    "Dive": {
        "bp": 75,
        "type": "Water",
        "category": "Physical",
        "zp": 120,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Force Palm": {
        "bp": 60,
        "type": "Fighting",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Camouflage": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Power Glow": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Scale Shot": {
        "bp": 25,
        "type": "Dragon",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Feather Flurry": {
        "bp": 75,
        "type": "Flying",
        "category": "Special",
        "zp": 110,
        "pp": 10,
        "secondaries": true
    },
    "Feather Dance": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 2
    },
    "Teeter Dance": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Blaze Kick": {
        "bp": 120,
        "type": "Fire",
        "category": "Physical",
        "zp": 170,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Mudslide": {
        "bp": 0,
        "type": "Ground",
        "category": "Status",
        "pp": 10
    },
    "Ice Tomb": {
        "bp": 60,
        "type": "Ice",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "secondaries": true
    },
    "Thorn Thrust": {
        "bp": 25,
        "type": "Grass",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "multihit": [
            2,
            5
        ]
    },
    "Slack Off": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Hyper Voice": {
        "bp": 95,
        "type": "Normal",
        "category": "Special",
        "zp": 150,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Poison Fang": {
        "bp": 80,
        "type": "Poison",
        "category": "Physical",
        "zp": 120,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Jagged Edge": {
        "bp": 80,
        "type": "Rock",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Blast Burn": {
        "bp": 130,
        "type": "Fire",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Hydro Cannon": {
        "bp": 130,
        "type": "Water",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Meteor Mash": {
        "bp": 100,
        "type": "Psychic",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Spook": {
        "bp": 45,
        "type": "Ghost",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Weather Ball": {
        "bp": 50,
        "type": "Normal",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "secondaries": true
    },
    "Aromatherapy": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 1
    },
    "Fake Tears": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Air Cutter": {
        "bp": 45,
        "type": "Flying",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "willCrit": true,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Overheat": {
        "bp": 120,
        "type": "Fire",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "secondaries": true
    },
    "Sniff Out": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 20
    },
    "Rock Tomb": {
        "bp": 60,
        "type": "Rock",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "secondaries": true
    },
    "Pollen Puff": {
        "bp": 60,
        "type": "Bug",
        "category": "Special",
        "zp": 100,
        "pp": 20
    },
    "Metallic Noise": {
        "bp": 85,
        "type": "Steel",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Grass Whistle": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 2
    },
    "Tickle": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "makesContact": true
    },
    "Cosmic Power": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Water Spout": {
        "bp": 150,
        "type": "Water",
        "category": "Special",
        "zp": 190,
        "pp": 5,
        "target": "allAdjacentFoes"
    },
    "Signal Beam": {
        "bp": 80,
        "type": "Bug",
        "category": "Special",
        "zp": 130,
        "pp": 10,
        "secondaries": true
    },
    "Shadow Punch": {
        "bp": 80,
        "type": "Ghost",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Extrasensory": {
        "bp": 80,
        "type": "Psychic",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "secondaries": true
    },
    "Sky Uppercut": {
        "bp": 85,
        "type": "Fighting",
        "category": "Physical",
        "zp": 150,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "superEffectiveVs": [
                "Flying"
            ]
        }
    },
    "Sand Vortex": {
        "bp": 80,
        "type": "Ground",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "secondaries": true,
        "remix": {
            "trap": true,
            "weatherBoost": {
                "Sand": 1.5
            }
        }
    },
    "Sheer Cold": {
        "bp": 75,
        "type": "Ice",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true
    },
    "Mud Shower": {
        "bp": 120,
        "type": "Ground",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "target": "allAdjacentFoes",
        "remix": {
            "mudslideBoost": 1.3
        }
    },
    "Bullet Seed": {
        "bp": 25,
        "type": "Grass",
        "category": "Physical",
        "zp": 110,
        "pp": 10,
        "multihit": [
            2,
            5
        ]
    },
    "Aerial Ace": {
        "bp": 45,
        "type": "Flying",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Icicle Spear": {
        "bp": 25,
        "type": "Ice",
        "category": "Physical",
        "zp": 110,
        "pp": 10,
        "multihit": [
            2,
            5
        ]
    },
    "Iron Defense": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 1
    },
    "Enchantment": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Howl": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 2
    },
    "Savage Slash": {
        "bp": 80,
        "type": "Dragon",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Frenzy Plant": {
        "bp": 130,
        "type": "Grass",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Bulk Up": {
        "bp": 0,
        "type": "Fighting",
        "category": "Status",
        "pp": 2,
        "priority": -1
    },
    "Bounce": {
        "bp": 75,
        "type": "Flying",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Mud Barrage": {
        "bp": 25,
        "type": "Ground",
        "category": "Special",
        "zp": 110,
        "pp": 15,
        "multihit": 3,
        "remix": {
            "mudslideBoost": 1.3
        }
    },
    "Poison Tail": {
        "bp": 95,
        "type": "Poison",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Covet": {
        "bp": 60,
        "type": "Fairy",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "remix": {
            "stealBoost": true
        }
    },
    "Volt Tackle": {
        "bp": 120,
        "type": "Electric",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Magical Leaf": {
        "bp": 75,
        "type": "Grass",
        "category": "Special",
        "zp": 120,
        "pp": 10,
        "secondaries": true
    },
    "Wash Away": {
        "bp": 0,
        "type": "Water",
        "category": "Status",
        "pp": 5,
        "priority": -6
    },
    "Calm Mind": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": -1
    },
    "Leaf Blade": {
        "bp": 80,
        "type": "Grass",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Dragon Dance": {
        "bp": 0,
        "type": "Dragon",
        "category": "Status",
        "pp": 2,
        "priority": -1
    },
    "Rock Blast": {
        "bp": 25,
        "type": "Rock",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ]
    },
    "Shock Wave": {
        "bp": 45,
        "type": "Electric",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Water Pulse": {
        "bp": 75,
        "type": "Water",
        "category": "Special",
        "zp": 120,
        "pp": 20,
        "secondaries": true
    },
    "Doom Desire": {
        "bp": 140,
        "type": "Dark",
        "category": "Special",
        "zp": 200,
        "pp": 5
    },
    "Psycho Boost": {
        "bp": 130,
        "type": "Psychic",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Roost": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 5
    },
    "Gravity": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Piercing Gaze": {
        "bp": 50,
        "type": "Psychic",
        "category": "Special",
        "zp": 100,
        "pp": 5,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "matchUserType": true
        }
    },
    "Shroom Smack": {
        "bp": 60,
        "type": "Fighting",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "statusBoost": {
                "slp": 1.5
            }
        }
    },
    "Hammer Arm": {
        "bp": 120,
        "type": "Fighting",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Gyro Ball": {
        "bp": 90,
        "type": "Steel",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "priority": -6,
        "makesContact": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Rainbow Veil": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5
    },
    "Chilling Water": {
        "bp": 50,
        "type": "Water",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "secondaries": true
    },
    "Natural Gift": {
        "bp": 100,
        "type": "Normal",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "remix": {
            "useHigherStat": true
        }
    },
    "Think Fast": {
        "bp": 45,
        "type": "Psychic",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true,
        "breaksProtect": true
    },
    "Pluck": {
        "bp": 60,
        "type": "Flying",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "berryBoost": true
        }
    },
    "Tailwind": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 5
    },
    "Pressure Point": {
        "bp": 0,
        "type": "Fighting",
        "category": "Status",
        "pp": 5
    },
    "Metal Burst": {
        "bp": 1,
        "type": "Steel",
        "category": "Physical",
        "zp": 160,
        "pp": 2,
        "priority": -6
    },
    "U-turn": {
        "bp": 70,
        "type": "Bug",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true
    },
    "Close Combat": {
        "bp": 120,
        "type": "Fighting",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true
    },
    "Payback": {
        "bp": 120,
        "type": "Dark",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "priority": -5,
        "makesContact": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Assurance": {
        "bp": 75,
        "type": "Dark",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true
    },
    "Lockdown": {
        "bp": 60,
        "type": "Steel",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "priority": 4,
        "willCrit": true,
        "secondaries": true
    },
    "Fling": {
        "bp": 1,
        "type": "Normal",
        "category": "Physical",
        "zp": 170,
        "pp": 3,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "flingPower": {
                "Flame Orb": 60,
                "Toxic Orb": 60,
                "Light Ball": 60,
                "Lagging Tail": 100
            }
        }
    },
    "Status Shift": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": 4
    },
    "Royal Flush": {
        "bp": 30,
        "type": "Psychic",
        "category": "Special",
        "zp": 160,
        "pp": 5,
        "multihit": 3,
        "remix": {
            "highCrit": true,
            "matchUserType": true,
            "useHigherStat": true
        }
    },
    "Heal Block": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Chromosome Crush": {
        "bp": 1,
        "type": "Psychic",
        "category": "Special",
        "zp": 190,
        "pp": 5
    },
    "Power Trick": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1
    },
    "Acid Reflux": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 5
    },
    "Lucky Chant": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Me First": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Copycat": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Power Swap": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Guard Swap": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Blindside": {
        "bp": 50,
        "type": "Dark",
        "category": "Physical",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "makesContact": true,
        "secondaries": true
    },
    "Last Resort": {
        "bp": 130,
        "type": "Normal",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "makesContact": true
    },
    "Worry Seed": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5
    },
    "Sucker Punch": {
        "bp": 70,
        "type": "Dark",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "priority": 2,
        "makesContact": true
    },
    "Toxic Spikes": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 5
    },
    "Heart Swap": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 2,
        "priority": 4
    },
    "Rehydrate": {
        "bp": 0,
        "type": "Water",
        "category": "Status",
        "pp": 5
    },
    "Magnet Rise": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 1
    },
    "Flare Blitz": {
        "bp": 120,
        "type": "Fire",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Force Waves": {
        "bp": 35,
        "type": "Fighting",
        "category": "Special",
        "zp": 110,
        "pp": 20,
        "multihit": 2,
        "secondaries": true
    },
    "Aura Sphere": {
        "bp": 90,
        "type": "Fighting",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Rock Polish": {
        "bp": 0,
        "type": "Rock",
        "category": "Status",
        "pp": 1
    },
    "Poison Jab": {
        "bp": 85,
        "type": "Poison",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Dark Pulse": {
        "bp": 90,
        "type": "Dark",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Night Slash": {
        "bp": 80,
        "type": "Dark",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Aqua Tail": {
        "bp": 95,
        "type": "Water",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Seed Bomb": {
        "bp": 90,
        "type": "Grass",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Air Slash": {
        "bp": 80,
        "type": "Flying",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "remix": {
            "highCrit": true
        },
        "secondaries": true
    },
    "X-Scissor": {
        "bp": 80,
        "type": "Bug",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Bug Buzz": {
        "bp": 95,
        "type": "Bug",
        "category": "Special",
        "zp": 150,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Dragon Pulse": {
        "bp": 95,
        "type": "Dragon",
        "category": "Special",
        "zp": 160,
        "pp": 15,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Dragon Rush": {
        "bp": 125,
        "type": "Dragon",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Power Gem": {
        "bp": 95,
        "type": "Rock",
        "category": "Special",
        "zp": 140,
        "pp": 10,
        "secondaries": true
    },
    "Drain Punch": {
        "bp": 75,
        "type": "Fighting",
        "category": "Physical",
        "zp": 120,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Vacuum Wave": {
        "bp": 45,
        "type": "Fighting",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Focus Blast": {
        "bp": 125,
        "type": "Fighting",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Energy Ball": {
        "bp": 90,
        "type": "Grass",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Brave Bird": {
        "bp": 120,
        "type": "Flying",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Earth Power": {
        "bp": 100,
        "type": "Ground",
        "category": "Special",
        "zp": 150,
        "pp": 10,
        "secondaries": true
    },
    "Engorge": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Giga Impact": {
        "bp": 140,
        "type": "Normal",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Nasty Plot": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 1,
        "priority": -1
    },
    "Bullet Punch": {
        "bp": 45,
        "type": "Steel",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Avalanche": {
        "bp": 120,
        "type": "Ice",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "priority": -5,
        "target": "allAdjacentFoes",
        "remix": {
            "weatherBoost": {
                "Hail": 1.25
            }
        }
    },
    "Ice Shard": {
        "bp": 45,
        "type": "Ice",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Shadow Slash": {
        "bp": 80,
        "type": "Ghost",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "remix": {
            "highCrit": true
        }
    },
    "Thunder Fang": {
        "bp": 80,
        "type": "Electric",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Ice Fang": {
        "bp": 80,
        "type": "Ice",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Fire Fang": {
        "bp": 80,
        "type": "Fire",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Shadow Sneak": {
        "bp": 45,
        "type": "Ghost",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Mud Bomb": {
        "bp": 90,
        "type": "Ground",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true,
        "remix": {
            "mudslideBoost": 1.3
        }
    },
    "Psycho Cut": {
        "bp": 80,
        "type": "Psychic",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Zen Headbutt": {
        "bp": 85,
        "type": "Psychic",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Mirror Shot": {
        "bp": 60,
        "type": "Steel",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "secondaries": true
    },
    "Flash Cannon": {
        "bp": 120,
        "type": "Steel",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "secondaries": true
    },
    "Craggy Crash": {
        "bp": 105,
        "type": "Rock",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Smoke Out": {
        "bp": 0,
        "type": "Flying",
        "category": "Status",
        "pp": 5
    },
    "Trick Room": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2
    },
    "Draco Meteor": {
        "bp": 140,
        "type": "Dragon",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "secondaries": true,
        "remix": {
            "gravityBoost": 1.5,
            "lunarAuraBoost": 1.5
        }
    },
    "Overload": {
        "bp": 70,
        "type": "Electric",
        "category": "Special",
        "zp": 110,
        "pp": 15,
        "target": "allAdjacent",
        "secondaries": true,
        "remix": {
            "statusBoost": {
                "par": 2
            }
        }
    },
    "Afterburner": {
        "bp": 70,
        "type": "Fire",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "target": "allAdjacent",
        "secondaries": true,
        "remix": {
            "statusBoost": {
                "brn": 2
            }
        }
    },
    "Leaf Storm": {
        "bp": 130,
        "type": "Grass",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Power Whip": {
        "bp": 120,
        "type": "Grass",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Rock Wrecker": {
        "bp": 130,
        "type": "Rock",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Cross Poison": {
        "bp": 80,
        "type": "Poison",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        },
        "secondaries": true
    },
    "Gunk Shot": {
        "bp": 75,
        "type": "Poison",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "secondaries": true
    },
    "Iron Head": {
        "bp": 85,
        "type": "Steel",
        "category": "Physical",
        "zp": 130,
        "pp": 15,
        "makesContact": true,
        "secondaries": true
    },
    "Magnet Bomb": {
        "bp": 75,
        "type": "Steel",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "remix": {
            "superEffectiveVs": [
                "Electric",
                "Steel"
            ]
        }
    },
    "Stone Edge": {
        "bp": 75,
        "type": "Rock",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "willCrit": true
    },
    "Captivate": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 20
    },
    "Stealth Rock": {
        "bp": 0,
        "type": "Rock",
        "category": "Status",
        "pp": 5
    },
    "Grass Knot": {
        "bp": 1,
        "type": "Grass",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Chatter": {
        "bp": 100,
        "type": "Flying",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Scorched Earth": {
        "bp": 125,
        "type": "Ground",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Bug Biting": {
        "bp": 35,
        "type": "Bug",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "berryBoost": true
        }
    },
    "Charge Beam": {
        "bp": 40,
        "type": "Electric",
        "category": "Special",
        "zp": 90,
        "pp": 2,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "spa": 1
            }
        }
    },
    "Wood Hammer": {
        "bp": 120,
        "type": "Grass",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Aqua Jet": {
        "bp": 45,
        "type": "Water",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Attack Order": {
        "bp": 100,
        "type": "Bug",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "willCrit": true,
        "target": "allAdjacentFoes"
    },
    "Defend Order": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 1,
        "priority": 2
    },
    "Heal Order": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Head Smash": {
        "bp": 140,
        "type": "Rock",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Wallop": {
        "bp": 25,
        "type": "Fairy",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Aurora Burst": {
        "bp": 120,
        "type": "Ice",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Subspace Tear": {
        "bp": 75,
        "type": "Psychic",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true
    },
    "Lunar Blessing": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5
    },
    "Titan's Grip": {
        "bp": 1,
        "type": "Ground",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Magma Storm": {
        "bp": 100,
        "type": "Fire",
        "category": "Special",
        "zp": 180,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Dark Void": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 2
    },
    "Seed Flare": {
        "bp": 120,
        "type": "Grass",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "secondaries": true
    },
    "Wailing Winds": {
        "bp": 60,
        "type": "Ghost",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "target": "allAdjacentFoes"
    },
    "Shadow Break": {
        "bp": 120,
        "type": "Ghost",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "breaksProtect": true
    },
    "Sharpen": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 2
    },
    "Psycho Shield": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 3,
        "priority": 6
    },
    "Guard Split": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": 4
    },
    "Power Split": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 2,
        "priority": 4
    },
    "Wonder Room": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 5
    },
    "Psyshock": {
        "bp": 90,
        "type": "Psychic",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "overrideDefensiveStat": "def"
    },
    "Venoshock": {
        "bp": 70,
        "type": "Poison",
        "category": "Special",
        "zp": 110,
        "pp": 20,
        "secondaries": true
    },
    "Autotomize": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 1
    },
    "Rage Powder": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Telekinesis": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Magic Room": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Smack Down": {
        "bp": 75,
        "type": "Rock",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "secondaries": true
    },
    "Storm Throw": {
        "bp": 60,
        "type": "Fighting",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "makesContact": true
    },
    "Bursting Flames": {
        "bp": 25,
        "type": "Fire",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "multihit": 3
    },
    "Sludge Wave": {
        "bp": 120,
        "type": "Poison",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Quiver Dance": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 2,
        "priority": -1
    },
    "Heavy Slam": {
        "bp": 120,
        "type": "Steel",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Psychic Noise": {
        "bp": 85,
        "type": "Psychic",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "target": "allAdjacent",
        "secondaries": true
    },
    "Body Press": {
        "bp": 80,
        "type": "Fighting",
        "category": "Physical",
        "zp": 130,
        "pp": 10,
        "makesContact": true,
        "overrideOffensiveStat": "def"
    },
    "Soak": {
        "bp": 0,
        "type": "Water",
        "category": "Status",
        "pp": 5
    },
    "Pyro Dash": {
        "bp": 45,
        "type": "Fire",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Coil": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 2,
        "priority": -1
    },
    "Low Sweep": {
        "bp": 75,
        "type": "Fighting",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "makesContact": true,
        "secondaries": true
    },
    "Sludge Shot": {
        "bp": 45,
        "type": "Poison",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Foul Play": {
        "bp": 95,
        "type": "Dark",
        "category": "Physical",
        "zp": 150,
        "pp": 15,
        "makesContact": true,
        "overrideOffensivePokemon": "target"
    },
    "Simple Beam": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Entrainment": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Flip Turn": {
        "bp": 70,
        "type": "Water",
        "category": "Physical",
        "zp": 110,
        "pp": 20,
        "makesContact": true
    },
    "Cacaphony": {
        "bp": 70,
        "type": "Normal",
        "category": "Special",
        "zp": 110,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Echoed Voice": {
        "bp": 40,
        "type": "Normal",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "multihit": 2,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Skitter Smack": {
        "bp": 60,
        "type": "Bug",
        "category": "Physical",
        "zp": 100,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Mist Ball": {
        "bp": 60,
        "type": "Fairy",
        "category": "Special",
        "zp": 100,
        "pp": 20
    },
    "Mystical Power": {
        "bp": 100,
        "type": "Fairy",
        "category": "Special",
        "zp": 160,
        "pp": 3,
        "secondaries": true
    },
    "Quick Guard": {
        "bp": 0,
        "type": "Fighting",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Ally Switch": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 15,
        "priority": 6
    },
    "Scald": {
        "bp": 80,
        "type": "Water",
        "category": "Special",
        "zp": 140,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "weatherBoost": {
                "Sun": 1.5
            }
        }
    },
    "Shell Smash": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Heal Pulse": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5
    },
    "Hex": {
        "bp": 65,
        "type": "Ghost",
        "category": "Special",
        "zp": 120,
        "pp": 10
    },
    "Sky Drop": {
        "bp": 120,
        "type": "Flying",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "priority": -5,
        "makesContact": true
    },
    "Shift Gear": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 1,
        "priority": -1
    },
    "Circle Throw": {
        "bp": 95,
        "type": "Fighting",
        "category": "Physical",
        "zp": 150,
        "pp": 15,
        "priority": -7,
        "makesContact": true
    },
    "Heat Transfer": {
        "bp": 60,
        "type": "Fire",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "drain": [
            75,
            100
        ]
    },
    "Quash": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Acrobatics": {
        "bp": 55,
        "type": "Flying",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "makesContact": true
    },
    "Reflect Type": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Retaliate": {
        "bp": 100,
        "type": "Normal",
        "category": "Physical",
        "zp": 160,
        "pp": 10,
        "makesContact": true
    },
    "Final Gambit": {
        "bp": 1,
        "type": "Dark",
        "category": "Special",
        "zp": 200,
        "pp": 1
    },
    "Triple Axel": {
        "bp": 40,
        "type": "Ice",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "multihit": 3,
        "makesContact": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Wildfire": {
        "bp": 75,
        "type": "Fire",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "secondaries": true
    },
    "Water Pledge": {
        "bp": 80,
        "type": "Water",
        "category": "Special",
        "zp": 160,
        "pp": 20
    },
    "Fire Pledge": {
        "bp": 80,
        "type": "Fire",
        "category": "Special",
        "zp": 160,
        "pp": 10
    },
    "Grass Pledge": {
        "bp": 80,
        "type": "Grass",
        "category": "Special",
        "zp": 160,
        "pp": 15
    },
    "Volt Switch": {
        "bp": 70,
        "type": "Electric",
        "category": "Special",
        "zp": 110,
        "pp": 15
    },
    "Struggle Bug": {
        "bp": 50,
        "type": "Bug",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Bulldoze": {
        "bp": 60,
        "type": "Ground",
        "category": "Physical",
        "zp": 100,
        "pp": 20,
        "target": "allAdjacent",
        "secondaries": true
    },
    "Frost Breath": {
        "bp": 60,
        "type": "Ice",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Breaking Swipe": {
        "bp": 75,
        "type": "Dragon",
        "category": "Physical",
        "zp": 120,
        "pp": 10,
        "target": "allAdjacentFoes",
        "makesContact": true,
        "secondaries": true
    },
    "Work Up": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1
    },
    "Electroweb": {
        "bp": 60,
        "type": "Electric",
        "category": "Special",
        "zp": 100,
        "pp": 20,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Wild Charge": {
        "bp": 105,
        "type": "Electric",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Drill Run": {
        "bp": 80,
        "type": "Ground",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "remix": {
            "highCrit": true
        }
    },
    "Dual Chop": {
        "bp": 55,
        "type": "Dragon",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "multihit": 2,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "perHitDrop": {
                "def": -1
            }
        }
    },
    "Befuddle": {
        "bp": 45,
        "type": "Fairy",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Branch Leech": {
        "bp": 95,
        "type": "Grass",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Sacred Sword": {
        "bp": 90,
        "type": "Fighting",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "makesContact": true,
        "ignoreDefensive": true
    },
    "Aqua Cutter": {
        "bp": 80,
        "type": "Water",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "highCrit": true
        }
    },
    "Scorching Slam": {
        "bp": 105,
        "type": "Fire",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "superEffectiveVs": [
                "Ground"
            ]
        }
    },
    "Leaf Flurry": {
        "bp": 45,
        "type": "Grass",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Steamroller": {
        "bp": 95,
        "type": "Bug",
        "category": "Physical",
        "zp": 170,
        "pp": 15,
        "makesContact": true,
        "remix": {
            "superEffectiveVs": [
                "Ground",
                "Rock",
                "Steel"
            ]
        }
    },
    "Cotton Guard": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 1
    },
    "Night Daze": {
        "bp": 75,
        "type": "Dark",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "secondaries": true
    },
    "Brain Blast": {
        "bp": 125,
        "type": "Psychic",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Tail Slap": {
        "bp": 30,
        "type": "Normal",
        "category": "Physical",
        "zp": 110,
        "pp": 10,
        "multihit": [
            2,
            5
        ],
        "makesContact": true
    },
    "Hurricane": {
        "bp": 125,
        "type": "Flying",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true
    },
    "Headlong Rush": {
        "bp": 120,
        "type": "Ground",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Gear Grind": {
        "bp": 40,
        "type": "Steel",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "multihit": 3,
        "makesContact": true,
        "secondaries": true
    },
    "Hot N' Ready": {
        "bp": 100,
        "type": "Fire",
        "category": "Special",
        "zp": 190,
        "pp": 5,
        "secondaries": true
    },
    "Techno Blast": {
        "bp": 140,
        "type": "Steel",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Alluring Voice": {
        "bp": 80,
        "type": "Fairy",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Radiant Edge": {
        "bp": 75,
        "type": "Fairy",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "overrideDefensiveStat": "def",
        "remix": {
            "useHigherStat": true
        }
    },
    "Absolute Zero": {
        "bp": 130,
        "type": "Ice",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Short Circuit": {
        "bp": 140,
        "type": "Electric",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "recoil": [
            50,
            100
        ],
        "remix": {
            "superEffectiveVs": [
                "Electric"
            ],
            "ignoresAbsorb": true
        }
    },
    "Dragon's Fury": {
        "bp": 130,
        "type": "Dragon",
        "category": "Special",
        "zp": 190,
        "pp": 10,
        "secondaries": true
    },
    "Fiery Dance": {
        "bp": 80,
        "type": "Fire",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "useHigherStat": true,
            "selfBoost": {
                "atk": 1,
                "spa": 1
            }
        }
    },
    "Focus Punch": {
        "bp": 120,
        "type": "Fighting",
        "category": "Physical",
        "zp": 200,
        "pp": 1,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "atk": 1
            },
            "chargeTurn": true
        }
    },
    "Electro Shot": {
        "bp": 120,
        "type": "Electric",
        "category": "Special",
        "zp": 200,
        "pp": 1,
        "willCrit": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "spa": 1
            },
            "chargeTurn": true
        }
    },
    "Dismal Cry": {
        "bp": 65,
        "type": "Dark",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Icicle Crash": {
        "bp": 90,
        "type": "Ice",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "V-Create": {
        "bp": 180,
        "type": "Fire",
        "category": "Physical",
        "zp": 220,
        "pp": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Fusion Flare": {
        "bp": 180,
        "type": "Fire",
        "category": "Special",
        "zp": 230,
        "pp": 3,
        "secondaries": true
    },
    "Fusion Bolt": {
        "bp": 180,
        "type": "Electric",
        "category": "Special",
        "zp": 230,
        "pp": 3,
        "secondaries": true
    },
    "Flying Press": {
        "bp": 140,
        "type": "Fighting",
        "category": "Physical",
        "zp": 200,
        "pp": 10,
        "recoil": [
            50,
            100
        ],
        "makesContact": true
    },
    "Time Out": {
        "bp": 0,
        "type": "Fighting",
        "category": "Status",
        "pp": 1,
        "priority": 6
    },
    "Belch": {
        "bp": 80,
        "type": "Poison",
        "category": "Special",
        "zp": 120,
        "pp": 15,
        "secondaries": true
    },
    "Rototiller": {
        "bp": 0,
        "type": "Ground",
        "category": "Status",
        "pp": 1
    },
    "Sticky Web": {
        "bp": 0,
        "type": "Bug",
        "category": "Status",
        "pp": 5
    },
    "Finishing Blow": {
        "bp": 50,
        "type": "Bug",
        "category": "Physical",
        "zp": 120,
        "pp": 5,
        "willCrit": true,
        "makesContact": true
    },
    "Phantom Force": {
        "bp": 95,
        "type": "Ghost",
        "category": "Physical",
        "zp": 150,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Trick-or-Treat": {
        "bp": 0,
        "type": "Ghost",
        "category": "Special",
        "zp": 100,
        "pp": 1,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "fixedDamage": 1,
            "neutralVs": [
                "Normal"
            ]
        }
    },
    "Battle Cry": {
        "bp": 0,
        "type": "Fighting",
        "category": "Status",
        "pp": 2
    },
    "Ion Deluge": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 10,
        "priority": 4
    },
    "Parabolic Charge": {
        "bp": 60,
        "type": "Electric",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "drain": [
            75,
            100
        ],
        "target": "allAdjacent"
    },
    "Forest’s Curse": {
        "bp": 0,
        "type": "Ghost",
        "category": "Status",
        "pp": 1
    },
    "Petal Blizzard": {
        "bp": 75,
        "type": "Grass",
        "category": "Special",
        "zp": 160,
        "pp": 15,
        "willCrit": true,
        "target": "allAdjacentFoes"
    },
    "Freeze-Dry": {
        "bp": 85,
        "type": "Ice",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "secondaries": true
    },
    "Disarming Voice": {
        "bp": 65,
        "type": "Fairy",
        "category": "Special",
        "zp": 100,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Parting Shot": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 20
    },
    "Topsy-Turvy": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 10,
        "priority": 4
    },
    "Draining Kiss": {
        "bp": 45,
        "type": "Fairy",
        "category": "Special",
        "zp": 90,
        "pp": 10,
        "drain": [
            100,
            100
        ],
        "makesContact": true
    },
    "Shiny Shield": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Floral Guard": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 2
    },
    "Grassy Terrain": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Misty Terrain": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Electrify": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Play Rough": {
        "bp": 105,
        "type": "Fairy",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Pixie Dust": {
        "bp": 45,
        "type": "Fairy",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Moonblast": {
        "bp": 95,
        "type": "Fairy",
        "category": "Special",
        "zp": 140,
        "pp": 15,
        "secondaries": true
    },
    "Boomburst": {
        "bp": 120,
        "type": "Normal",
        "category": "Special",
        "zp": 190,
        "pp": 5,
        "target": "allAdjacent"
    },
    "Fairy Lock": {
        "bp": 60,
        "type": "Fairy",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "willCrit": true,
        "remix": {
            "superEffectiveVs": [
                "Steel"
            ],
            "useHigherStat": true
        }
    },
    "Regal Shield": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 3,
        "priority": 6
    },
    "Play Nice": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Confide": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Mineral Shower": {
        "bp": 130,
        "type": "Rock",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Steam Eruption": {
        "bp": 100,
        "type": "Water",
        "category": "Special",
        "zp": 160,
        "pp": 5,
        "secondaries": true,
        "remix": {
            "weatherBoost": {
                "Sun": 1.5
            }
        }
    },
    "Psycho Break": {
        "bp": 120,
        "type": "Psychic",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true
    },
    "Stinger Missile": {
        "bp": 25,
        "type": "Water",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "multihit": [
            2,
            5
        ]
    },
    "Mystical Fire": {
        "bp": 75,
        "type": "Fire",
        "category": "Special",
        "zp": 120,
        "pp": 10,
        "secondaries": true
    },
    "Spiky Shield": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Aromatic Mist": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5
    },
    "Strange Impulse": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 2
    },
    "Venom Drench": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 2
    },
    "Kindle": {
        "bp": 0,
        "type": "Fire",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Meteor Beam": {
        "bp": 120,
        "type": "Rock",
        "category": "Special",
        "zp": 200,
        "pp": 1,
        "willCrit": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "spa": 1
            },
            "chargeTurn": true
        }
    },
    "Recharge": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 5
    },
    "Jackpot": {
        "bp": 0,
        "type": "Dark",
        "category": "Status",
        "pp": 5
    },
    "Electric Terrain": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Dazzling Gleam": {
        "bp": 85,
        "type": "Fairy",
        "category": "Special",
        "zp": 130,
        "pp": 15,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Celebrate": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Befriend": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 2
    },
    "Baby-Doll Eyes": {
        "bp": 0,
        "type": "Fairy",
        "category": "Status",
        "pp": 5,
        "priority": 4
    },
    "Nuzzle": {
        "bp": 0,
        "type": "Electric",
        "category": "Status",
        "pp": 5,
        "makesContact": true
    },
    "Comet Punch": {
        "bp": 15,
        "type": "Psychic",
        "category": "Physical",
        "zp": 120,
        "pp": 5,
        "priority": 3,
        "multihit": 4,
        "makesContact": true
    },
    "Outbreak": {
        "bp": 20,
        "type": "Bug",
        "category": "Special",
        "zp": 90,
        "pp": 1,
        "priority": 4,
        "secondaries": true,
        "remix": {
            "trap": true
        }
    },
    "Power-Up Punch": {
        "bp": 40,
        "type": "Fighting",
        "category": "Physical",
        "zp": 90,
        "pp": 2,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "atk": 1
            }
        }
    },
    "Twilight Cannon": {
        "bp": 130,
        "type": "Dark",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Thousand Arrows": {
        "bp": 100,
        "type": "Ground",
        "category": "Special",
        "zp": 180,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "superEffectiveVs": [
                "Flying"
            ],
            "groundsTarget": true
        }
    },
    "Core Drain": {
        "bp": 100,
        "type": "Ground",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "drain": [
            50,
            100
        ]
    },
    "Land’s Wrath": {
        "bp": 130,
        "type": "Ground",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Eternal Beam": {
        "bp": 120,
        "type": "Fairy",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "secondaries": true
    },
    "Torrential Pulse": {
        "bp": 75,
        "type": "Water",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true,
        "target": "allAdjacentFoes"
    },
    "Molten Rift": {
        "bp": 90,
        "type": "Fire",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "willCrit": true,
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Dragon Ascent": {
        "bp": 140,
        "type": "Dragon",
        "category": "Physical",
        "zp": 200,
        "pp": 5,
        "makesContact": true,
        "secondaries": true
    },
    "Hyperspace Fury": {
        "bp": 140,
        "type": "Dark",
        "category": "Physical",
        "zp": 190,
        "pp": 5,
        "makesContact": true,
        "secondaries": true,
        "breaksProtect": true
    },
    "Breakneck Blitz": {
        "bp": 1,
        "type": "Normal",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "All-Out Pummeling": {
        "bp": 1,
        "type": "Fighting",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Supersonic Skystrike": {
        "bp": 1,
        "type": "Flying",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Acid Downpour": {
        "bp": 1,
        "type": "Poison",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Tectonic Rage": {
        "bp": 1,
        "type": "Ground",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Continental Crush": {
        "bp": 1,
        "type": "Rock",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Savage Spin-Out": {
        "bp": 1,
        "type": "Bug",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Never-Ending Nightmare": {
        "bp": 1,
        "type": "Ghost",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Corkscrew Crash": {
        "bp": 1,
        "type": "Steel",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Inferno Overdrive": {
        "bp": 1,
        "type": "Fire",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Hydro Vortex": {
        "bp": 1,
        "type": "Water",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Bloom Doom": {
        "bp": 1,
        "type": "Grass",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Gigavolt Havoc": {
        "bp": 1,
        "type": "Electric",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Shattered Psyche": {
        "bp": 1,
        "type": "Psychic",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Subzero Slammer": {
        "bp": 1,
        "type": "Ice",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Devastating Drake": {
        "bp": 1,
        "type": "Dragon",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Black Hole Eclipse": {
        "bp": 1,
        "type": "Dark",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Twinkle Tackle": {
        "bp": 1,
        "type": "Fairy",
        "category": "Special",
        "pp": 1,
        "isZ": true
    },
    "Catastropika": {
        "bp": 180,
        "type": "Electric",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "makesContact": true,
        "isZ": true,
        "remix": {
            "superEffectiveVs": [
                "Ground"
            ],
            "useHigherStat": true,
            "ignoresAbilities": true
        }
    },
    "Sedimend": {
        "bp": 0,
        "type": "Ground",
        "category": "Status",
        "pp": 5
    },
    "First Impression": {
        "bp": 110,
        "type": "Bug",
        "category": "Physical",
        "zp": 140,
        "pp": 10,
        "priority": 4,
        "makesContact": true,
        "breaksProtect": true
    },
    "Baneful Bunker": {
        "bp": 0,
        "type": "Poison",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Spirit Shackle": {
        "bp": 60,
        "type": "Ghost",
        "category": "Physical",
        "zp": 180,
        "pp": 10,
        "willCrit": true,
        "secondaries": true
    },
    "Brutal Swing": {
        "bp": 120,
        "type": "Dark",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "ignoreDefensive": true
    },
    "Bubble Ballad": {
        "bp": 80,
        "type": "Water",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "target": "allAdjacentFoes",
        "secondaries": true,
        "remix": {
            "selfBoost": {
                "spa": 1
            }
        }
    },
    "Ice Hammer": {
        "bp": 120,
        "type": "Ice",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "recoil": [
            30,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Floral Healing": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 5
    },
    "High Horsepower": {
        "bp": 95,
        "type": "Ground",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "makesContact": true,
        "secondaries": true
    },
    "Strength Sap": {
        "bp": 0,
        "type": "Grass",
        "category": "Status",
        "pp": 3
    },
    "Solar Blade": {
        "bp": 90,
        "type": "Grass",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true
    },
    "Grassy Glide": {
        "bp": 45,
        "type": "Grass",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true,
        "remix": {
            "terrainBoost": {
                "Grassy": 1.5
            }
        }
    },
    "Spotlight": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5,
        "priority": 6
    },
    "Toxic Thread": {
        "bp": 10,
        "type": "Poison",
        "category": "Special",
        "zp": 90,
        "pp": 5,
        "priority": 4,
        "secondaries": true
    },
    "Laser Focus": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Gear Guard": {
        "bp": 0,
        "type": "Steel",
        "category": "Status",
        "pp": 2,
        "priority": 6
    },
    "Hell Thrust": {
        "bp": 105,
        "type": "Dark",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            25,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Bug Bomber": {
        "bp": 35,
        "type": "Bug",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "multihit": 3
    },
    "Anchor Shot": {
        "bp": 100,
        "type": "Steel",
        "category": "Physical",
        "zp": 200,
        "pp": 10,
        "secondaries": true
    },
    "Psychic Terrain": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 5,
        "priority": 2
    },
    "Lunge": {
        "bp": 105,
        "type": "Bug",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "recoil": [
            20,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Fire Lash": {
        "bp": 35,
        "type": "Fire",
        "category": "Physical",
        "zp": 100,
        "pp": 5,
        "priority": 4,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Lash Out": {
        "bp": 55,
        "type": "Dark",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "willCrit": true,
        "makesContact": true,
        "remix": {
            "noVanilla": true
        }
    },
    "Burn Up": {
        "bp": 140,
        "type": "Fire",
        "category": "Special",
        "zp": 180,
        "pp": 1,
        "secondaries": true
    },
    "Speed Swap": {
        "bp": 0,
        "type": "Psychic",
        "category": "Status",
        "pp": 1,
        "priority": 4
    },
    "Smart Strike": {
        "bp": 50,
        "type": "Steel",
        "category": "Physical",
        "zp": 120,
        "pp": 20,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true
    },
    "Triple Dose": {
        "bp": 30,
        "type": "Poison",
        "category": "Special",
        "zp": 150,
        "pp": 10,
        "multihit": 3,
        "drain": [
            50,
            100
        ]
    },
    "Revelation Dance": {
        "bp": 90,
        "type": "Normal",
        "category": "Special",
        "zp": 150,
        "pp": 15,
        "remix": {
            "matchUserType": true,
            "useHigherStat": true
        }
    },
    "Core Enforcer": {
        "bp": 150,
        "type": "Dragon",
        "category": "Special",
        "zp": 210,
        "pp": 5,
        "recoil": [
            30,
            100
        ],
        "target": "allAdjacentFoes",
        "secondaries": true
    },
    "Trop Kick": {
        "bp": 100,
        "type": "Grass",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "makesContact": true
    },
    "Instruct": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 3,
        "priority": 6
    },
    "Beak Blast": {
        "bp": 75,
        "type": "Flying",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "willCrit": true,
        "secondaries": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Drakonic Wave": {
        "bp": 125,
        "type": "Dragon",
        "category": "Special",
        "zp": 180,
        "pp": 10,
        "target": "allAdjacentFoes"
    },
    "Savage Slam": {
        "bp": 95,
        "type": "Dragon",
        "category": "Physical",
        "zp": 160,
        "pp": 15,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Night Burst": {
        "bp": 45,
        "type": "Dark",
        "category": "Special",
        "zp": 90,
        "pp": 20,
        "priority": 1
    },
    "Aurora Veil": {
        "bp": 0,
        "type": "Ice",
        "category": "Status",
        "pp": 5
    },
    "Sinister Arrow Raid": {
        "bp": 180,
        "type": "Ghost",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "secondaries": true,
        "isZ": true
    },
    "Malicious Moonsault": {
        "bp": 180,
        "type": "Dark",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "makesContact": true,
        "isZ": true
    },
    "Oceanic Operetta": {
        "bp": 180,
        "type": "Water",
        "category": "Special",
        "zp": 180,
        "pp": 1,
        "secondaries": true,
        "isZ": true
    },
    "Guardian of Alola": {
        "bp": 150,
        "type": "Fairy",
        "category": "Special",
        "zp": 150,
        "pp": 1,
        "makesContact": true,
        "isZ": true,
        "remix": {
            "useHigherStat": true,
            "terrainBoost": {
                "any": 1.5
            },
            "noVanilla": true,
            "ignoresAbilities": true
        }
    },
    "Soul-Stealing 7-Star Strike": {
        "bp": 180,
        "type": "Ghost",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "makesContact": true,
        "isZ": true
    },
    "Stoked Sparksurfer": {
        "bp": 180,
        "type": "Electric",
        "category": "Special",
        "zp": 180,
        "pp": 1,
        "recoil": [
            50,
            100
        ],
        "secondaries": true,
        "isZ": true
    },
    "Pulverizing Pancake": {
        "bp": 220,
        "type": "Normal",
        "category": "Physical",
        "zp": 220,
        "pp": 5,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "secondaries": true,
        "isZ": true
    },
    "Extreme Evoboost": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 1,
        "isZ": true
    },
    "Genesis Supernova": {
        "bp": 200,
        "type": "Psychic",
        "category": "Special",
        "pp": 1,
        "secondaries": true,
        "isZ": true
    },
    "Shell Trap": {
        "bp": 150,
        "type": "Fire",
        "category": "Special",
        "zp": 200,
        "pp": 5,
        "secondaries": true
    },
    "Brilliant Blast": {
        "bp": 125,
        "type": "Fairy",
        "category": "Special",
        "zp": 170,
        "pp": 10,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "spd": -1
            }
        }
    },
    "Psychic Fangs": {
        "bp": 85,
        "type": "Psychic",
        "category": "Physical",
        "zp": 150,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true
    },
    "Stomping Tantrum": {
        "bp": 80,
        "type": "Ground",
        "category": "Physical",
        "zp": 130,
        "pp": 20,
        "target": "allAdjacentFoes"
    },
    "Shadow Bone": {
        "bp": 85,
        "type": "Ghost",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "remix": {
            "ignoresAbilities": true,
            "neutralVs": [
                "Normal"
            ]
        }
    },
    "Accelerock": {
        "bp": 45,
        "type": "Rock",
        "category": "Physical",
        "zp": 90,
        "pp": 20,
        "priority": 1,
        "makesContact": true
    },
    "Aqua Break": {
        "bp": 85,
        "type": "Water",
        "category": "Physical",
        "zp": 130,
        "pp": 10,
        "makesContact": true,
        "secondaries": true,
        "remix": {
            "targetDrop": {
                "def": -1
            }
        }
    },
    "Radiant Outburst": {
        "bp": 130,
        "type": "Fairy",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true
    },
    "Spectral Thief": {
        "bp": 60,
        "type": "Ghost",
        "category": "Physical",
        "zp": 170,
        "pp": 10,
        "willCrit": true
    },
    "Solar Strike": {
        "bp": 140,
        "type": "Fire",
        "category": "Physical",
        "zp": 180,
        "pp": 5,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "secondaries": true
    },
    "Spectral Beam": {
        "bp": 130,
        "type": "Ghost",
        "category": "Special",
        "zp": 180,
        "pp": 5,
        "secondaries": true,
        "remix": {
            "ignoresAbilities": true
        }
    },
    "Tearful Look": {
        "bp": 0,
        "type": "Normal",
        "category": "Status",
        "pp": 5
    },
    "Zing Zap": {
        "bp": 60,
        "type": "Electric",
        "category": "Physical",
        "zp": 140,
        "pp": 15,
        "willCrit": true,
        "makesContact": true,
        "secondaries": true
    },
    "Nature’s Madness": {
        "bp": 1,
        "type": "Fairy",
        "category": "Special",
        "zp": 150,
        "pp": 1,
        "priority": 4,
        "secondaries": true
    },
    "Synthetic Slash": {
        "bp": 100,
        "type": "Normal",
        "category": "Physical",
        "zp": 200,
        "pp": 10,
        "drain": [
            50,
            100
        ],
        "makesContact": true,
        "remix": {
            "matchUserType": true
        }
    },
    "10,000,000 Volt Thunderbolt": {
        "bp": 250,
        "type": "Electric",
        "category": "Special",
        "pp": 1,
        "willCrit": true,
        "secondaries": true,
        "isZ": true
    },
    "Mind Blown": {
        "bp": 150,
        "type": "Fire",
        "category": "Special",
        "zp": 200,
        "pp": 2,
        "priority": 4,
        "target": "allAdjacent"
    },
    "High Voltage": {
        "bp": 75,
        "type": "Electric",
        "category": "Special",
        "zp": 160,
        "pp": 10,
        "willCrit": true
    },
    "Photon Geyser": {
        "bp": 140,
        "type": "Psychic",
        "category": "Special",
        "zp": 200,
        "pp": 10,
        "recoil": [
            50,
            100
        ],
        "remix": {
            "superEffectiveVs": [
                "Dark"
            ],
            "useHigherStat": true
        }
    },
    "Light That Burns the Sky": {
        "bp": 220,
        "type": "Psychic",
        "category": "Special",
        "pp": 1,
        "isZ": true,
        "remix": {
            "useHigherStat": true
        }
    },
    "Searing Sunraze Smash": {
        "bp": 200,
        "type": "Fire",
        "category": "Physical",
        "zp": 200,
        "pp": 1,
        "recoil": [
            50,
            100
        ],
        "makesContact": true,
        "isZ": true,
        "remix": {
            "superEffectiveVs": [
                "Fire"
            ]
        }
    },
    "Menacing Moonraze Maelstrom": {
        "bp": 200,
        "type": "Ghost",
        "category": "Special",
        "zp": 200,
        "pp": 1,
        "recoil": [
            50,
            100
        ],
        "isZ": true,
        "remix": {
            "superEffectiveVs": [
                "Fairy"
            ]
        }
    },
    "Let’s Snuggle Forever": {
        "bp": 250,
        "type": "Fairy",
        "category": "Physical",
        "pp": 1,
        "makesContact": true,
        "isZ": true
    },
    "Splintered Stormshards": {
        "bp": 180,
        "type": "Rock",
        "category": "Physical",
        "zp": 180,
        "pp": 1,
        "isZ": true
    },
    "Clangorous Soulblaze": {
        "bp": 180,
        "type": "Dragon",
        "category": "Special",
        "zp": 180,
        "pp": 1,
        "recoil": [
            50,
            100
        ],
        "target": "allAdjacentFoes",
        "secondaries": true,
        "isZ": true
    }
};
//# sourceMappingURL=remix_moves.js.map