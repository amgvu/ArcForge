'use client'

import { useState, useEffect } from 'react'
import MenuComponent from '@/components/ui/Menu'
import ButtonComponent from '@/components/ui/Button'
import InputComponent from '@/components/ui/Input'

const servers = ['꒰ᵕ༚ᵕ꒱ ˖°', 'Ground Zero', 'WIND TUNNEL']
const arcs = ['League of Legends Arc', 'Marvel Arc']

export default function Dashboard() {
  const [selectedServer, setSelectedServer] = useState('')
  const [selectedArc, setSelectedArc] = useState('')
  const [nickname, setNickname] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-zinc-100 flex items-center justify-center bg-zinc-950 p-4">
      <div className={`max-w-4xl w-full bg-zinc-900 rounded-lg shadow-md p-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl font-semibold mb-4">ArcForge</h1>
        <div className="space-y-4">
          {/* Server Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Server
            </label>
            <MenuComponent
              items={servers}
              selectedItem={selectedServer}
              setSelectedItem={setSelectedServer}
            />
          </div>

          {/* Arc Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Arc
            </label>
            <MenuComponent
              items={arcs}
              selectedItem={selectedArc}
              setSelectedItem={setSelectedArc}
            />
          </div>

          {/* Nickname Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nickname
            </label>
            <InputComponent
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter nickname"
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-4">
            <ButtonComponent>Apply Arc</ButtonComponent>
            <ButtonComponent>Save Arc</ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  )
}