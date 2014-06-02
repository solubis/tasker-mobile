var TaskListPage = function(){
  browser.get('http://10.0.0.2:63342/todos-mobile/ionic');

  this.list = element.all(by.css('[collection-repeat="task in tasks"]'));
  this.title = element(by.css('[ng-bind-html="title"]'));

};

module.exports = TaskListPage;