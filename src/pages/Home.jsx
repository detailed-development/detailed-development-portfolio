import Hero from '../components/Hero'
import TaglineBar from '../components/TaglineBar'
import Work from '../components/Work'
import Services from '../components/Services'
import Process from '../components/Process'
import About from '../components/About'
import Contact from '../components/Contact'
import useReveal from '../hooks/useReveal'

export default function Home() {
  useReveal()

  return (
    <>
      <Hero />
      <TaglineBar />
      <Work />
      <Services />
      <Process />
      <About />
      <Contact />
    </>
  )
}
