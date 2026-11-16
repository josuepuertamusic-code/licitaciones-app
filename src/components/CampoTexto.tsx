import { Text, TextInput, type TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  etiqueta: string;
  error?: string | null;
}

export function CampoTexto({ etiqueta, error, ...resto }: Props) {
  return (
    <View className="mb-4">
      <Text className="font-body text-[10px] uppercase tracking-widest text-muted">{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        placeholderTextColor="#8A8A85"
        className={`min-h-11 border-b px-0 font-body text-base text-ink ${error ? "border-danger" : "border-line"}`}
        {...resto}
      />
      {error ? <Text className="mt-1 font-body text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
