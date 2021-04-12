/**
 * Generic upgrade class
 */
import {Saveable} from "@/ig-template/tools/saving/Saveable";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {UpgradeSaveData} from "@/ig-template/tools/upgrades/UpgradeSaveData";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {DecimalValue} from "@/lib/DecimalValueType";
import Decimal from "@/lib/break_eternity.min";

export abstract class AbstractUpgrade implements Saveable {
    id: UpgradeId;
    type: UpgradeType;
    displayName: string;
    maxLevel: Decimal;
    level: Decimal;

    protected constructor(id: UpgradeId, type: UpgradeType, displayName: string, maxLevel: DecimalValue) {
        this.id = id;
        this.type = type;
        this.displayName = displayName;
        this.maxLevel = new Decimal(maxLevel);
        this.level = new Decimal(0);
    }

    abstract getCost(): Currency;

    getBonus(): Decimal {
        return this.getBonusForLevel(this.level);
    }

    abstract getBonusForLevel(level: Decimal): Decimal;

    getUpgradeBonus(): Decimal {
        if (!this.isMaxLevel()) {
            return this.getBonusForLevel(this.level.add(1)).sub(this.getBonusForLevel(this.level));
        }
        return new Decimal(0);
    }

    isMaxLevel(): boolean {
        return this.level.gte(this.maxLevel);
    }

    canAfford(wallet: Wallet): boolean {
        return wallet.hasCurrency(this.getCost());
    }

    // Override in subclass when other requirements exist.
    canBuy(wallet: Wallet): boolean {
        return this.level.lt(this.maxLevel) && this.canAfford(wallet);
    }

    buy(wallet: Wallet): boolean {
        if (!this.canBuy(wallet)) {
            return false;
        }

        wallet.loseCurrency(this.getCost());
        this.levelUp();
        return true;
    }

    levelUp(): void {
        this.level = this.level.add(1);
    }


    // Save logic
    saveKey: string = this.id;

    load(data: UpgradeSaveData): void {
        this.level = Decimal.fromString(data.level);
    }

    save(): UpgradeSaveData {
        return {
            'id': this.id,
            'level': this.level.toString(),
        }
    }

}