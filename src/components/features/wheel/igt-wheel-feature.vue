<template>
  <igt-feature>
    <div class="result" v-bind:class="{ isStopped }">{{ currentResult.description }}</div>
    <div class="wheel" v-if="false">
      <div class="slice" v-for="(option, index) in options" v-bind:style="{ '--hue': 360 * index / options.length, '--weight': option.weight / totalWeight, transform: `rotate(${options.slice(0, index).reduce((acc, curr) => acc + curr.weight, option.weight / 2) * 360 / totalWeight}deg)` }" v-bind:key="index">
      </div>
    </div>
    <div class="wheel-2" v-bind:style="{ transform: `rotate(${-current * 360}deg)`, background: `conic-gradient(${options.slice(1).reduce((acc, curr, i) => {
        return { weight: acc.weight + curr.weight, gradient: acc.gradient + `, hsl(${360 * (i + 1) / options.length}, 100%, 50%) ${acc.weight * 360 / totalWeight}deg ${(acc.weight + curr.weight) * 360 / totalWeight}deg` }
      }, { weight: options[0].weight, gradient: 'red ' + options[0].weight * 360 / totalWeight + 'deg' }).gradient})` }"></div>
    <button class="wheel-btn btn btn-blue" @click="spin()" :disabled="!isStopped">
      Spin!
    </button>
    <igt-upgrade v-if="multispinRequirement.isCompleted" :upgrade="multispin" @click.native="wheel.buyUpgrade(multispin)" currency-name="Nanobots"
                 :can-buy="multispin.level.lt(multispin.maxLevel) && wheel.canAfford(multispin)"></igt-upgrade>
    <igt-upgrade v-if="greaseRequirement.isCompleted" :upgrade="grease" @click.native="wheel.buyUpgrade(grease)" currency-name="Void Batteries"
                 :can-buy="grease.level.lt(grease.maxLevel) && wheel.canAfford(grease)"></igt-upgrade>
  </igt-feature>
</template>

<script>
import {App} from "@/App.ts"
import IgtFeature from "@/components/util/igt-feature";
import IgtUpgrade from "@/components/tools/upgrades/igt-discrete-upgrade";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";
import {KeyItemRequirement} from "@/ig-template/features/key-items/KeyItemRequirement";

export default {
  name: "igt-wheel-feature",
  components: {IgtUpgrade, IgtFeature},
  data() {
    return {
      wheel: App.game.features.wheel,
      multispinRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.WheelOfFortune),
      greaseRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.WheelOfButter)
    }
  },
  computed: {
    options: () => App.game.features.wheel.distribution.outcomes,
    totalWeight: () => App.game.features.wheel.distribution.getTotalWeight(),
    currentResult: () => App.game.features.wheel.distribution.draw(App.game.features.wheel.current % 1),
    isStopped: () => !App.game.features.wheel.isSpinning(),
    current: () => App.game.features.wheel.current % 1,
    multispin: () => App.game.features.wheel.multispin,
    grease: () => App.game.features.wheel.grease
  },
  methods: {
    spin() {
      App.game.features.wheel.spin();
    }
  }
}
</script>

<style scoped>
.wheel {
  --radius: 200px;
  --circumference: calc(var(--radius) * 6.283185307); /* 2 * pi * radius */
  width: var(--radius);
  height: var(--radius);
  position: relative;
  border-radius: 100%;
  overflow: hidden;
}

.slice {
  --slice-height: calc(var(--circumference) * var(--weight));
  --slice-offset: calc(var(--slice-height) / 2);
  position: absolute;
  top: calc(50% - var(--slice-offset));
  height: var(--slice-height)px;
  left: 50%;
  width: 50%;
  color: white;
  transform-origin: left center;
}
.slice:before,
.slice:after {
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  display: block;
}
.slice:before {
  margin-bottom: -1px;
  margin-top: -2px;
  border-width: 0 0 calc((var(--slice-height) / 2) + 4px) var(--radius);
  border-color: transparent transparent hsl(var(--hue), 100%, 50%) transparent;
}
.slice:after {
  margin-top: -1px;
  margin-bottom: -2px;
  border-width: 0 var(--radius) calc((var(--slice-height) / 2) + 4px) 0;
  border-color: transparent hsl(var(--hue), 100%, 50%) transparent transparent;
}

.wheel-2 {
  --radius: 60vmin;
  width: var(--radius);
  height: var(--radius);
  border-radius: 100%;
  margin: auto;
}

.result {
  text-align: center;
  position: relative;
  margin-bottom: 50px;
}

.result::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%);
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 80px solid brown;
  z-index: 1;
}

.wheel-btn {
  margin: 20px auto;
  display: block;
}

.result.isStopped {
   color: gold;
 }
</style>