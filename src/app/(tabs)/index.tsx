import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useInicioViewModel } from '../../viewmodels/useInicioViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function InicioScreen() {
    const { dashboardData, isLoading, isRefreshing, error, onRefresh, usuarioNombre } = useInicioViewModel();
    const router = useRouter();

    const openMap = (address: string) => {
        const query = encodeURIComponent(address);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    const nombreFormateado = usuarioNombre ? usuarioNombre.split(' ')[0] : 'Pedro';

    return (
        <View className="flex-1 bg-[#F8F9FD]">
            {/* Header Area */}
            <View className="pt-14 px-6 pb-4 bg-white flex-row justify-between items-center border-b border-slate-100">
                <View>
                    <Text className="text-[#0038FF] text-[11px] font-black tracking-wider uppercase mb-0.5">
                        PANEL REPARTIDOR
                    </Text>
                    <Text className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        Hola, {nombreFormateado} 👋
                    </Text>
                </View>
                {/* En Turno Badge */}
                <View className="flex-row items-center bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    <Text className="text-emerald-700 font-bold text-xs">En Turno</Text>
                </View>
            </View>

            {error && (
                <View className="bg-red-50 border border-red-200 p-3.5 rounded-2xl mx-6 mt-4">
                    <Text className="text-red-600 text-center font-medium text-xs">{error}</Text>
                </View>
            )}

            <ScrollView 
                className="flex-1 px-5 pt-5"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#0038FF" />
                }
            >
                {isLoading && !isRefreshing ? (
                    <View className="py-12 items-center">
                        <ActivityIndicator size="large" color="#0038FF" />
                    </View>
                ) : (
                    <>
                        {/* 2x2 Grid Metrics */}
                        <View className="flex-row flex-wrap justify-between gap-y-3 mb-6">
                            {/* Pendientes */}
                            <View className="bg-white w-[48.5%] p-4 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center">
                                <View>
                                    <Text className="text-slate-400 text-xs font-semibold mb-1">Pendientes</Text>
                                    <Text className="text-2xl font-extrabold text-slate-800">
                                        {dashboardData?.stats?.pendientes ?? 0}
                                    </Text>
                                </View>
                                <View className="w-10 h-10 rounded-xl bg-amber-50 items-center justify-center">
                                    <MaterialCommunityIcons name="package-variant-closed" size={22} color="#F59E0B" />
                                </View>
                            </View>

                            {/* En Camino */}
                            <View className="bg-white w-[48.5%] p-4 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center">
                                <View>
                                    <Text className="text-slate-400 text-xs font-semibold mb-1">En Camino</Text>
                                    <Text className="text-2xl font-extrabold text-slate-800">
                                        {dashboardData?.stats?.en_camino ?? 0}
                                    </Text>
                                </View>
                                <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                                    <MaterialCommunityIcons name="truck-delivery-outline" size={22} color="#0038FF" />
                                </View>
                            </View>

                            {/* Entregados */}
                            <View className="bg-white w-[48.5%] p-4 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center">
                                <View>
                                    <Text className="text-slate-400 text-xs font-semibold mb-1">Entregados</Text>
                                    <Text className="text-2xl font-extrabold text-slate-800">
                                        {dashboardData?.stats?.entregados ?? 0}
                                    </Text>
                                </View>
                                <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center">
                                    <MaterialCommunityIcons name="check-circle-outline" size={22} color="#10B981" />
                                </View>
                            </View>

                            {/* Total Hoy */}
                            <View className="bg-white w-[48.5%] p-4 rounded-2xl border border-slate-100 shadow-sm flex-row justify-between items-center">
                                <View>
                                    <Text className="text-slate-400 text-xs font-semibold mb-1">Total Hoy</Text>
                                    <Text className="text-2xl font-extrabold text-slate-800">
                                        {dashboardData?.stats?.total_hoy ?? 0}
                                    </Text>
                                </View>
                                <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center">
                                    <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#8B5CF6" />
                                </View>
                            </View>
                        </View>

                        {/* Próxima Entrega */}
                        <View className="bg-slate-50 p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <View className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2" />
                                    <Text className="text-xl mr-1">📍</Text>
                                    <Text className="text-slate-800 font-extrabold text-xs tracking-wider uppercase">
                                        PRÓXIMA ENTREGA
                                    </Text>
                                </View>
                                <View className="bg-blue-100 px-2.5 py-1 rounded-lg">
                                    <Text className="text-[#0038FF] font-bold text-[11px]">Prioritaria</Text>
                                </View>
                            </View>

                            {dashboardData?.proxima_entrega ? (
                                <>
                                    <View className="bg-white p-4 rounded-2xl border border-slate-100 mb-3">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text className="text-slate-400 text-[10px] font-bold tracking-wider">CLIENTE</Text>
                                            <View className="bg-slate-100 px-2.5 py-0.5 rounded-lg">
                                                <Text className="text-slate-600 font-bold text-xs">
                                                    Orden #{dashboardData.proxima_entrega.id_pedido || '864'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className="text-slate-800 font-bold text-base mb-2.5">
                                            {dashboardData.proxima_entrega.nombre_cliente}
                                        </Text>

                                        <Text className="text-slate-400 text-[10px] font-bold tracking-wider mb-0.5">DIRECCIÓN</Text>
                                        <Text className="text-slate-600 text-xs font-medium leading-4">
                                            {dashboardData.proxima_entrega.direccion_entrega}
                                        </Text>
                                    </View>

                                    <TouchableOpacity 
                                        className="bg-[#0038FF] py-3.5 rounded-2xl flex-row justify-center items-center shadow-md shadow-blue-500/20 active:bg-blue-700"
                                        onPress={() => openMap(dashboardData.proxima_entrega.direccion_entrega)}
                                    >
                                        <MaterialCommunityIcons name="map-outline" size={18} color="white" style={{ marginRight: 6 }} />
                                        <Text className="text-white font-bold text-sm">Ver ruta</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View className="bg-white p-5 rounded-2xl border border-slate-100 items-center">
                                    <Text className="text-slate-400 text-xs font-medium">No hay entregas pendientes en este momento.</Text>
                                </View>
                            )}
                        </View>

                        {/* Siguientes en Fila */}
                        <View className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-base mr-1.5">📦</Text>
                                    <Text className="text-slate-800 font-bold text-sm">Siguientes en Fila</Text>
                                </View>
                                <Text className="text-slate-400 text-xs font-medium">
                                    {dashboardData?.pedidos_pendientes?.length || 0} pedidos
                                </Text>
                            </View>

                            {dashboardData?.pedidos_pendientes && dashboardData.pedidos_pendientes.length > 0 ? (
                                dashboardData.pedidos_pendientes.slice(0, 3).map((p: any) => (
                                    <View key={p.id_pedido} className="flex-row justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                                        <View className="flex-row items-center">
                                            <View className="w-2 h-2 rounded-full bg-slate-300 mr-2.5" />
                                            <Text className="text-slate-800 font-bold text-xs">Pedido #{p.id_pedido}</Text>
                                        </View>
                                        <Text className="text-slate-400 text-xs font-medium max-w-[160px]" numberOfLines={1}>
                                            {p.direccion_entrega || p.nombre_cliente}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-slate-400 text-xs text-center py-3">No hay más pedidos en fila.</Text>
                            )}

                            <TouchableOpacity 
                                className="mt-3 py-3 bg-slate-50 rounded-2xl flex-row justify-center items-center active:bg-slate-100"
                                onPress={() => router.push('/pedidos' as any)}
                            >
                                <Text className="text-slate-700 font-bold text-xs mr-1">Ver pedidos</Text>
                                <MaterialCommunityIcons name="chevron-right" size={16} color="#334155" />
                            </TouchableOpacity>
                        </View>

                        {/* Notificaciones Card */}
                        <View className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8">
                            <View className="flex-row items-center mb-3">
                                <MaterialCommunityIcons name="bell-outline" size={18} color="#0038FF" style={{ marginRight: 6 }} />
                                <Text className="text-slate-800 font-bold text-sm">Notificaciones</Text>
                            </View>

                            <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex-row items-start">
                                <View className="w-2.5 h-2.5 rounded-full bg-[#0038FF] mt-1 mr-2.5" />
                                <View className="flex-1">
                                    <Text className="text-slate-800 font-bold text-xs mb-0.5">
                                        Ruta optimizada automáticamente
                                    </Text>
                                    <Text className="text-slate-400 text-xs leading-4 mb-1">
                                        Recuerda solicitar el código de 4 dígitos al entregar el pedido.
                                    </Text>
                                    <Text className="text-slate-400 text-[10px] font-medium">
                                        Hace 12 minutos
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}


