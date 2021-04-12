import {WeightedDistribution} from "@/ig-template/tools/probability/WeightedDistribution";
import Decimal from "@/lib/break_eternity.min";
import {Random} from "@/ig-template/tools/probability/Random";
import {WheelFeatureSaveData} from "@/ig-template/features/wheel/WheelFeatureSaveData";
import {WheelOutcome} from "@/ig-template/features/wheel/WheelOutcome";
import {UpgradesFeature} from "@/ig-template/features/UpgradesFeature";
import {ContinuousUpgrade} from "@/ig-template/tools/upgrades/ContinuousUpgrade";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import {App} from "@/App";

export class WheelFeature extends UpgradesFeature {

    initial: number = 0;
    progress: number = 0;
    target: number = 0;
    spins: Decimal = new Decimal(-1);
    distribution: WeightedDistribution<WheelOutcome>;
    multispin: ContinuousUpgrade = null as unknown as ContinuousUpgrade;
    grease: ContinuousUpgrade = null as unknown as ContinuousUpgrade;

    constructor(distribution: WeightedDistribution<WheelOutcome>) {
        super('wheel');
        this.distribution = distribution;

        this.multispin = new ContinuousUpgrade(
            UpgradeId.MultiSpin,
            UpgradeType.Nanobots,
            'Multi Spin',
            25,
            (level) => {
                return level.add(1);
            }, (level) => {
                return new Currency(Decimal.pow(10, level.add(10)), CurrencyType.CombatBots);
            }
        );
        this.grease = new ContinuousUpgrade(
            UpgradeId.Grease,
            UpgradeType.VoidBatteries,
            'Grease',
            5,
            (level) => {
                return Decimal.pow(2, level);
            }, (level) => {
                return new Currency(Decimal.pow(10, level.add(4)), CurrencyType.VoidBatteries);
            }
        );

        this.upgrades = [
            this.multispin,
            this.grease
        ]
    }

    spin() {
        if (this.spins.neq(0) && !this.isSpinning()) {
            this.initial = this.current;
            this.progress = 0;
            this.target = Random.floatBetween(2, 4);
            this.spins = this.spins.sub(1);
        }
    }

    isSpinning(): boolean {
        return this.current !== this.target;
    }

    update(delta: number) {
        if (this.initial !== this.target) {
            this.progress += delta;
            if (this.progress > this.duration) {
                this.initial = this.target = this.target % 1;
                this.distribution.draw(this.current).func();
                if (App.game.features.keyItems.hasKeyItem(KeyItemId.WheelOfButter)) {
                    this.spin();
                }
            }
        }
    }

    save(): WheelFeatureSaveData {
        return {
            ...super.save(),
            initial: this.initial,
            progress: this.progress,
            target: this.target,
            spins: this.spins.toString()
        };
    }

    load(data: WheelFeatureSaveData) {
        super.load(data);
        this.initial = data.initial || 0;
        this.progress = data.progress || 0;
        this.target = data.target || 0;
        this.spins = data.spins ? Decimal.fromString(data.spins) : new Decimal(0);
    }

    get current(): number {
        return this.initial + (this.target - this.initial) * this.ease(this.progress / this.duration);
    }

    ease(x: number): number {
        return 1 - Math.pow(1 - x, 4);
        /*
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        */
    }

    get duration(): number {
        return Decimal.div(4, this.grease.getBonus()).toNumber();
    }

}
