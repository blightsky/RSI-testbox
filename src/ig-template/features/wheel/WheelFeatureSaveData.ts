import {UpgradesFeatureSaveData} from "@/ig-template/tools/saving/UpgradesFeatureSaveData";

export interface WheelFeatureSaveData extends UpgradesFeatureSaveData {
    initial: number;
    progress: number;
    target: number;
    spins: string;
}
