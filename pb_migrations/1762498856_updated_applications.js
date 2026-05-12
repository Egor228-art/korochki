/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select2069996022",
    "maxSelect": 1,
    "name": "payment_method",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Наличные",
      "Переводом"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select2069996022",
    "maxSelect": 1,
    "name": "payment_method",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Наличные",
      "Переводом по номеру телефона"
    ]
  }))

  return app.save(collection)
})
