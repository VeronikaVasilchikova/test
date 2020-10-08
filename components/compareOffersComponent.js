const popup = {
  view: "popup",
  width: 400,
  height: 400,
  body: {
    rows: [
      {
        cols: [
          {
            width: 25,
          },
          {
            view: "label",
            label: "Offers to compare",
          },
          {
            view: "label",
            id: "closePopupLabel",
            width: 60,
            label: "Close",
          },
        ],
      },
      {
        view: "datatable",
        id: "popupDatatable",
        scroll: "xy",
        columns: [
          {
            id: "checked",
            header: "",
            template: "{common.checkbox()}",
            checkValue: 1,
            uncheckValue: 0,
            width: 40
          },
          {
            id: "name",
            fillspace: true,
            header: "Company name",
          },
          {
            id: "value",
            header: "Offer",
            template: obj => `<span>${obj.value} (${obj.addedValue})</span>`,
          },
        ],
        data: []
      },
      {
        cols: [
          {},
          {
            view: "button",
            id: "addItemButton",
            label: "Add offer to compare",
            type: "icon",
            icon: "mdi mdi-download",
            autowidth: true,
          }
        ]
      },
    ]
  },
};

webix.protoUI(
  {
    name: "compareOffersComponent",
    defaults: {
      margin: 10,
      cols: [
        {
          view:"scrollview",
          scroll: "x",
          width: 400,
          body: {
            view:"dataview",
            id: "dataviewOffers",
            yCount: 1,
            type: {
              height: 150,
              width: 200
            },
            template: obj => `
                <div style="font-weight: bold; text-align: center">
                  <span>${obj.name}</span>
                  <span class='mdi mdi-trash-can-outline'></span>
                </div>
                <div style="text-align: center">${obj.value}</div>
                <div style="text-align: center">${obj.addedValue}</div>
                <div style="text-align: center">${obj.value + obj.addedValue}</div>
                <div style="font-weight: bold; text-align: center">Price(per, final)</div>
              `,
            onClick: {
              "mdi-trash-can-outline": function(e, id) {
                this.getTopParentView().removeItem(id);
              }
            }
          },
        },
        {
          view: "button",
          type: "icon",
          icon: "wxi-plus",
          label: "Add offer to compare",
          autowidth: true,
          click: function() {
            const popup = this.getParentView().getPopup();
            return popup.show(this.getParentView().getNode(), {
              pos: "left",
            });
          }
        },
      ],
    },
    $init(config) {
      this._popup = webix.ui(webix.copy(popup));
      const data = config.data;
      this.$$("popupDatatable").parse(data);

      this.$ready.push(() => {
        const addItemButton = this.getAddItemButton();
        const popupDatatable = this.getPopupDatatable();
        const closePopupLabel = this.getClosePopupLabel();

        addItemButton.attachEvent("onItemClick", (id, e) => {
          const markedItem = Object.values(popupDatatable.data.pull)
            .filter(item => item.checked === 1);
            this.addItem(markedItem);
            this.closePopup();
        });

        closePopupLabel.attachEvent("onItemClick", (id, e) => {
          this.closePopup();
        });
      });
    },
    getPopup() {
      return this._popup || {};
    },
    getPopupDatatable() {
      return this.$$("popupDatatable");
    },
    getAddItemButton() {
      return this.$$("addItemButton");
    },
    getClosePopupLabel() {
      return this.$$("closePopupLabel");
    },
    closePopup() {
      this.getPopup().hide();
    },
    changeNumOfCols(numOfCols) {
      const dataviewOffersLayout = this.$$("dataviewOffers");
      dataviewOffersLayout.define("xCount", numOfCols);
      dataviewOffersLayout.resize();
    },
    addItem(item) {
      const dataviewOffersLayout = this.$$("dataviewOffers");
      const numOfCols = item.length;
      dataviewOffersLayout.clearAll();
      dataviewOffersLayout.parse(item);
      this.changeNumOfCols(numOfCols);
    },
    removeItem(id) {
      const dataviewOffersLayout = this.$$("dataviewOffers");
      const numOfCols = dataviewOffersLayout.config.xCount - 1;
      dataviewOffersLayout.remove(id);
      this.changeNumOfCols(numOfCols);
      this.$$("popupDatatable").updateItem(id, {checked: 0});
    },
  },
  webix.IdSpace,
  webix.ui.layout
);
