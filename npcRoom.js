function PersonVM() {
	'use strict';
	if(!(this instanceof PersonVM)) {
	  return new PersonVM();
	}
	var self=this;
	self.name = ko.observable('');
	self.sprite = ko.observable('');
	self.face = ko.observable('');
	self.dialogue = ko.observableArray([]);
	self.dialogueIndex = ko.observable(0);
	self.incrementDialogue = function() {
		var i = self.dialogueIndex();
		i++;
		if (i >= self.dialogue().length) {
			i = 0;
		}
		self.dialogueIndex(i);
	}
	self.positionX = ko.observable(0);
	self.positionY = ko.observable(0);
	self.left = ko.computed(function() {
		var str = self.positionX() + 'px';
		return str;
	});
	self.top = ko.computed(function() {
		var str = self.positionY() + 'px';
		return str;
	});
	self.spriteSrc = ko.computed(function() {
		return 'sprites/' + self.sprite();
	});
	self.faceSrc = ko.computed(function() {
		return 'faces/' + self.face();
	});
	
	self.dataFromJSON = function(string) {
		ko.mapping.fromJS(string, {}, self);
	};
};

function AppVM() {
	'use strict';
	if(!(this instanceof AppVM)) {
	  return new AppVM();
	}
	
	var self = this;
	
	self.npcs = ko.observableArray([]);
	
	self.currentNPC = ko.observable('');
	self.currentLine = ko.observable('');

	self.showingDialogue = ko.observable(false);
	self.dialogueText = ko.observable('');
	self.faceSrc = ko.observable('');
	self.fadeDialogue = ko.observable(false);
	self.toggleDialogue = function() {
		self.showingDialogue(!self.showingDialogue());
	}
	var autoRemoveDialogue;
	var autoFadeDialogue;
	self.newDialogue = function(data) {
		clearTimeout(autoFadeDialogue);
		clearTimeout(autoRemoveDialogue);
		self.fadeDialogue(false);
		self.faceSrc(data.faceSrc());
		self.showingDialogue(true);
		self.currentNPC(data.name());
		self.dialogueText(data.dialogue()[data.dialogueIndex()]);
		data.incrementDialogue();
		autoFadeDialogue = window.setTimeout(function () {
			self.fadeDialogue(true);
			autoRemoveDialogue = window.setTimeout(function () {
				if (self.fadeDialogue() == true) {
					self.showingDialogue(false);
					self.fadeDialogue(false);
				}
			}, 2000);
		}, 30000);
	};
	
	self.saveFile = ko.observable('');
	self.save = function() {
		self.saveFile(self.dataToJSON());
	};
	self.loadFile = ko.observable('');
	self.load = function() {
		self.dataFromJSON(data);
	};
	
	self.dataFromJSON = function(string) {
		var arr = string;
		var newArr = [];
		arr.forEach( function(data, i) {
			var person = new PersonVM();
			person.dataFromJSON(data);
			newArr.push(person);
		});
		self.npcs(newArr);
	};
	
};

var app = new AppVM();
app.load();
window.app = app; // TODO: remove
ko.applyBindings(app);
