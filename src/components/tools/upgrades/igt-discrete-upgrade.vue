<template>
  <button class="btn btn-blue" :disabled="!canBuy">
    <span class="flex flex-col">
      <span>{{ upgrade.displayName }}</span>
      <span v-if="hasMax">Lvl. {{ upgrade.level | numberFormatWhole }} / {{ upgrade.maxLevel | numberFormatWhole }}</span>
      <span v-else>Lvl. {{ upgrade.level | numberFormatWhole }}</span>
      <span v-if="!upgrade.isMaxLevel()">{{ upgrade.getCost().amount | numberFormatWhole }} {{ currencyName || upgrade.getCost().type }}</span>
      <span v-else>Max</span>
    </span>
  </button>
</template>

<script>
import {AbstractUpgrade} from "@/ig-template/tools/upgrades/AbstractUpgrade";
import Decimal from "@/lib/break_eternity.min";

export default {
  name: "igt-upgrade",
  props: {
    upgrade: {
      type: AbstractUpgrade,
      required: true,
    },
    canBuy: {
      type: Boolean,
      required: true,
    },
    currencyName: String
  },
  computed: {
    hasMax() {
      return this.upgrade.maxLevel.neq(Decimal.dNumberMax) && this.upgrade.maxLevel.neq(Infinity);
    }
  }
}
</script>

<style scoped>

</style>
