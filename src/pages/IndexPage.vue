<template>
  <q-page class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 1450px">
      <q-card flat bordered class="main-card">
        <div class="row items-center justify-between q-gutter-md q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-green-10">Directorio Corporativo</div>
            <div class="text-grey-7">Consulta de colaboradores registrados</div>
          </div>

          <q-badge color="green-8" class="q-pa-sm"> {{ filteredUsers.length }} mostrados </q-badge>
        </div>

        <!-- Barra de búsqueda y filtros combinados -->
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              label="Buscar por nombre o apellido..."
              color="green-8"
              debounce="500"
              @update:model-value="onSearchChange"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-6 col-sm-3 col-md-2">
            <q-select
              v-model="filters.gender"
              outlined
              dense
              label="Género"
              :options="['Todos', 'Masculino', 'Femenino']"
              color="green-8"
            />
          </div>

          <div class="col-6 col-sm-3 col-md-2">
            <q-select
              v-model="filters.ageRange"
              outlined
              dense
              label="Rango de Edad"
              :options="['Todos', '18-30', '31-45', '46+']"
              color="green-8"
            />
          </div>

          <div class="col-6 col-sm-3 col-md-2">
            <q-input v-model="filters.country" outlined dense label="País" color="green-8" />
          </div>

          <div class="col-6 col-sm-3 col-md-2">
            <q-input v-model="filters.city" outlined dense label="Ciudad" color="green-8" />
          </div>
        </div>

        <!-- Alerta de no coincidencias -->
        <div v-if="filteredUsers.length === 0 && !loading" class="q-pa-xl text-center text-grey-7">
          <q-icon name="warning" size="md" color="warning" class="q-mb-sm" />
          <div class="text-h6">No se encontraron coincidencias</div>
          <div>Intenta ajustar los criterios de búsqueda o los filtros aplicados.</div>
        </div>

        <!-- Tabla de usuarios -->
        <UserTable
          v-else
          :rows="filteredUsers"
          :columns="columns"
          :loading="loading"
          v-model:pagination="pagination"
          @request="onRequest"
          @view-user="openUser"
        />
      </q-card>
    </div>

    <!-- Modal de detalle -->
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

        <q-tabs
          v-model="detailTab"
          dense
          class="text-green-9"
          active-color="green-8"
          indicator-color="green-8"
          align="justify"
        >
          <q-tab name="info" icon="person" label="Información" />
          <q-tab name="compras" icon="shopping_cart" label="Compras" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-if="selectedUser" v-model="detailTab" animated class="detail-panels">
          <!-- Información de Leo -->
          <q-tab-panel name="info">
            <div class="text-h6 text-green-9 q-mb-sm">Datos personales</div>

            <q-list dense bordered>
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
                  <q-item-label caption>Correo</q-item-label>
                  <q-item-label>{{ selectedUser.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Teléfono</q-item-label>
                  <q-item-label>{{ selectedUser.phone }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Información laboral</div>

            <q-list dense bordered>
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
                  <q-item-label caption>Departamento</q-item-label>
                  <q-item-label>{{ selectedUser.company?.department || '—' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Dirección</div>

            <q-list dense bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Dirección</q-item-label>
                  <q-item-label>{{ selectedUser.address?.address || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Ciudad</q-item-label>
                  <q-item-label>{{ selectedUser.address?.city || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Estado</q-item-label>
                  <q-item-label>{{ selectedUser.address?.state || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>País</q-item-label>
                  <q-item-label>{{ selectedUser.address?.country || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Código Postal</q-item-label>
                  <q-item-label>{{ selectedUser.address?.postalCode || '—' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Universidad</div>

            <q-list dense bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Universidad</q-item-label>
                  <q-item-label>{{ selectedUser.university || '—' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Banco</div>

            <q-list dense bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Tipo de tarjeta</q-item-label>
                  <q-item-label>{{ selectedUser.bank?.cardType || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Número de tarjeta</q-item-label>
                  <q-item-label>{{ selectedUser.bank?.cardNumber || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Expira</q-item-label>
                  <q-item-label>{{ selectedUser.bank?.cardExpire || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>IBAN</q-item-label>
                  <q-item-label>{{ selectedUser.bank?.iban || '—' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Información física</div>

            <q-list dense bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Altura</q-item-label>
                  <q-item-label>{{ selectedUser.height || '—' }} cm</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Peso</q-item-label>
                  <q-item-label>{{ selectedUser.weight || '—' }} kg</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Grupo sanguíneo</q-item-label>
                  <q-item-label>{{ selectedUser.bloodGroup || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Color de ojos</q-item-label>
                  <q-item-label>{{ selectedUser.eyeColor || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Color de cabello</q-item-label>
                  <q-item-label>
                    {{ selectedUser.hair?.color || '—' }}
                    <span v-if="selectedUser.hair?.type"> ({{ selectedUser.hair.type }}) </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="text-h6 text-green-9 q-mt-lg q-mb-sm">Criptomonedas</div>

            <q-list dense bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Moneda</q-item-label>
                  <q-item-label>{{ selectedUser.crypto?.coin || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Wallet</q-item-label>
                  <q-item-label>{{ selectedUser.crypto?.wallet || '—' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Network</q-item-label>
                  <q-item-label>{{ selectedUser.crypto?.network || '—' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- Parte de Martin: Pregunta 4 -->
          <q-tab-panel name="compras">
            <UserPurchasesTab :user-id="selectedUser.id" />
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions align="right">
          <q-btn flat color="green-8" label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import UserTable from '@/components/UserTable.vue'
import UserPurchasesTab from '@/components/UserPurchasesTab.vue'
import { fetchUsersPage, fetchUserById } from '@/services/usersApi'

const $q = useQuasar()

const users = ref([])
const loading = ref(false)
const detailDialog = ref(false)
const selectedUser = ref(null)
const detailTab = ref('info')

const searchQuery = ref('')

const filters = ref({
  gender: 'Todos',
  ageRange: 'Todos',
  country: '',
  city: '',
})

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

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    if (filters.value.gender !== 'Todos') {
      const mappedGender = filters.value.gender === 'Masculino' ? 'male' : 'female'

      if (user.gender !== mappedGender) {
        return false
      }
    }

    if (filters.value.ageRange !== 'Todos') {
      const age = user.age

      if (filters.value.ageRange === '18-30' && (age < 18 || age > 30)) {
        return false
      }

      if (filters.value.ageRange === '31-45' && (age < 31 || age > 45)) {
        return false
      }

      if (filters.value.ageRange === '46+' && age < 46) {
        return false
      }
    }

    if (filters.value.country.trim() !== '') {
      const countryUser = (user.address?.country || '').toLowerCase()
      const countrySearch = filters.value.country.toLowerCase()

      if (!countryUser.includes(countrySearch)) {
        return false
      }
    }

    if (filters.value.city.trim() !== '') {
      const cityUser = (user.address?.city || '').toLowerCase()
      const citySearch = filters.value.city.toLowerCase()

      if (!cityUser.includes(citySearch)) {
        return false
      }
    }

    return true
  })
})

watch(detailDialog, (isOpen) => {
  if (isOpen) {
    detailTab.value = 'info'
  }
})

function translateGender(gender) {
  if (gender === 'male') return 'Masculino'
  if (gender === 'female') return 'Femenino'
  return gender || '—'
}

async function fetchUsers(page = 1, rowsPerPage = 10) {
  loading.value = true

  try {
    const data = await fetchUsersPage({
      page,
      limit: rowsPerPage,
      search: searchQuery.value,
    })

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

function onSearchChange() {
  fetchUsers(1, pagination.value.rowsPerPage)
}

function onRequest(props) {
  const { page, rowsPerPage } = props.pagination
  fetchUsers(page, rowsPerPage)
}

async function openUser(user) {
  loading.value = true

  try {
    const data = await fetchUserById(user.id)

    selectedUser.value = data
    detailDialog.value = true
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al obtener el detalle del usuario',
    })
  } finally {
    loading.value = false
  }
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
  width: 950px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 18px;
  overflow: hidden;
}

.detail-panels {
  max-height: 62vh;
  overflow-y: auto;
}

.avatar-border {
  border: 2px solid #2e7d32;
  background: #e8f5e9;
}
</style>
