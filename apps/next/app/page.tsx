'use client'

import { Button } from '@/components/ui/button'
import { generateProofTest } from '@demo/zk'

export default function TestPage() {
  const test = async () => {
    console.log('Generating proof...')
    const proofData = await generateProofTest()
    console.log('Proof generated', proofData)
    console.log('Verifying proof...')
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/actions/submit`,
      {
        method: 'POST',
        body: JSON.stringify({
          proof: Array.from(proofData.proof),
          publicInputs: proofData.publicInputs,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
    console.log('Proof verified')
  }

  return (
    <div className="flex justify-center items-center p-16 w-full gap-4 flex-col">
      <Button onClick={test}>Generate & Verify</Button>
      <div>View logs in console</div>
    </div>
  )
}
