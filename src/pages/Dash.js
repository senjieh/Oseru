import React from 'react'
import Game from '../Game'

export default function Dash() {
  return (
    <div>
        <script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.4.0"></script>
        <Game></Game>
    </div>
  )
}
