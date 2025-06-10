import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columnsContainer}>
        {/* Колонка "Поддержка" */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Поддержка</h3>
          <ul className={styles.linksList}>
            <li><a href="/faq">Часто задаваемые вопросы</a></li>
            <li><a href="/support">Служба поддержки</a></li>
            <li><a href="/feedback">Обратная связь с веб-сайтом</a></li>
          </ul>
        </div>

        {/* Колонка "О нас" */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>О нас</h3>
          <ul className={styles.linksList}>
            <li><a href="/join">Присоединиться к нам</a></li>
            <li><a href="/history">Наша история</a></li>
          </ul>
        </div>

        {/* Колонка "Информация о сайте" */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Информация о сайте</h3>
          <ul className={styles.linksList}>
            <li><a href="/terms">Условия пользования</a></li>
            <li><a href="/privacy">Политика конфиденциальности</a></li>
            <li><a href="/cookies">Политика использования cookie</a></li>
            <li><a href="/intellectual">Интеллектуальная собственность</a></li>
            <li><a href="/sitemap">Карта сайта</a></li>
          </ul>
        </div>

        {/* Колонка "Подпишитесь на нас" */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Подпишитесь на нас</h3>
          <ul className={styles.linksList}>
            <li><a href="/contact">Связаться с нами</a></li>
          </ul>
          <div className={styles.socialIcons}>
              <a href="https://facebook.com" className={styles.icon}>FB</a>
              <a href="https://twitter.com" className={styles.icon}>TW</a>
              <a href="https://instagram.com" className={styles.icon}>IG</a>
              <a href="https://youtube.com" className={styles.icon}>YT</a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        Copyright © 2025 AboutUs. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;