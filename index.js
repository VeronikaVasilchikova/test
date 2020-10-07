webix.ready(function() {
  const app = webix.ui({
    padding: 60,
    cols: [
      {},
      {
        view: "myComponent",
        data: companiesData
      },
      {}
    ]
  });

  webix.extend(app, webix.ProgressBar);
});
