<template>
  <div>
    <NuxtLink to="/">Home page</NuxtLink>
    <h3>
      Route Params: {{ route.params.categories || "No categories selected" }}
    </h3>
    <AisInstantSearch
      index-name="instant_search"
      :search-client="client"
      :routing="routing"
      :future="{
        preserveSharedStateOnUnmount: true,
      }"
    >
      <VirtualSearchBox />
      <div class="refinements">
        <AisCurrentRefinements
          :excluded-attributes="[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
          ]"
        />
        <AisStats />
        <AisClearRefinements>
          <template v-slot="{ canRefine, refine }">
            <button
              @click="handleClearRefinements(refine)"
              :disabled="!canRefine"
            >
              Clear all refinements
            </button>
          </template>
        </AisClearRefinements>
      </div>

      <div class="content">
        <div>
          <AisRangeInput attribute="price" />
          <AisSortBy
            :items="[
              { value: 'instant_search', label: 'Default' },
              { value: 'instant_search_price_asc', label: 'Price asc.' },
              { value: 'instant_search_price_desc', label: 'Price desc.' },
            ]"
          />
          <AisRefinementList attribute="brand" searchable :show-more="true" />
          <AisHierarchicalMenu
            :attributes="[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]"
            show-more
          >
            <template
              #default="{
                items,
                canToggleShowMore,
                isShowingMore,
                refine,
                toggleShowMore,
                createURL,
                sendEvent,
              }"
            >
              <HierarchicalMenuList
                :items="items"
                :level="0"
                :refine="refine"
                :createURL="createURL"
              />
              <button @click="toggleShowMore()" :disabled="!canToggleShowMore">
                {{ isShowingMore ? "Show less" : "Show more" }}
              </button>
            </template>
          </AisHierarchicalMenu>
        </div>
        <div>
          <AisInfiniteHits />
        </div>
      </div>
    </AisInstantSearch>
  </div>
</template>

<script lang="ts" setup>
import algoliasearch from "algoliasearch";
import {
  AisInstantSearch,
  AisStats,
  AisInfiniteHits,
  AisRefinementList,
  AisHierarchicalMenu,
  AisSortBy,
  AisClearRefinements,
  AisRangeInput,
  AisCurrentRefinements,
} from "vue-instantsearch/vue3/es";

const client = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76");
const routing = useAlgoliaRouting();
const route = useRoute();

const handleClearRefinements = (refine: () => void) => {
  Boolean(route.params.categories.length)
    ? navigateTo(
        {
          path: "/search",
          query: route.query.sortBy ? { sortBy: route.query.sortBy } : {},
        },
        // “external” needed for hierarchical menu to work and not interfere with route navigation
        { external: true },
      )
    : refine();
};
</script>

<style>
.refinements {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}
.content {
  display: flex;
  gap: 20px;
}
</style>
