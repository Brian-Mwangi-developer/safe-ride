import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Driver, driverService } from '../services/driverService';

interface DriverFleetScreenProps {
    userRole?: 'operator' | 'driver';
    onBackPress?: () => void;
    showAddButton?: boolean;
}

const DriverFleetScreen: React.FC<DriverFleetScreenProps> = ({
    userRole: _userRole = 'operator',
    onBackPress,
    showAddButton: _showAddButton = false,
}) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    const fetchDrivers = useCallback(async () => {
        try {
            setError(null);
            const fetchedDrivers = await driverService.getDrivers();
            setDrivers(fetchedDrivers);
        } catch (err) {
            console.error('Error fetching drivers:', err);
            setError('Failed to load drivers. Please check your connection.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchDrivers();
    }, [fetchDrivers]);

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch =
            driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.carReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phoneNumber.includes(searchQuery);
        return matchesSearch;
    });

    const getAvatarUrl = (name: string) => {
        return `https://avatar.vercel.sh/${name.toLowerCase().replace(/\s+/g, '-')}`;
    };

    const getVerificationStatus = (driver: Driver) => {
        // If driver has real coordinates (not default 0,0), they are verified
        return driver.latitude !== 0 || driver.longitude !== 0;
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-600 mt-4">Loading drivers...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View
                className="bg-white border-b border-gray-200 px-6 pb-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <View className="flex-row items-center justify-between mb-4">
                    {onBackPress && (
                        <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2">
                            <Icon name="arrow-back" size={24} color="#374151" />
                        </TouchableOpacity>
                    )}
                    <Text className="text-2xl font-bold text-gray-900 flex-1">
                        Drivers
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-gray-500 text-sm mr-2">
                            {drivers.length} total
                        </Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
                    <Icon name="search" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-3 text-gray-900 text-base"
                        placeholder="Search drivers or vehicles..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Error State */}
            {error && (
                <View className="px-6 py-4">
                    <View className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center">
                        <Icon name="alert-circle" size={24} color="#EF4444" />
                        <Text className="text-red-700 ml-3 flex-1">{error}</Text>
                        <TouchableOpacity onPress={fetchDrivers}>
                            <Icon name="refresh" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Empty State */}
            {!error && drivers.length === 0 && (
                <View className="flex-1 items-center justify-center px-6">
                    <View className="bg-gray-100 rounded-full p-6 mb-4">
                        <Icon name="people-outline" size={64} color="#9CA3AF" />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        No Drivers Yet
                    </Text>
                    <Text className="text-gray-600 text-center">
                        Add your first driver using the "Add Driver" tab to get started.
                    </Text>
                </View>
            )}

            {/* Driver List */}
            {drivers.length > 0 && (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={['#3B82F6']}
                            tintColor="#3B82F6"
                        />
                    }
                >
                    <View className="px-6 py-4 space-y-4">
                        {filteredDrivers.length === 0 ? (
                            <View className="items-center py-8">
                                <Icon name="search" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 mt-2">
                                    No drivers match your search
                                </Text>
                            </View>
                        ) : (
                            filteredDrivers.map((driver) => {
                                const isVerified = getVerificationStatus(driver);
                                return (
                                    <View
                                        key={driver.id}
                                        className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                                    >
                                        <View className="flex-row items-start">
                                            <Image
                                                source={{ uri: getAvatarUrl(driver.name) }}
                                                className="w-16 h-16 rounded-full"
                                            />

                                            <View className="flex-1 ml-4">
                                                <View className="flex-row items-center mb-1">
                                                    <Text className="text-lg font-semibold text-gray-900">
                                                        {driver.name}
                                                    </Text>
                                                    {isVerified ? (
                                                        <View className="bg-green-100 px-2 py-1 rounded-full ml-2 flex-row items-center">
                                                            <Icon name="checkmark-circle" size={12} color="#10B981" />
                                                            <Text className="text-green-700 text-xs ml-1">Verified</Text>
                                                        </View>
                                                    ) : (
                                                        <View className="bg-orange-100 px-2 py-1 rounded-full ml-2 flex-row items-center">
                                                            <Icon name="time" size={12} color="#F59E0B" />
                                                            <Text className="text-orange-700 text-xs ml-1">Pending</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View className="flex-row items-center mb-2">
                                                    <Icon name="car" size={16} color="#6B7280" />
                                                    <Text className="text-gray-600 ml-2">
                                                        {driver.carReg}
                                                    </Text>
                                                </View>

                                                <View className="flex-row items-center mb-4">
                                                    <Icon name="call" size={16} color="#6B7280" />
                                                    <Text className="text-gray-600 ml-2">
                                                        {driver.phoneNumber}
                                                    </Text>
                                                </View>

                                                <View className="flex-row space-x-3">
                                                    <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center">
                                                        <Icon name="call" size={16} color="white" />
                                                        <Text className="text-white font-medium ml-2">Call</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity className="flex-1 bg-gray-200 rounded-xl py-3 flex-row items-center justify-center">
                                                        <Icon name="chatbubble" size={16} color="#374151" />
                                                        <Text className="text-gray-700 font-medium ml-2">Message</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                className="p-2 -mt-2 -mr-2"
                                                disabled={!isVerified}
                                            >
                                                <Icon
                                                    name="location"
                                                    size={24}
                                                    color={isVerified ? "#3B82F6" : "#D1D5DB"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default DriverFleetScreen;