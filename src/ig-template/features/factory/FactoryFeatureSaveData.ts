import {UpgradesFeatureSaveData} from "@/ig-template/tools/saving/UpgradesFeatureSaveData";

export interface FactoryFeatureSaveData extends UpgradesFeatureSaveData {
    factories: string;
    factoriesSquared: string;
    factoriesCubed: string;
}
