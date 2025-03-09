const puppeteer = require('puppeteer');

async function searchBandcamp(artist, title) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
  });
  const page = await browser.newPage();

  // 🎯 半角スペースを「+」に置き換える
  const formattedArtist = artist.replace(/ /g, '+');
  const formattedTitle = title.replace(/ /g, '+');

  // 🎯 Bandcampの検索URLを修正
  const query = `${formattedArtist}+${formattedTitle}`;
  const searchUrl = `https://bandcamp.com/search?q=${query}&item_type`;

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  try {
    // 🎯 検索結果の要素がロードされるまで待つ（最大10秒）
    await page.waitForSelector('.searchresult .itemurl a', { timeout: 10000 });

    // 🎯 最初に見つかった曲のリンクを取得（`a` タグを指定）
    const songLink = await page.$eval('.searchresult .itemurl a', el => el.href);
    console.log('購入リンク:', songLink);
    await browser.close();
    return songLink;
    
  } catch (error) {
    console.error('❌ Bandcamp 検索エラー:', error);

    // 🎯 デバッグ用: ページのHTMLを出力（最初の検索結果のみ）
    const firstResultHtml = await page.evaluate(() => {
      const result = document.querySelector('.searchresult');
      return result ? result.innerHTML : '検索結果なし';
    });
    console.log('🧐 最初の検索結果:', firstResultHtml);

    await browser.close();
    return null;
  }
}

module.exports = searchBandcamp;
