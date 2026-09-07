export type ValidationResult = {
    success: boolean;   // true ako je SHA-256 ispravan i lanac netaknut
    message?: string;   // i poruka o grešci ako postoji
}