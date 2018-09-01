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