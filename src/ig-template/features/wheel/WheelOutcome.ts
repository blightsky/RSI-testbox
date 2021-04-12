export class WheelOutcome {

    func: () => void;
    description: string;

    constructor(func: () => void, description: string) {
        this.func = func;
        this.description = description;
    }
}