<script setup>
import { storeToRefs } from 'pinia';

import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();
const { alert } = storeToRefs(alertStore);
</script>

<template>
    <div class="m-3" v-if="alert">
        <div class="alert alert-dismissable" :class="alert.type">
            <button @click="alertStore.clear()" class="btn btn-link close">&times;</button>
            {{ alert.message }}
        </div>
    </div>
</template>