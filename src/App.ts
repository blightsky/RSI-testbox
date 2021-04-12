import {Game} from "./ig-template/Game";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Settings} from "@/ig-template/features/settings/Settings";
import {KeyItems} from "@/ig-template/features/key-items/KeyItems";
import {CombatFeature} from "@/ig-template/features/combat/CombatFeature";
import {FactoryFeature} from "@/ig-template/features/factory/FactoryFeature";
import {WeightedDistribution} from "@/ig-template/tools/probability/WeightedDistribution";
import {Outcome} from "@/ig-template/tools/probability/Outcome";
import {WheelFeature} from "@/ig-template/features/wheel/WheelFeature";
import {WheelOutcome} from "@/ig-template/features/wheel/WheelOutcome";
import {Currency} from "@/ig-template/features/wallet/Currency";
import Decimal from "@/lib/break_eternity.min";

export class App {
    static inProduction: boolean = (process.env.NODE_ENV === "production");

    static game: Game;

    static start(): void {

        this.game = this.getDefaultGame();
        this.game.initialize();
        this.game.load();
        this.game.start();
    }


    public static getDefaultGame(): Game {
        return new Game(
            {
                // TODO Add more currencies here
                wallet: new Wallet([CurrencyType.Voidlings, CurrencyType.CombatBots, CurrencyType.VoidBatteries]),
                combat: new CombatFeature(),
                factory: new FactoryFeature(),
                wheel: new WheelFeature(new WeightedDistribution([
                    new Outcome<WheelOutcome>(new WheelOutcome(() => App.game.features.wallet.gainCurrency(new Currency(Decimal.sub(1e6, App.game.features.wallet.voidlings).div(4).times(App.game.features.wheel.multispin.getBonus()), CurrencyType.VoidBatteries)), "Gain some batteries based on killed voidlings"), 5),
                    new Outcome<WheelOutcome>(new WheelOutcome(() => App.game.features.wallet.gainCurrency(new Currency(Decimal.sub(1e6, App.game.features.wallet.voidlings).times(App.game.features.wheel.multispin.getBonus()), CurrencyType.VoidBatteries)), "Gain many batteries based on killed voidlings"), 2),
                    new Outcome<WheelOutcome>(new WheelOutcome(() => {
                        for (const feature of Object.values(App.game.features)) {
                            feature.update(Decimal.times(60, App.game.features.wheel.multispin.getBonus()).toNumber());
                        }
                    }, "Skip 1 minute in time"), 5),
                    new Outcome<WheelOutcome>(new WheelOutcome(() => {
                        for (const feature of Object.values(App.game.features)) {
                            feature.update(Decimal.times(900, App.game.features.wheel.multispin.getBonus()).toNumber());
                        }
                    }, "Skip 15 minutes in time"), 1),
                    new Outcome<WheelOutcome>(new WheelOutcome(() => App.game.features.wallet.setCurrencyMultiplier(App.game.features.wallet.getCurrencyMultiplier(CurrencyType.CombatBots).add(App.game.features.wheel.multispin.getBonus()), CurrencyType.CombatBots), "Gain permanent +1x nanobots gain"), 1)
                ])),
                settings: new Settings(),
                keyItems: new KeyItems()
            }
        );
    }
}
