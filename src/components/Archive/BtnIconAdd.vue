        <!--  добавление РС-->
        <div class="btn-bg-white ml-2 "
             style="margin-left: 10px;"
             @click="AddTableBtn();"
             :class="{'desk-btns__h-add_active': hPlusActive}">
          <div class="desk-btns__h-add"
               v-html="plusIcon"></div>

          <div class=" desk-btns__check-add">
            <div class="btn btn_hover_gray btn_icon_window text"
                 @click="HeaderAdd();">{{ $t("message.newTable") }}</div>
            <div class="btn btn_icon_list btn_hover_gray mt-2 text"
                 @click="addList()"> Список задач</div>
          </div>

        </div>

          &__h-add {
    position: relative;
    transition: all 0.7s;
    width: 100%;
    height: 100%;
    display: flex;

    & svg {
      height: 16px;
      margin: auto;
      fill: $h-icons-col;
    }
  }

  &__h-add_active {
    height: 50px;
    & .desk-btns__check-add {
      max-height: 400px;
      max-width: 400px;
      padding: 8px;
      // display: block;
      visibility: visible;
      opacity: 0.95;
      & > div {
        border: solid 1px #656565;
        padding: 5px 10px 5px 5px;
        justify-content: flex-start !important;
      }
    }
  }

  &__check-add {
    visibility: hidden;
    // visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 45px;
    opacity: 0;
    // background: $h-icons-bg-col;
    background: #efefef;
    border-radius: 4px;
    font-family: Roboto, sans-serif;
    z-index: 100;
    line-height: 1.8;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s;
    max-height: 20px;
    max-width: 20px;
    padding: 0 5px;
  }