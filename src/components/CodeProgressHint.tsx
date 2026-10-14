import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CodeProgressHintProps {
    readonly digits: readonly string[];
}

export function CodeProgressHint({ digits }: CodeProgressHintProps) {
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
                    : `${filled} de 4 digitos ingresados`}
            </Text>
        </View>
    );
}
