const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  //! added the ability to find all tags
  try {
    //! Including tags along with their associated Product. 
    //! The connection/link between Tag and Product join table when searching for a all Tags.
     //! giving it the alias 'product' for our JSON response

    const getAllTags = await Tag.findAll({
      include: [{ model: Product, as: 'products' }]
    });
    if (!getAllTags) {
      res.status(404).json({ message: 'No tags Found.' });
      return;
    }
    res.status(200).json(getAllTags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  //! Added the ability to find a tag by a single id
  //! Including tags along with their associated products. 
  //! The connection/link between Tag and Product join table when searching for a single Tag.
  try {
    const singleTag = await Tag.findByPk(req.params.id, {
      //! including the Product table and giving it an alias 'products' for the JSON response
      include: [{ model: Product, as: 'products' }]
    });

    if (!singleTag) {
      res.status(404).json({ message: 'No tag with this id found' });
      return;
    }
    res.status(200).json(singleTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  //! added the ability to create a new tag
  try {
    const createTag = await Tag.create(req.body);
    res.status(200).json(createTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  //! added the ability to update a tag by its associated id
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    if (!updateTag) {
      res.status(404).json({ message: 'No tag with this id found' })
      return;
    }

    res.status(200).json(updateTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  //! added the ability to delete a tag by an associated id
  try {
    const deleteTag =  await Tag.destroy({
      where: {
        id: req.params.id
      }
    })

    if (!deleteTag) {
      res.status(404).json({ message: 'No tag with this id found' });
      return;
  }

    res.status(200).json(deleteTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
