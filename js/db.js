// =====================================================================
// db.js — local database (IndexedDB) layer.
// All article / bookmark / follow data is read from and written to a
// local IndexedDB database on the user's computer — nothing is read
// from in-memory constants at runtime.
// =====================================================================

const DB_NAME = 'cna-db';
const DB_VERSION = 1;

let _db = null;

export function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('articles')) db.createObjectStore('articles', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('bookmarks')) db.createObjectStore('bookmarks', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('follows')) db.createObjectStore('follows', { keyPath: 'author' });
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

export function objectStore(name, mode) {
  return openDB().then((db) => db.transaction(name, mode).objectStore(name));
}

export function dbGetAll(name) {
  return objectStore(name, 'readonly').then((s) => new Promise((resolve, reject) => {
    const r = s.getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => reject(r.error);
  }));
}

export function dbGet(name, key) {
  return objectStore(name, 'readonly').then((s) => new Promise((resolve, reject) => {
    const r = s.get(key);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}

export function dbPut(name, value) {
  return objectStore(name, 'readwrite').then((s) => new Promise((resolve, reject) => {
    const r = s.put(value);
    r.onsuccess = () => resolve(value);
    r.onerror = () => reject(r.error);
  }));
}

export function dbDelete(name, key) {
  return objectStore(name, 'readwrite').then((s) => new Promise((resolve, reject) => {
    const r = s.delete(key);
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  }));
}

export function dbCount(name) {
  return objectStore(name, 'readonly').then((s) => new Promise((resolve, reject) => {
    const r = s.count();
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  }));
}

export function dbClear(name) {
  return objectStore(name, 'readwrite').then((s) => new Promise((resolve, reject) => {
    const r = s.clear();
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  }));
}

// Seeds a store only when it is empty (first run / fresh install).
export async function dbSeedIfEmpty(name, items) {
  const n = await dbCount(name);
  if (n > 0) return;
  for (const item of items) await dbPut(name, item);
}
