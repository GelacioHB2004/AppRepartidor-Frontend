import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRegisterViewModel } from '../viewmodels/useRegisterViewModel';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Helpers de validación ──────────────────────────────────────────────────
// Solo letras (mayúsculas, minúsculas, tildes, ñ) y espacios
const LETTERS_REGEX = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
// Correo: letras/números/._+- antes del @, dominio válido, extensión mín. 2 letras
const EMAIL_REGEX = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\d{10}$/;

// Filtra caracteres no permitidos en nombre/apellidos
const filterLetters = (v: string) => v.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');

function validateNombre(v: string): string | null {
    if (!v.trim()) return 'El nombre es obligatorio.';
    if (v.trim().length < 2) return 'Debe tener al menos 2 caracteres.';
    if (!LETTERS_REGEX.test(v.trim())) return 'Solo se permiten letras y espacios.';
    return null;
}

function validateApellidoP(v: string): string | null {
    if (!v.trim()) return 'El apellido paterno es obligatorio.';
    if (v.trim().length < 2) return 'Debe tener al menos 2 caracteres.';
    if (!LETTERS_REGEX.test(v.trim())) return 'Solo se permiten letras y espacios.';
    return null;
}

function validateApellidoM(v: string): string | null {
    if (!v.trim()) return 'El apellido materno es obligatorio.';
    if (v.trim().length < 2) return 'Debe tener al menos 2 caracteres.';
    if (!LETTERS_REGEX.test(v.trim())) return 'Solo se permiten letras y espacios.';
    return null;
}

function validateTelefono(v: string): string | null {
    if (!v.trim()) return 'El teléfono es obligatorio.';
    if (!PHONE_REGEX.test(v.replace(/\D/g, ''))) return 'Debe tener exactamente 10 dígitos.';
    return null;
}

function validateCorreo(v: string): string | null {
    if (!v.trim()) return 'El correo es obligatorio.';
    if (!EMAIL_REGEX.test(v)) return 'Formato inválido. Ejemplo: nombre@dominio.com';
    return null;
}

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

// ─── Fortaleza de contraseña ────────────────────────────────────────────────
function getPasswordStrength(v: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
    if (v.length === 0) return { level: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    if (score <= 1) return { level: 1, label: 'Débil', color: '#EF4444' };
    if (score === 2) return { level: 2, label: 'Media', color: '#F59E0B' };
    return { level: 3, label: 'Fuerte', color: '#10B981' };
}

// ─── Feedback de campo: muestra hint en gris o error en rojo ───────────────
function FieldFeedback({ error, hint }: { error: string | null; hint: string }) {
    if (error) {
        return (
            <View className="flex-row items-center mt-1.5 mb-1 px-1 gap-1">
                <MaterialCommunityIcons name="alert-circle-outline" size={13} color="#EF4444" />
                <Text className="text-red-500 text-xs font-medium flex-1">{error}</Text>
            </View>
        );
    }
    return (
        <View className="flex-row items-center mt-1.5 mb-1 px-1 gap-1">
            <MaterialCommunityIcons name="information-outline" size={13} color="#94A3B8" />
            <Text className="text-slate-400 text-xs flex-1">{hint}</Text>
        </View>
    );
}

// ─── Componente de input reutilizable ──────────────────────────────────────
interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    onBlur?: () => void;
    placeholder: string;
    hint: string;                      // Texto de ayuda siempre visible
    leftIcon?: string;
    keyboardType?: any;
    autoCapitalize?: any;
    secureTextEntry?: boolean;
    rightIcon?: string;
    onRightIcon?: () => void;
    hasError?: boolean;
    touched?: boolean;
    error?: string | null;
    maxLength?: number;
}

function InputField({
    label, value, onChangeText, onBlur, placeholder, hint,
    leftIcon = 'account-outline', keyboardType = 'default',
    autoCapitalize = 'words', secureTextEntry = false,
    rightIcon, onRightIcon, hasError = false, touched = false,
    error, maxLength
}: InputFieldProps) {
    const borderColor = hasError ? '#EF4444' : '#E2E8F0';
    const iconColor = hasError ? '#EF4444' : '#94A3B8';

    return (
        <View className="mb-1">
            <Text className="text-slate-800 font-bold text-sm mb-1.5">{label}</Text>
            <View
                className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                style={{ borderWidth: 1, borderColor }}
            >
                <MaterialCommunityIcons
                    name={leftIcon as any}
                    size={20}
                    color={iconColor}
                    style={{ marginRight: 10 }}
                />
                <TextInput
                    className="flex-1 text-slate-800 text-sm font-medium p-0"
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                />
                {/* Ícono de estado (solo si ya se tocó y no tiene rightIcon) */}
                {touched && !rightIcon && (
                    <MaterialCommunityIcons
                        name={hasError ? 'close-circle' : 'check-circle'}
                        size={18}
                        color={hasError ? '#EF4444' : '#10B981'}
                    />
                )}
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIcon} className="pl-2">
                        <MaterialCommunityIcons name={rightIcon as any} size={20} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>
            {/* Siempre muestra el hint; si hay error lo reemplaza en rojo */}
            <FieldFeedback error={error ?? null} hint={hint} />
        </View>
    );
}

