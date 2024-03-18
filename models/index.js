// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');


// Products belongsTo Category
//! added Products that belong to the Category table, using the foreign-key category_id from the product table, and giving it the name 'category'.
//!..the alias(as) will match is found in the routes
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});


// Categories have many Products
//! added Category that has many associations with the Product table, using the foreign-key category_id from the product table, and giving it the name 'products'.
//!..the alias(as) will match is found in the routes
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products'
});


// Products belongToMany Tags (through ProductTag)
//! added Products that belongs to many associations with the Tag table, through the associated table, ProductTag, using the foreign-key product_id from the ProductTag table, and giving it the name 'tags'.
//!..the alias(as) will match is found in the routes
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  as: 'tags'
});


// Tags belongToMany Products (through ProductTag)
//! added Tags that belongs to many associations with the Tag table, through the associated table, ProductTag, using the foreign-key tag_id from the ProductTag table, and giving it the name 'products'.
//!..the alias(as) will match is found in the routes
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  as: 'products'
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
