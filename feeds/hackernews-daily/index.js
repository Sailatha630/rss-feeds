const axios = require('axios');
const render = require('../../utils/render');
const dump = require('../../utils/dump');

const run = async (date, num) => {
  console.log('start fetching')
  try {
    const endTime = Math.round(new Date(date).getTime() / 1000);
    const startTime = Math.round(new Date(date).getTime() / 1000) - (25 * 60 * 60);
    const res = await axios.get(
      `https://hn.algolia.com/api/v1/search?numericFilters=created_at_i>${startTime},created_at_i<${endTime}`);
    const topN = res.data.hits.slice(0, num);
    console.log(topN);
    if (!topN) {
      console.log("Failed to get topics from API");
      return;
    }

    const content = {
      title:  "Hacker News Daily Top 12",
      description: "Read HackerNews every day",
      link: "https://github.com/tabhub/rss-feeds",
      item: topN.map((item) => {
        let {title, url, author, created_at, points, objectID, num_comments} = item;
        if(!url) url = `https://news.ycombinator.com/item?id=${objectID}`;
        return {
          title: title,
          link: url,
          author: author,
          pubDate: created_at,
          description: `${points} points | ${num_comments} comments`
        };
      })
    };

    const xml = render(content);
    const path = "./data/hn-daily/latest.xml";
    dump(path, xml);
  } catch (error) {
    console.log(error);
    throw(error);
  }
}

run(new Date(), 12);
