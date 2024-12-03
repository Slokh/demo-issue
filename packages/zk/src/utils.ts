import { LeanIMT } from '@zk-kit/lean-imt'
import { pad, recoverPublicKey } from 'viem'
import { BarretenbergSync, Fr } from '@aztec/bb.js'

export async function getPublicKey(signature: `0x${string}`, messageHash: `0x${string}`) {
  const pubKey = await recoverPublicKey({
    hash: messageHash,
    signature,
  })
  const pubKeyX = toArray(pubKey.slice(4, 68))
  const pubKeyY = toArray(pubKey.slice(68))

  return { pubKeyX, pubKeyY }
}

export function toArray(hexString: string, chunkSize = 2): string[] {
  let hex = hexString.replace('0x', '')
  const chunks: string[] = []
  for (let i = 0; i < hex.length; i += chunkSize) {
    chunks.push(`0x${hex.slice(i, i + chunkSize)}`)
  }
  return chunks
}

// Demo merkle tree
export async function getMerkleTreeProof(address: `0x${string}`) {
  const paddedAddress = pad(address)
  const leaves = [
    paddedAddress,
    '0x09bbcbfa8d56a675cf84a323d90e352cf43936dc6946e83e10f65a667a0501ee',
    '0x26da753b8d364ca00a4602c0823c704331a7c398794a90adda7a79c973e8b896',
    '0x22d3fbf634e850382fe3b24dc0952816d7a1af748180c67c235bb16f0795478b',
  ]

  const bb = await BarretenbergSync.new()
  const hasher = (a: string, b: string) =>
    bb.poseidon2Hash([Fr.fromString(a), Fr.fromString(b)]).toString()
  const tree = new LeanIMT(hasher, leaves)
  return tree.generateProof(leaves.indexOf(paddedAddress))
}
