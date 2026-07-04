<template>
  <q-page class="q-pa-xl">

    <div class="dashboard-container">

      <q-card flat bordered class="dashboard-card q-pa-xl">

          <div class="text-center q-mb-lg">

          <div class="text-h4 text-weight-bold">
            Dashboard General
          </div>

          <div class="subtitle text-subtitle1 q-mt-sm">
            Indicadores generales obtenidos de todos los usuarios registrados
          </div>

        </div>

        <div class="row q-col-gutter-lg">

          <!-- Total -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-green">

              <q-card-section
              class="row items-center 
              no-wrap" style="height:150px"
>
                <div class="icon-circle bg-green">
                  <q-icon name="groups" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Total Usuarios
                  </div>

                  <div class="kpi-value">
                    {{ totalUsuarios }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

          <!-- Hombres -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-blue">

              <q-card-section
                class="row items-center no-wrap"
                  style="height:150px"
>

                <div class="icon-circle bg-blue">
                  <q-icon name="man" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Hombres
                  </div>

                  <div class="kpi-value">
                    {{ hombres }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

          <!-- Mujeres -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-pink">

              <q-card-section
                class="row items-center no-wrap"
                  style="height:150px"
>

                <div class="icon-circle bg-pink">
                  <q-icon name="woman" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Mujeres
                  </div>

                  <div class="kpi-value">
                    {{ mujeres }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

          <!-- Edad -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-green">

              <q-card-section
                class="row items-center no-wrap"
                  style="height:150px"
>

                <div class="icon-circle bg-green">
                  <q-icon name="calendar_month" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Edad Promedio
                  </div>

                  <div class="kpi-value">
                    {{ promedioEdad }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

          <!-- Empresas -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-orange">

              <q-card-section
                class="row items-center no-wrap"
                  style="height:150px"
>

                <div class="icon-circle bg-orange">
                  <q-icon name="business" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Empresas Distintas
                  </div>

                  <div class="kpi-value">
                    {{ empresas }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

          <!-- Ciudades -->
          <div class="col-12 col-md-4">
            <q-card class="kpi-card border-purple">

              <q-card-section
                class="row items-center no-wrap"
                  style="height:150px"
>

                <div class="icon-circle bg-deep-purple">
                  <q-icon name="location_city" size="32px"/>
                </div>

                <div class="q-ml-lg">

                  <div class="kpi-title">
                    Ciudades Distintas
                  </div>

                  <div class="kpi-value">
                    {{ ciudades }}
                  </div>

                </div>

              </q-card-section>

            </q-card>
          </div>

        </div>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchAllUsers } from '@/services/usersApi'

const totalUsuarios = ref(0)
const hombres = ref(0)
const mujeres = ref(0)
const promedioEdad = ref(0)
const empresas = ref(0)
const ciudades = ref(0)

const cargarDashboard = async () => {
  try {
    const usuarios = await fetchAllUsers()

    totalUsuarios.value = usuarios.length

    hombres.value = usuarios.filter(
      usuario => usuario.gender === 'male'
    ).length

    mujeres.value = usuarios.filter(
      usuario => usuario.gender === 'female'
    ).length

    promedioEdad.value = (
      usuarios.reduce((suma, usuario) => suma + usuario.age, 0) /
      usuarios.length
    ).toFixed(1)

    empresas.value = new Set(
      usuarios.map(usuario => usuario.company.name)
    ).size

    ciudades.value = new Set(
      usuarios.map(usuario => usuario.address.city)
    ).size

  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  cargarDashboard()
})
</script>
<style scoped>

.dashboard-container {
  max-width: 1280px;
  margin: auto;
}

.dashboard-card {
  border-radius: 18px;
  padding: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
}

.dashboard-title {
  font-size: 42px;
  font-weight: 700;
  color: #212121;
}

.subtitle {
  font-size: 15px;
  color: #757575;
  .dashboard-header {
  margin-bottom: 24px;
}
}

.kpi-card {
  border-radius: 16px;
  min-height: 155px;
  transition: all .25s ease;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,.14);
}

.border-green {
  border-top: 5px solid #43a047;
}

.border-blue {
  border-top: 5px solid #1e88e5;
}

.border-pink {
  border-top: 5px solid #e91e63;
}

.border-orange {
  border-top: 5px solid #fb8c00;
}

.border-purple {
  border-top: 5px solid #673ab7;
}

.icon-circle {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.kpi-title {
  font-size: 18px;
  color: #616161;
  font-weight: 500;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 50px;
  font-weight: 700;
  color: #212121;
  line-height: 1;
}

</style>