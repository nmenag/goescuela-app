import { LucideIcon } from "lucide-react-native";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  title,
  onPress,
  icon: Icon,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-blue-500 dark:bg-blue-600",
    secondary: "bg-gray-500 dark:bg-gray-600",
    outline: "border border-gray-300 dark:border-gray-600",
  };

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textColorClass =
    variant === "outline" ? "text-gray-900 dark:text-white" : "text-white";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-lg flex-row items-center justify-center gap-2 ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {Icon && (
        <Icon size={20} color="currentColor" className={textColorClass} />
      )}
      <Text className={`font-semibold ${textColorClass}`}>{title}</Text>
    </Pressable>
  );
}
