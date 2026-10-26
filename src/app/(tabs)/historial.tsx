import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { useHistorialViewModel } from '../../viewmodels/useHistorialViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistorialScreen() {
    const { 
        historial, 
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        totalEntregas, 
        totalDinero, 
        isLoading, 
        isRefreshing, 
        error, 
        onRefresh 
    } = useHistorialViewModel();

    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showFinPicker, setShowFinPicker] = useState(false);

    const onValueChangeInicio = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
        if (selectedDate) setFechaInicio(selectedDate);
        if (Platform.OS !== 'ios') setShowInicioPicker(false);
    };

    const onValueChangeFin = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
        if (selectedDate) setFechaFin(selectedDate);
        if (Platform.OS !== 'ios') setShowFinPicker(false);
    };

    const renderPedido = ({ item }: { item: any }) => {
        return (
            <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
                {/* Header Row */}
                <View className="flex-row justify-between items-center mb-1">
                    <View className="flex-row items-center">
                        <Text className="text-base font-extrabold text-slate-800 mr-2">
                            Pedido #{item.id_pedido}
                        </Text>
                        <View className="bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex-row items-center">
                            <MaterialCommunityIcons name="check" size={12} color="#10B981" style={{ marginRight: 2 }} />
                            <Text className="text-emerald-700 font-bold text-xs">Cobrado</Text>
                        </View>
                    </View>

                    {/* Total Amount Pill */}
                    <View className="bg-blue-50 px-3 py-1 rounded-xl">
                        <Text className="text-[#0038FF] font-extrabold text-xs">
                            ${Number(item.total || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Customer Name */}
                <Text className="text-slate-700 text-xs font-bold mt-1 mb-3">
                    {item.nombre_cliente || 'Cliente'}
                </Text>

                {/* Address Row */}
                <View className="flex-row items-center mb-2">
                    <View className="w-7 h-7 rounded-full bg-rose-50 items-center justify-center mr-2.5">
                        <MaterialCommunityIcons name="map-marker-outline" size={15} color="#F43F5E" />
                    </View>
                    <Text className="text-slate-600 text-xs font-medium flex-1">
                        {item.direccion_entrega || 'Dirección no especificada'}
                    </Text>
                </View>

                {/* Phone Row */}
                <View className="flex-row items-center">
                    <View className="w-7 h-7 rounded-full bg-emerald-50 items-center justify-center mr-2.5">
                        <MaterialCommunityIcons name="phone-outline" size={15} color="#10B981" />
                    </View>
                    <Text className="text-slate-600 text-xs font-medium">
                        {item.telefono_cliente || 'Sin teléfono'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F8F9FD]">
            {/* Header Area */}
            <View className="pt-14 px-6 pb-4 bg-white border-b border-slate-100">
                <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    Historial
                </Text>
                <Text className="text-slate-500 text-sm mt-0.5">
                    Tus entregas completadas
                </Text>
            </View>

            {/* Main Content Area */}
            <View className="flex-1 px-5 pt-4">
                {/* Summary Banner Card */}
                <View className="bg-[#1D3BB3] p-5 rounded-3xl mb-4 flex-row justify-between items-center shadow-md shadow-blue-900/20">
                    {/* Left Column: Entregas */}
                    <View className="flex-1 border-r border-blue-400/30 pr-3">
                        <Text className="text-blue-200 text-[11px] font-extrabold tracking-wider uppercase mb-1">
                            ENTREGAS
                        </Text>
                        <Text className="text-3xl font-black text-white">
                            {totalEntregas}{' '}
                            <Text className="text-blue-200 text-xs font-normal">pedidos</Text>
                        </Text>
                    </View>

                    {/* Right Column: Total Cobrado */}
                    <View className="flex-1 pl-4">
                        <Text className="text-blue-200 text-[11px] font-extrabold tracking-wider uppercase mb-1">
                            TOTAL COBRADO
                        </Text>
                        <Text className="text-2xl font-black text-white">
                            ${Number(totalDinero || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}{' '}
                            <Text className="text-blue-200 text-xs font-normal">MXN</Text>
                        </Text>
                    </View>
                </View>

                {/* Date Selectors (DESDE / HASTA) */}
                <View className="flex-row justify-between mb-4 gap-3">
                    {/* Desde */}
                    <View className="flex-1">
                        <TouchableOpacity 
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center"
                            onPress={() => setShowInicioPicker(!showInicioPicker)}
                        >
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-0.5">DESDE:</Text>
                                <Text className="text-slate-800 font-bold text-xs">
                                    {fechaInicio.toLocaleDateString('es-ES')}
                                </Text>
                            </View>
                            <MaterialCommunityIcons name="calendar-outline" size={18} color="#0038FF" />
                        </TouchableOpacity>
                        {showInicioPicker && (
                            Platform.OS === 'web' ? (
                                <input
                                    type="date"
                                    value={fechaInicio.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setFechaInicio(new Date(e.target.value + 'T00:00:00'));
                                        }
                                        setShowInicioPicker(false);
                                    }}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        marginTop: '6px',
                                        fontSize: '13px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                            ) : (
                                <DateTimePicker
                                    value={fechaInicio}
                                    mode="date"
                                    display="default"
                                    onValueChange={onValueChangeInicio}
                                    onDismiss={() => setShowInicioPicker(false)}
                                />
                            )
                        )}
                    </View>

                    {/* Hasta */}
                    <View className="flex-1">
                        <TouchableOpacity 
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center"
                            onPress={() => setShowFinPicker(!showFinPicker)}
                        >
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-0.5">HASTA:</Text>
                                <Text className="text-slate-800 font-bold text-xs">
                                    {fechaFin.toLocaleDateString('es-ES')}
                                </Text>
                            </View>
                            <MaterialCommunityIcons name="calendar-outline" size={18} color="#0038FF" />
                        </TouchableOpacity>
                        {showFinPicker && (
                            Platform.OS === 'web' ? (
                                <input
                                    type="date"
                                    value={fechaFin.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            setFechaFin(new Date(e.target.value + 'T00:00:00'));
                                        }
                                        setShowFinPicker(false);
                                    }}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        marginTop: '6px',
                                        fontSize: '13px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                            ) : (
                                <DateTimePicker
                                    value={fechaFin}
                                    mode="date"
                                    display="default"
                                    onValueChange={onValueChangeFin}
                                    onDismiss={() => setShowFinPicker(false)}
                                    minimumDate={fechaInicio}
                                />
                            )
                        )}
                    </View>
                </View>

                {error && (
                    <View className="bg-red-50 border border-red-200 p-3.5 rounded-2xl mb-4">
                        <Text className="text-red-600 text-center font-medium text-xs">{error}</Text>
                    </View>
                )}

                {isLoading && !isRefreshing ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#0038FF" />
                        <Text className="text-slate-500 text-xs font-medium mt-3">Buscando entregas...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={historial}
                        keyExtractor={(item) => item.id_pedido.toString()}
                        renderItem={renderPedido}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        refreshControl={
                            <RefreshControl 
                                refreshing={isRefreshing} 
                                onRefresh={onRefresh} 
                                tintColor="#0038FF" 
                                colors={['#0038FF']} 
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center py-12 mt-6">
                                <Text className="text-5xl mb-3">🏜️</Text>
                                <Text className="text-slate-800 text-base font-bold text-center">No hay entregas</Text>
                                <Text className="text-slate-400 text-xs text-center mt-1">
                                    No se encontraron datos en este rango de fechas.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}
