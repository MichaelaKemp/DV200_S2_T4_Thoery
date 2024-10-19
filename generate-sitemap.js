const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

// Define the path to the public folder in superhero-frontend
const sitemapPath = path.join(__dirname, 'superhero-backend', 'superhero-frontend', 'public', 'sitemap.xml');

// Generate the sitemap
const sitemap = new SitemapStream({ hostname: 'https://supers-hub-b2090f2bdf4f.herokuapp.com' });
const writeStream = createWriteStream(sitemapPath);

sitemap.pipe(writeStream);

// Add your routes here
sitemap.write({ url: '/', changefreq: 'daily', priority: 0.8 });
sitemap.write({ url: '/characters', changefreq: 'weekly', priority: 0.7 });
sitemap.end();

streamToPromise(sitemap).then(() => {
  console.log('Sitemap saved to', sitemapPath);
});