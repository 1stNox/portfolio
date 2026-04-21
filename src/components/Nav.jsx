export default function Nav({ onLogoClick }) {
  return (
    <nav>
      <a className="nav-logo" href="#" onClick={onLogoClick}>flr_</a>
      <a className="nav-domain" href="https://reichling.dev" target="_blank" rel="noreferrer">reichling.dev</a>
    </nav>
  )
}
