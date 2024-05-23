
const Article = require('../model/Article')
const redisClient = require('../cache/redis')






//Logged in and not Logged in users can access the list of aricle
const showAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Construct the search filter based on query parameters
        const filter = {};
        if (req.query.author) {
            filter.author = req.query.author;
        }
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' };
        }
        if (req.query.tags) {
            filter.tags = { $in: req.query.tags.split(',') };
        }

        // Construct the sort criteria based on query parameters
        const sortCriteria = {};
        if (req.query.order) {
            const order = req.query.order.startsWith('-') ? -1 : 1;
            const field = req.query.order.replace('-', '');
            if (['read_count', 'reading_time', 'timestamp'].includes(field)) {
                sortCriteria[field] = order;
            }
        }

        // Create a unique cache key based on the query parameters
        const cacheKey = `/api/v1/articles?page=${page}&limit=${limit}&author=${req.query.author || ''}&title=${req.query.title || ''}&tags=${req.query.tags || ''}&order=${req.query.order || ''}`;


        // Check the cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Returning data from cache');
            return res.json({
                data: JSON.parse(cachedData),
                error: null
            });
        }

        // Query the database with the constructed filter and sort criteria
        const articles = await Article.find(filter)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        // Store the result in the cache
        await redisClient.setEx(cacheKey, 10 * 60, JSON.stringify(articles));

        console.log('Returning data from database');
        return res.status(200).json(articles);
    } catch (error) {
        console.error('Error listing articles:', error);
        res.status(500).json({ error: 'Could not find articles' });
    }
};







const calculateReadingTime = (text, averageSpeed = 250) => {
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / averageSpeed);
    return readingTime;
};

const createArticle = async (req, res) => {
    try {
        // Calculate reading time
        const readingTime = calculateReadingTime(req.body.body);

        // Add reading time to the article data
        req.body.reading_time = readingTime;
        req.body.status = "draft";

        // Create the article
        const article = await Article.create(req.body);

        res.status(201).json(article);
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Could not create article' });
    }
};



const showSingle = async (req, res) => {
    try {
        const { id: articleID } = req.params;

        // Find the article by its ID
        const article = await Article.findOneAndUpdate(
            { _id: articleID },
            { $inc: { read_count: 1 } }, // Increment the read count by 1
            { new: true }
        ).populate('author'); // Populate the 'author' field to include user information

        if (!article) {
            return res.status(404).json({ msg: `No Article with id : ${articleID}` });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching single article:', error);
        res.status(500).json({ msg: 'Could not fetch article' });
    }
};




const updateArticle = async (req, res) => {
    try {
        const { id: articleID } = req.params
        const { status } = req.body;

        const article = await Task.findOneAndUpdate({ _id: articleID }, req.body, {
            new: true,
            runValidators: true,
        })
        if (!task) {
            return res.status(404).json({ msg: `No Article with id : ${articleID}` })
        }
        res.status(200).json(article)

    } catch (error) {
        es.status(500).json({ msg: error });
    }
};


const deleteArticle = async (req, res) => {
    try {
        const { id: articleID } = req.params
        const article = await Article.findOne({ _id: articleID })

        if (!article) {
            return res.status(404).json({ msg: `No Article with id : ${articleID}` })
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ msg: error });
    }

};


module.exports = {
    showAll,
    createArticle,
    showSingle,
    updateArticle,
    deleteArticle
};


