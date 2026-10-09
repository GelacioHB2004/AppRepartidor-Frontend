import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRecoveryViewModel } from '../viewmodels/useRecoveryViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Validaciones ────────────────────────────────────────────────────────────
function validatePassword(v: string): string | null {
    if (!v) return 'La contraseña es obligatoria.';
    if (v.length < 8) return 'Debe tener al menos 8 caracteres.';
    return null;
}

function validateConfirm(v: string, password: string): string | null {
    if (!v) return 'Confirma tu contraseña.';
    if (v !== password) return 'Las contraseñas no coinciden.';
    return null;
}

// ─── Fortaleza de contraseña ─────────────────────────────────────────────────
function getPasswordStrength(v: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
    if (v.length === 0) return { level: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    if (score <= 1) return { level: 1, label: 'Debil', color: '#EF4444' };
    if (score === 2) return { level: 2, label: 'Media', color: '#F59E0B' };
    return { level: 3, label: 'Fuerte', color: '#10B981' };
}

// ─── Feedback de campo: hint en gris o error en rojo ────────────────────────
function FieldFeedback({ error, hint }: { error: string | null; hint: string }) {
    if (error) {
        return (
            <View className="flex-row items-center mt-1.5 mb-2 px-1 gap-1">
                <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#EF4444" />
                <Text className="text-red-500 text-xs font-medium flex-1">{error}</Text>
            </View>
        );
    }
    return (
        <View className="flex-row items-center mt-1.5 mb-2 px-1 gap-1">
            <MaterialCommunityIcons name="information-outline" size={13} color="#94A3B8" />
            <Text className="text-slate-400 text-xs flex-1">{hint}</Text>
        </View>
    );
}

// ─── Pantalla principal ──────────────────────────────────────────────────────
export default function NewPasswordScreen() {
    const { correo } = useLocalSearchParams<{ correo: string }>();
    const vm = useRecoveryViewModel();

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Errores por campo
    const [passError, setPassError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    // Campos tocados
    const [passTouched, setPassTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    // ── Handlers de cambio en tiempo real ───────────────────────────────────
    const handlePassChange = (v: string) => {
        vm.setNuevaPassword(v);
        if (passTouched) setPassError(validatePassword(v));
        // Re-valida confirmación si ya se tocó
        if (confirmTouched) setConfirmError(validateConfirm(vm.confirmarPassword, v));
    };

    const handleConfirmChange = (v: string) => {
        vm.setConfirmarPassword(v);
        if (confirmTouched) setConfirmError(validateConfirm(v, vm.nuevaPassword));
    };

    // ── Handlers de blur ────────────────────────────────────────────────────
    const handlePassBlur = () => {
        setPassTouched(true);
        setPassError(validatePassword(vm.nuevaPassword));
    };

    const handleConfirmBlur = () => {
        setConfirmTouched(true);
        setConfirmError(validateConfirm(vm.confirmarPassword, vm.nuevaPassword));
    };

    // ── Submit con validación completa ───────────────────────────────────────
    const handleSubmit = () => {
        setPassTouched(true);
        setConfirmTouched(true);

        const errPass = validatePassword(vm.nuevaPassword);
        const errConfirm = validateConfirm(vm.confirmarPassword, vm.nuevaPassword);

        setPassError(errPass);
        setConfirmError(errConfirm);

        if (errPass || errConfirm) return;
        vm.handleResetPassword(correo);
    };

    // ── Estado del botón y fortaleza ────────────────────────────────────────
    const isFormReady = vm.nuevaPassword.length > 0 && vm.confirmarPassword.length > 0;
    const strength = getPasswordStrength(vm.nuevaPassword);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#F8F9FD]"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                className="px-6 py-10"
            >
                <View className="w-full max-w-sm items-center">
                    {/* ── Ícono superior ──────────────────────────────── */}
                    <View className="w-20 h-20 bg-[#0B2E2A] rounded-full items-center justify-center mb-6 border-4 border-white shadow-lg shadow-emerald-500/10">
                        <MaterialCommunityIcons name="lock-check-outline" size={38} color="#10B981" />
                    </View>

                    {/* ── Título y subtítulo ──────────────────────────── */}
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-1.5">
                        Nueva Contraseña
                    </Text>
                    <Text className="text-slate-500 text-sm text-center mb-6">
                        Crea una contraseña segura para tu cuenta
                    </Text>

                    {/* ── Tarjeta del formulario ───────────────────────── */}
                    <View className="bg-white p-7 rounded-[28px] shadow-xl shadow-slate-200/80 border border-slate-100/80 w-full">

                        {/* ── Error del servidor ───────────────────────── */}
                        {vm.error && (
                            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-start gap-2">
                                <MaterialCommunityIcons name="server-network-off" size={16} color="#DC2626" style={{ marginTop: 1 }} />
                                <Text className="text-red-600 font-medium text-xs flex-1">{vm.error}</Text>
                            </View>
                        )}

                        {/* ── Mensaje de éxito ────────────────────────── */}
                        {vm.success && (
                            <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex-row items-start gap-2">
                                <MaterialCommunityIcons name="check-circle-outline" size={16} color="#059669" style={{ marginTop: 1 }} />
                                <Text className="text-emerald-700 font-medium text-xs flex-1">{vm.success}</Text>
                            </View>
                        )}

                        {/* ── Campo: Nueva contraseña ──────────────────── */}
                        <Text className="text-slate-800 font-bold text-sm mb-1.5">
                            Nueva Contraseña
                        </Text>
                        <View
                            className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                            style={{
                                borderWidth: 1,
                                borderColor: passError ? '#EF4444' : '#E2E8F0',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color={passError ? '#EF4444' : '#94A3B8'}
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-medium p-0"
                                value={vm.nuevaPassword}
                                onChangeText={handlePassChange}
                                onBlur={handlePassBlur}
                                placeholder="Min. 8 caracteres"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showNew}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowNew(!showNew)} className="pl-2">
                                <MaterialCommunityIcons
                                    name={showNew ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Hint o error del campo contraseña */}
                        <FieldFeedback
                            error={passError}
                            hint="Min. 8 caracteres. Puedes usar letras, numeros y simbolos"
                        />

                        {/* ── Barra de fortaleza ───────────────────────── */}
                        {vm.nuevaPassword.length > 0 && (
                            <View className="mb-2">
                                <View className="flex-row gap-1 mb-1">
                                    {[1, 2, 3].map(lvl => (
                                        <View
                                            key={lvl}
                                            className="flex-1 h-1.5 rounded-full"
                                            style={{
                                                backgroundColor: strength.level >= lvl ? strength.color : '#E2E8F0'
                                            }}
                                        />
                                    ))}
                                </View>
                                <Text className="text-xs font-semibold" style={{ color: strength.color }}>
                                    Contraseña {strength.label}
                                </Text>
                            </View>
                        )}

                        {/* ── Campo: Confirmar contraseña ──────────────── */}
                        <Text className="text-slate-800 font-bold text-sm mb-1.5 mt-1">
                            Confirmar Contraseña
                        </Text>
                        <View
                            className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                            style={{
                                borderWidth: 1,
                                borderColor: confirmError ? '#EF4444' : '#E2E8F0',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="lock-check-outline"
                                size={20}
                                color={confirmError ? '#EF4444' : '#94A3B8'}
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-medium p-0"
                                value={vm.confirmarPassword}
                                onChangeText={handleConfirmChange}
                                onBlur={handleConfirmBlur}
                                placeholder="Vuelve a ingresar tu contraseña"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showConfirm}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="pl-2">
                                <MaterialCommunityIcons
                                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Hint o error de confirmación */}
                        <FieldFeedback
                            error={confirmError}
                            hint="Debe ser identica a la contraseña que escribiste arriba"
                        />

                        {/* ── Botón: Cambiar contraseña ────────────────── */}
                        <TouchableOpacity
                            className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg w-full mt-2 ${vm.isLoading
                                ? 'bg-blue-400'
                                : isFormReady
                                    ? 'bg-[#0038FF] active:bg-blue-700 shadow-blue-500/30'
                                    : 'bg-slate-300'
                                }`}
                            onPress={handleSubmit}
                            disabled={vm.isLoading}
                        >
                            {vm.isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className={`font-bold text-base ${isFormReady ? 'text-white' : 'text-slate-400'}`}>
                                    Cambiar Contraseña
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
