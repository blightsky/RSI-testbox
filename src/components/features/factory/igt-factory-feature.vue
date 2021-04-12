<template>
  <igt-feature>
    <div class="flex flex-row flex-wrap justify-center sm:justify-start">
      <div v-for="(upgrade, index) in factory.upgrades.slice(0, 4)" :key="upgrade.id" class="factory">
        <igt-upgrade :upgrade="upgrade" @click.native="buyUpgrade(upgrade)" currency-name="Void Batteries"
                     :can-buy="factory.canAfford(upgrade)"></igt-upgrade>
        <div class="details">
          <span>{{ amounts[index] | numberFormatWhole }} {{ displayNames[index] }}</span>
          <span>+{{ gains[index] | numberFormat}} {{ gainResources[index] }}/s</span>
        </div>
      </div>
    </div>
    <igt-upgrade v-if="synergyRequirement.isCompleted" :upgrade="synergy" @click.native="buyUpgrade(synergy)" currency-name="Void Batteries"
                 :can-buy="factory.canAfford(synergy)"></igt-upgrade>
  </igt-feature>
</template>

    <script>
import {App} from "@/App.ts"
import IgtFeature from "@/components/util/igt-feature";
import IgtUpgrade from "@/components/tools/upgrades/igt-discrete-upgrade";
import Decimal from "@/lib/break_eternity.min";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import {KeyItemRequirement} from "@/ig-template/features/key-items/KeyItemRequirement";

export default {
    name: "igt-feature-feature",
    components: {IgtUpgrade, IgtFeature},
    data() {
        return {
          factory: App.game.features.factory,
          displayNames: [
              "Factories",
              "Factories Squared",
              "Factories Cubed",
              "Factories Tesseracted",
          ],
          gainResources: [
              "Nanobots",
              "Factories",
              "Factories Squared",
              "Factories Cubed"
          ],
          synergyRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.Synergy)
        }
    },
    methods: {
      buyUpgrade(id) {
        this.factory.buyUpgrade(id);
      },
    },
    computed: {
        amounts() {
          return [
            App.game.features.factory.factories.add(App.game.features.factory.factory.getBonus()),
            App.game.features.factory.factoriesSquared.add(App.game.features.factory.factorySquared.getBonus()),
            App.game.features.factory.factoriesCubed.add(App.game.features.factory.factoryCubed.getBonus()),
            App.game.features.factory.factoryTesseracted.getBonus()
          ];
        },
        gains() {
          const synergy = App.game.features.factory.synergy.getBonus();
          const factoriesBonus = App.game.features.factory.factory.getBonus().pow(synergy);
          const factoriesSquaredBonus = App.game.features.factory.factorySquared.getBonus().pow(synergy);
          const factoriesCubedBonus = App.game.features.factory.factoryCubed.getBonus().pow(synergy);
          const factoriesTesseractedBonus = App.game.features.factory.factoryTesseracted.getBonus().pow(synergy);
          return [
            App.game.features.factory.factories.add(factoriesBonus).times(Decimal.pow(2, factoriesBonus)).times(App.game.features.wallet.getCurrencyMultiplier(CurrencyType.CombatBots)),
            App.game.features.factory.factoriesSquared.add(factoriesSquaredBonus).times(Decimal.pow(2, factoriesSquaredBonus)),
            App.game.features.factory.factoriesCubed.add(factoriesCubedBonus).times(Decimal.pow(2, factoriesCubedBonus)),
            factoriesTesseractedBonus.times(Decimal.pow(2, factoriesTesseractedBonus))
          ]
        },
      synergy() {
          return this.factory.synergy;
      }
    }
}
</script>

<style scoped>
.factory {
  display: flex;
  width: 100%;
}

.factory .btn {
  width: 50%;
}

.factory .details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: xx-large;
  line-height: 1.25em;
  margin-left: 10px;
}
</style>
