/*
 * Client side script to retrieve the latest cryptocurrency news from an RSS
 * feed and render it on the page. The script uses the rss2json.com service
 * to convert an RSS feed into JSON. If the service becomes unavailable or
 * rate limited, you can switch to another proxy such as AllOrigins or host
 * your own proxy. News are fetched when the page has loaded and the 10 most
 * recent items are displayed with their publication date.
 */

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('news-container');

  // RSS feed containing cryptocurrency news. Feel free to change this to
  // another reputable source if desired. The feed chosen here is from
  // cryptonews.com which aggregates a broad range of news items across the
  // crypto market.
  const rssUrl = 'https://cryptonews.com/news/feed';
  // Use the rss2json API to convert the RSS feed into JSON. This service is
  // free for low volumes and does not require an API key. Should the API
  // become unavailable, replace this URL with another proxy or build your
  // own simple RSS parser.
  const apiUrl =
    'https://api.rss2json.com/v1/api.json?rss_url=' +
    encodeURIComponent(rssUrl);

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (!data || data.status !== 'ok') {
        container.innerHTML =
          '<p>Es konnten keine Nachrichten geladen werden. Bitte versuchen Sie es später erneut.</p>';
        return;
      }
      const items = data.items.slice(0, 10);
      container.innerHTML = '';
      // Helper to strip HTML tags from descriptions
      function stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
      }
      items.forEach((item) => {
        const date = new Date(item.pubDate);
        // Convert description HTML to plain text and truncate to 40 words
        const plain = stripHTML(item.description || '');
        const words = plain.split(/\s+/).filter((w) => w.length > 0);
        const preview = words.slice(0, 40).join(' ') + (words.length > 40 ? ' …' : '');
        const article = document.createElement('div');
        article.className = 'news-item';
        article.innerHTML = `
          <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
          <p class="news-date">${date.toLocaleDateString('de-DE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
          <p class="news-desc">${preview}</p>
        `;
        container.appendChild(article);
      });
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML =
        '<p>Fehler beim Laden der Nachrichten. Bitte versuchen Sie es später erneut.</p>';
    });
});