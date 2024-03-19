const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  //! added the ability to find all products
  try {
    const allProducts = await Product.findAll({
      //! this includes finding all products in the Category table, as well as the Tag model 
      //! the Tag data is included through the ProductTag table, which links products with tags.
      include: [{ model: Category, as: 'category' }, { model: Tag, as: 'tags' }]
    });
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  //! added the ability to find a single product
  try {
    const singleProduct = await Product.findByPk(req.params.id, {
      //! this includes the associated table from the Category and Tag table for the single product
      //! the Tag table will have the alias of 'tags' and category named 'category' for the json response
      include: [{ model: Category, as: 'category' }, { model: Tag, as: 'tags' }]
    });

    if (!singleProduct) {
      res.status(404).json({ message: 'No product found with that id.' });
      return;
    }
    res.status(200).json(singleProduct);
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
/* req.body should look like this...
  {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/
//! added the ability to post a new product
router.post('/', (req, res) => {
  try {
    const newProduct = (req.body, {
      //! the name, price, and stock and tag are taken directly from the request body
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        tagIds: req.body.tagIds
    })

    if (!newProduct) {
      res.status(404).json({ message: 'No product found with that id.' });
      return;
    }
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(500).json(err)
  }

  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  //! added the ability to delete a product with its associated id
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!deleteProduct) {
      res.status(404).json({ message: 'No product found by that id.' })
      return;
    }

    res.status(200).json(`id:${req.params.id} successfully deleted.`);
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;
