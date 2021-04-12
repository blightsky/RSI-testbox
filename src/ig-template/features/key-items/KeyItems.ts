import {Feature} from "@/ig-template/features/Feature";
import {ISimpleEvent, SimpleEventDispatcher} from "strongly-typed-events";
import {KeyItem} from "@/ig-template/features/key-items/KeyItem";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import {KeyItemSaveData} from "@/ig-template/features/key-items/KeyItemSaveData";

export class KeyItems extends Feature {
    list: Record<KeyItemId, KeyItem>

    private _onKeyItemGain = new SimpleEventDispatcher<KeyItem>();

    constructor() {
        super('key-items');
        this.list = {} as Record<KeyItemId, KeyItem>;
    }


    initialize() {
        this.registerKeyItem(new KeyItem(KeyItemId.Factory, "Factory", "Grants access to the factory", "Defeat 1 voidling", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.Wheel, "Wheel", "Grants access to the mystic wheel", "Defeat 10 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.StrongerWeapons, "Stronger weapons", "Empowers you to kill voidlings with fewer nanobots", "Defeat 100 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.CombatEfficiency, "Combat Efficiency", "Empowers you to kill voidlings quicker", "Defeat 500 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.WheelOfFortune, "Wheel of Fortune", "Empowers you to increase the effect of wheel rewards", "Defeat 1,000 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.WheelOfButter, "Wheel of Butter", "Empowers you to increase the speed of the wheel, and make it auto-spin", "Defeat 2,500 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.Synergy, "Synergy", "Empowers you to increase the efficiency of your factory", "Defeat 10,000 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.MassMurder, "Mass Murder", "Empowers you to kill more voidlings at once", "Defeat 100,000 voidlings", "logo.png"));
        this.registerKeyItem(new KeyItem(KeyItemId.Victory, "Victory", "You've won the game!", "Defeat 1,000,000 voidlings", "logo.png"));
    }

    public registerKeyItem<T extends KeyItem>(keyItem: T): T {
        this.list[keyItem.id] = keyItem;
        return keyItem;
    }

    hasKeyItem(id: KeyItemId): boolean {
        return this.getKeyItem(id)?.isUnlocked;
    }

    getKeyItem(id: KeyItemId): KeyItem {
        return this.list[id];
    }

    gainKeyItem(id: KeyItemId) {
        const item = this.getKeyItem(id);
        if (!item) {
            console.warn(`Key Item with id ${id} could not be found`);
            return;
        }
        const didUnlock = item.unlock();
        if (didUnlock) {
            this._onKeyItemGain.dispatch(item);
        }
    }

    /**
     * Emitted whenever a currency is gained
     * @private
     */
    public get onKeyItemGain(): ISimpleEvent<KeyItem> {
        return this._onKeyItemGain.asEvent();
    }

    load(data: KeyItemSaveData): void {
        data.list?.forEach(id => {
            const item = this.getKeyItem(id);
            if (item) {
                item.isUnlocked = true;
            }
        })
    }

    save(): KeyItemSaveData {
        const list = [];
        for (const key in this.list) {
            if (this.list[key as KeyItemId].isUnlocked) {
                list.push(key as KeyItemId)
            }
        }
        return {
            list: list,
        };
    }
}
