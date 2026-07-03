<template>
  <q-table
    title="Empleados"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    v-model:pagination="localPagination"
    :rows-per-page-options="[10]"
    binary-state-sort
    flat
    bordered
    dense
    class="user-table"
    @request="handleRequest"
  >
    <template #loading>
      <q-inner-loading showing color="green-8" />
    </template>

    <template #body-cell-image="props">
      <q-td :props="props">
        <q-avatar size="32px" class="avatar-border">
          <img :src="props.row.image" :alt="props.row.firstName" />
        </q-avatar>
      </q-td>
    </template>

    <template #body-cell-fullName="props">
      <q-td :props="props">
        <div class="text-weight-medium">{{ props.row.firstName }} {{ props.row.lastName }}</div>
      </q-td>
    </template>

    <template #body-cell-gender="props">
      <q-td :props="props">
        <q-chip dense outline color="green-8">
          {{ translateGender(props.row.gender) }}
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          dense
          flat
          color="green-8"
          icon="visibility"
          @click="$emit('view-user', props.row)"
        />
      </q-td>
    </template>

    <template #no-data>
      <div class="full-width row flex-center text-grey-7 q-pa-md">
        No hay usuarios para mostrar.
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['request', 'update:pagination', 'view-user'])

const localPagination = computed({
  get() {
    return props.pagination
  },
  set(value) {
    emit('update:pagination', value)
  },
})

function handleRequest(requestProps) {
  emit('request', requestProps)
}

function translateGender(gender) {
  if (gender === 'male') return 'Masculino'
  if (gender === 'female') return 'Femenino'
  return gender || '—'
}
</script>

<style scoped>
.user-table {
  border-radius: 16px;
  overflow: hidden;
  font-size: 12px;
}

.user-table :deep(th) {
  padding: 6px 8px;
  font-size: 12px;
  white-space: normal;
}

.user-table :deep(td) {
  padding: 6px 8px;
  font-size: 12px;
}

.ellipsis-cell {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-border {
  border: 2px solid #2e7d32;
  background: #e8f5e9;
}
</style>
