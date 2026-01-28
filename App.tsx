/**
 * SafeRide App - Fleet Management Made Simple
 * 
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { STORAGE_KEYS } from './constants/config';
import './global.css';
import AddDriverModal from './screens/AddDriverModal';
import BottomNavBar, { TabScreen } from './screens/BottomNavBar';
import DriverFleetScreen from './screens/DriverFleetScreen';
import DriverLoginScreen from './screens/DriverLoginScreen';
import HomeScreen from './screens/HomeScreen';
import MapsScreen from './screens/MapsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Driver } from './services/driverService';

type UserRole = 'operator' | 'driver';
type CurrentScreen = 'welcome' | 'dashboard' | 'driver-login';

function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('operator');
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [verifiedDriver, setVerifiedDriver] = useState<Driver | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if driver is already verified on app start
  useEffect(() => {
    checkDriverAuth();
  }, []);

  const checkDriverAuth = async () => {
    try {
      const verified = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_VERIFIED);
      const driverData = await AsyncStorage.getItem(STORAGE_KEYS.DRIVER_DATA);

      if (verified === 'true' && driverData) {
        const driver = JSON.parse(driverData);
        setVerifiedDriver(driver);
        setUserRole('driver');
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleOperatorPress = () => {
    setUserRole('operator');
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleDriverPress = () => {
    setCurrentScreen('driver-login');
  };

  const handleDriverVerified = (driver: Driver) => {
    setVerifiedDriver(driver);
    setUserRole('driver');
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleRoleChange = async (role: UserRole) => {
    if (role === 'driver' && !verifiedDriver) {
      // If switching to driver but not verified, go to login
      setCurrentScreen('driver-login');
      return;
    }
    setUserRole(role);
  };

  const handleTabChange = (tab: TabScreen) => {
    if (tab === 'addDriver') {
      if (userRole === 'operator') {
        setShowAddDriverModal(true);
      } else {
        Alert.alert(
          'Access Restricted',
          'Only operators can add new drivers.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddDriver = (_driver: Driver, _verificationLink: string) => {
    setShowAddDriverModal(false);
    // Refresh the drivers list if on the drivers tab
    if (activeTab === 'drivers') {
      setActiveTab('home');
      setTimeout(() => setActiveTab('drivers'), 100);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.DRIVER_VERIFIED,
        STORAGE_KEYS.DRIVER_SESSION,
        STORAGE_KEYS.DRIVER_ID,
        STORAGE_KEYS.DRIVER_DATA,
      ]);
      setVerifiedDriver(null);
      setUserRole('operator');
      setCurrentScreen('welcome');
      setActiveTab('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderDashboard = () => {
    let screen;
    switch (activeTab) {
      case 'drivers':
        screen = <DriverFleetScreen userRole={userRole} />;
        break;
      case 'maps':
        screen = <MapsScreen userRole={userRole} />;
        break;
      case 'home':
      default:
        screen = (
          <HomeScreen
            userRole={userRole}
            onRoleChange={handleRoleChange}
            driverData={verifiedDriver}
            onLogout={handleLogout}
          />
        );
        break;
    }

    return (
      <View className="flex-1">
        {screen}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={userRole}
        />
        <AddDriverModal
          visible={showAddDriverModal}
          onClose={() => setShowAddDriverModal(false)}
          onAddDriver={handleAddDriver}
        />
      </View>
    );
  };

  const renderCurrentScreen = () => {
    if (isCheckingAuth) {
      return null; // Or a splash screen
    }

    if (currentScreen === 'driver-login') {
      return (
        <DriverLoginScreen
          onVerificationSuccess={handleDriverVerified}
          onBackPress={handleBackToWelcome}
        />
      );
    }

    if (currentScreen === 'dashboard') {
      return renderDashboard();
    }

    return (
      <WelcomeScreen
        onOperatorPress={handleOperatorPress}
        onDriverPress={handleDriverPress}
      />
    );
  };

  return (
    <SafeAreaProvider>
      {renderCurrentScreen()}
    </SafeAreaProvider>
  );
}

export default App;