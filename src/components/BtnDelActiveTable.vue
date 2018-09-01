<template>
    <div class="delTable"
         v-html="deleteIcon"
         :class="{ 'delTable_hidden': !tableSettingsActive }"
         v-on:click="askConfirmForDelete()">
    </div>
</template>
         
