
class Model
{
public:
    std::string created_at = ""; // TEXT NOT NULL
    std::string updated_at = "";

    virtual void set_attributes(char **argv, char **col_names, int colnr) = 0;

    bool update(int id, std::vector<std::pair<std::string, std::string>> content)
    {
        return database.update_record(table_name, content, {{"id", "=", std::to_string(id)}});
    }
    void set_table_name(const std::string &name)
    {
        table_name = name;
    }

    void set_global_attributes(char **argv, char **col_names, int colnr)
    {
        for (size_t i = 0; i < colnr; i++)
            setAtrValue(col_names[i], argv[i]);
    }

    template <typename T>
    std::vector<T> findAll()
    {
        return database.query<T>("select * from " + table_name);
    }

    template <typename T>
    T find(int id, std::vector<std::string> select = {"*"})
    {
        T model;
        auto content = database.query<T>("select " + utils::strVectorToString(select) + " from " + table_name + " where id like '" + std::to_string(id) + "'");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }

    template <typename T>
    T findByID(int id, std::vector<std::string> select = {"*"})
    {
        T model;
        auto content = database.query<T>("select " + utils::strVectorToString(select) + " from " + table_name + " where id like '" + std::to_string(id) + "'");
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }

    template <typename T>
    auto where(const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"*"}, std::string oq = "")
    {
        T model;
        std::string query = utils::createSelectSqlQuery(table_name, conditions, utils::strVectorToString(select), " " + oq);
        auto content = database.query<T>(query);
        return content;
    }

    template <typename T>
    auto getOne(const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"*"}, std::string oq = "")
    {
        T model;
        std::string query = utils::createSelectSqlQuery(table_name, conditions, utils::strVectorToString(select), " " + oq);
        auto content = database.query<T>(query);
        if (content.size() > 0)
            return content[0];
        else
            return model;
    }

    bool deleteByID(int id)
    {
        return database.query_delete("DELETE FROM " + table_name + " WHERE id='" + std::to_string(id) + "'");
    }

    bool deleteBy(const std::vector<DbConditionObject> conditions)
    {
        return database.query_delete(utils::createDeleteSqlQuery(table_name, conditions));
    }

    int insert(std::vector<std::pair<std::string, std::string>> content)
    {
        std::string query = "INSERT INTO " + table_name + " (";
        std::string values = "VALUES (";
        for (const auto &item : content)
        {
            query += item.first + ",";
            values += "'" + item.second + "',";
        }
        query.pop_back(); // Remove the trailing comma
        values.pop_back();
        query += ") ";
        values += ");";
        query += values;
        return database.query_insert(query);
    }

    template <typename T>
    int count(const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"id"}, std::string other = "")
    {
        auto countedObj = database.query<T>(utils::createCountSqlQuery(table_name, conditions, utils::strVectorToString(select)));
        return countedObj[0].count_nr;
    }
    template <typename T>
    bool exist(const std::vector<DbConditionObject> conditions, std::vector<std::string> select = {"id"}, std::string other = "")
    {
        return count<T>(conditions, select, other) > 0;
    }

private:
    std::string table_name = "";
    std::string error_message = "";
    int count_nr = 0;
    void setAtrValue(std::string col, std::string value)
    {
        if (col == "count_nr")
            count_nr = std::stoi(value);
    }
};

#include "../models/Option.hpp"
#include "../models/User.hpp"
#include "../models/RefreshToken.hpp"
#include "../models/Role.hpp"
#include "../models/Client.hpp"
#include "../models/IpAddress.hpp"
#include "../models/SessionToken.hpp"
