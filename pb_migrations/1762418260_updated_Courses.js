/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"admine\"",
    "deleteRule": "@request.auth.role = \"admine\"",
    "updateRule": "@request.auth.role = \"admine\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4148894778")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
