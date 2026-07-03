<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-green-8 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Directorio Corporativo </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="210" class="drawer-bg">
      <div class="q-pa-md">
        <div class="text-subtitle1 text-weight-bold text-green-10">Menú</div>
      </div>

      <q-separator />

      <q-list padding>
        <!--EN EL DRAWER ESTA PARTE ES DEL USUARIO, SE PUEDE CAMBIAR EL ICONO Y EL NOMBRE DE LA PAGINA-->
        <q-item clickable v-ripple to="/" exact active-class="active-menu-item">
          <q-item-section avatar>
            <q-icon name="groups" color="green-8" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Usuarios</q-item-label>
            <q-item-label caption>Directorio</q-item-label>
          </q-item-section>
        </q-item>
        <!--EN EL DRAWER ESTA PARTE ES DEL USUARIO, SE PUEDE CAMBIAR EL ICONO Y EL NOMBRE DE LA PAGINA-->
        <q-item clickable v-ripple to="/comparar" active-class="active-menu-item">
          <q-item-section avatar>
            <q-icon name="compare_arrows" color="green-8" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Comparar</q-item-label>
            <q-item-label caption>Dos colaboradores</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="page-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.drawer-bg,
.drawer-bg :deep(.q-drawer) {
  background: #f0f8f1;
}

.page-bg {
  background: linear-gradient(180deg, #f6fbf7 0%, #ffffff 100%);
}

.active-menu-item {
  color: #2e7d32;
  background: #e3f2e6;
  font-weight: 600;
}
</style>
