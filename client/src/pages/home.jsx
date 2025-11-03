import React from 'react'
import LandingIntro from '../components/LandingIntro'
import LandingSecond from '../components/LandingSecond'
import LandingCTA from '../components/LandingCTA'

const home = () => {
  return (
    <div>
      <LandingIntro />
      <LandingSecond/>
      <LandingCTA />
    </div>
  )
}

export default home
