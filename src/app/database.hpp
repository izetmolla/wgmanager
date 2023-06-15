
class Database
{

public:
    Database(const std::string &name = "./database.db") : dbName(name), db(nullptr) {}
    ~Database()
    {
        if (db)
        {
            sqlite3_close(db);
            db = nullptr;
        }
    }
    bool connect()
    {
        int rc = sqlite3_open(dbName.c_str(), &db);
        if (rc != SQLITE_OK)
        {
            std::cerr << "Failed to open database: " << sqlite3_errmsg(db) << std::endl;
            sqlite3_close(db);
            return false;
        }
        std::cout << "DB connected" << std::endl;
        return true;
    }
    bool disconnect()
    {
        int rc = sqlite3_close(db);
        if (rc != SQLITE_OK)
        {
            std::cerr << "Failed to close database: " << sqlite3_errmsg(db) << std::endl;
            return false;
        }
        db = nullptr;
        std::cout << "DB disconnected" << std::endl;
        return true;
    }
    int query_insert(std::string sql)
    {
        long long int rowid = 0;
        std::vector<std::string> result;
        int rc = sqlite3_exec(
            db, sql.c_str(), [](void *data, int argc, char **argv, char **col_names) -> int
            { return 0; },
            &result, nullptr);

        if (rc != SQLITE_OK)
        {
            std::cerr << "Error Query Insert database: " << sql.c_str() << " : " << sqlite3_errmsg(db) << std::endl;
        }
        else
        {
            rowid = sqlite3_last_insert_rowid(db);
        }
        return rowid;
    }
    bool query_delete(std::string sql)
    {
        std::vector<std::string> result;
        int rc = sqlite3_exec(
            db, sql.c_str(), [](void *data, int argc, char **argv, char **col_names) -> int
            { return 0; },
            &result, nullptr);

        if (rc != SQLITE_OK)
        {
            std::cerr << "Error Query DElete database: " << sql.c_str() << " : " << sqlite3_errmsg(db) << std::endl;
            return false;
        }
        return true;
    }
    bool query_update(std::string sql)
    {
        std::vector<std::string> result;
        int rc = sqlite3_exec(
            db, sql.c_str(), [](void *data, int argc, char **argv, char **col_names) -> int
            { return 0; },
            &result, nullptr);

        if (rc != SQLITE_OK)
        {
            std::cerr << "Error Query Update database: " << sql.c_str() << " : " << sqlite3_errmsg(db) << std::endl;
            return false;
        }
        return true;
    }
    template <typename T>
    std::vector<T> query(std::string sql)
    {
        std::vector<T> data;
        int rc = sqlite3_exec(
            db, sql.c_str(), [](void *data, int argc, char **argv, char **col_names) -> int
            {
            T model;
            
            auto *vec = static_cast<std::vector<T>*>(data);
            model.set_global_attributes(argv,col_names, argc);
            model.set_attributes(argv,col_names, argc);
            vec->push_back(model);        
            return 0; },
            &data, nullptr);

        if (rc != SQLITE_OK)
        {
            std::cerr << "Error querying database: " << sqlite3_errmsg(db) << std::endl;
        }
        return data;
    }
    int insert_record(std::string table_name, std::vector<std::pair<std::string, std::string>> content)
    {
        return query_insert(utils::jsonToSqliteInsert(table_name, content));
    }
    bool update_record(std::string table_name, std::vector<std::pair<std::string, std::string>> content, std::vector<DbConditionObject> where = {})
    {
        return query_update(utils::jsonToSqliteUpdate(table_name, content, where));
    }
    void migrate(std::string table_name, std::vector<ColumnDbObject> content, MigrateOptions options = {})
    {
        if (options.drop)
        {
            std::string query = "DROP TABLE IF EXISTS " + table_name + ";";
            json aaa = execQuery(query);
        }
        std::string query = jsonToSqliteMigration(table_name, content);
        json aaa = execQuery(query);
    }
    template <typename T>
    T select_record(std::string table_name, const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"*"}, std::string other = "")
    {
        T m;
        auto content = query<T>(createSelectSqlQuery(table_name, conditions, utils::strVectorToString(select), other + ""));
        if (content.size() == 0)
            return m;
        m = content[0];
        return m;
    }
    template <typename T>
    auto select_records(std::string table_name, const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"*"}, std::string other = "")
    {
        return query<T>(createSelectSqlQuery(table_name, conditions, utils::strVectorToString(select), other + ""));
    }

private:
    sqlite3 *db;
    std::string dbName = configEnv.db_path;

    json execQuery(const std::string &query)
    {
        json res;
        json result;
        char *errmsg;

        int rc = sqlite3_exec(
            db, query.c_str(), [](void *data, int argc, char **argv, char **colnames) -> int
            {
            json* result = static_cast<json*>(data);
            json row;
            for (int i = 0; i < argc; i++) {
                row[colnames[i]] = argv[i];
            }
            result->push_back(row);
            return 0; },
            &result, &errmsg);

        if (rc != SQLITE_OK)
        {
            res["status"] = 0;
            res["last_id"] = nullptr;
            res["data"] = nullptr;
            res["error"] = sqlite3_errmsg(db);
            return res;
        }
        long long int rowid = sqlite3_last_insert_rowid(db);
        res["status"] = 1;
        res["last_id"] = std::to_string(rowid);
        res["data"] = result;
        res["error"] = nullptr;
        return res;
    }
};
Database database;