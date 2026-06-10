import db from '../db/database'

export const cartSessionService = {
  async getAll() {
    return db.cartSessions.orderBy('createdAt').reverse().toArray()
  },

  async save(session) {
    if (session.id) {
      await db.cartSessions.update(session.id, session)
      return session.id
    }
    return db.cartSessions.add({ ...session, createdAt: new Date() })
  },

  async delete(id) {
    return db.cartSessions.delete(id)
  },

  async get(id) {
    return db.cartSessions.get(id)
  },
}
