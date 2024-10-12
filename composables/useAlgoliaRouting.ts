import type { RouterProps } from "instantsearch.js/es/middlewares";

function stripUndefined(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined),
  );
}

interface UiConfigure {
  responseFields: string[];
  hitsPerPage: number;
  ruleContexts: string[];
  query?: string;
}

interface UiState {
  [indexName: string]: {
    configure?: UiConfigure;
    refinementList?: Record<string, string[]>;
    sortBy?: string;
    page?: number;
    range?: Record<string, string>;
  };
}

interface RouteState {
  color?: string[];
  brand?: string[];
  size?: string[];
  price?: string;
  p?: number;
  sortBy?: string;
  query?: string;
}

export const useAlgoliaRouting = () => {
  const router = useRouter();
  const app = useNuxtApp();

  // console.log('uiState', router.currentRoute.value);

  // https://github.com/atoms-studio/nuxt-swiftsearch/blob/main/src/runtime/composables/useAisRouter.ts
  const algoliaRouter: Ref<RouterProps<UiState, RouteState>> = ref({
    router: {
      read() {
        const query = router.currentRoute.value.query;
        const normalizedQuery = Array.isArray(query) ? query[0] : query;

        // console.log('query', router.currentRoute.value.params);

        const categories = router.currentRoute.value.params.categories || [];

        const hierarchicalMenu = categories.length
          ? {
              "hierarchicalCategories.lvl0": Array.isArray(categories)
                ? [categories.join(" > ")]
                : [categories],
            }
          : [];
        // console.log('hierarchicalMenu', hierarchicalMenu);

        // return stripUndefined(normalizedQuery);

        return {
          ...stripUndefined(normalizedQuery),
          hierarchicalMenu,
        };
      },
      write(routeState) {
        console.log("write");

        // console.log('write routeState', routeState);

        // strip routeState and query from possible undefined values

        if (
          JSON.stringify(this.read()) ===
          JSON.stringify(stripUndefined(routeState))
        ) {
          return;
        }

        // if (
        //   routeState.hierarchicalMenu?.['hierarchicalCategories.lvl0'].length
        // ) {
        //   const { hierarchicalMenu, ...rest } = routeState;

        //   console.log('write hierarchicalMenu', hierarchicalMenu);

        //   const path = hierarchicalMenu['hierarchicalCategories.lvl0']
        //     .map((i) => encodeURIComponent(i))
        //     .join('/');

        //   return router.push({
        //     path: `/search/${path}`,
        //     query: stripUndefined(rest),
        //     force: true,
        //   });
        // } else {
        // console.log('write routeState', routeState);

        //   // @ts-ignore ignoring because uiState is compatible with query after introducing qs as a query param parser
        // }
        // delete routeState.hierarchicalMenu;

        if (routeState.hierarchicalMenu) {
          const { hierarchicalMenu, ...rest } = routeState;

          console.log("write hierarchicalMenu", hierarchicalMenu);

          const path = hierarchicalMenu["hierarchicalCategories.lvl0"]
            .map((i) => encodeURIComponent(i))
            .join("/");

          console.log("path", path);

          // router.replace({
          //   path: `/search/${path}`,
          //   query: stripUndefined(rest),
          // });
          // return;
        }

        const { hierarchicalMenu, ...rest } = routeState;
        navigateTo({ query: stripUndefined(rest) });
      },
      createURL(routeState) {
        console.log("createURL");

        // console.log(
        //   'write path',
        //   router.resolve({
        //     // @ts-ignore see comment above
        //     query: routeState,
        //   }).href
        // );

        const { hierarchicalMenu, p, ...rest } = routeState;
        // console.log('hierarchicalMenu', hierarchicalMenu);
        const path =
          hierarchicalMenu?.["hierarchicalCategories.lvl0"]
            ?.map((i) => encodeURIComponent(i))
            .join("/") || "";

        if (hierarchicalMenu) {
          // console.log("createURL hierarchicalMenu", hierarchicalMenu);
          const path2 = `/test${path && "/" + path}`;
          // const path2 = `/search${path && "/" + path}`;

          return router.resolve({
            // @ts-ignore see comment above
            path: path2,
            // path: `/search/${path}`,
            // query: rest,
            query: { ...rest },
          }).href;
        }

        return router.resolve({
          // @ts-ignore see comment above
          path: "/test",
          // path: "/search",
          // path: path2,
          query: { ...rest, p },
        }).href;
      },
      onUpdate(cb: any) {
        console.log("onUpdate");

        if (typeof window === "undefined") return;
        // @ts-ignore
        this._removeAfterEach = router.afterEach((to, from) => {
          if (to.path === from.path) cb(this.read());
        });
        app.hook("page:finish", () => {
          cb(this.read());
        });
      },
      dispose() {
        console.log("dispose");

        if (typeof window === "undefined") {
          console.log("window is undefined");
          return;
        }
        // @ts-ignore
        if (this._removeAfterEach) {
          console.log("removeAfterEach");
          // @ts-ignore
          this._removeAfterEach();
        }
      },
    },
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState.instant_search;
        // console.log('indexUiState', indexUiState);

        return {
          p: indexUiState.page,
          brand: indexUiState.refinementList?.brand,
          sortBy: indexUiState.sortBy,
          price: indexUiState.range?.price,
          hierarchicalMenu: indexUiState.hierarchicalMenu,
        };
      },
      routeToState(routeState) {
        const { brand, p, sortBy, query, price, hierarchicalMenu } = routeState;
        // console.log('hierarchicalMenu', hierarchicalMenu);

        const allBrands = Array.isArray(brand)
          ? brand
          : [brand].filter(Boolean);

        return {
          instant_search: {
            query,
            page: p,
            range: {
              price: price && decodeURIComponent(price),
            },

            refinementList: {
              brand: allBrands.map(
                (brand) => brand && decodeURIComponent(brand),
              ),
            },
            sortBy,
            hierarchicalMenu: hierarchicalMenu,
          },
        };
      },
    },
  });

  return algoliaRouter;
};
