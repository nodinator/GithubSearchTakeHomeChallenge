import { EdgeInsets } from 'react-native-safe-area-context';

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
export const insetCalc = (insets: EdgeInsets) => ({
    paddingTop: Math.max(insets.top, 16),
    paddingBottom: Math.max(insets.bottom, 16),
    paddingLeft: Math.max(insets.left, 16),
    paddingRight: Math.max(insets.right, 16),
});

export function processShortName(fullName: string): string {
    const lastSlashIndex = fullName.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
        return fullName.slice(lastSlashIndex + 1);
    }
    return fullName;
}