import React, { useState, useRef } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthRepository } from '../models/repositories/AuthRepository';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VerifyAccountScreen() {
    const { correo } = useLocalSearchParams<{ correo: string }>();
    const router = useRouter();
    const [digits, setDigits] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        const newDigits = [...digits];
        newDigits[index] = text.replace(/[^0-9]/g, '');
        setDigits(newDigits);
        if (text && index < 3) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const codigo = digits.join('');
        if (codigo.length < 4) {
            setError('Ingresa los 4 dígitos del código.');
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await AuthRepository.verifyAccount(correo, codigo);
            setSuccess('¡Cuenta verificada! Redirigiendo al inicio de sesión...');
            setTimeout(() => router.replace('/login' as any), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError(null);
        try {
            await AuthRepository.resendVerification(correo);
            setSuccess('Se envió un nuevo código a tu correo.');
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsResending(false);
        }
    };

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
                    {/* Top Circle Badge */}
                    <View className="w-20 h-20 bg-[#2A1728] rounded-full items-center justify-center mb-6 border-4 border-white shadow-lg shadow-pink-500/10">
                        <MaterialCommunityIcons name="email-check-outline" size={38} color="#F43F5E" />
                    </View>

                    {/* Title & Subtitle */}
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-1">
                        Verificar Cuenta
                    </Text>
                    <Text className="text-slate-500 text-sm text-center mb-1">
                        Enviamos un código de 4 dígitos a
                    </Text>
                    {correo ? (
                        <Text className="text-[#0038FF] font-bold text-center mb-6">{correo}</Text>
                    ) : (
                        <View className="mb-4" />
                    )}

                    {/* Feedback Messages */}
                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 w-full">
                            <Text className="text-red-600 text-center font-medium text-xs">{error}</Text>
                        </View>
                    )}
                    {success && (
                        <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 w-full">
                            <Text className="text-emerald-700 text-center font-medium text-xs">{success}</Text>
                        </View>
                    )}

                    {/* ── Cajitas de 4 dígitos ──────────────────────── */}
                    <View className="flex-row justify-center gap-3 mb-2 mt-2">
                        {digits.map((digit, i) => (
                            <TextInput
                                key={i}
                                ref={(ref) => { if (ref) inputs.current[i] = ref; }}
                                className="w-16 h-16 bg-white rounded-2xl text-slate-800 text-2xl font-bold text-center shadow-sm"
                                style={{
                                    borderWidth: 2,
                                    borderColor: digit ? '#0038FF' : '#E2E8F0',
                                    backgroundColor: digit ? '#F0F4FF' : '#FFFFFF',
                                }}
                                value={digit}
                                onChangeText={(text) => handleChange(text, i)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* ── Hint dinámico: progreso o error ──────────────── */}
                    {(() => {
                        const filled = digits.filter(d => d !== '').length;
                        if (filled === 4) {
                            return (
                                <View className="flex-row items-center justify-center gap-1 mt-2 mb-10">
                                    <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
                                    <Text className="text-emerald-600 text-xs font-semibold">
                                        Codigo completo, listo para verificar
                                    </Text>
                                </View>
                            );
                        }
                        return (
                            <View className="flex-row items-center justify-center gap-1 mt-2 mb-10">
                                <MaterialCommunityIcons name="information-outline" size={14} color="#94A3B8" />
                                <Text className="text-slate-400 text-xs">
                                    {filled === 0
                                        ? 'Ingresa los 4 digitos del codigo'
                                        : filled + ' de 4 digitos ingresados'}
                                </Text>
                            </View>
                        );
                    })()}

                    {/* Verify Button */}
                    {(() => {
                        const isComplete = digits.every(d => d !== '');
                        return (
                            <TouchableOpacity
                                className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg w-full mb-6 ${isLoading
                                        ? 'bg-blue-400'
                                        : isComplete
                                            ? 'bg-[#0038FF] active:bg-blue-700 shadow-blue-500/30'
                                            : 'bg-slate-300'
                                    }`}
                                onPress={handleVerify}
                                disabled={isLoading || !isComplete}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className={`font-bold text-base ${isComplete ? 'text-white' : 'text-slate-400'}`}>
                                        Verificar cuenta
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })()}

                    {/* Resend Link */}
                    <TouchableOpacity onPress={handleResend} disabled={isResending}>
                        <Text className="text-slate-500 text-sm font-medium">
                            ¿No te llegó el correo?{' '}
                            <Text className="text-[#0038FF] font-bold underline">
                                {isResending ? 'Enviando...' : 'Reenviar código'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

