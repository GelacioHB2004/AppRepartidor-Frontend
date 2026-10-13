import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FieldFeedbackProps {
    readonly error: string | null;
    readonly hint: string;
}

export function FieldFeedback({ error, hint }: FieldFeedbackProps) {
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
