import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {AbstractAction} from "@/ig-template/tools/actions/AbstractAction";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import Decimal from "@/lib/break_eternity.min";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {DecimalValue} from "@/lib/DecimalValueType";
import {CombatFeature} from "@/ig-template/features/combat/CombatFeature";

export class CombatAction extends AbstractAction {
    durationFunc: () => number;
    requirement: Requirement;
    costFunc: (amount: Decimal) => Decimal;
    multiCompleteFunc: () => DecimalValue;

    _wallet: Wallet = null as unknown as Wallet;
    _combat: CombatFeature = null as unknown as CombatFeature;

    constructor(wallet: Wallet, combat: CombatFeature, description: string, durationFunc: () => number, costFunc: (amount: Decimal) => Decimal, multiCompleteFunc: () => DecimalValue, requirement: Requirement = new NoRequirement()) {
        super(description, durationFunc, Infinity);
        this._wallet = wallet;
        this._combat = combat;
        this.durationFunc = durationFunc;
        this.costFunc = costFunc;
        this.multiCompleteFunc = multiCompleteFunc;
        this.requirement = requirement;
    }

    complete(): void {
        let completions = Decimal.floor(Decimal.div(this.currentProgress, this.durationFunc())).times(this.multiCompleteFunc());
        completions = Decimal.min(completions, this.repeat);
        // For the sake of the game jam I'm not using the costFun here lol
        completions = Decimal.min(completions, Decimal.affordGeometricSeries(this._wallet.getAmount(CurrencyType.CombatBots), 1, Decimal.times(.1, this._combat.stronger.getBonus()).add(1), Decimal.sub(1e6, this._wallet.getAmount(CurrencyType.Voidlings)).add(1)).add(1).toNumber());
        this._onCompletion.dispatch(completions);

        const canRepeat: boolean = this.handleCompletions(completions);
        if (canRepeat && completions.lt(this.repeat)) {
            this.repeatAction();
        } else {
            this.stop();
        }
    }

    getCombatCost() {
        return this.costFunc(Decimal.sub(1e6, this._wallet.getAmount(CurrencyType.Voidlings)));
    }

    canPerform(): boolean {
        if (this.isStarted) {
            if (this._wallet.getAmount(CurrencyType.CombatBots).lt(0)) {
                return false;
            }
        } else {
            if (this._wallet.getAmount(CurrencyType.CombatBots).lt(this.getCombatCost())) {
                return false;
            }
        }

        return super.canPerform();
    }

    start(): boolean {
        const ret = super.start();
        if (ret) {
            this._wallet.gainCurrency(new Currency(this.getCombatCost().neg(), CurrencyType.CombatBots));
        }
        return ret;
    }

    stop() {
        super.stop();
        this._wallet.gainCurrency(new Currency(this.getCombatCost().div(this._wallet.getCurrencyMultiplier(CurrencyType.CombatBots)), CurrencyType.CombatBots));
        // I don't know what's causing this and it's too late to find out
        if (this._wallet.getAmount(CurrencyType.CombatBots).lt(0)) {
            this._wallet.gainCurrency(new Currency(this._wallet.getAmount(CurrencyType.CombatBots).neg().div(this._wallet.getCurrencyMultiplier(CurrencyType.CombatBots)), CurrencyType.CombatBots));
        }
    }

    handleCompletions(completions: Decimal): boolean {
        // If we killed more than 1, remove the combatBots for the non-first completion
        if (completions.gt(1)) {
            this._wallet.gainCurrency(new Currency(Decimal.sumGeometricSeries(completions.sub(1), 1, Decimal.times(.1, this._combat.stronger.getBonus()).add(1), Decimal.sub(1e6, this._wallet.getAmount(CurrencyType.Voidlings))).neg(), CurrencyType.CombatBots));
        }
        // Note: we remove this either way because stop() will add the cost back if we return false
        this._wallet.gainCurrency(new Currency(this.getCombatCost().neg(), CurrencyType.CombatBots));


        if (!this.canPerform()) {
            return false;
        }

        // Check if we can still perform this recipe again
        return true;
    }

    gainReward(): boolean {
        return false;
    }

}
