import logo from '../../assets/logo.png'; // Adjust path if needed

const HomePage = () => (
  <main className="homepage">
    <header className="logo-header">
      <img src={logo} alt="SnapDocs Logo" className="logo" />
    </header>

    <section className="hero">
      <h1>Access Your Documents Anytime, Anywhere</h1>
      <p>
        Create folders like <strong>Study Certificates</strong>, <strong>Family Photos</strong>, 
        <strong>Property Docs</strong>, and upload securely.
      </p>
      <button className="cta">Get Started</button>
    </section>
  </main>
);
