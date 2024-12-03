import verifyActionCircuit from '../circuits/verify-action/target/main.json'
import verifyActionVkey from '../circuits/verify-action/target/vkey.json'
import { CompiledCircuit, type Noir } from '@noir-lang/noir_js'
import { UltraHonkBackend, BarretenbergVerifier, ProofData } from '@aztec/bb.js'
import { getPublicKey, getMerkleTreeProof, toArray } from './utils'

type ProverModules = {
  Noir: typeof Noir
  UltraHonkBackend: typeof UltraHonkBackend
}

type VerifierModules = {
  BarretenbergVerifier: typeof BarretenbergVerifier
}

let proverPromise: Promise<ProverModules> | null = null
let verifierPromise: Promise<VerifierModules> | null = null

export async function initProver(): Promise<ProverModules> {
  if (!proverPromise) {
    proverPromise = (async () => {
      const [{ Noir }, { UltraHonkBackend }] = await Promise.all([
        import('@noir-lang/noir_js'),
        import('@aztec/bb.js'),
      ])
      return {
        Noir,
        UltraHonkBackend,
      }
    })()
  }
  return proverPromise
}

export async function initVerifier(): Promise<VerifierModules> {
  if (!verifierPromise) {
    verifierPromise = (async () => {
      const { BarretenbergVerifier } = await import('@aztec/bb.js')
      return { BarretenbergVerifier }
    })()
  }
  return verifierPromise
}

export async function verifyProof(proofData: ProofData) {
  const { BarretenbergVerifier } = await initVerifier()

  const verifier = new BarretenbergVerifier({ crsPath: process.env.TEMP_DIR })
  const result = await verifier.verifyUltraHonkProof(
    proofData,
    Uint8Array.from(verifyActionVkey)
  )

  return result
}

export async function generateProof(input: {
  address: `0x${string}`
  signature: `0x${string}`
  messageHash: `0x${string}`
}) {
  const { Noir, UltraHonkBackend } = await initProver()

  const backend = new UltraHonkBackend(verifyActionCircuit.bytecode)
  const noir = new Noir(verifyActionCircuit as CompiledCircuit)

  const { pubKeyX, pubKeyY } = await getPublicKey(input.signature, input.messageHash)
  const { root, index, siblings } = await getMerkleTreeProof(input.address)

  const { witness } = await noir.execute({
    signature: toArray(input.signature).slice(0, 64),
    message_hash: toArray(input.messageHash),
    pub_key_x: pubKeyX,
    pub_key_y: pubKeyY,
    root,
    index,
    path: siblings,
  })

  return await backend.generateProof(witness)
}

// Demo function for generating a proof
export async function generateProofTest() {
  const address = '0x333601a803cac32b7d17a38d32c9728a93b422f4'
  const signature =
    '0xeee23083c8d17575d2b3f96afcddc2b31979d5c8c7d2ee0fadd1d42404aa3ee86bc765d1b6dd283f7cb8f27437f748b58e948e764051f4c98f38adb28a0ff65b1c'
  const messageHash = '0xd1e49abf2d4d64466cc5d72ee0716aeee5506ff3cf4a5c0e43b74b8bc9580e12'

  const proofData = await generateProof({
    address,
    signature,
    messageHash,
  })

  return proofData
}
