  <template>
  <div class="actTabName-deskName">
    <div class="actTabName__desk-name-abs">
      <div class="actTabName__box"
           @click="inputActivation">
        <input class="actTabName__inp"
               type="text"
               :class="{'actTabName__inp_active':inputActive}"
               :style="{color: fontColor}"
               v-model="actTabName"
               :disabled="!inputActive"
               placeholder="Название стола"
               ref="headerInput"
               @focusout='changeTableTitle(actTabName)'
               @keyup.enter='changeTableTitle(actTabName)'>
        <span class="actTabName__buffer">{{ actTabName }}</span>
      </div>
    </div>
  </div>
</template>
  

<script>
export default {
  data() {
    return {
      inputActive: false
    };
  },

  methods: {
    checkOuterClick(el) {
      if (el.target != this.$refs.headerInput) {
        this.inputActive = false;
        window.removeEventListener("click", this.checkOuterClick);
      }
    },

    inputActivation() {
      this.inputActive = true;
      window.addEventListener("click", this.checkOuterClick);
      let t = this;
      setTimeout(function() {
        //   // t.$refs.headerInput.focus();
        t.$refs.headerInput.select();
      }, 100);
      console.log("h");
    },

    changeTableTitle(NewName) {
      const TableId = this.$store.state.allTasks[
        this.$store.state.activeTableIndex
      ].id;
      this.$store.dispatch("changeTableTitle", { NewName, TableId });
    }
  },

  computed: {
    actTabName: {
      //и запишем название нашего стола для хедера
      get: function() {
        if (this.allTasks.length > 0) {
          if (this.allTasks[this.actTableIndex]) {
            return this.allTasks[this.actTableIndex].name;
          }
        } else {
          return "Название рабочего стола";
        }
      },

      set: function(newValue) {
        this.allTasks[this.actTableIndex].name = newValue;
      }
    },
    allTasks() {
      return this.$store.state.allTasks;
    },
    actTableIndex() {
      return this.$store.state.activeTableIndex;
    }
  },
  props: {
    fontColor: String,
  }
};
</script>

<style lang="scss">
.actTabName {
  &__deskName {
    font-family: "Open Sans", sans-serif;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    text-align: center;
    text-align: center;
    margin: 0 10px;
    height: 100%;

    &-abs {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 100%;
    }
  }
  &__inp {
    border-radius: 6px;
    transition: all 0.3s;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: left !important;
    margin: 0 auto;
    display: block;
    border-radius: 5px;
    padding: 0 5px;
    border: none;
    background: transparent;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    max-width: 100%;
    min-width: 145px;
    box-sizing: border-box;
    user-select: none;

    &_active {
      background: rgba(255, 255, 255, 0.774);
      border: solid 1px rgb(163, 163, 163);
      user-select: unset;
    }
  }
  &__box {
    width: min-content;
    position: relative;
    height: 30px;
    max-width: 100%;
    min-width: 50px;
  }
  &__buffer {
    position: relative;
    left: 0;
    padding: 0 8px;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    font-weight: 400;
    height: 0;
    opacity: 0;
    width: 20px;
    z-index: -10;
    white-space: nowrap;
  }
}
</style>
  
    