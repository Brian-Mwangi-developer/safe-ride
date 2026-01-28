import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

interface Driver {
    name: string;
    vehicleReg: string;
    phone: string;
}

interface AddDriverModalProps {
    visible: boolean;
    onClose: () => void;
    onAddDriver: (driver: Driver) => void;
}

// Camera Upload Icon
const CameraUploadIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={35} fill="none" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="4 4" />
        <Path
            d="M32 30h16l2-4h8a4 4 0 014 4v20a4 4 0 01-4 4H22a4 4 0 01-4-4V30a4 4 0 014-4h8l2 4z"
            fill="#D1D5DB"
        />
        <Circle cx={40} cy={40} r={8} fill="#9CA3AF" />
        <Circle cx={56} cy={54} r={12} fill="#3B82F6" />
        <Path d="M50 54h12M56 48v12" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

const AddDriverModal: React.FC<AddDriverModalProps> = ({
    visible,
    onClose,
    onAddDriver,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        vehicleReg: '',
    });
    const insets = useSafeAreaInsets();

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.vehicleReg.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newDriver: Driver = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            vehicleReg: formData.vehicleReg.trim(),
        };

        onAddDriver(newDriver);

        // Reset form
        setFormData({
            name: '',
            phone: '',
            vehicleReg: '',
        });

        Alert.alert('Success', 'Driver added successfully! They will receive their login credentials via SMS.');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white">
                {/* Header */}
                <View
                    className="bg-white border-b border-gray-200 px-6 pb-4"
                    style={{ paddingTop: insets.top + 16 }}
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-blue-500 text-lg font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold text-gray-900">
                            Add New Driver
                        </Text>
                        <View style={{ width: 60 }} />
                    </View>
                </View>

                <ScrollView
                    className="flex-1 bg-white"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View className="px-6 py-6">
                        {/* Photo Upload */}
                        <View className="items-center mb-8">
                            <TouchableOpacity className="items-center">
                                <CameraUploadIcon />
                                <Text className="text-blue-500 font-medium text-lg mt-4">
                                    Upload Photo
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Full Name */}
                        <View className="mb-6">
                            <Text className="text-gray-900 font-medium mb-3 text-base">
                                Full Name
                            </Text>
                            <View className="bg-gray-100 rounded-xl px-4 py-4 flex-row items-center">
                                <TextInput
                                    className="flex-1 text-gray-900 text-base"
                                    placeholder="e.g. John Kamau"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                />
                                <Icon name="person" size={20} color="#9CA3AF" />
                            </View>
                        </View>

                        {/* Phone Number */}
                        <View className="mb-6">
                            <Text className="text-gray-900 font-medium mb-3 text-base">
                                Phone Number
                            </Text>
                            <View className="bg-gray-100 rounded-xl px-4 py-4 flex-row items-center">
                                <TextInput
                                    className="flex-1 text-gray-900 text-base"
                                    placeholder="07..."
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                />
                                <Icon name="call" size={20} color="#9CA3AF" />
                            </View>
                        </View>

                        {/* Vehicle Registration */}
                        <View className="mb-8">
                            <Text className="text-gray-900 font-medium mb-3 text-base">
                                Vehicle Registration
                            </Text>
                            <View className="bg-gray-100 rounded-xl px-4 py-4 flex-row items-center">
                                <TextInput
                                    className="flex-1 text-gray-900 text-base"
                                    placeholder="KBA 123C"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="characters"
                                    value={formData.vehicleReg}
                                    onChangeText={(text) => setFormData({ ...formData, vehicleReg: text })}
                                />
                                <Icon name="car" size={20} color="#9CA3AF" />
                            </View>
                        </View>

                        {/* Info Message */}
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <Text className="text-blue-700 text-center leading-5">
                                Driver will receive an SMS with their login credentials upon registration.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <View
                    className="px-6 pt-4 bg-white border-t border-gray-100"
                    style={{ paddingBottom: insets.bottom + 16 }}
                >
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-blue-500 rounded-xl py-4 flex-row items-center justify-center"
                        style={{
                            shadowColor: '#3B82F6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <Icon name="add" size={20} color="white" />
                        <Text className="text-white font-semibold text-lg ml-2">
                            Add Driver
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddDriverModal;