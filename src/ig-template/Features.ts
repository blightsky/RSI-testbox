import {Wallet} from "@/ig-template/features/wallet/Wallet";
import {Settings} from "@/ig-template/features/settings/Settings";
import {KeyItems} from "@/ig-template/features/key-items/KeyItems";
import {CombatFeature} from "@/ig-template/features/combat/CombatFeature";
import {FactoryFeature} from "@/ig-template/features/factory/FactoryFeature";
import {WheelFeature} from "@/ig-template/features/wheel/WheelFeature";

export interface Features {
    wallet: Wallet;
    combat: CombatFeature;
    factory: FactoryFeature;
    wheel: WheelFeature;
    settings: Settings;
    keyItems: KeyItems;
}
