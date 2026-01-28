import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

// Logo SVG Component
const LogoIcon = () => (
    <Svg width={48} height={48} viewBox="0 0 48 48">
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

// Dashboard/Analytics SVG Icon for Operator
const DashboardIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={35} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} />
        <G transform="translate(20, 20)">
            <Rect x={4} y={8} width={32} height={24} rx={2} fill="#3B82F6" opacity={0.1} />
            <Path
                d="M6 10h28a2 2 0 012 2v20a2 2 0 01-2 2H6a2 2 0 01-2-2V12a2 2 0 012-2z"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
            />
            <Path
                d="M8 16l6 4 4-2 6 3 4-2"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8 24l4 2 4-3 6 2 6-1"
                stroke="#1D4ED8"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle cx={8} cy={16} r={2} fill="#3B82F6" />
            <Circle cx={14} cy={20} r={2} fill="#3B82F6" />
            <Circle cx={18} cy={18} r={2} fill="#3B82F6" />
        </G>
    </Svg>
);

// Road/Driving SVG Icon for Driver
const RoadIcon = () => (
    <Svg width={80} height={80} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={35} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={2} />
        <G transform="translate(15, 20)">
            {/* Road */}
            <Path
                d="M5 40C5 25 15 5 25 5s20 20 20 35"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="none"
            />
            {/* Road lines */}
            <Path
                d="M24 8v4M24 16v4M24 24v4M24 32v4"
                stroke="#1D4ED8"
                strokeWidth={2}
                strokeLinecap="round"
            />
            {/* Car */}
            <G transform="translate(20, 30)">
                <Rect x={0} y={4} width={12} height={6} rx={1} fill="#3B82F6" />
                <Rect x={2} y={2} width={8} height={4} rx={1} fill="#1D4ED8" />
                <Circle cx={2} cy={12} r={2} fill="#374151" />
                <Circle cx={10} cy={12} r={2} fill="#374151" />
            </G>
        </G>
    </Svg>
);

// Arrow Right Icon
const ArrowRightIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Path
            d="M7.5 15l5-5-5-5"
            stroke="currentColor"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

interface WelcomeScreenProps {
    onOperatorPress?: () => void;
    onDriverPress?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    onOperatorPress,
    onDriverPress,
}) => {
    const [testingMode, setTestingMode] = useState(false);
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingBottom: insets.bottom + 20,
                    paddingHorizontal: 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="items-center mb-12">
                    <LogoIcon />
                    <Text className="text-2xl font-bold text-gray-900 mt-4">
                        SafeRide
                    </Text>
                    <Text className="text-base text-gray-600 text-center mt-2 leading-6">
                        Fleet management made simple
                    </Text>
                </View>

                {/* Welcome Title */}
                <View className="mb-12">
                    <Text className="text-3xl font-bold text-gray-900 text-center">
                        Welcome Back
                    </Text>
                    <Text className="text-base text-gray-600 text-center mt-3 leading-6">
                        Please select your role to continue to your dashboard.
                    </Text>
                </View>

                {/* Role Selection Cards */}
                <View className="space-y-6">
                    {/* Operator Card */}
                    <TouchableOpacity
                        onPress={onOperatorPress}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 active:scale-[0.98]"
                        activeOpacity={0.85}
                        style={{
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        }}
                    >
                        <View className="items-center mb-6">
                            <DashboardIcon />
                        </View>
                        <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
                            I am an Operator
                        </Text>
                        <Text className="text-gray-600 text-center mb-6 leading-5">
                            Manage fleet, monitor congestion, and analyze reports.
                        </Text>
                        <View className="bg-blue-500 rounded-xl py-4 px-6 flex-row items-center justify-center shadow-sm">
                            <Text className="text-white font-semibold text-base mr-2">
                                Access Dashboard
                            </Text>
                            <View className="text-white">
                                <ArrowRightIcon />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Driver Card */}
                    <TouchableOpacity
                        onPress={onDriverPress}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 active:scale-[0.98]"
                        activeOpacity={0.85}
                        style={{
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        }}
                    >
                        <View className="items-center mb-6">
                            <RoadIcon />
                        </View>
                        <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
                            I am a Driver
                        </Text>
                        <Text className="text-gray-600 text-center mb-6 leading-5">
                            View assigned routes, schedules, and traffic updates.
                        </Text>
                        <View className="bg-blue-500 rounded-xl py-4 px-6 flex-row items-center justify-center shadow-sm">
                            <Text className="text-white font-semibold text-base mr-2">
                                Start Shift
                            </Text>
                            <View className="text-white">
                                <ArrowRightIcon />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Testing Mode Toggle */}
                <View className="mt-12 pt-8 border-t border-gray-200">
                    <View className="flex-row items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center mr-3">
                                <Svg width={16} height={16} viewBox="0 0 16 16">
                                    <Path
                                        d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 3a1 1 0 011 1v4a1 1 0 01-2 0V4a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                        fill="#3B82F6"
                                    />
                                </Svg>
                            </View>
                            <View>
                                <Text className="font-medium text-gray-900">Testing Mode</Text>
                                <Text className="text-sm text-gray-600">
                                    Quick role switcher enabled
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={testingMode}
                            onValueChange={setTestingMode}
                            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                            thumbColor={testingMode ? '#3B82F6' : '#F3F4F6'}
                            ios_backgroundColor="#E5E7EB"
                        />
                    </View>
                </View>

                {/* Version Info */}
                <View className="mt-8 items-center">
                    <Text className="text-sm text-gray-500">
                        © 2026 SafeRide Inc. v1.0.4 (Build 202)
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default WelcomeScreen;