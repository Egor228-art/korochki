/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // update collection data
  unmarshal({
    "name": "courses"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // update collection data
  unmarshal({
    "name": "Courses"
  }, collection)

  return app.save(collection)
})
