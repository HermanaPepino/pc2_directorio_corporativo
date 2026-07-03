<template>
  <q-page class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 1450px">
      <q-card flat bordered class="main-card">
        <div class="row items-center justify-between q-gutter-md q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-green-10">Directorio Corporativo</div>
            <div class="text-grey-7">Consulta de colaboradores registrados</div>
          </div>

          <q-badge color="green-8" class="q-pa-sm"> {{ pagination.rowsNumber }} usuarios </q-badge>
        </div>

        <UserTable
          :rows="users"
          :columns="columns"
          :loading="loading"
          v-model:pagination="pagination"
          @request="onRequest"
          @view-user="openUser"
        />
      </q-card>
    </div>

    <q-dialog v-model="detailDialog">
      <q-card class="detail-card">
        <q-card-section class="row items-center q-gutter-md bg-green-1">
          <q-avatar size="72px" class="avatar-border">
            <img :src="selectedUser?.image" />
          </q-avatar>

          <div>
            <div class="text-h6 text-green-10">
              {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}
            </div>
            <div class="text-grey-7">
              {{ selectedUser?.email }}
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedUser">
          <q-list dense>
            <q-item>
              <q-item-section>
                <q-item-label caption>Edad</q-item-label>
                <q-item-label>{{ selectedUser.age }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Género</q-item-label>
                <q-item-label>{{ translateGender(selectedUser.gender) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Empresa</q-item-label>
                <q-item-label>{{ selectedUser.company?.name || '—' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Cargo</q-item-label>
                <q-item-label>{{ selectedUser.company?.title || '—' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Ubicación</q-item-label>
                <q-item-label>
                  {{ selectedUser.address?.city || '—' }},
                  {{ selectedUser.address?.country || '—' }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="green-8" label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import UserTable from '@/components/UserTable.vue'

const $q = useQuasar()

const API_URL = 'https://dummyjson.com/users'

const users = ref([])
const loading = ref(false)
const detailDialog = ref(false)
const selectedUser = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  {
    name: 'image',
    label: 'Foto',
    field: 'image',
    align: 'center',
  },
  {
    name: 'fullName',
    label: 'Nombre completo',
    field: (row) => `${row.firstName} ${row.lastName}`,
    align: 'left',
  },
  {
    name: 'age',
    label: 'Edad',
    field: 'age',
    align: 'center',
  },
  {
    name: 'gender',
    label: 'Género',
    field: 'gender',
    align: 'left',
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    field: 'email',
    align: 'left',
  },
  {
    name: 'company',
    label: 'Empresa',
    field: (row) => row.company?.name || '—',
    align: 'left',
  },
  {
    name: 'title',
    label: 'Cargo',
    field: (row) => row.company?.title || '—',
    align: 'left',
  },
  {
    name: 'city',
    label: 'Ciudad',
    field: (row) => row.address?.city || '—',
    align: 'left',
  },
  {
    name: 'country',
    label: 'País',
    field: (row) => row.address?.country || '—',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Acción',
    field: 'actions',
    align: 'center',
  },
]

function translateGender(gender) {
  if (gender === 'male') return 'Masculino'
  if (gender === 'female') return 'Femenino'
  return gender || '—'
}

async function fetchUsers(page = 1, rowsPerPage = 10) {
  loading.value = true

  try {
    const skip = (page - 1) * rowsPerPage
    const response = await fetch(`${API_URL}?limit=${rowsPerPage}&skip=${skip}`)

    if (!response.ok) {
      throw new Error('No se pudo cargar la lista de usuarios')
    }

    const data = await response.json()

    users.value = data.users || []

    pagination.value = {
      ...pagination.value,
      page,
      rowsPerPage,
      rowsNumber: data.total || 0,
    }
  } catch (error) {
    users.value = []

    $q.notify({
      type: 'negative',
      message: error.message || 'Ocurrió un error al cargar los usuarios',
    })
  } finally {
    loading.value = false
  }
}

function onRequest(props) {
  const { page, rowsPerPage } = props.pagination
  fetchUsers(page, rowsPerPage)
}

function openUser(user) {
  selectedUser.value = user
  detailDialog.value = true
}

onMounted(() => {
  fetchUsers(pagination.value.page, pagination.value.rowsPerPage)
})
</script>

<style scoped>
.main-card {
  border-radius: 18px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
}

.detail-card {
  width: 460px;
  max-width: 90vw;
  border-radius: 18px;
  overflow: hidden;
}

.avatar-border {
  border: 2px solid #2e7d32;
  background: #e8f5e9;
}
</style>
