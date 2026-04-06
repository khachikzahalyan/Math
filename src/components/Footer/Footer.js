import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h4>Մաթեմատիկական տրամաբանություն</h4>
          <p>Ուսումնական հարթակ՝ պարզ բացատրություններով և կառուցված ուսուցմամբ։</p>
        </div>
        <div className="footer__links">
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
