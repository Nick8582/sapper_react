import logo from "../../logo.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="container header__container">
        <img src={logo} className="header__logo" alt="logo"/>
        <div className="header__right">
          <h1 className="header__title">Sapper</h1>
          <p className="header__description">dev. Potapov Vladislav</p>
        </div>
      </div>
    </header>
  )
}

export default Header
