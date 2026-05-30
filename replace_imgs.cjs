const fs = require('fs');
let content = fs.readFileSync('src/data.js', 'utf8');
content = content.replace(/series:\s*"(.*?)",([\s\S]*?)image:\s*"(.*?)"/g, (match, series, mid, img) => {
  let newImg = '/core-bottle.png';
  if (series.includes('Wellness')) newImg = '/wellness-bottle.png';
  if (series.includes('Liposomal')) newImg = '/liposomal-bottle.png';
  return match.replace(img, newImg);
});
fs.writeFileSync('src/data.js', content);
console.log('done');
