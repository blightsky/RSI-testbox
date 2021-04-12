import {UpgradesFeatureSaveData} from "@/ig-template/tools/saving/UpgradesFeatureSaveData";

export interface CombatFeatureSaveData extends UpgradesFeatureSaveData {
    combatProgress: number;
    combatStarted: boolean;
}
