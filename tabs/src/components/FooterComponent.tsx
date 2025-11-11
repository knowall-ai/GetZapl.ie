import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FooterComponent.module.css';
import SignInSignOutButton from './SignInSignOutButton';

type FooterComponentProps = {
  hidden: boolean;
};

const FooterComponent: React.FC<FooterComponentProps> = ({ hidden }) => {

  if (hidden) {
    return null;
}
  return (
    <footer className={styles.footer}>
      <div className={styles.navigation}>
        <Link to="/feed">Feed</Link>&nbsp;|&nbsp;
        <Link to="/users">Users</Link>&nbsp;|&nbsp;
        <Link to="/rewards">Rewards</Link>&nbsp;|&nbsp;
        <Link to="/wallet">Wallet</Link>&nbsp;|&nbsp;
        <Link to="/settings">Settings</Link>&nbsp;|&nbsp;
        <SignInSignOutButton />
      </div>
      <div className={styles.attribution}>
        <span className={styles.poweredBy}>Powered by</span>
        <a href="https://www.knowall.ai" target="_blank" rel="noopener noreferrer" className={styles.knowallLink}>
          <span className={styles.knowallBadge}>KnowAll AI</span>
        </a>
        <span className={styles.separator}>•</span>
        <a href="mailto:hello@knowall.ai" className={styles.contactLink}>hello@knowall.ai</a>
      </div>
    </footer>

  );
};

export default FooterComponent;
