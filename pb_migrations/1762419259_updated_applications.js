/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.role = \"admine\" || user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2689671926")

  // update collection data
  unmarshal({
    "updateRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
})
