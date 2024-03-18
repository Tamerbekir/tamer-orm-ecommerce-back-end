const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  //! added the ability to find all categories
  //! finding all categories including Product table
  try {
    const allCategories = await Category.findAll({
      //! including the Product table with the name as products when requesting data
      include: [{ model: Product, as: 'products' }]
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value 
  //! added the ability to find single category by single id
  // be sure to include its associated Products 
  //! added includes method to find category 
  try {
    const singleCategory = await Category.findByPk(req.params.id, {
      //! including the Product table with the name as products when requesting data
      include: [{ model: Product, as: 'products' }]
    });
    //! added status response to no id/category was found, as well as other errors, otherwise OK(200) status
    if (!singleCategory) {
      res.status(404).json({ message: 'No category found by this id.' })
      return;
    }
    res.status(200).json(singleCategory);
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/', async (req, res) => {
  // create a new category 
  //! created ability to add a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  //! added the ability to update a category with associated id
  try {
    const updateCategory = await Category.update({
      where: {
        id: req.params.id
      }
    })

    if (!updateCategory) {
      res.status(404).json({ message: 'No category with that id.' });
      return;
    }

    res.status(200).json(updateCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value 
  //! added the ability to delete a single category byt its associated id
  try {
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    })

    if (!deleteCategory) {
      res.status(404).json({ message: 'No category found with that id.' })
      return;
    }

    res.status(200).json(deleteCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
