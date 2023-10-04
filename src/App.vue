<script setup>
import { Nav } from '@/components';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <div class="app-container" :class="authStore.user && 'bg-light'">
        <Nav />
        <router-view />
    </div>
</template>

<style>
@import '@/assets/base.css';
</style>