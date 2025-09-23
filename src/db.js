export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveUser(user) {
  const db = await openDB()
  const tx = db.transaction('users', 'readwrite')
  const store = tx.objectStore('users')
  store.put(user)
  await tx.complete
  db.close()
}

export async function getUser(email) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const request = store.get(email)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllUsers() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
