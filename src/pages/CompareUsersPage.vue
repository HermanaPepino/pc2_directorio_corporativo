<template>
  <q-page class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 1100px">
      <q-card flat bordered class="compare-card">
        <div class="row items-center justify-between q-gutter-md q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-green-10">Comparación de Colaboradores</div>
            <div class="text-grey-7">
              Selecciona dos usuarios para comparar sus características.
            </div>
          </div>

          <q-icon name="compare_arrows" size="42px" color="green-8" />
        </div>

        <q-banner v-if="error" rounded class="bg-red-1 text-red-9 q-mb-md">
          {{ error }}
        </q-banner>

        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-6">
            <q-select
              v-model="firstUserId"
              :options="userOptions"
              option-label="fullName"
              option-value="id"
              emit-value
              map-options
              outlined
              dense
              clearable
              label="Primer colaborador"
              color="green-8"
              :loading="loadingUsers"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="secondUserId"
              :options="userOptions"
              option-label="fullName"
              option-value="id"
              emit-value
              map-options
              outlined
              dense
              clearable
              label="Segundo colaborador"
              color="green-8"
              :loading="loadingUsers"
            />
          </div>
        </div>

        <q-banner v-if="sameUserSelected" rounded class="bg-orange-1 text-orange-10 q-mb-md">
          Selecciona dos colaboradores diferentes para hacer la comparación.
        </q-banner>

        <q-inner-loading :showing="loadingDetails" color="green-8" />

        <div v-if="canCompare" class="q-mt-md">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="user-summary">
                <q-card-section class="row items-center q-gutter-md">
                  <q-avatar size="64px" class="avatar-border">
                    <img :src="firstUser.image" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle1 text-weight-bold">
                      {{ getFullName(firstUser) }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ firstUser.email }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered class="user-summary">
                <q-card-section class="row items-center q-gutter-md">
                  <q-avatar size="64px" class="avatar-border">
                    <img :src="secondUser.image" />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle1 text-weight-bold">
                      {{ getFullName(secondUser) }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ secondUser.email }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-markup-table flat bordered class="comparison-table">
            <thead>
              <tr>
                <th class="text-left">Característica</th>
                <th class="text-left">{{ getFullName(firstUser) }}</th>
                <th class="text-left">{{ getFullName(secondUser) }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in comparisonRows" :key="row.label">
                <td class="text-weight-medium text-green-10">
                  {{ row.label }}
                </td>
                <td>{{ row.first }}</td>
                <td>{{ row.second }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <q-banner
          v-else-if="!loadingDetails && !sameUserSelected"
          rounded
          class="bg-green-1 text-green-10"
        >
          Elige dos colaboradores para ver la tabla comparativa.
        </q-banner>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { fetchAllUsers, fetchUserById } from '@/services/usersApi'

const loadingUsers = ref(false)
const loadingDetails = ref(false)
const error = ref('')

const users = ref([])
const firstUserId = ref(null)
const secondUserId = ref(null)
const firstUser = ref(null)
const secondUser = ref(null)

const userOptions = computed(() => {
  return users.value.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
  }))
})

const sameUserSelected = computed(() => {
  return firstUserId.value && secondUserId.value && firstUserId.value === secondUserId.value
})

const canCompare = computed(() => {
  return firstUser.value && secondUser.value && !sameUserSelected.value
})

const comparisonRows = computed(() => {
  if (!canCompare.value) return []

  return [
    {
      label: 'Nombre',
      first: getFullName(firstUser.value),
      second: getFullName(secondUser.value),
    },
    {
      label: 'Edad',
      first: formatValue(firstUser.value.age),
      second: formatValue(secondUser.value.age),
    },
    {
      label: 'Género',
      first: translateGender(firstUser.value.gender),
      second: translateGender(secondUser.value.gender),
    },
    {
      label: 'Empresa',
      first: formatValue(firstUser.value.company?.name),
      second: formatValue(secondUser.value.company?.name),
    },
    {
      label: 'Cargo',
      first: formatValue(firstUser.value.company?.title),
      second: formatValue(secondUser.value.company?.title),
    },
    {
      label: 'Universidad',
      first: formatValue(firstUser.value.university),
      second: formatValue(secondUser.value.university),
    },
    {
      label: 'Ciudad',
      first: formatValue(firstUser.value.address?.city),
      second: formatValue(secondUser.value.address?.city),
    },
    {
      label: 'País',
      first: formatValue(firstUser.value.address?.country),
      second: formatValue(secondUser.value.address?.country),
    },
    {
      label: 'Altura',
      first: formatMeasurement(firstUser.value.height, 'cm'),
      second: formatMeasurement(secondUser.value.height, 'cm'),
    },
    {
      label: 'Peso',
      first: formatMeasurement(firstUser.value.weight, 'kg'),
      second: formatMeasurement(secondUser.value.weight, 'kg'),
    },
    {
      label: 'Grupo sanguíneo',
      first: formatValue(firstUser.value.bloodGroup),
      second: formatValue(secondUser.value.bloodGroup),
    },
  ]
})

function getFullName(user) {
  if (!user) return '—'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'
}

function formatValue(value) {
  return value || '—'
}

function formatMeasurement(value, unit) {
  if (!value) return '—'
  return `${value} ${unit}`
}

function translateGender(gender) {
  if (gender === 'male') return 'Masculino'
  if (gender === 'female') return 'Femenino'
  return gender || '—'
}

async function loadUsers() {
  loadingUsers.value = true
  error.value = ''

  try {
    users.value = await fetchAllUsers()
  } catch (err) {
    error.value = err.message || 'No se pudo cargar la lista de usuarios.'
  } finally {
    loadingUsers.value = false
  }
}

async function loadSelectedUsers() {
  firstUser.value = null
  secondUser.value = null

  if (!firstUserId.value || !secondUserId.value || sameUserSelected.value) {
    return
  }

  loadingDetails.value = true
  error.value = ''

  try {
    const [firstData, secondData] = await Promise.all([
      fetchUserById(firstUserId.value),
      fetchUserById(secondUserId.value),
    ])

    firstUser.value = firstData
    secondUser.value = secondData
  } catch (err) {
    error.value = err.message || 'No se pudo cargar la comparación.'
  } finally {
    loadingDetails.value = false
  }
}

watch([firstUserId, secondUserId], () => {
  loadSelectedUsers()
})

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.compare-card {
  border-radius: 18px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
}

.user-summary {
  border-radius: 16px;
  background: #f8fcf8;
}

.avatar-border {
  border: 2px solid #2e7d32;
  background: #e8f5e9;
}

.comparison-table {
  border-radius: 16px;
  overflow: hidden;
}

.comparison-table th {
  background: #e8f5e9;
  color: #1b5e20;
  font-weight: 700;
}
</style>
