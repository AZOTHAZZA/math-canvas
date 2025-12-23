/**
 * LogosDecimal.js
 * LVM(Logos Logic Engine) Absolute Precision Arithmetic
 * 38-decimal fixed-point math using native BigInt.
 */
export class LogosDecimal {
    static SCALE = 38n;
    static BASE = 10n ** LogosDecimal.SCALE;

    constructor(value, isRaw = false) {
        if (isRaw) {
            this.value = BigInt(value);
        } else {
            this.value = this._toBigInt(value.toString());
        }
    }

    _toBigInt(str) {
        if (!str.includes('.')) {
            return BigInt(str) * LogosDecimal.BASE;
        }
        const [integer, fraction] = str.split('.');
        const paddedFraction = fraction.padEnd(Number(LogosDecimal.SCALE), "0").slice(0, Number(LogosDecimal.SCALE));
        return BigInt(integer) * LogosDecimal.BASE + BigInt(paddedFraction);
    }

    add(other) { return new LogosDecimal(this.value + other.value, true); }
    sub(other) { return new LogosDecimal(this.value - other.value, true); }
    mul(other) { return new LogosDecimal((this.value * other.value) / LogosDecimal.BASE, true); }
    div(other) { return new LogosDecimal((this.value * LogosDecimal.BASE) / other.value, true); }

    toString() {
        const s = this.value.toString().padStart(Number(LogosDecimal.SCALE) + 1, "0");
        const isNegative = s.startsWith('-');
        const absoluteS = isNegative ? s.slice(1) : s;
        const pos = absoluteS.length - Number(LogosDecimal.SCALE);
        let result = `${absoluteS.slice(0, pos)}.${absoluteS.slice(pos)}`;
        result = result.replace(/\.?0+$/, "");
        if (result.startsWith('.')) result = "0" + result;
        return isNegative ? "-" + result : result || "0";
    }
}
