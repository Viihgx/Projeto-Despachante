import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__section">
                    <h3>Shop Matcha</h3>
                    <ul>
                        <li>Just the Matcha</li>
                        <li>The Trial Kit</li>
                        <li>Wholesale & Bulk</li>
                        <li>Teaware</li>
                    </ul>
                </div>
                <div className="footer__section">
                    <h3>Learn</h3>
                    <ul>
                        <li>Matcha Recipes</li>
                        <li>Caffeine Content</li>
                        <li>Health Benefits</li>
                    </ul>
                </div>
               
                <div className="footer__section footer__section--subscribe">
                    <h3>Ofertas exclusivas</h3>
                    <p>Entre com seu email e ganhe 10% OFF.</p>
                    <form>
                        <input type="email" placeholder="Seu Email" />
                        <button type="submit">Enviar</button>
                    </form>
                    <div className="footer__social">
                        <div className="footer__social-icons">
                            <i className="fab fa-linkedin"></i>
                            <i className="fab fa-facebook-f"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-twitter"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer__bottom">
                <p>© 2024 despachamais.com</p>
                <div className="footer__links">
                    <a href="#">Termos e Serviço</a> | 
                    <a href="#">Privacidade e Políticas</a> 
                </div>
            </div>
        </footer>
    );
};

export default Footer;
