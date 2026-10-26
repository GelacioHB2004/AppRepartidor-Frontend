import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export type EvidenciaEntregaForm = {
    foto: { uri: string; mimeType: string; fileName: string; fileSize?: number | null };
    nombreReceptor: string;
    latitud: number;
    longitud: number;
};

type Props = {
    visible: boolean;
    idPedido?: number;
    onClose: () => void;
    onConfirm: (evidencia: EvidenciaEntregaForm) => Promise<boolean>;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function DeliveryEvidenceModal({ visible, idPedido, onClose, onConfirm }: Props) {
    const [foto, setFoto] = useState<EvidenciaEntregaForm['foto'] | null>(null);
    const [nombreReceptor, setNombreReceptor] = useState('');
    const [ubicacion, setUbicacion] = useState<{ latitud: number; longitud: number } | null>(null);
    const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (!visible) {
            setFoto(null);
            setNombreReceptor('');
            setUbicacion(null);
            setEnviando(false);
        }
    }, [visible]);

    const tomarFoto = async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert('Permiso requerido', 'Activa el permiso de cámara para tomar la evidencia de entrega.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7, allowsEditing: false });
        if (resultado.canceled) return;

        const asset = resultado.assets[0];
        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
            Alert.alert('Foto demasiado grande', 'La evidencia no puede superar los 10 MB. Intenta tomar otra foto.');
            return;
        }
        setFoto({
            uri: asset.uri,
            mimeType: asset.mimeType || 'image/jpeg',
            fileName: asset.fileName || `evidencia-pedido-${idPedido || 'entrega'}.jpg`,
            fileSize: asset.fileSize,
        });
    };

    const obtenerUbicacion = async () => {
        setObteniendoUbicacion(true);
        try {
            const permiso = await Location.requestForegroundPermissionsAsync();
            if (!permiso.granted) {
                Alert.alert('Ubicación requerida', 'Activa tu ubicación para registrar dónde se realizó la entrega.');
                return;
            }
            const posicion = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setUbicacion({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
        } catch {
            Alert.alert('No se obtuvo la ubicación', 'Verifica que el GPS esté activo e inténtalo nuevamente.');
        } finally {
            setObteniendoUbicacion(false);
        }
    };

    const confirmar = async () => {
        if (!foto) return Alert.alert('Falta evidencia', 'Toma una foto de los productos entregados.');
        if (!nombreReceptor.trim()) return Alert.alert('Falta información', 'Escribe el nombre de la persona que recibió el pedido.');
        if (!ubicacion) return Alert.alert('Falta ubicación', 'Obtén la ubicación actual antes de confirmar la entrega.');

        setEnviando(true);
        const entregado = await onConfirm({ foto, nombreReceptor: nombreReceptor.trim(), latitud: ubicacion.latitud, longitud: ubicacion.longitud });
        setEnviando(false);
        if (entregado) onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView className="flex-1 justify-end bg-black/50" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View className="bg-white rounded-t-[32px] max-h-[92%]">
                    <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
                        <View className="flex-row justify-between items-center mb-2">
                            <View><Text className="text-slate-800 text-xl font-bold">Evidencia de entrega</Text><Text className="text-slate-500 text-xs mt-1">Pedido #{idPedido}</Text></View>
                            <TouchableOpacity onPress={onClose} disabled={enviando} className="bg-slate-100 p-2 rounded-full"><MaterialCommunityIcons name="close" size={20} color="#64748B" /></TouchableOpacity>
                        </View>
                        <Text className="text-slate-500 text-sm mb-5">Toma una foto de los productos entregados. Evita fotografiar rostros o información personal.</Text>

                        <Text className="text-slate-700 font-bold text-sm mb-2">Foto de evidencia *</Text>
                        {foto ? <View className="mb-4"><Image source={{ uri: foto.uri }} className="w-full h-52 rounded-2xl bg-slate-100" resizeMode="cover" /><TouchableOpacity onPress={tomarFoto} disabled={enviando} className="mt-2 py-3 rounded-xl bg-slate-100 items-center"><Text className="text-slate-700 font-bold">Tomar otra foto</Text></TouchableOpacity></View> :
                            <TouchableOpacity onPress={tomarFoto} disabled={enviando} className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-2xl h-36 items-center justify-center mb-4"><MaterialCommunityIcons name="camera-plus-outline" size={32} color="#0038FF" /><Text className="text-[#0038FF] font-bold mt-2">Tomar foto</Text><Text className="text-slate-500 text-xs mt-1">JPG, PNG o WEBP · máximo 10 MB</Text></TouchableOpacity>}

                        <Text className="text-slate-700 font-bold text-sm mb-2">Nombre de quien recibió *</Text>
                        <TextInput value={nombreReceptor} onChangeText={setNombreReceptor} editable={!enviando} maxLength={150} placeholder="Ej. María Hernández" className="border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-800 mb-4" />

                        <Text className="text-slate-700 font-bold text-sm mb-2">Ubicación de entrega *</Text>
                        <TouchableOpacity onPress={obtenerUbicacion} disabled={obteniendoUbicacion || enviando} className={`rounded-2xl px-4 py-4 flex-row items-center ${ubicacion ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-100'}`}>
                            {obteniendoUbicacion ? <ActivityIndicator color="#0038FF" /> : <MaterialCommunityIcons name={ubicacion ? 'map-marker-check' : 'crosshairs-gps'} size={22} color={ubicacion ? '#059669' : '#0038FF'} />}
                            <View className="ml-3 flex-1"><Text className={`font-bold ${ubicacion ? 'text-emerald-700' : 'text-slate-700'}`}>{ubicacion ? 'Ubicación obtenida' : 'Obtener mi ubicación'}</Text><Text className="text-slate-500 text-xs mt-0.5">{ubicacion ? `${ubicacion.latitud.toFixed(6)}, ${ubicacion.longitud.toFixed(6)}` : 'Debes estar en el lugar de entrega'}</Text></View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={confirmar} disabled={enviando} className={`mt-6 py-4 rounded-2xl flex-row justify-center items-center ${enviando ? 'bg-emerald-300' : 'bg-emerald-600'}`}>
                            {enviando ? <ActivityIndicator color="white" /> : <MaterialCommunityIcons name="check-bold" size={20} color="white" style={{ marginRight: 8 }} />}
                            <Text className="text-white font-bold text-base">{enviando ? 'Guardando evidencia...' : 'Confirmar entrega'}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
