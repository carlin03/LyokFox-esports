/* Iconos SVG LyokFox Studio — sin emojis */
window.LYOK_ICONS = {
  svg: function (name, cls) {
    cls = cls || 'st-ico';
    var paths = {
      home: 'M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-10.5z',
      image: 'M4 5h16v14H4V5zm0 0l16 14M4 19l5-5 4 4 3-3 4 4',
      spark: 'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z',
      megaphone: 'M3 10v4h4l5 4V6L7 10H3zm11.5 2a3.5 3.5 0 000-4',
      ball: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20M2 12h20',
      list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
      bolt: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
      calendar: 'M4 5h16v16H4V5zm4-2v4m8-4v4M4 11h16',
      handshake: 'M4 12l4 4m0-4l4-4m-4 4h12a2 2 0 012 2v2',
      search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.5-4.5',
      news: 'M4 6h16v12H4V6zm4 0v12m8-12v12',
      scroll: 'M4 4h16v16H4V4zm4 8h8m-8-4h8',
      users: 'M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm12 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
      gamepad: 'M6 12h4m-2-2v4m7-1h.01M16 12h.01M18 6H6a4 4 0 00-4 4v4a4 4 0 004 4h12a4 4 0 004-4v-4a4 4 0 00-4-4z',
      eye: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z',
      eyeOff: 'M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.7 10.7 0 0112 5c7 0 10 7 10 7a18.2 18.2 0 01-4.9 5.1M6.1 6.1A18.2 18.2 0 002 12s3 7 10 7a10.7 10.7 0 005.9-1.9',
      save: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
      upload: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
      download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
      reset: 'M4 4v5h5M20 20v-5h-5M20 9A8 8 0 006.3 6.3L4 9m16 7l-2.3 2.7A8 8 0 014 15',
      menu: 'M4 6h16M4 12h16M4 18h16',
      footer: 'M4 20h16M6 16h12M8 12h8M10 8h4',
      page: 'M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z',
      palette: 'M12 3a9 9 0 109 9c0-1.5-.4-2.9-1-4.1M12 3v9M12 12l6.5 3.5',
      link2: 'M10 13a5 5 0 007.5 0l2-2a5 5 0 00-7.5-7.5l-1 1M14 11a5 5 0 00-7.5 0l-2 2a5 5 0 007.5 7.5l1-1',
      user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
      gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zm8.5-3a7.5 7.5 0 01-.2 1.7l2 1.5-2 3.5-2.4-1a7.6 7.6 0 01-3 1.7L14 22h-4l-.9-3.6a7.6 7.6 0 01-3-1.7l-2.4 1-2-3.5 2-1.5a7.5 7.5 0 010-3.4l-2-1.5 2-3.5 2.4 1a7.6 7.6 0 013-1.7L10 2h4l.9 3.6a7.6 7.6 0 013 1.7l2.4-1 2 3.5-2 1.5c.1.55.2 1.12.2 1.7z',
      link: 'M10 13a5 5 0 007.5 0l2-2a5 5 0 00-7.5-7.5l-1 1M14 11a5 5 0 00-7.5 0l-2 2a5 5 0 007.5 7.5l1-1',
      mail: 'M4 6h16v12H4V6zm0 0l8 6 8-6'
    };
    var d = paths[name] || paths.home;
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  },
  previewBtn: function (label) {
    return LYOK_ICONS.svg('eye', 'st-ico st-ico-sm') + '<span>' + (label || 'Previsualizar') + '</span>';
  },
  logoMark: function (src, cls) {
    return '<img src="' + (src || 'img/logo.jpg') + '" alt="" class="' + (cls || 'studio-logo-mark') + '">';
  }
};
