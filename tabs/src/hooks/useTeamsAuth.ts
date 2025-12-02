import { useEffect, useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import * as microsoftTeams from '@microsoft/teams-js';
import { toast } from 'react-toastify';

interface UseTeamsAuthReturn {
  isInTeams: boolean;
  isTeamsInitializing: boolean;
  handleLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

/**
 * Custom hook for Teams SDK initialization and authentication.
 * Centralizes Teams context detection and logout logic to avoid duplication.
 */
export const useTeamsAuth = (): UseTeamsAuthReturn => {
  const { instance, accounts } = useMsal();
  const [isInTeams, setIsInTeams] = useState<boolean>(false);
  const [isTeamsInitializing, setIsTeamsInitializing] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Initialize Teams SDK and detect if running in Teams
  useEffect(() => {
    const initializeTeams = async () => {
      try {
        await microsoftTeams.app.initialize();
        const context = await microsoftTeams.app.getContext();
        if (context) {
          setIsInTeams(true);
          console.log('Running inside Microsoft Teams');
        }
      } catch (error) {
        // Not running in Teams context - this is expected for web browser
        console.log('Not running in Teams context:', error instanceof Error ? error.message : 'Unknown error');
        setIsInTeams(false);
      } finally {
        setIsTeamsInitializing(false);
      }
    };

    initializeTeams();
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      if (isInTeams) {
        console.log('Logging out from Teams');
        await instance.logoutPopup({
          postLogoutRedirectUri: window.location.origin + '/login',
          account: accounts[0] || null,
        });
        console.log('Successfully logged out from MSAL in Teams');
      } else {
        console.log('Logging out from Web Browser');
        await instance.logoutPopup({
          postLogoutRedirectUri: window.location.origin + '/login',
          account: accounts[0] || null,
        });
        console.log('Successfully logged out from MSAL in Web Browser');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to sign out. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  }, [instance, accounts, isInTeams, isLoggingOut]);

  return {
    isInTeams,
    isTeamsInitializing,
    handleLogout,
    isLoggingOut,
  };
};

export default useTeamsAuth;
