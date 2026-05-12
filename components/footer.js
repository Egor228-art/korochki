class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #1e293b;
                    color: white;
                    padding: 2rem 0;
                }
                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }
                .footer-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-decoration: none;
                    margin-bottom: 1rem;
                    display: inline-block;
                }
                .footer-description {
                    color: #94a3b8;
                    margin-bottom: 1rem;
                }
                .footer-heading {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .footer-link {
                    color: #94a3b8;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-link:hover {
                    color: white;
                }
                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .social-link {
                    color: white;
                    transition: color 0.2s;
                }
                .social-link:hover {
                    color: #3b82f6;
                }
                .copyright {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #334155;
                    color: #94a3b8;
                }
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                    }
                }
                .p-2 {
                    padding: 0; 
                    font-size= 50px;
                }
            </style>
            <div class="footer-container">
                <div>
                    <a href="index.html" class="footer-logo">Корочки.Есть</a>
                    <p class="footer-description">Профессиональные курсы для вашего карьерного роста.</p>
                    <div class="social-links">
                        <a href="#" class="social-link"><i data-feather="facebook"></i></a>
                        <a href="#" class="social-link"><i data-feather="twitter"></i></a>
                        <a href="#" class="social-link"><i data-feather="instagram"></i></a>
                        <a href="#" class="social-link"><i data-feather="linkedin"></i></a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Курсы</h3>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Веб-разработка</a>
                        <a href="#" class="footer-link">Анализ данных</a>
                        <a href="#" class="footer-link">Цифровой маркетинг</a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Компания</h3>
                    <div class="footer-links">
                        <a href="about.html" class="footer-link">О нас</a>
                        <a href="#" class="footer-link">Вакансии</a>
                        <a href="#" class="footer-link">Блог</a>
                        <a href="#" class="footer-link">Контакты</a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Законность</h3>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Условия</a>
                        <a href="#" class="footer-link">Конфиденциальность</a>
                        <a href="#" class="footer-link">Cookies</a>
                        <a href="#" class="footer-link">Лицензии</a>
                    </div>
                </div>
            </div>
            <div class="copyright">
                &copy; ${new Date().getFullYear()} Корочки.Есть. Все права защищены.
            </div>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);