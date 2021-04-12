<template>
  <igt-feature>
    <div class="flex flex-row flex-wrap">
      <igt-action :action="combat.combatAction" :description="combatCost + ' Nanobots'"></igt-action>
    </div>
    <div style="font-size: x-large; margin: 10px 0;">Next accomplishment at {{ nextUnlock | numberFormatWhole }} killed voidlings ({{ currentKills | numberFormatWhole }} killed so far)</div>
    <div class="flex flex-row flex-wrap">
      <igt-upgrade v-if="strongerRequirement.isCompleted" :upgrade="combat.stronger" @click.native="combat.buyUpgrade(combat.stronger)" currency-name="Void Batteries"
                   :can-buy="combat.stronger.level.lt(combat.stronger.maxLevel) && combat.canAfford(combat.stronger)"></igt-upgrade>
      <igt-upgrade v-if="efficiencyRequirement.isCompleted" :upgrade="combat.efficiency" @click.native="combat.buyUpgrade(combat.efficiency)" currency-name="Nanobots"
                   :can-buy="combat.efficiency.level.lt(combat.efficiency.maxLevel) && combat.canAfford(combat.efficiency)"></igt-upgrade>
      <igt-upgrade v-if="massRequirement.isCompleted" :upgrade="combat.mass" @click.native="combat.buyUpgrade(combat.mass)"
                   :can-buy="combat.mass.level.lt(combat.mass.maxLevel) && combat.canAfford(combat.mass)"></igt-upgrade>
    </div>
  </igt-feature>
</template>

<script>
import {App} from "@/App.ts"
import IgtFeature from "@/components/util/igt-feature";
import IgtAction from "@/components/tools/actions/igt-action";
import {NumberFormatter} from '@/ig-template/util/NumberFormatter';
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import IgtUpgrade from "@/components/tools/upgrades/igt-discrete-upgrade";
import {KeyItemRequirement} from "@/ig-template/features/key-items/KeyItemRequirement";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import Decimal from "@/lib/break_eternity.min";

export default {
    name: "igt-combat-feature",
    components: {IgtUpgrade, IgtAction, IgtFeature},
    data() {
      return {
        combat: App.game.features.combat,
        strongerRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.StrongerWeapons),
        efficiencyRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.CombatEfficiency),
        massRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.MassMurder)
      }
    },
  computed: {
    nextUnlock: () => [1, 10, 100, 500, 1000, 2500, 10000, 100000, 1000000].find(amount => Decimal.sub(1e6, App.game.features.wallet.getAmount(CurrencyType.Voidlings)).lt(amount)),
    currentKills: () => Decimal.sub(1e6, App.game.features.wallet.getAmount(CurrencyType.Voidlings)),
    combatCost: () => NumberFormatter.formatWhole(App.game.features.combat.combatAction.getCombatCost().floor()),
    combatBots: () => App.game.features.wallet.getAmount(CurrencyType.CombatBots).floor()
  }
}
</script>

<style scoped>

</style>
