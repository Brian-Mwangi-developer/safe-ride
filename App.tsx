/**
 * SafeRide App - Fleet Management Made Simple
 * 
 * @format
 */

import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';
import AddDriverModal from './screens/AddDriverModal';
import BottomNavBar, { TabScreen } from './screens/BottomNavBar';
import DriverFleetScreen from './screens/DriverFleetScreen';
import HomeScreen from './screens/HomeScreen';
import MapsScreen from './screens/MapsScreen';
import WelcomeScreen from './screens/WelcomeScreen';

type UserRole = 'operator' | 'driver';
type CurrentScreen = 'welcome' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('welcome');
  const [userRole, setUserRole] = useState<UserRole>('operator');
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  const handleOperatorPress = () => {
    setUserRole('operator');
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleDriverPress = () => {
    setUserRole('driver');
    setCurrentScreen('dashboard');
    setActiveTab('home');
  };

  const handleRoleChange = (role: UserRole) => {
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

  const handleAddDriver = (driver: any) => {
    setShowAddDriverModal(false);
    Alert.alert('Success', `Driver ${driver.name} has been added successfully!`);
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
        screen = <HomeScreen userRole={userRole} onRoleChange={handleRoleChange} />;
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