import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AddDriverModal from './AddDriverModal';

interface Driver {
    id: string;
    name: string;
    vehicleReg: string;
    phone: string;
    avatar: string;
}

const DUMMY_DRIVERS: Driver[] = [
    {
        id: '1',
        name: 'John Kamau',
        vehicleReg: 'KBA 123X',
        phone: '+254 712 345 678',
        avatar: 'https://avatar.vercel.sh/john-kamau',
    },
    {
        id: '2',
        name: 'Peter Omondi',
        vehicleReg: 'KCA 456Y',
        phone: '+254 722 987 654',
        avatar: 'https://avatar.vercel.sh/peter-omondi'
    },
    {
        id: '3',
        name: 'Samuel Kiptoo',
        vehicleReg: 'KDD 789Z',
        phone: '+254 733 112 233',
        avatar: 'https://avatar.vercel.sh/samuel-kiptoo'
    },
    {
        id: '4',
        name: 'James Mwangi',
        vehicleReg: 'KBQ 555T',
        phone: '+254 700 999 000',
        avatar: 'https://avatar.vercel.sh/james-mwangi'
    },
    {
        id: '5',
        name: 'Mary Wanjiku',
        vehicleReg: 'KCB 789M',
        phone: '+254 711 222 333',
        avatar: 'https://avatar.vercel.sh/mary-wanjiku'
    },
    {
        id: '6',
        name: 'David Otieno',
        vehicleReg: 'KDA 456N',
        phone: '+254 722 444 555',
        avatar: 'https://avatar.vercel.sh/david-otieno'
    },
];

interface DriverFleetScreenProps {
    userRole?: 'operator' | 'driver';
    onBackPress?: () => void;
    showAddButton?: boolean;
}

const DriverFleetScreen: React.FC<DriverFleetScreenProps> = ({
    userRole = 'operator',
    onBackPress,
    showAddButton = false
}) => {
    const [drivers, setDrivers] = useState<Driver[]>(DUMMY_DRIVERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const insets = useSafeAreaInsets();

    const filteredDrivers = drivers.filter((driver) => {
        const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const handleAddDriver = (newDriver: { name: string; vehicleReg: string; phone: string }) => {
        const driver: Driver = {
            id: Date.now().toString(),
            name: newDriver.name,
            vehicleReg: newDriver.vehicleReg,
            phone: newDriver.phone,
            avatar: `https://avatar.vercel.sh/${newDriver.name.toLowerCase().replace(' ', '-')}`
        };
        setDrivers([driver, ...drivers]);
        setShowAddModal(false);
    };

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
                    {showAddButton && userRole === 'operator' && (
                        <TouchableOpacity
                            onPress={() => setShowAddModal(true)}
                            className="bg-blue-500 rounded-full p-3 shadow-sm"
                        >
                            <Icon name="add" size={24} color="white" />
                        </TouchableOpacity>
                    )}
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

            {/* Driver List */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-4 space-y-4">
                    {filteredDrivers.map((driver) => (
                        <View
                            key={driver.id}
                            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                        >
                            <View className="flex-row items-start">
                                <Image
                                    source={{ uri: driver.avatar }}
                                    className="w-16 h-16 rounded-full"
                                />

                                <View className="flex-1 ml-4">
                                    <Text className="text-lg font-semibold text-gray-900 mb-2">
                                        {driver.name}
                                    </Text>

                                    <View className="flex-row items-center mb-2">
                                        <Icon name="car" size={16} color="#6B7280" />
                                        <Text className="text-gray-600 ml-2">
                                            {driver.vehicleReg}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center mb-4">
                                        <Icon name="call" size={16} color="#6B7280" />
                                        <Text className="text-gray-600 ml-2">
                                            {driver.phone}
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

                                <TouchableOpacity className="p-2 -mt-2 -mr-2">
                                    <Icon name="location" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Add Driver Modal */}
            {userRole === 'operator' && (
                <AddDriverModal
                    visible={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAddDriver={handleAddDriver}
                />
            )}
        </View>
    );
};

export default DriverFleetScreen;