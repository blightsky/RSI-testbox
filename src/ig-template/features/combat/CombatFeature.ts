import {Features} from "@/ig-template/Features";
import {UpgradesFeature} from "@/ig-template/features/UpgradesFeature";
import {CombatAction} from "@/ig-template/tools/actions/CombatAction";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {ContinuousUpgrade} from "@/ig-template/tools/upgrades/ContinuousUpgrade";
import {KeyItems} from "@/ig-template/features/key-items/KeyItems";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import Decimal from "@/lib/break_eternity.min";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import {CombatFeatureSaveData} from "@/ig-template/features/combat/CombatFeatureSaveData";
import {App} from "@/App";

export class CombatFeature extends UpgradesFeature {

    _keyItems: KeyItems = null as unknown as KeyItems;

    combatAction = undefined as unknown as CombatAction;

    stronger: ContinuousUpgrade = null as unknown as ContinuousUpgrade;
    efficiency: ContinuousUpgrade = null as unknown as ContinuousUpgrade;
    mass: ContinuousUpgrade = null as unknown as ContinuousUpgrade;

    constructor() {
        super('combat-feature');
    }

    initialize(features: Features) {
        this._wallet = features.wallet;
        this._keyItems = features.keyItems;

        this.combatAction = new CombatAction(features.wallet, this, "Destroy a voidling", () => new Decimal(5).divide(this.efficiency.getBonus()).toNumber(), amount => Decimal.pow(Decimal.times(.1, this.stronger.getBonus()).add(1), amount).div(this.stronger.getBonus()), () => this.mass.getBonus());
        this.combatAction.onCompletion.sub((completions) => {
            this._wallet.gainCurrency(new Currency(completions, CurrencyType.VoidBatteries));
            this._wallet.gainCurrency(new Currency(completions.neg(), CurrencyType.Voidlings));
            const killedVoidlings = Decimal.sub(1e6, this._wallet.getAmount(CurrencyType.Voidlings)).add(1);
            if (killedVoidlings.gte(1)) {
                this._keyItems.gainKeyItem(KeyItemId.Factory);
            }
            if (killedVoidlings.gte(10)) {
                this._keyItems.gainKeyItem(KeyItemId.Wheel);
            }
            if (killedVoidlings.gte(100)) {
                this._keyItems.gainKeyItem(KeyItemId.StrongerWeapons);
            }
            if (killedVoidlings.gte(500)) {
                this._keyItems.gainKeyItem(KeyItemId.CombatEfficiency);
            }
            if (killedVoidlings.gte(1000)) {
                this._keyItems.gainKeyItem(KeyItemId.WheelOfFortune);
            }
            if (killedVoidlings.gte(2500)) {
                this._keyItems.gainKeyItem(KeyItemId.WheelOfButter);
                App.game.features.wheel.spin();
            }
            if (killedVoidlings.gte(10000)) {
                this._keyItems.gainKeyItem(KeyItemId.Synergy);
            }
            if (killedVoidlings.gte(100000)) {
                this._keyItems.gainKeyItem(KeyItemId.MassMurder);
            }
            if (killedVoidlings.gte(1000000)) {
                this._keyItems.gainKeyItem(KeyItemId.Victory);
                App.game.pause();
            }
        });

        this.stronger = new ContinuousUpgrade(
            UpgradeId.StrongerWeapons,
            UpgradeType.VoidBatteries,
            'Stronger Weapons',
            10,
            (level) => {
                return Decimal.pow(.6, level);
            }, (level) => {
                return new Currency(Decimal.pow(10, level.add(2)), CurrencyType.VoidBatteries);
            }
        );
        this.efficiency = new ContinuousUpgrade(
            UpgradeId.CombatEfficiency,
            UpgradeType.Nanobots,
            'Combat efficiency',
            5,
            (level) => {
                return Decimal.pow(2, level);
            }, (level) => {
                return new Currency(Decimal.pow(100, level.add(5)), CurrencyType.CombatBots);
            }
        );
        this.mass = new ContinuousUpgrade(
            UpgradeId.MassMurder,
            UpgradeType.VoidBatteries,
            'Mass Murder',
            5,
            (level) => {
                return Decimal.pow(2, level);
            }, (level) => {
                return new Currency(Decimal.pow(10, level.add(3)), CurrencyType.VoidBatteries);
            }
        );

        this.upgrades = [
            this.stronger,
            this.efficiency,
            this.mass
        ]
    }

    update(delta: number) {
        this.combatAction.perform(delta);
    }

    save(): CombatFeatureSaveData {
        return {
            ...super.save(),
            combatProgress: this.combatAction.currentProgress,
            combatStarted: this.combatAction.isStarted
        };
    }

    load(data: CombatFeatureSaveData) {
        super.load(data);
        this.combatAction.currentProgress = data.combatProgress ? data.combatProgress : 0;
        this.combatAction.isStarted = data.combatStarted;
    }
}
