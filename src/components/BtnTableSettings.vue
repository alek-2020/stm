<template>
    <div class="table-settings"
         v-html="settingsIcon"
         :class="{ 'table-settings_hidden': (!tableSettingsVisible && !tableSettingsActive) }"
         @click="showTableSettings">
    </div>
</template>
