<script setup>
import { useAuthStore } from '@/stores';
import { Alert } from '@/components';
import { router } from '@/router';

// redirect home if already logged in
const authStore = useAuthStore();
if (authStore.user) {
    router.push('/');
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8 offset-sm-2 mt-5">
                <Alert />
                <router-view />
            </div>
        </div>
    </div>
</template>
