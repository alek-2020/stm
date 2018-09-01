  <template>
    <div class="t-header__desk-name"
         @mouseover="showSettings"
         @mouseout="hideSettings">
        <div class="t-header__desk-name-abs">
            <div class="actTabName__box"
                 @dblclick="tableActivation">
                <input class="actTabName__inp"
                       type="text"
                       :class="{'actTabName__inp_active':inputActive}"
                       v-model="actTabName"
                       :disabled="!inputActive"
                       placeholder="Название стола"
                       ref="headerInput"
                       @focusout='changeTableTitle(actTabName)'
                       @keyup.enter='changeTableTitle(actTabName)'>
                <span class="actTabName__buffer">{{ actTabName }}</span>
            </div>

            <BtnTableSettings />
            <BtnDelActiveTable />
        </div>
    </div>
</template>
  

  <script>
    import BtnDelActiveTable from "./BtnDelActiveTable.vue";
    import BtnTableSettings from "./BtnTableSettings.vue";

    export default {
        methods: {                 
        showSettings() {
        this.$store.state.tableSettingsVisible = true;
        },
        hideSettings() {
        // console.log("Срабатывает mouseout");
        this.$store.state.tableSettingsVisible = false;
        //  this.$store.state.tableSettingsActive = false;
        },
            tableActivation() {
            let t = this;
            this.inputActive = true;
            window.addEventListener("click", this.checkOuterClick);
            },
        }, 
        components: {
            BtnDelActiveTable,
            BtnTableSettings
        }
    }
  </script>

  <style>
  
  </style>
  
    