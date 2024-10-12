<template>
  <div>
    searh/[...yurek]
    <AisInstantSearch
      index-name="instant_search"
      :search-client="client"
      :routing="routing"
      :future="{
        preserveSharedStateOnUnmount: false,
      }"
    >
      <VirtualSearchBox />
      <!-- <AisClearRefinements /> -->
      <ais-clear-refinements>
        <template v-slot="{ canRefine, refine, createURL }">
          {{ createURL() }}
          <a
            :href="createURL()"
            @click.prevent="router.push('/search')"
            v-if="canRefine"
          >
            Clear all refinements
          </a>
        </template>
      </ais-clear-refinements>
      <AisStats data-testid="stats" />
      <AisRangeInput attribute="price" />
      <AisSortBy
        :items="[
          { value: 'instant_search', label: 'Default' },
          { value: 'instant_search_price_asc', label: 'Price asc.' },
          { value: 'instant_search_price_desc', label: 'Price desc.' },
        ]"
      />
      <AisInfiniteHits data-testid="infinitehits" />
      <AisRefinementList
        attribute="brand"
        searchable
        :show-more="true"
        data-testid="refinementlist"
      />
      <ais-hierarchical-menu
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
          <hierarchical-menu-list
            :items="items"
            :level="0"
            :refine="refine"
            :createURL="createURL"
          />
          <button @click="toggleShowMore()" :disabled="!canToggleShowMore">
            {{ isShowingMore ? "Show less" : "Show more" }}
          </button>
        </template>
      </ais-hierarchical-menu>
    </AisInstantSearch>
  </div>
</template>

<script lang="ts" setup>
import {
  AisInstantSearch,
  AisStats,
  AisInfiniteHits,
  AisRefinementList,
  AisHierarchicalMenu,
  AisSortBy,
  AisClearRefinements,
  AisRangeInput,
} from "vue-instantsearch/vue3/es";

import algoliasearch from "algoliasearch";

const client = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76");
const routing = useAlgoliaRouting();
const router = useRouter();
</script>

<style></style>
