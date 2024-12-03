import { generateProofTest, verifyProof } from '../src'

async function main() {
  console.time('generateProof')
  const proofData = await generateProofTest()
  console.timeEnd('generateProof')
  console.time('verifyProof')
  const verified = await verifyProof(proofData)
  console.timeEnd('verifyProof')
  console.log({ verified })
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
