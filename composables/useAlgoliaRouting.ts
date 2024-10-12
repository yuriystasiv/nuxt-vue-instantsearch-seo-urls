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
    query?: string;
    refinementList?: Record<string, string[]>;
    sortBy?: string;
    page?: number;
    range?: Record<string, string>;
    hierarchicalMenu?: Record<string, string[]>;
  };
}

interface RouteState {
  color?: string[];
  brands?: string[];
  size?: string[];
  price?: string;
  p?: number;
  sortBy?: string;
  query?: string;
  hierarchicalMenu?: Record<string, string[]>;
}

export const useAlgoliaRouting = () => {
  const router = useRouter();
  const app = useNuxtApp();

  // https://github.com/atoms-studio/nuxt-swiftsearch/blob/main/src/runtime/composables/useAisRouter.ts
  const algoliaRouter: Ref<RouterProps<UiState, RouteState>> = ref({
    router: {
      read() {
        const query = router.currentRoute.value.query;
        const normalizedQuery = Array.isArray(query) ? query[0] : query;
        const categories = router.currentRoute.value.params.categories || [];
        const hierarchicalMenu = categories.length
          ? {
              "hierarchicalCategories.lvl0": Array.isArray(categories)
                ? [categories.join(" > ")]
                : [categories],
            }
          : undefined;

        return {
          ...stripUndefined(normalizedQuery),
          hierarchicalMenu,
        };
      },
      write(routeState) {
        if (
          JSON.stringify(this.read()) ===
          JSON.stringify(stripUndefined(routeState))
        ) {
          return;
        }

        const { hierarchicalMenu, ...rest } = routeState;
        navigateTo({ query: stripUndefined(rest) });
      },
      createURL(routeState) {
        const { hierarchicalMenu, p, ...rest } = routeState;
        const categoryPath = hierarchicalMenu?.["hierarchicalCategories.lvl0"]
          ? "/" +
            hierarchicalMenu?.["hierarchicalCategories.lvl0"]
              .map((i) => encodeURIComponent(i))
              .join("/")
          : "";

        if (hierarchicalMenu) {
          return router.resolve({
            // @ts-ignore see comment above
            path: `/search${categoryPath}`,
            query: { ...rest },
          }).href;
        }

        return router.resolve({
          // @ts-ignore see comment above
          path: "/search",
          query: { ...rest, p },
        }).href;
      },
      onUpdate(cb: any) {
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
        if (typeof window === "undefined") {
          return;
        }
        // @ts-ignore
        if (this._removeAfterEach) {
          // @ts-ignore
          this._removeAfterEach();
        }
      },
    },
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState.instant_search;

        return {
          query: indexUiState.query,
          p: indexUiState.page,
          brands: indexUiState.refinementList?.brand,
          sortBy: indexUiState.sortBy,
          price: indexUiState.range?.price,
          hierarchicalMenu: indexUiState.hierarchicalMenu,
        };
      },
      routeToState(routeState) {
        const { brands, p, sortBy, query, price, hierarchicalMenu } =
          routeState;
        const allBrands = Array.isArray(brands)
          ? brands
          : [brands].filter(Boolean);

        return {
          instant_search: {
            query,
            page: p,
            range: {
              price: (price && decodeURIComponent(price)) as string,
            },

            refinementList: {
              brand: allBrands.map(
                (brand) => (brand && decodeURIComponent(brand)) as string,
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
