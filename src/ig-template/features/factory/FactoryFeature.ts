import {UpgradesFeature} from "@/ig-template/features/UpgradesFeature";
import {ContinuousUpgrade} from "@/ig-template/tools/upgrades/ContinuousUpgrade";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import Decimal from "@/lib/break_eternity.min";
import {FactoryFeatureSaveData} from "@/ig-template/features/factory/FactoryFeatureSaveData";

export class FactoryFeature extends UpgradesFeature {

    factory: ContinuousUpgrade;
    factorySquared: ContinuousUpgrade;
    factoryCubed: ContinuousUpgrade;
    factoryTesseracted: ContinuousUpgrade;
    synergy: ContinuousUpgrade;

    factories: Decimal = new Decimal(0);
    factoriesSquared: Decimal = new Decimal(0);
    factoriesCubed: Decimal = new Decimal(0);

    constructor() {
        super('factory-feature');

        this.factory = new ContinuousUpgrade(
            UpgradeId.Factory,
            UpgradeType.VoidBatteries,
            'Nanobots Factory',
            Infinity,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(5, level), CurrencyType.VoidBatteries);
            }
        );
        this.factorySquared = new ContinuousUpgrade(
            UpgradeId.FactorySquared,
            UpgradeType.VoidBatteries,
            'Nanobots Factory Squared',
            Infinity,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(10, level.add(2)), CurrencyType.VoidBatteries);
            }
        );
        this.factoryCubed = new ContinuousUpgrade(
            UpgradeId.FactoryCubed,
            UpgradeType.VoidBatteries,
            'Nanobots Factory Cubed',
            Infinity,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(20, level.add(3)), CurrencyType.VoidBatteries);
            }
        );
        this.factoryTesseracted = new ContinuousUpgrade(
            UpgradeId.FactoryTesseracted,
            UpgradeType.VoidBatteries,
            'Nanobots Factory Tesseracted',
            Infinity,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(40, level.add(4)), CurrencyType.VoidBatteries);
            }
        );
        this.synergy = new ContinuousUpgrade(
            UpgradeId.Synergy,
            UpgradeType.VoidBatteries,
            'Synergize all factories',
            10,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(1e3, level.add(2)), CurrencyType.VoidBatteries);
            }
        );

        this.upgrades = [
            this.factory,
            this.factorySquared,
            this.factoryCubed,
            this.factoryTesseracted,
            this.synergy
        ];
    }

    update(delta: number) {
        const synergy = this.synergy.getBonus();

        const factoriesTesseractedBonus = this.factoryTesseracted.getBonus().pow(synergy).sub(1);
        this.factoriesCubed = this.factoriesCubed.add(factoriesTesseractedBonus.times(delta).times(Decimal.pow(2, factoriesTesseractedBonus)));

        const factoriesCubedBonus = this.factoryCubed.getBonus().pow(synergy).sub(1);
        this.factoriesSquared = this.factoriesSquared.add(this.factoriesCubed.add(factoriesCubedBonus).times(delta).times(Decimal.pow(2, factoriesCubedBonus)));

        const factoriesSquaredBonus = this.factorySquared.getBonus().pow(synergy).sub(1);
        this.factories = this.factories.add(this.factoriesSquared.add(factoriesSquaredBonus).times(delta).times(Decimal.pow(2, factoriesSquaredBonus)));

        const factoriesBonus = this.factory.getBonus().pow(synergy).sub(1);
        this._wallet.gainCurrency(new Currency(this.factories.add(factoriesBonus).times(delta).times(Decimal.pow(2, factoriesBonus)), CurrencyType.CombatBots));
    }

    save(): FactoryFeatureSaveData {
        return {
            ...super.save(),
            factories: this.factories.toString(),
            factoriesSquared: this.factoriesSquared.toString(),
            factoriesCubed:this.factoriesCubed.toString()
        };
    }

    load(data: FactoryFeatureSaveData) {
        super.load(data);
        this.factories = data.factories ? Decimal.fromString(data.factories) : new Decimal(0);
        this.factoriesSquared = data.factoriesSquared ? Decimal.fromString(data.factoriesSquared) : new Decimal(0);
        this.factoriesCubed = data.factoriesCubed ? Decimal.fromString(data.factoriesCubed) : new Decimal(0);
    }
}
