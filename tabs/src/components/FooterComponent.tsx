import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './FooterComponent.module.css';
import { KNOWALL_CONSTANTS } from '../constants/branding';
import { useTeamsAuth } from '../hooks/useTeamsAuth';
import { isActivePath } from '../utils/navigation';

type FooterComponentProps = {
  hidden: boolean;
};

const FooterComponent: React.FC<FooterComponentProps> = ({ hidden }) => {
  const { isInTeams } = useTeamsAuth();
  const location = useLocation();

  // Use shared navigation utility for active path checking
  const isActive = (path: string) => isActivePath(location.pathname, path);

  if (hidden) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      {/* Show navigation links ONLY in Teams context */}
      {isInTeams && (
        <nav className={styles.navigation} aria-label="Primary navigation">
          <Link to="/feed" className={isActive('/feed') ? styles.active : ''} aria-current={isActive('/feed') ? 'page' : undefined}>Feed</Link>
          <Link to="/users" className={isActive('/users') ? styles.active : ''} aria-current={isActive('/users') ? 'page' : undefined}>Users</Link>
          <Link to="/rewards" className={isActive('/rewards') ? styles.active : ''} aria-current={isActive('/rewards') ? 'page' : undefined}>Rewards</Link>
          <Link to="/wallet" className={isActive('/wallet') ? styles.active : ''} aria-current={isActive('/wallet') ? 'page' : undefined}>Wallet</Link>
          <Link to="/settings" className={isActive('/settings') ? styles.active : ''} aria-current={isActive('/settings') ? 'page' : undefined}>Settings</Link>
        </nav>
      )}
      {/* Always show Powered by KnowAll AI */}
      <div className={styles.attribution}>
        <span className={styles.poweredBy}>Powered by</span>
        <a
          href={KNOWALL_CONSTANTS.website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.knowallLink}
          aria-label="Visit KnowAll AI website"
        >
          <span className={styles.knowallBadge}>{KNOWALL_CONSTANTS.name}</span>
        </a>
      </div>
    </footer>
  );
};

export default FooterComponent;
