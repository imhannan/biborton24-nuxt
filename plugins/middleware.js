import { defineNuxtPlugin } from "#app";
import middleware from "~~/config/middleware";
import { useAuthStore } from "~~/store/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const { $router, ssrContext } = nuxtApp;
  const auth = useAuthStore();
  if (ssrContext) {
    const { res, url } = ssrContext;
    const to = $router.resolve(url);
    const middleware = resloveMiddleware(to);
    if (middleware(auth)) {
      res.writeHead(302, {
        Location: middleware(auth),
      });
      res.end();
    }
  }

  $router.beforeEach((to) => {
    const middleware = resloveMiddleware(to);
    if (middleware(auth)) {
      return middleware(auth);
    }
  });
});

function resloveMiddleware(to) {
  let middlewareFunction = () => false;
  const middlewareList = middleware.routeMiddleware;
  middlewareList.forEach((item) => {
    const itemPaths = item.path.split("/").filter((i) => !!i);
    const toPaths = to.path.split("/").filter((i) => !!i);
    const itemIsDynamic = itemPaths.includes("*");
    const isMatched = itemPaths.every((itemPath, index) => {
      if (itemPath === "*") {
        return true;
      }
      return itemPath === toPaths[index];
    });

    if (item.path === to.path) {
      middlewareFunction = item.middleware;
    } else if (itemIsDynamic && isMatched) {
      middlewareFunction = item.middleware;
    }
  });

  return middlewareFunction;
}
