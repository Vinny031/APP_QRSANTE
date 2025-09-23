export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' })
      }
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

export async function saveUser(user) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite')
    const store = tx.objectStore('users')
    const request = store.put(user)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)

    // On ferme la DB quand la transaction est terminée
    tx.oncomplete = () => db.close()
  })
}

export async function getUser(email) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const request = store.get(email)

    request.onsuccess = () => {
      resolve(request.result)
      db.close()
    }
    request.onerror = () => {
      reject(request.error)
      db.close()
    }
  })
}

export async function getAllUsers() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly')
    const store = tx.objectStore('users')
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
      db.close()
    }
    request.onerror = () => {
      reject(request.error)
      db.close()
    }
  })
}

export async function deleteUser(email) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite')
    const store = tx.objectStore('users')
    const request = store.delete(email)

    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)

    tx.oncomplete = () => db.close()
  })
}
