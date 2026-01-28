import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export type TabScreen = 'home' | 'addDriver' | 'drivers' | 'maps';

interface BottomNavBarProps {
    activeTab: TabScreen;
    onTabChange: (tab: TabScreen) => void;
    userRole?: 'operator' | 'driver';
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange, userRole = 'operator' }) => {
    const insets = useSafeAreaInsets();

    const allTabs = [
        { id: 'home' as TabScreen, label: 'Home', icon: 'home' },
        { id: 'addDriver' as TabScreen, label: 'Add Driver', icon: 'add-circle', operatorOnly: true },
        { id: 'drivers' as TabScreen, label: 'Drivers', icon: 'people', operatorOnly: true },
        { id: 'maps' as TabScreen, label: 'Maps', icon: 'map' },
    ];

    // Filter tabs based on user role
    const tabs = userRole === 'driver'
        ? allTabs.filter(tab => !tab.operatorOnly)
        : allTabs;

    return (
        <View
            className="bg-white border-t border-gray-200"
            style={{
                paddingBottom: insets.bottom,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
            }}
        >
            <View className="flex-row items-center justify-around px-2 py-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => onTabChange(tab.id)}
                            className="flex-1 items-center justify-center py-2"
                            activeOpacity={0.7}
                        >
                            <View className={`items-center ${isActive ? 'bg-blue-50' : ''} rounded-xl px-4 py-2`}>
                                <Icon
                                    name={tab.icon}
                                    size={24}
                                    color={isActive ? '#3B82F6' : '#9CA3AF'}
                                />
                                <Text className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-500' : 'text-gray-500'
                                    }`}>
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default BottomNavBar;
