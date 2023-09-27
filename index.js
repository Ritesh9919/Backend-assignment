const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const db = require('./db/mongoose');
const User = require('./model/users');
const Post = require('./model/posts');
const Book = require('./model/books');


async function fetchUserData() {
    try {
        const response = await axios.get('https://dummyapi.io/data/v1/user', {
            headers: { 'app-id': process.env.APP_ID }
        })

        // Store userdata in database
        const userData = response.data.data;
        const { title, firstName, lastName, picture } = userData;
        // console.log(userData);
        await User.create({ title, firstName, lastName, picture });

        //Fetch and store Posts data for each user
        for (const user of userData) {
            const userPostsResponse = await axios.get(`https://dummyapi.io/data/v1/user/${user.id}/post`, {
                headers: { 'app-id': process.env.APP_ID }
            })

            const userPosts = userPostsResponse.data.data;
            for (const post of userPosts) {
                const { image, likes, text, publishDate, tags } = post;
                await Post.create({
                    userId: user.id,
                    image: image,
                    likes: likes,
                    publishData: publishDate,
                    text: text,
                    tags: tags


                })
            }
        }

        console.log('User and Post data fetched and stored successfully.');

    } catch (err) {
        console.log('Error fetching and storing user and post data:', err);
    }

}


async function scrapeAndStoreBooksData() {
    try {
        // Scrape Books data from the website
        const totalPages = 50; // Assuming 50 pages
        const booksData = [];

        for (let page = 1; page <= totalPages; page++) {
            const response = await axios.get(`http://books.toscrape.com/catalogue/page-${page}.html`);
            const $ = cheerio.load(response.data);

            // Extract book attributes from the page using CSS selectors
            $('.product_pod').each((index, element) => {
                const name = $(element).find('h3 a').attr('title');
                const price = $(element).find('.price_color').text();
                const availability = $(element).find('.availability').text().trim();
                const ratings = $(element).find('p.star-rating').attr('class').replace('star-rating', '').trim();

                booksData.push({ name, price, availability, ratings });
            });
        }

        // Store Books data in the database
        await Book.create(booksData);
        
        console.log('Books data scraped and stored successfully.');
    } catch (error) {
        console.error('Error scraping and storing books data:', error);
    }
}





fetchUserData()
scrapeAndStoreBooksData()






