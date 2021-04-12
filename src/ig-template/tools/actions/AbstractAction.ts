import {ISimpleEvent, SimpleEventDispatcher} from "strongly-typed-events";
import {Progress} from "@/ig-template/tools/requirements/Progress";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import Decimal from "@/lib/break_eternity.min";

export abstract class AbstractAction {
    description: string;
    durationFunc: () => number;
    repeat: number; // 0, x, Infinity (until error)

    isStarted: boolean = false;
    currentProgress: number = 0;

    requirement: Requirement;

    // One iteration done
    protected _onCompletion = new SimpleEventDispatcher<Decimal>();

    protected constructor(description: string, durationFunc: () => number, repeat: number = Infinity, requirement: Requirement = new NoRequirement()) {
        this.description = description;
        this.durationFunc = durationFunc;
        this.repeat = repeat;
        this.requirement = requirement
    }

    perform(delta: number): void {
        if (!this.isStarted) {
            return;
        }

        this.currentProgress += delta;

        if (this.canBeCompleted()) {
            this.complete();
        }
    }

    canBeCompleted() {
        return this.isStarted && this.currentProgress >= this.durationFunc();
    }

    complete(): void {
        this._onCompletion.dispatch(new Decimal(1));
        const canRepeat: boolean = this.gainReward();
        if (canRepeat && this.repeat > 0) {
            this.repeatAction();
        } else {
            this.stop();
        }
    }

    getProgress(): Progress {
        return new Progress(this.currentProgress, this.durationFunc());
    }

    repeatAction() {
        this.repeat--;
        this.currentProgress = 0;
    }

    /**
     * Override if more permissions exist.
     */
    canPerform(): boolean {
        return this.requirement.isCompleted;
    }

    toggle() {
        if (this.isStarted) {
            this.stop();
        } else {
            this.start();
        }
    }

    start(): boolean {
        if (!this.canPerform()) {
            console.log(`Can't start action ${this.description}`)
            return false;
        }
        this.isStarted = true;
        return true;
    }

    stop() {
        this.currentProgress = 0;
        this.isStarted = false;
    }

    /**
     * Implement with whatever the reward should be for your action.
     * Return false if something is blocking a repeat (full inventory, etc)
     */
    abstract gainReward(): boolean;

    public get onCompletion(): ISimpleEvent<Decimal> {
        return this._onCompletion.asEvent();
    }
}
