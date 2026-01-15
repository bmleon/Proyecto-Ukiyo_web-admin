// @ts-ignore
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const sql = postgres({
    host: config.dbHost,
    port: Number(config.dbProdPort || 5436),
    database: config.dbProdName,
    username: config.dbProdUser,
    password: config.dbProdPassword,
    ssl: false,
    connect_timeout: 2
  })

  try {
    const products = await sql`SELECT * FROM productos`
    return products
  } catch (error) {
    console.warn('⚠️ Fallo en BD Productos:', error)
    
    return [
      { id: 101, name: 'Dragon Roll (Demo)', category: 'Sushi', price: 14.50, status: true, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100' },
      { id: 102, name: 'Ramen Tonkotsu (Demo)', category: 'Calientes', price: 12.00, status: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100' },
      { id: 103, name: 'Nigiri Salmón (Demo)', category: 'Nigiri', price: 6.50, status: true, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=100' },
      { id: 104, name: 'Mochi Té Verde (Demo)', category: 'Postres', price: 5.50, status: false, image: 'https://images.unsplash.com/photo-1623596732263-06b03568e022?w=100' }
    ]
  }
})