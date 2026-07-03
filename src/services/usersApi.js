const API_BASE = 'https://dummyjson.com/users'

async function getJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('No se pudo obtener la información solicitada')
  }

  return response.json()
}

export async function fetchUsersPage({ page = 1, limit = 10, search = '' }) {
  const skip = (page - 1) * limit
  const cleanSearch = search.trim()

  const url = cleanSearch
    ? `${API_BASE}/search?q=${encodeURIComponent(cleanSearch)}&limit=${limit}&skip=${skip}`
    : `${API_BASE}?limit=${limit}&skip=${skip}`

  return getJson(url)
}

export async function fetchUserById(userId) {
  return getJson(`${API_BASE}/${userId}`)
}

export async function fetchUserCarts(userId) {
  return getJson(`${API_BASE}/${userId}/carts`)
}

export async function fetchAllUsers() {
  const firstData = await getJson(`${API_BASE}?limit=1&skip=0`)
  const total = firstData.total || 100

  const data = await getJson(`${API_BASE}?limit=${total}&skip=0`)
  return data.users || []
}
