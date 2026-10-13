/* Sentence fitting for free-text answers.
   A result sentence leaves one grammatical slot open ("...when you are ___.", "...when the other person ___.").
   People answer the same question in many forms: a word, a fragment, a full sentence that repeats the question,
   first person or second, with or without a full stop. fit() turns any of them into text that completes the
   result sentence grammatically. When an answer cannot be fitted safely (several sentences, a clause with its
   own subject, a very long answer), it falls back to the one construction that holds for any content: the
   person's own words, quoted. Nothing here stores or sends anything.

   Slots
     complement  follows "is" / "are" / "when you are"          -> "unhurried", "like the last one awake"
     verb        follows "when the other person"                 -> "notices what I did not say" (3rd person)
     request     a thing the person would ask someone else       -> quoted request, punctuated
     told        a sentence the person wants to hear             -> quoted sentence, addressed to them
     quote       any standalone statement                        -> quoted, tidied

   fit(raw, slot) returns { mode: 'inline' | 'quote', text } or null for an empty answer.

   Final proof. Before any sentence is shown, sentence() reads the whole result -- the template and the answer
   together -- and checks it (check()): spacing and punctuation, a capital at the start and one full stop at
   the end, balanced quotation marks, doubled words, a/an, agreement across the join ("are am", "you is"),
   a person left unconverted ("you ... i feel"), informal spellings ("im", "dont", "u"). What it can repair
   it repairs; a sentence that still fails is rebuilt in the quoted construction, which is then proofed in
   turn. proof(text, kind) applies the same standard to a free-standing answer ('statement' or 'fragment'),
   as on the Translation Studio card. Only the form is corrected, never what the person said. */
