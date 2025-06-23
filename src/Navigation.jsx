import './css/navigation.css'

export function Navigation({ isVisible = true }) {
  return (
    <nav className={`navigation ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container">
        <div className="bio-section">
          <p className="bio-text">
            Hello, I'm Chase! I am a senior at Yale University majoring in Computer Science & Psychology with a certificate in Data Science. Interested in project-based learning, human-oriented technology, and interdisciplinary approaches to problem solving.
          </p>
        </div>
        <div className="nav-links">
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="https://github.com/chaser164" className="nav-link">GitHub</a>
          <a href="https://www.linkedin.com/in/chase-reynders" className="nav-link">LinkedIn</a>
          <a href="/resume.pdf" className="nav-link" target="_blank" rel="noopener noreferrer">Résumé</a>
          <a href="mailto:chase.reynders@yale.edu" className="nav-link">Mail</a>
        </div>
      </div>
    </nav>
  )
} 