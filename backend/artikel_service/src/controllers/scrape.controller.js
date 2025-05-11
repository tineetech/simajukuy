import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeData = async (req, res) => {
    try {
        const response = await axios.get('https://www.kompas.com');
        const $ = cheerio.load(response.data);

        const mainHeadline = {
            title: $('.hlItem .hlTitle').first().text().trim(),
            url: $('.hlItem a').first().attr('href'),
            image: $('.hlItem img').first().attr('src') || $('.hlItem img').first().attr('data-src'),
            category: $('.hlItem .hlSubtitle').first().text().trim()
        };

        const secondaryHeadlines = [];
        $('.hlWrap-grid .hlItem').each((index, element) => {
            const item = {
                title: $(element).find('.hlTitle').text().trim(),
                url: $(element).find('a').attr('href'),
                image: $(element).find('img').attr('src') || $(element).find('img').attr('data-src'),
                category: $(element).find('.hlChannel').text().trim()
            };
            if (item.title && item.url) {
                secondaryHeadlines.push(item);
            }
        });

        const trendingNews = [];
        $('.trendItem').each((index, element) => {
            const item = {
                title: $(element).find('.trendTitle a').text().trim(),
                url: $(element).find('.trendTitle a').attr('href'),
                rank: index + 1
            };
            if (item.title && item.url) {
                trendingNews.push(item);
            }
        });

        res.json({
            mainHeadline,
            secondaryHeadlines,
            trendingNews,
            scrapedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            error: 'Error scraping Kompas headlines',
            details: error.message
        });
    }
};