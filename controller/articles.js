
const Article = require('../model/Article')


//Logged in and not Logged in users can access the list of aricle
const showAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 20; 
        const skip = (page - 1) * limit; 

        // Construct  search filter based on query parameters
        const filter = {};
        if (req.query.author) {
            filter.author = req.query.author;
        }
        if (req.query.title) {
            filter.title = { $regex: req.query.title, $options: 'i' }; 
        }
        if (req.query.tags) {
            filter.tags = { $in: req.query.tags.split(',') }; // Search for blogs with any of the provided tags
        }

        // Construct  sort criteria based on query parameters
        let sortCriteria = {};
        const order = req.query.order;
        if (order === 'read_count' || order === '-read_count' || order === 'reading_time' || order === '-reading_time' || order === 'timestamp' || order === '-timestamp') {
            sortCriteria[order] = 1; // Sort in ascending order by default
        }

        // Find articles based on the constructed filter and sort criteria
        const articles = await Article.find(filter)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        res.status(200).json(articles);
    } catch (error) {
        console.error('Error listing blogs:', error);
        res.status(500).json({ error: 'Could not find blogs' });
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
        const {id: articleID} = req.params
        const { status } = req.body;

const article = await Task.findOneAndUpdate({_id: articleID}, req.body,{
new: true,
runValidators: true,
})
if(!task){
        return res.status(404).json({ msg: `No Article with id : ${articleID}` })
    }
    res.status(200).json(article)
        
    } catch (error) {
        es.status(500).json({ msg: error });
    }
};


const deleteArticle = async (req, res) => {
    try {
        const {id: articleID} = req. params
    const article = await Article.findOne({_id: articleID})

if (!article){
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



