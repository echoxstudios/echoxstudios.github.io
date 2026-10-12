(() => {
  // The ECHOx artist mark is a small, quiet signature, instantly seen but never loud (about 20px high), always in the
  // lower left with a small copyright sign beside it.
  // Where a footer shows the text logo (.footer-logo, lower-left gutter) the mark replaces that text in place,
  // with the copyright sign to its left (the footer line itself no longer repeats the name);
  // on pages without one it opens the page footer in the same place, or closes a page that has no footer.
  const script = document.currentScript;
  const base = script && script.src ? script.src.replace(/brand-signature\.js.*$/, '') : '/';
  if (document.documentElement.hasAttribute('data-no-signature')) return;

  const style = document.createElement('style');
  style.textContent = '.echox-signature{align-self:stretch;box-sizing:border-box;display:flex;justify-content:flex-start;align-items:center;gap:5px;padding:2.25rem 0 3.6rem;line-height:0;text-align:left}.echox-signature.in-footer{flex:0 0 100%;width:auto;padding:0 0 .9rem;margin:0}.echox-signature a,.footer-logo a.echox-mark-link{display:inline-block;line-height:0;opacity:.8;transition:opacity .25s}.echox-signature a:hover,.echox-signature a:focus-visible,.footer-logo a.echox-mark-link:hover,.footer-logo a.echox-mark-link:focus-visible{opacity:1}.echox-signature img{height:20px;width:auto;display:block}.footer-logo{line-height:0}.footer-logo.has-mark{display:inline-flex!important;align-items:center;gap:5px}.footer-logo .echox-copy,.echox-signature .echox-copy{font:400 13px/1 Inconsolata,monospace;white-space:nowrap;color:var(--bone,#d4cfc4);opacity:.8;letter-spacing:0}.footer-logo img{height:20px;width:auto;display:block}@media print{.echox-signature{display:none}}';
  document.head.appendChild(style);

  const makeLink = () => {
    const link = document.createElement('a');
    link.href = base + 'about-echoxstudios.html';
    link.setAttribute('aria-label', 'About ECHOxSTUDIOS');
    const img = document.createElement('img');
    img.src = base + 'assets/brand/echox-artist-mark-onblack.svg?v=20261007';
    img.alt = 'ECHOx';
    img.width = 83; img.height = 20; img.decoding = 'async'; img.loading = 'lazy';
    link.appendChild(img);
    return link;
  };

  // The copyright notice reads "© [mark] 2026": the sign to the left of the mark, the year to its right, all vertically
  // centred. The mark is the name, so the footer line below no longer repeats "© ECHOx".
  const makeCopy = () => {
    const copy = document.createElement('span');
    copy.className = 'echox-copy';
    copy.textContent = '\u00a9';
    copy.setAttribute('aria-label', 'Copyright');
    return copy;
  };
  const makeYear = () => {
    const year = document.createElement('span');
    year.className = 'echox-copy echox-year';
    year.textContent = String(new Date().getFullYear());
    return year;
  };

  // One logo per page: the footer notice carries the name, so the navigation's text wordmark (a second "ECHOx",
  // directly above it at the end of the page) is withdrawn. The navigation keeps its Home link. A logo featured in
  // the page itself, as on the About ECHOxSTUDIOS presentation, is content and stays.
  document.querySelectorAll('.nav-logo').forEach(el => { el.style.visibility = 'hidden'; el.setAttribute('aria-hidden', 'true'); el.tabIndex = -1; });  // keeps its space, so the navigation does not shift

  const footerLogos = document.querySelectorAll('.footer-logo');
  if (footerLogos.length) {
    footerLogos.forEach(el => {
      const link = makeLink();
      link.className = 'echox-mark-link';
      el.textContent = '';
      el.classList.add('has-mark');
      el.append(makeCopy(), link, makeYear());
    });
    return;
  }

  // No footer logo slot: the mark (with its copyright sign) takes the same place, at the start of the page footer;
  // on a page without a footer it closes the page, at the left of the content. Where the page has a footer, it opens that footer; otherwise it follows the last content.
  const wrap = document.createElement('div');
  wrap.className = 'echox-signature';
  const link = makeLink();
  link.firstChild.height = 20; link.firstChild.width = 83;
  wrap.append(makeCopy(), link, makeYear());
  const footer = [...document.querySelectorAll('body footer')].filter(f => !f.closest('[role="dialog"]')).pop();
  if (footer) { wrap.classList.add('in-footer'); footer.insertBefore(wrap, footer.firstChild); }
  else document.body.appendChild(wrap);

  // The mark follows the left margin of the page's text. A left-aligned footer already starts on that margin.
  // A centred footer (the TDH briefing pages) does not, so the mark is moved onto the reading column's text edge.
  if (footer && getComputedStyle(footer).textAlign === 'center') {
    const column = [...document.querySelectorAll('.wrap')].filter(el => !footer.contains(el) && el.offsetParent).pop();
    if (column) {
      const align = () => {
        wrap.style.marginLeft = '0';
        const edge = column.getBoundingClientRect().left + parseFloat(getComputedStyle(column).paddingLeft);
        wrap.style.marginLeft = Math.round(edge - wrap.getBoundingClientRect().left) + 'px';
      };
      align();
      window.addEventListener('resize', align);
      window.addEventListener('load', align);
    }
  }

})();
