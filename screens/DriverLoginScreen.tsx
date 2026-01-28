import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { STORAGE_KEYS, VERIFICATION_LINK_PREFIX } from '../constants/config';
import { Driver, driverService } from '../services/driverService';

// Logo Icon
const LogoIcon = () => (
    <Svg width={64} height={64} viewBox="0 0 48 48">
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

interface DriverLoginScreenProps {
    onVerificationSuccess: (driver: Driver) => void;
    onBackPress: () => void;
}

const DriverLoginScreen: React.FC<DriverLoginScreenProps> = ({
    onVerificationSuccess,
    onBackPress,
}) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationLink, setVerificationLink] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const requestLocationPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'SafeRide needs access to your location to track your vehicle.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // iOS handles permissions differently
    };

    const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve, _reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Default to Nairobi if location fails
                    resolve({ latitude: -1.2921, longitude: 36.8219 });
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    };

    const extractSessionFromLink = (link: string): string | null => {
        // Handle both full link format and just the session code
        if (link.startsWith(VERIFICATION_LINK_PREFIX)) {
            return link.replace(VERIFICATION_LINK_PREFIX, '').trim();
        }
        // If user just pasted the session code directly
        if (link.length === 8 && /^[a-z0-9]+$/i.test(link)) {
            return link.trim();
        }
        return null;
    };

    const handleVerify = async () => {
        // Validate inputs
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }
        if (!verificationLink.trim()) {
            Alert.alert('Error', 'Please paste your verification link');
            return;
        }

        const session = extractSessionFromLink(verificationLink.trim());
        if (!session) {
            Alert.alert('Error', 'Invalid verification link format');
            return;
        }

        setIsLoading(true);

        try {
            // Verify driver with backend
            const driver = await driverService.verifyDriverBySession(
                session,
                name.trim(),
                phoneNumber.trim()
            );

            if (!driver) {
                Alert.alert(
                    'Verification Failed',
                    'Could not verify your credentials. Please check your name, phone number, and verification link.'
                );
                setIsLoading(false);
                return;
            }

            // Request location permission
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                Alert.alert(
                    'Location Required',
                    'Location permission is required to use the app as a driver.'
                );
                setIsLoading(false);
                return;
            }

            // Get current location
            const location = await getCurrentLocation();

            // Update driver location in backend
            await driverService.updateDriverLocation(driver.id, location.latitude, location.longitude);

            // Store verified status in AsyncStorage
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.DRIVER_VERIFIED, 'true'],
                [STORAGE_KEYS.DRIVER_SESSION, session],
                [STORAGE_KEYS.DRIVER_ID, driver.id.toString()],
                [STORAGE_KEYS.DRIVER_DATA, JSON.stringify({
                    ...driver,
                    latitude: location.latitude,
                    longitude: location.longitude,
                })],
            ]);

            Alert.alert(
                'Verification Successful!',
                'Welcome to SafeRide. Your location is now being shared.',
                [{ text: 'Continue', onPress: () => onVerificationSuccess(driver) }]
            );
        } catch (error) {
            console.error('Verification error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Header */}
            <View
                className="bg-white border-b border-gray-200 px-6 pb-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={onBackPress} className="mr-4">
                        <Icon name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Driver Login</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View className="px-6 py-8">
                    {/* Logo Section */}
                    <View className="items-center mb-8">
                        <LogoIcon />
                        <Text className="text-2xl font-bold text-gray-900 mt-4">
                            SafeRide Driver
                        </Text>
                        <Text className="text-gray-600 text-center mt-2">
                            Enter your details and verification link to get started
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-5">
                        {/* Name Input */}
                        <View>
                            <Text className="text-gray-900 font-medium mb-2">Full Name</Text>
                            <View className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center">
                                <Icon name="person-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Phone Number Input */}
                        <View>
                            <Text className="text-gray-900 font-medium mb-2">Phone Number</Text>
                            <View className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center">
                                <Icon name="call-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                    placeholder="e.g. +254712345678"
                                    placeholderTextColor="#9CA3AF"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Verification Link Input */}
                        <View>
                            <Text className="text-gray-900 font-medium mb-2">
                                Verification Link
                            </Text>
                            <View className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex-row items-center">
                                <Icon name="link-outline" size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 text-base"
                                    placeholder="Paste your verification link"
                                    placeholderTextColor="#9CA3AF"
                                    value={verificationLink}
                                    onChangeText={setVerificationLink}
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text className="text-gray-500 text-sm mt-2">
                                Get this link from your fleet operator
                            </Text>
                        </View>

                        {/* Info Card */}
                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                            <View className="flex-row items-start">
                                <Icon name="information-circle" size={24} color="#3B82F6" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-blue-800 font-medium">
                                        How it works
                                    </Text>
                                    <Text className="text-blue-700 text-sm mt-1 leading-5">
                                        1. Your operator registers you in the system{'\n'}
                                        2. They share a unique verification link{'\n'}
                                        3. Enter your details and paste the link{'\n'}
                                        4. Allow location access for tracking
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Verify Button */}
            <View
                className="px-6 pt-4 bg-white border-t border-gray-100"
                style={{ paddingBottom: insets.bottom + 16 }}
            >
                <TouchableOpacity
                    onPress={handleVerify}
                    disabled={isLoading}
                    className={`rounded-xl py-4 flex-row items-center justify-center ${isLoading ? 'bg-blue-300' : 'bg-blue-500'
                        }`}
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
                                Verifying...
                            </Text>
                        </>
                    ) : (
                        <>
                            <Icon name="checkmark-circle" size={20} color="white" />
                            <Text className="text-white font-semibold text-lg ml-2">
                                Verify & Continue
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DriverLoginScreen;
