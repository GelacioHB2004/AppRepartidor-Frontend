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
import { useLocalSearchParams } from 'expo-router';
import { useRecoveryViewModel } from '../viewmodels/useRecoveryViewModel';
import { AuthRepository } from '../models/repositories/AuthRepository';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CodeProgressHint } from '../components/CodeProgressHint';
import { OtpDigitsInput } from '../components/OtpDigitsInput';

export default function VerifyRecoveryScreen() {
    const { correo } = useLocalSearchParams<{ correo: string }>();
    const vm = useRecoveryViewModel();
    const [digits, setDigits] = useState(['', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [resendMsg, setResendMsg] = useState<string | null>(null);

    const handleVerify = () => {
        const codigo = digits.join('');
        if (codigo.length < 4) {
            return;
        }
        void vm.handleVerifyRecovery(correo, codigo);
    };

    const handleResend = async () => {
        setIsResending(true);
        setResendMsg(null);
        try {
            await AuthRepository.requestRecovery(correo);
            setResendMsg('Se envió un nuevo código a tu correo.');
            setTimeout(() => setResendMsg(null), 4000);
        } catch (err: any) {
            setResendMsg(err.message);
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
                    {/* Top Circle Shield Badge */}
                    <View className="w-20 h-20 bg-[#1A1F36] rounded-full items-center justify-center mb-6 border-4 border-white shadow-lg shadow-indigo-500/10">
                        <MaterialCommunityIcons name="shield-key-outline" size={38} color="#818CF8" />
                    </View>

                    {/* Title & Subtitle */}
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-1">
                        Ingresar el código
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
                    {vm.error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 w-full">
                            <Text className="text-red-600 text-center font-medium text-xs">{vm.error}</Text>
                        </View>
                    )}
                    {resendMsg && (
                        <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 w-full">
                            <Text className="text-emerald-700 text-center font-medium text-xs">{resendMsg}</Text>
                        </View>
                    )}

                    {/* ── Cajitas de 4 dígitos ──────────────────────── */}
                    <OtpDigitsInput digits={digits} setDigits={setDigits} keyPrefix="rec" />

                    {/* ── Hint dinámico de progreso ───────────────────── */}
                    <CodeProgressHint digits={digits} />

                    {/* ── Botón Verificar código ─────────────────────── */}
                    {(() => {
                        const isComplete = digits.every(d => d !== '');
                        let btnBg = 'bg-slate-300';
                        if (vm.isLoading) {
                            btnBg = 'bg-blue-400';
                        } else if (isComplete) {
                            btnBg = 'bg-[#0038FF] active:bg-blue-700 shadow-blue-500/30';
                        }

                        return (
                            <TouchableOpacity
                                className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg w-full mb-6 ${btnBg}`}
                                onPress={handleVerify}
                                disabled={vm.isLoading || !isComplete}
                            >
                                {vm.isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className={`font-bold text-base ${isComplete ? 'text-white' : 'text-slate-400'}`}>
                                        Verificar codigo
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })()}

                    {/* Resend Link */}
                    <TouchableOpacity onPress={handleResend} disabled={isResending}>
                        <Text className="text-slate-500 text-sm font-medium">
                            ¿No llegó?{' '}
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