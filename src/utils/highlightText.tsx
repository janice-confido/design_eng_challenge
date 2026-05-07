/**
 * highlightText — wraps matching substrings in a yellow <mark> span.
 */
import React from 'react'

export const highlightText = (text: string | null | undefined, query: string): React.ReactNode => {
  const str = text ?? ''
  if (!query) return str

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = str.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ backgroundColor: '#fff3b0', padding: 0 }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}
