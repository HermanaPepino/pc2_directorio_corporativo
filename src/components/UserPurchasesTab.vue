<template>
  <div class="relative-position q-pa-sm">
    <q-inner-loading :showing="loading" color="green-8" />

    <q-banner v-if="error" rounded class="bg-red-1 text-red-9 q-mb-md">
      {{ error }}
    </q-banner>

    <q-banner
      v-if="!loading && !error && productRows.length === 0"
      rounded
      class="bg-grey-2 text-grey-8"
    >
      Este colaborador no tiene compras registradas.
    </q-banner>

    <div v-if="productRows.length > 0">
      <q-table
        title="Productos comprados"
        :rows="productRows"
        :columns="columns"
        row-key="rowId"
        flat
        bordered
        dense
        :rows-per-page-options="[5, 10, 0]"
        class="purchases-table"
      >
        <template #body-cell-price="props">
          <q-td :props="props">
            {{ formatMoney(props.row.price) }}
          </q-td>
        </template>

        <template #body-cell-subtotal="props">
          <q-td :props="props">
            <strong>{{ formatMoney(props.row.subtotal) }}</strong>
          </q-td>
        </template>
      </q-table>

      <div class="row justify-end q-mt-md">
        <q-card flat bordered class="total-card">
          <div class="text-caption text-grey-7">Total general</div>
          <div class="text-h6 text-green-10">
            {{ formatMoney(totalGeneral) }}
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { fetchUserCarts } from '@/services/usersApi'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const loading = ref(false)
const error = ref('')
const carts = ref([])

const columns = [
  {
    name: 'cartId',
    label: 'Carrito',
    field: 'cartId',
    align: 'center',
  },
  {
    name: 'product',
    label: 'Producto',
    field: 'title',
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Cantidad',
    field: 'quantity',
    align: 'center',
  },
  {
    name: 'price',
    label: 'Precio unit.',
    field: 'price',
    align: 'right',
  },
  {
    name: 'subtotal',
    label: 'Subtotal',
    field: 'subtotal',
    align: 'right',
  },
]

const productRows = computed(() => {
  return carts.value.flatMap((cart) => {
    return (cart.products || []).map((product) => ({
      rowId: `${cart.id}-${product.id}`,
      cartId: cart.id,
      title: product.title,
      quantity: product.quantity,
      price: product.price,
      subtotal: product.total ?? product.price * product.quantity,
    }))
  })
})

const totalGeneral = computed(() => {
  return productRows.value.reduce((sum, product) => sum + Number(product.subtotal || 0), 0)
})

function formatMoney(value) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0))
}

async function loadPurchases() {
  if (!props.userId) return

  loading.value = true
  error.value = ''
  carts.value = []

  try {
    const data = await fetchUserCarts(props.userId)
    carts.value = data.carts || []
  } catch (err) {
    error.value = err.message || 'No se pudieron cargar las compras.'
  } finally {
    loading.value = false
  }
}

watch(
  () => props.userId,
  () => loadPurchases(),
  { immediate: true },
)
</script>

<style scoped>
.purchases-table {
  border-radius: 14px;
  overflow: hidden;
}

.total-card {
  min-width: 180px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #f0f8f1;
}
</style>
