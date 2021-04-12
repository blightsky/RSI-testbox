<template>
  <div v-if="visible"></div>
</template>

<script>
import {App} from "@/App";
import {NumberFormatter} from "@/ig-template/util/NumberFormatter";

export default {
  name: "igt-sidebar-currency",
  data() {
    return {
      wallet: App.game.features.wallet,
      isCategory: true,
      isActive: false,
      containerStyle: { marginBottom: "1em" },
      classes: 'text-xl font-bold'
    }
  },
  props: {
    currency: {
      required: true
    },
    label: String
  },
  computed: {
    name() {
      return `${NumberFormatter.formatWhole(this.wallet._currencies[this.currency])} ${this.label || this.currency}`;
    },
    visible() {
      return this.wallet._currencies[this.currency].neq(0);
    }
  }
}
</script>

<style scoped>

</style>