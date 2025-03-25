const puppeteer = require('puppeteer');

async function searchBandcamp(artist, title) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
  });

  const page = await browser.newPage();

  const formattedArtist = artist.replace(/ /g, '+');
  const formattedTitle = title.replace(/ - Original Mix/g, '').replace(/ /g, '+');

  const query = `${formattedArtist}+${formattedTitle}`;
  const searchUrl = `https://bandcamp.com/search?q=${query}&item_type`;

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  try {
    await page.waitForSelector('.searchresult .itemurl a', { timeout: 10000 });

    const songLink = await page.$eval('.searchresult .itemurl a', el => el.href);
    console.log('購入リンク:', songLink);
    await browser.close();
    return songLink;
    
  } catch (error) {
    console.error('❌ Bandcamp 検索エラー:', error);

    const firstResultHtml = await page.evaluate(() => {
      const result = document.querySelector('.searchresult');
      return result ? result.innerHTML : '検索結果なし';
    });
    console.log('最初の検索結果:', firstResultHtml);

    await browser.close();
    return null;
  }
}

module.exports = searchBandcamp;
