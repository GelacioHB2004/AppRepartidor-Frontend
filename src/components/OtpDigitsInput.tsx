import React, { useRef } from 'react';
import { View, TextInput } from 'react-native';

interface OtpDigitsInputProps {
    readonly digits: string[];
    readonly setDigits: (digits: string[]) => void;
    readonly keyPrefix: string;
}

export function OtpDigitsInput({ digits, setDigits, keyPrefix }: OtpDigitsInputProps) {
    const inputs = useRef<TextInput[]>([]);

    const handleChange = (text: string, index: number) => {
        const newDigits = [...digits];
        newDigits[index] = text.replace(/\D/g, '');
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

    return (
        <View className="flex-row justify-center gap-3 mb-2 mt-2">
            {digits.map((digit, i) => (
                <TextInput
                    key={`${keyPrefix}-${i}`}
                    ref={(ref) => { if (ref) inputs.current[i] = ref; }}
                    className="w-16 h-16 bg-white rounded-2xl text-slate-800 text-2xl font-bold text-center shadow-sm"
                    style={{
                        borderWidth: 2,
                        borderColor: digit ? '#0038FF' : '#E2E8F0',
                        backgroundColor: digit ? '#F0F4FF' : '#FFFFFF',
                        textAlign: 'center',
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
    );
}
