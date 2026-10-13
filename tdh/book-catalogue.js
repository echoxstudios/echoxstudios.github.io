// Checked reading destinations. No manuscript text is included.
(function (root) {
  "use strict";
  const data = {
    "releaseEdition": "v145",
    "editions": {
      "v124": {
        "status": "earlier release",
        "primaryPages": 318,
        "apparatusPages": 52,
        "physicalPages": 380
      },
      "v135": {
        "status": "earlier release",
        "primaryPages": 323,
        "apparatusPages": 60,
        "physicalPages": 394
      },
      "v141": {
        "status": "earlier release",
        "primaryPages": 308,
        "apparatusPages": 60,
        "physicalPages": 378
      },
      "v142": {
        "status": "earlier release",
        "primaryPages": 308,
        "apparatusPages": 62,
        "physicalPages": 380
      },
      "v143": {
        "status": "earlier release",
        "primaryPages": 310,
        "apparatusPages": 63,
        "physicalPages": 383
      },
      "v144": {
        "status": "earlier release",
        "primaryPages": 310,
        "apparatusPages": 63,
        "physicalPages": 383
      },
      "v145": {
        "status": "release",
        "primaryPages": 312,
        "apparatusPages": 63,
        "physicalPages": 385
      }
    },
    "routes": {
      "book-i": {
        "label": "Book I — The Revelation",
        "locations": {
          "v124": {
            "printedPage": "13",
            "physicalPage": 23
          },
          "v135": {
            "printedPage": "11",
            "physicalPage": 21
          },
          "v141": {
            "printedPage": "11",
            "physicalPage": 21
          },
          "v142": {
            "printedPage": "11",
            "physicalPage": 21
          },
          "v143": {
            "printedPage": "11",
            "physicalPage": 21
          },
          "v144": {
            "printedPage": "11",
            "physicalPage": 21
          },
          "v145": {
            "printedPage": "11",
            "physicalPage": 21
          }
        }
      },
      "book-ii": {
        "label": "Book II — Prolegomena",
        "locations": {
          "v124": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v135": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v141": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v142": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v143": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v144": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v145": {
            "printedPage": "19",
            "physicalPage": 29
          }
        }
      },
      "book-iii": {
        "label": "Book III — The Theology of Decho",
        "locations": {
          "v124": {
            "printedPage": "101",
            "physicalPage": 111
          },
          "v135": {
            "printedPage": "107",
            "physicalPage": 117
          },
          "v141": {
            "printedPage": "97",
            "physicalPage": 107
          },
          "v142": {
            "printedPage": "97",
            "physicalPage": 107
          },
          "v143": {
            "printedPage": "99",
            "physicalPage": 109
          },
          "v144": {
            "printedPage": "99",
            "physicalPage": 109
          },
          "v145": {
            "printedPage": "101",
            "physicalPage": 111
          }
        }
      },
      "book-iv": {
        "label": "Book IV — The Dark Hierarchy",
        "locations": {
          "v124": {
            "printedPage": "169",
            "physicalPage": 179
          },
          "v135": {
            "printedPage": "175",
            "physicalPage": 185
          },
          "v141": {
            "printedPage": "165",
            "physicalPage": 175
          },
          "v142": {
            "printedPage": "165",
            "physicalPage": 175
          },
          "v143": {
            "printedPage": "167",
            "physicalPage": 177
          },
          "v144": {
            "printedPage": "167",
            "physicalPage": 177
          },
          "v145": {
            "printedPage": "169",
            "physicalPage": 179
          }
        }
      },
      "book-v": {
        "label": "Book V — The Daily Practice",
        "locations": {
          "v124": {
            "printedPage": "249",
            "physicalPage": 259
          },
          "v135": {
            "printedPage": "255",
            "physicalPage": 265
          },
          "v141": {
            "printedPage": "245",
            "physicalPage": 255
          },
          "v142": {
            "printedPage": "245",
            "physicalPage": 255
          },
          "v143": {
            "printedPage": "247",
            "physicalPage": 257
          },
          "v144": {
            "printedPage": "247",
            "physicalPage": 257
          },
          "v145": {
            "printedPage": "249",
            "physicalPage": 259
          }
        }
      },
      "central-thesis": {
        "label": "Book II — The Central Thesis",
        "locations": {
          "v124": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v135": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v141": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v142": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v143": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v144": {
            "printedPage": "19",
            "physicalPage": 29
          },
          "v145": {
            "printedPage": "19",
            "physicalPage": 29
          }
        }
      },
      "on-method": {
        "label": "Book II — On Method",
        "locations": {
          "v124": {
            "printedPage": "25",
            "physicalPage": 35
          },
          "v135": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v141": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v142": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v143": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v144": {
            "printedPage": "21",
            "physicalPage": 31
          },
          "v145": {
            "printedPage": "21",
            "physicalPage": 31
          }
        }
      },
      "four-expressions": {
        "label": "Book II, Section III — The Four Expressions",
        "locations": {
          "v124": {
            "printedPage": "55",
            "physicalPage": 65
          },
          "v135": {
            "printedPage": "52",
            "physicalPage": 62
          },
          "v141": {
            "printedPage": "52",
            "physicalPage": 62
          },
          "v142": {
            "printedPage": "52",
            "physicalPage": 62
          },
          "v143": {
            "printedPage": "52",
            "physicalPage": 62
          },
          "v144": {
            "printedPage": "52",
            "physicalPage": 62
          },
          "v145": {
            "printedPage": "52",
            "physicalPage": 62
          }
        }
      },
      "expressions.visual": {
        "label": "Book II, Section III — Visual",
        "locations": {
          "v124": {
            "printedPage": "61",
            "physicalPage": 71
          },
          "v135": {
            "printedPage": "58",
            "physicalPage": 68
          },
          "v141": {
            "printedPage": "58",
            "physicalPage": 68
          },
          "v142": {
            "printedPage": "58",
            "physicalPage": 68
          },
          "v143": {
            "printedPage": "58",
            "physicalPage": 68
          },
          "v144": {
            "printedPage": "58",
            "physicalPage": 68
          },
          "v145": {
            "printedPage": "58",
            "physicalPage": 68
          }
        }
      },
      "expressions.emotional": {
        "label": "Book II, Section III — Emotional",
        "locations": {
          "v124": {
            "printedPage": "60",
            "physicalPage": 70
          },
          "v135": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v141": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v142": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v143": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v144": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v145": {
            "printedPage": "57",
            "physicalPage": 67
          }
        }
      },
      "expressions.tactile": {
        "label": "Book II, Section III — Tactile",
        "locations": {
          "v124": {
            "printedPage": "60",
            "physicalPage": 70
          },
          "v135": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v141": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v142": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v143": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v144": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v145": {
            "printedPage": "57",
            "physicalPage": 67
          }
        }
      },
      "expressions.intellectual": {
        "label": "Book II, Section III — Intellectual",
        "locations": {
          "v124": {
            "printedPage": "62",
            "physicalPage": 72
          },
          "v135": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v141": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v142": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v143": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v144": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v145": {
            "printedPage": "59",
            "physicalPage": 69
          }
        }
      },
      "expressions.culture": {
        "label": "Book II, Section III — The Cultural Distortion",
        "locations": {
          "v124": {
            "printedPage": "57",
            "physicalPage": 67
          },
          "v135": {
            "printedPage": "54",
            "physicalPage": 64
          },
          "v141": {
            "printedPage": "54",
            "physicalPage": 64
          },
          "v142": {
            "printedPage": "54",
            "physicalPage": 64
          },
          "v143": {
            "printedPage": "54",
            "physicalPage": 64
          },
          "v144": {
            "printedPage": "54",
            "physicalPage": 64
          },
          "v145": {
            "printedPage": "54",
            "physicalPage": 64
          }
        }
      },
      "expressions.ground": {
        "label": "Book II, Section III — The Intellectual Framework as Ground",
        "locations": {
          "v124": {
            "printedPage": "59",
            "physicalPage": 69
          },
          "v135": {
            "printedPage": "56",
            "physicalPage": 66
          },
          "v141": {
            "printedPage": "56",
            "physicalPage": 66
          },
          "v142": {
            "printedPage": "56",
            "physicalPage": 66
          },
          "v143": {
            "printedPage": "56",
            "physicalPage": 66
          },
          "v144": {
            "printedPage": "56",
            "physicalPage": 66
          },
          "v145": {
            "printedPage": "56",
            "physicalPage": 66
          }
        }
      },
      "attachment": {
        "label": "Book II, Section II — Attachment Theory: The Symptom Without the Mechanism",
        "locations": {
          "v124": {
            "printedPage": "49",
            "physicalPage": 59
          },
          "v135": {
            "printedPage": "46",
            "physicalPage": 56
          },
          "v141": {
            "printedPage": "46",
            "physicalPage": 56
          },
          "v142": {
            "printedPage": "46",
            "physicalPage": 56
          },
          "v143": {
            "printedPage": "46",
            "physicalPage": 56
          },
          "v144": {
            "printedPage": "46",
            "physicalPage": 56
          },
          "v145": {
            "printedPage": "46",
            "physicalPage": 56
          }
        }
      },
      "gospel": {
        "label": "Book III, Section VII — The Gospel of the Body",
        "locations": {
          "v124": {
            "printedPage": "124",
            "physicalPage": 134
          },
          "v135": {
            "printedPage": "130",
            "physicalPage": 140
          },
          "v141": {
            "printedPage": "120",
            "physicalPage": 130
          },
          "v142": {
            "printedPage": "120",
            "physicalPage": 130
          },
          "v143": {
            "printedPage": "122",
            "physicalPage": 132
          },
          "v144": {
            "printedPage": "122",
            "physicalPage": 132
          },
          "v145": {
            "printedPage": "124",
            "physicalPage": 134
          }
        }
      },
      "gospel.during": {
        "label": "Book III, Section VII — The Gospel of the Body: Part Two, During",
        "locations": {
          "v124": {
            "printedPage": "127",
            "physicalPage": 137
          },
          "v135": {
            "printedPage": "133",
            "physicalPage": 143
          },
          "v141": {
            "printedPage": "123",
            "physicalPage": 133
          },
          "v142": {
            "printedPage": "123",
            "physicalPage": 133
          },
          "v143": {
            "printedPage": "125",
            "physicalPage": 135
          },
          "v144": {
            "printedPage": "125",
            "physicalPage": 135
          },
          "v145": {
            "printedPage": "127",
            "physicalPage": 137
          }
        }
      },
      "failures.asymmetry": {
        "label": "Book II, Section I — Conditions Under Which the System Fails: Asymmetrical recognition",
        "locations": {
          "v124": {
            "printedPage": "41",
            "physicalPage": 51
          },
          "v135": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v141": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v142": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v143": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v144": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v145": {
            "printedPage": "38",
            "physicalPage": 48
          }
        }
      },
      "failures.dependency": {
        "label": "Book II, Section I — Conditions Under Which the System Fails: Dependency without confirmation",
        "locations": {
          "v124": {
            "printedPage": "41",
            "physicalPage": 51
          },
          "v135": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v141": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v142": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v143": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v144": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v145": {
            "printedPage": "38",
            "physicalPage": 48
          }
        }
      },
      "failures.misalignment": {
        "label": "Book II, Section I — Conditions Under Which the System Fails: Misaligned aspirational selves",
        "locations": {
          "v124": {
            "printedPage": "40",
            "physicalPage": 50
          },
          "v135": {
            "printedPage": "37",
            "physicalPage": 47
          },
          "v141": {
            "printedPage": "37",
            "physicalPage": 47
          },
          "v142": {
            "printedPage": "37",
            "physicalPage": 47
          },
          "v143": {
            "printedPage": "37",
            "physicalPage": 47
          },
          "v144": {
            "printedPage": "37",
            "physicalPage": 47
          },
          "v145": {
            "printedPage": "37",
            "physicalPage": 47
          }
        }
      },
      "failures.terminal": {
        "label": "Book II, Section I — Conditions Under Which the System Fails: The framework as terminal destination",
        "locations": {
          "v124": {
            "printedPage": "41",
            "physicalPage": 51
          },
          "v135": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v141": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v142": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v143": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v144": {
            "printedPage": "38",
            "physicalPage": 48
          },
          "v145": {
            "printedPage": "38",
            "physicalPage": 48
          }
        }
      },
      "practice.drift": {
        "label": "Book V, Chapter One, Section I — The Anatomy of Drift",
        "locations": {
          "v124": {
            "printedPage": "252",
            "physicalPage": 262
          },
          "v135": {
            "printedPage": "258",
            "physicalPage": 268
          },
          "v141": {
            "printedPage": "248",
            "physicalPage": 258
          },
          "v142": {
            "printedPage": "248",
            "physicalPage": 258
          },
          "v143": {
            "printedPage": "250",
            "physicalPage": 260
          },
          "v144": {
            "printedPage": "250",
            "physicalPage": 260
          },
          "v145": {
            "printedPage": "252",
            "physicalPage": 262
          }
        }
      },
      "practice.performance": {
        "label": "Book V, Chapter One, Section VII — Performance Without Presence",
        "locations": {
          "v124": {
            "printedPage": "274",
            "physicalPage": 284
          },
          "v135": {
            "printedPage": "280",
            "physicalPage": 290
          },
          "v141": {
            "printedPage": "266",
            "physicalPage": 276
          },
          "v142": {
            "printedPage": "266",
            "physicalPage": 276
          },
          "v143": {
            "printedPage": "268",
            "physicalPage": 278
          },
          "v144": {
            "printedPage": "268",
            "physicalPage": 278
          },
          "v145": {
            "printedPage": "270",
            "physicalPage": 280
          }
        }
      },
      "practice.safe-word": {
        "label": "Book V, Chapter One, Section VI — The Safe Word",
        "locations": {
          "v124": {
            "printedPage": "267",
            "physicalPage": 277
          },
          "v135": {
            "printedPage": "273",
            "physicalPage": 283
          },
          "v141": {
            "printedPage": "260",
            "physicalPage": 270
          },
          "v142": {
            "printedPage": "260",
            "physicalPage": 270
          },
          "v143": {
            "printedPage": "262",
            "physicalPage": 272
          },
          "v144": {
            "printedPage": "262",
            "physicalPage": 272
          },
          "v145": {
            "printedPage": "264",
            "physicalPage": 274
          }
        }
      },
      "practice.kairos": {
        "label": "Book V, Chapter Four, Section VII — Kairos",
        "locations": {
          "v124": {
            "printedPage": "301",
            "physicalPage": 311
          },
          "v135": {
            "printedPage": "307",
            "physicalPage": 317
          },
          "v141": {
            "printedPage": "292",
            "physicalPage": 302
          },
          "v142": {
            "printedPage": "292",
            "physicalPage": 302
          },
          "v143": {
            "printedPage": "294",
            "physicalPage": 304
          },
          "v144": {
            "printedPage": "294",
            "physicalPage": 304
          },
          "v145": {
            "printedPage": "296",
            "physicalPage": 306
          }
        }
      },
      "practice.autonomy": {
        "label": "Book V, Chapter Four, Section VI — On Autonomy and Exclusive Belonging",
        "locations": {
          "v124": {
            "printedPage": "299",
            "physicalPage": 309
          },
          "v135": {
            "printedPage": "305",
            "physicalPage": 315
          },
          "v141": {
            "printedPage": "290",
            "physicalPage": 300
          },
          "v142": {
            "printedPage": "290",
            "physicalPage": 300
          },
          "v143": {
            "printedPage": "292",
            "physicalPage": 302
          },
          "v144": {
            "printedPage": "292",
            "physicalPage": 302
          },
          "v145": {
            "printedPage": "294",
            "physicalPage": 304
          }
        }
      },
      "practice.interview": {
        "label": "Book V, Chapter Four, Section II — The Sexual Interview: Without Having Sex",
        "locations": {
          "v124": {
            "printedPage": "292",
            "physicalPage": 302
          },
          "v135": {
            "printedPage": "298",
            "physicalPage": 308
          },
          "v141": {
            "printedPage": "283",
            "physicalPage": 293
          },
          "v142": {
            "printedPage": "283",
            "physicalPage": 293
          },
          "v143": {
            "printedPage": "285",
            "physicalPage": 295
          },
          "v144": {
            "printedPage": "285",
            "physicalPage": 295
          },
          "v145": {
            "printedPage": "287",
            "physicalPage": 297
          }
        }
      },
      "canticle.flame": {
        "label": "Book III, Section XIV — The Canticle of the Flame",
        "locations": {
          "v124": {
            "printedPage": "148",
            "physicalPage": 158
          },
          "v135": {
            "printedPage": "154",
            "physicalPage": 164
          },
          "v141": {
            "printedPage": "144",
            "physicalPage": 154
          },
          "v142": {
            "printedPage": "144",
            "physicalPage": 154
          },
          "v143": {
            "printedPage": "146",
            "physicalPage": 156
          },
          "v144": {
            "printedPage": "146",
            "physicalPage": 156
          },
          "v145": {
            "printedPage": "148",
            "physicalPage": 158
          }
        }
      },
      "canticle.primal": {
        "label": "Book III, Section XV — The Canticle of the Primal Force",
        "locations": {
          "v124": {
            "printedPage": "152",
            "physicalPage": 162
          },
          "v135": {
            "printedPage": "158",
            "physicalPage": 168
          },
          "v141": {
            "printedPage": "148",
            "physicalPage": 158
          },
          "v142": {
            "printedPage": "148",
            "physicalPage": 158
          },
          "v143": {
            "printedPage": "150",
            "physicalPage": 160
          },
          "v144": {
            "printedPage": "150",
            "physicalPage": 160
          },
          "v145": {
            "printedPage": "152",
            "physicalPage": 162
          }
        }
      },
      "canticle.contained": {
        "label": "Book III, Section XVI — The Canticle of Contained Presence",
        "locations": {
          "v124": {
            "printedPage": "156",
            "physicalPage": 166
          },
          "v135": {
            "printedPage": "162",
            "physicalPage": 172
          },
          "v141": {
            "printedPage": "152",
            "physicalPage": 162
          },
          "v142": {
            "printedPage": "152",
            "physicalPage": 162
          },
          "v143": {
            "printedPage": "154",
            "physicalPage": 164
          },
          "v144": {
            "printedPage": "154",
            "physicalPage": 164
          },
          "v145": {
            "printedPage": "156",
            "physicalPage": 166
          }
        }
      },
      "dark-night": {
        "label": "Book IV, Movement XX — The Dark Night of the Master",
        "locations": {
          "v124": {
            "printedPage": "227",
            "physicalPage": 237
          },
          "v135": {
            "printedPage": "234",
            "physicalPage": 244
          },
          "v141": {
            "printedPage": "224",
            "physicalPage": 234
          },
          "v142": {
            "printedPage": "224",
            "physicalPage": 234
          },
          "v143": {
            "printedPage": "226",
            "physicalPage": 236
          },
          "v144": {
            "printedPage": "226",
            "physicalPage": 236
          },
          "v145": {
            "printedPage": "228",
            "physicalPage": 238
          }
        }
      },
      "recognition": {
        "label": "Recognition and the Shape of a Life, after Book V",
        "locations": {
          "v124": {
            "printedPage": "311",
            "physicalPage": 321
          },
          "v135": {
            "printedPage": "317",
            "physicalPage": 327
          },
          "v141": {
            "printedPage": "302",
            "physicalPage": 312
          },
          "v142": {
            "printedPage": "302",
            "physicalPage": 312
          },
          "v143": {
            "printedPage": "304",
            "physicalPage": 314
          },
          "v144": {
            "printedPage": "304",
            "physicalPage": 314
          },
          "v145": {
            "printedPage": "306",
            "physicalPage": 316
          }
        }
      }
    }
  };
  function get(id, edition = data.releaseEdition) {
    const route = data.routes[id];
    if (!route || !route.locations[edition]) throw new Error('Unknown book route or edition: ' + id + ' / ' + edition);
    return Object.freeze({ id, edition, label: route.label, ...route.locations[edition] });
  }
  root.TDH_BOOK = Object.freeze({ releaseEdition: data.releaseEdition, get, reference: (id, edition) => get(id, edition).label });
})(globalThis);
