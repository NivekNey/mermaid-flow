const isBrowser = typeof window !== 'undefined';

class ThemeStore {
    isDark = $state(true);

    constructor() {
        if (isBrowser) {
             // Logic to check system preference could go here
             this.apply();
        }
    }

    toggle = () => {
        this.isDark = !this.isDark;
        this.apply();
    }

    set(dark: boolean) {
        this.isDark = dark;
        this.apply();
    }

    apply() {
        if (!isBrowser) return;
        if (this.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}

export const theme = new ThemeStore();