import { useNuxtApp } from "#app";

export const useMiddleware = (callback) => {
  const app = useNuxtApp();
  const { $router, ssrContext } = app;

  if (ssrContext) {
    const { res, url } = ssrContext;
    const to = $router.resolve(url);

    if (callback(to.path)) {
      res.writeHead(302, {
        Location: callback(to.path),
      });
      res.end();
    }
    
  }

  $router.beforeEach((to) => {
    if (callback(to.path)) {
      return callback(to.path);
    }
  });

  return app;
};
