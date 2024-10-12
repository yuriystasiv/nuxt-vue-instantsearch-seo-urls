<template>
  <div>
    <NuxtLink to="/">Home</NuxtLink>

    <h2>Current Query: {{ route.query }}</h2>
    <NuxtPage page-key="static" />
    <ClientOnly>
      <!-- <KeepAlive> -->
      <!-- </KeepAlive> -->

      <!-- <VirtualSearchBox /> -->
    </ClientOnly>
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
const route = useRoute();
</script>
