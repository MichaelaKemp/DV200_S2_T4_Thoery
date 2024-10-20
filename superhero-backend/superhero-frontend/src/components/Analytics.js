// Analytics.js
export const initGA = () => {
    if (typeof window !== 'undefined' && !window.gtag) {
      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('js', new Date());
  
      gtag('config', 'G-NS74XT5KWT'); // Replace with your Google Analytics measurement ID
    }
  };
  
  export const logPageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-NS74XT5KWT', {
        page_path: url,
      });
    }
  };  