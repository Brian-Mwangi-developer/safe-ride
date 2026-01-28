import React, { useRef, useState } from 'react';
import {
    Dimensions,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Real Nairobi coordinates for drivers
interface DriverLocation {
    id: string;
    name: string;
    vehicleReg: string;
    latitude: number;
    longitude: number;
    status: 'active' | 'idle' | 'offline';
}

const DRIVER_LOCATIONS: DriverLocation[] = [
    {
        id: '1',
        name: 'John Kamau',
        vehicleReg: 'KBA 123X',
        latitude: -1.2864,  // Westlands
        longitude: 36.8172,
        status: 'active',
    },
    {
        id: '2',
        name: 'Peter Omondi',
        vehicleReg: 'KCA 456Y',
        latitude: -1.2921,  // CBD
        longitude: 36.8219,
        status: 'active',
    },
    {
        id: '3',
        name: 'Samuel Kiptoo',
        vehicleReg: 'KDD 789Z',
        latitude: -1.2634,  // Parklands
        longitude: 36.8178,
        status: 'idle',
    },
    {
        id: '4',
        name: 'James Mwangi',
        vehicleReg: 'KBQ 555T',
        latitude: -1.2177,  // Garden City
        longitude: 36.8849,
        status: 'active',
    },
    {
        id: '5',
        name: 'Mary Wanjiku',
        vehicleReg: 'KCB 789M',
        latitude: -1.1867,  // Kasarani
        longitude: 36.8983,
        status: 'active',
    },
    {
        id: '6',
        name: 'David Otieno',
        vehicleReg: 'KDA 456N',
        latitude: -1.0532,  // Near Thika
        longitude: 37.0612,
        status: 'active',
    },
];

// Route from Nairobi CBD to Thika (simplified waypoints along Thika Road)
const NAIROBI_TO_THIKA_ROUTE = [
    { latitude: -1.2921, longitude: 36.8219 },  // Nairobi CBD
    { latitude: -1.2785, longitude: 36.8281 },  // Ngara
    { latitude: -1.2654, longitude: 36.8356 },  // Pangani
    { latitude: -1.2489, longitude: 36.8521 },  // Muthaiga
    { latitude: -1.2287, longitude: 36.8723 },  // Roysambu
    { latitude: -1.2177, longitude: 36.8849 },  // Garden City
    { latitude: -1.1867, longitude: 36.8983 },  // Kasarani
    { latitude: -1.1534, longitude: 36.9287 },  // Ruiru
    { latitude: -1.1123, longitude: 36.9678 },  // Juja
    { latitude: -1.0789, longitude: 37.0123 },  // Before Thika
    { latitude: -1.0333, longitude: 37.0693 },  // Thika Town
];

interface MapsScreenProps {
    userRole?: 'operator' | 'driver';
}

const MapsScreen: React.FC<MapsScreenProps> = ({ userRole: _userRole = 'operator' }) => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDriver, setSelectedDriver] = useState<DriverLocation | null>(null);

    // Initial region centered on Nairobi
    const initialRegion: Region = {
        latitude: -1.2200,
        longitude: 36.9200,
        latitudeDelta: 0.35,
        longitudeDelta: 0.35,
    };

    const getMarkerColor = (status: DriverLocation['status']) => {
        switch (status) {
            case 'active':
                return '#10B981'; // Green
            case 'idle':
                return '#F59E0B'; // Orange
            case 'offline':
                return '#EF4444'; // Red
            default:
                return '#3B82F6'; // Blue
        }
    };

    const handleZoomIn = () => {
        mapRef.current?.getCamera().then(camera => {
            if (camera.zoom !== undefined) {
                mapRef.current?.animateCamera({
                    ...camera,
                    zoom: camera.zoom + 1,
                });
            }
        });
    };

    const handleZoomOut = () => {
        mapRef.current?.getCamera().then(camera => {
            if (camera.zoom !== undefined) {
                mapRef.current?.animateCamera({
                    ...camera,
                    zoom: camera.zoom - 1,
                });
            }
        });
    };

    const handleMyLocation = () => {
        mapRef.current?.animateToRegion({
            latitude: -1.2921,
            longitude: 36.8219,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
    };

    const handleShowFullRoute = () => {
        mapRef.current?.fitToCoordinates(NAIROBI_TO_THIKA_ROUTE, {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
        });
    };

    const filteredDrivers = DRIVER_LOCATIONS.filter(driver =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Map */}
            <MapView
                ref={mapRef}
                style={{ width, height }}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                mapType="standard"
            >
                {/* Route Polyline from Nairobi to Thika */}
                <Polyline
                    coordinates={NAIROBI_TO_THIKA_ROUTE}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                    lineDashPattern={[0]}
                />

                {/* Start Marker - Nairobi CBD */}
                <Marker
                    coordinate={{ latitude: -1.2921, longitude: 36.8219 }}
                    title="Start: Nairobi CBD"
                    description="Route starting point"
                >
                    <View className="items-center">
                        <View className="bg-green-500 rounded-full p-2">
                            <Icon name="flag" size={16} color="white" />
                        </View>
                    </View>
                </Marker>

                {/* End Marker - Thika Town */}
                <Marker
                    coordinate={{ latitude: -1.0333, longitude: 37.0693 }}
                    title="End: Thika Town"
                    description="Route destination"
                >
                    <View className="items-center">
                        <View className="bg-red-500 rounded-full p-2">
                            <Icon name="location" size={16} color="white" />
                        </View>
                    </View>
                </Marker>

                {/* Driver Markers */}
                {filteredDrivers.map((driver) => (
                    <Marker
                        key={driver.id}
                        coordinate={{
                            latitude: driver.latitude,
                            longitude: driver.longitude,
                        }}
                        title={driver.name}
                        description={`${driver.vehicleReg} • ${driver.status}`}
                        onPress={() => setSelectedDriver(driver)}
                    >
                        <View className="items-center">
                            <View
                                style={{
                                    backgroundColor: getMarkerColor(driver.status),
                                    padding: 8,
                                    borderRadius: 20,
                                    borderWidth: 3,
                                    borderColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }}
                            >
                                <Icon name="car" size={16} color="white" />
                            </View>
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Header Overlay */}
            <View
                className="absolute left-0 right-0 px-4"
                style={{ top: insets.top + 10 }}
            >
                <View className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    {/* Title */}
                    <View className="px-4 py-3 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-900">Fleet Tracking</Text>
                        <Text className="text-sm text-gray-600">
                            {filteredDrivers.length} vehicles • Nairobi - Thika Route
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <View className="px-4 py-3">
                        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                            <Icon name="search" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-gray-900 text-base"
                                placeholder="Search drivers or vehicles..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Icon name="close-circle" size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Map Controls */}
            <View
                className="absolute right-4"
                style={{ top: insets.top + 160 }}
            >
                <View className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <TouchableOpacity
                        onPress={handleZoomIn}
                        className="p-3 border-b border-gray-200"
                    >
                        <Icon name="add" size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleZoomOut}
                        className="p-3"
                    >
                        <Icon name="remove" size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleMyLocation}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 mt-3"
                >
                    <Icon name="locate" size={24} color="#3B82F6" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleShowFullRoute}
                    className="bg-blue-500 rounded-xl shadow-lg p-3 mt-3"
                >
                    <Icon name="navigate" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Selected Driver Info Card */}
            {selectedDriver && (
                <View
                    className="absolute left-4 right-4"
                    style={{ bottom: 100 }}
                >
                    <View className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View
                                    style={{
                                        backgroundColor: getMarkerColor(selectedDriver.status),
                                        padding: 12,
                                        borderRadius: 12,
                                    }}
                                >
                                    <Icon name="car" size={24} color="white" />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="text-lg font-bold text-gray-900">
                                        {selectedDriver.name}
                                    </Text>
                                    <Text className="text-gray-600">
                                        {selectedDriver.vehicleReg}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <View
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: getMarkerColor(selectedDriver.status),
                                                marginRight: 6,
                                            }}
                                        />
                                        <Text className="text-sm text-gray-600 capitalize">
                                            {selectedDriver.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setSelectedDriver(null)}
                                className="bg-gray-100 rounded-full p-2"
                            >
                                <Icon name="close" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <View className="flex-row mt-4 space-x-3">
                            <TouchableOpacity className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center">
                                <Icon name="call" size={18} color="white" />
                                <Text className="text-white font-semibold ml-2">Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-gray-100 rounded-xl py-3 flex-row items-center justify-center">
                                <Icon name="navigate" size={18} color="#374151" />
                                <Text className="text-gray-700 font-semibold ml-2">Directions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Legend */}
            <View
                className="absolute left-4"
                style={{ bottom: 100 }}
            >
                {!selectedDriver && (
                    <View className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
                        <Text className="text-xs font-semibold text-gray-700 mb-2">Status</Text>
                        <View className="space-y-1">
                            <View className="flex-row items-center">
                                <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                <Text className="text-xs text-gray-600">Active</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                                <Text className="text-xs text-gray-600">Idle</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                                <Text className="text-xs text-gray-600">Offline</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default MapsScreen;
