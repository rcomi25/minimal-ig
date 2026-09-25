// ==UserScript==
// @name         Minimal IG Engine
// @namespace    https://minimal-ig.local/
// @version      1.0.0
// @description  Rimuove Reels, Esplora e contenuti compulsivi da Instagram per un'esperienza intenzionale.
// @author       Minimal IG
// @match        https://www.instagram.com/*
// @grant        none
// @run-at       document-start
// ==UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.id = 'minimal-ig-styles';
  style.textContent = `
    a[href*="/reels/"],
    a[href*="/explore/"],
    svg[aria-label*="Reels"],
    svg[aria-label*="Esplora"],
    svg[aria-label*="Explore"] {
      display: none !important;
    }

    div:has(> a[href*="/reels/"]),
    div:has(> a[href*="/explore/"]) {
      display: none !important;
    }

    div:has(> span:contains("Suggested posts")),
    div:has(> span:contains("Post suggeriti")),
    div:has(> span:contains("Suggested for you")) {
      display: none !important;
    }

    div[aria-label*="Reels"],
    div[aria-label*="reels"] {
      display: none !important;
    }
  `;

  const injectStyle = () => {
    if (document.head && !document.getElementById('minimal-ig-styles')) {
      document.head.appendChild(style);
    }
  };

  injectStyle();
  document.addEventListener('DOMContentLoaded', injectStyle);

  const enforceIntentionalNavigation = () => {
    const path = window.location.pathname;
    if (path.startsWith('/reels/') || path.startsWith('/explore/')) {
      window.location.replace('https://www.instagram.com/');
    }
  };

  enforceIntentionalNavigation();

  const observer = new MutationObserver(() => {
    injectStyle();
    enforceIntentionalNavigation();
  });

  observer.observe(document, { childList: true, subtree: true });
})();