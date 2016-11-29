exports.up = function(knex, Promise) {

    return Promise.all([

        knex.schema.createTable('messages', function(table) {
            table.increments('mid').primary();
            table.string('username');
            table.string('message');
            table.timestamps();
        })

    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('messages'),
    ])
};