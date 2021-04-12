<template>
  <div :class="{'dark': darkMode}">
    <igt-notifications></igt-notifications>
    <igt-sidebar title="Voidlings Sphere">

      <igt-sidebar-currency v-bind:currency="CurrencyType.Voidlings"></igt-sidebar-currency>
      <igt-sidebar-currency v-bind:currency="CurrencyType.CombatBots" label="Nanobots"></igt-sidebar-currency>
      <igt-sidebar-currency v-bind:currency="CurrencyType.VoidBatteries" label="Void Batteries"></igt-sidebar-currency>

      <igt-tab name="Combat" :selected="true">
        <igt-combat-feature></igt-combat-feature>
      </igt-tab>

      <igt-tab name="Factory" :visible="factoryRequirement.isCompleted">
        <igt-factory-feature></igt-factory-feature>
      </igt-tab>

      <igt-tab name="Wheel" :visible="wheelRequirement.isCompleted">
        <igt-wheel-feature></igt-wheel-feature>
      </igt-tab>

      <igt-tab name="Accomplishments">
        <igt-key-items></igt-key-items>
      </igt-tab>

      <igt-tab name="Settings">
        <igt-settings></igt-settings>
      </igt-tab>

      <igt-sidebar-category name="Other"></igt-sidebar-category>

      <igt-tab name="Developer Panel" v-if="showDevPanel">
        <igt-developer-panel></igt-developer-panel>
      </igt-tab>

      <igt-sidebar-category name="Socials"></igt-sidebar-category>
      <igt-sidebar-external-link name="Discord" link="https://discord.gg/WzejVAx"
                                 image="socials/discord.png"></igt-sidebar-external-link>
      <igt-sidebar-external-link name="GitHub" link="https://github.com/thepaperpilot/incremental-game-template"
                                 image="socials/github.png"></igt-sidebar-external-link>
      <igt-sidebar-external-link name="Made with IGT" link="https://github.com/123ishaTest/incremental-game-template"
                                 image="socials/isha.png"></igt-sidebar-external-link>
    </igt-sidebar>

  </div>

</template>

<script>
import {App} from "@/App.ts"
import IgtSidebar from "@/components/util/sidebar/igt-sidebar-layout";
import IgtTab from "@/components/util/igt-tab";
import IgtNotifications from "@/components/util/igt-notifications";
import IgtDeveloperPanel from "@/components/developer-panel/igt-developer-panel";
import IgtSidebarCategory from "@/components/util/sidebar/igt-sidebar-category";
import IgtSidebarExternalLink from "@/components/util/sidebar/igt-sidebar-external-link";
import IgtSettings from "@/components/features/settings/igt-settings";
import IgtKeyItems from "@/components/features/key-items/igt-key-items";
import IgtSidebarCurrency from "@/components/util/sidebar/igt-sidebar-currency";
import {CurrencyType} from '@/ig-template/features/wallet/CurrencyType';
import IgtCombatFeature from "@/components/features/combat/igt-combat-feature";
import IgtFactoryFeature from "@/components/features/factory/igt-factory-feature";
import IgtWheelFeature from "@/components/features/wheel/igt-wheel-feature";
import {KeyItemRequirement} from "@/ig-template/features/key-items/KeyItemRequirement";
import {KeyItemId} from "@/ig-template/features/key-items/KeyItemId";

export default {
  components: {
    IgtCombatFeature,
    IgtFactoryFeature,
    IgtWheelFeature,
    IgtSidebarCurrency,
    IgtKeyItems,
    IgtSettings,
    IgtSidebarExternalLink,
    IgtSidebarCategory, IgtDeveloperPanel, IgtNotifications, IgtTab, IgtSidebar
  },
  data() {
    return {
      game: App.game,
      CurrencyType,
      factoryRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.Factory),
      wheelRequirement: new KeyItemRequirement(App.game.features.keyItems, KeyItemId.Wheel),
    }
  },
  computed: {
    showDevPanel() {
      return !App.inProduction;
    },
    darkMode() {
      return App.game.features.settings.darkMode.value;
    }
  },
}
</script>

<style>
</style>
