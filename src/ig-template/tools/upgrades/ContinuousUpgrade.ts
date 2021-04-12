import {AbstractUpgrade} from "@/ig-template/tools/upgrades/AbstractUpgrade";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {DecimalValue} from "@/lib/DecimalValueType";
import Decimal from "@/lib/break_eternity.min";

export class ContinuousUpgrade extends AbstractUpgrade {
    bonusFunc: (level: Decimal) => Decimal;
    costFunc: (level: Decimal) => Currency;


    constructor(id: UpgradeId, type: UpgradeType, displayName: string, maxLevel: DecimalValue, bonusFunc: (level: Decimal) => Decimal, costFunc: (level: Decimal) => Currency) {
        super(id, type, displayName, maxLevel);
        this.bonusFunc = bonusFunc;
        this.costFunc = costFunc;
    }

    getBonusForLevel(level: Decimal): Decimal {
        return this.bonusFunc(level);
    }

    getCost(): Currency {
        return this.costFunc(this.level);
    }

}