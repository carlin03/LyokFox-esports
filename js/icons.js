/* Iconografía SVG — sin emoticonos */
var ICONS = {
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l16 16M20 4L4 20"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  hashtag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 4l1 8M16 4l-1 8M6 9h12M5 15h12M7 20l1-8M17 20l-1-8"/></svg>',
  crown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 18h18M5 18l2-10 5 5 5-5 2 10"/><path d="M7 8L4 4M12 13V4M17 8l3-4"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  teams: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 11a3 3 0 100-6 3 3 0 000 6zM16 13a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M10 20a6 6 0 0112 0"/></svg>',
  sponsor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 12l5 5 10-10M3 12l4 4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  broadcast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10a8 8 0 0116 0"/><path d="M7 10a5 5 0 0110 0"/><circle cx="12" cy="17" r="2"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  pitch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14M3 12h18"/><circle cx="12" cy="12" r="2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 22l2.3-7-6-4.6h7.6L12 3z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 4h8v3a4 4 0 01-8 0V4z"/><path d="M6 4H4v1a3 3 0 003 3M18 4h2v1a3 3 0 01-3 3"/><path d="M12 11v3M9 20h6M10 14h4v3H10z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>',
  fox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3L4 9v12h16V9L12 3z"/><path d="M9 14h6M10 18h4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

function icon(name) {
  var overrides = window.CMS_ICON_OVERRIDES || {};
  if (overrides[name]) {
    return '<span class="ico cms-ico-img"><img src="' + String(overrides[name]).replace(/"/g, '&quot;') + '" alt="" class="cms-custom-icon" loading="lazy"></span>';
  }
  return ICONS[name] ? '<span class="ico">' + ICONS[name] + '</span>' : '';
}
