/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.role = \"admine\"",
    "updateRule": "@request.auth.role = \"admine\""
  }, collection)

  // remove field
  collection.fields.removeById("relation379482041")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2525078272",
    "max": 0,
    "min": 0,
    "name": "course_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number593700145",
    "max": null,
    "min": null,
    "name": "course_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text803990934",
    "max": 0,
    "min": 0,
    "name": "course_duration",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2952295575",
    "max": 0,
    "min": 0,
    "name": "course_category",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "deleteRule": null,
    "updateRule": "@request.auth.role = \"admine\" || user = @request.auth.id"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4148894778",
    "hidden": false,
    "id": "relation379482041",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "course",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("text2525078272")

  // remove field
  collection.fields.removeById("number593700145")

  // remove field
  collection.fields.removeById("text803990934")

  // remove field
  collection.fields.removeById("text2952295575")

  return app.save(collection)
})
