import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Generate or retrieve an anonymous session ID persisted in localStorage. */
function getOrCreateSessionId() {
  const KEY = 'kw_sid';
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

/** Check if this session_id has been seen before (returning visitor). */
function isNewVisitor() {
  const KEY = 'kw_visited';
  const visited = localStorage.getItem(KEY);
  if (!visited) {
    localStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}

/** Parse UTM params from the current URL. */
function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source') || null,
    utm_medium: p.get('utm_medium') || null,
    utm_campaign: p.get('utm_campaign') || null,
  };
}

/**
 * Classify traffic source from UTM params + referrer.
 * Priority: UTM source → referrer domain → direct.
 */
function classifySource(utmSource, referrer) {
  // UTM-based classification
  if (utmSource) {
    const s = utmSource.toLowerCase();
    if (s.includes('instagram') || s.includes('ig')) return 'instagram';
    if (s.includes('facebook') || s.includes('fb') || s.includes('meta')) return 'meta';
    if (s.includes('google') || s.includes('bing') || s.includes('duckduckgo') || s.includes('yahoo')) return 'seo';
    if (s.includes('email') || s.includes('newsletter') || s.includes('klaviyo')) return 'email';
    if (s.includes('twitter') || s.includes('x.com') || s.includes('linkedin') || s.includes('youtube')) return 'social';
    return 'other';
  }

  // Referrer-based classification
  if (!referrer) return 'direct';
  const r = referrer.toLowerCase();
  if (r.includes('google.') || r.includes('bing.') || r.includes('duckduckgo.') || r.includes('yahoo.') || r.includes('yandex.') || r.includes('baidu.')) return 'seo';
  if (r.includes('instagram.') || r.includes('l.instagram.')) return 'instagram';
  if (r.includes('facebook.') || r.includes('fb.com') || r.includes('fb.me')) return 'meta';
  if (r.includes('twitter.') || r.includes('t.co') || r.includes('x.com') || r.includes('linkedin.') || r.includes('youtube.')) return 'social';
  if (r.includes('mail.') || r.includes('outlook.') || r.includes('gmail.') || r.includes('yahoo.com/mail')) return 'email';
  return 'other';
}

/** Detect device type from user-agent. */
function detectDevice() {
  const ua = navigator.userAgent || '';
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return 'mobile';
  return 'desktop';
}

/** Fetch geo data once per session using ipapi.co (free, no key required, 1k req/day). */
async function fetchGeo() {
  const KEY = 'kw_geo';
  const cached = localStorage.getItem(KEY);
  if (cached) return JSON.parse(cached);
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { country: null, city: null };
    const d = await res.json();
    const geo = { country: d.country_name || null, city: d.city || null };
    localStorage.setItem(KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return { country: null, city: null };
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AnalyticsTracker({ currentSection }) {
  const sessionId = useRef(getOrCreateSessionId());
  const newVisitor = useRef(isNewVisitor());
  const geoRef = useRef(null);
  const metaRef = useRef(null);   // { source, medium, campaign, referrer, device, country, city }
  const initialized = useRef(false);

  // ── On mount: build shared metadata (geo + UTM + device) once ──────────
  useEffect(() => {
    async function init() {
      const { utm_source, utm_medium, utm_campaign } = getUtmParams();
      const referrer = document.referrer ? document.referrer.slice(0, 255) : null;
      const source = classifySource(utm_source, referrer);
      const device = detectDevice();
      const geo = await fetchGeo();
      geoRef.current = geo;
      metaRef.current = {
        source,
        medium: utm_medium,
        campaign: utm_campaign,
        referrer,
        device,
        country: geo.country,
        city: geo.city,
      };
      initialized.current = true;
    }
    init();
  }, []);

  // ── Track page views when section changes ──────────────────────────────
  useEffect(() => {
    if (!currentSection) return;

    async function logPageView() {
      // Wait up to 3s for geo/meta to resolve
      let waited = 0;
      while (!initialized.current && waited < 3000) {
        await new Promise(r => setTimeout(r, 100));
        waited += 100;
      }
      const meta = metaRef.current || {};
      try {
        await supabase.from('analytics').insert([{
          event_type: 'page_view',
          path: currentSection,
          session_id: sessionId.current,
          is_new_visitor: newVisitor.current,
          source: meta.source || 'direct',
          medium: meta.medium || null,
          campaign: meta.campaign || null,
          referrer: meta.referrer || null,
          device: meta.device || detectDevice(),
          country: meta.country || null,
          city: meta.city || null,
        }]);
        // After first insert, mark as returning for subsequent events
        newVisitor.current = false;
      } catch (err) {
        console.error('Analytics error:', err);
      }
    }
    logPageView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  // ── Track clicks globally ──────────────────────────────────────────────
  useEffect(() => {
    async function handleGlobalClick(e) {
      const target = e.target.closest('button, a');
      if (!target) return;
      let label = (target.innerText || target.getAttribute('aria-label') || target.tagName)
        .replace(/\s+/g, ' ').slice(0, 80).trim();
      if (!label) return;

      const meta = metaRef.current || {};
      try {
        await supabase.from('analytics').insert([{
          event_type: 'click',
          path: label,
          session_id: sessionId.current,
          is_new_visitor: false,
          source: meta.source || 'direct',
          medium: meta.medium || null,
          campaign: meta.campaign || null,
          referrer: meta.referrer || null,
          device: meta.device || detectDevice(),
          country: meta.country || null,
          city: meta.city || null,
        }]);
      } catch (err) {
        console.error('Analytics click error:', err);
      }
    }

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return null;
}
