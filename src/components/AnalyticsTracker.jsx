import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AnalyticsTracker({ currentSection }) {
  // Track Page Views
  useEffect(() => {
    async function logPageView() {
      if (!currentSection) return;
      try {
        await supabase.from('analytics').insert([{
          event_type: 'page_view',
          path: currentSection
        }]);
      } catch (err) {
        console.error('Analytics error:', err);
      }
    }
    logPageView();
  }, [currentSection]);

  // Track Clicks globally
  useEffect(() => {
    async function handleGlobalClick(e) {
      // Find closest interactive element
      const target = e.target.closest('button, a');
      if (target) {
        let label = target.innerText || target.getAttribute('aria-label') || target.tagName;
        // Clean up text
        label = label.replace(/\s+/g, ' ').slice(0, 50).trim(); 
        
        try {
          await supabase.from('analytics').insert([{
            event_type: 'click',
            path: label
          }]);
        } catch (err) {
          console.error('Analytics error:', err);
        }
      }
    }

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null; // This component doesn't render anything visually
}
