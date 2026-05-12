/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.id != \"\" && user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
})