// ─── Pantalla principal ─────────────────────────────────────────────────────
export default function RegisterScreen() {
    const router = useRouter();
    const vm = useRegisterViewModel();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Estado de errores individuales por campo
    const [errors, setErrors] = useState({
        nombre: null as string | null,
        apellidoP: null as string | null,
        apellidoM: null as string | null,
        telefono: null as string | null,
        correo: null as string | null,
        password: null as string | null,
        confirmPassword: null as string | null,
    });

    // Estado de campos tocados
    const [touched, setTouched] = useState({
        nombre: false, apellidoP: false, apellidoM: false,
        telefono: false, correo: false, password: false, confirmPassword: false,
    });

    // ── Helpers para actualizar un campo de errors/touched ──────────────────
    const setFieldError = (field: keyof typeof errors, msg: string | null) =>
        setErrors(prev => ({ ...prev, [field]: msg }));

    const setFieldTouched = (field: keyof typeof touched) =>
        setTouched(prev => ({ ...prev, [field]: true }));

    // ── Handlers de cambio en tiempo real ───────────────────────────────────
    const handleChange = (
        field: keyof typeof errors,
        setter: (v: string) => void,
        validator: (v: string) => string | null,
        value: string
    ) => {
        setter(value);
        if (touched[field]) setFieldError(field, validator(value));
    };

    // Casos especiales
    const handlePasswordChange = (v: string) => {
        vm.setPassword(v);
        if (touched.password) setFieldError('password', validatePassword(v));
        // Re-validar confirmación si ya se tocó
        if (touched.confirmPassword) setFieldError('confirmPassword', validateConfirm(vm.confirmPassword, v));
    };

    const handleConfirmChange = (v: string) => {
        vm.setConfirmPassword(v);
        if (touched.confirmPassword) setFieldError('confirmPassword', validateConfirm(v, vm.password));
    };

    // ── Handlers de blur ────────────────────────────────────────────────────
    const onBlur = (
        field: keyof typeof errors,
        validator: (v: string) => string | null,
        value: string
    ) => {
        setFieldTouched(field);
        setFieldError(field, validator(value));
    };

    // ── Submit con validación completa ───────────────────────────────────────
    const handleSubmit = () => {
        // Marcar todos como tocados
        const allTouched = Object.fromEntries(Object.keys(touched).map(k => [k, true])) as typeof touched;
        setTouched(allTouched);

        const newErrors = {
            nombre: validateNombre(vm.nombre),
            apellidoP: validateApellidoP(vm.apellidoP),
            apellidoM: validateApellidoM(vm.apellidoM),
            telefono: validateTelefono(vm.telefono),
            correo: validateCorreo(vm.correo),
            password: validatePassword(vm.password),
            confirmPassword: validateConfirm(vm.confirmPassword, vm.password),
        };
        setErrors(newErrors);

        // Si hay algún error de UI, no continuar
        if (Object.values(newErrors).some(e => e !== null)) return;

        // Sin errores de UI → delegar al ViewModel
        vm.handleRegister();
    };

    // ── Estado del botón ────────────────────────────────────────────────────
    const requiredFields = [vm.nombre, vm.apellidoP, vm.apellidoM, vm.telefono, vm.correo, vm.password, vm.confirmPassword];
    const isFormReady = requiredFields.every(f => f.trim().length > 0);

    // ── Fortaleza de contraseña ─────────────────────────────────────────────
    const strength = getPasswordStrength(vm.password);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#F8F9FD]"
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Header ───────────────────────────────────────────── */}
                <View className="items-center mb-6 w-full max-w-sm">
                    <Text className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">
                        Crear cuenta
                    </Text>
                    <Text className="text-slate-500 mt-1 text-sm text-center">
                        Únete como repartidor de Dulcería Angelitos
                    </Text>
                </View>

                {/* ── Tarjeta del formulario ────────────────────────────── */}
                <View className="bg-white p-6 rounded-[28px] shadow-xl shadow-slate-200/80 border border-slate-100/80 w-full max-w-sm">

                    {/* ── Error del servidor ────────────────────────────── */}
                    {vm.error && (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-start gap-2">
                            <MaterialCommunityIcons name="server-network-off" size={16} color="#DC2626" style={{ marginTop: 1 }} />
                            <Text className="text-red-600 font-medium text-xs flex-1">{vm.error}</Text>
                        </View>
                    )}

                    {/* ── Campos de nombre ─────────────────────────────── */}
                    <InputField
                        label="Nombre"
                        leftIcon="account-outline"
                        value={vm.nombre}
                        onChangeText={v => handleChange('nombre', vm.setNombre, validateNombre, filterLetters(v))}
                        onBlur={() => onBlur('nombre', validateNombre, vm.nombre)}
                        placeholder="Ej. Juan Carlos"
                        hint="Solo letras y espacios (sin números ni símbolos)"
                        touched={touched.nombre}
                        hasError={!!errors.nombre}
                        error={errors.nombre}
                    />

                    <InputField
                        label="Apellido Paterno"
                        leftIcon="account-outline"
                        value={vm.apellidoP}
                        onChangeText={v => handleChange('apellidoP', vm.setApellidoP, validateApellidoP, filterLetters(v))}
                        onBlur={() => onBlur('apellidoP', validateApellidoP, vm.apellidoP)}
                        placeholder="Ej. García"
                        hint="Solo letras y espacios (sin números ni símbolos)"
                        touched={touched.apellidoP}
                        hasError={!!errors.apellidoP}
                        error={errors.apellidoP}
                    />

                    <InputField
                        label="Apellido Materno"
                        leftIcon="account-outline"
                        value={vm.apellidoM}
                        onChangeText={v => handleChange('apellidoM', vm.setApellidoM, validateApellidoM, filterLetters(v))}
                        onBlur={() => onBlur('apellidoM', validateApellidoM, vm.apellidoM)}
                        placeholder="Ej. López"
                        hint="Solo letras y espacios (sin números ni símbolos)"
                        touched={touched.apellidoM}
                        hasError={!!errors.apellidoM}
                        error={errors.apellidoM}
                    />

                    {/* ── Teléfono ─────────────────────────────────────── */}
                    <InputField
                        label="Teléfono"
                        leftIcon="phone-outline"
                        value={vm.telefono}
                        onChangeText={v => {
                            const nums = v.replace(/\D/g, '');
                            handleChange('telefono', vm.setTelefono, validateTelefono, nums);
                        }}
                        onBlur={() => onBlur('telefono', validateTelefono, vm.telefono)}
                        placeholder="Ej. 5512345678"
                        hint="10 dígitos numéricos, sin espacios ni guiones"
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        maxLength={10}
                        touched={touched.telefono}
                        hasError={!!errors.telefono}
                        error={errors.telefono}
                    />

                    {/* ── Correo ───────────────────────────────────────── */}
                    <InputField
                        label="Correo Electrónico"
                        leftIcon="email-outline"
                        value={vm.correo}
                        onChangeText={v => handleChange('correo', vm.setCorreo, validateCorreo, v)}
                        onBlur={() => onBlur('correo', validateCorreo, vm.correo)}
                        placeholder="Ej. nombre@dominio.com"
                        hint="Formato: letras, números, puntos o guiones antes del @"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        touched={touched.correo}
                        hasError={!!errors.correo}
                        error={errors.correo}
                    />

                    {/* ── Contraseña + indicador de fortaleza ─────────── */}
                    <View className="mb-1">
                        <Text className="text-slate-800 font-bold text-sm mb-1.5">Contraseña</Text>
                        <View
                            className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                            style={{ borderWidth: 1, borderColor: errors.password ? '#EF4444' : '#E2E8F0' }}
                        >
                            <MaterialCommunityIcons
                                name="lock-outline" size={20}
                                color={errors.password ? '#EF4444' : '#94A3B8'}
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-medium p-0"
                                value={vm.password}
                                onChangeText={handlePasswordChange}
                                onBlur={() => { setFieldTouched('password'); setFieldError('password', validatePassword(vm.password)); }}
                                placeholder="Mín. 8 caracteres"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-2">
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20} color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>
                        {/* Hint o error de contraseña */}
                        <FieldFeedback
                            error={errors.password}
                            hint="Mín. 8 caracteres. Puedes usar letras, números y símbolos"
                        />

                        {/* Barra de fortaleza */}
                        {vm.password.length > 0 && (
                            <View className="mt-1 mb-1">
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
                    </View>

                    {/* ── Confirmar contraseña ─────────────────────────── */}
                    <View className="mb-3">
                        <Text className="text-slate-800 font-bold text-sm mb-1.5">Confirmar contraseña</Text>
                        <View
                            className="flex-row items-center bg-[#F8FAFC] rounded-2xl px-4 py-3.5"
                            style={{ borderWidth: 1, borderColor: errors.confirmPassword ? '#EF4444' : '#E2E8F0' }}
                        >
                            <MaterialCommunityIcons
                                name="lock-check-outline" size={20}
                                color={errors.confirmPassword ? '#EF4444' : '#94A3B8'}
                                style={{ marginRight: 10 }}
                            />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-medium p-0"
                                value={vm.confirmPassword}
                                onChangeText={handleConfirmChange}
                                onBlur={() => { setFieldTouched('confirmPassword'); setFieldError('confirmPassword', validateConfirm(vm.confirmPassword, vm.password)); }}
                                placeholder="Vuelve a ingresar tu contraseña"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={!showConfirm}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="pl-2">
                                <MaterialCommunityIcons
                                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                                    size={20} color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>
                        <FieldFeedback
                            error={errors.confirmPassword}
                            hint="Debe ser idéntica a la contraseña que escribiste arriba"
                        />
                    </View>

                    {/* ── Botón de submit ───────────────────────────────── */}
                    <TouchableOpacity
                        className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg mt-1 ${vm.isLoading
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
                                Crear mi cuenta
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ── Link de login ─────────────────────────────────────── */}
                <View className="mt-6 mb-6 items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-slate-500 text-sm font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Text className="text-[#0038FF] font-bold">Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
