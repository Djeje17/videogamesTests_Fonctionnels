import { TextDecoder, TextEncoder } from "node:util";
import "whatwg-fetch"; // Cela va injecter Fetch, Request et Response

global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// On s'assure que Request/Response sont globaux pour React Router
if (!global.Request) {
  // @ts-ignore
  global.Request = Request;
}
if (!global.Response) {
  // @ts-ignore
  global.Response = Response;
}
