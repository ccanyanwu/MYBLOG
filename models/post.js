
'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
      /*post_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },*/
      post_title: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        } 
    },
    post_body: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        } 
    },
    AuthorId : DataTypes.INTEGER
    
  });

  // create post association
  // a post will have an author
  // a field called AuthorId will be created in our post table inside the db
  Post.associate = function (models) {
    
    models.Post.belongsTo(models.Author, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Post.hasMany(models.Comment);

    models.Post.belongsToMany(models.Category,{ 
      as: 'categories', 
      through: 'PostCategory',
      foreignKey: 'post_id'
    });
    
   };
  
  return Post;
};

// Make sure you complete other models fields