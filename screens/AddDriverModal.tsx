import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Clipboard,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { VERIFICATION_LINK_PREFIX } from '../constants/config';
import { Driver, driverService } from '../services/driverService';

interface AddDriverModalProps {
    visible: boolean;
    onClose: () => void;
    onAddDriver: (driver: Driver, verificationLink: string) => void;
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
    const [isLoading, setIsLoading] = useState(false);
    const [createdDriver, setCreatedDriver] = useState<Driver | null>(null);
    const [verificationLink, setVerificationLink] = useState<string>('');
    const insets = useSafeAreaInsets();

    const resetForm = () => {
        setFormData({ name: '', phone: '', vehicleReg: '' });
        setCreatedDriver(null);
        setVerificationLink('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.vehicleReg.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // Create driver in backend
            const driver = await driverService.createDriver({
                name: formData.name.trim(),
                phoneNumber: formData.phone.trim(),
                carReg: formData.vehicleReg.trim(),
            });

            // Generate verification link
            const link = `${VERIFICATION_LINK_PREFIX}${driver.session}`;

            setCreatedDriver(driver);
            setVerificationLink(link);

        } catch (error) {
            console.error('Error creating driver:', error);
            Alert.alert(
                'Error',
                'Failed to register driver. Please check your connection and try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = () => {
        Clipboard.setString(verificationLink);
        Alert.alert('Copied!', 'Verification link copied to clipboard. Share it with the driver.');
    };

    const handleDone = () => {
        if (createdDriver) {
            onAddDriver(createdDriver, verificationLink);
        }
        resetForm();
    };

    // Show success screen after driver is created
    if (createdDriver) {
        return (
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleClose}
            >
                <View className="flex-1 bg-white">
                    {/* Header */}
                    <View
                        className="bg-white border-b border-gray-200 px-6 pb-4"
                        style={{ paddingTop: insets.top + 16 }}
                    >
                        <View className="flex-row items-center justify-between">
                            <View style={{ width: 60 }} />
                            <Text className="text-xl font-semibold text-gray-900">
                                Driver Registered
                            </Text>
                            <TouchableOpacity onPress={handleDone}>
                                <Text className="text-blue-500 text-lg font-medium">Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        className="flex-1 bg-white"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        <View className="px-6 py-8">
                            {/* Success Icon */}
                            <View className="items-center mb-6">
                                <View className="bg-green-100 rounded-full p-6">
                                    <Icon name="checkmark-circle" size={64} color="#10B981" />
                                </View>
                                <Text className="text-2xl font-bold text-gray-900 mt-4">
                                    Success!
                                </Text>
                                <Text className="text-gray-600 text-center mt-2">
                                    Driver has been registered in the system
                                </Text>
                            </View>

                            {/* Driver Info Card */}
                            <View className="bg-gray-50 rounded-2xl p-5 mb-6">
                                <Text className="text-gray-500 text-sm mb-3">DRIVER DETAILS</Text>
                                <View className="space-y-3">
                                    <View className="flex-row items-center">
                                        <Icon name="person" size={20} color="#6B7280" />
                                        <Text className="text-gray-900 ml-3 text-base">
                                            {createdDriver.name}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Icon name="call" size={20} color="#6B7280" />
                                        <Text className="text-gray-900 ml-3 text-base">
                                            {createdDriver.phoneNumber}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Icon name="car" size={20} color="#6B7280" />
                                        <Text className="text-gray-900 ml-3 text-base">
                                            {createdDriver.carReg}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Verification Link Card */}
                            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                                <View className="flex-row items-center mb-3">
                                    <Icon name="link" size={20} color="#3B82F6" />
                                    <Text className="text-blue-800 font-semibold ml-2">
                                        Verification Link
                                    </Text>
                                </View>
                                <Text className="text-gray-600 text-sm mb-4">
                                    Share this link with the driver so they can verify their account in the app.
                                </Text>

                                <View className="bg-white rounded-xl p-4 border border-blue-200">
                                    <Text className="text-gray-800 text-sm font-mono" selectable>
                                        {verificationLink}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={handleCopyLink}
                                    className="bg-blue-500 rounded-xl py-3 flex-row items-center justify-center mt-4"
                                >
                                    <Icon name="copy" size={18} color="white" />
                                    <Text className="text-white font-semibold ml-2">
                                        Copy Link
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Instructions */}
                            <View className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <Icon name="warning" size={24} color="#F59E0B" />
                                    <View className="flex-1 ml-3">
                                        <Text className="text-orange-800 font-medium">
                                            Important
                                        </Text>
                                        <Text className="text-orange-700 text-sm mt-1 leading-5">
                                            The driver must:{'\n'}
                                            1. Open SafeRide app{'\n'}
                                            2. Select "Driver" role{'\n'}
                                            3. Enter their name and phone{'\n'}
                                            4. Paste this verification link{'\n'}
                                            5. Allow location access
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-white">
                {/* Header */}
                <View
                    className="bg-white border-b border-gray-200 px-6 pb-4"
                    style={{ paddingTop: insets.top + 16 }}
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity onPress={handleClose}>
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
                                    editable={!isLoading}
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
                                    placeholder="+254712345678"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    editable={!isLoading}
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
                                    editable={!isLoading}
                                />
                                <Icon name="car" size={20} color="#9CA3AF" />
                            </View>
                        </View>

                        {/* Info Message */}
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <Text className="text-blue-700 text-center leading-5">
                                A verification link will be generated after registration. Share it with the driver to complete their setup.
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
                        disabled={isLoading}
                        className={`rounded-xl py-4 flex-row items-center justify-center ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
                        style={{
                            shadowColor: '#3B82F6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        {isLoading ? (
                            <>
                                <ActivityIndicator color="white" size="small" />
                                <Text className="text-white font-semibold text-lg ml-2">
                                    Registering...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Icon name="add" size={20} color="white" />
                                <Text className="text-white font-semibold text-lg ml-2">
                                    Register Driver
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddDriverModal;