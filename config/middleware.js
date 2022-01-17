import auth from "~~/middleware/auth";
import guest from "~~/middleware/guest";
export default {
  // The middleware to use. You can add multiple.
  // The order matters, the first middleware is run first.
  globalMiddleware: [],
  routeMiddleware: [
    { path: "/user/login", middleware: guest },
    { path: "/user/register", middleware: guest },
    { path: "/user/profile", middleware: auth },
    { path: "/user/profile/*/update", middleware: auth },
  ],
};
