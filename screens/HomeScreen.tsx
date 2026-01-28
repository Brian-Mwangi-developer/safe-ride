import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, color }: {
    title: string;
    value: string;
    icon: string;
    color: string;
}) => (
    <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex-1 mx-2">
        <View className="flex-row items-center justify-between mb-3">
            <View className={`${color} rounded-full p-3`}>
                <Icon name={icon} size={24} color="white" />
            </View>
        </View>
        <Text className="text-gray-600 text-sm mb-1">{title}</Text>
        <Text className="text-gray-900 text-2xl font-bold">{value}</Text>
    </View>
);

// Logo Icon for Header
const LogoIcon = () => (
    <Svg width={32} height={32} viewBox="0 0 48 48">
        <Rect width={48} height={48} rx={12} fill="#3B82F6" />
        <G transform="translate(8, 8)">
            <Path
                d="M4 6h24v2l-2 14H6L4 6zM2 4h2l2 16h16l2-14h2a1 1 0 011 1v16a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z"
                fill="white"
            />
            <Circle cx={8} cy={26} r={2} fill="white" />
            <Circle cx={24} cy={26} r={2} fill="white" />
        </G>
    </Svg>
);

interface HomeScreenProps {
    userRole?: 'operator' | 'driver';
    onRoleChange?: (role: 'operator' | 'driver') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userRole = 'operator', onRoleChange }) => {
    const insets = useSafeAreaInsets();

    const handleRoleToggle = () => {
        const newRole = userRole === 'operator' ? 'driver' : 'operator';
        onRoleChange?.(newRole);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View
                className="bg-white border-b border-gray-200 px-6 pb-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                        <LogoIcon />
                        <View className="ml-3">
                            <Text className="text-2xl font-bold text-gray-900">SafeRide</Text>
                            <Text className="text-sm text-gray-600">Fleet Management</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleRoleToggle}
                        className="bg-blue-100 px-4 py-2 rounded-full flex-row items-center"
                    >
                        <Text className="text-blue-600 font-semibold text-sm capitalize mr-1">
                            {userRole}
                        </Text>
                        <Icon name="swap-horizontal" size={14} color="#3B82F6" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 py-6">
                    {/* Welcome Section */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back! 👋
                        </Text>
                        <Text className="text-gray-600 text-base">
                            Here's what's happening with your fleet today
                        </Text>
                    </View>

                    {/* Stats Cards */}
                    <View className="flex-row mb-6">
                        <DashboardCard
                            title="Total Drivers"
                            value="24"
                            icon="people"
                            color="bg-blue-500"
                        />
                        <DashboardCard
                            title="Active Now"
                            value="18"
                            icon="checkmark-circle"
                            color="bg-green-500"
                        />
                    </View>

                    <View className="flex-row mb-6">
                        <DashboardCard
                            title="Total Vehicles"
                            value="32"
                            icon="bus"
                            color="bg-purple-500"
                        />
                        <DashboardCard
                            title="On Route"
                            value="15"
                            icon="navigation"
                            color="bg-orange-500"
                        />
                    </View>

                    {/* Quick Actions */}
                    <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
                        <View className="space-y-3">
                            <View className="flex-row items-center p-3 bg-blue-50 rounded-xl">
                                <View className="bg-blue-500 rounded-full p-2 mr-4">
                                    <Icon name="add-circle-outline" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-900">Add New Driver</Text>
                                    <Text className="text-sm text-gray-600">Register a new driver to your fleet</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center p-3 bg-green-50 rounded-xl">
                                <View className="bg-green-500 rounded-full p-2 mr-4">
                                    <Icon name="people-outline" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-900">Manage Drivers</Text>
                                    <Text className="text-sm text-gray-600">View and manage your driver fleet</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center p-3 bg-purple-50 rounded-xl">
                                <View className="bg-purple-500 rounded-full p-2 mr-4">
                                    <Icon name="map-outline" size={24} color="white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-900">Track Vehicles</Text>
                                    <Text className="text-sm text-gray-600">Monitor real-time vehicle locations</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Recent Activity</Text>
                        <View className="space-y-4">
                            <View className="flex-row items-start">
                                <View className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-medium">John Kamau started shift</Text>
                                    <Text className="text-sm text-gray-600">5 minutes ago</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-medium">New driver added: Peter Omondi</Text>
                                    <Text className="text-sm text-gray-600">1 hour ago</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <View className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-medium">Route assignment updated</Text>
                                    <Text className="text-sm text-gray-600">3 hours ago</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
