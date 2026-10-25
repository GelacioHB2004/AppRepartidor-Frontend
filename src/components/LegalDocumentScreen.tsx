import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LegalDocument, LegalRepository } from '@/models/repositories/LegalRepository';

export function LegalDocumentScreen() {
    const router = useRouter();
    const [documento, setDocumento] = useState<LegalDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarDocumento = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const resultado = await LegalRepository.obtenerTerminos();
            setDocumento(resultado);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'No fue posible cargar este documento. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void cargarDocumento();
    }, [cargarDocumento]);

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
            <View style={{ paddingTop: 48, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 12 }} accessibilityLabel="Regresar">
                    <MaterialCommunityIcons name="arrow-left" size={25} color="#0F172A" />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', color: '#0F172A' }}>Términos y Condiciones</Text>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { void cargarDocumento(); }} colors={['#0038FF']} />}
                showsVerticalScrollIndicator={false}
            >
                {isLoading && !documento ? (
                    <View style={{ paddingTop: 90, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0038FF" />
                        <Text style={{ marginTop: 12, color: '#64748B' }}>Cargando documento...</Text>
                    </View>
                ) : error ? (
                    <View style={{ backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA', padding: 18, alignItems: 'center' }}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={30} color="#DC2626" />
                        <Text style={{ color: '#991B1B', textAlign: 'center', marginTop: 8 }}>{error}</Text>
                        <TouchableOpacity onPress={() => { void cargarDocumento(); }} style={{ marginTop: 16, backgroundColor: '#0038FF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                ) : documento && (
                    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
                        <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                            <MaterialCommunityIcons name="file-document-outline" size={24} color="#0038FF" />
                        </View>
                        <Text style={{ fontSize: 21, fontWeight: '800', color: '#0F172A', marginBottom: 5 }}>{documento.titulo}</Text>
                        {documento.version && <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 20 }}>Versión {documento.version}</Text>}
                        <Text style={{ color: '#334155', fontSize: 15, lineHeight: 24 }}>{documento.contenido}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
