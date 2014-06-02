var TaskListPage = require('./tasks.po.js');

describe('tasks homepage', function() {
    it('should display Tasks List page', function() {
        var page = new TaskListPage();

        expect(page.title.getText()).toEqual('Task List');
    });

    describe('todo list', function() {
        var page;

        beforeEach(function() {
            page = new TaskListPage();
        });

        it('should list todos', function() {
            expect(page.list.count()).toBeGreaterThan(10);
            expect(page.list.get(0).getText()).toEqual('build an angular app');
        });

        xit('should add a todo', function() {
            var addTodo = element(by.model('todoText'));
            var addButton = element(by.css('[value="add"]'));

            addTodo.sendKeys('write a protractor test');
            addButton.click();

            expect(todoList.count()).toEqual(3);
            expect(todoList.get(2).getText()).toEqual('write a protractor test');
        });
    });
});