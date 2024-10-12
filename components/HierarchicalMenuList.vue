<template>
  <ul v-if="items && items.length > 0">
    <li v-for="item in items" :key="item.value">
      <NuxtLink :to="createURL(item.value)" :external="true">
        <span>{{ item.label }}</span>
        <span>{{ item.count }}</span>
      </NuxtLink>
      <HierarchicalMenuList
        v-if="item.data"
        :items="item.data"
        :level="level + 1"
        :refine="refine"
        :create-u-r-l="createURL"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  items: any[];
  level: number;
  refine: (item: any) => void;
  createURL: (item: any) => string;
}>();
</script>
