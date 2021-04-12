import {SaveData} from "@/ig-template/tools/saving/SaveData";

export interface WalletSaveData extends SaveData {
    voidlings: string;
    combatBots: string;
    batteries: string;
    combatBotsMod: string;
}
