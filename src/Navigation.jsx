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
          <a href="#projects" className="nav-link">Projects</a>
          <a href="https://github.com/chaser164" className="nav-link">GitHub</a>
          <a href="#linkedin" className="nav-link">LinkedIn</a>
          <a href="/resume.pdf" className="nav-link" target="_blank" rel="noopener noreferrer">Résumé</a>
        </div>
      </div>
    </nav>
  )
} 