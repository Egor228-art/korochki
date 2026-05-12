/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // remove field
  collection.fields.removeById("autodate2254405824")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2254405824",
    "max": 0,
    "min": 0,
    "name": "duration",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate2254405824",
    "name": "duration",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("text2254405824")

  return app.save(collection)
})
