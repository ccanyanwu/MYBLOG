var express = require('express');
var router = express.Router();


const flash = require('connect-flash');
var Author = require('../models/author');
var models = require('../models');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({extended:false});


// Require our controllers.
var author_controller = require('../controllers/authorController');
var post_controller = require('../controllers/postController'); 
var category_controller = require('../controllers/categoryController');
var comment_controller = require('../controllers/commentController');


/// POST ROUTES ///

// GET request for creating a Post. NOTE This must come before routes that display Post (uses id).
router.get('/post/create', post_controller.post_create_get);

// POST request for creating Post.
router.post('/post/create', post_controller.post_create_post);

// GET request to delete Post.
router.get('/post/:post_id/delete', post_controller.post_delete_get);

// POST request to delete Post.
router.post('/post/:post_id/delete', post_controller.post_delete_post);

// GET request to update Post.
router.get('/post/:post_id/update', post_controller.post_update_get);

// POST request to update Post.
router.post('/post/:post_id/update', post_controller.post_update_post);

// GET request for one Post.
router.get('/post/:post_id', post_controller.post_detail);

// GET request for list of all Post.
router.get('/posts', post_controller.post_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
//router.post('/author/create', author_controller.author_create_post);

//first attempt
router.post('/author/create', urlencodedParser, [
    check('first_name', 'First name must be valid and not less than 3 characters').exists().isLength({min: 3}),
    check('last_name', 'Last name must be valid and not less than 3 characters').exists().isLength({min: 3}),
    check('username', 'Username must be valid and not less than 3 characters').exists().isLength({min: 3}),
    check('email', 'email is not valid').isEmail().normalizeEmail(),
    check('password', 'password must be between 7 and 42 characters').isLength({min: 7, max:42})
] ,(req, res) => {
    //res.json(req.body);
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        //return res.status(422).jsonp(errors.array());
        const notice = errors.array();

        res.render('forms/author_form', { title: 'Create Author', notice, layout: 'layouts/detail' });
    }else{
        models.Author.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile
            }).then(function() {
            console.log("Author created successfully");
            // check if there was an error during post creation
            res.redirect('/blog/authors'); 
            
    });
    }
});


// // GET request to delete Author.
 router.get('/author/:author_id/delete', author_controller.author_delete_get);

// POST request to delete Author
router.post('/author/:author_id/delete', author_controller.author_delete_post);

// // GET request to update Author.
 router.get('/author/:author_id/update', author_controller.author_update_get);

// // POST request to update Author.
 router.post('/author/:author_id/update', author_controller.author_update_post);

 // GET request for one Author.
 router.get('/author/:author_id', author_controller.author_detail);

 // GET request for list of all Authors.
router.get('/authors', author_controller.author_list);




/// Category ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/category/create', category_controller.category_create_get);

// // POST request for creating Category.
 router.post('/category/create', category_controller.category_create_post);

// // GET request to delete Category.
 router.get('/category/:category_id/delete', category_controller.category_delete_get);

 // POST request to delete Category.
 router.post('/category/:category_id/delete', category_controller.category_delete_post);

// // GET request to update Category.
 router.get('/category/:category_id/update', category_controller.category_update_get);

// // POST request to update Category.
 router.post('/category/:category_id/update', category_controller.category_update_post);

// // GET request for one Category.
 router.get('/category/:category_id', category_controller.category_detail);

// // GET request for list of all Categories.
 router.get('/categories', category_controller.category_list);


/// COMMENT ROUTES ///

// GET request for creating Comment. NOTE This must come before route for id (i.e. display comment).
router.get('/comment/create', comment_controller.comment_create_get);

// // POST request for creating Comment.
 router.post('/comment/create', comment_controller.comment_create_post);

// // GET request to delete Comment.
 router.get('/comment/:comment_id/delete', comment_controller.comment_delete_get);

// // POST request to delete Comment
// router.post('/comment/:comment_id/delete', comment_controller.comment_delete_post);

// // GET request to update Comment.
router.get('/comment/:comment_id/update', comment_controller.comment_update_get);

// // POST request to update Comment.
router.post('/comment/:comment_id/update', comment_controller.comment_update_post);

// // GET request for one Comment.
 router.get('/comment/:comment_id', comment_controller.comment_detail);

// // GET request for list of all Comments.
 router.get('/comments', comment_controller.comment_list);

// GET blog home page.
router.get('/', post_controller.index);

// export all the router created
module.exports = router;
