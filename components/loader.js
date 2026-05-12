// components/loader.js
class ComponentLoader {
    static showNavbarPlaceholder() {
        if (!document.querySelector('custom-navbar').shadowRoot) {
            document.querySelector('custom-navbar').innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 1200px; margin: 0 auto;">
                    <a href="index.html" style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; text-decoration: none; display: flex; align-items: center;">
                        <span style="margin-right: 0.5rem;">📚</span>
                        Корочки.Есть
                    </a>
                    <div style="display: flex; gap: 1rem;">
                        <a href="login.html" style="color: #3b82f6; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #3b82f6; border-radius: 0.375rem;">Вход</a>
                        <a href="register.html" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.375rem;">Регистрация</a>
                    </div>
                </div>
            `;
        }
    }

    static showFooterPlaceholder() {
        if (!document.querySelector('custom-footer').shadowRoot) {
            document.querySelector('custom-footer').innerHTML = `
                <div style="background: #1f2937; color: white; padding: 2rem; text-align: center;">
                    <p>© 2024 Корочки.Есть. Все права защищены.</p>
                </div>
            `;
        }
    }
}