import Decimal from "@/lib/break_eternity.min";
import {DecimalValue} from "@/lib/DecimalValueType";

export class NumberFormatter {

    static format(value: DecimalValue, places: number = 2): string {
        value = new Decimal(value);
        if (isNaN(value.sign) || isNaN(value.layer) || isNaN(value.mag)) {
            return "NaN";
        }
        if (value.sign < 0) {
            return "-" + NumberFormatter.format(value.neg(), places);
        }
        if (value.mag === Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (value.gte("eeee1000")) {
            const slog = value.slog();
            if (slog.gte(1e6)) {
                return "F" + NumberFormatter.format(slog.floor());
            } else {
                return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + NumberFormatter.commaFormat(slog.floor(), 0);
            }
        } else if (value.gte("1e100000")) {
            return NumberFormatter.exponentialFormat(value, 0, false);
        } else if (value.gte("1e1000")) {
            return NumberFormatter.exponentialFormat(value, 0);
        } else if (value.gte(1e9)) {
            return NumberFormatter.exponentialFormat(value, places);
        } else if (value.gte(1e3)) {
            return NumberFormatter.commaFormat(value, 0);
        } else {
            return NumberFormatter.regularFormat(value, places);
        }
    }

    static formatWhole(value: DecimalValue): string {
        value = new Decimal(value);
        if (value.sign < 0) {
            return "-" + NumberFormatter.formatWhole(value.neg());
        }
        if (value.gte(1e9)) {
            return NumberFormatter.format(value, 2);
        }
        if (value.lte(0.98) && !value.eq(0)) {
            return NumberFormatter.format(value, 2);
        }
        return NumberFormatter.format(value, 0);
    }

    static exponentialFormat(value: DecimalValue, places: number = 2, mantissa: boolean = true): string {
        value = new Decimal(value);
        let e = value.log10().floor();
        let m = value.div(Decimal.pow(10, e));
        if(m.toStringWithDecimalPlaces(places) === "10") {
            m = new Decimal(1);
            e = e.add(1);
        }
        const exp = NumberFormatter.commaFormat(e);
        if (mantissa) {
            return m.toStringWithDecimalPlaces(places) + "e" + exp;
        } else {
            return "e" + exp;
        }
    }

    static commaFormat(value: DecimalValue, places: number | undefined = undefined): string {
        if (value === null || value === undefined) {
            return "NaN";
        }
        value = new Decimal(value);
        if (value.mag < 0.001) {
            return (0).toFixed(places);
        }
        if (places === undefined) {
            if (value.layer > 1) {
                const firstPart = Decimal.fromComponents(value.sign, value.layer, Math.floor(value.mag));
                const secondPart = Decimal.fromComponents(value.sign, 0, value.mag - firstPart.mag);
                return firstPart.floor().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + secondPart.toStringWithDecimalPlaces(2).substr(1);
            }
            return value.floor().toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
        return value.toStringWithDecimalPlaces(places).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    static regularFormat(value: DecimalValue, places: number = 2): string {
        if (value === null || value === undefined) {
            return "NaN";
        }
        value = new Decimal(value);
        if (value.eq(0)) {
            return (0).toFixed(places);
        }
        if (value.mag < 0.001) {
            return value.toExponential(places);
        }
        return value.toStringWithDecimalPlaces(places);
    }
}