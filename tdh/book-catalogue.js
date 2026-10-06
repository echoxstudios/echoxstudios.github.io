// Checked reading destinations. No manuscript text is included.
(function (root) {
  "use strict";
  const data = {
  "releaseEdition": "v124",
  "editions": {
    "v124": {
      "status": "release",
      "primaryPages": 318,
      "apparatusPages": 52,
      "physicalPages": 380
    }
  },
  "routes": {
    "book-i": {
      "label": "Book I — The Revelation",
      "locations": {
        "v124": {
          "printedPage": "13",
          "physicalPage": 23
        }
      }
    },
    "book-ii": {
      "label": "Book II — Prolegomena",
      "locations": {
        "v124": {
          "printedPage": "21",
          "physicalPage": 31
        }
      }
    },
    "book-iii": {
      "label": "Book III — The Theology of Decho",
      "locations": {
        "v124": {
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
        }
      }
    },
    "book-v": {
      "label": "Book V — The Daily Practice",
      "locations": {
        "v124": {
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
        }
      }
    },
    "on-method": {
      "label": "Book II — On Method",
      "locations": {
        "v124": {
          "printedPage": "25",
          "physicalPage": 35
        }
      }
    },
    "four-expressions": {
      "label": "Book II, Section III — The Four Expressions",
      "locations": {
        "v124": {
          "printedPage": "55",
          "physicalPage": 65
        }
      }
    },
    "expressions.visual": {
      "label": "Book II, Section III — Visual",
      "locations": {
        "v124": {
          "printedPage": "61",
          "physicalPage": 71
        }
      }
    },
    "expressions.emotional": {
      "label": "Book II, Section III — Emotional",
      "locations": {
        "v124": {
          "printedPage": "60",
          "physicalPage": 70
        }
      }
    },
    "expressions.tactile": {
      "label": "Book II, Section III — Tactile",
      "locations": {
        "v124": {
          "printedPage": "60",
          "physicalPage": 70
        }
      }
    },
    "expressions.intellectual": {
      "label": "Book II, Section III — Intellectual",
      "locations": {
        "v124": {
          "printedPage": "62",
          "physicalPage": 72
        }
      }
    },
    "expressions.culture": {
      "label": "Book II, Section III — The Cultural Distortion",
      "locations": {
        "v124": {
          "printedPage": "57",
          "physicalPage": 67
        }
      }
    },
    "expressions.ground": {
      "label": "Book II, Section III — The Intellectual Framework as Ground",
      "locations": {
        "v124": {
          "printedPage": "59",
          "physicalPage": 69
        }
      }
    },
    "attachment": {
      "label": "Book II, Section II — Attachment Theory: The Symptom Without the Mechanism",
      "locations": {
        "v124": {
          "printedPage": "49",
          "physicalPage": 59
        }
      }
    },
    "gospel": {
      "label": "Book III, Section VII — The Gospel of the Body",
      "locations": {
        "v124": {
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
        }
      }
    },
    "failures.asymmetry": {
      "label": "Book II, Section I — Conditions Under Which the System Fails: Asymmetrical recognition",
      "locations": {
        "v124": {
          "printedPage": "41",
          "physicalPage": 51
        }
      }
    },
    "failures.dependency": {
      "label": "Book II, Section I — Conditions Under Which the System Fails: Dependency without confirmation",
      "locations": {
        "v124": {
          "printedPage": "41",
          "physicalPage": 51
        }
      }
    },
    "failures.misalignment": {
      "label": "Book II, Section I — Conditions Under Which the System Fails: Misaligned aspirational selves",
      "locations": {
        "v124": {
          "printedPage": "40",
          "physicalPage": 50
        }
      }
    },
    "failures.terminal": {
      "label": "Book II, Section I — Conditions Under Which the System Fails: The framework as terminal destination",
      "locations": {
        "v124": {
          "printedPage": "41",
          "physicalPage": 51
        }
      }
    },
    "practice.drift": {
      "label": "Book V, Chapter One, Section I — The Anatomy of Drift",
      "locations": {
        "v124": {
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
        }
      }
    },
    "practice.safe-word": {
      "label": "Book V, Chapter One, Section VI — The Safe Word",
      "locations": {
        "v124": {
          "printedPage": "267",
          "physicalPage": 277
        }
      }
    },
    "practice.kairos": {
      "label": "Book V, Chapter Four, Section VII — Kairos",
      "locations": {
        "v124": {
          "printedPage": "301",
          "physicalPage": 311
        }
      }
    },
    "practice.autonomy": {
      "label": "Book V, Chapter Four, Section VI — On Autonomy and Exclusive Belonging",
      "locations": {
        "v124": {
          "printedPage": "299",
          "physicalPage": 309
        }
      }
    },
    "practice.interview": {
      "label": "Book V, Chapter Four, Section II — The Sexual Interview: Without Having Sex",
      "locations": {
        "v124": {
          "printedPage": "292",
          "physicalPage": 302
        }
      }
    },
    "canticle.flame": {
      "label": "Book III, Section XIV — The Canticle of the Flame",
      "locations": {
        "v124": {
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
        }
      }
    },
    "canticle.contained": {
      "label": "Book III, Section XVI — The Canticle of Contained Presence",
      "locations": {
        "v124": {
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
        }
      }
    },
    "recognition": {
      "label": "Recognition and the Shape of a Life, after Book V",
      "locations": {
        "v124": {
          "printedPage": "311",
          "physicalPage": 321
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
