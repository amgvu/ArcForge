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
  const [nicknames, setNicknames] = useState(Array(8).fill(''))

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleNicknameChange = (index: number, value: string) => {
    const newNicknames = [...nicknames]
    newNicknames[index] = value
    setNicknames(newNicknames)
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] flex items-center justify-center bg-[#0A0A0B] p-4">
      <div className={`max-w-4xl w-full space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl font-semibold mb-4">ArcForge</h1>

        {/* Server Selector Card */}
        <div className="rounded-lg bg-[#121214] shadow-md p-6">
          <label className="block text-sm font-medium mb-1">
            Select Server
          </label>
          <MenuComponent
            items={servers}
            selectedItem={selectedServer}
            setSelectedItem={setSelectedServer}
          />
        </div>

        {/* Arc Selector Card */}
        <div className="rounded-lg bg-[#121214] shadow-md p-6">
          <label className="block text-sm font-medium mb-1">
            Select Arc
          </label>
          <MenuComponent
            items={arcs}
            selectedItem={selectedArc}
            setSelectedItem={setSelectedArc}
          />
        </div>

        {/* Nickname Inputs Card */}
        <div className="rounded-lg bg-[#121214] shadow-md p-6">
          <div className="flex flex-col items-center space-y-4">
            {nicknames.map((nickname, index) => (
              <div key={index} className="flex items-center space-x-2 w-full">
                <InputComponent
                  value={nickname}
                  onChange={(e) => handleNicknameChange(index, e.target.value)}
                  placeholder={`Nickname ${index + 1}`}
                  className="w-full"
                />
                <ButtonComponent>Apply</ButtonComponent>
                <ButtonComponent>Revert</ButtonComponent>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 space-x-4">
          <ButtonComponent>Apply Arc</ButtonComponent>
          <ButtonComponent>Save Arc</ButtonComponent>
        </div>
      </div>
    </div>
  )
}