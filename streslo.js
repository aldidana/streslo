Boards = new Mongo.Collection('boards')

if(Meteor.isClient) {
	Meteor.subscribe("tampil");

	Template.boards.helpers({
		boards: function() {
			return Boards.find({}, {sort: {order: 1}})
		}
	})
}

	Template.boards.rendered = function() {
		this.$('#boards').sortable({
			stop: function(e, ui) {
				el = ui.item.get(0)
				before = ui.item.prev().get(0)
				after = ui.item.next().get(0)


				if(!before) {
					newOrder = Blaze.getData(after).order - 1
				} else if(!after) {
					newOrder = Blaze.getData(before).order + 1
				}
				else
					newOrder = (Blaze.getData(after).order + Blaze.getData(before).order)/2

				Boards.update({_id: Blaze.getData(el)._id}, {$set: {order: newOrder}})
			}
		})
	}

	Template.body.events({
		"submit .new-task": function (event) {
			var text = event.target.text.value;
			Boards.insert({
				judul: text
			})
			event.target.text.value = "";
			return false;
		}
	})

	Template.boards.events({
		"click .delete": function() {
			Boards.remove(this._id);
		}
	})
} 

if(Meteor.isServer) {
	// publish
	Meteor.publish("tampil", function () {
		return Boards.find({rahasia : false});
	});

	Meteor.startup(function() {
		if(Boards.find({}).count() == 0) {
			for (var i = 1; i<=5; i++) {
				Boards.insert({
					judul: "judul " + i,
					order: i
				});
			}
		}
	});	
}