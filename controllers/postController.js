var Post = require('../models/post');
var models = require('../models');
var async = require('async');
var moment = require('moment');

// Display post create form on GET.
exports.post_create_get = async function(req, res, next) {
        // finds all authors and categories for the post
        const authors = await models.Author.findAll();
        const categories = await models.Category.findAll();

        res.render('forms/post_form', { title: 'Create Post', authors: authors, categories: categories, layout: 'layouts/detail'});
        console.log("Post form renders successfully");
};

// Handle post create on POST.
exports.post_create_post = async function(req, res, next) {

     // create a new post based on the fields in our post model
      console.log("This is author id " + req.body.author_id)
     let author_id = req.body.author_id;
     const post = await models.Post.create({
            //post_id: req.body.post_id,
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            AuthorId: author_id
        });

        console.log("The post id " + post.post_id);
      
        let categoryList = req.body.categories;
        
        // check the size of the category list
        console.log(categoryList.length);
        
       
        // I am checking if only 1 category has been selected
        // if only one category then use the simple case scenario
        if (categoryList.length == 1) {
             // check if we have that category in our database
             const category = await models.Category.findById(req.body.categories);
             if (!category) {
              return res.status(400);
             }
             //otherwise add new entry inside PostCategory table
             await post.addCategory(category);
        }
        
        // if more than one category has been selected
        else {
        // Loop through all the ids in req.body.categories i.e. the selected categories
        await req.body.categories.forEach(async (id) => {
            // check if all category selected are in the database
            const category = await models.Category.findById(id);
            if (!category) {
              return res.status(400);
            }
            // add to PostCategory after
            await post.addCategory(category);
            });
        }
    

     // after successful add, then redirect to posts page.
    // res.redirect('/blog/posts');
     res.redirect('/blog/author/' + author_id);

};

// Display post delete form on GET.
exports.post_delete_get = async function(req, res, next) {
  // find the post
       const post = await models.Post.findById(req.params.post_id);
       
       // Find and remove all associations 
       const categories = await post.getCategories();
       post.removeCategories(categories);
       
     // delete post 
    models.Post.destroy({
         // find the post_id to delete from database
         where: {
           id: req.params.post_id
         }
       }).then(function() {
        // If an post gets deleted successfully, we just redirect to posts list
        // no need to render a page
         res.redirect('/blog/posts');
         console.log("Post deleted successfully");
       });
};


// Handle post delete on POST.
exports.post_delete_post = async function(req, res, next) {
    
  // find the post
  const post = await models.Post.findById(req.params.post_id);
  
  // Find and remove all associations 
  const categories = await post.getCategories();
  post.removeCategories(categories);
  
  // delete post 
  models.Post.destroy({
    // find the post_id to delete from database
    where: {
      id: req.params.post_id
    }
  }).then(function() {
   // If an post gets deleted successfully, we just redirect to posts list
   // no need to render a page
    res.redirect('/blog/posts');
    console.log("Post deleted successfully");
  });

};

// Display post update form on GET.
exports.post_update_get = async function(req, res, next) {
        // Find the post you want to update
        console.log("ID is " + req.params.post_id);
        //find associated category
        const categories = await models.Category.findAll();
        models.Post.findById(
                req.params.post_id
        ).then(function(post) {
               // renders a post form
               res.render('forms/post_form', { title: 'Update Post', categories: categories, post: post, layout: 'layouts/detail'});
               console.log("Post update get successful");
          });
        
};

