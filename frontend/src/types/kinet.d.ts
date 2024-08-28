// src/types/kinet.d.ts
declare module 'kinet' {
    interface KinetOptions {
        acceleration: number;
        friction: number;
        names: string[];
    }

    class Kinet {
        constructor(options: KinetOptions);
        on(event: string, callback: (instances: any) => void): void;
        animate(name: string, value: number): void;
    }

    export default Kinet;
}
