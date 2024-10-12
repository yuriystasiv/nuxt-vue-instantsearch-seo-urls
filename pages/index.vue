<template>
  <div>
    <NuxtLink to="/search">Search page</NuxtLink>
    <form @submit.prevent="searchQuery">
      <input type="text" v-model="query" placeholder="Enter your search term" />
      <button type="submit">Search</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "nuxt/app";

const query = ref("");

const router = useRouter();

const searchQuery = () => {
  if (query.value) {
    router.push({
      path: "/search",
      query: { query: query.value },
    });
  }
};
</script>
