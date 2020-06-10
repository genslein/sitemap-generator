const path = require('path');
const rand = require('crypto-random-string');
const os = require('os');
const fs = require('fs');
const escapeUnsafe = require('./helpers/escapeUnsafe');

module.exports = function SitemapStream() {
  const tmpPath = path.join(os.tmpdir(), `sitemap_${rand(10)}`);
  const stream = fs.createWriteStream(tmpPath);

  stream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n');
  const urlSetProperties = `<urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="
            http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
  stream.write(urlSetProperties);

  const getPath = () => tmpPath;

  const write = (url, currentDateTime, changeFreq, priority) => {
    const escapedUrl = escapeUnsafe(url);
    stream.write('\n  <url>\n');
    stream.write(`    <loc>${escapedUrl}</loc>\n`);
    if (currentDateTime) {
      stream.write(`    <lastmod>${currentDateTime}</lastmod>\n`);
    }
    if (changeFreq) {
      stream.write(`    <changefreq>${changeFreq}</changefreq>\n`);
    }
    if (priority) {
      stream.write(`    <priority>${priority}</priority>\n`);
    }
    stream.write('  </url>');
  };

  const end = () => {
    stream.write('\n</urlset>');
    stream.end();
  };

  return {
    getPath,
    write,
    end,
  };
};