// Handle post update on POST.
exports.post_update_post = async function(req, res, next) {
        console.log("ID is " + req.params.post_id);
        
        // find the post
        const post = await models.Post.findById(req.params.post_id);
        
        // Find and remove all associations 
        const categories = await post.getCategories();
        post.removeCategories(categories);

        let categoryList = req.body.categories;
    
        // check the size of the category list
        console.log(categoryList.length);

        // I am checking if only 1 category has been selected
        // if only one category then use the simple case scenario
        if (categoryList.length == 1) {
          // check if we have that category in our database
          const category = await models.Category.findById(req.body.categories);
          if (!category) {
           return res.status(400);
          }
          //otherwise add new entry inside PostCategory table
          await post.addCategory(category);
          }
          // if more than one category has been selected
          else {
          // Loop through all the ids in req.body.categories i.e. the selected categories
          await req.body.categories.forEach(async (id) => {
              // check if all category selected are in the database
              const category = await models.Category.findById(id);
              if (!category) {
                return res.status(400);
              }
              // add to PostCategory after
              await post.addCategory(category);
              });
          }

        models.Post.update(
        // Values to update
            {
                post_title: req.body.post_title,
                post_body: req.body.post_body
            },
          { // Clause
                where: 
                {
                    id: req.params.post_id
                }
            } 
         ).then(function() { 
                // If an post gets updated successfully, we just redirect to posts list
                // no need to render a page
                res.redirect("/blog/posts");  
                console.log("Post updated successfully");
          });
};

// Display detail page for a specific post.
exports.post_detail = function(req, res, next) {
        // find a post by the primary key Pk
        models.Post.findById(
                req.params.post_id,
                {
                  // make sure to include the comment so we can display it
                  include: [
                  {
                    model: models.Comment
                  },
                  {
                    model: models.Author,
                    attributes: ['id', 'first_name', 'last_name', 'username']
                  },
                  {
                    model: models.Category,
                    as: 'categories',
                    required: false,
                    // Pass in the Category attributes that you want to retrieve
                    attributes: ['id', 'category_name'],
                    through: {
                      // This block of code allows you to retrieve the properties of the join table PostCategories
                      model: models.PostCategory,
                      as: 'postCategory',
                      attributes: ['post_id', 'category_id'],
                    }
                  }
                  
                  ]
                  
              },
              
        ).then(function(post) {
        // renders an inividual post details page
        //console.log(JSON.stringify(post, null, 2))
        res.render('pages/post_detail', { title: 'Post Details', moment:moment, post: post, layout: 'layouts/detail'} );
        console.log("Post deteials renders successfully");
        });
};



// Display list of all posts.
exports.post_list = function(req, res, next) {
        // controller logic to display all posts
        models.Post.findAll({
          // Make sure to include the categories
          include: [
              {
                model: models.Author,
                attributes: ['id', 'first_name', 'last_name']
              },
               {
                    model: models.Category,
                    as: 'categories',
                    required: false,
                    // Pass in the Category attributes that you want to retrieve
                    attributes: ['id', 'category_name'],
                    through: {
                      // This block of code allows you to retrieve the properties of the join table PostCategories
                      model: models.PostCategory,
                      as: 'postCategory',
                      attributes: ['post_id', 'category_id'],
              }
          }]
              
      }
        ).then(function(posts) {
        // renders a post list page
        console.log("rendering post list");
        res.render('pages/post_list', { title: 'Post List', posts: posts, layout: 'layouts/list'} );
        console.log("Posts list renders successfully");
        });
        
};

/*exports.index = function(req, res, next) {
  // controller logic to display all posts
  models.Post.findAll(
  ).then(function(posts) {
  // renders a post list page
  console.log("rendering post list");
  res.render('pages/post_list', { title: 'Post List', posts: posts, layout: 'layouts/list'} );
  console.log("Posts list renders successfully");
  });
  
};*/

// This is the blog homepage.
exports.index = function(req, res) {

  // find the count of posts in database
  models.Post.findAndCountAll(
  ).then(function(postCount)
  {
    models.Author.findAndCountAll(
  ).then(function(authorCount)
  {
    models.Comment.findAndCountAll(
  ).then(function(commentCount)
  {
    models.Category.findAndCountAll(
  ).then(function(categoryCount)
  {
    // find the count of authors, categories, commentsand posts in database

    res.render('pages/index', {
        title: 'Coders Blog', 
        postCount: postCount, 
        authorCount: authorCount,
        commentCount: commentCount,
        categoryCount: categoryCount,
        layout: 'layouts/main'
        
    });
    
    // res.render('pages/index_list_sample', { title: 'Post Details', layout: 'layouts/list'});
    // res.render('pages/index_detail_sample', { page: 'Home' , title: 'Post Details', layout: 'layouts/detail'});
  });
  });
  });
  });


};


 