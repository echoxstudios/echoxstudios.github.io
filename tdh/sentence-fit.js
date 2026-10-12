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

   fit(raw, slot) returns { mode: 'inline' | 'quote', text } or null for an empty answer. */
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
    [/\byou am\b/gi, 'you are'],
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
    q = upperFirst(q.trim());
    if (!/[.!?…]$/.test(q)) q += /^(would|could|can|will|do|does|did|is|are|am|may|might|should|how|what|why|when|where|who|which)\b/i.test(q) ? '?' : '.';
    return { mode: 'quote', text: '“' + q + '”' };
  }

  function fit(raw, slot) {
    var s = tidy(raw);
    if (!s || !/[A-Za-zÀ-ɏ]/.test(s)) return null;
    slot = slot || 'complement';

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
      var removed = VERB_SUBJECT.test(s);
      s = s.replace(VERB_SUBJECT, '');
      if (removed) s = s.replace(/^(?:are|'re|\u2019re)\s+/i, 'is ');
      s = toSecondPerson(s);
      s = agreeThirdPerson(s, removed);
      return { mode: 'inline', text: lowerFirst(s) };
    }

    // complement
    var before = s;
    s = s.replace(COMPLEMENT_ECHO, '');
    s = toSecondPerson(s);
    // A complete clause with its own new subject ("she holds me") cannot follow "is"; quote it instead.
    if (/^(?:she|he|they|someone|somebody|people|everyone|nobody)\s+\w+/i.test(s) && !/^(?:she|he|they)\s+(?:is|are)\b/i.test(before)) {
      return asQuote(before, false);
    }
    return { mode: 'inline', text: lowerFirst(s) };
  }

  // Renders "<label> <answer>." when the answer fits inline, or "<quoteLabel> “Answer.”" otherwise.
  // quoteLabel defaults to "<label>, in your own words," which stays grammatical for every label.
  function sentence(label, raw, slot, quoteLabel) {
    var f = fit(raw, slot);
    if (!f) return null;
    if (f.mode === 'inline') return label + ' ' + f.text + '.';
    return (quoteLabel || label + ', in your own words,') + ' ' + f.text;
  }

  var api = { fit: fit, sentence: sentence };
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TDHFit = api;
})(typeof window !== 'undefined' ? window : globalThis);
