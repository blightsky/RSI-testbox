<template>
  <div v-bind:class="{
        'p-4 w-72 h-36 border-green-700 border-4 shadow-lg hover-highlight flex flex-row items-center': true,
        'bg-green-500': canPerform || isStarted,
        'bg-red-500': !(canPerform || isStarted)
       }"
       @click="action.toggle()">
    <div class="flex flex-col w-full space-y-1">
      <p class="text-center text-white">{{ action.description }}<br v-if="description" />{{ description }}</p>
      <span class="text-center text-white"> <span class="fa fa-clock"/> {{ action.durationFunc() | numberFormat }}</span>
      <igt-progress-bar :percentage="progressPercentage"></igt-progress-bar>
    </div>
  </div>
</template>

<script>


import IgtProgressBar from "@/components/util/igt-progress-bar";
import {AbstractAction} from "@/ig-template/tools/actions/AbstractAction";

export default {
  name: "igt-action",
  components: {IgtProgressBar},
  props: {
    action: {
      type: AbstractAction,
      required: true,
    },
    description: String
  },
  computed: {
    progress() {
      return this.action.getProgress();
    },
    progressPercentage() {
      return this.progress.getPercentage();
    },
    canPerform() {
      return this.action.canPerform()
    },
    isStarted() {
      return this.action.isStarted;
    }
  },

}
</script>

<style scoped>

</style>
