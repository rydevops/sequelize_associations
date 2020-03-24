const Sequelize = require("sequelize")


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'people.db', 
    logging: false
})

class Person extends Sequelize.Model {}
Person.init({
    PersonID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
},{sequelize})

class Task extends Sequelize.Model {}
Task.init({
    TaskID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Description: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    PersonID: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, { 
    sequelize,
    modelName: "Tasks",
    freezeTableName: true,
})
// Disable primary key (to show associates work without true referential integrity)
Task.removeAttribute('id') 

// associations
Person.hasMany(Task, {
    foreignKey: "PersonID", // Foreign key in target (Task)
    sourceKey: "PersonID",  // Source key in source (Person)
    as: "Tasks"             // Relabels the getter to getTasks()
})
Task.belongsTo(Person, {
    foreignKey: "PersonID",
    targetKey: "PersonID",
    as: "Person"
})

// Person.bulkCreate([
//     {Name: "Jim Brown"},
//     {Name: "Larry Suites"},
//     {Name: "Julian Roberts"}
// ]).then(records => {
//     if (records) {
//         console.log("People created")
//     }

//     let tasks = [
//         {TaskID: 1, Description: "Task 1", PersonID: records[0].PersonID},
//         {TaskID: 2, Description: "Task 2", PersonID: records[0].PersonID},
//         {TaskID: 3, Description: "Task 3", PersonID: records[0].PersonID},
//         {TaskID: 4, Description: "Task 4", PersonID: records[1].PersonID},
//         {TaskID: 5, Description: "Task 5", PersonID: records[1].PersonID},
//         {TaskID: 6, Description: "Task 6", PersonID: records[1].PersonID},
//         {TaskID: 7, Description: "Task 7", PersonID: records[2].PersonID},
//         {TaskID: 8, Description: "Task 8", PersonID: records[2].PersonID},
//         {TaskID: 9, Description: "Task 9", PersonID: records[2].PersonID}
//     ]
//     return Task.bulkCreate(tasks)
// }).then(records => {
//     if (records) {
//         console.log("Tasks created")
//     }

console.log("Find a person and their associated tasks")
Person.findOne({
    where: {
        Name: "Jim Brown"
    }
}).then(person => {
    console.log(`Person: ${person.Name}`)
    return person.getTasks()
}).then(tasks => {
    if (tasks) {
        tasks.forEach(task => {
            console.log("\t", task.TaskID,'-',task.Description,'-', task.PersonID)
        })
    }

    console.log("\n\nFinding task and then associated person...")
    return Task.findOne({
        where: {
            TaskID: 7
        }
    })
}).then(task => {
    console.log(task.TaskID,'-',task.Description,'-', task.PersonID)
    return task.getPerson()
}).then(person => {
    console.log(`Person: ${person.Name}`)
}).catch(error => {
    console.log(error)
})
