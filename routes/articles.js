const express = require('express');
const router = express.Router();

const {showAll, createArticle, showSingle, updateArticle, deleteArticle} = require('../controller/articles')
router.route('/create').post(createArticle)
router.route('/').get(showAll);
router.route('/:id').get(showSingle).patch(updateArticle).delete(deleteArticle)


module.exports = router