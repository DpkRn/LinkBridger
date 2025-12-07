import React from 'react'

// Minimal dashboard: simple list of cards
const sampleCards = [
  { id: 1, title: 'Card One', subtitle: 'Quick link or info' },
  { id: 2, title: 'Card Two', subtitle: 'Another item' },
  { id: 3, title: 'Card Three', subtitle: 'More details' },
];

const DashBoard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleCards.map((c) => (
          <div key={c.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashBoard