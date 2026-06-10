import db from '../db/database'

export const settingsService = {
  async get(key) {
    const record = await db.settings.get(key)
    return record?.value
  },

  async set(key, value) {
    return db.settings.put({ key, value })
  },

  async getAll() {
    const records = await db.settings.toArray()
    return Object.fromEntries(records.map(r => [r.key, r.value]))
  },
}
