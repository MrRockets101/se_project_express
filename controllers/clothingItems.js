const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL: imageURL })
    .then((item) => {
      console.log(item);
      req.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.param;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $set: { imageURL },
    }
      .orFail()
      .then((item) => res.status(200).send({ data: item }))
      .catch((e) => {
        res.status(500).send({ message: "Error from updateItem", e });
      })
  );
};

const deleteItem = (req, res) => {
  const { itemId } = req.param;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) =>
      res
        .status(204)
        .send({})
        .catch((e) => {
          res.status(500).send({ message: "Error from deleteItem", e });
        })
    );
};

module.exports = { createItem, getItems, updateItem };
