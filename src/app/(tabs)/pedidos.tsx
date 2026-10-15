import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Modal, ScrollView } from 'react-native';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { usePedidosViewModel } from '../../viewmodels/usePedidosViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PedidosScreen() {
    const { handleLogout } = useAuthViewModel();
    const { 
        pedidos, 
        isLoading, 
        isRefreshing, 
        error, 
        onRefresh, 
        iniciarEntrega, 
        confirmarEntrega 
    } = usePedidosViewModel();

    const [selectedPedido, setSelectedPedido] = useState<any>(null);

    const pendientesCount = pedidos ? pedidos.filter((p: any) => p.estado !== 'Entregado').length : 0;

    const renderPedido = ({ item }: { item: any }) => (
        <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4">
            {/* Card Header Row */}
            <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                    <Text className="text-slate-400 text-xs font-bold tracking-wider mr-1.5 uppercase">
                        ENTREGA
                    </Text>
                    <View className="bg-blue-50 px-2.5 py-0.5 rounded-md">
                        <Text className="text-[#0038FF] font-bold text-xs">#{item.id_pedido}</Text>
                    </View>
                </View>

                {/* Status Badge */}
                <View className="bg-amber-50 border border-amber-100 px-3 py-1 rounded-lg">
                    <Text className="text-amber-700 font-bold text-xs">
                        {item.estado || 'Confirmado'}
                    </Text>
                </View>
            </View>

            {/* Customer Name */}
            <TouchableOpacity onPress={() => setSelectedPedido(item)} activeOpacity={0.7}>
                <Text className="text-slate-800 text-lg font-bold mb-3 mt-1">
                    {item.nombre_cliente || 'Cliente'}
                </Text>

                {/* Address Row */}
                <View className="flex-row items-center mb-2.5">
                    <View className="w-8 h-8 rounded-full bg-rose-50 items-center justify-center mr-3">
                        <MaterialCommunityIcons name="map-marker" size={16} color="#F43F5E" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-800 text-xs font-bold leading-4">
                            {item.direccion_entrega || 'Dirección no especificada'}
                        </Text>
                    </View>
                </View>

                {/* Phone Row */}
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
                        <MaterialCommunityIcons name="phone" size={16} color="#10B981" />
                    </View>
                    <Text className="text-slate-700 text-xs font-bold">
                        {item.telefono_cliente || 'Sin teléfono'}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Action Button */}
            {item.estado === 'En camino' ? (
                <TouchableOpacity 
                    className="bg-emerald-600 py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-emerald-500/20 active:bg-emerald-700"
                    onPress={() => confirmarEntrega(item.id_pedido)}
                >
                    <MaterialCommunityIcons name="check-bold" size={18} color="white" style={{ marginRight: 6 }} />
                    <Text className="text-white font-bold text-sm">Confirmar Entrega</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity 
                    className="bg-[#0038FF] py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-blue-500/20 active:bg-blue-700"
                    onPress={() => iniciarEntrega(item.id_pedido, item.direccion_entrega)}
                >
                    <MaterialCommunityIcons name="flash" size={18} color="white" style={{ marginRight: 6 }} />
                    <Text className="text-white font-bold text-sm">Iniciar Ruta</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-[#F8F9FD]">
            {/* Header Area */}
            <View className="pt-14 px-6 pb-4 bg-white border-b border-slate-100">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Mis Pedidos
                    </Text>
                    {/* En Turno Badge */}
                    <View className="flex-row items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                        <Text className="text-emerald-700 font-bold text-xs">En turno</Text>
                    </View>
                </View>

                {/* Subtitle Row */}
                <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-[#0038FF] font-black text-xs tracking-wider uppercase">
                        RUTAS DE HOY •
                    </Text>
                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                        <Text className="text-[#0038FF] font-bold text-xs">
                            {pendientesCount} pendientes
                        </Text>
                    </View>
                </View>
            </View>

            {error && (
                <View className="bg-red-50 border border-red-200 p-3.5 rounded-2xl mx-5 mt-4">
                    <Text className="text-red-600 text-center font-medium text-xs">{error}</Text>
                </View>
            )}

            {isLoading && !isRefreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0038FF" />
                    <Text className="text-slate-500 text-xs font-medium mt-3">Buscando rutas asignadas...</Text>
                </View>
            ) : (
                <FlatList
                    data={pedidos}
                    keyExtractor={(item) => item.id_pedido.toString()}
                    renderItem={renderPedido}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 }}
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefreshing} 
                            onRefresh={onRefresh} 
                            tintColor="#0038FF" 
                            colors={['#0038FF']} 
                        />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-12 mt-10">
                            <Text className="text-5xl mb-3">🎉</Text>
                            <Text className="text-slate-800 text-base font-bold text-center">¡No hay pedidos pendientes!</Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">Puedes tomarte un descanso.</Text>
                        </View>
                    }
                />
            )}

            {/* Modal de Detalle de Pedido */}
            <Modal
                visible={!!selectedPedido}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedPedido(null)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[32px] p-6 h-5/6 shadow-2xl">
                        {/* Cabecera del Modal */}
                        <View className="flex-row justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <Text className="text-slate-800 text-xl font-bold">Detalles del Pedido</Text>
                            <TouchableOpacity onPress={() => setSelectedPedido(null)} className="bg-slate-100 p-2 rounded-full">
                                <MaterialCommunityIcons name="close" size={18} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {selectedPedido && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                                {/* Info Cliente */}
                                <View className="bg-[#F8FAFC] p-4 rounded-2xl mb-4 border border-[#E2E8F0]">
                                    <Text className="text-[#0038FF] font-bold mb-2 uppercase tracking-wider text-[11px]">Información del Cliente</Text>
                                    <Text className="text-slate-800 font-bold text-base mb-1">👤 {selectedPedido.nombre_cliente}</Text>
                                    <Text className="text-slate-600 text-sm mb-1">📞 {selectedPedido.telefono_cliente}</Text>
                                    <Text className="text-slate-600 text-sm">📧 {selectedPedido.correo_cliente || 'No especificado'}</Text>
                                </View>

                                {/* Dirección */}
                                <View className="bg-[#F8FAFC] p-4 rounded-2xl mb-4 border border-[#E2E8F0]">
                                    <Text className="text-[#0038FF] font-bold mb-2 uppercase tracking-wider text-[11px]">Dirección de Entrega</Text>
                                    <Text className="text-slate-800 text-sm font-medium">📍 {selectedPedido.direccion_entrega}</Text>
                                </View>

                                {/* Lista de Productos */}
                                <View className="bg-[#F8FAFC] p-4 rounded-2xl mb-4 border border-[#E2E8F0]">
                                    <Text className="text-[#0038FF] font-bold mb-2 uppercase tracking-wider text-[11px]">Productos ({selectedPedido.detalles?.length || 0})</Text>
                                    {selectedPedido.detalles?.map((det: any, idx: number) => (
                                        <View key={idx} className="flex-row justify-between py-2 border-b border-slate-200 last:border-0">
                                            <View className="flex-1 pr-2">
                                                <Text className="text-slate-800 text-sm font-medium">{det.cantidad}x {det.producto_nombre}</Text>
                                            </View>
                                            <Text className="text-slate-600 text-sm font-bold">${Number(det.precio_unitario || 0).toFixed(2)}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Resumen Monetario */}
                                <View className="bg-emerald-50 p-4 rounded-2xl mb-6 border border-emerald-100">
                                    <Text className="text-emerald-700 font-bold mb-2 uppercase tracking-wider text-[11px]">Resumen de Pago</Text>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-slate-600 text-sm">Método de pago:</Text>
                                        <Text className="text-slate-800 font-bold text-sm capitalize">{selectedPedido.metodo_pago || 'No especificado'}</Text>
                                    </View>
                                    <View className="flex-row justify-between pt-2 border-t border-emerald-200">
                                        <Text className="text-slate-800 font-bold text-base">Total a cobrar:</Text>
                                        <Text className="text-emerald-700 font-bold text-lg">${Number(selectedPedido.total || 0).toFixed(2)}</Text>
                                    </View>
                                </View>

                                {/* Botón de Cerrar */}
                                <TouchableOpacity 
                                    className="bg-[#0038FF] py-4 rounded-2xl items-center shadow-lg shadow-blue-500/30"
                                    onPress={() => setSelectedPedido(null)}
                                >
                                    <Text className="text-white font-bold text-base">Cerrar Detalles</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

