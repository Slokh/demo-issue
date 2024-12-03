import { t } from 'elysia'
import { createElysia } from './utils'
import { actionsRoutes } from './routes/actions'

const app = createElysia().use(actionsRoutes)

app.listen(3001)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
