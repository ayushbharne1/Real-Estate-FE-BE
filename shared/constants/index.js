import * as app from "./app.js";
import * as dropdowns from "./dropdown.js";

// re-export individual constants so consumers can use named imports
export * from "./app.js";
export * from "./dropdown.js";

export default {
    ...app,
    ...dropdowns,
};