var _ = require("lodash");

var api = require("./api.js");
var Alert = require("../models/alert");
var alerts = require("../alerts")

// Create an alert
api.register("post", "alerts", function(args) {
    var r = new Alert(args);

    return r.saveQ()
    .then(function(e) {
        return e.repr();
    })
}, {
    needed: [
        "eventName", "type", "condition"
    ]
});

// List alerts
api.register("get", "alerts", function(args) {
    return Alert.find({})
    .skip(args.start)
    .limit(args.limit)
    .execQ()
    .then(function(alerts) {
        return _.map(alerts, function(a) {
            return a.repr();
        });
    })
}, {
    defaults: {
        start: 0,
        limit: 100
    }
});

// List alerts types
api.register("get", "alerts/types", function(args) {
    return _.map(alerts.ALL, function(a) {
        return {
            id: a.id,
            title: a.title
        };
    })
});


// Edit an alert
api.register("put", "alert/:alert", function(args, context) {
    context.alert.title = args.title || context.alert.title;
    context.alert.condition = args.condition || context.alert.condition;
    context.alert.interval = args.interval || context.alert.interval;
    context.alert.configuration = args.configuration || context.alert.configuration;

    return context.alert.saveQ()
    .then(function() {
        return context.alert.repr();
    })
});

// Remove an alert
api.register("delete", "alert/:alert", function(args, context) {
    return context.alert.removeQ()
    .then(function() {
        return { deleted: true }
    })
});

