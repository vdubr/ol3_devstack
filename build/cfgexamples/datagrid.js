{

  // we need a unique ID
  "id": "datagrid",

  "inherits": "base.json",

  /**
   * Set output mode.
   * [RAW,ADVANCED,SIMPLE,WHITESPACE]
   */
  "mode": "ADVANCED",

  /**
   * Files to compile.
   * Path to app.js.
   * Inputs must include path to .../ol3/.../types.js ??
   */
  "inputs": [
    "../../bower_components/proj4js/lib/proj4js.js",
    "../../build/src/typedefs.js",
    "../../build/src/exports.js",
    "../../bower_components/openlayers3/build/src/external/externs/types.js",
    "../../examples/stable/datagrid.js"
  ]

}