(function (root) {
  'use strict';

  var MAX_INLINE_WORDS = 40;

  function tidy(raw) {
    var s = String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim();
    s = s.replace(/^["'“”‘’«»]+|["'“”‘’«»]+$/g, '').trim();
    s = s.replace(/^(\.\.\.|…)\s*/, '');
    return s;
  }

  function stripEnd(s) { return s.replace(/[\s.,;:…-]+$/, ''); }

  function sentenceCount(s) {
    var parts = s.split(/[.!?]+(?:\s+|$)/).filter(function (p) { return /[A-Za-z]/.test(p); });
    return parts.length;
  }

  function wordCount(s) { return s.split(/\s+/).filter(Boolean).length; }

  // Informal spellings and keyboard slips that the person did not mean as style.
  var INFORMAL = [
    [/\bi\b(?=[\s'’.,;:!?]|$)/g, 'I'], [/\bidk\b/gi, 'I don’t know'],
    [/\bim\b/gi, 'I’m'], [/\bive\b/gi, 'I’ve'],
    [/\b(do|does|did|ca|wo|is|are|was|were|have|has|had|should|would|could)nt\b/gi, function (m, a) { return (/^ca$/i.test(a) ? a + 'n' : a) + 'n’t'; }],
    [/\bcant\b/gi, 'can’t'], [/\b(you|they|we)re\b/gi, '$1’re'], [/\b(that|what|it)s(?=\s+(?:a|an|the|not|so|how|what|when|why|all|just|enough|me|my|your|about|been|going|like|hard|okay|ok|fine|true|over|because|really|always|never|only|still|too|very)\b)/gi, '$1’s'],
    [/\bu\b/gi, 'you'], [/\bur\b/gi, 'your'],
    [/\byour\s+(?=(?:not|enough|so|too|very|welcome|right|loved|wanted|safe|good|worth|beautiful|perfect|allowed|okay|ok|home|mine|here|seen|held|forgiven|free|strong|brave|ready|doing|going|a|an|the|my)\b)/gi, 'you’re '],
  ];
  var ACRONYMS = /^(BDSM|D\/s|DS|LGBTQ\+?|LGBTQIA\+?|SSC|RACK|TPE|M\/s|OK)$/;
  function normalise(s) {
    // An answer typed entirely in capitals is read as emphasis, not as a request for capitals.
    if (/[A-Z]{3}/.test(s) && s === s.toUpperCase() && !ACRONYMS.test(s.trim())) s = s.toLowerCase();
    for (var i = 0; i < INFORMAL.length; i++) s = s.replace(INFORMAL[i][0], INFORMAL[i][1]);
    return spacing(s);
  }
  var DOUBLE_OK = /^(that|had|is|do|very|so|really|more|far|again|bye|no|yes|ha|go|ever)$/i;
  function spacing(s) {
    s = s.replace(/\s+([,.;:!?…])/g, '$1')                         // no space before punctuation
         .replace(/([,;:])(?=[A-Za-z“‘"])/g, '$1 ')                 // one space after a comma, semicolon, colon
         .replace(/([.!?])(?=[A-Z][a-z])/g, '$1 ')
         .replace(/,{2,}/g, ',').replace(/([!?])\1+/g, '$1').replace(/\?!|!\?/g, '?')
         .replace(/(^|[^.])\.\.(?!\.)/g, '$1.').replace(/\.{4,}/g, '…').replace(/\.\.\./g, '…')
         .replace(/\b(\w+)(\s+\1\b)+/gi, function (m, w) { return DOUBLE_OK.test(w) ? m : w; })
         .replace(/\s{2,}/g, ' ').trim();
    return articles(s);
  }
  // a/an by sound, with the usual exceptions ("a university", "an hour").
  function articles(s) {
    return s.replace(/\b(a|an|A|An)\s+([A-Za-z][\w'’-]*)/g, function (m, art, w) {
      var lw = w.toLowerCase();
      var vowel = /^[aeiou]/.test(lw) && !/^(uni|use|usu|uti|ure|eu|one|once|ewe|uk)/.test(lw);
      if (/^(hour|honest|honou?r|heir)/.test(lw)) vowel = true;
      if (/^[A-Z]{2,}$/.test(w)) vowel = /^[AEFHILMNORSX]/.test(w);   // initialisms by letter name
      var want = vowel ? 'an' : 'a';
      if (art.charAt(0) === 'A') want = want.charAt(0).toUpperCase() + want.slice(1);
      return want + ' ' + w;
    });
  }

  // Answers that say the person does not know yet are honoured as such, not forced into the slot.
  var UNCERTAIN = /^(?:(?:i\s+)?(?:don’t|do\s+not|really\s+don’t)\s+know(?:\s+yet)?|(?:i’m\s+)?not\s+sure(?:\s+yet)?|unsure|no\s+idea|hard\s+to\s+say|can’t\s+say|unknown|n\/a|pass|skip|\?+)$/i;

  // First person -> second person, so the answer fits sentences that address the reader as "you".
  var PRONOUNS = [
    [/\bI am\b/g, 'you are'], [/\bI'm\b/gi, 'you are'], [/\bI’m\b/gi, 'you are'],
    [/\bI was\b/g, 'you were'], [/\bI wasn't\b/gi, "you weren't"], [/\bI wasn’t\b/gi, 'you weren’t'],
    [/\bI've\b/gi, "you've"], [/\bI’ve\b/gi, 'you’ve'],
    [/\bI'll\b/gi, "you'll"], [/\bI’ll\b/gi, 'you’ll'],
    [/\bI'd\b/gi, 'you would'], [/\bI’d\b/gi, 'you would'],
    [/\bI\b/g, 'you'],
    [/\bmyself\b/gi, 'yourself'], [/\bmine\b/gi, 'yours'], [/\bmy\b/gi, 'your'], [/\bme\b/gi, 'you'],
    [/\bwe are\b/gi, 'you are'], [/\bwe're\b/gi, 'you are'], [/\bwe’re\b/gi, 'you are'],
    [/\byou am\b/gi, 'you are'], [/\byou was\b/gi, 'you were'],
  ];
  function toSecondPerson(s) {
    for (var i = 0; i < PRONOUNS.length; i++) s = s.replace(PRONOUNS[i][0], PRONOUNS[i][1]);
    return s;
  }

  // Leading words that repeat the question's own stem ("I am...", "When I feel..., I am...").
  var COMPLEMENT_ECHO = /^(?:(?:when|if)\s+(?:i|you)\s+(?:feel|am|are)[^,]*,\s*)?(?:i\s+am|i'm|i’m|you\s+are|i\s+feel\s+(?:that\s+)?|i\s+want\s+to\s+(?:be|feel)|i\s+would\s+be|to\s+be|to\s+feel|being|it\s+is|it's|it’s|its|is|are)\s+/i;
  var VERB_SUBJECT = /^(?:(?:when|if|once|whenever)\s+)?(?:they|he|she|the\s+other\s+person|my\s+partner|the\s+other|someone|somebody|that\s+person|you)\s+/i;

  var MODALS = /^(can|could|will|would|should|may|might|must|shall)$/i;
  var NOT_VERBS = /^(the|a|an|my|your|his|her|their|our|this|that|these|those|with|without|in|on|at|by|for|to|from|of|as|like|when|while|after|before|not|never|always|also|just|still|even|only|really|truly|actually|finally|simply|both|all|each|every|some|any|no)$/i;

  function thirdPerson(word) {
    var w = word.toLowerCase();
    var irregular = { be: 'is', are: 'is', have: 'has', do: 'does', go: 'goes', 'don’t': 'doesn’t', "don't": "doesn't", "aren't": "isn't", 'aren’t': 'isn’t', "haven't": "hasn't", 'haven’t': 'hasn’t', "'re": 'is', 're': 'is' };
    if (irregular[w]) return irregular[w];
    if (MODALS.test(w) || NOT_VERBS.test(w)) return word;
    if (/(?:[^s]s|'s|’s|ed)$/.test(w)) return word;        // already agreeing, or past tense
    if (/(?:ss|sh|ch|x|z|o)$/.test(w)) return word + 'es';
    if (/[^aeiou]y$/.test(w)) return word.slice(0, -1) + 'ies';
    return word + 's';
  }

  function agreeThirdPerson(s, subjectRemoved) {
    var words = s.split(' ');
    var i = 0;
    while (i < words.length - 1 && /ly$/i.test(words[i]) && !/^(only|early|reply|apply|fly|rely)$/i.test(words[i])) i++;  // "really sees me"
    var first = words[i] || '';
    var bare = first.replace(/[^A-Za-z'’]/g, '');
    if (!bare) return s;
    // Without a stripped subject, only repair words that read as a bare base verb.
    if (!subjectRemoved && (/(s|ed|ing)$/i.test(bare) || NOT_VERBS.test(bare))) return s;
    words[i] = first.replace(bare, thirdPerson(bare));
    return words.join(' ');
  }

  function lowerFirst(s) {
    if (/^[A-Z]{2,}\b/.test(s) || /^I\b/.test(s)) return s;
    return s.charAt(0).toLowerCase() + s.slice(1);
  }
  function upperFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function asQuote(s, flip) {
    var q = flip ? toSecondPerson(s) : s;
    q = q.replace(/"([^"]*)"/g, '‘$1’').replace(/'/g, '’');
    q = spacing(upperFirst(q.trim())).replace(/([.!?…]\s+)([a-z])/g, function (m, p, c) { return p + c.toUpperCase(); });
    if (!/[.!?…]$/.test(q)) q += /^(would|could|can|will|do|does|did|is|are|am|may|might|should|how|what|why|when|where|who|which)\b/i.test(q) ? '?' : '.';
    return { mode: 'quote', text: '“' + q + '”' };
  }

  function fit(raw, slot) {
    var s = tidy(raw);
    if (!s || !/[A-Za-zÀ-ɏ?]/.test(s)) return null;
    slot = slot || 'complement';
    s = normalise(s);
    if ((slot === 'complement' || slot === 'verb') && UNCERTAIN.test(stripEnd(s))) return { mode: 'open', text: asQuote(stripEnd(s), false).text };

    if (slot === 'quote') return asQuote(s, false);
    if (slot === 'request') return asQuote(s.replace(/^to\s+/i, ''), false);
    if (slot === 'told') {
      // "that I am enough" is the wish reported; said to the person it becomes "You are enough."
      if (/^that\s+/i.test(s)) return asQuote(s.replace(/^that\s+/i, ''), true);
      return asQuote(s, false);
    }

    // Inline slots: a single clause that continues the result sentence.
    var multi = sentenceCount(s) > 1 || /\n/.test(String(raw)) || wordCount(s) > MAX_INLINE_WORDS;
    if (multi) return asQuote(stripEnd(s), false);
    s = stripEnd(s);

    if (slot === 'verb') {
      // Contracted subjects first: "they're gentle", "she's patient" -> "is gentle", "is patient".
      var contracted = /^(?:(?:when|if|once|whenever)\s+)?(?:they|he|she|you)(?:'re|\u2019re|'s|\u2019s)\s+/i;
      if (contracted.test(s)) return { mode: 'inline', text: lowerFirst(toSecondPerson(s.replace(contracted, 'is '))) };
      // The slot needs a verb; an answer that opens with a pronoun or object cannot continue it.
      if (/^(?:me|my|mine|myself|you|your|yours|yourself|I|it|its)\b/i.test(s.replace(VERB_SUBJECT, ''))) return asQuote(s, false);
      var removed = VERB_SUBJECT.test(s);
      s = s.replace(VERB_SUBJECT, '');
      if (removed) s = s.replace(/^(?:are|'re|\u2019re)\s+/i, 'is ');
      s = toSecondPerson(s);
      s = agreeThirdPerson(s, removed);
      return { mode: 'inline', text: lowerFirst(s) };
    }

    // complement
    var before = s;
    s = s.replace(/^(?:when|while|whenever|if)\s+(?:I|you)\s*(?:am|are|’m|'m|’re|'re)\s+/i, '');
    s = s.replace(COMPLEMENT_ECHO, '');
    s = toSecondPerson(s);
    // A complete clause with its own new subject ("she holds me") cannot follow "is"; quote it instead.
    if (/^(?:she|he|they|someone|somebody|people|everyone|nobody)\s+\w+/i.test(s) && !/^(?:she|he|they)\s+(?:is|are)\b/i.test(before)) {
      return asQuote(before, false);
    }
    return { mode: 'inline', text: lowerFirst(s) };
  }

  var DETERMINER = /^(?:a|an|the|your|my|his|her|their|our|this|that|some|someone|one|no|every|each|any|another|more|less|being|feeling|like|as|to)\b/i;
  var PERSON_NOUN = /\b(?:man|woman|person|leader|master|king|queen|lover|partner|boy|girl|guy|presence|figure|warrior|god|goddess|servant|slave|pet|daddy|boss|protector|provider|father|mother|husband|wife|beast|animal|prince|princess|priest)$/i;
  var COPULA = /\b(?:is|are|am|be)$/i;

  // Repairs the join between a template and an inline answer.
  function join(label, text) {
    var t = text;
    if (COPULA.test(label)) {
      t = t.replace(/^(?:am|are|is|be)\s+/i, '');                                  // "when you are am calm"
      if (/\bis$/i.test(label) && PERSON_NOUN.test(t) && !DETERMINER.test(t) && t.split(' ').length <= 4) t = 'a ' + t;  // "is unafraid man"
    }
    return articles(label + ' ' + t);
  }

  function finish(s) {
    s = spacing(s);
    s = s.replace(/^([“‘"]?)([a-z])/, function (m, q, c) { return q + c.toUpperCase(); });
    // One closing mark: keep the person's ! or ?, never stack a full stop after it.
    s = s.replace(/([!?…])\.$/, '$1').replace(/([.!?…])([”’])\.$/, '$1$2');
    if (!/[.!?…][”’]?$/.test(s)) s += '.';
    return s;
  }

  // Lists what still reads as wrong in a finished sentence. An empty list means it passes.
  function check(s) {
    var issues = [];
    function flag(re, name) { if (re.test(s)) issues.push(name); }
    flag(/\s[,.;:!?]/, 'space before punctuation');
    flag(/[,;](?=\S)/, 'no space after comma');
    flag(/[!?]{2,}|[,;:]{2,}|(?:^|[^.])\.\.(?!\.)|[!?…]\.$/, 'stacked punctuation');
    flag(/\s{2,}/, 'double space');
    flag(/^[“‘"]?[a-z]/, 'no capital at the start');
    flag(/[^.!?…”’]$|[^.!?…][”’]$/, 'no closing punctuation');
    flag(/\b(?:you am|you is|you was|you has|you does|yous|I are|I is)\b/, 'agreement');
    flag(/\b(?:are|is|am)\s+(?:are|is|am)\b/i, 'doubled verb');
    flag(/\b(?:are|is)\s+(?:when|while|whenever)\b/i, 'clause after copula');
    flag(/(?:^|[^’'\w])i(?=[\s'’.,;:!?]|$)|\b(?:im|dont|doesnt|didnt|cant|wont|isnt|ive)\b/, 'informal spelling');
    if (/\b(\w+)\s+\1\b/i.test(s) && !DOUBLE_OK.test(s.match(/\b(\w+)\s+\1\b/i)[1])) issues.push('doubled word');
    if (articles(s) !== s) issues.push('a/an');
    if ((s.match(/“/g) || []).length !== (s.match(/”/g) || []).length) issues.push('unbalanced quotation marks');
    // Outside any quotation, a sentence that addresses the reader as "you" must not slip back into "I".
    var unquoted = s.replace(/“[^”]*”/g, '');
    if (/\byou\b/i.test(unquoted) && /\b(?:I|me|my|myself)\b/.test(unquoted)) issues.push('person not converted');
    return issues;
  }

  // Proofs an answer shown on its own. 'statement' is prose (a capital and a closing full stop, line by line);
  // 'fragment' is a name or list item (spacing, spelling and a/an only; the person's own capitals kept).
  function proof(raw, kind) {
    var lines = String(raw == null ? '' : raw).split('\n');
    return lines.map(function (line) {
      var t = normalise(line.replace(/[ \t]+/g, ' ').trim());
      if (!t) return '';
      return kind === 'fragment' ? t : finish(t);
    }).filter(Boolean).join('\n');
  }

  // Renders "<label> <answer>." when the answer fits inline, or "<quoteLabel> “Answer.”" otherwise.
  // quoteLabel defaults to "<label>, in your own words," which stays grammatical for every label.
  // Every result is proofed as a whole before it is returned; an inline result that fails is quoted instead.
  function sentence(label, raw, slot, quoteLabel) {
    var f = fit(raw, slot);
    if (!f) return null;
    var ql = quoteLabel || (/:$/.test(label) ? label : label + ', in your own words,');
    if (f.mode === 'open') return finish(label + ' — this you have left open for now: ' + f.text);
    if (f.mode === 'inline') {
      var s = finish(join(label, f.text));
      if (!check(s).length) return s;
      f = asQuote(tidy(raw), false);
    }
    return finish(ql + ' ' + f.text);
  }

  var api = { fit: fit, sentence: sentence, check: check, proof: proof };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TDHFit = api;
})(typeof window !== 'undefined' ? window : globalThis);
