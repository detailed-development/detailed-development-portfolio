import Hero from '../components/Hero'
import TaglineBar from '../components/TaglineBar'
import Work from '../components/Work'
import Services from '../components/Services'
import Process from '../components/Process'
import About from '../components/About'
import Contact from '../components/Contact'

export default function Home() {
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
