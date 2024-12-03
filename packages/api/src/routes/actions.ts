import { createElysia } from '../utils'
import { t } from 'elysia'
import { verifyProof, generateProofTest } from '@demo/zk'

export const actionsRoutes = createElysia({ prefix: '/actions' })
  .get('/test', async () => {
    const proofData = await generateProofTest()
    const verified = await verifyProof(proofData)
    return {
      verified,
    }
  })
  .post(
    '/submit',
    async ({ body }) => {
      const verified = await verifyProof({
        proof: new Uint8Array(body.proof),
        publicInputs: body.publicInputs,
      })
      return { verified }
    },
    {
      body: t.Object({
        proof: t.Array(t.Number()),
        publicInputs: t.Array(t.String()),
      }),
    }
  )
