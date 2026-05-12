/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // remove field
  collection.fields.removeById("date2254405824")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate2254405824",
    "name": "duration",
    "onCreate": false,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date2254405824",
    "max": "2026-02-28 12:00:00.000Z",
    "min": "2025-11-01 12:00:00.000Z",
    "name": "duration",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("autodate2254405824")

  return app.save(collection)
})
