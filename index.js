var getParameterNames = require('get-parameter-names');
var Q = require('q');
var Anachronic = function(){
    this.tasks = {};
}
Anachronic.prototype.addTask = function (name, dep) {
    // before addin g check if a task with same name exists.
    if( !(name in this.tasks) ){
        var fn = dep.pop();
        this.tasks[name] = {
            fn: fn,
            dep: dep,
            name: name,
            args: getParameterNames(fn),
            applyArgs :[],
            value:null
        };
        // object to hold executed task and its return value
        // this will act as a cache mechanism
        this.executedTask = {};
        return this;
    }
    else {
        throw new Error('Whoops! we already have task with the name "'+name+'" !!');
    }

};
// show added task, if no then null
Anachronic.prototype.showTask = function (taskName) {
    if (this.tasks.hasOwnProperty(taskName)) {
        return this.tasks[taskName];
    }
    return null;
};
// check a task  has already been executed return null else
Anachronic.prototype.checkAlreadyExecuted = function (taskName) {
    if (this.executedTask.hasOwnProperty(taskName)) {
        return this.executedTask[taskName];
    }
    return null;
};

// function to resolve dependency, it take three arguments
// first argument is taskName, rest two are empty array which after
// execution it will  return ordered data in resolved array
// it also detects the circular dependency
Anachronic.prototype.depResolve = function(taskName,resolved,unresolved){
	var self=this;
	unresolved.push(taskName);
	self.tasks[taskName].dep.forEach(function(edge){
		if (!(resolved.indexOf(edge) > -1)){
			if(unresolved.indexOf(edge) > -1){
				throw new Error('Whoops! there is a circular dependency aborting !!!');
			}
			self.depResolve(edge,resolved,unresolved)
		}
	});
	resolved.push(taskName);
	var index = unresolved.indexOf(taskName);
	// delete unresolved[index];
    unresolved.splice(index, 1);
}

// Call run to execute an added task
Anachronic.prototype.run = function(task) {
    var self = this;
    var taskName = task[0]; //name of the task
    var fn = task.pop();
    // check if task exists
    if ( self.showTask(taskName) != null ){
        var checked = self.checkAlreadyExecuted(taskName);
        if ( checked !== null){
            console.log("Cache Found !!");
            fn.apply(null,[self.tasks[taskName].value,function() {
            }]);
        }
        else {
            // find the dependency for the task
            var sortedArr = [], unresolvedArr=[];
            self.depResolve(taskName,sortedArr,unresolvedArr);
            var sortedArrLen = sortedArr.length;
            var tempCount = 0;
            sortedArr.forEach(function(sTask){
                var checked = self.checkAlreadyExecuted(sTask);
                if ( checked !== null){
                    retVal = checked;
                }
                else {
                    self.runTask(sTask).then(function(data) {
                        tempCount += 1;
                        if( tempCount === sortedArrLen ){
                            console.log("Matched the count");
                            fn.apply(null,[self.tasks[taskName].value,function() {
                            }]);
                        }
                    });
                }
            });
        }
    }
    else{
        // no such task present throw error
        throw new Error('Whoops! no task named '+taskName+' exists !!');
    }
}

// run uses this to execute tasks
Anachronic.prototype.runTask = function(taskName){
    var self = this,retVal;
    var deffered = Q.defer();
    var done = function (err,data) {
        self.executedTask[taskName] = data;
        self.tasks[taskName].value = data;
        deffered.resolve(data);
    }
    if ( self.tasks[taskName].dep.length === 0 ){
        self.tasks[taskName].fn.apply(null,[done]);
    }
    else {
        var applyArgs =[];
        self.tasks[taskName].dep.forEach(function(task){
            applyArgs.push(self.tasks[task].value);
        });
        applyArgs.push(done);
        self.tasks[taskName].fn.apply(null, applyArgs);
    }
    return deffered.promise;
}

Anachronic.prototype.resetTask = function(taskName) {
    var self = this;
    var queriedTask= self.showTask(taskName);
    if ( queriedTask != null){
        console.log("inside");
        // find all dependent task and remove from cache
        var sortedArr = [], unresolvedArr=[];
        self.depResolve(taskName,sortedArr,unresolvedArr);
        sortedArr.forEach(function(t){
            self.tasks[t].applyArgs = [];
            self.tasks[t].value = null;
            delete self.executedTask[t];
        });
    }
    else {
        throw new Error('Whoops! no task named '+taskName+' exists !!');
    }
}

module.exports = Anachronic;
