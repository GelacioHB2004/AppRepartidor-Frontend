import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { usePerfilViewModel } from '../../viewmodels/usePerfilViewModel';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface MenuRowProps {
    icon: IconName;
    label: string;
    onPress: () => void;
    isRed?: boolean;
    showDivider?: boolean;
}

function MenuRow({ icon, label, onPress, isRed = false, showDivider = true }: MenuRowProps) {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 4,
                }}
                activeOpacity={0.7}
            >
                {/* Icon bubble */}
                <View style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: isRed ? '#FFF1F2' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}>
                    <MaterialCommunityIcons
                        name={icon}
                        size={20}
                        color={isRed ? '#F43F5E' : '#0038FF'}
                    />
                </View>

                {/* Label */}
                <Text style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: '600',
                    color: isRed ? '#F43F5E' : '#1E293B',
                }}>
                    {label}
                </Text>

                {/* Chevron */}
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={isRed ? '#F43F5E' : '#CBD5E1'}
                />
            </TouchableOpacity>

            {showDivider && (
                <View style={{ height: 1, backgroundColor: '#F1F5F9', marginLeft: 52 }} />
            )}
        </>
    );
}

export default function PerfilScreen() {
    const router = useRouter();
    const { handleLogout } = useAuthViewModel();
    const {
        nombre,
        setNombre,
        apellidoP,
        setApellidoP,
        apellidoM,
        setApellidoM,
        telefono,
        setTelefono,
        correo,
        nombreCompleto,
        tipoUsuario,
        isLoading,
        isSaving,
        error,
        successMessage,
        guardarCambios,
    } = usePerfilViewModel();

    const [editModalVisible, setEditModalVisible] = useState(false);

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F8F9FD', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0038FF" />
                <Text style={{ color: '#64748B', fontSize: 13, marginTop: 12 }}>Cargando tu perfil...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FD' }}>
            {/* Header */}
            <View style={{
                paddingTop: Platform.OS === 'ios' ? 56 : 48,
                paddingBottom: 16,
                paddingHorizontal: 24,
                backgroundColor: '#FFFFFF',
                borderBottomWidth: 1,
                borderBottomColor: '#F1F5F9',
            }}>
                <Text style={{ fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 }}>
                    Mi Perfil
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Profile Info Card ── */}
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#F1F5F9',
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    {/* Avatar + Name + Status */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        {/* Avatar circle */}
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#EFF6FF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                            borderWidth: 1,
                            borderColor: '#DBEAFE',
                        }}>
                            <MaterialCommunityIcons name="account" size={34} color="#0038FF" />
                        </View>

                        {/* Name & role */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 2 }}>
                                {nombreCompleto || 'Usuario Repartidor'}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={{ fontSize: 13, color: '#64748B', fontWeight: '500' }}>
                                    {tipoUsuario || 'Socio Repartidor'}
                                </Text>
                                <View style={{
                                    backgroundColor: '#ECFDF5',
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: '#D1FAE5',
                                }}>
                                    <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>En línea</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: '#F1F5F9', marginBottom: 14 }} />

                    {/* Email */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <MaterialCommunityIcons name="email-outline" size={17} color="#94A3B8" style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500' }}>
                            {correo || 'sin-correo@angelitos.com'}
                        </Text>
                    </View>

                    {/* Phone */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="phone-outline" size={17} color="#94A3B8" style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 13, color: '#475569', fontWeight: '500' }}>
                            {telefono || 'Sin teléfono registrado'}
                        </Text>
                    </View>
                </View>

                {/* ── Menu Card 1: Editar / Notificaciones ── */}
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#F1F5F9',
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <MenuRow
                        icon="account-edit-outline"
                        label="Editar Información Personal"
                        onPress={() => setEditModalVisible(true)}
                    />
                    <MenuRow
                        icon="bell-outline"
                        label="Notificaciones y Alertas"
                        onPress={() => {}}
                        showDivider={false}
                    />
                </View>

                {/* ── Menu Card 2: Términos / Cerrar Sesión ── */}
                <View style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#F1F5F9',
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                }}>
                    <MenuRow
                        icon="file-document-outline"
                        label="Términos y Condiciones"
                        onPress={() => router.push('/terminos')}
                    />
                    <MenuRow
                        icon="logout"
                        label="Cerrar Sesión"
                        onPress={handleLogout}
                        isRed
                        showDivider={false}
                    />
                </View>
            </ScrollView>

            {/* ── Edit Modal ── */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: '#F8F9FD' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {/* Modal Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: Platform.OS === 'ios' ? 56 : 20,
                        paddingBottom: 16,
                        paddingHorizontal: 20,
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#F1F5F9',
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>
                            Editar Perfil
                        </Text>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)} activeOpacity={0.7}>
                            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Form Card */}
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: '#F1F5F9',
                            marginBottom: 16,
                        }}>

                            {[
                                { label: 'Nombre *', icon: 'account-outline' as IconName, value: nombre, setter: setNombre, placeholder: 'Tu nombre', keyboard: 'default' as const },
                                { label: 'Apellido Paterno *', icon: 'account-outline' as IconName, value: apellidoP, setter: setApellidoP, placeholder: 'Tu apellido paterno', keyboard: 'default' as const },
                                { label: 'Apellido Materno', icon: 'account-outline' as IconName, value: apellidoM, setter: setApellidoM, placeholder: 'Tu apellido materno', keyboard: 'default' as const },
                                { label: 'Teléfono *', icon: 'phone-outline' as IconName, value: telefono, setter: setTelefono, placeholder: 'Tu número de teléfono', keyboard: 'phone-pad' as const },
                            ].map((field, i, arr) => (
                                <View key={field.label} style={{ marginBottom: i < arr.length - 1 ? 16 : 0 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
                                        {field.label}
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#F8FAFC',
                                        borderWidth: 1,
                                        borderColor: '#E2E8F0',
                                        borderRadius: 14,
                                        paddingHorizontal: 14,
                                        paddingVertical: 12,
                                    }}>
                                        <MaterialCommunityIcons name={field.icon} size={18} color="#94A3B8" />
                                        <TextInput
                                            style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#0F172A' }}
                                            placeholder={field.placeholder}
                                            placeholderTextColor="#CBD5E1"
                                            value={field.value}
                                            onChangeText={field.setter}
                                            keyboardType={field.keyboard}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Feedback */}
                        {successMessage && (
                            <View style={{
                                backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0',
                                padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
                            }}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#065F46', fontWeight: '600', fontSize: 13, flex: 1 }}>{successMessage}</Text>
                            </View>
                        )}

                        {error && (
                            <View style={{
                                backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
                                padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
                            }}>
                                <MaterialCommunityIcons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#B91C1C', fontWeight: '500', fontSize: 13, flex: 1 }}>{error}</Text>
                            </View>
                        )}

                        {/* Save Button */}
                        <TouchableOpacity
                            onPress={async () => {
                                const guardado = await guardarCambios();
                                if (guardado) setEditModalVisible(false);
                            }}
                            disabled={isSaving}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: isSaving ? '#93C5FD' : '#0038FF',
                                paddingVertical: 16,
                                borderRadius: 16,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="content-save-outline" size={18} color="white" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Guardar Cambios</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
