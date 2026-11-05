import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Platform,
    RefreshControl,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import {
    NotificacionRepository,
    NotificacionRepartidor,
} from '../models/repositories/NotificacionRepository';
import {
    ejecutandoEnExpoGo,
    obtenerEstadoPermisoNotificaciones,
    registrarDispositivoParaNotificaciones,
} from '../services/notificacionService';

const formatearFecha = (fecha: string) => new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
}).format(new Date(fecha));

export default function NotificationsScreen() {
    const router = useRouter();
    const [notificaciones, setNotificaciones] = useState<NotificacionRepartidor[]>([]);
    const [pedidosAsignados, setPedidosAsignados] = useState(true);
    const [permisoConcedido, setPermisoConcedido] = useState(Platform.OS === 'web');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const esExpoGo = ejecutandoEnExpoGo();

    const cargar = useCallback(async (refrescar = false) => {
        refrescar ? setIsRefreshing(true) : setIsLoading(true);
        setError(null);
        try {
            await NotificacionRepository.sincronizar();
            const [lista, preferencias, estadoPermiso] = await Promise.all([
                NotificacionRepository.listar(),
                NotificacionRepository.obtenerPreferencias(),
                obtenerEstadoPermisoNotificaciones(),
            ]);
            setNotificaciones(lista);
            setPedidosAsignados(preferencias.pedidosAsignados);
            setPermisoConcedido(estadoPermiso === 'granted');
        } catch (err: any) {
            setError(err.message || 'No fue posible cargar las notificaciones.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        void cargar();
    }, [cargar]));

    const cambiarPreferencia = async (valor: boolean) => {
        const anterior = pedidosAsignados;
        setPedidosAsignados(valor);
        try {
            const preferencias = await NotificacionRepository.actualizarPreferencias(valor);
            setPedidosAsignados(preferencias.pedidosAsignados);
            if (valor && !permisoConcedido) {
                const token = await registrarDispositivoParaNotificaciones();
                setPermisoConcedido(Boolean(token));
            }
        } catch (err: any) {
            setPedidosAsignados(anterior);
            setError(err.message || 'No fue posible guardar la preferencia.');
        }
    };

    const abrirNotificacion = async (notificacion: NotificacionRepartidor) => {
        if (!notificacion.leida) {
            await NotificacionRepository.marcarComoLeida(notificacion.id_notificacion);
            setNotificaciones((actuales) => actuales.map((item) => (
                item.id_notificacion === notificacion.id_notificacion ? { ...item, leida: true } : item
            )));
        }
        if (notificacion.tipo === 'pedido_asignado') router.push('/(tabs)/pedidos');
    };

    return (
        <View className="flex-1 bg-[#F8F9FD]">
            <View className="pt-12 pb-4 px-5 bg-white border-b border-slate-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="arrow-left" size={22} color="#334155" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-slate-900 text-xl font-extrabold">Notificaciones y alertas</Text>
                    <Text className="text-slate-500 text-xs mt-0.5">Avisos de pedidos asignados</Text>
                </View>
            </View>

            <FlatList
                data={notificaciones}
                keyExtractor={(item) => String(item.id_notificacion)}
                contentContainerStyle={{ padding: 18, paddingBottom: 40, flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { void cargar(true); }} />}
                ListHeaderComponent={(
                    <>
                        <View className="bg-white rounded-3xl border border-slate-100 p-5 mb-4 shadow-sm">
                            <View className="flex-row items-center">
                                <View className="w-11 h-11 rounded-2xl bg-blue-50 items-center justify-center mr-3">
                                    <MaterialCommunityIcons name="truck-fast-outline" size={23} color="#0038FF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-800 font-bold">Nuevos pedidos</Text>
                                    <Text className="text-slate-500 text-xs mt-1">Recibe un aviso cuando se te asigne una entrega.</Text>
                                </View>
                                <Switch
                                    value={pedidosAsignados}
                                    onValueChange={(valor) => { void cambiarPreferencia(valor); }}
                                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                                    thumbColor={pedidosAsignados ? '#0038FF' : '#F8FAFC'}
                                />
                            </View>
                        </View>

                        {esExpoGo && (
                            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 flex-row items-center">
                                <MaterialCommunityIcons name="information-outline" size={21} color="#2563EB" />
                                <Text className="text-blue-800 text-xs flex-1 ml-3">
                                    Expo Go permite consultar este historial, pero las alertas push se activarán en el APK o AAB instalado.
                                </Text>
                            </View>
                        )}

                        {!esExpoGo && !permisoConcedido && Platform.OS !== 'web' && (
                            <TouchableOpacity
                                onPress={() => { void Linking.openSettings(); }}
                                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex-row items-center"
                            >
                                <MaterialCommunityIcons name="alert-outline" size={21} color="#D97706" />
                                <Text className="text-amber-800 text-xs flex-1 ml-3">
                                    Android tiene bloqueadas las notificaciones. Toca aquí para habilitarlas.
                                </Text>
                            </TouchableOpacity>
                        )}

                        <Text className="text-slate-800 font-extrabold text-base mb-3 mt-1">Actividad reciente</Text>
                        {error && <Text className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl p-3 mb-3">{error}</Text>}
                    </>
                )}
                ListEmptyComponent={isLoading ? (
                    <ActivityIndicator color="#0038FF" size="large" />
                ) : (
                    <View className="flex-1 items-center justify-center py-16">
                        <MaterialCommunityIcons name="bell-sleep-outline" size={50} color="#CBD5E1" />
                        <Text className="text-slate-700 font-bold mt-3">Aún no tienes notificaciones</Text>
                        <Text className="text-slate-400 text-xs mt-1 text-center">Los pedidos nuevos aparecerán aquí.</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => { void abrirNotificacion(item); }}
                        className={`rounded-2xl border p-4 mb-3 flex-row ${item.leida ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-100'}`}
                    >
                        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${item.leida ? 'bg-slate-100' : 'bg-blue-100'}`}>
                            <MaterialCommunityIcons name="package-variant-closed" size={21} color={item.leida ? '#64748B' : '#0038FF'} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-800 font-bold text-sm">{item.titulo}</Text>
                            <Text className="text-slate-500 text-xs leading-5 mt-1">{item.mensaje}</Text>
                            <Text className="text-slate-400 text-[10px] font-medium mt-2">{formatearFecha(item.fecha_creacion)}</Text>
                        </View>
                        {!item.leida && <View className="w-2.5 h-2.5 rounded-full bg-[#0038FF] mt-1" />}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
